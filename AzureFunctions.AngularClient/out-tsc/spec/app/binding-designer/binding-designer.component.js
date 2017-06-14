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
var BindingDesignerComponent = (function () {
    function BindingDesignerComponent() {
        this.changedBinding = new core_1.EventEmitter();
    }
    BindingDesignerComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.currentBinding) {
            this.selectedBindingType = this.currentBinding.type;
            this.bindingOptionsMeta = this.bindings.find(function (e) { return e.name === _this.selectedBindingType; });
            if (this.bindingOptionsMeta) {
                for (var e in this.currentBinding) {
                    if (e === 'type')
                        continue;
                    var option = this.bindingOptionsMeta.options.find(function (o) { return o.name === e; });
                    if (option) {
                        option.value = this.currentBinding[e];
                    }
                    else {
                        this.bindingOptionsMeta.options.push({ name: e, value: this.currentBinding[e], type: 'string' });
                    }
                }
            }
        }
    };
    return BindingDesignerComponent;
}());
BindingDesignerComponent = __decorate([
    core_1.Component({
        selector: 'binding-designer',
        templateUrl: './binding-designer.component.html',
        styleUrls: ['./binding-designer.component.css'],
        inputs: ['currentBinding', 'bindings'],
        outputs: ['changedBinding']
    }),
    __metadata("design:paramtypes", [])
], BindingDesignerComponent);
exports.BindingDesignerComponent = BindingDesignerComponent;
//# sourceMappingURL=binding-designer.component.js.map