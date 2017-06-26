"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
require("rxjs/add/operator/do");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
var portal_resources_1 = require("./../../shared/models/portal-resources");
var global_state_service_1 = require("./../../shared/services/global-state.service");
var cache_service_1 = require("./../../shared/services/cache.service");
var ai_service_1 = require("./../../shared/services/ai.service");
var feature_item_1 = require("./../../feature-group/feature-item");
var feature_group_1 = require("./../../feature-group/feature-group");
var authz_service_1 = require("../../shared/services/authz.service");
var portal_service_1 = require("../../shared/services/portal.service");
var resourceDescriptors_1 = require("../../shared/resourceDescriptors");
var feature_item_2 = require("../../feature-group/feature-item");
var SiteManageComponent = (function () {
    function SiteManageComponent(_authZService, _portalService, _aiService, _cacheService, _globalStateService, _translateService) {
        var _this = this;
        this._authZService = _authZService;
        this._portalService = _portalService;
        this._aiService = _aiService;
        this._cacheService = _cacheService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this.searchTerm = "";
        this._viewInfoStream = new Subject_1.Subject();
        this._hasSiteWritePermissionStream = new Subject_1.Subject();
        this._hasPlanReadPermissionStream = new Subject_1.Subject();
        this.openTabEvent = new Subject_1.Subject();
        this._viewInfoStream
            .switchMap(function (viewInfo) {
            _this._viewInfo = viewInfo;
            _this._globalStateService.setBusyState();
            return _this._cacheService.getArm(viewInfo.resourceId);
        })
            .switchMap(function (r) {
            _this._globalStateService.clearBusyState();
            var traceKey = _this._viewInfo.data.siteTraceKey;
            _this._aiService.stopTrace("/site/features-tab-ready", traceKey);
            var site = r.json();
            _this._portalService.closeBlades();
            _this._descriptor = new resourceDescriptors_1.SiteDescriptor(site.id);
            _this._dynamicDisableInfo = {
                enabled: site.properties.sku !== "Dynamic",
                disableMessage: _this._translateService.instant(portal_resources_1.PortalResources.featureNotSupportedConsumption)
            };
            _this._disposeGroups();
            _this._initCol1Groups(site);
            _this._initCol2Groups(site);
            _this._initCol3Groups(site);
            var loadObs = [];
            return Observable_1.Observable.zip(_this._authZService.hasPermission(site.id, [authz_service_1.AuthzService.writeScope]), _this._authZService.hasPermission(site.properties.serverFarmId, [authz_service_1.AuthzService.readScope]), _this._authZService.hasReadOnlyLock(site.id), function (s, p, l) { return ({ hasSiteWritePermissions: s, hasPlanReadPermissions: p, hasReadOnlyLock: l }); });
        })
            .do(null, function (e) {
            _this._aiService.trackException(e, "site-manage");
        })
            .retry()
            .subscribe(function (r) {
            var hasSiteWritePermissions = r.hasSiteWritePermissions && !r.hasReadOnlyLock;
            var siteWriteDisabledMessage = "";
            if (!r.hasSiteWritePermissions) {
                siteWriteDisabledMessage = _this._translateService.instant(portal_resources_1.PortalResources.featureRequiresWritePermissionOnApp);
            }
            else if (r.hasReadOnlyLock) {
                siteWriteDisabledMessage = _this._translateService.instant(portal_resources_1.PortalResources.featureDisabledReadOnlyLockOnApp);
            }
            _this._hasSiteWritePermissionStream.next({
                enabled: r.hasSiteWritePermissions && !r.hasReadOnlyLock,
                disableMessage: siteWriteDisabledMessage
            });
            _this._hasPlanReadPermissionStream.next({
                enabled: r.hasPlanReadPermissions,
                disableMessage: _this._translateService.instant(portal_resources_1.PortalResources.featureDisabledNoPermissionToPlan)
            });
        });
    }
    Object.defineProperty(SiteManageComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this._viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    SiteManageComponent.prototype.ngOnDestroy = function () {
        this._portalService.closeBlades();
        this._disposeGroups();
    };
    SiteManageComponent.prototype._disposeGroups = function () {
        var _this = this;
        if (this.groups1) {
            this.groups1.forEach(function (group) {
                _this._disposeGroup(group);
            });
        }
        if (this.groups2) {
            this.groups2.forEach(function (group) {
                _this._disposeGroup(group);
            });
        }
        if (this.groups3) {
            this.groups3.forEach(function (group) {
                _this._disposeGroup(group);
            });
        }
    };
    SiteManageComponent.prototype._disposeGroup = function (group) {
        group.features.forEach(function (feature) {
            feature.dispose();
        });
    };
    SiteManageComponent.prototype._initCol1Groups = function (site) {
        var codeDeployFeatures = [
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_deploymentSourceName), this._translateService.instant(portal_resources_1.PortalResources.continuousDeployment) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.source) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.options) +
                "  github bitbucket dropbox onedrive vsts vso", this._translateService.instant(portal_resources_1.PortalResources.feature_deploymentSourceInfo), "images/deployment-source.svg", {
                detailBlade: "ContinuousDeploymentListBlade",
                detailBladeInputs: {
                    id: this._descriptor.resourceId,
                    ResourceId: this._descriptor.resourceId
                }
            }, this._portalService, this._hasSiteWritePermissionStream),
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_deploymentCredsName), this._translateService.instant(portal_resources_1.PortalResources.feature_deploymentCredsName), this._translateService.instant(portal_resources_1.PortalResources.feature_deploymentCredsInfo), "images/deployment-credentials.svg", {
                detailBlade: "FtpCredentials",
                detailBladeInputs: {
                    WebsiteId: this._descriptor.getWebsiteId()
                }
            }, this._portalService)
        ];
        var developmentToolFeatures = [
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_consoleName), this._translateService.instant(portal_resources_1.PortalResources.feature_consoleName) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.debug), this._translateService.instant(portal_resources_1.PortalResources.feature_consoleInfo), "images/console.svg", {
                detailBlade: "ConsoleBlade",
                detailBladeInputs: {
                    resourceUri: site.id
                }
            }, this._portalService, this._hasSiteWritePermissionStream),
            new OpenKuduFeature(site, this._hasSiteWritePermissionStream, this._translateService),
            new OpenEditorFeature(site, this._hasSiteWritePermissionStream, this._translateService),
            new OpenResourceExplorer(site, this._translateService),
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_extensionsName), this._translateService.instant(portal_resources_1.PortalResources.feature_extensionsName), this._translateService.instant(portal_resources_1.PortalResources.feature_extensionsInfo), "images/extensions.svg", {
                detailBlade: "SiteExtensionsListBlade",
                detailBladeInputs: {
                    WebsiteId: this._descriptor.getWebsiteId()
                }
            }, this._portalService, this._hasSiteWritePermissionStream, this._dynamicDisableInfo),
        ];
        var generalFeatures = [
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_applicationSettingsName), this._translateService.instant(portal_resources_1.PortalResources.feature_applicationSettingsName) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.connectionStrings) +
                " java php .net", this._translateService.instant(portal_resources_1.PortalResources.feature_applicationSettingsInfo), "images/application-settings.svg", {
                detailBlade: "WebsiteConfigSiteSettings",
                detailBladeInputs: {
                    resourceUri: site.id,
                }
            }, this._portalService),
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_propertiesName), this._translateService.instant(portal_resources_1.PortalResources.feature_propertiesName), this._translateService.instant(portal_resources_1.PortalResources.feature_propertiesInfo), "images/properties.svg", {
                detailBlade: "PropertySheetBlade",
                detailBladeInputs: {
                    resourceId: this._descriptor.resourceId,
                }
            }, this._portalService),
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_backupsName), this._translateService.instant(portal_resources_1.PortalResources.feature_backupsName), this._translateService.instant(portal_resources_1.PortalResources.feature_backupsInfo), "images/backups.svg", {
                detailBlade: "Backup",
                detailBladeInputs: {
                    resourceUri: site.id
                }
            }, this._portalService, this._hasSiteWritePermissionStream, this._dynamicDisableInfo),
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_allSettingsName), this._translateService.instant(portal_resources_1.PortalResources.feature_allSettingsName) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.supportRequest) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.scale), this._translateService.instant(portal_resources_1.PortalResources.feature_allSettingsInfo), "images/webapp.svg", {
                detailBlade: "AppsOverviewBlade",
                detailBladeInputs: {
                    id: site.id
                }
            }, this._portalService)
        ];
        this.groups1 = [
            new feature_group_1.FeatureGroup(this._translateService.instant(portal_resources_1.PortalResources.feature_generalSettings), generalFeatures),
            new feature_group_1.FeatureGroup(this._translateService.instant(portal_resources_1.PortalResources.feature_codeDeployment), codeDeployFeatures),
            new feature_group_1.FeatureGroup(this._translateService.instant(portal_resources_1.PortalResources.feature_developmentTools), developmentToolFeatures)
        ];
    };
    SiteManageComponent.prototype._initCol2Groups = function (site) {
        var networkFeatures = [
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_networkingName), this._translateService.instant(portal_resources_1.PortalResources.feature_networkingName) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.hybridConnections) +
                " vnet", this._translateService.instant(portal_resources_1.PortalResources.feature_networkingInfo), "images/networking.svg", {
                detailBlade: "NetworkSummaryBlade",
                detailBladeInputs: {
                    resourceUri: site.id
                }
            }, this._portalService, this._hasSiteWritePermissionStream, this._dynamicDisableInfo),
            new feature_item_1.DisableableBladeFeature("SSL", "ssl", this._translateService.instant(portal_resources_1.PortalResources.feature_sslInfo), "images/ssl.svg", {
                detailBlade: "CertificatesBlade",
                detailBladeInputs: { resourceUri: site.id }
            }, this._portalService, this._hasSiteWritePermissionStream),
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_customDomainsName), this._translateService.instant(portal_resources_1.PortalResources.feature_customDomainsName), this._translateService.instant(portal_resources_1.PortalResources.feature_customDomainsInfo), "images/custom-domains.svg", {
                detailBlade: "CustomDomainsAndSSL",
                detailBladeInputs: {
                    resourceUri: this._descriptor.resourceId,
                    BuyDomainSelected: false
                }
            }, this._portalService, this._hasSiteWritePermissionStream),
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_authName), this._translateService.instant(portal_resources_1.PortalResources.authentication) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.authorization) +
                " aad google facebook microsoft", this._translateService.instant(portal_resources_1.PortalResources.feature_authInfo), "images/authentication.svg", {
                detailBlade: "AppAuth",
                detailBladeInputs: { resourceUri: site.id }
            }, this._portalService, this._hasSiteWritePermissionStream),
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_pushNotificationsName), this._translateService.instant(portal_resources_1.PortalResources.feature_pushNotificationsName), this._translateService.instant(portal_resources_1.PortalResources.feature_pushNotificationsInfo), "images/push.svg", {
                detailBlade: "PushRegistrationBlade",
                detailBladeInputs: { resourceUri: this._descriptor.resourceId }
            }, this._portalService, this._hasSiteWritePermissionStream),
        ];
        var monitoringFeatures = [
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_diagnosticLogsName), this._translateService.instant(portal_resources_1.PortalResources.feature_diagnosticLogsName), this._translateService.instant(portal_resources_1.PortalResources.feature_diagnosticLogsInfo), "images/diagnostic-logs.svg", {
                detailBlade: "WebsiteLogsBlade",
                detailBladeInputs: { WebsiteId: this._descriptor.getWebsiteId() }
            }, this._portalService),
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_logStreamingName), this._translateService.instant(portal_resources_1.PortalResources.feature_logStreamingName), this._translateService.instant(portal_resources_1.PortalResources.feature_logStreamingInfo), "images/log-stream.svg", {
                detailBlade: "LogStreamBlade",
                detailBladeInputs: { resourceUri: site.id }
            }, this._portalService, this._hasSiteWritePermissionStream),
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_processExplorerName), this._translateService.instant(portal_resources_1.PortalResources.feature_processExplorerName), this._translateService.instant(portal_resources_1.PortalResources.feature_processExplorerInfo), "images/process-explorer.svg", {
                detailBlade: "ProcExpNewBlade",
                detailBladeInputs: { resourceUri: site.id }
            }, this._portalService, this._hasSiteWritePermissionStream),
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_securityScanningName), this._translateService.instant(portal_resources_1.PortalResources.feature_securityScanningName) + " tinfoil", this._translateService.instant(portal_resources_1.PortalResources.feature_securityScanningInfo), "images/tinfoil-flat-21px.png", {
                detailBlade: "TinfoilSecurityBlade",
                detailBladeInputs: { WebsiteId: this._descriptor.getWebsiteId() }
            }, this._portalService),
        ];
        this.groups2 = [
            new feature_group_1.FeatureGroup(this._translateService.instant(portal_resources_1.PortalResources.feature_networkingName), networkFeatures),
            new feature_group_1.FeatureGroup(this._translateService.instant(portal_resources_1.PortalResources.feature_monitoring), monitoringFeatures)
        ];
    };
    SiteManageComponent.prototype._initCol3Groups = function (site) {
        var apiManagementFeatures = [
            new feature_item_2.BladeFeature("CORS", "cors api", this._translateService.instant(portal_resources_1.PortalResources.feature_corsInfo), "images/cors.svg", {
                detailBlade: "ApiCors",
                detailBladeInputs: { resourceUri: site.id }
            }, this._portalService),
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_apiDefinitionName), this._translateService.instant(portal_resources_1.PortalResources.feature_apiDefinitionName) + " swagger", this._translateService.instant(portal_resources_1.PortalResources.feature_apiDefinitionInfo), "images/api-definition.svg", {
                detailBlade: "ApiDefinition",
                detailBladeInputs: { resourceUri: site.id }
            }, this._portalService),
        ];
        var appServicePlanFeatures = [
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.appServicePlan), this._translateService.instant(portal_resources_1.PortalResources.appServicePlan) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.scale), this._translateService.instant(portal_resources_1.PortalResources.feature_appServicePlanInfo), "images/app-service-plan.svg", {
                detailBlade: "WebHostingPlanBlade",
                detailBladeInputs: { id: site.properties.serverFarmId }
            }, this._portalService, this._hasPlanReadPermissionStream),
            new feature_item_1.DisableableBladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_quotasName), this._translateService.instant(portal_resources_1.PortalResources.feature_quotasName), this._translateService.instant(portal_resources_1.PortalResources.feature_quotasInfo), "images/quotas.svg", {
                detailBlade: "QuotasBlade",
                detailBladeInputs: {
                    resourceUri: site.id
                }
            }, this._portalService, null, this._dynamicDisableInfo),
        ];
        var resourceManagementFeatures = [
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_activityLogName), this._translateService.instant(portal_resources_1.PortalResources.feature_activityLogName) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.feature_activityLogName) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.events), this._translateService.instant(portal_resources_1.PortalResources.feature_activityLogInfo), "images/activity-log.svg", {
                detailBlade: "EventsBrowseBlade",
                detailBladeInputs: {
                    queryInputs: {
                        id: site.id
                    }
                },
                extension: "Microsoft_Azure_Monitoring"
            }, this._portalService),
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_accessControlName), this._translateService.instant(portal_resources_1.PortalResources.feature_accessControlName) + " rbac", this._translateService.instant(portal_resources_1.PortalResources.feature_accessControlInfo), "images/access-control.svg", {
                detailBlade: "UserAssignmentsV2Blade",
                detailBladeInputs: {
                    scope: site.id
                },
                extension: "Microsoft_Azure_AD"
            }, this._portalService),
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_tagsName), this._translateService.instant(portal_resources_1.PortalResources.feature_tagsName), this._translateService.instant(portal_resources_1.PortalResources.feature_tagsInfo), "images/tags.svg", {
                detailBlade: "ResourceTagsListBlade",
                detailBladeInputs: {
                    resourceId: site.id
                },
                extension: "HubsExtension"
            }, this._portalService),
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_locksName), this._translateService.instant(portal_resources_1.PortalResources.feature_locksName), this._translateService.instant(portal_resources_1.PortalResources.feature_locksInfo), "images/locks.svg", {
                detailBlade: "LocksBlade",
                detailBladeInputs: {
                    resourceId: site.id
                },
                extension: "HubsExtension"
            }, this._portalService),
            // new NotImplementedFeature("Clone app", "clone app", "Info"),  // TODO: ellhamai - Need to implent
            new feature_item_2.BladeFeature(this._translateService.instant(portal_resources_1.PortalResources.feature_automationScriptName), this._translateService.instant(portal_resources_1.PortalResources.feature_automationScriptName) +
                " " + this._translateService.instant(portal_resources_1.PortalResources.template) +
                " arm", this._translateService.instant(portal_resources_1.PortalResources.feature_automationScriptInfo), "images/automation-script.svg", {
                detailBlade: "TemplateViewerBlade",
                detailBladeInputs: {
                    options: {
                        resourceGroup: "/subscriptions/" + this._descriptor.subscription + "/resourcegroups/" + this._descriptor.resourceGroup,
                        telemetryId: "Microsoft.Web/sites"
                    },
                    stepOutput: null
                },
                extension: "HubsExtension"
            }, this._portalService),
        ];
        this.groups3 = [
            new feature_group_1.FeatureGroup(this._translateService.instant(portal_resources_1.PortalResources.feature_api), apiManagementFeatures),
            new feature_group_1.FeatureGroup(this._translateService.instant(portal_resources_1.PortalResources.appServicePlan), appServicePlanFeatures),
            new feature_group_1.FeatureGroup(this._translateService.instant(portal_resources_1.PortalResources.feature_resourceManagement), resourceManagementFeatures)
        ];
    };
    SiteManageComponent.prototype.openTab = function (tabName) {
        this.openTabEvent.next(tabName);
    };
    return SiteManageComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SiteManageComponent.prototype, "openTabEvent", void 0);
