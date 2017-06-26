"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var arm_service_1 = require("./arm.service");
describe('Service: Arm', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([arm_service_1.ArmService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=arm.service.spec.js.map