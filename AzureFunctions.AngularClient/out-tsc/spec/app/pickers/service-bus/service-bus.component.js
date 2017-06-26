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
var cache_service_1 = require("./../../shared/services/cache.service");
var global_state_service_1 = require("../../shared/services/global-state.service");
var function_app_1 = require("../../shared/function-app");
var resourceDescriptors_1 = require("./../../shared/resourceDescriptors");
var arm_service_1 = require("../../shared/services/arm.service");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var core_2 = require("@ngx-translate/core");
var portal_resources_1 = require("../../shared/models/portal-resources");
var OptionTypes = (function () {
    function OptionTypes() {
        this.serviceBus = "ServiceBus";
        this.custom = "Custom";
    }
    return OptionTypes;
}());
var ServiceBusComponent = (function () {
    function ServiceBusComponent(_cacheService, _armService, _globalStateService, _translateService) {
        var _this = this;
        this._cacheService = _cacheService;
        this._armService = _armService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this.optionTypes = new OptionTypes();
        this.selectInProcess = false;
        this.canSelect = false;
        this.close = new Subject_1.Subject();
        this.selectItem = new Subject_1.Subject();
        this.options = [
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.serviceBusPicker_serviceBus),
                value: this.optionTypes.serviceBus,
            },
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.eventHubPicker_custom),
                value: this.optionTypes.custom
            }
        ];
        this.option = this.optionTypes.serviceBus;
        this.optionsChange = new Subject_1.Subject();
        this.optionsChange.subscribe(function (option) {
            _this.option = option;
            _this.setSelect();
        });
    }
    Object.defineProperty(ServiceBusComponent.prototype, "functionApp", {
        set: function (functionApp) {
            var _this = this;
            this._functionApp = functionApp;
            this._descriptor = new resourceDescriptors_1.SiteDescriptor(functionApp.site.id);
            var id = "/subscriptions/" + this._descriptor.subscription + "/providers/Microsoft.ServiceBus/namespaces";
            this._cacheService.getArm(id, true).subscribe(function (r) {
                _this.namespaces = r.json();
                if (_this.namespaces.value.length > 0) {
                    _this.selectedNamespace = _this.namespaces.value[0].id;
                    _this.onChangeNamespace(_this.selectedNamespace);
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    ServiceBusComponent.prototype.onChangeNamespace = function (value) {
        var _this = this;
        this.polices = null;
        this.selectedPolicy = null;
        this._cacheService.getArm(value + "/AuthorizationRules", true).subscribe(function (r) {
            _this.polices = r.json();
            if (_this.polices.value.length > 0) {
                _this.selectedPolicy = _this.polices.value[0].id;
                _this.setSelect();
            }
        });
    };
    ServiceBusComponent.prototype.onClose = function () {
        if (!this.selectInProcess) {
            this.close.next(null);
        }
    };
    ServiceBusComponent.prototype.onSelect = function () {
        var _this = this;
        if (this.option === this.optionTypes.serviceBus) {
            if (this.selectedPolicy) {
                this.selectInProcess = true;
                this._globalStateService.setBusyState();
                var appSettingName;
                return Observable_1.Observable.zip(this._cacheService.postArm(this.selectedPolicy + '/listkeys', true, "2015-08-01"), this._cacheService.postArm(this._functionApp.site.id + "/config/appsettings/list", true), function (p, a) { return ({ keys: p, appSettings: a }); })
                    .flatMap(function (r) {
                    var namespace = _this.namespaces.value.find(function (p) { return p.id === _this.selectedNamespace; });
                    var keys = r.keys.json();
                    appSettingName = namespace.name + "_" + keys.keyName + "_SERVICEBUS";
                    var appSettingValue = keys.primaryConnectionString;
                    var appSettings = r.appSettings.json();
                    appSettings.properties[appSettingName] = appSettingValue;
                    return _this._cacheService.putArm(appSettings.id, _this._armService.websiteApiVersion, appSettings);
                })
                    .do(null, function (e) {
                    _this._globalStateService.clearBusyState();
                    _this.selectInProcess = false;
                    console.log(e);
                })
                    .subscribe(function (r) {
                    _this._globalStateService.clearBusyState();
                    _this.selectItem.next(appSettingName);
                });
            }
        }
        else {
            var appSettingName;
            var appSettingValue;
            appSettingName = this.appSettingName;
            appSettingValue = this.appSettingValue;
            if (appSettingName && appSettingValue) {
                this.selectInProcess = true;
                this._globalStateService.setBusyState();
                this._cacheService.postArm(this._functionApp.site.id + "/config/appsettings/list", true).flatMap(function (r) {
                    var appSettings = r.json();
                    appSettings.properties[appSettingName] = appSettingValue;
                    return _this._cacheService.putArm(appSettings.id, _this._armService.websiteApiVersion, appSettings);
                })
                    .do(null, function (e) {
                    _this._globalStateService.clearBusyState();
                    _this.selectInProcess = false;
                    console.log(e);
                })
                    .subscribe(function (r) {
                    _this._globalStateService.clearBusyState();
                    _this.selectItem.next(appSettingName);
                });
            }
        }
    };
    ServiceBusComponent.prototype.setSelect = function () {
        switch (this.option) {
            case this.optionTypes.custom:
                {
                    this.canSelect = !!(this.appSettingName && this.appSettingValue);
                    break;
                }
            case this.optionTypes.serviceBus:
                {
                    this.canSelect = !!(this.selectedPolicy);
                    break;
                }
        }
    };
    return ServiceBusComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ServiceBusComponent.prototype, "close", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ServiceBusComponent.prototype, "selectItem", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", function_app_1.FunctionApp),
    __metadata("design:paramtypes", [function_app_1.FunctionApp])
], ServiceBusComponent.prototype, "functionApp", null);
ServiceBusComponent = __decorate([
    core_1.Component({
        selector: 'service-bus',
        templateUrl: './service-bus.component.html',
        styleUrls: ['./../picker.scss']
    }),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        arm_service_1.ArmService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService])
], ServiceBusComponent);
exports.ServiceBusComponent = ServiceBusComponent;
//# sourceMappingURL=service-bus.component.js.map