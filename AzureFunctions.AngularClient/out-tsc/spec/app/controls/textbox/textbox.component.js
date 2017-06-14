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
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var TextboxComponent = (function () {
    function TextboxComponent() {
        this.blur = new Subject_1.Subject();
        this.Obj = Object;
    }
    TextboxComponent.prototype.ngOnInit = function () {
    };
    TextboxComponent.prototype.onBlur = function (event) {
        this.blur.next(event);
    };
    TextboxComponent.prototype.focus = function () {
        var _this = this;
        if (this.textboxInput) {
            setTimeout(function () {
                _this.textboxInput.nativeElement.focus();
            });
        }
    };
    return TextboxComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormControl)
], TextboxComponent.prototype, "control", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TextboxComponent.prototype, "placeholder", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], TextboxComponent.prototype, "blur", void 0);
__decorate([
    core_1.ViewChild('textboxInput'),
    __metadata("design:type", Object)
], TextboxComponent.prototype, "textboxInput", void 0);
TextboxComponent = __decorate([
    core_1.Component({
        selector: 'textbox',
        templateUrl: './textbox.component.html',
        styleUrls: ['./textbox.component.scss'],
    }),
    __metadata("design:paramtypes", [])
], TextboxComponent);
exports.TextboxComponent = TextboxComponent;
//# sourceMappingURL=textbox.component.js.map