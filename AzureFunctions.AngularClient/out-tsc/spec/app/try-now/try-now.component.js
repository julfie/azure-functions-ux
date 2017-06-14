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
var functions_service_1 = require("../shared/services/functions.service");
var core_2 = require("@ngx-translate/core");
var portal_resources_1 = require("../shared/models/portal-resources");
var global_state_service_1 = require("../shared/services/global-state.service");
var ai_service_1 = require("../shared/services/ai.service");
var TryNowComponent = (function () {
    function TryNowComponent(_functionsService, _broadcastService, _globalStateService, _translateService, _aiService) {
        var _this = this;
        this._functionsService = _functionsService;
        this._broadcastService = _broadcastService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._aiService = _aiService;
        //TODO: Add cookie referer details like in try
        this.freeTrialUri = window.location.protocol + "//azure.microsoft.com/" + window.navigator.language + "/free";
        this.discoverMoreUri = window.location.protocol + "//azure.microsoft.com/" + window.navigator.language + "/services/functions/";
        var callBack = function () {
            window.setTimeout(function () {
                var mm;
                var now = new Date();
                var msLeft = _this.endTime.getTime() - now.getTime();
                if (_this.endTime >= now) {
                    //http://stackoverflow.com/questions/1787939/check-time-difference-in-javascript
                    mm = Math.floor(msLeft / 1000 / 60);
                    if (mm < 1) {
                        _this.timerText = (_this._translateService.instant(portal_resources_1.PortalResources.tryNow_lessThanOneMinute));
                    }
                    else {
                        _this.timerText = _this.pad(mm, 2) + ' ' + _this._translateService.instant(portal_resources_1.PortalResources.tryNow_minutes);
                    }
                    window.setTimeout(callBack, 1000);
                }
                else {
                    _this.timerText = _this._translateService.instant(portal_resources_1.PortalResources.tryNow_trialExpired);
                    _this._globalStateService.TrialExpired = true;
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.TrialExpired);
                }
            });
        };
        this._functionsService.getTrialResource()
            .subscribe(function (resource) {
            _this.uiResource = resource;
            _this.endTime = new Date();
            _this.endTime.setSeconds(_this.endTime.getSeconds() + resource.timeLeft);
            callBack();
        });
    }
    TryNowComponent.prototype.ngOnInit = function () { };
    //http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
    TryNowComponent.prototype.pad = function (n, width) {
        var z = '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };
    TryNowComponent.prototype.trackLinkClick = function (buttonName) {
        if (buttonName) {
            try {
                this._aiService.trackLinkClick(buttonName, this._globalStateService.TrialExpired.toString());
            }
            catch (error) {
                this._aiService.trackException(error, 'trackLinkClick');
            }
        }
    };
    return TryNowComponent;
}());
TryNowComponent = __decorate([
    core_1.Component({
        selector: 'try-now',
        templateUrl: './try-now.component.html',
        styleUrls: ['./try-now.component.scss']
    }),
    __metadata("design:paramtypes", [functions_service_1.FunctionsService,
        broadcast_service_1.BroadcastService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        ai_service_1.AiService])
], TryNowComponent);
exports.TryNowComponent = TryNowComponent;
//# sourceMappingURL=try-now.component.js.map