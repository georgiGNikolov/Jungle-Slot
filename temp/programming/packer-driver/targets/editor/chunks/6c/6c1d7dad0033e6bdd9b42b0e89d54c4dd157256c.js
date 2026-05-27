System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, MockApi, PAYLINES, _crd, FILLERS;

  function buildLineWin(lineNums, symbol = 1) {
    return Array.from({
      length: 5
    }, (_, col) => {
      const reel = [...FILLERS[col]];

      for (const n of lineNums) {
        const physicalRow = (_crd && PAYLINES === void 0 ? (_reportPossibleCrUseOfPAYLINES({
          error: Error()
        }), PAYLINES) : PAYLINES)[n - 1].rows[col] + 1;
        reel[physicalRow] = symbol;
      }

      return reel;
    });
  }

  function fillAllVisible(symbol) {
    return Array.from({
      length: 5
    }, () => [9, symbol, symbol, symbol, 9]);
  }

  function installDebugCheats() {
    if (typeof window === 'undefined') return;
    window.debug = {
      line1: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([1])),
      line2: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([2])),
      line3: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([3])),
      line4: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([4])),
      line5: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([5])),
      line6: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([6])),
      line7: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([7])),
      line8: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([8])),
      line9: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([9])),
      line10: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(buildLineWin([10])),
      allLines: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(fillAllVisible(1)),
      maxWin: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext(fillAllVisible(0)),
      noWin: () => (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
        error: Error()
      }), MockApi) : MockApi).forceNext([[9, 1, 2, 3, 9], [9, 2, 3, 4, 9], [9, 3, 4, 5, 9], [9, 4, 5, 6, 9], [9, 5, 6, 7, 9]])
    };
    console.log("[Debug] Cheats available: window.debug.{line1..line10, allLines, maxWin, noWin}");
  }

  function _reportPossibleCrUseOfMockApi(extras) {
    _reporterNs.report("MockApi", "./MockApi", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPAYLINES(extras) {
    _reporterNs.report("PAYLINES", "./MockApi", _context.meta, extras);
  }

  _export("installDebugCheats", installDebugCheats);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      MockApi = _unresolved_2.MockApi;
      PAYLINES = _unresolved_2.PAYLINES;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "56eeahJ+fVBFKxI7DUHkTce", "DebugCheats", undefined);

      // Filler symbols vary per column so single-payline cheats don't accidentally
      // chain a 3+ match on any other line. No wilds (id 0) in any filler position.
      FILLERS = [[5, 9, 5, 9, 5], [6, 8, 6, 8, 6], [7, 5, 7, 5, 7], [8, 6, 8, 6, 8], [9, 7, 9, 7, 9]];

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6c1d7dad0033e6bdd9b42b0e89d54c4dd157256c.js.map