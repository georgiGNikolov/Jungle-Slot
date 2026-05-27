System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, tween, Tween, Sprite, SpriteFrame, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, LIFT_UP_DISTANCE_PX, LIFT_UP_DURATION_SEC, STOP_TWEEN_DURATION_SEC, DEFAULT_SYMBOL_HEIGHT_PX, WRAP_SLACK_PX, ReelController2;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
      Tween = _cc.Tween;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ebd8cO5k79J4IyMkNgJAL7h", "ReelController2", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'tween', 'Tween', 'Sprite', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator); // ReelController2
      //
      // Each reel column holds N cell Nodes laid out vertically. During a spin every
      // cell moves down each frame; when a cell falls below the bottom row it wraps
      // to the top with a new random symbol — so the reel appears to scroll forever.
      // On stop, every cell tweens to its resting position with `elasticOut`, and the
      // server-provided symbols are written into each cell. The middle 3 cells per
      // column form the payline area; the top and bottom cells are decorative peeks.
      // Visual tuning

      LIFT_UP_DISTANCE_PX = 35;
      LIFT_UP_DURATION_SEC = 0.2;
      STOP_TWEEN_DURATION_SEC = 0.7; // Layout

      DEFAULT_SYMBOL_HEIGHT_PX = 175; // Slack so a cell sitting exactly at the bottom threshold doesn't wrap on every frame.

      WRAP_SLACK_PX = 1;

      _export("ReelController2", ReelController2 = (_dec = ccclass('ReelController2'), _dec2 = property(), _dec3 = property(), _dec4 = property(), _dec5 = property([SpriteFrame]), _dec(_class = (_class2 = class ReelController2 extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "reelSpeed", _descriptor, this);

          _initializerDefineProperty(this, "stopGapMs", _descriptor2, this);

          _initializerDefineProperty(this, "minSpinTime", _descriptor3, this);

          _initializerDefineProperty(this, "symbols", _descriptor4, this);

          /** Exactly the 3 payline cells per column: cells[col][row] with row in 0..2 (top/mid/bot). */
          this.cells = [];
          this.spinningReels = new Set();
          this.reelInfos = new Map();
          this.reels = [];
          this.spinning = false;
          this.spinStartTime = 0;
        }

        onLoad() {
          for (var child of this.node.children) {
            this.normalizeReelColumn(child);
            this.reels.push(child);
          }

          this.rebuildPublicCells();
        }
        /** Starts a spin. No-op if already spinning. Resolves once every reel is at full speed. */


        startSpin() {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (_this.spinning) return;
            _this.spinning = true;
            _this.spinStartTime = performance.now();

            for (var reel of _this.reels) {
              yield _this.playLiftUpAnimation(reel);

              _this.spinningReels.add(reel);
            }
          })();
        }
        /**
         * Stops the spin with `result[col][row]` (5 rows per column). Resolves when
         * every reel has finished its landing tween.
         */


        stopSpin(result) {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            if (!_this2.spinning) return;

            var elapsed = performance.now() - _this2.spinStartTime;

            if (elapsed < _this2.minSpinTime) {
              yield _this2.delay(_this2.minSpinTime - elapsed);
            }

            for (var col = 0; col < _this2.reels.length; col++) {
              yield _this2.stopReel(_this2.reels[col], result[col]);

              if (col < _this2.reels.length - 1) {
                yield _this2.delay(_this2.stopGapMs);
              }
            }

            _this2.spinning = false;

            _this2.rebuildPublicCells();
          })();
        }
        /** Writes the given 5-row column to each reel's cell sprites without animating. */


        applyGridImages(columnGrid) {
          this.node.children.forEach((reel, col) => {
            this.setReelResultIntoChildren(reel, columnGrid[col]);
          });
          this.rebuildPublicCells();
        }

        rebuildPublicCells() {
          // WinEffectController expects exactly the 3 payline cells per column (top/mid/bot).
          this.cells = this.reels.map(reel => {
            var info = this.reelInfos.get(reel);
            if (!info) return [];
            var m = info.centerIdx;
            return [info.children[m - 1], info.children[m], info.children[m + 1]];
          });
        }

        stopReel(reelNode, resultIcons) {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            _this3.spinningReels.delete(reelNode);

            var info = _this3.reelInfos.get(reelNode);

            if (!info) return;

            var sortedChildren = _this3.sortTopDown(reelNode);

            var {
              symbolHeight,
              baseY,
              centerIdx
            } = info;
            sortedChildren.forEach((c, i) => {
              var icon = resultIcons[i];

              if (_this3.symbols[icon]) {
                c.getComponent(Sprite).spriteFrame = _this3.symbols[icon];
              }
            });
            yield Promise.all(sortedChildren.map((c, i) => new Promise(resolve => {
              Tween.stopAllByTarget(c);
              var targetY = baseY + (centerIdx - i) * symbolHeight; // Snap to a fixed distance below target so elasticOut always has the same room
              // to bounce, regardless of where the cell happened to be mid-spin.

              c.setPosition(c.position.x, targetY - symbolHeight, c.position.z);
              tween(c).to(STOP_TWEEN_DURATION_SEC, {
                position: new Vec3(c.position.x, targetY, c.position.z)
              }, {
                easing: 'elasticOut'
              }).call(() => resolve()).start();
            })));

            _this3.reelInfos.set(reelNode, {
              symbolHeight,
              baseY,
              centerIdx,
              children: _this3.sortTopDown(reelNode)
            });
          })();
        }

        update(dt) {
          if (this.spinningReels.size === 0) return;
          this.spinningReels.forEach(reelNode => {
            var info = this.reelInfos.get(reelNode);
            if (!info) return;
            var {
              symbolHeight,
              baseY,
              centerIdx
            } = info;
            var minAllowed = baseY - centerIdx * symbolHeight;
            var wrapDistance = reelNode.children.length * symbolHeight;

            for (var child of reelNode.children) {
              var newY = child.position.y - this.reelSpeed * dt; // When a cell falls below the bottom row, lift it above the top row and
              // assign a new random symbol — the reel appears to keep scrolling forever.

              var shouldWrap = newY < minAllowed - WRAP_SLACK_PX;
              var finalY = shouldWrap ? newY + wrapDistance : newY;
              child.setPosition(child.position.x, finalY, child.position.z);
              if (shouldWrap) this.assignRandomSymbol(child);
            }
          });
        }

        playLiftUpAnimation(reelNode) {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            var info = _this4.reelInfos.get(reelNode);

            if (!info) return;
            yield Promise.all(info.children.map(c => new Promise(resolve => {
              Tween.stopAllByTarget(c);
              var upPos = c.position.clone();
              upPos.y += LIFT_UP_DISTANCE_PX;
              tween(c).to(LIFT_UP_DURATION_SEC, {
                position: upPos
              }, {
                easing: 'sineOut'
              }).call(() => resolve()).start();
            })));
          })();
        }

        assignRandomSymbol(child) {
          var randomIcon = Math.floor(Math.random() * this.symbols.length);

          if (this.symbols[randomIcon]) {
            child.getComponent(Sprite).spriteFrame = this.symbols[randomIcon];
          }
        }

        setReelResultIntoChildren(reelNode, fullColumn) {
          var ordered = this.sortTopDown(reelNode);
          ordered.forEach((child, i) => {
            var icon = fullColumn[i];

            if (this.symbols[icon]) {
              child.getComponent(Sprite).spriteFrame = this.symbols[icon];
            }
          });
        } // Sorts children top-to-bottom, then snaps them to evenly-spaced positions
        // around the center cell. Runs once per reel at load.


        normalizeReelColumn(reelNode) {
          var children = this.sortTopDown(reelNode);
          var symbolHeight = Math.abs(children[0].position.y - children[1].position.y) || DEFAULT_SYMBOL_HEIGHT_PX;
          var centerIdx = Math.floor(children.length / 2);
          var baseY = children[centerIdx].position.y;
          children.forEach((child, i) => {
            var targetY = baseY + (centerIdx - i) * symbolHeight;
            child.setPosition(new Vec3(child.position.x, targetY, child.position.z));
          });
          this.reelInfos.set(reelNode, {
            symbolHeight,
            baseY,
            centerIdx,
            children
          });
        }

        sortTopDown(node) {
          return node.children.slice().sort((a, b) => b.position.y - a.position.y);
        }

        delay(ms) {
          return new Promise(r => setTimeout(r, ms));
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "reelSpeed", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3000;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "stopGapMs", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 450;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "minSpinTime", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2000;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "symbols", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fcb2fe484bd1e45d442d6dee91b776774fd2f2a4.js.map