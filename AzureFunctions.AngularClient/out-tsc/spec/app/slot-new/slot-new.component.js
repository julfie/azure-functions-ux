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
var Observable_1 = require("rxjs/Observable");
var forms_1 = require("@angular/forms");
var core_2 = require("@ngx-translate/core");
require("rxjs/add/operator/mergeMap");
var slots_service_1 = require("../shared/services/slots.service");
var global_state_service_1 = require("../shared/services/global-state.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var ai_service_1 = require("../shared/services/ai.service");
var cache_service_1 = require("../shared/services/cache.service");
var portal_service_1 = require("../shared/services/portal.service");
var constants_1 = require("../shared/models/constants");
var requiredValidator_1 = require("../shared/validators/requiredValidator");
var portal_resources_1 = require("../shared/models/portal-resources");
var slotNameValidator_1 = require("../shared/validators/slotNameValidator");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var error_ids_1 = require("../shared/models/error-ids");
var error_event_1 = require("../shared/models/error-event");
var authz_service_1 = require("../shared/services/authz.service");
var SlotNewComponent = (function () {
    function SlotNewComponent(fb, _globalStateService, _translateService, _broadcastService, _portalService, _aiService, _slotService, _cacheService, authZService, injector) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._aiService = _aiService;
        this._slotService = _slotService;
        this._cacheService = _cacheService;
        this.Resources = portal_resources_1.PortalResources;
        this.isLoading = true;
        this._viewInfoStream = new Subject_1.Subject();
        var validator = new requiredValidator_1.RequiredValidator(this._translateService);
        this._viewInfoStream
            .switchMap(function (viewInfo) {
            _this._globalStateService.setBusyState();
            _this._slotsNode = viewInfo.node;
            _this._viewInfo = viewInfo;
            // parse the site resourceId from slot's
            _this._siteId = viewInfo.resourceId.substring(0, viewInfo.resourceId.indexOf("/slots"));
            var slotNameValidator = new slotNameValidator_1.SlotNameValidator(injector, _this._siteId);
            _this.newSlotForm = fb.group({
                name: [null,
                    validator.validate.bind(validator),
                    slotNameValidator.validate.bind(slotNameValidator)]
            });
            return Observable_1.Observable.zip(authZService.hasPermission(_this._siteId, [authz_service_1.AuthzService.writeScope]), authZService.hasReadOnlyLock(_this._siteId), _this._cacheService.getArm(_this._siteId), _this._slotService.getSlotsList(_this._siteId), function (w, rl, s, l) { return ({
                writePermission: w,
                readOnlyLock: rl,
                siteInfo: s,
                slotsList: l
            }); });
        })
            .mergeMap(function (res) {
            _this.hasCreatePermissions = res.writePermission && !res.readOnlyLock;
            if (_this.hasCreatePermissions) {
                return _this._cacheService.postArm(_this._siteId + "/config/appsettings/list", true)
                    .map(function (r) {
                    res.appSettings = r.json();
                    return res;
                });
            }
            return Observable_1.Observable.of(res);
        })
            .do(null, function (e) {
            // log error & clear busy state
            _this._aiService.trackException(e, '/errors/slot-new');
            _this._globalStateService.clearBusyState();
        })
            .retry()
            .subscribe(function (res) {
            _this._siteObj = res.siteInfo.json();
            var sku = _this._siteObj.properties.sku;
            _this._slotsList = res.slotsList;
            _this.slotOptinEnabled = res.slotsList.length > 0 ||
                res.appSettings.properties[constants_1.Constants.slotsSecretStorageSettingsName] === constants_1.Constants.slotsSecretStorageSettingsValue;
            _this.hasReachedDynamicQuotaLimit = !!sku && sku.toLowerCase() === "dynamic" && _this._slotsList.length === 1;
            _this._globalStateService.clearBusyState();
            _this.isLoading = false;
        });
    }
    Object.defineProperty(SlotNewComponent.prototype, "viewInfoInput", {
        set: function (viewInfoInput) {
            this._viewInfoStream.next(viewInfoInput);
        },
        enumerable: true,
        configurable: true
    });
    SlotNewComponent.prototype.ngOnInit = function () {
    };
    SlotNewComponent.prototype.onFunctionAppSettingsClicked = function (event) {
        var appNode = this._slotsNode.parent;
        appNode.openSettings();
    };
    SlotNewComponent.prototype.createSlot = function () {
        var _this = this;
        var newSlotName = this.newSlotForm.controls['name'].value;
        var notificationId = null;
        this._globalStateService.setBusyState();
        // show create slot start notification
        this._portalService.startNotification(this._translateService.instant(portal_resources_1.PortalResources.slotNew_startCreateNotifyTitle).format(newSlotName), this._translateService.instant(portal_resources_1.PortalResources.slotNew_startCreateNotifyTitle).format(newSlotName))
            .first()
            .switchMap(function (s) {
            notificationId = s.id;
            return _this._slotService.createNewSlot(_this._siteObj.id, newSlotName, _this._siteObj.location, _this._siteObj.properties.serverFarmId);
        })
            .subscribe(function (r) {
            _this._globalStateService.clearBusyState();
            // update notification
            _this._portalService.stopNotification(notificationId, true, _this._translateService.instant(portal_resources_1.PortalResources.slotNew_startCreateSuccessNotifyTitle).format(newSlotName));
            var slotsNode = _this._viewInfo.node;
            // If someone refreshed the app, it would created a new set of child nodes under the app node.
            slotsNode = _this._viewInfo.node.parent.children.find(function (node) { return node.title === slotsNode.title; });
            slotsNode.addChild(r.json());
            slotsNode.isExpanded = true;
        }, function (err) {
            _this._globalStateService.clearBusyState();
            _this._portalService.stopNotification(notificationId, false, _this._translateService.instant(portal_resources_1.PortalResources.slotNew_startCreateFailureNotifyTitle).format(newSlotName));
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                message: _this._translateService.instant(portal_resources_1.PortalResources.slotNew_startCreateFailureNotifyTitle).format(newSlotName),
                details: _this._translateService.instant(portal_resources_1.PortalResources.slotNew_startCreateFailureNotifyTitle).format(newSlotName),
                errorId: error_ids_1.ErrorIds.failedToCreateSlot,
                errorType: error_event_1.ErrorType.Fatal,
                resourceId: _this._siteObj.id
            });
            _this._aiService.trackEvent(error_ids_1.ErrorIds.failedToCreateApp, { error: err, id: _this._siteObj.id });
        });
    };
    return SlotNewComponent;
}());
SlotNewComponent = __decorate([
    core_1.Component({
        selector: 'slot-new',
        templateUrl: './slot-new.component.html',
        styleUrls: ['./slot-new.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        ai_service_1.AiService,
        slots_service_1.SlotsService,
        cache_service_1.CacheService,
        authz_service_1.AuthzService,
        core_1.Injector])
], SlotNewComponent);
exports.SlotNewComponent = SlotNewComponent;
//# sourceMappingURL=slot-new.component.js.map