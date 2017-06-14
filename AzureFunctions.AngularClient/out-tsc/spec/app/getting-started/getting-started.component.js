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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/map");
require("rxjs/add/operator/retryWhen");
require("rxjs/add/operator/scan");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/forkJoin");
require("rxjs/add/observable/of");
require("rxjs/add/observable/zip");
var core_2 = require("@ngx-translate/core");
var constants_1 = require("./../shared/models/constants");
var user_service_1 = require("../shared/services/user.service");
var functions_service_1 = require("../shared/services/functions.service");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var arm_service_1 = require("../shared/services/arm.service");
var telemetry_service_1 = require("../shared/services/telemetry.service");
var global_state_service_1 = require("../shared/services/global-state.service");
var portal_resources_1 = require("../shared/models/portal-resources");
var ai_service_1 = require("../shared/services/ai.service");
var GettingStartedComponent = (function () {
    function GettingStartedComponent(_userService, _functionsService, _broadcastService, _armService, _telemetryService, _globalStateService, _translateService, _aiService, _http) {
        var _this = this;
        this._userService = _userService;
        this._functionsService = _functionsService;
        this._broadcastService = _broadcastService;
        this._armService = _armService;
        this._telemetryService = _telemetryService;
        this._globalStateService = _globalStateService;
        this._translateService = _translateService;
        this._aiService = _aiService;
        this._http = _http;
        this.isValidContainerName = true;
        // http://stackoverflow.com/a/8084248/3234163
        var secret = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        this.functionContainerName = "functions" + this.makeId();
        this.functionContainers = [];
        this.userReady = new core_1.EventEmitter();
        this.geoRegions = [];
        this.functionContainerNameEvent = new core_1.EventEmitter();
        this.functionContainerNameEvent
            .switchMap(function () { return _this.validateContainerName(_this.functionContainerName); })
            .subscribe(function (v) {
            _this.isValidContainerName = v.isValid;
            _this.validationError = v.reason;
        });
    }
    GettingStartedComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._globalStateService.setBusyState();
        Observable_1.Observable.zip(this._userService.getStartupInfo(), this._userService.getUser(), function (i, u) { return ({ info: i, user: u }); })
            .subscribe(function (r) {
            _this.subscriptions = r.info.subscriptions
                .map(function (e) { return ({ displayLabel: e.displayName, value: e }); })
                .sort(function (a, b) { return a.displayLabel.localeCompare(b.displayLabel); });
            _this.user = r.user;
            _this._globalStateService.clearBusyState();
        });
    };
    GettingStartedComponent.prototype.createFunctionsContainer = function () {
        var _this = this;
        delete this.createError;
        this._globalStateService.setBusyState();
        this._telemetryService.track('gettingstarted-create-functionapp');
        this._createFunctionContainerHelper(this.selectedSubscription.subscriptionId, this.selectedGeoRegion, this.functionContainerName)
            .subscribe(function (r) {
            _this.userReady.emit(r);
            _this._globalStateService.clearBusyState();
        });
    };
    GettingStartedComponent.prototype.onSubscriptionSelect = function (value) {
        var _this = this;
        this._globalStateService.setBusyState();
        delete this.selectedGeoRegion;
        this._getFunctionContainers(value.subscriptionId)
            .subscribe(function (fc) {
            _this.selectedSubscription = value;
            _this.functionContainers = fc
                .map(function (c) { return ({
                displayLabel: c.name + " (" + c.location + ")",
                value: c
            }); })
                .sort(function (a, b) { return a.displayLabel.localeCompare(b.displayLabel); });
            _this._globalStateService.clearBusyState();
            _this.functionContainerNameEvent.emit(_this.functionContainerName);
        });
        this._getDynamicStampLocations(value.subscriptionId)
            .subscribe(function (r) {
            _this.geoRegions = r
                .map(function (e) { return ({ displayLabel: e.displayName, value: e.name }); })
                .sort(function (a, b) { return a.displayLabel.localeCompare(b.displayLabel); });
            if (_this.geoRegions.length === 0) {
                _this.createError = _this._translateService.instant(portal_resources_1.PortalResources.gettingStarted_subIsNotWhitelisted, { displayName: value.displayName, subscriptionId: value.subscriptionId });
            }
            else {
                delete _this.createError;
            }
        });
    };
    GettingStartedComponent.prototype.onGeoRegionChange = function (value) {
        this.selectedGeoRegion = value;
    };
    GettingStartedComponent.prototype.onContainerChange = function (value) {
        this.functionContainer = value;
    };
    GettingStartedComponent.prototype.openSelectedContainer = function () {
        this._warmUpFunctionApp(this.functionContainer.id);
        this.userReady.emit(this.functionContainer);
    };
    GettingStartedComponent.prototype.login = function () {
        window.location.replace(window.location.protocol + "//" + window.location.hostname + "/signin" + window.location.search);
    };
    // http://stackoverflow.com/a/1349426/3234163
    GettingStartedComponent.prototype.makeId = function () {
        var text = '';
        var possible = 'abcdef123456789';
        for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };
    GettingStartedComponent.prototype.validateContainerName = function (name) {
        var _this = this;
        var regEx = /^[0-9a-zA-Z][0-9a-zA-Z-]*[a-zA-Z0-9]$/;
        if (name.length < 2) {
            return Observable_1.Observable.of({ isValid: false, reason: this._translateService.instant(portal_resources_1.PortalResources.gettingStarted_validateContainer1) });
        }
        else if (name.length > 60) {
            return Observable_1.Observable.of({ isValid: false, reason: this._translateService.instant(portal_resources_1.PortalResources.gettingStarted_validateContainer2) });
        }
        else if (!name.match(regEx)) {
            return Observable_1.Observable.of({ isValid: false, reason: this._translateService.instant(portal_resources_1.PortalResources.gettingStarted_validateContainer3) });
        }
        else {
            return this._validateSiteNameAvailable(this.selectedSubscription.subscriptionId, name)
                .map(function (v) { return ({ isValid: v, reason: _this._translateService.instant(portal_resources_1.PortalResources.gettingStarted_validateContainer4, { funcName: name }) }); });
        }
    };
    GettingStartedComponent.prototype._validateSiteNameAvailable = function (subscriptionId, containerName) {
        var id = "/subscriptions/" + subscriptionId + "/providers/Microsoft.Web/ishostnameavailable/" + containerName;
        return this._armService.get(id, this._armService.websiteApiVersion)
            .map(function (r) { return (r.json().properties); });
    };
    GettingStartedComponent.prototype._getDynamicStampLocations = function (subscriptionId) {
        var dynamicUrl = this._armService.armUrl + "/subscriptions/" + subscriptionId + "/providers/Microsoft.Web/georegions?sku=Dynamic&api-version=" + this._armService.websiteApiVersion;
        var geoFencedId = "/subscriptions/" + subscriptionId + "/providers/Microsoft.Web";
        return Observable_1.Observable.zip(this._armService.send("GET", dynamicUrl).map(function (r) { return (r.json().value.map(function (e) { return e.properties; })); }), this._armService.get(geoFencedId, "2014-04-01").map(function (r) { return ([].concat.apply([], r.json().resourceTypes.filter(function (e) { return e.resourceType.toLowerCase() == 'sites'; }).map(function (e) { return e.locations; }))); }), function (d, g) { return ({ dynamicEnabled: d, geoFenced: g }); }).map(function (result) { return (result.dynamicEnabled.filter(function (e) { return !!result.geoFenced.find(function (g) { return g.toLowerCase() === e.name.toLowerCase(); }); })); });
    };
    GettingStartedComponent.prototype._warmUpFunctionApp = function (armId) {
        var siteName = armId.split('/').pop();
        this._http.get("https://" + siteName + ".azurewebsites.net")
            .subscribe(function (r) { return console.log(r); }, function (e) { return console.log(e); });
        this._armService.send("GET", "https://" + siteName + ".scm.azurewebsites.net")
            .subscribe(function (r) { return console.log(r); }, function (e) { return console.log(e); });
    };
    GettingStartedComponent.prototype._getFunctionContainers = function (subscription) {
        var url = this._armService.armUrl + "/subscriptions/" + subscription + "/resources?api-version=" + this._armService.armApiVersion + "&$filter=resourceType eq 'Microsoft.Web/sites'";
        return this._armService.send("GET", url)
            .map(function (r) {
            var sites = r.json().value;
            return sites.filter(function (e) { return e.kind === 'functionapp'; });
        });
    };
    GettingStartedComponent.prototype._createFunctionContainerHelper = function (subscription, geoRegion, name) {
        var result = new Subject_1.Subject();
        geoRegion = geoRegion.replace(/ /g, '');
        this._registerProviders(subscription, geoRegion, name, result);
        return result;
    };
    GettingStartedComponent.prototype._registerProviders = function (subscription, geoRegion, name, result) {
        var _this = this;
        var providersId = "/subscriptions/" + subscription + "/providers";
        var websiteRegisterId = "/subscriptions/" + subscription + "/providers/Microsoft.Web/register";
        var storageRegisterId = "/subscriptions/" + subscription + "/providers/Microsoft.Storage/register";
        var createApp = function () { return _this._getResourceGroup(subscription, geoRegion)
            .subscribe(function (rg) {
            _this._getStorageAccount(subscription, geoRegion)
                .subscribe(function (sa) { return sa ? _this._pullStorageAccount(subscription, geoRegion, sa, name, result) : _this._createStorageAccount(subscription, geoRegion, name, result); }, function (error) { return _this._createStorageAccount(subscription, geoRegion, name, result); });
        }, function (error) { return _this._createResourceGroup(subscription, geoRegion, name, result); }); };
        var registerProviders = function (providers) {
            var observables = [];
            if (!providers || !providers.find(function (e) { return e.toLowerCase() === 'microsoft.web'; })) {
                observables.push(_this._armService.post(websiteRegisterId, null, _this._armService.websiteApiVersion));
            }
            if (!providers || !providers.find(function (e) { return e.toLowerCase() === 'microsoft.storage'; })) {
                observables.push(_this._armService.post(storageRegisterId, null, _this._armService.storageApiVersion));
            }
            if (observables.length > 0) {
                Observable_1.Observable.forkJoin(observables)
                    .subscribe(function (r) { return createApp(); }, function (e) { return _this.completeError(result, e); });
            }
            else {
                createApp();
            }
        };
        this._armService.get(providersId, this._armService.armApiVersion)
            .map(function (r) { return (r.json().value.filter(function (e) { return e['registrationState'] === 'Registered'; }).map(function (e) { return e['namespace']; })); })
            .subscribe(function (p) { return registerProviders(p); }, function (e) { return registerProviders(); });
    };
    GettingStartedComponent.prototype._getResourceGroup = function (subscription, geoRegion) {
        var id = "/subscriptions/" + subscription + "/resourceGroups/AzureFunctions-" + geoRegion;
        return this._armService.get(id, this._armService.armApiVersion)
            .map(function (r) { return r.json(); });
    };
    GettingStartedComponent.prototype._createResourceGroup = function (subscription, geoRegion, functionAppName, result) {
        var _this = this;
        var id = "/subscriptions/" + subscription + "/resourceGroups/AzureFunctions-" + geoRegion;
        var body = {
            location: geoRegion
        };
        this._armService.put(id, body, this._armService.armApiVersion)
            .subscribe(function (r) { return _this._createStorageAccount(subscription, geoRegion, functionAppName, result); }, function (e) { return _this.completeError(result, e); });
    };
    GettingStartedComponent.prototype._getStorageAccount = function (subscription, geoRegion) {
        var id = "/subscriptions/" + subscription + "/resourceGroups/AzureFunctions-" + geoRegion + "/providers/Microsoft.Storage/storageAccounts";
        return this._armService.get(id, this._armService.storageApiVersion)
            .map(function (r) {
            var accounts = r.json().value;
            return accounts.find(function (sa) { return sa.name.startsWith('azurefunctions'); });
        });
    };
    GettingStartedComponent.prototype._pullStorageAccount = function (subscription, geoRegion, storageAccount, functionAppName, result, count) {
        var _this = this;
        if (count === void 0) { count = 0; }
        var id = typeof storageAccount === 'string'
            ? "/subscriptions/" + subscription + "/resourceGroups/AzureFunctions-" + geoRegion + "/providers/Microsoft.Storage/storageAccounts/" + storageAccount
            : "/subscriptions/" + subscription + "/resourceGroups/AzureFunctions-" + geoRegion + "/providers/Microsoft.Storage/storageAccounts/" + storageAccount.name;
        if (storageAccount &&
            typeof storageAccount !== 'string' &&
            storageAccount.properties.provisioningState === 'Succeeded') {
            this._getStorageAccountSecrets(subscription, geoRegion, storageAccount, functionAppName, result);
        }
        else {
            this._armService.get(id, this._armService.storageApiVersion)
                .map(function (r) { return (r.json()); })
                .subscribe(function (sa) {
                if (sa.properties.provisioningState === 'Succeeded') {
                    _this._getStorageAccountSecrets(subscription, geoRegion, sa, functionAppName, result);
                }
                else if (count < 100) {
                    setTimeout(function () { return _this._pullStorageAccount(subscription, geoRegion, storageAccount, functionAppName, result, count + 1); }, 400);
                }
                else {
                    _this._aiService.trackEvent('/errors/portal/storage/timeout', { count: count.toString(), geoRegion: geoRegion, subscription: subscription });
                    _this.completeError(result, sa);
                }
            }, function (e) {
                _this._aiService.trackEvent('/errors/portal/storage/pull', { count: count.toString(), geoRegion: geoRegion, subscription: subscription });
                _this.completeError(result, e);
            });
        }
    };
    GettingStartedComponent.prototype._createStorageAccount = function (subscription, geoRegion, functionAppName, result) {
        var _this = this;
        var storageAccountName = "azurefunctions" + this.makeId();
        var id = "/subscriptions/" + subscription + "/resourceGroups/AzureFunctions-" + geoRegion + "/providers/Microsoft.Storage/storageAccounts/" + storageAccountName;
        var body = {
            location: geoRegion,
            properties: {
                accountType: 'Standard_GRS'
            }
        };
        this._armService.put(id, body, this._armService.storageApiVersion)
            .retryWhen(function (e) { return e.scan(function (errorCount, err) {
            if (errorCount >= 5) {
                throw err;
            }
            return errorCount + 1;
        }, 0).delay(200); })
            .subscribe(function (r) { return _this._pullStorageAccount(subscription, geoRegion, storageAccountName, functionAppName, result); }, function (e) { return _this.completeError(result, e); });
    };
    GettingStartedComponent.prototype._createStorageAccountLock = function (subscription, geoRegion, storageAccount, functionAppName) {
        var _this = this;
        var storageAccountName = typeof storageAccount !== 'string' ? storageAccount.name : storageAccount;
        var id = "/subscriptions/" + subscription + "/resourceGroups/AzureFunctions-" + geoRegion + "/providers/Microsoft.Storage/storageAccounts/" + storageAccountName + "/providers/Microsoft.Authorization/locks/" + storageAccountName;
        var body = {
            properties: {
                level: 'CanNotDelete',
                notes: this._translateService.instant(portal_resources_1.PortalResources.storageLockNote)
            }
        };
        return this._armService.get(id, this._armService.armLocksApiVersion)
            .subscribe(function (r) {
        }, function (error) {
            return _this._armService.put(id, body, _this._armService.armLocksApiVersion)
                .retryWhen(function (e) { return e.scan(function (errorCount, err) {
                if (errorCount >= 5) {
                    throw err;
                }
                return errorCount + 1;
            }, 0).delay(200); })
                .subscribe();
        });
    };
    GettingStartedComponent.prototype._getStorageAccountSecrets = function (subscription, geoRegion, storageAccount, functionAppName, result) {
        var _this = this;
        var id = "/subscriptions/" + subscription + "/resourceGroups/AzureFunctions-" + geoRegion + "/providers/Microsoft.Storage/storageAccounts/" + storageAccount.name + "/listKeys";
        return this._armService.post(id, null, this._armService.storageApiVersion)
            .map(function (r) { return (r.json()); })
            .subscribe(function (secrets) { return _this._createFunctionApp(subscription, geoRegion, functionAppName, storageAccount, secrets, result); }, function (error) { return _this.completeError(result, error); }).add(function () { return _this._createStorageAccountLock(subscription, geoRegion, storageAccount, functionAppName); });
    };
    GettingStartedComponent.prototype._createFunctionApp = function (subscription, geoRegion, name, storageAccount, secrets, result) {
        var _this = this;
        var id = "/subscriptions/" + subscription + "/resourceGroups/AzureFunctions-" + geoRegion + "/providers/Microsoft.Web/sites/" + name;
        var connectionString = "DefaultEndpointsProtocol=https;AccountName=" + storageAccount.name + ";AccountKey=" + secrets.key1;
        var body = {
            properties: {
                siteConfig: {
                    appSettings: [
                        { name: 'AzureWebJobsStorage', value: connectionString },
                        { name: 'AzureWebJobsDashboard', value: connectionString },
                        { name: constants_1.Constants.runtimeVersionAppSettingName, value: constants_1.Constants.runtimeVersion },
                        { name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING', value: connectionString },
                        { name: 'WEBSITE_CONTENTSHARE', value: name.toLocaleLowerCase() },
                        { name: storageAccount.name + "_STORAGE", value: connectionString },
                        { name: constants_1.Constants.nodeVersionAppSettingName, value: constants_1.Constants.nodeVersion }
                    ]
                },
                sku: 'Dynamic',
                clientAffinityEnabled: false
            },
            location: geoRegion,
            kind: 'functionapp'
        };
        this._armService.put(id, body, this._armService.websiteApiVersion)
            .map(function (r) { return (r.json()); })
            .subscribe(function (r) { return _this.complete(result, r); }, function (e) { return _this.completeError(result, e); });
    };
    GettingStartedComponent.prototype.complete = function (o, functionContainer) {
        o.next(functionContainer);
        o.complete();
    };
    GettingStartedComponent.prototype.completeError = function (o, error) {
        o.error(error);
    };
    return GettingStartedComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], GettingStartedComponent.prototype, "userReady", void 0);
GettingStartedComponent = __decorate([
    core_1.Component({
        selector: 'getting-started',
        templateUrl: './getting-started.component.html',
        styleUrls: ['./getting-started.component.scss']
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        functions_service_1.FunctionsService,
        broadcast_service_1.BroadcastService,
        arm_service_1.ArmService,
        telemetry_service_1.TelemetryService,
        global_state_service_1.GlobalStateService,
        core_2.TranslateService,
        ai_service_1.AiService,
        http_1.Http])
], GettingStartedComponent);
exports.GettingStartedComponent = GettingStartedComponent;
//# sourceMappingURL=getting-started.component.js.map