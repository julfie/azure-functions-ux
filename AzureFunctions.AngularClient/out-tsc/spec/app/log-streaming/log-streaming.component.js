"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("../shared/services/user.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var utilities_service_1 = require("../shared/services/utilities.service");
var global_state_service_1 = require("../shared/services/global-state.service");
var LogStreamingComponent = (function () {
    function LogStreamingComponent(_elementRef, _userService, _broadcastService, _utilities, _globalStateService) {
        var _this = this;
        this._elementRef = _elementRef;
        this._userService = _userService;
        this._broadcastService = _broadcastService;
        this._utilities = _utilities;
        this._globalStateService = _globalStateService;
        this.timerInterval = 1000;
        this.isExpanded = false;
        this.oldLength = 0;
        this.skipLength = 0;
        this.closeClicked = new core_1.EventEmitter();
        this.expandClicked = new core_1.EventEmitter();
        this.tokenSubscription = this._userService.getStartupInfo().subscribe(function (s) { return _this.token = s.token; });
        this.log = '';
        this.timeouts = [];
    }
    LogStreamingComponent.prototype.ngOnChanges = function () {
        this.initLogs(this.isHttpLogs);
        this.startLogs();
    };
    LogStreamingComponent.prototype.ngOnDestroy = function () {
        if (this.xhReq) {
            this.timeouts.forEach(window.clearTimeout);
            this.timeouts = [];
            this.xhReq.abort();
        }
        if (this.tokenSubscription) {
            this.tokenSubscription.unsubscribe();
            delete this.tokenSubscription;
        }
    };
    LogStreamingComponent.prototype.startLogs = function () {
        this.stopped = false;
    };
    LogStreamingComponent.prototype.stopLogs = function () {
        this.stopped = true;
    };
    LogStreamingComponent.prototype.clearLogs = function () {
        this.skipLength = this.skipLength + this.log.length;
        this.log = ' ';
    };
    LogStreamingComponent.prototype.copyLogs = function (event) {
        this._utilities.copyContentToClipboard(this.log);
    };
    LogStreamingComponent.prototype.handleKeyPress = function (e) {
        if ((e.which === 65 || e.keyCode == 65) && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            this._utilities.highlightText(this._elementRef.nativeElement.querySelector('pre'));
        }
    };
    LogStreamingComponent.prototype.close = function () {
        this.closeClicked.emit(null);
    };
    LogStreamingComponent.prototype.expand = function () {
        this.isExpanded = true;
        this.expandClicked.emit(true);
    };
    LogStreamingComponent.prototype.compress = function () {
        this.isExpanded = false;
        this.expandClicked.emit(false);
    };
    LogStreamingComponent.prototype.initLogs = function (createEmpty, log) {
        var _this = this;
        if (createEmpty === void 0) { createEmpty = true; }
        var maxCharactersInLog = 500000;
        var intervalIncreaseThreshold = 1000;
        var defaultInterval = 1000;
        var maxInterval = 10000;
        var oldLogs = '';
        var promise = new Promise(function (resolve, reject) {
            if (_this.xhReq) {
                _this.timeouts.forEach(window.clearTimeout);
                _this.timeouts = [];
                _this.log = '';
                _this.xhReq.abort();
                _this.oldLength = 0;
                if (createEmpty && log) {
                    _this.log = oldLogs = log;
                    _this.oldLength = oldLogs.length;
                    _this.skipLength = 0;
                }
            }
            var scmUrl = _this.functionInfo.functionApp.getScmUrl();
            _this.xhReq = new XMLHttpRequest();
            var url = scmUrl + "/api/logstream/application/functions/function/" + _this.functionInfo.name;
            _this.xhReq.open('GET', url, true);
            if (_this.functionInfo.functionApp.tryFunctionsScmCreds) {
                _this.xhReq.setRequestHeader('Authorization', "Basic " + _this.functionInfo.functionApp.tryFunctionsScmCreds);
            }
            else {
                _this.xhReq.setRequestHeader('Authorization', "Bearer " + _this.token);
            }
            _this.xhReq.setRequestHeader('FunctionsPortal', '1');
            _this.xhReq.send(null);
            if (!createEmpty) {
                _this.functionInfo.functionApp.getOldLogs(_this.functionInfo, 10000).subscribe(function (r) { return oldLogs = r; });
            }
            var callBack = function () {
                var diff = _this.xhReq.responseText.length + oldLogs.length - _this.oldLength;
                if (!_this.stopped && diff > 0) {
                    resolve(null);
                    if (_this.xhReq.responseText.length > maxCharactersInLog) {
                        _this.log = _this.xhReq.responseText.substring(_this.xhReq.responseText.length - maxCharactersInLog);
                    }
                    else {
                        _this.log = oldLogs
                            ? oldLogs + _this.xhReq.responseText.substring(_this.xhReq.responseText.indexOf('\n') + 1)
                            : _this.xhReq.responseText;
                        if (_this.skipLength > 0) {
                            _this.log = _this.log.substring(_this.skipLength);
                        }
                    }
                    _this.oldLength = _this.xhReq.responseText.length + oldLogs.length;
                    window.setTimeout(function () {
                        var el = document.getElementById('log-stream');
                        if (el) {
                            el.scrollTop = el.scrollHeight;
                        }
                    });
                    var nextInterval = diff - oldLogs.length > intervalIncreaseThreshold ? _this.timerInterval + defaultInterval : _this.timerInterval - defaultInterval;
                    if (nextInterval < defaultInterval) {
                        _this.timerInterval = defaultInterval;
                    }
                    else if (nextInterval > maxInterval) {
                        _this.timerInterval = defaultInterval;
                    }
                    else {
                        _this.timerInterval = nextInterval;
                    }
                }
                else if (diff == 0) {
                    _this.timerInterval = defaultInterval;
                }
                if (_this.xhReq.readyState === XMLHttpRequest.DONE) {
                    _this.initLogs(true, _this.log);
                }
                else {
                    _this.timeouts.push(window.setTimeout(callBack, _this.timerInterval));
                }
            };
            callBack();
        });
        return promise;
    };
    return LogStreamingComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], LogStreamingComponent.prototype, "functionInfo", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], LogStreamingComponent.prototype, "isHttpLogs", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], LogStreamingComponent.prototype, "closeClicked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], LogStreamingComponent.prototype, "expandClicked", void 0);
LogStreamingComponent = __decorate([
    core_1.Component({
        selector: 'log-streaming',
        templateUrl: './log-streaming.component.html',
        styleUrls: ['./log-streaming.component.scss', '../function-dev/function-dev.component.scss']
    }),
    __param(0, core_1.Inject(core_1.ElementRef)),
    __metadata("design:paramtypes", [core_1.ElementRef,
        user_service_1.UserService,
        broadcast_service_1.BroadcastService,
        utilities_service_1.UtilitiesService,
        global_state_service_1.GlobalStateService])
], LogStreamingComponent);
exports.LogStreamingComponent = LogStreamingComponent;
//# sourceMappingURL=log-streaming.component.js.map