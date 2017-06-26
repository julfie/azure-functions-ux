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
require("rxjs/add/operator/do");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
var core_2 = require("@ngx-translate/core");
var local_storage_service_1 = require("./../shared/services/local-storage.service");
var ai_service_1 = require("./../shared/services/ai.service");
var functions_service_1 = require("../shared/services/functions.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var portal_service_1 = require("../shared/services/portal.service");
var binding_manager_1 = require("../shared/models/binding-manager");
var error_event_1 = require("../shared/models/error-event");
var global_state_service_1 = require("../shared/services/global-state.service");
var portal_resources_1 = require("../shared/models/portal-resources");
var error_ids_1 = require("../shared/models/error-ids");
var dashboard_type_1 = require("../tree-view/models/dashboard-type");
var FunctionQuickstartComponent = (function () {
    function FunctionQuickstartComponent(_functionsService, _broadcastService, _portalService, _globalStateService, _translateService, _aiService, _localStorageService) {
        var _this = this;
        this._functionsService = _functionsService;
        this._broadcastService = _broadcastService;
        this._portalService = _portalService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._aiService = _aiService;
        this._localStorageService = _localStorageService;
        this.bc = new binding_manager_1.BindingManager();
        this._viewInfoStream = new Subject_1.Subject();
        this.selectedFunction = "HttpTrigger";
        this.selectedLanguage = "CSharp";
        this._viewInfoStream
            .switchMap(function (viewInfo) {
            _this._globalStateService.setBusyState();
            _this.functionsNode = viewInfo.node;
            _this.functionApp = _this.functionsNode.functionApp;
            return _this.functionApp.getFunctions();
        })
            .do(null, function (e) {
            _this._aiService.trackException(e, '/errors/function-quickstart');
            console.error(e);
        })
            .retry()
            .subscribe(function (fcs) {
            _this._globalStateService.clearBusyState();
            _this.functionsInfo = fcs;
        });
    }
    Object.defineProperty(FunctionQuickstartComponent.prototype, "viewInfoInput", {
        set: function (viewInfoInput) {
            this._viewInfoStream.next(viewInfoInput);
        },
        enumerable: true,
        configurable: true
    });
    FunctionQuickstartComponent.prototype.onFunctionCliked = function (selectedFunction) {
        if (!this._broadcastService.getDirtyState("function_disabled")) {
            this.selectedFunction = selectedFunction;
        }
    };
    FunctionQuickstartComponent.prototype.onLanguageCliked = function (selectedLanguage) {
        if (!this._broadcastService.getDirtyState("function_disabled")) {
            this.selectedLanguage = selectedLanguage;
        }
    };
    FunctionQuickstartComponent.prototype.onCreateNewFunction = function () {
        var _this = this;
        if (this._globalStateService.IsBusy) {
            return;
        }
        this._globalStateService.setBusyState();
        this.functionApp.getTemplates().subscribe(function (templates) {
            var selectedTemplate = templates.find(function (t) {
                return t.id === _this.selectedFunction + "-" + _this.selectedLanguage;
            });
            if (selectedTemplate) {
                try {
                    var functionName = binding_manager_1.BindingManager.getFunctionName(selectedTemplate.metadata.defaultFunctionName, _this.functionsInfo);
                    _this._portalService.logAction('intro-create-from-template', 'creating', { template: selectedTemplate.id, name: functionName });
                    _this.bc.setDefaultValues(selectedTemplate.function.bindings, _this._globalStateService.DefaultStorageAccount);
                    _this.functionApp.createFunctionV2(functionName, selectedTemplate.files, selectedTemplate.function)
                        .subscribe(function (res) {
                        _this._portalService.logAction('intro-create-from-template', 'success', { template: selectedTemplate.id, name: functionName });
                        _this.functionsNode.addChild(res);
                        //this._broadcastService.broadcast<TutorialEvent>(
                        //    BroadcastEvent.TutorialStep,
                        //    {
                        //        functionInfo: res,
                        //        step: TutorialStep.Waiting
                        //    });
                        //this._broadcastService.broadcast(BroadcastEvent.FunctionAdded, res);
                        _this._globalStateService.clearBusyState();
                    }, function (e) {
                        _this._globalStateService.clearBusyState();
                    });
                }
                catch (e) {
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                        message: _this._translateService.instant(portal_resources_1.PortalResources.functionCreateErrorMessage),
                        details: _this._translateService.instant(portal_resources_1.PortalResources.functionCreateErrorDetails, { error: JSON.stringify(e) }),
                        errorId: error_ids_1.ErrorIds.unableToCreateFunction,
                        errorType: error_event_1.ErrorType.UserError,
                        resourceId: _this.functionApp.site.id
                    });
                    _this._aiService.trackEvent(error_ids_1.ErrorIds.unableToCreateFunction, {
                        exception: e
                    });
                    throw e;
                }
            }
            else {
                _this._globalStateService.clearBusyState();
            }
        });
    };
    FunctionQuickstartComponent.prototype.createFromScratch = function () {
        var functionsNode = this.functionsNode;
        functionsNode.openCreateDashboard(dashboard_type_1.DashboardType.createFunction);
    };
    FunctionQuickstartComponent.prototype.startFromSC = function () {
        this._portalService.openBlade({
            detailBlade: "ContinuousDeploymentListBlade",
            detailBladeInputs: {
                id: this.functionApp.site.id,
                ResourceId: this.functionApp.site.id
            }
        }, "intro");
    };
    return FunctionQuickstartComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], FunctionQuickstartComponent.prototype, "functionsInfo", void 0);
FunctionQuickstartComponent = __decorate([
    core_1.Component({
        selector: 'function-quickstart',
        templateUrl: './function-quickstart.component.html',
        styleUrls: ['./function-quickstart.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [functions_service_1.FunctionsService,
        broadcast_service_1.BroadcastService,
        portal_service_1.PortalService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        ai_service_1.AiService,
        local_storage_service_1.LocalStorageService])
], FunctionQuickstartComponent);
exports.FunctionQuickstartComponent = FunctionQuickstartComponent;
//# sourceMappingURL=function-quickstart.component.js.map