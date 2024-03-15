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
        container.register(FooValueConverter);
        const instance = container.get(ValueConverter.keyFrom('foo'));
        assert.instanceOf(instance, FooValueConverter, `instance`);
    });
    it('resolves to the same instance when impl was retrieved before registration', function () {
        const i1 = container.get(FooValueConverter);
        container.register(FooValueConverter);
        const i2 = container.get(ValueConverter.keyFrom('foo'));
        const i3 = ValueConverter.get(container, 'foo');
        assert.strictEqual(i1, i2);
        assert.strictEqual(i1, i3);
        const [_, i4] = container.getAll(FooValueConverter);
        assert.strictEqual(i4, undefined);
    });
    it('resolves to the same instance when impl was retrieved after registration', function () {
        container.register(FooValueConverter);
        const i1 = container.get(FooValueConverter);
        const i2 = container.get(ValueConverter.keyFrom('foo'));
        const i3 = ValueConverter.get(container, 'foo');
        assert.strictEqual(i1, i2);
        assert.strictEqual(i1, i3);
        const [_, i4] = container.getAll(FooValueConverter);
        assert.strictEqual(i4, undefined);
    });
    it('does not retrieve the intermediate container value converter registration', function () {
        const child1 = container.createChild();
        const child2 = child1.createChild();
        let id = 0;
        let Foo1 = class Foo1 {
            constructor() {
                this.id = ++id;
            }
        };
        Foo1 = __decorate([
            valueConverter('foo1')
        ], Foo1);
        child1.register(Foo1);
        container.register(Foo1);
        ValueConverter.get(child2, 'foo1');
        assert.strictEqual(id, 1, `should create value converter only once`);
        ValueConverter.get(child1, 'foo1');
        assert.strictEqual(id, 2, `should create another value converter in the middle layer container`);
    });
});
//# sourceMappingURL=value-converter.spec.js.map