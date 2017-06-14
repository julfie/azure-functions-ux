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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var binding_list_1 = require("../shared/models/binding-list");
var binding_1 = require("../shared/models/binding");
var binding_manager_1 = require("../shared/models/binding-manager");
var function_info_1 = require("../shared/models/function-info");
var template_picker_1 = require("../shared/models/template-picker");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var portal_service_1 = require("../shared/services/portal.service");
var global_state_service_1 = require("../shared/services/global-state.service");
var error_event_1 = require("../shared/models/error-event");
var core_2 = require("@ngx-translate/core");
var portal_resources_1 = require("../shared/models/portal-resources");
var error_ids_1 = require("../shared/models/error-ids");
var dashboard_type_1 = require("../tree-view/models/dashboard-type");
var FunctionIntegrateV2Component = (function () {
    function FunctionIntegrateV2Component(elementRef, _broadcastService, _portalService, _globalStateService, _translateService) {
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this.save = new core_1.EventEmitter();
        this.changeEditor = new core_1.EventEmitter();
        this.model = new binding_list_1.BindingList();
        this.pickerType = template_picker_1.TemplatePickerType.none;
        this.currentBinding = null;
        this.currentBindingId = "";
        this._bindingManager = new binding_manager_1.BindingManager();
        this._elementRef = elementRef;
    }
    Object.defineProperty(FunctionIntegrateV2Component.prototype, "selectedFunction", {
        set: function (fi) {
            var _this = this;
            this.pickerType = template_picker_1.TemplatePickerType.none;
            this.currentBinding = null;
            this.currentBindingId = "";
            this.functionInfo = fi;
            this.functionApp = fi.functionApp;
            try {
                this._bindingManager.validateConfig(this.functionInfo.config, this._translateService);
            }
            catch (e) {
                this.onEditorChange('advanced');
                return;
            }
            this._globalStateService.setBusyState();
            fi.functionApp.getBindingConfig().subscribe(function (bindings) {
                fi.functionApp.getTemplates().subscribe(function (templates) {
                    _this.model.config = _this._bindingManager.functionConfigToUI(fi.config, bindings.bindings);
                    if (_this.model.config.bindings.length > 0) {
                        _this.currentBinding = _this.model.config.bindings[0];
                        _this.currentBindingId = _this.currentBinding.id;
                    }
                    _this.model.setBindings();
                    _this._globalStateService.clearBusyState();
                }, function () {
                    _this._globalStateService.clearBusyState();
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    FunctionIntegrateV2Component.prototype.newBinding = function (type) {
        if (!this.checkDirty()) {
            return;
        }
        this.currentBindingId = type.toString();
        switch (type) {
            case binding_1.DirectionType.in:
                this.pickerType = template_picker_1.TemplatePickerType.in;
                break;
            case binding_1.DirectionType.out:
                this.pickerType = template_picker_1.TemplatePickerType.out;
                break;
            case binding_1.DirectionType.trigger:
                this.pickerType = template_picker_1.TemplatePickerType.trigger;
                break;
        }
        this.behavior = type;
        this.currentBinding = null;
    };
    FunctionIntegrateV2Component.prototype.onBindingCreateComplete = function (behavior, templateName) {
        var _this = this;
        this.functionInfo.functionApp.getBindingConfig().subscribe(function (bindings) {
            _this._broadcastService.setDirtyState("function_integrate");
            _this._portalService.setDirtyState(true);
            _this.currentBinding = _this._bindingManager.getDefaultBinding(binding_manager_1.BindingManager.getBindingType(templateName), behavior, bindings.bindings, _this._globalStateService.DefaultStorageAccount);
            _this.currentBinding.newBinding = true;
            _this.currentBindingId = _this.currentBinding.id;
            _this.model.setBindings();
            _this.pickerType = template_picker_1.TemplatePickerType.none;
        });
    };
    FunctionIntegrateV2Component.prototype.onBindingCreateCancel = function () {
        this.pickerType = template_picker_1.TemplatePickerType.none;
        this.currentBindingId = "";
    };
    FunctionIntegrateV2Component.prototype.onRemoveBinding = function (binding) {
        this.model.removeBinding(binding.id);
        this.currentBinding = null;
        this.model.setBindings();
        this.updateFunction();
    };
    FunctionIntegrateV2Component.prototype.onGo = function (action) {
        var _this = this;
        if (!this.checkDirty()) {
            return;
        }
        this.functionApp.getTemplates().subscribe(function (templates) {
            var templateId = action.template + "-" + function_info_1.FunctionInfoHelper.getLanguage(_this.functionInfo);
            var template = templates.find(function (t) { return t.id === templateId; });
            // C# is default language. Set C# if can not found original language
            if (!template) {
                templateId = action.template + "-CSharp";
                template = templates.find(function (t) { return t.id === templateId; });
            }
            if (template) {
                action.templateId = templateId;
                _this.viewInfo.node.parent.parent.openCreateDashboard(dashboard_type_1.DashboardType.createFunction, action);
            }
        });
    };
    FunctionIntegrateV2Component.prototype.onUpdateBinding = function (binding) {
        this.model.updateBinding(binding);
        this.model.setBindings();
        try {
            this.updateFunction();
            this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.errorParsingConfig);
        }
        catch (e) {
            this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                message: this._translateService.instant(portal_resources_1.PortalResources.errorParsingConfig, { error: e }),
                errorId: error_ids_1.ErrorIds.errorParsingConfig,
                errorType: error_event_1.ErrorType.UserError
            });
            this.onRemoveBinding(binding);
        }
    };
    FunctionIntegrateV2Component.prototype.onCancel = function () {
        this.currentBinding = null;
        this.currentBindingId = "";
    };
    FunctionIntegrateV2Component.prototype.onBindingSelect = function (id) {
        if (!this.checkDirty()) {
            return;
        }
        if (this.currentBinding && id === this.currentBinding.id) {
            return;
        }
        this.pickerType = template_picker_1.TemplatePickerType.none;
        this.currentBinding = this.model.getBinding(id);
        this.currentBindingId = this.currentBinding.id;
    };
    FunctionIntegrateV2Component.prototype.onEditorChange = function (editorType) {
        var _this = this;
        if (this.switchIntegrate()) {
            this._broadcastService.clearDirtyState('function_integrate', true);
            setTimeout(function () {
                _this.changeEditor.emit(editorType);
            }, 10);
        }
    };
    FunctionIntegrateV2Component.prototype.updateFunction = function () {
        var _this = this;
        this.functionInfo.config = this._bindingManager.UIToFunctionConfig(this.model.config);
        this._bindingManager.validateConfig(this.functionInfo.config, this._translateService);
        // Update test_data only from develop tab
        var functionInfoCopy = Object.assign({}, this.functionInfo);
        delete functionInfoCopy.test_data;
        this._globalStateService.setBusyState();
        this.functionInfo.functionApp.updateFunction(functionInfoCopy).subscribe(function (result) {
            _this._globalStateService.clearBusyState();
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.FunctionUpdated, _this.functionInfo);
        });
    };
    FunctionIntegrateV2Component.prototype.checkDirty = function () {
        var switchBinding = true;
        if (this._broadcastService.getDirtyState('function_integrate')) {
            switchBinding = confirm(this._translateService.instant(portal_resources_1.PortalResources.functionIntegrate_changesLost1));
        }
        if (switchBinding) {
            this._broadcastService.clearDirtyState('function_integrate', true);
        }
        return switchBinding;
    };
    FunctionIntegrateV2Component.prototype.switchIntegrate = function () {
        var result = true;
        if ((this._broadcastService.getDirtyState('function') || this._broadcastService.getDirtyState('function_integrate'))) {
            result = confirm(this._translateService.instant(portal_resources_1.PortalResources.functionIntegrate_changesLost2, { name: this.functionInfo.name }));
        }
        return result;
    };
    return FunctionIntegrateV2Component;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], FunctionIntegrateV2Component.prototype, "save", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], FunctionIntegrateV2Component.prototype, "changeEditor", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FunctionIntegrateV2Component.prototype, "viewInfo", void 0);
FunctionIntegrateV2Component = __decorate([
    core_1.Component({
        selector: 'function-integrate-v2',
        templateUrl: './function-integrate-v2.component.html',
        styleUrls: ['./function-integrate-v2.component.scss'],
        inputs: ['selectedFunction'],
    }),
    __param(0, core_1.Inject(core_1.ElementRef)),
    __metadata("design:paramtypes", [core_1.ElementRef,
        broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService])
], FunctionIntegrateV2Component);
exports.FunctionIntegrateV2Component = FunctionIntegrateV2Component;
//# sourceMappingURL=function-integrate-v2.component.js.map