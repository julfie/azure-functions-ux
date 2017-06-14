"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Guid_1 = require("./../Utilities/Guid");
var http_1 = require("@angular/http");
// Used so that the UserService can do initialization work without having to depend
// on the ArmService which would create a circular dependency
var ArmServiceHelper = (function () {
    function ArmServiceHelper() {
    }
    ArmServiceHelper.getHeaders = function (token, sessionId, etag) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', "Bearer " + token);
        headers.append('x-ms-client-request-id', Guid_1.Guid.newGuid());
        if (sessionId) {
            headers.append('x-ms-client-session-id', sessionId);
        }
        if (etag) {
            headers.append('If-None-Match', etag);
        }
        return headers;
    };
    return ArmServiceHelper;
}());
ArmServiceHelper.armEndpoint = window.appsvc.env.azureResourceManagerEndpoint;
exports.ArmServiceHelper = ArmServiceHelper;
//# sourceMappingURL=arm.service-helper.js.map