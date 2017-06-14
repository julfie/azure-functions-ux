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
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/do");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
var core_2 = require("@ngx-translate/core");
var template_picker_1 = require("../shared/models/template-picker");
var binding_list_1 = require("../shared/models/binding-list");
var binding_manager_1 = require("../shared/models/binding-manager");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var portal_service_1 = require("../shared/services/portal.service");
var global_state_service_1 = require("../shared/services/global-state.service");
var portal_resources_1 = require("../shared/models/portal-resources");
var ai_service_1 = require("../shared/services/ai.service");
var dashboard_type_1 = require("../tree-view/models/dashboard-type");
var FunctionNewComponent = (function () {
    function FunctionNewComponent(elementRef, _broadcastService, _portalService, _globalStateService, _translateService, _aiService) {
        var _this = this;
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._aiService = _aiService;
        this.type = template_picker_1.TemplatePickerType.template;
        this.functionNameError = "";
        this.bc = new binding_manager_1.BindingManager();
        this.model = new binding_list_1.BindingList();
        this.clickSave = false;
        this.updateBindingsCount = 0;
        this.areInputsValid = false;
        this.hasConfigUI = true;
        this.addLinkToAuth = false;
        this.functionAdded = new core_1.EventEmitter();
        this._bindingComponents = [];
        this._exclutionFileList = [
            "test.json",
            "readme.md",
            "metadata.json"
        ];
        this._viewInfoStream = new Subject_1.Subject();
        this.elementRef = elementRef;
        this.disabled = _broadcastService.getDirtyState("function_disabled");
        this._viewInfoStream
            .switchMap(function (viewInfo) {
            _this._globalStateService.setBusyState();
            _this.functionsNode = viewInfo.node;
            _this.appNode = viewInfo.node.parent;
            _this.functionApp = _this.functionsNode.functionApp;
            if (_this.functionsNode.action) {
                _this._action = Object.create(_this.functionsNode.action);
                delete _this.functionsNode.action;
            }
            return _this.functionApp.getFunctions();
        })
            .do(null, function (e) {
            _this._aiService.trackException(e, '/errors/function-new');
            console.error(e);
        })
            .retry()
            .subscribe(function (fcs) {
            _this._globalStateService.clearBusyState();
            _this.functionsInfo = fcs;
            if (_this._action && _this.functionsInfo && !_this.selectedTemplate) {
                _this.selectedTemplateId = _this._action.templateId;
            }
        });
    }
    Object.defineProperty(FunctionNewComponent.prototype, "viewInfoInput", {
        set: function (viewInfoInput) {
            this._viewInfoStream.next(viewInfoInput);
        },
        enumerable: true,
        configurable: true
    });
    FunctionNewComponent.prototype.onTemplatePickUpComplete = function (templateName) {
        var _this = this;
        this._bindingComponents = [];
        this._globalStateService.setBusyState();
        this.functionApp.getTemplates().subscribe(function (templates) {
            setTimeout(function () {
                _this.selectedTemplate = templates.find(function (t) { return t.id === templateName; });
                var experimentalCategory = _this.selectedTemplate.metadata.category.find(function (c) {
                    return c === "Experimental";
                });
                _this.templateWarning = experimentalCategory === undefined ? '' : _this._translateService.instant(portal_resources_1.PortalResources.functionNew_experimentalTemplate);
                if (_this.selectedTemplate.metadata.warning) {
                    _this.addLinkToAuth = _this.selectedTemplate.metadata.warning.addLinkToAuth ? true : false;
                    if (_this.templateWarning) {
                        _this.templateWarning += "<br/>" + _this.selectedTemplate.metadata.warning.text;
                    }
                    else {
                        _this.templateWarning += _this.selectedTemplate.metadata.warning.text;
                    }
                }
                _this.functionName = binding_manager_1.BindingManager.getFunctionName(_this.selectedTemplate.metadata.defaultFunctionName, _this.functionsInfo);
                _this.functionApp.getBindingConfig().subscribe(function (bindings) {
                    _this._globalStateService.clearBusyState();
                    _this.bc.setDefaultValues(_this.selectedTemplate.function.bindings, _this._globalStateService.DefaultStorageAccount);
                    _this.model.config = _this.bc.functionConfigToUI({
                        disabled: false,
                        bindings: _this.selectedTemplate.function.bindings
                    }, bindings.bindings);
                    _this.model.config.bindings.forEach(function (b) {
                        b.hiddenList = _this.selectedTemplate.metadata.userPrompt || [];
                    });
                    _this.hasConfigUI = ((_this.selectedTemplate.metadata.userPrompt) && (_this.selectedTemplate.metadata.userPrompt.length > 0));
                    _this.model.setBindings();
                    _this.validate();
                    var that = _this;
                    if (_this._action) {
                        var binding = _this.model.config.bindings.find(function (b) {
                            return b.type.toString() === _this._action.binding;
                        });
                        if (binding) {
                            _this._action.settings.forEach(function (s, index) {
                                var setting = binding.settings.find(function (bs) {
                                    return bs.name === s;
                                });
                                if (setting) {
                                    setting.value = _this._action.settingValues[index];
                                }
                            });
                        }
                    }
                });
            });
        });
    };
    FunctionNewComponent.prototype.onCreate = function () {
        if (!this.functionName || this._globalStateService.IsBusy) {
            return;
        }
        this.updateBindingsCount = this.model.config.bindings.length;
        if (this.updateBindingsCount === 0 || !this.hasConfigUI) {
            this.createFunction();
            return;
        }
        this.clickSave = true;
    };
    FunctionNewComponent.prototype.onRemoveBinding = function (binding) {
        this.model.removeBinding(binding.id);
        this.model.setBindings();
    };
    FunctionNewComponent.prototype.onUpdateBinding = function (binding) {
        this.model.updateBinding(binding);
        this.updateBindingsCount--;
        if (this.updateBindingsCount === 0) {
            //Last binding update
            this.createFunction();
        }
    };
    FunctionNewComponent.prototype.functionNameChanged = function (value) {
        this.validate();
    };
    FunctionNewComponent.prototype.onValidChanged = function (component) {
        var i = this._bindingComponents.findIndex(function (b) {
            return b.bindingValue.id === component.bindingValue.id;
        });
        if (i !== -1) {
            this._bindingComponents[i] = component;
        }
        else {
            this._bindingComponents.push(component);
        }
        this.validate();
    };
    FunctionNewComponent.prototype.quickstart = function () {
        this.functionsNode.openCreateDashboard(dashboard_type_1.DashboardType.createFunctionQuickstart);
    };
    FunctionNewComponent.prototype.onAuth = function () {
        this._portalService.openBlade({
            detailBlade: "AppAuth",
            detailBladeInputs: { resourceUri: this.functionApp.site.id }
        }, "binding");
    };
    FunctionNewComponent.prototype.validate = function () {
        var _this = this;
        //^[a-z][a-z0-9_\-]{0,127}$(?<!^host$) C# expression
        // Lookbehind is not supported in JS
        this.areInputsValid = true;
        this.functionNameError = "";
        var regexp = new RegExp("^[a-zA-Z][a-zA-Z0-9_\-]{0,127}$");
        this.areInputsValid = regexp.test(this.functionName);
        if (this.functionName.toLowerCase() === "host") {
            this.areInputsValid = false;
        }
        if (!this.areInputsValid) {
            this.functionNameError = this.areInputsValid ? '' : this._translateService.instant(portal_resources_1.PortalResources.functionNew_nameError);
        }
        else {
            var nameMatch = this.functionsInfo.find(function (f) {
                return f.name.toLowerCase() === _this.functionName.toLowerCase();
            });
            if (nameMatch) {
                this.functionNameError = this._translateService.instant(portal_resources_1.PortalResources.functionNew_functionExsists, { name: this.functionName });
                this.areInputsValid = true;
            }
        }
        this._bindingComponents.forEach(function (b) {
            _this.areInputsValid = b.areInputsValid && _this.areInputsValid;
        });
    };
    FunctionNewComponent.prototype.createFunction = function () {
        var _this = this;
        this._portalService.logAction("new-function", "creating", { template: this.selectedTemplate.id, name: this.functionName });
        this._exclutionFileList.forEach(function (file) {
            for (var p in _this.selectedTemplate.files) {
                if (_this.selectedTemplate.files.hasOwnProperty(p) && file == (p + "").toLowerCase()) {
                    delete _this.selectedTemplate.files[p];
                }
            }
        });
        this._globalStateService.setBusyState();
        this.functionApp.createFunctionV2(this.functionName, this.selectedTemplate.files, this.bc.UIToFunctionConfig(this.model.config))
            .subscribe(function (res) {
            _this._portalService.logAction("new-function", "success", { template: _this.selectedTemplate.id, name: _this.functionName });
            _this._aiService.trackEvent("new-function", { template: _this.selectedTemplate.id, result: "success", first: "false" });
            // this._broadcastService.broadcast(BroadcastEvent.FunctionAdded, res);
            _this.functionsNode.addChild(res);
            _this._globalStateService.clearBusyState();
        }, function (e) {
            _this._globalStateService.clearBusyState();
        });
    };
    return FunctionNewComponent;
}());
FunctionNewComponent = __decorate([
    core_1.Component({
        selector: 'function-new',
        templateUrl: './function-new.component.html',
        styleUrls: ['./function-new.component.scss'],
        outputs: ['functionAdded'],
        inputs: ['viewInfoInput']
    }),
    __param(0, core_1.Inject(core_1.ElementRef)),
    __metadata("design:paramtypes", [core_1.ElementRef,
        broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        ai_service_1.AiService])
], FunctionNewComponent);
exports.FunctionNewComponent = FunctionNewComponent;
//# sourceMappingURL=function-new.component.js.map