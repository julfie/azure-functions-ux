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
var ai_service_1 = require("./../shared/services/ai.service");
var FeatureGroupComponent = (function () {
    function FeatureGroupComponent(_aiService) {
        this._aiService = _aiService;
        this.searchTerm = "";
    }
    Object.defineProperty(FeatureGroupComponent.prototype, "inputGroup", {
        set: function (group) {
            this.group = group;
            this.group.features.forEach(function (f) { return f.keywords = f.keywords.toLowerCase(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FeatureGroupComponent.prototype, "searchTermInput", {
        set: function (term) {
            this.searchTerm = term;
            term = term.toLowerCase();
            this.group.features.forEach(function (feature) {
                feature.highlight = feature.keywords.indexOf(term) > -1;
            });
        },
        enumerable: true,
        configurable: true
    });
    FeatureGroupComponent.prototype.click = function (feature) {
        this._aiService.trackEvent("/site/feature-click", {
            featureName: feature.title,
            isResultsFiltered: !!this.searchTerm ? "true" : "false"
        });
        feature.click();
    };
    return FeatureGroupComponent;
}());
FeatureGroupComponent = __decorate([
    core_1.Component({
        selector: 'feature-group',
        templateUrl: './feature-group.component.html',
        styleUrls: ['./feature-group.component.scss'],
        inputs: ['inputGroup', 'searchTermInput']
    }),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], FeatureGroupComponent);
exports.FeatureGroupComponent = FeatureGroupComponent;
//# sourceMappingURL=feature-group.component.js.map