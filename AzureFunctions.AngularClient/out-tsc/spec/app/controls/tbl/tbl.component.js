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
var core_2 = require("@angular/core");
var TblComponent = (function () {
    function TblComponent(_componentFactoryResolver) {
        this._componentFactoryResolver = _componentFactoryResolver;
        this.tblClass = "tbl";
    }
    TblComponent.prototype.ngOnInit = function () {
    };
    TblComponent.prototype.ngOnChanges = function (changes) {
        var items = changes['items'];
        if (items) {
            this.items = items.currentValue;
            this._origItems = items.currentValue;
        }
    };
    Object.defineProperty(TblComponent.prototype, "origItems", {
        get: function () {
            return this._origItems;
        },
        enumerable: true,
        configurable: true
    });
    return TblComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TblComponent.prototype, "tblClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], TblComponent.prototype, "items", void 0);
TblComponent = __decorate([
    core_2.Component({
        selector: 'tbl',
        template: "<table [class]=\"tblClass\"><ng-content></ng-content></table>",
        exportAs: "tbl"
    }),
    __metadata("design:paramtypes", [core_2.ComponentFactoryResolver])
], TblComponent);
exports.TblComponent = TblComponent;
//# sourceMappingURL=tbl.component.js.map