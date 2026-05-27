import {
    _decorator,
    CCFloat,
    CCInteger,
    Component,
    Label,
    Node,
    tween,
    Vec3,
    Tween,
} from 'cc';

const { ccclass, property } = _decorator;

export type WinLineData = {
    lineNumber: number;
    winAmount: number;
    nodes: Node[];
};

@ccclass('WinLines')
export class WinLines extends Component {

    @property({ type: Node })
    winLinesRoot: Node = null!;

    @property({ type: Label })
    perLineLabelMiddle: Label | null = null;   // lines 1, 6, 7

    @property({ type: Label })
    perLineLabelTop: Label | null = null;      // lines 2, 5, 8

    @property({ type: Label })
    perLineLabelBottom: Label | null = null;   // lines 3, 4, 9, 10

    @property({ type: Label })
    totalWinLabel: Label | null = null;

    @property({ type: CCInteger })
    lineDisplayTime = 2000;

    @property({ type: CCInteger })
    delayBetweenLines = 300;

    @property({ type: CCFloat })
    symbolScale = 1.15;

    @property({ type: CCFloat })
    bounceDuration = 0.5;

    private static readonly LINE_TO_POSITION: Record<number, 'middle' | 'top' | 'bottom'> = {
        1: 'middle', 6: 'middle', 7: 'middle',
        2: 'top', 5: 'top', 8: 'top',
        3: 'bottom', 4: 'bottom', 9: 'bottom', 10: 'bottom',
    };

    private restScales: Map<Label, Vec3> = new Map();
    public displayedTotal = 0;
    private lastShownTotal = -1;

    private playing = false;

    onLoad() {
        this.hideAllLines();
        for (const label of this.allPerLineLabels()) {
            this.restScales.set(label, label.node.scale.clone());
            label.node.active = false;
        }
    }

    public async playWinLines(winLines: WinLineData[]) {

        if (this.playing) {
            return;
        }

        this.playing = true;

        this.snapTotalTo(0);
        let runningTotal = 0;

        for (let i = 0; i < winLines.length; i++) {
            const line = winLines[i];

            this.hideAllLines();
            this.hideAllPerLineLabels();

            if (i > 0) {
                await this.delay(this.delayBetweenLines);
            }

            const lineNode = this.winLinesRoot.getChildByName(
                line.lineNumber.toString()
            );

            if (lineNode) {
                lineNode.active = true;
            }

            this.showPerLineLabel(this.getLabelForLine(line.lineNumber), line.winAmount);
            this.playSymbolBounce(line.nodes);

            runningTotal += line.winAmount;
            this.tweenTotalTo(runningTotal, this.lineDisplayTime / 1000);

            await this.delay(this.lineDisplayTime);

            this.hideAllPerLineLabels();
        }

        this.hideAllLines();
        this.hideAllPerLineLabels();

        this.playing = false;
    }

    public resetTotal() {
        this.snapTotalTo(0);
    }

    private tweenTotalTo(target: number, durationSec: number) {
        Tween.stopAllByTarget(this);
        tween(this)
            .to(durationSec, { displayedTotal: target } as Partial<this>, { easing: 'linear' })
            .start();
    }

    private snapTotalTo(value: number) {
        Tween.stopAllByTarget(this);
        this.displayedTotal = value;
        this.lastShownTotal = value;
        if (this.totalWinLabel) {
            this.totalWinLabel.string = value > 0 ? `WIN: ${value}` : "WIN:";
        }
    }

    update() {
        if (!this.totalWinLabel) return;
        const shown = Math.floor(this.displayedTotal);
        if (shown === this.lastShownTotal) return;
        this.lastShownTotal = shown;
        this.totalWinLabel.string = shown > 0 ? `WIN: ${shown}` : "WIN:";
    }

    private playSymbolBounce(nodes: Node[]) {

        for (const node of nodes) {

            Tween.stopAllByTarget(node);

            const originalScale = node.scale.clone();

            const enlarged = new Vec3(
                originalScale.x * this.symbolScale,
                originalScale.y * this.symbolScale,
                originalScale.z
            );

            tween(node)
                .to(
                    this.bounceDuration,
                    { scale: enlarged },
                    { easing: 'sineOut' }
                )
                .to(
                    this.bounceDuration,
                    { scale: originalScale },
                    { easing: 'backOut' }
                )
                .start();
        }
    }

    public hideAllLines() {

        for (const child of this.winLinesRoot.children) {
            child.active = false;
        }
    }

    private allPerLineLabels(): Label[] {
        return [
            this.perLineLabelMiddle,
            this.perLineLabelTop,
            this.perLineLabelBottom,
        ].filter((l): l is Label => l !== null);
    }

    private getLabelForLine(lineNumber: number): Label | null {
        const pos = WinLines.LINE_TO_POSITION[lineNumber];
        if (pos === 'middle') return this.perLineLabelMiddle;
        if (pos === 'top') return this.perLineLabelTop;
        if (pos === 'bottom') return this.perLineLabelBottom;
        return null;
    }

    private showPerLineLabel(label: Label | null, amount: number) {
        if (!label) return;
        const restScale = this.restScales.get(label);
        if (!restScale) return;

        label.string = `${amount}`;
        Tween.stopAllByTarget(label.node);
        label.node.active = true;

        label.node.setScale(
            restScale.x * 0.3,
            restScale.y * 0.3,
            restScale.z,
        );

        tween(label.node)
            .to(
                0.35,
                { scale: new Vec3(restScale.x, restScale.y, restScale.z) },
                { easing: 'backOut' },
            )
            .start();
    }

    private hideAllPerLineLabels() {
        for (const label of this.allPerLineLabels()) {
            Tween.stopAllByTarget(label.node);
            label.node.active = false;
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
}
