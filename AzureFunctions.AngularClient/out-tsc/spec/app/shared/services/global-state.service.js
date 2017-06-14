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
var Subject_1 = require("rxjs/Subject");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var user_service_1 = require("./user.service");
var arm_service_1 = require("./arm.service");
var constants_1 = require("../models/constants");
var ai_service_1 = require("./ai.service");
var GlobalStateService = (function () {
    function GlobalStateService(_userService, _armService, _aiService) {
        var _this = this;
        this._userService = _userService;
        this._armService = _armService;
        this._aiService = _aiService;
        this.isAlwaysOn = true;
        this.enabledApiProxy = new BehaviorSubject_1.BehaviorSubject(false);
        this.topBarNotificationsStream = new ReplaySubject_1.ReplaySubject(1);
        this.disabledMessage = new Subject_1.Subject();
        this._globalDisabled = false;
        this._trialExpired = false;
        this._appSettings = {};
        this.showTryView = window.location.pathname.toLowerCase().endsWith('/try');
        this._userService.getStartupInfo().subscribe(function (info) { return _this._token = info.token; });
        this.enabledApiProxy.next(false);
    }
    Object.defineProperty(GlobalStateService.prototype, "FunctionContainer", {
        get: function () {
            return this._functionContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalStateService.prototype, "DefaultStorageAccount", {
        get: function () {
            for (var key in this._appSettings) {
                if (key.toString().endsWith('_STORAGE')) {
                    return key;
                }
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalStateService.prototype, "RoutingExtensionVersion", {
        // The methods below should not be in the globalstate service
        get: function () {
            return this._appSettings[constants_1.Constants.routingExtensionVersionAppSettingName];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalStateService.prototype, "IsRoutingEnabled", {
        get: function () {
            return this.RoutingExtensionVersion && this.RoutingExtensionVersion.toLowerCase() !== constants_1.Constants.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalStateService.prototype, "GlobalBusyStateComponent", {
        set: function (busyStateComponent) {
            var _this = this;
            this._globalBusyStateComponent = busyStateComponent;
            setTimeout(function () {
                if (_this._shouldBeBusy) {
                    _this._globalBusyStateComponent.setBusyState();
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    GlobalStateService.prototype.setBusyState = function (message) {
        if (this._globalBusyStateComponent) {
            this._globalBusyStateComponent.message = message;
            this._globalBusyStateComponent.setBusyState();
        }
        else {
            this._shouldBeBusy = true;
        }
    };
    GlobalStateService.prototype.clearBusyState = function () {
        if (this._globalBusyStateComponent) {
            this._globalBusyStateComponent.clearBusyState();
        }
        else {
            this._shouldBeBusy = false;
        }
    };
    Object.defineProperty(GlobalStateService.prototype, "IsBusy", {
        get: function () {
            return (this._globalBusyStateComponent && this._globalBusyStateComponent.isBusy) ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    GlobalStateService.prototype.setTopBarNotifications = function (items) {
        this.topBarNotificationsStream.next(items);
    };
    GlobalStateService.prototype.setDisabledMessage = function (message) {
        this.disabledMessage.next(message);
    };
    Object.defineProperty(GlobalStateService.prototype, "CurrentToken", {
        get: function () {
            return this._token;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalStateService.prototype, "TryAppServiceToken", {
        get: function () {
            return this._tryAppServicetoken;
        },
        set: function (tryAppServiceToken) {
            this._tryAppServicetoken = tryAppServiceToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalStateService.prototype, "GlobalDisabled", {
        get: function () {
            return this._globalDisabled;
        },
        set: function (value) {
            this._globalDisabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalStateService.prototype, "TrialExpired", {
        get: function () {
            return this._trialExpired;
        },
        set: function (value) {
            this._trialExpired = value;
        },
        enumerable: true,
        configurable: true
    });
    return GlobalStateService;
}());
GlobalStateService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        arm_service_1.ArmService,
        ai_service_1.AiService])
], GlobalStateService);
exports.GlobalStateService = GlobalStateService;
//# sourceMappingURL=global-state.service.js.map