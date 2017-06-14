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
var SecretsBoxInputDirective = (function () {
    function SecretsBoxInputDirective() {
        this.type = 'password';
    }
    SecretsBoxInputDirective.prototype.changeType = function (type) {
        this.type = type;
    };
    return SecretsBoxInputDirective;
}());
__decorate([
    core_1.HostBinding(),
    __metadata("design:type", String)
], SecretsBoxInputDirective.prototype, "type", void 0);
SecretsBoxInputDirective = __decorate([
    core_1.Directive({
        selector: '[secrets-box-input]'
    }),
    __metadata("design:paramtypes", [])
], SecretsBoxInputDirective);
exports.SecretsBoxInputDirective = SecretsBoxInputDirective;
//# sourceMappingURL=secrets-box-input.directive.js.map