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
var tbl_component_1 = require("./../tbl.component");
var core_1 = require("@angular/core");
var TblThComponent = (function () {
    function TblThComponent(table, _el) {
        this.table = table;
        this._el = _el;
    }
    TblThComponent.prototype.ngOnInit = function () {
    };
    TblThComponent.prototype.ngAfterContentInit = function () {
        var element = this._el.nativeElement;
        if (element.parentElement
            && element.parentElement.parentElement
            && element.parentElement.parentElement.tagName === "TR") {
            element.parentElement.parentElement.classList.add("header-row");
        }
    };
    TblThComponent.prototype.sort = function () {
        var _this = this;
        var table = this.table;
        // Make a copy so that we don't sort the original list
        if (table.items === table.origItems) {
            table.items = [].concat(table.origItems);
        }
        if (table.sortedColName && table.sortedColName === this.name) {
            table.sortAscending = !table.sortAscending;
        }
        else {
            table.sortedColName = this.name;
            table.sortAscending = true;
        }
        table.items = table.items.sort(function (a, b) {
            var aCol;
            var bCol;
            aCol = Object.byString(a, _this.name);
            bCol = Object.byString(b, _this.name);
            aCol = typeof aCol === "string" ? aCol : aCol.toString();
            bCol = typeof bCol === "string" ? bCol : bCol.toString();
            if (table.sortAscending) {
                return aCol.localeCompare(bCol);
            }
            else {
                return bCol.localeCompare(aCol);
            }
        });
    };
    return TblThComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TblThComponent.prototype, "name", void 0);
TblThComponent = __decorate([
    core_1.Component({
        selector: 'tbl-th',
        template: "\n    <div class=\"sortable\" (click)=\"sort()\">\n      <ng-content class=\"sortable\"></ng-content>\n      <i class=\"fa chevron\"\n          [class.fa-chevron-up]=\"table.sortedColName === name && table.sortAscending\"\n          [class.fa-chevron-down]=\"(table.sortedColName === name && !table.sortAscending) || !table.sortedColName\"></i>\n    </div>",
        styleUrls: ['./tbl-th.component.scss']
    }),
    __metadata("design:paramtypes", [tbl_component_1.TblComponent,
        core_1.ElementRef])
], TblThComponent);
exports.TblThComponent = TblThComponent;
//# sourceMappingURL=tbl-th.component.js.map