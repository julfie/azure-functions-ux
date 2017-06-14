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
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/distinctUntilChanged");
var template_picker_1 = require("../shared/models/template-picker");
var binding_1 = require("../shared/models/binding");
var binding_manager_1 = require("../shared/models/binding-manager");
var global_state_service_1 = require("../shared/services/global-state.service");
var portal_resources_1 = require("../shared/models/portal-resources");
var TemplatePickerComponent = (function () {
    function TemplatePickerComponent(_globalStateService, _translateService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this.languages = [];
        this.categories = [];
        this.templates = [];
        this.filterItems = [];
        this.bc = new binding_manager_1.BindingManager();
        this.isTemplate = false;
        this.category = "";
        this._language = "";
        this._initialized = false;
        this._orderedCategoties = [];
        this._functionAppStream = new Subject_1.Subject();
        this.complete = new core_1.EventEmitter();
        this.cancel = new core_1.EventEmitter();
        this._functionAppStream
            .distinctUntilChanged()
            .subscribe(function (functionApp) {
            _this._functionApp = functionApp;
        });
        this.showTryView = this._globalStateService.showTryView;
        this._language = this._translateService.instant("temp_category_all");
        this._orderedCategoties = [
            {
                name: this._translateService.instant("temp_category_core"),
                index: 0
            },
            {
                name: this._translateService.instant("temp_category_api"),
                index: 1,
            },
            {
                name: this._translateService.instant("temp_category_dataProcessing"),
                index: 2,
            },
            {
                name: this._translateService.instant("temp_category_samples"),
                index: 3,
            },
            {
                name: this._translateService.instant("temp_category_experimental"),
                index: 4,
            },
            {
                name: this._translateService.instant("temp_category_all"),
                index: 1000,
            }
        ];
    }
    Object.defineProperty(TemplatePickerComponent.prototype, "template", {
        set: function (value) {
            if (value) {
                this.onTemplateClicked(value, false);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TemplatePickerComponent.prototype, "functionAppInput", {
        set: function (functionApp) {
            this._functionAppStream.next(functionApp);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TemplatePickerComponent.prototype, "type", {
        set: function (type) {
            var _this = this;
            this.isTemplate = (type === template_picker_1.TemplatePickerType.template);
            var that = this;
            this._type = type;
            this._globalStateService.setBusyState();
            this._functionApp.getTemplates().subscribe(function (templates) {
                _this._functionApp.getBindingConfig().subscribe(function (config) {
                    var that = _this;
                    _this._globalStateService.clearBusyState();
                    _this.bindings = config.bindings;
                    _this.templates = [];
                    switch (type) {
                        case template_picker_1.TemplatePickerType.in:
                            _this.title = _this._translateService.instant(portal_resources_1.PortalResources.templatePicker_chooseInput);
                            _this.templates = _this.getBindingTemplates(binding_1.DirectionType.in);
                            break;
                        case template_picker_1.TemplatePickerType.out:
                            _this.title = _this._translateService.instant(portal_resources_1.PortalResources.templatePicker_chooseOutput);
                            _this.templates = _this.getBindingTemplates(binding_1.DirectionType.out);
                            break;
                        case template_picker_1.TemplatePickerType.trigger:
                            _this.title = _this._translateService.instant(portal_resources_1.PortalResources.templatePicker_chooseTrigger);
                            _this.templates = _this.getBindingTemplates(binding_1.DirectionType.trigger);
                            break;
                        case template_picker_1.TemplatePickerType.template:
                            _this.title = _this._translateService.instant(portal_resources_1.PortalResources.templatePicker_chooseTemplate);
                            var initLanguages_1 = false, initCategories_1 = false;
                            if (_this.languages.length === 0) {
                                _this.languages = [{ displayLabel: _this._translateService.instant(portal_resources_1.PortalResources.all), value: _this._translateService.instant("temp_category_all"), default: true }];
                                initLanguages_1 = true;
                            }
                            if (_this.categories.length === 0) {
                                _this.categories = [{ displayLabel: _this._translateService.instant(portal_resources_1.PortalResources.all), value: _this._translateService.instant("temp_category_all") }];
                                initCategories_1 = true;
                            }
                            templates.forEach(function (template) {
                                if (template.metadata.visible === false) {
                                    return;
                                }
                                if (!_this.getFilterMatach(template.metadata.filters)) {
                                    return;
                                }
                                if (initLanguages_1) {
                                    var lang = _this.languages.find(function (l) {
                                        return l.value === template.metadata.language;
                                    });
                                    if (!lang) {
                                        _this.languages.push({
                                            displayLabel: template.metadata.language,
                                            value: template.metadata.language
                                        });
                                    }
                                }
                                if (initCategories_1) {
                                    template.metadata.category.forEach(function (c) {
                                        if ((_this._language === _this._translateService.instant("temp_category_all") || (template.metadata.language === _this._language))) {
                                            var index = _this.categories.findIndex(function (category) {
                                                return category.value === c;
                                            });
                                            if (index === -1) {
                                                var dropDownElement = {
                                                    displayLabel: c,
                                                    value: c
                                                };
                                                if (_this.category === c) {
                                                    dropDownElement.default = true;
                                                }
                                                else if (!_this.category && c === _this._translateService.instant("temp_category_core")) {
                                                    dropDownElement.default = true;
                                                }
                                                _this.categories.push(dropDownElement);
                                            }
                                        }
                                    });
                                }
                                var matchIndex = template.metadata.category.findIndex(function (c) {
                                    return c === _this.category || _this.category === _this._translateService.instant("temp_category_all");
                                });
                                if (matchIndex !== -1) {
                                    if ((_this._language === _this._translateService.instant("temp_category_all") || (template.metadata.language === _this._language))) {
                                        var keys = template.metadata.category.slice(0) || [_this._translateService.instant("temp_category_experimental")];
                                        keys.push(template.metadata.language);
                                        _this.templates.push({
                                            name: template.metadata.name + " - " + template.metadata.language,
                                            value: template.id,
                                            keys: keys,
                                            description: template.metadata.description,
                                            enabledInTryMode: template.metadata.enabledInTryMode
                                        });
                                    }
                                }
                            });
                            _this.categories.sort(function (a, b) {
                                var ca = _this._orderedCategoties.find(function (c) { return c.name === a.displayLabel; });
                                var cb = _this._orderedCategoties.find(function (c) { return c.name === b.displayLabel; });
                                return ((ca ? ca.index : 500) > (cb ? cb.index : 500)) ? 1 : -1;
                            });
                            _this.languages = _this.languages.sort(function (a, b) {
                                return a.displayLabel > b.displayLabel ? 1 : -1;
                            });
                    }
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    TemplatePickerComponent.prototype.ngOnInit = function () {
    };
    TemplatePickerComponent.prototype.onSelectClicked = function () {
        this.complete.emit(this.selectedTemplate); // this fires an eventClicked
        this.selectedTemplate = "";
    };
    TemplatePickerComponent.prototype.onCancelClicked = function () {
        this.cancel.emit(""); // this fires an eventClicked
    };
    TemplatePickerComponent.prototype.onTemplateClicked = function (template, templateDisabled) {
        if (!templateDisabled) {
            this.selectedTemplate = template;
            if (!this.showFooter) {
                this.complete.emit(this.selectedTemplate);
            }
        }
    };
    TemplatePickerComponent.prototype.onLanguageChanged = function (language) {
        if (this._language !== language) {
            this._language = language;
            this.categories = [];
            // if language is set to "all" we need to show "Core" templates
            if (this._language === this._translateService.instant("temp_category_all")) {
                this.category = this._translateService.instant("temp_category_core");
            }
            if (this._language && this.category) {
                this.type = this._type;
            }
        }
    };
    TemplatePickerComponent.prototype.onScenarioChanged = function (category) {
        if (this.category !== category) {
            this.category = category;
            if (this._language && this.category) {
                this.type = this._type;
            }
        }
    };
    TemplatePickerComponent.prototype.getBindingTemplates = function (direction) {
        var _this = this;
        var result = [];
        var filtered = this.bindings.filter(function (b) {
            return b.direction === direction;
        });
        filtered.forEach(function (binding) {
            if (_this.getFilterMatach(binding.filters)) {
                result.push({
                    name: binding.displayName.toString(),
                    value: binding.type.toString(),
                    enabledInTryMode: binding.enabledInTryMode
                });
            }
        });
        return result;
    };
    TemplatePickerComponent.prototype.getFilterMatach = function (filters) {
        var isFilterMatch = true;
        if (filters && filters.length > 0) {
            isFilterMatch = false;
            for (var i = 0; i < filters.length; i++) {
                var value = this.getQueryStringValue(filters[i]);
                if (value) {
                    isFilterMatch = true;
                    break;
                }
            }
        }
        return isFilterMatch;
    };
    TemplatePickerComponent.prototype.getQueryStringValue = function (key) {
        //http://stackoverflow.com/questions/9870512/how-to-obtaining-the-querystring-from-the-current-url-with-javascript
        return window.location.search.replace(new RegExp("^(?:.*[&\\?]" + key.replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1");
    };
    return TemplatePickerComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TemplatePickerComponent.prototype, "showFooter", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], TemplatePickerComponent.prototype, "complete", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], TemplatePickerComponent.prototype, "cancel", void 0);
TemplatePickerComponent = __decorate([
    core_1.Component({
        selector: 'template-picker',
        templateUrl: './template-picker.component.html',
        inputs: ['functionAppInput', 'type', 'template'],
        styleUrls: ['./template-picker.component.scss']
    }),
    __metadata("design:paramtypes", [global_state_service_1.GlobalStateService,
        core_2.TranslateService])
], TemplatePickerComponent);
exports.TemplatePickerComponent = TemplatePickerComponent;
//# sourceMappingURL=template-picker.component.js.map