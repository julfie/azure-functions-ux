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
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/of");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
var portal_resources_1 = require("./../../shared/models/portal-resources");
var global_state_service_1 = require("./../../shared/services/global-state.service");
var ai_service_1 = require("./../../shared/services/ai.service");
var resourceDescriptors_1 = require("./../../shared/resourceDescriptors");
var authz_service_1 = require("./../../shared/services/authz.service");
var portal_service_1 = require("./../../shared/services/portal.service");
var cache_service_1 = require("../../shared/services/cache.service");
var local_storage_service_1 = require("../../shared/services/local-storage.service");
var enabled_features_1 = require("../../shared/models/localStorage/enabled-features");
var constants_1 = require("../../shared/models/constants");
var SiteEnabledFeaturesComponent = (function () {
    function SiteEnabledFeaturesComponent(_cacheService, _storageService, _portalService, _authZService, _aiService, _translateService, _globalStateService) {
        var _this = this;
        this._cacheService = _cacheService;
        this._storageService = _storageService;
        this._portalService = _portalService;
        this._authZService = _authZService;
        this._aiService = _aiService;
        this._translateService = _translateService;
        this._globalStateService = _globalStateService;
        this.featureItems = [];
        this.componentName = new Subject_1.Subject();
        this._siteSubject = new Subject_1.Subject();
        this._siteSubject
            .distinctUntilChanged()
            .switchMap(function (site) {
            _this._site = site;
            _this.featureItems = [];
            _this.isLoading = true;
            _this._descriptor = new resourceDescriptors_1.SiteDescriptor(site.id);
            return Observable_1.Observable.zip(_this._authZService.hasPermission(site.id, [authz_service_1.AuthzService.writeScope]), _this._authZService.hasReadOnlyLock(site.id), function (w, l) { return ({ hasSiteWritePermissions: w, hasReadOnlyLock: l }); })
                .map(function (r) {
                return {
                    site: site,
                    hasSiteWritePermissions: r.hasSiteWritePermissions,
                    hasReadOnlyLock: r.hasReadOnlyLock
                };
            });
        })
            .switchMap(function (r) {
            var storageItem = _this._storageService.getItem(r.site.id + "/enabledFeatures");
            if (storageItem && storageItem.enabledFeatures && storageItem.enabledFeatures.length > 0) {
                // Even though we continue loading in the background, we get rid of the loading UI
                // in the cacheHit case.  I think this is okay since in most cases, the list of enabled
                // features won't change after the background loading is complete.
                _this.isLoading = false;
                _this._copyCachedFeaturesToF1(storageItem);
            }
            return Observable_1.Observable.zip(_this._getConfigFeatures(r.site), _this._getSiteFeatures(r.site), _this._getAuthFeatures(r.site, r.hasSiteWritePermissions, r.hasReadOnlyLock), _this._getSiteExtensions(r.site), _this._getAppInsights(r.hasSiteWritePermissions, r.hasReadOnlyLock));
        })
            .do(null, function (e) {
            if (!_this._globalStateService.showTryView) {
                _this._aiService.trackException(e, "site-enabled-features");
            }
            else {
                _this.isLoading = false;
            }
        })
            .retry()
            .subscribe(function (results) {
            _this.isLoading = false;
            var latestFeatureItems = [];
            results.forEach(function (result) {
                if (result && result.length > 0) {
                    result.forEach(function (featureItem) {
                        if (featureItem) {
                            latestFeatureItems.push(featureItem);
                        }
                    });
                }
            });
            _this._mergeFeaturesIntoF1(_this.featureItems, latestFeatureItems);
            _this._saveFeatures(_this.featureItems);
        });
    }
    Object.defineProperty(SiteEnabledFeaturesComponent.prototype, "siteInput", {
        set: function (site) {
            if (!site) {
                return;
            }
            this._siteSubject.next(site);
        },
        enumerable: true,
        configurable: true
    });
    SiteEnabledFeaturesComponent.prototype.openFeature = function (feature) {
        if (feature.componentName) {
            this.componentName.next(feature.componentName);
        }
        else if (feature.bladeInfo) {
            this._portalService.openBlade(feature.bladeInfo, "site-enabled-features");
        }
    };
    SiteEnabledFeaturesComponent.prototype._getAppInsights = function (hasSiteActionPermission, hasReadLock) {
        var _this = this;
        if (!hasSiteActionPermission || hasReadLock) {
            return Observable_1.Observable.of([]);
        }
        return Observable_1.Observable.zip(this._cacheService.postArm(this._site.id + "/config/appsettings/list"), this._cacheService.getArm("/subscriptions/" + this._descriptor.subscription + "/providers/microsoft.insights/components", false, "2015-05-01"), function (as, ai) { return ({ appSettings: as, appInsights: ai }); }).map(function (r) {
            var ikey = r.appSettings.json().properties[constants_1.Constants.instrumentationKeySettingName];
            var items = [];
            if (ikey) {
                r.appInsights.json().value.forEach(function (ai) {
                    if (ai.properties.InstrumentationKey === ikey) {
                        items.push(_this._getEnabledFeatureItem(enabled_features_1.Feature.AppInsight, ai.id));
                    }
                });
            }
            return items.length === 1 ? items : [];
        });
    };
    SiteEnabledFeaturesComponent.prototype._copyCachedFeaturesToF1 = function (storageItem) {
        var _this = this;
        storageItem.enabledFeatures.forEach(function (cachedFeatureItem) {
            var featureItem = _this._getEnabledFeatureItem(cachedFeatureItem.feature);
            if (featureItem) {
                featureItem.title = cachedFeatureItem.title;
                _this.featureItems.push(featureItem);
            }
        });
    };
    SiteEnabledFeaturesComponent.prototype._getEnabledFeatureItem = function (feature) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        switch (feature) {
            case enabled_features_1.Feature.AppInsight:
                return {
                    title: this._translateService.instant(portal_resources_1.PortalResources.featureEnabled_appInsights),
                    feature: feature,
                    iconUrl: "images/appInsights.svg",
                    bladeInfo: {
                        detailBlade: "AspNetOverview",
                        detailBladeInputs: {
                            id: args[0]
                        },
                        extension: "AppInsightsExtension"
                    }
                };
            case enabled_features_1.Feature.Cors:
                return {
                    title: this._translateService.instant(portal_resources_1.PortalResources.featureEnabled_cors).format(args),
                    feature: feature,
                    iconUrl: "images/cors.svg",
                    bladeInfo: {
                        detailBlade: "ApiCors",
                        detailBladeInputs: {
                            resourceUri: this._site.id
                        }
                    }
                };
            case enabled_features_1.Feature.DeploymentSource:
                return {
                    title: this._translateService.instant(portal_resources_1.PortalResources.featureEnabled_deploymentSource).format(args),
                    feature: feature,
                    iconUrl: "images/deployment-source.svg",
                    bladeInfo: {
                        detailBlade: "ContinuousDeploymentListBlade",
                        detailBladeInputs: {
                            id: this._site.id,
                            ResourceId: this._site.id
                        }
                    }
                };
            case enabled_features_1.Feature.Authentication:
                return {
                    title: this._translateService.instant(portal_resources_1.PortalResources.authentication),
                    feature: feature,
                    iconUrl: "images/authentication.svg",
                    bladeInfo: {
                        detailBlade: "AppAuth",
                        detailBladeInputs: {
                            resourceUri: this._site.id
                        }
                    }
                };
            case enabled_features_1.Feature.CustomDomains:
                return {
                    title: this._translateService.instant(portal_resources_1.PortalResources.feature_customDomainsName),
                    feature: feature,
                    iconUrl: "images/custom-domains.svg",
                    bladeInfo: {
                        detailBlade: "CustomDomainsAndSSL",
                        detailBladeInputs: {
                            resourceUri: this._site.id,
                            BuyDomainSelected: false
                        }
                    }
                };
            case enabled_features_1.Feature.SSLBinding:
                return {
                    title: this._translateService.instant(portal_resources_1.PortalResources.featureEnabled_sslCert),
                    feature: feature,
                    iconUrl: "images/ssl.svg",
                    bladeInfo: {
                        detailBlade: "CertificatesBlade",
                        detailBladeInputs: {
                            resourceUri: this._site.id,
                        }
                    }
                };
            case enabled_features_1.Feature.ApiDefinition:
                return {
                    title: this._translateService.instant(portal_resources_1.PortalResources.feature_apiDefinitionName),
                    feature: feature,
                    iconUrl: "images/api-definition.svg",
                    bladeInfo: {
                        detailBlade: "ApiDefinition",
                        detailBladeInputs: {
                            resourceUri: this._site.id,
                        }
                    }
                };
            case enabled_features_1.Feature.WebJobs:
                return {
                    title: this._translateService.instant(portal_resources_1.PortalResources.featureEnabled_webjobs).format(args),
                    feature: feature,
                    iconUrl: "images/webjobs.svg",
                    bladeInfo: {
                        detailBlade: "webjobsNewBlade",
                        detailBladeInputs: {
                            resourceUri: this._site.id
                        }
                    },
                };
            case enabled_features_1.Feature.SiteExtensions:
                return {
                    title: this._translateService.instant(portal_resources_1.PortalResources.featureEnabled_extensions).format(args),
                    feature: feature,
                    iconUrl: "images/extensions.svg",
                    bladeInfo: {
                        detailBlade: "SiteExtensionsListBlade",
                        detailBladeInputs: {
                            WebsiteId: this._descriptor.getWebsiteId()
                        }
                    },
                };
        }
    };
    SiteEnabledFeaturesComponent.prototype._saveFeatures = function (featureItems) {
        var _this = this;
        var enabledFeatures;
        enabledFeatures = featureItems.map(function (enabledFeature) {
            _this._aiService.trackEvent('/site/enabledFeatures', {
                resourceId: _this._site.id,
                featureName: enabled_features_1.Feature[enabledFeature.feature]
            });
            return {
                title: enabledFeature.title,
                feature: enabledFeature.feature
            };
        });
        var item = {
            id: this._site.id + "/enabledFeatures",
            enabledFeatures: enabledFeatures
        };
        this._storageService.setItem(item.id, item);
    };
    SiteEnabledFeaturesComponent.prototype._mergeFeaturesIntoF1 = function (featureItems1, featureItems2) {
        var removeFeatures = [];
        featureItems1.forEach(function (f1) {
            var index = featureItems2.findIndex(function (f2) { return f2.feature === f1.feature; });
            if (index < 0) {
                removeFeatures.push(f1);
            }
        });
        removeFeatures.forEach(function (rf) {
            var removeIndex = featureItems1.indexOf(rf);
            featureItems1.splice(removeIndex, 1);
        });
        featureItems2.forEach(function (f2) {
            var featureItem = featureItems1.find(function (f1) { return f1.feature === f2.feature; });
            if (featureItem) {
                featureItem.title = f2.title;
                featureItem.bladeInfo = f2.bladeInfo;
            }
            else {
                featureItems1.push(f2);
            }
        });
    };
    SiteEnabledFeaturesComponent.prototype._getSiteFeatures = function (site) {
        var items = [];
        if (site.properties.hostNames.length > 1) {
            items.push(this._getEnabledFeatureItem(enabled_features_1.Feature.CustomDomains));
        }
        if (site.properties.hostNameSslStates.length > 2) {
            items.push(this._getEnabledFeatureItem(enabled_features_1.Feature.SSLBinding));
        }
        return Observable_1.Observable.of(items);
    };
    SiteEnabledFeaturesComponent.prototype._getConfigFeatures = function (site) {
        var _this = this;
        var configId = site.id + "/config/web";
        return this._cacheService.getArm(configId)
            .map(function (r) {
            var items = [];
            var config = r.json();
            if (config.properties.scmType !== 'None') {
                items.push(_this._getEnabledFeatureItem(enabled_features_1.Feature.DeploymentSource, config.properties.scmType));
            }
            var cors = config.properties.cors;
            if (cors
                && cors.allowedOrigins
                && cors.allowedOrigins.length > 0
                && _this._containsNonDefaultCorsRules(cors.allowedOrigins)) {
                items.push(_this._getEnabledFeatureItem(enabled_features_1.Feature.Cors, cors.allowedOrigins.length));
            }
            if (config.properties.apiDefinition && config.properties.apiDefinition.url) {
                items.push(_this._getEnabledFeatureItem(enabled_features_1.Feature.ApiDefinition));
            }
            return items;
        });
    };
    SiteEnabledFeaturesComponent.prototype._containsNonDefaultCorsRules = function (allowedOrigins) {
        var nonDefaultRule = allowedOrigins.find(function (o) {
            return o.toLowerCase() !== "https://functions.azure.com"
                && o.toLowerCase() !== "https://functions-staging.azure.com"
                && o.toLowerCase() !== "https://functions-next.azure.com";
        });
        return !!nonDefaultRule;
    };
    SiteEnabledFeaturesComponent.prototype._getAuthFeatures = function (site, hasSiteActionPermission, hasReadLock) {
        var _this = this;
        if (!hasSiteActionPermission || hasReadLock) {
            return Observable_1.Observable.of([]);
        }
        var authId = site.id + "/config/authsettings/list";
        return this._cacheService.postArm(authId)
            .map(function (r) {
            var authSettings = r.json();
            var items = null;
            if (authSettings.properties.enabled) {
                items = [_this._getEnabledFeatureItem(enabled_features_1.Feature.Authentication)];
            }
            return items;
        });
    };
    // private _getWebJobs(site : ArmObj<Site>){
    //     let webJobsId = `${site.id}/webjobs`;
    //     return this._cacheService.getArm(webJobsId)
    //         .map(r =>{
    //             let jobs : any[] = r.json().value;
    //             let items = null;
    //             if(jobs && jobs.length > 0){
    //                 items = [this._getEnabledFeatureItem(Feature.WebJobs, jobs.length)];
    //             }
    //             return items;
    //         });
    // }
    SiteEnabledFeaturesComponent.prototype._getSiteExtensions = function (site) {
        var _this = this;
        var extensionsId = site.id + "/siteExtensions";
        return this._cacheService.getArm(extensionsId)
            .map(function (r) {
            var extensions = r.json().value;
            var items = null;
            if (extensions && extensions.length > 0) {
                items = [_this._getEnabledFeatureItem(enabled_features_1.Feature.SiteExtensions, extensions.length)];
            }
            return items;
        });
    };
    return SiteEnabledFeaturesComponent;
}());
SiteEnabledFeaturesComponent = __decorate([
    core_1.Component({
        selector: 'site-enabled-features',
        templateUrl: './site-enabled-features.component.html',
        styleUrls: ['./site-enabled-features.component.scss'],
        inputs: ['siteInput'],
        outputs: ['componentName']
    })
    // First load list of enabled features from localStorage
    // Then it continues to pull from the back-end to refresh the UI
    // and update what's cached in localStorage
    ,
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        local_storage_service_1.LocalStorageService,
        portal_service_1.PortalService,
        authz_service_1.AuthzService,
        ai_service_1.AiService,
        core_2.TranslateService,
        global_state_service_1.GlobalStateService])
], SiteEnabledFeaturesComponent);
exports.SiteEnabledFeaturesComponent = SiteEnabledFeaturesComponent;
//# sourceMappingURL=site-enabled-features.component.js.map