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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var core_2 = require("@ngx-translate/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var constants_1 = require("./../models/constants");
var arm_service_1 = require("./arm.service");
var ai_service_1 = require("./ai.service");
var config_service_1 = require("./config.service");
var user_service_1 = require("./user.service");
var ArmTryService = (function (_super) {
    __extends(ArmTryService, _super);
    function ArmTryService(http, configService, userService, aiService, translateService) {
        var _this = _super.call(this, http, configService, userService, aiService, translateService) || this;
        _this._whiteListedPrefixUrls = [
            constants_1.Constants.serviceHost + "api"
        ];
        return _this;
    }
    Object.defineProperty(ArmTryService.prototype, "tryFunctionApp", {
        get: function () {
            return this._tryFunctionApp;
        },
        set: function (tryFunctionApp) {
            this._tryFunctionApp = tryFunctionApp;
            this._whiteListedPrefixUrls.push(tryFunctionApp.getScmUrl() + "/api");
            this._whiteListedPrefixUrls.push("" + tryFunctionApp.getMainSiteUrl());
        },
        enumerable: true,
        configurable: true
    });
    ArmTryService.prototype.get = function (resourceId, apiVersion) {
        this._aiService.trackEvent("/try/arm-get-failure", {
            uri: resourceId
        });
        throw "[ArmTryService] - get: " + resourceId;
    };
    ArmTryService.prototype.delete = function (resourceId, apiVersion) {
        this._aiService.trackEvent("/try/arm-delete-failure", {
            uri: resourceId
        });
        throw "[ArmTryService] - delete: " + resourceId;
    };
    ArmTryService.prototype.put = function (resourceId, body, apiVersion) {
        this._aiService.trackEvent("/try/arm-put-failure", {
            uri: resourceId
        });
        throw "[ArmTryService] - put: " + resourceId;
    };
    ArmTryService.prototype.post = function (resourceId, body, apiVersion) {
        this._aiService.trackEvent("/try/arm-post-failure", {
            uri: resourceId
        });
        throw "[ArmTryService] - post: " + resourceId;
    };
    ArmTryService.prototype.send = function (method, url, body, etag, headers) {
        var _this = this;
        var urlNoQuery = url.toLowerCase().split('?')[0];
        if (this._whiteListedPrefixUrls.find(function (u) { return urlNoQuery.startsWith(u.toLowerCase()); })) {
            return _super.prototype.send.call(this, method, url, body, etag, headers);
        }
        else if (urlNoQuery.endsWith(this.tryFunctionApp.site.id.toLowerCase())) {
            return Observable_1.Observable.of(this._getFakeResponse(this.tryFunctionApp.site));
        }
        else if (urlNoQuery.endsWith("/providers/microsoft.authorization/permissions")) {
            return Observable_1.Observable.of(this._getFakeResponse({
                "value": [{
                        "actions": ["*"],
                        "notActions": []
                    }],
                "nextLink": null
            }));
        }
        else if (urlNoQuery.endsWith("/providers/microsoft.authorization/locks")) {
            return Observable_1.Observable.of(this._getFakeResponse({ "value": [] }));
        }
        else if (urlNoQuery.endsWith("/config/web")) {
            return Observable_1.Observable.of(this._getFakeResponse({
                id: this._tryFunctionApp.site.id,
                properties: {
                    scmType: "None"
                }
            }));
        }
        else if (urlNoQuery.endsWith("/appsettings/list")) {
            return this.tryFunctionApp.getFunctionContainerAppSettings()
                .map(function (r) {
                return _this._getFakeResponse({
                    properties: r
                });
            });
        }
        else if (urlNoQuery.endsWith("/slots")) {
            return Observable_1.Observable.of(this._getFakeResponse({ value: [] }));
        }
        this._aiService.trackEvent("/try/arm-send-failure", {
            uri: url
        });
        throw "[ArmTryService] - send: " + url;
    };
    ArmTryService.prototype._getFakeResponse = function (jsonObj) {
        return {
            headers: {
                get: function (name) {
                    return null;
                }
            },
            json: function () {
                return jsonObj;
            }
        };
    };
    return ArmTryService;
}(arm_service_1.ArmService));
ArmTryService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        config_service_1.ConfigService,
        user_service_1.UserService,
        ai_service_1.AiService,
        core_2.TranslateService])
], ArmTryService);
exports.ArmTryService = ArmTryService;
//# sourceMappingURL=arm-try.service.js.map