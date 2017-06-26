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
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/map");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/of");
var error_ids_1 = require("./../shared/models/error-ids");
var portal_resources_1 = require("./../shared/models/portal-resources");
var constants_1 = require("./../shared/models/constants");
var tree_node_1 = require("./tree-node");
var dashboard_type_1 = require("./models/dashboard-type");
var app_node_1 = require("./app-node");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var error_event_1 = require("../shared/models/error-event");
var AppsNode = (function (_super) {
    __extends(AppsNode, _super);
    function AppsNode(sideNav, rootNode, _subscriptionsStream, _searchTermStream, _initialResourceId) {
        var _this = _super.call(this, sideNav, null, rootNode) || this;
        _this._subscriptionsStream = _subscriptionsStream;
        _this._searchTermStream = _searchTermStream;
        _this._initialResourceId = _initialResourceId;
        _this.title = _this.sideNav.translateService.instant(portal_resources_1.PortalResources.functionApps);
        _this.dashboardType = dashboard_type_1.DashboardType.apps;
        _this.resourceId = "/apps";
        _this.childrenStream = new ReplaySubject_1.ReplaySubject(1);
        _this.isExpanded = true;
        _this._exactAppSearchExp = '\"(.+)\"';
        _this.newDashboardType = sideNav.configService.isStandalone() ? dashboard_type_1.DashboardType.createApp : null;
        _this.inSelectedTree = !!_this.newDashboardType;
        _this.iconClass = "tree-node-collection-icon";
        _this.iconUrl = "images/BulletList.svg";
        _this.showExpandIcon = false;
        _this.childrenStream.subscribe(function (children) {
            _this.children = children;
        });
        _this.childrenStream.next([]);
        var searchStream = _this._searchTermStream
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(function (searchTerm) {
            return _this._subscriptionsStream.distinctUntilChanged()
                .map(function (subscriptions) {
                return {
                    searchTerm: searchTerm,
                    subscriptions: subscriptions
                };
            });
        })
            .switchMap(function (result) {
            _this.childrenStream.next([]);
            if (!result.subscriptions || result.subscriptions.length === 0) {
                return Observable_1.Observable.of(null);
            }
            _this.isLoading = true;
            _this._subscriptions = result.subscriptions;
            return _this._doSearch(_this.children, result.searchTerm, result.subscriptions, 0, null);
        })
            .subscribe(function (result) {
            if (!result) {
                _this.isLoading = false;
                return;
            }
            var regex = new RegExp(_this._exactAppSearchExp, "i");
            var exactSearchResult = regex.exec(result.term);
            if (exactSearchResult && exactSearchResult.length > 1) {
                var filteredChildren = result.children.filter(function (c) {
                    if (c.title.toLowerCase() === exactSearchResult[1].toLowerCase()) {
                        c.select();
                        return true;
                    }
                    return false;
                });
                // Purposely don't update the stream with the filtered list of children.
                // This is because we only want the exact matching to affect the tree view,
                // not any other listeners.
                _this.childrenStream.next(result.children);
                _this.children = filteredChildren;
            }
            _this.isLoading = false;
        });
        return _this;
    }
    AppsNode.prototype.dispose = function () {
        this._initialResourceId = "";
    };
    AppsNode.prototype._doSearch = function (children, term, subscriptions, subsIndex, nextLink) {
        var _this = this;
        var url = null;
        var regex = new RegExp(this._exactAppSearchExp, "i");
        var exactSearchResult = regex.exec(term);
        var exactSearch = !!exactSearchResult && exactSearchResult.length > 1;
        var subsBatch = subscriptions.slice(subsIndex, subsIndex + constants_1.Arm.MaxSubscriptionBatchSize);
        // If the user wants an exact match, then we'll query everything and then filter to that
        // item.  This would be slower for some scenario's where you do an exact search and there
        // is already a filtered list.  But it will be much faster if the full list is already cached.
        if (!term || exactSearch) {
            url = this._getArmCacheUrl(subsBatch, nextLink, "Microsoft.Web/sites");
        }
        else {
            url = this._getArmSearchUrl(term, subsBatch, nextLink);
        }
        return this.sideNav.cacheService.get(url, false, null, true)
            .catch(function (e) {
            var err = e && e.json && e.json().error;
            if (!err) {
                err = { message: "Failed to query for resources." };
            }
            _this.sideNav.broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                message: err.message,
                details: err.code,
                errorId: error_ids_1.ErrorIds.failedToQueryArmResource,
                errorType: error_event_1.ErrorType.ApiError,
                resourceId: 'none'
            });
            return Observable_1.Observable.of(null);
        })
            .switchMap(function (r) {
            if (!r) {
                return Observable_1.Observable.of(r);
            }
            var result = r.json();
            var nodes = result.value
                .filter(function (armObj) {
                return armObj.kind && armObj.kind.toLowerCase() === "functionapp";
            })
                .map(function (armObj) {
                var newNode;
                if (armObj.id === _this.sideNav.selectedNode.resourceId) {
                    newNode = _this.sideNav.selectedNode;
                }
                else {
                    newNode = new app_node_1.AppNode(_this.sideNav, armObj, _this, subscriptions);
                    if (newNode.resourceId === _this._initialResourceId) {
                        newNode.select();
                    }
                }
                return newNode;
            });
            children = children.concat(nodes);
            // Only update children if we're not doing an exact match.  For exact matches, we
            // wait until everything is done loading and then show the final result
            if (!exactSearch) {
                _this.childrenStream.next(children);
            }
            if (result.nextLink || (subsIndex + constants_1.Arm.MaxSubscriptionBatchSize < subscriptions.length)) {
                return _this._doSearch(children, term, subscriptions, subsIndex + constants_1.Arm.MaxSubscriptionBatchSize, result.nextLink);
            }
            else {
                return Observable_1.Observable.of({
                    term: term,
                    children: children,
                });
            }
        });
    };
    AppsNode.prototype.addChild = function (childSiteObj) {
        var newNode = new app_node_1.AppNode(this.sideNav, childSiteObj, this, this._subscriptions);
        this._addChildAlphabetically(newNode);
        newNode.select();
    };
    AppsNode.prototype.removeChild = function (child, callRemoveOnChild) {
        var removeIndex = this.children.findIndex(function (childNode) {
            return childNode.resourceId === child.resourceId;
        });
        this._removeHelper(removeIndex, callRemoveOnChild);
        this.childrenStream.next(this.children);
        this.sideNav.cacheService.clearArmIdCachePrefix("/resources");
    };
    AppsNode.prototype._getArmCacheUrl = function (subs, nextLink, type1, type2) {
        var url;
        if (nextLink) {
            url = nextLink;
        }
        else {
            url = this.sideNav.armService.armUrl + "/resources?api-version=" + this.sideNav.armService.armApiVersion + "&$filter=(";
            for (var i = 0; i < subs.length; i++) {
                url += "subscriptionId eq '" + subs[i].subscriptionId + "'";
                if (i < subs.length - 1) {
                    url += " or ";
                }
            }
            url += ") and (resourceType eq '" + type1 + "'";
            if (type2) {
                url += " or resourceType eq '" + type2 + "'";
            }
            url += ")";
        }
        return url;
    };
    AppsNode.prototype._getArmSearchUrl = function (term, subs, nextLink) {
        var url;
        if (nextLink) {
            url = nextLink;
        }
        else {
            url = this.sideNav.armService.armUrl + "/resources?api-version=" + this.sideNav.armService.armApiVersion + "&$filter=(resourceType eq 'microsoft.web/sites') and (";
            for (var i = 0; i < subs.length; i++) {
                url += "subscriptionId eq '" + subs[i].subscriptionId + "'";
                if (i < subs.length - 1) {
                    url += " or ";
                }
            }
            url += ") and (substringof('" + term + "', name))";
        }
        return url;
    };
    return AppsNode;
}(tree_node_1.TreeNode));
exports.AppsNode = AppsNode;
//# sourceMappingURL=apps-node.js.map