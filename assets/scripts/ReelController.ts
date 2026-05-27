import {
    _decorator, CCFloat, CCInteger, Component, Node, Vec3, tween, Sprite, SpriteFrame
} from 'cc';

const { ccclass, property } = _decorator;

const LIFT_UP_DISTANCE_PX = 35;
const THUNK_DIP_PX = 12;
const DEFAULT_SYMBOL_HEIGHT_PX = 175;
const SPIN_DOWN_CELLS = 5;

const DEFAULT_STRIP: ReadonlyArray<number> = [
    5, 9, 2, 6, 3, 7, 0, 4, 8, 9,
    1, 5, 2, 6, 7, 3, 8, 4, 9, 5,
    1, 6, 2, 7, 3, 8, 4, 9, 0, 5,
];


export enum ReelState {
    Idle = 'idle',
    Lifting = 'lifting',
    Spinning = 'spinning',
    Stopping = 'stopping',
}

type ReelInfo = {
    symbolHeight: number;
    baseY: number;
    centerIdx: number;
    children: Node[];

    scrollPx: number;
    speed: number;
    strip: number[];
    pinnedSymbols: Map<number, number>;
    state: ReelState;
};

@ccclass('ReelController')
export class ReelController extends Component {
    @property({ type: CCFloat })
    reelSpeed = 3000;

    @property({ type: CCInteger })
    stopGapMs = 450;

    @property({ type: CCInteger })
    minSpinTime = 2000;

    @property({ type: CCFloat })
    liftUpDurationSec = 0.1;

    @property({ type: CCFloat })
    stopDurationSec = 0.3;

    @property({ type: CCFloat })
    thunkDipDurationSec = 0.06;

    @property({ type: CCFloat })
    thunkReturnDurationSec = 0.12;

    @property({ type: [SpriteFrame] })
    symbols: SpriteFrame[] = [];

    private static readonly PAYLINE_ROWS = 3;
    private cells: Node[][] = [];

    public getCellByIndex(index: number): Node | null {
        const col = Math.floor(index / ReelController.PAYLINE_ROWS);
        const row = index % ReelController.PAYLINE_ROWS;
        return this.cells[col]?.[row] ?? null;
    }

    private reelInfos: Map<Node, ReelInfo> = new Map();
    private reels: Node[] = [];
    private spinning = false;
    private spinStartTime = 0;

    onLoad() {
        this.node.children.forEach((reelNode, col) => {
            this.normalizeReelColumn(reelNode, col);
            this.reels.push(reelNode);
        });
        this.rebuildPublicCells();

        for (const reelNode of this.reels) {
            this.applyScroll(this.reelInfos.get(reelNode)!);
        }
    }

    public async startSpin() {
        if (this.spinning) return;
        this.spinning = true;
        this.spinStartTime = performance.now();

        for (const reelNode of this.reels) {
            const info = this.reelInfos.get(reelNode)!;
            info.state = ReelState.Lifting;
            await this.playLiftUpAnimation(reelNode);
            info.state = ReelState.Spinning;
        }
    }

    public async stopSpin(result: number[][]): Promise<void> {
        if (!this.spinning) return;

        const elapsed = performance.now() - this.spinStartTime;
        if (elapsed < this.minSpinTime) {
            await this.delay(this.minSpinTime - elapsed);
        }

        for (let col = 0; col < this.reels.length; col++) {
            await this.stopReel(this.reels[col], result[col], this.stopDurationSec);
            if (col < this.reels.length - 1) {
                await this.delay(this.stopGapMs);
            }
        }

        this.spinning = false;
        this.rebuildPublicCells();
    }

    public applyGridImages(columnGrid: number[][]) {
        this.reels.forEach((reelNode, col) => {
            const info = this.reelInfos.get(reelNode)!;
            const cellsScrolled = info.scrollPx / info.symbolHeight;
            const topSlot = -Math.floor(cellsScrolled);
            for (let k = 0; k < columnGrid[col].length; k++) {
                info.pinnedSymbols.set(topSlot + k, columnGrid[col][k]);
            }
            this.applyScroll(info);
        });
        this.rebuildPublicCells();
    }

    private rebuildPublicCells() {
        this.cells = this.reels.map(reel => {
            const info = this.reelInfos.get(reel);
            if (!info) return [];
            const m = info.centerIdx;
            return [info.children[m - 1], info.children[m], info.children[m + 1]];
        });
    }