SiteManageComponent = __decorate([
    core_1.Component({
        selector: 'site-manage',
        templateUrl: './site-manage.component.html',
        styleUrls: ['./site-manage.component.scss'],
        inputs: ["viewInfoInput"]
    }),
    __metadata("design:paramtypes", [authz_service_1.AuthzService,
        portal_service_1.PortalService,
        ai_service_1.AiService,
        cache_service_1.CacheService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService])
], SiteManageComponent);
exports.SiteManageComponent = SiteManageComponent;
var OpenKuduFeature = (function (_super) {
    __extends(OpenKuduFeature, _super);
    function OpenKuduFeature(_site, disableInfoStream, _translateService) {
        var _this = _super.call(this, _translateService.instant(portal_resources_1.PortalResources.feature_advancedToolsName), _translateService.instant(portal_resources_1.PortalResources.feature_advancedToolsName) + " kudu", _translateService.instant(portal_resources_1.PortalResources.feature_advancedToolsInfo), "images/advanced-tools.svg", disableInfoStream) || this;
        _this._site = _site;
        _this._translateService = _translateService;
        return _this;
    }
    OpenKuduFeature.prototype.click = function () {
        var scmHostName = this._site.properties.hostNameSslStates.find(function (h) { return h.hostType === 1; }).name;
        window.open("https://" + scmHostName);
    };
    return OpenKuduFeature;
}(feature_item_1.DisableableFeature));
exports.OpenKuduFeature = OpenKuduFeature;
var OpenEditorFeature = (function (_super) {
    __extends(OpenEditorFeature, _super);
    function OpenEditorFeature(_site, disabledInfoStream, _translateService) {
        var _this = _super.call(this, _translateService.instant(portal_resources_1.PortalResources.feature_appServiceEditorName), _translateService.instant(portal_resources_1.PortalResources.feature_appServiceEditorName), _translateService.instant(portal_resources_1.PortalResources.feature_appServiceEditorInfo), "images/appsvc-editor.svg", disabledInfoStream) || this;
        _this._site = _site;
        _this._translateService = _translateService;
        return _this;
    }
    OpenEditorFeature.prototype.click = function () {
        var scmHostName = this._site.properties.hostNameSslStates.find(function (h) { return h.hostType === 1; }).name;
        window.open("https://" + scmHostName + "/dev");
    };
    return OpenEditorFeature;
}(feature_item_1.DisableableFeature));
exports.OpenEditorFeature = OpenEditorFeature;
var OpenResourceExplorer = (function (_super) {
    __extends(OpenResourceExplorer, _super);
    function OpenResourceExplorer(_site, _translateService) {
        var _this = _super.call(this, _translateService.instant(portal_resources_1.PortalResources.feature_resourceExplorerName), _translateService.instant(portal_resources_1.PortalResources.feature_resourceExplorerName), _translateService.instant(portal_resources_1.PortalResources.feature_resourceExplorerInfo), "images/resource-explorer.svg") || this;
        _this._site = _site;
        _this._translateService = _translateService;
        return _this;
    }
    OpenResourceExplorer.prototype.click = function () {
        window.open("https://resources.azure.com" + this._site.id);
    };
    return OpenResourceExplorer;
}(feature_item_2.FeatureItem));
exports.OpenResourceExplorer = OpenResourceExplorer;
var NotImplementedFeature = (function (_super) {
    __extends(NotImplementedFeature, _super);
    function NotImplementedFeature(title, keywords, info) {
        return _super.call(this, title, keywords, info) || this;
    }
    NotImplementedFeature.prototype.click = function () {
        alert("Not implemented");
    };
    return NotImplementedFeature;
}(feature_item_2.FeatureItem));
exports.NotImplementedFeature = NotImplementedFeature;
//# sourceMappingURL=site-manage.component.js.map