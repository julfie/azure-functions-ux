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
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/map");
require("rxjs/add/operator/retryWhen");
require("rxjs/add/operator/scan");
require("rxjs/add/observable/of");
var core_2 = require("@ngx-translate/core");
var user_service_1 = require("./user.service");
var constants_1 = require("../models/constants");
var cache_decorator_1 = require("../decorators/cache.decorator");
var global_state_service_1 = require("./global-state.service");
var ng2_cookies_1 = require("ng2-cookies/ng2-cookies");
var broadcast_service_1 = require("./broadcast.service");
var arm_service_1 = require("./arm.service");
var cache_service_1 = require("./cache.service");
var ai_service_1 = require("./ai.service");
var FunctionsService = (function () {
    function FunctionsService(_http, _userService, _globalStateService, _translateService, _broadcastService, _armService, _cacheService, _aiService) {
        var _this = this;
        this._http = _http;
        this._userService = _userService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._broadcastService = _broadcastService;
        this._armService = _armService;
        this._cacheService = _cacheService;
        this._aiService = _aiService;
        this.isMultiKeySupported = true;
        this.tryAppServiceUrl = 'https://tryappservice.azure.com';
        if (!constants_1.Constants.runtimeVersion) {
            this.getLatestRuntime().subscribe(function (runtime) {
                constants_1.Constants.runtimeVersion = runtime;
            });
        }
        if (!_globalStateService.showTryView) {
            this._userService.getStartupInfo().subscribe(function (info) { _this.token = info.token; });
        }
        if (ng2_cookies_1.Cookie.get('TryAppServiceToken')) {
            this._globalStateService.TryAppServiceToken = ng2_cookies_1.Cookie.get('TryAppServiceToken');
            var templateId = ng2_cookies_1.Cookie.get('templateId');
            this.selectedFunction = templateId.split('-')[0].trim();
            this.selectedLanguage = templateId.split('-')[1].trim();
            this.selectedProvider = ng2_cookies_1.Cookie.get('provider');
            this.selectedFunctionName = ng2_cookies_1.Cookie.get('functionName');
        }
    }
    // This function is special cased in the Cache() decorator by name to allow for dev scenarios.
    FunctionsService.prototype.getTemplates = function () {
        try {
            if (localStorage.getItem('dev-templates')) {
                var devTemplate = JSON.parse(localStorage.getItem('dev-templates'));
                // this.localize(devTemplate);
                return Observable_1.Observable.of(devTemplate);
            }
        }
        catch (e) {
            console.error(e);
        }
        var url = constants_1.Constants.serviceHost + "api/templates?runtime='latest'";
        return this._http.get(url, { headers: this.getPortalHeaders() })
            .retryWhen(this.retryAntares)
            .map(function (r) {
            var object = r.json();
            // this.localize(object);
            return object;
        });
    };
    FunctionsService.prototype.getDesignerSchema = function () {
        return this._http.get('mocks/function-json-schema.json')
            .retryWhen(this.retryAntares)
            .map(function (r) { return r.json(); });
    };
    FunctionsService.prototype.getTrialResource = function (provider) {
        var url = this.tryAppServiceUrl + '/api/resource?appServiceName=Function'
            + (provider ? '&provider=' + provider : '');
        return this._http.get(url, { headers: this.getTryAppServiceHeaders() })
            .retryWhen(this.retryGetTrialResource)
            .map(function (r) { return r.json(); });
    };
    FunctionsService.prototype.createTrialResource = function (selectedTemplate, provider, functionName) {
        var url = this.tryAppServiceUrl + '/api/resource?appServiceName=Function'
            + (provider ? '&provider=' + provider : '')
            + '&templateId=' + encodeURIComponent(selectedTemplate.id)
            + '&functionName=' + encodeURIComponent(functionName);
        var template = {
            name: selectedTemplate.id,
            appService: 'Function',
            language: selectedTemplate.metadata.language,
            githubRepo: ''
        };
        return this._http.post(url, JSON.stringify(template), { headers: this.getTryAppServiceHeaders() })
            .retryWhen(this.retryCreateTrialResource)
            .map(function (r) { return r.json(); });
    };
    FunctionsService.prototype.getFunctionAppArmId = function () {
        if (this.functionContainer && this.functionContainer.id && this.functionContainer.id.trim().length !== 0) {
            return this.functionContainer.id;
        }
        else if (this._scmUrl) {
            return this._scmUrl;
        }
        else {
            return 'Unknown';
        }
    };
    FunctionsService.prototype.getLatestRuntime = function () {
        return this._http.get(constants_1.Constants.serviceHost + 'api/latestruntime', { headers: this.getPortalHeaders() })
            .map(function (r) {
            return r.json();
        })
            .retryWhen(this.retryAntares);
    };
    // to talk to scm site
    FunctionsService.prototype.getScmSiteHeaders = function (contentType) {
        contentType = contentType || 'application/json';
        var headers = new http_1.Headers();
        headers.append('Content-Type', contentType);
        headers.append('Accept', 'application/json,*/*');
        if (!this._globalStateService.showTryView && this.token) {
            headers.append('Authorization', "Bearer " + this.token);
        }
        // if (this._globalStateService.TryAppServiceScmCreds) {
        //     headers.append('Authorization', `Basic ${this._globalStateService.TryAppServiceScmCreds}`);
        // }
        return headers;
    };
    FunctionsService.prototype.getMainSiteHeaders = function (contentType) {
        contentType = contentType || 'application/json';
        var headers = new http_1.Headers();
        headers.append('Content-Type', contentType);
        headers.append('Accept', 'application/json,*/*');
        headers.append('x-functions-key', this.masterKey);
        return headers;
    };
    // to talk to Functions Portal
    FunctionsService.prototype.getPortalHeaders = function (contentType) {
        contentType = contentType || 'application/json';
        var headers = new http_1.Headers();
        headers.append('Content-Type', contentType);
        headers.append('Accept', 'application/json,*/*');
        if (this.token) {
            headers.append('client-token', this.token);
            headers.append('portal-token', this.token);
        }
        return headers;
    };
    // to talk to TryAppservice
    FunctionsService.prototype.getTryAppServiceHeaders = function (contentType) {
        contentType = contentType || 'application/json';
        var headers = new http_1.Headers();
        headers.append('Content-Type', contentType);
        headers.append('Accept', 'application/json,*/*');
        if (this._globalStateService.TryAppServiceToken) {
            headers.append('Authorization', "Bearer " + this._globalStateService.TryAppServiceToken);
        }
        else {
            headers.append('ms-x-user-agent', 'Functions/');
        }
        return headers;
    };
    FunctionsService.prototype.getLocalizedResources = function (lang, runtime) {
        var _this = this;
        return this._http.get(constants_1.Constants.serviceHost + ("api/resources?name=" + lang + "&runtime=" + runtime), { headers: this.getPortalHeaders() })
            .retryWhen(this.retryAntares)
            .map(function (r) {
            var resources = r.json();
            _this._translateService.setDefaultLang('en');
            _this._translateService.setTranslation('en', resources.en);
            if (resources.lang) {
                _this._translateService.setTranslation(lang, resources.lang);
            }
            _this._translateService.use(lang);
        });
    };
    FunctionsService.prototype.retryAntares = function (error) {
        return error.scan(function (errorCount, err) {
            if (err.isHandled || err.status < 500 || errorCount >= 10) {
                throw err;
            }
            else {
                return errorCount + 1;
            }
        }, 0).delay(1000);
    };
    FunctionsService.prototype.retryCreateTrialResource = function (error) {
        return error.scan(function (errorCount, err) {
            // 400 => you already have a resource, 403 => No login creds provided
            if (err.status === 400 || err.status === 403 || errorCount >= 10) {
                throw err;
            }
            else {
                return errorCount + 1;
            }
        }, 0).delay(1000);
    };
    FunctionsService.prototype.retryGetTrialResource = function (error) {
        return error.scan(function (errorCount, err) {
            // 403 => No login creds provided
            if (err.status === 403 || errorCount >= 10) {
                throw err;
            }
            else {
                return errorCount + 1;
            }
        }, 0).delay(1000);
    };
    /**
     * This function is just a wrapper around AiService.trackEvent. It injects default params expected from this class.
     * Currently that's only scmUrl
     * @param params any additional parameters to get added to the default parameters that this class reports to AppInsights
     */
    FunctionsService.prototype.trackEvent = function (name, params) {
        var standardParams = {
            scmUrl: this._scmUrl
        };
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                standardParams[key] = params[key];
            }
        }
        this._aiService.trackEvent(name, standardParams);
    };
    FunctionsService.prototype.sanitize = function (value) {
        if (value) {
            return value.substring(0, Math.min(3, value.length));
        }
        else {
            return 'undefined';
        }
    };
    return FunctionsService;
}());
__decorate([
    cache_decorator_1.Cache(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FunctionsService.prototype, "getTemplates", null);
__decorate([
    cache_decorator_1.Cache(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FunctionsService.prototype, "getDesignerSchema", null);
FunctionsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        user_service_1.UserService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        broadcast_service_1.BroadcastService,
        arm_service_1.ArmService,
        cache_service_1.CacheService,
        ai_service_1.AiService])
], FunctionsService);
exports.FunctionsService = FunctionsService;
//# sourceMappingURL=functions.service.js.map