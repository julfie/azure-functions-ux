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
require("rxjs/add/operator/switchMap");
var AppsListComponent = (function () {
    function AppsListComponent() {
        var _this = this;
        this.apps = [];
        this.viewInfoStream = new Subject_1.Subject();
        this._viewInfoSubscription = this.viewInfoStream
            .distinctUntilChanged()
            .switchMap(function (viewInfo) {
            _this.appsNode = viewInfo.node;
            /* this is need to avoid flickering b/w no list view & table on load
            see https://github.com/Azure/azure-functions-ux/issues/1286 */
            _this.appsNode.isLoading = true;
            return viewInfo.node.childrenStream;
        })
            .subscribe(function (children) {
            _this.apps = children;
            /* fix for https://github.com/Azure/azure-functions-ux/issues/1374
             if the FunctionApps node has a sibling, the below logic will need to be updated */
            if (children.length > 0) {
                _this.appsNode.isLoading = false;
            }
            _this._origRefToItems = children;
        });
    }
    AppsListComponent.prototype.ngOnInit = function () {
    };
    AppsListComponent.prototype.ngOnDestroy = function () {
        this._viewInfoSubscription.unsubscribe();
    };
    Object.defineProperty(AppsListComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this.viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    AppsListComponent.prototype.clickRow = function (item) {
        item.sideNav.searchExact(item.title);
    };
    return AppsListComponent;
}());
AppsListComponent = __decorate([
    core_1.Component({
        selector: 'apps-list',
        templateUrl: './apps-list.component.html',
        styleUrls: ['./apps-list.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [])
], AppsListComponent);
exports.AppsListComponent = AppsListComponent;
//# sourceMappingURL=apps-list.component.js.map