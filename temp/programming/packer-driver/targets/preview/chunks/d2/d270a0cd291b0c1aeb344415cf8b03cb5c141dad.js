System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Component, Vec3, tween, Sprite, SpriteFrame, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _crd, ccclass, property, LIFT_UP_DISTANCE_PX, THUNK_DIP_PX, DEFAULT_SYMBOL_HEIGHT_PX, SPIN_DOWN_CELLS, DEFAULT_STRIP, ReelState, ReelController;

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
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ebd8cO5k79J4IyMkNgJAL7h", "ReelController", undefined);

      __checkObsolete__(['_decorator', 'CCFloat', 'CCInteger', 'Component', 'Node', 'Vec3', 'tween', 'Sprite', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);
      LIFT_UP_DISTANCE_PX = 35;
      THUNK_DIP_PX = 12;
      DEFAULT_SYMBOL_HEIGHT_PX = 175;
      SPIN_DOWN_CELLS = 5; // Decorative strip. Mostly low-paying symbols with a few mid/high sprinkled in.
      // 30 entries; rotated per column so columns don't visually sync.

      DEFAULT_STRIP = [5, 9, 2, 6, 3, 7, 0, 4, 8, 9, 1, 5, 2, 6, 7, 3, 8, 4, 9, 5, 1, 6, 2, 7, 3, 8, 4, 9, 0, 5];

      _export("ReelState", ReelState = /*#__PURE__*/function (ReelState) {
        ReelState["Idle"] = "idle";
        ReelState["Lifting"] = "lifting";
        ReelState["Spinning"] = "spinning";
        ReelState["Stopping"] = "stopping";
        return ReelState;
      }({}));

      _export("ReelController", ReelController = (_dec = ccclass('ReelController'), _dec2 = property({
        type: CCFloat
      }), _dec3 = property({
        type: CCInteger
      }), _dec4 = property({
        type: CCInteger
      }), _dec5 = property({
        type: CCFloat
      }), _dec6 = property({
        type: CCFloat
      }), _dec7 = property({
        type: CCFloat
      }), _dec8 = property({
        type: CCFloat
      }), _dec9 = property({
        type: [SpriteFrame]
      }), _dec(_class = (_class2 = (_class3 = class ReelController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "reelSpeed", _descriptor, this);

          _initializerDefineProperty(this, "stopGapMs", _descriptor2, this);

          _initializerDefineProperty(this, "minSpinTime", _descriptor3, this);

          _initializerDefineProperty(this, "liftUpDurationSec", _descriptor4, this);

          _initializerDefineProperty(this, "stopDurationSec", _descriptor5, this);

          _initializerDefineProperty(this, "thunkDipDurationSec", _descriptor6, this);

          _initializerDefineProperty(this, "thunkReturnDurationSec", _descriptor7, this);

          _initializerDefineProperty(this, "symbols", _descriptor8, this);

          /** Exactly the 3 payline cells per column: cells[col][row] with row in 0..2 (top/mid/bot). */
          this.cells = [];
          this.reelInfos = new Map();
          this.reels = [];
          this.spinning = false;
          this.spinStartTime = 0;
        }

        /** Resolves a flat payline index to its cell Node, or null. Index encoding: col * 3 + row. */
        getCellByIndex(index) {
          var _this$cells$col$row, _this$cells$col;

          var col = Math.floor(index / ReelController.PAYLINE_ROWS);
          var row = index % ReelController.PAYLINE_ROWS;
          return (_this$cells$col$row = (_this$cells$col = this.cells[col]) == null ? void 0 : _this$cells$col[row]) != null ? _this$cells$col$row : null;
        }

        onLoad() {
          this.node.children.forEach((reelNode, col) => {
            this.normalizeReelColumn(reelNode, col);
            this.reels.push(reelNode);
          });
          this.rebuildPublicCells(); // Paint initial sprites from the strip so the load state matches the
          // first spin frame. Otherwise cells show editor-baked sprite frames
          // until applyScroll first runs at spin start, producing a visible jump.

          for (var reelNode of this.reels) {
            this.applyScroll(this.reelInfos.get(reelNode));
          }
        }
        /** Starts a spin. No-op if already spinning. Resolves once every reel is at full speed. */


        startSpin() {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (_this.spinning) return;
            _this.spinning = true;
            _this.spinStartTime = performance.now();

            for (var reelNode of _this.reels) {
              var info = _this.reelInfos.get(reelNode);

              info.state = ReelState.Lifting;
              yield _this.playLiftUpAnimation(reelNode);
              info.state = ReelState.Spinning;
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
              yield _this2.stopReel(_this2.reels[col], result[col], _this2.stopDurationSec);

              if (col < _this2.reels.length - 1) {
                yield _this2.delay(_this2.stopGapMs);
              }
            }

            _this2.spinning = false;

            _this2.rebuildPublicCells();
          })();
        }
        /** Writes the given 5-row column to each reel by pinning at the currently-visible slots. */


        applyGridImages(columnGrid) {
          this.reels.forEach((reelNode, col) => {
            var info = this.reelInfos.get(reelNode);
            var cellsScrolled = info.scrollPx / info.symbolHeight;
            var topSlot = -Math.floor(cellsScrolled);

            for (var k = 0; k < columnGrid[col].length; k++) {
              info.pinnedSymbols.set(topSlot + k, columnGrid[col][k]);
            }

            this.applyScroll(info);
          });
          this.rebuildPublicCells();
        }

        rebuildPublicCells() {
          // The 3 payline cells per column (top/mid/bot), centered on `centerIdx`.
          this.cells = this.reels.map(reel => {
            var info = this.reelInfos.get(reel);
            if (!info) return [];
            var m = info.centerIdx;
            return [info.children[m - 1], info.children[m], info.children[m + 1]];
          });
        }

        stopReel(reelNode, resultIcons, duration) {
          var _this3 = this;

          return _asyncToGenerator(function* () {
            var info = _this3.reelInfos.get(reelNode);

            if (!info) return; // Prime one frame of forward motion before handing off to the tween. Otherwise
            // the action manager's first tick can land AFTER the next update()'s applyScroll,
            // producing a 1-frame freeze where the rendered scrollPx hasn't advanced yet.

            info.scrollPx += info.speed * (1 / 60);
            var currentCells = info.scrollPx / info.symbolHeight;
            var endCells = Math.ceil(currentCells) + SPIN_DOWN_CELLS;
            var endScrollPx = endCells * info.symbolHeight;
            var endTopSlot = -endCells; // Pin the result symbols at the slots that will be visible at landing.

            for (var k = 0; k < resultIcons.length; k++) {
              info.pinnedSymbols.set(endTopSlot + k, resultIcons[k]);
            }

            info.state = ReelState.Stopping;
            yield new Promise(resolve => {
              tween(info).to(duration, {
                scrollPx: endScrollPx
              }, {
                easing: 'cubicOut'
              }).call(() => {
                info.scrollPx = endScrollPx;

                _this3.applyScroll(info);

                _this3.playThunk(reelNode, () => {
                  info.state = ReelState.Idle;

                  _this3.prunePinned(info);

                  resolve();
                });
              }).start();
            });
          })();
        } // Small parent-node dip + return after the scrollPx tween settles. Pure cosmetic
        // impact feel — replaces the old elasticOut bounce on cells.


        playThunk(reelNode, onComplete) {
          var x = reelNode.position.x;
          var z = reelNode.position.z;
          var restY = reelNode.position.y;
          var dipY = restY - THUNK_DIP_PX;
          tween(reelNode).to(this.thunkDipDurationSec, {
            position: new Vec3(x, dipY, z)
          }, {
            easing: 'quadIn'
          }).to(this.thunkReturnDurationSec, {
            position: new Vec3(x, restY, z)
          }, {
            easing: 'quadOut'
          }).call(onComplete).start();
        }

        update(dt) {
          if (!this.spinning) return;

          for (var reelNode of this.reels) {
            var info = this.reelInfos.get(reelNode);
            if (!info) continue;
            if (info.state === ReelState.Spinning) info.scrollPx += info.speed * dt;
            if (info.state === ReelState.Spinning || info.state === ReelState.Stopping) this.applyScroll(info);
          }
        } // Derives every cell's Y and sprite frame from `scrollPx`. The single source of
        // truth during spin/stop. Sub-cell offset `frac` slides cells smoothly; when it
        // wraps from ~1 → 0, every cell's slot index ticks and the column re-textures
        // in lockstep, so the eye sees continuous motion.


        applyScroll(reel) {
          var cellsScrolled = reel.scrollPx / reel.symbolHeight;
          var wholeCells = Math.floor(cellsScrolled);
          var frac = cellsScrolled - wholeCells;
          var topSlot = -wholeCells;

          for (var k = 0; k < reel.children.length; k++) {
            var cell = reel.children[k];
            var y = reel.baseY + (reel.centerIdx - k) * reel.symbolHeight - frac * reel.symbolHeight;
            cell.setPosition(cell.position.x, y, cell.position.z);
            var sym = this.symbolAtSlot(reel, topSlot + k);
            var frame = this.symbols[sym];
            var sprite = cell.getComponent(Sprite);
            if (frame && sprite.spriteFrame !== frame) sprite.spriteFrame = frame;
          }
        } // Pinned overrides win; otherwise fall back to the rotated strip with negative-safe modulo.


        symbolAtSlot(reel, slot) {
          var pin = reel.pinnedSymbols.get(slot);
          if (pin !== undefined) return pin;
          var len = reel.strip.length;
          return reel.strip[(slot % len + len) % len];
        } // Keeps the pin map bounded by dropping entries far from the current viewport.


        prunePinned(reel) {
          var cellsScrolled = reel.scrollPx / reel.symbolHeight;
          var topSlot = -Math.floor(cellsScrolled);
          var keepMin = topSlot - 2;
          var keepMax = topSlot + reel.children.length + 2;

          for (var slot of reel.pinnedSymbols.keys()) {
            if (slot < keepMin || slot > keepMax) reel.pinnedSymbols.delete(slot);
          }
        }

        playLiftUpAnimation(reelNode) {
          var _this4 = this;

          return _asyncToGenerator(function* () {
            var info = _this4.reelInfos.get(reelNode);

            if (!info) return;
            yield Promise.all(info.children.map(c => new Promise(resolve => {
              var upPos = c.position.clone();
              upPos.y += LIFT_UP_DISTANCE_PX;
              tween(c).to(_this4.liftUpDurationSec, {
                position: upPos
              }, {
                easing: 'sineOut'
              }).call(() => resolve()).start();
            })));
          })();
        } // Sorts children top-to-bottom, evenly-spaces them around the center cell, and
        // seeds the virtual-scrolling state. Runs once per reel at load.


        normalizeReelColumn(reelNode, col) {
          var children = this.sortTopDown(reelNode);
          var symbolHeight = Math.abs(children[0].position.y - children[1].position.y) || DEFAULT_SYMBOL_HEIGHT_PX;
          var centerIdx = Math.floor(children.length / 2);
          var baseY = children[centerIdx].position.y;
          children.forEach((child, i) => {
            var targetY = baseY + (centerIdx - i) * symbolHeight;
            child.setPosition(new Vec3(child.position.x, targetY, child.position.z));
          }); // Rotate the strip per column so columns don't visually sync.
          // 7 is coprime with strip length 30 → unique rotation per column.

          var offset = col * 7 % DEFAULT_STRIP.length;
          var strip = DEFAULT_STRIP.slice(offset).concat(DEFAULT_STRIP.slice(0, offset));
          this.reelInfos.set(reelNode, {
            symbolHeight,
            baseY,
            centerIdx,
            children,
            scrollPx: 0,
            speed: this.reelSpeed,
            strip,
            pinnedSymbols: new Map(),
            state: ReelState.Idle
          });
        }

        sortTopDown(node) {
          return node.children.slice().sort((a, b) => b.position.y - a.position.y);
        }

        delay(ms) {
          return new Promise(r => setTimeout(r, ms));
        }

      }, _class3.PAYLINE_ROWS = 3, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "reelSpeed", [_dec2], {
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
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "liftUpDurationSec", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "stopDurationSec", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.3;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "thunkDipDurationSec", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.06;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "thunkReturnDurationSec", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.12;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "symbols", [_dec9], {
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
//# sourceMappingURL=d270a0cd291b0c1aeb344415cf8b03cb5c141dad.js.map