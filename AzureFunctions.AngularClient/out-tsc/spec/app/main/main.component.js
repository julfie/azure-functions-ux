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
var MainComponent = (function () {
    function MainComponent(_userService, _globalStateService) {
        this._userService = _userService;
        this._globalStateService = _globalStateService;
        this.inIFrame = _userService.inIFrame;
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
    __metadata("design:paramtypes", [user_service_1.UserService, global_state_service_1.GlobalStateService])
], MainComponent);
exports.MainComponent = MainComponent;
//# sourceMappingURL=main.component.js.map