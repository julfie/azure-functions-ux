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
var global_state_service_1 = require("./../shared/services/global-state.service");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/timer");
var core_2 = require("@ngx-translate/core");
var ai_service_1 = require("../shared/services/ai.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var portal_service_1 = require("../shared/services/portal.service");
var error_event_1 = require("../shared/models/error-event");
var ErrorListComponent = (function () {
    // TODO: _portalService is used in the view to get sessionId. Change this when sessionId is observable.
    function ErrorListComponent(_broadcastService, _portalService, _translateService, _aiService, _globalStateService) {
        var _this = this;
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._translateService = _translateService;
        this._aiService = _aiService;
        this._globalStateService = _globalStateService;
        this.errorList = [];
        _broadcastService.subscribe(broadcast_event_1.BroadcastEvent.Error, function (error) {
            if (error && error.message && !error.message.startsWith('<!DOC')) {
                var errorItem_1 = {
                    message: error.message,
                    dateTime: new Date().toISOString(),
                    date: new Date(),
                    errorType: error.errorType,
                    errorIds: [error.errorId],
                    dismissable: error.errorType !== error_event_1.ErrorType.Fatal
                };
                var existingError = _this.errorList.find(function (e) { return e.message === errorItem_1.message; });
                if (existingError && !existingError.errorIds.find(function (e) { return e === error.errorId; })) {
                    existingError.errorIds.push(error.errorId);
                }
                else if (!existingError) {
                    _this.errorList.push(errorItem_1);
                    if (_this.errorList.find(function (e) { return e.errorType === error_event_1.ErrorType.Fatal; })) {
                        _this.errorList = _this.errorList.filter(function (e) { return e.errorType === error_event_1.ErrorType.Fatal; });
                    }
                    if (_this.errorList.find(function (e) { return e === errorItem_1; })) {
                        _this._aiService.trackEvent('/errors/portal/visibleError', {
                            error: error.details,
                            message: error.message,
                            errorId: error.errorId,
                            displayedGeneric: false.toString(),
                            appName: error.resourceId
                        });
                    }
                }
            }
            else {
                if (error) {
                    _this._aiService.trackEvent('/errors/portal/unknown', {
                        error: error.details,
                        appName: error.resourceId,
                        displayedGeneric: true.toString()
                    });
                }
                else {
                    _this._aiService.trackEvent('/errors/portal/unknown', {
                        error: 'no error info',
                        appName: error.resourceId,
                        displayedGeneric: true.toString()
                    });
                }
            }
        });
        _broadcastService.subscribe(broadcast_event_1.BroadcastEvent.ClearError, function (errorId) {
            for (var i = 0; i < _this.errorList.length; i++) {
                _this.errorList[i].errorIds = _this.errorList[i].errorIds.filter(function (e) { return e !== errorId; });
            }
            if (_this.errorList.find(function (e) { return e.errorIds.length === 0; })) {
                _this.errorList = _this.errorList.filter(function (e) { return e.errorIds.length !== 0; });
                _this._aiService.trackEvent('/errors/auto-cleared', {
                    errorId: errorId,
                });
            }
        });
        Observable_1.Observable.timer(1, 60000)
            .subscribe(function (_) {
            var cutOffTime = new Date();
            cutOffTime.setMinutes(cutOffTime.getMinutes() - 10);
            _this.errorList = _this.errorList.filter(function (e) { return e.date > cutOffTime; });
        });
    }
    ErrorListComponent.prototype.dismissError = function (index) {
        this.errorList.splice(index, 1);
    };
    return ErrorListComponent;
}());
ErrorListComponent = __decorate([
    core_1.Component({
        selector: 'error-list',
        templateUrl: './error-list.component.html',
        styleUrls: ['./error-list.component.css']
    }),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        core_2.TranslateService,
        ai_service_1.AiService,
        global_state_service_1.GlobalStateService])
], ErrorListComponent);
exports.ErrorListComponent = ErrorListComponent;
//# sourceMappingURL=error-list.component.js.map