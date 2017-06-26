"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var edit_mode_warning_component_1 = require("./edit-mode-warning.component");
describe('EditModeWarningComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition)
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(edit_mode_warning_component_1.EditModeWarningComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=edit-mode-warning.component.spec.js.map