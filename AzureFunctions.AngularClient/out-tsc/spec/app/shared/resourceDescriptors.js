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
Object.defineProperty(exports, "__esModule", { value: true });
var ResourceType;
(function (ResourceType) {
    ResourceType[ResourceType["none"] = 0] = "none";
    ResourceType[ResourceType["site"] = 1] = "site";
    ResourceType[ResourceType["serverFarm"] = 2] = "serverFarm";
    ResourceType[ResourceType["hostingEnvironment"] = 3] = "hostingEnvironment";
    ResourceType[ResourceType["slot"] = 4] = "slot";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
var Descriptor = (function () {
    function Descriptor(resourceId) {
        this.resourceType = ResourceType.none;
        this.resourceId = resourceId;
        this.parts = resourceId.split('/').filter(function (part) { return !!part; });
        if (this.parts.length < 4) {
            throw "resourceId length is too short: " + resourceId;
        }
        if (this.parts[0].toLowerCase() !== 'subscriptions') {
            throw "Expected subscriptions segment in resourceId: " + resourceId;
        }
        if (this.parts[2].toLowerCase() !== 'resourcegroups') {
            throw "Expected resourceGroups segment in resourceId: " + resourceId;
        }
        this.subscription = this.parts[1];
        this.resourceGroup = this.parts[3];
    }
    Descriptor.getDescriptor = function (resourceId) {
        var parts = resourceId.split('/').filter(function (part) { return !!part; });
        if (parts.length >= 7 && parts[6].toLowerCase() === 'sites') {
            return new SiteDescriptor(resourceId);
        }
        else {
            return new Descriptor(resourceId);
        }
    };
    return Descriptor;
}());
exports.Descriptor = Descriptor;
var SiteDescriptor = (function (_super) {
    __extends(SiteDescriptor, _super);
    function SiteDescriptor(resourceId) {
        var _this = _super.call(this, resourceId) || this;
        _this.resourceType = ResourceType.site;
        if (_this.parts.length < 8) {
            throw "resourceId length is too short for site descriptor: " + resourceId;
        }
        if (_this.parts[6].toLowerCase() !== 'sites') {
            throw "Expected sites segment in resourceId: " + resourceId;
        }
        _this.site = _this.parts[7];
        if (_this.parts.length > 8 && _this.parts[8].toLowerCase() === "slots") {
            _this.slot = _this.parts[9];
            _this.resourceType = ResourceType.slot;
        }
        return _this;
    }
    SiteDescriptor.prototype.getWebsiteId = function () {
        if (!this._websiteId) {
            var name_1 = !this.slot ? this.site : this.site + "(" + this.slot + ")";
            this._websiteId = {
                Name: name_1,
                SubscriptionId: this.subscription,
                ResourceGroup: this.resourceGroup
            };
        }
        return this._websiteId;
    };
    SiteDescriptor.getSiteDescriptor = function (resourceId) {
        var parts = resourceId.split("/").filter(function (part) { return !!part; });
        var siteId = "";
        var maxIndex;
        if (parts.length >= 10 && parts[8].toLowerCase() === "slots") {
            maxIndex = 9;
        }
        else if (parts.length >= 8 && parts[6].toLowerCase() === "sites") {
            maxIndex = 7;
        }
        else {
            throw 'Not enough segments in site or slot id';
        }
        for (var i = 0; i <= maxIndex; i++) {
            siteId = siteId + "/" + parts[i];
        }
        return new SiteDescriptor(siteId);
    };
    return SiteDescriptor;
}(Descriptor));
exports.SiteDescriptor = SiteDescriptor;
var FunctionDescriptor = (function (_super) {
    __extends(FunctionDescriptor, _super);
    function FunctionDescriptor(resourceId) {
        var _this = _super.call(this, resourceId) || this;
        if (_this.parts.length < 10) {
            throw "Not enough segments in function id";
        }
        if ((_this.parts[6].toLowerCase() !== "sites" || _this.parts[8].toLowerCase() !== "functions")
            && (_this.parts[6].toLowerCase() !== "sites" || _this.parts[8].toLowerCase() !== "proxies")) {
            throw "Not a function/proxy id";
        }
        _this.functionName = _this.parts[9];
        return _this;
    }
    return FunctionDescriptor;
}(Descriptor));
exports.FunctionDescriptor = FunctionDescriptor;
//# sourceMappingURL=resourceDescriptors.js.map