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
var global_state_service_1 = require("./../shared/services/global-state.service");
var core_1 = require("@angular/core");
var DisabledDashboardComponent = (function () {
    function DisabledDashboardComponent(globalStateService) {
        var _this = this;
        this.message = null;
        this.showTryView = false;
        globalStateService.disabledMessage.subscribe(function (message) {
            _this.message = message;
        });
        this.showTryView = globalStateService.showTryView;
    }
    DisabledDashboardComponent.prototype.ngOnInit = function () {
    };
    return DisabledDashboardComponent;
}());
DisabledDashboardComponent = __decorate([
    core_1.Component({
        selector: 'disabled-dashboard',
        templateUrl: './disabled-dashboard.component.html',
        styleUrls: ['./disabled-dashboard.component.scss']
    }),
    __metadata("design:paramtypes", [global_state_service_1.GlobalStateService])
], DisabledDashboardComponent);
exports.DisabledDashboardComponent = DisabledDashboardComponent;
//# sourceMappingURL=disabled-dashboard.component.js.map