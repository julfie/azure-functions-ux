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
var busy_state_component_1 = require("./../busy-state/busy-state.component");
var ai_service_1 = require("./../shared/services/ai.service");
var core_1 = require("@angular/core");
var tab_component_1 = require("../tab/tab.component");
var portal_service_1 = require("../shared/services/portal.service");
var TabsComponent = (function () {
    function TabsComponent(_portalService, _aiService) {
        this._portalService = _portalService;
        this._aiService = _aiService;
        this.tabSelected = new core_1.EventEmitter();
        this.tabClosed = new core_1.EventEmitter();
    }
    TabsComponent.prototype.ngAfterContentInit = function () {
        var activeTabs = this.tabs.filter(function (tab) { return tab.active; });
        if (activeTabs.length === 0) {
            this.selectTabHelper(this.tabs.first);
        }
    };
    TabsComponent.prototype.selectTab = function (tab) {
        this._aiService.trackEvent("/sites/open-tab", { name: tab.id });
        this.selectTabHelper(tab);
    };
    TabsComponent.prototype.closeTab = function (tab) {
        this.tabClosed.emit(tab);
        this.selectTabHelper(this.tabs.toArray()[0]);
    };
    TabsComponent.prototype.selectTabHelper = function (tab) {
        this.tabs.toArray().forEach(function (tab) { return tab.active = false; });
        tab.active = true;
        this.tabSelected.emit(tab);
    };
    return TabsComponent;
}());
__decorate([
    core_1.ViewChild(busy_state_component_1.BusyStateComponent),
    __metadata("design:type", busy_state_component_1.BusyStateComponent)
], TabsComponent.prototype, "busyState", void 0);
__decorate([
    core_1.ContentChildren(tab_component_1.TabComponent),
    __metadata("design:type", core_1.QueryList)
], TabsComponent.prototype, "tabs", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], TabsComponent.prototype, "tabSelected", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], TabsComponent.prototype, "tabClosed", void 0);
TabsComponent = __decorate([
    core_1.Component({
        selector: 'tabs',
        styleUrls: ['./tabs.component.scss'],
        templateUrl: './tabs.component.html'
    }),
    __metadata("design:paramtypes", [portal_service_1.PortalService,
        ai_service_1.AiService])
], TabsComponent);
exports.TabsComponent = TabsComponent;
//# sourceMappingURL=tabs.component.js.map