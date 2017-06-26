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
var tooltip_content_component_1 = require("./tooltip-content.component");
var TooltipDirective = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function TooltipDirective(viewContainerRef, resolver) {
        this.viewContainerRef = viewContainerRef;
        this.resolver = resolver;
        this.tooltipAnimation = true;
        this.tooltipPlacement = "bottom";
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    TooltipDirective.prototype.show = function () {
        if (this.tooltipDisabled || this.visible)
            return;
        this.visible = true;
        if (typeof this.content === "string") {
            var factory = this.resolver.resolveComponentFactory(tooltip_content_component_1.TooltipContentComponent);
            if (!this.visible)
                return;
            this.tooltip = this.viewContainerRef.createComponent(factory);
            this.tooltip.instance.hostElement = this.viewContainerRef.element.nativeElement;
            this.tooltip.instance.content = this.content;
            this.tooltip.instance.placement = this.tooltipPlacement;
            this.tooltip.instance.animation = this.tooltipAnimation;
        }
        else {
            var tooltip = this.content;
            tooltip.hostElement = this.viewContainerRef.element.nativeElement;
            tooltip.placement = this.tooltipPlacement;
            tooltip.animation = this.tooltipAnimation;
            tooltip.show();
        }
    };
    TooltipDirective.prototype.hide = function () {
        if (!this.visible)
            return;
        this.visible = false;
        if (this.tooltip)
            this.tooltip.destroy();
        if (this.content instanceof tooltip_content_component_1.TooltipContentComponent)
            this.content.hide();
    };
    return TooltipDirective;
}());
__decorate([
    core_1.Input("tooltip"),
    __metadata("design:type", Object)
], TooltipDirective.prototype, "content", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TooltipDirective.prototype, "tooltipDisabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TooltipDirective.prototype, "tooltipAnimation", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TooltipDirective.prototype, "tooltipPlacement", void 0);
__decorate([
    core_1.HostListener("focusin"),
    core_1.HostListener("mouseenter"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TooltipDirective.prototype, "show", null);
__decorate([
    core_1.HostListener("focusout"),
    core_1.HostListener("mouseleave"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TooltipDirective.prototype, "hide", null);
TooltipDirective = __decorate([
    core_1.Directive({
        selector: "[tooltip]"
    }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef,
        core_1.ComponentFactoryResolver])
], TooltipDirective);
exports.TooltipDirective = TooltipDirective;
//# sourceMappingURL=tooltip.directive.js.map