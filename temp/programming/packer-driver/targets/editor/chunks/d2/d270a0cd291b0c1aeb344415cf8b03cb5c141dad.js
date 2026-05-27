System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCFloat, CCInteger, Component, Vec3, tween, Sprite, SpriteFrame, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _crd, ccclass, property, LIFT_UP_DISTANCE_PX, THUNK_DIP_PX, DEFAULT_SYMBOL_HEIGHT_PX, SPIN_DOWN_CELLS, DEFAULT_STRIP, ReelState, ReelController;

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
        constructor(...args) {
          super(...args);

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

          const col = Math.floor(index / ReelController.PAYLINE_ROWS);
          const row = index % ReelController.PAYLINE_ROWS;
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

          for (const reelNode of this.reels) {
            this.applyScroll(this.reelInfos.get(reelNode));
          }
        }
        /** Starts a spin. No-op if already spinning. Resolves once every reel is at full speed. */


        async startSpin() {
          if (this.spinning) return;
          this.spinning = true;
          this.spinStartTime = performance.now();

          for (const reelNode of this.reels) {
            const info = this.reelInfos.get(reelNode);
            info.state = ReelState.Lifting;
            await this.playLiftUpAnimation(reelNode);
            info.state = ReelState.Spinning;
          }
        }
        /**
         * Stops the spin with `result[col][row]` (5 rows per column). Resolves when
         * every reel has finished its landing tween.
         */


        async stopSpin(result) {
          if (!this.spinning) return;
          const elapsed = performance.now() - this.spinStartTime;

          if (elapsed < this.minSpinTime) {
            await this.delay(this.minSpinTime - elapsed);
          }

          for (let col = 0; col < this.reels.length; col++) {
            await this.stopReel(this.reels[col], result[col], this.stopDurationSec);

            if (col < this.reels.length - 1) {
              await this.delay(this.stopGapMs);
            }
          }

          this.spinning = false;
          this.rebuildPublicCells();
        }
        /** Writes the given 5-row column to each reel by pinning at the currently-visible slots. */


        applyGridImages(columnGrid) {
          this.reels.forEach((reelNode, col) => {
            const info = this.reelInfos.get(reelNode);
            const cellsScrolled = info.scrollPx / info.symbolHeight;
            const topSlot = -Math.floor(cellsScrolled);

            for (let k = 0; k < columnGrid[col].length; k++) {
              info.pinnedSymbols.set(topSlot + k, columnGrid[col][k]);
            }

            this.applyScroll(info);
          });
          this.rebuildPublicCells();
        }

        rebuildPublicCells() {
          // The 3 payline cells per column (top/mid/bot), centered on `centerIdx`.
          this.cells = this.reels.map(reel => {
            const info = this.reelInfos.get(reel);
            if (!info) return [];
            const m = info.centerIdx;
            return [info.children[m - 1], info.children[m], info.children[m + 1]];
          });
        }

        async stopReel(reelNode, resultIcons, duration) {
          const info = this.reelInfos.get(reelNode);
          if (!info) return; // Prime one frame of forward motion before handing off to the tween. Otherwise
          // the action manager's first tick can land AFTER the next update()'s applyScroll,
          // producing a 1-frame freeze where the rendered scrollPx hasn't advanced yet.

          info.scrollPx += info.speed * (1 / 60);
          const currentCells = info.scrollPx / info.symbolHeight;
          const endCells = Math.ceil(currentCells) + SPIN_DOWN_CELLS;
          const endScrollPx = endCells * info.symbolHeight;
          const endTopSlot = -endCells; // Pin the result symbols at the slots that will be visible at landing.

          for (let k = 0; k < resultIcons.length; k++) {
            info.pinnedSymbols.set(endTopSlot + k, resultIcons[k]);
          }

          info.state = ReelState.Stopping;
          await new Promise(resolve => {
            tween(info).to(duration, {
              scrollPx: endScrollPx
            }, {
              easing: 'cubicOut'
            }).call(() => {
              info.scrollPx = endScrollPx;
              this.applyScroll(info);
              this.playThunk(reelNode, () => {
                info.state = ReelState.Idle;
                this.prunePinned(info);
                resolve();
              });
            }).start();
          });
        } // Small parent-node dip + return after the scrollPx tween settles. Pure cosmetic
        // impact feel — replaces the old elasticOut bounce on cells.


        playThunk(reelNode, onComplete) {
          const x = reelNode.position.x;
          const z = reelNode.position.z;
          const restY = reelNode.position.y;
          const dipY = restY - THUNK_DIP_PX;
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

          for (const reelNode of this.reels) {
            const info = this.reelInfos.get(reelNode);
            if (!info) continue;
            if (info.state === ReelState.Spinning) info.scrollPx += info.speed * dt;
            if (info.state === ReelState.Spinning || info.state === ReelState.Stopping) this.applyScroll(info);
          }
        } // Derives every cell's Y and sprite frame from `scrollPx`. The single source of
        // truth during spin/stop. Sub-cell offset `frac` slides cells smoothly; when it
        // wraps from ~1 → 0, every cell's slot index ticks and the column re-textures
        // in lockstep, so the eye sees continuous motion.


        applyScroll(reel) {
          const cellsScrolled = reel.scrollPx / reel.symbolHeight;
          const wholeCells = Math.floor(cellsScrolled);
          const frac = cellsScrolled - wholeCells;
          const topSlot = -wholeCells;

          for (let k = 0; k < reel.children.length; k++) {
            const cell = reel.children[k];
            const y = reel.baseY + (reel.centerIdx - k) * reel.symbolHeight - frac * reel.symbolHeight;
            cell.setPosition(cell.position.x, y, cell.position.z);
            const sym = this.symbolAtSlot(reel, topSlot + k);
            const frame = this.symbols[sym];
            const sprite = cell.getComponent(Sprite);
            if (frame && sprite.spriteFrame !== frame) sprite.spriteFrame = frame;
          }
        } // Pinned overrides win; otherwise fall back to the rotated strip with negative-safe modulo.


        symbolAtSlot(reel, slot) {
          const pin = reel.pinnedSymbols.get(slot);
          if (pin !== undefined) return pin;
          const len = reel.strip.length;
          return reel.strip[(slot % len + len) % len];
        } // Keeps the pin map bounded by dropping entries far from the current viewport.


        prunePinned(reel) {
          const cellsScrolled = reel.scrollPx / reel.symbolHeight;
          const topSlot = -Math.floor(cellsScrolled);
          const keepMin = topSlot - 2;
          const keepMax = topSlot + reel.children.length + 2;

          for (const slot of reel.pinnedSymbols.keys()) {
            if (slot < keepMin || slot > keepMax) reel.pinnedSymbols.delete(slot);
          }
        }

        async playLiftUpAnimation(reelNode) {
          const info = this.reelInfos.get(reelNode);
          if (!info) return;
          await Promise.all(info.children.map(c => new Promise(resolve => {
            const upPos = c.position.clone();
            upPos.y += LIFT_UP_DISTANCE_PX;
            tween(c).to(this.liftUpDurationSec, {
              position: upPos
            }, {
              easing: 'sineOut'
            }).call(() => resolve()).start();
          })));
        } // Sorts children top-to-bottom, evenly-spaces them around the center cell, and
        // seeds the virtual-scrolling state. Runs once per reel at load.


        normalizeReelColumn(reelNode, col) {
          const children = this.sortTopDown(reelNode);
          const symbolHeight = Math.abs(children[0].position.y - children[1].position.y) || DEFAULT_SYMBOL_HEIGHT_PX;
          const centerIdx = Math.floor(children.length / 2);
          const baseY = children[centerIdx].position.y;
          children.forEach((child, i) => {
            const targetY = baseY + (centerIdx - i) * symbolHeight;
            child.setPosition(new Vec3(child.position.x, targetY, child.position.z));
          }); // Rotate the strip per column so columns don't visually sync.
          // 7 is coprime with strip length 30 → unique rotation per column.

          const offset = col * 7 % DEFAULT_STRIP.length;
          const strip = DEFAULT_STRIP.slice(offset).concat(DEFAULT_STRIP.slice(0, offset));
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
        initializer: function () {
          return 3000;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "stopGapMs", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 450;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "minSpinTime", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2000;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "liftUpDurationSec", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "stopDurationSec", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.3;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "thunkDipDurationSec", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.06;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "thunkReturnDurationSec", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.12;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "symbols", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d270a0cd291b0c1aeb344415cf8b03cb5c141dad.js.map