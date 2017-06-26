"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
var testing_1 = require("@angular/core/testing");
describe('ServiceBusComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition)
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(ServiceBusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=service-bus.component.spec.js.map