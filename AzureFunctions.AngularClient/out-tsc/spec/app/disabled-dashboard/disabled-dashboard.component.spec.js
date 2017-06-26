"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var disabled_dashboard_component_1 = require("./disabled-dashboard.component");
describe('DisabledDashboardComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition)
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(disabled_dashboard_component_1.DisabledDashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=disabled-dashboard.component.spec.js.map