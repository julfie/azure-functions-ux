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
var language_service_helper_1 = require("./language.service-helper");
var core_1 = require("@ngx-translate/core");
var arm_service_helper_1 = require("./arm.service-helper");
var core_2 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var config_service_1 = require("./config.service");
var constants_1 = require("./../models/constants");
var ai_service_1 = require("./ai.service");
var portal_service_1 = require("./portal.service");
var UserService = (function () {
    function UserService(_http, _aiService, _portalService, _configService, _translateService) {
        var _this = this;
        this._http = _http;
        this._aiService = _aiService;
        this._portalService = _portalService;
        this._configService = _configService;
        this._translateService = _translateService;
        this._startupInfoStream = new ReplaySubject_1.ReplaySubject(1);
        this.inIFrame = window.parent !== window;
        this._inTry = window.location.pathname.endsWith('/try');
        this._startupInfo = {
            token: null,
            subscriptions: null,
            sessionId: null,
            acceptLanguage: null,
            effectiveLocale: null,
            resourceId: null
        };
        if (this.inIFrame) {
            this._portalService.getStartupInfo()
                .mergeMap(function (info) {
                return Observable_1.Observable.zip(Observable_1.Observable.of(info), _this._getLocalizedResources(info, null), function (i, r) { return ({ info: i, resources: r }); });
            })
                .subscribe(function (r) {
                var info = r.info;
                _this.updateStartupInfo(info);
            });
        }
        else if (this._inTry) {
            Observable_1.Observable.zip(this._getSubscriptions(null), this._getLocalizedResources(this._startupInfo, null), function (s, r) { return ({ subscriptions: s, resources: r }); })
                .subscribe(function (r) {
                _this._startupInfo.subscriptions = r.subscriptions;
                _this.updateStartupInfo(_this._startupInfo);
            });
        }
    }
    UserService.prototype.getTenants = function () {
        return this._http.get(constants_1.Constants.serviceHost + 'api/tenants')
            .catch(function (e) { return Observable_1.Observable.of({ json: function () { return []; } }); })
            .map(function (r) { return r.json(); });
    };
    UserService.prototype.getAndUpdateToken = function () {
        var _this = this;
        return this._http.get(constants_1.Constants.serviceHost + 'api/token?plaintext=true')
            .catch(function (e) {
            // [ellhamai] - In Standalone mode, this call will always fail.  I've opted to leaving
            // this call in place instead of preventing it from being called because:
            // 1. It makes the code simpler to always call the API
            // 2. It makes it easier to test because we can test Standalone mode with production ARM
            return Observable_1.Observable.of(null);
        })
            .map(function (r) {
            var token;
            if (r) {
                token = r.text();
            }
            else {
                token = '';
            }
            _this._setToken(token);
        });
    };
    UserService.prototype.getUser = function () {
        return this._http.get(constants_1.Constants.serviceHost + 'api/token')
            .map(function (r) { return r.json(); });
    };
    UserService.prototype._setToken = function (token) {
        var _this = this;
        if (token !== this._startupInfo.token) {
            Observable_1.Observable.zip(this._getSubscriptions(token), this._getLocalizedResources(this._startupInfo, null), function (s, r) { return ({ subs: s, resources: r }); })
                .subscribe(function (r) {
                var info = {
                    token: token,
                    subscriptions: r.subs,
                    sessionId: _this._startupInfo.sessionId,
                    acceptLanguage: _this._startupInfo.acceptLanguage,
                    effectiveLocale: _this._startupInfo.effectiveLocale,
                    resourceId: _this._startupInfo.resourceId,
                    stringResources: r.resources
                };
                _this.updateStartupInfo(info);
            });
            try {
                var encodedUser = token.split('.')[1];
                var user = JSON.parse(atob(encodedUser));
                var userName = (user.unique_name || user.email).replace(/[,;=| ]+/g, "_");
                this._aiService.setAuthenticatedUserContext(userName);
            }
            catch (error) {
                this._aiService.trackException(error, 'setToken');
            }
        }
    };
    UserService.prototype.getStartupInfo = function () {
        return this._startupInfoStream;
    };
    UserService.prototype.updateStartupInfo = function (startupInfo) {
        this._startupInfo = startupInfo;
        this._startupInfoStream.next(startupInfo);
    };
    UserService.prototype.setTryUserName = function (userName) {
        if (userName) {
            try {
                this._aiService.setAuthenticatedUserContext(userName);
            }
            catch (error) {
                this._aiService.trackException(error, 'setToken');
            }
        }
    };
    UserService.prototype._getSubscriptions = function (token) {
        if (this._inTry) {
            return Observable_1.Observable.of([{
                    subscriptionId: 'TrialSubscription',
                    displayName: 'Trial Subscription',
                    state: 'Enabled'
                }]);
        }
        var url = arm_service_helper_1.ArmServiceHelper.armEndpoint + "/subscriptions?api-version=2014-04-01";
        var headers = arm_service_helper_1.ArmServiceHelper.getHeaders(token);
        return this._http.get(url, { headers: headers })
            .map(function (r) { return (r.json().value); });
    };
    UserService.prototype._getLocalizedResources = function (startupInfo, runtime) {
        var _this = this;
        var input = language_service_helper_1.LanguageServiceHelper.getLanguageAndRuntime(startupInfo, runtime);
        return this._http.get(constants_1.Constants.serviceHost + "api/resources?name=" + input.lang + "&runtime=" + input.runtime, { headers: language_service_helper_1.LanguageServiceHelper.getApiControllerHeaders() })
            .retryWhen(language_service_helper_1.LanguageServiceHelper.retry)
            .map(function (r) {
            var resources = r.json();
            language_service_helper_1.LanguageServiceHelper.setTranslation(resources, input.lang, _this._translateService);
        });
    };
    return UserService;
}());
UserService = __decorate([
    core_2.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        ai_service_1.AiService,
        portal_service_1.PortalService,
        config_service_1.ConfigService,
        core_1.TranslateService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map