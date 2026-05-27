import { _decorator, Component, Node, view, ResolutionPolicy, screen } from 'cc';
import { MockApi, InitData, PlayData } from './MockApi';

import { PlayButton } from './PlayButton';
import { ReelController } from './ReelController';
import { WinLines } from './WinLines';
import { installDebugCheats } from './DebugCheats';


const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    private static readonly DESIGN_W = 1280;
    private static readonly DESIGN_H = 720;

    @property({ type: PlayButton })
    playButton: PlayButton = null!;

    @property({ type: ReelController })
    reelController: ReelController = null!;

    @property({ type: WinLines })
    winLines: WinLines = null!;

    private isLoading = false;

    onLoad() {
        this.applyResponsiveResolution();
        screen.on('window-resize', this.applyResponsiveResolution, this);
        screen.on('orientation-change', this.applyResponsiveResolution, this);

        MockApi.onInitData(this.handleInitResponse.bind(this));
        MockApi.onPlayResponse(this.handlePlayResponse.bind(this));
        MockApi.init();

        installDebugCheats();
    }

    async onPlayPressed() {

        if (this.isLoading) return;
        this.isLoading = true;

        this.playButton.setEnabled(false);
        this.winLines.hideAllLines();
        this.winLines.resetTotal();
        this.reelController.startSpin();
        MockApi.play();
    }


    handleInitResponse(data: InitData) {
        console.log("Init received:", data);
        this.reelController.applyGridImages(data.defaultReels);
    }

    async handlePlayResponse(data: PlayData) {
        console.log("Play received:", data);

        await this.reelController.stopSpin(data.reels);

        const linesWithNodes = data.winLines.map(line => ({
            lineNumber: line.lineNumber,
            winAmount: line.winAmount,
            nodes: line.winIndexes
                .map(idx => this.reelController.getCellByIndex(idx))
                .filter((n): n is Node => n !== null),
        }));

        await this.winLines.playWinLines(linesWithNodes);

        this.isLoading = false;
        this.playButton.setEnabled(true);
    }

    onDestroy() {
        screen.off('window-resize', this.applyResponsiveResolution, this);
        screen.off('orientation-change', this.applyResponsiveResolution, this);
    }

    private applyResponsiveResolution() {
        const w = screen.windowSize.width;
        const h = screen.windowSize.height;
        const policy = (w / h) >= (Main.DESIGN_W / Main.DESIGN_H)
            ? ResolutionPolicy.FIXED_HEIGHT
            : ResolutionPolicy.FIXED_WIDTH;
        view.setDesignResolutionSize(Main.DESIGN_W, Main.DESIGN_H, policy);
    }
}
