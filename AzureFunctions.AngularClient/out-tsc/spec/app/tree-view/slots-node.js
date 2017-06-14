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
var tree_node_1 = require("./tree-node");
var dashboard_type_1 = require("./models/dashboard-type");
var portal_resources_1 = require("../shared/models/portal-resources");
var app_node_1 = require("./app-node");
var SlotsNode = (function (_super) {
    __extends(SlotsNode, _super);
    function SlotsNode(sideNav, _subscriptions, _siteArmCacheObj, parentNode) {
        var _this = _super.call(this, sideNav, _siteArmCacheObj.id + "/slots", parentNode) || this;
        _this._subscriptions = _subscriptions;
        _this._siteArmCacheObj = _siteArmCacheObj;
        _this.dashboardType = dashboard_type_1.DashboardType.slots;
        _this.newDashboardType = dashboard_type_1.DashboardType.createSlot;
        _this.title = _this.sideNav.translateService.instant(portal_resources_1.PortalResources.appFunctionSettings_slotsOptinSettings);
        _this.nodeClass = "tree-node collection-node";
        _this.iconClass = "tree-node-collection-icon";
        _this.iconUrl = "images/BulletList.svg";
        return _this;
    }
    SlotsNode.prototype.loadChildren = function () {
        var _this = this;
        return this.sideNav.slotsService.getSlotsList(this._siteArmCacheObj.id)
            .do(function (slots) {
            var slotNodes = [];
            _this.children = slots.map(function (s) { return new app_node_1.SlotNode(_this.sideNav, s, _this, _this._subscriptions); });
        });
    };
    SlotsNode.prototype.addChild = function (childSiteObj) {
        var newNode = new app_node_1.SlotNode(this.sideNav, childSiteObj, this, this._subscriptions);
        this._addChildAlphabetically(newNode);
        newNode.select();
        this.sideNav.cacheService.clearArmIdCachePrefix('/slots');
    };
    SlotsNode.prototype.removeChild = function (child, callRemoveOnChild) {
        var removeIndex = this.children.findIndex(function (childNode) {
            return childNode.resourceId === child.resourceId;
        });
        this._removeHelper(removeIndex, callRemoveOnChild);
        this.sideNav.cacheService.clearArmIdCachePrefix('/slots');
    };
    SlotsNode.prototype.dispose = function (newSelectedNode) {
        this.parent.dispose(newSelectedNode);
    };
    return SlotsNode;
}(tree_node_1.TreeNode));
exports.SlotsNode = SlotsNode;
//# sourceMappingURL=slots-node.js.map