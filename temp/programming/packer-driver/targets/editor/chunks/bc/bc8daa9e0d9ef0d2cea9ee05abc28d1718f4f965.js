System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Graphics, Animation, UITransform, ReelController2, _dec, _class, _crd, ccclass, WinEffectController;

  function _reportPossibleCrUseOfReelController(extras) {
    _reporterNs.report("ReelController2", "./ReelController2", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Graphics = _cc.Graphics;
      Animation = _cc.Animation;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      ReelController2 = _unresolved_2.ReelController2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2db218nxR1EkLc7ykdjCMAM", "WinEffectController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Graphics', 'Animation', 'UITransform', 'Color']);

      ({
        ccclass
      } = _decorator);

      _export("WinEffectController", WinEffectController = (_dec = ccclass('WinEffectController'), _dec(_class = class WinEffectController extends Component {
        constructor(...args) {
          super(...args);
          this.reelController = null;
        }

        onLoad() {
          this.reelController = this.getComponent(_crd && ReelController2 === void 0 ? (_reportPossibleCrUseOfReelController({
            error: Error()
          }), ReelController2) : ReelController2);

          if (!this.reelController) {
            console.warn("[WinEffectController] ReelController not found on same node.");
          }
        }

        async drawWinningReelsBordersAndAnimate(winIndexes, color, lineNumber) {
          if (!this.reelController) return;

          for (const idx of winIndexes) {
            var _this$reelController$;

            const col = Math.floor(idx / 3);
            const row = idx % 3;
            const reelNode = (_this$reelController$ = this.reelController.cells[col]) == null ? void 0 : _this$reelController$[row];
            if (!reelNode) continue;
            const graphicsNode = reelNode.getChildByName("Graphics");
            if (!graphicsNode) continue;
            const ctx = graphicsNode.getComponent(Graphics);
            const anim = reelNode.getComponent(Animation);
            const uiTransform = reelNode.getComponent(UITransform);
            if (!ctx || !uiTransform) continue;
            const size = uiTransform.contentSize;
            const left = -size.width / 2;
            const bottom = -size.height / 2;
            ctx.strokeColor = color;
            ctx.rect(left + lineNumber, bottom + lineNumber, size.width - lineNumber * 2, size.height - lineNumber * 2);
            ctx.stroke();

            if (anim) {
              anim.play();
              await new Promise(resolve => {
                anim.once(Animation.EventType.FINISHED, () => resolve());
              });
            }
          }
        }

        clearReelsBorders() {
          if (!this.reelController) return;

          for (const colCells of this.reelController.cells) {
            for (const cell of colCells) {
              var _graphicsNode$getComp;

              const graphicsNode = cell.getChildByName("Graphics");
              if (!graphicsNode) continue;
              (_graphicsNode$getComp = graphicsNode.getComponent(Graphics)) == null || _graphicsNode$getComp.clear();
            }
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=bc8daa9e0d9ef0d2cea9ee05abc28d1718f4f965.js.map