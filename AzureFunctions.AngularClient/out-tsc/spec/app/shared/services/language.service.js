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
var core_1 = require("@angular/core");
var core_2 = require("@ngx-translate/core");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/map");
require("rxjs/add/operator/retryWhen");
require("rxjs/add/operator/scan");
var constants_1 = require("./../models/constants");
var cache_service_1 = require("./cache.service");
var user_service_1 = require("./user.service");
var LanguageService = (function () {
    function LanguageService(_userService, _cacheService, _translateService) {
        var _this = this;
        this._userService = _userService;
        this._cacheService = _cacheService;
        this._translateService = _translateService;
        this._userService.getStartupInfo()
            .subscribe(function (startupInfo) {
            _this._startupInfo = startupInfo;
        });
    }
    LanguageService.prototype.getResources = function (extensionVersion) {
        return this._getLocalizedResources(this._startupInfo, extensionVersion);
    };
    LanguageService.prototype._getLocalizedResources = function (startupInfo, runtime) {
        var _this = this;
        var input = language_service_helper_1.LanguageServiceHelper.getLanguageAndRuntime(startupInfo, runtime);
        return this._cacheService.get(constants_1.Constants.serviceHost + "api/resources?name=" + input.lang + "&runtime=" + input.runtime, false, language_service_helper_1.LanguageServiceHelper.getApiControllerHeaders())
            .retryWhen(language_service_helper_1.LanguageServiceHelper.retry)
            .map(function (r) {
            var resources = r.json();
            language_service_helper_1.LanguageServiceHelper.setTranslation(resources, input.lang, _this._translateService);
        });
    };
    return LanguageService;
}());
LanguageService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        cache_service_1.CacheService,
        core_2.TranslateService])
], LanguageService);
exports.LanguageService = LanguageService;
//# sourceMappingURL=language.service.js.map