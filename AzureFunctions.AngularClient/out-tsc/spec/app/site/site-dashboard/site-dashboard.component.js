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
var core_2 = require("@ngx-translate/core");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/do");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/of");
require("rxjs/add/observable/zip");
var config_service_1 = require("./../../shared/services/config.service");
var portal_service_1 = require("./../../shared/services/portal.service");
var portal_resources_1 = require("./../../shared/models/portal-resources");
var ai_service_1 = require("./../../shared/services/ai.service");
var constants_1 = require("./../../shared/models/constants");
var tabs_component_1 = require("../../tabs/tabs.component");
var cache_service_1 = require("../../shared/services/cache.service");
var global_state_service_1 = require("../../shared/services/global-state.service");
var resourceDescriptors_1 = require("../../shared/resourceDescriptors");
var portal_1 = require("../../shared/models/portal");
var SiteDashboardComponent = (function () {
    function SiteDashboardComponent(_cacheService, _globalStateService, _aiService, _portalService, _translateService, _configService) {
        var _this = this;
        this._cacheService = _cacheService;
        this._globalStateService = _globalStateService;
        this._aiService = _aiService;
        this._portalService = _portalService;
        this._translateService = _translateService;
        this._configService = _configService;
        this.selectedTabId = constants_1.SiteTabIds.overview;
        this.TabIds = constants_1.SiteTabIds;
        this.Resources = portal_resources_1.PortalResources;
        this.activeComponent = "";
        this.isStandalone = false;
        this._tabsLoaded = false;
        this._traceOnTabSelection = false;
        this.isStandalone = _configService.isStandalone();
        this.viewInfoStream = new Subject_1.Subject();
        this.viewInfoStream
            .switchMap(function (viewInfo) {
            if (_this._globalStateService.showTryView) {
                _this._globalStateService.setDisabledMessage(_this._translateService.instant(portal_resources_1.PortalResources.try_appDisabled));
            }
            if (!_this._tabsLoaded) {
                // We only set to false on 1st time load because that's the only time
                // that we'll update the viewInfoStream, AND call onTabSelected.  Changing
                // tabs only calls onTabSelected, and clicking on another app will only
                // update the stream.
                _this._traceOnTabSelection = false;
            }
            viewInfo.data.siteTraceKey = _this._aiService.startTrace();
            _this._globalStateService.setBusyState();
            return Observable_1.Observable.zip(Observable_1.Observable.of(viewInfo), _this._cacheService.getArm(viewInfo.resourceId), function (v, s) { return ({ viewInfo: v, site: s }); });
        })
            .do(null, function (e) {
            var descriptor = new resourceDescriptors_1.SiteDescriptor(_this.viewInfo.resourceId);
            var message = _this._translateService.instant(portal_resources_1.PortalResources.siteDashboard_getAppError).format(descriptor.site);
            if (e && e.status === 404) {
                message = _this._translateService.instant(portal_resources_1.PortalResources.siteDashboard_appNotFound).format(descriptor.site);
            }
            _this._aiService.trackException(e, "/errors/site-dashboard");
            _this._globalStateService.setDisabledMessage(message);
            _this._globalStateService.clearBusyState();
        })
            .retry()
            .subscribe(function (r) {
            _this._globalStateService.clearBusyState();
            _this.viewInfo = r.viewInfo;
            var site = r.site.json();
            _this.site = site;
            // Is a bit hacky but seems to work well enough in waiting for the tabs to load.
            // AfterContentInit doesn't work and even if it did, it only gets called on the first
            // time the component is loaded.
            setTimeout(function () {
                var appNode = _this.viewInfo.node;
                if (appNode.openFunctionSettingsTab && _this.tabs && _this.tabs.tabs) {
                    var tabs = _this.tabs.tabs.toArray();
                    var functionTab = tabs.find(function (t) { return t.title === constants_1.SiteTabIds.functionRuntime; });
                    if (functionTab) {
                        _this.tabs.selectTab(functionTab);
                    }
                    appNode.openFunctionSettingsTab = false;
                }
            }, 100);
        });
    }
    Object.defineProperty(SiteDashboardComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this.viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    SiteDashboardComponent.prototype.onTabSelected = function (selectedTab) {
        if (this._traceOnTabSelection) {
            this.viewInfo.data.siteTraceKey = this._aiService.startTrace();
        }
        this._tabsLoaded = true;
        this._traceOnTabSelection = true;
        this.selectedTabId = selectedTab.id;
    };
    SiteDashboardComponent.prototype.onTabClosed = function (closedTab) {
        // For now only support a single dynamic tab
        this.activeComponent = "";
    };
    SiteDashboardComponent.prototype.openTab = function (component) {
        var _this = this;
        this.activeComponent = component;
        setTimeout(function () {
            var tabs = _this.tabs.tabs.toArray();
            _this.tabs.selectTab(tabs[tabs.length - 1]);
        }, 100);
    };
    SiteDashboardComponent.prototype.pinPart = function () {
        this._portalService.pinPart({
            partSize: portal_1.PartSize.Normal,
            partInput: {
                id: this.viewInfo.resourceId
            }
        });
    };
    return SiteDashboardComponent;
}());
__decorate([
    core_1.ViewChild(tabs_component_1.TabsComponent),
    __metadata("design:type", tabs_component_1.TabsComponent)
], SiteDashboardComponent.prototype, "tabs", void 0);
SiteDashboardComponent = __decorate([
    core_1.Component({
        selector: 'site-dashboard',
        templateUrl: './site-dashboard.component.html',
        styleUrls: ['./site-dashboard.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        global_state_service_1.GlobalStateService,
        ai_service_1.AiService,
        portal_service_1.PortalService,
        core_2.TranslateService,
        config_service_1.ConfigService])
], SiteDashboardComponent);
exports.SiteDashboardComponent = SiteDashboardComponent;
//# sourceMappingURL=site-dashboard.component.js.map