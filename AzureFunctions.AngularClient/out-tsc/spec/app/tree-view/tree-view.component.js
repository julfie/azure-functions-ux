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
var TreeViewComponent = (function () {
    function TreeViewComponent(globalStateService) {
        this.showTryView = false;
        this.showTryView = globalStateService.showTryView;
    }
    Object.defineProperty(TreeViewComponent.prototype, "levelInput", {
        set: function (level) {
            if (level > 2) {
                var padding = level * 10 - 10;
                this.paddingLeft = padding + "px";
            }
            else {
                this.paddingLeft = "10px";
            }
            this.level = level;
        },
        enumerable: true,
        configurable: true
    });
    return TreeViewComponent;
}());
TreeViewComponent = __decorate([
    core_1.Component({
        selector: 'tree-view',
        templateUrl: './tree-view.component.html',
        styleUrls: ['./tree-view.component.scss'],
        inputs: ['node', 'levelInput']
    }),
    __metadata("design:paramtypes", [global_state_service_1.GlobalStateService])
], TreeViewComponent);
exports.TreeViewComponent = TreeViewComponent;
//# sourceMappingURL=tree-view.component.js.map