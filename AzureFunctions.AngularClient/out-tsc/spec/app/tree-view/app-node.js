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
var slots_service_1 = require("./../shared/services/slots.service");
var Observable_1 = require("rxjs/Observable");
var ReplaySubject_1 = require("rxjs/ReplaySubject");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/concatMap");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/share");
require("rxjs/add/operator/take");
require("rxjs/add/observable/of");
require("rxjs/add/observable/timer");
require("rxjs/add/observable/zip");
var portal_resources_1 = require("./../shared/models/portal-resources");
var error_ids_1 = require("./../shared/models/error-ids");
var authz_service_1 = require("./../shared/services/authz.service");
var resourceDescriptors_1 = require("./../shared/resourceDescriptors");
var tree_node_1 = require("./tree-node");
var dashboard_type_1 = require("./models/dashboard-type");
var slots_node_1 = require("./slots-node");
var functions_node_1 = require("./functions-node");
var proxies_node_1 = require("./proxies-node");
var function_app_1 = require("../shared/function-app");
var constants_1 = require("../shared/models/constants");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var error_event_1 = require("../shared/models/error-event");
var AppNode = (function (_super) {
    __extends(AppNode, _super);
    function AppNode(sideBar, _siteArmCacheObj, parentNode, _subscriptions, disabled) {
        var _this = _super.call(this, sideBar, _siteArmCacheObj.id, parentNode) || this;
        _this._siteArmCacheObj = _siteArmCacheObj;
        _this._subscriptions = _subscriptions;
        _this.supportsAdvanced = true;
        _this.inAdvancedMode = false;
        _this.dashboardType = dashboard_type_1.DashboardType.app;
        _this.disabled = false;
        _this.supportsScope = false;
        _this.supportsRefresh = false;
        _this.isSlot = false; // both slot & function are of type app, this is used to distinguish
        _this.functionAppStream = new ReplaySubject_1.ReplaySubject(1);
        _this.openFunctionSettingsTab = false;
        _this.nodeClass = "tree-node app-node";
        _this.iconClass = "tree-node-svg-icon";
        _this.iconUrl = "images/functions.svg";
        _this.disabled = !!disabled;
        if (disabled) {
            _this.supportsAdvanced = false;
        }
        _this.title = _siteArmCacheObj.name;
        _this.location = _siteArmCacheObj.location;
        var descriptor = new resourceDescriptors_1.SiteDescriptor(_siteArmCacheObj.id);
        _this.resourceGroup = descriptor.resourceGroup;
        var sub = _subscriptions.find(function (sub) {
            return sub.subscriptionId === descriptor.subscription;
        });
        _this.subscription = sub && sub.displayName;
        return _this;
    }
    AppNode.prototype.handleSelection = function () {
        if (!this.disabled) {
            return this.initialize(false);
        }
        return Observable_1.Observable.of({});
    };
    AppNode.prototype.loadChildren = function () {
        if (!this.disabled) {
            return this.initialize(true);
        }
        return Observable_1.Observable.of({});
    };
    AppNode.prototype.initialize = function (expandOnly) {
        var _this = this;
        if (!expandOnly) {
            this.inSelectedTree = true;
        }
        this.supportsRefresh = false;
        this.isLoading = true;
        if (this._loadingObservable) {
            return this._loadingObservable;
        }
        this._loadingObservable = Observable_1.Observable.zip(this.sideNav.authZService.hasPermission(this._siteArmCacheObj.id, [authz_service_1.AuthzService.writeScope]), this.sideNav.authZService.hasReadOnlyLock(this._siteArmCacheObj.id), this.sideNav.cacheService.getArm(this._siteArmCacheObj.id), function (h, r, s) { return ({ hasWritePermission: h, hasReadOnlyLock: r, siteResponse: s }); })
            .mergeMap(function (r) {
            _this.isLoading = false;
            var site = r.siteResponse.json();
            if (!_this._functionApp) {
                _this._setupFunctionApp(site);
                if (site.properties.state === "Running" && r.hasWritePermission && !r.hasReadOnlyLock) {
                    return _this._setupBackgroundTasks()
                        .map(function () {
                        _this.supportsRefresh = true;
                    });
                }
                else {
                    _this.dispose();
                    _this.supportsRefresh = true;
                    return Observable_1.Observable.of(null);
                }
            }
            _this.supportsRefresh = true;
            return Observable_1.Observable.of(null);
        })
            .do(function (r) {
            _this.isLoading = false;
            if (_this.inSelectedTree) {
                _this.children.forEach(function (c) { return c.inSelectedTree = true; });
            }
            _this._loadingObservable = null;
        }, function (e) {
            _this.isLoading = false;
        })
            .share();
        return this._loadingObservable;
    };
    AppNode.prototype._setupFunctionApp = function (site) {
        if (this.sideNav.tryFunctionApp) {
            this._functionApp = this.sideNav.tryFunctionApp;
            var functionsNode = new functions_node_1.FunctionsNode(this.sideNav, this._functionApp, this);
            functionsNode.toggle(null);
            this.children = [functionsNode];
        }
        else {
            this._functionApp = new function_app_1.FunctionApp(site, this.sideNav.http, this.sideNav.userService, this.sideNav.globalStateService, this.sideNav.translateService, this.sideNav.broadcastService, this.sideNav.armService, this.sideNav.cacheService, this.sideNav.languageService, this.sideNav.authZService, this.sideNav.aiService, this.sideNav.configService, this.sideNav.slotsService);
            this.functionAppStream.next(this._functionApp);
            var functionsNode = new functions_node_1.FunctionsNode(this.sideNav, this._functionApp, this);
            functionsNode.toggle(null);
            this.children = [functionsNode];
            if (!this.sideNav.configService.isStandalone()) {
                var proxiesNode = new proxies_node_1.ProxiesNode(this.sideNav, this._functionApp, this);
                var slotsNode = new slots_node_1.SlotsNode(this.sideNav, this._subscriptions, this._siteArmCacheObj, this);
                proxiesNode.toggle(null);
                // Do not auto expand slotsNode
                // for slots Node hide the slots as child Node
                if (this.isSlot) {
                    this.supportsScope = false;
                    this.children.push(proxiesNode);
                }
                else {
                    this.supportsScope = true;
                    this.children.push(proxiesNode, slotsNode);
                }
            }
        }
    };
    AppNode.prototype.handleRefresh = function () {
        var _this = this;
        if (this.sideNav.selectedNode.shouldBlockNavChange()) {
            return Observable_1.Observable.of(null);
        }
        // Make sure there isn't a load operation currently being performed
        var loadObs = this._loadingObservable ? this._loadingObservable : Observable_1.Observable.of({});
        return loadObs
            .mergeMap(function () {
            _this.sideNav.aiService.trackEvent('/actions/refresh');
            _this._functionApp.fireSyncTrigger();
            _this.sideNav.cacheService.clearCache();
            _this.dispose();
            _this._functionApp = null;
            _this.functionAppStream.next(null);
            return _this.initialize();
        })
            .do(function () {
            _this.isLoading = false;
            if (_this.children && _this.children.length === 1 && !_this.children[0].isExpanded) {
                _this.children[0].toggle(null);
            }
        });
    };
    AppNode.prototype.remove = function () {
        if (this.isSlot) {
            this.parent.removeChild(this, false);
        }
        else {
            this.parent.removeChild(this, false);
        }
        this.sideNav.cacheService.clearArmIdCachePrefix(this.resourceId);
        this.dispose();
    };
    AppNode.prototype.dispose = function (newSelectedNode) {
        var _this = this;
        // Ensures that we're only disposing if you're selecting a node that's not a child of the
        // the current app node.
        if (newSelectedNode) {
            // Tests whether you've selected a child node or newselectedNode is not a slot node
            if (newSelectedNode.resourceId !== this.resourceId
                && newSelectedNode.resourceId.startsWith(this.resourceId + "/")
                && !slots_service_1.SlotsService.isSlot(newSelectedNode.resourceId)) {
                return;
            }
            else if (newSelectedNode.resourceId === this.resourceId && newSelectedNode === this) {
                // Tests whether you're navigating to this node from a child node
                return;
            }
        }
        this.inSelectedTree = false;
        this.children.forEach(function (c) { return c.inSelectedTree = false; });
        if (this._loadingObservable) {
            this._loadingObservable.subscribe(function () {
                _this._dispose();
            });
        }
        else {
            this._dispose();
        }
    };
    AppNode.prototype.clearNotification = function (id) {
        var _this = this;
        this.sideNav.globalStateService.topBarNotificationsStream
            .take(1)
            .subscribe(function (notifications) {
            notifications = notifications.filter(function (n) { return n.id !== id; });
            _this.sideNav.globalStateService.setTopBarNotifications(notifications);
        });
    };
    AppNode.prototype.openSettings = function () {
        this.openFunctionSettingsTab = true;
        this.select(true /* force */);
    };
    AppNode.prototype._dispose = function () {
        if (this._pollingTask && !this._pollingTask.closed) {
            this._pollingTask.unsubscribe();
            this._pollingTask = null;
        }
        if (this._functionApp) {
            this._functionApp.isDeleted = true;
        }
        this.sideNav.globalStateService.setTopBarNotifications([]);
        this.sideNav.broadcastService.clearAllDirtyStates();
    };
    AppNode.prototype._setupBackgroundTasks = function () {
        var _this = this;
        return this._functionApp.initKeysAndWarmupMainSite()
            .catch(function (err) { return Observable_1.Observable.of(null); })
            .map(function () {
            if (!_this._pollingTask) {
                _this._pollingTask = Observable_1.Observable.timer(1, 60000)
                    .concatMap(function () {
                    var val = Observable_1.Observable.zip(_this._functionApp.getHostErrors().catch(function (e) { return Observable_1.Observable.of([]); }), _this.sideNav.cacheService.getArm(_this.resourceId + "/config/web", true), _this.sideNav.cacheService.postArm(_this.resourceId + "/config/appsettings/list", true), _this.sideNav.slotsService.getSlotsList("" + _this.resourceId), _this._functionApp.pingScmSite(), function (e, c, a, s) { return ({ errors: e, configResponse: c, appSettingResponse: a, slotsResponse: s }); });
                    return val;
                })
                    .catch(function (e) { return Observable_1.Observable.of({}); })
                    .subscribe(function (result) {
                    _this._handlePollingTaskResult(result);
                });
            }
        });
    };
    AppNode.prototype._handlePollingTaskResult = function (result) {
        var _this = this;
        if (result) {
            var notifications = [];
            if (result.errors) {
                this.sideNav.broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.generalHostErrorFromHost);
                // Give clearing a chance to run
                setTimeout(function () {
                    result.errors.forEach(function (e) {
                        _this.sideNav.broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                            message: _this.sideNav.translateService.instant(portal_resources_1.PortalResources.functionDev_hostErrorMessage, { error: e }),
                            details: _this.sideNav.translateService.instant(portal_resources_1.PortalResources.functionDev_hostErrorMessage, { error: e }),
                            errorId: error_ids_1.ErrorIds.generalHostErrorFromHost,
                            errorType: error_event_1.ErrorType.RuntimeError,
                            resourceId: _this._functionApp.site.id
                        });
                        _this.sideNav.aiService.trackEvent('/errors/host', { error: e, app: _this.resourceId });
                    });
                });
            }
            if (result.configResponse) {
                var config = result.configResponse.json();
                this._functionApp.isAlwaysOn = config.properties.alwaysOn === true || this._functionApp.site.properties.sku === "Dynamic";
                if (!this._functionApp.isAlwaysOn) {
                    notifications.push({
                        id: constants_1.NotificationIds.alwaysOn,
                        message: this.sideNav.translateService.instant(portal_resources_1.PortalResources.topBar_alwaysOn),
                        iconClass: 'fa fa-exclamation-triangle warning',
                        learnMoreLink: 'https://go.microsoft.com/fwlink/?linkid=830855',
                        clickCallback: null
                    });
                }
            }
            if (result.appSettingResponse) {
                var appSettings = result.appSettingResponse.json();
                var extensionVersion = appSettings.properties[constants_1.Constants.runtimeVersionAppSettingName];
                var isLatestFunctionRuntime = null;
                if (extensionVersion) {
                    isLatestFunctionRuntime = constants_1.Constants.runtimeVersion === extensionVersion || constants_1.Constants.latest === extensionVersion.toLowerCase();
                    this.sideNav.aiService.trackEvent('/values/runtime_version', { runtime: extensionVersion, appName: this.resourceId });
                }
                if (!isLatestFunctionRuntime) {
                    notifications.push({
                        id: constants_1.NotificationIds.newRuntimeVersion,
                        message: this.sideNav.translateService.instant(portal_resources_1.PortalResources.topBar_newVersion),
                        iconClass: 'fa fa-info link',
                        learnMoreLink: 'https://go.microsoft.com/fwlink/?linkid=829530',
                        clickCallback: function () {
                            _this.openSettings();
                        }
                    });
                }
                if (result.slotsResponse) {
                    var slotsStorageSetting = appSettings.properties[constants_1.Constants.slotsSecretStorageSettingsName];
                    if (!!slotsStorageSetting) {
                        slotsStorageSetting = slotsStorageSetting.toLowerCase();
                    }
                    var numSlots = result.slotsResponse.length;
                    if (numSlots > 0 && slotsStorageSetting !== constants_1.Constants.slotsSecretStorageSettingsValue.toLowerCase()) {
                        notifications.push({
                            id: constants_1.NotificationIds.slotsHostId,
                            message: this.sideNav.translateService.instant(portal_resources_1.PortalResources.topBar_slotsHostId),
                            iconClass: 'fa fa-exclamation-triangle warning',
                            learnMoreLink: '',
                            clickCallback: null
                        });
                    }
                }
            }
            this.sideNav.globalStateService.setTopBarNotifications(notifications);
        }
    };
    return AppNode;
}(tree_node_1.TreeNode));
exports.AppNode = AppNode;
/*
    NOTE: SlotNode extends from AppNode, if this is in a seperate file,
    the initialization fails
*/
var SlotNode = (function (_super) {
    __extends(SlotNode, _super);
    function SlotNode(sideBar, siteArmCacheObj, parentNode, subscriptions, disabled) {
        var _this = _super.call(this, sideBar, siteArmCacheObj, parentNode, subscriptions, disabled) || this;
        var slotName = siteArmCacheObj.name;
        _this.title = slotName.substring(slotName.indexOf("/") + 1); // change to display name
        _this.slotProperties = siteArmCacheObj.properties;
        _this.isSlot = true;
        return _this;
    }
    return SlotNode;
}(AppNode));
exports.SlotNode = SlotNode;
//# sourceMappingURL=app-node.js.map