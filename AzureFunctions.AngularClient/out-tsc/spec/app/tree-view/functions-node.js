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
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/of");
require("rxjs/add/observable/zip");
var authz_service_1 = require("./../shared/services/authz.service");
var tree_node_1 = require("./tree-node");
var dashboard_type_1 = require("./models/dashboard-type");
var portal_resources_1 = require("../shared/models/portal-resources");
var function_node_1 = require("./function-node");
var FunctionsNode = (function (_super) {
    __extends(FunctionsNode, _super);
    function FunctionsNode(sideNav, functionApp, parentNode) {
        var _this = _super.call(this, sideNav, functionApp.site.id + "/functions", parentNode) || this;
        _this.functionApp = functionApp;
        _this.title = _this.sideNav.translateService.instant(portal_resources_1.PortalResources.functions);
        _this.dashboardType = dashboard_type_1.DashboardType.functions;
        _this.newDashboardType = dashboard_type_1.DashboardType.createFunctionAutoDetect;
        _this.nodeClass = "tree-node collection-node";
        _this.iconClass = "tree-node-collection-icon";
        _this.iconUrl = "images/BulletList.svg";
        return _this;
    }
    FunctionsNode.prototype.loadChildren = function () {
        var _this = this;
        if (this.functionApp.site.properties.state === "Running") {
            return Observable_1.Observable.zip(this.sideNav.authZService.hasPermission(this.functionApp.site.id, [authz_service_1.AuthzService.writeScope]), this.sideNav.authZService.hasReadOnlyLock(this.functionApp.site.id), function (p, l) { return ({ hasWritePermission: p, hasReadOnlyLock: l }); })
                .switchMap(function (r) {
                if (r.hasWritePermission && !r.hasReadOnlyLock) {
                    return _this._updateTreeForStartedSite();
                }
                else if (!r.hasWritePermission) {
                    return _this._updateTreeForNonUsableState(_this.sideNav.translateService.instant(portal_resources_1.PortalResources.sideNav_FunctionsNoAccess));
                }
                else {
                    return _this._updateTreeForNonUsableState(_this.sideNav.translateService.instant(portal_resources_1.PortalResources.sideNav_FunctionsReadOnlyLock));
                }
            });
        }
        else {
            return this._updateTreeForNonUsableState(this.sideNav.translateService.instant(portal_resources_1.PortalResources.sideNav_FunctionsStopped));
        }
    };
    FunctionsNode.prototype.handleSelection = function () {
        if (!this.disabled) {
            this.parent.inSelectedTree = true;
            return this.parent.initialize();
        }
        return Observable_1.Observable.of({});
    };
    FunctionsNode.prototype.addChild = function (functionInfo) {
        functionInfo.functionApp = this.functionApp;
        this.sideNav.cacheService.clearCachePrefix(this.functionApp.getScmUrl());
        var newNode = new function_node_1.FunctionNode(this.sideNav, this, functionInfo, this);
        this._addChildAlphabetically(newNode);
        newNode.select();
    };
    FunctionsNode.prototype.removeChild = function (functionInfo, callRemoveOnChild) {
        var removeIndex = this.children.findIndex(function (childNode) {
            return childNode.functionInfo.name === functionInfo.name;
        });
        this._removeHelper(removeIndex, callRemoveOnChild);
    };
    FunctionsNode.prototype.openCreateDashboard = function (dashboardType, action) {
        this.newDashboardType = dashboardType;
        this.action = action;
        this.openCreateNew();
    };
    FunctionsNode.prototype.dispose = function (newSelectedNode) {
        this.parent.dispose(newSelectedNode);
    };
    FunctionsNode.prototype._updateTreeForNonUsableState = function (title) {
        this.newDashboardType = null;
        this.children = [];
        this.title = title;
        this.showExpandIcon = false;
        this.sideNav.cacheService.clearCachePrefix(this.functionApp.getScmUrl() + "/api/functions");
        return Observable_1.Observable.of(null);
    };
    FunctionsNode.prototype._updateTreeForStartedSite = function () {
        var _this = this;
        this.title = this.sideNav.translateService.instant(portal_resources_1.PortalResources.sidebar_Functions);
        this.newDashboardType = dashboard_type_1.DashboardType.createFunctionAutoDetect;
        this.showExpandIcon = true;
        if (this.parent.inSelectedTree) {
            this.inSelectedTree = true;
        }
        if (!this.children || this.children.length === 0) {
            return this.functionApp.getFunctions()
                .map(function (fcs) {
                var fcNodes = [];
                fcs.forEach(function (fc) {
                    fc.functionApp = _this.functionApp;
                    fcNodes.push(new function_node_1.FunctionNode(_this.sideNav, _this, fc, _this));
                });
                _this.children = fcNodes;
                return null;
            });
        }
        else {
            return Observable_1.Observable.of(null);
        }
    };
    return FunctionsNode;
}(tree_node_1.TreeNode));
exports.FunctionsNode = FunctionsNode;
//# sourceMappingURL=functions-node.js.map