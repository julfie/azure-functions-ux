"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// If you change the order of this enum, make sure you update the storage API version.
// Appending new enum values shouldn't require an API change.
var Feature;
(function (Feature) {
    Feature[Feature["DeploymentSource"] = 0] = "DeploymentSource";
    Feature[Feature["Cors"] = 1] = "Cors";
    Feature[Feature["Authentication"] = 2] = "Authentication";
    Feature[Feature["CustomDomains"] = 3] = "CustomDomains";
    Feature[Feature["SSLBinding"] = 4] = "SSLBinding";
    Feature[Feature["ApiDefinition"] = 5] = "ApiDefinition";
    Feature[Feature["WebJobs"] = 6] = "WebJobs";
    Feature[Feature["SiteExtensions"] = 7] = "SiteExtensions";
    Feature[Feature["AppInsight"] = 8] = "AppInsight";
})(Feature = exports.Feature || (exports.Feature = {}));
//# sourceMappingURL=enabled-features.js.map