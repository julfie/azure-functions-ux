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
var edit_mode_helper_1 = require("./../shared/Utilities/edit-mode.helper");
var error_ids_1 = require("./../shared/models/error-ids");
var core_1 = require("@angular/core");
var portal_service_1 = require("../shared/services/portal.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var error_event_1 = require("../shared/models/error-event");
var global_state_service_1 = require("../shared/services/global-state.service");
var binding_manager_1 = require("../shared/models/binding-manager");
var core_2 = require("@ngx-translate/core");
var portal_resources_1 = require("../shared/models/portal-resources");
var FunctionIntegrateComponent = (function () {
    function FunctionIntegrateComponent(_portalService, _broadcastService, _globalStateService, _translateService) {
        this._portalService = _portalService;
        this._broadcastService = _broadcastService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this.changeEditor = new core_1.EventEmitter();
        this._bindingManager = new binding_manager_1.BindingManager();
        this.isDirty = false;
    }
    FunctionIntegrateComponent.prototype.ngOnInit = function () {
        var functionContainaerHeight = window.innerHeight - this.container.nativeElement.getBoundingClientRect().top;
        this.editorContainer.nativeElement.style.height = (functionContainaerHeight - 75) + "px";
    };
    Object.defineProperty(FunctionIntegrateComponent.prototype, "selectedFunction", {
        set: function (value) {
            this.functionApp = value.functionApp;
            this.disabled = this.functionApp.getFunctionAppEditMode().map(edit_mode_helper_1.EditModeHelper.isReadOnly);
            this._selectedFunction = value;
            this._originalContent = JSON.stringify(value.config, undefined, 2);
            this._currentConent = this._originalContent;
            this.cancelConfig();
            this.isDirty = false;
        },
        enumerable: true,
        configurable: true
    });
    FunctionIntegrateComponent.prototype.contentChanged = function (content) {
        if (!this.isDirty) {
            this.isDirty = true;
            this._broadcastService.setDirtyState('function');
            this._portalService.setDirtyState(true);
        }
        this._currentConent = content;
    };
    FunctionIntegrateComponent.prototype.cancelConfig = function () {
        var _this = this;
        this.configContent = "";
        setTimeout(function () {
            _this.configContent = _this._originalContent;
            _this.clearDirty();
        }, 0);
    };
    FunctionIntegrateComponent.prototype.saveConfig = function () {
        var _this = this;
        if (this.isDirty) {
            try {
                this.configContent = this._currentConent;
                this._selectedFunction.config = JSON.parse(this.configContent);
                this._globalStateService.setBusyState();
                this._selectedFunction.functionApp.updateFunction(this._selectedFunction)
                    .subscribe(function (fi) {
                    _this._originalContent = _this.configContent;
                    _this.clearDirty();
                    _this._globalStateService.clearBusyState();
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.FunctionUpdated, _this._selectedFunction);
                });
                this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.errorParsingConfig);
            }
            catch (e) {
                this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: this._translateService.instant(portal_resources_1.PortalResources.errorParsingConfig, { error: e }),
                    errorId: error_ids_1.ErrorIds.errorParsingConfig,
                    errorType: error_event_1.ErrorType.UserError,
                    resourceId: this.functionApp.site.id
                });
            }
        }
    };
    FunctionIntegrateComponent.prototype.ngOnDestroy = function () {
        this._broadcastService.clearDirtyState('function');
        this._portalService.setDirtyState(false);
    };
    FunctionIntegrateComponent.prototype.onEditorChange = function (editorType) {
        if (this.switchIntegrate()) {
            this._broadcastService.clearDirtyState('function_integrate', true);
            this._portalService.setDirtyState(false);
            this.changeEditor.emit(editorType);
        }
    };
    FunctionIntegrateComponent.prototype.clearDirty = function () {
        if (this.isDirty) {
            this.isDirty = false;
            this._broadcastService.clearDirtyState('function');
            this._portalService.setDirtyState(false);
        }
    };
    FunctionIntegrateComponent.prototype.switchIntegrate = function () {
        var result = true;
        if ((this._broadcastService.getDirtyState('function') || this._broadcastService.getDirtyState('function_integrate'))) {
            result = confirm(this._translateService.instant(portal_resources_1.PortalResources.functionIntegrate_changesLost2, { name: this._selectedFunction.name }));
        }
        return result;
    };
    return FunctionIntegrateComponent;
}());
__decorate([
    core_1.ViewChild('container'),
    __metadata("design:type", core_1.ElementRef)
], FunctionIntegrateComponent.prototype, "container", void 0);
__decorate([
    core_1.ViewChild('editorContainer'),
    __metadata("design:type", core_1.ElementRef)
], FunctionIntegrateComponent.prototype, "editorContainer", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], FunctionIntegrateComponent.prototype, "changeEditor", void 0);
FunctionIntegrateComponent = __decorate([
    core_1.Component({
        selector: 'function-integrate',
        templateUrl: './function-integrate.component.html',
        styleUrls: ['./function-integrate.component.scss'],
        inputs: ['selectedFunction']
    }),
    __metadata("design:paramtypes", [portal_service_1.PortalService,
        broadcast_service_1.BroadcastService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService])
], FunctionIntegrateComponent);
exports.FunctionIntegrateComponent = FunctionIntegrateComponent;
//# sourceMappingURL=function-integrate.component.js.map