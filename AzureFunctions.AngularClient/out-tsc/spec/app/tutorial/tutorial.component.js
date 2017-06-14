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
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var tutorial_1 = require("../shared/models/tutorial");
var function_info_1 = require("../shared/models/function-info");
var core_2 = require("@ngx-translate/core");
var portal_resources_1 = require("../shared/models/portal-resources");
var TutorialComponent = (function () {
    function TutorialComponent(_broadcastService, _translateService) {
        var _this = this;
        this._broadcastService = _broadcastService;
        this._translateService = _translateService;
        this.currentStep = tutorial_1.TutorialStep.Off;
        this._broadcastService.subscribe(broadcast_event_1.BroadcastEvent.TutorialStep, function (event) {
            // Gets called only from intro after a template has been selected
            if (event.step === tutorial_1.TutorialStep.Waiting) {
                _this.currentStep = event.step;
                _this.initialFunction = event.functionInfo;
                var t = new function_info_1.FunctionInfoHelper();
                _this.lang = function_info_1.FunctionInfoHelper.getLanguage(event.functionInfo);
            }
            else if (_this.currentStep === tutorial_1.TutorialStep.Waiting && event.step === tutorial_1.TutorialStep.Develop) {
                _this.currentStep = event.step;
                _this.broadCastCurrentStep();
            }
        });
    }
    TutorialComponent.prototype.nextStep = function () {
        switch (this.currentStep) {
            case tutorial_1.TutorialStep.Develop:
                this.currentStep = tutorial_1.TutorialStep.Integrate;
                break;
            case tutorial_1.TutorialStep.Integrate:
                this.currentStep = tutorial_1.TutorialStep.AppSettings;
                break;
            case tutorial_1.TutorialStep.AppSettings:
                this.currentStep = tutorial_1.TutorialStep.NextSteps;
                break;
            case tutorial_1.TutorialStep.NextSteps:
                this.currentStep = tutorial_1.TutorialStep.Off;
                this.initialFunction = null;
                break;
            default:
                break;
        }
        if (this.currentStep !== tutorial_1.TutorialStep.Off) {
            this.broadCastCurrentStep();
        }
    };
    TutorialComponent.prototype.broadCastCurrentStep = function () {
        this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.TutorialStep, {
            functionInfo: this.initialFunction,
            step: this.currentStep
        });
    };
    Object.defineProperty(TutorialComponent.prototype, "buttonText", {
        get: function () {
            return this.currentStep < tutorial_1.TutorialStep.NextSteps ? this._translateService.instant(portal_resources_1.PortalResources.next) : this._translateService.instant(portal_resources_1.PortalResources.close);
        },
        enumerable: true,
        configurable: true
    });
    return TutorialComponent;
}());
TutorialComponent = __decorate([
    core_1.Component({
        selector: 'tutorial',
        templateUrl: './tutorial.component.html',
        styleUrls: ['./tutorial.component.css']
    }),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService,
        core_2.TranslateService])
], TutorialComponent);
exports.TutorialComponent = TutorialComponent;
//# sourceMappingURL=tutorial.component.js.map