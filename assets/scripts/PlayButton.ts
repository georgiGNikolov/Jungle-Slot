import { _decorator, Component, Button, Sprite, UIOpacity, Color, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass('PlayButton')
export class PlayButton extends Component {
    private _btn: Button;
    private _sprite: Sprite;
    private _uiOpacity: UIOpacity;

    onLoad() {
        this._btn = this.getComponent(Button);
        this._sprite = this.getComponent(Sprite);
        this._uiOpacity = this.getComponent(UIOpacity) || this.addComponent(UIOpacity);
    }

    public setEnabled(enabled: boolean) {
        this._btn.interactable = enabled;

        if (enabled) {
            this._sprite.color = Color.WHITE;
            this._uiOpacity.opacity = 255;
        } else {
            const transitionTime = this._btn.duration || 0.1;
            this.scheduleOnce(() => {
                this._sprite.color = new Color(180, 180, 180, 255);
                this._uiOpacity.opacity = 150;
            }, transitionTime);
        }
    }

    public hide() {
        this.node.active = false;
    }
}
