"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@ngx-translate/core");
var portal_resources_1 = require("./../models/portal-resources");
var constants_1 = require("./../models/constants");
var cache_service_1 = require("./../services/cache.service");
var constants_2 = require("app/shared/models/constants");
var SiteNameValidator = (function () {
    function SiteNameValidator(injector, _subscriptionId) {
        this._subscriptionId = _subscriptionId;
        this._ts = injector.get(core_1.TranslateService);
        this._cacheService = injector.get(cache_service_1.CacheService);
    }
    SiteNameValidator.prototype.validate = function (control) {
        var _this = this;
        if (!control.value) {
            return Promise.resolve(null);
        }
        if (control.value.length < constants_2.Validations.websiteNameMinLength) {
            return Promise.resolve({ invalidSiteName: this._ts.instant(portal_resources_1.PortalResources.validation_siteNameMinChars) });
        }
        else if (control.value.length > constants_2.Validations.websiteNameMaxLength) {
            return Promise.resolve({ invalidSiteName: this._ts.instant(portal_resources_1.PortalResources.validation_siteNameMaxChars) });
        }
        var matchingChar = control.value.match(constants_1.Regex.invalidEntityName);
        if (matchingChar) {
            return Promise.resolve({ invalidSiteName: this._ts.instant(portal_resources_1.PortalResources.validation_siteNameInvalidChar).format(matchingChar[0]) });
        }
        return new Promise(function (resolve) {
            _this._cacheService.getArm("/subscriptions/" + _this._subscriptionId + "/providers/Microsoft.Web/ishostnameavailable/" + control.value)
                .subscribe(function (r) {
                var result = r.json();
                if (result.properties) {
                    resolve(null);
                }
                else {
                    resolve({
                        invalidSiteName: _this._ts.instant(portal_resources_1.PortalResources.validation_siteNameNotAvailable).format(control.value)
                    });
                }
            });
        });
    };
    return SiteNameValidator;
}());
exports.SiteNameValidator = SiteNameValidator;
//# sourceMappingURL=siteNameValidator.js.map