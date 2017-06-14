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
var SearchBoxComponent = (function () {
    function SearchBoxComponent() {
        this.value = "";
        this.warning = false;
        this.onInputChange = new Subject_1.Subject();
        this.onClear = new Subject_1.Subject();
    }
    SearchBoxComponent.prototype.onKeyUp = function (event) {
        if (event.keyCode === 27) {
            this.onClearClick(event);
        }
        else {
            this.onInputChange.next(this.value);
        }
    };
    SearchBoxComponent.prototype.onClearClick = function (event) {
        this.value = "";
        this.onClear.next(null);
    };
    return SearchBoxComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SearchBoxComponent.prototype, "placeholder", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SearchBoxComponent.prototype, "value", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], SearchBoxComponent.prototype, "warning", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SearchBoxComponent.prototype, "onInputChange", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SearchBoxComponent.prototype, "onClear", void 0);
SearchBoxComponent = __decorate([
    core_1.Component({
        selector: 'search-box',
        templateUrl: './search-box.component.html',
        styleUrls: ['./search-box.component.scss']
    }),
    __metadata("design:paramtypes", [])
], SearchBoxComponent);
exports.SearchBoxComponent = SearchBoxComponent;
//# sourceMappingURL=search-box.component.js.map