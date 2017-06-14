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
var user_service_1 = require("../shared/services/user.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var portal_service_1 = require("../shared/services/portal.service");
var functions_service_1 = require("../shared/services/functions.service");
var constants_1 = require("../shared/models/constants");
var global_state_service_1 = require("../shared/services/global-state.service");
var core_2 = require("@ngx-translate/core");
var TopBarComponent = (function () {
    // @Output() private functionAppSettingsClicked: EventEmitter<any>;
    function TopBarComponent(_userService, _broadcastService, _portalService, _functionsService, _globalStateService, _translateService, _configService) {
        var _this = this;
        this._userService = _userService;
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._functionsService = _functionsService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._configService = _configService;
        this.visible = false;
        this.topBarNotifications = [];
        // this.functionAppSettingsClicked = new EventEmitter<any>();
        this.inIFrame = this._userService.inIFrame;
        this.isStandalone = this._configService.isStandalone();
        this._globalStateService.topBarNotificationsStream
            .subscribe(function (topBarNotifications) {
            _this.topBarNotifications = topBarNotifications;
            _this._setVisible();
        });
        this._setVisible();
        // this._broadcastService.subscribe(BroadcastEvent.VersionUpdated, event => {
        // this.needUpdateExtensionVersion = !this._globalStateService.IsLatest;
        // this.setVisible();
        // });
    }
    Object.defineProperty(TopBarComponent.prototype, "showTryView", {
        get: function () {
            return this._globalStateService.showTryView;
        },
        enumerable: true,
        configurable: true
    });
    TopBarComponent.prototype._setVisible = function () {
        if (this.inIFrame) {
            this.visible = this.topBarNotifications && this.topBarNotifications.length > 0;
        }
        else if (!this._globalStateService.showTryView) {
            this.visible = true;
        }
    };
    TopBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._globalStateService.showTryView = this._globalStateService.showTryView;
        if (!this.showTryView) {
            // nothing to do if we're running in an iframe
            if (this.inIFrame)
                return;
            this._userService.getUser()
                .subscribe(function (u) {
                _this.user = u;
                // this.setVisible();
            });
            this._userService.getTenants()
                .subscribe(function (t) {
                _this.tenants = t;
                _this.currentTenant = _this.tenants.find(function (e) { return e.Current; });
                // this.setVisible();
            });
        }
        else {
            // this.setVisible();
        }
    };
    TopBarComponent.prototype.selectTenant = function (tenant) {
        window.location.href = constants_1.Constants.serviceHost + ("api/switchtenants/" + tenant.TenantId);
    };
    TopBarComponent.prototype.notificationClick = function (notification) {
        if (notification.clickCallback) {
            notification.clickCallback();
        }
    };
    return TopBarComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TopBarComponent.prototype, "gettingStarted", void 0);
TopBarComponent = __decorate([
    core_1.Component({
        selector: 'top-bar',
        templateUrl: './top-bar.component.html',
        styleUrls: ['./top-bar.component.scss'],
        inputs: ['isFunctionSelected']
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        functions_service_1.FunctionsService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        config_service_1.ConfigService])
], TopBarComponent);
exports.TopBarComponent = TopBarComponent;
//# sourceMappingURL=top-bar.component.js.map