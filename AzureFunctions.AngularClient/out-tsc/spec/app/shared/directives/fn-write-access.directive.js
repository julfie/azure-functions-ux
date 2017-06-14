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
var edit_mode_helper_1 = require("./../Utilities/edit-mode.helper");
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/switchMap");
var FnWriteAccessDirective = (function () {
    function FnWriteAccessDirective(elementRef) {
        var _this = this;
        this.elementRef = elementRef;
        this.functionAppStream = new Subject_1.Subject();
        this.functionAppStream
            .debounceTime(100)
            .switchMap(function (fa) { return fa.getFunctionAppEditMode(); })
            .map(edit_mode_helper_1.EditModeHelper.isReadOnly)
            .subscribe(function (isReadOnly) {
            if (isReadOnly) {
                _this.elementRef.nativeElement.style.pointerEvents = 'none';
                _this.elementRef.nativeElement.disabled = true;
                _this.elementRef.nativeElement.style.opacity = '0.2';
            }
        });
    }
    Object.defineProperty(FnWriteAccessDirective.prototype, "functionApp", {
        set: function (value) {
            this.functionAppStream.next(value);
        },
        enumerable: true,
        configurable: true
    });
    return FnWriteAccessDirective;
}());
__decorate([
    core_1.Input('fnWriteAccess'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FnWriteAccessDirective.prototype, "functionApp", null);
FnWriteAccessDirective = __decorate([
    core_1.Directive({
        selector: '[fnWriteAccess]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], FnWriteAccessDirective);
exports.FnWriteAccessDirective = FnWriteAccessDirective;
//# sourceMappingURL=fn-write-access.directive.js.map