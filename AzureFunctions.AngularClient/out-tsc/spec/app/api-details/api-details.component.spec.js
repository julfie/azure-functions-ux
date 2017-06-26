"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var api_details_component_1 = require("./api-details.component");
describe('ApiDetailsComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition)
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(api_details_component_1.ApiDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=api-details.component.spec.js.map