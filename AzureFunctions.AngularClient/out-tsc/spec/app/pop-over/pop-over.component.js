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
var PopOverComponent = (function () {
    function PopOverComponent() {
        this.popOverClass = "pop-over-container";
    }
    PopOverComponent.prototype.onBlur = function (event) {
        // blur() will always be called after focus(). If there is a hideAfter, then focus() will
        // take care of hiding the pop-over. Without this, blur will always hide the pop-over
        // right away ignoring hideAfter.
        if (!this.hideAfter) {
            this.show = false;
        }
        if (event.relatedTarget && this.validURL(event.relatedTarget)) {
            window.open(event.relatedTarget.toString(), '_blank' // <- This is what makes it open in a new window.
            );
        }
    };
    PopOverComponent.prototype.onFocus = function (event) {
        var _this = this;
        this.show = true;
        if (this.hideAfter) {
            setTimeout(function () {
                _this.show = false;
            }, this.hideAfter);
        }
    };
    //http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url
    PopOverComponent.prototype.validURL = function (str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locater
        if (!pattern.test(str)) {
            return false;
        }
        else {
            return true;
        }
    };
    return PopOverComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], PopOverComponent.prototype, "message", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], PopOverComponent.prototype, "hideAfter", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], PopOverComponent.prototype, "isInputError", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], PopOverComponent.prototype, "popOverClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], PopOverComponent.prototype, "position", void 0);
PopOverComponent = __decorate([
    core_1.Component({
        selector: 'pop-over',
        templateUrl: './pop-over.component.html',
        styleUrls: ['./pop-over.component.scss']
    }),
    __metadata("design:paramtypes", [])
], PopOverComponent);
exports.PopOverComponent = PopOverComponent;
//# sourceMappingURL=pop-over.component.js.map