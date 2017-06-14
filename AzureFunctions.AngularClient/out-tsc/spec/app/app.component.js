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
require("rxjs/add/operator/filter");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/retry");
var busy_state_component_1 = require("./busy-state/busy-state.component");
var broadcast_service_1 = require("./shared/services/broadcast.service");
var global_state_service_1 = require("./shared/services/global-state.service");
var background_tasks_service_1 = require("./shared/services/background-tasks.service");
var portal_service_1 = require("./shared/services/portal.service");
var arm_service_1 = require("./shared/services/arm.service");
var user_service_1 = require("./shared/services/user.service");
var functions_service_1 = require("./shared/services/functions.service");
// import {MonitoringService} from './shared/services/app-monitoring.service';
// import {BackgroundTasksService} from './shared/services/background-tasks.service';
// import {GlobalStateService} from './shared/services/global-state.service';
// import {TranslateService} from '@ngx-translate/core';
// import {LocalDevelopmentInstructionsComponent} from './local-development-instructions/local-development-instructions.component';  // Com
// import {PortalResources} from './shared/models/portal-resources';
var config_service_1 = require("./shared/services/config.service");
var AppComponent = (function () {
    function AppComponent(_configService, _portalService, _armService, _userService, _functionsService, _backgroundTasksService, _globalStateService, _broadcastService) {
        this._configService = _configService;
        this._portalService = _portalService;
        this._armService = _armService;
        this._userService = _userService;
        this._functionsService = _functionsService;
        this._backgroundTasksService = _backgroundTasksService;
        this._globalStateService = _globalStateService;
        this._broadcastService = _broadcastService;
        this.ready = false;
        this.showTryLanding = window.location.pathname.endsWith('/try');
        if (_userService.inIFrame || window.location.protocol === 'http:') {
            this.gettingStarted = false;
            return;
        }
        else {
            this.gettingStarted = true;
        }
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._userService.getStartupInfo()
            .first()
            .subscribe(function (info) {
            _this._startupInfo = info;
            _this.ready = true;
            if (!_this._userService.inIFrame) {
                _this.ready = true;
                if (_this._configService.isStandalone()) {
                    _this.initializeDashboard(null);
                }
            }
        });
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        this._globalStateService.GlobalBusyStateComponent = this.busyStateComponent;
    };
    AppComponent.prototype.initializeDashboard = function (functionContainer, appSettingsAccess, authSettings) {
        this._globalStateService.setBusyState();
        if (this.redirectToIbizaIfNeeded(functionContainer)) {
            return;
        }
        if (typeof functionContainer !== 'string') {
            this._broadcastService.clearAllDirtyStates();
            if (this._startupInfo) {
                this._startupInfo.resourceId = functionContainer && functionContainer.id;
                this._userService.updateStartupInfo(this._startupInfo);
            }
            this.gettingStarted = false;
            this.showTryLanding = false;
        }
    };
    AppComponent.prototype.initializeTryDashboard = function (functionApp) {
        this._globalStateService.setBusyState();
        this._broadcastService.clearAllDirtyStates();
        this.gettingStarted = false;
        this.showTryLanding = false;
        this.tryFunctionApp = functionApp;
    };
    AppComponent.prototype.redirectToIbizaIfNeeded = function (functionContainer) {
        if (!this._userService.inIFrame &&
            this._configService.isAzure() &&
            window.location.hostname !== "localhost" &&
            window.location.search.indexOf("ibiza=disabled") === -1) {
            var armId = typeof functionContainer === 'string' ? functionContainer : functionContainer.id;
            this._globalStateService.setBusyState();
            this._userService.getTenants()
                .retry(10)
                .subscribe(function (tenants) {
                var currentTenant = tenants.find(function (t) { return t.Current; });
                var portalHostName = 'https://portal.azure.com';
                var environment = '';
                if (window.location.host.indexOf('staging') !== -1) {
                    // Temporarily redirecting FunctionsNext to use the Canary Ibiza environment.
                    environment = '?feature.fastmanifest=false&appsvc.env=stage';
                    // environment = '?websitesextension_functionsstaged=true';
                }
                else if (window.location.host.indexOf('next') !== -1) {
                    // Temporarily redirecting FunctionsNext to use the Canary Ibiza environment.
                    environment = '?feature.canmodifystamps=true&BizTalkExtension=canary&WebsitesExtension=canary&feature.fastmanifest=false&appsvc.env=next';
                    // environment = '?websitesextension_functionsnext=true';
                }
                window.location.replace(portalHostName + "/" + currentTenant.DomainName + environment + "#resource" + armId);
            });
            return true;
        }
        else {
            return false;
        }
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild(busy_state_component_1.BusyStateComponent),
    __metadata("design:type", busy_state_component_1.BusyStateComponent)
], AppComponent.prototype, "busyStateComponent", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
    }),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        portal_service_1.PortalService,
        arm_service_1.ArmService,
        user_service_1.UserService,
        functions_service_1.FunctionsService,
        background_tasks_service_1.BackgroundTasksService,
        global_state_service_1.GlobalStateService,
        broadcast_service_1.BroadcastService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map