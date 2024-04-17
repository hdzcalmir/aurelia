import { all, DI, resolve, newInstanceOf, Registration } from '@aurelia/kernel';
import { assert } from '@aurelia/testing';
describe('1-kernel/di.getAll.spec.ts', function () {
    let container;
    beforeEach(function () {
        container = DI.createContainer();
    });
    describe('good', function () {
        // eslint-disable
        for (const searchAncestors of [true, false])
            for (const regInChild of [true, false])
                for (const regInParent of [true, false]) {
                    // eslint-enable
                    it(`@all(_, ${searchAncestors}) + [child ${regInChild}] + [parent ${regInParent}]`, function () {
                        class Foo {
                            constructor() {
                                this.test = resolve(all('test', searchAncestors));
                            }
                        }
                        const child = container.createChild();
                        if (regInParent) {
                            container.register(Registration.instance('test', 'test1'));
                        }
                        if (regInChild) {
                            child.register(Registration.instance('test', 'test0'));
                        }
                        const expectation = regInChild ? ['test0'] : [];
                        if (regInParent && (searchAncestors || !regInChild)) {
                            expectation.push('test1');
                        }
                        assert.deepStrictEqual(child.get(Foo).test, expectation);
                    });
                }
    });
    describe('realistic usage', function () {
        const IAttrPattern = DI.createInterface('IAttrPattern');
        // eslint-disable
        for (const searchAncestors of [true, false])
            for (const regInChild of [true, false])
                for (const regInParent of [true, false]) {
                    // eslint-enable
                    it(`@all(IAttrPattern, ${searchAncestors}) + [child ${regInChild}] + [parent ${regInParent}]`, function () {
                        class Foo {
                            constructor() {
                                this.attrPatterns = resolve(all(IAttrPattern, searchAncestors));
                            }
                            patterns() {
                                return this.attrPatterns.map(ap => ap.id);
                            }
                        }
                        const child = container.createChild();
                        if (regInParent) {
                            Array
                                .from({ length: 5 }, (_, idx) => class {
                                constructor() {
                                    this.id = idx;
                                }
                                static register(c) {
                                    Registration.singleton(IAttrPattern, this).register(c);
                                }
                            })
                                .forEach(klass => container.register(klass));
                        }
                        if (regInChild) {
                            Array
                                .from({ length: 5 }, (_, idx) => class {
                                constructor() {
                                    this.id = idx + 5;
                                }
                                static register(c) {
                                    Registration.singleton(IAttrPattern, this).register(c);
                                }
                            })
                                .forEach(klass => child.register(klass));
                        }
                        let parentExpectation = [];
                        const childExpectation = regInChild ? [5, 6, 7, 8, 9] : [];
                        if (regInParent) {
                            if (searchAncestors || !regInChild) {
                                childExpectation.push(0, 1, 2, 3, 4);
                            }
                            parentExpectation.push(0, 1, 2, 3, 4);
                        }
                        if (regInChild) {
                            parentExpectation = childExpectation;
                        }
                        assert.deepStrictEqual(child.get(Foo).patterns(), childExpectation, `Deps in [child] should have been ${JSON.stringify(childExpectation)}`);
                        assert.deepStrictEqual(container.get(Foo).patterns(), parentExpectation, `Deps in [parent] should have been ${JSON.stringify(regInChild ? childExpectation : parentExpectation)}`);
                    });
                }
    });
    describe('resolve()', function () {
        it('works with .getAll()', function () {
            let id = 0;
            const II = DI.createInterface();
            class Model {
                constructor() {
                    this.id = ++id;
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
            const iis = container.getAll(II);
            assert.deepStrictEqual(iis.map(a => a.a.id), [1, 2]);
        });
    });
});
//# sourceMappingURL=di.getAll.spec.js.map