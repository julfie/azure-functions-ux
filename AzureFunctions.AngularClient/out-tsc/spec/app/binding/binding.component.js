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
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/merge");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
var binding_input_1 = require("../shared/models/binding-input");
var binding_1 = require("../shared/models/binding");
var binding_manager_1 = require("../shared/models/binding-manager");
var binding_input_list_1 = require("../shared/models/binding-input-list");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var portal_service_1 = require("../shared/services/portal.service");
var portal_resources_1 = require("../shared/models/portal-resources");
var cache_service_1 = require("../shared/services/cache.service");
var BindingComponent = (function () {
    function BindingComponent(elementRef, _broadcastService, _portalService, _cacheService, _translateService) {
        var _this = this;
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._cacheService = _cacheService;
        this._translateService = _translateService;
        this.canDelete = true;
        this.canSave = true;
        this.canCancel = true;
        this.saveClick = new core_1.EventEmitter();
        this.remove = new core_1.EventEmitter();
        this.update = new core_1.EventEmitter();
        this.validChange = new core_1.EventEmitter();
        this.hasInputsToShowEvent = new core_1.EventEmitter();
        this.go = new core_1.EventEmitter();
        this.cancel = new core_1.EventEmitter();
        this.newFunction = false;
        this.model = new binding_input_list_1.BindingInputList();
        this.areInputsValid = true;
        this.hasInputsToShow = false;
        this.isDirty = false;
        this.isDocShown = false;
        this._functionAppStream = new Subject_1.Subject();
        this._bindingStream = new Subject_1.Subject();
        this._bindingManager = new binding_manager_1.BindingManager();
        var renderer = new marked.Renderer();
        var funcStream = this._functionAppStream
            .distinctUntilChanged()
            .switchMap(function (functionApp) {
            _this.functionApp = functionApp;
            return Observable_1.Observable.zip(_this._cacheService.postArm(functionApp.site.id + "/config/appsettings/list"), _this.functionApp.getAuthSettings(), function (a, e) { return ({ appSettings: a.json(), authSettings: e }); });
        });
        funcStream
            .merge(this._bindingStream)
            .subscribe(function (res) {
            try {
                if (res.appSettings) {
                    _this._appSettings = res.appSettings.properties;
                }
                else {
                    _this._updateBinding(res);
                }
                if (res.authSettings) {
                    _this.authSettings = res.authSettings;
                    _this.filterWarnings();
                }
            }
            catch (e) {
                console.error(e);
            }
        });
        renderer.link = function (href, title, text) {
            return '<a target="_blank" href="' + href + (title ? '" title="' + title : '') + '">' + text + '</a>';
        };
        marked.setOptions({
            renderer: renderer,
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        });
        this._elementRef = elementRef;
        this._subscription = this._broadcastService.subscribe(broadcast_event_1.BroadcastEvent.IntegrateChanged, function () {
            setTimeout(function () {
                _this.isDirty = _this.model.isDirty() || (_this.bindingValue && _this.bindingValue.newBinding);
                if (_this.isDirty === undefined) {
                    _this.isDirty = false;
                }
                if (_this.canDelete) {
                    if (_this.isDirty) {
                        _this._broadcastService.setDirtyState("function_integrate");
                        _this._portalService.setDirtyState(true);
                    }
                    else {
                        _this._broadcastService.clearDirtyState("function_integrate", true);
                        _this._portalService.setDirtyState(false);
                    }
                }
            });
        });
    }
    BindingComponent.prototype.ngOnDestroy = function () {
        this._subscription.unsubscribe();
    };
    Object.defineProperty(BindingComponent.prototype, "functionAppInput", {
        set: function (functionApp) {
            this._functionAppStream.next(functionApp);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BindingComponent.prototype, "clickSave", {
        set: function (value) {
            if (value) {
                this.saveClicked();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BindingComponent.prototype, "binding", {
        set: function (value) {
            this._bindingStream.next(value);
        },
        enumerable: true,
        configurable: true
    });
    BindingComponent.prototype._updateBinding = function (value) {
        var _this = this;
        this.isDirty = false;
        var that = this;
        this.functionApp.getBindingConfig().subscribe(function (bindings) {
            _this.bindingValue = value;
            _this.setDirtyIfNewBinding();
            // Convert settings to input conotrls
            var order = 0;
            var bindingSchema = _this._bindingManager.getBindingSchema(_this.bindingValue.type, _this.bindingValue.direction, bindings.bindings);
            _this.model.inputs = [];
            if (that.bindingValue.hiddenList && that.bindingValue.hiddenList.length >= 0) {
                _this.newFunction = true;
            }
            _this.model.actions = [];
            _this.model.warnings = [];
            if (!_this.newFunction && bindingSchema) {
                if (bindingSchema.actions) {
                    _this.model.actions = bindingSchema.actions;
                }
                _this.model.warnings = bindingSchema.warnings;
                _this.filterWarnings();
            }
            _this.setLabel();
            if (bindingSchema) {
                var selectedStorage = '';
                bindingSchema.settings.forEach(function (setting) {
                    var functionSettingV = _this.bindingValue.settings.find(function (s) {
                        return s.name === setting.name;
                    });
                    var settigValue = (functionSettingV) ? functionSettingV.value : setting.defaultValue;
                    var isHidden = _this.isHidden(setting.name);
                    if (isHidden) {
                        return;
                    }
                    if (setting.validators) {
                        setting.validators.forEach(function (v) {
                            v.errorText = _this.replaceVariables(v.errorText, bindings.variables);
                        });
                    }
                    switch (setting.value) {
                        case binding_1.SettingType.int:
                            var intInput = new binding_input_1.TextboxIntInput();
                            intInput.id = setting.name;
                            intInput.isHidden = isHidden;
                            intInput.label = _this.replaceVariables(setting.label, bindings.variables);
                            intInput.required = setting.required;
                            intInput.value = settigValue;
                            intInput.help = _this.replaceVariables(setting.help, bindings.variables) || _this.replaceVariables(setting.label, bindings.variables);
                            intInput.validators = setting.validators;
                            intInput.placeholder = _this.replaceVariables(setting.placeholder, bindings.variables) || intInput.label;
                            _this.model.inputs.push(intInput);
                            break;
                        case binding_1.SettingType.string:
                            if (setting.value === binding_1.SettingType.string && setting.resource) {
                                var input = new binding_input_1.PickerInput();
                                input.resource = setting.resource;
                                input.items = _this._getResourceAppSettings(setting.resource);
                                input.id = setting.name;
                                input.isHidden = isHidden;
                                input.label = _this.replaceVariables(setting.label, bindings.variables);
                                input.required = setting.required;
                                input.value = settigValue;
                                if (input.resource === binding_1.ResourceType.Storage) {
                                    selectedStorage = settigValue ? settigValue : input.items[0];
                                }
                                input.help = _this.replaceVariables(setting.help, bindings.variables) || _this.replaceVariables(setting.label, bindings.variables);
                                input.placeholder = _this.replaceVariables(setting.placeholder, bindings.variables) || input.label;
                                input.metadata = setting.metadata;
                                _this.model.inputs.push(input);
                            }
                            else {
                                var input_1 = new binding_input_1.TextboxInput();
                                input_1.id = setting.name;
                                input_1.isHidden = isHidden;
                                input_1.label = _this.replaceVariables(setting.label, bindings.variables);
                                input_1.required = setting.required;
                                input_1.value = settigValue;
                                input_1.help = _this.replaceVariables(setting.help, bindings.variables) || _this.replaceVariables(setting.label, bindings.variables);
                                input_1.validators = setting.validators;
                                input_1.placeholder = _this.replaceVariables(setting.placeholder, bindings.variables) || input_1.label;
                                _this.model.inputs.push(input_1);
                                if (setting.name === "name") {
                                    input_1.changeValue = function (newValue) {
                                        _this.allBindings.forEach(function (b) {
                                            if (b !== _this.bindingValue) {
                                                var name = b.settings.find(function (s) { return s.name === "name"; });
                                                if (name) {
                                                    if (name.value.toString().toLowerCase() === newValue) {
                                                        setTimeout(function () {
                                                            input_1.class = input_1.errorClass;
                                                            input_1.isValid = false;
                                                            input_1.errorText = _this._translateService.instant(portal_resources_1.PortalResources.errorUniqueParameterName);
                                                            _this.areInputsValid = false;
                                                        }, 0);
                                                    }
                                                }
                                            }
                                        });
                                    };
                                }
                            }
                            break;
                        case binding_1.SettingType.enum:
                            var ddInput = new binding_input_1.SelectInput();
                            ddInput.id = setting.name;
                            ddInput.isHidden = isHidden;
                            ddInput.label = setting.label;
                            ddInput.enum = setting.enum;
                            ddInput.value = settigValue || setting.enum[0].value;
                            ddInput.help = _this.replaceVariables(setting.help, bindings.variables) || _this.replaceVariables(setting.label, bindings.variables);
                            _this.model.inputs.push(ddInput);
                            break;
                        case binding_1.SettingType.checkBoxList:
                            var cblInput = new binding_input_1.CheckBoxListInput();
                            cblInput.id = setting.name;
                            cblInput.isHidden = isHidden;
                            cblInput.label = setting.label;
                            cblInput.enum = setting.enum;
                            cblInput.value = settigValue;
                            cblInput.toInternalValue();
                            cblInput.help = _this.replaceVariables(setting.help, bindings.variables) || _this.replaceVariables(setting.label, bindings.variables);
                            _this.model.inputs.push(cblInput);
                            break;
                        case binding_1.SettingType.boolean:
                            var chInput = new binding_input_1.CheckboxInput();
                            chInput.id = setting.name;
                            chInput.isHidden = isHidden;
                            chInput.type = setting.value;
                            chInput.label = _this.replaceVariables(setting.label, bindings.variables);
                            chInput.required = false;
                            chInput.value = settigValue;
                            chInput.help = _this.replaceVariables(setting.help, bindings.variables) || _this.replaceVariables(setting.label, bindings.variables);
                            _this.model.inputs.push(chInput);
                            break;
                    }
                    order++;
                });
                if (bindingSchema.rules) {
                    bindingSchema.rules.forEach(function (rule) {
                        var isHidden = _this.isHidden(rule.name);
                        if (isHidden) {
                            return;
                        }
                        if (rule.type === "exclusivity") {
                            var ddValue = rule.values[0].value;
                            rule.values.forEach(function (value) {
                                var findResult = _this.bindingValue.settings.find(function (s) {
                                    return s.name === value.value && s.value;
                                });
                                if (findResult) {
                                    ddValue = value.value;
                                }
                            });
                            var ddInput_1 = new binding_input_1.SelectInput();
                            ddInput_1.id = rule.name;
                            ddInput_1.isHidden = isHidden;
                            ddInput_1.label = rule.label;
                            ddInput_1.help = rule.help;
                            ddInput_1.value = ddValue;
                            ddInput_1.enum = rule.values;
                            ddInput_1.changeValue = function () {
                                var rules = ddInput_1.enum;
                                rule.values.forEach(function (v) {
                                    if (ddInput_1.value == v.value) {
                                        v.shownSettings.forEach(function (s) {
                                            var input = _this.model.inputs.find(function (input) {
                                                return input.id === s;
                                            });
                                            if (input) {
                                                input.isHidden = isHidden ? true : false;
                                            }
                                            var s1 = _this.bindingValue.settings.find(function (s2) {
                                                return s2.name === s;
                                            });
                                            if (s1) {
                                                s1.noSave = isHidden ? true : false;
                                            }
                                        });
                                        v.hiddenSettings.forEach(function (s) {
                                            var input = _this.model.inputs.find(function (input) {
                                                return input.id === s;
                                            });
                                            if (input) {
                                                input.isHidden = true;
                                            }
                                            var s1 = _this.bindingValue.settings.find(function (s2) {
                                                return s2.name === s;
                                            });
                                            if (s1) {
                                                s1.noSave = true;
                                            }
                                        });
                                    }
                                });
                                //http://stackoverflow.com/questions/35515254/what-is-a-dehydrated-detector-and-how-am-i-using-one-here
                                setTimeout(function () { return _this.model.orderInputs(); }, 0);
                            };
                            if (isHidden) {
                                ddInput_1.changeValue();
                            }
                            _this.model.inputs.splice(0, 0, ddInput_1);
                        }
                    });
                }
                // if no parameter name input add it
                var nameInput = _this.model.inputs.find(function (input) {
                    return input.id === "name";
                });
                if (!nameInput) {
                    var inputTb = new binding_input_1.TextboxInput();
                    inputTb.id = "name";
                    inputTb.label = _this._translateService.instant(portal_resources_1.PortalResources.binding_parameterName);
                    inputTb.isHidden = _this.newFunction;
                    inputTb.required = true;
                    inputTb.value = _this.bindingValue.name;
                    inputTb.help = _this._translateService.instant(portal_resources_1.PortalResources.binding_parameterName);
                    inputTb.validators = [
                        {
                            expression: "^[a-zA-Z_$][a-zA-Z_$0-9]*$",
                            errorText: _this._translateService.instant(portal_resources_1.PortalResources.notValidValue)
                        }
                    ];
                    _this.model.inputs.splice(0, 0, inputTb);
                }
                _this.model.saveOriginInputs();
                _this.hasInputsToShow = _this.model.leftInputs.length !== 0;
                _this.hasInputsToShowEvent.emit(_this.hasInputsToShow);
                _this.model.documentation = marked(bindingSchema.documentation);
                _this.setStorageInformation(selectedStorage);
            }
        });
    };
    BindingComponent.prototype.removeClicked = function () {
        this.remove.emit(this.bindingValue);
    };
    BindingComponent.prototype.cancelClicked = function () {
        this._broadcastService.clearDirtyState('function_integrate', true);
        this._portalService.setDirtyState(false);
        this.isDirty = false;
        this.cancel.emit(null);
    };
    BindingComponent.prototype.saveClicked = function () {
        var _this = this;
        this._portalService.logAction("binding-component", "save-binding", {
            type: this.bindingValue.type,
            direction: this.bindingValue.direction
        });
        this.bindingValue.newBinding = false;
        this.bindingValue.name = this.model.getInput("name").value;
        var selectedStorage;
        this.model.inputs.forEach(function (input) {
            if (input.type === binding_1.SettingType.int && typeof input.value === 'string') {
                input.value = isNaN(Number(input.value)) ? null : Number(input.value);
            }
            var setting = _this.bindingValue.settings.find(function (s) {
                return s.name == input.id;
            });
            var isNotRequiredEmptyInput = (!input.required && !input.value && input.value !== false);
            if (setting) {
                if (input instanceof binding_input_1.PickerInput && input.resource && input.resource === binding_1.ResourceType.Storage) {
                    selectedStorage = input.value;
                }
                setting.value = input.value;
                if (setting.noSave || isNotRequiredEmptyInput) {
                    setting.noSave = true;
                }
                else {
                    delete setting.noSave;
                }
            }
            else {
                if (!input.changeValue && !input.isHidden && !isNotRequiredEmptyInput) {
                    setting = {
                        name: input.id,
                        value: input.value
                    };
                    _this.bindingValue.settings.push(setting);
                }
            }
            if (input instanceof binding_input_1.CheckBoxListInput && setting) {
                setting.value = input.getArrayValue();
            }
            if (setting && setting.name === "route") {
                if (setting.value && setting.value.charAt(0) == "/") {
                    setting.value = setting.value.substr(1);
                }
            }
        });
        this.bindingValue.settings.forEach(function (setting) {
        });
        this.setLabel();
        this.model.saveOriginInputs();
        // if we create new storage account we need to update appSettings to get new storage information
        this._cacheService.postArm(this.functionApp.site.id + "/config/appsettings/list", true).subscribe(function (r) {
            _this._appSettings = r.json().properties;
            _this.setStorageInformation(selectedStorage);
        });
        this.update.emit(this.bindingValue);
        this._broadcastService.clearDirtyState('function_integrate', true);
        this._portalService.setDirtyState(false);
        this.isDirty = false;
    };
    BindingComponent.prototype.onValidChanged = function (input) {
        this.areInputsValid = this.model.isValid();
        this.validChange.emit(this);
    };
    BindingComponent.prototype.goClicked = function (action) {
        var _this = this;
        action.settingValues = [];
        action.settings.forEach(function (s) {
            var setting = _this.bindingValue.settings.find(function (v) {
                return v.name === s;
            });
            action.settingValues.push(setting.value);
        });
        this.go.emit(action);
    };
    BindingComponent.prototype.showDoc = function (value) {
        this.isDocShown = value;
    };
    BindingComponent.prototype.onAuth = function () {
        this._portalService.openBlade({
            detailBlade: "AppAuth",
            detailBladeInputs: { resourceUri: this.functionApp.site.id }
        }, "binding");
    };
    BindingComponent.prototype.setStorageInformation = function (selectedStorage) {
        this.storageAccountKey = undefined;
        this.storageAccountName = undefined;
        this.storageConnectionString = undefined;
        if (selectedStorage) {
            var storageAccount = this._getAccountNameAndKeyFromAppSetting(selectedStorage);
            if (storageAccount.length === 3) {
                this.storageAccountName = storageAccount.pop();
                this.storageAccountKey = storageAccount.pop();
                this.storageConnectionString = storageAccount.pop();
            }
        }
    };
    BindingComponent.prototype.setDirtyIfNewBinding = function () {
        this.isDirty = this.bindingValue.newBinding === true ? true : false;
    };
    BindingComponent.prototype.replaceVariables = function (value, variables) {
        var result = value;
        if (value) {
            for (var key in variables) {
                if (variables.hasOwnProperty(key)) {
                    result = result.replace("[variables('" + key + "')]", variables[key]);
                }
            }
            return result;
        }
    };
    BindingComponent.prototype.setLabel = function () {
        var bindingTypeString = this.bindingValue.direction.toString();
        switch (bindingTypeString) {
            case "in":
                bindingTypeString = "input";
                break;
            case "out":
                bindingTypeString = "output";
                break;
        }
        this.model.label = this.bindingValue.displayName + " " + bindingTypeString + " (" + this.bindingValue.name + ")";
    };
    BindingComponent.prototype.isHidden = function (name) {
        var isHidden = false;
        if (this.newFunction) {
            isHidden = true;
            var match = this.bindingValue.hiddenList.find(function (h) {
                return h === name;
            });
            isHidden = match ? false : true;
        }
        return isHidden;
    };
    BindingComponent.prototype._getResourceAppSettings = function (type) {
        var result = [];
        switch (type) {
            case binding_1.ResourceType.Storage:
                for (var key in this._appSettings) {
                    var value = this._appSettings[key].toLowerCase();
                    if (value.indexOf("accountname") > -1 && value.indexOf("accountkey") > -1) {
                        result.push(key);
                    }
                }
                break;
            case binding_1.ResourceType.EventHub:
            case binding_1.ResourceType.ServiceBus:
                for (var key in this._appSettings) {
                    var value = this._appSettings[key].toLowerCase();
                    if (value.indexOf("sb://") > -1 && value.indexOf("sharedaccesskeyname") > -1) {
                        result.push(key);
                    }
                }
                break;
            case binding_1.ResourceType.ApiHub:
                for (var key in this._appSettings) {
                    var value = this._appSettings[key].toLowerCase();
                    if (value.indexOf("logic-apis") > -1 && value.indexOf("accesstoken") > -1) {
                        result.push(key);
                    }
                }
                break;
            case binding_1.ResourceType.DocumentDB:
                for (var key in this._appSettings) {
                    var value = this._appSettings[key].toLowerCase();
                    if (value.indexOf("accountendpoint") > -1 && value.indexOf("documents.azure.com") > -1) {
                        result.push(key);
                    }
                }
                break;
        }
        return result;
    };
    BindingComponent.prototype._getAccountNameAndKeyFromAppSetting = function (settingName) {
        var value = this._appSettings ? this._appSettings[settingName] : null;
        if (value) {
            var account = [];
            var accountName;
            var accountKey;
            var partsArray = value.split(';');
            for (var i = 0; i < partsArray.length; i++) {
                var part = partsArray[i];
                var accountNameIndex = part.toLowerCase().indexOf("accountname");
                var accountKeyIndex = part.toLowerCase().indexOf("accountkey");
                if (accountNameIndex > -1)
                    accountName = (part.substring(accountNameIndex + 12, part.length));
                if (accountKeyIndex > -1)
                    accountKey = (part.substring(accountKeyIndex + 11, part.length));
            }
            account.push(value);
            if (accountKey)
                account.push(accountKey);
            if (accountName)
                account.push(accountName);
            return account;
        }
        else {
            return [];
        }
    };
    BindingComponent.prototype.filterWarnings = function () {
        var _this = this;
        if (this.newFunction) {
            this.model.warnings = undefined;
        }
        if (this.model.warnings) {
            this.model.warnings.forEach(function (w) {
                var array = w.variablePath.split('.');
                var showWarning = _this;
                array.forEach(function (part) {
                    showWarning = showWarning[part];
                });
                if (showWarning === true) {
                    w.visible = true;
                }
            });
        }
    };
    return BindingComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], BindingComponent.prototype, "canDelete", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], BindingComponent.prototype, "canSave", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], BindingComponent.prototype, "canCancel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], BindingComponent.prototype, "saveClick", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], BindingComponent.prototype, "allBindings", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], BindingComponent.prototype, "remove", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], BindingComponent.prototype, "update", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], BindingComponent.prototype, "validChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], BindingComponent.prototype, "hasInputsToShowEvent", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], BindingComponent.prototype, "go", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], BindingComponent.prototype, "cancel", void 0);
BindingComponent = __decorate([
    core_1.Component({
        selector: 'binding',
        templateUrl: './binding.component.html',
        styleUrls: ['./binding.component.scss'],
        inputs: ['functionAppInput', 'binding', 'clickSave']
    }),
    __param(0, core_1.Inject(core_1.ElementRef)),
    __metadata("design:paramtypes", [core_1.ElementRef,
        broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        cache_service_1.CacheService,
        core_2.TranslateService])
], BindingComponent);
exports.BindingComponent = BindingComponent;
//# sourceMappingURL=binding.component.js.map