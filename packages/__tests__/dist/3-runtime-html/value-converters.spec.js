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
import { alias, valueConverter, bindable, customAttribute, INode, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
// TemplateCompiler - value converter integration
describe('3-runtime-html/value-converters.spec.ts', function () {
    // custom elements
    describe('01. Aliases', function () {
        let WootConverter = class WootConverter {
            toView() {
                return 'wOOt1';
            }
        };
        WootConverter = __decorate([
            valueConverter({ name: 'woot1', aliases: ['woot13'] }),
            alias(...['woot11', 'woot12'])
        ], WootConverter);
        let WootConverter2 = class WootConverter2 {
            toView() {
                return 'wOOt1';
            }
        };
        WootConverter2 = __decorate([
            valueConverter({ name: 'woot2', aliases: ['woot23'] }),
            alias('woot21', 'woot22')
        ], WootConverter2);
        let FooAttribute = class FooAttribute {
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
        ], FooAttribute.prototype, "value", void 0);
        FooAttribute = __decorate([
            customAttribute({ name: 'foo5', aliases: ['foo53'] }),
            alias(...['foo51', 'foo52']),
            __param(0, INode),
            __metadata("design:paramtypes", [Object])
        ], FooAttribute);
        let FooAttribute2 = class FooAttribute2 {
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
        ], FooAttribute2.prototype, "value", void 0);
        FooAttribute2 = __decorate([
            customAttribute({ name: 'foo4', aliases: ['foo43'] }),
            alias('foo41', 'foo42'),
            __param(0, INode),
            __metadata("design:paramtypes", [Object])
        ], FooAttribute2);
        const resources = [WootConverter, WootConverter2, FooAttribute2, FooAttribute];
        const app = class {
            constructor() {
                this.value = 'wOOt';
            }
        };
        it('Simple spread Alias doesn\'t break def alias works on value converter', async function () {
            const options = createFixture('<template> <div foo53.bind="value | woot13"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple spread Alias (1st position) works on value converter', async function () {
            const options = createFixture('<template> <div foo51.bind="value | woot11"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple spread Alias (2nd position) works on value converter', async function () {
            const options = createFixture('<template> <div foo52.bind="value | woot12"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple spread Alias doesn\'t break original value converter', async function () {
            const options = createFixture('<template> <div foo5.bind="value | woot2"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple Alias doesn\'t break def alias works on value converter', async function () {
            const options = createFixture('<template> <div foo43.bind="value | woot23"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple Alias (1st position) works on value converter', async function () {
            const options = createFixture('<template> <div foo41.bind="value | woot21"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple Alias (2nd position) works on value converter', async function () {
            const options = createFixture('<template> <div foo42.bind="value | woot22"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
        it('Simple Alias doesn\'t break original value converter', async function () {
            const options = createFixture('<template> <div foo4.bind="value | woot2"></div> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('test'), 'wOOt1');
            await options.tearDown();
        });
    });
});
//# sourceMappingURL=value-converters.spec.js.map