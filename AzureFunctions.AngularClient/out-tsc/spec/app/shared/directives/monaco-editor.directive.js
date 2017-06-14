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
var config_service_1 = require("./../services/config.service");
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/distinctUntilChanged");
var global_state_service_1 = require("../services/global-state.service");
var function_app_1 = require("../function-app");
var MonacoEditorDirective = (function () {
    function MonacoEditorDirective(elementRef, _globalStateService, _configService) {
        var _this = this;
        this.elementRef = elementRef;
        this._globalStateService = _globalStateService;
        this._configService = _configService;
        this._silent = false;
        this.onContentChanged = new core_1.EventEmitter();
        this.onSave = new core_1.EventEmitter();
        this._functionAppStream = new Subject_1.Subject();
        this._functionAppStream
            .distinctUntilChanged()
            .subscribe(function (functionApp) {
            _this._functionApp = functionApp;
            _this.init();
        });
    }
    Object.defineProperty(MonacoEditorDirective.prototype, "functionAppInput", {
        set: function (functionApp) {
            this._functionAppStream.next(functionApp);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonacoEditorDirective.prototype, "content", {
        set: function (str) {
            if (!str) {
                str = '';
            }
            if (this._editor && this._editor.getValue() === str) {
                return;
            }
            this._content = str;
            if (this._editor) {
                this._silent = true;
                this._editor.setValue(this._content);
                this._silent = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonacoEditorDirective.prototype, "disabled", {
        set: function (value) {
            if (value !== this._disabled) {
                this._disabled = value;
                if (this._editor) {
                    this._editor.updateOptions({
                        readOnly: this._disabled
                    });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MonacoEditorDirective.prototype, "fileName", {
        set: function (filename) {
            var extension = filename.split('.').pop().toLocaleLowerCase();
            this._fileName = filename;
            switch (extension) {
                case 'bat':
                    this._language = 'bat';
                    break;
                case 'csx':
                    this._language = 'csharp';
                    break;
                case 'fsx':
                    this._language = 'fsharp';
                    break;
                case 'js':
                    this._language = 'javascript';
                    break;
                case 'json':
                    this._language = 'json';
                    break;
                case 'ps1':
                    this._language = 'powershell';
                    break;
                case 'py':
                    this._language = 'python';
                    break;
                case 'ts':
                    this._language = 'typescript';
                    break;
                // Monaco does not have sh, php
                default:
                    this._language = undefined;
                    break;
            }
            if (this._editor) {
                this.init();
                // This does not work for JSON
                // monaco.editor.setModelLanguage(this._editor.getModel(), this._language);
            }
        },
        enumerable: true,
        configurable: true
    });
    MonacoEditorDirective.prototype.setLayout = function (width, height) {
        if (this._editor) {
            var layout = this._editor.getLayoutInfo();
            this._editor.layout({
                width: width ? width : layout.width,
                height: height ? height : layout.height,
            });
        }
    };
    MonacoEditorDirective.prototype.init = function () {
        var _this = this;
        this._globalStateService.setBusyState();
        var onGotAmdLoader = function () {
            // Load monaco
            if (window.location.hostname === 'localhost' || _this._configService.isStandalone()) {
                window.require.config({ paths: { 'vs': '/ng/assets/monaco/min/vs' } });
            }
            else {
                window.require.config({ paths: { 'vs': '/assets/monaco/min/vs' } });
            }
            window.require(['vs/editor/editor.main'], function () {
                var that = _this;
                if (that._editor) {
                    that._editor.dispose();
                }
                var projectJson = 'project.json';
                var functionJson = 'function.json';
                var hostJson = 'host.json';
                var fileName = that._fileName || '';
                fileName = fileName.toLocaleLowerCase();
                if (fileName === projectJson || fileName === functionJson || fileName === hostJson) {
                    that.setMonacoSchema(fileName, that._functionApp);
                }
                else {
                    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                        schemas: []
                    });
                }
                // compiler options
                monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ES2015,
                });
                that._editor = monaco.editor.create(that.elementRef.nativeElement, {
                    value: that._content,
                    language: that._language,
                    readOnly: that._disabled,
                    lineHeight: 17
                });
                that._editor.onDidChangeModelContent(function () {
                    if (!that._silent) {
                        that.onContentChanged.emit(that._editor.getValue());
                    }
                });
                // TODO: test with MAC
                that._editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function () {
                    that.onSave.emit(that._editor.getValue());
                });
                that._globalStateService.clearBusyState();
            });
        };
        // Load AMD loader if necessary
        if (!window.require) {
            var loaderScript = document.createElement('script');
            loaderScript.type = 'text/javascript';
            loaderScript.src = 'assets/monaco/vs/loader.js';
            loaderScript.addEventListener('load', onGotAmdLoader);
            document.body.appendChild(loaderScript);
        }
        else {
            onGotAmdLoader();
        }
    };
    MonacoEditorDirective.prototype.setMonacoSchema = function (schemaName, functionApp) {
        functionApp.getJson('/schemas/' + schemaName)
            .subscribe(function (schema) {
            schema.additionalProperties = false;
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: true,
                schemas: [{
                        fileMatch: ['*'],
                        schema: schema
                    }]
            });
        });
    };
    return MonacoEditorDirective;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], MonacoEditorDirective.prototype, "onContentChanged", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], MonacoEditorDirective.prototype, "onSave", void 0);
__decorate([
    core_1.Input('functionAppInput'),
    __metadata("design:type", function_app_1.FunctionApp),
    __metadata("design:paramtypes", [function_app_1.FunctionApp])
], MonacoEditorDirective.prototype, "functionAppInput", null);
__decorate([
    core_1.Input('content'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], MonacoEditorDirective.prototype, "content", null);
__decorate([
    core_1.Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], MonacoEditorDirective.prototype, "disabled", null);
__decorate([
    core_1.Input('fileName'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], MonacoEditorDirective.prototype, "fileName", null);
MonacoEditorDirective = __decorate([
    core_1.Directive({
        selector: '[monacoEditor]',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        global_state_service_1.GlobalStateService,
        config_service_1.ConfigService])
], MonacoEditorDirective);
exports.MonacoEditorDirective = MonacoEditorDirective;
//# sourceMappingURL=monaco-editor.directive.js.map