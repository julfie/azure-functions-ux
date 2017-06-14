/* tslint:disable:no-unused-variable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var telemetry_service_1 = require("./telemetry.service");
describe('Service: Telemetry', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [telemetry_service_1.TelemetryService]
        });
    });
    it('should ...', testing_1.inject([telemetry_service_1.TelemetryService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=telemetry.service.spec.js.map