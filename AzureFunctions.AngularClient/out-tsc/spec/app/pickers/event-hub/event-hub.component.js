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
        this.eventHub = "EventHub";
        this.IOTHub = "IOTHub";
        this.custom = "Custom";
    }
    return OptionTypes;
}());
var EventHubComponent = (function () {
    function EventHubComponent(_cacheService, _armService, _globalStateService, _translateService) {
        var _this = this;
        this._cacheService = _cacheService;
        this._armService = _armService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this.optionTypes = new OptionTypes();
        this.selectInProcess = false;
        this.canSelect = false;
        this.close = new Subject_1.Subject();
        this.select = new Subject_1.Subject();
        this.options = [
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.eventHubPicker_eventHub),
                value: this.optionTypes.eventHub,
            }, {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.eventHubPicker_IOTHub),
                value: this.optionTypes.IOTHub
            },
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.eventHubPicker_custom),
                value: this.optionTypes.custom
            }
        ];
        this.option = this.optionTypes.eventHub;
        this.optionsChange = new Subject_1.Subject();
        this.optionsChange.subscribe(function (option) {
            _this.option = option;
            _this.setSelect();
        });
    }
    Object.defineProperty(EventHubComponent.prototype, "functionApp", {
        set: function (functionApp) {
            var _this = this;
            this._functionApp = functionApp;
            this._descriptor = new resourceDescriptors_1.SiteDescriptor(functionApp.site.id);
            var id = "/subscriptions/" + this._descriptor.subscription + "/providers/Microsoft.EventHub/namespaces";
            this._cacheService.getArm(id, true).subscribe(function (r) {
                _this.namespaces = r.json();
                if (_this.namespaces.value.length > 0) {
                    _this.selectedNamespace = _this.namespaces.value[0].id;
                    _this.onChangeNamespace(_this.selectedNamespace);
                }
            });
            var devicesId = "/subscriptions/" + this._descriptor.subscription + "/providers/Microsoft.Devices/IotHubs";
            this._cacheService.getArm(devicesId, true, '2017-01-19').subscribe(function (r) {
                _this.IOTHubs = r.json();
                if (_this.IOTHubs.value.length > 0) {
                    _this.selectedIOTHub = _this.IOTHubs.value[0].id;
                    _this.onIOTHubChange(_this.selectedIOTHub);
                }
            });
        },
        enumerable: true,
        configurable: true
    });
    EventHubComponent.prototype.onChangeNamespace = function (value) {
        var _this = this;
        this.eventHubs = null;
        this.selectedEventHub = null;
        this.selectedPolicy = null;
        this._cacheService.getArm(value + "/eventHubs", true).subscribe(function (r) {
            _this.eventHubs = r.json();
            if (_this.eventHubs.value.length > 0) {
                _this.selectedEventHub = _this.eventHubs.value[0].id;
                _this.onEventHubChange(_this.selectedEventHub);
            }
            _this.setSelect();
        });
    };
    EventHubComponent.prototype.onEventHubChange = function (value) {
        var _this = this;
        this.selectedPolicy = null;
        this.polices = null;
        this._cacheService.getArm(value + "/AuthorizationRules", true).subscribe(function (r) {
            _this.polices = r.json();
            if (_this.polices.value.length > 0) {
                _this.selectedPolicy = _this.polices.value[0].id;
            }
            _this.setSelect();
        });
    };
    EventHubComponent.prototype.onIOTHubChange = function (value) {
        var _this = this;
        this.IOTEndpoints = null;
        this.selectedIOTEndpoint = null;
        Observable_1.Observable.zip(this._cacheService.postArm(value + "/listkeys", true, '2017-01-19'), this._cacheService.getArm(value, true, '2017-01-19'), function (keys, hub) { return ({ keys: keys.json(), hub: hub.json() }); }).subscribe(function (r) {
            if (r.keys.value) {
                // find service policy
                var serviceKey = r.keys.value.find(function (item) { return (item.keyName === 'iothubowner'); });
                if (serviceKey) {
                    _this.IOTEndpoints = [
                        {
                            name: _this._translateService.instant(portal_resources_1.PortalResources.eventHubPicker_IOTEvents),
                            title: 'events',
                            value: _this.getIOTConnstionString(r.hub.properties.eventHubEndpoints.events.endpoint, r.hub.properties.eventHubEndpoints.events.path, serviceKey.primaryKey)
                        },
                        {
                            name: _this._translateService.instant(portal_resources_1.PortalResources.eventHubPicker_IOTMonitoring),
                            title: 'monitoring',
                            value: _this.getIOTConnstionString(r.hub.properties.eventHubEndpoints.operationsMonitoringEvents.endpoint, r.hub.properties.eventHubEndpoints.operationsMonitoringEvents.path, serviceKey.primaryKey)
                        }
                    ];
                    _this.selectedIOTEndpoint = _this.IOTEndpoints[0].value;
                }
            }
            _this.setSelect();
        });
    };
    EventHubComponent.prototype.onClose = function () {
        if (!this.selectInProcess) {
            this.close.next(null);
        }
    };
    EventHubComponent.prototype.onSelect = function () {
        var _this = this;
        if (this.option === this.optionTypes.eventHub) {
            if (this.selectedNamespace && this.selectedEventHub && this.selectedPolicy) {
                this.selectInProcess = true;
                this._globalStateService.setBusyState();
                var appSettingName;
                return Observable_1.Observable.zip(this._cacheService.getArm(this.selectedPolicy, true, "2014-09-01"), this._cacheService.postArm(this._functionApp.site.id + "/config/appsettings/list", true), function (p, a) { return ({ policy: p, appSettings: a }); })
                    .flatMap(function (r) {
                    var namespace = _this.namespaces.value.find(function (p) { return p.id === _this.selectedNamespace; });
                    var eventHub = _this.eventHubs.value.find(function (p) { return p.id === _this.selectedEventHub; });
                    appSettingName = namespace.name + "_" + eventHub.name + "_EVENTHUB";
                    var policy = r.policy.json();
                    var appSettingValue = "Endpoint=sb://" + namespace.name + ".servicebus.windows.net/;SharedAccessKeyName=" + policy.properties.keyName + ";SharedAccessKey=" + policy.properties.primaryKey + ";EntityPath=" + eventHub.name;
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
                    _this.select.next(appSettingName);
                });
            }
        }
        else {
            var appSettingName;
            var appSettingValue;
            if (this.option === this.optionTypes.IOTHub && this.selectedIOTHub && this.selectedIOTEndpoint) {
                var IOTHub = this.IOTHubs.value.find(function (item) { return (item.id === _this.selectedIOTHub); });
                var IOTEndpoint = this.IOTEndpoints.find(function (item) { return (item.value === _this.selectedIOTEndpoint); });
                appSettingName = IOTHub.name + "_" + IOTEndpoint.title + "_IOTHUB";
                appSettingValue = IOTEndpoint.value;
            }
            else if (this.option === this.optionTypes.custom && this.appSettingName && this.appSettingValue) {
                appSettingName = this.appSettingName;
                appSettingValue = this.appSettingValue;
            }
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
                    _this.select.next(appSettingName);
                });
            }
        }
    };
    EventHubComponent.prototype.setSelect = function () {
        switch (this.option) {
            case this.optionTypes.custom:
                {
                    this.canSelect = (this.appSettingName && this.appSettingValue) ? true : false;
                    break;
                }
            case this.optionTypes.eventHub:
                {
                    this.canSelect = (this.selectedNamespace && this.selectedEventHub && this.selectedPolicy)
                        ? true : false;
                    break;
                }
            case this.optionTypes.IOTHub:
                {
                    this.canSelect = (this.selectedIOTHub && this.selectedIOTEndpoint) ? true : false;
                    break;
                }
        }
    };
    EventHubComponent.prototype.getIOTConnstionString = function (endpoint, path, key) {
        return "Endpoint=" + endpoint + ";SharedAccessKeyName=iothubowner;SharedAccessKey=" + key + ";EntityPath=" + path;
    };
    return EventHubComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], EventHubComponent.prototype, "close", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], EventHubComponent.prototype, "select", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", function_app_1.FunctionApp),
    __metadata("design:paramtypes", [function_app_1.FunctionApp])
], EventHubComponent.prototype, "functionApp", null);
EventHubComponent = __decorate([
    core_1.Component({
        selector: 'event-hub',
        templateUrl: './event-hub.component.html',
        styleUrls: ['./event-hub.component.scss']
    }),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        arm_service_1.ArmService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService])
], EventHubComponent);
exports.EventHubComponent = EventHubComponent;
//# sourceMappingURL=event-hub.component.js.map