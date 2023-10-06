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
import { bindingBehavior, alias, bindable, customAttribute, INode } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/binding-behavior.spec.ts', function () {
    // custom elements
    describe('01. Aliases', function () {
        const app = class {
            constructor() {
                this.value = 'wOOt';
                this.method = () => {
                    this.value = 'wOOt1';
                };
            }
        };
        let WootBehavior = class WootBehavior {
            bind(_scope, binding, func) {
                func(binding.target[binding.targetProperty]);
            }
            unbind(_scope, _binding, _func) {
                return;
            }
        };
        WootBehavior = __decorate([
            bindingBehavior({ name: 'woot1', aliases: ['woot13'] }),
            alias(...['woot11', 'woot12'])
        ], WootBehavior);
        let WootBehavior2 = class WootBehavior2 {
            bind(_scope, binding, _func, func2) {
                func2(binding.target[binding.targetProperty]);
            }
            unbind(_scope, _binding) {
                return;
            }
        };
        WootBehavior2 = __decorate([
            bindingBehavior({ name: 'woot2', aliases: ['woot23'] }),
            alias('woot21', 'woot22')
        ], WootBehavior2);
        let FooAttr5 = class FooAttr5 {
            constructor(element) {
                this.element = element;
            }
            bound() {
                this.element.setAttribute('test', this.value);
            }
        };
        __decorate([
            bindable({ primary: true }),
            __metadata("design:type", Object)
        ], FooAttr5.prototype, "value", void 0);
        FooAttr5 = __decorate([
            customAttribute({ name: 'foo5', aliases: ['foo53'] }),
            alias(...['foo51', 'foo52']),
            __param(0, INode),
            __metadata("design:paramtypes", [Object])
        ], FooAttr5);
        let FooAttr4 = class FooAttr4 {
            constructor(element) {
                this.element = element;
            }
            bound() {
                this.element.setAttribute('test', this.value);
            }
        };
        __decorate([
            bindable({ primary: true }),
            __metadata("design:type", Object)
        ], FooAttr4.prototype, "value", void 0);
        FooAttr4 = __decorate([
            customAttribute({ name: 'foo4', aliases: ['foo43'] }),
            alias('foo41', 'foo42'),
            __param(0, INode),
            __metadata("design:paramtypes", [Object])
        ], FooAttr4);
        const resources = [WootBehavior, WootBehavior2, FooAttr4, FooAttr5];
        it('Simple spread Alias doesn\'t break def alias works on binding behavior', function () {
            const options = createFixture('<template> <div foo53.bind="value & woot13:method"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
        });
        it('Simple spread Alias (1st position) works on binding behavior', function () {
            const options = createFixture('<template> <div foo51.bind="value & woot11:method"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
        });
        it('Simple spread Alias (2nd position) works on binding behavior', function () {
            const options = createFixture('<template> <div foo52.bind="value & woot12:method:method"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
        });
        it('Simple spread Alias doesn\'t break original binding behavior', function () {
            const options = createFixture('<template> <div foo5.bind="value & woot2:method:method"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
        });
        it('Simple Alias doesn\'t break def alias works on binding behavior', function () {
            const options = createFixture('<template> <div foo43.bind="value & woot23:method:method"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
        });
        it('Simple Alias (1st position) works on binding behavior', function () {
            const options = createFixture('<template> <div foo41.bind="value & woot21:method:method"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
        });
        it('Simple Alias (2nd position) works on binding behavior', function () {
            const options = createFixture('<template> <div foo42.bind="value & woot22:method:method"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
        });
        it('Simple Alias doesn\'t break original binding behavior', function () {
            const options = createFixture('<template> <div foo4.bind="value & woot2:method:method"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
        });
    });
});
//# sourceMappingURL=binding-behavior.spec.js.map