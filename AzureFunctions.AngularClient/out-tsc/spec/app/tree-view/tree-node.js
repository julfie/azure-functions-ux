"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/do");
require("rxjs/add/observable/of");
var TreeNode = (function () {
    function TreeNode(sideNav, resourceId, parent) {
        this.sideNav = sideNav;
        this.resourceId = resourceId;
        this.parent = parent;
        this.showExpandIcon = true;
        this.nodeClass = "tree-node";
        this.children = [];
        this.supportsRefresh = false;
        this.supportsAdvanced = false;
        this.supportsScope = false;
        this.disabled = false;
        this.inSelectedTree = false;
        this.isFocused = false;
    }
    TreeNode.prototype.select = function (force) {
        var _this = this;
        if (this.disabled || !this.resourceId) {
            return;
        }
        // Expanding without toggling before updating the view is useful for nodes
        // that do async work.  This way, the arrow is expanded while the node is loading.
        if (!this.isExpanded) {
            this.isExpanded = true;
        }
        this.sideNav.updateView(this, this.dashboardType, force)
            .do(null, function (e) {
            _this.sideNav.aiService.trackException(e, "/errors/tree-node/select");
        })
            .subscribe(function (r) {
            // If updating the view didn't also populate children,
            // then we'll load them manally here.
            if (_this.isExpanded && _this.children.length === 0) {
                _this._loadAndExpandChildrenIfSingle();
            }
        });
    };
    // Virtual
    TreeNode.prototype.handleSelection = function () {
        this.isLoading = false;
        return Observable_1.Observable.of(null);
    };
    // Virtual
    TreeNode.prototype.refresh = function (event) {
        var _this = this;
        this.isLoading = true;
        this.handleRefresh()
            .do(null, function (e) {
            _this.sideNav.aiService.trackException(e, "/errors/tree-node/refresh");
        })
            .subscribe(function (r) {
            _this.sideNav.updateView(_this.sideNav.selectedNode, _this.sideNav.selectedDashboardType, true)
                .do(null, function (e) {
                _this.sideNav.aiService.trackException(e, "/errors/tree-node/refresh/update-view");
            })
                .subscribe(function () { });
            _this.isLoading = false;
        });
        if (event) {
            event.stopPropagation();
        }
    };
    TreeNode.prototype.handleRefresh = function () {
        return Observable_1.Observable.of(null);
    };
    TreeNode.prototype.toggle = function (event) {
        if (!this.isExpanded) {
            this.isLoading = true;
            this.isExpanded = true;
            this._loadAndExpandChildrenIfSingle();
        }
        else {
            this.isExpanded = false;
        }
        if (event) {
            event.stopPropagation();
        }
    };
    TreeNode.prototype._loadAndExpandChildrenIfSingle = function () {
        var _this = this;
        this.loadChildren()
            .do(null, function (e) {
            _this.sideNav.aiService.trackException(e, "/errors/tree-node/expand-single/load-children");
        })
            .subscribe(function () {
            _this.isLoading = false;
            if (_this.children && _this.children.length > 0) {
                var matchingChild = _this.children.find(function (c) {
                    return _this.sideNav.initialResourceId && _this.sideNav.initialResourceId.toLowerCase().startsWith((_this.resourceId + "/" + c.title).toLowerCase());
                });
                if (matchingChild) {
                    matchingChild.select();
                }
                else if (_this.children.length === 1 && !_this.children[0].isExpanded) {
                    _this.children[0].toggle(null);
                }
                else {
                    _this.sideNav.initialResourceId = null;
                }
            }
            else {
                _this.sideNav.initialResourceId = null;
            }
            if (_this.sideNav.initialResourceId && _this.sideNav.initialResourceId.toLowerCase() === _this.resourceId.toLowerCase()) {
                _this.sideNav.initialResourceId = null;
            }
        });
    };
    TreeNode.prototype.openCreateNew = function (event) {
        var _this = this;
        this.sideNav.updateView(this, this.newDashboardType)
            .do(null, function (e) {
            _this.sideNav.aiService.trackException(e, "/errors/tree-node/open-create/update-view");
        })
            .subscribe(function () { });
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
    };
    TreeNode.prototype.shouldBlockNavChange = function () {
        return false;
    };
    TreeNode.prototype.loadChildren = function () {
        return Observable_1.Observable.of(null);
    };
    TreeNode.prototype.dispose = function (newSelectedNode) {
    };
    TreeNode.prototype.remove = function () {
    };
    TreeNode.prototype._removeHelper = function (removeIndex, callRemoveOnChild) {
        if (removeIndex > -1) {
            var child = this.children[removeIndex];
            this.children.splice(removeIndex, 1);
            if (callRemoveOnChild) {
                child.remove();
            }
            this.sideNav.clearView(child.resourceId);
        }
    };
    TreeNode.prototype.getTreePathNames = function () {
        var path = [];
        var curNode = this;
        while (curNode) {
            path.splice(0, 0, curNode.title);
            curNode = curNode.parent;
        }
        return path;
    };
    TreeNode.prototype.scopeToNode = function () {
        this.sideNav.searchExact(this.title);
    };
    TreeNode.prototype._addChildAlphabetically = function (newChild) {
        var i;
        for (i = 0; i < this.children.length; i++) {
            if (newChild.title.toLowerCase() < this.children[i].title.toLowerCase()) {
                this.children.splice(i, 0, newChild);
                break;
            }
        }
        if (i === this.children.length) {
            this.children.push(newChild);
        }
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;
//# sourceMappingURL=tree-node.js.map