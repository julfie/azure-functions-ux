"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Verbs = (function () {
    function Verbs() {
    }
    return Verbs;
}());
// Initialization verbs
Verbs.message = "message";
Verbs.ready = "ready";
// Requests from iframe
Verbs.getStartupInfo = "get-startup-info";
Verbs.openBlade = "open-blade";
Verbs.openBladeCollector = "open-blade-collector"; // Deprecated
Verbs.openBladeCollectorInputs = "open-blade-collector-inputs"; // Deprecated
Verbs.updateBladeInfo = "update-blade-info";
Verbs.closeBlades = "close-blades";
Verbs.logAction = "log-action";
Verbs.logMessage = "log-message";
Verbs.setDirtyState = "set-dirtystate";
Verbs.setupOAuth = "setup-oauth";
Verbs.pinPart = "pin-part";
Verbs.setNotification = "set-notification";
// Requests from Ibiza
Verbs.sendStartupInfo = "send-startup-info";
Verbs.sendAppSettingName = "send-appSettingName";
Verbs.sendToken = "send-token";
Verbs.sendOAuthInfo = "send-oauth-info";
Verbs.sendNotificationStarted = "send-notification-started";
exports.Verbs = Verbs;
var LogEntryLevel;
(function (LogEntryLevel) {
    LogEntryLevel[LogEntryLevel["Custom"] = -2] = "Custom";
    LogEntryLevel[LogEntryLevel["Debug"] = -1] = "Debug";
    LogEntryLevel[LogEntryLevel["Verbose"] = 0] = "Verbose";
    LogEntryLevel[LogEntryLevel["Warning"] = 1] = "Warning";
    LogEntryLevel[LogEntryLevel["Error"] = 2] = "Error";
})(LogEntryLevel = exports.LogEntryLevel || (exports.LogEntryLevel = {}));
;
var PartSize;
(function (PartSize) {
    /**
     * A tile that is 1 column x 1 row.
     */
    PartSize[PartSize["Mini"] = 0] = "Mini";
    /**
     * A tile that is 2 columns x 1 row.
     */
    PartSize[PartSize["Small"] = 1] = "Small";
    /**
     * A tile that is 2 columns x 2 rows.
     */
    PartSize[PartSize["Normal"] = 2] = "Normal";
    /**
     * A tile that is 4 columns x 2 rows.
     */
    PartSize[PartSize["Wide"] = 3] = "Wide";
    /**
     * A tile that is 2 columns x 4 rows.
     */
    PartSize[PartSize["Tall"] = 4] = "Tall";
    /**
     * A tile that is 6 columns x 4 rows.
     */
    PartSize[PartSize["HeroWide"] = 5] = "HeroWide";
    /**
     * A tile that is 4 columns x 6 rows.
     */
    PartSize[PartSize["HeroTall"] = 6] = "HeroTall";
    /**
     * A tile that is 6 columns by unbounded rows that fits the content.
     */
    PartSize[PartSize["HeroWideFitHeight"] = 7] = "HeroWideFitHeight";
    /**
     * A tile that expands all the available columns by unbounded rows that fits the content.
     */
    PartSize[PartSize["FullWidthFitHeight"] = 8] = "FullWidthFitHeight";
    /**
     * A tile that fits all the available space of the content area it occupies.
     */
    PartSize[PartSize["FitToContainer"] = 9] = "FitToContainer";
    /**
     * A tile that is 4 columns x 4 rows.
     */
    PartSize[PartSize["Large"] = 10] = "Large";
    /**
     * A tile that is 6 columns x 6 rows.
     */
    PartSize[PartSize["Hero"] = 11] = "Hero";
    /**
     * A tile with a custom size.
     */
    PartSize[PartSize["Custom"] = 99] = "Custom";
})(PartSize = exports.PartSize || (exports.PartSize = {}));
//# sourceMappingURL=portal.js.map