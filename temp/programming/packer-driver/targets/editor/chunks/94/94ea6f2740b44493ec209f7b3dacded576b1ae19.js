System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, UITransform, view, screen, _dec, _class, _crd, ccclass, ResponsiveBackground;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      UITransform = _cc.UITransform;
      view = _cc.view;
      screen = _cc.screen;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2b2e5uuPbdEsJpHgU5OI8C5", "ResponsiveBackground", undefined);

      __checkObsolete__(['_decorator', 'Component', 'UITransform', 'view', 'screen']);

      ({
        ccclass
      } = _decorator);

      _export("ResponsiveBackground", ResponsiveBackground = (_dec = ccclass('ResponsiveBackground'), _dec(_class = class ResponsiveBackground extends Component {
        constructor(...args) {
          super(...args);
          this.nativeW = 1280;
          this.nativeH = 720;
        }

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

        applyCoverScale() {
          const visible = view.getVisibleSize();
          const scale = Math.max(visible.width / this.nativeW, visible.height / this.nativeH);
          this.node.setScale(scale, scale, 1);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=94ea6f2740b44493ec209f7b3dacded576b1ae19.js.map