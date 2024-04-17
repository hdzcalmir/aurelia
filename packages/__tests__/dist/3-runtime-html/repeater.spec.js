var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { CustomElement, Aurelia, valueConverter } from '@aurelia/runtime-html';
import { eachCartesianJoin, TestContext, assert, } from '@aurelia/testing';
describe('3-runtime-html/repeater.spec.ts', function () {
    let SortValueConverter = (() => {
        let _classDecorators = [valueConverter('sort')];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var SortValueConverter = _classThis = class {
            toView(arr, prop, dir = 'asc') {
                if (Array.isArray(arr)) {
                    const factor = dir === 'asc' ? 1 : -1;
                    if (prop?.length) {
                        arr.sort((a, b) => a[prop] - b[prop] * factor);
                    }
                    else {
                        arr.sort((a, b) => a - b * factor);
                    }
                }
                return arr;
            }
        };
        __setFunctionName(_classThis, "SortValueConverter");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SortValueConverter = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return SortValueConverter = _classThis;
    })();
    const bindSpecs = [
        {
            t: '01',
            forof: `[a,b,c]`,
            item: `\${item}`,
            expected: `123`,
            initialize(c) {
                c.a = 1;
                c.b = 2;
                c.c = 3;
            }
        },
        {
            t: '02',
            forof: `[c,b,a]|sort`,
            item: `\${item}`,
            expected: `123`,
            initialize(c) {
                c.a = 1;
                c.b = 2;
                c.c = 3;
            }
        },
        {
            t: '03',
            forof: `[1+1,2+1,3+1]`,
            item: `\${item}`,
            expected: `234`,
            initialize() { return; }
        },
        {
            t: '04',
            forof: `[1,2,3]`,
            item: `\${item}`,
            expected: `123`,
            initialize() { return; }
        },
        {
            t: '05',
            forof: `[3,2,1]|sort`,
            item: `\${item}`,
            expected: `123`,
            initialize() { return; }
        },
        {
            t: '06',
            forof: `[{i:1},{i:2},{i:3}]`,
            item: `\${item.i}`,
            expected: `123`,
            initialize() { return; }
        },
        {
            t: '07',
            forof: `[[1],[2],[3]]`,
            item: `\${item[0]}`,
            expected: `123`,
            initialize() { return; }
        },
        {
            t: '08',
            forof: `[[a],[b],[c]]`,
            item: `\${item[0]}`,
            expected: `123`,
            initialize(c) {
                c.a = 1;
                c.b = 2;
                c.c = 3;
            }
        },
        {
            t: '09',
            forof: `3`,
            item: `\${item}`,
            expected: `012`,
            initialize() { return; }
        },
        {
            t: '10',
            forof: `null`,
            item: `\${item}`,
            expected: ``,
            initialize() { return; }
        },
        {
            t: '11',
            forof: `undefined`,
            item: `\${item}`,
            expected: ``,
            initialize() { return; }
        },
        {
            t: '12',
            forof: `items`,
            item: `\${item}`,
            expected: `123`,
            initialize(c) {
                c.items = ['1', '2', '3'];
            }
        },
        {
            t: '13',
            forof: `items|sort`,
            item: `\${item}`,
            expected: `123`,
            initialize(c) {
                c.items = ['3', '2', '1'];
            }
        },
        {
            t: '14',
            forof: `items`,
            item: `\${item.i}`,
            expected: `123`,
            initialize(c) {
                c.items = [{ i: 1 }, { i: 2 }, { i: 3 }];
            }
        },
        {
            t: '15',
            forof: `items|sort:'i'`,
            item: `\${item.i}`,
            expected: `123`,
            initialize(c) {
                c.items = [{ i: 3 }, { i: 2 }, { i: 1 }];
            }
        },
        {
            t: '16',
            forof: `items`,
            item: `\${item}`,
            expected: `123`,
            initialize(c) {
                c.items = new Set(['1', '2', '3']);
            }
        },
        {
            t: '17',
            forof: `items`,
            item: `\${item[0]}\${item[1]}`,
            expected: `1a2b3c`,
            initialize(c) {
                c.items = new Map([['1', 'a'], ['2', 'b'], ['3', 'c']]);
            }
        }
    ];
    const templateSpecs = [
        {
            t: '01',
            createTemplate(items, tpl) {
                return `<template><div repeat.for="item of ${items}">${tpl}</div></template>`;
            }
        },
        {
            t: '02',
            createTemplate(items, tpl) {
                return `<template><div repeat.for="item of ${items}" if.bind="true">${tpl}</div></template>`;
            }
        },
        {
            t: '03',
            createTemplate(items, tpl) {
                return `<template><div if.bind="true" repeat.for="item of ${items}">${tpl}</div></template>`;
            }
        },
        {
            t: '04',
            createTemplate(items, tpl) {
                return `<template><div if.bind="false"></div><div else repeat.for="item of ${items}">${tpl}</div></template>`;
            }
        },
        {
            t: '05',
            createTemplate(items, tpl) {
                return `<template><template repeat.for="item of ${items}">${tpl}</template></template>`;
            }
        },
        {
            t: '06',
            createTemplate(items, tpl) {
                return `<template><template repeat.for="item of ${items}"><div if.bind="true">${tpl}</div></template></template>`;
            }
        },
        {
            t: '07',
            createTemplate(items, tpl) {
                return `<template><template repeat.for="item of ${items}"><div if.bind="false"></div><div else>${tpl}</div></template></template>`;
            }
        },
    ];
    eachCartesianJoin([bindSpecs, templateSpecs], (bindSpec, templateSpec) => {
        it(`bindSpec ${bindSpec.t}, templateSpec ${templateSpec.t}`, async function () {
            const { forof, item, expected, initialize } = bindSpec;
            const { createTemplate } = templateSpec;
            const ctx = TestContext.create();
            const { container } = ctx;
            container.register(SortValueConverter);
            const markup = createTemplate(forof, item);
            const App = CustomElement.define({ name: 'app', template: markup }, class {
            });
            const host = ctx.createElement('div');
            const component = new App();
            initialize(component);
            const au = new Aurelia(container);
            au.app({ host, component });
            await au.start();
            assert.strictEqual(host.textContent, expected, 'host.textContent');
            await au.stop();
            assert.strictEqual(host.textContent, '', 'host.textContent');
            au.dispose();
        });
    });
});
//# sourceMappingURL=repeater.spec.js.map