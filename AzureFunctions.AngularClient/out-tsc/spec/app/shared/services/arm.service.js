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
var arm_service_helper_1 = require("./arm.service-helper");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/observable/of");
var core_2 = require("@ngx-translate/core");
var user_service_1 = require("./user.service");
var ai_service_1 = require("./ai.service");
var config_service_1 = require("./config.service");
// export interface IArmService{
//     get(resourceId: string, apiVersion?: string);
//     delete(resourceId: string, apiVersion?: string);
//     put(resourceId: string, body: any, apiVersion?: string);
//     post(resourceId: string, body: any, apiVersion?: string);
//     send(method: string, url: string, body?: any, etag?: string, headers?: Headers);
// }
var ArmService = (function () {
    function ArmService(_http, _configService, _userService, _aiService, _translateService) {
        var _this = this;
        this._http = _http;
        this._configService = _configService;
        this._userService = _userService;
        this._aiService = _aiService;
        this._translateService = _translateService;
        this.armUrl = '';
        this.armApiVersion = '2014-04-01';
        this.armPermissionsVersion = '2015-07-01';
        this.armLocksApiVersion = '2015-01-01';
        this.storageApiVersion = '2015-05-01-preview';
        this.websiteApiVersion = '2015-08-01';
        this._invokeId = 100;
        this.armUrl = arm_service_helper_1.ArmServiceHelper.armEndpoint;
        _userService.getStartupInfo()
            .subscribe(function (info) {
            _this._token = info.token;
            _this._sessionId = info.sessionId;
        });
    }
    ArmService.prototype.send = function (method, url, body, etag, headers, invokeApi) {
        headers = headers ? headers : arm_service_helper_1.ArmServiceHelper.getHeaders(this._token, this._sessionId, etag);
        if (invokeApi) {
            var pathAndQuery = url.slice(this.armUrl.length);
            pathAndQuery = encodeURI(pathAndQuery);
            headers.append('x-ms-path-query', pathAndQuery);
            url = this.armUrl + "/api/invoke?_=" + this._invokeId++;
        }
        var request = new http_1.Request({
            url: url,
            method: method,
            search: null,
            headers: headers,
            body: body ? body : null
        });
        return this._http.request(request);
    };
    ArmService.prototype.get = function (resourceId, apiVersion) {
        var url = "" + this.armUrl + resourceId + "?api-version=" + (apiVersion ? apiVersion : this.websiteApiVersion);
        return this._http.get(url, { headers: arm_service_helper_1.ArmServiceHelper.getHeaders(this._token, this._sessionId) });
    };
    ArmService.prototype.delete = function (resourceId, apiVersion) {
        var url = "" + this.armUrl + resourceId + "?api-version=" + (apiVersion ? apiVersion : this.websiteApiVersion);
        return this._http.delete(url, { headers: arm_service_helper_1.ArmServiceHelper.getHeaders(this._token, this._sessionId) });
    };
    ArmService.prototype.put = function (resourceId, body, apiVersion) {
        var url = "" + this.armUrl + resourceId + "?api-version=" + (apiVersion ? apiVersion : this.websiteApiVersion);
        return this._http.put(url, JSON.stringify(body), { headers: arm_service_helper_1.ArmServiceHelper.getHeaders(this._token, this._sessionId) });
    };
    ArmService.prototype.post = function (resourceId, body, apiVersion) {
        var content = !!body ? JSON.stringify(body) : null;
        var url = "" + this.armUrl + resourceId + "?api-version=" + (apiVersion ? apiVersion : this.websiteApiVersion);
        return this._http.post(url, content, { headers: arm_service_helper_1.ArmServiceHelper.getHeaders(this._token, this._sessionId) });
    };
    return ArmService;
}());
ArmService.availabilityApiVersion = '2015-01-01';
ArmService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        config_service_1.ConfigService,
        user_service_1.UserService,
        ai_service_1.AiService,
        core_2.TranslateService])
], ArmService);
exports.ArmService = ArmService;
//# sourceMappingURL=arm.service.js.map