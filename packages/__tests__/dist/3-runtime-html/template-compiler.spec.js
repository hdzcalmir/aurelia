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
import { delegateSyntax } from '@aurelia/compat-v1';
import { kebabCase, camelCase, } from '@aurelia/kernel';
import { ForOfStatement, Interpolation, parseExpression, AccessScopeExpression, BindingIdentifier, PrimitiveLiteralExpression, IExpressionParser, } from '@aurelia/expression-parser';
import { bindable, BindingMode, BindableDefinition, customAttribute, CustomAttribute, customElement, CustomElement, CustomElementDefinition, InstructionType as HTT, InstructionType as TT, IAttributeParser, HydrateAttributeInstruction, AttrSyntax, If, attributePattern, PropertyBindingInstruction, InterpolationInstruction, InstructionType, DefaultBindingSyntax, TemplateCompilerHooks, } from '@aurelia/runtime-html';
import { assert, eachCartesianJoinFactory, TestContext, verifyBindingInstructionsEqual, } from '@aurelia/testing';
export function createAttribute(name, value) {
    const attr = document.createAttribute(name);
    attr.value = value;
    return attr;
}
describe('3-runtime-html/template-compiler.spec.ts', function () {
    describe('base assertions', function () {
        let ctx;
        let sut;
        let container;
        beforeEach(function () {
            ctx = TestContext.create();
            container = ctx.container;
            sut = createCompilerWrapper(ctx.templateCompiler);
            sut.resolveResources = false;
            container.register(CustomAttribute.define('foo', class {
            }));
        });
        describe('compileElement()', function () {
            describe('with compilation hooks', function () {
                it('invokes hook before compilation', function () {
                    let i = 0;
                    container.register(TemplateCompilerHooks.define(class {
                        compiling() {
                            i = 1;
                        }
                    }));
                    sut.compile({ template: '<template>' }, container, null);
                    assert.strictEqual(i, 1);
                });
                it('does not do anything if needsCompile is false', function () {
                    let i = 0;
                    container.register(TemplateCompilerHooks.define(class {
                        compiling() {
                            i = 1;
                        }
                    }));
                    sut.compile({ template: '<template>', needsCompile: false }, container, null);
                    assert.strictEqual(i, 0);
                });
            });
            describe('with <slot/>', function () {
                it('set hasSlots to true', function () {
                    const definition = compileWith('<template><slot></slot></template>', [], true);
                    assert.strictEqual(definition.hasSlots, true, `definition.hasSlots`);
                });
                it('recognizes slot in nested <template>', function () {
                    const definition = compileWith('<template><template if.bind="true"><slot></slot></template></template>', [], true);
                    assert.strictEqual(definition.hasSlots, true, `definition.hasSlots`);
                });
                it('does not discriminate slot name', function () {
                    const definition = compileWith('<template><slot name="slot"></slot></template>', [], true);
                    assert.strictEqual(definition.hasSlots, true, `definition.hasSlots`);
                });
                // <template> shouldn't be compiled
                it('does not recognize slot in <template> without template controller', function () {
                    const definition = compileWith('<template><template ><slot></slot></template></template>', [], true);
                    assert.strictEqual(definition.hasSlots, false, `definition.hasSlots`);
                });
                it('throws when <slot> is used without shadow dom', function () {
                    assert.throws(() => compileWith('<template><slot></slot></template>', [], false));
                });
            });
            describe('with nested <template> without template controller', function () {
                it('does not compile <template> without template controller', function () {
                    const { instructions } = compileWith(`<template><template>\${prop}</template></template>`, []);
                    assert.deepStrictEqual(instructions, [], `definition.instructions`);
                });
            });
            describe('with custom element', function () {
                describe('compiles surrogate', function () {
                    it('compiles surrogate plain class attribute', function () {
                        const { instructions, surrogates } = compileWith(`<template class="h-100"></template>`, []);
                        verifyInstructions(instructions, []);
                        verifyInstructions(surrogates, [{ toVerify: ['type', 'value'], type: HTT.setClassAttribute, value: 'h-100' }]);
                    });
                    it('compiles surrogate plain style attribute', function () {
                        const { instructions, surrogates } = compileWith(`<template style="background: red"></template>`, []);
                        verifyInstructions(instructions, []);
                        verifyInstructions(surrogates, [{ toVerify: ['type', 'value'], type: HTT.setStyleAttribute, value: 'background: red' }]);
                    });
                    it('compiles surrogate with binding expression', function () {
                        const { instructions, surrogates } = compileWith(`<template class.bind="base"></template>`, []);
                        verifyInstructions(instructions, [], 'normal');
                        verifyInstructions(surrogates, [{ toVerify: ['type', 'to'], type: TT.propertyBinding, to: 'class' }], 'surrogate');
                    });
                    it('compiles surrogate with interpolation expression', function () {
                        const { instructions, surrogates } = compileWith(`<template class="h-100 \${base}"></template>`, []);
                        verifyInstructions(instructions, [], 'normal');
                        verifyInstructions(surrogates, [{ toVerify: ['type', 'to'], type: TT.interpolation, to: 'class' }], 'surrogate');
                    });
                    it('throws on attributes that require to be unique', function () {
                        const attrs = ['id'];
                        attrs.forEach(attr => {
                            assert.throws(() => compileWith(`<template ${attr}="${attr}"></template>`, []), /(Attribute id is invalid on surrogate)|(AUR0702:id)/);
                        });
                    });
                    it('does not create a prop binding when attribute value is an empty string', function () {
                        const { instructions, surrogates } = compileWith(`<template foo>hello</template>`);
                        console.log(surrogates);
                        verifyInstructions(instructions, [], 'normal');
                        verifyInstructions(surrogates, [
                            { toVerify: ['type', 'to', 'res', 'props'], type: TT.hydrateAttribute, res: 'foo', props: [] }
                        ], 'surrogate');
                    });
                    it('compiles surrogate with interpolation binding + custom attribute', function () {
                        const { instructions, surrogates } = compileWith(`<template foo="\${bar}">hello</template>`);
                        verifyInstructions(instructions, [], 'normal');
                        verifyInstructions(surrogates, [
                            { toVerify: ['type', 'to', 'props'], type: TT.hydrateAttribute, res: 'foo', props: [
                                    new InterpolationInstruction(new Interpolation(['', ''], [new AccessScopeExpression('bar')]), 'value')
                                ] }
                        ], 'surrogate');
                    });
                });
                it('understands attr precendence: element prop > custom attr', function () {
                    let El = (() => {
                        let _classDecorators = [customElement('el')];
                        let _classDescriptor;
                        let _classExtraInitializers = [];
                        let _classThis;
                        let _prop1_decorators;
                        let _prop1_initializers = [];
                        let _prop1_extraInitializers = [];
                        let _prop2_decorators;
                        let _prop2_initializers = [];
                        let _prop2_extraInitializers = [];
                        let _prop3_decorators;
                        let _prop3_initializers = [];
                        let _prop3_extraInitializers = [];
                        var El = _classThis = class {
                            constructor() {
                                this.prop1 = __runInitializers(this, _prop1_initializers, void 0);
                                this.prop2 = (__runInitializers(this, _prop1_extraInitializers), __runInitializers(this, _prop2_initializers, void 0));
                                this.prop3 = (__runInitializers(this, _prop2_extraInitializers), __runInitializers(this, _prop3_initializers, void 0));
                                __runInitializers(this, _prop3_extraInitializers);
                            }
                        };
                        __setFunctionName(_classThis, "El");
                        (() => {
                            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                            _prop1_decorators = [bindable()];
                            _prop2_decorators = [bindable()];
                            _prop3_decorators = [bindable()];
                            __esDecorate(null, null, _prop1_decorators, { kind: "field", name: "prop1", static: false, private: false, access: { has: obj => "prop1" in obj, get: obj => obj.prop1, set: (obj, value) => { obj.prop1 = value; } }, metadata: _metadata }, _prop1_initializers, _prop1_extraInitializers);
                            __esDecorate(null, null, _prop2_decorators, { kind: "field", name: "prop2", static: false, private: false, access: { has: obj => "prop2" in obj, get: obj => obj.prop2, set: (obj, value) => { obj.prop2 = value; } }, metadata: _metadata }, _prop2_initializers, _prop2_extraInitializers);
                            __esDecorate(null, null, _prop3_decorators, { kind: "field", name: "prop3", static: false, private: false, access: { has: obj => "prop3" in obj, get: obj => obj.prop3, set: (obj, value) => { obj.prop3 = value; } }, metadata: _metadata }, _prop3_initializers, _prop3_extraInitializers);
                            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                            El = _classThis = _classDescriptor.value;
                            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                            __runInitializers(_classThis, _classExtraInitializers);
                        })();
                        return El = _classThis;
                    })();
                    let Prop3 = (() => {
                        let _classDecorators = [customAttribute('prop3')];
                        let _classDescriptor;
                        let _classExtraInitializers = [];
                        let _classThis;
                        var Prop3 = _classThis = class {
                        };
                        __setFunctionName(_classThis, "Prop3");
                        (() => {
                            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                            Prop3 = _classThis = _classDescriptor.value;
                            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                            __runInitializers(_classThis, _classExtraInitializers);
                        })();
                        return Prop3 = _classThis;
                    })();
                    const actual = compileWith(`<template>
            <el prop1.bind="p" prop2.bind="p" prop3.bind="t" prop3="t"></el>
          </template>`, [El, Prop3]);
                    // only 1 target
                    assert.strictEqual(actual.instructions.length, 1, `actual.instructions.length`);
                    // the target has only 1 instruction, which is hydrate custom element <el>
                    assert.strictEqual(actual.instructions[0].length, 1, `actual.instructions[0].length`);
                    const rootInstructions = actual.instructions[0][0]['props'];
                    const expectedRootInstructions = [
                        { toVerify: ['type', 'res', 'to'], type: TT.propertyBinding, to: 'prop1' },
                        { toVerify: ['type', 'res', 'to'], type: TT.propertyBinding, to: 'prop2' },
                        { toVerify: ['type', 'res', 'to'], type: TT.propertyBinding, to: 'prop3' },
                        { toVerify: ['type', 'res', 'to'], type: TT.setProperty, to: 'prop3' }
                    ];
                    verifyInstructions(rootInstructions, expectedRootInstructions);
                });
                it('distinguishes element properties / normal attributes', function () {
                    let El = (() => {
                        let _classDecorators = [customElement('el')];
                        let _classDescriptor;
                        let _classExtraInitializers = [];
                        let _classThis;
                        let _name_decorators;
                        let _name_initializers = [];
                        let _name_extraInitializers = [];
                        var El = _classThis = class {
                            constructor() {
                                this.name = __runInitializers(this, _name_initializers, void 0);
                                __runInitializers(this, _name_extraInitializers);
                            }
                        };
                        __setFunctionName(_classThis, "El");
                        (() => {
                            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                            _name_decorators = [bindable()];
                            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
                            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                            El = _classThis = _classDescriptor.value;
                            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                            __runInitializers(_classThis, _classExtraInitializers);
                        })();
                        return El = _classThis;
                    })();
                    const actual = compileWith(`<template>
            <el name="name" name2="label"></el>
          </template>`, [El]);
                    const rootInstructions = actual.instructions[0];
                    const expectedRootInstructions = [
                        { toVerify: ['type', 'res'], type: TT.hydrateElement, res: 'el' }
                    ];
                    verifyInstructions(rootInstructions, expectedRootInstructions);
                    const expectedElInstructions = [
                        { toVerify: ['type', 'to', 'value'], type: TT.setProperty, to: 'name', value: 'name' }
                    ];
                    verifyInstructions(rootInstructions[0].props, expectedElInstructions);
                });
                it('understands element property casing', function () {
                    let El = (() => {
                        let _classDecorators = [customElement('el')];
                        let _classDescriptor;
                        let _classExtraInitializers = [];
                        let _classThis;
                        let _backgroundColor_decorators;
                        let _backgroundColor_initializers = [];
                        let _backgroundColor_extraInitializers = [];
                        var El = _classThis = class {
                            constructor() {
                                this.backgroundColor = __runInitializers(this, _backgroundColor_initializers, void 0);
                                __runInitializers(this, _backgroundColor_extraInitializers);
                            }
                        };
                        __setFunctionName(_classThis, "El");
                        (() => {
                            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                            _backgroundColor_decorators = [bindable()];
                            __esDecorate(null, null, _backgroundColor_decorators, { kind: "field", name: "backgroundColor", static: false, private: false, access: { has: obj => "backgroundColor" in obj, get: obj => obj.backgroundColor, set: (obj, value) => { obj.backgroundColor = value; } }, metadata: _metadata }, _backgroundColor_initializers, _backgroundColor_extraInitializers);
                            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                            El = _classThis = _classDescriptor.value;
                            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                            __runInitializers(_classThis, _classExtraInitializers);
                        })();
                        return El = _classThis;
                    })();
                    const actual = compileWith(`<template>
            <el background-color="label"></el>
          </template>`, [El]);
                    const rootInstructions = actual.instructions[0];
                    const expectedElInstructions = [
                        { toVerify: ['type', 'value', 'to'], type: TT.setProperty, value: 'label', to: 'backgroundColor' },
                    ];
                    verifyInstructions(rootInstructions[0].props, expectedElInstructions);
                });
                it('understands binding commands', function () {
                    let El = (() => {
                        let _classDecorators = [customElement('el')];
                        let _classDescriptor;
                        let _classExtraInitializers = [];
                        let _classThis;
                        let _propProp1_decorators;
                        let _propProp1_initializers = [];
                        let _propProp1_extraInitializers = [];
                        let _prop2_decorators;
                        let _prop2_initializers = [];
                        let _prop2_extraInitializers = [];
                        let _propProp3_decorators;
                        let _propProp3_initializers = [];
                        let _propProp3_extraInitializers = [];
                        let _prop4_decorators;
                        let _prop4_initializers = [];
                        let _prop4_extraInitializers = [];
                        let _propProp5_decorators;
                        let _propProp5_initializers = [];
                        let _propProp5_extraInitializers = [];
                        var El = _classThis = class {
                            constructor() {
                                this.propProp1 = __runInitializers(this, _propProp1_initializers, void 0);
                                this.prop2 = (__runInitializers(this, _propProp1_extraInitializers), __runInitializers(this, _prop2_initializers, void 0));
                                this.propProp3 = (__runInitializers(this, _prop2_extraInitializers), __runInitializers(this, _propProp3_initializers, void 0));
                                this.prop4 = (__runInitializers(this, _propProp3_extraInitializers), __runInitializers(this, _prop4_initializers, void 0));
                                this.propProp5 = (__runInitializers(this, _prop4_extraInitializers), __runInitializers(this, _propProp5_initializers, void 0));
                                __runInitializers(this, _propProp5_extraInitializers);
                            }
                        };
                        __setFunctionName(_classThis, "El");
                        (() => {
                            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                            _propProp1_decorators = [bindable({ mode: BindingMode.twoWay })];
                            _prop2_decorators = [bindable()];
                            _propProp3_decorators = [bindable()];
                            _prop4_decorators = [bindable()];
                            _propProp5_decorators = [bindable()];
                            __esDecorate(null, null, _propProp1_decorators, { kind: "field", name: "propProp1", static: false, private: false, access: { has: obj => "propProp1" in obj, get: obj => obj.propProp1, set: (obj, value) => { obj.propProp1 = value; } }, metadata: _metadata }, _propProp1_initializers, _propProp1_extraInitializers);
                            __esDecorate(null, null, _prop2_decorators, { kind: "field", name: "prop2", static: false, private: false, access: { has: obj => "prop2" in obj, get: obj => obj.prop2, set: (obj, value) => { obj.prop2 = value; } }, metadata: _metadata }, _prop2_initializers, _prop2_extraInitializers);
                            __esDecorate(null, null, _propProp3_decorators, { kind: "field", name: "propProp3", static: false, private: false, access: { has: obj => "propProp3" in obj, get: obj => obj.propProp3, set: (obj, value) => { obj.propProp3 = value; } }, metadata: _metadata }, _propProp3_initializers, _propProp3_extraInitializers);
                            __esDecorate(null, null, _prop4_decorators, { kind: "field", name: "prop4", static: false, private: false, access: { has: obj => "prop4" in obj, get: obj => obj.prop4, set: (obj, value) => { obj.prop4 = value; } }, metadata: _metadata }, _prop4_initializers, _prop4_extraInitializers);
                            __esDecorate(null, null, _propProp5_decorators, { kind: "field", name: "propProp5", static: false, private: false, access: { has: obj => "propProp5" in obj, get: obj => obj.propProp5, set: (obj, value) => { obj.propProp5 = value; } }, metadata: _metadata }, _propProp5_initializers, _propProp5_extraInitializers);
                            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                            El = _classThis = _classDescriptor.value;
                            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                            __runInitializers(_classThis, _classExtraInitializers);
                        })();
                        return El = _classThis;
                    })();
                    const actual = compileWith(`<template>
            <el
              prop-prop1.bind="prop1"
              prop2.one-time="prop2"
              prop-prop3.to-view="prop3"
              prop4.from-view="prop4"
              prop-prop5.two-way="prop5"
              ></el>
          </template>`, [El]);
                    const rootInstructions = actual.instructions[0];
                    const expectedElInstructions = [
                        { toVerify: ['type', 'mode', 'to'], mode: BindingMode.twoWay, to: 'propProp1' },
                        { toVerify: ['type', 'mode', 'to'], mode: BindingMode.oneTime, to: 'prop2' },
                        { toVerify: ['type', 'mode', 'to'], mode: BindingMode.toView, to: 'propProp3' },
                        { toVerify: ['type', 'mode', 'to'], mode: BindingMode.fromView, to: 'prop4' },
                        { toVerify: ['type', 'mode', 'to'], mode: BindingMode.twoWay, to: 'propProp5' },
                    ].map((e) => {
                        e.type = TT.propertyBinding;
                        return e;
                    });
                    verifyInstructions(rootInstructions[0].props, expectedElInstructions);
                });
                it('enables binding commands to override custom attribute', function () {
                    const { template, instructions } = compileWith(`<el foo.trigger="1">`, [DefaultBindingSyntax, CustomAttribute.define('foo', class {
                        })]);
                    assertTemplateHtml(template, '<!--au*--><el></el>');
                    verifyInstructions(instructions[0], [
                        { toVerify: ['type', 'from', 'to', 'capture'],
                            type: TT.listenerBinding,
                            from: new PrimitiveLiteralExpression(1),
                            to: 'foo',
                            capture: false
                        },
                    ]);
                });
                describe('with template controller', function () {
                    it('compiles', function () {
                        let Prop = (() => {
                            let _classDecorators = [customAttribute({
                                    name: 'prop',
                                    isTemplateController: true
                                })];
                            let _classDescriptor;
                            let _classExtraInitializers = [];
                            let _classThis;
                            var Prop = _classThis = class {
                            };
                            __setFunctionName(_classThis, "Prop");
                            (() => {
                                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                                Prop = _classThis = _classDescriptor.value;
                                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                                __runInitializers(_classThis, _classExtraInitializers);
                            })();
                            return Prop = _classThis;
                        })();
                        const { template, instructions } = compileWith(`<template><el prop.bind="p"></el></template>`, [Prop]);
                        assert.strictEqual(template.outerHTML, '<template><!--au*--><!--au-start--><!--au-end--></template>', `(template as HTMLTemplateElement).outerHTML`);
                        const [hydratePropAttrInstruction] = instructions[0];
                        assert.strictEqual(hydratePropAttrInstruction.def.template.outerHTML, '<template><el></el></template>', `(hydratePropAttrInstruction.def.template as HTMLTemplateElement).outerHTML`);
                    });
                    it('moves attrbiutes instructions before the template controller into it', function () {
                        let Prop = (() => {
                            let _classDecorators = [customAttribute({
                                    name: 'prop',
                                    isTemplateController: true
                                })];
                            let _classDescriptor;
                            let _classExtraInitializers = [];
                            let _classThis;
                            var Prop = _classThis = class {
                            };
                            __setFunctionName(_classThis, "Prop");
                            (() => {
                                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                                Prop = _classThis = _classDescriptor.value;
                                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                                __runInitializers(_classThis, _classExtraInitializers);
                            })();
                            return Prop = _classThis;
                        })();
                        const { template, instructions } = compileWith(`<template><el name.bind="name" title.bind="title" prop.bind="p"></el></template>`, [Prop]);
                        assert.strictEqual(template.outerHTML, '<template><!--au*--><!--au-start--><!--au-end--></template>', `(template as HTMLTemplateElement).outerHTML`);
                        const [hydratePropAttrInstruction] = instructions[0];
                        verifyInstructions(hydratePropAttrInstruction.props, [
                            {
                                toVerify: ['type', 'to', 'from'],
                                type: TT.propertyBinding, to: 'value', from: new AccessScopeExpression('p')
                            }
                        ]);
                        verifyInstructions(hydratePropAttrInstruction.def.instructions[0], [
                            {
                                toVerify: ['type', 'to', 'from'],
                                type: TT.propertyBinding, to: 'name', from: new AccessScopeExpression('name')
                            },
                            {
                                toVerify: ['type', 'to', 'from'],
                                type: TT.propertyBinding, to: 'title', from: new AccessScopeExpression('title')
                            },
                        ]);
                    });
                    describe('[as-element]', function () {
                        it('understands [as-element]', function () {
                            let NotDiv = (() => {
                                let _classDecorators = [customElement('not-div')];
                                let _classDescriptor;
                                let _classExtraInitializers = [];
                                let _classThis;
                                var NotDiv = _classThis = class {
                                };
                                __setFunctionName(_classThis, "NotDiv");
                                (() => {
                                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                                    NotDiv = _classThis = _classDescriptor.value;
                                    if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                                    __runInitializers(_classThis, _classExtraInitializers);
                                })();
                                return NotDiv = _classThis;
                            })();
                            const { instructions } = compileWith('<template><div as-element="not-div"></div></template>', [NotDiv]);
                            verifyInstructions(instructions[0], [
                                {
                                    toVerify: ['type', 'res'],
                                    type: TT.hydrateElement, res: 'not-div'
                                }
                            ]);
                        });
                        it('does not throw when element is not found', function () {
                            const { instructions } = compileWith('<template><div as-element="not-div"></div></template>');
                            assert.strictEqual(instructions.length, 0, `instructions.length`);
                        });
                        describe('with template controller', function () {
                            it('compiles', function () {
                                let NotDiv = (() => {
                                    let _classDecorators = [customElement('not-div')];
                                    let _classDescriptor;
                                    let _classExtraInitializers = [];
                                    let _classThis;
                                    var NotDiv = _classThis = class {
                                    };
                                    __setFunctionName(_classThis, "NotDiv");
                                    (() => {
                                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                                        NotDiv = _classThis = _classDescriptor.value;
                                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                                        __runInitializers(_classThis, _classExtraInitializers);
                                    })();
                                    return NotDiv = _classThis;
                                })();
                                const { instructions } = compileWith('<template><div if.bind="value" as-element="not-div"></div></template>', [NotDiv]);
                                verifyInstructions(instructions[0], [
                                    {
                                        toVerify: ['type', 'res', 'to'],
                                        type: TT.hydrateTemplateController, res: 'if'
                                    }
                                ]);
                                const templateControllerInst = instructions[0][0];
                                verifyInstructions(templateControllerInst.props, [
                                    {
                                        toVerify: ['type', 'to', 'from'],
                                        type: TT.propertyBinding, to: 'value', from: new AccessScopeExpression('value')
                                    }
                                ]);
                                const [hydrateNotDivInstruction] = templateControllerInst.def.instructions[0];
                                verifyInstructions([hydrateNotDivInstruction], [
                                    {
                                        toVerify: ['type', 'res'],
                                        type: TT.hydrateElement, res: 'not-div'
                                    }
                                ]);
                                verifyInstructions(hydrateNotDivInstruction.props, []);
                            });
                        });
                    });
                });
                describe('<let/> element', function () {
                    it('compiles', function () {
                        const { template, instructions } = compileWith(`<template><let></let></template>`);
                        assert.strictEqual(instructions.length, 1, `instructions.length`);
                        assert.strictEqual(template.outerHTML, '<template><!--au*--><let></let></template>');
                    });
                    it('does not generate instructions when there is no bindings', function () {
                        const { instructions } = compileWith(`<template><let></let></template>`);
                        assert.strictEqual(instructions[0][0].instructions.length, 0, `(instructions[0][0]).instructions.length`);
                    });
                    it('ignores custom element resource', function () {
                        let Let = (() => {
                            let _classDecorators = [customElement('let')];
                            let _classDescriptor;
                            let _classExtraInitializers = [];
                            let _classThis;
                            var Let = _classThis = class {
                            };
                            __setFunctionName(_classThis, "Let");
                            (() => {
                                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                                Let = _classThis = _classDescriptor.value;
                                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                                __runInitializers(_classThis, _classExtraInitializers);
                            })();
                            return Let = _classThis;
                        })();
                        const { instructions } = compileWith(`<template><let></let></template>`, [Let]);
                        verifyInstructions(instructions[0], [
                            { toVerify: ['type'], type: TT.hydrateLetElement }
                        ]);
                    });
                    it('compiles with attributes', function () {
                        const { instructions } = compileWith(`<let a.bind="b" c="\${d}"></let>`);
                        verifyInstructions(instructions[0][0].instructions, [
                            {
                                toVerify: ['type', 'to', 'srcOrExp'],
                                type: TT.letBinding, to: 'a', from: 'b'
                            },
                            {
                                toVerify: ['type', 'to'],
                                type: TT.letBinding, to: 'c'
                            }
                        ]);
                    });
                    describe('[to-binding-context]', function () {
                        it('understands [to-binding-context]', function () {
                            const { instructions } = compileWith(`<template><let to-binding-context></let></template>`);
                            assert.strictEqual(instructions[0][0].toBindingContext, true, `(instructions[0][0]).toBindingContext`);
                        });
                        it('ignores [to-binding-context] order', function () {
                            let instructions = compileWith(`<template><let a.bind="a" to-binding-context></let></template>`).instructions[0];
                            verifyInstructions(instructions, [
                                { toVerify: ['type', 'toBindingContext'], type: TT.hydrateLetElement, toBindingContext: true }
                            ]);
                            instructions = compileWith(`<template><let to-binding-context a.bind="a"></let></template>`).instructions[0];
                            verifyInstructions(instructions, [
                                { toVerify: ['type', 'toBindingContext'], type: TT.hydrateLetElement, toBindingContext: true }
                            ]);
                        });
                    });
                });
                describe('with containerless', function () {
                    it('compiles [containerless] attribute', function () {
                        const { template } = compileWith('<el containerless>', [CustomElement.define({ name: 'el' })]);
                        assertTemplateHtml(template, '<!--au*--><!--au-start--><!--au-end-->');
                    });
                    it('compiles [containerless] after an interpolation', function () {
                        const { template } = compileWith('${message}<el containerless>', [CustomElement.define({ name: 'el' })]);
                        assertTemplateHtml(template, '<!--au*--> <!--au*--><!--au-start--><!--au-end-->');
                    });
                    it('compiles [containerless] before an interpolation', function () {
                        const { template } = compileWith('<el containerless></el>${message}', [CustomElement.define({ name: 'el' })]);
                        assertTemplateHtml(template, '<!--au*--><!--au-start--><!--au-end--><!--au*--> ');
                    });
                    it('compiles [containerless] next to each other', function () {
                        const { template } = compileWith('<el containerless></el><el containerless></el>', [CustomElement.define({ name: 'el' })]);
                        assertTemplateHtml(template, '<!--au*--><!--au-start--><!--au-end-->'.repeat(2));
                    });
                });
            });
            function compileWith(markup, extraResources = [], shadow = false) {
                extraResources.forEach(e => container.register(e));
                const templateDefinition = {
                    template: markup,
                    instructions: [],
                    surrogates: [],
                    shadowOptions: shadow ? { mode: 'open' } : null
                };
                return sut.compile(templateDefinition, container, null);
            }
            function verifyInstructions(actual, expectation, type) {
                assert.strictEqual(actual.length, expectation.length, `Expected to have ${expectation.length} ${type ? type : ''} instructions. Received: ${actual.length}`);
                for (let i = 0, ii = actual.length; i < ii; ++i) {
                    const actualInst = actual[i];
                    const expectedInst = expectation[i];
                    const ofType = type ? `of ${type}` : '';
                    for (const prop of expectedInst.toVerify) {
                        if (expectedInst[prop] instanceof Object) {
                            assert.deepStrictEqual(actualInst[prop], expectedInst[prop], `Expected actual instruction ${ofType} to have "${prop}": ${expectedInst[prop]}. Received: ${actualInst[prop]} (on index: ${i})`);
                        }
                        else {
                            assert.deepStrictEqual(actualInst[prop], expectedInst[prop], `Expected actual instruction ${ofType} to have "${prop}": ${expectedInst[prop]}. Received: ${actualInst[prop]} (on index: ${i})`);
                        }
                    }
                }
            }
        });
        describe('compileSpread', function () {
            it('throws when spreading a template controller', function () {
                let Bar = (() => {
                    let _classDecorators = [customAttribute({ name: 'bar', isTemplateController: true })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    var Bar = _classThis = class {
                    };
                    __setFunctionName(_classThis, "Bar");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        Bar = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return Bar = _classThis;
                })();
                container.register(Bar);
                assert.throws(() => sut.compileSpread(CustomElementDefinition.create({ name: 'el', template: '<template></template>' }), [
                    { command: null, target: 'bar', rawValue: '', parts: [], rawName: 'bar' }
                ], container, ctx.doc.createElement('div')));
            });
        });
    });
    const elementInfoLookup = new WeakMap();
    /**
     * Pre-processed information about a custom element resource, optimized
     * for consumption by the template compiler.
     */
    class ElementInfo {
        constructor(name, alias, containerless) {
            this.name = name;
            this.alias = alias;
            this.containerless = containerless;
            /**
             * A lookup of the bindables of this element, indexed by the (pre-processed)
             * attribute names as they would be found in parsed markup.
             */
            this.bindables = Object.create(null);
        }
        static from(def, alias) {
            if (def === null) {
                return null;
            }
            let rec = elementInfoLookup.get(def);
            if (rec === void 0) {
                elementInfoLookup.set(def, rec = Object.create(null));
            }
            let info = rec[alias];
            if (info === void 0) {
                info = rec[alias] = new ElementInfo(def.name, alias === def.name ? void 0 : alias, def.containerless);
                const bindables = def.bindables;
                const defaultBindingMode = BindingMode.toView;
                let bindable;
                let prop;
                let attr;
                let mode;
                for (prop in bindables) {
                    bindable = bindables[prop];
                    // explicitly provided property name has priority over the implicit property name
                    if (bindable.name !== void 0) {
                        prop = bindable.name;
                    }
                    // explicitly provided attribute name has priority over the derived implicit attribute name
                    if (bindable.attribute !== void 0) {
                        attr = bindable.attribute;
                    }
                    else {
                        // derive the attribute name from the resolved property name
                        attr = kebabCase(prop);
                    }
                    if (bindable.mode !== void 0 && bindable.mode !== BindingMode.default) {
                        mode = bindable.mode;
                    }
                    else {
                        mode = defaultBindingMode;
                    }
                    info.bindables[attr] = new BindableInfo(prop, mode);
                }
            }
            return info;
        }
    }
    const attrInfoLookup = new WeakMap();
    /**
     * Pre-processed information about a custom attribute resource, optimized
     * for consumption by the template compiler.
     */
    class AttrInfo {
        constructor(name, alias, isTemplateController, noMultiBindings) {
            this.name = name;
            this.alias = alias;
            this.isTemplateController = isTemplateController;
            this.noMultiBindings = noMultiBindings;
            /**
             * A lookup of the bindables of this attribute, indexed by the (pre-processed)
             * bindable names as they would be found in the attribute value.
             *
             * Only applicable to multi attribute bindings (semicolon-separated).
             */
            this.bindables = Object.create(null);
            /**
             * The single or first bindable of this attribute, or a default 'value'
             * bindable if no bindables were defined on the attribute.
             *
             * Only applicable to single attribute bindings (where the attribute value
             * contains no semicolons)
             */
            this.bindable = null;
        }
        static from(def, alias) {
            if (def === null) {
                return null;
            }
            let rec = attrInfoLookup.get(def);
            if (rec === void 0) {
                attrInfoLookup.set(def, rec = Object.create(null));
            }
            let info = rec[alias];
            if (info === void 0) {
                info = rec[alias] = new AttrInfo(def.name, alias === def.name ? void 0 : alias, def.isTemplateController, def.noMultiBindings);
                const bindables = def.bindables;
                const defaultBindingMode = def.defaultBindingMode !== void 0 && def.defaultBindingMode !== BindingMode.default
                    ? def.defaultBindingMode
                    : BindingMode.toView;
                let bindable;
                let prop;
                let mode;
                let hasPrimary = false;
                let isPrimary = false;
                let bindableInfo;
                for (prop in bindables) {
                    bindable = bindables[prop];
                    // explicitly provided property name has priority over the implicit property name
                    if (bindable.name !== void 0) {
                        prop = bindable.name;
                    }
                    if (bindable.mode !== void 0 && bindable.mode !== BindingMode.default) {
                        mode = bindable.mode;
                    }
                    else {
                        mode = defaultBindingMode;
                    }
                    isPrimary = bindable.primary === true;
                    bindableInfo = info.bindables[prop] = new BindableInfo(prop, mode);
                    if (isPrimary) {
                        if (hasPrimary) {
                            throw new Error('primary already exists');
                        }
                        hasPrimary = true;
                        info.bindable = bindableInfo;
                    }
                    // set to first bindable by convention
                    if (info.bindable === null) {
                        info.bindable = bindableInfo;
                    }
                }
                // if no bindables are present, default to "value"
                if (info.bindable === null) {
                    info.bindable = new BindableInfo('value', defaultBindingMode);
                }
            }
            return info;
        }
    }
    /**
     * A pre-processed piece of information about a defined bindable property on a custom
     * element or attribute, optimized for consumption by the template compiler.
     */
    class BindableInfo {
        constructor(
        /**
         * The pre-processed *property* (not attribute) name of the bindable, which is
         * (in order of priority):
         *
         * 1. The `property` from the description (if defined)
         * 2. The name of the property of the bindable itself
         */
        propName, 
        /**
         * The pre-processed (default) bindingMode of the bindable, which is (in order of priority):
         *
         * 1. The `mode` from the bindable (if defined and not bindingMode.default)
         * 2. The `defaultBindingMode` (if it's an attribute, defined, and not bindingMode.default)
         * 3. `bindingMode.toView`
         */
        mode) {
            this.propName = propName;
            this.mode = mode;
        }
    }
    function stringOrUnnamed(str) {
        if (str === void 0) {
            return 'unnamed';
        }
        return str;
    }
    const defaultCustomElementDefinitionProperties = {
        name: 'unnamed',
        Type: class HTMLOnlyElement {
        },
        aliases: [],
        key: 'au:resource:custom-element:unnamed',
        cache: 0,
        dependencies: [],
        bindables: {},
        containerless: false,
        injectable: null,
        hasSlots: false,
        shadowOptions: null,
        surrogates: [],
        watches: [],
    };
    function createTplCtrlAttributeInstruction(attr, value) {
        if (attr === 'repeat.for') {
            return [{
                    type: TT.iteratorBinding,
                    forOf: new ForOfStatement(new BindingIdentifier(value.split(' of ')[0]), new AccessScopeExpression(value.split(' of ')[1]), -1),
                    to: 'items',
                    props: [],
                }];
        }
        else if (attr.includes('.')) {
            return [{
                    type: TT.propertyBinding,
                    from: value.length === 0 ? PrimitiveLiteralExpression.$empty : new AccessScopeExpression(value),
                    to: 'value',
                    mode: BindingMode.toView,
                }];
        }
        else {
            return value.length > 0
                ? [{
                        type: TT.setProperty,
                        to: 'value',
                        value
                    }]
                : [];
        }
    }
    function createTemplateController(ctx, resolveRes, attr, target, value, tagName, finalize, childInstr, childTpl) {
        // multiple template controllers per element
        if (tagName == null) {
            const node = ctx.createElementFromMarkup(childTpl);
            const attributes = [];
            while (node.attributes.length) {
                attributes.unshift(node.attributes[0]);
                node.removeAttribute(node.attributes[0].name);
            }
            node.setAttribute(attr, value);
            while (attributes.length) {
                const attrib = attributes.pop();
                node.setAttribute(attrib.name, attrib.value);
            }
            node.setAttribute(attr, value);
            const rawMarkup = node.outerHTML;
            const instruction = {
                type: TT.hydrateTemplateController,
                res: resolveRes ? CustomAttribute.find(ctx.container, target) : target,
                def: {
                    ...defaultCustomElementDefinitionProperties,
                    name: stringOrUnnamed(target),
                    key: `au:resource:custom-element:${stringOrUnnamed(target)}`,
                    template: ctx.createElementFromMarkup(`<template><!--au*--><!--au-start--><!--au-end--></template>`),
                    instructions: [[childInstr]],
                    needsCompile: false,
                    enhance: false,
                    capture: false,
                    processContent: null,
                },
                props: createTplCtrlAttributeInstruction(attr, value),
            };
            const input = {
                template: finalize ? `<div>${rawMarkup}</div>` : rawMarkup,
                instructions: []
            };
            const output = {
                ...defaultCustomElementDefinitionProperties,
                template: ctx.createElementFromMarkup(`<template><div><!--au*--><!--au-start--><!--au-end--></div></template>`),
                instructions: [[instruction]],
                needsCompile: false,
                enhance: false,
                capture: false,
                processContent: null,
            };
            return [input, output];
        }
        else {
            let compiledMarkup;
            let instructions;
            if (childInstr === undefined) {
                compiledMarkup = `<${tagName}></${tagName}>`;
                instructions = [];
            }
            else {
                compiledMarkup = `<${tagName}><!--au*--><!--au-start--><!--au-end--></${tagName}>`;
                instructions = [[childInstr]];
            }
            const instruction = {
                type: TT.hydrateTemplateController,
                res: resolveRes ? CustomAttribute.find(ctx.container, target) : target,
                def: {
                    ...defaultCustomElementDefinitionProperties,
                    name: stringOrUnnamed(target),
                    key: `au:resource:custom-element:${stringOrUnnamed(target)}`,
                    template: ctx.createElementFromMarkup(tagName === 'template' ? compiledMarkup : `<template>${compiledMarkup}</template>`),
                    instructions,
                    needsCompile: false,
                    enhance: false,
                    capture: false,
                    processContent: null,
                },
                props: createTplCtrlAttributeInstruction(attr, value),
            };
            const rawMarkup = `<${tagName} ${attr}="${value || ''}">${childTpl || ''}</${tagName}>`;
            const input = {
                template: finalize ? `<div>${rawMarkup}</div>` : rawMarkup,
                instructions: []
            };
            const output = {
                ...defaultCustomElementDefinitionProperties,
                template: finalize
                    ? ctx.createElementFromMarkup(`<template><div><!--au*--><!--au-start--><!--au-end--></div></template>`)
                    : `<!--au*--><!--au-start--><!--au-end-->`,
                instructions: [[instruction]],
                needsCompile: false,
                enhance: false,
                capture: false,
                processContent: null,
            };
            return [input, output];
        }
    }
    function createCustomElement(ctx, tagNameOrDef, finalize, attributes, childInstructions, siblingInstructions, nestedElInstructions, childOutput, childInput, debugMode) {
        const instruction = {
            type: TT.hydrateElement,
            res: tagNameOrDef,
            props: childInstructions,
            containerless: false,
            projections: null,
            captures: [],
            data: {},
        };
        const def = typeof tagNameOrDef === 'string'
            ? CustomElement.find(ctx.container, tagNameOrDef)
            : tagNameOrDef;
        const exprParser = ctx.container.get(IExpressionParser);
        const attrParser = ctx.container.get(IAttributeParser);
        const attributeMarkup = attributes.map(a => `${a[0]}="${a[1]}"`).join(' ');
        const rawMarkup = `<${def.name} ${attributeMarkup}>${(childInput?.template) || ''}</${def.name}>`;
        const input = {
            name: 'unnamed',
            template: finalize ? `<div>${rawMarkup}</div>` : rawMarkup,
            instructions: []
        };
        const outputAttributeMarkup = debugMode
            ? attributes
                .map(a => `${a[0]}="${a[1]}"`)
                .join(' ')
            : attributes
                .filter((a) => {
                const syntax = attrParser.parse(a[0], a[1]);
                // if not with a binding command,
                const canStay = syntax.command === null
                    // nor a custom attribute,
                    && !CustomAttribute.find(ctx.container, syntax.target)
                    // nor with interpolation
                    && exprParser.parse(a[1], 'Interpolation') === null
                    // nor a bindable
                    && !(BindablesInfo.from(def, false).attrs[a[0]]);
                // then can stay in the template
                return canStay;
            })
                .map(a => `${a[0]}="${a[1]}"`)
                .join(' ');
        // const outputMarkup = ctx.createElementFromMarkup(
        //   `<!--au*--><${def.name} ${outputAttributeMarkup}>${(childOutput?.template.outerHTML) || ''}</${def.name}>`
        // );
        // outputMarkup.classList.add('au');
        const outputMarkup = `<!--au*--><${def.name} ${outputAttributeMarkup}>${(childOutput?.template.outerHTML) || ''}</${def.name}>`;
        const output = {
            ...defaultCustomElementDefinitionProperties,
            name: 'unnamed',
            key: 'au:resource:custom-element:unnamed',
            template: finalize ? ctx.createElementFromMarkup(`<template><div>${outputMarkup}</div></template>`) : outputMarkup,
            instructions: [[instruction, ...siblingInstructions], ...nestedElInstructions],
            needsCompile: false,
            enhance: false,
            watches: [],
            capture: false,
            processContent: null,
        };
        return [input, output];
    }
    function createCustomAttribute(ctx, attrNameOrDef, finalize, attributes, childInstructions, siblingInstructions, nestedElInstructions, childOutput, childInput) {
        const resName = typeof attrNameOrDef === 'string' ? attrNameOrDef : attrNameOrDef.name;
        const instruction = {
            type: TT.hydrateAttribute,
            res: attrNameOrDef,
            props: childInstructions
        };
        const attributeMarkup = attributes.map(a => `${a[0]}: ${a[1]};`).join('');
        const rawMarkup = `<div ${resName}="${attributeMarkup}">${(childInput?.template) || ''}</div>`;
        const input = {
            name: 'unnamed',
            template: finalize ? `<div>${rawMarkup}</div>` : rawMarkup,
            instructions: []
        };
        // old behavior: keep attribute on the output template as is
        // const outputMarkup = ctx.createElementFromMarkup(`<div ${resName}="${attributeMarkup}">${(childOutput && childOutput.template.outerHTML) || ''}</div>`);
        // new behavior: if it's custom attribute, remove
        // const outputMarkup = ctx.createElementFromMarkup(`<div>${(childOutput?.template.outerHTML) || ''}</div>`);
        // outputMarkup.classList.add('au');
        const outputMarkup = `<!--au*--><div>${(childOutput?.template.outerHTML) || ''}</div>`;
        const output = {
            ...defaultCustomElementDefinitionProperties,
            name: 'unnamed',
            key: 'au:resource:custom-element:unnamed',
            template: finalize ? ctx.createElementFromMarkup(`<template><div>${outputMarkup}</div></template>`) : outputMarkup,
            instructions: [[instruction, ...siblingInstructions], ...nestedElInstructions],
            needsCompile: false,
            enhance: false,
            capture: false,
            watches: [],
            processContent: null,
            dependencies: [],
        };
        return [input, output];
    }
    const commandToMode = {
        'one-time': BindingMode.oneTime,
        'to-view': BindingMode.toView,
        'from-view': BindingMode.fromView,
        'two-way': BindingMode.twoWay
    };
    const validCommands = ['bind', 'one-time', 'to-view', 'from-view', 'two-way', 'trigger', 'delegate', 'capture', 'call'];
    function createAttributeInstruction(bindableDescription, attributeName, attributeValue, isMulti) {
        const parts = attributeName.split('.');
        const attr = parts[0];
        const cmd = parts.pop();
        const defaultMode = !!bindableDescription ? (bindableDescription.mode === BindingMode.default ? BindingMode.toView : bindableDescription.mode) : BindingMode.toView;
        const mode = commandToMode[cmd] || defaultMode;
        if (!!bindableDescription) {
            if (!!cmd && validCommands.includes(cmd)) {
                const type = TT.propertyBinding;
                const to = bindableDescription.name;
                const from = parseExpression(attributeValue);
                return { type, to, mode, from };
            }
            else {
                const from = parseExpression(attributeValue, 'Interpolation');
                if (!!from) {
                    const type = TT.interpolation;
                    const to = bindableDescription.name;
                    return { type, to, from };
                }
                else {
                    const type = TT.setProperty;
                    const to = bindableDescription.name;
                    const value = attributeValue;
                    return { type, to, value };
                }
            }
        }
        else {
            const type = TT.propertyBinding;
            const to = camelCase(attr);
            if (!!cmd && validCommands.includes(cmd)) {
                const from = parseExpression(attributeValue);
                return { type, to, mode, from };
            }
            else {
                const from = parseExpression(attributeValue, 'Interpolation');
                if (!!from) {
                    const type2 = TT.interpolation;
                    return { type: type2, to, from };
                }
                else if (isMulti) {
                    const type3 = TT.setProperty;
                    const to3 = attr;
                    const value = attributeValue;
                    return { type: type3, to: to3, value };
                }
                else {
                    return null;
                }
            }
        }
    }
    describe(`combination assertions`, function () {
        function createFixture(ctx, ...globals) {
            const container = ctx.container;
            container.register(...globals, delegateSyntax);
            const sut = createCompilerWrapper(ctx.templateCompiler);
            return { container, sut };
        }
        describe('TemplateCompiler - combinations -- plain attributes', function () {
            eachCartesianJoinFactory([
                [
                    TestContext.create
                ],
                [
                    (_ctx) => ['div']
                ],
                [
                    (_ctx) => ['foo', 'foo', 'bar'],
                    (_ctx) => ['value', 'value', 'value']
                ],
                [
                    (ctx, $1, [, , value]) => [`ref`, value, { type: TT.refBinding, from: new AccessScopeExpression(value), to: 'element' }],
                    (ctx, $1, [attr, to, value]) => [`${attr}.bind`, value, { type: TT.propertyBinding, from: new AccessScopeExpression(value), to, mode: BindingMode.toView, }],
                    (ctx, $1, [attr, to, value]) => [`${attr}.to-view`, value, { type: TT.propertyBinding, from: new AccessScopeExpression(value), to, mode: BindingMode.toView, }],
                    (ctx, $1, [attr, to, value]) => [`${attr}.one-time`, value, { type: TT.propertyBinding, from: new AccessScopeExpression(value), to, mode: BindingMode.oneTime, }],
                    (ctx, $1, [attr, to, value]) => [`${attr}.from-view`, value, { type: TT.propertyBinding, from: new AccessScopeExpression(value), to, mode: BindingMode.fromView, }],
                    (ctx, $1, [attr, to, value]) => [`${attr}.two-way`, value, { type: TT.propertyBinding, from: new AccessScopeExpression(value), to, mode: BindingMode.twoWay, }],
                    (ctx, $1, [attr, to, value]) => [`${attr}.trigger`, value, { type: HTT.listenerBinding, from: new AccessScopeExpression(value), to, capture: false, modifier: null }],
                    (ctx, $1, [attr, to, value]) => [`${attr}.delegate`, value, { type: HTT.listenerBinding, from: new AccessScopeExpression(value), to, preventDefault: true }],
                    (ctx, $1, [attr, to, value]) => [`${attr}.capture`, value, { type: HTT.listenerBinding, from: new AccessScopeExpression(value), to, capture: true, modifier: null }],
                ]
            ], (ctx, [el], $2, [n1, v1, i1]) => {
                const markup = `<${el} plain data-attr="value" ${n1}="${v1}"></${el}>`;
                for (const debugMode of [true, false]) {
                    it(`[Debug: ${debugMode}] ${markup} + [class] attribute`, function () {
                        const markup = `<${el} plain data-attr="value" class="abc" ${n1}="${v1}"></${el}>`;
                        const input = {
                            template: markup,
                            instructions: [],
                            surrogates: [],
                        };
                        const expected = {
                            ...defaultCustomElementDefinitionProperties,
                            template: ctx.createElementFromMarkup(`<template><!--au*--><${el} plain data-attr="value" class="abc" ${debugMode ? `${n1}="${v1}" ` : ''}></${el}></template>`),
                            instructions: [[i1]],
                            surrogates: [],
                            needsCompile: false,
                            enhance: false,
                            capture: false,
                            processContent: null,
                        };
                        const { sut, container } = createFixture(ctx);
                        sut.debug = debugMode;
                        const actual = sut.compile(input, container, null);
                        verifyBindingInstructionsEqual(actual, expected);
                    });
                    it(`[Debug: ${debugMode}] ${markup}`, function () {
                        const markup = `<${el} plain data-attr="value" ${n1}="${v1}"></${el}>`;
                        const input = {
                            template: markup,
                            instructions: [],
                            surrogates: [],
                        };
                        const expected = {
                            ...defaultCustomElementDefinitionProperties,
                            template: ctx.createElementFromMarkup(`<template><!--au*--><${el} plain data-attr="value" ${debugMode ? `${n1}="${v1}" ` : ''}></${el}></template>`),
                            instructions: [[i1]],
                            surrogates: [],
                            needsCompile: false,
                            enhance: false,
                            capture: false,
                            processContent: null,
                        };
                        const { sut, container } = createFixture(ctx);
                        sut.debug = debugMode;
                        const actual = sut.compile(input, container, null);
                        verifyBindingInstructionsEqual(actual, expected);
                    });
                }
            });
            for (const debugMode of [true, false]) {
                it(`[Debug: ${debugMode}] [class] attribute + \${interpolation}`, function () {
                    const ctx = TestContext.create();
                    const markup = `<span plain data-attr="value" class="abc-\${value}"></span>`;
                    const input = {
                        template: markup,
                        instructions: [],
                        surrogates: [],
                    };
                    const expected = {
                        ...defaultCustomElementDefinitionProperties,
                        template: ctx.createElementFromMarkup(`<template><!--au*--><span plain data-attr="value"${debugMode ? ` class="abc-\${value}"` : ''}></span></template>`),
                        instructions: [[
                                {
                                    "type": InstructionType.interpolation,
                                    "from": {
                                        '$kind': 'Interpolation',
                                        "parts": ["abc-", ""],
                                        "expressions": [
                                            { "$kind": 'AccessScope', "name": "value", "ancestor": 0 }
                                        ],
                                        "isMulti": false,
                                        "firstExpression": { "$kind": 'AccessScope', "name": "value", "ancestor": 0 }
                                    },
                                    "to": "class"
                                }
                            ]],
                        surrogates: [],
                        needsCompile: false,
                        enhance: false,
                        capture: false,
                        processContent: null,
                    };
                    const { sut, container } = createFixture(ctx);
                    sut.debug = debugMode;
                    const actual = sut.compile(input, container, null);
                    verifyBindingInstructionsEqual(actual, expected);
                });
            }
        });
        describe('TemplateCompiler - combinations -- custom attributes', function () {
            eachCartesianJoinFactory([
                [
                    TestContext.create
                ],
                // PartialCustomAttributeDefinition.bindables
                [
                    (_ctx) => [undefined, undefined, 'value'],
                    (_ctx) => [{}, undefined, 'value'],
                    (_ctx) => [BindableDefinition.create('asdf', { attribute: 'bazBaz', name: 'bazBaz', mode: BindingMode.oneTime }), BindingMode.oneTime, 'bazBaz'],
                    (_ctx) => [BindableDefinition.create('asdf', { attribute: 'bazBaz', name: 'bazBaz', mode: BindingMode.fromView }), BindingMode.fromView, 'bazBaz'],
                    (_ctx) => [BindableDefinition.create('asdf', { attribute: 'bazBaz', name: 'bazBaz', mode: BindingMode.twoWay }), BindingMode.twoWay, 'bazBaz'],
                    (_ctx) => [BindableDefinition.create('asdf', { attribute: 'bazBaz', name: 'bazBaz', mode: BindingMode.default }), BindingMode.default, 'bazBaz']
                ],
                [
                    (_ctx) => ['foo', '', class Foo1 {
                        }],
                    (_ctx) => ['foo-foo', '', class FooFoo {
                        }],
                    (_ctx) => ['foo', 'bar', class Foo2 {
                        }],
                    (_ctx) => ['foo-foo', 'bar', class Foo3 {
                        }]
                ],
                // PartialCustomAttributeDefinition.defaultBindingMode
                [
                    (_ctx) => undefined,
                    (_ctx) => BindingMode.oneTime,
                    (_ctx) => BindingMode.toView,
                    (_ctx) => BindingMode.fromView,
                    (_ctx) => BindingMode.twoWay
                ],
                [
                    (ctx, [, , to], [attr, value]) => [`${attr}`, value.length > 0 ? { type: TT.setProperty, to, value } : null],
                    (ctx, [, mode, to], [attr, value], defaultMode) => [`${attr}.bind`, { type: TT.propertyBinding, from: value.length > 0 ? new AccessScopeExpression(value) : new PrimitiveLiteralExpression(value), to, mode: (mode && mode !== BindingMode.default) ? mode : (defaultMode || BindingMode.toView) }],
                    (ctx, [, , to], [attr, value]) => [`${attr}.to-view`, { type: TT.propertyBinding, from: value.length > 0 ? new AccessScopeExpression(value) : new PrimitiveLiteralExpression(value), to, mode: BindingMode.toView }],
                    (ctx, [, , to], [attr, value]) => [`${attr}.one-time`, { type: TT.propertyBinding, from: value.length > 0 ? new AccessScopeExpression(value) : new PrimitiveLiteralExpression(value), to, mode: BindingMode.oneTime }],
                    (ctx, [, , to], [attr, value]) => [`${attr}.from-view`, { type: TT.propertyBinding, from: value.length > 0 ? new AccessScopeExpression(value) : new PrimitiveLiteralExpression(value), to, mode: BindingMode.fromView }],
                    (ctx, [, , to], [attr, value]) => [`${attr}.two-way`, { type: TT.propertyBinding, from: value.length > 0 ? new AccessScopeExpression(value) : new PrimitiveLiteralExpression(value), to, mode: BindingMode.twoWay }]
                ]
            ], (ctx, [bindables], [attr, value, ctor], defaultBindingMode, [name, childInstruction]) => {
                for (const resolveResources of [true, false]) {
                    const def = { name: attr, defaultBindingMode, bindables };
                    const $def = CustomAttribute.define(def, ctor);
                    const markup = `<div ${name}="${value}"></div>`;
                    const title = `${markup} [Resolve res: ${resolveResources}] CustomAttribute=${JSON.stringify(def)}`;
                    it(title, function () {
                        const input = {
                            template: markup,
                            instructions: [],
                            surrogates: [],
                        };
                        const instruction = {
                            type: TT.hydrateAttribute,
                            res: resolveResources ? CustomAttribute.getDefinition($def) : attr,
                            props: childInstruction == null ? [] : [childInstruction],
                        };
                        const expected = {
                            ...defaultCustomElementDefinitionProperties,
                            // old behavior:
                            // template: ctx.createElementFromMarkup(`<template><!--au*--><div ${name}="${value}"></div></template>`),
                            // new behavior
                            // todo: ability to configure whether attr should be removed
                            template: ctx.createElementFromMarkup(`<template><!--au*--><div></div></template>`),
                            instructions: [[instruction]],
                            surrogates: [],
                            needsCompile: false,
                            enhance: false,
                            capture: false,
                            watches: [],
                            processContent: null,
                        };
                        const { sut, container } = createFixture(ctx, $def);
                        sut.resolveResources = resolveResources;
                        const actual = sut.compile(input, container, null);
                        verifyBindingInstructionsEqual(actual, expected);
                    });
                }
            });
        });
        describe('TemplateCompiler - combinations -- custom attributes with multiple bindings', function () {
            eachCartesianJoinFactory([
                [
                    TestContext.create
                ],
                [
                    (_ctx) => 'foo',
                    (_ctx) => 'bar42'
                ],
                [
                    (ctx, pdName) => pdName,
                    (ctx, pdName) => `${pdName}Bar` // descriptor.property is different from the actual property name
                ],
                [
                    (ctx, pdName, pdProp) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: kebabCase(pdProp), mode: BindingMode.default }) }),
                    (ctx, pdName, pdProp) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: kebabCase(pdProp), mode: BindingMode.oneTime }) }),
                    (ctx, pdName, pdProp) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: kebabCase(pdProp), mode: BindingMode.toView }) }),
                    (ctx, pdName, pdProp) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: kebabCase(pdProp), mode: BindingMode.fromView }) }),
                    (ctx, pdName, pdProp) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: kebabCase(pdProp), mode: BindingMode.twoWay }) })
                ],
                [
                    (_ctx) => [``, `''`],
                    (_ctx) => [``, `\${a}`],
                    (_ctx) => [`.bind`, `''`],
                    (_ctx) => [`.one-time`, `''`],
                    (_ctx) => [`.to-view`, `''`],
                    (_ctx) => [`.from-view`, `''`],
                    (_ctx) => [`.two-way`, `''`]
                ],
                [
                    (ctx, pdName, pdProp, bindables, [cmd]) => [bindables[pdName], `${pdProp}${cmd}`],
                    (ctx, pdName, pdProp, bindables, [cmd]) => [bindables[pdName], `${pdProp}.qux${cmd}`],
                    (ctx, pdName, pdProp, bindables, [cmd]) => [null, `${pdProp}Qux${cmd}`]
                    // TODO: test fallback to attribute name when no matching binding exists (or throw if we don't want to support this)
                ]
            ], (ctx, pdName, pdProp, bindables, [cmd, attrValue], [bindableDescription, attrName]) => {
                for (const resolveResources of [true, false]) {
                    const title = `[Resolve res: ${resolveResources}] div - pdName=${pdName}  pdProp=${pdProp}  cmd=${cmd}  attrName=${attrName}  attrValue="${attrValue}"`;
                    it(title, function () {
                        const FooBar = CustomAttribute.define({ name: 'asdf', bindables }, class FooBar {
                        });
                        const FooBarDef = CustomAttribute.getDefinition(FooBar);
                        const { sut, container } = createFixture(ctx, FooBar);
                        sut.resolveResources = resolveResources;
                        const instruction = createAttributeInstruction(bindableDescription, attrName, attrValue, true);
                        // IMPORTANT:
                        // ====================================
                        // before template compiler refactoring:
                        // const [input, output] = createCustomAttribute(ctx, 'asdf', true, [[attrName, attrValue]], [instruction], [], []) as [PartialCustomElementDefinition, PartialCustomElementDefinition];
                        // after template compiler refactoring:
                        // reason: custom attribute should look & behave like style attribute
                        // we do: style="background-color: red" instead of style="backgroundColor: red"
                        //
                        // if for some reasons, this reasoning causes a lot of unintuitiveness in the template
                        // then consider reverting it
                        const [input, output] = createCustomAttribute(ctx, resolveResources ? FooBarDef : 'asdf', true, [[kebabCase(attrName), attrValue]], [instruction], [], []);
                        const bindablesInfo = BindablesInfo.from(CustomAttribute.getDefinition(FooBar), true);
                        if (!bindablesInfo.attrs[kebabCase(attrName)]) {
                            assert.throws(() => sut.compile(input, container, null), `Bindable ${attrName} not found on asdf.`);
                        }
                        else {
                            // enableTracing();
                            // Tracer.enableLiveLogging(SymbolTraceWriter);
                            const actual = sut.compile(input, container, null);
                            // console.log('\n'+stringifyTemplateDefinition(actual, 0));
                            // disableTracing();
                            try {
                                verifyBindingInstructionsEqual(actual, output);
                            }
                            catch (err) {
                                // console.log('EXPECTED: ', JSON.stringify(output.instructions[0][0], null, 2));
                                // console.log('ACTUAL: ', JSON.stringify(actual.instructions[0][0], null, 2));
                                throw err;
                            }
                        }
                    });
                }
            });
        });
        describe('TemplateCompiler - combinations -- nested template controllers (one per element)', function () {
            const Foo = CustomAttribute.define({ name: 'foo', isTemplateController: true }, class Foo {
            });
            const Bar = CustomAttribute.define({ name: 'bar', isTemplateController: true }, class Bar {
            });
            const Baz = CustomAttribute.define({ name: 'baz', isTemplateController: true }, class Baz {
            });
            const Qux = CustomAttribute.define({ name: 'qux', isTemplateController: true }, class Qux {
            });
            eachCartesianJoinFactory([
                [
                    () => {
                        const ctx = TestContext.create();
                        ctx.container.register(Foo, Bar, Baz, Qux);
                        return ctx;
                    }
                ],
                [() => true, () => false],
                [
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'foo', 'foo', '', 'div', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'div', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'if.bind', 'if', 'show', 'div', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'if.bind', 'if', 'show', 'template', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'template', false)
                ],
                [
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'foo', 'foo', '', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'if.bind', 'if', 'show', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'else', 'else', '', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'else', 'else', '', 'template', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'with.bind', 'with', 'foo', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'with.bind', 'with', 'foo', 'template', false, output.instructions[0][0], input.template)
                ],
                [
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'foo', 'foo', '', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'template', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'template', false, output.instructions[0][0], input.template)
                ],
                [
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'bar', 'bar', '', 'div', true, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'bar', 'bar', 'baz', 'div', true, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'bar', 'bar', 'baz', 'template', true, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', true, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'template', true, output.instructions[0][0], input.template)
                ]
            ], (ctx, resolveRes, $1, $2, $3, [input, output]) => {
                it(`[Resolve res: ${resolveRes}] ${input.template}`, function () {
                    const { sut, container } = createFixture(ctx, CustomAttribute.define({ name: 'foo', isTemplateController: true }, class Foo {
                    }), CustomAttribute.define({ name: 'bar', isTemplateController: true }, class Bar {
                    }), CustomAttribute.define({ name: 'baz', isTemplateController: true }, class Baz {
                    }), CustomAttribute.define({ name: 'qux', isTemplateController: true }, class Qux {
                    }));
                    sut.resolveResources = resolveRes;
                    const actual = sut.compile(input, container, null);
                    try {
                        verifyBindingInstructionsEqual(actual, output);
                    }
                    catch (err) {
                        // console.log('EXPECTED: ', JSON.stringify(output.instructions[0][0], null, 2));
                        // console.log('ACTUAL: ', JSON.stringify(actual.instructions[0][0], null, 2));
                        throw err;
                    }
                });
            });
        });
        describe('TemplateCompiler - combinations -- nested template controllers (multiple per element)', function () {
            const Foo = CustomAttribute.define({ name: 'foo', isTemplateController: true }, class Foo {
            });
            const Bar = CustomAttribute.define({ name: 'bar', isTemplateController: true }, class Bar {
            });
            const Baz = CustomAttribute.define({ name: 'baz', isTemplateController: true }, class Baz {
            });
            const Qux = CustomAttribute.define({ name: 'qux', isTemplateController: true }, class Qux {
            });
            const Quux = CustomAttribute.define({ name: 'quux', isTemplateController: true }, class Quux {
            });
            eachCartesianJoinFactory([
                [
                    () => {
                        const ctx = TestContext.create();
                        ctx.container.register(Foo, Bar, Baz, Qux, Quux);
                        return ctx;
                    }
                ],
                [() => true, () => false],
                [
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'foo', 'foo', '', 'div', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'div', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'if.bind', 'if', 'show', 'div', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'if.bind', 'if', 'show', 'template', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', false),
                    (ctx, resolveRes) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'template', false)
                ],
                [
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'bar', 'bar', '', null, false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'else', 'else', '', null, false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, [input, output]) => createTemplateController(ctx, resolveRes, 'with.bind', 'with', 'foo', null, false, output.instructions[0][0], input.template)
                ],
                [
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'foo', 'foo', '', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'template', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'baz', 'baz', '', null, false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, [input, output]) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'template', false, output.instructions[0][0], input.template)
                ],
                [
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'qux', 'qux', '', null, false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'if.bind', 'if', '', 'template', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'if.bind', 'if', '', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', false, output.instructions[0][0], input.template),
                    (ctx, resolveRes, $1, $2, [input, output]) => createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'template', false, output.instructions[0][0], input.template)
                ],
                [
                    (ctx, resolveRes, $1, $2, $3, [input, output]) => createTemplateController(ctx, resolveRes, 'quux', 'quux', '', null, true, output.instructions[0][0], input.template)
                ]
            ], (ctx, resolveRes, $1, $2, $3, $4, [input, output]) => {
                it(`[Resolve res: ${resolveRes}] ${input.template}`, function () {
                    const { sut, container } = createFixture(ctx);
                    sut.resolveResources = resolveRes;
                    const actual = sut.compile(input, container, null);
                    try {
                        verifyBindingInstructionsEqual(actual, output);
                    }
                    catch (err) {
                        // console.log('EXPECTED: ', JSON.stringify(output.instructions[0][0], null, 2));
                        // console.log('ACTUAL: ', JSON.stringify(actual.instructions[0][0], null, 2));
                        throw err;
                    }
                });
            });
        });
        describe('TemplateCompiler - combinations -- sibling template controllers', function () {
            const Foo = CustomAttribute.define({ name: 'foo', isTemplateController: true }, class Foo {
            });
            const Bar = CustomAttribute.define({ name: 'bar', isTemplateController: true }, class Bar {
            });
            const Baz = CustomAttribute.define({ name: 'baz', isTemplateController: true }, class Baz {
            });
            for (const [otherAttrPosition, appTemplate] of [
                ['before', '<div a.bind="b" foo bar>'],
                ['middle', '<div foo a.bind="b" bar>'],
                ['after', '<div foo bar a.bind="b">'],
            ]) {
                it(`compiles 2 template controller on an elements with another attribute in ${otherAttrPosition}`, function () {
                    const { createProp, result: { template, instructions } } = compileWith(appTemplate, Foo, Bar);
                    const [[{ res: fooDef, def: { template: fooTemplate, instructions: fooInnerInstructions } }]] = instructions;
                    const [[{ res: barDef, def: { template: barTemplate, instructions: barInnerInstructions } }]] = fooInnerInstructions;
                    assertTemplateHtml(template, '<!--au*--><!--au-start--><!--au-end-->');
                    assert.strictEqual(fooDef.Type, Foo);
                    assertTemplateHtml(fooTemplate, '<!--au*--><!--au-start--><!--au-end-->');
                    assert.strictEqual(barDef.Type, Bar);
                    assertTemplateHtml(barTemplate, '<!--au*--><div></div>');
                    verifyBindingInstructionsEqual(barInnerInstructions[0], [createProp({ from: 'b', to: 'a' })]);
                });
            }
            eachCartesianJoinFactory([
                [
                    () => {
                        const ctx = TestContext.create();
                        ctx.container.register(Foo, Bar, Baz);
                        return ctx;
                    }
                ],
                [() => true, () => false],
                [
                    (_ctx, _resolveRes) => []
                ],
                [
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'foo', 'foo', '', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'foo', 'foo', '', 'template', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'if.bind', 'if', 'show', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', false)); },
                ],
                [
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'foo', 'foo', '', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'if.bind', 'if', 'show', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'if.bind', 'if', 'show', 'template', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'else', 'else', '', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'template', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'with.bind', 'with', 'bar', 'div', false)); }
                ],
                [
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'foo', 'foo', '', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'foo', 'foo', 'bar', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'div', false)); },
                    (ctx, resolveRes, results) => { results.push(createTemplateController(ctx, resolveRes, 'repeat.for', 'repeat', 'item of items', 'template', false)); }
                ]
            ], (ctx, resolveRes, [[input1, output1], [input2, output2], [input3, output3]]) => {
                const input = {
                    template: `<div>${input1.template}${input2.template}${input3.template}</div>`,
                    instructions: []
                };
                it(`[Resolve res: ${resolveRes}] ${input.template}`, function () {
                    const { sut, container } = createFixture(ctx);
                    sut.resolveResources = resolveRes;
                    const getOuterHtml = (node) => {
                        return typeof node === 'string'
                            ? node
                            : /au-m/i.test(node.nodeName)
                                ? `<!--au-start--><!--au-end-->${node.outerHTML}`
                                : node.outerHTML;
                    };
                    const output = {
                        ...defaultCustomElementDefinitionProperties,
                        template: ctx.createElementFromMarkup(`<template><div>${getOuterHtml(output1.template)}${getOuterHtml(output2.template)}${getOuterHtml(output3.template)}</div></template>`),
                        instructions: [output1.instructions[0], output2.instructions[0], output3.instructions[0]],
                        needsCompile: false,
                        enhance: false,
                        capture: false,
                        watches: [],
                        processContent: null,
                    };
                    // enableTracing();
                    // Tracer.enableLiveLogging(SymbolTraceWriter);
                    const actual = sut.compile(input, container, null);
                    // console.log('\n'+stringifyTemplateDefinition(actual, 0));
                    // disableTracing();
                    try {
                        verifyBindingInstructionsEqual(actual, output);
                    }
                    catch (err) {
                        // console.log('EXPECTED: ', JSON.stringify(output.instructions, null, 2));
                        // console.log('ACTUAL: ', JSON.stringify(actual.instructions, null, 2));
                        throw err;
                    }
                });
            });
            function compileWith(markup, ...extraResources) {
                const ctx = TestContext.create();
                const container = ctx.container;
                const sut = createCompilerWrapper(ctx.templateCompiler);
                container.register(...extraResources);
                const templateDefinition = {
                    template: markup,
                    instructions: [],
                    surrogates: [],
                    shadowOptions: { mode: 'open' }
                };
                const parser = container.get(IExpressionParser);
                return {
                    result: sut.compile(templateDefinition, container, null),
                    parser,
                    createProp: ({ from, to, mode = BindingMode.toView }) => new PropertyBindingInstruction(parser.parse(from, 'IsProperty'), to, mode)
                };
            }
        });
        describe('TemplateCompiler - combinations -- attributes on custom elements', function () {
            eachCartesianJoinFactory([
                [
                    TestContext.create
                ],
                [
                    (_ctx) => 'foo',
                    (_ctx) => 'bar42'
                ],
                [
                    (ctx, pdName) => pdName,
                    (ctx, pdName) => `${pdName}Bar` // descriptor.property is different from the actual property name
                ],
                [
                    (ctx, pdName, pdProp) => kebabCase(pdProp),
                    (ctx, pdName, pdProp) => `${kebabCase(pdProp)}-baz` // descriptor.attribute is different from kebab-cased descriptor.property
                ],
                [
                    (ctx, pdName, pdProp, pdAttr) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: pdAttr, mode: BindingMode.default }) }),
                    (ctx, pdName, pdProp, pdAttr) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: pdAttr, mode: BindingMode.oneTime }) }),
                    (ctx, pdName, pdProp, pdAttr) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: pdAttr, mode: BindingMode.toView }) }),
                    (ctx, pdName, pdProp, pdAttr) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: pdAttr, mode: BindingMode.fromView }) }),
                    (ctx, pdName, pdProp, pdAttr) => ({ [pdName]: BindableDefinition.create(pdName, { name: pdProp, attribute: pdAttr, mode: BindingMode.twoWay }) })
                ],
                [
                    (_ctx) => [``, `''`],
                    (_ctx) => [``, `\${a}`],
                    (_ctx) => [`.bind`, `''`],
                    (_ctx) => [`.one-time`, `''`],
                    (_ctx) => [`.to-view`, `''`],
                    (_ctx) => [`.from-view`, `''`],
                    (_ctx) => [`.two-way`, `''`],
                ],
                [
                    (ctx, pdName, pdProp, pdAttr, bindables, [cmd]) => [bindables[pdName], `${pdAttr}${cmd}`],
                    // (ctx, pdName, pdProp, pdAttr, bindables, [cmd]) => [bindables[pdName], `${pdAttr}.qux${cmd}`],
                    (ctx, pdName, pdProp, pdAttr, bindables, [cmd]) => [null, `${pdAttr}-qux${cmd}`]
                ],
                [
                    (_ctx) => `''`
                ]
            ], (ctx, pdName, pdProp, pdAttr, bindables, [cmd, attrValue], [bindableDescription, attrName]) => {
                for (const resolveResources of [true, false]) {
                    for (const debugMode of [true, false]) {
                        it(`[Resolve resources: ${resolveResources}] [Debug: ${debugMode}] customElement - pdName=${pdName}  pdProp=${pdProp}  pdAttr=${pdAttr}  cmd=${cmd}  attrName=${attrName}  attrValue="${attrValue}"`, function () {
                            const FooBar = CustomElement.define({ name: 'foobar', bindables }, class FooBar {
                            });
                            const { sut, container } = createFixture(ctx, FooBar);
                            sut.resolveResources = resolveResources;
                            sut.debug = debugMode;
                            const instruction = createAttributeInstruction(bindableDescription, attrName, attrValue, false);
                            const instructions = instruction == null ? [] : [instruction];
                            const childInstructions = !!bindableDescription ? instructions : [];
                            const siblingInstructions = !bindableDescription ? instructions : [];
                            const [input, output] = createCustomElement(ctx, resolveResources ? CustomElement.getDefinition(FooBar) : 'foobar', true, [[attrName, attrValue]], childInstructions, siblingInstructions, [], void 0, void 0, debugMode);
                            if (attrName.endsWith('.qux')) {
                                let e;
                                try {
                                    sut.compile(input, container, null);
                                }
                                catch (err) {
                                    // console.log('EXPECTED: ', JSON.stringify(output.instructions[0][0], null, 2));
                                    // console.log('ACTUAL: ', JSON.stringify(actual.instructions[0][0], null, 2));
                                    e = err;
                                }
                                assert.instanceOf(e, Error);
                            }
                            else {
                                // enableTracing();
                                // Tracer.enableLiveLogging(SymbolTraceWriter);
                                const actual = sut.compile(input, container, null);
                                // console.log('\n'+stringifyTemplateDefinition(actual, 0));
                                // disableTracing();
                                try {
                                    verifyBindingInstructionsEqual(actual, output);
                                }
                                catch (err) {
                                    // console.log('EXPECTED: ', JSON.stringify(output.instructions[0][0], null, 2));
                                    // console.log('ACTUAL: ', JSON.stringify(actual.instructions[0][0], null, 2));
                                    throw err;
                                }
                            }
                        });
                    }
                }
            });
        });
        describe('TemplateCompiler - combinations -- custom elements', function () {
            const Foo = CustomElement.define({ name: 'foo' }, class Foo {
            });
            const Bar = CustomElement.define({ name: 'bar' }, class Bar {
            });
            const Baz = CustomElement.define({ name: 'baz' }, class Baz {
            });
            const FooDef = CustomElement.getDefinition(Foo);
            const BarDef = CustomElement.getDefinition(Bar);
            const BazDef = CustomElement.getDefinition(Baz);
            function prepareElements(ctx) {
                ctx.container.register(Foo, Bar, Baz);
                return ctx;
            }
            eachCartesianJoinFactory([
                [
                    () => prepareElements(TestContext.create())
                ],
                [
                    (_ctx) => true,
                    (_ctx) => false,
                ],
                [
                    (ctx, resolveResources) => createCustomElement(ctx, resolveResources ? FooDef : `foo`, true, [], [], [], []),
                    (ctx, resolveResources) => createCustomElement(ctx, resolveResources ? BarDef : `bar`, true, [], [], [], []),
                    (ctx, resolveResources) => createCustomElement(ctx, resolveResources ? BazDef : `baz`, true, [], [], [], [])
                ]
                // <(($1: CTCResult) => CTCResult)[]>[
                //   ([input, output]) => createCustomElement(`foo`, false, [], [], [], output.instructions, output, input),
                //   ([input, output]) => createCustomElement(`bar`, false, [], [], [], output.instructions, output, input),
                //   ([input, output]) => createCustomElement(`baz`, false, [], [], [], output.instructions, output, input)
                // ],
                // <(($1: CTCResult, $2: CTCResult) => CTCResult)[]>[
                //   ($1, [input, output]) => createCustomElement(`foo`, true, [], [], [], output.instructions, output, input),
                //   ($1, [input, output]) => createCustomElement(`bar`, true, [], [], [], output.instructions, output, input),
                //   ($1, [input, output]) => createCustomElement(`baz`, true, [], [], [], output.instructions, output, input)
                // ]
                // ], ($1, $2, [input, output]) => {
            ], (ctx, resolveRes, [input, output]) => {
                it(`[Resolve res: ${resolveRes}] ${input.template}`, function () {
                    const { sut, container } = createFixture(ctx);
                    sut.resolveResources = resolveRes;
                    // enableTracing();
                    // Tracer.enableLiveLogging(SymbolTraceWriter);
                    const actual = sut.compile(input, container, null);
                    // console.log('\n'+stringifyTemplateDefinition(actual, 0));
                    // disableTracing();
                    try {
                        verifyBindingInstructionsEqual(actual, output);
                    }
                    catch (err) {
                        console.log('EXPECTED: ', JSON.stringify(output.instructions, null, 2));
                        console.log('ACTUAL: ', JSON.stringify(actual.instructions, null, 2));
                        throw err;
                    }
                });
            });
        });
        describe('TemplateCompiler - combinations -- captures & ...$attrs', function () {
            const MyElement = CustomElement.define({
                name: 'my-element',
                capture: true,
                bindables: ['prop1']
            });
            const MyAttr = CustomAttribute.define({
                name: 'my-attr',
                bindables: ['value']
            }, class MyAttr {
            });
            it('captures normal attributes', function () {
                const { sut, container } = createFixture(TestContext.create(), MyElement);
                const definition = sut.compile({
                    name: 'rando',
                    template: '<my-element value.bind="value">',
                }, container, { projections: null });
                assert.deepStrictEqual(definition.instructions[0][0].captures, [new AttrSyntax('value.bind', 'value', 'value', 'bind')]);
            });
            it('does not capture bindable', function () {
                const { sut, container } = createFixture(TestContext.create(), MyElement);
                const definition = sut.compile({
                    name: 'rando',
                    template: '<my-element prop1.bind="value">',
                }, container, { projections: null });
                assert.deepStrictEqual(definition.instructions[0][0].captures, []);
            });
            it('captures bindable-like on ignore-attr command', function () {
                const { sut, container } = createFixture(TestContext.create(), MyElement);
                const definition = sut.compile({
                    name: 'rando',
                    template: '<my-element prop1.trigger="value()">',
                }, container, { projections: null });
                assert.deepStrictEqual(definition.instructions[0][0].captures, [new AttrSyntax('prop1.trigger', 'value()', 'prop1', 'trigger')]);
            });
            it('captures custom attribute', function () {
                const { sut, container } = createFixture(TestContext.create(), MyElement, MyAttr);
                const definition = sut.compile({
                    name: 'rando',
                    template: '<my-element my-attr.bind="myAttrValue">',
                }, container, { projections: null });
                assert.deepStrictEqual(definition.instructions[0][0].captures, [new AttrSyntax('my-attr.bind', 'myAttrValue', 'my-attr', 'bind')]);
            });
            it('captures ...$attrs command', function () {
                const { sut, container } = createFixture(TestContext.create(), MyElement, MyAttr);
                const definition = sut.compile({
                    name: 'rando',
                    template: '<my-element ...$attrs>',
                }, container, { projections: null });
                assert.deepStrictEqual(definition.instructions[0][0].captures, [new AttrSyntax('...$attrs', '', '', '...$attrs')]);
            });
            it('does not capture template controller', function () {
                const { sut, container } = createFixture(TestContext.create(), MyElement, If);
                const definition = sut.compile({
                    name: 'rando',
                    template: '<my-element if.bind>',
                }, container, { projections: null });
                assert.deepStrictEqual(definition.instructions[0][0].def.instructions[0][0].captures, []);
            });
        });
        describe('TemplateCompiler - combinations -- with attribute patterns', function () {
            // all tests are using pattern that is `my-attr`
            // and the template will have an element with an attribute `my-attr`
            const createPattern = (createSyntax) => {
                let MyAttrPattern = (() => {
                    let _classDecorators = [attributePattern({ pattern: 'my-attr', symbols: '' })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    var MyAttrPattern = _classThis = class {
                        'my-attr'(rawName, rawValue, parts) {
                            return createSyntax(rawName, rawValue, parts);
                        }
                    };
                    __setFunctionName(_classThis, "MyAttrPattern");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        MyAttrPattern = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return MyAttrPattern = _classThis;
                })();
                return MyAttrPattern;
            };
            const compileWithPattern = (Pattern, extras = []) => {
                const { sut, container } = createFixture(TestContext.create(), Pattern, ...extras);
                const definition = sut.compile({
                    name: 'rando',
                    template: '<div my-attr>',
                }, container, { projections: null });
                return { sut, container, definition };
            };
            it('works with pattern returning command', function () {
                const MyPattern = createPattern((name, val, _parts) => new AttrSyntax(name, val, 'id', 'bind'));
                const { definition } = compileWithPattern(MyPattern);
                assert.deepStrictEqual(definition.instructions[0], [new PropertyBindingInstruction(new PrimitiveLiteralExpression(''), 'id', BindingMode.toView)]);
            });
            it('works when pattern returning interpolation', function () {
                const MyPattern = createPattern((name, _val, _parts) => new AttrSyntax(name, `\${a}a`, 'id', null));
                const { definition } = compileWithPattern(MyPattern);
                assert.deepStrictEqual(definition.instructions[0], [new InterpolationInstruction(new Interpolation(['', 'a'], [new AccessScopeExpression('a')]), 'id')]);
            });
            it('ignores when pattern DOES NOT return command or interpolation', function () {
                const MyPattern = createPattern((name, val, _parts) => new AttrSyntax(name, val, 'id', null));
                const { definition } = compileWithPattern(MyPattern);
                assert.deepStrictEqual(definition.instructions[0], undefined);
                assert.deepStrictEqual(definition.template.content.querySelector('div').className, '');
            });
            it('lets pattern control the binding value', function () {
                const MyPattern = createPattern((name, _val, _parts) => new AttrSyntax(name, 'bb', 'id', 'bind'));
                const { definition } = compileWithPattern(MyPattern);
                assert.deepStrictEqual(definition.instructions[0], 
                // default value is '' attr pattern changed it to 'bb'
                [new PropertyBindingInstruction(new AccessScopeExpression('bb'), 'id', BindingMode.toView)]);
            });
            it('works with pattern returning custom attribute + command', function () {
                let MyAttr = (() => {
                    let _classDecorators = [customAttribute({
                            name: 'my-attr'
                        })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    var MyAttr = _classThis = class {
                    };
                    __setFunctionName(_classThis, "MyAttr");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        MyAttr = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return MyAttr = _classThis;
                })();
                const MyPattern = createPattern((name, _val, _parts) => new AttrSyntax(name, 'bb', 'my-attr', 'bind'));
                const { definition } = compileWithPattern(MyPattern, [MyAttr]);
                assert.deepStrictEqual(definition.instructions[0], [new HydrateAttributeInstruction(CustomAttribute.getDefinition(MyAttr), undefined, [
                        new PropertyBindingInstruction(new AccessScopeExpression('bb'), 'value', BindingMode.toView)
                    ])]);
            });
            it('works with pattern returning custom attribute + multi bindings', function () {
                let MyAttr = (() => {
                    let _classDecorators = [customAttribute({
                            name: 'my-attr'
                        })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    var MyAttr = _classThis = class {
                    };
                    __setFunctionName(_classThis, "MyAttr");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        MyAttr = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return MyAttr = _classThis;
                })();
                const MyPattern = createPattern((name, _val, _parts) => new AttrSyntax(name, 'value.bind: bb', 'my-attr', null));
                const { definition } = compileWithPattern(MyPattern, [MyAttr]);
                assert.deepStrictEqual(definition.instructions[0], [new HydrateAttributeInstruction(CustomAttribute.getDefinition(MyAttr), undefined, [
                        new PropertyBindingInstruction(new AccessScopeExpression('bb'), 'value', BindingMode.toView)
                    ])]);
            });
            it('works with pattern returning custom attribute + interpolation', function () {
                let MyAttr = (() => {
                    let _classDecorators = [customAttribute({
                            name: 'my-attr'
                        })];
                    let _classDescriptor;
                    let _classExtraInitializers = [];
                    let _classThis;
                    var MyAttr = _classThis = class {
                    };
                    __setFunctionName(_classThis, "MyAttr");
                    (() => {
                        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                        MyAttr = _classThis = _classDescriptor.value;
                        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                        __runInitializers(_classThis, _classExtraInitializers);
                    })();
                    return MyAttr = _classThis;
                })();
                const MyPattern = createPattern((name, _val, _parts) => new AttrSyntax(name, `\${bb}`, 'my-attr', null));
                const { definition } = compileWithPattern(MyPattern, [MyAttr]);
                assert.deepStrictEqual(definition.instructions[0], [new HydrateAttributeInstruction(CustomAttribute.getDefinition(MyAttr), undefined, [
                        new InterpolationInstruction(new Interpolation(['', ''], [new AccessScopeExpression('bb')]), 'value')
                    ])]);
            });
        });
    });
    class BindablesInfo {
        static from(def, isAttr) {
            const bindables = def.bindables;
            const attrs = {};
            const defaultBindingMode = isAttr
                ? def.defaultBindingMode === void 0
                    ? BindingMode.default
                    : def.defaultBindingMode
                : BindingMode.default;
            let bindable;
            let prop;
            let hasPrimary = false;
            let primary;
            let attr;
            // from all bindables, pick the first primary bindable
            // if there is no primary, pick the first bindable
            // if there's no bindables, create a new primary with property value
            for (prop in bindables) {
                bindable = bindables[prop];
                attr = bindable.attribute;
                if (bindable.primary === true) {
                    if (hasPrimary) {
                        throw new Error(`Primary already exists on ${def.name}`);
                    }
                    hasPrimary = true;
                    primary = bindable;
                }
                else if (!hasPrimary && primary == null) {
                    primary = bindable;
                }
                attrs[attr] = BindableDefinition.create(prop, bindable);
            }
            if (bindable == null && isAttr) {
                // if no bindables are present, default to "value"
                primary = attrs.value = BindableDefinition.create('value', { mode: defaultBindingMode });
            }
            return new BindablesInfo(attrs, bindables, primary);
        }
        constructor(attrs, bindables, primary) {
            this.attrs = attrs;
            this.bindables = bindables;
            this.primary = primary;
        }
    }
    function assertTemplateHtml(template, expected) {
        assert.strictEqual(typeof template === 'string'
            ? template
            : template.innerHTML, expected);
    }
    function createCompilerWrapper(compiler) {
        return {
            get resolveResources() { return compiler.resolveResources; },
            set resolveResources(value) { compiler.resolveResources = value; },
            get debug() { return compiler.debug; },
            set debug(value) { compiler.debug = value; },
            compile(definition, container, instruction) {
                return compiler.compile(CustomElementDefinition.create(definition), container, instruction);
            },
            compileSpread(...args) {
                // eslint-disable-next-line prefer-spread
                return compiler.compileSpread.apply(compiler, args);
            }
        };
    }
});
//# sourceMappingURL=template-compiler.spec.js.map