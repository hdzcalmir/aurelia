var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { DI, optional } from '@aurelia/kernel';
import { assert } from '@aurelia/testing';
describe('1-kernel/di.exception.spec.ts', function () {
    it('No registration for interface', function () {
        const container = DI.createContainer();
        const Foo = DI.createInterface('Foo');
        let Bar = class Bar {
            constructor(foo) {
                this.foo = foo;
            }
        };
        Bar = __decorate([
            __param(0, Foo),
            __metadata("design:paramtypes", [Object])
        ], Bar);
        assert.throws(() => container.get(Foo), /.*Foo*/, 'throws once');
        assert.throws(() => container.get(Foo), /.*Foo*/, 'throws twice'); // regression test
        assert.throws(() => container.get(Bar), /.*Foo.*/, 'throws on inject into');
    });
    it('cyclic dependency', function () {
        const container = DI.createContainer();
        const IFoo = DI.createInterface('IFoo', x => x.singleton(Foo));
        let Foo = class Foo {
            constructor(parent) {
                this.parent = parent;
            }
        };
        Foo = __decorate([
            __param(0, optional(IFoo)),
            __metadata("design:paramtypes", [Object])
        ], Foo);
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