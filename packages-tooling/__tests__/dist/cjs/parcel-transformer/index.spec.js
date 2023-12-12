"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@aurelia/testing");
const parcel_transformer_1 = require("@aurelia/parcel-transformer");
describe('parcel-transformer', function () {
    it('wait for official parcel2 example on unit tests :-)', function (done) {
        testing_1.assert.equal(typeof parcel_transformer_1.default, 'object');
        done();
    });
});
//# sourceMappingURL=index.spec.js.map