"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpMethods = (function () {
    function HttpMethods() {
        this.GET = "get";
        this.POST = "post";
        this.DELETE = "delete";
        this.HEAD = "head";
        this.PATCH = "patch";
        this.PUT = "put";
        this.OPTIONS = "options";
        this.TRACE = "trace";
    }
    return HttpMethods;
}());
exports.HttpMethods = HttpMethods;
var Constants = (function () {
    function Constants() {
    }
    return Constants;
}());
Constants.serviceHost = window.location.hostname === "localhost" || window.appsvc.env.runtimeType === "Standalone"
    ? "https://" + window.location.hostname + ":" + window.location.port + "/"
    : '';
Constants.nodeVersion = '6.5.0';
Constants.latest = 'latest';
Constants.disabled = 'disabled';
Constants.runtimeVersionAppSettingName = 'FUNCTIONS_EXTENSION_VERSION';
Constants.nodeVersionAppSettingName = 'WEBSITE_NODE_DEFAULT_VERSION';
Constants.azureJobsExtensionVersion = 'AZUREJOBS_EXTENSION_VERSION';
Constants.routingExtensionVersionAppSettingName = 'ROUTING_EXTENSION_VERSION';
Constants.functionAppEditModeSettingName = 'FUNCTION_APP_EDIT_MODE';
Constants.instrumentationKeySettingName = 'APPINSIGHTS_INSTRUMENTATIONKEY';
Constants.slotsSecretStorageSettingsName = "AzureWebJobsSecretStorageType";
Constants.slotsSecretStorageSettingsValue = "Blob";
Constants.contentShareConfigSettingsName = "WEBSITE_CONTENTSHARE";
Constants.httpMethods = new HttpMethods();
Constants.swaggerSecretName = 'swaggerdocumentationkey';
Constants.portalHostName = 'https://portal.azure.com';
Constants.webAppsHostName = 'https://web1.appsvcux.ext.azure.com';
Constants.msPortalHostName = 'https://ms.portal.azure.com';
Constants.ReadWriteMode = 'readWrite'.toLocaleLowerCase();
Constants.ReadOnlyMode = 'readOnly'.toLocaleLowerCase();
exports.Constants = Constants;
var SiteTabIds = (function () {
    function SiteTabIds() {
    }
    return SiteTabIds;
}());
SiteTabIds.overview = "Overview";
SiteTabIds.monitor = "Monitor";
SiteTabIds.features = "Platform features";
SiteTabIds.functionRuntime = "Settings";
SiteTabIds.apiDefinition = "API Definition";
SiteTabIds.troubleshoot = "Troubleshoot";
SiteTabIds.deploymentSource = "Deployment Source";
SiteTabIds.config = "Config";
exports.SiteTabIds = SiteTabIds;
var Arm = (function () {
    function Arm() {
    }
    return Arm;
}());
Arm.MaxSubscriptionBatchSize = 40;
exports.Arm = Arm;
var AvailabilityStates = (function () {
    function AvailabilityStates() {
    }
    return AvailabilityStates;
}());
AvailabilityStates.unknown = 'unknown';
AvailabilityStates.unavailable = 'unavailable';
AvailabilityStates.available = 'available';
// Not entirely sure what this means, but it seems to be synonymous with unavailable
AvailabilityStates.userinitiated = 'userinitiated';
exports.AvailabilityStates = AvailabilityStates;
var NotificationIds = (function () {
    function NotificationIds() {
    }
    return NotificationIds;
}());
NotificationIds.alwaysOn = 'alwaysOn';
NotificationIds.newRuntimeVersion = 'newRuntimeVersion';
NotificationIds.slotsHostId = "slotsBlobStorage";
exports.NotificationIds = NotificationIds;
var Validations = (function () {
    function Validations() {
    }
    return Validations;
}());
Validations.websiteNameMinLength = 2;
Validations.websiteNameMaxLength = 60;
exports.Validations = Validations;
var Regex = (function () {
    function Regex() {
    }
    return Regex;
}());
Regex.invalidEntityName = /[^\u00BF-\u1FFF\u2C00-\uD7FF\a-zA-Z0-9-]/; //matches any character(i.e. german, chinese, english) or -
exports.Regex = Regex;
var Links = (function () {
    function Links() {
    }
    return Links;
}());
Links.standaloneCreateLearnMore = "https://go.microsoft.com/fwlink/?linkid=848756";
exports.Links = Links;
//# sourceMappingURL=constants.js.map