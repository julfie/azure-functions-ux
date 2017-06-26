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
var user_service_1 = require("./../../shared/services/user.service");
var constants_1 = require("./../../shared/models/constants");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var core_2 = require("@ngx-translate/core");
var Subject_1 = require("rxjs/Subject");
var error_ids_1 = require("./../../shared/models/error-ids");
var error_event_1 = require("./../../shared/models/error-event");
var broadcast_service_1 = require("./../../shared/services/broadcast.service");
var ai_service_1 = require("./../../shared/services/ai.service");
var cache_service_1 = require("./../../shared/services/cache.service");
var global_state_service_1 = require("./../../shared/services/global-state.service");
var siteNameValidator_1 = require("./../../shared/validators/siteNameValidator");
var arm_service_1 = require("./../../shared/services/arm.service");
var portal_resources_1 = require("./../../shared/models/portal-resources");
var requiredValidator_1 = require("app/shared/validators/requiredValidator");
var broadcast_event_1 = require("app/shared/models/broadcast-event");
var CreateAppComponent = (function () {
    function CreateAppComponent(_broadcastService, _cacheService, _globalStateService, _translateService, _armService, _fb, _aiService, userService, injector) {
        var _this = this;
        this._broadcastService = _broadcastService;
        this._cacheService = _cacheService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._armService = _armService;
        this._fb = _fb;
        this._aiService = _aiService;
        this.Resources = portal_resources_1.PortalResources;
        this.FwdLinks = constants_1.Links;
        userService.getStartupInfo()
            .first()
            .subscribe(function (info) {
            var sub = info.subscriptions.find(function (s) { return s.state === 'Enabled'; });
            if (!sub) {
                return;
            }
            _this._subscriptionId = sub.subscriptionId;
            var required = new requiredValidator_1.RequiredValidator(_this._translateService);
            var siteNameValidator = new siteNameValidator_1.SiteNameValidator(injector, sub.subscriptionId);
            _this.group = _fb.group({
                name: [
                    null,
                    required.validate.bind(required),
                    siteNameValidator.validate.bind(siteNameValidator)
                ]
            });
        });
        this.viewInfoStream = new Subject_1.Subject();
        this.viewInfoStream
            .subscribe(function (viewInfo) {
            _this._viewInfo = viewInfo;
        });
    }
    Object.defineProperty(CreateAppComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this.viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    CreateAppComponent.prototype.ngOnInit = function () {
    };
    CreateAppComponent.prototype.create = function () {
        var _this = this;
        var name = this.group.controls['name'].value;
        var id = "/subscriptions/" + this._subscriptionId + "/resourceGroups/StandaloneResourceGroup/providers/Microsoft.Web/sites/" + name;
        var body = {
            properties: {
                siteConfig: {
                    appSettings: []
                },
                sku: 'Dynamic',
                clientAffinityEnabled: false
            },
            location: "local",
            kind: 'functionapp'
        };
        this._globalStateService.setBusyState();
        this._cacheService.putArm(id, null, body)
            .subscribe(function (r) {
            _this._globalStateService.clearBusyState();
            var siteObj = r.json();
            var appsNode = _this._viewInfo.node;
            appsNode.addChild(siteObj);
        }, function (error) {
            _this._globalStateService.clearBusyState();
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                message: _this._translateService.instant(portal_resources_1.PortalResources.createApp_fail),
                details: _this._translateService.instant(portal_resources_1.PortalResources.createApp_fail),
                errorId: error_ids_1.ErrorIds.failedToCreateApp,
                errorType: error_event_1.ErrorType.Fatal,
                resourceId: id
            });
            _this._aiService.trackEvent(error_ids_1.ErrorIds.failedToCreateApp, { error: error, id: id });
        });
    };
    return CreateAppComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], CreateAppComponent.prototype, "viewInfoInput", null);
CreateAppComponent = __decorate([
    core_1.Component({
        selector: 'create-app',
        templateUrl: './create-app.component.html',
        styleUrls: ['./create-app.component.scss']
    }),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService,
        cache_service_1.CacheService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        arm_service_1.ArmService,
        forms_1.FormBuilder,
        ai_service_1.AiService,
        user_service_1.UserService,
        core_1.Injector])
], CreateAppComponent);
exports.CreateAppComponent = CreateAppComponent;
//# sourceMappingURL=create-app.component.js.map