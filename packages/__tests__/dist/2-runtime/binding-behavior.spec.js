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
        definition.register(container);
        const instance = container.get(BindingBehavior.keyFrom('foo'));
        assert.instanceOf(instance, FooBindingBehavior, `instance`);
    });
});
//# sourceMappingURL=binding-behavior.spec.js.map