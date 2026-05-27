System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Component, Label, Node, tween, Vec3, Tween, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _class3, _crd, ccclass, property, WinLines;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Component = _cc.Component;
      Label = _cc.Label;
      Node = _cc.Node;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      Tween = _cc.Tween;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "704fcUYjPBESrwmEvyQNRAK", "WinLines", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'Component', 'Label', 'Node', 'tween', 'Vec3', 'Tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("WinLines", WinLines = (_dec = ccclass('WinLines'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Label
      }), _dec4 = property({
        type: Label
      }), _dec5 = property({
        type: Label
      }), _dec6 = property({
        type: Label
      }), _dec7 = property({
        type: CCInteger
      }), _dec8 = property({
        type: CCInteger
      }), _dec9 = property({
        type: CCFloat
      }), _dec10 = property({
        type: CCFloat
      }), _dec(_class = (_class2 = (_class3 = class WinLines extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "winLinesRoot", _descriptor, this);

          _initializerDefineProperty(this, "perLineLabelMiddle", _descriptor2, this);

          // lines 1, 6, 7
          _initializerDefineProperty(this, "perLineLabelTop", _descriptor3, this);

          // lines 2, 5, 8
          _initializerDefineProperty(this, "perLineLabelBottom", _descriptor4, this);

          // lines 3, 4, 9, 10
          _initializerDefineProperty(this, "totalWinLabel", _descriptor5, this);

          _initializerDefineProperty(this, "lineDisplayTime", _descriptor6, this);

          _initializerDefineProperty(this, "delayBetweenLines", _descriptor7, this);

          _initializerDefineProperty(this, "symbolScale", _descriptor8, this);

          _initializerDefineProperty(this, "bounceDuration", _descriptor9, this);

          // Cache each label's editor-set scale so the pop-in tween returns to it exactly.
          this.restScales = new Map();
          // Running total counter — tweened during playWinLines, synced to totalWinLabel in update().
          // Public because Cocos's tween typing only sees public properties through its
          // ConstructorType<T> constraint. Treat as internal: only WinLines mutates it.
          this.displayedTotal = 0;
          this.lastShownTotal = -1;
          this.playing = false;
        }

        onLoad() {
          this.hideAllLines();

          for (const label of this.allPerLineLabels()) {
            this.restScales.set(label, label.node.scale.clone());
            label.node.active = false;
          }
        }

        async playWinLines(winLines) {
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

            const lineNode = this.winLinesRoot.getChildByName(line.lineNumber.toString());

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
        /** Snap the total label back to 0. Called by Main at the start of each new spin. */


        resetTotal() {
          this.snapTotalTo(0);
        }

        tweenTotalTo(target, durationSec) {
          Tween.stopAllByTarget(this);
          tween(this).to(durationSec, {
            displayedTotal: target
          }, {
            easing: 'linear'
          }).start();
        }

        snapTotalTo(value) {
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

        playSymbolBounce(nodes) {
          for (const node of nodes) {
            Tween.stopAllByTarget(node);
            const originalScale = node.scale.clone();
            const enlarged = new Vec3(originalScale.x * this.symbolScale, originalScale.y * this.symbolScale, originalScale.z);
            tween(node).to(this.bounceDuration, {
              scale: enlarged
            }, {
              easing: 'sineOut'
            }).to(this.bounceDuration, {
              scale: originalScale
            }, {
              easing: 'backOut'
            }).start();
          }
        }

        hideAllLines() {
          for (const child of this.winLinesRoot.children) {
            child.active = false;
          }
        }

        allPerLineLabels() {
          return [this.perLineLabelMiddle, this.perLineLabelTop, this.perLineLabelBottom].filter(l => l !== null);
        }

        getLabelForLine(lineNumber) {
          const pos = WinLines.LINE_TO_POSITION[lineNumber];
          if (pos === 'middle') return this.perLineLabelMiddle;
          if (pos === 'top') return this.perLineLabelTop;
          if (pos === 'bottom') return this.perLineLabelBottom;
          return null;
        }

        showPerLineLabel(label, amount) {
          if (!label) return;
          const restScale = this.restScales.get(label);
          if (!restScale) return;
          label.string = `${amount}`;
          Tween.stopAllByTarget(label.node); // Activate FIRST so transform reset on activation doesn't clobber our setScale.

          label.node.active = true;
          label.node.setScale(restScale.x * 0.3, restScale.y * 0.3, restScale.z); // Fresh Vec3 for the tween destination so the cached restScale can't be mutated.

          tween(label.node).to(0.35, {
            scale: new Vec3(restScale.x, restScale.y, restScale.z)
          }, {
            easing: 'backOut'
          }).start();
        }

        hideAllPerLineLabels() {
          for (const label of this.allPerLineLabels()) {
            Tween.stopAllByTarget(label.node);
            label.node.active = false;
          }
        }

        delay(ms) {
          return new Promise(resolve => {
            setTimeout(resolve, ms);
          });
        }

      }, _class3.LINE_TO_POSITION = {
        1: 'middle',
        6: 'middle',
        7: 'middle',
        2: 'top',
        5: 'top',
        8: 'top',
        3: 'bottom',
        4: 'bottom',
        9: 'bottom',
        10: 'bottom'
      }, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "winLinesRoot", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "perLineLabelMiddle", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "perLineLabelTop", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "perLineLabelBottom", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "totalWinLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "lineDisplayTime", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2000;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "delayBetweenLines", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 300;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "symbolScale", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.15;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "bounceDuration", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0cee4c7ba854a3e3b523530b3566cda42c0749cc.js.map