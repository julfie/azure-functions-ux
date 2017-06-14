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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/do");
require("rxjs/add/operator/merge");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/of");
var core_2 = require("@ngx-translate/core");
var ai_service_1 = require("./../shared/services/ai.service");
var function_app_1 = require("../shared/function-app");
var busy_state_component_1 = require("../busy-state/busy-state.component");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var portal_resources_1 = require("../shared/models/portal-resources");
var utilities_service_1 = require("../shared/services/utilities.service");
var FunctionKeysComponent = (function () {
    function FunctionKeysComponent(_broadcastService, _translateService, _utilities, _aiService) {
        var _this = this;
        this._broadcastService = _broadcastService;
        this._translateService = _translateService;
        this._utilities = _utilities;
        this._aiService = _aiService;
        this.validKey = false;
        this.keys = [];
        this.functionStream = new Subject_1.Subject();
        this.functionAppStream = new Subject_1.Subject();
        this.functionAppStream
            .merge(this.functionStream)
            .debounceTime(100)
            .switchMap(function (r) {
            var functionApp = r && r.functionApp;
            var fi;
            if (functionApp) {
                _this.functionApp = functionApp;
                fi = r;
            }
            _this.setBusyState();
            _this.resetState();
            return fi
                ? _this.functionApp.getFunctionKeys(fi).catch(function (error) { return Observable_1.Observable.of({ keys: [], links: [] }); })
                : _this.functionApp.getFunctionHostKeys().catch(function (error) { return Observable_1.Observable.of({ keys: [], links: [] }); });
        })
            .do(null, function (e) {
            _this._aiService.trackException(e, "/errors/function-keys");
            console.error(e);
        })
            .retry()
            .subscribe(function (keys) {
            _this.clearBusyState();
            keys.keys.forEach(function (k) { return k.show = false; });
            var _loop_1 = function (i) {
                newKey = keys.keys.find(function (k) { return k.name.toLocaleLowerCase() === _this.keys[i].name.toLocaleLowerCase(); });
                if (newKey) {
                    newKey.selected = _this.keys[i].selected;
                }
            };
            var newKey;
            for (var i = 0; i < _this.keys.length; i++) {
                _loop_1(i);
            }
            _this.keys = keys.keys;
        });
        this._broadcastService.subscribe(broadcast_event_1.BroadcastEvent.ResetKeySelection, function (fi) {
            if ((fi && fi === _this.functionInfo) || (!fi && !_this.functionInfo)) {
                return;
            }
            _this.keys.forEach(function (k) { return k.selected = false; });
        });
    }
    FunctionKeysComponent.prototype.ngOnInit = function () {
        this.handleInitAndChanges();
    };
    FunctionKeysComponent.prototype.ngOnChanges = function (changes) {
        this.handleInitAndChanges();
    };
    FunctionKeysComponent.prototype.handleInitAndChanges = function () {
        this.resetState();
        if (this.functionApp) {
            this.functionAppStream.next(this.functionApp);
        }
        if (this.functionInfo) {
            this.functionStream.next(this.functionInfo);
        }
    };
    FunctionKeysComponent.prototype.ngOnDestroy = function () {
        if (this.functionStream) {
            this.functionStream.unsubscribe();
        }
    };
    FunctionKeysComponent.prototype.showOrHideNewKeyUi = function () {
        if (this.addingNew) {
            this.resetState();
        }
        else {
            this.resetState();
            this.addingNew = true;
        }
    };
    FunctionKeysComponent.prototype.checkValidName = function (event) {
        var _this = this;
        setTimeout(function () {
            if (_this.newKeyName && !_this.keys.find(function (k) { return k.name.toLocaleLowerCase() === _this.newKeyName.toLocaleLowerCase(); })) {
                _this.validKey = true;
            }
            else {
                _this.validKey = false;
            }
            if (_this.validKey && event.keyCode === 13) {
                _this.saveNewKey();
            }
        }, 5);
    };
    FunctionKeysComponent.prototype.saveNewKey = function () {
        var _this = this;
        if (this.validKey) {
            this.setBusyState();
            this.functionApp
                .createKey(this.newKeyName, this.newKeyValue, this.functionInfo)
                .subscribe(function (key) {
                _this.clearBusyState();
                _this.functionStream.next(_this.functionInfo);
            }, function (e) { return _this.clearBusyState(); });
        }
    };
    FunctionKeysComponent.prototype.revokeKey = function (key) {
        var _this = this;
        if (confirm(this._translateService.instant(portal_resources_1.PortalResources.functionKeys_revokeConfirmation, { name: key.name }))) {
            this.setBusyState();
            this.functionApp
                .deleteKey(key, this.functionInfo)
                .subscribe(function (r) {
                _this.clearBusyState();
                _this.functionStream.next(_this.functionInfo);
            }, function (e) { return _this.clearBusyState(); });
        }
    };
    FunctionKeysComponent.prototype.renewKey = function (key) {
        var _this = this;
        if (confirm(this._translateService.instant(portal_resources_1.PortalResources.functionKeys_renewConfirmation, { name: key.name }))) {
            this.setBusyState();
            this.functionApp
                .renewKey(key, this.functionInfo)
                .subscribe(function (r) {
                _this.clearBusyState();
                _this.functionStream.next(_this.functionInfo);
            }, function (e) { return _this.clearBusyState(); });
        }
    };
    FunctionKeysComponent.prototype.copyKey = function (key) {
        this._utilities.copyContentToClipboard(key.value);
    };
    FunctionKeysComponent.prototype.resetState = function () {
        delete this.validKey;
        delete this.addingNew;
        delete this.newKeyName;
        delete this.newKeyValue;
    };
    FunctionKeysComponent.prototype.setBusyState = function () {
        if (this.busyState) {
            this.busyState.setBusyState();
        }
    };
    FunctionKeysComponent.prototype.clearBusyState = function () {
        if (this.busyState) {
            this.busyState.clearBusyState();
        }
    };
    return FunctionKeysComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FunctionKeysComponent.prototype, "functionInfo", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", function_app_1.FunctionApp)
], FunctionKeysComponent.prototype, "functionApp", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], FunctionKeysComponent.prototype, "autoSelect", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FunctionKeysComponent.prototype, "inputChange", void 0);
__decorate([
    core_1.ViewChild(busy_state_component_1.BusyStateComponent),
    __metadata("design:type", busy_state_component_1.BusyStateComponent)
], FunctionKeysComponent.prototype, "busyState", void 0);
FunctionKeysComponent = __decorate([
    core_1.Component({
        selector: 'function-keys',
        templateUrl: './function-keys.component.html',
        styleUrls: ['./function-keys.component.scss', '../table-function-monitor/table-function-monitor.component.scss']
    }),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService,
        core_2.TranslateService,
        utilities_service_1.UtilitiesService,
        ai_service_1.AiService])
], FunctionKeysComponent);
exports.FunctionKeysComponent = FunctionKeysComponent;
//# sourceMappingURL=function-keys.component.js.map