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
var BusyStateComponent = (function () {
    function BusyStateComponent() {
        this.busy = false;
        this.isGlobal = false;
    }
    BusyStateComponent.prototype.ngOnInit = function () {
        this.isGlobal = this.name === 'global';
    };
    BusyStateComponent.prototype.setBusyState = function () {
        this.busy = true;
    };
    BusyStateComponent.prototype.clearBusyState = function () {
        this.busy = false;
    };
    Object.defineProperty(BusyStateComponent.prototype, "isBusy", {
        get: function () {
            return this.busy;
        },
        enumerable: true,
        configurable: true
    });
    return BusyStateComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], BusyStateComponent.prototype, "name", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], BusyStateComponent.prototype, "message", void 0);
BusyStateComponent = __decorate([
    core_1.Component({
        selector: 'busy-state',
        templateUrl: './busy-state.component.html',
        styleUrls: ['./busy-state.component.scss']
    })
], BusyStateComponent);
exports.BusyStateComponent = BusyStateComponent;
//# sourceMappingURL=busy-state.component.js.map