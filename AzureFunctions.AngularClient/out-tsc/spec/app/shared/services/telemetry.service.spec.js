"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./../../app.module");
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var telemetry_service_1 = require("./telemetry.service");
describe('Service: Telemetry', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule(app_module_1.AppModule.moduleDefinition);
    });
    it('should ...', testing_1.inject([telemetry_service_1.TelemetryService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=telemetry.service.spec.js.map