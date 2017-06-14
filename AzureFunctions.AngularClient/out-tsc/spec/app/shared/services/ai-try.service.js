"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var ai_service_1 = require("./ai.service");
var Guid_1 = require("./../Utilities/Guid");
var core_1 = require("@angular/core");
function MixPanelDefined() {
    return function (target, functionName, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (typeof (mixpanel) !== 'undefined') {
                return originalMethod.apply(this, args);
            }
            else {
                return null;
            }
        };
        return descriptor;
    };
}
var AiTryService = (function (_super) {
    __extends(AiTryService, _super);
    function AiTryService() {
        var _this = _super.call(this) || this;
        _this._tryTraceStartTimes = {};
        return _this;
    }
    AiTryService.prototype.setSessionId = function (sessionId, count) { };
    AiTryService.prototype.startTrackPage = function (name) {
        mixpanel.track('Functions Start Page View', { page: name, properties: this.addMixPanelProperties(null) });
    };
    AiTryService.prototype.addMixPanelProperties = function (properties) {
        properties = properties || {};
        properties['sitename'] = 'functions';
    };
    AiTryService.prototype.stopTrackPage = function (name, url, properties, measurements) {
        mixpanel.track('Functions Stop Page View', { page: name, url: url, properties: this.addMixPanelProperties(properties), measurements: measurements });
    };
    AiTryService.prototype.trackPageView = function (name, url, properties, measurements, duration) {
        mixpanel.track('Functions Page Viewed', { page: name, url: url, properties: this.addMixPanelProperties(properties), measurements: measurements });
    };
    AiTryService.prototype.startTrackEvent = function (name) {
        mixpanel.track(name);
    };
    AiTryService.prototype.stopTrackEvent = function (name, properties, measurements) {
        mixpanel.track(name, { properties: this.addMixPanelProperties(properties), measurements: measurements });
    };
    AiTryService.prototype.startTrace = function () {
        var traceKey = Guid_1.Guid.newTinyGuid();
        this._tryTraceStartTimes[traceKey] = Date.now();
        return traceKey;
    };
    AiTryService.prototype.stopTrace = function (name, traceKey, properties, measurements) {
        var eventStart = this._tryTraceStartTimes[traceKey];
        if (eventStart) {
            delete this._tryTraceStartTimes[traceKey];
            var duration = Date.now() - eventStart;
            properties = !!properties ? properties : {};
            properties['duration'] = duration + '';
            this.trackEvent(name, properties, measurements);
        }
    };
    AiTryService.prototype.trackEvent = function (name, properties, measurements) {
        mixpanel.track(name, { properties: this.addMixPanelProperties(properties), measurements: measurements });
    };
    AiTryService.prototype.trackLinkClick = function (name, expired, properties, measurements) {
        mixpanel.track(name, { expired: expired, properties: this.addMixPanelProperties(null), measurements: measurements });
    };
    AiTryService.prototype.trackDependency = function (id, method, absoluteUrl, pathName, totalTime, success, resultCode) { };
    AiTryService.prototype.trackException = function (exception, handledAt, properties, measurements, severityLevel) { };
    AiTryService.prototype.trackMetric = function (name, average, sampleCount, min, max, properties) {
        mixpanel.track(name, { average: average, sampleCount: sampleCount, min: min, max: max, properties: this.addMixPanelProperties(properties) });
    };
    AiTryService.prototype.trackTrace = function (message, properties) { };
    AiTryService.prototype.flush = function () { };
    AiTryService.prototype.setAuthenticatedUserContext = function (authenticatedUserId, accountId) {
        var userDetails = authenticatedUserId.split('#');
        if (userDetails.length === 2) {
            mixpanel.alias(userDetails[1]);
        }
        else {
            mixpanel.alias(authenticatedUserId);
        }
    };
    AiTryService.prototype.clearAuthenticatedUserContext = function () { };
    AiTryService.prototype.downloadAndSetup = function (config) { };
    AiTryService.prototype._onerror = function (message, url, lineNumber, columnNumber, error) { };
    return AiTryService;
}(ai_service_1.AiService));
__decorate([
    MixPanelDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiTryService.prototype, "startTrackPage", null);
__decorate([
    MixPanelDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], AiTryService.prototype, "stopTrackPage", null);
__decorate([
    MixPanelDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Number]),
    __metadata("design:returntype", void 0)
], AiTryService.prototype, "trackPageView", null);
__decorate([
    MixPanelDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiTryService.prototype, "startTrackEvent", null);
__decorate([
    MixPanelDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AiTryService.prototype, "stopTrackEvent", null);
__decorate([
    MixPanelDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AiTryService.prototype, "trackEvent", null);
__decorate([
    MixPanelDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], AiTryService.prototype, "trackLinkClick", null);
__decorate([
    MixPanelDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, Number, Object]),
    __metadata("design:returntype", void 0)
], AiTryService.prototype, "trackMetric", null);
__decorate([
    MixPanelDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AiTryService.prototype, "setAuthenticatedUserContext", null);
AiTryService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], AiTryService);
exports.AiTryService = AiTryService;
//# sourceMappingURL=ai-try.service.js.map