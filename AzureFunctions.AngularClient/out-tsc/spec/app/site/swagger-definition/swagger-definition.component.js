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
require("rxjs/add/operator/catch");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/retry");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/of");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
var tabs_component_1 = require("./../../tabs/tabs.component");
var ai_service_1 = require("../../shared/services/ai.service");
var portal_service_1 = require("../../shared/services/portal.service");
var constants_1 = require("../../shared/models/constants");
var portal_resources_1 = require("../../shared/models/portal-resources");
var broadcast_service_1 = require("../../shared/services/broadcast.service");
var broadcast_event_1 = require("../../shared/models/broadcast-event");
var error_ids_1 = require("../../shared/models/error-ids");
var error_event_1 = require("../../shared/models/error-event");
var cache_service_1 = require("../../shared/services/cache.service");
var SwaggerDefinitionComponent = (function () {
    function SwaggerDefinitionComponent(_aiService, _portalService, _cacheService, _broadcastService, _translateService, tabsComponent) {
        var _this = this;
        this._aiService = _aiService;
        this._portalService = _portalService;
        this._cacheService = _cacheService;
        this._broadcastService = _broadcastService;
        this._translateService = _translateService;
        this._viewInfoStream = new Subject_1.Subject();
        this._busyState = tabsComponent.busyState;
        this._viewInfoSub = this._viewInfoStream
            .switchMap(function (viewInfo) {
            _this._viewInfo = viewInfo;
            _this._busyState.setBusyState();
            _this._appNode = viewInfo.node;
            return Observable_1.Observable.zip(_this._cacheService.getArm(viewInfo.resourceId), _this._appNode.functionAppStream, function (s, fa) { return ({ siteResponse: s, functionApp: fa }); });
        })
            .switchMap(function (r) {
            _this.functionApp = r.functionApp;
            _this.site = r.siteResponse.json();
            return _this.functionApp.getHostJson();
        })
            .do(null, function (e) {
            _this._aiService.trackException(e, "swagger-definition");
            _this.swaggerEnabled = false;
            _this._busyState.clearBusyState();
        })
            .retry()
            .mergeMap(function (jsonObj) {
            _this.swaggerEnabled = false;
            if (jsonObj && jsonObj.swagger && typeof (jsonObj.swagger.enabled) === "boolean") {
                _this.swaggerEnabled = jsonObj.swagger.enabled;
            }
            if (_this.swaggerEnabled) {
                return _this.restoreSwaggerArtifacts();
            }
            else {
                _this.swaggerEnabled = false;
                return Observable_1.Observable.of(_this.swaggerEnabled);
            }
        }).do(null, function (e) {
            _this.swaggerEnabled = false;
            return Observable_1.Observable.of(_this.swaggerEnabled);
        })
            .subscribe(function (swaggerEnabled) {
            _this._busyState.clearBusyState();
            var traceKey = _this._viewInfo.data.siteTraceKey;
            _this._aiService.stopTrace("/site/function-definition-tab-ready", traceKey);
        });
        this.swaggerStatusOptions = [
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_internal),
                value: true
            },
            {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_external),
                value: false
            }
        ];
        this.valueChange = new Subject_1.Subject();
        this.valueChange
            .subscribe(function (swaggerEnabled) {
            _this._busyState.setBusyState();
            if (_this.swaggerEnabled == swaggerEnabled) {
                _this._busyState.clearBusyState();
            }
            else {
                _this.swaggerEnabled = swaggerEnabled;
                _this.setSwaggerEndpointState(swaggerEnabled)
                    .subscribe(function (result) {
                    _this._busyState.clearBusyState();
                });
            }
        });
    }
    Object.defineProperty(SwaggerDefinitionComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this._viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    SwaggerDefinitionComponent.prototype.ngOnDestroy = function () {
        if (this._viewInfoSub) {
            this._viewInfoSub.unsubscribe();
            this._viewInfoSub = null;
        }
        this._busyState.clearBusyState();
    };
    SwaggerDefinitionComponent.prototype.openBlade = function (name) {
        this._portalService.openBlade({
            detailBlade: name,
            detailBladeInputs: { resourceUri: this.functionApp.site.id }
        }, name);
    };
    SwaggerDefinitionComponent.prototype.setSwaggerEndpointState = function (swaggerEnabled) {
        var _this = this;
        return this.functionApp.getHostJson()
            .mergeMap(function (jsonObj) {
            jsonObj.swagger = { enabled: swaggerEnabled };
            var jsonString = JSON.stringify(jsonObj);
            return _this.functionApp.saveHostJson(jsonString);
        }).catch(function (error) {
            _this._busyState.clearBusyState();
            return Observable_1.Observable.of(null);
        }).mergeMap(function (config) {
            if (config == null) {
                _this.swaggerEnabled = !swaggerEnabled;
                return Observable_1.Observable.of(false);
            }
            _this.swaggerEnabled = config.swagger.enabled;
            if (!_this.swaggerEnabled) {
                _this._aiService.trackEvent("/actions/swagger_definition/disable_swagger_endpoint");
                return Observable_1.Observable.of(true);
            }
            else {
                _this._aiService.trackEvent("/actions/swagger_definition/enable_swagger_endpoint");
                return _this.restoreSwaggerArtifacts();
            }
        });
    };
    SwaggerDefinitionComponent.prototype.onSwaggerEditorReady = function (swaggerEditor) {
        this.swaggerEditor = swaggerEditor;
        if (!this.swaggerEditor) {
            return;
        }
        if (!this.swaggerDocument) {
            this.swaggerDocument = this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_placeHolder);
        }
        this.swaggerEditor.setDocument(this.swaggerDocument);
    };
    SwaggerDefinitionComponent.prototype.assignDocumentToEditor = function (swaggerDocument) {
        if (this.swaggerEditor) {
            this.swaggerEditor.setDocument(swaggerDocument);
        }
    };
    SwaggerDefinitionComponent.prototype.LoadGeneratedDataInEditor = function () {
        var _this = this;
        this.swaggerEditor.getDocument(function (swaggerDocument, error) {
            if (((!swaggerDocument || swaggerDocument == _this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_placeHolder))
                && !error)
                || confirm(_this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_confirmOverwrite))) {
                _this.functionApp.getGeneratedSwaggerData(_this.swaggerKey)
                    .subscribe(function (swaggerDoc) {
                    _this.swaggerDocument = swaggerDoc;
                    _this.assignDocumentToEditor(swaggerDoc);
                });
            }
        });
    };
    SwaggerDefinitionComponent.prototype.toggleKeyVisibility = function () {
        this.keyVisible = !this.keyVisible;
    };
    SwaggerDefinitionComponent.prototype.toggleDocumentationVisibility = function () {
        this.documentationVisible = !this.documentationVisible;
    };
    SwaggerDefinitionComponent.prototype.saveChanges = function () {
        var _this = this;
        this._busyState.setBusyState();
        this.swaggerEditor.getDocument(function (swaggerDocument, error) {
            if (error) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_prompt),
                    errorId: error_ids_1.ErrorIds.malformedAPIDefinition,
                    errorType: error_event_1.ErrorType.UserError
                });
                _this._busyState.clearBusyState();
                return;
            }
            if (swaggerDocument) {
                _this.functionApp.addOrUpdateSwaggerDocument(_this.swaggerURL, swaggerDocument).
                    subscribe(function (updatedDocument) {
                    _this.swaggerDocument = updatedDocument;
                    _this._busyState.clearBusyState();
                }, function (e) {
                    _this._busyState.clearBusyState();
                });
                return;
            }
            if (!swaggerDocument && !error) {
                var confirmDelete = confirm(_this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_delete));
                if (confirmDelete) {
                    _this.functionApp.deleteSwaggerDocument(_this.swaggerURL).
                        subscribe(function () {
                        _this.swaggerDocument = _this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_placeHolder);
                        _this._busyState.clearBusyState();
                    }, function (e) {
                        _this._busyState.clearBusyState();
                    });
                }
                else {
                    _this.assignDocumentToEditor(_this.swaggerDocument);
                    _this._busyState.clearBusyState();
                }
                return;
            }
        });
    };
    SwaggerDefinitionComponent.prototype.resetEditor = function () {
        var _this = this;
        this._busyState.setBusyState();
        this.functionApp.getSwaggerDocument(this.swaggerKey)
            .subscribe(function (swaggerDoc) {
            _this.swaggerDocument = swaggerDoc;
            _this.assignDocumentToEditor(swaggerDoc);
            _this._busyState.clearBusyState();
        }, function (e) {
            _this._busyState.clearBusyState();
        });
    };
    SwaggerDefinitionComponent.prototype.renewSwaggerSecret = function () {
        var _this = this;
        this._busyState.setBusyState();
        this.createSwaggerSecret()
            .mergeMap(function (key) {
            _this.swaggerKey = key;
            _this.swaggerURL = _this.getUpdatedSwaggerURL(key);
            return _this.addorUpdateApiDefinitionURL(_this.swaggerURL);
        })
            .catch(function (error) {
            return Observable_1.Observable.of(false);
        }).subscribe(function (result) {
            _this._busyState.clearBusyState();
        });
    };
    SwaggerDefinitionComponent.prototype.addorUpdateApiDefinitionURL = function (url) {
        var _this = this;
        return this._cacheService.getArm(this.functionApp.site.id + "/config/web", true)
            .map(function (r) { return r.json(); })
            .mergeMap(function (config) {
            var configChange = false;
            if (!config.properties.apiDefinition ||
                !config.properties.apiDefinition.url ||
                config.properties.apiDefinition.url != url) {
                config.properties.apiDefinition = { url: url };
                configChange = true;
            }
            if (!config.properties.cors.allowedOrigins.includes("*")) {
                if (!config.properties.cors.allowedOrigins.includes(constants_1.Constants.portalHostName)) {
                    config.properties.cors.allowedOrigins.push(constants_1.Constants.portalHostName);
                    configChange = true;
                }
                if (!config.properties.cors.allowedOrigins.includes(constants_1.Constants.webAppsHostName)) {
                    config.properties.cors.allowedOrigins.push(constants_1.Constants.webAppsHostName);
                    configChange = true;
                }
                if (!config.properties.cors.allowedOrigins.includes(constants_1.Constants.msPortalHostName)) {
                    config.properties.cors.allowedOrigins.push(constants_1.Constants.msPortalHostName);
                    configChange = true;
                }
            }
            if (configChange) {
                return _this._cacheService.putArm(_this.functionApp.site.id + "/config/web", null, JSON.stringify(config)).map(function (r) { return r.json(); });
            }
            return Observable_1.Observable.of(true);
        });
    };
    SwaggerDefinitionComponent.prototype.getSwaggerSecret = function () {
        return this.functionApp.getSystemKey()
            .map(function (keys) {
            var swaggerKey = null;
            keys.keys.forEach(function (key) {
                if (key.name == constants_1.Constants.swaggerSecretName) {
                    swaggerKey = key.value;
                }
            });
            return swaggerKey;
        });
    };
    SwaggerDefinitionComponent.prototype.getUpdatedSwaggerURL = function (key) {
        return this.functionApp.getMainSiteUrl() + "/admin/host/swagger?code=" + key;
    };
    SwaggerDefinitionComponent.prototype.createSwaggerSecret = function () {
        return this.functionApp.createSystemKey(constants_1.Constants.swaggerSecretName)
            .map(function (key) { return key.value; });
    };
    SwaggerDefinitionComponent.prototype.restoreSwaggerArtifacts = function () {
        var _this = this;
        return this.getSwaggerSecret()
            .mergeMap(function (key) {
            if (!key) {
                return _this.createSwaggerSecret();
            }
            return Observable_1.Observable.of(key);
        }).catch(function (error) {
            // get or create key fails
            _this.swaggerEnabled = false;
            return Observable_1.Observable.of("");
        }).mergeMap(function (key) {
            if (!key) {
                // will be passed to swagger doc
                return Observable_1.Observable.of(_this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_placeHolder));
            }
            _this.swaggerKey = key;
            _this.swaggerURL = _this.getUpdatedSwaggerURL(key);
            return _this.functionApp.getSwaggerDocument(key);
        })
            .retry(1)
            .catch(function (error) {
            // get document fails
            return Observable_1.Observable.of(_this._translateService.instant(portal_resources_1.PortalResources.swaggerDefinition_placeHolder));
        }).mergeMap(function (swaggerDoc) {
            _this.swaggerDocument = swaggerDoc;
            _this.assignDocumentToEditor(swaggerDoc);
            if (_this.swaggerKey) {
                return _this.addorUpdateApiDefinitionURL(_this.swaggerURL);
            }
            return Observable_1.Observable.of(true);
        }).catch(function (error) {
            return Observable_1.Observable.of(false);
        });
    };
    return SwaggerDefinitionComponent;
}());
SwaggerDefinitionComponent = __decorate([
    core_1.Component({
        selector: 'swaggerdefinition',
        templateUrl: './swagger-definition.component.html',
        styleUrls: ['./swagger-definition.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        portal_service_1.PortalService,
        cache_service_1.CacheService,
        broadcast_service_1.BroadcastService,
        core_2.TranslateService,
        tabs_component_1.TabsComponent])
], SwaggerDefinitionComponent);
exports.SwaggerDefinitionComponent = SwaggerDefinitionComponent;
//# sourceMappingURL=swagger-definition.component.js.map