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
//https://github.com/henkie14/angular2-show-hide-password
var core_1 = require("@angular/core");
var secrets_box_input_directive_1 = require("./secrets-box-input.directive");
var SecretsBoxContainerComponent = (function () {
    function SecretsBoxContainerComponent() {
    }
    SecretsBoxContainerComponent.prototype.toggleShow = function (event) {
        this.show = !this.show;
        if (this.show) {
            this.input.changeType("text");
        }
        else {
            this.input.changeType("password");
        }
    };
    return SecretsBoxContainerComponent;
}());
__decorate([
    core_1.ContentChild(secrets_box_input_directive_1.SecretsBoxInputDirective),
    __metadata("design:type", secrets_box_input_directive_1.SecretsBoxInputDirective)
], SecretsBoxContainerComponent.prototype, "input", void 0);
SecretsBoxContainerComponent = __decorate([
    core_1.Component({
        selector: 'secrets-box-container',
        templateUrl: './secrets-box-container.component.html',
        styleUrls: ['./secrets-box-container.component.css']
    }),
    __metadata("design:paramtypes", [])
], SecretsBoxContainerComponent);
exports.SecretsBoxContainerComponent = SecretsBoxContainerComponent;
//# sourceMappingURL=secrets-box-container.component.js.map