var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { customElement, slotted } from '@aurelia/runtime-html';
import { assert, createFixture } from '@aurelia/testing';
describe('3-runtime-html/au-slot.slotted.spec.ts', function () {
    describe('intitial rendering', function () {
        it('assigns value', function () {
            let El = class El {
            };
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<au-slot>'
                })
            ], El);
            const { component: { el } } = createFixture('<el component.ref=el><div></div>', class App {
            }, [El,]);
            assert.strictEqual(el.divs.length, 1);
        });
        it('assigns only projected content', function () {
            let El = class El {
            };
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<div>div count: ${divs.length}</div><au-slot>'
                })
            ], El);
            const { assertText } = createFixture('<el><div></div>', class App {
            }, [El,]);
            assertText('div count: 1');
        });
        it('assigns only projected content from matching slot', function () {
            let El = class El {
            };
            __decorate([
                slotted('div', '1'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<div>div count: ${divs.length}</div><au-slot></au-slot><au-slot name="1">'
                })
            ], El);
            const { assertText } = createFixture(
            // projecting 3 divs to 2 different slots
            '<el><div au-slot="1"></div><div></div><div></div>', class App {
            }, [El,]);
            assertText('div count: 1');
        });
        it('calls change handler', function () {
            let call = 0;
            let El = class El {
                divsChanged() {
                    call = 1;
                }
            };
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<au-slot>'
                })
            ], El);
            createFixture('<el><div></div>', class App {
            }, [El,]);
            assert.strictEqual(call, 1);
        });
        it('calls specified change handler', function () {
            let call = 0;
            let El = class El {
                changed() {
                    call = 1;
                }
            };
            __decorate([
                slotted({
                    callback: 'changed'
                }),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<au-slot>'
                })
            ], El);
            createFixture('<el><div></div>', class App {
            }, [El,]);
            assert.strictEqual(call, 1);
        });
        it('does not call change handler if theres no slot', function () {
            let call = 0;
            let El = class El {
                divsChanged() {
                    call = 1;
                }
            };
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: ''
                })
            ], El);
            createFixture('<el><div></div>', class App {
            }, [El,]);
            assert.strictEqual(call, 0);
        });
        it('does not call change handler there are no matching nodes', function () {
            let call = 0;
            let El = class El {
                divsChanged() {
                    call = 1;
                }
            };
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<au-slot>'
                })
            ], El);
            createFixture('<el><input>', class App {
            }, [El,]);
            assert.strictEqual(call, 0);
        });
        it('assigns to multiple @slotted properties with same queries', function () {
            let El = class El {
            };
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs2", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<au-slot>'
                })
            ], El);
            const { component: { el: { divs, divs2 } } } = createFixture('<el component.ref="el"><div>', class App {
            }, [El,]);
            assert.strictEqual(divs.length, 1);
            assert.strictEqual(divs2.length, 1);
        });
        it('assigns to multiple slotted properties with overlapping queries', function () {
            let El = class El {
            };
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            __decorate([
                slotted('div, p'),
                __metadata("design:type", Object)
            ], El.prototype, "divAndPs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'Count: ${divs.length} ${divAndPs.length}<au-slot>'
                })
            ], El);
            const { assertText } = createFixture('<el><div></div><p>', class App {
            }, [El,]);
            assertText('Count: 1 2');
        });
        it('calls change handler of multiple slotted props with overlapping queries', function () {
            let call1 = 0;
            let call2 = 0;
            let El = class El {
                divsChanged() {
                    call1 = 1;
                }
                divAndPsChanged() {
                    call2 = 1;
                }
            };
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            __decorate([
                slotted('div, p'),
                __metadata("design:type", Object)
            ], El.prototype, "divAndPs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'Count: ${divs.length} ${divAndPs.length}<au-slot>'
                })
            ], El);
            createFixture('<el><div></div><p>', class App {
            }, [El,]);
            assert.deepStrictEqual([call1, call2], [1, 1]);
        });
        it('assigns nodes rendered by repeat', function () {
            let El = class El {
            };
            __decorate([
                slotted('div'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            __decorate([
                slotted('div, p'),
                __metadata("design:type", Object)
            ], El.prototype, "divAndPs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'Count: ${divs.length} ${divAndPs.length}<au-slot>'
                })
            ], El);
            const { assertText } = createFixture('<el><div repeat.for="i of 3"></div><p repeat.for="i of 3">', class App {
            }, [El,]);
            assertText('Count: 3 6');
        });
        it('assigns all node with *', function () {
            let El = class El {
            };
            __decorate([
                slotted('*'),
                __metadata("design:type", Object)
            ], El.prototype, "nodes", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'Count: ${nodes.length} <au-slot>'
                })
            ], El);
            const { assertText } = createFixture('<el>text<div></div><p>', class App {
            }, [El,]);
            assertText('Count: 3 text');
        });
        it('works with slots when there are elements in between', async function () {
            let El = class El {
            };
            __decorate([
                slotted('div', '*'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<div>div count: ${divs.length}</div><div><au-slot></au-slot></div><au-slot name="1">'
                })
            ], El);
            const { assertText } = createFixture(
            // projecting 3 divs to 2 different slots
            '<el><div au-slot="1"></div><div></div><div></div>', class App {
            }, [El,]);
            assertText('div count: 3');
        });
        it('assigns when more slots are generated in fallback of a slot', function () {
            let El = class El {
            };
            __decorate([
                slotted('div', '*'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'div count: ${divs.length}<au-slot><au-slot name="1">'
                })
            ], El);
            const { assertText } = createFixture('<el><div au-slot="1"></div>', class App {
            }, [El,]);
            assertText('div count: 1');
        });
        it('assigns when projection contains slot', function () {
            let Parent = class Parent {
            };
            Parent = __decorate([
                customElement({
                    name: 'parent',
                    template: '<el><au-slot>'
                })
            ], Parent);
            let El = class El {
            };
            __decorate([
                slotted('div', '*'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'div count: ${divs.length}<au-slot>'
                })
            ], El);
            const { assertText } = createFixture('<parent><div></div>', class App {
            }, [Parent, El]);
            assertText('div count: 1');
        });
        it('assigns when projection fallbacks', function () {
            let Parent = class Parent {
            };
            Parent = __decorate([
                customElement({
                    name: 'parent',
                    template: '<el><au-slot><div>'
                })
            ], Parent);
            let El = class El {
            };
            __decorate([
                slotted('div', '*'),
                __metadata("design:type", Object)
            ], El.prototype, "divs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'div count: ${divs.length}<au-slot>'
                })
            ], El);
            const { assertText } = createFixture('<parent>', class App {
            }, [Parent, El]);
            assertText('div count: 1');
        });
        it('assigns when projection fallbacks multiple slot', function () {
            let Parent = class Parent {
            };
            Parent = __decorate([
                customElement({
                    name: 'parent',
                    template: '<el><au-slot au-slot=1><input><input>'
                })
            ], Parent);
            let El = class El {
            };
            __decorate([
                slotted('input', '1'),
                __metadata("design:type", Object)
            ], El.prototype, "inputs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'inputs count: ${inputs.length}<au-slot></au-slot><div><au-slot name="1">'
                })
            ], El);
            const { assertText } = createFixture('<parent>', class App {
            }, [Parent, El]);
            assertText('inputs count: 2');
        });
        it('assigns values independently to different elements at root level', function () {
            let El = class El {
            };
            __decorate([
                slotted('input'),
                __metadata("design:type", Object)
            ], El.prototype, "inputs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'inputs count: ${inputs.length}<au-slot></au-slot><div>'
                })
            ], El);
            const { assertText } = createFixture('<el><input></el> | <el><input><input>', class App {
            }, [El]);
            assertText('inputs count: 1 | inputs count: 2');
        });
        it('assigns values independently to different elements in a custom element', function () {
            let Parent = class Parent {
            };
            Parent = __decorate([
                customElement({
                    name: 'parent',
                    template: '<el><input></el> | <el><input><input>'
                })
            ], Parent);
            let El = class El {
            };
            __decorate([
                slotted('input'),
                __metadata("design:type", Object)
            ], El.prototype, "inputs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'inputs count: ${inputs.length}<au-slot></au-slot><div>'
                })
            ], El);
            const { assertText } = createFixture('<parent>', class App {
            }, [Parent, El]);
            assertText('inputs count: 1 | inputs count: 2');
        });
        it('assigns all node with custom slot name from definition object', function () {
            let El = class El {
            };
            __decorate([
                slotted({
                    slotName: '1'
                }),
                __metadata("design:type", Object)
            ], El.prototype, "nodes", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'Count: ${nodes.length}<au-slot name=1>'
                })
            ], El);
            const { assertText } = createFixture('<el><div au-slot=1>', class App {
            }, [El,]);
            assertText('Count: 1');
        });
        it('assigns on dynamically generated <au-slot>', function () {
            let El = class El {
            };
            __decorate([
                slotted(),
                __metadata("design:type", Object)
            ], El.prototype, "nodes", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'Count: ${nodes.length}<au-slot repeat.for="i of 3">'
                })
            ], El);
            const { assertText } = createFixture('<el><div>', class App {
            }, [El,]);
            assertText('Count: 3');
        });
        it('does not call slotchange inititially', function () {
            let call = 0;
            let El = class El {
                log() {
                    call = 1;
                }
            };
            __decorate([
                slotted(),
                __metadata("design:type", Object)
            ], El.prototype, "nodes", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'Count: ${nodes.length}<au-slot slotchange.bind="log">'
                })
            ], El);
            createFixture('<el><div>', class App {
            }, [El,]);
            assert.strictEqual(call, 0);
        });
    });
    describe('mutation', function () {
        it('updates added/removed nodes on single node removal', async function () {
            let El = class El {
            };
            __decorate([
                slotted('*'),
                __metadata("design:type", Object)
            ], El.prototype, "nodes", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'Count: ${nodes.length}<au-slot>'
                })
            ], El);
            const { assertText, component, flush } = createFixture('<el><div if.bind="show"></div><p>', class App {
                constructor() {
                    this.show = false;
                }
            }, [El,]);
            assertText('Count: 1');
            component.show = true;
            await Promise.resolve(); // for mutation observer to tick
            flush(); // for text update
            assertText('Count: 2');
            component.show = false;
            await Promise.resolve(); // for mutation observer to tick
            flush(); // for text update
            assertText('Count: 1');
        });
        it('updates added/removed nodes on the removal of multiple nodes', async function () {
            let El = class El {
            };
            __decorate([
                slotted('*'),
                __metadata("design:type", Object)
            ], El.prototype, "nodes", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'Count: ${nodes.length}<au-slot>'
                })
            ], El);
            const { assertText, component, flush } = createFixture('<el><div repeat.for="_ of i">', class App {
                constructor() {
                    this.i = 0;
                }
            }, [El,]);
            assertText('Count: 0');
            component.i = 3;
            await Promise.resolve(); // for mutation observer to tick
            flush(); // for text update
            assertText('Count: 3');
            component.i = 0;
            await Promise.resolve(); // for mutation observer to tick
            flush(); // for text update
            assertText('Count: 0');
        });
        it('updates values independently for multiple <au-slot> in a custom element', async function () {
            let Parent = class Parent {
            };
            Parent = __decorate([
                customElement({
                    name: 'parent',
                    template: '<button click.trigger="show = true"></button><el><input></el> | <el><input><input>' +
                        '<template if.bind="show"><input>'
                })
            ], Parent);
            let El = class El {
            };
            __decorate([
                slotted('input'),
                __metadata("design:type", Object)
            ], El.prototype, "inputs", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: 'inputs count: ${inputs.length}<au-slot></au-slot><div>'
                })
            ], El);
            const { assertText, trigger, flush } = createFixture('<parent>', class App {
            }, [Parent, El]);
            assertText('inputs count: 1 | inputs count: 2');
            trigger.click('button');
            await Promise.resolve();
            flush();
            assertText('inputs count: 1 | inputs count: 3');
        });
        it('calls slotchange after rendering', async function () {
            const calls = [];
            let El = class El {
                log(name, nodes) {
                    calls.push([name, nodes.length]);
                }
            };
            __decorate([
                slotted('*'),
                __metadata("design:type", Object)
            ], El.prototype, "nodes", void 0);
            El = __decorate([
                customElement({
                    name: 'el',
                    template: '<au-slot slotchange.bind="log">'
                })
            ], El);
            const { component, flush } = createFixture('<el><div if.bind="show"></div><p>', class App {
                constructor() {
                    this.show = false;
                }
            }, [El,]);
            component.show = true;
            await Promise.resolve(); // for mutation observer to tick
            flush(); // for text update
            assert.deepStrictEqual(calls, [['default', 2]]);
            component.show = false;
            await Promise.resolve(); // for mutation observer to tick
            flush(); // for text update
            assert.deepStrictEqual(calls, [['default', 2], ['default', 1]]);
        });
    });
});
//# sourceMappingURL=au-slot.slotted.spec.js.map