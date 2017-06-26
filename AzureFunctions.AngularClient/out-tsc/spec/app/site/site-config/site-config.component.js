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
var forms_1 = require("@angular/forms");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var core_2 = require("@ngx-translate/core");
var ai_service_1 = require("./../../shared/services/ai.service");
var portal_resources_1 = require("./../../shared/models/portal-resources");
var enumEx_1 = require("./../../shared/Utilities/enumEx");
var connection_strings_1 = require("./../../shared/models/arm/connection-strings");
var tabs_component_1 = require("./../../tabs/tabs.component");
var cache_service_1 = require("./../../shared/services/cache.service");
var uniqueValidator_1 = require("app/shared/validators/uniqueValidator");
var requiredValidator_1 = require("app/shared/validators/requiredValidator");
var SiteConfigComponent = (function () {
    function SiteConfigComponent(_cacheService, _fb, _translateService, _aiService, tabsComponent) {
        var _this = this;
        this._cacheService = _cacheService;
        this._fb = _fb;
        this._translateService = _translateService;
        this._aiService = _aiService;
        this.Resources = portal_resources_1.PortalResources;
        this._busyState = tabsComponent.busyState;
        this.viewInfoStream = new Subject_1.Subject();
        this._viewInfoSubscription = this.viewInfoStream
            .distinctUntilChanged()
            .switchMap(function (viewInfo) {
            _this._busyState.setBusyState();
            _this._resourceId = viewInfo.resourceId;
            // Not bothering to check RBAC since this component will only be used in Standalone mode
            return Observable_1.Observable.zip(_this._cacheService.postArm(_this._resourceId + "/config/appSettings/list", true), _this._cacheService.postArm(_this._resourceId + "/config/connectionstrings/list", true), function (a, c) { return ({ appSettingResponse: a, connectionStringResponse: c }); });
        })
            .do(null, function (error) {
            _this._aiService.trackEvent("/errors/site-config", error);
            _this._busyState.clearBusyState();
        })
            .retry()
            .subscribe(function (r) {
            _this._busyState.clearBusyState();
            _this._appSettingsArm = r.appSettingResponse.json();
            _this._connectionStringsArm = r.connectionStringResponse.json();
            _this._setupForm(_this._appSettingsArm, _this._connectionStringsArm);
        });
    }
    SiteConfigComponent.prototype._setupForm = function (appSettingsArm, connectionStringsArm) {
        var appSettings = this._fb.array([]);
        var connectionStrings = this._fb.array([]);
        this._requiredValidator = new requiredValidator_1.RequiredValidator(this._translateService);
        this._uniqueAppSettingValidator = new uniqueValidator_1.UniqueValidator("name", appSettings, this._translateService.instant(portal_resources_1.PortalResources.validation_duplicateError));
        this._uniqueCsValidator = new uniqueValidator_1.UniqueValidator("name", connectionStrings, this._translateService.instant(portal_resources_1.PortalResources.validation_duplicateError));
        for (var name_1 in appSettingsArm.properties) {
            if (appSettingsArm.properties.hasOwnProperty(name_1)) {
                appSettings.push(this._fb.group({
                    name: [
                        name_1,
                        forms_1.Validators.compose([
                            this._requiredValidator.validate.bind(this._requiredValidator),
                            this._uniqueAppSettingValidator.validate.bind(this._uniqueAppSettingValidator)
                        ])
                    ],
                    value: [appSettingsArm.properties[name_1]]
                }));
            }
        }
        for (var name_2 in connectionStringsArm.properties) {
            if (connectionStringsArm.properties.hasOwnProperty(name_2)) {
                var connectionString = connectionStringsArm.properties[name_2];
                var connectionStringDropDownTypes = this._getConnectionStringTypes(connectionString.type);
                var group = this._fb.group({
                    name: [
                        name_2,
                        forms_1.Validators.compose([
                            this._requiredValidator.validate.bind(this._requiredValidator),
                            this._uniqueCsValidator.validate.bind(this._uniqueCsValidator)
                        ])
                    ],
                    value: [connectionString.value],
                    type: [connectionStringDropDownTypes.find(function (t) { return t.default; }).value]
                });
                group.csTypes = connectionStringDropDownTypes;
                connectionStrings.push(group);
            }
        }
        this.mainForm = this._fb.group({
            appSettings: appSettings,
            connectionStrings: connectionStrings
        });
    };
    SiteConfigComponent.prototype._getConnectionStringTypes = function (defaultType) {
        var connectionStringDropDownTypes = [];
        enumEx_1.EnumEx.getNamesAndValues(connection_strings_1.ConnectionStringType).forEach(function (pair) {
            connectionStringDropDownTypes.push({
                displayLabel: pair.name,
                value: pair.name,
                default: pair.value === defaultType
            });
        });
        return connectionStringDropDownTypes;
    };
    Object.defineProperty(SiteConfigComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this.viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    SiteConfigComponent.prototype.ngOnInit = function () {
    };
    SiteConfigComponent.prototype.ngOnDestroy = function () {
        this._viewInfoSubscription.unsubscribe();
    };
    SiteConfigComponent.prototype.save = function () {
        var _this = this;
        var appSettingGroups = this.mainForm.controls["appSettings"].controls;
        appSettingGroups.forEach(function (group) {
            var controls = group.controls;
            for (var controlName in controls) {
                var control = controls[controlName];
                control._msRunValidation = true;
                control.updateValueAndValidity();
            }
        });
        var connectionStringGroups = this.mainForm.controls["connectionStrings"].controls;
        connectionStringGroups.forEach(function (group) {
            var controls = group.controls;
            for (var controlName in controls) {
                var control = controls[controlName];
                control._msRunValidation = true;
                control.updateValueAndValidity();
            }
        });
        if (this.mainForm.valid) {
            var appSettingsArm = JSON.parse(JSON.stringify(this._appSettingsArm));
            delete appSettingsArm.properties;
            appSettingsArm.properties = {};
            for (var i = 0; i < appSettingGroups.length; i++) {
                appSettingsArm.properties[appSettingGroups[i].value.name] = appSettingGroups[i].value.value;
            }
            var connectionStringsArm = JSON.parse(JSON.stringify(this._connectionStringsArm));
            delete connectionStringsArm.properties;
            connectionStringsArm.properties = {};
            for (var i = 0; i < connectionStringGroups.length; i++) {
                var connectionStringControl = connectionStringGroups[i];
                var connectionString = {
                    value: connectionStringControl.value.value,
                    type: connection_strings_1.ConnectionStringType[connectionStringControl.value.type]
                };
                connectionStringsArm.properties[connectionStringGroups[i].value.name] = connectionString;
            }
            this._busyState.setBusyState();
            Observable_1.Observable.zip(this._cacheService.putArm(this._resourceId + "/config/appSettings", null, appSettingsArm), this._cacheService.putArm(this._resourceId + "/config/connectionstrings", null, connectionStringsArm), function (a, c) { return ({ appSettingsResponse: a, connectionStringsResponse: c }); })
                .subscribe(function (r) {
                _this._busyState.clearBusyState();
                _this._appSettingsArm = r.appSettingsResponse.json();
                _this._connectionStringsArm = r.connectionStringsResponse.json();
                _this._setupForm(_this._appSettingsArm, _this._connectionStringsArm);
            });
        }
    };
    SiteConfigComponent.prototype.discard = function () {
        this.mainForm.reset();
        this._setupForm(this._appSettingsArm, this._connectionStringsArm);
    };
    SiteConfigComponent.prototype.deleteAppSetting = function (group) {
        var appSettings = this.mainForm.controls["appSettings"];
        this._deleteRow(group, appSettings);
    };
    SiteConfigComponent.prototype.deleteConnectionString = function (group) {
        var connectionStrings = this.mainForm.controls["connectionStrings"];
        this._deleteRow(group, connectionStrings);
    };
    SiteConfigComponent.prototype._deleteRow = function (group, formArray) {
        var index = formArray.controls.indexOf(group);
        if (index >= 0) {
            formArray.controls.splice(index, 1);
            group.markAsDirty();
        }
    };
    SiteConfigComponent.prototype.addAppSetting = function () {
        var appSettings = this.mainForm.controls["appSettings"];
        var group = this._fb.group({
            name: [
                null,
                forms_1.Validators.compose([
                    this._requiredValidator.validate.bind(this._requiredValidator),
                    this._uniqueAppSettingValidator.validate.bind(this._uniqueAppSettingValidator)
                ])
            ],
            value: [null]
        });
        group._msStartInEditMode = true;
        appSettings.push(group);
        this.mainForm.markAsDirty();
    };
    SiteConfigComponent.prototype.addConnectionString = function () {
        var connectionStrings = this.mainForm.controls["connectionStrings"];
        var connectionStringDropDownTypes = this._getConnectionStringTypes(connection_strings_1.ConnectionStringType.SQLAzure);
        var group = this._fb.group({
            name: [
                null,
                forms_1.Validators.compose([
                    this._requiredValidator.validate.bind(this._requiredValidator),
                    this._uniqueCsValidator.validate.bind(this._uniqueCsValidator)
                ])
            ],
            value: [null],
            type: [connectionStringDropDownTypes.find(function (t) { return t.default; }).value]
        });
        group.csTypes = connectionStringDropDownTypes;
        connectionStrings.push(group);
        group._msStartInEditMode = true;
        this.mainForm.markAsDirty();
    };
    return SiteConfigComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], SiteConfigComponent.prototype, "viewInfoInput", null);
SiteConfigComponent = __decorate([
    core_1.Component({
        selector: 'site-config',
        templateUrl: './site-config.component.html',
        styleUrls: ['./site-config.component.scss']
    }),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        forms_1.FormBuilder,
        core_2.TranslateService,
        ai_service_1.AiService,
        tabs_component_1.TabsComponent])
], SiteConfigComponent);
exports.SiteConfigComponent = SiteConfigComponent;
//# sourceMappingURL=site-config.component.js.map