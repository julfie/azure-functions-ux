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
var swaggerEditor_1 = require("./swaggerEditor");
var SwaggerFrameDirective = (function () {
    function SwaggerFrameDirective(elementRef, zone) {
        this.elementRef = elementRef;
        this.zone = zone;
        this.element = elementRef.nativeElement;
        this.onSwaggerEditorReady = new core_1.EventEmitter();
    }
    SwaggerFrameDirective.prototype.onFrameLoaded = function () {
        var iswaggerEditor = this.iframeElement.contentDocument["iswaggerEditor"];
        if (iswaggerEditor) {
            this.initiateSwaggerEditor(iswaggerEditor);
        }
        else {
            this.iframeElement.contentDocument.addEventListener("iswaggerEditorReady", this.onISwaggerEditorReady.bind(this));
        }
    };
    SwaggerFrameDirective.prototype.onISwaggerEditorReady = function (event) {
        this.initiateSwaggerEditor(event.detail);
    };
    SwaggerFrameDirective.prototype.initiateSwaggerEditor = function (iswaggerEditor) {
        var _this = this;
        var swaggerEditor = new swaggerEditor_1.SwaggerEditor(iswaggerEditor, this.zone);
        this.zone.run(function () {
            _this.onSwaggerEditorReady.emit(swaggerEditor);
        });
    };
    SwaggerFrameDirective.prototype.ngOnInit = function () {
        this.iframeElement = document.createElement("iframe");
        this.iframeElement.id = "SwaggerFrame";
        this.iframeElement.setAttribute("src", "../node_modules/swagger-editor/index.html");
        this.iframeElement.setAttribute("frameborder", "0");
        this.iframeElement.setAttribute("style", "width: 100%; height: 100%;");
        this.iframeElement.onload = this.onFrameLoaded.bind(this);
        this.element.appendChild(this.iframeElement);
    };
    return SwaggerFrameDirective;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], SwaggerFrameDirective.prototype, "onSwaggerEditorReady", void 0);
SwaggerFrameDirective = __decorate([
    core_1.Directive({
        selector: 'swagger-frame'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.NgZone])
], SwaggerFrameDirective);
exports.SwaggerFrameDirective = SwaggerFrameDirective;
//# sourceMappingURL=swagger-frame.directive.js.map