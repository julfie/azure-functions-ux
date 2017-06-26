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
var slots_service_1 = require("app/shared/services/slots.service");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Subject_1 = require("rxjs/Subject");
var core_2 = require("@ngx-translate/core");
var config_service_1 = require("./../shared/services/config.service");
var cache_service_1 = require("./../shared/services/cache.service");
var authz_service_1 = require("./../shared/services/authz.service");
var language_service_1 = require("./../shared/services/language.service");
var arm_service_1 = require("./../shared/services/arm.service");
var function_app_1 = require("./../shared/function-app");
var error_ids_1 = require("./../shared/models/error-ids");
var functions_service_1 = require("../shared/services/functions.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var user_service_1 = require("../shared/services/user.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var binding_manager_1 = require("../shared/models/binding-manager");
var error_event_1 = require("../shared/models/error-event");
var global_state_service_1 = require("../shared/services/global-state.service");
var busy_state_component_1 = require("../busy-state/busy-state.component");
var portal_resources_1 = require("../shared/models/portal-resources");
var ai_service_1 = require("../shared/services/ai.service");
var TryLandingComponent = (function () {
    function TryLandingComponent(_httpService, _functionsService, _broadcastService, _globalStateService, _userService, _translateService, _aiService, _armService, _cacheService, _languageService, _authZService, _configService, _slotsService) {
        this._httpService = _httpService;
        this._functionsService = _functionsService;
        this._broadcastService = _broadcastService;
        this._globalStateService = _globalStateService;
        this._userService = _userService;
        this._translateService = _translateService;
        this._aiService = _aiService;
        this._armService = _armService;
        this._cacheService = _cacheService;
        this._languageService = _languageService;
        this._authZService = _authZService;
        this._configService = _configService;
        this._slotsService = _slotsService;
        this.functionsInfo = new Array();
        this.bc = new binding_manager_1.BindingManager();
        this.loginOptions = false;
        this.tryFunctionApp = new Subject_1.Subject();
    }
    TryLandingComponent.prototype.ngOnInit = function () {
        var _this = this;
        //Disabling this temporarily. Somehow ngOnInit gets called twice on refresh
        //possibly related to https://github.com/angular/angular/issues/6782
        //and strangely the clearbusystate doesnt get called.
        //this.setBusyState();
        this.selectedFunction = this._functionsService.selectedFunction || 'HttpTrigger';
        this.selectedLanguage = this._functionsService.selectedLanguage || 'CSharp';
        this._functionsService.getTemplates().subscribe(function (templates) {
            if (_this._globalStateService.TryAppServiceToken) {
                var selectedTemplate = templates.find(function (t) {
                    return t.id === _this.selectedFunction + "-" + _this.selectedLanguage;
                });
                if (selectedTemplate) {
                    _this.setBusyState();
                    _this._functionsService.createTrialResource(selectedTemplate, _this._functionsService.selectedProvider, _this._functionsService.selectedFunctionName)
                        .subscribe(function (resource) {
                        _this.clearBusyState();
                        _this.createFunctioninResource(resource, selectedTemplate, _this._functionsService.selectedFunctionName);
                    }, function (error) {
                        if (error.status === 400) {
                            // If there is already a free resource assigned ,
                            // we'll get a HTTP 400 ..so lets get it.
                            _this._functionsService.getTrialResource(_this._functionsService.selectedProvider)
                                .subscribe(function (resource) {
                                _this.createFunctioninResource(resource, selectedTemplate, _this._functionsService.selectedFunctionName);
                            });
                        }
                        else {
                            _this.clearBusyState();
                        }
                    });
                }
            }
        });
        var result = {
            name: this._translateService.instant(portal_resources_1.PortalResources.sideBar_newFunction),
            href: null,
            config: null,
            script_href: null,
            template_id: null,
            clientOnly: true,
            isDeleted: false,
            secrets_file_href: null,
            test_data: null,
            script_root_path_href: null,
            config_href: null,
            functionApp: null
        };
        this.functionsInfo.push(result);
    };
    TryLandingComponent.prototype.onFunctionClicked = function (selectedFunction) {
        if (!this._broadcastService.getDirtyState("function_disabled")) {
            this.selectedFunction = selectedFunction;
        }
    };
    TryLandingComponent.prototype.onLanguageClicked = function (selectedLanguage) {
        if (!this._broadcastService.getDirtyState("function_disabled")) {
            this.selectedLanguage = selectedLanguage;
        }
    };
    TryLandingComponent.prototype.handleLoginClick = function (provider) {
        var _this = this;
        this._functionsService.getTemplates().subscribe(function (templates) {
            var selectedTemplate = templates.find(function (t) {
                return t.id === _this.selectedFunction + "-" + _this.selectedLanguage;
            });
            if (provider === '') {
                //clicked on "Create this Function" button
                _this.loginOptions = true;
            }
            else if (selectedTemplate) {
                try {
                    var functionName = binding_manager_1.BindingManager.getFunctionName(selectedTemplate.metadata.defaultFunctionName, _this.functionsInfo);
                    _this.bc.setDefaultValues(selectedTemplate.function.bindings, _this._globalStateService.DefaultStorageAccount);
                    _this.setBusyState();
                    //login
                    //get trial account
                    _this._functionsService.createTrialResource(selectedTemplate, provider, functionName)
                        .subscribe(function (resource) {
                        _this.clearBusyState();
                        _this.createFunctioninResource(resource, selectedTemplate, functionName);
                    }, function (error) {
                        if (error.status === 401 || error.status === 403) {
                            //show login options
                            var headerObject = JSON.parse(JSON.stringify(error.headers))["LoginUrl"];
                            if (provider !== "" && headerObject && headerObject[0]) {
                                window.location = headerObject[0];
                                return;
                            }
                            else {
                                _this.loginOptions = true;
                            }
                            _this.clearBusyState();
                        }
                        else if (error.status === 400) {
                            _this._functionsService.getTrialResource(provider)
                                .subscribe(function (resource) {
                                _this.createFunctioninResource(resource, selectedTemplate, functionName);
                            });
                        }
                        else {
                            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                                message: "" + _this._translateService.instant(portal_resources_1.PortalResources.tryLanding_functionError),
                                details: _this._translateService.instant(portal_resources_1.PortalResources.tryLanding_functionErrorDetails) + ": " + JSON.stringify(error),
                                errorId: error_ids_1.ErrorIds.tryAppServiceError,
                                errorType: error_event_1.ErrorType.Warning,
                                resourceId: 'try-app'
                            });
                            _this.clearBusyState();
                            throw error;
                        }
                        _this.clearBusyState();
                    });
                }
                catch (e) {
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                        message: "" + _this._translateService.instant(portal_resources_1.PortalResources.tryLanding_functionError),
                        details: _this._translateService.instant(portal_resources_1.PortalResources.tryLanding_functionErrorDetails) + ": " + JSON.stringify(e),
                        errorId: error_ids_1.ErrorIds.tryAppServiceError,
                        errorType: error_event_1.ErrorType.Warning,
                        resourceId: 'try-app'
                    });
                    throw e;
                }
            }
        });
    };
    TryLandingComponent.prototype.createFunctioninResource = function (resource, selectedTemplate, functionName) {
        var _this = this;
        var scmUrl = resource.gitUrl.substring(0, resource.gitUrl.lastIndexOf('/'));
        var encryptedCreds = btoa(scmUrl.substring(8, scmUrl.indexOf('@')));
        // TODO: find a better way to handle this
        var tryfunctionContainer = {
            id: resource.csmId,
            name: resource.csmId.substring(resource.csmId.lastIndexOf('/') + 1, resource.csmId.length),
            type: "Microsoft.Web/sites",
            kind: "functionapp",
            location: "West US",
            properties: {
                state: "Running",
                hostNames: null,
                hostNameSslStates: [
                    {
                        name: (resource.csmId.substring(resource.csmId.lastIndexOf('/') + 1, resource.csmId.length) + ".scm.azurewebsites.net"),
                        hostType: 1
                    },
                    {
                        name: (resource.csmId.substring(resource.csmId.lastIndexOf('/') + 1, resource.csmId.length) + ".azurewebsites.net"),
                        hostType: 0
                    }
                ],
                sku: "Free",
                containerSize: 128,
                serverFarmId: null,
                enabled: true,
                defaultHostName: (resource.csmId.substring(resource.csmId.lastIndexOf('/') + 1, resource.csmId.length) + ".azurewebsites.net")
            },
            tryScmCred: encryptedCreds
        };
        this._functionApp = new function_app_1.FunctionApp(tryfunctionContainer, this._httpService, this._userService, this._globalStateService, this._translateService, this._broadcastService, this._armService, this._cacheService, this._languageService, this._authZService, this._aiService, this._configService, this._slotsService);
        this._armService.tryFunctionApp = this._functionApp;
        this._userService.setTryUserName(resource.userName);
        this.setBusyState();
        // this._functionApp.getFunctionContainerAppSettings(tryfunctionContainer)
        // .subscribe(a => {
        //     this._globalStateService.AppSettings = a;
        // });
        this._functionApp.createFunctionV2(functionName, selectedTemplate.files, selectedTemplate.function)
            .subscribe(function (res) {
            _this.clearBusyState();
            _this._aiService.trackEvent("new-function", { template: selectedTemplate.id, result: "success", first: "true" });
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.FunctionAdded, res);
            _this.tryFunctionApp.next(_this._functionApp);
        }, function (e) {
            _this.clearBusyState();
            _this._aiService.trackEvent("new-function", { template: selectedTemplate.id, result: "failed", first: "true" });
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                message: "" + _this._translateService.instant(portal_resources_1.PortalResources.tryLanding_functionError),
                details: _this._translateService.instant(portal_resources_1.PortalResources.tryLanding_functionErrorDetails) + ": " + JSON.stringify(e),
                errorId: error_ids_1.ErrorIds.tryAppServiceError,
                errorType: error_event_1.ErrorType.Warning,
                resourceId: 'try-app'
            });
        });
    };
    TryLandingComponent.prototype.setBusyState = function () {
        if (this.busyState) {
            this.busyState.setBusyState();
        }
    };
    TryLandingComponent.prototype.clearBusyState = function () {
        if (this.busyState) {
            this.busyState.clearBusyState();
        }
    };
    return TryLandingComponent;
}());
__decorate([
    core_1.ViewChild(busy_state_component_1.BusyStateComponent),
    __metadata("design:type", busy_state_component_1.BusyStateComponent)
], TryLandingComponent.prototype, "busyState", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Subject_1.Subject)
], TryLandingComponent.prototype, "tryFunctionApp", void 0);
TryLandingComponent = __decorate([
    core_1.Component({
        selector: 'try-landing',
        templateUrl: './try-landing.component.html',
        styleUrls: ['./try-landing.component.scss']
    }),
    __metadata("design:paramtypes", [http_1.Http,
        functions_service_1.FunctionsService,
        broadcast_service_1.BroadcastService,
        global_state_service_1.GlobalStateService,
        user_service_1.UserService,
        core_2.TranslateService,
        ai_service_1.AiService,
        arm_service_1.ArmService,
        cache_service_1.CacheService,
        language_service_1.LanguageService,
        authz_service_1.AuthzService,
        config_service_1.ConfigService,
        slots_service_1.SlotsService])
], TryLandingComponent);
exports.TryLandingComponent = TryLandingComponent;
//# sourceMappingURL=try-landing.component.js.map