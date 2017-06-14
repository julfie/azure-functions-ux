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
var BreadcrumbsComponent = (function () {
    function BreadcrumbsComponent() {
    }
    Object.defineProperty(BreadcrumbsComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            var pathNames = viewInfo.node.getTreePathNames();
            var path = "";
            pathNames.forEach(function (name) {
                path += name + " > ";
            });
            this.path = path.substring(0, path.length - 3);
        },
        enumerable: true,
        configurable: true
    });
    return BreadcrumbsComponent;
}());
BreadcrumbsComponent = __decorate([
    core_1.Component({
        selector: 'breadcrumbs',
        templateUrl: './breadcrumbs.component.html',
        styleUrls: ['./breadcrumbs.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [])
], BreadcrumbsComponent);
exports.BreadcrumbsComponent = BreadcrumbsComponent;
//# sourceMappingURL=breadcrumbs.component.js.map