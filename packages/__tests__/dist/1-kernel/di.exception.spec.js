import { DI, optional, resolve } from '@aurelia/kernel';
import { assert } from '@aurelia/testing';
describe('1-kernel/di.exception.spec.ts', function () {
    it('No registration for interface', function () {
        const container = DI.createContainer();
        const Foo = DI.createInterface('Foo');
        class Bar {
            constructor() {
                this.foo = resolve(Foo);
            }
        }
        assert.throws(() => container.get(Foo), /.*Foo*/, 'throws once');
        assert.throws(() => container.get(Foo), /.*Foo*/, 'throws twice'); // regression test
        assert.throws(() => container.get(Bar), /.*Foo.*/, 'throws on inject into');
    });
    it('cyclic dependency', function () {
        const container = DI.createContainer();
        const IFoo = DI.createInterface('IFoo', x => x.singleton(Foo));
        class Foo {
            constructor() {
                this.parent = resolve(optional(IFoo));
            }
        }
        let ex;
        try {
            container.get(IFoo);
        }
        catch (e) {
            ex = e;
        }
        assert.match(ex?.message, /AUR0003:Foo/, 'container.get(IFoo) - cyclic dep');
        // assert.throws(() => container.get(IFoo), /.*Cycl*/, 'test');
    });
});
//# sourceMappingURL=di.exception.spec.js.map