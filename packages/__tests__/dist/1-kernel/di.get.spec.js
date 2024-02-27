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
import { all, DI, factory, inject, resolve, lazy, newInstanceForScope, newInstanceOf, optional, Registration, singleton, transient } from '@aurelia/kernel';
import { assert } from '@aurelia/testing';
describe('1-kernel/di.get.spec.ts', function () {
    let container;
    beforeEach(function () {
        container = DI.createContainer();
    });
    afterEach(function () {
        assert.throws(() => resolve(class Abc {
        }));
    });
    describe('@lazy', function () {
        class Bar {
        }
        let Foo = class Foo {
            constructor(provider) {
                this.provider = provider;
            }
        };
        Foo = __decorate([
            __param(0, lazy(Bar)),
            __metadata("design:paramtypes", [Function])
        ], Foo);
        it('@singleton', function () {
            const bar0 = container.get(Foo).provider();
            const bar1 = container.get(Foo).provider();
            assert.strictEqual(bar0, bar1);
        });
        it('@transient', function () {
            container.register(Registration.transient(Bar, Bar));
            const bar0 = container.get(Foo).provider();
            const bar1 = container.get(Foo).provider();
            assert.notStrictEqual(bar0, bar1);
        });
    });
    describe('@scoped', function () {
        describe("true", function () {
            let ScopedFoo = class ScopedFoo {
            };
            ScopedFoo = __decorate([
                singleton({ scoped: true })
            ], ScopedFoo);
            describe('Foo', function () {
                const constructor = ScopedFoo;
                it('children', function () {
                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();
                    const a = child1.get(constructor);
                    const b = child2.get(constructor);
                    const c = child1.get(constructor);
                    assert.strictEqual(a, c, 'a and c are the same');
                    assert.notStrictEqual(a, b, 'a and b are not the same');
                    assert.strictEqual(root.has(constructor, false), false, 'root has class');
                    assert.strictEqual(child1.has(constructor, false), true, 'child1 has class');
                    assert.strictEqual(child2.has(constructor, false), true, 'child2 has class');
                });
                it('root', function () {
                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();
                    const a = root.get(constructor);
                    const b = child2.get(constructor);
                    const c = child1.get(constructor);
                    assert.strictEqual(a, c, 'a and c are the same');
                    assert.strictEqual(a, b, 'a and b are the same');
                    assert.strictEqual(root.has(constructor, false), true, 'root has class');
                    assert.strictEqual(child1.has(constructor, false), false, 'child1 does not have class');
                    assert.strictEqual(child2.has(constructor, false), false, 'child2 does not have class');
                });
            });
        });
        describe('false', function () {
            let ScopedFoo = class ScopedFoo {
            };
            ScopedFoo = __decorate([
                singleton({ scoped: false })
            ], ScopedFoo);
            describe('Foo', function () {
                const constructor = ScopedFoo;
                it('children', function () {
                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();
                    const a = child1.get(constructor);
                    const b = child2.get(constructor);
                    const c = child1.get(constructor);
                    assert.strictEqual(a, c, 'a and c are the same');
                    assert.strictEqual(a, b, 'a and b are the same');
                    assert.strictEqual(root.has(constructor, false), true, 'root has class');
                    assert.strictEqual(child1.has(constructor, false), false, 'child1 has class');
                    assert.strictEqual(child2.has(constructor, false), false, 'child2 has class');
                });
            });
            describe('default', function () {
                let DefaultFoo = class DefaultFoo {
                };
                DefaultFoo = __decorate([
                    singleton
                ], DefaultFoo);
                const constructor = DefaultFoo;
                it('children', function () {
                    const root = DI.createContainer();
                    const child1 = root.createChild();
                    const child2 = root.createChild();
                    const a = child1.get(constructor);
                    const b = child2.get(constructor);
                    const c = child1.get(constructor);
                    assert.strictEqual(a, c, 'a and c are the same');
                    assert.strictEqual(a, b, 'a and b are the same');
                    assert.strictEqual(root.has(constructor, false), true, 'root has class');
                    assert.strictEqual(child1.has(constructor, false), false, 'child1 has class');
                    assert.strictEqual(child2.has(constructor, false), false, 'child2 has class');
                });
            });
        });
    });
    describe('@optional', function () {
        it('with default', function () {
            let Foo = class Foo {
                constructor(test = 'hello') {
                    this.test = test;
                }
            };
            Foo = __decorate([
                __param(0, optional('key')),
                __metadata("design:paramtypes", [String])
            ], Foo);
            assert.strictEqual(container.get(Foo).test, 'hello');
        });
        it('no default, but param allows undefined', function () {
            let Foo = class Foo {
                constructor(test) {
                    this.test = test;
                }
            };
            Foo = __decorate([
                __param(0, optional('key')),
                __metadata("design:paramtypes", [String])
            ], Foo);
            assert.strictEqual(container.get(Foo).test, undefined);
        });
        it('no default, param does not allow undefind', function () {
            let Foo = class Foo {
                constructor(test) {
                    this.test = test;
                }
            };
            Foo = __decorate([
                __param(0, optional('key')),
                __metadata("design:paramtypes", [String])
            ], Foo);
            assert.strictEqual(container.get(Foo).test, undefined);
        });
        it('interface with default', function () {
            const Strings = DI.createInterface(x => x.instance([]));
            let Foo = class Foo {
                constructor(test) {
                    this.test = test;
                }
            };
            Foo = __decorate([
                __param(0, optional(Strings)),
                __metadata("design:paramtypes", [Array])
            ], Foo);
            assert.deepStrictEqual(container.get(Foo).test, undefined);
        });
        it('interface with default and default in constructor', function () {
            const MyStr = DI.createInterface(x => x.instance('hello'));
            let Foo = class Foo {
                constructor(test = 'test') {
                    this.test = test;
                }
            };
            Foo = __decorate([
                __param(0, optional(MyStr)),
                __metadata("design:paramtypes", [String])
            ], Foo);
            assert.deepStrictEqual(container.get(Foo).test, 'test');
        });
        it('interface with default registered and default in constructor', function () {
            const MyStr = DI.createInterface(x => x.instance('hello'));
            container.register(MyStr);
            let Foo = class Foo {
                constructor(test = 'test') {
                    this.test = test;
                }
            };
            Foo = __decorate([
                __param(0, optional(MyStr)),
                __metadata("design:paramtypes", [String])
            ], Foo);
            assert.deepStrictEqual(container.get(Foo).test, 'hello');
        });
    });
    describe('intrinsic', function () {
        describe('bad', function () {
            it('Array', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Array])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('ArrayBuffer', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [ArrayBuffer])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Boolean', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Boolean])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('boolean', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Boolean])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('DataView', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [DataView])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Date', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Date])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Error', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Error])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('EvalError', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [EvalError])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Float32Array', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Float32Array])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Float64Array', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Float64Array])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Function', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Function])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Int8Array', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Int8Array])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Int16Array', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Int16Array])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Int32Array', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Int16Array])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Map', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Map])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Number', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Number])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('number', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Number])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Object', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Object])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('object', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Object])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Promise', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Promise])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('RangeError', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [RangeError])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('ReferenceError', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [ReferenceError])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('RegExp', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [RegExp])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Set', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Set])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            if (typeof SharedArrayBuffer !== 'undefined') {
                it('SharedArrayBuffer', function () {
                    let Foo = class Foo {
                        constructor(test) {
                            this.test = test;
                        }
                    };
                    Foo = __decorate([
                        singleton,
                        __metadata("design:paramtypes", [SharedArrayBuffer])
                    ], Foo);
                    assert.throws(() => container.get(Foo));
                });
            }
            it('String', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [String])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('string', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [String])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('SyntaxError', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [SyntaxError])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('TypeError', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [TypeError])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Uint8Array', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Uint8Array])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Uint8ClampedArray', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Uint8ClampedArray])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Uint16Array', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Uint16Array])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('Uint32Array', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [Uint32Array])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('UriError', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [URIError])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('WeakMap', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [WeakMap])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
            it('WeakSet', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [WeakSet])
                ], Foo);
                assert.throws(() => container.get(Foo));
            });
        });
        describe('good', function () {
            it('@all()', function () {
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    __param(0, all('test')),
                    __metadata("design:paramtypes", [Array])
                ], Foo);
                assert.deepStrictEqual(container.get(Foo).test, []);
            });
            it('@optional()', function () {
                let Foo = class Foo {
                    constructor(test = null) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    __param(0, optional('test')),
                    __metadata("design:paramtypes", [String])
                ], Foo);
                assert.strictEqual(container.get(Foo).test, null);
            });
            it('undef instance, with constructor default', function () {
                container.register(Registration.instance('test', undefined));
                let Foo = class Foo {
                    constructor(test = []) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    __param(0, inject('test')),
                    __metadata("design:paramtypes", [Array])
                ], Foo);
                assert.deepStrictEqual(container.get(Foo).test, []);
            });
            it('can inject if registered', function () {
                container.register(Registration.instance(String, 'test'));
                let Foo = class Foo {
                    constructor(test) {
                        this.test = test;
                    }
                };
                Foo = __decorate([
                    singleton,
                    __metadata("design:paramtypes", [String])
                ], Foo);
                assert.deepStrictEqual(container.get(Foo).test, 'test');
            });
        });
    });
    describe('@newInstanceOf', function () {
        it('throws when there is no registration for interface', function () {
            const container = DI.createContainer();
            const I = DI.createInterface('I');
            assert.throws(() => container.get(newInstanceOf(I)), `No registration for interface: 'I'`);
        });
        it('instantiates when there is an constructable registration for an interface', function () {
            const container = DI.createContainer();
            const I = DI.createInterface('I');
            class Impl {
            }
            container.register(Registration.singleton(I, Impl));
            assert.instanceOf(container.get(newInstanceOf(I)), Impl);
        });
        it('jit-registers and instantiates when there is a default impl for an interface', function () {
            const container = DI.createContainer();
            class Impl {
            }
            const I = DI.createInterface('I', x => x.singleton(Impl));
            assert.instanceOf(container.get(newInstanceOf(I)), Impl);
        });
        it('does not register instance when retrieved through interface', function () {
            const container = DI.createContainer();
            const I = DI.createInterface('I');
            class Impl {
            }
            container.register(Registration.singleton(I, Impl));
            assert.notStrictEqual(container.get(newInstanceOf(I)), container.get(I));
            assert.strictEqual(container.getAll(I).length, 1);
        });
        it('does not throw when there is factory registration for an interface', function () {
            const container = DI.createContainer();
            const I = DI.createInterface('I');
            let iCallCount = 0;
            class IImpl {
                constructor() {
                    iCallCount++;
                }
            }
            container.registerFactory(I, {
                Type: IImpl,
                construct(c) {
                    return c.getFactory(this.Type).construct(c);
                },
                registerTransformer() {
                    return false;
                }
            });
            const instance1 = container.get(newInstanceOf(I));
            assert.strictEqual(iCallCount, 1);
            const instance2 = container.get(newInstanceOf(I));
            assert.strictEqual(iCallCount, 2);
            assert.notStrictEqual(instance1, instance2);
        });
        it('resolves dependencies from requestor', function () {
            const container = DI.createContainer();
            const I = DI.createInterface('I');
            const IDep = DI.createInterface('IDep');
            let iCallCount = 0;
            class IImpl {
                static get inject() {
                    return [IDep];
                }
                constructor() {
                    iCallCount++;
                }
            }
            let parentDepCallCount = 0;
            let childDepCallCount = 0;
            container.registerFactory(I, {
                Type: IImpl,
                construct(c) {
                    return c.getFactory(this.Type).construct(c);
                },
                registerTransformer() {
                    return false;
                }
            });
            container.registerFactory(IDep, {
                Type: class {
                    constructor() {
                        parentDepCallCount++;
                    }
                },
                construct(c) {
                    return c.getFactory(this.Type).construct(c);
                },
                registerTransformer() { }
            });
            const childContainer = container.createChild();
            class DepImpl {
                constructor() {
                    childDepCallCount++;
                }
            }
            childContainer.register(Registration.singleton(IDep, DepImpl));
            childContainer.registerFactory(IDep, {
                Type: DepImpl,
                construct(c) {
                    return c.getFactory(this.Type).construct(c);
                },
                registerTransformer() { }
            });
            const instance = childContainer.get(newInstanceOf(I));
            assert.strictEqual(iCallCount, 1);
            assert.strictEqual(parentDepCallCount, 0);
            assert.strictEqual(childDepCallCount, 1);
            assert.instanceOf(instance, IImpl);
        });
    });
    describe('@newInstanceForScope', function () {
        it('instantiates, but does not jit-registers, when there is a default impl for an interface', function () {
            const container = DI.createContainer();
            class Impl {
            }
            const I = DI.createInterface('I', x => x.singleton(Impl));
            assert.instanceOf(container.get(newInstanceForScope(I)), Impl);
            assert.strictEqual(container.getAll(I).length, 1);
        });
        it('does not jit-registers in parent', function () {
            const container = DI.createContainer();
            const child = container.createChild();
            class Impl {
            }
            const I = DI.createInterface('I', x => x.singleton(Impl));
            const instance = child.get(newInstanceForScope(I));
            assert.instanceOf(instance, Impl);
            assert.strictEqual(child.getAll(I).length, 1);
            assert.strictEqual(child.getAll(I)[0], instance);
            // has resolver, no instance
            // has resolver because createNewInstance/scope auto-registers a resolver
            // no instance because new instance forScope doesn't register on handler
            assert.strictEqual(container.has(I, false), false);
        });
        // the following test tests a more common, expected scenario,
        // where some instance is scoped to a child container,
        // instead of the container registering the interface itself.
        //
        // for the container that registers the interface itself,
        // the first registration is always a different resolver,
        // with the actual resolver that resolves the instance of the interface
        it('creates new instance once in child container', function () {
            const container = DI.createContainer();
            const I = DI.createInterface('I');
            let iCallCount = 0;
            class IImpl {
                constructor() {
                    iCallCount++;
                }
            }
            container.register(Registration.singleton(I, IImpl));
            container.registerFactory(I, {
                Type: IImpl,
                construct(c) {
                    return c.getFactory(this.Type).construct(c);
                },
                registerTransformer() {
                    return false;
                }
            });
            const childContainer = container.createChild();
            const instance = childContainer.get(newInstanceForScope(I));
            assert.strictEqual(iCallCount, 1);
            assert.instanceOf(instance, IImpl);
            const instance2 = childContainer.get(I);
            assert.strictEqual(iCallCount, 1);
            assert.instanceOf(instance2, IImpl);
            assert.strictEqual(instance, instance2);
            assert.strictEqual(instance, childContainer.createChild().get(I));
        });
    });
    describe('@factory', function () {
        it('resolves different factories', function () {
            const container = DI.createContainer();
            const I = DI.createInterface('I');
            const resolver = factory(I);
            const factory1 = container.get(resolver);
            const factory2 = container.get(resolver);
            assert.notStrictEqual(factory1, factory2);
        });
        it('invokes new instance when calling the factory', function () {
            const container = DI.createContainer();
            const f = container.get(factory(class MyClass {
                constructor() {
                    callCount++;
                }
            }));
            let callCount = 0;
            const instance1 = f();
            const instance2 = f();
            assert.strictEqual(callCount, 2);
            assert.notStrictEqual(instance1, instance2);
        });
        it('resolves with decorator usages', function () {
            const container = DI.createContainer();
            class MyClass {
                constructor() {
                    callCount++;
                }
            }
            let MyClassBuilder = class MyClassBuilder {
                constructor(myClassFactory) {
                    this.myClassFactory = myClassFactory;
                }
                build() {
                    return this.myClassFactory();
                }
            };
            MyClassBuilder = __decorate([
                __param(0, factory(MyClass)),
                __metadata("design:paramtypes", [Function])
            ], MyClassBuilder);
            let callCount = 0;
            const builder = container.get(MyClassBuilder);
            const instance1 = builder.build();
            const instance2 = builder.build();
            assert.strictEqual(callCount, 2);
            assert.notStrictEqual(instance1, instance2);
        });
        it('passes the dynamic parameters', function () {
            const container = DI.createContainer();
            class MyClass {
                constructor(...params) {
                    callCount++;
                    this.params = params;
                }
            }
            let MyClassBuilder = class MyClassBuilder {
                constructor(myClassFactory) {
                    this.myClassFactory = myClassFactory;
                }
                build(...args) {
                    return this.myClassFactory(...args);
                }
            };
            MyClassBuilder = __decorate([
                __param(0, factory(MyClass)),
                __metadata("design:paramtypes", [Function])
            ], MyClassBuilder);
            let callCount = 0;
            const builder = container.get(MyClassBuilder);
            const instance1 = builder.build(1, 2, { a: 1, b: 2 });
            const instance2 = builder.build(3, 4, { a: 3, b: 4 });
            assert.strictEqual(callCount, 2);
            assert.notStrictEqual(instance1, instance2);
            assert.deepStrictEqual(instance1.params, [1, 2, { a: 1, b: 2 }]);
            assert.deepStrictEqual(instance2.params, [3, 4, { a: 3, b: 4 }]);
        });
        // guess we can add a test for factory resolving to a factory resolving to a factory
        // to see if things work smoothly... TODO?
    });
    describe('resolve', function () {
        it('works with resolve(all(...))', function () {
            let id = 0;
            const II = DI.createInterface();
            class Model {
                constructor() {
                    this.id = ++id;
                }
            }
            class A {
                constructor() {
                    this.a = resolve(all(II));
                }
            }
            container.register(Registration.transient(II, class I1 {
                constructor() {
                    this.a = resolve(Model);
                }
            }), Registration.transient(II, class I2 {
                constructor() {
                    this.a = resolve(newInstanceOf(Model));
                }
            }));
            const { a } = container.get(A);
            assert.deepStrictEqual(a.map(a => a.a.id), [1, 2]);
        });
        it('works with a list of keys', function () {
            let i = 0;
            class Model {
                constructor() {
                    this.v = ++i;
                }
            }
            class Base {
                constructor() {
                    this.a = resolve(Model, newInstanceOf(Model));
                }
            }
            const { a: [{ v }, { v: v1 }] } = container.get(Base);
            assert.strictEqual(v, 1);
            assert.strictEqual(v1, 2);
        });
        it('works with resolve(transient(...))', function () {
            let id = 0;
            class Model {
                constructor() {
                    this.id = ++id;
                }
            }
            const { a, b } = container.get(class A {
                constructor() {
                    this.a = resolve(transient(Model));
                    this.b = resolve(transient(Model));
                }
            });
            assert.deepStrictEqual([a.id, b.id], [1, 2]);
        });
        it('works with resolve(lazy(...))', function () {
            let id = 0;
            class Model {
                constructor() {
                    this.id = ++id;
                }
            }
            const { a, b } = container.get(class A {
                constructor() {
                    this.a = resolve(lazy(Model));
                    this.b = resolve(lazy(Model));
                }
            });
            assert.deepStrictEqual([a().id, b().id], [1, 1]);
            assert.deepStrictEqual([a().id, b().id], [1, 1]);
        });
        it('works with resolve(optional(...))', function () {
            let id = 0;
            class Model {
                constructor() {
                    this.id = ++id;
                }
            }
            const { a, b } = container.get(class A {
                constructor() {
                    this.a = resolve(optional(Model));
                    this.b = resolve(optional(Model));
                }
            });
            assert.deepStrictEqual([a?.id, b?.id], [undefined, undefined]);
        });
        it('works with resolve(newInstanceOf(...))', function () {
            let id = 0;
            class Model {
                constructor() {
                    this.id = ++id;
                }
            }
            const { a, b } = container.get(class A {
                constructor() {
                    this._ = resolve(Model);
                    this.a = resolve(newInstanceOf(Model));
                    this.b = resolve(newInstanceOf(Model));
                }
            });
            assert.deepStrictEqual([a.id, b.id], [2, 3]);
            assert.strictEqual(container.getAll(Model).length, 1);
        });
        it('works with resolve(newInstanceForScope(...))', function () {
            let id = 0;
            class Model {
                constructor() {
                    this.id = ++id;
                }
            }
            const { a, b } = container.get(class A {
                constructor() {
                    this._ = resolve(Model);
                    this.a = resolve(newInstanceForScope(Model));
                    this.b = resolve(newInstanceForScope(Model));
                }
            });
            assert.deepStrictEqual([a.id, b.id], [2, 3]);
            assert.strictEqual(container.getAll(Model).length, 3);
        });
        it('works with resolve(factory(...))', function () {
            let id = 0;
            class Model {
                constructor(...args) {
                    this.id = ++id;
                    this.args = args;
                }
                get sum() {
                    return this.id + this.args.reduce((c, i) => c + i, 0);
                }
            }
            const { a, b } = container.get(class A {
                constructor() {
                    this.a = resolve(factory(Model));
                    this.b = resolve(factory(Model));
                }
            });
            assert.deepStrictEqual([a(1, 2).sum, b(1, 2).sum], [4, 5]);
        });
        it('works with deeply nested resolve(...)', function () {
            let i = 0;
            class Address {
                constructor() {
                    this.n = ++i;
                }
            }
            class Details {
                constructor() {
                    this.address1 = resolve(Address);
                    this.address2 = resolve(newInstanceForScope(Address));
                }
            }
            class Profile {
                constructor() {
                    this.details = resolve(Details);
                }
            }
            class Parent {
                constructor() {
                    this.model = resolve(Profile);
                }
            }
            class Child {
                constructor() {
                    this.parent = resolve(Parent);
                }
            }
            const { parent } = container.get(Child);
            assert.strictEqual(parent.model.details.address1.n, 1);
            assert.strictEqual(parent.model.details.address2.n, 2);
            assert.strictEqual(parent.model.details, container.get(Details));
        });
        describe('with [inheritance]', function () {
            it('works for basic inheritance', function () {
                let i = 0;
                class Model {
                    constructor() {
                        this.v = ++i;
                    }
                }
                class Base {
                    constructor() {
                        this.a = resolve(Model);
                    }
                }
                const { a: { v } } = container.get(class extends Base {
                });
                assert.strictEqual(v, 1);
            });
            it('works with deeply nested resolve(...)', function () {
                let id = 0;
                class Model {
                    constructor() {
                        this.id = ++id;
                    }
                }
                class Value {
                    constructor() {
                        this.a = resolve(newInstanceOf(Model));
                    }
                }
                class V2 extends Value {
                    constructor() {
                        super(...arguments);
                        this.a = resolve(newInstanceOf(Model));
                    }
                }
                class V3 extends V2 {
                    constructor() {
                        super(...arguments);
                        this.a = resolve(newInstanceOf(Model));
                    }
                }
                const { a } = container.get(V3);
                assert.strictEqual(a.id, 3);
            });
            it('works with a list of keys', function () {
                let i = 0;
                class Model {
                    constructor() {
                        this.v = ++i;
                    }
                }
                class Base {
                    constructor() {
                        this.a = resolve(Model, newInstanceOf(Model));
                    }
                }
                const { a: [{ v }, { v: v1 }] } = container.get(class extends Base {
                });
                assert.strictEqual(v, 1);
                assert.strictEqual(v1, 2);
            });
            it('works with multiple all(...)', function () {
                let i = 0;
                let j = 0;
                class Model {
                    constructor() {
                        this.v = ++i;
                    }
                }
                class Base {
                    constructor() {
                        this.a = resolve(newInstanceForScope(Model), newInstanceForScope(Model));
                    }
                }
                const I = DI.createInterface();
                container.register(Registration.transient(I, class extends Base {
                }), Registration.transient(I, class extends Base {
                    constructor() {
                        super(...arguments);
                        this.j = ++j;
                    }
                }));
                container.invoke(class {
                    constructor() {
                        this.b = resolve(all(I), all(I));
                    }
                });
                assert.strictEqual(container.getAll(Model).length, 8);
                assert.strictEqual(i, 8);
                assert.strictEqual(j, 2);
            });
        });
    });
});
//# sourceMappingURL=di.get.spec.js.map