"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var portal_resources_1 = require("./../models/portal-resources");
var constants_1 = require("./../models/constants");
var core_1 = require("@ngx-translate/core");
var constants_2 = require("app/shared/models/constants");
var slots_service_1 = require("app/shared/services/slots.service");
var SlotNameValidator = (function () {
    function SlotNameValidator(injector, _siteId) {
        this._siteId = _siteId;
        this._ts = injector.get(core_1.TranslateService);
        this._slotService = injector.get(slots_service_1.SlotsService);
    }
    SlotNameValidator.prototype.validate = function (control) {
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
            _this._slotService.getSlotsList(_this._siteId)
                .subscribe(function (slots) {
                var result = slots;
                var existingSlot = null;
                var name = control.value;
                if (name) {
                    if (result && name) {
                        existingSlot = result.find(function (s) {
                            //name is returned as FunctionName/SlotName
                            var parsedName = s.name.split("/");
                            var slotName = parsedName[parsedName.length - 1];
                            return slotName.toLowerCase() === name.toLowerCase();
                        });
                    }
                    if (!existingSlot) {
                        resolve(null);
                    }
                    else {
                        resolve({
                            invalidSiteName: _this._ts.instant(portal_resources_1.PortalResources.validation_siteNameNotAvailable).format(control.value)
                        });
                    }
                }
            });
        });
    };
    return SlotNameValidator;
}());
exports.SlotNameValidator = SlotNameValidator;
//# sourceMappingURL=slotNameValidator.js.map