    private async stopReel(reelNode: Node, resultIcons: number[], duration: number): Promise<void> {
        const info = this.reelInfos.get(reelNode);
        if (!info) return;
        info.scrollPx += info.speed * (1 / 60);

        const currentCells = info.scrollPx / info.symbolHeight;
        const endCells = Math.ceil(currentCells) + SPIN_DOWN_CELLS;
        const endScrollPx = endCells * info.symbolHeight;
        const endTopSlot = -endCells;

        for (let k = 0; k < resultIcons.length; k++) {
            info.pinnedSymbols.set(endTopSlot + k, resultIcons[k]);
        }

        info.state = ReelState.Stopping;
        await new Promise<void>(resolve => {
            tween(info)
                .to(duration, { scrollPx: endScrollPx }, { easing: 'cubicOut' })
                .call(() => {
                    info.scrollPx = endScrollPx;
                    this.applyScroll(info);
                    this.playThunk(reelNode, () => {
                        info.state = ReelState.Idle;
                        this.prunePinned(info);
                        resolve();
                    });
                })
                .start();
        });
    }

    private playThunk(reelNode: Node, onComplete: () => void) {
        const x = reelNode.position.x;
        const z = reelNode.position.z;
        const restY = reelNode.position.y;
        const dipY = restY - THUNK_DIP_PX;
        tween(reelNode)
            .to(this.thunkDipDurationSec, { position: new Vec3(x, dipY, z) }, { easing: 'quadIn' })
            .to(this.thunkReturnDurationSec, { position: new Vec3(x, restY, z) }, { easing: 'quadOut' })
            .call(onComplete)
            .start();
    }

    update(dt: number) {
        if (!this.spinning) return;
        for (const reelNode of this.reels) {
            const info = this.reelInfos.get(reelNode);
            if (!info) continue;
            if (info.state === ReelState.Spinning) info.scrollPx += info.speed * dt;
            if (info.state === ReelState.Spinning || info.state === ReelState.Stopping) this.applyScroll(info);
        }
    }

    private applyScroll(reel: ReelInfo) {
        const cellsScrolled = reel.scrollPx / reel.symbolHeight;
        const wholeCells = Math.floor(cellsScrolled);
        const frac = cellsScrolled - wholeCells;
        const topSlot = -wholeCells;

        for (let k = 0; k < reel.children.length; k++) {
            const cell = reel.children[k];
            const y = reel.baseY + (reel.centerIdx - k) * reel.symbolHeight - frac * reel.symbolHeight;
            cell.setPosition(cell.position.x, y, cell.position.z);

            const sym = this.symbolAtSlot(reel, topSlot + k);
            const frame = this.symbols[sym];
            const sprite = cell.getComponent(Sprite)!;
            if (frame && sprite.spriteFrame !== frame) sprite.spriteFrame = frame;
        }
    }

    private symbolAtSlot(reel: ReelInfo, slot: number): number {
        const pin = reel.pinnedSymbols.get(slot);
        if (pin !== undefined) return pin;
        const len = reel.strip.length;
        return reel.strip[((slot % len) + len) % len];
    }

    private prunePinned(reel: ReelInfo) {
        const cellsScrolled = reel.scrollPx / reel.symbolHeight;
        const topSlot = -Math.floor(cellsScrolled);
        const keepMin = topSlot - 2;
        const keepMax = topSlot + reel.children.length + 2;
        for (const slot of reel.pinnedSymbols.keys()) {
            if (slot < keepMin || slot > keepMax) reel.pinnedSymbols.delete(slot);
        }
    }

    private async playLiftUpAnimation(reelNode: Node): Promise<void> {
        const info = this.reelInfos.get(reelNode);
        if (!info) return;

        await Promise.all(info.children.map(c => new Promise<void>(resolve => {
            const upPos = c.position.clone();
            upPos.y += LIFT_UP_DISTANCE_PX;
            tween(c)
                .to(this.liftUpDurationSec, { position: upPos }, { easing: 'sineOut' })
                .call(() => resolve())
                .start();
        })));
    }

    private normalizeReelColumn(reelNode: Node, col: number) {
        const children = this.sortTopDown(reelNode);
        const symbolHeight = Math.abs(children[0].position.y - children[1].position.y) || DEFAULT_SYMBOL_HEIGHT_PX;
        const centerIdx = Math.floor(children.length / 2);
        const baseY = children[centerIdx].position.y;
        children.forEach((child, i) => {
            const targetY = baseY + (centerIdx - i) * symbolHeight;
            child.setPosition(new Vec3(child.position.x, targetY, child.position.z));
        });

        const offset = (col * 7) % DEFAULT_STRIP.length;
        const strip = DEFAULT_STRIP.slice(offset).concat(DEFAULT_STRIP.slice(0, offset));

        this.reelInfos.set(reelNode, {
            symbolHeight, baseY, centerIdx, children,
            scrollPx: 0,
            speed: this.reelSpeed,
            strip,
            pinnedSymbols: new Map(),
            state: ReelState.Idle,
        });
    }

    private sortTopDown(node: Node): Node[] {
        return node.children.slice().sort((a, b) => b.position.y - a.position.y);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms));
    }
}
