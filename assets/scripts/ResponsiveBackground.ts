import { _decorator, Component, UITransform, view, screen } from 'cc';

const { ccclass } = _decorator;

@ccclass('ResponsiveBackground')
export class ResponsiveBackground extends Component {
    private nativeW = 1280;
    private nativeH = 720;

    onLoad() {
        const ui = this.getComponent(UITransform);
        if (ui) {
            this.nativeW = ui.width;
            this.nativeH = ui.height;
        }
        this.applyCoverScale();
        screen.on('window-resize', this.applyCoverScale, this);
        screen.on('orientation-change', this.applyCoverScale, this);
    }

    onDestroy() {
        screen.off('window-resize', this.applyCoverScale, this);
        screen.off('orientation-change', this.applyCoverScale, this);
    }

    private applyCoverScale() {
        const visible = view.getVisibleSize();
        const scale = Math.max(visible.width / this.nativeW, visible.height / this.nativeH);
        this.node.setScale(scale, scale, 1);
    }
}
