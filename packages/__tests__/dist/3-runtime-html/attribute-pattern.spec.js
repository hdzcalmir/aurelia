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
import { DI } from '@aurelia/kernel';
import { attributePattern, IAttributePattern, ISyntaxInterpreter, AttributePattern } from '@aurelia/template-compiler';
import { assert } from '@aurelia/testing';
describe('3-runtime-html/attribute-pattern.spec.ts', function () {
    for (const [defs, tests] of [
        [
            [
                { pattern: 'PART.PART', symbols: '.' }
            ],
            [
                ['value.bind', 'PART.PART', ['value', 'bind']],
                ['.bind', null, []],
                ['bind', null, []],
                ['value.', null, []],
                ['value', null, []],
                ['.', null, []]
            ]
        ],
        [
            [
                { pattern: 'PART.PART', symbols: '.' },
                { pattern: 'asdf.PART', symbols: '.' },
                { pattern: 'PART.asdf', symbols: '.' }
            ],
            [
                ['value.bind', 'PART.PART', ['value', 'bind']],
                ['.bind', null, []],
                ['bind', null, []],
                ['value.', null, []],
                ['value', null, []],
                ['.', null, []]
            ]
        ],
        [
            [
                { pattern: 'PART.PART', symbols: '.' },
                { pattern: ':PART', symbols: ':' }
            ],
            [
                ['value.bind', 'PART.PART', ['value', 'bind']],
                [':.:', 'PART.PART', [':', ':']],
                [':value.bind', 'PART.PART', [':value', 'bind']],
                ['value.bind:', 'PART.PART', ['value', 'bind:']],
                [':value', ':PART', ['value']],
                [':.', ':PART', ['.']],
                [':value.', ':PART', ['value.']],
                ['.bind', null, []],
                ['bind', null, []],
                ['value.', null, []],
                ['value', null, []],
                ['value:', null, []],
                ['.', null, []],
                [':', null, []],
                ['::', null, []],
                ['..', null, []],
                ['.:', null, []],
                ['.value:', null, []],
                ['value:bind', null, []]
            ]
        ],
        [
            [
                { pattern: 'PART.PART', symbols: '.' },
                { pattern: '@PART', symbols: '@' }
            ],
            [
                ['value.bind', 'PART.PART', ['value', 'bind']],
                ['@.@', 'PART.PART', ['@', '@']],
                ['@value.bind', 'PART.PART', ['@value', 'bind']],
                ['value.bind@', 'PART.PART', ['value', 'bind@']],
                ['@value', '@PART', ['value']],
                ['@.', '@PART', ['.']],
                ['@value.', '@PART', ['value.']],
                ['.bind', null, []],
                ['bind', null, []],
                ['value.', null, []],
                ['value', null, []],
                ['value@', null, []],
                ['.', null, []],
                ['@', null, []],
                ['@@', null, []],
                ['..', null, []],
                ['.@', null, []],
                ['.value@', null, []],
                ['value@bind', null, []]
            ]
        ],
        [
            [
                { pattern: 'PART.PART', symbols: '.' },
                { pattern: '@PART', symbols: '@' },
                { pattern: ':PART', symbols: ':' }
            ],
            [
                ['value.bind', 'PART.PART', ['value', 'bind']],
                [':value', ':PART', ['value']],
                ['@value', '@PART', ['value']],
                [':.:', 'PART.PART', [':', ':']],
                ['@.@', 'PART.PART', ['@', '@']],
                [':value.bind', 'PART.PART', [':value', 'bind']],
                ['@value.bind', 'PART.PART', ['@value', 'bind']],
                ['@:value.bind', 'PART.PART', ['@:value', 'bind']],
                [':@value.bind', 'PART.PART', [':@value', 'bind']],
                ['@:value', '@PART', [':value']],
                [':@value', ':PART', ['@value']],
                ['value.bind:', 'PART.PART', ['value', 'bind:']],
                ['value.bind@', 'PART.PART', ['value', 'bind@']],
                [':value', ':PART', ['value']],
                ['@value', '@PART', ['value']],
                [':.', ':PART', ['.']],
                ['@.', '@PART', ['.']],
                [':value.', ':PART', ['value.']],
                ['@value.', '@PART', ['value.']],
                ['.bind', null, []],
                ['bind', null, []],
                ['value.', null, []],
                ['value', null, []],
                ['value:', null, []],
                ['value@', null, []],
                ['.', null, []],
                ['..', null, []],
                [':', null, []],
                ['@', null, []],
                ['::', null, []],
                ['@@', null, []],
                ['.:', null, []],
                ['.@', null, []],
                ['.value:', null, []],
                ['.value@', null, []],
                ['value:bind', null, []],
                ['value@bind', null, []]
            ]
        ],
        // overlapping characters for promise + i18n combo
        // then before t to make sure it still terminates at the correct position
        [
            [
                { pattern: "promise.resolve", symbols: '' },
                { pattern: "then", symbols: '' },
                { pattern: "catch", symbols: '' },
                { pattern: "ref", symbols: '' },
                { pattern: "PART.ref", symbols: '.' },
                { pattern: "PART.PART", symbols: '.' },
                { pattern: "PART.PART.PART", symbols: '.' },
                { pattern: 't.PART', symbols: '.' },
                { pattern: 'PART.t', symbols: '.' },
                { pattern: "t", symbols: '' },
                { pattern: "t.bind", symbols: '' },
                { pattern: "t-params.bind", symbols: '' },
            ],
            [
                ['t', 't', ['t']],
                ['tt.bind', 'PART.PART', ['tt', 'bind']],
                ['t.bind', 't.PART', ['t', 'bind']],
                ['then', 'then', ['then']],
                ['t-params.bind', 't-params.bind', ['t-params.bind']],
            ],
        ],
        [
            [
                { pattern: 'then', symbols: '' },
                { pattern: 'the', symbols: '' },
                { pattern: 'th', symbols: '' },
                { pattern: 't', symbols: '' },
                { pattern: 't.PART', symbols: '.' },
            ],
            [
                ['tt', null, []],
                ['t', 't', ['t']],
                ['th', 'th', ['th']],
                ['the', 'the', ['the']],
                ['then', 'then', ['then']],
            ],
        ],
        [
            [
                { pattern: 'then', symbols: '' },
                { pattern: 'the', symbols: '' },
                { pattern: 'th', symbols: '' },
                { pattern: 't', symbols: '' },
                { pattern: 't.PART', symbols: '.' },
            ],
            [
                ['then', 'then', ['then']],
                ['the', 'the', ['the']],
                ['th', 'th', ['th']],
                ['t', 't', ['t']],
                ['tt', null, []],
            ],
        ],
        [
            [
                { pattern: 't', symbols: '' },
                { pattern: 'th', symbols: '' },
                { pattern: 'the', symbols: '' },
                { pattern: 'then', symbols: '' },
                { pattern: 't.PART', symbols: '.' },
            ],
            [
                ['then', 'then', ['then']],
                ['the', 'the', ['the']],
                ['th', 'th', ['th']],
                ['t', 't', ['t']],
                ['tt', null, []],
            ],
        ],
        [
            [
                { pattern: 't', symbols: '' },
                { pattern: 'th', symbols: '' },
                { pattern: 'the', symbols: '' },
                { pattern: 'then', symbols: '' },
                { pattern: 't.PART', symbols: '.' },
            ],
            [
                ['t', 't', ['t']],
                ['th', 'th', ['th']],
                ['the', 'the', ['the']],
                ['then', 'then', ['then']],
                ['tt', null, []],
            ],
        ],
    ]) {
        describe(`[UNIT] parse [${defs.map(d => d.pattern)}]`, function () {
            for (const [value, match, parts] of tests) {
                it(`parse [${defs.map(d => d.pattern)}] -> interpret [${value}] -> match=[${match}]`, function () {
                    let receivedRawName;
                    let receivedRawValue;
                    let receivedParts;
                    // disabling ts error since we are ensuring that the class has all the pattern methods
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    let ThePattern = (() => {
                        let _classDecorators = [attributePattern(...defs)];
                        let _classDescriptor;
                        let _classExtraInitializers = [];
                        let _classThis;
                        var ThePattern = _classThis = class {
                        };
                        __setFunctionName(_classThis, "ThePattern");
                        (() => {
                            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                            ThePattern = _classThis = _classDescriptor.value;
                            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                            __runInitializers(_classThis, _classExtraInitializers);
                        })();
                        return ThePattern = _classThis;
                    })();
                    for (const { pattern } of defs) {
                        ThePattern.prototype[pattern] = (rawName, rawValue, parts) => {
                            receivedRawName = rawName;
                            receivedRawValue = rawValue;
                            receivedParts = parts;
                        };
                    }
                    const container = DI.createContainer();
                    container.register(ThePattern);
                    const interpreter = container.get(ISyntaxInterpreter);
                    const attrPattern = container.get(IAttributePattern);
                    const patternDefs = AttributePattern.getPatternDefinitions(attrPattern.constructor);
                    interpreter.add(patternDefs);
                    const result = interpreter.interpret(value);
                    if (match != null) {
                        assert.strictEqual(result.pattern, match);
                        assert.strictEqual(patternDefs.map(d => d.pattern).includes(result.pattern), true, `patternDefs.map(d => d.pattern).indexOf(result.pattern) >= 0\n  result: ${result.pattern}`);
                        attrPattern[result.pattern](value, 'foo', result.parts);
                        assert.strictEqual(receivedRawName, value, `receivedRawName`);
                        assert.strictEqual(receivedRawValue, 'foo', `receivedRawValue`);
                        assert.deepStrictEqual(receivedParts, result.parts, `receivedParts`);
                    }
                    else {
                        assert.strictEqual(!patternDefs.map(d => d.pattern).includes(result.pattern), true, `patternDefs.map(d => d.pattern).indexOf(result.pattern) === -1`);
                    }
                    assert.deepStrictEqual(result.parts, parts, `result.parts`);
                });
            }
        });
    }
});
//# sourceMappingURL=attribute-pattern.spec.js.map