var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { bindable, customAttribute, customElement, watch } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/decorator-watch.expression.spec.ts', function () {
    const testCases = [
        {
            title: 'observes property access',
            get: `\`\${runner.first} \${runner.last}\``,
            created: (post, _, decoratorCount) => {
                assert.strictEqual(post.deliveryCount, 0);
                post.runner.first = 'f';
                assert.strictEqual(post.deliveryCount, 1 * decoratorCount);
                post.runner.first = 'f';
                assert.strictEqual(post.deliveryCount, 1 * decoratorCount);
                post.runner = { first: 'f1', last: 'l1', phone: 'p1' };
                assert.strictEqual(post.deliveryCount, 2 * decoratorCount);
                post.runner = null;
                assert.strictEqual(post.deliveryCount, 3 * decoratorCount);
            },
            disposed: (post, _, decoratorCount) => {
                post.runner = null;
                assert.strictEqual(post.deliveryCount, 3 * decoratorCount);
            },
        },
        {
            title: 'observes property access expression containing array indices',
            get: 'deliveries[0].done',
            created: (post, _, decoratorCount) => {
                assert.strictEqual(post.deliveryCount, 0);
                post.deliveries.unshift({ id: 1, name: '1', done: false });
                // value changed from void to 1, hence 1 change handler call
                assert.strictEqual(post.deliveryCount, 1 * decoratorCount);
                post.deliveries.splice(0, 1, { id: 1, name: 'hello', done: true });
                assert.strictEqual(post.deliveryCount, 2 * decoratorCount);
                post.deliveries.splice(0, 1, { id: 1, name: 'hello', done: false });
                assert.strictEqual(post.deliveryCount, 3 * decoratorCount);
                post.deliveries[0].done = true;
                assert.strictEqual(post.deliveryCount, 4 * decoratorCount);
            },
            disposed: (post, _, decoratorCount) => {
                post.deliveries[0].done = false;
                assert.strictEqual(post.deliveryCount, 4 * decoratorCount);
            },
        },
        {
            title: 'observes symbol',
            get: Symbol.for('packages'),
            created: (post, _, decoratorCount) => {
                assert.strictEqual(post.deliveryCount, 0);
                post[Symbol.for('packages')] = 0;
                assert.strictEqual(post.deliveryCount, 1 * decoratorCount);
                post[Symbol.for('packages')] = 1;
                assert.strictEqual(post.deliveryCount, 2 * decoratorCount);
            },
            disposed: (post, _, decoratorCount) => {
                assert.strictEqual(post.deliveryCount, 2 * decoratorCount);
                post[Symbol.for('packages')] = 0;
                assert.strictEqual(post.deliveryCount, 2 * decoratorCount);
            },
        },
    ];
    for (const { title, only = false, get, created, disposed } of testCases) {
        const $it = only ? it.only : it;
        $it(`${title} on method`, function () {
            class Post {
                constructor() {
                    this.runner = {
                        first: 'first',
                        last: 'last',
                        phone: 'phone'
                    };
                    this.deliveries = [];
                    this.selectedItem = void 0;
                    this.counter = 0;
                    this.deliveryCount = 0;
                }
                log() {
                    this.deliveryCount++;
                }
            }
            __decorate([
                watch(get),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], Post.prototype, "log", null);
            const { ctx, component, tearDown } = createFixture('', Post);
            created(component, ctx, 1);
            void tearDown();
            disposed?.(component, ctx, 1);
        });
        $it(`${title} on class`, function () {
            let Post = class Post {
                constructor() {
                    this.runner = {
                        first: 'first',
                        last: 'last',
                        phone: 'phone'
                    };
                    this.deliveries = [];
                    this.counter = 0;
                    this.deliveryCount = 0;
                }
                log() {
                    this.deliveryCount++;
                }
            };
            Post = __decorate([
                watch(get, (v, o, a) => a.log())
            ], Post);
            const { ctx, component, tearDown } = createFixture('', Post);
            created(component, ctx, 1);
            void tearDown();
            disposed?.(component, ctx, 1);
        });
        $it(`${title} on class, before @customElement decorator`, function () {
            let Post = class Post {
                constructor() {
                    this.runner = {
                        first: 'first',
                        last: 'last',
                        phone: 'phone'
                    };
                    this.deliveries = [];
                    this.counter = 0;
                    this.deliveryCount = 0;
                }
                log() {
                    this.deliveryCount++;
                }
            };
            Post = __decorate([
                watch(get, (v, o, a) => a.log()),
                customElement({ name: 'post' })
            ], Post);
            const { ctx, component, tearDown } = createFixture('<post component.ref="post">', class App {
            }, [Post]);
            const post = component.post;
            created(post, ctx, 1);
            void tearDown();
            disposed?.(post, ctx, 1);
        });
        $it(`${title} on class, after @customElement decorator`, function () {
            let Post = class Post {
                constructor() {
                    this.runner = {
                        first: 'first',
                        last: 'last',
                        phone: 'phone'
                    };
                    this.deliveries = [];
                    this.counter = 0;
                    this.deliveryCount = 0;
                }
                log() {
                    this.deliveryCount++;
                }
            };
            Post = __decorate([
                customElement({ name: 'post' }),
                watch(get, (v, o, a) => a.log())
            ], Post);
            const { ctx, component, tearDown } = createFixture('<post component.ref="post">', class App {
            }, [Post]);
            const post = component.post;
            created(post, ctx, 1);
            void tearDown();
            disposed?.(post, ctx, 1);
        });
        $it(`${title} on both class and method`, function () {
            let Post = class Post {
                constructor() {
                    this.runner = {
                        first: 'first',
                        last: 'last',
                        phone: 'phone'
                    };
                    this.deliveries = [];
                    this.counter = 0;
                    this.deliveryCount = 0;
                }
                log() {
                    this.deliveryCount++;
                }
            };
            __decorate([
                watch(get),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], Post.prototype, "log", null);
            Post = __decorate([
                watch(get, (v, o, a) => a.log())
            ], Post);
            const { ctx, component, tearDown } = createFixture('', Post);
            created(component, ctx, 2);
            void tearDown();
            disposed?.(component, ctx, 2);
        });
    }
    describe('on Custom attribute', function () {
        it('works when decorating on class [before @customAttribute]', async function () {
            let callCount = 0;
            let ListActiveIndicator = class ListActiveIndicator {
                filterChanged() {
                    callCount++;
                    this.active = this.items?.some(i => i.active);
                }
            };
            __decorate([
                bindable,
                __metadata("design:type", Array)
            ], ListActiveIndicator.prototype, "items", void 0);
            __decorate([
                bindable({ mode: 4 /* BindingMode.fromView */ }),
                __metadata("design:type", Boolean)
            ], ListActiveIndicator.prototype, "active", void 0);
            ListActiveIndicator = __decorate([
                watch('items.length', (_, __, x) => x.filterChanged()),
                customAttribute('list-active')
            ], ListActiveIndicator);
            const { component, startPromise, tearDown } = createFixture(`<div list-active="items.bind: items; active.bind: active" active.class="active">`, class App {
                constructor() {
                    this.items = [{ active: false }, { active: false }];
                }
            }, [ListActiveIndicator]);
            await startPromise;
            assert.strictEqual(component.active, undefined);
            component.items.push({ active: true });
            assert.strictEqual(component.active, true);
            assert.strictEqual(callCount, 1);
            await tearDown();
        });
        it('works when decorating on class [after @customAttribute]', async function () {
            let callCount = 0;
            let ListActiveIndicator = class ListActiveIndicator {
                filterChanged() {
                    callCount++;
                    this.active = this.items?.some(i => i.active);
                }
            };
            __decorate([
                bindable,
                __metadata("design:type", Array)
            ], ListActiveIndicator.prototype, "items", void 0);
            __decorate([
                bindable({ mode: 4 /* BindingMode.fromView */ }),
                __metadata("design:type", Boolean)
            ], ListActiveIndicator.prototype, "active", void 0);
            ListActiveIndicator = __decorate([
                customAttribute('list-active'),
                watch('items.length', (_, __, x) => x.filterChanged())
            ], ListActiveIndicator);
            const { component, startPromise, tearDown } = createFixture(`<div list-active="items.bind: items; active.bind: active" active.class="active">`, class App {
                constructor() {
                    this.items = [{ active: false }, { active: false }];
                }
            }, [ListActiveIndicator]);
            await startPromise;
            assert.strictEqual(component.active, undefined);
            component.items.push({ active: true });
            assert.strictEqual(component.active, true);
            assert.strictEqual(callCount, 1);
            await tearDown();
        });
        it('works when decorating on method', async function () {
            let callCount = 0;
            let ListActiveIndicator = class ListActiveIndicator {
                filterChanged() {
                    callCount++;
                    this.active = this.items?.some(i => i.active);
                }
            };
            __decorate([
                bindable,
                __metadata("design:type", Array)
            ], ListActiveIndicator.prototype, "items", void 0);
            __decorate([
                bindable({ mode: 4 /* BindingMode.fromView */ }),
                __metadata("design:type", Boolean)
            ], ListActiveIndicator.prototype, "active", void 0);
            __decorate([
                watch('items.length'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], ListActiveIndicator.prototype, "filterChanged", null);
            ListActiveIndicator = __decorate([
                customAttribute('list-active')
            ], ListActiveIndicator);
            const { component, startPromise, tearDown } = createFixture(`<div list-active="items.bind: items; active.bind: active" active.class="active">`, class App {
                constructor() {
                    this.items = [{ active: false }, { active: false }];
                }
            }, [ListActiveIndicator]);
            await startPromise;
            assert.strictEqual(component.active, undefined);
            component.items.push({ active: true });
            assert.strictEqual(component.active, true);
            assert.strictEqual(callCount, 1);
            await tearDown();
        });
        it('works when decorating on both class + method ', async function () {
            let callCount = 0;
            let ListActiveIndicator = class ListActiveIndicator {
                filterChanged() {
                    callCount++;
                    this.active = this.items?.some(i => i.active);
                }
            };
            __decorate([
                bindable,
                __metadata("design:type", Array)
            ], ListActiveIndicator.prototype, "items", void 0);
            __decorate([
                bindable({ mode: 4 /* BindingMode.fromView */ }),
                __metadata("design:type", Boolean)
            ], ListActiveIndicator.prototype, "active", void 0);
            __decorate([
                watch('items.length'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], ListActiveIndicator.prototype, "filterChanged", null);
            ListActiveIndicator = __decorate([
                customAttribute('list-active'),
                watch('items.length', (_, __, x) => x.filterChanged())
            ], ListActiveIndicator);
            const { component, startPromise, tearDown } = createFixture(`<div list-active="items.bind: items; active.bind: active" active.class="active">`, class App {
                constructor() {
                    this.items = [{ active: false }, { active: false }];
                }
            }, [ListActiveIndicator]);
            await startPromise;
            assert.strictEqual(component.active, undefined);
            component.items.push({ active: true });
            assert.strictEqual(component.active, true);
            assert.strictEqual(callCount, 2);
            await tearDown();
        });
    });
});
//# sourceMappingURL=decorator-watch.expression.spec.js.map