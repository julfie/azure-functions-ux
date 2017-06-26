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
var user_service_1 = require("./../../shared/services/user.service");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/do");
require("rxjs/add/operator/first");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/of");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
var config_service_1 = require("./../../shared/services/config.service");
var function_app_1 = require("./../../shared/function-app");
var portal_resources_1 = require("./../../shared/models/portal-resources");
var portal_service_1 = require("./../../shared/services/portal.service");
var constants_1 = require("./../../shared/models/constants");
var ai_service_1 = require("./../../shared/services/ai.service");
var arm_service_1 = require("./../../shared/services/arm.service");
var global_state_service_1 = require("./../../shared/services/global-state.service");
var cache_service_1 = require("../../shared/services/cache.service");
var authz_service_1 = require("../../shared/services/authz.service");
var resourceDescriptors_1 = require("../../shared/resourceDescriptors");
var slots_service_1 = require("../../shared/services/slots.service");
var SiteSummaryComponent = (function () {
    function SiteSummaryComponent(_cacheService, authZService, _armService, _globalStateService, _aiService, _portalService, _domSanitizer, ts, _configService, _slotService, userService) {
        var _this = this;
        this._cacheService = _cacheService;
        this._armService = _armService;
        this._globalStateService = _globalStateService;
        this._aiService = _aiService;
        this._portalService = _portalService;
        this._domSanitizer = _domSanitizer;
        this.ts = ts;
        this._configService = _configService;
        this._slotService = _slotService;
        this.Resources = portal_resources_1.PortalResources;
        this.showDownloadFunctionAppModal = false;
        this.openTabEvent = new Subject_1.Subject();
        this.isStandalone = _configService.isStandalone();
        userService.getStartupInfo()
            .first()
            .subscribe(function (info) {
            _this._subs = info.subscriptions;
        });
        this._viewInfoStream = new Subject_1.Subject();
        this._viewInfoStream
            .switchMap(function (viewInfo) {
            _this._viewInfo = viewInfo;
            _this._globalStateService.setBusyState();
            return _this._cacheService.getArm(viewInfo.resourceId);
        })
            .mergeMap(function (r) {
            var site = r.json();
            _this.site = site;
            var descriptor = new resourceDescriptors_1.SiteDescriptor(site.id);
            _this.subscriptionId = descriptor.subscription;
            if (_this.showTryView) {
                _this.subscriptionName = 'Trial Subscription';
            }
            else {
                _this.subscriptionName = _this._subs.find(function (s) { return s.subscriptionId === _this.subscriptionId; }).displayName;
            }
            _this.resourceGroup = descriptor.resourceGroup;
            _this.url = function_app_1.FunctionApp.getMainUrl(_this._configService, _this.site);
            _this.scmUrl = function_app_1.FunctionApp.getScmUrl(_this._configService, _this.site);
            _this.location = site.location;
            _this.state = site.properties.state;
            _this.stateIcon = _this.state === "Running" ? "images/success.svg" : "images/stopped.svg";
            _this.availabilityState = null;
            _this.availabilityMesg = _this.ts.instant(portal_resources_1.PortalResources.functionMonitor_loading);
            _this.availabilityIcon = null;
            _this.publishingUserName = _this.ts.instant(portal_resources_1.PortalResources.functionMonitor_loading);
            _this.scmType = null;
            _this.publishProfileLink = null;
            var serverFarm = site.properties.serverFarmId.split('/')[8];
            _this.plan = serverFarm + " (" + site.properties.sku.replace("Dynamic", "Consumption") + ")";
            _this._isSlot = slots_service_1.SlotsService.isSlot(site.id);
            var configId = site.id + "/config/web";
            var availabilityId = site.id + "/providers/Microsoft.ResourceHealth/availabilityStatuses/current";
            if (_this._isSlot) {
                var resourceId = site.id.substring(0, site.id.indexOf("/slots"));
                availabilityId = resourceId + "/providers/Microsoft.ResourceHealth/availabilityStatuses/current";
            }
            _this._globalStateService.clearBusyState();
            var traceKey = _this._viewInfo.data.siteTraceKey;
            _this._aiService.stopTrace("/site/overview-tab-ready", traceKey);
            _this.hideAvailability = _this._isSlot || site.properties.sku === "Dynamic";
            return Observable_1.Observable.zip(authZService.hasPermission(site.id, [authz_service_1.AuthzService.writeScope]), authZService.hasPermission(site.id, [authz_service_1.AuthzService.actionScope]), authZService.hasReadOnlyLock(site.id), _this._cacheService.getArm(configId), _this._cacheService.getArm(availabilityId, false, arm_service_1.ArmService.availabilityApiVersion).catch(function (e) {
                // this call fails with 409 is Microsoft.ResourceHealth is not registered
                if (e.status === 409) {
                    return _this._cacheService.postArm("/subscriptions/" + _this.subscriptionId + "/providers/Microsoft.ResourceHealth/register")
                        .mergeMap(function () {
                        return _this._cacheService.getArm(availabilityId, false, arm_service_1.ArmService.availabilityApiVersion);
                    })
                        .catch(function (e) {
                        return Observable_1.Observable.of(null);
                    });
                }
                return Observable_1.Observable.of(null);
            }), _this._slotService.getSlotsList(site.id), function (p, s, l, c, a, slots) { return ({
                hasWritePermission: p,
                hasSwapPermission: s,
                hasReadOnlyLock: l,
                config: c.json(),
                availability: !!a ? a.json() : null,
                slotsList: slots
            }); });
        })
            .mergeMap(function (res) {
            _this.hasWriteAccess = res.hasWritePermission && !res.hasReadOnlyLock;
            if (!_this._isSlot) {
                _this.hasSwapAccess = _this.hasWriteAccess && res.hasSwapPermission && res.slotsList.length > 0;
            }
            else {
                _this.hasSwapAccess = _this.hasWriteAccess && res.hasSwapPermission;
            }
            _this._setAvailabilityState(!!res.availability ? res.availability.properties.availabilityState : constants_1.AvailabilityStates.unknown);
            if (_this.hasWriteAccess) {
                return _this._cacheService.postArm(_this.site.id + "/config/publishingcredentials/list")
                    .map(function (r) {
                    res.publishCreds = r.json();
                    return res;
                });
            }
            return Observable_1.Observable.of(res);
        })
            .do(null, function (e) {
            _this._globalStateService.clearBusyState();
            if (!_this._globalStateService.showTryView) {
                _this._aiService.trackException(e, "site-summary");
            }
            else {
                _this._setAvailabilityState(constants_1.AvailabilityStates.available);
                _this.plan = "Trial";
            }
        })
            .retry()
            .subscribe(function (res) {
            if (!res) {
                return;
            }
            _this.scmType = res.config.properties.scmType;
            if (_this.hasWriteAccess) {
                _this.publishingUserName = res.publishCreds.properties.publishingUserName;
            }
            else {
                _this.publishingUserName = _this.ts.instant(portal_resources_1.PortalResources.noAccess);
            }
        });
    }
    Object.defineProperty(SiteSummaryComponent.prototype, "showTryView", {
        get: function () {
            return this._globalStateService.showTryView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SiteSummaryComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            if (!viewInfo) {
                return;
            }
            this._viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    SiteSummaryComponent.prototype.ngOnDestroy = function () {
        this._cleanupBlob();
    };
    SiteSummaryComponent.prototype.openComponent = function (component) {
        this.openTabEvent.next(component);
    };
    SiteSummaryComponent.prototype.toggleState = function () {
        if (!this.hasWriteAccess) {
            return;
        }
        if (this.site.properties.state === "Running") {
            var confirmResult = confirm(this.ts.instant(portal_resources_1.PortalResources.siteSummary_stopConfirmation).format(this.site.name));
            if (confirmResult) {
                this._stopOrStartSite(true);
            }
        }
        else {
            this._stopOrStartSite(false);
        }
    };
    SiteSummaryComponent.prototype.downloadPublishProfile = function (event) {
        var _this = this;
        if (!this.hasWriteAccess) {
            return;
        }
        this._armService.post(this.site.id + "/publishxml", null)
            .subscribe(function (response) {
            var publishXml = response.text();
            // http://stackoverflow.com/questions/24501358/how-to-set-a-header-for-a-http-get-request-and-trigger-file-download/24523253#24523253
            var windowUrl = window.URL || window.webkitURL;
            var blob = new Blob([publishXml], { type: 'application/octet-stream' });
            _this._cleanupBlob();
            if (window.navigator.msSaveOrOpenBlob) {
                // Currently, Edge doesn' respect the "download" attribute to name the file from blob
                // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7260192/
                window.navigator.msSaveOrOpenBlob(blob, _this.site.name + ".PublishSettings");
            }
            else {
                // http://stackoverflow.com/questions/37432609/how-to-avoid-adding-prefix-unsafe-to-link-by-angular2
                _this._blobUrl = windowUrl.createObjectURL(blob);
                _this.publishProfileLink = _this._domSanitizer.bypassSecurityTrustUrl(_this._blobUrl);
                setTimeout(function () {
                    var hiddenLink = document.getElementById("hidden-publish-profile-link");
                    hiddenLink.click();
                    _this.publishProfileLink = null;
                });
            }
        });
    };
    SiteSummaryComponent.prototype.openDownloadFunctionAppModal = function () {
        this.showDownloadFunctionAppModal = true;
    };
    SiteSummaryComponent.prototype.hideDownloadFunctionAppModal = function () {
        this.showDownloadFunctionAppModal = false;
    };
    SiteSummaryComponent.prototype._cleanupBlob = function () {
        var windowUrl = window.URL || window.webkitURL;
        if (this._blobUrl) {
            windowUrl.revokeObjectURL(this._blobUrl);
            this._blobUrl = null;
        }
    };
    SiteSummaryComponent.prototype.resetPublishCredentials = function () {
        var _this = this;
        if (!this.hasWriteAccess) {
            return;
        }
        var confirmResult = confirm(this.ts.instant(portal_resources_1.PortalResources.siteSummary_resetProfileConfirmation));
        if (confirmResult) {
            var notificationId_1 = null;
            this._globalStateService.setBusyState();
            this._portalService.startNotification(this.ts.instant(portal_resources_1.PortalResources.siteSummary_resetProfileNotifyTitle), this.ts.instant(portal_resources_1.PortalResources.siteSummary_resetProfileNotifyTitle))
                .first()
                .switchMap(function (r) {
                notificationId_1 = r.id;
                return _this._armService.post(_this.site.id + "/newpassword", null);
            })
                .subscribe(function (response) {
                _this._globalStateService.clearBusyState();
                _this._portalService.stopNotification(notificationId_1, true, _this.ts.instant(portal_resources_1.PortalResources.siteSummary_resetProfileNotifySuccess));
            }, function (e) {
                _this._globalStateService.clearBusyState();
                _this._portalService.stopNotification(notificationId_1, false, _this.ts.instant(portal_resources_1.PortalResources.siteSummary_resetProfileNotifyFail));
                _this._aiService.trackException(e, '/errors/site-summary/reset-profile');
            });
        }
    };
    SiteSummaryComponent.prototype.delete = function () {
        var _this = this;
        if (!this.hasWriteAccess) {
            return;
        }
        var confirmResult = confirm(this.ts.instant(portal_resources_1.PortalResources.siteSummary_deleteConfirmation).format(this.site.name));
        if (confirmResult) {
            var site_1 = this.site;
            var appNode_1 = this._viewInfo.node;
            var notificationId_2 = null;
            this._globalStateService.setBusyState();
            this._portalService.startNotification(this.ts.instant(portal_resources_1.PortalResources.siteSummary_deleteNotifyTitle).format(site_1.name), this.ts.instant(portal_resources_1.PortalResources.siteSummary_deleteNotifyTitle).format(site_1.name))
                .first()
                .switchMap(function (r) {
                notificationId_2 = r.id;
                // If appNode is still loading, then deleting the app before it's done could cause a race condition
                return appNode_1.initialize();
            })
                .switchMap(function () {
                appNode_1.dispose();
                return _this._armService.delete("" + site_1.id, null);
            })
                .subscribe(function (response) {
                _this._portalService.stopNotification(notificationId_2, true, _this.ts.instant(portal_resources_1.PortalResources.siteSummary_deleteNotifySuccess).format(site_1.name));
                if (!_this._isSlot) {
                    appNode_1.sideNav.search("");
                }
                _this._globalStateService.clearBusyState();
                appNode_1.parent.select();
                appNode_1.remove();
            }, function (e) {
                _this._globalStateService.clearBusyState();
                _this._portalService.stopNotification(notificationId_2, false, _this.ts.instant(portal_resources_1.PortalResources.siteSummary_deleteNotifyFail).format(site_1.name));
                _this._aiService.trackException(e, '/errors/site-summary/delete-app');
            });
        }
    };
    SiteSummaryComponent.prototype.restart = function () {
        var _this = this;
        if (!this.hasWriteAccess) {
            return;
        }
        var site = this.site;
        var notificationId = null;
        var confirmResult = confirm(this.ts.instant(portal_resources_1.PortalResources.siteSummary_restartConfirmation).format(this.site.name));
        if (confirmResult) {
            this._globalStateService.setBusyState();
            this._portalService.startNotification(this.ts.instant(portal_resources_1.PortalResources.siteSummary_restartNotifyTitle).format(site.name), this.ts.instant(portal_resources_1.PortalResources.siteSummary_restartNotifyTitle).format(site.name))
                .first()
                .switchMap(function (r) {
                notificationId = r.id;
                return _this._armService.post(site.id + "/restart", null);
            })
                .subscribe(function () {
                _this._globalStateService.clearBusyState();
                _this._portalService.stopNotification(notificationId, true, _this.ts.instant(portal_resources_1.PortalResources.siteSummary_restartNotifySuccess).format(site.name));
            }, function (e) {
                _this._globalStateService.clearBusyState();
                _this._portalService.stopNotification(notificationId, false, _this.ts.instant(portal_resources_1.PortalResources.siteSummary_restartNotifyFail).format(site.name));
                _this._aiService.trackException(e, '/errors/site-summary/restart-app');
            });
        }
    };
    SiteSummaryComponent.prototype.openSubscriptionBlade = function () {
        // You shouldn't need to reference the menu blade directly, but I think the subscription
        // blade hasn't registered its asset type properly
        this._portalService.openBlade({
            detailBlade: "ResourceMenuBlade",
            detailBladeInputs: {
                id: "/subscriptions/" + this.subscriptionId
            },
            extension: "HubsExtension"
        }, "site-summary");
    };
    SiteSummaryComponent.prototype.openResourceGroupBlade = function () {
        this._portalService.openBlade({
            detailBlade: "ResourceGroupMapBlade",
            detailBladeInputs: {
                id: "/subscriptions/" + this.subscriptionId + "/resourceGroups/" + this.resourceGroup
            },
            extension: "HubsExtension"
        }, "site-summary");
    };
    SiteSummaryComponent.prototype.openUrl = function () {
        window.open(this.url);
    };
    SiteSummaryComponent.prototype.openPlanBlade = function () {
        this._portalService.openBlade({
            detailBlade: "WebHostingPlanBlade",
            detailBladeInputs: { id: this.site.properties.serverFarmId }
        }, "site-summary");
    };
    SiteSummaryComponent.prototype._setAvailabilityState = function (availabilityState) {
        this.availabilityState = availabilityState.toLowerCase();
        switch (this.availabilityState) {
            case constants_1.AvailabilityStates.unknown:
                this.availabilityIcon = "";
                this.availabilityMesg = this.ts.instant(portal_resources_1.PortalResources.notApplicable);
                break;
            case constants_1.AvailabilityStates.unavailable:
                this.availabilityIcon = "images/error.svg";
                this.availabilityMesg = this.ts.instant(portal_resources_1.PortalResources.notAvailable);
                break;
            case constants_1.AvailabilityStates.available:
                this.availabilityIcon = "images/success.svg";
                this.availabilityMesg = this.ts.instant(portal_resources_1.PortalResources.available);
                break;
            case constants_1.AvailabilityStates.userinitiated:
                this.availabilityIcon = "images/info.svg";
                this.availabilityMesg = this.ts.instant(portal_resources_1.PortalResources.notAvailable);
                break;
        }
    };
    SiteSummaryComponent.prototype._stopOrStartSite = function (stop) {
        var _this = this;
        // Save reference to current values in case user clicks away
        var site = this.site;
        var appNode = this._viewInfo.node;
        var notificationId = null;
        var action = stop ? "stop" : "start";
        var notifyTitle = stop
            ? this.ts.instant(portal_resources_1.PortalResources.siteSummary_stopNotifyTitle).format(site.name)
            : this.ts.instant(portal_resources_1.PortalResources.siteSummary_startNotifyTitle).format(site.name);
        this._globalStateService.setBusyState();
        this._portalService.startNotification(notifyTitle, notifyTitle)
            .first()
            .switchMap(function (r) {
            notificationId = r.id;
            return _this._armService.post(site.id + "/" + action, null);
        })
            .switchMap(function () {
            return _this._cacheService.getArm("" + site.id, true);
        })
            .subscribe(function (r) {
            var refreshedSite = r.json();
            // Current site could have changed if user clicked away
            if (refreshedSite.id === _this.site.id) {
                _this.site = refreshedSite;
            }
            var notifySuccess = stop
                ? _this.ts.instant(portal_resources_1.PortalResources.siteSummary_stopNotifySuccess).format(site.name)
                : _this.ts.instant(portal_resources_1.PortalResources.siteSummary_startNotifySuccess).format(site.name);
            _this._portalService.stopNotification(notificationId, true, notifySuccess);
            appNode.refresh();
        }, function (e) {
            var notifyFail = stop
                ? _this.ts.instant(portal_resources_1.PortalResources.siteSummary_stopNotifyFail).format(site.name)
                : _this.ts.instant(portal_resources_1.PortalResources.siteSummary_startNotifyFail).format(site.name);
            _this._globalStateService.clearBusyState();
            _this._portalService.stopNotification(notificationId, false, notifyFail);
            _this._aiService.trackException(e, '/errors/site-summary/stop-start');
        });
    };
    SiteSummaryComponent.prototype.openSwapBlade = function () {
        this._portalService.openBlade({
            detailBlade: "WebsiteSlotsListBlade",
            detailBladeInputs: { resourceUri: this.site.id }
        }, "site-summary");
    };
    return SiteSummaryComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SiteSummaryComponent.prototype, "openTabEvent", void 0);
SiteSummaryComponent = __decorate([
    core_1.Component({
        selector: 'site-summary',
        templateUrl: './site-summary.component.html',
        styleUrls: ['./site-summary.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        authz_service_1.AuthzService,
        arm_service_1.ArmService,
        global_state_service_1.GlobalStateService,
        ai_service_1.AiService,
        portal_service_1.PortalService,
        platform_browser_1.DomSanitizer,
        core_2.TranslateService,
        config_service_1.ConfigService,
        slots_service_1.SlotsService,
        user_service_1.UserService])
], SiteSummaryComponent);
exports.SiteSummaryComponent = SiteSummaryComponent;
//# sourceMappingURL=site-summary.component.js.map