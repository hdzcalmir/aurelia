var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DI } from '@aurelia/kernel';
import { bindingBehavior, BindingBehavior } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
describe(`2-runtime/binding-behavior.spec.ts`, function () {
    let container;
    beforeEach(function () {
        container = DI.createContainer();
    });
    let FooBindingBehavior = class FooBindingBehavior {
    };
    FooBindingBehavior = __decorate([
        bindingBehavior('foo')
    ], FooBindingBehavior);
    it(`should define the binding behavior`, function () {
        const definition = BindingBehavior.getDefinition(FooBindingBehavior);
        assert.strictEqual(definition.name, 'foo', `definition.name`);
        container.register(FooBindingBehavior);
        const instance = container.get(BindingBehavior.keyFrom('foo'));
        assert.instanceOf(instance, FooBindingBehavior, `instance`);
    });
    it('resolves to the same instance when impl was retrieved before registration', function () {
        const i1 = container.get(FooBindingBehavior);
        container.register(FooBindingBehavior);
        const i2 = container.get(BindingBehavior.keyFrom('foo'));
        const i3 = BindingBehavior.get(container, 'foo');
        assert.strictEqual(i1, i2);
        assert.strictEqual(i1, i3);
        const [_, i4] = container.getAll(FooBindingBehavior);
        assert.strictEqual(i4, undefined);
    });
    it('resolves to the same instance when impl was retrieved after registration', function () {
        container.register(FooBindingBehavior);
        const i1 = container.get(FooBindingBehavior);
        const i2 = container.get(BindingBehavior.keyFrom('foo'));
        const i3 = BindingBehavior.get(container, 'foo');
        assert.strictEqual(i1, i2);
        assert.strictEqual(i1, i3);
        const [_, i4] = container.getAll(FooBindingBehavior);
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
            bindingBehavior('foo1')
        ], Foo1);
        child1.register(Foo1);
        container.register(Foo1);
        BindingBehavior.get(child2, 'foo1');
        assert.strictEqual(id, 1, `should create binding behavior only once`);
        BindingBehavior.get(child1, 'foo1');
        assert.strictEqual(id, 2, `should create another binding behavior in the middle layer container`);
    });
});
//# sourceMappingURL=binding-behavior.spec.js.map