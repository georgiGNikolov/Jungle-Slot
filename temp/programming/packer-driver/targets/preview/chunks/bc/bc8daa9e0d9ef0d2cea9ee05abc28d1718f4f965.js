System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Graphics, Animation, UITransform, ReelController2, _dec, _class, _crd, ccclass, WinEffectController;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
        constructor() {
          super(...arguments);
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

        drawWinningReelsBordersAndAnimate(winIndexes, color, lineNumber) {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (!_this.reelController) return;

            var _loop = function* _loop() {
              var _this$reelController$;

              var col = Math.floor(idx / 3);
              var row = idx % 3;
              var reelNode = (_this$reelController$ = _this.reelController.cells[col]) == null ? void 0 : _this$reelController$[row];
              if (!reelNode) return 0; // continue

              var graphicsNode = reelNode.getChildByName("Graphics");
              if (!graphicsNode) return 0; // continue

              var ctx = graphicsNode.getComponent(Graphics);
              var anim = reelNode.getComponent(Animation);
              var uiTransform = reelNode.getComponent(UITransform);
              if (!ctx || !uiTransform) return 0; // continue

              var size = uiTransform.contentSize;
              var left = -size.width / 2;
              var bottom = -size.height / 2;
              ctx.strokeColor = color;
              ctx.rect(left + lineNumber, bottom + lineNumber, size.width - lineNumber * 2, size.height - lineNumber * 2);
              ctx.stroke();

              if (anim) {
                anim.play();
                yield new Promise(resolve => {
                  anim.once(Animation.EventType.FINISHED, () => resolve());
                });
              }
            },
                _ret;

            for (var idx of winIndexes) {
              _ret = yield* _loop();
              if (_ret === 0) continue;
            }
          })();
        }

        clearReelsBorders() {
          if (!this.reelController) return;

          for (var colCells of this.reelController.cells) {
            for (var cell of colCells) {
              var _graphicsNode$getComp;

              var graphicsNode = cell.getChildByName("Graphics");
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