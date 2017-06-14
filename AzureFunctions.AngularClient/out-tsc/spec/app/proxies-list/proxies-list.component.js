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
require("rxjs/add/operator/map");
require("rxjs/add/operator/switchMap");
var ProxiesListComponent = (function () {
    function ProxiesListComponent() {
        var _this = this;
        this.proxies = [];
        this.viewInfoStream = new Subject_1.Subject();
        this._viewInfoSubscription = this.viewInfoStream
            .distinctUntilChanged()
            .switchMap(function (viewInfo) {
            _this.isLoading = true;
            _this._proxiesNode = viewInfo.node;
            return _this._proxiesNode.loadChildren();
        })
            .subscribe(function () {
            _this.isLoading = false;
            _this.proxies = _this._proxiesNode.children
                .map(function (p) {
                return {
                    name: p.title,
                    url: p.proxy.backendUri,
                    node: p
                };
            });
        });
    }
    ProxiesListComponent.prototype.ngOnInit = function () {
    };
    ProxiesListComponent.prototype.ngOnDestroy = function () {
        this._viewInfoSubscription.unsubscribe();
    };
    Object.defineProperty(ProxiesListComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this.viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    ProxiesListComponent.prototype.clickRow = function (item) {
        item.node.select();
    };
    return ProxiesListComponent;
}());
ProxiesListComponent = __decorate([
    core_1.Component({
        selector: 'proxies-list',
        templateUrl: './proxies-list.component.html',
        styleUrls: ['./proxies-list.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [])
], ProxiesListComponent);
exports.ProxiesListComponent = ProxiesListComponent;
//# sourceMappingURL=proxies-list.component.js.map