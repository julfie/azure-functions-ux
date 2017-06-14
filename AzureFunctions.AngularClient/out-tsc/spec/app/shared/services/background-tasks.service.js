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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/concatMap");
require("rxjs/add/operator/map");
require("rxjs/add/operator/retry");
require("rxjs/add/observable/timer");
var core_2 = require("@ngx-translate/core");
var user_service_1 = require("./user.service");
var functions_service_1 = require("./functions.service");
var broadcast_service_1 = require("../services/broadcast.service");
var global_state_service_1 = require("./global-state.service");
var arm_service_1 = require("./arm.service");
var ai_service_1 = require("./ai.service");
var BackgroundTasksService = (function () {
    function BackgroundTasksService(_http, _userService, _functionsService, _broadcastService, _globalStateService, _armService, _aiService, _applicationRef, _translateService) {
        var _this = this;
        this._http = _http;
        this._userService = _userService;
        this._functionsService = _functionsService;
        this._broadcastService = _broadcastService;
        this._globalStateService = _globalStateService;
        this._armService = _armService;
        this._aiService = _aiService;
        this._applicationRef = _applicationRef;
        this._translateService = _translateService;
        if (!this._userService.inIFrame) {
            this.runNonIFrameTasks();
        }
        if (this.isIE()) {
            console.log('Detected IE, running zone.js workaround');
            setInterval(function () { return _this._applicationRef.tick(); }, 1000);
        }
    }
    BackgroundTasksService.prototype.runNonIFrameTasks = function () {
        var _this = this;
        if (this._preIFrameTasks && this._preIFrameTasks.closed) {
            this._preIFrameTasks.unsubscribe();
        }
        if (!this._globalStateService.showTryView) {
            this._preIFrameTasks = Observable_1.Observable.timer(1, 60000)
                .concatMap(function () { return _this._userService.getAndUpdateToken().retry(5); })
                .subscribe(function () { });
        }
    };
    BackgroundTasksService.prototype.isIE = function () {
        return navigator.userAgent.toLocaleLowerCase().indexOf('trident') !== -1;
    };
    return BackgroundTasksService;
}());
BackgroundTasksService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        user_service_1.UserService,
        functions_service_1.FunctionsService,
        broadcast_service_1.BroadcastService,
        global_state_service_1.GlobalStateService,
        arm_service_1.ArmService,
        ai_service_1.AiService,
        core_1.ApplicationRef,
        core_2.TranslateService])
], BackgroundTasksService);
exports.BackgroundTasksService = BackgroundTasksService;
//# sourceMappingURL=background-tasks.service.js.map