"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TryNowBusyStateComponent = (function () {
    function TryNowBusyStateComponent() {
    }
    TryNowBusyStateComponent.prototype.ngOnInit = function () {
        this.isIE = navigator.userAgent.toLocaleLowerCase().indexOf("trident") !== -1;
        this.inputBoltClass = "hide";
        this.inputStoreClass = "whiteFill";
        this.leftBracketClass = "fillNone";
        this.rightBracketClass = "fillNone";
        this.outerFlashClass = "fillNone";
        this.innerFlashClass = "fillNone";
        this.inputArrowClass = "whiteFill";
        this.outputArrowClass = "whiteFill";
        this.outputStoreClass = "whiteFill";
        this.nextStep();
    };
    TryNowBusyStateComponent.prototype.nextStep = function () {
        var _this = this;
        switch (this.frame) {
            case 0:
                {
                    this.inputBoltClass = "yellowFill";
                    this.inputStoreClass = "yellowFill";
                    this.frame++;
                    setTimeout(function () { return _this.nextStep(); }, 100);
                    break;
                }
            case 1:
                {
                    this.inputBoltClass = "hide";
                    this.inputStoreClass = "whiteFill";
                    this.inputArrowClass = "yellowFill";
                    this.frame++;
                    setTimeout(function () { return _this.nextStep(); }, 100);
                    break;
                }
            case 2:
                {
                    this.inputArrowClass = "whiteFill";
                    this.innerFlashClass = "orangeFill";
                    this.outerFlashClass = "yellowFill";
                    this.leftBracketClass = "yellowFill";
                    this.rightBracketClass = "orangeFill";
                    this.leftBracketClass = "orangeFill";
                    this.rightBracketClass = "yellowFill";
                    this.frame++;
                    setTimeout(function () { return _this.nextStep(); }, 150);
                    break;
                }
            case 4:
            case 6:
                {
                    this.innerFlashClass = "orangeFill";
                    this.outerFlashClass = "yellowFill";
                    this.leftBracketClass = "orangeFill";
                    this.rightBracketClass = "yellowFill";
                    this.frame++;
                    setTimeout(function () { return _this.nextStep(); }, 150);
                    break;
                }
            case 3:
            case 5:
                {
                    this.innerFlashClass = "yellowFill";
                    this.outerFlashClass = "orangeFill";
                    this.leftBracketClass = "yellowFill";
                    this.rightBracketClass = "orangeFill";
                    this.frame++;
                    setTimeout(function () { return _this.nextStep(); }, 150);
                    break;
                }
            case 7:
                {
                    this.innerFlashClass = "fillNone";
                    this.outerFlashClass = "fillNone";
                    this.leftBracketClass = "fillNone";
                    this.rightBracketClass = "fillNone";
                    this.outputArrowClass = "orangeFill";
                    this.outputStoreClass = "orangeFill";
                    this.frame++;
                    setTimeout(function () { return _this.nextStep(); }, 150);
                    break;
                }
            default:
                {
                    this.outputArrowClass = "whiteFill";
                    this.outputStoreClass = "whiteFill";
                    this.frame = 0;
                    setTimeout(function () { return _this.nextStep(); }, 5);
                    break;
                }
        }
    };
    return TryNowBusyStateComponent;
}());
TryNowBusyStateComponent = __decorate([
    core_1.Component({
        selector: 'try-now-busy-state',
        templateUrl: './try-now-busy-state.component.html',
        styleUrls: ['./try-now-busy-state.component.css']
    })
], TryNowBusyStateComponent);
exports.TryNowBusyStateComponent = TryNowBusyStateComponent;
//# sourceMappingURL=try-now-busy-state.component.js.map