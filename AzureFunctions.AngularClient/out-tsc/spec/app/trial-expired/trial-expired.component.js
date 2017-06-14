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
var ai_service_1 = require("../shared/services/ai.service");
var TrialExpiredComponent = (function () {
    function TrialExpiredComponent(_aiService) {
        this._aiService = _aiService;
        this.freeTrialUri = window.location.protocol + "//azure.microsoft.com/" + window.navigator.language + "/free";
    }
    TrialExpiredComponent.prototype.ngOnInit = function () { };
    TrialExpiredComponent.prototype.trackLinkClick = function (buttonName) {
        if (buttonName) {
            try {
                this._aiService.trackLinkClick(buttonName, "true");
            }
            catch (error) {
                this._aiService.trackException(error, 'trackLinkClick');
            }
        }
    };
    return TrialExpiredComponent;
}());
TrialExpiredComponent = __decorate([
    core_1.Component({
        selector: 'trial-expired',
        templateUrl: './trial-expired.component.html',
        styleUrls: ['./trial-expired.component.scss']
    }),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], TrialExpiredComponent);
exports.TrialExpiredComponent = TrialExpiredComponent;
//# sourceMappingURL=trial-expired.component.js.map