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
var Subject_1 = require("rxjs/Subject");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var portal_1 = require("../models/portal");
var broadcast_service_1 = require("./broadcast.service");
var broadcast_event_1 = require("../models/broadcast-event");
var ai_service_1 = require("./ai.service");
var PortalService = (function () {
    function PortalService(_broadcastService, _aiService) {
        this._broadcastService = _broadcastService;
        this._aiService = _aiService;
        this.sessionId = "";
        this.portalSignature = "FxAppBlade";
        this.startupInfo = null;
        this.startupInfoObservable = new ReplaySubject_1.ReplaySubject(1);
        this.setupOAuthObservable = new Subject_1.Subject();
        this.notificationStartStream = new Subject_1.Subject();
        if (this.inIFrame()) {
            this.initializeIframe();
        }
    }
    PortalService.prototype.getStartupInfo = function () {
        return this.startupInfoObservable;
    };
    PortalService.prototype.setupOAuth = function (input) {
        this.postMessage(portal_1.Verbs.setupOAuth, JSON.stringify(input));
        return this.setupOAuthObservable;
    };
    PortalService.prototype.initializeIframe = function () {
        var _this = this;
        this.shellSrc = window.location.search.match(/=(.+)/)[1];
        window.addEventListener(portal_1.Verbs.message, this.iframeReceivedMsg.bind(this), false);
        var appsvc = window.appsvc;
        var getStartupInfoObj = {
            iframeHostName: appsvc && appsvc.env && appsvc.env.hostName ? appsvc.env.hostName : null
        };
        // This is a required message. It tells the shell that your iframe is ready to receive messages.
        this.postMessage(portal_1.Verbs.ready, null);
        this.postMessage(portal_1.Verbs.getStartupInfo, JSON.stringify(getStartupInfoObj));
        this._broadcastService.subscribe(broadcast_event_1.BroadcastEvent.Error, function (error) {
            if (error.details) {
                _this.logMessage(portal_1.LogEntryLevel.Error, error.details);
            }
        });
    };
    PortalService.prototype.openBlade = function (bladeInfo, source) {
        this.logAction(source, 'open-blade ' + bladeInfo.detailBlade);
        this._aiService.trackEvent('/site/open-blade', {
            targetBlade: bladeInfo.detailBlade,
            targetExtension: bladeInfo.extension,
            source: source
        });
        this.postMessage(portal_1.Verbs.openBlade, JSON.stringify(bladeInfo));
    };
    PortalService.prototype.openCollectorBlade = function (resourceId, name, source, getAppSettingCallback) {
        this.logAction(source, "open-blade-collector" + name, null);
        this._aiService.trackEvent('/site/open-collector-blade', {
            targetBlade: name,
            source: source
        });
        this.getAppSettingCallback = getAppSettingCallback;
        var payload = {
            resourceId: resourceId,
            bladeName: name
        };
        this.postMessage(portal_1.Verbs.openBladeCollector, JSON.stringify(payload));
    };
    PortalService.prototype.openCollectorBladeWithInputs = function (resourceId, obj, source, getAppSettingCallback) {
        this.logAction(source, "open-blade-collector-inputs" + obj.bladeName, null);
        this._aiService.trackEvent('/site/open-collector-blade', {
            targetBlade: obj.bladeName,
            source: source
        });
        this.getAppSettingCallback = getAppSettingCallback;
        var payload = {
            resourceId: resourceId,
            input: obj
        };
        this.postMessage(portal_1.Verbs.openBladeCollectorInputs, JSON.stringify(payload));
    };
    PortalService.prototype.closeBlades = function () {
        this.postMessage(portal_1.Verbs.closeBlades, "");
    };
    PortalService.prototype.updateBladeInfo = function (title, subtitle) {
        var payload = {
            title: title,
            subtitle: subtitle
        };
        this.postMessage(portal_1.Verbs.updateBladeInfo, JSON.stringify(payload));
    };
    PortalService.prototype.pinPart = function (pinPartInfo) {
        this.postMessage(portal_1.Verbs.pinPart, JSON.stringify(pinPartInfo));
    };
    PortalService.prototype.startNotification = function (title, description) {
        var _this = this;
        if (this.inIFrame()) {
            var payload = {
                state: "start",
                title: title,
                description: description
            };
            this.postMessage(portal_1.Verbs.setNotification, JSON.stringify(payload));
        }
        else {
            setTimeout(function () {
                _this.notificationStartStream.next({ id: "id" });
            });
        }
        return this.notificationStartStream;
    };
    PortalService.prototype.stopNotification = function (id, success, description) {
        var state = "success";
        if (!success) {
            state = "fail";
        }
        var payload = {
            id: id,
            state: state,
            title: null,
            description: description
        };
        this.postMessage(portal_1.Verbs.setNotification, JSON.stringify(payload));
    };
    PortalService.prototype.logAction = function (subcomponent, action, data) {
        var actionStr = JSON.stringify({
            subcomponent: subcomponent,
            action: action,
            data: data
        });
        this.postMessage(portal_1.Verbs.logAction, actionStr);
    };
    PortalService.prototype.setDirtyState = function (dirty) {
        this.postMessage(portal_1.Verbs.setDirtyState, JSON.stringify(dirty));
    };
    PortalService.prototype.logMessage = function (level, message) {
        var restArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            restArgs[_i - 2] = arguments[_i];
        }
        var messageStr = JSON.stringify({
            level: level,
            message: message,
            restArgs: restArgs
        });
        this.postMessage(portal_1.Verbs.logMessage, messageStr);
    };
    PortalService.prototype.iframeReceivedMsg = function (event) {
        if (!event || !event.data || event.data.signature !== this.portalSignature) {
            return;
        }
        var data = event.data.data;
        var methodName = event.data.kind;
        console.log("[iFrame] Received mesg: " + methodName);
        if (methodName === portal_1.Verbs.sendStartupInfo) {
            this.startupInfo = data;
            this.sessionId = this.startupInfo.sessionId;
            // this._userService.setToken(startupInfo.token);
            this._aiService.setSessionId(this.sessionId);
            this.startupInfoObservable.next(this.startupInfo);
        }
        else if (methodName === portal_1.Verbs.sendToken) {
            if (this.startupInfo) {
                this.startupInfo.token = data;
                this.startupInfoObservable.next(this.startupInfo);
            }
        }
        else if (methodName === portal_1.Verbs.sendAppSettingName) {
            if (this.getAppSettingCallback) {
                this.getAppSettingCallback(data);
                this.getAppSettingCallback = null;
            }
        }
        else if (methodName === portal_1.Verbs.sendOAuthInfo) {
            this.setupOAuthObservable.next(data);
        }
        else if (methodName === portal_1.Verbs.sendNotificationStarted) {
            this.notificationStartStream.next(data);
        }
    };
    PortalService.prototype.postMessage = function (verb, data) {
        if (this.inIFrame()) {
            window.parent.postMessage({
                signature: this.portalSignature,
                kind: verb,
                data: data
            }, this.shellSrc);
        }
    };
    PortalService.prototype.inIFrame = function () {
        return window.parent !== window;
    };
    return PortalService;
}());
PortalService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService,
        ai_service_1.AiService])
], PortalService);
exports.PortalService = PortalService;
//# sourceMappingURL=portal.service.js.map