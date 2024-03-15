var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DI } from '@aurelia/kernel';
import { alias, bindingCommand, OneTimeBindingCommand, BindingCommand, } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/binding-commands.spec.ts', function () {
    describe('registration & resolution', function () {
        let container;
        beforeEach(function () {
            container = DI.createContainer();
        });
        let FooBindingCommand = class FooBindingCommand {
        };
        FooBindingCommand = __decorate([
            bindingCommand('foo')
        ], FooBindingCommand);
        it('resolves to the same instance when impl was retrieved before registration', function () {
            const i1 = container.get(FooBindingCommand);
            container.register(FooBindingCommand);
            const i2 = container.get(BindingCommand.keyFrom('foo'));
            const i3 = BindingCommand.get(container, 'foo');
            assert.strictEqual(i1, i2);
            assert.strictEqual(i1, i3);
            const [_, i4] = container.getAll(FooBindingCommand);
            assert.strictEqual(i4, undefined);
        });
        it('resolves to the same instance when impl was retrieved after registration', function () {
            container.register(FooBindingCommand);
            const i1 = container.get(FooBindingCommand);
            const i2 = container.get(BindingCommand.keyFrom('foo'));
            const i3 = BindingCommand.get(container, 'foo');
            assert.strictEqual(i1, i2);
            assert.strictEqual(i1, i3);
            const [_, i4] = container.getAll(FooBindingCommand);
            assert.strictEqual(i4, undefined);
        });
        it('does not retrieve the intermediate container value converter registration', function () {
            const child1 = container.createChild();
            const child2 = child1.createChild();
            let id = 0;
            let Foo1 = class Foo1 {
                constructor() {
                    this.id = ++id;
                }
            };
            Foo1 = __decorate([
                bindingCommand('foo1')
            ], Foo1);
            child1.register(Foo1);
            container.register(Foo1);
            BindingCommand.get(child2, 'foo1');
            assert.strictEqual(id, 1, `should create value converter only once`);
            BindingCommand.get(child1, 'foo1');
            assert.strictEqual(id, 2, `should create another value converter in the middle layer container`);
        });
    });
    describe('aliases', function () {
        const app = class {
            constructor() {
                this.value = 'wOOt';
            }
        };
        let WootCommand = class WootCommand {
            constructor(oneTimeCmd) {
                this.oneTimeCmd = oneTimeCmd;
                this.type = 'None';
                this.name = 'woot1';
            }
            build(info, parser, mapper) {
                return this.oneTimeCmd.build(info, parser, mapper);
            }
        };
        WootCommand.inject = [OneTimeBindingCommand];
        WootCommand = __decorate([
            bindingCommand({ name: 'woot1', aliases: ['woot13'] }),
            alias(...['woot11', 'woot12']),
            __metadata("design:paramtypes", [OneTimeBindingCommand])
        ], WootCommand);
        let WootCommand2 = class WootCommand2 {
            constructor(oneTimeCmd) {
                this.oneTimeCmd = oneTimeCmd;
                this.type = 'None';
                this.name = 'woot2';
            }
            build(info, parser, mapper) {
                return this.oneTimeCmd.build(info, parser, mapper);
            }
        };
        WootCommand2.inject = [OneTimeBindingCommand];
        WootCommand2 = __decorate([
            bindingCommand({ name: 'woot2', aliases: ['woot23'] }),
            alias('woot21', 'woot22'),
            __metadata("design:paramtypes", [OneTimeBindingCommand])
        ], WootCommand2);
        const resources = [WootCommand, WootCommand2];
        it('Simple spread Alias doesn\'t break def alias works on binding command', function () {
            const options = createFixture('<template> <a href.woot1="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple spread Alias (1st position) works on binding command', function () {
            const options = createFixture('<template> <a href.woot11="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple spread Alias (2nd position) works on binding command', function () {
            const options = createFixture('<template> <a href.woot12="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple spread Alias doesn\'t break original binding command', function () {
            const options = createFixture('<template> <a href.woot13="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple Alias doesn\'t break def alias works on binding command', function () {
            const options = createFixture('<template> <a href.woot23="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple Alias (1st position) works on binding command', function () {
            const options = createFixture('<template> <a href.woot21="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple Alias (2nd position) works on binding command', function () {
            const options = createFixture('<template> <a href.woot22="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
        it('Simple Alias doesn\'t break original binding command', function () {
            const options = createFixture('<template> <a href.woot2="value"></a> </template>', app, resources);
            assert.strictEqual(options.appHost.firstElementChild.getAttribute('href'), 'wOOt');
        });
    });
});
//# sourceMappingURL=binding-commands.spec.js.map