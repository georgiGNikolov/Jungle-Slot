System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Button, Sprite, UIOpacity, Color, _dec, _class, _crd, ccclass, PlayButton;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Button = _cc.Button;
      Sprite = _cc.Sprite;
      UIOpacity = _cc.UIOpacity;
      Color = _cc.Color;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c750cDbWvJNabEScCQyfLZA", "PlayButton", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Button', 'Sprite', 'UIOpacity', 'Color', 'Node']);

      ({
        ccclass
      } = _decorator);

      _export("PlayButton", PlayButton = (_dec = ccclass('PlayButton'), _dec(_class = class PlayButton extends Component {
        constructor(...args) {
          super(...args);
          this._btn = void 0;
          this._sprite = void 0;
          this._uiOpacity = void 0;
        }

        onLoad() {
          this._btn = this.getComponent(Button);
          this._sprite = this.getComponent(Sprite);
          this._uiOpacity = this.getComponent(UIOpacity) || this.addComponent(UIOpacity);
        }

        setEnabled(enabled) {
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

        hide() {
          this.node.active = false;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b135fec0fb7cd1152dc61844ce2e0c1db5b03350.js.map