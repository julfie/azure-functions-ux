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
var cache_service_1 = require("./../../shared/services/cache.service");
var global_state_service_1 = require("../../shared/services/global-state.service");
var function_app_1 = require("../../shared/function-app");
var Subject_1 = require("rxjs/Subject");
var arm_service_1 = require("../../shared/services/arm.service");
var AppSettingComponent = (function () {
    function AppSettingComponent(_cacheService, _armService, _globalStateService) {
        this._cacheService = _cacheService;
        this._armService = _armService;
        this._globalStateService = _globalStateService;
        this.selectInProcess = false;
        this.canSelect = false;
        this.close = new Subject_1.Subject();
        this.selectItem = new Subject_1.Subject();
    }
    AppSettingComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(AppSettingComponent.prototype, "functionApp", {
        set: function (functionApp) {
            this._functionApp = functionApp;
        },
        enumerable: true,
        configurable: true
    });
    AppSettingComponent.prototype.onClose = function () {
        if (!this.selectInProcess) {
            this.close.next(null);
        }
    };
    AppSettingComponent.prototype.onSelect = function () {
        var _this = this;
        this.selectInProcess = true;
        this._globalStateService.setBusyState();
        this._cacheService.postArm(this._functionApp.site.id + "/config/appsettings/list", true).flatMap(function (r) {
            var appSettings = r.json();
            appSettings.properties[_this.appSettingName] = _this.appSettingValue;
            return _this._cacheService.putArm(appSettings.id, _this._armService.websiteApiVersion, appSettings);
        })
            .do(null, function (e) {
            _this._globalStateService.clearBusyState();
            _this.selectInProcess = false;
            console.log(e);
        })
            .subscribe(function (r) {
            _this._globalStateService.clearBusyState();
            _this.selectItem.next(_this.appSettingName);
        });
    };
    return AppSettingComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AppSettingComponent.prototype, "close", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], AppSettingComponent.prototype, "selectItem", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", function_app_1.FunctionApp),
    __metadata("design:paramtypes", [function_app_1.FunctionApp])
], AppSettingComponent.prototype, "functionApp", null);
AppSettingComponent = __decorate([
    core_1.Component({
        selector: 'app-setting',
        templateUrl: './app-setting.component.html',
        styleUrls: ['./../picker.scss']
    }),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        arm_service_1.ArmService,
        global_state_service_1.GlobalStateService])
], AppSettingComponent);
exports.AppSettingComponent = AppSettingComponent;
//# sourceMappingURL=app-setting.component.js.map