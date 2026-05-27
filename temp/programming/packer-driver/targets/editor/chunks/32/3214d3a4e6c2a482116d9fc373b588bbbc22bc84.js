System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, MockApi, _crd, REELS, VISIBLE_ROWS, TOTAL_ROWS, VISIBLE_ROW_OFFSET, PLAY_DELAY_MS, PAYLINES, PAYTABLE, WILD_SYMBOL;

  _export("MockApi", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c4842RrjINGz7vMiH1iZEKi", "MockApi", undefined);

      REELS = 5;
      VISIBLE_ROWS = 3;
      TOTAL_ROWS = 5; // Index of the first payline row within a 5-row column. Rows below this are payline rows (top/mid/bot).

      VISIBLE_ROW_OFFSET = 1;
      PLAY_DELAY_MS = 400;
      /**
       * PAYLINES
       *
       * Row values:
       * 0 = top
       * 1 = middle
       * 2 = bottom
       */

      _export("PAYLINES", PAYLINES = [{
        lineNumber: 1,
        rows: [1, 1, 1, 1, 1]
      }, {
        lineNumber: 2,
        rows: [0, 0, 0, 0, 0]
      }, {
        lineNumber: 3,
        rows: [2, 2, 2, 2, 2]
      }, {
        lineNumber: 4,
        rows: [0, 1, 2, 1, 0]
      }, {
        lineNumber: 5,
        rows: [2, 1, 0, 1, 2]
      }, {
        lineNumber: 6,
        rows: [0, 0, 1, 2, 2]
      }, {
        lineNumber: 7,
        rows: [2, 2, 1, 0, 0]
      }, {
        lineNumber: 8,
        rows: [1, 0, 0, 0, 1]
      }, {
        lineNumber: 9,
        rows: [1, 2, 2, 2, 1]
      }, {
        lineNumber: 10,
        rows: [2, 1, 2, 1, 2]
      }]);
      /**
       * SYMBOL IDS
       *
       * 0 = Wild
       * 1 = H1
       * 2 = H2
       * 3 = H3
       * 4 = H4
       * 5 = L1
       * 6 = L2
       * 7 = L3
       * 8 = L4
       * 9 = L5
       */


      PAYTABLE = {
        0: {
          3: 100,
          4: 1000,
          5: 2000
        },
        // Wild
        1: {
          3: 50,
          4: 500,
          5: 1000
        },
        // H1
        2: {
          3: 20,
          4: 150,
          5: 750
        },
        // H2
        3: {
          3: 15,
          4: 100,
          5: 500
        },
        // H3
        4: {
          3: 15,
          4: 100,
          5: 500
        },
        // H4
        5: {
          3: 10,
          4: 75,
          5: 250
        },
        // L1
        6: {
          3: 5,
          4: 50,
          5: 150
        },
        // L2
        7: {
          3: 5,
          4: 25,
          5: 150
        },
        // L3
        8: {
          3: 5,
          4: 25,
          5: 150
        },
        // L4
        9: {
          3: 5,
          4: 15,
          5: 100
        } // L5

      };
      WILD_SYMBOL = 0;

      _export("MockApi", MockApi = class MockApi {
        static onInitData(cb) {
          this.initCallback = cb;
        }

        static onPlayResponse(cb) {
          this.playCallback = cb;
        }
        /** Debug-only: force the next play() to return these reels instead of random. Consumed once. */


        static forceNext(reels) {
          this.forcedNext = reels;
          console.log("[Debug] Next play() will return:", reels);
        }

        static init() {
          var _this$initCallback;

          const data = {
            gameId: "999",
            // 5 reels x 5 rows [hiddenUpper, top, middle, bottom, hiddenLower]
            defaultReels: [[9, 1, 5, 7, 6], [5, 2, 6, 8, 9], [6, 3, 7, 9, 5], [7, 4, 8, 5, 6], [8, 1, 6, 9, 7]]
          };
          (_this$initCallback = this.initCallback) == null || _this$initCallback.call(this, data);
        }

        static play() {
          var _this$forcedNext;

          const reels = (_this$forcedNext = this.forcedNext) != null ? _this$forcedNext : this.buildRandomReels();
          this.forcedNext = null;
          const winLines = this.evaluateWins(reels);
          const totalWin = winLines.reduce((sum, wl) => sum + wl.winAmount, 0);
          const payload = {
            roundId: Date.now().toString(),
            reels,
            winLines,
            totalWin
          };
          setTimeout(() => {
            var _this$playCallback;

            return (_this$playCallback = this.playCallback) == null ? void 0 : _this$playCallback.call(this, payload);
          }, PLAY_DELAY_MS);
        }
        /**
         * Random symbol 0..9
         */


        static randIcon() {
          return Math.floor(Math.random() * 10);
        }
        /**
         * Build 5 reels x 5 rows: [hiddenUpper, top, middle, bottom, hiddenLower].
         */


        static buildRandomReels() {
          return Array.from({
            length: REELS
          }, () => Array.from({
            length: TOTAL_ROWS
          }, () => this.randIcon()));
        }
        /**
         * Evaluate left-to-right paylines
         */


        static evaluateWins(reels) {
          const results = [];

          for (const line of PAYLINES) {
            var _PAYTABLE$symbolId;

            const symbols = [];
            const indexes = []; // Collect symbols for this line. line.rows are payline-space (0..2);
            // physical reel rows are offset by VISIBLE_ROW_OFFSET to skip the hidden upper row.

            for (let reel = 0; reel < REELS; reel++) {
              const paylineRow = line.rows[reel];
              const physicalRow = paylineRow + VISIBLE_ROW_OFFSET;
              symbols.push(reels[reel][physicalRow]);
              indexes.push(this.toIndex(reel, paylineRow));
            }

            const evaluation = this.evaluateLine(symbols);

            if (!evaluation) {
              continue;
            }

            const {
              symbolId,
              count
            } = evaluation;
            const payout = (_PAYTABLE$symbolId = PAYTABLE[symbolId]) == null ? void 0 : _PAYTABLE$symbolId[count];

            if (!payout) {
              continue;
            }

            results.push({
              lineNumber: line.lineNumber,
              winAmount: payout,
              winIndexes: indexes.slice(0, count)
            });
          }

          return results;
        }
        /**
         * Left-to-right evaluation with wild substitution
         */


        static evaluateLine(symbols) {
          let baseSymbol = null;
          let count = 0;

          for (let i = 0; i < symbols.length; i++) {
            const current = symbols[i]; // Wild

            if (current === WILD_SYMBOL) {
              count++;
              continue;
            } // First non-wild becomes target


            if (baseSymbol === null) {
              baseSymbol = current;
              count++;
              continue;
            } // Matching symbol


            if (current === baseSymbol) {
              count++;
              continue;
            } // Chain broken


            break;
          } // All wilds case


          if (baseSymbol === null) {
            baseSymbol = WILD_SYMBOL;
          }

          if (count < 3) {
            return null;
          }

          return {
            symbolId: baseSymbol,
            count
          };
        }
        /**
         * Convert reel + payline-space row (0..2) to a flat index for WinEffectController.
         * Payline coordinates stay 3-row even though the reel data is 5-row.
         */


        static toIndex(reel, paylineRow) {
          return reel * VISIBLE_ROWS + paylineRow;
        }

      });

      MockApi.initCallback = null;
      MockApi.playCallback = null;
      MockApi.forcedNext = null;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3214d3a4e6c2a482116d9fc373b588bbbc22bc84.js.map