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
var core_2 = require("@ngx-translate/core");
var binding_input_1 = require("../shared/models/binding-input");
var portal_service_1 = require("../shared/services/portal.service");
var user_service_1 = require("../shared/services/user.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var binding_1 = require("../shared/models/binding");
var portal_resources_1 = require("../shared/models/portal-resources");
var global_state_service_1 = require("../shared/services/global-state.service");
var function_app_1 = require("../shared/function-app");
var cache_service_1 = require("./../shared/services/cache.service");
var arm_service_1 = require("./../shared/services/arm.service");
var BindingInputComponent = (function () {
    function BindingInputComponent(_portalService, _broadcastService, _userService, _translateService, _globalStateService, _cacheService, _armService) {
        this._portalService = _portalService;
        this._broadcastService = _broadcastService;
        this._userService = _userService;
        this._translateService = _translateService;
        this._globalStateService = _globalStateService;
        this._cacheService = _cacheService;
        this._armService = _armService;
        this.validChange = new core_1.EventEmitter(false);
        this.showTryView = this._globalStateService.showTryView;
    }
    Object.defineProperty(BindingInputComponent.prototype, "input", {
        get: function () {
            return this._input;
        },
        set: function (input) {
            var _this = this;
            if (input.type === binding_1.SettingType.picker) {
                var picker = input;
                if (!input.value && picker.items) {
                    input.value = picker.items[0];
                }
            }
            this._input = input;
            this.setBottomDescription(this._input.id, this._input.value);
            this.setClass(input.value);
            if (this._input.type === binding_1.SettingType.enum) {
                var enums = this._input.enum;
                this.enumInputs = enums
                    .map(function (e) { return ({ displayLabel: e.display, value: e.value, default: _this._input.value === e.value }); });
            }
            if ((input.id === 'name') && (input.value === '$return')) {
                this.functionReturnValue = true;
                this.disabled = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    BindingInputComponent.prototype.openPicker = function (input) {
        var _this = this;
        var bladeInput = null;
        switch (input.resource) {
            case binding_1.ResourceType.Storage:
                this.pickerName = "StorageAccountPickerBlade";
                break;
            case binding_1.ResourceType.EventHub:
                this.pickerName = "EventHub";
                break;
            case binding_1.ResourceType.DocumentDB:
                this.pickerName = "DocDbPickerBlade";
                break;
            case binding_1.ResourceType.ServiceBus:
                this.pickerName = "NotificationHubPickerBlade";
                break;
            case binding_1.ResourceType.ApiHub:
                bladeInput = input.metadata;
                bladeInput.bladeName = "CreateDataConnectionBlade";
                break;
        }
        // for tests
        if (window.location.hostname === "localhost" && !this._userService.inIFrame) {
            this.input.value = name;
            this.inputChanged(name);
            this.setClass(name);
            return;
        }
        if (!this._userService.inIFrame) {
            return;
        }
        var picker = this.input;
        picker.inProcess = true;
        if (this.pickerName != "EventHub") {
            this._globalStateService.setBusyState(this._translateService.instant(portal_resources_1.PortalResources.resourceSelect));
            if (bladeInput) {
                this._portalService.openCollectorBladeWithInputs(this.functionApp.site.id, bladeInput, "binding-input", function (appSettingName) {
                    _this.finishResourcePickup(appSettingName, picker);
                });
            }
            else {
                this._portalService.openCollectorBlade(this.functionApp.site.id, this.pickerName, "binding-input", function (appSettingName) {
                    _this.finishResourcePickup(appSettingName, picker);
                });
            }
        }
    };
    BindingInputComponent.prototype.inputChanged = function (value) {
        this.setBottomDescription(this._input.id, value);
        if (this._input.changeValue) {
            this._input.changeValue(value);
        }
        this.setClass(value);
        this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.IntegrateChanged);
    };
    BindingInputComponent.prototype.onDropDownInputChanged = function (value) {
        this._input.value = value;
        this.inputChanged(value);
    };
    BindingInputComponent.prototype.functionReturnValueChanged = function (value) {
        if (value) {
            this._input.value = '$return';
            this.inputChanged('$return');
        }
        this.disabled = value;
    };
    BindingInputComponent.prototype.closePicker = function () {
        this.pickerName = "";
        var picker = this.input;
        picker.inProcess = false;
    };
    BindingInputComponent.prototype.finishDialogPicker = function (appSettingName) {
        var picker = this.input;
        this.pickerName = "";
        this.finishResourcePickup(appSettingName, picker);
    };
    BindingInputComponent.prototype.setClass = function (value) {
        var _this = this;
        if (this._input) {
            this._input.class = this.input.noErrorClass;
            var saveValid = this._input.isValid;
            if (this._input.required) {
                this._input.isValid = (value) ? true : false;
                this._input.class = this._input.isValid ? this._input.noErrorClass : this._input.errorClass;
                this._input.errorText = this._input.isValid ? "" : this._translateService.instant(portal_resources_1.PortalResources.filedRequired);
            }
            else {
                this._input.isValid = true;
                this._input.errorText = "";
            }
            if (this._input.isValid && this._input.validators) {
                this._input.validators.forEach(function (v) {
                    var regex = new RegExp(v.expression);
                    if (!regex.test(value)) {
                        _this._input.isValid = false;
                        _this._input.class = _this._input.errorClass;
                        _this._input.errorText = v.errorText;
                    }
                });
            }
            if (saveValid !== this._input.isValid) {
                this.validChange.emit(this._input);
            }
        }
    };
    BindingInputComponent.prototype.finishResourcePickup = function (appSettingName, picker) {
        if (appSettingName) {
            var existedAppSetting;
            if (picker.items) {
                existedAppSetting = picker.items.find(function (item) {
                    return item === appSettingName;
                });
            }
            this.input.value = appSettingName;
            if (!existedAppSetting) {
                picker.items.splice(0, 0, this.input.value);
            }
            this.inputChanged(name);
            this.setClass(appSettingName);
        }
        picker.inProcess = false;
        this._globalStateService.clearBusyState();
    };
    BindingInputComponent.prototype.setBottomDescription = function (id, value) {
        switch (id) {
        }
    };
    return BindingInputComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], BindingInputComponent.prototype, "binding", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], BindingInputComponent.prototype, "validChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", function_app_1.FunctionApp)
], BindingInputComponent.prototype, "functionApp", void 0);
__decorate([
    core_1.Input('input'),
    __metadata("design:type", binding_input_1.BindingInputBase),
    __metadata("design:paramtypes", [binding_input_1.BindingInputBase])
], BindingInputComponent.prototype, "input", null);
BindingInputComponent = __decorate([
    core_1.Component({
        selector: 'binding-input',
        templateUrl: './binding-input.component.html',
        styleUrls: ['./binding-input.component.css'],
    }),
    __metadata("design:paramtypes", [portal_service_1.PortalService,
        broadcast_service_1.BroadcastService,
        user_service_1.UserService,
        core_2.TranslateService,
        global_state_service_1.GlobalStateService,
        cache_service_1.CacheService,
        arm_service_1.ArmService])
], BindingInputComponent);
exports.BindingInputComponent = BindingInputComponent;
//# sourceMappingURL=binding-input.component.js.map