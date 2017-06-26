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
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/map");
require("rxjs/add/operator/switchMap");
var global_state_service_1 = require("../shared/services/global-state.service");
var core_2 = require("@ngx-translate/core");
var portal_resources_1 = require("../shared/models/portal-resources");
var portal_service_1 = require("../shared/services/portal.service");
var dashboard_type_1 = require("../tree-view/models/dashboard-type");
var FunctionsListComponent = (function () {
    function FunctionsListComponent(_globalStateService, _portalService, _translateService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._portalService = _portalService;
        this._translateService = _translateService;
        this.functions = [];
        this.viewInfoStream = new Subject_1.Subject();
        this._viewInfoSubscription = this.viewInfoStream
            .distinctUntilChanged()
            .switchMap(function (viewInfo) {
            _this.isLoading = true;
            _this._functionsNode = viewInfo.node;
            _this.appNode = viewInfo.node.parent;
            _this.functionApp = _this._functionsNode.functionApp;
            return _this._functionsNode.loadChildren();
        })
            .subscribe(function () {
            _this.isLoading = false;
            _this.functions = _this._functionsNode.children;
        });
    }
    FunctionsListComponent.prototype.ngOnInit = function () {
    };
    FunctionsListComponent.prototype.ngOnDestroy = function () {
        this._viewInfoSubscription.unsubscribe();
    };
    Object.defineProperty(FunctionsListComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this.viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    FunctionsListComponent.prototype.clickRow = function (item) {
        item.select();
    };
    FunctionsListComponent.prototype.enableChange = function (item) {
        var _this = this;
        item.functionInfo.config.disabled = !item.functionInfo.config.disabled;
        this._globalStateService.setBusyState();
        return this.functionApp.updateFunction(item.functionInfo)
            .do(null, function (e) {
            item.functionInfo.config.disabled = !item.functionInfo.config.disabled;
            _this._globalStateService.clearBusyState();
            console.error(e);
        })
            .subscribe(function (r) {
            _this._globalStateService.clearBusyState();
        });
    };
    FunctionsListComponent.prototype.clickDelete = function (item) {
        var _this = this;
        var functionInfo = item.functionInfo;
        var result = confirm(this._translateService.instant(portal_resources_1.PortalResources.functionManage_areYouSure, { name: functionInfo.name }));
        if (result) {
            this._globalStateService.setBusyState();
            this._portalService.logAction("edit-component", "delete");
            this.functionApp.deleteFunction(functionInfo)
                .do(null, function (e) {
                _this._globalStateService.clearBusyState();
                console.error(e);
            })
                .subscribe(function (r) {
                var indexToDelete = _this.functions.indexOf(item);
                if (indexToDelete > -1) {
                    _this.functions.splice(indexToDelete, 1);
                }
                _this._functionsNode.removeChild(item.functionInfo, false);
                var defaultHostName = _this._functionsNode.functionApp.site.properties.defaultHostName;
                var scmHostName = _this._functionsNode.functionApp.site.properties.hostNameSslStates.find(function (s) { return s.hostType === 1; }).name;
                item.sideNav.cacheService.clearCachePrefix("https://" + defaultHostName);
                item.sideNav.cacheService.clearCachePrefix("https://" + scmHostName);
                _this._globalStateService.clearBusyState();
            });
        }
    };
    FunctionsListComponent.prototype.searchChanged = function (value) {
        this.functions = this._functionsNode.children.filter(function (c) {
            return c.functionInfo.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
        });
    };
    FunctionsListComponent.prototype.searchCleared = function () {
        this.functions = this._functionsNode.children;
    };
    FunctionsListComponent.prototype.onNewFunctionClick = function () {
        this._functionsNode.openCreateDashboard(dashboard_type_1.DashboardType.createFunction);
    };
    return FunctionsListComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], FunctionsListComponent.prototype, "viewInfoInput", null);
FunctionsListComponent = __decorate([
    core_1.Component({
        selector: 'functions-list',
        templateUrl: './functions-list.component.html',
        styleUrls: ['./functions-list.component.scss']
    }),
    __metadata("design:paramtypes", [global_state_service_1.GlobalStateService,
        portal_service_1.PortalService,
        core_2.TranslateService])
], FunctionsListComponent);
exports.FunctionsListComponent = FunctionsListComponent;
//# sourceMappingURL=functions-list.component.js.map