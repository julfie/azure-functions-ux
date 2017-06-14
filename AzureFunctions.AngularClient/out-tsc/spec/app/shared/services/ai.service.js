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
var Guid_1 = require("./../Utilities/Guid");
var core_1 = require("@angular/core");
var app_insights_1 = require("../models/app-insights");
function AiDefined(checkFunctionName) {
    checkFunctionName = typeof checkFunctionName !== 'undefined' ? checkFunctionName : true;
    return function (target, functionName, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (typeof (appInsights) !== 'undefined' && (typeof (appInsights[functionName]) !== 'undefined' || !checkFunctionName)) {
                return originalMethod.apply(this, args);
            }
            else {
                return null;
            }
        };
        return descriptor;
    };
}
function run(action) {
    if (typeof (appInsights) !== 'undefined') {
        return action();
    }
}
var AiService = (function () {
    function AiService() {
        /*
        * Config object used to initialize AppInsights
        */
        this.config = run(function () { return appInsights.config; });
        this.context = run(function () { return appInsights.context; });
        /*
        * Initialization queue. Contains functions to run when appInsights initializes
        */
        this.queue = run(function () { return appInsights.queue; });
        this._traceStartTimes = {};
    }
    /**
    * Sets the sessionId for all the current events.
    */
    AiService.prototype.setSessionId = function (sessionId, count) {
        var _this = this;
        count = typeof count !== 'undefined' ? count : 0;
        if (appInsights.context) {
            appInsights.context.addTelemetryInitializer(function (envelope) {
                if (envelope && envelope.tags) {
                    envelope.tags['ai.session.id'] = sessionId;
                }
            });
        }
        else if (count < 5) {
            setTimeout(function () { return _this.setSessionId(sessionId, count + 1); }, 2000);
        }
    };
    /**
    * Starts timing how long the user views a page or other item. Call this when the page opens.
    * This method doesn't send any telemetry. Call {@link stopTrackTelemetry} to log the page when it closes.
    * @param   name  A string that identifies this item, unique within this HTML document. Defaults to the document title.
    */
    AiService.prototype.startTrackPage = function (name) {
        return appInsights.startTrackPage(name);
    };
    AiService.prototype.addMixPanelProperties = function (properties) {
        properties = properties || {};
        properties['sitename'] = 'functions';
    };
    /**
    * Logs how long a page or other item was visible, after {@link startTrackPage}. Call this when the page closes.
    * @param   name  The string you used as the name in startTrackPage. Defaults to the document title.
    * @param   url   String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
    * @param   properties  map[string, string] - additional data used to filter pages and metrics in the portal. Defaults to empty.
    * @param   measurements    map[string, number] - metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.
    */
    AiService.prototype.stopTrackPage = function (name, url, properties, measurements) {
        return appInsights.stopTrackPage(name, url, properties, measurements);
    };
    /**
     * Logs that a page or other item was viewed.
     * @param   name  The string you used as the name in startTrackPage. Defaults to the document title.
     * @param   url   String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
     * @param   properties  map[string, string] - additional data used to filter pages and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.
     * @param   duration    number - the number of milliseconds it took to load the page. Defaults to undefined. If set to default value, page load time is calculated internally.
     */
    AiService.prototype.trackPageView = function (name, url, properties, measurements, duration) {
        return appInsights.trackPageView(name, url, properties, measurements);
    };
    /**
     * Start timing an extended event. Call {@link stopTrackEvent} to log the event when it ends.
     * @param   name    A string that identifies this event uniquely within the document.
     */
    AiService.prototype.startTrackEvent = function (name) {
        return appInsights.startTrackEvent(name);
    };
    /**
     * Log an extended event that you started timing with {@link startTrackEvent}.
     * @param   name    The string you used to identify this event in startTrackEvent.
     * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
     */
    AiService.prototype.stopTrackEvent = function (name, properties, measurements) {
        return appInsights.stopTrackEvent(name, properties, measurements);
    };
    /**
     * Start timing an event
     * @returns    A unique key used to identify a specific call to startTrace
     */
    AiService.prototype.startTrace = function () {
        var traceKey = Guid_1.Guid.newTinyGuid();
        this._traceStartTimes[traceKey] = Date.now();
        return traceKey;
    };
    /**
     * Log an extended event that you started timing with {@link startTrace}.
     * @param   traceKey    The unique key used to identify a specific call to startTrace
     * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
     */
    AiService.prototype.stopTrace = function (name, traceKey, properties, measurements) {
        var eventStart = this._traceStartTimes[traceKey];
        if (eventStart) {
            delete this._traceStartTimes[traceKey];
            var duration = Date.now() - eventStart;
            properties = !!properties ? properties : {};
            properties['duration'] = duration + '';
            this.trackEvent(name, properties, measurements);
        }
    };
    /**
    * Log a user action or other occurrence.
    * @param   name    A string to identify this event in the portal.
    * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
    * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
    */
    AiService.prototype.trackEvent = function (name, properties, measurements) {
        return appInsights.trackEvent(name, properties, measurements);
    };
    /**
    * Log a user action or other occurrence.
    * @param   name    A string to identify this event in the portal.
    * @param   expired  string - determines if the link was clicked before or after the trial had expired .
    */
    AiService.prototype.trackLinkClick = function (name, expired, properties, measurements) {
        // no-op
    };
    /**
     * Log a dependency call
     * @param id    unique id, this is used by the backend o correlate server requests. Use Util.newId() to generate a unique Id.
     * @param method    represents request verb (GET, POST, etc.)
     * @param absoluteUrl   absolute url used to make the dependency request
     * @param pathName  the path part of the absolute url
     * @param totalTime total request time
     * @param success   indicates if the request was successful
     * @param resultCode    response code returned by the dependency request
     */
    AiService.prototype.trackDependency = function (id, method, absoluteUrl, pathName, totalTime, success, resultCode) {
        return appInsights.trackDependency(id, method, absoluteUrl, pathName, totalTime, success, resultCode);
    };
    /**
     * Log an exception you have caught.
     * @param   exception   An Error from a catch clause, or the string error message.
     * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
     * @param   severityLevel   AI.SeverityLevel - severity level
     */
    AiService.prototype.trackException = function (exception, handledAt, properties, measurements, severityLevel) {
        console.error(exception);
        return appInsights.trackException(exception, handledAt, properties, measurements);
    };
    /**
     * Log a numeric value that is not associated with a specific event. Typically used to send regular reports of performance indicators.
     * To send a single measurement, use just the first two parameters. If you take measurements very frequently, you can reduce the
     * telemetry bandwidth by aggregating multiple measurements and sending the resulting average at intervals.
     * @param   name    A string that identifies the metric.
     * @param   average Number representing either a single measurement, or the average of several measurements.
     * @param   sampleCount The number of measurements represented by the average. Defaults to 1.
     * @param   min The smallest measurement in the sample. Defaults to the average.
     * @param   max The largest measurement in the sample. Defaults to the average.
     */
    AiService.prototype.trackMetric = function (name, average, sampleCount, min, max, properties) {
        return appInsights.trackMetric(name, average, sampleCount, min, max, properties);
    };
    /**
    * Log a diagnostic message.
    * @param    message A message string
    * @param   properties  map[string, string] - additional data used to filter traces in the portal. Defaults to empty.
    */
    AiService.prototype.trackTrace = function (message, properties) {
        return appInsights.trackTrace(message, properties);
    };
    /**
     * Immediately send all queued telemetry.
     */
    AiService.prototype.flush = function () {
        return appInsights.flush();
    };
    /**
    * Sets the authenticated user id and the account id in this session.
    * User auth id and account id should be of type string. They should not contain commas, semi-colons, equal signs, spaces, or vertical-bars.
    *
    * @param authenticatedUserId {string} - The authenticated user id. A unique and persistent string that represents each authenticated user in the service.
    * @param accountId {string} - An optional string to represent the account associated with the authenticated user.
    */
    AiService.prototype.setAuthenticatedUserContext = function (authenticatedUserId, accountId) {
        return appInsights.setAuthenticatedUserContext(authenticatedUserId, accountId);
    };
    /**
     * Clears the authenticated user id and the account id from the user context.
     */
    AiService.prototype.clearAuthenticatedUserContext = function () {
        return appInsights.clearAuthenticatedUserContext();
    };
    /*
    * Downloads and initializes AppInsights. You can override default script download location by specifying url property of `config`.
    */
    AiService.prototype.downloadAndSetup = function (config) {
        return appInsights.downloadAndSetup(config);
    };
    /**
     * The custom error handler for Application Insights
     * @param {string} message - The error message
     * @param {string} url - The url where the error was raised
     * @param {number} lineNumber - The line number where the error was raised
     * @param {number} columnNumber - The column number for the line where the error was raised
     * @param {Error}  error - The Error object
     */
    AiService.prototype._onerror = function (message, url, lineNumber, columnNumber, error) {
        return appInsights._onerror(message, url, lineNumber, columnNumber, error);
    };
    return AiService;
}());
__decorate([
    AiDefined(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "setSessionId", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "startTrackPage", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "stopTrackPage", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Number]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "trackPageView", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "startTrackEvent", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "stopTrackEvent", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "trackEvent", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Boolean, Number]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "trackDependency", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Error, String, Object, Object, Number]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "trackException", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number, Number, Object]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "trackMetric", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "trackTrace", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiService.prototype, "flush", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "setAuthenticatedUserContext", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiService.prototype, "clearAuthenticatedUserContext", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "downloadAndSetup", null);
__decorate([
    AiDefined(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, Error]),
    __metadata("design:returntype", void 0)
], AiService.prototype, "_onerror", null);
AiService = __decorate([
    core_1.Injectable()
], AiService);
exports.AiService = AiService;
//# sourceMappingURL=ai.service.js.map