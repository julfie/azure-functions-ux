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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/observable/of");
var core_2 = require("@ngx-translate/core");
var config_service_1 = require("./../shared/services/config.service");
var portal_resources_1 = require("./../shared/models/portal-resources");
var authz_service_1 = require("./../shared/services/authz.service");
var language_service_1 = require("./../shared/services/language.service");
var constants_1 = require("./../shared/models/constants");
var resourceDescriptors_1 = require("./../shared/resourceDescriptors");
var portal_service_1 = require("./../shared/services/portal.service");
var local_storage_service_1 = require("./../shared/services/local-storage.service");
var tree_node_1 = require("../tree-view/tree-node");
var apps_node_1 = require("../tree-view/apps-node");
var app_node_1 = require("../tree-view/app-node");
var arm_service_1 = require("../shared/services/arm.service");
var cache_service_1 = require("../shared/services/cache.service");
var user_service_1 = require("../shared/services/user.service");
var functions_service_1 = require("../shared/services/functions.service");
var global_state_service_1 = require("../shared/services/global-state.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var ai_service_1 = require("../shared/services/ai.service");
var dashboard_type_1 = require("../tree-view/models/dashboard-type");
var slots_service_1 = require("./../shared/services/slots.service");
var SideNavComponent = (function () {
    function SideNavComponent(configService, armService, cacheService, functionsService, http, globalStateService, broadcastService, translateService, userService, aiService, localStorageService, portalService, languageService, authZService, slotsService) {
        var _this = this;
        this.configService = configService;
        this.armService = armService;
        this.cacheService = cacheService;
        this.functionsService = functionsService;
        this.http = http;
        this.globalStateService = globalStateService;
        this.broadcastService = broadcastService;
        this.translateService = translateService;
        this.userService = userService;
        this.aiService = aiService;
        this.localStorageService = localStorageService;
        this.portalService = portalService;
        this.languageService = languageService;
        this.authZService = authZService;
        this.slotsService = slotsService;
        this.subscriptionOptions = [];
        this.selectedSubscriptions = [];
        this.subscriptionsDisplayText = "";
        this.searchTerm = "";
        this.hasValue = false;
        this._savedSubsKey = "/subscriptions/selectedIds";
        this._subscriptionsStream = new ReplaySubject_1.ReplaySubject(1);
        this._searchTermStream = new Subject_1.Subject();
        this._initialized = false;
        this._tryFunctionAppStream = new Subject_1.Subject();
        this.treeViewInfoEvent = new core_1.EventEmitter();
        userService.getStartupInfo().subscribe(function (info) {
            // This is a workaround for the fact that Ibiza sends us an updated info whenever
            // child blades close.  If we get a new info object, then we'll rebuild the tree.
            // The true fix would be to make sure that we never set the resourceId of the hosting
            // blade, but that's a pretty large change and this should be sufficient for now.
            if (!_this._initialized) {
                _this._initialized = true;
                // this.resourceId = !!this.resourceId ? this.resourceId : info.resourceId;
                _this.initialResourceId = info.resourceId;
                var appsNode_1 = new apps_node_1.AppsNode(_this, _this._subscriptionsStream, _this._searchTermStream, _this.resourceId);
                _this.rootNode = new tree_node_1.TreeNode(_this, null, null);
                _this.rootNode.children = [appsNode_1];
                _this.rootNode.isExpanded = true;
                // Need to allow the appsNode to wire up its subscriptions
                setTimeout(function () {
                    appsNode_1.select();
                }, 10);
                _this._searchTermStream
                    .subscribe(function (term) {
                    _this.searchTerm = term;
                });
                // Get the streams in the top-level nodes moving
                if (_this.initialResourceId) {
                    var descriptor = resourceDescriptors_1.Descriptor.getDescriptor(_this.initialResourceId);
                    if (descriptor.site) {
                        _this._searchTermStream.next("\"" + descriptor.site + "\"");
                        _this.hasValue = true;
                    }
                    else {
                        _this._searchTermStream.next("");
                    }
                }
                else {
                    _this._searchTermStream.next("");
                }
                if (_this.subscriptionOptions.length === 0) {
                    _this._setupInitialSubscriptions(info.resourceId);
                }
            }
        });
        this._tryFunctionAppStream
            .mergeMap(function (tryFunctionApp) {
            _this.tryFunctionApp = tryFunctionApp;
            return tryFunctionApp.getFunctions();
        })
            .subscribe(function (functions) {
            _this.globalStateService.clearBusyState();
            var functionInfo = null;
            if (functions && functions.length > 0) {
                _this.initialResourceId = _this.tryFunctionApp.site.id + "/functions/" + functions[0].name;
            }
            else {
                _this.initialResourceId = _this.tryFunctionApp.site.id;
            }
            var appNode = new app_node_1.AppNode(_this, _this.tryFunctionApp.site, null, [], false);
            appNode.select();
            _this.rootNode = new tree_node_1.TreeNode(_this, null, null);
            _this.rootNode.children = [appNode];
            _this.rootNode.isExpanded = true;
        });
    }
    Object.defineProperty(SideNavComponent.prototype, "tryFunctionAppInput", {
        set: function (functionApp) {
            if (functionApp) {
                this._tryFunctionAppStream.next(functionApp);
            }
        },
        enumerable: true,
        configurable: true
    });
    SideNavComponent.prototype.updateView = function (newSelectedNode, newDashboardType, force) {
        if (this.selectedNode) {
            if (!force && this.selectedNode === newSelectedNode && this.selectedDashboardType === newDashboardType) {
                return Observable_1.Observable.of(false);
            }
            else {
                if (this.selectedNode.shouldBlockNavChange()) {
                    return Observable_1.Observable.of(false);
                }
                this.selectedNode.dispose(newSelectedNode);
            }
        }
        this._logDashboardTypeChange(this.selectedDashboardType, newDashboardType);
        this.selectedNode = newSelectedNode;
        this.selectedDashboardType = newDashboardType;
        this.resourceId = newSelectedNode.resourceId;
        var viewInfo = {
            resourceId: newSelectedNode.resourceId,
            dashboardType: newDashboardType,
            node: newSelectedNode,
            data: {}
        };
        this.globalStateService.setDisabledMessage(null);
        this.treeViewInfoEvent.emit(viewInfo);
        this._updateTitle(newSelectedNode);
        this.portalService.closeBlades();
        return newSelectedNode.handleSelection();
    };
    SideNavComponent.prototype._logDashboardTypeChange = function (oldDashboard, newDashboard) {
        var oldDashboardType = dashboard_type_1.DashboardType[oldDashboard];
        var newDashboardType = dashboard_type_1.DashboardType[newDashboard];
        this.aiService.trackEvent('/sidenav/change-dashboard', {
            source: oldDashboardType,
            dest: newDashboardType
        });
    };
    SideNavComponent.prototype._updateTitle = function (node) {
        var pathNames = node.getTreePathNames();
        var title = "";
        var subtitle = "";
        for (var i = 0; i < pathNames.length; i++) {
            if (i % 2 === 1) {
                title += pathNames[i] + " - ";
            }
        }
        // Remove trailing dash
        if (title.length > 3) {
            title = title.substring(0, title.length - 3);
        }
        if (!title) {
            title = this.translateService.instant(portal_resources_1.PortalResources.functionApps);
            subtitle = "";
        }
        else {
            subtitle = this.translateService.instant(portal_resources_1.PortalResources.functionApps);
            ;
        }
        this.portalService.updateBladeInfo(title, subtitle);
    };
    SideNavComponent.prototype.clearView = function (resourceId) {
        // We only want to clear the view if the user is currently looking at something
        // under the tree path being deleted
        if (this.resourceId.startsWith(resourceId)) {
            this.treeViewInfoEvent.emit(null);
        }
    };
    SideNavComponent.prototype.search = function (event) {
        if (typeof event === "string") {
            this._searchTermStream.next(event);
            this.hasValue = !!event;
        }
        else {
            this.hasValue = !!event.target.value;
            var startPos_1 = event.target.selectionStart;
            var endPos_1 = event.target.selectionEnd;
            // TODO: ellhamai - this is a hack and it's not perfect.  Basically everytime we update
            // the searchTerm, we end up resetting the cursor.  It's better than before, but
            // it's still not great because if the user types really fast, the cursor still moves.
            this._searchTermStream.next(event.target.value);
            if (event.target.value.length !== startPos_1) {
                setTimeout(function () {
                    event.target.selectionStart = startPos_1;
                    event.target.selectionEnd = endPos_1;
                });
            }
        }
    };
    SideNavComponent.prototype.searchExact = function (term) {
        this.hasValue = !!term;
        this._searchTermStream.next("\"" + term + "\"");
    };
    SideNavComponent.prototype.clearSearch = function () {
        this.hasValue = false;
        this._searchTermStream.next("");
    };
    SideNavComponent.prototype.onSubscriptionsSelect = function (subscriptions) {
        var subIds;
        if (subscriptions.length === this.subscriptionOptions.length) {
            subIds = []; // Equivalent of all subs
        }
        else {
            subIds = subscriptions.map(function (s) { return s.subscriptionId; });
        }
        var storedSelectedSubIds = {
            id: this._savedSubsKey,
            subscriptions: subIds
        };
        this.localStorageService.setItem(storedSelectedSubIds.id, storedSelectedSubIds);
        this.selectedSubscriptions = subscriptions;
        this._subscriptionsStream.next(subscriptions);
        if (subscriptions.length === this.subscriptionOptions.length) {
            this._updateSubDisplayText(this.translateService.instant(portal_resources_1.PortalResources.sideNav_AllSubscriptions));
        }
        else if (subscriptions.length > 1) {
            this._updateSubDisplayText(this.translateService.instant(portal_resources_1.PortalResources.sideNav_SubscriptionCount).format(subscriptions.length));
        }
        else {
            this._updateSubDisplayText("" + subscriptions[0].displayName);
        }
    };
    // The multi-dropdown component has its own default display text values,
    // so we need to make sure we're always overwriting them.  But if we simply
    // set the value to the same value twice, no change notification will happen.
    SideNavComponent.prototype._updateSubDisplayText = function (displayText) {
        var _this = this;
        this.subscriptionsDisplayText = "";
        setTimeout(function () {
            _this.subscriptionsDisplayText = displayText;
        }, 10);
    };
    SideNavComponent.prototype._setupInitialSubscriptions = function (resourceId) {
        var _this = this;
        var savedSubs = this.localStorageService.getItem(this._savedSubsKey);
        var savedSelectedSubscriptionIds = savedSubs ? savedSubs.subscriptions : [];
        var descriptor;
        if (resourceId) {
            descriptor = new resourceDescriptors_1.SiteDescriptor(resourceId);
        }
        // Need to set an initial value to force the tree to render with an initial list first.
        // Otherwise the tree won't load in batches of objects for long lists until the entire
        // observable sequence has completed.
        this._subscriptionsStream.next([]);
        this.userService.getStartupInfo()
            .first()
            .subscribe(function (info) {
            var count = 0;
            _this.subscriptionOptions =
                info.subscriptions.map(function (e) {
                    var subSelected;
                    if (descriptor) {
                        subSelected = descriptor.subscription === e.subscriptionId;
                    }
                    else {
                        // Multi-dropdown defaults to all of none is selected.  So setting it here
                        // helps us figure out whether we need to limit the # of initial subscriptions
                        subSelected =
                            savedSelectedSubscriptionIds.length === 0
                                || savedSelectedSubscriptionIds.findIndex(function (s) { return s === e.subscriptionId; }) > -1;
                    }
                    if (subSelected) {
                        count++;
                    }
                    return {
                        displayLabel: e.displayName,
                        value: e,
                        isSelected: subSelected && count <= constants_1.Arm.MaxSubscriptionBatchSize
                    };
                })
                    .sort(function (a, b) { return a.displayLabel.localeCompare(b.displayLabel); });
        });
    };
    return SideNavComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], SideNavComponent.prototype, "treeViewInfoEvent", void 0);
SideNavComponent = __decorate([
    core_1.Component({
        selector: 'side-nav',
        templateUrl: './side-nav.component.html',
        styleUrls: ['./side-nav.component.scss'],
        inputs: ['tryFunctionAppInput']
    }),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        arm_service_1.ArmService,
        cache_service_1.CacheService,
        functions_service_1.FunctionsService,
        http_1.Http,
        global_state_service_1.GlobalStateService,
        broadcast_service_1.BroadcastService,
        core_2.TranslateService,
        user_service_1.UserService,
        ai_service_1.AiService,
        local_storage_service_1.LocalStorageService,
        portal_service_1.PortalService,
        language_service_1.LanguageService,
        authz_service_1.AuthzService,
        slots_service_1.SlotsService])
], SideNavComponent);
exports.SideNavComponent = SideNavComponent;
//# sourceMappingURL=side-nav.component.js.map