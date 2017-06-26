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
var ai_service_1 = require("./services/ai.service");
var GlobalErrorHandler = (function () {
    function GlobalErrorHandler(_aiService) {
        this._aiService = _aiService;
    }
    GlobalErrorHandler.prototype.handleError = function (error) {
        this._aiService.trackException(error, '/errors/unhandled');
        console.error(error);
    };
    return GlobalErrorHandler;
}());
GlobalErrorHandler = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], GlobalErrorHandler);
exports.GlobalErrorHandler = GlobalErrorHandler;
//# sourceMappingURL=GlobalErrorHandler.js.map