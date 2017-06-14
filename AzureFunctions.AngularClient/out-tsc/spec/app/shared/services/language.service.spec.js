/* tslint:disable:no-unused-variable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var language_service_1 = require("./language.service");
describe('Service: Language', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [language_service_1.LanguageService]
        });
    });
    it('should ...', testing_1.inject([language_service_1.LanguageService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=language.service.spec.js.map