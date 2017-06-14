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
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/mergeMap");
var portal_service_1 = require("../../shared/services/portal.service");
var arm_service_1 = require("../../shared/services/arm.service");
var cache_service_1 = require("../../shared/services/cache.service");
var deployment_1 = require("../deployment-source/deployment");
var resourceDescriptors_1 = require("../../shared/resourceDescriptors");
var global_state_service_1 = require("../../shared/services/global-state.service");
var DeploymentSourceSetupComponent = (function () {
    function DeploymentSourceSetupComponent(_portalService, _globalStateService, _armService, _cacheService) {
        var _this = this;
        this._portalService = _portalService;
        this._globalStateService = _globalStateService;
        this._armService = _armService;
        this._cacheService = _cacheService;
        this.configOutput = new Subject_1.Subject();
        this.providers = [];
        this.organizations = [];
        this.repositories = [];
        this.branches = [];
        this.isProviderLoading = false;
        this.settingUp = false;
        // TODO: Need to add validation support to dropdown control
        this.valid = false;
        this._siteSubject = new Subject_1.Subject();
        this._siteSubject
            .distinctUntilChanged()
            .subscribe(function (site) {
            _this.organizations = [];
            _this.repositories = [];
            _this.branches = [];
            _this.model = {
                providerType: deployment_1.ProviderType.None,
                organization: null,
                repository: null,
                branch: ""
            };
            _this._site = site;
        });
        // this.organizationCtrl = new Control("", (control) => {
        //     return Validators.required(control)
        // });
        // this.repositoryCtrl = new Control("", (control) =>{
        //     return Validators.required(control)
        // });
        // this.branchCtrl = new Control("", (control) =>{
        //     return Validators.required(control)
        // });
        // this.ctrlGroup = new FormGroup({});
        this.providers = [
            {
                title: "Visual Studio Team Services",
                subtitle: "By Microsoft",
                imgUrl: "images/vsts.png",
                type: deployment_1.ProviderType.VSO
            },
            {
                title: "OneDrive",
                subtitle: "By Microsoft",
                imgUrl: "images/onedrive_100.png",
                type: deployment_1.ProviderType.OneDrive
            },
            {
                title: "Local Git",
                subtitle: "By Git",
                imgUrl: "images/localgit_45.png",
                type: deployment_1.ProviderType.LocalGit
            },
            {
                title: "GitHub",
                subtitle: "By GitHub",
                imgUrl: "images/GitHub_65.png",
                type: deployment_1.ProviderType.GitHub
            },
            {
                title: "Bitbucket",
                subtitle: "By Atlassian",
                imgUrl: "images/bitbucket_45.png",
                type: deployment_1.ProviderType.Bitbucket
            },
            {
                title: "Dropbox",
                subtitle: "By Dropbox",
                imgUrl: "images/dropbox_45.png",
                type: deployment_1.ProviderType.Dropbox
            },
            {
                title: "External",
                subtitle: "",
                imgUrl: "images/external_45.png",
                type: deployment_1.ProviderType.External
            }
        ];
    }
    Object.defineProperty(DeploymentSourceSetupComponent.prototype, "siteInput", {
        set: function (site) {
            if (!site) {
                return;
            }
            this._siteSubject.next(site);
        },
        enumerable: true,
        configurable: true
    });
    DeploymentSourceSetupComponent.prototype.onProviderSelect = function (providerType) {
        var _this = this;
        this.model.providerType = providerType;
        var descriptor = new resourceDescriptors_1.SiteDescriptor(this._site.id);
        this.isProviderLoading = true;
        this._portalService.setupOAuth({
            ScmType: providerType,
            CallbackUrl: null,
            AuthUrl: null,
            SetupToken: null,
            SetupTokenSecret: null,
            SiteName: this._site.name,
            SubscriptionId: descriptor.subscription,
            ShellUrl: null
        })
            .subscribe(function (response) {
            _this.isProviderLoading = false;
            response.Organizations.forEach(function (organization) {
                _this.organizations.push({
                    displayLabel: organization.Name,
                    value: organization
                });
                if (organization.IsDefault) {
                    _this._setOrganization(organization);
                }
            });
        });
    };
    DeploymentSourceSetupComponent.prototype.onOrganizationSelect = function (organization) {
        this._setOrganization(organization);
    };
    DeploymentSourceSetupComponent.prototype.onRepositorySelect = function (repository) {
        this._setRepository(repository);
    };
    DeploymentSourceSetupComponent.prototype.onBranchSelect = function (branch) {
    };
    DeploymentSourceSetupComponent.prototype.setup = function () {
        var _this = this;
        this._globalStateService.setBusyState();
        var body = {
            properties: {
                repoUrl: this.model.repository.html_url,
                branch: this.model.branch,
                isManualIntegration: false,
                deploymentRollbackEnabled: false,
                isMercurial: false
            }
        };
        this._armService.put(this._site.id + "/sourceControls/web", body)
            .mergeMap(function (response) {
            return _this._cacheService.getArm(_this._site.id + "/config/web", true);
        })
            .subscribe(function (r) {
            var config = r.json();
            _this.configOutput.next(config);
            _this._globalStateService.clearBusyState();
        });
    };
    DeploymentSourceSetupComponent.prototype._setOrganization = function (organization) {
        var _this = this;
        this.model.organization = organization;
        this.repositories = [];
        this.branches = [];
        if (organization.Repositories && organization.Repositories.length > 0) {
            organization.Repositories.forEach(function (repo) {
                _this.repositories.push({
                    displayLabel: repo.name,
                    value: repo
                });
            });
            this._setRepository(organization.Repositories[0]);
        }
        else {
            this.valid = false;
            this.model.repository = null;
            this.model.branch = "";
        }
    };
    DeploymentSourceSetupComponent.prototype._setRepository = function (repository) {
        this.model.repository = repository;
        this.model.branch = repository.default_branch;
        this.branches = [{
                displayLabel: this.model.branch,
                value: this.model.branch
            }];
        this.valid = true;
    };
    return DeploymentSourceSetupComponent;
}());
DeploymentSourceSetupComponent = __decorate([
    core_1.Component({
        selector: 'deployment-source-setup',
        templateUrl: './deployment-source-setup.component.html',
        styleUrls: ['../deployment-source/deployment-source.component.scss'],
        inputs: ["siteInput"],
        outputs: ["configOutput"]
    }),
    __metadata("design:paramtypes", [portal_service_1.PortalService,
        global_state_service_1.GlobalStateService,
        arm_service_1.ArmService,
        cache_service_1.CacheService])
], DeploymentSourceSetupComponent);
exports.DeploymentSourceSetupComponent = DeploymentSourceSetupComponent;
//# sourceMappingURL=deployment-source-setup.component.js.map