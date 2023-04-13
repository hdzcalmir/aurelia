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
import { assert, TestContext, } from '@aurelia/testing';
import { bindable, bindingBehavior, valueConverter, customAttribute, CustomElement, INode, CustomAttribute, Aurelia, ValueConverter, } from '@aurelia/runtime-html';
import { isNode } from '../util.js';
describe('3-runtime-html/template-compiler.primary-bindable.spec.ts', function () {
    const testCases = [
        {
            title: '(1) works in basic scenario',
            template: '<div square="red"></div>',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.background = this.color;
                    }
                };
                __decorate([
                    bindable(),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute('square'),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host, _comp, _attrs) => {
                assert.equal(host.querySelector('div').style.backgroundColor, 'red', 'background === red');
            }
        },
        {
            title: '(2) works in basic scenario, with [primary] 1st position',
            template: '<div square="red"></div>',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.background = this.color;
                        assert.strictEqual(this.diameter, undefined, 'diameter === undefined');
                    }
                };
                __decorate([
                    bindable({ primary: true }),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                __decorate([
                    bindable(),
                    __metadata("design:type", Number)
                ], Square.prototype, "diameter", void 0);
                Square = __decorate([
                    customAttribute('square'),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host, _comp, _attrs) => {
                assert.equal(host.querySelector('div').style.backgroundColor, 'red', 'background === red');
            }
        },
        {
            title: '(3) works in basic scenario, with [primary] 2nd position',
            template: '<div square="red"></div>',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.background = this.color;
                        assert.strictEqual(this.diameter, undefined, 'diameter === undefined');
                    }
                };
                __decorate([
                    bindable(),
                    __metadata("design:type", Number)
                ], Square.prototype, "diameter", void 0);
                __decorate([
                    bindable({ primary: true }),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute('square'),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host, _comp, _attrs) => {
                assert.equal(host.querySelector('div').style.backgroundColor, 'red', 'background === red');
            }
        },
        {
            title: '(4) works in basic scenario, [dynamic options style]',
            template: '<div square="color: red"></div>',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.background = this.color;
                    }
                };
                __decorate([
                    bindable(),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute({
                        name: 'square'
                    }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host, _comp, _attrs) => {
                assert.equal(host.querySelector('div').style.backgroundColor, 'red', 'background === red');
            }
        },
        {
            title: '(5) works in basic scenario, [dynamic options style] + [primary] 1st position',
            template: '<div square="color: red"></div>',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.background = this.color;
                        assert.strictEqual(this.diameter, undefined);
                    }
                };
                __decorate([
                    bindable({ primary: true }),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                __decorate([
                    bindable(),
                    __metadata("design:type", String)
                ], Square.prototype, "diameter", void 0);
                Square = __decorate([
                    customAttribute({
                        name: 'square'
                    }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host, _comp, _attrs) => {
                assert.equal(host.querySelector('div').style.backgroundColor, 'red', 'background === red');
            }
        },
        {
            title: '(6) works in basic scenario, [dynamic options style] + [primary] 2nd position',
            template: '<div square="color: red"></div>',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.background = this.color;
                    }
                };
                __decorate([
                    bindable(),
                    __metadata("design:type", String)
                ], Square.prototype, "diameter", void 0);
                __decorate([
                    bindable({ primary: true }),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute({
                        name: 'square'
                    }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host, _comp, _attrs) => {
                assert.equal(host.querySelector('div').style.backgroundColor, 'red', 'background === red');
            }
        },
        {
            title: '(7) works with interpolation',
            template: `<div square="color: \${\`red\`}; diameter: \${5}"></div>`,
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.background = this.color;
                        this.el.style.width = this.el.style.height = `${this.diameter}px`;
                    }
                };
                __decorate([
                    bindable(),
                    __metadata("design:type", Number)
                ], Square.prototype, "diameter", void 0);
                __decorate([
                    bindable(),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute({
                        name: 'square'
                    }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host, _comp, _attrs) => {
                assert.equal(host.querySelector('div').style.backgroundColor, 'red', 'background === red');
                assert.equal(host.querySelector('div').style.width, '5px');
            }
        },
        {
            title: '(8) default to "value" as primary bindable',
            template: '<div square.bind="color || `red`">',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.background = this.value;
                    }
                };
                Square = __decorate([
                    customAttribute({ name: 'square' }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host, _comp) => {
                assert.equal(host.querySelector('div').style.backgroundColor, 'red', 'background === red');
            }
        },
        ...[
            'color | identity: value',
            '`literal:literal`',
            'color & bb:value',
        ].map((expression, idx) => {
            return {
                title: `(${8 + idx + 1}) does not get interpreted as multi bindings when there is a binding command with colon in value: ${expression}`,
                template: `<div square.bind="${expression}">`,
                attrResources: () => {
                    let Square = class Square {
                        constructor(el) {
                            this.el = el;
                        }
                        binding() {
                            const value = this.value === 'literal:literal' ? 'red' : this.value;
                            this.el.style.background = value;
                        }
                    };
                    Square = __decorate([
                        customAttribute({ name: 'square' }),
                        __param(0, INode),
                        __metadata("design:paramtypes", [Object])
                    ], Square);
                    let Identity = class Identity {
                        toView(val, alternativeValue) {
                            return alternativeValue || val;
                        }
                    };
                    Identity = __decorate([
                        valueConverter('identity')
                    ], Identity);
                    let BB = class BB {
                        bind() { }
                        unbind() { }
                    };
                    BB = __decorate([
                        bindingBehavior('bb')
                    ], BB);
                    return [Square, Identity, BB];
                },
                root: class App {
                    constructor() {
                        this.color = 'red';
                    }
                },
                assertFn: (_ctx, host, _comp) => {
                    assert.equal(host.querySelector('div').style.backgroundColor, 'red', 'background === red');
                }
            };
        }),
        // unhappy usage
        {
            title: 'throws when combining binding commnd with interpolation',
            template: `<div square="color.bind: \${\`red\`}; diameter: \${5}"></div>`,
            testWillThrow: true,
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                };
                __decorate([
                    bindable(),
                    __metadata("design:type", Number)
                ], Square.prototype, "diameter", void 0);
                __decorate([
                    bindable(),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute({
                        name: 'square'
                    }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, _host, _comp, _attrs) => {
                throw new Error('Should not have run');
            }
        },
        {
            title: 'throws when there are two primaries',
            template: '<div square="red"></div>',
            testWillThrow: true,
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                };
                __decorate([
                    bindable({ primary: true }),
                    __metadata("design:type", Number)
                ], Square.prototype, "diameter", void 0);
                __decorate([
                    bindable({ primary: true }),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute({
                        name: 'square'
                    }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, _host, _comp, _attrs) => {
                throw new Error('Should not have run');
            }
        },
        {
            title: 'works with long name, in single binding syntax',
            template: '<div square="5"></div>',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.borderRadius = `${this.borderRadius || 0}px`;
                    }
                };
                __decorate([
                    bindable({ primary: true }),
                    __metadata("design:type", Number)
                ], Square.prototype, "borderRadius", void 0);
                __decorate([
                    bindable(),
                    __metadata("design:type", Number)
                ], Square.prototype, "diameter", void 0);
                __decorate([
                    bindable(),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute({
                        name: 'square'
                    }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host) => {
                assert.strictEqual(host.querySelector('div').style.borderRadius, '5px');
            }
        },
        {
            title: 'works with long name, in multi binding syntax',
            template: '<div square="border-radius: 5; color: red"></div>',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.borderRadius = `${this.borderRadius || 0}px`;
                        this.el.style.color = this.color;
                    }
                };
                __decorate([
                    bindable({ primary: true }),
                    __metadata("design:type", Number)
                ], Square.prototype, "borderRadius", void 0);
                __decorate([
                    bindable(),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute({
                        name: 'square'
                    }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host) => {
                const divEl = host.querySelector('div');
                assert.strictEqual(divEl.style.borderRadius, '5px');
                assert.strictEqual(divEl.style.color, 'red');
            }
        },
        {
            title: 'works with long name, in multi binding syntax + with binding command',
            template: '<div square="border-radius.bind: 5; color: red"></div>',
            attrResources: () => {
                let Square = class Square {
                    constructor(el) {
                        this.el = el;
                    }
                    binding() {
                        this.el.style.borderRadius = `${this.borderRadius || 0}px`;
                        this.el.style.color = this.color;
                    }
                };
                __decorate([
                    bindable({ primary: true }),
                    __metadata("design:type", Number)
                ], Square.prototype, "borderRadius", void 0);
                __decorate([
                    bindable(),
                    __metadata("design:type", String)
                ], Square.prototype, "color", void 0);
                Square = __decorate([
                    customAttribute({
                        name: 'square'
                    }),
                    __param(0, INode),
                    __metadata("design:paramtypes", [Object])
                ], Square);
                return [Square];
            },
            assertFn: (_ctx, host) => {
                const divEl = host.querySelector('div');
                assert.strictEqual(divEl.style.borderRadius, '5px');
                assert.strictEqual(divEl.style.color, 'red');
            }
        },
    ];
    for (const testCase of testCases) {
        const { title, template, root, attrResources = () => [], resources = [], only, assertFn, testWillThrow } = testCase;
        // if (!PLATFORM.isBrowserLike && browserOnly) {
        //   continue;
        // }
        const suit = (_title, fn) => only
            // eslint-disable-next-line mocha/no-exclusive-tests
            ? it.only(_title, fn)
            : it(_title, fn);
        suit(title, async function () {
            let body;
            let host;
            try {
                const ctx = TestContext.create();
                const App = CustomElement.define({ name: 'app', template }, root);
                const au = new Aurelia(ctx.container);
                const attrs = typeof attrResources === 'function' ? attrResources() : attrResources;
                body = ctx.doc.body;
                host = body.appendChild(ctx.createElement('app'));
                ctx.container.register(...resources, ...attrs);
                let component;
                try {
                    au.app({ host, component: App });
                    await au.start();
                    component = au.root.controller.viewModel;
                }
                catch (ex) {
                    if (testWillThrow) {
                        // dont try to assert anything on throw
                        // just bails
                        try {
                            await au.stop();
                        }
                        catch { /* and ignore all errors trying to stop */ }
                        return;
                    }
                    throw ex;
                }
                if (testWillThrow) {
                    throw new Error('Expected test to throw, but did NOT');
                }
                await assertFn(ctx, host, component, attrs);
                await au.stop();
                au.dispose();
                // await assertFn_AfterDestroy(ctx, host, component);
            }
            finally {
                if (host) {
                    host.remove();
                }
                if (body) {
                    body.focus();
                }
            }
        });
    }
    describe('mimic vCurrent route-href', function () {
        class $RouteHref$ {
            constructor(el) {
                this.el = el;
                /*  */
            }
            binding() {
                this.updateAnchor('route');
            }
            routeChanged() {
                this.updateAnchor('route');
            }
            paramsChanged() {
                this.updateAnchor('params');
            }
            updateAnchor(property) {
                this.el.href = `/?${property}=${String(this[property] || '')}`;
            }
        }
        $RouteHref$.inject = [INode];
        __decorate([
            bindable(),
            __metadata("design:type", Object)
        ], $RouteHref$.prototype, "params", void 0);
        __decorate([
            bindable(),
            __metadata("design:type", String)
        ], $RouteHref$.prototype, "href", void 0);
        __decorate([
            bindable({ primary: true }),
            __metadata("design:type", String)
        ], $RouteHref$.prototype, "route", void 0);
        const RouteHref = CustomAttribute.define('route-href', $RouteHref$);
        const DotConverter = ValueConverter.define({
            // should it throw when defining a value converter with dash in name?
            // name: 'dot-converter'
            name: 'dotConverter'
        }, class $$DotConverter {
            toView(val, replaceWith) {
                return typeof val === 'string' && typeof replaceWith === 'string'
                    ? val.replace(/\./g, replaceWith)
                    : val;
            }
        });
        it('works correctly when binding only route name', async function () {
            const ctx = TestContext.create();
            const App = CustomElement.define({
                name: 'app',
                template: `<a route-href="home.main">Home page</a>`
            });
            const au = new Aurelia(ctx.container);
            const body = ctx.doc.body;
            const host = body.appendChild(ctx.createElement('app'));
            ctx.container.register(RouteHref);
            au.app({ component: App, host });
            await au.start();
            if (isNode()) {
                assert.strictEqual(host.querySelector('a').href, `/?route=home.main`);
            }
            else {
                assert.includes(host.querySelector('a').search, `?route=home.main`);
            }
            await au.stop();
            au.dispose();
            host.remove();
        });
        it('works correctly when using with value converter and a colon', async function () {
            const ctx = TestContext.create();
            const App = CustomElement.define({
                name: 'app',
                template: `<a route-href="\${'home.main' | dotConverter:'--'}">Home page</a>`
            });
            const au = new Aurelia(ctx.container);
            const body = ctx.doc.body;
            const host = body.appendChild(ctx.createElement('app'));
            ctx.container.register(RouteHref, DotConverter);
            au.app({ component: App, host });
            await au.start();
            if (isNode()) {
                assert.strictEqual(host.querySelector('a').href, '/?route=home--main');
            }
            else {
                assert.strictEqual(host.querySelector('a').search, '?route=home--main');
            }
            await au.stop();
            au.dispose();
            host.remove();
        });
        // todo: fix:
        //      + timing issue (change handler is invoked before binding)
        it('works correctly when using multi binding syntax', async function () {
            const ctx = TestContext.create();
            const App = CustomElement.define({
                name: 'app',
                template: `<a route-href="route: home.main; params.bind: { id: appId }">Home page</a>`
            }, class App {
            });
            const au = new Aurelia(ctx.container);
            const body = ctx.doc.body;
            const host = body.appendChild(ctx.createElement('app'));
            ctx.container.register(RouteHref);
            au.app({ component: App, host });
            await au.start();
            const anchorEl = host.querySelector('a');
            if (isNode()) {
                assert.strictEqual(anchorEl.href, '/?route=home.main');
            }
            else {
                assert.strictEqual(anchorEl.search, '?route=home.main');
            }
            const app = au.root.controller.viewModel;
            app.appId = 'appId-appId';
            if (isNode()) {
                assert.strictEqual(anchorEl.href, '/?params=[object Object]');
            }
            else {
                assert.strictEqual(anchorEl.search, `?params=[object%20Object]`);
            }
            await au.stop();
            au.dispose();
            host.remove();
        });
    });
});
//# sourceMappingURL=template-compiler.primary-bindable.spec.js.map