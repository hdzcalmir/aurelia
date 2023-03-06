import { ViewFactory, } from '@aurelia/runtime-html';
import { eachCartesianJoin, assert, } from '@aurelia/testing';
class StubView {
    constructor(cached = false) {
        this.cached = cached;
    }
    $cache() {
        this.cached = true;
    }
}
class StubContext {
    constructor(nodes = { findTargets() { return []; } }, compiledDefinition = { instructions: [] }) {
        this.nodes = nodes;
        this.compiledDefinition = compiledDefinition;
    }
    compile() {
        return this;
    }
    createNodes() {
        return this.nodes;
    }
}
// eslint-disable-next-line mocha/no-skipped-tests
describe.skip(`3-runtime-html/view.spec.ts`, function () {
    describe(`tryReturnToCache`, function () {
        const doNotOverrideVariations = [
            [' true', true],
            ['false', false]
        ];
        const sizeVariations = [
            [`  -2`, -2, false],
            [`  -1`, -1, false],
            [`   0`, 0, false],
            [`   1`, 1, true],
            [`'-2'`, '-2', false],
            [`'-1'`, '-1', false],
            [` '0'`, '0', false],
            [` '1'`, '1', true],
            [` '*'`, '*', true]
        ];
        const doNotOverrideVariations2 = [
            [' true', true],
            ['false', false]
        ];
        const sizeVariations2 = [
            [`  -2`, -2, false],
            [`  -1`, -1, false],
            [`   0`, 0, false],
            [`   1`, 1, true],
            [`'-2'`, '-2', false],
            [`'-1'`, '-1', false],
            [` '0'`, '0', false],
            [` '1'`, '1', true],
            [` '*'`, '*', true]
        ];
        const inputs = [doNotOverrideVariations, sizeVariations, doNotOverrideVariations2, sizeVariations2];
        eachCartesianJoin(inputs, ([text1, doNotOverride1], [text2, size2, isPositive2], [text3, doNotOverride3], [text4, size4, isPositive4]) => {
            it(`setCacheSize(${text2},${text1}) -> tryReturnToCache -> create x2 -> setCacheSize(${text4},${text3}) -> tryReturnToCache -> create x2`, function () {
                const context = new StubContext();
                const sut = new ViewFactory(null, context);
                const view1 = new StubView();
                const view2 = new StubView();
                sut.setCacheSize(size2, doNotOverride1);
                let canCache = isPositive2;
                assert.strictEqual(sut.tryReturnToCache(view1), canCache, 'sut.tryReturnToCache(view1)');
                assert.strictEqual(view1.cached, canCache, 'view1.cached');
                if (canCache) {
                    const cached = sut.create();
                    assert.strictEqual(cached, view1, 'cached');
                    const created = sut.create();
                    assert.strictEqual(created.nodes, context.nodes, 'created.nodes');
                    assert.strictEqual(sut.tryReturnToCache(view1), true, 'sut.tryReturnToCache(<any>view1)');
                    if (size2 !== '*') {
                        assert.strictEqual(sut.tryReturnToCache(view1), false, 'sut.tryReturnToCache(view1) 2');
                    }
                }
                else {
                    const created = sut.create();
                    assert.strictEqual(created.nodes, context.nodes, 'created.nodes');
                }
                // note: the difference in behavior between 0 (number) and '0' (string),
                // and the behavior of values lower than -1 are kind of quirky
                // probably not important enough for the overhead of an extra check, but at least worth a note
                if (size4 && ((size2 === -1 || size2 === '-1' || size2 === 0) || !doNotOverride3)) {
                    canCache = isPositive4;
                }
                sut.setCacheSize(size4, doNotOverride3);
                assert.strictEqual(sut.tryReturnToCache(view2), canCache, 'sut.tryReturnToCache(view2)');
                assert.strictEqual(view2.cached, canCache, 'view2.cached');
                if (canCache) {
                    const cached = sut.create();
                    assert.strictEqual(cached, view2, 'cached');
                    const created = sut.create();
                    assert.strictEqual(created.nodes, context.nodes, 'created.nodes');
                    assert.strictEqual(sut.tryReturnToCache(view2), true, 'sut.tryReturnToCache(<any>view2)');
                    if (size2 !== '*' && size4 !== '*') {
                        assert.strictEqual(sut.tryReturnToCache(view2), false, 'sut.tryReturnToCache(view2) 2');
                    }
                }
                else {
                    const created = sut.create();
                    assert.strictEqual(created.nodes, context.nodes, 'created.nodes');
                }
            });
        });
    });
});
//# sourceMappingURL=view.spec.js.map