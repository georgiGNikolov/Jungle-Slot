System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, view, ResolutionPolicy, screen, MockApi, PlayButton, ReelController, WinLines, installDebugCheats, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _crd, ccclass, property, Main;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfMockApi(extras) {
    _reporterNs.report("MockApi", "./MockApi", _context.meta, extras);
  }

  function _reportPossibleCrUseOfInitData(extras) {
    _reporterNs.report("InitData", "./MockApi", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayData(extras) {
    _reporterNs.report("PlayData", "./MockApi", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPlayButton(extras) {
    _reporterNs.report("PlayButton", "./PlayButton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfReelController(extras) {
    _reporterNs.report("ReelController", "./ReelController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWinLines(extras) {
    _reporterNs.report("WinLines", "./WinLines", _context.meta, extras);
  }

  function _reportPossibleCrUseOfinstallDebugCheats(extras) {
    _reporterNs.report("installDebugCheats", "./DebugCheats", _context.meta, extras);
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
      view = _cc.view;
      ResolutionPolicy = _cc.ResolutionPolicy;
      screen = _cc.screen;
    }, function (_unresolved_2) {
      MockApi = _unresolved_2.MockApi;
    }, function (_unresolved_3) {
      PlayButton = _unresolved_3.PlayButton;
    }, function (_unresolved_4) {
      ReelController = _unresolved_4.ReelController;
    }, function (_unresolved_5) {
      WinLines = _unresolved_5.WinLines;
    }, function (_unresolved_6) {
      installDebugCheats = _unresolved_6.installDebugCheats;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "279502he65PTZLwFpBycv5j", "Main", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'view', 'ResolutionPolicy', 'screen']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Main", Main = (_dec = ccclass('Main'), _dec2 = property({
        type: _crd && PlayButton === void 0 ? (_reportPossibleCrUseOfPlayButton({
          error: Error()
        }), PlayButton) : PlayButton
      }), _dec3 = property({
        type: _crd && ReelController === void 0 ? (_reportPossibleCrUseOfReelController({
          error: Error()
        }), ReelController) : ReelController
      }), _dec4 = property({
        type: _crd && WinLines === void 0 ? (_reportPossibleCrUseOfWinLines({
          error: Error()
        }), WinLines) : WinLines
      }), _dec(_class = (_class2 = (_class3 = class Main extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "playButton", _descriptor, this);

          _initializerDefineProperty(this, "reelController", _descriptor2, this);

          _initializerDefineProperty(this, "winLines", _descriptor3, this);

          this.isLoading = false;
        }

        onLoad() {
          this.applyResponsiveResolution();
          screen.on('window-resize', this.applyResponsiveResolution, this);
          screen.on('orientation-change', this.applyResponsiveResolution, this);
          (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
            error: Error()
          }), MockApi) : MockApi).onInitData(this.handleInitResponse.bind(this));
          (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
            error: Error()
          }), MockApi) : MockApi).onPlayResponse(this.handlePlayResponse.bind(this));
          (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
            error: Error()
          }), MockApi) : MockApi).init();
          (_crd && installDebugCheats === void 0 ? (_reportPossibleCrUseOfinstallDebugCheats({
            error: Error()
          }), installDebugCheats) : installDebugCheats)();
        }

        onPlayPressed() {
          var _this = this;

          return _asyncToGenerator(function* () {
            if (_this.isLoading) return;
            _this.isLoading = true;

            _this.playButton.setEnabled(false);

            _this.winLines.hideAllLines();

            _this.winLines.resetTotal(); // Fire API in parallel with the spin animation.
            // ReelController.stopSpin internally awaits the spin-up promise,
            // so a fast response cannot race past the lift-up.


            _this.reelController.startSpin();

            (_crd && MockApi === void 0 ? (_reportPossibleCrUseOfMockApi({
              error: Error()
            }), MockApi) : MockApi).play();
          })();
        }

        handleInitResponse(data) {
          console.log("Init received:", data);
          this.reelController.applyGridImages(data.defaultReels);
        }

        handlePlayResponse(data) {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            console.log("Play received:", data);
            yield _this2.reelController.stopSpin(data.reels);
            var linesWithNodes = data.winLines.map(line => ({
              lineNumber: line.lineNumber,
              winAmount: line.winAmount,
              nodes: line.winIndexes.map(idx => _this2.reelController.getCellByIndex(idx)).filter(n => n !== null)
            }));
            yield _this2.winLines.playWinLines(linesWithNodes);
            _this2.isLoading = false;

            _this2.playButton.setEnabled(true);
          })();
        }

        onDestroy() {
          screen.off('window-resize', this.applyResponsiveResolution, this);
          screen.off('orientation-change', this.applyResponsiveResolution, this);
        }

        applyResponsiveResolution() {
          var w = screen.windowSize.width;
          var h = screen.windowSize.height;
          var policy = w / h >= Main.DESIGN_W / Main.DESIGN_H ? ResolutionPolicy.FIXED_HEIGHT : ResolutionPolicy.FIXED_WIDTH;
          view.setDesignResolutionSize(Main.DESIGN_W, Main.DESIGN_H, policy);
        }

      }, _class3.DESIGN_W = 1280, _class3.DESIGN_H = 720, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "playButton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "reelController", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "winLines", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fcec825a9a8ed2d669ab388bce4b0dac93e5f9fb.js.map