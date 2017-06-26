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
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var arm_service_1 = require("./arm.service");
var cache_service_1 = require("./cache.service");
var constants_1 = require("../../shared/models/constants");
var SlotsService = SlotsService_1 = (function () {
    function SlotsService(_cacheService, _armService) {
        this._cacheService = _cacheService;
        this._armService = _armService;
    }
    SlotsService.prototype.getSlotsList = function (siteId) {
        if (SlotsService_1.isSlot(siteId)) {
            return Observable_1.Observable.of([]);
        }
        return this._cacheService.getArm("/" + siteId + "/slots").map(function (r) { return r.json().value; });
    };
    //Create Slot
    SlotsService.prototype.createNewSlot = function (siteId, slotName, loc, serverfarmId) {
        // create payload
        var payload = JSON.stringify({
            location: loc,
            properties: {
                serverFarmId: serverfarmId
            }
        });
        return this._cacheService.putArm(siteId + "/slots/" + slotName, this._armService.websiteApiVersion, payload);
    };
    SlotsService.isSlot = function (siteId) {
        // slots id looks like
        // /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Web/sites/<siteName>/slots/<slotName>
        // split('/')
        //  [
        //      0: "",
        //      1: "subscriptions",
        //      2: "<subscriptionId>",
        //      3: "resourceGroups",
        //      4: "<resourceGroupName>",
        //      5: "providers",
        //      6: "Microsoft.Web",
        //      7: "sites",
        //      8: "<siteName>",
        //      9: "slots:,
        //      10: "<slotName>"
        //  ]
        var siteSegments = siteId.split("/");
        return siteSegments.length === 11 && siteSegments[9].toLowerCase() === "slots";
    };
    SlotsService.prototype.setStatusOfSlotOptIn = function (site, appSetting, value) {
        appSetting.properties[constants_1.Constants.slotsSecretStorageSettingsName] = value;
        return this._cacheService.putArm(appSetting.id, this._armService.websiteApiVersion, appSetting);
    };
    return SlotsService;
}());
SlotsService = SlotsService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        arm_service_1.ArmService])
], SlotsService);
exports.SlotsService = SlotsService;
var SlotsService_1;
//# sourceMappingURL=slots.service.js.map