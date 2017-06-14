/* tslint:disable:no-unused-variable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var functions_service_1 = require("./functions.service");
describe('Service: Functions', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [functions_service_1.FunctionsService]
        });
    });
    it('should ...', testing_1.inject([functions_service_1.FunctionsService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=functions.service.spec.js.map