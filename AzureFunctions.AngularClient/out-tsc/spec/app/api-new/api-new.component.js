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
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/do");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
var constants_1 = require("./../shared/models/constants");
var cache_service_1 = require("./../shared/services/cache.service");
var ai_service_1 = require("./../shared/services/ai.service");
var api_proxy_1 = require("../shared/models/api-proxy");
var forms_1 = require("@angular/forms");
var global_state_service_1 = require("../shared/services/global-state.service");
var portal_resources_1 = require("../shared/models/portal-resources");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var error_event_1 = require("../shared/models/error-event");
var error_ids_1 = require("../shared/models/error-ids");
var ApiNewComponent = ApiNewComponent_1 = (function () {
    function ApiNewComponent(fb, _globalStateService, _translateService, _broadcastService, _aiService, _cacheService) {
        var _this = this;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._broadcastService = _broadcastService;
        this._aiService = _aiService;
        this._cacheService = _cacheService;
        this.isMethodsVisible = false;
        this._viewInfoStream = new Subject_1.Subject();
        this.complexForm = fb.group({
            // We can set default values by passing in the corresponding value or leave blank if we wish to not set the value. For our example, we�ll default the gender to female.
            routeTemplate: [null, forms_1.Validators.required],
            methodSelectionType: 'All',
            name: [null, forms_1.Validators.compose([forms_1.Validators.required, this.validateName(this)])],
            backendUri: [null, forms_1.Validators.compose([forms_1.Validators.required, ApiNewComponent_1.validateUrl()])],
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
        this._viewInfoStream
            .switchMap(function (viewInfo) {
            _this._globalStateService.setBusyState();
            _this._proxiesNode = viewInfo.node;
            _this.functionApp = _this._proxiesNode.functionApp;
            _this.appNode = _this._proxiesNode.parent;
            // Should be okay to query app settings without checkout RBAC/locks since this component
            // shouldn't load unless you have write access.
            return Observable_1.Observable.zip(_this.functionApp.getFunctions(), _this.functionApp.getApiProxies(), _this._cacheService.postArm(_this.functionApp.site.id + "/config/appsettings/list", true), function (f, p, a) { return ({ fcs: f, proxies: p, appSettings: a.json() }); });
        })
            .do(null, function (e) {
            _this._aiService.trackException(e, '/errors/api-new');
            console.error(e);
        })
            .retry()
            .subscribe(function (res) {
            _this._globalStateService.clearBusyState();
            _this.functionsInfo = res.fcs;
            _this.apiProxies = res.proxies;
            var extensionVersion = res.appSettings.properties[constants_1.Constants.routingExtensionVersionAppSettingName];
            _this.isEnabled = extensionVersion && extensionVersion !== constants_1.Constants.disabled;
        });
    }
    Object.defineProperty(ApiNewComponent.prototype, "viewInfoInput", {
        set: function (viewInfoInput) {
            this._viewInfoStream.next(viewInfoInput);
        },
        enumerable: true,
        configurable: true
    });
    ApiNewComponent.prototype.onFunctionAppSettingsClicked = function (event) {
        this.appNode.openSettings();
    };
    ApiNewComponent.validateUrl = function () {
        return function (control) {
            if (control.value) {
                var url = control.value.toLowerCase();
                return url.startsWith("http://") || url.startsWith("https://") ? null : {
                    validateName: {
                        valid: false
                    }
                };
            }
            else {
                return null;
            }
        };
    };
    ApiNewComponent.prototype.validateName = function (that) {
        return function (control) {
            var existingProxy = null;
            var existingFunction = null;
            if (that.complexForm) {
                var name = control.value;
                if (name) {
                    if (that.apiProxies && name) {
                        existingProxy = that.apiProxies.find(function (p) {
                            return p.name.toLowerCase() === name.toLowerCase();
                        });
                    }
                    if (!existingProxy) {
                        existingFunction = that.functionsInfo.find(function (f) {
                            return f.name.toLowerCase() === name.toLowerCase();
                        });
                    }
                }
            }
            return existingProxy || existingFunction ? {
                validateName: {
                    valid: false
                }
            } : null;
        };
    };
    ;
    ApiNewComponent.prototype.ngOnInit = function () {
    };
    ApiNewComponent.prototype.submitForm = function (value) {
        var _this = this;
        if (this.complexForm.valid) {
            this._globalStateService.setBusyState();
            var newApiProxy = {
                name: this.complexForm.controls["name"].value,
                backendUri: this.complexForm.controls["backendUri"].value,
                matchCondition: {
                    route: this.complexForm.controls["routeTemplate"].value,
                    methods: []
                },
                functionApp: null,
            };
            this.functionApp.getApiProxies().subscribe(function (proxies) {
                _this.apiProxies = proxies;
                var existingProxy = _this.apiProxies.find(function (p) {
                    return p.name === newApiProxy.name;
                });
                if (existingProxy) {
                    _this._globalStateService.clearBusyState();
                    // No need to log this error as this is just a user error.
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                        message: _this._translateService.instant(portal_resources_1.PortalResources.apiProxy_alreadyExists, { name: newApiProxy.name }),
                        errorId: error_ids_1.ErrorIds.proxyWithSameNameAlreadyExists,
                        errorType: error_event_1.ErrorType.UserError
                    });
                    throw "Proxy with name '" + newApiProxy.name + "' already exists";
                }
                else {
                    if (_this.complexForm.controls["methodSelectionType"].value !== "All") {
                        for (var control in _this.complexForm.controls) {
                            if (control.startsWith("method_")) {
                                if (_this.complexForm.controls[control].value) {
                                    newApiProxy.matchCondition.methods.push(control.replace("method_", "").toUpperCase());
                                }
                            }
                        }
                    }
                }
                _this.apiProxies.push(newApiProxy);
                _this.functionApp.saveApiProxy(api_proxy_1.ApiProxy.toJson(_this.apiProxies, _this._translateService)).subscribe(function () {
                    _this._globalStateService.clearBusyState();
                    _this._proxiesNode.addChild(newApiProxy);
                    //this._broadcastService.broadcast(BroadcastEvent.ApiProxyAdded, newApiProxy);
                });
            });
        }
    };
    return ApiNewComponent;
}());
ApiNewComponent = ApiNewComponent_1 = __decorate([
    core_1.Component({
        selector: 'api-new',
        templateUrl: './api-new.component.html',
        //styleUrls: ['./api-new.component.scss']
        styleUrls: ['./api-new.component.scss', '../binding-input/binding-input.component.css'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        broadcast_service_1.BroadcastService,
        ai_service_1.AiService,
        cache_service_1.CacheService])
], ApiNewComponent);
exports.ApiNewComponent = ApiNewComponent;
var ApiNewComponent_1;
//# sourceMappingURL=api-new.component.js.map