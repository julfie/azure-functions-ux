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
var config_service_1 = require("./../shared/services/config.service");
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/do");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var portal_service_1 = require("../shared/services/portal.service");
var global_state_service_1 = require("../shared/services/global-state.service");
var portal_resources_1 = require("../shared/models/portal-resources");
var FunctionManageComponent = (function () {
    function FunctionManageComponent(_broadcastService, _portalService, _globalStateService, _translateService, configService) {
        var _this = this;
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this.isStandalone = configService.isStandalone();
        this._viewInfoStream = new Subject_1.Subject();
        this._viewInfoStream
            .retry()
            .subscribe(function (viewInfo) {
            _this._functionNode = viewInfo.node;
            _this.functionInfo = _this._functionNode.functionInfo;
            _this.functionApp = _this.functionInfo.functionApp;
        });
        this.functionStatusOptions = [
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.enabled),
                value: false
            }, {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.disabled),
                value: true
            }
        ];
        this.functionStateValueChange = new Subject_1.Subject();
        this.functionStateValueChange
            .switchMap(function (state) {
            var originalState = _this.functionInfo.config.disabled;
            _this._globalStateService.setBusyState();
            _this.functionInfo.config.disabled = state;
            return _this.functionApp.updateFunction(_this.functionInfo).catch(function (e) { throw originalState; });
        })
            .do(null, function (originalState) {
            _this.functionInfo.config.disabled = originalState;
            _this._globalStateService.clearBusyState();
        })
            .retry()
            .subscribe(function (fi) {
            _this._globalStateService.clearBusyState();
            _this.functionInfo.config.disabled = fi.config.disabled;
        });
    }
    Object.defineProperty(FunctionManageComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this._viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    FunctionManageComponent.prototype.deleteFunction = function () {
        var _this = this;
        var result = confirm(this._translateService.instant(portal_resources_1.PortalResources.functionManage_areYouSure, { name: this.functionInfo.name }));
        if (result) {
            this._globalStateService.setBusyState();
            this._portalService.logAction("edit-component", "delete");
            // Clone node for removing as it can be change during http call
            var clone = Object.create(this._functionNode);
            this.functionApp.deleteFunction(this.functionInfo)
                .subscribe(function (r) {
                clone.remove();
                // this._broadcastService.broadcast(BroadcastEvent.FunctionDeleted, this.functionInfo);
                _this._globalStateService.clearBusyState();
            });
        }
    };
    return FunctionManageComponent;
}());
FunctionManageComponent = __decorate([
    core_1.Component({
        selector: 'function-manage',
        templateUrl: './function-manage.component.html',
        styleUrls: ['./function-manage.component.css'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        config_service_1.ConfigService])
], FunctionManageComponent);
exports.FunctionManageComponent = FunctionManageComponent;
//# sourceMappingURL=function-manage.component.js.map