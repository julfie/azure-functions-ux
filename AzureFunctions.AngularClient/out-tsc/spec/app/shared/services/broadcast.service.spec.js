/* tslint:disable:no-unused-variable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var broadcast_service_1 = require("./broadcast.service");
describe('Service: Broadcast', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [broadcast_service_1.BroadcastService]
        });
    });
    it('should ...', testing_1.inject([broadcast_service_1.BroadcastService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=broadcast.service.spec.js.map