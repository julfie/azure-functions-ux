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
var Subject_1 = require("rxjs/Subject");
var slots_service_1 = require("app/shared/services/slots.service");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/do");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/retryWhen");
require("rxjs/add/operator/scan");
require("rxjs/add/observable/of");
require("rxjs/add/observable/zip");
var no_cors_http_service_1 = require("./no-cors-http-service");
var error_ids_1 = require("./models/error-ids");
var authz_service_1 = require("./services/authz.service");
var api_proxy_1 = require("./models/api-proxy");
var constants_1 = require("./models/constants");
var cache_decorator_1 = require("./decorators/cache.decorator");
var portal_resources_1 = require("./models/portal-resources");
var ng2_cookies_1 = require("ng2-cookies/ng2-cookies");
var broadcast_event_1 = require("./models/broadcast-event");
var error_event_1 = require("./models/error-event");
var function_app_edit_mode_1 = require("./models/function-app-edit-mode");
var jsonschema = require("jsonschema");
var FunctionApp = (function () {
    function FunctionApp(site, _ngHttp, _userService, _globalStateService, _translateService, _broadcastService, _armService, _cacheService, _languageService, _authZService, _aiService, _configService, _slotsService) {
        var _this = this;
        this.site = site;
        this._ngHttp = _ngHttp;
        this._userService = _userService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._broadcastService = _broadcastService;
        this._armService = _armService;
        this._cacheService = _cacheService;
        this._languageService = _languageService;
        this._authZService = _authZService;
        this._aiService = _aiService;
        this._configService = _configService;
        this._slotsService = _slotsService;
        this.isMultiKeySupported = true;
        this.isAlwaysOn = false;
        this.isDeleted = false;
        // https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
        this.statusCodeMap = {
            0: 'Unknown HTTP Error',
            100: 'Continue',
            101: 'Switching Protocols',
            102: 'Processing',
            200: 'OK',
            201: 'Created',
            202: 'Accepted',
            203: 'Non-Authoritative Information',
            204: 'No Content',
            205: 'Reset Content',
            206: 'Partial Content',
            300: 'Multiple Choices',
            301: 'Moved Permanently',
            302: 'Found',
            303: 'See Other',
            304: 'Not Modified',
            305: 'Use Proxy',
            306: '(Unused)',
            307: 'Temporary Redirect',
            400: 'Bad Request',
            401: 'Unauthorized',
            402: 'Payment Required',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            406: 'Not Acceptable',
            407: 'Proxy Authentication Required',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            411: 'Length Required',
            412: 'Precondition Failed',
            413: 'Request Entity Too Large',
            414: 'Request-URI Too Long',
            415: 'Unsupported Media Type',
            416: 'Requested Range Not Satisfiable',
            417: 'Expectation Failed',
            500: 'Internal Server Error',
            501: 'Not Implemented',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
            505: 'HTTP Version Not Supported'
        };
        this.genericStatusCodeMap = {
            100: 'Informational',
            200: 'Success',
            300: 'Redirection',
            400: 'Client Error',
            500: 'Server Error'
        };
        this._tryAppServiceUrl = 'https://tryappservice.azure.com';
        this._http = new no_cors_http_service_1.NoCorsHttpService(_ngHttp, _broadcastService, _aiService, _translateService, function () { return _this.getPortalHeaders(); });
        if (!constants_1.Constants.runtimeVersion) {
            this.getLatestRuntime().subscribe(function (runtime) {
                constants_1.Constants.runtimeVersion = runtime;
            });
        }
        if (!constants_1.Constants.routingExtensionVersion) {
            this._getLatestRoutingExtensionVersion().subscribe(function (routingVersion) {
                constants_1.Constants.routingExtensionVersion = routingVersion;
            });
        }
        if (!_globalStateService.showTryView) {
            this._userService.getStartupInfo()
                .mergeMap(function (info) {
                _this.token = info.token;
                return Observable_1.Observable.zip(_this._authZService.hasPermission(_this.site.id, [authz_service_1.AuthzService.writeScope]), _this._authZService.hasReadOnlyLock(_this.site.id), function (p, l) { return ({ hasWritePermissions: p, hasReadOnlyLock: l }); });
            })
                .mergeMap(function (r) {
                if (r.hasWritePermissions && !r.hasReadOnlyLock) {
                    return _this.getExtensionVersion();
                }
                return Observable_1.Observable.of(null);
            })
                .mergeMap(function (extensionVersion) {
                if (extensionVersion) {
                    return _this._languageService.getResources(extensionVersion);
                }
                return Observable_1.Observable.of(null);
            })
                .do(function (_) {
                _this.diagnose(_this.site)
                    .subscribe(function (diagnosticsResults) {
                    if (diagnosticsResults) {
                        for (var i = 0; i < diagnosticsResults.length; i++) {
                            if (diagnosticsResults[i].isDiagnosingSuccessful) {
                                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                                    message: diagnosticsResults[i].successResult.message + " " + diagnosticsResults[i].successResult.userAction,
                                    errorId: diagnosticsResults[i].successResult.actionId,
                                    errorType: diagnosticsResults[i].successResult.isTerminating ? error_event_1.ErrorType.Fatal : error_event_1.ErrorType.UserError,
                                    resourceId: _this.site.id
                                });
                            }
                        }
                    }
                });
            }, function (e) {
                _this._aiService.trackException(e, "FunctionApp().getStartupInfo()");
            })
                .subscribe(function (r) { });
        }
        this._scmUrl = FunctionApp.getScmUrl(this._configService, this.site);
        this.mainSiteUrl = FunctionApp.getMainUrl(this._configService, this.site);
        this.siteName = this.site.name;
        var fc = site;
        if (fc.tryScmCred != null) {
            this.tryFunctionsScmCreds = fc.tryScmCred;
        }
        if (ng2_cookies_1.Cookie.get('TryAppServiceToken')) {
            this._globalStateService.TryAppServiceToken = ng2_cookies_1.Cookie.get('TryAppServiceToken');
            var templateId = ng2_cookies_1.Cookie.get('templateId');
            this.selectedFunction = templateId.split('-')[0].trim();
            this.selectedLanguage = templateId.split('-')[1].trim();
            this.selectedProvider = ng2_cookies_1.Cookie.get('provider');
            this.selectedFunctionName = ng2_cookies_1.Cookie.get('functionName');
        }
    }
    FunctionApp.getMainUrl = function (configService, site) {
        if (configService.isStandalone()) {
            return "https://" + site.properties.defaultHostName + "/functions/" + site.name;
        }
        else {
            return "https://" + site.properties.defaultHostName;
        }
    };
    // In standalone mode, there isn't a concept of a separate SCM site.  Instead, all calls that would
    // normally go to the main or scm site are routed to a single server and are distinguished by either
    // "/api" (scm site) or "/admin" (main site)
    FunctionApp.getScmUrl = function (configService, site) {
        if (configService.isStandalone()) {
            return FunctionApp.getMainUrl(configService, site);
        }
        else {
            return "https://" + site.properties.hostNameSslStates.find(function (s) { return s.hostType === 1; }).name;
        }
    };
    FunctionApp.prototype._getLatestRoutingExtensionVersion = function () {
        return this._cacheService.get(constants_1.Constants.serviceHost + 'api/latestrouting', false, this.getPortalHeaders())
            .map(function (r) {
            return r.json();
        })
            .retryWhen(this.retryAntares);
    };
    FunctionApp.prototype.getFunctions = function () {
        var _this = this;
        return this._cacheService.get(this._scmUrl + "/api/functions", false, this.getScmSiteHeaders())
            .catch(function (e) { return _this._http.get(_this._scmUrl + "/api/functions", { headers: _this.getScmSiteHeaders() }); })
            .retryWhen(this.retryAntares)
            .map(function (r) {
            try {
                var fcs = r.json();
                fcs.forEach(function (fc) { return fc.functionApp = _this; });
                return fcs;
            }
            catch (e) {
                // We have seen this happen when kudu was returning JSON that contained
                // comments because Json.NET is okay with comments in the JSON file.
                // We can't parse that JSON in browser, so this is just to handle the error correctly.
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_parsingFunctionListReturenedFromKudu),
                    errorId: error_ids_1.ErrorIds.deserializingKudusFunctionList,
                    errorType: error_event_1.ErrorType.Fatal,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.deserializingKudusFunctionList, {
                    error: e,
                    content: r.text(),
                });
                return [];
            }
        })
            .do(function (r) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToRetrieveFunctionsList); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToRetrieveFunctionListFromKudu),
                    errorId: error_ids_1.ErrorIds.unableToRetrieveFunctionsList,
                    errorType: error_event_1.ErrorType.RuntimeError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToRetrieveFunctionsList, {
                    content: error.text(),
                    status: error.status.toString()
                });
            }
        });
    };
    FunctionApp.prototype.getApiProxies = function () {
        var _this = this;
        return Observable_1.Observable.zip(this._cacheService.get(this._scmUrl + "/api/vfs/site/wwwroot/proxies.json", false, this.getScmSiteHeaders())
            .catch(function (e) { return _this._http.get(_this._scmUrl + "/api/vfs/site/wwwroot/proxies.json", { headers: _this.getScmSiteHeaders() }); })
            .retryWhen(function (e) { return e.scan(function (errorCount, err) {
            if (err.status === 404 || errorCount >= 10) {
                throw err;
            }
            return errorCount + 1;
        }, 0).delay(200); })
            .catch(function (_) { return Observable_1.Observable.of({
            json: function () { return {}; }
        }); }), this._cacheService.get('assets/schemas/proxies.json', false, this.getPortalHeaders()), function (p, s) { return ({ proxies: p.json(), schema: s.json() }); }).map(function (r) {
            if (r.proxies.proxies) {
                var validateResult = jsonschema.validate(r.proxies, r.schema).toString();
                if (validateResult) {
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                        message: _this._translateService.instant(portal_resources_1.PortalResources.error_schemaValidationProxies) + ". " + validateResult,
                        errorId: error_ids_1.ErrorIds.proxySchemaValidationFails,
                        errorType: error_event_1.ErrorType.Fatal,
                        resourceId: _this.site.id
                    });
                    return api_proxy_1.ApiProxy.fromJson({});
                }
            }
            return api_proxy_1.ApiProxy.fromJson(r.proxies);
        });
    };
    FunctionApp.prototype.saveApiProxy = function (jsonString) {
        var headers = this.getScmSiteHeaders();
        // https://github.com/projectkudu/kudu/wiki/REST-API
        headers.append('If-Match', '*');
        var uri = this._scmUrl + "/api/vfs/site/wwwroot/proxies.json";
        this._cacheService.clearCachePrefix(uri);
        return this._http.put(uri, jsonString, { headers: headers });
    };
    /**
     * This function returns the content of a file from kudu as a string.
     * @param file either a VfsObject or a string representing the file's href.
     */
    FunctionApp.prototype.getFileContent = function (file) {
        var _this = this;
        var fileHref = typeof file === 'string' ? file : file.href;
        var fileName = this.getFileName(file);
        return this._http.get(fileHref, { headers: this.getScmSiteHeaders() })
            .map(function (r) { return r.text(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToRetrieveFileContent + fileName); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToGetFileContentFromKudu, { fileName: fileName }),
                    errorId: error_ids_1.ErrorIds.unableToRetrieveFileContent + fileName,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToRetrieveFileContent, {
                    fileHref: fileHref,
                    content: error.text(),
                    status: error.status.toString()
                });
            }
        });
    };
    FunctionApp.prototype.saveFile = function (file, updatedContent, functionInfo) {
        var _this = this;
        var fileHref = typeof file === 'string' ? file : file.href;
        var fileName = this.getFileName(file);
        var headers = this.getScmSiteHeaders('plain/text');
        headers.append('If-Match', '*');
        if (functionInfo) {
            cache_decorator_1.ClearAllFunctionCache(functionInfo);
        }
        return this._http.put(fileHref, updatedContent, { headers: headers })
            .map(function (r) { return file; })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToSaveFileContent + fileName); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToSaveFileContentThroughKudu, { fileName: fileName }),
                    errorId: error_ids_1.ErrorIds.unableToSaveFileContent + fileName,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToSaveFileContent, {
                    fileHref: fileHref,
                    content: error.text(),
                    status: error.status.toString()
                });
            }
        });
    };
    FunctionApp.prototype.deleteFile = function (file, functionInfo) {
        var _this = this;
        var fileHref = typeof file === 'string' ? file : file.href;
        var fileName = this.getFileName(file);
        var headers = this.getScmSiteHeaders('plain/text');
        headers.append('If-Match', '*');
        if (functionInfo) {
            cache_decorator_1.ClearAllFunctionCache(functionInfo);
        }
        return this._http.delete(fileHref, { headers: headers })
            .map(function (r) { return file; })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToDeleteFile + fileName); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToDeleteFileThroughKudu, { fileName: fileName }),
                    errorId: error_ids_1.ErrorIds.unableToDeleteFile + fileName,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToDeleteFile, {
                    fileHref: fileHref,
                    content: error.text(),
                    status: error.status.toString()
                });
            }
        });
    };
    FunctionApp.prototype.ClearAllFunctionCache = function (functionInfo) {
        cache_decorator_1.ClearAllFunctionCache(functionInfo);
    };
    // This function is special cased in the Cache() decorator by name to allow for dev scenarios.
    FunctionApp.prototype.getTemplates = function () {
        var _this = this;
        try {
            if (localStorage.getItem('dev-templates')) {
                var devTemplate = JSON.parse(localStorage.getItem('dev-templates'));
                this.localize(devTemplate);
                return Observable_1.Observable.of(devTemplate);
            }
        }
        catch (e) {
            console.error(e);
        }
        return this.getExtensionVersion()
            .mergeMap(function (extensionVersion) {
            return _this._cacheService.get(constants_1.Constants.serviceHost + 'api/templates?runtime=' + (extensionVersion || 'latest'), true, _this.getPortalHeaders());
        })
            .retryWhen(this.retryAntares)
            .map(function (r) {
            var object = r.json();
            _this.localize(object);
            return object;
        });
    };
    FunctionApp.prototype.createFunction = function (functionName, templateId) {
        var _this = this;
        var observable;
        if (templateId) {
            var body = {
                name: functionName,
                templateId: (templateId && templateId !== 'Empty' ? templateId : null),
                containerScmUrl: this._scmUrl
            };
            observable = this._http.put(this._scmUrl + "/api/functions/" + functionName, JSON.stringify(body), { headers: this.getScmSiteHeaders() })
                .map(function (r) { return r.json(); });
        }
        else {
            observable = this._http
                .put(this._scmUrl + "/api/functions/" + functionName, JSON.stringify({ config: {} }), { headers: this.getScmSiteHeaders() })
                .map(function (r) { return r.json(); });
        }
        return observable
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToCreateFunction + functionName); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToCreateFunction, { functionName: functionName }),
                    errorId: error_ids_1.ErrorIds.unableToCreateFunction + functionName,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToCreateFunction, {
                    content: error.text(),
                    status: error.status.toString(),
                });
            }
        });
    };
    FunctionApp.prototype.getFunctionContainerAppSettings = function () {
        var url = this._scmUrl + "/api/settings";
        return this._http.get(url, { headers: this.getScmSiteHeaders() })
            .retryWhen(this.retryAntares)
            .map(function (r) { return r.json(); });
    };
    FunctionApp.prototype.createFunctionV2 = function (functionName, files, config) {
        var _this = this;
        var filesCopy = Object.assign({}, files);
        var sampleData = filesCopy['sample.dat'];
        delete filesCopy['sample.dat'];
        var content = JSON.stringify({ files: filesCopy, test_data: sampleData, config: config });
        var url = this._scmUrl + "/api/functions/" + functionName;
        return this._http.put(url, content, { headers: this.getScmSiteHeaders() })
            .map(function (r) { return r.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToCreateFunction + functionName); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToCreateFunction, { functionName: functionName }),
                    errorId: error_ids_1.ErrorIds.unableToCreateFunction + functionName,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToCreateFunction, {
                    content: error.text(),
                    status: error.status.toString(),
                });
            }
        });
    };
    FunctionApp.prototype.getNewFunctionNode = function () {
        return {
            name: this._translateService.instant(portal_resources_1.PortalResources.newFunction),
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
    };
    FunctionApp.prototype.statusCodeToText = function (code) {
        var statusClass = Math.floor(code / 100) * 100;
        return this.statusCodeMap[code] || this.genericStatusCodeMap[statusClass] || 'Unknown Status Code';
    };
    FunctionApp.prototype.runHttpFunction = function (functionInfo, url, model) {
        var content = model.body;
        var regExp = /\{([^}]+)\}/g;
        var matchesPathParams = url.match(regExp);
        var processedParams = [];
        var splitResults = url.split('?');
        if (splitResults.length === 2) {
            url = splitResults[0];
        }
        if (matchesPathParams) {
            matchesPathParams.forEach(function (m) {
                var name = m.split(':')[0].replace('{', '').replace('}', '');
                processedParams.push(name);
                var param = model.queryStringParams.find(function (p) {
                    return p.name === name;
                });
                if (param) {
                    url = url.replace(m, param.value);
                }
            });
        }
        var firstDone = false;
        model.queryStringParams.forEach(function (p, index) {
            var findResult = processedParams.find(function (pr) {
                return pr === p.name;
            });
            if (!findResult) {
                if (!firstDone) {
                    url += '?';
                    firstDone = true;
                }
                else {
                    url += '&';
                }
                url += p.name + '=' + p.value;
            }
        });
        var inputBinding = (functionInfo.config && functionInfo.config.bindings
            ? functionInfo.config.bindings.find(function (e) { return e.type === 'httpTrigger'; })
            : null);
        var contentType;
        if (!inputBinding || inputBinding && inputBinding.webHookType) {
            contentType = 'application/json';
        }
        var headers = this.getMainSiteHeaders(contentType);
        model.headers.forEach(function (h) {
            headers.append(h.name, h.value);
        });
        var response;
        switch (model.method) {
            case constants_1.Constants.httpMethods.GET:
                response = this._http.get(url, { headers: headers });
                break;
            case constants_1.Constants.httpMethods.POST:
                response = this._http.post(url, content, { headers: headers });
                break;
            case constants_1.Constants.httpMethods.DELETE:
                response = this._http.delete(url, { headers: headers });
                break;
            case constants_1.Constants.httpMethods.HEAD:
                response = this._http.head(url, { headers: headers });
                break;
            case constants_1.Constants.httpMethods.PATCH:
                response = this._http.patch(url, content, { headers: headers });
                break;
            case constants_1.Constants.httpMethods.PUT:
                response = this._http.put(url, content, { headers: headers });
                break;
            default:
                response = this._http.request(url, {
                    headers: headers,
                    method: model.method,
                    body: content
                });
                break;
        }
        return this.runFunctionInternal(response, functionInfo);
    };
    FunctionApp.prototype.runFunction = function (functionInfo, content) {
        var url = this.mainSiteUrl + "/admin/functions/" + functionInfo.name.toLocaleLowerCase();
        var _content = JSON.stringify({ input: content });
        var contentType;
        try {
            JSON.parse(_content);
            contentType = 'application/json';
        }
        catch (e) {
            contentType = 'plain/text';
        }
        return this.runFunctionInternal(this._http.post(url, _content, { headers: this.getMainSiteHeaders(contentType) }), functionInfo);
    };
    FunctionApp.prototype.deleteFunction = function (functionInfo) {
        var _this = this;
        return this._http.delete(functionInfo.href, { headers: this.getScmSiteHeaders() })
            .map(function (r) { return r.statusText; })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToDeleteFunction + functionInfo.name); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToDeleteFunction, { functionName: functionInfo.name }),
                    errorId: error_ids_1.ErrorIds.unableToDeleteFunction + functionInfo.name,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToDeleteFunction, {
                    content: error.text(),
                    status: error.status.toString(),
                    href: functionInfo.href
                });
            }
        });
    };
    FunctionApp.prototype.getDesignerSchema = function () {
        return this._http.get(constants_1.Constants.serviceHost + 'mocks/function-json-schema.json')
            .retryWhen(this.retryAntares)
            .map(function (r) { return r.json(); });
    };
    FunctionApp.prototype.initKeysAndWarmupMainSite = function () {
        var warmupSite = this._http.post(this.mainSiteUrl + "/admin/host/ping", '')
            .retryWhen(this.retryAntares)
            .catch(function (e) { return Observable_1.Observable.of(null); });
        var observable = Observable_1.Observable.zip(warmupSite, this.getHostSecretsFromScm(), function (w, s) { return ({ warmUp: w, secrets: s }); });
        return observable;
    };
    FunctionApp.prototype.getSecrets = function (fi) {
        var _this = this;
        return this._http.get(fi.secrets_file_href, { headers: this.getScmSiteHeaders() })
            .map(function (r) { return r.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToRetrieveSecretsFileFromKudu + fi.name); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_UnableToRetrieveSecretsFileFromKudu, { functionName: fi.name }),
                    errorId: error_ids_1.ErrorIds.unableToRetrieveSecretsFileFromKudu + fi.name,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToRetrieveSecretsFileFromKudu, {
                    status: error.status.toString(),
                    content: error.text(),
                    href: fi.secrets_file_href
                });
            }
        });
    };
    FunctionApp.prototype.setSecrets = function (fi, secrets) {
        return this.saveFile(fi.secrets_file_href, JSON.stringify(secrets))
            .retryWhen(this.retryAntares)
            .map(function (e) { return secrets; });
    };
    FunctionApp.prototype.getHostJson = function () {
        var _this = this;
        return this._http.get(this._scmUrl + "/api/functions/config", { headers: this.getScmSiteHeaders() })
            .map(function (r) { return r.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToRetrieveRuntimeConfig); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToRetrieveRuntimeConfig),
                    errorId: error_ids_1.ErrorIds.unableToRetrieveRuntimeConfig,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToRetrieveRuntimeConfig, {
                    status: error.status.toString(),
                    content: error.text(),
                });
            }
        });
    };
    FunctionApp.prototype.saveFunction = function (fi, config) {
        var _this = this;
        cache_decorator_1.ClearAllFunctionCache(fi);
        return this._http.put(fi.href, JSON.stringify({ config: config }), { headers: this.getScmSiteHeaders() })
            .map(function (r) { return r.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToUpdateFunction + fi.name); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToUpdateFunction, { functionName: fi.name }),
                    errorId: error_ids_1.ErrorIds.unableToUpdateFunction + fi.name,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToUpdateFunction, {
                    status: error.status.toString(),
                    content: error.text(),
                });
                return Observable_1.Observable.of('');
            }
        });
    };
    FunctionApp.prototype.getScmUrl = function () {
        return this._scmUrl;
    };
    FunctionApp.prototype.getSiteName = function () {
        return this.siteName;
    };
    FunctionApp.prototype.getMainSiteUrl = function () {
        return this.mainSiteUrl;
    };
    FunctionApp.prototype.getHostSecretsFromScm = function () {
        var _this = this;
        return this.getAuthSettings()
            .mergeMap(function (authSettings) {
            return authSettings.clientCertEnabled
                ? Observable_1.Observable.of()
                : _this._http.get(_this._scmUrl + "/api/functions/admin/token", { headers: _this.getScmSiteHeaders() })
                    .retryWhen(_this.retryAntares)
                    .map(function (r) { return r.json(); })
                    .mergeMap(function (token) {
                    // Call the main site to get the masterKey
                    // build authorization header
                    var authHeader = new http_1.Headers();
                    authHeader.append('Authorization', "Bearer " + token);
                    return _this._http.get(_this.mainSiteUrl + "/admin/host/systemkeys/_master", { headers: authHeader })
                        .catch(function (error) {
                        if (error.status === 405) {
                            // If the result from calling the API above is 405, that means they are running on an older runtime.
                            // It should be safe to call kudu for the master key since they won't be using slots.
                            return _this._http.get(_this._scmUrl + "/api/functions/admin/masterKey", { headers: _this.getScmSiteHeaders() });
                        }
                        else {
                            throw error;
                        }
                    })
                        .retryWhen(function (error) { return error.scan(function (errorCount, err) {
                        if (err.isHandled || err.status < 500 || errorCount >= 10) {
                            throw err;
                        }
                        else {
                            return errorCount + 1;
                        }
                    }, 0).delay(1000); })
                        .catch(function (e) { return _this._http.get(_this.mainSiteUrl + "/admin/host/status", { headers: authHeader })
                        .do(null, function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                        message: _this._translateService.instant(portal_resources_1.PortalResources.error_functionRuntimeIsUnableToStart),
                        errorId: error_ids_1.ErrorIds.functionRuntimeIsUnableToStart,
                        errorType: error_event_1.ErrorType.Fatal,
                        resourceId: _this.site.id
                    }); }).map(function (_) { throw e; }); }) // if /status call is successful, then throw the original error
                        .do(function (r) {
                        // Since we fall back to kudu above, use a union of kudu and runtime types.
                        var key = r.json();
                        if (key.masterKey) {
                            _this.masterKey = key.masterKey;
                        }
                        else {
                            _this.masterKey = key.value;
                        }
                    });
                })
                    .do(function () {
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToRetrieveRuntimeKeyFromScm);
                }, function (error) {
                    if (!error.isHandled) {
                        try {
                            var exception = error.json();
                            if (exception.ExceptionType === 'System.Security.Cryptography.CryptographicException') {
                                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToDecryptKeys),
                                    errorId: error_ids_1.ErrorIds.unableToDecryptKeys,
                                    errorType: error_event_1.ErrorType.RuntimeError,
                                    resourceId: _this.site.id
                                });
                                _this.trackEvent(error_ids_1.ErrorIds.unableToDecryptKeys, {
                                    content: error.text(),
                                    status: error.status.toString()
                                });
                                return;
                            }
                            else if (exception.message || exception.messsage) {
                                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                                    message: exception.message || exception.messsage,
                                    errorId: error_ids_1.ErrorIds.unableToDecryptKeys,
                                    errorType: error_event_1.ErrorType.RuntimeError,
                                    resourceId: _this.site.id
                                });
                                _this.trackEvent(error_ids_1.ErrorIds.unableToDecryptKeys, {
                                    content: error.text(),
                                    status: error.status.toString()
                                });
                                return;
                            }
                        }
                        catch (e) {
                            // no-op
                        }
                        _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                            message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToRetrieveRuntimeKey),
                            errorId: error_ids_1.ErrorIds.unableToRetrieveRuntimeKeyFromScm,
                            errorType: error_event_1.ErrorType.RuntimeError,
                            resourceId: _this.site.id
                        });
                        _this.trackEvent(error_ids_1.ErrorIds.unableToRetrieveRuntimeKeyFromScm, {
                            status: error.status.toString(),
                            content: error.text(),
                        });
                    }
                });
        });
    };
    FunctionApp.prototype.legacyGetHostSecrets = function () {
        var _this = this;
        return this._http.get(this._scmUrl + "/api/vfs/data/functions/secrets/host.json", { headers: this.getScmSiteHeaders() })
            .map(function (r) { return r.json().masterKey; })
            .do(function (h) {
            _this.masterKey = h;
            _this.isMultiKeySupported = false;
        });
    };
    FunctionApp.prototype.getFunctionHostKeys = function (handleUnauthorized) {
        var _this = this;
        handleUnauthorized = typeof handleUnauthorized !== 'undefined' ? handleUnauthorized : true;
        return this.getAuthSettings()
            .mergeMap(function (r) {
            if (r.clientCertEnabled) {
                return Observable_1.Observable.of({ keys: [], links: [] });
            }
            return _this._http.get(_this.mainSiteUrl + "/admin/host/keys", { headers: _this.getMainSiteHeaders() })
                .retryWhen(function (e) { return e.scan(function (errorCount, err) {
                if (err.status < 500 && err.status !== 0) {
                    throw err;
                }
                if (errorCount >= 10) {
                    throw err;
                }
                return errorCount + 1;
            }, 0).delay(400); })
                .map(function (r) {
                var keys = r.json();
                if (keys && Array.isArray(keys.keys)) {
                    keys.keys.unshift({
                        name: '_master',
                        value: _this.masterKey
                    });
                }
                return keys;
            })
                .catch(function (error) {
                if (handleUnauthorized && error.status === 401) {
                    _this.trackEvent(error_ids_1.ErrorIds.unauthorizedTalkingToRuntime, {
                        usedKey: _this.sanitize(_this.masterKey)
                    });
                    return _this.getHostSecretsFromScm().mergeMap(function (r) { return _this.getFunctionHostKeys(false); });
                }
                else {
                    throw error;
                }
            })
                .do(function (_) {
                _this.isMultiKeySupported = true;
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToRetrieveRuntimeKeyFromRuntime);
            }, function (error) {
                if (!error.isHandled) {
                    if (error.status === 404) {
                        _this.isMultiKeySupported = false;
                        _this.legacyGetHostSecrets();
                        return Observable_1.Observable.of({ keys: [], links: [] });
                    }
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                        message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToRetrieveRuntimeKey),
                        errorId: error_ids_1.ErrorIds.unableToRetrieveRuntimeKeyFromRuntime,
                        errorType: error_event_1.ErrorType.RuntimeError,
                        resourceId: _this.site.id
                    });
                    _this.trackEvent(error_ids_1.ErrorIds.unableToRetrieveRuntimeKeyFromRuntime, {
                        status: error.status.toString(),
                        content: error.text(),
                    });
                }
            });
        });
    };
    FunctionApp.prototype.getBindingConfig = function () {
        var _this = this;
        try {
            if (localStorage.getItem('dev-bindings')) {
                var devBindings = JSON.parse(localStorage.getItem('dev-bindings'));
                this.localize(devBindings);
                return Observable_1.Observable.of(devBindings);
            }
        }
        catch (e) {
            console.error(e);
        }
        return this.getExtensionVersion()
            .mergeMap(function (extensionVersion) {
            return _this._cacheService.get(constants_1.Constants.serviceHost + 'api/bindingconfig?runtime=' + extensionVersion, false, _this.getPortalHeaders());
        })
            .retryWhen(this.retryAntares)
            .map(function (r) {
            var object = r.json();
            _this.localize(object);
            return object;
        });
    };
    Object.defineProperty(FunctionApp.prototype, "HostSecrets", {
        get: function () {
            return this.masterKey;
        },
        enumerable: true,
        configurable: true
    });
    FunctionApp.prototype.getTrialResource = function (provider) {
        var url = this._tryAppServiceUrl + '/api/resource?appServiceName=Function'
            + (provider ? '&provider=' + provider : '');
        return this._http.get(url, { headers: this.getTryAppServiceHeaders() })
            .retryWhen(this.retryGetTrialResource)
            .map(function (r) { return r.json(); });
    };
    FunctionApp.prototype.createTrialResource = function (selectedTemplate, provider, functionName) {
        var url = this._tryAppServiceUrl + '/api/resource?appServiceName=Function'
            + (provider ? '&provider=' + provider : '')
            + '&templateId=' + encodeURIComponent(selectedTemplate.id)
            + '&functionName=' + encodeURIComponent(functionName);
        var template = {
            name: selectedTemplate.id,
            appService: 'Function',
            language: selectedTemplate.metadata.language,
            githubRepo: ''
        };
        return this._http.post(url, JSON.stringify(template), { headers: this.getTryAppServiceHeaders() })
            .retryWhen(this.retryCreateTrialResource)
            .map(function (r) { return r.json(); });
    };
    FunctionApp.prototype.updateFunction = function (fi) {
        var _this = this;
        cache_decorator_1.ClearAllFunctionCache(fi);
        var fiCopy = {};
        for (var prop in fi) {
            if (fi.hasOwnProperty(prop) && prop !== "functionApp") {
                fiCopy[prop] = fi[prop];
            }
        }
        return this._http.put(fi.href, JSON.stringify(fiCopy), { headers: this.getScmSiteHeaders() })
            .map(function (r) { return r.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToUpdateFunction + fi.name); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToUpdateFunction, { functionName: fi.name }),
                    errorId: error_ids_1.ErrorIds.unableToUpdateFunction + fi.name,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToUpdateFunction, {
                    status: error.status.toString(),
                    content: error.text(),
                });
            }
        });
    };
    FunctionApp.prototype.getFunctionErrors = function (fi, handleUnauthorized) {
        var _this = this;
        handleUnauthorized = typeof handleUnauthorized !== 'undefined' ? handleUnauthorized : true;
        return this.getAuthSettings()
            .mergeMap(function (authSettings) {
            return authSettings.clientCertEnabled
                ? Observable_1.Observable.of([])
                : _this._http.get(_this.mainSiteUrl + "/admin/functions/" + fi.name + "/status", { headers: _this.getMainSiteHeaders() })
                    .retryWhen(_this.retryAntares)
                    .map(function (r) { return (r.json().errors || []); })
                    .catch(function (error) {
                    if (handleUnauthorized && error.status === 401) {
                        _this.trackEvent(error_ids_1.ErrorIds.unauthorizedTalkingToRuntime, {
                            usedKey: _this.sanitize(_this.masterKey)
                        });
                        return _this.getHostSecretsFromScm().mergeMap(function (r) { return _this.getFunctionErrors(fi, false); });
                    }
                    else {
                        throw error;
                    }
                })
                    .catch(function (e) { return Observable_1.Observable.of(null); });
        });
    };
    FunctionApp.prototype.getHostErrors = function (handleUnauthorized) {
        var _this = this;
        handleUnauthorized = typeof handleUnauthorized !== 'undefined' ? handleUnauthorized : true;
        return this.getAuthSettings()
            .mergeMap(function (authSettings) {
            if (authSettings.clientCertEnabled || !_this.masterKey) {
                return Observable_1.Observable.of([]);
            }
            else {
                return _this._http.get(_this.mainSiteUrl + "/admin/host/status", { headers: _this.getMainSiteHeaders() })
                    .retryWhen(function (e) { return e.scan(function (errorCount, err) {
                    // retry 12 times with 5 seconds delay. This would retry for 1 minute before throwing.
                    if (errorCount >= 10 || err.status === 401) {
                        throw err;
                    }
                    return errorCount + 1;
                }, 0).delay(2000); })
                    .map(function (r) { return (r.json().errors || []); })
                    .catch(function (error) {
                    if (handleUnauthorized && error.status === 401) {
                        _this.trackEvent(error_ids_1.ErrorIds.unauthorizedTalkingToRuntime, {
                            usedKey: _this.sanitize(_this.masterKey)
                        });
                        return _this.getHostSecretsFromScm().mergeMap(function (r) { return _this.getHostErrors(false); });
                    }
                    else {
                        throw error;
                    }
                })
                    .do(function (r) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.functionRuntimeIsUnableToStart); }, function (error) {
                    if (!error.isHandled) {
                        _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                            message: _this._translateService.instant(portal_resources_1.PortalResources.error_functionRuntimeIsUnableToStart),
                            errorId: error_ids_1.ErrorIds.functionRuntimeIsUnableToStart,
                            errorType: error_event_1.ErrorType.RuntimeError,
                            resourceId: _this.site.id
                        });
                        _this.trackEvent(error_ids_1.ErrorIds.functionRuntimeIsUnableToStart, {
                            status: error.status.toString(),
                            content: error.text(),
                        });
                    }
                });
            }
        });
    };
    FunctionApp.prototype.getFunctionHostStatus = function (handleUnauthorized) {
        var _this = this;
        handleUnauthorized = typeof handleUnauthorized !== 'undefined' ? handleUnauthorized : true;
        return this.getAuthSettings()
            .mergeMap(function (authSettings) {
            if (authSettings.clientCertEnabled || !_this.masterKey) {
                return Observable_1.Observable.of(null);
            }
            else {
                return _this._http.get(_this.mainSiteUrl + "/admin/host/status", { headers: _this.getMainSiteHeaders() })
                    .map(function (r) { return (r.json()); })
                    .catch(function (error) {
                    if (handleUnauthorized && error.status === 401) {
                        _this.trackEvent(error_ids_1.ErrorIds.unauthorizedTalkingToRuntime, {
                            usedKey: _this.sanitize(_this.masterKey)
                        });
                        return _this.getHostSecretsFromScm().mergeMap(function (r) { return _this.getFunctionHostStatus(false); });
                    }
                    else {
                        throw error;
                    }
                })
                    .catch(function (e) { return Observable_1.Observable.of(null); });
            }
        });
    };
    //getFunctionAppArmId() {
    //    if (this.functionContainer && this.functionContainer.id && this.functionContainer.id.trim().length !== 0) {
    //        return this.functionContainer.id;
    //    } else if (this._scmUrl) {
    //        return this._scmUrl;
    //    } else {
    //        return 'Unknown';
    //    }
    //}
    FunctionApp.prototype.getOldLogs = function (fi, range) {
        var _this = this;
        var url = this._scmUrl + "/api/vfs/logfiles/application/functions/function/" + fi.name + "/";
        return this._http.get(url, { headers: this.getScmSiteHeaders() })
            .catch(function (e) { return Observable_1.Observable.of({ json: function () { return []; } }); })
            .mergeMap(function (r) {
            var files = r.json();
            if (files.length > 0) {
                var headers = _this.getScmSiteHeaders();
                headers.append('Range', "bytes=-" + range);
                files
                    .map(function (e) { e.parsedTime = new Date(e.mtime); return e; })
                    .sort(function (a, b) { return a.parsedTime.getTime() - b.parsedTime.getTime(); });
                return _this._http.get(files.pop().href, { headers: headers })
                    .map(function (f) {
                    var content = f.text();
                    var index = content.indexOf('\n');
                    return (index !== -1
                        ? content.substring(index + 1)
                        : content);
                });
            }
            else {
                return Observable_1.Observable.of('');
            }
        });
    };
    FunctionApp.prototype.getVfsObjects = function (fi) {
        var _this = this;
        var href = typeof fi === 'string' ? fi : fi.script_root_path_href;
        return this._http.get(href, { headers: this.getScmSiteHeaders() })
            .map(function (e) { return e.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToRetrieveDirectoryContent); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToRetrieveDirectoryContent),
                    errorId: error_ids_1.ErrorIds.unableToRetrieveDirectoryContent,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToRetrieveDirectoryContent, {
                    content: error.text(),
                    status: error.status.toString()
                });
            }
        });
    };
    FunctionApp.prototype.clearAllCachedData = function () { };
    FunctionApp.prototype.getLatestRuntime = function () {
        return this._http.get(constants_1.Constants.serviceHost + 'api/latestruntime', { headers: this.getPortalHeaders() })
            .map(function (r) {
            return r.json();
        })
            .retryWhen(this.retryAntares);
    };
    FunctionApp.prototype.getFunctionKeys = function (functionInfo, handleUnauthorized) {
        var _this = this;
        handleUnauthorized = typeof handleUnauthorized !== 'undefined' ? handleUnauthorized : true;
        return this.getAuthSettings()
            .mergeMap(function (authSettings) {
            if (authSettings.clientCertEnabled) {
                return Observable_1.Observable.of({ keys: [], links: [] });
            }
            return _this._http.get(_this.mainSiteUrl + "/admin/functions/" + functionInfo.name + "/keys", { headers: _this.getMainSiteHeaders() })
                .retryWhen(function (error) { return error.scan(function (errorCount, err) {
                if (err.isHandled || (err.status < 500 && err.status !== 404) || errorCount >= 10) {
                    throw err;
                }
                else {
                    return errorCount + 1;
                }
            }, 0).delay(1000); })
                .map(function (r) { return r.json(); })
                .catch(function (error) {
                if (handleUnauthorized && error.status === 401) {
                    _this.trackEvent(error_ids_1.ErrorIds.unauthorizedTalkingToRuntime, {
                        usedKey: _this.sanitize(_this.masterKey)
                    });
                    return _this.getHostSecretsFromScm().mergeMap(function (r) { return _this.getFunctionKeys(functionInfo, false); });
                }
                else {
                    throw error;
                }
            })
                .do(function (r) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToRetrieveFunctionKeys + functionInfo.name); }, function (error) {
                if (!error.isHandled) {
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                        message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToRetrieveFunctionKeys, { functionName: functionInfo.name }),
                        errorId: error_ids_1.ErrorIds.unableToRetrieveFunctionKeys + functionInfo.name,
                        errorType: error_event_1.ErrorType.RuntimeError,
                        resourceId: _this.site.id
                    });
                    _this.trackEvent(error_ids_1.ErrorIds.unableToRetrieveFunctionKeys, {
                        status: error.status.toString(),
                        content: error.text(),
                        functionName: functionInfo.name
                    });
                }
            });
        });
    };
    FunctionApp.prototype.createKey = function (keyName, keyValue, functionInfo, handleUnauthorized) {
        var _this = this;
        handleUnauthorized = typeof handleUnauthorized !== 'undefined' ? handleUnauthorized : true;
        var url = functionInfo
            ? this.mainSiteUrl + "/admin/functions/" + functionInfo.name + "/keys/" + keyName
            : this.mainSiteUrl + "/admin/host/keys/" + keyName;
        var result;
        if (keyValue) {
            var body = {
                name: keyName,
                value: keyValue
            };
            result = this._http.put(url, JSON.stringify(body), { headers: this.getMainSiteHeaders() })
                .retryWhen(this.retryAntares)
                .map(function (r) { return r.json(); });
        }
        else {
            result = this._http.post(url, '', { headers: this.getMainSiteHeaders() })
                .retryWhen(this.retryAntares)
                .map(function (r) { return r.json(); });
        }
        return result
            .catch(function (error) {
            if (handleUnauthorized && error.status === 401) {
                _this.trackEvent(error_ids_1.ErrorIds.unauthorizedTalkingToRuntime, {
                    usedKey: _this.sanitize(_this.masterKey)
                });
                return _this.getHostSecretsFromScm().mergeMap(function (r) { return _this.createKey(keyName, keyValue, functionInfo, false); });
            }
            else {
                throw error;
            }
        })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToCreateFunctionKey + functionInfo + keyName); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToCreateFunctionKey, { functionName: functionInfo.name, keyName: keyName }),
                    errorId: error_ids_1.ErrorIds.unableToCreateFunctionKey + functionInfo + keyName,
                    errorType: error_event_1.ErrorType.RuntimeError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToCreateFunctionKey, {
                    status: error.status.toString(),
                    content: error.text(),
                    functionName: functionInfo.name,
                    keyName: keyName
                });
            }
        });
    };
    FunctionApp.prototype.deleteKey = function (key, functionInfo, handleUnauthorized) {
        var _this = this;
        handleUnauthorized = typeof handleUnauthorized !== 'undefined' ? handleUnauthorized : true;
        var url = functionInfo
            ? this.mainSiteUrl + "/admin/functions/" + functionInfo.name + "/keys/" + key.name
            : this.mainSiteUrl + "/admin/host/keys/" + key.name;
        return this._http.delete(url, { headers: this.getMainSiteHeaders() })
            .retryWhen(this.retryAntares)
            .catch(function (error) {
            if (handleUnauthorized && error.status === 401) {
                _this.trackEvent(error_ids_1.ErrorIds.unauthorizedTalkingToRuntime, {
                    usedKey: _this.sanitize(_this.masterKey)
                });
                return _this.getHostSecretsFromScm().mergeMap(function (r) { return _this.deleteKey(key, functionInfo, false); });
            }
            else {
                throw error;
            }
        })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToDeleteFunctionKey + functionInfo + key.name); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToDeleteFunctionKey, { functionName: functionInfo.name, keyName: key.name }),
                    errorId: error_ids_1.ErrorIds.unableToDeleteFunctionKey + functionInfo + key.name,
                    errorType: error_event_1.ErrorType.RuntimeError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToDeleteFunctionKey, {
                    status: error.status.toString(),
                    content: error.text(),
                    functionName: functionInfo.name,
                    keyName: key.name
                });
            }
        });
    };
    FunctionApp.prototype.renewKey = function (key, functionInfo, handleUnauthorized) {
        var _this = this;
        handleUnauthorized = typeof handleUnauthorized !== 'undefined' ? handleUnauthorized : true;
        var url = functionInfo
            ? this.mainSiteUrl + "/admin/functions/" + functionInfo.name + "/keys/" + key.name
            : this.mainSiteUrl + "/admin/host/keys/" + key.name;
        return this._http.post(url, '', { headers: this.getMainSiteHeaders() })
            .retryWhen(this.retryAntares)
            .catch(function (error) {
            if (handleUnauthorized && error.status === 401) {
                _this.trackEvent(error_ids_1.ErrorIds.unauthorizedTalkingToRuntime, {
                    usedKey: _this.sanitize(_this.masterKey)
                });
                return _this.getHostSecretsFromScm().mergeMap(function (r) { return _this.renewKey(key, functionInfo, false); });
            }
            else {
                throw error;
            }
        })
            .do(function (r) {
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToRenewFunctionKey + functionInfo + key.name);
            if (!functionInfo && key.name === '_master') {
                _this.masterKey = r.json().value;
            }
        }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToRenewFunctionKey, { functionName: functionInfo.name, keyName: key.name }),
                    errorId: error_ids_1.ErrorIds.unableToRenewFunctionKey + functionInfo + key.name,
                    errorType: error_event_1.ErrorType.RuntimeError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToRenewFunctionKey, {
                    status: error.status.toString(),
                    content: error.text(),
                    functionName: functionInfo.name,
                    keyName: key.name
                });
            }
        });
    };
    FunctionApp.prototype.fireSyncTrigger = function () {
        var url = this._scmUrl + "/api/functions/synctriggers";
        this._http.post(url, '', { headers: this.getScmSiteHeaders() })
            .subscribe(function (success) { return console.log(success); }, function (error) { return console.log(error); });
    };
    FunctionApp.prototype.getJson = function (uri) {
        return this._http.get(uri, { headers: this.getMainSiteHeaders() })
            .map(function (r) { return r.json(); });
    };
    FunctionApp.prototype.checkIfSourceControlEnabled = function () {
        return this._cacheService.getArm(this.site.id + "/config/web")
            .map(function (r) {
            var config = r.json();
            return !config.properties['scmType'] || config.properties['scmType'] !== 'None';
        })
            .catch(function (e) { return Observable_1.Observable.of(false); });
    };
    FunctionApp.prototype.getFunctionAppEditMode = function () {
        // The we have 2 settings to check here. There is the SourceControl setting which comes from /config/web
        // and there is FUNCTION_APP_EDIT_MODE which comes from app settings.
        // editMode (true -> readWrite, false -> readOnly)
        // Table
        // |Slots | SourceControl | AppSettingValue | EditMode                      |
        // |------|---------------|-----------------|-------------------------------|
        // | No   | true          | readWrite       | ReadWriteSourceControlled     |
        // | No   | true          | readOnly        | ReadOnlySourceControlled      |
        // | No   | true          | undefined       | ReadOnlySourceControlled      |
        // | No   | false         | readWrite       | ReadWrite                     |
        // | No   | false         | readOnly        | ReadOnly                      |
        // | No   | false         | undefined       | ReadWrite                     |
        var _this = this;
        // | Yes  | true          | readWrite       | ReadWriteSourceControlled     |
        // | Yes  | true          | readOnly        | ReadOnlySourceControlled      |
        // | Yes  | true          | undefined       | ReadOnlySourceControlled      |
        // | Yes  | false         | readWrite       | ReadWrite                     |
        // | Yes  | false         | readOnly        | ReadOnly                      |
        // | Yes  | false         | undefined       | ReadOnlySlots                 |
        // |______|_______________|_________________|_______________________________|
        if (!this._editModeSubject) {
            this._editModeSubject = new Subject_1.Subject();
        }
        Observable_1.Observable.zip(this.checkIfSourceControlEnabled(), this._cacheService.postArm(this.site.id + "/config/appsettings/list", true), slots_service_1.SlotsService.isSlot(this.site.id)
            ? Observable_1.Observable.of(true)
            : this._slotsService.getSlotsList(this.site.id).map(function (r) { return r.length > 0; }), function (a, b, s) { return ({ sourceControlEnabled: a, appSettingsResponse: b, hasSlots: s }); })
            .map(function (result) {
            var appSettings = result.appSettingsResponse.json();
            var sourceControlled = result.sourceControlEnabled;
            var editModeSettingString = appSettings.properties[constants_1.Constants.functionAppEditModeSettingName] || '';
            editModeSettingString = editModeSettingString.toLocaleLowerCase();
            if (editModeSettingString === constants_1.Constants.ReadWriteMode) {
                return sourceControlled ? function_app_edit_mode_1.FunctionAppEditMode.ReadWriteSourceControlled : function_app_edit_mode_1.FunctionAppEditMode.ReadWrite;
            }
            else if (editModeSettingString === constants_1.Constants.ReadOnlyMode) {
                return sourceControlled ? function_app_edit_mode_1.FunctionAppEditMode.ReadOnlySourceControlled : function_app_edit_mode_1.FunctionAppEditMode.ReadOnly;
            }
            else if (sourceControlled) {
                return function_app_edit_mode_1.FunctionAppEditMode.ReadOnlySourceControlled;
            }
            else {
                return result.hasSlots ? function_app_edit_mode_1.FunctionAppEditMode.ReadOnlySlots : function_app_edit_mode_1.FunctionAppEditMode.ReadWrite;
            }
        })
            .catch(function (e) { return Observable_1.Observable.of(function_app_edit_mode_1.FunctionAppEditMode.ReadWrite); })
            .subscribe(function (r) { return _this._editModeSubject.next(r); });
        return this._editModeSubject;
    };
    FunctionApp.prototype.getAuthSettings = function () {
        var _this = this;
        if (this.tryFunctionsScmCreds) {
            return Observable_1.Observable.of({
                easyAuthEnabled: false,
                AADConfigured: false,
                AADNotConfigured: false,
                clientCertEnabled: false
            });
        }
        return this._cacheService.postArm(this.site.id + "/config/authsettings/list")
            .map(function (r) {
            var auth = r.json();
            return {
                easyAuthEnabled: auth.properties['enabled'] && auth.properties['unauthenticatedClientAction'] !== 1,
                AADConfigured: auth.properties['clientId'] ? true : false,
                AADNotConfigured: auth.properties['clientId'] ? false : true,
                clientCertEnabled: _this.site.properties.clientCertEnabled
            };
        });
    };
    FunctionApp.prototype.diagnose = function (functionContainer) {
        var _this = this;
        return this._http.post(constants_1.Constants.serviceHost + ("api/diagnose" + functionContainer.id), '', { headers: this.getPortalHeaders() })
            .map(function (r) { return r.json(); })
            .catch(function (error) {
            _this.trackEvent(error_ids_1.ErrorIds.errorCallingDiagnoseApi, {
                error: error.text(),
                status: error.status.toString(),
                resourceId: functionContainer.id
            });
            return Observable_1.Observable.of([]);
        });
    };
    /**
     * This method just pings the root of the SCM site. It doesn't care about the response in anyway or use it.
     */
    FunctionApp.prototype.pingScmSite = function () {
        return this._http.get(this._scmUrl, { headers: this.getScmSiteHeaders() })
            .map(function (_) { return null; })
            .catch(function (e) { return Observable_1.Observable.of(null); });
    };
    FunctionApp.prototype.getExtensionVersion = function () {
        return this._cacheService.postArm(this.site.id + "/config/appsettings/list")
            .map(function (r) {
            var appSettingsArm = r.json();
            return appSettingsArm.properties[constants_1.Constants.runtimeVersionAppSettingName];
        });
    };
    // to talk to scm site
    FunctionApp.prototype.getScmSiteHeaders = function (contentType) {
        contentType = contentType || 'application/json';
        var headers = new http_1.Headers();
        headers.append('Content-Type', contentType);
        headers.append('Accept', 'application/json,*/*');
        if (!this._globalStateService.showTryView && this.token) {
            headers.append('Authorization', "Bearer " + this.token);
        }
        if (this.tryFunctionsScmCreds) {
            headers.append('Authorization', "Basic " + this.tryFunctionsScmCreds);
        }
        return headers;
    };
    FunctionApp.prototype.getMainSiteHeaders = function (contentType) {
        contentType = contentType || 'application/json';
        var headers = new http_1.Headers();
        headers.append('Content-Type', contentType);
        headers.append('Accept', 'application/json,*/*');
        headers.append('x-functions-key', this.masterKey);
        return headers;
    };
    // to talk to Functions Portal
    FunctionApp.prototype.getPortalHeaders = function (contentType) {
        contentType = contentType || 'application/json';
        var headers = new http_1.Headers();
        headers.append('Content-Type', contentType);
        headers.append('Accept', 'application/json,*/*');
        if (this.token) {
            headers.append('client-token', this.token);
            headers.append('portal-token', this.token);
        }
        return headers;
    };
    // to talk to TryAppservice
    FunctionApp.prototype.getTryAppServiceHeaders = function (contentType) {
        contentType = contentType || 'application/json';
        var headers = new http_1.Headers();
        headers.append('Content-Type', contentType);
        headers.append('Accept', 'application/json,*/*');
        if (this._globalStateService.TryAppServiceToken) {
            headers.append('Authorization', "Bearer " + this._globalStateService.TryAppServiceToken);
        }
        else {
            headers.append('ms-x-user-agent', 'Functions/');
        }
        return headers;
    };
    FunctionApp.prototype.localize = function (objectToLocalize) {
        if ((typeof objectToLocalize === 'string') && (objectToLocalize.startsWith('$'))) {
            var key = objectToLocalize.substring(1, objectToLocalize.length);
            objectToLocalize = this._translateService.instant(key);
        }
        else if (Array.isArray(objectToLocalize)) {
            for (var i = 0; i < objectToLocalize.length; i++) {
                objectToLocalize[i] = this.localize(objectToLocalize[i]);
            }
        }
        else if (typeof objectToLocalize === 'object') {
            for (var property in objectToLocalize) {
                if (property === 'files' || property === 'defaultValue' || property === 'function') {
                    continue;
                }
                if (objectToLocalize.hasOwnProperty(property)) {
                    objectToLocalize[property] = this.localize(objectToLocalize[property]);
                }
            }
        }
        return objectToLocalize;
    };
    FunctionApp.prototype.retryAntares = function (error) {
        return error.scan(function (errorCount, err) {
            if (err.isHandled || err.status < 500 || errorCount >= 10) {
                throw err;
            }
            else {
                return errorCount + 1;
            }
        }, 0).delay(1000);
    };
    FunctionApp.prototype.retryCreateTrialResource = function (error) {
        return error.scan(function (errorCount, err) {
            // 400 => you already have a resource, 403 => No login creds provided
            if (err.status === 400 || err.status === 403 || errorCount >= 10) {
                throw err;
            }
            else {
                return errorCount + 1;
            }
        }, 0).delay(1000);
    };
    FunctionApp.prototype.retryGetTrialResource = function (error) {
        return error.scan(function (errorCount, err) {
            // 403 => No login creds provided
            if (err.status === 403 || errorCount >= 10) {
                throw err;
            }
            else {
                return errorCount + 1;
            }
        }, 0).delay(1000);
    };
    FunctionApp.prototype.runFunctionInternal = function (response, functionInfo) {
        var _this = this;
        return response
            .catch(function (e) {
            return _this.getAuthSettings()
                .mergeMap(function (authSettings) {
                if (authSettings.easyAuthEnabled) {
                    return Observable_1.Observable.of({
                        status: 401,
                        statusText: _this.statusCodeToText(401),
                        text: function () { return _this._translateService.instant(portal_resources_1.PortalResources.functionService_authIsEnabled); }
                    });
                }
                else if (authSettings.clientCertEnabled) {
                    return Observable_1.Observable.of({
                        status: 401,
                        statusText: _this.statusCodeToText(401),
                        text: function () { return _this._translateService.instant(portal_resources_1.PortalResources.functionService_clientCertEnabled); }
                    });
                }
                else if (e.status === 200 && e.type === http_1.ResponseType.Error) {
                    return Observable_1.Observable.of({
                        status: 502,
                        statusText: _this.statusCodeToText(502),
                        text: function () { return _this._translateService.instant(portal_resources_1.PortalResources.functionService_errorRunningFunc, {
                            name: functionInfo.name
                        }); }
                    });
                }
                else if (e.status === 0 && e.type === http_1.ResponseType.Error) {
                    return Observable_1.Observable.of({
                        status: 0,
                        statusText: _this.statusCodeToText(0),
                        text: function () { return ''; }
                    });
                }
                else {
                    var text_1 = '';
                    try {
                        text_1 = JSON.stringify(e.json(), undefined, 2);
                    }
                    catch (ex) {
                        text_1 = e.text();
                    }
                    return Observable_1.Observable.of({
                        status: e.status,
                        statusText: _this.statusCodeToText(e.status),
                        text: function () { return text_1; }
                    });
                }
            });
        })
            .map(function (r) { return ({ statusCode: r.status, statusText: _this.statusCodeToText(r.status), content: r.text() }); });
    };
    /**
     * returns the file name from a VfsObject or an href
     * @param file either a VfsObject or a string representing the file's href.
     */
    FunctionApp.prototype.getFileName = function (file) {
        if (typeof file === 'string') {
            // if `file` is a string, that means it's in the format:
            //     https://<scmUrl>/api/vfs/path/to/file.ext
            return file
                .split('/') // [ 'https:', '', '<scmUrl>', 'api', 'vfs', 'path', 'to', 'file.ext' ]
                .pop(); // 'file.ext'
        }
        else {
            return file.name;
        }
    };
    /**
     * This function is just a wrapper around AiService.trackEvent. It injects default params expected from this class.
     * Currently that's only scmUrl
     * @param params any additional parameters to get added to the default parameters that this class reports to AppInsights
     */
    FunctionApp.prototype.trackEvent = function (name, params) {
        var standardParams = {
            scmUrl: this._scmUrl
        };
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                standardParams[key] = params[key];
            }
        }
        this._aiService.trackEvent(name, standardParams);
    };
    FunctionApp.prototype.sanitize = function (value) {
        if (value) {
            return value.substring(0, Math.min(3, value.length));
        }
        else {
            return 'undefined';
        }
    };
    FunctionApp.prototype.getHostname = function (url) {
        var anchor = document.createElement('a');
        anchor.setAttribute('href', url);
        var link = anchor.hostname;
        anchor = null;
        return link;
    };
    FunctionApp.prototype.getGeneratedSwaggerData = function (key) {
        var _this = this;
        var url = this.getMainSiteUrl() + '/admin/host/swagger/default?code=' + key;
        return this._http.get(url).map(function (r) { return r.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToloadGeneratedAPIDefinition); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToloadGeneratedAPIDefinition),
                    errorId: error_ids_1.ErrorIds.unableToloadGeneratedAPIDefinition,
                    errorType: error_event_1.ErrorType.RuntimeError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToloadGeneratedAPIDefinition, {
                    status: error.status.toString(),
                    content: error.text(),
                });
            }
        });
    };
    FunctionApp.prototype.getSwaggerDocument = function (key) {
        var url = this.getMainSiteUrl() + '/admin/host/swagger?code=' + key;
        return this._http.get(url).map(function (r) { return r.json(); });
    };
    FunctionApp.prototype.addOrUpdateSwaggerDocument = function (swaggerUrl, content) {
        var _this = this;
        return this._http.post(swaggerUrl, content).map(function (r) { return r.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToUpdateSwaggerData); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToUpdateSwaggerData),
                    errorId: error_ids_1.ErrorIds.unableToUpdateSwaggerData,
                    errorType: error_event_1.ErrorType.RuntimeError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToUpdateSwaggerData, {
                    status: error.status.toString(),
                    content: error.text(),
                });
            }
        });
    };
    FunctionApp.prototype.deleteSwaggerDocument = function (swaggerUrl) {
        var _this = this;
        return this._http.delete(swaggerUrl)
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToDeleteSwaggerData); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToDeleteSwaggerData),
                    errorId: error_ids_1.ErrorIds.unableToDeleteSwaggerData,
                    errorType: error_event_1.ErrorType.RuntimeError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToDeleteSwaggerData, {
                    status: error.status.toString(),
                    content: error.text(),
                });
            }
        });
    };
    FunctionApp.prototype.saveHostJson = function (jsonString) {
        var _this = this;
        var headers = this.getScmSiteHeaders();
        headers.append('If-Match', '*');
        return this._http.put(this._scmUrl + "/api/functions/config", jsonString, { headers: headers })
            .map(function (r) { return r.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToUpdateRuntimeConfig); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToUpdateRuntimeConfig),
                    errorId: error_ids_1.ErrorIds.unableToUpdateRuntimeConfig,
                    errorType: error_event_1.ErrorType.ApiError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToUpdateRuntimeConfig, {
                    status: error.status.toString(),
                    content: error.text(),
                });
            }
        });
    };
    FunctionApp.prototype.createSystemKey = function (keyName) {
        var _this = this;
        var headers = this.getMainSiteHeaders();
        headers.append('If-Match', '*');
        return this._http.post(this.mainSiteUrl + "/admin/host/systemkeys/" + keyName, '', { headers: headers })
            .map(function (r) { return r.json(); })
            .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToCreateSwaggerKey); }, function (error) {
            if (!error.isHandled) {
                _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                    message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToCreateSwaggerKey),
                    errorId: error_ids_1.ErrorIds.unableToCreateSwaggerKey,
                    errorType: error_event_1.ErrorType.RuntimeError,
                    resourceId: _this.site.id
                });
                _this.trackEvent(error_ids_1.ErrorIds.unableToCreateSwaggerKey, {
                    status: error.status.toString(),
                    content: error.text(),
                });
            }
        });
    };
    FunctionApp.prototype.getSystemKey = function () {
        var _this = this;
        var masterKey = this.masterKey
            ? Observable_1.Observable.of(this.masterKey)
            : this.getHostSecretsFromScm().map(function (r) { return r.json().masterKey; });
        return masterKey
            .mergeMap(function (r) {
            var headers = _this.getMainSiteHeaders();
            return _this._http.get(_this.mainSiteUrl + "/admin/host/systemkeys", { headers: headers })
                .map(function (r) { return r.json(); })
                .do(function (_) { return _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.ClearError, error_ids_1.ErrorIds.unableToGetSystemKey); }, function (error) {
                if (!error.isHandled) {
                    _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                        message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToGetSystemKey, { keyName: constants_1.Constants.swaggerSecretName }),
                        errorId: error_ids_1.ErrorIds.unableToCreateSwaggerKey,
                        errorType: error_event_1.ErrorType.RuntimeError,
                        resourceId: _this.site.id
                    });
                    _this.trackEvent(error_ids_1.ErrorIds.unableToGetSystemKey, {
                        status: error.status.toString(),
                        content: error.text(),
                    });
                }
            });
        });
    };
    return FunctionApp;
}());
__decorate([
    cache_decorator_1.Cache('href'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "getFileContent", null);
__decorate([
    cache_decorator_1.ClearCache('getFileContent', 'href'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "saveFile", null);
__decorate([
    cache_decorator_1.ClearCache('getFileContent', 'href'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "deleteFile", null);
__decorate([
    cache_decorator_1.ClearCache('getFunctions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "createFunction", null);
__decorate([
    cache_decorator_1.ClearCache('getFunctions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "createFunctionV2", null);
__decorate([
    cache_decorator_1.ClearCache('clearAllCachedData'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "deleteFunction", null);
__decorate([
    cache_decorator_1.Cache(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "getDesignerSchema", null);
__decorate([
    cache_decorator_1.Cache('secrets_file_href'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "getSecrets", null);
__decorate([
    cache_decorator_1.ClearCache('getSecrets', 'secrets_file_href'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "setSecrets", null);
__decorate([
    cache_decorator_1.ClearCache('getFunction', 'href'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "saveFunction", null);
__decorate([
    cache_decorator_1.Cache('href'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "getVfsObjects", null);
__decorate([
    cache_decorator_1.ClearCache('clearAllCachedData'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "clearAllCachedData", null);
__decorate([
    cache_decorator_1.Cache(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FunctionApp.prototype, "getJson", null);
exports.FunctionApp = FunctionApp;
//# sourceMappingURL=function-app.js.map