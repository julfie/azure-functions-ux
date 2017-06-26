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
var portal_resources_1 = require("./../shared/models/portal-resources");
var core_1 = require("@ngx-translate/core");
var Subject_1 = require("rxjs/Subject");
var core_2 = require("@angular/core");
var DownloadFunctionAppContentComponent = (function () {
    function DownloadFunctionAppContentComponent(_translateService) {
        this._translateService = _translateService;
        this.close = new Subject_1.Subject();
        this.downloadOptions = [{
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.downloadFunctionAppContent_siteContent),
                value: 'siteContent'
            }, {
                displayLabel: this._translateService.instant(portal_resources_1.PortalResources.downloadFunctionAppContent_vsProject),
                value: 'vsProject'
            }];
        this.includeAppSettings = false;
        this.currentDownloadOption = 'siteContent';
    }
    DownloadFunctionAppContentComponent.prototype.downloadFunctionAppContent = function () {
        var includeCsProj = this.currentDownloadOption === 'siteContent' ? false : true;
        var url = this.scmUrl + "/api/functions/admin/download?includeCsproj=" + includeCsProj + "&includeAppSettings=" + this.includeAppSettings;
        window.open(url, '_blank');
    };
    DownloadFunctionAppContentComponent.prototype.closeModal = function () {
        this.close.next();
    };
    return DownloadFunctionAppContentComponent;
}());
__decorate([
    core_2.Input(),
    __metadata("design:type", String)
], DownloadFunctionAppContentComponent.prototype, "scmUrl", void 0);
__decorate([
    core_2.Output(),
    __metadata("design:type", Subject_1.Subject)
], DownloadFunctionAppContentComponent.prototype, "close", void 0);
DownloadFunctionAppContentComponent = __decorate([
    core_2.Component({
        selector: 'download-function-app-content',
        templateUrl: './download-function-app-content.component.html',
        styleUrls: ['./download-function-app-content.component.scss']
    }),
    __metadata("design:paramtypes", [core_1.TranslateService])
], DownloadFunctionAppContentComponent);
exports.DownloadFunctionAppContentComponent = DownloadFunctionAppContentComponent;
//# sourceMappingURL=download-function-app-content.component.js.map