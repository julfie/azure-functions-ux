/* tslint:disable:no-unused-variable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var config_service_1 = require("./config.service");
describe('Service: Config', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [config_service_1.ConfigService]
        });
    });
    it('should ...', testing_1.inject([config_service_1.ConfigService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=config.service.spec.js.map