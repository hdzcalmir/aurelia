var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DI } from '@aurelia/kernel';
import { valueConverter, ValueConverter } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
describe(`2-runtime/value-converter.spec.ts`, function () {
    let container;
    beforeEach(function () {
        container = DI.createContainer();
    });
    let FooValueConverter = class FooValueConverter {
    };
    FooValueConverter = __decorate([
        valueConverter('foo')
    ], FooValueConverter);
    it(`should define the value converter`, function () {
        const definition = ValueConverter.getDefinition(FooValueConverter);
        assert.strictEqual(definition.name, 'foo', `definition.name`);
        definition.register(container);
        const instance = container.get(ValueConverter.keyFrom('foo'));
        assert.instanceOf(instance, FooValueConverter, `instance`);
    });
});
//# sourceMappingURL=value-converter.spec.js.map