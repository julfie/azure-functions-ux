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
var edit_mode_helper_1 = require("./../../shared/Utilities/edit-mode.helper");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
var error_ids_1 = require("./../../shared/models/error-ids");
var error_event_1 = require("./../../shared/models/error-event");
var constants_1 = require("./../../shared/models/constants");
var cache_service_1 = require("./../../shared/services/cache.service");
var arm_service_1 = require("../../shared/services/arm.service");
var portal_service_1 = require("../../shared/services/portal.service");
var broadcast_service_1 = require("../../shared/services/broadcast.service");
var broadcast_event_1 = require("../../shared/models/broadcast-event");
var functions_service_1 = require("../../shared/services/functions.service");
var global_state_service_1 = require("../../shared/services/global-state.service");
var ai_service_1 = require("../../shared/services/ai.service");
var portal_resources_1 = require("../../shared/models/portal-resources");
var slots_service_1 = require("../../shared/services/slots.service");
var FunctionRuntimeComponent = (function () {
    function FunctionRuntimeComponent(_armService, _cacheService, _portalService, _broadcastService, _functionsService, _globalStateService, _aiService, _translateService, _slotsService) {
        var _this = this;
        this._armService = _armService;
        this._cacheService = _cacheService;
        this._portalService = _portalService;
        this._broadcastService = _broadcastService;
        this._functionsService = _functionsService;
        this._globalStateService = _globalStateService;
        this._aiService = _aiService;
        this._translateService = _translateService;
        this._slotsService = _slotsService;
        this.showDailyMemoryWarning = false;
        this.showDailyMemoryInfo = false;
        this._viewInfoStream = new Subject_1.Subject();
        this.functionAppEditMode = true;
        this._isSlotApp = false;
        this._numSlots = 0;
        this.showTryView = this._globalStateService.showTryView;
        this._viewInfoSub = this._viewInfoStream
            .switchMap(function (viewInfo) {
            _this._viewInfo = viewInfo;
            _this._globalStateService.setBusyState();
            _this._appNode = viewInfo.node;
            return Observable_1.Observable.zip(_this._cacheService.getArm(viewInfo.resourceId), _this._cacheService.postArm(viewInfo.resourceId + "/config/appsettings/list", true), _this._appNode.functionAppStream, _this._slotsService.getSlotsList(viewInfo.resourceId), function (s, a, fa, slots) { return ({ siteResponse: s, appSettingsResponse: a, functionApp: fa, slotsList: slots }); })
                .mergeMap(function (result) {
                return Observable_1.Observable.zip(result.functionApp.getFunctionAppEditMode(), result.functionApp.getFunctionHostStatus(), function (editMode, hostStatus) { return ({ editMode: editMode, hostStatus: hostStatus }); })
                    .map(function (r) { return ({
                    siteResponse: result.siteResponse,
                    appSettingsResponse: result.appSettingsResponse,
                    functionApp: result.functionApp,
                    editMode: r.editMode,
                    hostStatus: r.hostStatus,
                    slotsList: result.slotsList
                }); });
            });
        })
            .do(null, function (e) {
            _this._aiService.trackException(e, 'function-runtime');
        })
            .retry()
            .subscribe(function (r) {
            var appSettings = r.appSettingsResponse.json();
            _this.functionApp = r.functionApp;
            _this.site = r.siteResponse.json();
            _this.exactExtensionVersion = r.hostStatus ? r.hostStatus.version : '';
            _this._isSlotApp = slots_service_1.SlotsService.isSlot(_this.site.id);
            _this.dailyMemoryTimeQuota = _this.site.properties.dailyMemoryTimeQuota
                ? _this.site.properties.dailyMemoryTimeQuota.toString()
                : '0';
            if (_this.dailyMemoryTimeQuota === '0') {
                _this.dailyMemoryTimeQuota = '';
            }
            else {
                _this.showDailyMemoryInfo = true;
            }
            _this.dailyMemoryTimeQuotaOriginal = _this.dailyMemoryTimeQuota;
            _this.showDailyMemoryWarning = (!_this.site.properties.enabled && _this.site.properties.siteDisabledReason === 1);
            _this.memorySize = _this.site.properties.containerSize;
            _this.latestExtensionVersion = constants_1.Constants.runtimeVersion;
            _this.extensionVersion = appSettings.properties[constants_1.Constants.runtimeVersionAppSettingName];
            if (!_this.extensionVersion) {
                _this.extensionVersion = constants_1.Constants.latest;
            }
            _this.needUpdateExtensionVersion =
                constants_1.Constants.runtimeVersion !== _this.extensionVersion && constants_1.Constants.latest !== _this.extensionVersion.toLowerCase();
            _this.routingExtensionVersion = appSettings.properties[constants_1.Constants.routingExtensionVersionAppSettingName];
            if (!_this.routingExtensionVersion) {
                _this.routingExtensionVersion = constants_1.Constants.disabled;
            }
            _this.latestRoutingExtensionVersion = constants_1.Constants.routingExtensionVersion;
            _this.apiProxiesEnabled = ((_this.routingExtensionVersion) && (_this.routingExtensionVersion !== constants_1.Constants.disabled));
            _this.needUpdateRoutingExtensionVersion
                = constants_1.Constants.routingExtensionVersion !== _this.routingExtensionVersion && constants_1.Constants.latest !== _this.routingExtensionVersion.toLowerCase();
            if (edit_mode_helper_1.EditModeHelper.isReadOnly(r.editMode)) {
                _this.functionAppEditMode = false;
            }
            else {
                _this.functionAppEditMode = true;
            }
            _this._globalStateService.clearBusyState();
            var traceKey = _this._viewInfo.data.siteTraceKey;
            _this._aiService.stopTrace('/site/function-runtime-tab-ready', traceKey);
            //settings for enabling slots, display if there are no slots && appSetting property for slot is set
            _this.slotsAppSetting = appSettings.properties[constants_1.Constants.slotsSecretStorageSettingsName];
            if (_this._isSlotApp) {
                _this.slotsEnabled = true;
            }
            else {
                _this.slotsEnabled = r.slotsList.length > 0 || _this.slotsAppSetting === constants_1.Constants.slotsSecretStorageSettingsValue;
            }
        });
        this.functionStatusOptions = [
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.off),
                value: false
            }, {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.on),
                value: true
            }
        ];
        this.functionAppEditModeOptions = [
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.appFunctionSettings_readWriteMode),
                value: true
            }, {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.appFunctionSettings_readOnlyMode),
                value: false
            }
        ];
        this.slotsStatusOptions = [
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.off),
                value: false
            }, {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.on),
                value: true
            }
        ];
        this.proxySettingValueStream = new Subject_1.Subject();
        this.proxySettingValueStream
            .subscribe(function (value) {
            _this._globalStateService.setBusyState();
            var appSettingValue = value ? constants_1.Constants.routingExtensionVersion : constants_1.Constants.disabled;
            _this._cacheService.postArm(_this.site.id + "/config/appsettings/list", true)
                .mergeMap(function (r) {
                return _this._updateProxiesVersion(_this.site, r.json(), appSettingValue);
            })
                .subscribe(function (r) {
                _this.functionApp.fireSyncTrigger();
                _this.apiProxiesEnabled = value;
                _this.needUpdateRoutingExtensionVersion = false;
                _this.routingExtensionVersion = constants_1.Constants.routingExtensionVersion;
                _this._globalStateService.clearBusyState();
                _this._cacheService.clearArmIdCachePrefix(_this.site.id);
            });
        });
        this.functionEditModeValueStream = new Subject_1.Subject();
        this.functionEditModeValueStream
            .switchMap(function (state) {
            var originalState = _this.functionAppEditMode;
            _this._globalStateService.setBusyState();
            _this.functionAppEditMode = state;
            var appSetting = _this.functionAppEditMode ? constants_1.Constants.ReadWriteMode : constants_1.Constants.ReadOnlyMode;
            return _this._cacheService.postArm(_this.site.id + "/config/appsettings/list", true)
                .mergeMap(function (r) {
                var response = r.json();
                response.properties[constants_1.Constants.functionAppEditModeSettingName] = appSetting;
                return _this._cacheService.putArm(response.id, _this._armService.websiteApiVersion, response);
            })
                .catch(function (e) { throw originalState; });
        })
            .do(null, function (originalState) {
            _this.functionAppEditMode = originalState;
            _this._globalStateService.clearBusyState();
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToUpdateFunctionAppEditMode),
                errorType: error_event_1.ErrorType.ApiError,
                errorId: error_ids_1.ErrorIds.unableToUpdateFunctionAppEditMode,
                resourceId: _this.functionApp.site.id
            });
        })
            .retry()
            .mergeMap(function (_) { return _this.functionApp.getFunctionAppEditMode(); })
            .subscribe(function (fi) {
            _this._globalStateService.clearBusyState();
        });
        this.slotsValueChange = new Subject_1.Subject();
        this.slotsValueChange.subscribe(function (value) {
            _this._globalStateService.setBusyState();
            var slotsSettingsValue = value ? constants_1.Constants.slotsSecretStorageSettingsValue : constants_1.Constants.disabled;
            _this._cacheService.postArm(_this.site.id + "/config/appsettings/list", true)
                .mergeMap(function (r) {
                return _this._slotsService.setStatusOfSlotOptIn(_this.site, r.json(), slotsSettingsValue);
            })
                .do(null, function (e) {
                _this._globalStateService.clearBusyState();
                _this._aiService.trackException(e, 'function-runtime');
            })
                .retry()
                .subscribe(function (r) {
                _this.functionApp.fireSyncTrigger();
                _this.slotsEnabled = value;
                _this._globalStateService.clearBusyState();
                _this._cacheService.clearArmIdCachePrefix(_this.site.id);
            });
        });
    }
    Object.defineProperty(FunctionRuntimeComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this._viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    FunctionRuntimeComponent.prototype.onChange = function (value, event) {
        if (this.isIE()) {
            value = event.srcElement.value;
            this.memorySize = value;
        }
        this.dirty = (typeof value === 'string' ? parseInt(value, 10) : value) !== this.site.properties.containerSize;
    };
    FunctionRuntimeComponent.prototype.ngOnDestroy = function () {
        if (this._viewInfoSub) {
            this._viewInfoSub.unsubscribe();
            this._viewInfoSub = null;
        }
    };
    FunctionRuntimeComponent.prototype.saveMemorySize = function (value) {
        var _this = this;
        this._globalStateService.setBusyState();
        this._updateMemorySize(this.site, value)
            .subscribe(function (r) { _this._globalStateService.clearBusyState(); Object.assign(_this.site, r); _this.dirty = false; });
    };
    FunctionRuntimeComponent.prototype.isIE = function () {
        return navigator.userAgent.toLocaleLowerCase().indexOf('trident') !== -1;
    };
    FunctionRuntimeComponent.prototype.updateVersion = function () {
        var _this = this;
        this._aiService.trackEvent('/actions/app_settings/update_version');
        this._globalStateService.setBusyState();
        this._cacheService.postArm(this.site.id + "/config/appsettings/list", true)
            .mergeMap(function (r) {
            return _this._updateContainerVersion(_this.site, r.json());
        })
            .subscribe(function (r) {
            _this.needUpdateExtensionVersion = false;
            _this._globalStateService.clearBusyState();
            _this._cacheService.clearArmIdCachePrefix(_this.site.id);
            _this._appNode.clearNotification(constants_1.NotificationIds.newRuntimeVersion);
        });
    };
    FunctionRuntimeComponent.prototype.updateRoutingExtensionVersion = function () {
        var _this = this;
        this._aiService.trackEvent('/actions/app_settings/update_routing_version');
        this._globalStateService.setBusyState();
        this._cacheService.postArm(this.site.id + "/config/appsettings/list", true)
            .mergeMap(function (r) {
            return _this._updateProxiesVersion(_this.site, r.json());
        })
            .subscribe(function (r) {
            _this.needUpdateRoutingExtensionVersion = false;
            _this._globalStateService.clearBusyState();
            _this._cacheService.clearArmIdCachePrefix(_this.site.id);
        });
    };
    FunctionRuntimeComponent.prototype.setQuota = function () {
        var _this = this;
        if (this.dailyMemoryTimeQuotaOriginal !== this.dailyMemoryTimeQuota) {
            var dailyMemoryTimeQuota_1 = +this.dailyMemoryTimeQuota;
            if (dailyMemoryTimeQuota_1 > 0) {
                this._globalStateService.setBusyState();
                this._updateDailyMemory(this.site, dailyMemoryTimeQuota_1).subscribe(function (r) {
                    var site = r.json();
                    _this.showDailyMemoryWarning = (!site.properties.enabled && site.properties.siteDisabledReason === 1);
                    _this.showDailyMemoryInfo = true;
                    _this.site.properties.dailyMemoryTimeQuota = dailyMemoryTimeQuota_1;
                    _this.dailyMemoryTimeQuotaOriginal = _this.dailyMemoryTimeQuota;
                    _this._globalStateService.clearBusyState();
                });
            }
        }
    };
    FunctionRuntimeComponent.prototype.removeQuota = function () {
        var _this = this;
        this._globalStateService.setBusyState();
        this._updateDailyMemory(this.site, 0).subscribe(function () {
            _this.showDailyMemoryInfo = false;
            _this.showDailyMemoryWarning = false;
            _this.dailyMemoryTimeQuota = '';
            _this.dailyMemoryTimeQuotaOriginal = _this.dailyMemoryTimeQuota;
            _this.site.properties.dailyMemoryTimeQuota = 0;
            _this._globalStateService.clearBusyState();
        });
    };
    FunctionRuntimeComponent.prototype.openAppSettings = function () {
        this._portalService.openBlade({
            detailBlade: "WebsiteConfigSiteSettings",
            detailBladeInputs: {
                resourceUri: this.site.id,
            }
        }, "settings");
    };
    FunctionRuntimeComponent.prototype._updateContainerVersion = function (site, appSettings) {
        if (appSettings.properties[constants_1.Constants.azureJobsExtensionVersion]) {
            delete appSettings[constants_1.Constants.azureJobsExtensionVersion];
        }
        appSettings.properties[constants_1.Constants.runtimeVersionAppSettingName] = constants_1.Constants.runtimeVersion;
        appSettings.properties[constants_1.Constants.nodeVersionAppSettingName] = constants_1.Constants.nodeVersion;
        return this._cacheService.putArm(appSettings.id, this._armService.websiteApiVersion, appSettings);
    };
    FunctionRuntimeComponent.prototype._updateProxiesVersion = function (site, appSettings, value) {
        if (value !== constants_1.Constants.disabled) {
            this._aiService.trackEvent('/actions/proxy/enabled');
        }
        if (appSettings[constants_1.Constants.routingExtensionVersionAppSettingName]) {
            delete appSettings.properties[constants_1.Constants.routingExtensionVersionAppSettingName];
        }
        appSettings.properties[constants_1.Constants.routingExtensionVersionAppSettingName] = value ? value : constants_1.Constants.routingExtensionVersion;
        return this._cacheService.putArm(appSettings.id, this._armService.websiteApiVersion, appSettings);
    };
    FunctionRuntimeComponent.prototype._updateDailyMemory = function (site, value) {
        var body = JSON.stringify({
            Location: site.location,
            Properties: {
                dailyMemoryTimeQuota: value,
                enabled: true
            }
        });
        return this._cacheService.putArm(site.id, this._armService.websiteApiVersion, body);
    };
    FunctionRuntimeComponent.prototype._updateMemorySize = function (site, memorySize) {
        var nMemorySize = typeof memorySize === 'string' ? parseInt(memorySize, 10) : memorySize;
        site.properties.containerSize = nMemorySize;
        return this._cacheService.putArm(site.id, this._armService.websiteApiVersion, site)
            .map(function (r) { return (r.json()); });
    };
    Object.defineProperty(FunctionRuntimeComponent.prototype, "GlobalDisabled", {
        get: function () {
            return this._globalStateService.GlobalDisabled;
        },
        enumerable: true,
        configurable: true
    });
    return FunctionRuntimeComponent;
}());
__decorate([
    core_1.Input('viewInfoInput'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FunctionRuntimeComponent.prototype, "viewInfoInput", null);
FunctionRuntimeComponent = __decorate([
    core_1.Component({
        selector: 'function-runtime',
        templateUrl: './function-runtime.component.html',
        styleUrls: ['./function-runtime.component.scss']
    }),
    __metadata("design:paramtypes", [arm_service_1.ArmService,
        cache_service_1.CacheService,
        portal_service_1.PortalService,
        broadcast_service_1.BroadcastService,
        functions_service_1.FunctionsService,
        global_state_service_1.GlobalStateService,
        ai_service_1.AiService,
        core_2.TranslateService,
        slots_service_1.SlotsService])
], FunctionRuntimeComponent);
exports.FunctionRuntimeComponent = FunctionRuntimeComponent;
//# sourceMappingURL=function-runtime.component.js.map