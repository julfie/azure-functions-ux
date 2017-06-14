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
var core_2 = require("@ngx-translate/core");
var broadcast_service_1 = require("../shared/services/broadcast.service");
var broadcast_event_1 = require("../shared/models/broadcast-event");
var portal_resources_1 = require("../shared/models/portal-resources");
var error_event_1 = require("../shared/models/error-event");
var error_ids_1 = require("../shared/models/error-ids");
var SlotsListComponent = (function () {
    function SlotsListComponent(_broadcastService, _translateService) {
        var _this = this;
        this._broadcastService = _broadcastService;
        this._translateService = _translateService;
        this.slots = [];
        this.viewInfoStream = new Subject_1.Subject();
        this._viewInfoSubscription = this.viewInfoStream.distinctUntilChanged()
            .switchMap(function (viewInfo) {
            _this.isLoading = true;
            _this._slotsNode = viewInfo.node;
            return _this._slotsNode.loadChildren();
        })
            .subscribe(function () {
            _this.isLoading = false;
            _this.slots = _this._slotsNode.children
                .map(function (s) {
                return {
                    name: s.title,
                    status: s.slotProperties.state,
                    serverFarm: s.slotProperties.serverFarmId.split('/')[8],
                    node: s
                };
            });
        }, (function (err) {
            _this.isLoading = false;
            _this._broadcastService.broadcast(broadcast_event_1.BroadcastEvent.Error, {
                message: _this._translateService.instant(portal_resources_1.PortalResources.error_unableToLoadSlotsList),
                errorType: error_event_1.ErrorType.RuntimeError,
                errorId: error_ids_1.ErrorIds.unableToPopulateSlotsList
            });
        }));
    }
    SlotsListComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(SlotsListComponent.prototype, "viewInfoInput", {
        set: function (viewInfo) {
            this.viewInfoStream.next(viewInfo);
        },
        enumerable: true,
        configurable: true
    });
    SlotsListComponent.prototype.clickRow = function (item) {
        item.node.select();
    };
    return SlotsListComponent;
}());
SlotsListComponent = __decorate([
    core_1.Component({
        selector: 'slots-list',
        templateUrl: './slots-list.component.html',
        styleUrls: ['./slots-list.component.scss'],
        inputs: ['viewInfoInput']
    }),
    __metadata("design:paramtypes", [broadcast_service_1.BroadcastService,
        core_2.TranslateService])
], SlotsListComponent);
exports.SlotsListComponent = SlotsListComponent;
//# sourceMappingURL=slots-list.component.js.map