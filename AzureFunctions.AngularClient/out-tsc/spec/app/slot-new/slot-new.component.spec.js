"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../app.module");
var testing_1 = require("@angular/core/testing");
var slot_new_component_1 = require("./slot-new.component");
describe('SlotNewComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition)
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(slot_new_component_1.SlotNewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=slot-new.component.spec.js.map