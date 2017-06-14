/* tslint:disable:no-unused-variable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var global_state_service_1 = require("./global-state.service");
describe('Service: GlobalState', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [global_state_service_1.GlobalStateService]
        });
    });
    it('should ...', testing_1.inject([global_state_service_1.GlobalStateService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=global-state.service.spec.js.map