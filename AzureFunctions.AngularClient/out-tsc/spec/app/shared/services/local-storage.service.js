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
var portal_service_1 = require("./portal.service");
var portal_1 = require("../models/portal");
var core_1 = require("@angular/core");
var LocalStorageService = (function () {
    function LocalStorageService(_portalService) {
        this._portalService = _portalService;
        this._apiVersion = "2017-02-01";
        this._apiVersionKey = "appsvc-api-version";
        var apiVersion = localStorage.getItem(this._apiVersionKey);
        if (!apiVersion || apiVersion !== this._apiVersion) {
            this._resetStorage();
        }
    }
    LocalStorageService.prototype.getItem = function (key) {
        return JSON.parse(localStorage.getItem(key));
    };
    LocalStorageService.prototype.setItem = function (key, item) {
        try {
            localStorage.setItem(key, JSON.stringify(item));
        }
        catch (e) {
            this._portalService.logMessage(portal_1.LogEntryLevel.Debug, "Clearing local storage with " + localStorage.length + " items.  " + e);
            this._resetStorage();
            try {
                localStorage.setItem(key, JSON.stringify(item));
            }
            catch (e2) {
                this._portalService.logMessage(portal_1.LogEntryLevel.Error, "Failed to save to local storage on 2nd attempt. ${e2}");
            }
        }
    };
    LocalStorageService.prototype._resetStorage = function () {
        localStorage.clear();
        localStorage.setItem(this._apiVersionKey, this._apiVersion);
    };
    return LocalStorageService;
}());
LocalStorageService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [portal_service_1.PortalService])
], LocalStorageService);
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=local-storage.service.js.map