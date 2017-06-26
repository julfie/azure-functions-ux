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
var function_app_1 = require("./../shared/function-app");
var core_1 = require("@angular/core");
var dashboard_type_1 = require("../tree-view/models/dashboard-type");
var user_service_1 = require("../shared/services/user.service");
var global_state_service_1 = require("../shared/services/global-state.service");
var busy_state_component_1 = require("../busy-state/busy-state.component");
var cache_service_1 = require("app/shared/services/cache.service");
var resourceDescriptors_1 = require("app/shared/resourceDescriptors");
var http_1 = require("@angular/http");
var core_2 = require("@ngx-translate/core");
;
var broadcast_service_1 = require("app/shared/services/broadcast.service");
var language_service_1 = require("app/shared/services/language.service");
var slots_service_1 = require("app/shared/services/slots.service");
var arm_service_1 = require("app/shared/services/arm.service");
var config_service_1 = require("app/shared/services/config.service");
var authz_service_1 = require("app/shared/services/authz.service");
var ai_service_1 = require("app/shared/services/ai.service");
var MainComponent = (function () {
    function MainComponent(_userService, _globalStateService, _cacheService, _ngHttp, _translateService, _broadcastService, _armService, _languageService, _authZService, _configService, _slotsService, _aiService) {
        var _this = this;
        this._userService = _userService;
        this._globalStateService = _globalStateService;
        this._cacheService = _cacheService;
        this.inTab = false;
        this.inIFrame = _userService.inIFrame;
        this.inTab = _userService.inTab; // are we in a tab
        if (this.inTab && this._userService.getStartupInfo() !== null) {
            this._userService.getStartupInfo()
                .subscribe(function (info) {
                // SiteDescriptor 
                var siteDescriptor = new resourceDescriptors_1.SiteDescriptor(info.resourceId);
                _this._cacheService.getArm(siteDescriptor.getResourceId())
                    .subscribe(function (response) {
                    var site = response.json();
                    var functionApp = new function_app_1.FunctionApp(site, _ngHttp, _userService, _globalStateService, _translateService, _broadcastService, _armService, _cacheService, _languageService, _authZService, _aiService, _configService, _slotsService);
                    functionApp.getFunctions()
                        .subscribe(function (functions) {
                        console.log(info.resourceId);
                        var fnDescriptor = new resourceDescriptors_1.FunctionDescriptor(info.resourceId);
                        var targetName = fnDescriptor.functionName;
                        // find the function that matches your resourceId
                        for (var i = 0; i < functions.length; i++) {
                            var fn = functions[i];
                            if (fn.name == targetName) {
                                // Pass that function to the editor
                                _this.selectedFunction = fn;
                                break;
                            }
                        }
                    });
                });
            });
        }
    }
    MainComponent.prototype.updateViewInfo = function (viewInfo) {
        if (!viewInfo) {
            this.viewInfo = viewInfo;
            return;
        }
        else if (viewInfo.dashboardType === dashboard_type_1.DashboardType.none) {
            return;
        }
        this.viewInfo = viewInfo;
        this.dashboardType = dashboard_type_1.DashboardType[viewInfo.dashboardType];
    };
    MainComponent.prototype.ngAfterViewInit = function () {
        this._globalStateService.clearBusyState();
        this._globalStateService.GlobalBusyStateComponent = this.busyStateComponent;
    };
    Object.defineProperty(MainComponent.prototype, "trialExpired", {
        get: function () {
            return this._globalStateService.TrialExpired;
        },
        enumerable: true,
        configurable: true
    });
    return MainComponent;
}());
__decorate([
    core_1.ViewChild(busy_state_component_1.BusyStateComponent),
    __metadata("design:type", busy_state_component_1.BusyStateComponent)
], MainComponent.prototype, "busyStateComponent", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", function_app_1.FunctionApp)
], MainComponent.prototype, "tryFunctionApp", void 0);
MainComponent = __decorate([
    core_1.Component({
        selector: 'main',
        templateUrl: './main.component.html',
        styleUrls: ['./main.component.scss']
    }),
    __metadata("design:paramtypes", [user_service_1.UserService, global_state_service_1.GlobalStateService, cache_service_1.CacheService,
        http_1.Http, core_2.TranslateService, broadcast_service_1.BroadcastService,
        arm_service_1.ArmService, language_service_1.LanguageService, authz_service_1.AuthzService,
        config_service_1.ConfigService, slots_service_1.SlotsService, ai_service_1.AiService])
], MainComponent);
exports.MainComponent = MainComponent;
//# sourceMappingURL=main.component.js.map