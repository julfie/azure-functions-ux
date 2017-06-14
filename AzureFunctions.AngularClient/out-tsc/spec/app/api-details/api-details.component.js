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
var global_state_service_1 = require("../shared/services/global-state.service");
var core_2 = require("@ngx-translate/core");
var api_proxy_1 = require("../shared/models/api-proxy");
var forms_1 = require("@angular/forms");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var api_new_component_1 = require("../api-new/api-new.component");
var constants_1 = require("../shared/models/constants");
var ApiDetailsComponent = (function () {
    function ApiDetailsComponent(_fb, _globalStateService, _translateService, _broadcastService) {
        this._fb = _fb;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._broadcastService = _broadcastService;
        this.isMethodsVisible = false;
        this.initComplexFrom();
    }
    Object.defineProperty(ApiDetailsComponent.prototype, "viewInfoInput", {
        set: function (viewInfoInput) {
            var _this = this;
            this._globalStateService.setBusyState();
            this.selectedNode = viewInfoInput.node;
            this.proxiesNode = this.selectedNode.parent;
            this.functionApp = this.proxiesNode.functionApp;
            this.apiProxyEdit = this.selectedNode.proxy;
            this.initEdit();
            this.functionApp.getApiProxies()
                .subscribe(function (proxies) {
                _this._globalStateService.clearBusyState();
                _this.apiProxies = proxies;
            });
            this.appNode = this.proxiesNode.parent;
            var cacherService = this.appNode.sideNav.cacheService;
            cacherService.postArm(this.functionApp.site.id + "/config/appsettings/list").subscribe((function (r) {
                var appSettings = r.json();
                var routingVersion = appSettings.properties[constants_1.Constants.routingExtensionVersionAppSettingName];
                _this.isEnabled = (routingVersion && (routingVersion !== constants_1.Constants.disabled));
            }));
        },
        enumerable: true,
        configurable: true
    });
    ApiDetailsComponent.prototype.onFunctionAppSettingsClicked = function (event) {
        this.proxiesNode.parent.openSettings();
    };
    ApiDetailsComponent.prototype.initEdit = function () {
        this.complexForm.patchValue({
            backendUri: this.apiProxyEdit.backendUri,
            routeTemplate: this.apiProxyEdit.matchCondition.route,
            methodSelectionType: !this.apiProxyEdit.matchCondition.methods || this.apiProxyEdit.matchCondition.methods.length === 0 ? "All" : "Selected",
        });
        var route = (this.apiProxyEdit.matchCondition.route) ? this.apiProxyEdit.matchCondition.route : '/api/' + this.apiProxyEdit.name;
        if (!route.startsWith('/')) {
            route = '/' + route;
        }
        this.proxyUrl = "https://" + this.functionApp.site.properties.hostNameSslStates.find(function (s) { return s.hostType === 0; }).name + route;
        var methods = {};
        methods["method_GET"] = false;
        methods["method_POST"] = false;
        methods["method_DELETE"] = false;
        methods["method_HEAD"] = false;
        methods["method_PATCH"] = false;
        methods["method_PUT"] = false;
        methods["method_OPTIONS"] = false;
        methods["method_TRACE"] = false;
        if (this.apiProxyEdit.matchCondition.methods) {
            this.apiProxyEdit.matchCondition.methods.forEach(function (m) {
                methods["method_" + m.toUpperCase()] = true;
            });
            this.complexForm.patchValue(methods);
        }
    };
    ApiDetailsComponent.prototype.ngOnInit = function () {
    };
    ApiDetailsComponent.prototype.deleteProxyClicked = function () {
        var _this = this;
        this._globalStateService.setBusyState();
        this.functionApp.getApiProxies().subscribe(function (proxies) {
            _this.apiProxies = proxies;
            var indexToDelete = _this.apiProxies.findIndex(function (p) {
                return p.name === _this.apiProxyEdit.name;
            });
            _this.apiProxies.splice(indexToDelete, 1);
            _this.functionApp.saveApiProxy(api_proxy_1.ApiProxy.toJson(_this.apiProxies, _this._translateService)).subscribe(function () {
                _this._globalStateService.clearBusyState();
                //this._broadcastService.broadcast(BroadcastEvent.ApiProxyDeleted, this.apiProxyEdit);
                _this.proxiesNode.removeChild(_this.apiProxyEdit);
            });
        });
    };
    ApiDetailsComponent.prototype.onCancelClick = function () {
        this.apiProxyEdit = this.apiProxyEdit;
    };
    ApiDetailsComponent.prototype.onReset = function () {
        this.initComplexFrom();
        this.initEdit();
        this._broadcastService.clearDirtyState('api-proxy', true);
    };
    ApiDetailsComponent.prototype.submitForm = function (value) {
        var _this = this;
        if (this.complexForm.valid) {
            this._globalStateService.setBusyState();
            this.apiProxyEdit.backendUri = this.complexForm.controls["backendUri"].value;
            this.apiProxyEdit.matchCondition.route = this.complexForm.controls["routeTemplate"].value;
            this.apiProxyEdit.matchCondition.methods = [];
            this.functionApp.getApiProxies().subscribe(function (proxies) {
                _this.apiProxies = proxies;
                var index = _this.apiProxies.findIndex(function (p) {
                    return p.name === _this.apiProxyEdit.name;
                });
                if (index > -1) {
                    if (_this.complexForm.controls["methodSelectionType"].value !== "All") {
                        for (var control in _this.complexForm.controls) {
                            if (control.startsWith("method_")) {
                                if (_this.complexForm.controls[control].value) {
                                    _this.apiProxyEdit.matchCondition.methods.push(control.replace("method_", "").toUpperCase());
                                }
                            }
                        }
                    }
                    _this.apiProxies[index] = _this.apiProxyEdit;
                }
                _this.functionApp.saveApiProxy(api_proxy_1.ApiProxy.toJson(_this.apiProxies, _this._translateService)).subscribe(function () {
                    _this._globalStateService.clearBusyState();
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ApiProxyUpdated, _this.apiProxyEdit);
                    _this.onReset();
                });
            });
        }
    };
    ApiDetailsComponent.prototype.initComplexFrom = function () {
        var _this = this;
        this.complexForm = this._fb.group({
            routeTemplate: [null, forms_1.Validators.required],
            methodSelectionType: 'All',
            backendUri: [null, forms_1.Validators.compose([forms_1.Validators.required, api_new_component_1.ApiNewComponent.validateUrl()])],
            proxyUrl: '',
            method_GET: false,
            method_POST: false,
            method_DELETE: false,
            method_HEAD: false,
            method_PATCH: false,
            method_PUT: false,
            method_OPTIONS: false,
            method_TRACE: false
        });
        this.complexForm.controls["methodSelectionType"].valueChanges.subscribe(function (value) {
            _this.isMethodsVisible = !(value === 'All');
        });
        this.complexForm.valueChanges.subscribe(function () {
            if (_this.complexForm.dirty) {
                _this._broadcastService.setDirtyState('api-proxy');
            }
        });
        //this.isEnabled = this._globalStateService.IsRoutingEnabled;
    };
    return ApiDetailsComponent;
}());
ApiDetailsComponent = __decorate([
    core_1.Component({
        selector: 'api-details',
        templateUrl: './api-details.component.html',
        styleUrls: ['../api-new/api-new.component.scss', '../binding-input/binding-input.component.css'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        broadcast_service_1.BroadcastService])
], ApiDetailsComponent);
exports.ApiDetailsComponent = ApiDetailsComponent;
//# sourceMappingURL=api-details.component.js.map