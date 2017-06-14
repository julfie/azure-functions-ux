/* tslint:disable:no-unused-variable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var ai_service_1 = require("./ai.service");
describe('Service: Ai', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [ai_service_1.AiService]
        });
    });
    it('should ...', testing_1.inject([ai_service_1.AiService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=ai.service.spec.js.map