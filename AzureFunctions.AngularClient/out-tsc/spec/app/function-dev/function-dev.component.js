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
var config_service_1 = require("./../shared/services/config.service");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/observable/zip");
require("rxjs/add/observable/of");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
// import {FunctionDesignerComponent} from '../function-designer/function-designer.component';
var log_streaming_component_1 = require("../log-streaming/log-streaming.component");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var portal_service_1 = require("../shared/services/portal.service");
var binding_1 = require("../shared/models/binding");
var file_explorer_component_1 = require("../file-explorer/file-explorer.component");
var global_state_service_1 = require("../shared/services/global-state.service");
var busy_state_component_1 = require("../busy-state/busy-state.component");
var error_event_1 = require("../shared/models/error-event");
var portal_resources_1 = require("../shared/models/portal-resources");
var tutorial_1 = require("../shared/models/tutorial");
var ai_service_1 = require("../shared/services/ai.service");
var monaco_editor_directive_1 = require("../shared/directives/monaco-editor.directive");
var binding_manager_1 = require("../shared/models/binding-manager");
var run_http_component_1 = require("../run-http/run-http.component");
var error_ids_1 = require("../shared/models/error-ids");
var FunctionDevComponent = FunctionDevComponent_1 = (function () {
    function FunctionDevComponent(_broadcastService, _portalService, _globalStateService, _translateService, _aiService, _el, configService) {
        var _this = this;
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._aiService = _aiService;
        this._el = _el;
        this.runValid = false;
        this.showFunctionInvokeUrl = false;
        this.showFunctionKey = false;
        this.showFunctionInvokeUrlModal = false;
        this.showFunctionKeyModal = false;
        this.rightTab = FunctionDevComponent_1.rightTab;
        this.bottomTab = FunctionDevComponent_1.bottomTab;
        this.expandLogs = false;
        this._bindingManager = new binding_manager_1.BindingManager();
        this._isClientCertEnabled = false;
        this.functionInvokeUrl = this._translateService.instant(portal_resources_1.PortalResources.functionDev_loading);
        this.isStandalone = configService.isStandalone();
        this.selectedFileStream = new Subject_1.Subject();
        this.selectedFileStream
            .switchMap(function (file) {
            if (_this.fileExplorer)
                _this.fileExplorer.setBusyState();
            return Observable_1.Observable.zip(_this.selectedFunction.functionApp.getFileContent(file), Observable_1.Observable.of(file), function (c, f) { return ({ content: c, file: f }); });
        })
            .subscribe(function (res) {
            _this.content = res.content;
            _this.updatedContent = res.content;
            res.file.isDirty = false;
            _this.scriptFile = res.file;
            _this.fileName = res.file.name;
            if (_this.fileExplorer)
                _this.fileExplorer.clearBusyState();
        }, function (e) { return _this._globalStateService.clearBusyState(); });
        this.functionSelectStream = new Subject_1.Subject();
        this.functionSelectStream
            .switchMap(function (fi) {
            _this.functionApp = fi.functionApp;
            _this.disabled = _this.functionApp.getFunctionAppEditMode().map(edit_mode_helper_1.EditModeHelper.isReadOnly);
            _this._globalStateService.setBusyState();
            _this.checkErrors(fi);
            return Observable_1.Observable.zip(fi.clientOnly || _this.functionApp.isMultiKeySupported ? Observable_1.Observable.of({}) : _this.functionApp.getSecrets(fi), Observable_1.Observable.of(fi), _this.functionApp.getAuthSettings(), function (s, f, e) { return ({ secrets: s, functionInfo: f, authSettings: e }); });
        })
            .subscribe(function (res) {
            _this._isClientCertEnabled = res.authSettings.clientCertEnabled;
            _this.content = "";
            _this.testContent = res.functionInfo.test_data;
            try {
                var httpModel = JSON.parse(res.functionInfo.test_data);
                // Check if it's valid model
                if (Array.isArray(httpModel.headers)) {
                    _this.testContent = httpModel.body;
                }
            }
            catch (e) {
                // it's not run http model
            }
            _this._globalStateService.clearBusyState();
            _this.fileName = res.functionInfo.script_href.substring(res.functionInfo.script_href.lastIndexOf('/') + 1);
            var href = res.functionInfo.script_href;
            if (_this.fileName.toLowerCase().endsWith("dll")) {
                _this.fileName = res.functionInfo.config_href.substring(res.functionInfo.config_href.lastIndexOf('/') + 1);
                href = res.functionInfo.config_href;
            }
            _this.scriptFile = _this.scriptFile && _this.functionInfo && _this.functionInfo.href === res.functionInfo.href
                ? _this.scriptFile
                : { name: _this.fileName, href: href, mime: 'file' };
            _this.selectedFileStream.next(_this.scriptFile);
            _this.functionInfo = res.functionInfo;
            _this.setInvokeUrlVisibility();
            _this.configContent = JSON.stringify(_this.functionInfo.config, undefined, 2);
            var inputBinding = (_this.functionInfo.config && _this.functionInfo.config.bindings
                ? _this.functionInfo.config.bindings.find(function (e) { return !!e.webHookType; })
                : null);
            if (inputBinding) {
                _this.webHookType = inputBinding.webHookType;
            }
            else {
                delete _this.webHookType;
            }
            _this.showFunctionKey = _this.webHookType === 'github';
            inputBinding = (_this.functionInfo.config && _this.functionInfo.config.bindings
                ? _this.functionInfo.config.bindings.find(function (e) { return !!e.authLevel; })
                : null);
            if (inputBinding) {
                _this.authLevel = inputBinding.authLevel;
            }
            else {
                delete _this.authLevel;
            }
            _this.updateKeys();
            inputBinding = (_this.functionInfo.config && _this.functionInfo.config.bindings
                ? _this.functionInfo.config.bindings.find(function (e) { return e.type === 'httpTrigger'; })
                : null);
            if (inputBinding) {
                _this.isHttpFunction = true;
            }
            else {
                _this.isHttpFunction = false;
            }
            setTimeout(function () {
                _this.onResize();
                // Remove "code" param fix
                _this.saveTestData();
            }, 0);
            if (!_this.functionApp.isMultiKeySupported) {
                _this.setFunctionInvokeUrl();
                _this.setFunctionKey(_this.functionInfo);
            }
            else if (_this._isClientCertEnabled) {
                _this.setFunctionInvokeUrl();
            }
        });
        this.functionUpdate = _broadcastService.subscribe(broadcast_event_1.BroadcastEvent.FunctionUpdated, function (newFunctionInfo) {
            _this.functionInfo.config = newFunctionInfo.config;
            _this.setInvokeUrlVisibility();
        });
    }
    FunctionDevComponent.prototype.expandLogsClicked = function (isExpand) {
        this.expandLogs = isExpand;
        this.onResize();
    };
    FunctionDevComponent.prototype.onResize = function (ev) {
        var _this = this;
        var functionNameHeight = 46;
        var editorPadding = 25;
        var functionContainerWidth;
        var functionContainaerHeight;
        if (this.functionContainer) {
            functionContainerWidth = window.innerWidth - this.functionContainer.nativeElement.getBoundingClientRect().left;
            functionContainaerHeight = window.innerHeight - this.functionContainer.nativeElement.getBoundingClientRect().top;
        }
        var rigthContainerWidth = this.rightTab ? Math.floor((functionContainerWidth / 3)) : 50;
        var bottomContainerHeight = this.bottomTab ? Math.floor((functionContainaerHeight / 3)) : 50;
        var editorContainerWidth = functionContainerWidth - rigthContainerWidth - 50;
        var editorContainerHeight = functionContainaerHeight - bottomContainerHeight - functionNameHeight - editorPadding;
        if (this.expandLogs) {
            editorContainerHeight = 0;
            //editorContainerWidth = 0;
            bottomContainerHeight = functionContainaerHeight - functionNameHeight;
            this.editorContainer.nativeElement.style.visibility = "hidden";
            this.bottomContainer.nativeElement.style.marginTop = "0px";
        }
        else {
            this.editorContainer.nativeElement.style.visibility = "visible";
            this.bottomContainer.nativeElement.style.marginTop = "25px";
        }
        if (this.editorContainer) {
            this.editorContainer.nativeElement.style.width = editorContainerWidth + "px";
            this.editorContainer.nativeElement.style.height = editorContainerHeight + "px";
        }
        if (this.codeEditor) {
            this.codeEditor.setLayout(editorContainerWidth - 2, editorContainerHeight - 2);
        }
        if (this.rightContainer) {
            this.rightContainer.nativeElement.style.width = rigthContainerWidth + "px";
            this.rightContainer.nativeElement.style.height = functionContainaerHeight + "px";
        }
        if (this.bottomContainer) {
            this.bottomContainer.nativeElement.style.height = bottomContainerHeight + "px";
            this.bottomContainer.nativeElement.style.width = (editorContainerWidth + editorPadding * 2) + "px";
        }
        if (this.testDataEditor) {
            var widthDataEditor = rigthContainerWidth - 24;
            setTimeout(function () {
                if (_this.testDataEditor) {
                    _this.testDataEditor.setLayout(_this.rightTab ? widthDataEditor : 0, _this.isHttpFunction ? 230 : functionContainaerHeight / 2
                    //functionContainaerHeight / 2
                    );
                }
            }, 0);
        }
    };
    FunctionDevComponent.prototype.clickRightTab = function (tab) {
        var _this = this;
        if (tab === "logs") {
            if (this.bottomTab === tab) {
                this.bottomTab = "";
                this.expandLogs = false;
                if (this.runLogs) {
                    this.runLogs.compress();
                }
            }
            else {
                this.bottomTab = tab;
            }
        }
        else {
            this.rightTab = (this.rightTab === tab) ? "" : tab;
        }
        // double resize to fix pre heigth
        this.onResize();
        setTimeout(function () {
            _this.onResize();
        }, 0);
    };
    FunctionDevComponent.prototype.ngOnDestroy = function () {
        this.functionUpdate.unsubscribe();
        this.selectedFileStream.unsubscribe();
        this.functionSelectStream.unsubscribe();
        if (this.logStreamings) {
            this.logStreamings.toArray().forEach(function (ls) {
                ls.ngOnDestroy();
            });
        }
        FunctionDevComponent_1.rightTab = this.rightTab;
        FunctionDevComponent_1.bottomTab = this.bottomTab;
    };
    FunctionDevComponent.prototype.ngAfterContentInit = function () {
        this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.TutorialStep, {
            functionInfo: null,
            step: tutorial_1.TutorialStep.Develop
        });
    };
    FunctionDevComponent.prototype.setInvokeUrlVisibility = function () {
        if (this.functionInfo.config.bindings) {
            var b = this.functionInfo.config.bindings.find(function (b) {
                return b.type === binding_1.BindingType.httpTrigger.toString();
            });
            this.showFunctionInvokeUrl = b ? true : false;
        }
    };
    FunctionDevComponent.prototype.ngOnChanges = function (changes) {
        if (changes['selectedFunction']) {
            delete this.updatedTestContent;
            delete this.runResult;
            this.functionSelectStream.next(changes['selectedFunction'].currentValue);
        }
    };
    FunctionDevComponent.prototype.setFunctionKey = function (functionInfo) {
        var _this = this;
        if (functionInfo) {
            this.functionApp.getFunctionKeys(functionInfo)
                .subscribe(function (keys) {
                if (keys && keys.keys && keys.keys.length > 0) {
                    _this.functionKey = keys.keys.find(function (k) { return k.name === "default"; }).value || keys.keys[0].value;
                }
            });
        }
    };
    FunctionDevComponent.prototype.setFunctionInvokeUrl = function (key) {
        var _this = this;
        if (this.isHttpFunction) {
            var code = '';
            if (this.webHookType === 'github' || this.authLevel === 'anonymous') {
                code = '';
            }
            else if (key) {
                code = "?code=" + key;
            }
            else if (this.isHttpFunction && this.secrets && this.secrets.key) {
                code = "?code=" + this.secrets.key;
            }
            else if (this.isHttpFunction && this.functionApp.HostSecrets && !this._isClientCertEnabled) {
                code = "?code=" + this.functionApp.HostSecrets;
            }
            this.functionApp.getHostJson().subscribe(function (jsonObj) {
                var that = _this;
                var result = (jsonObj && jsonObj.http && jsonObj.http.routePrefix !== undefined && jsonObj.http.routePrefix !== null) ? jsonObj.http.routePrefix : 'api';
                var httpTrigger = _this.functionInfo.config.bindings.find(function (b) {
                    return b.type === binding_1.BindingType.httpTrigger.toString();
                });
                if (httpTrigger && httpTrigger.route) {
                    result = result + '/' + httpTrigger.route;
                }
                else {
                    result = result + '/' + _this.functionInfo.name;
                }
                // Remove doubled slashes
                var path = '/' + result;
                var find = '//';
                var re = new RegExp(find, 'g');
                path = path.replace(re, '/');
                path = path.replace('/?', '?') + code;
                _this.functionInvokeUrl = _this.functionApp.getMainSiteUrl() + path;
                _this.runValid = true;
            });
        }
        else {
            this.runValid = true;
        }
    };
    FunctionDevComponent.prototype.saveScript = function (dontClearBusy) {
        var _this = this;
        // Only save if the file is dirty
        if (!this.scriptFile.isDirty) {
            return;
        }
        var syncTriggers = false;
        if (this.scriptFile.href.toLocaleLowerCase() === this.functionInfo.config_href.toLocaleLowerCase()) {
            try {
                JSON.parse(this.updatedContent);
                this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.errorParsingConfig);
                syncTriggers = true;
            }
            catch (e) {
                this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: this._translateService.instant(portal_resources_1.PortalResources.errorParsingConfig, { error: e }),
                    errorId: error_ids_1.ErrorIds.errorParsingConfig,
                    errorType: error_event_1.ErrorType.UserError
                });
                return;
            }
        }
        this._globalStateService.setBusyState();
        if (this.scriptFile.name.toLowerCase() === "function.json") {
            this.functionInfo.config = JSON.parse(this.updatedContent);
        }
        return this.functionApp.saveFile(this.scriptFile, this.updatedContent, this.functionInfo)
            .subscribe(function (r) {
            if (!dontClearBusy) {
                _this._globalStateService.clearBusyState();
            }
            if (typeof r !== 'string' && r.isDirty) {
                r.isDirty = false;
                _this._broadcastService.clearDirtyState('function');
                _this._portalService.setDirtyState(false);
            }
            _this.content = _this.updatedContent;
            if (syncTriggers) {
                _this.functionApp.fireSyncTrigger();
            }
        });
    };
    FunctionDevComponent.prototype.contentChanged = function (content) {
        if (!this.scriptFile.isDirty) {
            this.scriptFile.isDirty = true;
            this._broadcastService.setDirtyState('function');
            this._portalService.setDirtyState(true);
        }
        this.updatedContent = content;
    };
    FunctionDevComponent.prototype.testContentChanged = function (content) {
        this.updatedTestContent = content;
    };
    FunctionDevComponent.prototype.saveTestData = function () {
        var _this = this;
        var test_data = this.getTestData();
        if (this.functionInfo.test_data !== test_data) {
            this.functionInfo.test_data = test_data;
            this.functionApp.updateFunction(this.functionInfo)
                .subscribe(function (r) {
                Object.assign(_this.functionInfo, r);
                if (_this.updatedTestContent) {
                    _this.testContent = _this.updatedTestContent;
                }
            });
        }
    };
    FunctionDevComponent.prototype.runFunction = function () {
        var _this = this;
        if (!this.runValid) {
            return;
        }
        var resizeNeeded = false;
        if (this.bottomTab !== "logs") {
            this.bottomTab = "logs";
            resizeNeeded = true;
        }
        if (this.rightTab !== "run") {
            this.rightTab = "run";
            resizeNeeded = true;
        }
        if (resizeNeeded) {
            setTimeout(function () {
                _this.onResize();
            });
        }
        this._globalStateService.setBusyState();
        this.saveTestData();
        if (this.runHttp) {
            if (!this.runHttp.valid) {
                this._globalStateService.clearBusyState();
                this.runValid = false;
                return;
            }
            if (this.httpRunLogs) {
                this.httpRunLogs.clearLogs();
            }
            this.runFunctionInternal();
        }
        else {
            this.runFunctionInternal();
        }
    };
    FunctionDevComponent.prototype.cancelCurrentRun = function () {
        this._globalStateService.clearBusyState();
        if (this.running) {
            this.running.unsubscribe();
            delete this.running;
        }
    };
    FunctionDevComponent.prototype.checkErrors = function (functionInfo) {
        var _this = this;
        this.functionApp.getFunctionErrors(functionInfo)
            .subscribe(function (errors) {
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.generalFunctionErrorFromHost + functionInfo.name);
            // Give clearing a chance to run
            setTimeout(function () {
                if (errors) {
                    errors.forEach(function (e) {
                        _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                            message: _this._translateService.instant(portal_resources_1.PortalResources.functionDev_functionErrorMessage, { name: functionInfo.name, error: e }),
                            details: _this._translateService.instant(portal_resources_1.PortalResources.functionDev_functionErrorDetails, { error: e }),
                            errorId: error_ids_1.ErrorIds.generalFunctionErrorFromHost + functionInfo.name,
                            errorType: error_event_1.ErrorType.FunctionError
                        });
                        _this._aiService.trackEvent(error_ids_1.ErrorIds.generalFunctionErrorFromHost, { error: e, functionName: functionInfo.name, functionConfig: JSON.stringify(functionInfo.config) });
                    });
                }
                else {
                    _this.functionApp.getHostErrors()
                        .subscribe(function (hostErrors) {
                        _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.generalHostErrorFromHost);
                        // Give clearing a chance to run
                        setTimeout(function () {
                            hostErrors.forEach(function (e) {
                                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                                    message: _this._translateService.instant(portal_resources_1.PortalResources.functionDev_hostErrorMessage, { error: e }),
                                    details: _this._translateService.instant(portal_resources_1.PortalResources.functionDev_hostErrorMessage, { error: e }),
                                    errorId: error_ids_1.ErrorIds.generalHostErrorFromHost,
                                    errorType: error_event_1.ErrorType.RuntimeError
                                });
                                _this._aiService.trackEvent('/errors/host', { error: e, app: _this._globalStateService.FunctionContainer.id });
                            });
                        });
                    });
                }
            });
        });
    };
    Object.defineProperty(FunctionDevComponent.prototype, "codeEditor", {
        get: function () {
            return this.getMonacoDirective("code");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDevComponent.prototype, "testDataEditor", {
        get: function () {
            return this.getMonacoDirective("test_data");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDevComponent.prototype, "runLogs", {
        get: function () {
            if (!this.logStreamings) {
                return null;
            }
            return this.logStreamings.toArray().find(function (l) {
                return l.isHttpLogs !== true;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDevComponent.prototype, "httpRunLogs", {
        get: function () {
            if (!this.logStreamings) {
                return null;
            }
            return this.logStreamings.toArray().find(function (l) {
                return l.isHttpLogs === true;
            });
        },
        enumerable: true,
        configurable: true
    });
    FunctionDevComponent.prototype.onRunValid = function (runValid) {
        this.runValid = runValid && this.functionInvokeUrl !== this._translateService.instant(portal_resources_1.PortalResources.functionDev_loading);
    };
    FunctionDevComponent.prototype.setShowFunctionInvokeUrlModal = function (value) {
        this.showFunctionInvokeUrlModal = value;
    };
    FunctionDevComponent.prototype.setShowFunctionKeyModal = function (value) {
        this.showFunctionKeyModal = value;
    };
    FunctionDevComponent.prototype.hideModal = function () {
        this.showFunctionKeyModal = false;
        this.showFunctionInvokeUrlModal = false;
    };
    FunctionDevComponent.prototype.onDisableTestData = function (disableTestData) {
        this.testDataEditor.disabled = disableTestData;
    };
    FunctionDevComponent.prototype.onChangeKey = function (key) {
        this.setFunctionInvokeUrl(key);
        this.setFunctionKey(this.functionInfo);
    };
    FunctionDevComponent.prototype.getTestData = function () {
        if (this.runHttp) {
            this.runHttp.model.body = this.updatedTestContent !== undefined ? this.updatedTestContent : this.runHttp.model.body;
            // remove "code" param fix
            var clonedModel = JSON.parse(JSON.stringify(this.runHttp.model));
            var codeIndex = clonedModel.queryStringParams.findIndex(function (p) { return p.name === 'code'; });
            if (codeIndex > -1) {
                clonedModel.queryStringParams.splice(codeIndex, 1);
            }
            return JSON.stringify(clonedModel);
        }
        else {
            return this.updatedTestContent !== undefined ? this.updatedTestContent : this.functionInfo.test_data;
        }
    };
    FunctionDevComponent.prototype.getMonacoDirective = function (id) {
        if (!this.monacoEditors) {
            return null;
        }
        return this.monacoEditors.toArray().find(function (e) {
            return e.elementRef.nativeElement.id === id;
        });
    };
    FunctionDevComponent.prototype.runFunctionInternal = function () {
        var _this = this;
        if (this.scriptFile.isDirty) {
            this.saveScript().add(function () { return setTimeout(function () { return _this.runFunction(); }, 1000); });
        }
        else {
            var testData = this.getTestData();
            var result = (this.runHttp) ? this.functionApp.runHttpFunction(this.functionInfo, this.functionInvokeUrl, this.runHttp.model) :
                this.functionApp.runFunction(this.functionInfo, this.getTestData());
            this.running = result.subscribe(function (r) {
                _this.runResult = r;
                _this._globalStateService.clearBusyState();
                delete _this.running;
                if (_this.runResult.statusCode >= 400) {
                    _this.checkErrors(_this.functionInfo);
                }
            }, function (error) { return _this._globalStateService.clearBusyState(); });
        }
    };
    FunctionDevComponent.prototype.updateKeys = function () {
        var _this = this;
        if (this.functionApp && this.functionInfo) {
            Observable_1.Observable.zip(this.functionApp.getFunctionKeys(this.functionInfo), this.functionApp.getFunctionHostKeys(), function (k1, k2) { return ({ functionKeys: k1, hostKeys: k2 }); })
                .subscribe(function (r) {
                _this.functionKeys = r.functionKeys || [];
                _this.hostKeys = r.hostKeys || [];
                if (_this.authLevel && _this.authLevel.toLowerCase() === "admin") {
                    var masterKey = r.hostKeys.keys.find(function (k) { return k.name === "_master"; });
                    if (masterKey) {
                        _this.onChangeKey(masterKey.value);
                    }
                }
                else {
                    var allKeys = r.functionKeys.keys.concat(_this.hostKeys.keys);
                    if (allKeys.length > 0) {
                        _this.onChangeKey(allKeys[0].value);
                    }
                }
            });
        }
    };
    return FunctionDevComponent;
}());
__decorate([
    core_1.ViewChild(file_explorer_component_1.FileExplorerComponent),
    __metadata("design:type", file_explorer_component_1.FileExplorerComponent)
], FunctionDevComponent.prototype, "fileExplorer", void 0);
__decorate([
    core_1.ViewChild(run_http_component_1.RunHttpComponent),
    __metadata("design:type", run_http_component_1.RunHttpComponent)
], FunctionDevComponent.prototype, "runHttp", void 0);
__decorate([
    core_1.ViewChildren(busy_state_component_1.BusyStateComponent),
    __metadata("design:type", core_1.QueryList)
], FunctionDevComponent.prototype, "BusyStates", void 0);
__decorate([
    core_1.ViewChildren(monaco_editor_directive_1.MonacoEditorDirective),
    __metadata("design:type", core_1.QueryList)
], FunctionDevComponent.prototype, "monacoEditors", void 0);
__decorate([
    core_1.ViewChildren(log_streaming_component_1.LogStreamingComponent),
    __metadata("design:type", core_1.QueryList)
], FunctionDevComponent.prototype, "logStreamings", void 0);
__decorate([
    core_1.ViewChild('functionContainer'),
    __metadata("design:type", core_1.ElementRef)
], FunctionDevComponent.prototype, "functionContainer", void 0);
__decorate([
    core_1.ViewChild('editorContainer'),
    __metadata("design:type", core_1.ElementRef)
], FunctionDevComponent.prototype, "editorContainer", void 0);
__decorate([
    core_1.ViewChild('rightContainer'),
    __metadata("design:type", core_1.ElementRef)
], FunctionDevComponent.prototype, "rightContainer", void 0);
__decorate([
    core_1.ViewChild('bottomContainer'),
    __metadata("design:type", core_1.ElementRef)
], FunctionDevComponent.prototype, "bottomContainer", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FunctionDevComponent.prototype, "selectedFunction", void 0);
FunctionDevComponent = FunctionDevComponent_1 = __decorate([
    core_1.Component({
        selector: 'function-dev',
        templateUrl: './function-dev.component.html',
        styleUrls: ['./function-dev.component.scss']
    }),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        ai_service_1.AiService,
        core_1.ElementRef,
        config_service_1.ConfigService])
], FunctionDevComponent);
exports.FunctionDevComponent = FunctionDevComponent;
var FunctionDevComponent_1;
//# sourceMappingURL=function-dev.component.js.map