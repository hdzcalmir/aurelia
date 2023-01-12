'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var metadata = require('@aurelia/metadata');
var runtime = require('@aurelia/runtime');
var platform = require('@aurelia/platform');
var platformBrowser = require('@aurelia/platform-browser');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

const getOwnMetadata = metadata.Metadata.getOwn;
const hasOwnMetadata = metadata.Metadata.hasOwn;
const defineMetadata = metadata.Metadata.define;
const { annotation, resource: resource$1 } = kernel.Protocol;
const getAnnotationKeyFor = annotation.keyFor;
const getResourceKeyFor = resource$1.keyFor;
const appendResourceKey = resource$1.appendTo;
const appendAnnotationKey = annotation.appendTo;
const getAllAnnotations = annotation.getKeys;

const O = Object;
const baseObjectPrototype = O.prototype;
const createLookup = () => O.create(null);
const createError = (message) => new Error(message);
const hasOwnProperty = baseObjectPrototype.hasOwnProperty;
const objectFreeze = O.freeze;
const objectAssign = O.assign;
const getOwnPropertyNames = O.getOwnPropertyNames;
const objectKeys = O.keys;
const IsDataAttribute = createLookup();
const isDataAttribute = (obj, key, svgAnalyzer) => {
    if (IsDataAttribute[key] === true) {
        return true;
    }
    if (!isString(key)) {
        return false;
    }
    const prefix = key.slice(0, 5);
    return IsDataAttribute[key] =
        prefix === 'aria-' ||
            prefix === 'data-' ||
            svgAnalyzer.isStandardSvgAttribute(obj, key);
};
const isPromise = (v) => v instanceof Promise;
const isArray = (v) => v instanceof Array;
const isFunction = (v) => typeof v === 'function';
const isString = (v) => typeof v === 'string';
const defineProp = O.defineProperty;
const rethrow = (err) => { throw err; };
const areEqual = O.is;
const def = Reflect.defineProperty;
const defineHiddenProp = (obj, key, value) => {
    def(obj, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value
    });
    return value;
};

function bindable(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            config.property = $prop;
        }
        defineMetadata(baseName$1, BindableDefinition.create($prop, $target, config), $target.constructor, $prop);
        appendAnnotationKey($target.constructor, Bindable.keyFrom($prop));
    }
    if (arguments.length > 1) {
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    else if (isString(configOrTarget)) {
        config = {};
        return decorator;
    }
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}
function isBindableAnnotation(key) {
    return key.startsWith(baseName$1);
}
const baseName$1 = getAnnotationKeyFor('bindable');
const Bindable = objectFreeze({
    name: baseName$1,
    keyFrom: (name) => `${baseName$1}:${name}`,
    from(type, ...bindableLists) {
        const bindables = {};
        const isArray = Array.isArray;
        function addName(name) {
            bindables[name] = BindableDefinition.create(name, type);
        }
        function addDescription(name, def) {
            bindables[name] = def instanceof BindableDefinition ? def : BindableDefinition.create(name, type, def);
        }
        function addList(maybeList) {
            if (isArray(maybeList)) {
                maybeList.forEach(addName);
            }
            else if (maybeList instanceof BindableDefinition) {
                bindables[maybeList.property] = maybeList;
            }
            else if (maybeList !== void 0) {
                objectKeys(maybeList).forEach(name => addDescription(name, maybeList[name]));
            }
        }
        bindableLists.forEach(addList);
        return bindables;
    },
    for(Type) {
        let def;
        const builder = {
            add(configOrProp) {
                let prop;
                let config;
                if (isString(configOrProp)) {
                    prop = configOrProp;
                    config = { property: prop };
                }
                else {
                    prop = configOrProp.property;
                    config = configOrProp;
                }
                def = BindableDefinition.create(prop, Type, config);
                if (!hasOwnMetadata(baseName$1, Type, prop)) {
                    appendAnnotationKey(Type, Bindable.keyFrom(prop));
                }
                defineMetadata(baseName$1, def, Type, prop);
                return builder;
            },
            mode(mode) {
                def.mode = mode;
                return builder;
            },
            callback(callback) {
                def.callback = callback;
                return builder;
            },
            attribute(attribute) {
                def.attribute = attribute;
                return builder;
            },
            primary() {
                def.primary = true;
                return builder;
            },
            set(setInterpreter) {
                def.set = setInterpreter;
                return builder;
            }
        };
        return builder;
    },
    getAll(Type) {
        const propStart = baseName$1.length + 1;
        const defs = [];
        const prototypeChain = kernel.getPrototypeChain(Type);
        let iProto = prototypeChain.length;
        let iDefs = 0;
        let keys;
        let keysLen;
        let Class;
        let i;
        while (--iProto >= 0) {
            Class = prototypeChain[iProto];
            keys = getAllAnnotations(Class).filter(isBindableAnnotation);
            keysLen = keys.length;
            for (i = 0; i < keysLen; ++i) {
                defs[iDefs++] = getOwnMetadata(baseName$1, Class, keys[i].slice(propStart));
            }
        }
        return defs;
    },
});
class BindableDefinition {
    constructor(attribute, callback, mode, primary, property, set) {
        this.attribute = attribute;
        this.callback = callback;
        this.mode = mode;
        this.primary = primary;
        this.property = property;
        this.set = set;
    }
    static create(prop, target, def = {}) {
        return new BindableDefinition(kernel.firstDefined(def.attribute, kernel.kebabCase(prop)), kernel.firstDefined(def.callback, `${prop}Changed`), kernel.firstDefined(def.mode, 2), kernel.firstDefined(def.primary, false), kernel.firstDefined(def.property, prop), kernel.firstDefined(def.set, getInterceptor(prop, target, def)));
    }
}
function coercer(target, property, _descriptor) {
    Coercer.define(target, property);
}
const Coercer = {
    key: getAnnotationKeyFor('coercer'),
    define(target, property) {
        defineMetadata(Coercer.key, target[property].bind(target), target);
    },
    for(target) {
        return getOwnMetadata(Coercer.key, target);
    }
};
function getInterceptor(prop, target, def = {}) {
    const type = def.type ?? metadata.Metadata.get('design:type', target, prop) ?? null;
    if (type == null) {
        return kernel.noop;
    }
    let coercer;
    switch (type) {
        case Number:
        case Boolean:
        case String:
        case BigInt:
            coercer = type;
            break;
        default: {
            const $coercer = type.coerce;
            coercer = typeof $coercer === 'function'
                ? $coercer.bind(type)
                : (Coercer.for(type) ?? kernel.noop);
            break;
        }
    }
    return coercer === kernel.noop
        ? coercer
        : createCoercer(coercer, def.nullable);
}
function createCoercer(coercer, nullable) {
    return function (value, coercionConfiguration) {
        if (!coercionConfiguration?.enableCoercion)
            return value;
        return ((nullable ?? ((coercionConfiguration?.coerceNullish ?? false) ? false : true)) && value == null)
            ? value
            : coercer(value, coercionConfiguration);
    };
}

class BindableObserver {
    constructor(obj, key, cbName, set, $controller, _coercionConfig) {
        this.set = set;
        this.$controller = $controller;
        this._coercionConfig = _coercionConfig;
        this._value = void 0;
        this._oldValue = void 0;
        const cb = obj[cbName];
        const cbAll = obj.propertyChanged;
        const hasCb = this._hasCb = isFunction(cb);
        const hasCbAll = this._hasCbAll = isFunction(cbAll);
        const hasSetter = this._hasSetter = set !== kernel.noop;
        let val;
        this._obj = obj;
        this._key = key;
        this._cbAll = hasCbAll ? cbAll : kernel.noop;
        this.cb = hasCb ? cb : kernel.noop;
        if (this.cb === void 0 && !hasCbAll && !hasSetter) {
            this._observing = false;
        }
        else {
            this._observing = true;
            val = obj[key];
            this._value = hasSetter && val !== void 0 ? set(val, this._coercionConfig) : val;
            this._createGetterSetter();
        }
    }
    get type() { return 1; }
    getValue() {
        return this._value;
    }
    setValue(newValue) {
        if (this._hasSetter) {
            newValue = this.set(newValue, this._coercionConfig);
        }
        const currentValue = this._value;
        if (this._observing) {
            if (areEqual(newValue, currentValue)) {
                return;
            }
            this._value = newValue;
            this._oldValue = currentValue;
            if (this.$controller == null
                || this.$controller.isBound) {
                if (this._hasCb) {
                    this.cb.call(this._obj, newValue, currentValue);
                }
                if (this._hasCbAll) {
                    this._cbAll.call(this._obj, this._key, newValue, currentValue);
                }
            }
            this.subs.notify(this._value, this._oldValue);
        }
        else {
            this._obj[this._key] = newValue;
        }
    }
    subscribe(subscriber) {
        if (!this._observing === false) {
            this._observing = true;
            this._value = this._hasSetter
                ? this.set(this._obj[this._key], this._coercionConfig)
                : this._obj[this._key];
            this._createGetterSetter();
        }
        this.subs.add(subscriber);
    }
    _createGetterSetter() {
        Reflect.defineProperty(this._obj, this._key, {
            enumerable: true,
            configurable: true,
            get: () => this._value,
            set: (value) => {
                this.setValue(value);
            }
        });
    }
}
runtime.subscriberCollection(BindableObserver);

const resource = function (key) {
    function Resolver(target, property, descriptor) {
        kernel.DI.inject(Resolver)(target, property, descriptor);
    }
    Resolver.$isResolver = true;
    Resolver.resolve = function (handler, requestor) {
        if (requestor.root === requestor) {
            return requestor.get(key);
        }
        return requestor.has(key, false)
            ? requestor.get(key)
            : requestor.root.get(key);
    };
    return Resolver;
};
const allResources = function (key) {
    function Resolver(target, property, descriptor) {
        kernel.DI.inject(Resolver)(target, property, descriptor);
    }
    Resolver.$isResolver = true;
    Resolver.resolve = function (handler, requestor) {
        if (requestor.root === requestor) {
            return requestor.getAll(key, false);
        }
        return requestor.has(key, false)
            ? requestor.getAll(key, false).concat(requestor.root.getAll(key, false))
            : requestor.root.getAll(key, false);
    };
    return Resolver;
};
const createInterface = kernel.DI.createInterface;
const singletonRegistration = kernel.Registration.singleton;
const aliasRegistration = kernel.Registration.aliasTo;
const instanceRegistration = kernel.Registration.instance;
kernel.Registration.callback;
const transientRegistration = kernel.Registration.transient;
const registerResolver = (ctn, key, resolver) => ctn.registerResolver(key, resolver);
function alias(...aliases) {
    return function (target) {
        const key = getAnnotationKeyFor('aliases');
        const existing = getOwnMetadata(key, target);
        if (existing === void 0) {
            defineMetadata(key, aliases, target);
        }
        else {
            existing.push(...aliases);
        }
    };
}
function registerAliases(aliases, resource, key, container) {
    for (let i = 0, ii = aliases.length; i < ii; ++i) {
        kernel.Registration.aliasTo(key, resource.keyFrom(aliases[i])).register(container);
    }
}

class CharSpec {
    constructor(chars, repeat, isSymbol, isInverted) {
        this.chars = chars;
        this.repeat = repeat;
        this.isSymbol = isSymbol;
        this.isInverted = isInverted;
        if (isInverted) {
            switch (chars.length) {
                case 0:
                    this.has = this._hasOfNoneInverse;
                    break;
                case 1:
                    this.has = this._hasOfSingleInverse;
                    break;
                default:
                    this.has = this._hasOfMultipleInverse;
            }
        }
        else {
            switch (chars.length) {
                case 0:
                    this.has = this._hasOfNone;
                    break;
                case 1:
                    this.has = this._hasOfSingle;
                    break;
                default:
                    this.has = this._hasOfMultiple;
            }
        }
    }
    equals(other) {
        return this.chars === other.chars
            && this.repeat === other.repeat
            && this.isSymbol === other.isSymbol
            && this.isInverted === other.isInverted;
    }
    _hasOfMultiple(char) {
        return this.chars.includes(char);
    }
    _hasOfSingle(char) {
        return this.chars === char;
    }
    _hasOfNone(_char) {
        return false;
    }
    _hasOfMultipleInverse(char) {
        return !this.chars.includes(char);
    }
    _hasOfSingleInverse(char) {
        return this.chars !== char;
    }
    _hasOfNoneInverse(_char) {
        return true;
    }
}
class Interpretation {
    constructor() {
        this.parts = kernel.emptyArray;
        this._pattern = '';
        this._currentRecord = {};
        this._partsRecord = {};
    }
    get pattern() {
        const value = this._pattern;
        if (value === '') {
            return null;
        }
        else {
            return value;
        }
    }
    set pattern(value) {
        if (value == null) {
            this._pattern = '';
            this.parts = kernel.emptyArray;
        }
        else {
            this._pattern = value;
            this.parts = this._partsRecord[value];
        }
    }
    append(pattern, ch) {
        const currentRecord = this._currentRecord;
        if (currentRecord[pattern] === undefined) {
            currentRecord[pattern] = ch;
        }
        else {
            currentRecord[pattern] += ch;
        }
    }
    next(pattern) {
        const currentRecord = this._currentRecord;
        let partsRecord;
        if (currentRecord[pattern] !== undefined) {
            partsRecord = this._partsRecord;
            if (partsRecord[pattern] === undefined) {
                partsRecord[pattern] = [currentRecord[pattern]];
            }
            else {
                partsRecord[pattern].push(currentRecord[pattern]);
            }
            currentRecord[pattern] = undefined;
        }
    }
}
class AttrParsingState {
    constructor(charSpec, ...patterns) {
        this.charSpec = charSpec;
        this._nextStates = [];
        this._types = null;
        this._isEndpoint = false;
        this._patterns = patterns;
    }
    get _pattern() {
        return this._isEndpoint ? this._patterns[0] : null;
    }
    findChild(charSpec) {
        const nextStates = this._nextStates;
        const len = nextStates.length;
        let child = null;
        let i = 0;
        for (; i < len; ++i) {
            child = nextStates[i];
            if (charSpec.equals(child.charSpec)) {
                return child;
            }
        }
        return null;
    }
    append(charSpec, pattern) {
        const patterns = this._patterns;
        if (!patterns.includes(pattern)) {
            patterns.push(pattern);
        }
        let state = this.findChild(charSpec);
        if (state == null) {
            state = new AttrParsingState(charSpec, pattern);
            this._nextStates.push(state);
            if (charSpec.repeat) {
                state._nextStates.push(state);
            }
        }
        return state;
    }
    findMatches(ch, interpretation) {
        const results = [];
        const nextStates = this._nextStates;
        const len = nextStates.length;
        let childLen = 0;
        let child = null;
        let i = 0;
        let j = 0;
        for (; i < len; ++i) {
            child = nextStates[i];
            if (child.charSpec.has(ch)) {
                results.push(child);
                childLen = child._patterns.length;
                j = 0;
                if (child.charSpec.isSymbol) {
                    for (; j < childLen; ++j) {
                        interpretation.next(child._patterns[j]);
                    }
                }
                else {
                    for (; j < childLen; ++j) {
                        interpretation.append(child._patterns[j], ch);
                    }
                }
            }
        }
        return results;
    }
}
class StaticSegment {
    constructor(text) {
        this.text = text;
        const len = this._len = text.length;
        const specs = this._specs = [];
        let i = 0;
        for (; len > i; ++i) {
            specs.push(new CharSpec(text[i], false, false, false));
        }
    }
    eachChar(callback) {
        const len = this._len;
        const specs = this._specs;
        let i = 0;
        for (; len > i; ++i) {
            callback(specs[i]);
        }
    }
}
class DynamicSegment {
    constructor(symbols) {
        this.text = 'PART';
        this._spec = new CharSpec(symbols, true, false, true);
    }
    eachChar(callback) {
        callback(this._spec);
    }
}
class SymbolSegment {
    constructor(text) {
        this.text = text;
        this._spec = new CharSpec(text, false, true, false);
    }
    eachChar(callback) {
        callback(this._spec);
    }
}
class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}
const ISyntaxInterpreter = createInterface('ISyntaxInterpreter', x => x.singleton(SyntaxInterpreter));
class SyntaxInterpreter {
    constructor() {
        this._rootState = new AttrParsingState(null);
        this._initialStates = [this._rootState];
    }
    add(defs) {
        defs = defs.slice(0).sort((d1, d2) => d1.pattern > d2.pattern ? 1 : -1);
        const ii = defs.length;
        let currentState;
        let def;
        let pattern;
        let types;
        let segments;
        let len;
        let charSpecCb;
        let i = 0;
        let j;
        while (ii > i) {
            currentState = this._rootState;
            def = defs[i];
            pattern = def.pattern;
            types = new SegmentTypes();
            segments = this._parse(def, types);
            len = segments.length;
            charSpecCb = (ch) => currentState = currentState.append(ch, pattern);
            for (j = 0; len > j; ++j) {
                segments[j].eachChar(charSpecCb);
            }
            currentState._types = types;
            currentState._isEndpoint = true;
            ++i;
        }
    }
    interpret(name) {
        const interpretation = new Interpretation();
        const len = name.length;
        let states = this._initialStates;
        let i = 0;
        let state;
        for (; i < len; ++i) {
            states = this._getNextStates(states, name.charAt(i), interpretation);
            if (states.length === 0) {
                break;
            }
        }
        states = states.filter(isEndpoint);
        if (states.length > 0) {
            states.sort(sortEndpoint);
            state = states[0];
            if (!state.charSpec.isSymbol) {
                interpretation.next(state._pattern);
            }
            interpretation.pattern = state._pattern;
        }
        return interpretation;
    }
    _getNextStates(states, ch, interpretation) {
        const nextStates = [];
        let state = null;
        const len = states.length;
        let i = 0;
        for (; i < len; ++i) {
            state = states[i];
            nextStates.push(...state.findMatches(ch, interpretation));
        }
        return nextStates;
    }
    _parse(def, types) {
        const result = [];
        const pattern = def.pattern;
        const len = pattern.length;
        const symbols = def.symbols;
        let i = 0;
        let start = 0;
        let c = '';
        while (i < len) {
            c = pattern.charAt(i);
            if (symbols.length === 0 || !symbols.includes(c)) {
                if (i === start) {
                    if (c === 'P' && pattern.slice(i, i + 4) === 'PART') {
                        start = i = (i + 4);
                        result.push(new DynamicSegment(symbols));
                        ++types.dynamics;
                    }
                    else {
                        ++i;
                    }
                }
                else {
                    ++i;
                }
            }
            else if (i !== start) {
                result.push(new StaticSegment(pattern.slice(start, i)));
                ++types.statics;
                start = i;
            }
            else {
                result.push(new SymbolSegment(pattern.slice(start, i + 1)));
                ++types.symbols;
                start = ++i;
            }
        }
        if (start !== i) {
            result.push(new StaticSegment(pattern.slice(start, i)));
            ++types.statics;
        }
        return result;
    }
}
function isEndpoint(a) {
    return a._isEndpoint;
}
function sortEndpoint(a, b) {
    const aTypes = a._types;
    const bTypes = b._types;
    if (aTypes.statics !== bTypes.statics) {
        return bTypes.statics - aTypes.statics;
    }
    if (aTypes.dynamics !== bTypes.dynamics) {
        return bTypes.dynamics - aTypes.dynamics;
    }
    if (aTypes.symbols !== bTypes.symbols) {
        return bTypes.symbols - aTypes.symbols;
    }
    return 0;
}
class AttrSyntax {
    constructor(rawName, rawValue, target, command) {
        this.rawName = rawName;
        this.rawValue = rawValue;
        this.target = target;
        this.command = command;
    }
}
const IAttributePattern = createInterface('IAttributePattern');
const IAttributeParser = createInterface('IAttributeParser', x => x.singleton(AttributeParser));
class AttributeParser {
    constructor(interpreter, attrPatterns) {
        this._cache = {};
        this._interpreter = interpreter;
        const patterns = this._patterns = {};
        const allDefs = attrPatterns.reduce((allDefs, attrPattern) => {
            const patternDefs = getAllPatternDefinitions(attrPattern.constructor);
            patternDefs.forEach(def => patterns[def.pattern] = attrPattern);
            return allDefs.concat(patternDefs);
        }, kernel.emptyArray);
        interpreter.add(allDefs);
    }
    parse(name, value) {
        let interpretation = this._cache[name];
        if (interpretation == null) {
            interpretation = this._cache[name] = this._interpreter.interpret(name);
        }
        const pattern = interpretation.pattern;
        if (pattern == null) {
            return new AttrSyntax(name, value, name, null);
        }
        else {
            return this._patterns[pattern][pattern](name, value, interpretation.parts);
        }
    }
}
AttributeParser.inject = [ISyntaxInterpreter, kernel.all(IAttributePattern)];
function attributePattern(...patternDefs) {
    return function decorator(target) {
        return AttributePattern.define(patternDefs, target);
    };
}
class AttributePatternResourceDefinition {
    constructor(Type) {
        this.Type = Type;
        this.name = (void 0);
    }
    register(container) {
        singletonRegistration(IAttributePattern, this.Type).register(container);
    }
}
const apBaseName = getResourceKeyFor('attribute-pattern');
const annotationKey = 'attribute-pattern-definitions';
const getAllPatternDefinitions = (Type) => kernel.Protocol.annotation.get(Type, annotationKey);
const AttributePattern = objectFreeze({
    name: apBaseName,
    definitionAnnotationKey: annotationKey,
    define(patternDefs, Type) {
        const definition = new AttributePatternResourceDefinition(Type);
        defineMetadata(apBaseName, definition, Type);
        appendResourceKey(Type, apBaseName);
        kernel.Protocol.annotation.set(Type, annotationKey, patternDefs);
        appendAnnotationKey(Type, annotationKey);
        return Type;
    },
    getPatternDefinitions: getAllPatternDefinitions,
});
exports.DotSeparatedAttributePattern = class DotSeparatedAttributePattern {
    'PART.PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], parts[1]);
    }
    'PART.PART.PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, `${parts[0]}.${parts[1]}`, parts[2]);
    }
};
exports.DotSeparatedAttributePattern = __decorate([
    attributePattern({ pattern: 'PART.PART', symbols: '.' }, { pattern: 'PART.PART.PART', symbols: '.' })
], exports.DotSeparatedAttributePattern);
exports.RefAttributePattern = class RefAttributePattern {
    'ref'(rawName, rawValue, _parts) {
        return new AttrSyntax(rawName, rawValue, 'element', 'ref');
    }
    'PART.ref'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'ref');
    }
};
exports.RefAttributePattern = __decorate([
    attributePattern({ pattern: 'ref', symbols: '' }, { pattern: 'PART.ref', symbols: '.' })
], exports.RefAttributePattern);
exports.ColonPrefixedBindAttributePattern = class ColonPrefixedBindAttributePattern {
    ':PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'bind');
    }
};
exports.ColonPrefixedBindAttributePattern = __decorate([
    attributePattern({ pattern: ':PART', symbols: ':' })
], exports.ColonPrefixedBindAttributePattern);
exports.AtPrefixedTriggerAttributePattern = class AtPrefixedTriggerAttributePattern {
    '@PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'trigger');
    }
};
exports.AtPrefixedTriggerAttributePattern = __decorate([
    attributePattern({ pattern: '@PART', symbols: '@' })
], exports.AtPrefixedTriggerAttributePattern);
let SpreadAttributePattern = class SpreadAttributePattern {
    '...$attrs'(rawName, rawValue, _parts) {
        return new AttrSyntax(rawName, rawValue, '', '...$attrs');
    }
};
SpreadAttributePattern = __decorate([
    attributePattern({ pattern: '...$attrs', symbols: '' })
], SpreadAttributePattern);

class AttributeObserver {
    constructor(obj, prop, attr) {
        this.type = 2 | 1 | 4;
        this._value = null;
        this._oldValue = null;
        this._hasChanges = false;
        this._obj = obj;
        this._prop = prop;
        this._attr = attr;
    }
    getValue() {
        return this._value;
    }
    setValue(value) {
        this._value = value;
        this._hasChanges = value !== this._oldValue;
        this._flushChanges();
    }
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            this._oldValue = this._value;
            switch (this._attr) {
                case 'class': {
                    this._obj.classList.toggle(this._prop, !!this._value);
                    break;
                }
                case 'style': {
                    let priority = '';
                    let newValue = this._value;
                    if (isString(newValue) && newValue.includes('!important')) {
                        priority = 'important';
                        newValue = newValue.replace('!important', '');
                    }
                    this._obj.style.setProperty(this._prop, newValue, priority);
                    break;
                }
                default: {
                    if (this._value == null) {
                        this._obj.removeAttribute(this._attr);
                    }
                    else {
                        this._obj.setAttribute(this._attr, String(this._value));
                    }
                }
            }
        }
    }
    handleMutation(mutationRecords) {
        let shouldProcess = false;
        for (let i = 0, ii = mutationRecords.length; ii > i; ++i) {
            const record = mutationRecords[i];
            if (record.type === 'attributes' && record.attributeName === this._prop) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            let newValue;
            switch (this._attr) {
                case 'class':
                    newValue = this._obj.classList.contains(this._prop);
                    break;
                case 'style':
                    newValue = this._obj.style.getPropertyValue(this._prop);
                    break;
                default:
                    throw createError(`AUR0651: Unsupported observation of attribute: ${this._attr}`);
            }
            if (newValue !== this._value) {
                this._oldValue = this._value;
                this._value = newValue;
                this._hasChanges = false;
                this._flush();
            }
        }
    }
    subscribe(subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            this._value = this._oldValue = this._obj.getAttribute(this._prop);
            startObservation(this._obj.ownerDocument.defaultView.MutationObserver, this._obj, this);
        }
    }
    unsubscribe(subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            stopObservation(this._obj, this);
        }
    }
    _flush() {
        oV$3 = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV$3);
    }
}
runtime.subscriberCollection(AttributeObserver);
const startObservation = ($MutationObserver, element, subscriber) => {
    if (element.$eMObs === undefined) {
        element.$eMObs = new Set();
    }
    if (element.$mObs === undefined) {
        (element.$mObs = new $MutationObserver(handleMutation)).observe(element, { attributes: true });
    }
    element.$eMObs.add(subscriber);
};
const stopObservation = (element, subscriber) => {
    const $eMObservers = element.$eMObs;
    if ($eMObservers && $eMObservers.delete(subscriber)) {
        if ($eMObservers.size === 0) {
            element.$mObs.disconnect();
            element.$mObs = undefined;
        }
        return true;
    }
    return false;
};
const handleMutation = (mutationRecords) => {
    mutationRecords[0].target.$eMObs.forEach(invokeHandleMutation, mutationRecords);
};
function invokeHandleMutation(s) {
    s.handleMutation(this);
}
let oV$3 = void 0;

function bindingBehavior(nameOrDef) {
    return function (target) {
        return BindingBehavior.define(nameOrDef, target);
    };
}
class BindingBehaviorDefinition {
    constructor(Type, name, aliases, key) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
    }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new BindingBehaviorDefinition(Type, kernel.firstDefined(getBehaviorAnnotation(Type, 'name'), name), kernel.mergeArrays(getBehaviorAnnotation(Type, 'aliases'), def.aliases, Type.aliases), BindingBehavior.keyFrom(name));
    }
    register(container) {
        const { Type, key, aliases } = this;
        singletonRegistration(key, Type).register(container);
        aliasRegistration(key, Type).register(container);
        registerAliases(aliases, BindingBehavior, key, container);
    }
}
const bbBaseName = getResourceKeyFor('binding-behavior');
const getBehaviorAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const BindingBehavior = objectFreeze({
    name: bbBaseName,
    keyFrom(name) {
        return `${bbBaseName}:${name}`;
    },
    isType(value) {
        return isFunction(value) && hasOwnMetadata(bbBaseName, value);
    },
    define(nameOrDef, Type) {
        const definition = BindingBehaviorDefinition.create(nameOrDef, Type);
        defineMetadata(bbBaseName, definition, definition.Type);
        defineMetadata(bbBaseName, definition, definition);
        appendResourceKey(Type, bbBaseName);
        return definition.Type;
    },
    getDefinition(Type) {
        const def = getOwnMetadata(bbBaseName, Type);
        if (def === void 0) {
            throw createError(`AUR0151: No definition found for type ${Type.name}`);
        }
        return def;
    },
    annotate(Type, prop, value) {
        defineMetadata(getAnnotationKeyFor(prop), value, Type);
    },
    getAnnotation: getBehaviorAnnotation,
});

function valueConverter(nameOrDef) {
    return function (target) {
        return ValueConverter.define(nameOrDef, target);
    };
}
class ValueConverterDefinition {
    constructor(Type, name, aliases, key) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
    }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new ValueConverterDefinition(Type, kernel.firstDefined(getConverterAnnotation(Type, 'name'), name), kernel.mergeArrays(getConverterAnnotation(Type, 'aliases'), def.aliases, Type.aliases), ValueConverter.keyFrom(name));
    }
    register(container) {
        const { Type, key, aliases } = this;
        kernel.Registration.singleton(key, Type).register(container);
        kernel.Registration.aliasTo(key, Type).register(container);
        registerAliases(aliases, ValueConverter, key, container);
    }
}
const vcBaseName = getResourceKeyFor('value-converter');
const getConverterAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const ValueConverter = objectFreeze({
    name: vcBaseName,
    keyFrom: (name) => `${vcBaseName}:${name}`,
    isType(value) {
        return isFunction(value) && hasOwnMetadata(vcBaseName, value);
    },
    define(nameOrDef, Type) {
        const definition = ValueConverterDefinition.create(nameOrDef, Type);
        defineMetadata(vcBaseName, definition, definition.Type);
        defineMetadata(vcBaseName, definition, definition);
        appendResourceKey(Type, vcBaseName);
        return definition.Type;
    },
    getDefinition(Type) {
        const def = getOwnMetadata(vcBaseName, Type);
        if (def === void 0) {
            throw createError(`AUR0152: No definition found for type ${Type.name}`);
        }
        return def;
    },
    annotate(Type, prop, value) {
        defineMetadata(getAnnotationKeyFor(prop), value, Type);
    },
    getAnnotation: getConverterAnnotation,
});

class BindingTargetSubscriber {
    constructor(b, flushQueue) {
        this._value = void 0;
        this.b = b;
        this._flushQueue = flushQueue;
    }
    flush() {
        this.b.updateSource(this._value);
    }
    handleChange(value, _) {
        const b = this.b;
        if (value !== runtime.astEvaluate(b.ast, b._scope, b, null)) {
            this._value = value;
            this._flushQueue.add(this);
        }
    }
}
const mixinUseScope = (target) => {
    defineHiddenProp(target.prototype, 'useScope', function (scope) {
        this._scope = scope;
    });
};
const mixinAstEvaluator = (strict, strictFnCall = true) => {
    return (target) => {
        const proto = target.prototype;
        if (strict != null) {
            def(proto, 'strict', { enumerable: true, get: function () { return strict; } });
        }
        def(proto, 'strictFnCall', { enumerable: true, get: function () { return strictFnCall; } });
        defineHiddenProp(proto, 'get', function (key) {
            return this.l.get(key);
        });
        defineHiddenProp(proto, 'getSignaler', function () {
            return this.l.root.get(runtime.ISignaler);
        });
        defineHiddenProp(proto, 'getConverter', function (name) {
            const key = ValueConverter.keyFrom(name);
            let resourceLookup = resourceLookupCache.get(this);
            if (resourceLookup == null) {
                resourceLookupCache.set(this, resourceLookup = new ResourceLookup());
            }
            return resourceLookup[key] ?? (resourceLookup[key] = this.l.get(resource(key)));
        });
        defineHiddenProp(proto, 'getBehavior', function (name) {
            const key = BindingBehavior.keyFrom(name);
            let resourceLookup = resourceLookupCache.get(this);
            if (resourceLookup == null) {
                resourceLookupCache.set(this, resourceLookup = new ResourceLookup());
            }
            return resourceLookup[key] ?? (resourceLookup[key] = this.l.get(resource(key)));
        });
    };
};
const resourceLookupCache = new WeakMap();
class ResourceLookup {
}
const IFlushQueue = createInterface('IFlushQueue', x => x.singleton(FlushQueue));
class FlushQueue {
    constructor() {
        this._flushing = false;
        this._items = new Set();
    }
    get count() {
        return this._items.size;
    }
    add(flushable) {
        this._items.add(flushable);
        if (this._flushing) {
            return;
        }
        this._flushing = true;
        try {
            this._items.forEach(flushItem);
        }
        finally {
            this._flushing = false;
        }
    }
    clear() {
        this._items.clear();
        this._flushing = false;
    }
}
function flushItem(item, _, items) {
    items.delete(item);
    item.flush();
}
const withLimitationBindings = new WeakSet();
const mixingBindingLimited = (target, getMethodName) => {
    defineHiddenProp(target.prototype, 'limit', function (opts) {
        if (withLimitationBindings.has(this)) {
            throw createError(`AURXXXX: a rate limit has already been applied.`);
        }
        withLimitationBindings.add(this);
        const prop = getMethodName(this, opts);
        const originalFn = this[prop];
        const callOriginal = (...args) => originalFn.call(this, ...args);
        const limitedFn = opts.type === 'debounce'
            ? debounced(opts, callOriginal, this)
            : throttled(opts, callOriginal, this);
        this[prop] = limitedFn;
        return {
            dispose: () => {
                withLimitationBindings.delete(this);
                limitedFn.dispose();
                delete this[prop];
            }
        };
    });
};
const debounced = (opts, callOriginal, binding) => {
    let limiterTask;
    let task;
    let latestValue;
    const taskQueue = opts.queue;
    const fn = (v) => {
        latestValue = v;
        if (binding.isBound) {
            task = limiterTask;
            limiterTask = taskQueue.queueTask(() => callOriginal(latestValue), { delay: opts.delay, reusable: false });
            task?.cancel();
        }
        else {
            callOriginal(latestValue);
        }
    };
    fn.dispose = () => {
        task?.cancel();
        limiterTask?.cancel();
    };
    return fn;
};
const throttled = (opts, callOriginal, binding) => {
    let limiterTask;
    let task;
    let last = 0;
    let elapsed = 0;
    let latestValue;
    const taskQueue = opts.queue;
    const now = () => opts.now();
    const fn = (v) => {
        latestValue = v;
        if (binding.isBound) {
            elapsed = now() - last;
            task = limiterTask;
            if (elapsed > opts.delay) {
                last = now();
                callOriginal(latestValue);
            }
            else {
                limiterTask = taskQueue.queueTask(() => {
                    last = now();
                    callOriginal(latestValue);
                }, { delay: opts.delay - elapsed, reusable: false });
            }
            task?.cancel();
        }
        else {
            callOriginal(latestValue);
        }
    };
    fn.dispose = () => {
        task?.cancel();
        limiterTask?.cancel();
    };
    return fn;
};

const taskOptions = {
    reusable: false,
    preempt: true,
};
class AttributeBinding {
    constructor(controller, locator, observerLocator, taskQueue, ast, target, targetAttribute, targetProperty, mode) {
        this.targetAttribute = targetAttribute;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.isBound = false;
        this._scope = void 0;
        this._task = null;
        this._value = void 0;
        this.boundFn = false;
        this.l = locator;
        this.ast = ast;
        this._controller = controller;
        this.target = target;
        this.oL = observerLocator;
        this._taskQueue = taskQueue;
    }
    updateTarget(value) {
        this._targetObserver.setValue(value, this.target, this.targetProperty);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        let task;
        this.obs.version++;
        const newValue = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (newValue !== this._value) {
            this._value = newValue;
            const shouldQueueFlush = this._controller.state !== 1 && (this._targetObserver.type & 4) > 0;
            if (shouldQueueFlush) {
                task = this._task;
                this._task = this._taskQueue.queueTask(() => {
                    this._task = null;
                    this.updateTarget(newValue);
                }, taskOptions);
                task?.cancel();
            }
            else {
                this.updateTarget(newValue);
            }
        }
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        runtime.astBind(this.ast, _scope, this);
        this._targetObserver ?? (this._targetObserver = new AttributeObserver(this.target, this.targetProperty, this.targetAttribute));
        if (this.mode & (2 | 1)) {
            this.updateTarget(this._value = runtime.astEvaluate(this.ast, _scope, this, (this.mode & 2) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this._value = void 0;
        this._task?.cancel();
        this._task = null;
        this.obs.clearAll();
    }
}
mixinUseScope(AttributeBinding);
mixingBindingLimited(AttributeBinding, () => 'updateTarget');
runtime.connectable(AttributeBinding);
mixinAstEvaluator(true)(AttributeBinding);

const queueTaskOptions = {
    reusable: false,
    preempt: true,
};
class InterpolationBinding {
    constructor(controller, locator, observerLocator, taskQueue, ast, target, targetProperty, mode) {
        this.ast = ast;
        this.target = target;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.isBound = false;
        this._scope = void 0;
        this._task = null;
        this._controller = controller;
        this.oL = observerLocator;
        this._taskQueue = taskQueue;
        this._targetObserver = observerLocator.getAccessor(target, targetProperty);
        const expressions = ast.expressions;
        const partBindings = this.partBindings = Array(expressions.length);
        const ii = expressions.length;
        let i = 0;
        for (; ii > i; ++i) {
            partBindings[i] = new InterpolationPartBinding(expressions[i], target, targetProperty, locator, observerLocator, this);
        }
    }
    _handlePartChange() {
        this.updateTarget();
    }
    updateTarget() {
        const partBindings = this.partBindings;
        const staticParts = this.ast.parts;
        const ii = partBindings.length;
        let result = '';
        let i = 0;
        if (ii === 1) {
            result = staticParts[0] + partBindings[0]._value + staticParts[1];
        }
        else {
            result = staticParts[0];
            for (; ii > i; ++i) {
                result += partBindings[i]._value + staticParts[i + 1];
            }
        }
        const targetObserver = this._targetObserver;
        const shouldQueueFlush = this._controller.state !== 1 && (targetObserver.type & 4) > 0;
        let task;
        if (shouldQueueFlush) {
            task = this._task;
            this._task = this._taskQueue.queueTask(() => {
                this._task = null;
                targetObserver.setValue(result, this.target, this.targetProperty);
            }, queueTaskOptions);
            task?.cancel();
            task = null;
        }
        else {
            targetObserver.setValue(result, this.target, this.targetProperty);
        }
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        const partBindings = this.partBindings;
        const ii = partBindings.length;
        let i = 0;
        for (; ii > i; ++i) {
            partBindings[i].bind(_scope);
        }
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this._scope = void 0;
        const partBindings = this.partBindings;
        const ii = partBindings.length;
        let i = 0;
        for (; ii > i; ++i) {
            partBindings[i].unbind();
        }
        this._task?.cancel();
        this._task = null;
    }
}
class InterpolationPartBinding {
    constructor(ast, target, targetProperty, locator, observerLocator, owner) {
        this.ast = ast;
        this.target = target;
        this.targetProperty = targetProperty;
        this.owner = owner;
        this.mode = 2;
        this.task = null;
        this.isBound = false;
        this._value = '';
        this.boundFn = false;
        this.l = locator;
        this.oL = observerLocator;
    }
    updateTarget() {
        this.owner._handlePartChange();
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const newValue = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (newValue != this._value) {
            this._value = newValue;
            if (isArray(newValue)) {
                this.observeCollection(newValue);
            }
            this.updateTarget();
        }
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        runtime.astBind(this.ast, _scope, this);
        this._value = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & 2) > 0 ? this : null);
        if (isArray(this._value)) {
            this.observeCollection(this._value);
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this.obs.clearAll();
    }
}
mixinUseScope(InterpolationPartBinding);
mixingBindingLimited(InterpolationPartBinding, () => 'updateTarget');
runtime.connectable(InterpolationPartBinding);
mixinAstEvaluator(true)(InterpolationPartBinding);
class ContentBinding {
    constructor(controller, locator, observerLocator, taskQueue, p, ast, target, strict) {
        this.p = p;
        this.ast = ast;
        this.target = target;
        this.strict = strict;
        this.isBound = false;
        this.mode = 2;
        this._task = null;
        this._value = '';
        this.boundFn = false;
        this.l = locator;
        this._controller = controller;
        this.oL = observerLocator;
        this._taskQueue = taskQueue;
    }
    updateTarget(value) {
        const target = this.target;
        const NodeCtor = this.p.Node;
        const oldValue = this._value;
        this._value = value;
        if (oldValue instanceof NodeCtor) {
            oldValue.parentNode?.removeChild(oldValue);
        }
        if (value instanceof NodeCtor) {
            target.textContent = '';
            target.parentNode?.insertBefore(value, target);
        }
        else {
            target.textContent = String(value);
        }
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const newValue = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (newValue === this._value) {
            this._task?.cancel();
            this._task = null;
            return;
        }
        const shouldQueueFlush = this._controller.state !== 1;
        if (shouldQueueFlush) {
            this._queueUpdate(newValue);
        }
        else {
            this.updateTarget(newValue);
        }
    }
    handleCollectionChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const v = this._value = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        if (isArray(v)) {
            this.observeCollection(v);
        }
        const shouldQueueFlush = this._controller.state !== 1;
        if (shouldQueueFlush) {
            this._queueUpdate(v);
        }
        else {
            this.updateTarget(v);
        }
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        runtime.astBind(this.ast, _scope, this);
        const v = this._value = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & 2) > 0 ? this : null);
        if (isArray(v)) {
            this.observeCollection(v);
        }
        this.updateTarget(v);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this.obs.clearAll();
        this._task?.cancel();
        this._task = null;
    }
    _queueUpdate(newValue) {
        const task = this._task;
        this._task = this._taskQueue.queueTask(() => {
            this._task = null;
            this.updateTarget(newValue);
        }, queueTaskOptions);
        task?.cancel();
    }
}
mixinUseScope(ContentBinding);
mixingBindingLimited(ContentBinding, () => 'updateTarget');
runtime.connectable()(ContentBinding);
mixinAstEvaluator(void 0, false)(ContentBinding);

class LetBinding {
    constructor(locator, observerLocator, ast, targetProperty, toBindingContext = false) {
        this.ast = ast;
        this.targetProperty = targetProperty;
        this.isBound = false;
        this._scope = void 0;
        this.target = null;
        this.boundFn = false;
        this.l = locator;
        this.oL = observerLocator;
        this._toBindingContext = toBindingContext;
    }
    updateTarget() {
        this.target[this.targetProperty] = this._value;
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this._value = runtime.astEvaluate(this.ast, this._scope, this, this);
        this.obs.clear();
        this.updateTarget();
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        this.target = (this._toBindingContext ? _scope.bindingContext : _scope.overrideContext);
        runtime.astBind(this.ast, _scope, this);
        this._value = runtime.astEvaluate(this.ast, this._scope, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this.obs.clearAll();
    }
}
mixinUseScope(LetBinding);
mixingBindingLimited(LetBinding, () => 'updateTarget');
runtime.connectable(LetBinding);
mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(controller, locator, observerLocator, taskQueue, ast, target, targetProperty, mode) {
        this.ast = ast;
        this.target = target;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.isBound = false;
        this._scope = void 0;
        this._targetObserver = void 0;
        this._task = null;
        this._targetSubscriber = null;
        this.boundFn = false;
        this.l = locator;
        this._controller = controller;
        this._taskQueue = taskQueue;
        this.oL = observerLocator;
    }
    updateTarget(value) {
        this._targetObserver.setValue(value, this.target, this.targetProperty);
    }
    updateSource(value) {
        runtime.astAssign(this.ast, this._scope, this, value);
    }
    handleChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const newValue = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & 2) > 0 ? this : null);
        this.obs.clear();
        const shouldQueueFlush = this._controller.state !== 1 && (this._targetObserver.type & 4) > 0;
        if (shouldQueueFlush) {
            task = this._task;
            this._task = this._taskQueue.queueTask(() => {
                this.updateTarget(newValue);
                this._task = null;
            }, updateTaskOpts);
            task?.cancel();
            task = null;
        }
        else {
            this.updateTarget(newValue);
        }
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(scope) {
        if (this.isBound) {
            if (this._scope === scope) {
                return;
            }
            this.unbind();
        }
        this._scope = scope;
        runtime.astBind(this.ast, scope, this);
        const observerLocator = this.oL;
        const $mode = this.mode;
        let targetObserver = this._targetObserver;
        if (!targetObserver) {
            if ($mode & 4) {
                targetObserver = observerLocator.getObserver(this.target, this.targetProperty);
            }
            else {
                targetObserver = observerLocator.getAccessor(this.target, this.targetProperty);
            }
            this._targetObserver = targetObserver;
        }
        const shouldConnect = ($mode & 2) > 0;
        if ($mode & (2 | 1)) {
            this.updateTarget(runtime.astEvaluate(this.ast, this._scope, this, shouldConnect ? this : null));
        }
        if ($mode & 4) {
            targetObserver.subscribe(this._targetSubscriber ?? (this._targetSubscriber = new BindingTargetSubscriber(this, this.l.get(IFlushQueue))));
            if (!shouldConnect) {
                this.updateSource(targetObserver.getValue(this.target, this.targetProperty));
            }
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        if (this._targetSubscriber) {
            this._targetObserver.unsubscribe(this._targetSubscriber);
            this._targetSubscriber = null;
        }
        this._task?.cancel();
        this._task = null;
        this.obs.clearAll();
    }
    useTargetObserver(observer) {
        this._targetObserver?.unsubscribe(this);
        (this._targetObserver = observer).subscribe(this);
    }
    useTargetSubscriber(subscriber) {
        if (this._targetSubscriber != null) {
            throw createError(`AURxxxx: binding already has a target subscriber`);
        }
        this._targetSubscriber = subscriber;
    }
}
mixinUseScope(PropertyBinding);
mixingBindingLimited(PropertyBinding, (propBinding) => (propBinding.mode & 4) ? 'updateSource' : 'updateTarget');
runtime.connectable(PropertyBinding);
mixinAstEvaluator(true, false)(PropertyBinding);
let task = null;
const updateTaskOpts = {
    reusable: false,
    preempt: true,
};

class RefBinding {
    constructor(locator, ast, target) {
        this.ast = ast;
        this.target = target;
        this.isBound = false;
        this._scope = void 0;
        this.l = locator;
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        runtime.astBind(this.ast, _scope, this);
        runtime.astAssign(this.ast, this._scope, this, this.target);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (runtime.astEvaluate(this.ast, this._scope, this, null) === this.target) {
            runtime.astAssign(this.ast, this._scope, this, null);
        }
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
    }
}
mixinAstEvaluator(false)(RefBinding);

class ListenerBindingOptions {
    constructor(prevent, capture = false) {
        this.prevent = prevent;
        this.capture = capture;
    }
}
class ListenerBinding {
    constructor(locator, ast, target, targetEvent, options) {
        this.ast = ast;
        this.target = target;
        this.targetEvent = targetEvent;
        this.isBound = false;
        this.self = false;
        this.boundFn = true;
        this.l = locator;
        this._options = options;
    }
    callSource(event) {
        const overrideContext = this._scope.overrideContext;
        overrideContext.$event = event;
        let result = runtime.astEvaluate(this.ast, this._scope, this, null);
        delete overrideContext.$event;
        if (isFunction(result)) {
            result = result(event);
        }
        if (result !== true && this._options.prevent) {
            event.preventDefault();
        }
        return result;
    }
    handleEvent(event) {
        if (this.self) {
            if (this.target !== event.composedPath()[0]) {
                return;
            }
        }
        this.callSource(event);
    }
    bind(scope) {
        if (this.isBound) {
            if (this._scope === scope) {
                return;
            }
            this.unbind();
        }
        this._scope = scope;
        runtime.astBind(this.ast, scope, this);
        this.target.addEventListener(this.targetEvent, this, this._options);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this.target.removeEventListener(this.targetEvent, this, this._options);
    }
}
mixinUseScope(ListenerBinding);
mixingBindingLimited(ListenerBinding, () => 'callSource');
mixinAstEvaluator(true, true)(ListenerBinding);

const IAppTask = createInterface('IAppTask');
class $AppTask {
    constructor(slot, key, cb) {
        this.c = (void 0);
        this.slot = slot;
        this.k = key;
        this.cb = cb;
    }
    register(container) {
        return this.c = container.register(instanceRegistration(IAppTask, this));
    }
    run() {
        const key = this.k;
        const cb = this.cb;
        return (key === null
            ? cb()
            : cb(this.c.get(key)));
    }
}
const AppTask = objectFreeze({
    creating: createAppTaskSlotHook('creating'),
    hydrating: createAppTaskSlotHook('hydrating'),
    hydrated: createAppTaskSlotHook('hydrated'),
    activating: createAppTaskSlotHook('activating'),
    activated: createAppTaskSlotHook('activated'),
    deactivating: createAppTaskSlotHook('deactivating'),
    deactivated: createAppTaskSlotHook('deactivated'),
});
function createAppTaskSlotHook(slotName) {
    function appTaskFactory(keyOrCallback, callback) {
        if (isFunction(callback)) {
            return new $AppTask(slotName, keyOrCallback, callback);
        }
        return new $AppTask(slotName, null, keyOrCallback);
    }
    return appTaskFactory;
}

function watch(expressionOrPropertyAccessFn, changeHandlerOrCallback) {
    if (expressionOrPropertyAccessFn == null) {
        throw createError(`AUR0772: Invalid watch config. Expected an expression or a fn`);
    }
    return function decorator(target, key, descriptor) {
        const isClassDecorator = key == null;
        const Type = isClassDecorator ? target : target.constructor;
        const watchDef = new WatchDefinition(expressionOrPropertyAccessFn, isClassDecorator ? changeHandlerOrCallback : descriptor.value);
        if (isClassDecorator) {
            if (!isFunction(changeHandlerOrCallback)
                && (changeHandlerOrCallback == null || !(changeHandlerOrCallback in Type.prototype))) {
                throw createError(`AUR0773: Invalid change handler config. Method "${String(changeHandlerOrCallback)}" not found in class ${Type.name}`);
            }
        }
        else if (!isFunction(descriptor?.value)) {
            throw createError(`AUR0774: decorated target ${String(key)} is not a class method.`);
        }
        Watch.add(Type, watchDef);
        if (isAttributeType(Type)) {
            getAttributeDefinition(Type).watches.push(watchDef);
        }
        if (isElementType(Type)) {
            getElementDefinition(Type).watches.push(watchDef);
        }
    };
}
class WatchDefinition {
    constructor(expression, callback) {
        this.expression = expression;
        this.callback = callback;
    }
}
const noDefinitions = kernel.emptyArray;
const watchBaseName = getAnnotationKeyFor('watch');
const Watch = objectFreeze({
    name: watchBaseName,
    add(Type, definition) {
        let watchDefinitions = getOwnMetadata(watchBaseName, Type);
        if (watchDefinitions == null) {
            defineMetadata(watchBaseName, watchDefinitions = [], Type);
        }
        watchDefinitions.push(definition);
    },
    getAnnotation(Type) {
        return getOwnMetadata(watchBaseName, Type) ?? noDefinitions;
    },
});

function customAttribute(nameOrDef) {
    return function (target) {
        return defineAttribute(nameOrDef, target);
    };
}
function templateController(nameOrDef) {
    return function (target) {
        return defineAttribute(isString(nameOrDef)
            ? { isTemplateController: true, name: nameOrDef }
            : { isTemplateController: true, ...nameOrDef }, target);
    };
}
class CustomAttributeDefinition {
    constructor(Type, name, aliases, key, defaultBindingMode, isTemplateController, bindables, noMultiBindings, watches, dependencies) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
        this.defaultBindingMode = defaultBindingMode;
        this.isTemplateController = isTemplateController;
        this.bindables = bindables;
        this.noMultiBindings = noMultiBindings;
        this.watches = watches;
        this.dependencies = dependencies;
    }
    get type() { return 2; }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new CustomAttributeDefinition(Type, kernel.firstDefined(getAttributeAnnotation(Type, 'name'), name), kernel.mergeArrays(getAttributeAnnotation(Type, 'aliases'), def.aliases, Type.aliases), getAttributeKeyFrom(name), kernel.firstDefined(getAttributeAnnotation(Type, 'defaultBindingMode'), def.defaultBindingMode, Type.defaultBindingMode, 2), kernel.firstDefined(getAttributeAnnotation(Type, 'isTemplateController'), def.isTemplateController, Type.isTemplateController, false), Bindable.from(Type, ...Bindable.getAll(Type), getAttributeAnnotation(Type, 'bindables'), Type.bindables, def.bindables), kernel.firstDefined(getAttributeAnnotation(Type, 'noMultiBindings'), def.noMultiBindings, Type.noMultiBindings, false), kernel.mergeArrays(Watch.getAnnotation(Type), Type.watches), kernel.mergeArrays(getAttributeAnnotation(Type, 'dependencies'), def.dependencies, Type.dependencies));
    }
    register(container) {
        const { Type, key, aliases } = this;
        transientRegistration(key, Type).register(container);
        aliasRegistration(key, Type).register(container);
        registerAliases(aliases, CustomAttribute, key, container);
    }
}
const caBaseName = getResourceKeyFor('custom-attribute');
const getAttributeKeyFrom = (name) => `${caBaseName}:${name}`;
const getAttributeAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const isAttributeType = (value) => {
    return isFunction(value) && hasOwnMetadata(caBaseName, value);
};
const findAttributeControllerFor = (node, name) => {
    return (getRef(node, getAttributeKeyFrom(name)) ?? void 0);
};
const defineAttribute = (nameOrDef, Type) => {
    const definition = CustomAttributeDefinition.create(nameOrDef, Type);
    defineMetadata(caBaseName, definition, definition.Type);
    defineMetadata(caBaseName, definition, definition);
    appendResourceKey(Type, caBaseName);
    return definition.Type;
};
const getAttributeDefinition = (Type) => {
    const def = getOwnMetadata(caBaseName, Type);
    if (def === void 0) {
        throw createError(`No definition found for type ${Type.name}`);
    }
    return def;
};
const CustomAttribute = objectFreeze({
    name: caBaseName,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(Type, prop, value) {
        defineMetadata(getAnnotationKeyFor(prop), value, Type);
    },
    getAnnotation: getAttributeAnnotation,
});

function children(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            config.property = $prop;
        }
        defineMetadata(baseName, ChildrenDefinition.create($prop, config), $target.constructor, $prop);
        appendAnnotationKey($target.constructor, Children.keyFrom($prop));
    }
    if (arguments.length > 1) {
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    else if (isString(configOrTarget)) {
        config = {};
        return decorator;
    }
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}
function isChildrenObserverAnnotation(key) {
    return key.startsWith(baseName);
}
const baseName = getAnnotationKeyFor('children-observer');
const Children = objectFreeze({
    name: baseName,
    keyFrom: (name) => `${baseName}:${name}`,
    from(...childrenObserverLists) {
        const childrenObservers = {};
        function addName(name) {
            childrenObservers[name] = ChildrenDefinition.create(name);
        }
        function addDescription(name, def) {
            childrenObservers[name] = ChildrenDefinition.create(name, def);
        }
        function addList(maybeList) {
            if (isArray(maybeList)) {
                maybeList.forEach(addName);
            }
            else if (maybeList instanceof ChildrenDefinition) {
                childrenObservers[maybeList.property] = maybeList;
            }
            else if (maybeList !== void 0) {
                objectKeys(maybeList).forEach(name => addDescription(name, maybeList));
            }
        }
        childrenObserverLists.forEach(addList);
        return childrenObservers;
    },
    getAll(Type) {
        const propStart = baseName.length + 1;
        const defs = [];
        const prototypeChain = kernel.getPrototypeChain(Type);
        let iProto = prototypeChain.length;
        let iDefs = 0;
        let keys;
        let keysLen;
        let Class;
        while (--iProto >= 0) {
            Class = prototypeChain[iProto];
            keys = getAllAnnotations(Class).filter(isChildrenObserverAnnotation);
            keysLen = keys.length;
            for (let i = 0; i < keysLen; ++i) {
                defs[iDefs++] = getOwnMetadata(baseName, Class, keys[i].slice(propStart));
            }
        }
        return defs;
    },
});
const childObserverOptions$1 = { childList: true };
class ChildrenDefinition {
    constructor(callback, property, options, query, filter, map) {
        this.callback = callback;
        this.property = property;
        this.options = options;
        this.query = query;
        this.filter = filter;
        this.map = map;
    }
    static create(prop, def = {}) {
        return new ChildrenDefinition(kernel.firstDefined(def.callback, `${prop}Changed`), kernel.firstDefined(def.property, prop), def.options ?? childObserverOptions$1, def.query, def.filter, def.map);
    }
}
class ChildrenObserver {
    constructor(controller, obj, propertyKey, cbName, query = defaultChildQuery, filter = defaultChildFilter, map = defaultChildMap, options) {
        this.controller = controller;
        this.obj = obj;
        this.propertyKey = propertyKey;
        this.query = query;
        this.filter = filter;
        this.map = map;
        this.options = options;
        this.observing = false;
        this.children = (void 0);
        this.observer = void 0;
        this.callback = obj[cbName];
        Reflect.defineProperty(this.obj, this.propertyKey, {
            enumerable: true,
            configurable: true,
            get: () => this.getValue(),
            set: () => { return; },
        });
    }
    getValue() {
        return this.observing ? this.children : this.get();
    }
    setValue(_value) { }
    start() {
        if (!this.observing) {
            this.observing = true;
            this.children = this.get();
            (this.observer ?? (this.observer = new this.controller.host.ownerDocument.defaultView.MutationObserver(() => { this._onChildrenChanged(); })))
                .observe(this.controller.host, this.options);
        }
    }
    stop() {
        if (this.observing) {
            this.observing = false;
            this.observer.disconnect();
            this.children = kernel.emptyArray;
        }
    }
    _onChildrenChanged() {
        this.children = this.get();
        if (this.callback !== void 0) {
            this.callback.call(this.obj);
        }
        this.subs.notify(this.children, undefined);
    }
    get() {
        return filterChildren(this.controller, this.query, this.filter, this.map);
    }
}
runtime.subscriberCollection()(ChildrenObserver);
function defaultChildQuery(controller) {
    return controller.host.childNodes;
}
function defaultChildFilter(node, controller, viewModel) {
    return !!viewModel;
}
function defaultChildMap(node, controller, viewModel) {
    return viewModel;
}
const forOpts = { optional: true };
function filterChildren(controller, query, filter, map) {
    const nodes = query(controller);
    const ii = nodes.length;
    const children = [];
    let node;
    let $controller;
    let viewModel;
    let i = 0;
    for (; i < ii; ++i) {
        node = nodes[i];
        $controller = findElementControllerFor(node, forOpts);
        viewModel = $controller?.viewModel ?? null;
        if (filter(node, $controller, viewModel)) {
            children.push(map(node, $controller, viewModel));
        }
    }
    return children;
}

const IPlatform = kernel.IPlatform;

const addListener = (target, name, handler, options) => {
    target.addEventListener(name, handler, options);
};
const removeListener = (target, name, handler, options) => {
    target.removeEventListener(name, handler, options);
};
const mixinNodeObserverUseConfig = (target) => {
    const prototype = target.prototype;
    defineHiddenProp(prototype, 'subscribe', function (subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            for (event of this._config.events) {
                addListener(this._el, event, this);
            }
            this._listened = true;
            this._start?.();
        }
    });
    defineHiddenProp(prototype, 'unsubscribe', function (subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            for (event of this._config.events) {
                removeListener(this._el, event, this);
            }
            this._listened = false;
            this._stop?.();
        }
    });
    defineHiddenProp(prototype, 'useConfig', function (config) {
        this._config = config;
        if (this._listened) {
            for (event of this._config.events) {
                removeListener(this._el, event, this);
            }
            for (event of this._config.events) {
                addListener(this._el, event, this);
            }
        }
    });
};
let event;
const mixinNoopSubscribable = (target) => {
    defineHiddenProp(target.prototype, 'subscribe', kernel.noop);
    defineHiddenProp(target.prototype, 'unsubscribe', kernel.noop);
};

class ClassAttributeAccessor {
    constructor(obj) {
        this.obj = obj;
        this.type = 2 | 4;
        this.value = '';
        this._oldValue = '';
        this._nameIndex = {};
        this._version = 0;
        this._hasChanges = false;
    }
    get doNotCache() { return true; }
    getValue() {
        return this.value;
    }
    setValue(newValue) {
        this.value = newValue;
        this._hasChanges = newValue !== this._oldValue;
        this._flushChanges();
    }
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            const currentValue = this.value;
            const nameIndex = this._nameIndex;
            const classesToAdd = getClassesToAdd(currentValue);
            let version = this._version;
            this._oldValue = currentValue;
            if (classesToAdd.length > 0) {
                this._addClassesAndUpdateIndex(classesToAdd);
            }
            this._version += 1;
            if (version === 0) {
                return;
            }
            version -= 1;
            for (const name in nameIndex) {
                if (!hasOwnProperty.call(nameIndex, name) || nameIndex[name] !== version) {
                    continue;
                }
                this.obj.classList.remove(name);
            }
        }
    }
    _addClassesAndUpdateIndex(classes) {
        const node = this.obj;
        const ii = classes.length;
        let i = 0;
        let className;
        for (; i < ii; i++) {
            className = classes[i];
            if (className.length === 0) {
                continue;
            }
            this._nameIndex[className] = this._version;
            node.classList.add(className);
        }
    }
}
function getClassesToAdd(object) {
    if (isString(object)) {
        return splitClassString(object);
    }
    if (typeof object !== 'object') {
        return kernel.emptyArray;
    }
    if (object instanceof Array) {
        const len = object.length;
        if (len > 0) {
            const classes = [];
            let i = 0;
            for (; len > i; ++i) {
                classes.push(...getClassesToAdd(object[i]));
            }
            return classes;
        }
        else {
            return kernel.emptyArray;
        }
    }
    const classes = [];
    let property;
    for (property in object) {
        if (Boolean(object[property])) {
            if (property.includes(' ')) {
                classes.push(...splitClassString(property));
            }
            else {
                classes.push(property);
            }
        }
    }
    return classes;
}
function splitClassString(classString) {
    const matches = classString.match(/\S+/g);
    if (matches === null) {
        return kernel.emptyArray;
    }
    return matches;
}
mixinNoopSubscribable(ClassAttributeAccessor);

function cssModules(...modules) {
    return new CSSModulesProcessorRegistry(modules);
}
class CSSModulesProcessorRegistry {
    constructor(modules) {
        this.modules = modules;
    }
    register(container) {
        var _a;
        const classLookup = objectAssign({}, ...this.modules);
        const ClassCustomAttribute = defineAttribute({
            name: 'class',
            bindables: ['value'],
            noMultiBindings: true,
        }, (_a = class CustomAttributeClass {
                constructor(element) {
                    this.element = element;
                }
                binding() {
                    this.valueChanged();
                }
                valueChanged() {
                    if (!this.value) {
                        this.element.className = '';
                        return;
                    }
                    this.element.className = getClassesToAdd(this.value).map(x => classLookup[x] || x).join(' ');
                }
            },
            _a.inject = [INode],
            _a));
        container.register(ClassCustomAttribute);
    }
}
function shadowCSS(...css) {
    return new ShadowDOMRegistry(css);
}
const IShadowDOMStyleFactory = createInterface('IShadowDOMStyleFactory', x => x.cachedCallback(handler => {
    if (AdoptedStyleSheetsStyles.supported(handler.get(IPlatform))) {
        return handler.get(AdoptedStyleSheetsStylesFactory);
    }
    return handler.get(StyleElementStylesFactory);
}));
class ShadowDOMRegistry {
    constructor(css) {
        this.css = css;
    }
    register(container) {
        const sharedStyles = container.get(IShadowDOMGlobalStyles);
        const factory = container.get(IShadowDOMStyleFactory);
        container.register(instanceRegistration(IShadowDOMStyles, factory.createStyles(this.css, sharedStyles)));
    }
}
class AdoptedStyleSheetsStylesFactory {
    constructor(p) {
        this.p = p;
        this.cache = new Map();
    }
    createStyles(localStyles, sharedStyles) {
        return new AdoptedStyleSheetsStyles(this.p, localStyles, this.cache, sharedStyles);
    }
}
AdoptedStyleSheetsStylesFactory.inject = [IPlatform];
class StyleElementStylesFactory {
    constructor(p) {
        this.p = p;
    }
    createStyles(localStyles, sharedStyles) {
        return new StyleElementStyles(this.p, localStyles, sharedStyles);
    }
}
StyleElementStylesFactory.inject = [IPlatform];
const IShadowDOMStyles = createInterface('IShadowDOMStyles');
const IShadowDOMGlobalStyles = createInterface('IShadowDOMGlobalStyles', x => x.instance({ applyTo: kernel.noop }));
class AdoptedStyleSheetsStyles {
    constructor(p, localStyles, styleSheetCache, sharedStyles = null) {
        this.sharedStyles = sharedStyles;
        this.styleSheets = localStyles.map(x => {
            let sheet;
            if (x instanceof p.CSSStyleSheet) {
                sheet = x;
            }
            else {
                sheet = styleSheetCache.get(x);
                if (sheet === void 0) {
                    sheet = new p.CSSStyleSheet();
                    sheet.replaceSync(x);
                    styleSheetCache.set(x, sheet);
                }
            }
            return sheet;
        });
    }
    static supported(p) {
        return 'adoptedStyleSheets' in p.ShadowRoot.prototype;
    }
    applyTo(shadowRoot) {
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(shadowRoot);
        }
        shadowRoot.adoptedStyleSheets = [
            ...shadowRoot.adoptedStyleSheets,
            ...this.styleSheets
        ];
    }
}
class StyleElementStyles {
    constructor(p, localStyles, sharedStyles = null) {
        this.p = p;
        this.localStyles = localStyles;
        this.sharedStyles = sharedStyles;
    }
    applyTo(shadowRoot) {
        const styles = this.localStyles;
        const p = this.p;
        for (let i = styles.length - 1; i > -1; --i) {
            const element = p.document.createElement('style');
            element.innerHTML = styles[i];
            shadowRoot.prepend(element);
        }
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(shadowRoot);
        }
    }
}
const StyleConfiguration = {
    shadowDOM(config) {
        return AppTask.creating(kernel.IContainer, container => {
            if (config.sharedStyles != null) {
                const factory = container.get(IShadowDOMStyleFactory);
                container.register(instanceRegistration(IShadowDOMGlobalStyles, factory.createStyles(config.sharedStyles, null)));
            }
        });
    }
};

const { enter, exit } = runtime.ConnectableSwitcher;
const { wrap, unwrap } = runtime.ProxyObservable;
class ComputedWatcher {
    constructor(obj, observerLocator, $get, cb, useProxy) {
        this.obj = obj;
        this.$get = $get;
        this.useProxy = useProxy;
        this.isBound = false;
        this.running = false;
        this._value = void 0;
        this._callback = cb;
        this.oL = observerLocator;
    }
    get value() {
        return this._value;
    }
    handleChange() {
        this.run();
    }
    handleCollectionChange() {
        this.run();
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.compute();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
    }
    run() {
        if (!this.isBound || this.running) {
            return;
        }
        const obj = this.obj;
        const oldValue = this._value;
        const newValue = this.compute();
        if (!areEqual(newValue, oldValue)) {
            this._callback.call(obj, newValue, oldValue, obj);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            enter(this);
            return this._value = unwrap(this.$get.call(void 0, this.useProxy ? wrap(this.obj) : this.obj, this));
        }
        finally {
            this.obs.clear();
            this.running = false;
            exit(this);
        }
    }
}
class ExpressionWatcher {
    constructor(scope, l, oL, expression, callback) {
        this.scope = scope;
        this.l = l;
        this.oL = oL;
        this.isBound = false;
        this.boundFn = false;
        this.obj = scope.bindingContext;
        this._expression = expression;
        this._callback = callback;
    }
    get value() {
        return this._value;
    }
    handleChange(value) {
        const expr = this._expression;
        const obj = this.obj;
        const oldValue = this._value;
        const canOptimize = expr.$kind === 1 && this.obs.count === 1;
        if (!canOptimize) {
            this.obs.version++;
            value = runtime.astEvaluate(expr, this.scope, this, this);
            this.obs.clear();
        }
        if (!areEqual(value, oldValue)) {
            this._value = value;
            this._callback.call(obj, value, oldValue, obj);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this._value = runtime.astEvaluate(this._expression, this.scope, this, this);
        this.obs.clear();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
        this._value = void 0;
    }
}
runtime.connectable(ComputedWatcher);
runtime.connectable(ExpressionWatcher);
mixinAstEvaluator(true)(ExpressionWatcher);

const ILifecycleHooks = createInterface('ILifecycleHooks');
class LifecycleHooksEntry {
    constructor(definition, instance) {
        this.definition = definition;
        this.instance = instance;
    }
}
class LifecycleHooksDefinition {
    constructor(Type, propertyNames) {
        this.Type = Type;
        this.propertyNames = propertyNames;
    }
    static create(def, Type) {
        const propertyNames = new Set();
        let proto = Type.prototype;
        while (proto !== baseObjectPrototype) {
            for (const name of getOwnPropertyNames(proto)) {
                if (name !== 'constructor') {
                    propertyNames.add(name);
                }
            }
            proto = Object.getPrototypeOf(proto);
        }
        return new LifecycleHooksDefinition(Type, propertyNames);
    }
    register(container) {
        singletonRegistration(ILifecycleHooks, this.Type).register(container);
    }
}
const containerLookup = new WeakMap();
const lhBaseName = getAnnotationKeyFor('lifecycle-hooks');
const LifecycleHooks = objectFreeze({
    name: lhBaseName,
    define(def, Type) {
        const definition = LifecycleHooksDefinition.create(def, Type);
        defineMetadata(lhBaseName, definition, Type);
        appendResourceKey(Type, lhBaseName);
        return definition.Type;
    },
    resolve(ctx) {
        let lookup = containerLookup.get(ctx);
        if (lookup === void 0) {
            containerLookup.set(ctx, lookup = new LifecycleHooksLookupImpl());
            const root = ctx.root;
            const instances = root.id === ctx.id
                ? ctx.getAll(ILifecycleHooks)
                : ctx.has(ILifecycleHooks, false)
                    ? root.getAll(ILifecycleHooks).concat(ctx.getAll(ILifecycleHooks))
                    : root.getAll(ILifecycleHooks);
            let instance;
            let definition;
            let entry;
            let name;
            let entries;
            for (instance of instances) {
                definition = getOwnMetadata(lhBaseName, instance.constructor);
                entry = new LifecycleHooksEntry(definition, instance);
                for (name of definition.propertyNames) {
                    entries = lookup[name];
                    if (entries === void 0) {
                        lookup[name] = [entry];
                    }
                    else {
                        entries.push(entry);
                    }
                }
            }
        }
        return lookup;
    },
});
class LifecycleHooksLookupImpl {
}
function lifecycleHooks() {
    return function decorator(target) {
        return LifecycleHooks.define({}, target);
    };
}

const IViewFactory = createInterface('IViewFactory');
class ViewFactory {
    constructor(container, def) {
        this.isCaching = false;
        this._cache = null;
        this._cacheSize = -1;
        this.name = def.name;
        this.container = container;
        this.def = def;
    }
    setCacheSize(size, doNotOverrideIfAlreadySet) {
        if (size) {
            if (size === '*') {
                size = ViewFactory.maxCacheSize;
            }
            else if (isString(size)) {
                size = parseInt(size, 10);
            }
            if (this._cacheSize === -1 || !doNotOverrideIfAlreadySet) {
                this._cacheSize = size;
            }
        }
        if (this._cacheSize > 0) {
            this._cache = [];
        }
        else {
            this._cache = null;
        }
        this.isCaching = this._cacheSize > 0;
    }
    canReturnToCache(_controller) {
        return this._cache != null && this._cache.length < this._cacheSize;
    }
    tryReturnToCache(controller) {
        if (this.canReturnToCache(controller)) {
            this._cache.push(controller);
            return true;
        }
        return false;
    }
    create(parentController) {
        const cache = this._cache;
        let controller;
        if (cache != null && cache.length > 0) {
            controller = cache.pop();
            return controller;
        }
        controller = Controller.$view(this, parentController);
        return controller;
    }
}
ViewFactory.maxCacheSize = 0xFFFF;

const IRendering = createInterface('IRendering', x => x.singleton(Rendering));
class Rendering {
    constructor(container) {
        this._compilationCache = new WeakMap();
        this._fragmentCache = new WeakMap();
        const ctn = container.root;
        this._platform = (this._ctn = ctn).get(IPlatform);
        this._exprParser = ctn.get(runtime.IExpressionParser);
        this._observerLocator = ctn.get(runtime.IObserverLocator);
        this._empty = new FragmentNodeSequence(this._platform, this._platform.document.createDocumentFragment());
    }
    get renderers() {
        return this._renderers ?? (this._renderers = this._ctn.getAll(IRenderer, false).reduce((all, r) => {
            all[r.target] = r;
            return all;
        }, createLookup()));
    }
    compile(definition, container, compilationInstruction) {
        if (definition.needsCompile !== false) {
            const compiledMap = this._compilationCache;
            const compiler = container.get(ITemplateCompiler);
            let compiled = compiledMap.get(definition);
            if (compiled == null) {
                compiledMap.set(definition, compiled = compiler.compile(definition, container, compilationInstruction));
            }
            else {
                container.register(...compiled.dependencies);
            }
            return compiled;
        }
        return definition;
    }
    getViewFactory(definition, container) {
        return new ViewFactory(container, CustomElementDefinition.getOrCreate(definition));
    }
    createNodes(definition) {
        if (definition.enhance === true) {
            return new FragmentNodeSequence(this._platform, definition.template);
        }
        let fragment;
        const cache = this._fragmentCache;
        if (cache.has(definition)) {
            fragment = cache.get(definition);
        }
        else {
            const p = this._platform;
            const doc = p.document;
            const template = definition.template;
            let tpl;
            if (template === null) {
                fragment = null;
            }
            else if (template instanceof p.Node) {
                if (template.nodeName === 'TEMPLATE') {
                    fragment = doc.adoptNode(template.content);
                }
                else {
                    (fragment = doc.adoptNode(doc.createDocumentFragment())).appendChild(template.cloneNode(true));
                }
            }
            else {
                tpl = doc.createElement('template');
                if (isString(template)) {
                    tpl.innerHTML = template;
                }
                doc.adoptNode(fragment = tpl.content);
            }
            cache.set(definition, fragment);
        }
        return fragment == null
            ? this._empty
            : new FragmentNodeSequence(this._platform, fragment.cloneNode(true));
    }
    render(controller, targets, definition, host) {
        const rows = definition.instructions;
        const renderers = this.renderers;
        const ii = targets.length;
        if (targets.length !== rows.length) {
            throw createError(`AUR0757: The compiled template is not aligned with the render instructions. There are ${ii} targets and ${rows.length} instructions.`);
        }
        let i = 0;
        let j = 0;
        let jj = 0;
        let row;
        let instruction;
        let target;
        if (ii > 0) {
            while (ii > i) {
                row = rows[i];
                target = targets[i];
                j = 0;
                jj = row.length;
                while (jj > j) {
                    instruction = row[j];
                    renderers[instruction.type].render(controller, target, instruction, this._platform, this._exprParser, this._observerLocator);
                    ++j;
                }
                ++i;
            }
        }
        if (host != null) {
            row = definition.surrogates;
            if ((jj = row.length) > 0) {
                j = 0;
                while (jj > j) {
                    instruction = row[j];
                    renderers[instruction.type].render(controller, host, instruction, this._platform, this._exprParser, this._observerLocator);
                    ++j;
                }
            }
        }
    }
}
Rendering.inject = [kernel.IContainer];

exports.LifecycleFlags = void 0;
(function (LifecycleFlags) {
    LifecycleFlags[LifecycleFlags["none"] = 0] = "none";
    LifecycleFlags[LifecycleFlags["fromBind"] = 1] = "fromBind";
    LifecycleFlags[LifecycleFlags["fromUnbind"] = 2] = "fromUnbind";
    LifecycleFlags[LifecycleFlags["dispose"] = 4] = "dispose";
})(exports.LifecycleFlags || (exports.LifecycleFlags = {}));
var MountTarget;
(function (MountTarget) {
    MountTarget[MountTarget["none"] = 0] = "none";
    MountTarget[MountTarget["host"] = 1] = "host";
    MountTarget[MountTarget["shadowRoot"] = 2] = "shadowRoot";
    MountTarget[MountTarget["location"] = 3] = "location";
})(MountTarget || (MountTarget = {}));
const optionalCeFind = { optional: true };
const controllerLookup = new WeakMap();
class Controller {
    constructor(container, vmKind, definition, viewFactory, viewModel, host, location) {
        this.container = container;
        this.vmKind = vmKind;
        this.definition = definition;
        this.viewFactory = viewFactory;
        this.host = host;
        this.head = null;
        this.tail = null;
        this.next = null;
        this.parent = null;
        this.bindings = null;
        this.children = null;
        this.hasLockedScope = false;
        this.isStrictBinding = false;
        this.scope = null;
        this.isBound = false;
        this.hostController = null;
        this.mountTarget = 0;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this._lifecycleHooks = null;
        this.state = 0;
        this._fullyNamed = false;
        this._childrenObs = kernel.emptyArray;
        this.flags = 0;
        this.$initiator = null;
        this.$flags = 0;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this._activatingStack = 0;
        this._detachingStack = 0;
        this._unbindingStack = 0;
        this._vm = viewModel;
        this._hooks = vmKind === 2 ? HooksDefinition.none : new HooksDefinition(viewModel);
        {
            this.logger = null;
            this.debug = false;
        }
        this.location = location;
        this._rendering = container.root.get(IRendering);
    }
    get lifecycleHooks() {
        return this._lifecycleHooks;
    }
    get isActive() {
        return (this.state & (1 | 2)) > 0 && (this.state & 4) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
                case 1:
                    return `[${this.definition.name}]`;
                case 0:
                    return this.definition.name;
                case 2:
                    return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
            case 1:
                return `${this.parent.name}>[${this.definition.name}]`;
            case 0:
                return `${this.parent.name}>${this.definition.name}`;
            case 2:
                return this.viewFactory.name === this.parent.definition?.name
                    ? `${this.parent.name}[view]`
                    : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get hooks() {
        return this._hooks;
    }
    get viewModel() {
        return this._vm;
    }
    set viewModel(v) {
        this._vm = v;
        this._hooks = v == null || this.vmKind === 2 ? HooksDefinition.none : new HooksDefinition(v);
    }
    static getCached(viewModel) {
        return controllerLookup.get(viewModel);
    }
    static getCachedOrThrow(viewModel) {
        const $el = Controller.getCached(viewModel);
        if ($el === void 0) {
            throw createError(`AUR0500: There is no cached controller for the provided ViewModel: ${viewModel}`);
        }
        return $el;
    }
    static $el(ctn, viewModel, host, hydrationInst, definition = void 0, location = null) {
        if (controllerLookup.has(viewModel)) {
            return controllerLookup.get(viewModel);
        }
        definition = definition ?? getElementDefinition(viewModel.constructor);
        const controller = new Controller(ctn, 0, definition, null, viewModel, host, location);
        const hydrationContext = ctn.get(kernel.optional(IHydrationContext));
        if (definition.dependencies.length > 0) {
            ctn.register(...definition.dependencies);
        }
        registerResolver(ctn, IHydrationContext, new kernel.InstanceProvider('IHydrationContext', new HydrationContext(controller, hydrationInst, hydrationContext)));
        controllerLookup.set(viewModel, controller);
        if (hydrationInst == null || hydrationInst.hydrate !== false) {
            controller._hydrateCustomElement(hydrationInst, hydrationContext);
        }
        return controller;
    }
    static $attr(ctn, viewModel, host, definition) {
        if (controllerLookup.has(viewModel)) {
            return controllerLookup.get(viewModel);
        }
        definition = definition ?? getAttributeDefinition(viewModel.constructor);
        const controller = new Controller(ctn, 1, definition, null, viewModel, host, null);
        if (definition.dependencies.length > 0) {
            ctn.register(...definition.dependencies);
        }
        controllerLookup.set(viewModel, controller);
        controller._hydrateCustomAttribute();
        return controller;
    }
    static $view(viewFactory, parentController = void 0) {
        const controller = new Controller(viewFactory.container, 2, null, viewFactory, null, null, null);
        controller.parent = parentController ?? null;
        controller._hydrateSynthetic();
        return controller;
    }
    _hydrateCustomElement(hydrationInst, hydrationContext) {
        {
            this.logger = this.container.get(kernel.ILogger).root;
            this.debug = this.logger.config.level <= 1;
            if (this.debug) {
                this.logger = this.logger.scopeTo(this.name);
            }
        }
        const container = this.container;
        const flags = this.flags;
        const instance = this._vm;
        let definition = this.definition;
        this.scope = runtime.Scope.create(instance, null, true);
        if (definition.watches.length > 0) {
            createWatchers(this, container, definition, instance);
        }
        createObservers(this, definition, flags, instance);
        this._childrenObs = createChildrenObservers(this, definition, instance);
        if (this._hooks.hasDefine) {
            if (this.debug) {
                this.logger.trace(`invoking define() hook`);
            }
            const result = instance.define(this, hydrationContext, definition);
            if (result !== void 0 && result !== definition) {
                definition = CustomElementDefinition.getOrCreate(result);
            }
        }
        this._lifecycleHooks = LifecycleHooks.resolve(container);
        definition.register(container);
        if (definition.injectable !== null) {
            registerResolver(container, definition.injectable, new kernel.InstanceProvider('definition.injectable', instance));
        }
        if (hydrationInst == null || hydrationInst.hydrate !== false) {
            this._hydrate(hydrationInst);
            this._hydrateChildren();
        }
    }
    _hydrate(hydrationInst) {
        if (this._lifecycleHooks.hydrating !== void 0) {
            this._lifecycleHooks.hydrating.forEach(callHydratingHook, this);
        }
        if (this._hooks.hasHydrating) {
            if (this.debug) {
                this.logger.trace(`invoking hydrating() hook`);
            }
            this._vm.hydrating(this);
        }
        const compiledDef = this._compiledDef = this._rendering.compile(this.definition, this.container, hydrationInst);
        const { shadowOptions, isStrictBinding, hasSlots, containerless } = compiledDef;
        let location = this.location;
        this.isStrictBinding = isStrictBinding;
        if ((this.hostController = findElementControllerFor(this.host, optionalCeFind)) !== null) {
            this.host = this.container.root.get(IPlatform).document.createElement(this.definition.name);
            if (containerless && location == null) {
                location = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, elementBaseName, this);
        setRef(this.host, this.definition.key, this);
        if (shadowOptions !== null || hasSlots) {
            if (location != null) {
                throw createError(`AUR0501: Cannot combine the containerless custom element option with Shadow DOM.`);
            }
            setRef(this.shadowRoot = this.host.attachShadow(shadowOptions ?? defaultShadowOptions), elementBaseName, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        }
        else if (location != null) {
            setRef(location, elementBaseName, this);
            setRef(location, this.definition.key, this);
            this.mountTarget = 3;
        }
        else {
            this.mountTarget = 1;
        }
        this._vm.$controller = this;
        this.nodes = this._rendering.createNodes(compiledDef);
        if (this._lifecycleHooks.hydrated !== void 0) {
            this._lifecycleHooks.hydrated.forEach(callHydratedHook, this);
        }
        if (this._hooks.hasHydrated) {
            if (this.debug) {
                this.logger.trace(`invoking hydrated() hook`);
            }
            this._vm.hydrated(this);
        }
    }
    _hydrateChildren() {
        this._rendering.render(this, this.nodes.findTargets(), this._compiledDef, this.host);
        if (this._lifecycleHooks.created !== void 0) {
            this._lifecycleHooks.created.forEach(callCreatedHook, this);
        }
        if (this._hooks.hasCreated) {
            if (this.debug) {
                this.logger.trace(`invoking created() hook`);
            }
            this._vm.created(this);
        }
    }
    _hydrateCustomAttribute() {
        const definition = this.definition;
        const instance = this._vm;
        if (definition.watches.length > 0) {
            createWatchers(this, this.container, definition, instance);
        }
        createObservers(this, definition, this.flags, instance);
        instance.$controller = this;
        this._lifecycleHooks = LifecycleHooks.resolve(this.container);
        if (this._lifecycleHooks.created !== void 0) {
            this._lifecycleHooks.created.forEach(callCreatedHook, this);
        }
        if (this._hooks.hasCreated) {
            if (this.debug) {
                this.logger.trace(`invoking created() hook`);
            }
            this._vm.created(this);
        }
    }
    _hydrateSynthetic() {
        this._compiledDef = this._rendering.compile(this.viewFactory.def, this.container, null);
        this.isStrictBinding = this._compiledDef.isStrictBinding;
        this._rendering.render(this, (this.nodes = this._rendering.createNodes(this._compiledDef)).findTargets(), this._compiledDef, void 0);
    }
    activate(initiator, parent, flags, scope) {
        switch (this.state) {
            case 0:
            case 8:
                if (!(parent === null || parent.isActive)) {
                    return;
                }
                this.state = 1;
                break;
            case 2:
                return;
            case 32:
                throw createError(`AUR0502: ${this.name} trying to activate a controller that is disposed.`);
            default:
                throw createError(`AUR0503: ${this.name} unexpected state: ${stringifyState(this.state)}.`);
        }
        this.parent = parent;
        if (this.debug && !this._fullyNamed) {
            this._fullyNamed = true;
            (this.logger ?? (this.logger = this.container.get(kernel.ILogger).root.scopeTo(this.name))).trace(`activate()`);
        }
        flags |= 1;
        switch (this.vmKind) {
            case 0:
                this.scope.parent = scope ?? null;
                break;
            case 1:
                this.scope = scope ?? null;
                break;
            case 2:
                if (scope === void 0 || scope === null) {
                    throw createError(`AUR0504: Scope is null or undefined`);
                }
                if (!this.hasLockedScope) {
                    this.scope = scope;
                }
                break;
        }
        if (this.isStrictBinding) ;
        this.$initiator = initiator;
        this.$flags = flags;
        this._enterActivating();
        let ret;
        if (this.vmKind !== 2 && this._lifecycleHooks.binding != null) {
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.binding()`);
            }
            ret = kernel.resolveAll(...this._lifecycleHooks.binding.map(callBindingHook, this));
        }
        if (this._hooks.hasBinding) {
            if (this.debug) {
                this.logger.trace(`binding()`);
            }
            ret = kernel.resolveAll(ret, this._vm.binding(this.$initiator, this.parent, this.$flags));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            ret.then(() => {
                this.bind();
            }).catch((err) => {
                this._reject(err);
            });
            return this.$promise;
        }
        this.bind();
        return this.$promise;
    }
    bind() {
        if (this.debug) {
            this.logger.trace(`bind()`);
        }
        let i = 0;
        let ii = this._childrenObs.length;
        let ret;
        if (ii > 0) {
            while (ii > i) {
                this._childrenObs[i].start();
                ++i;
            }
        }
        if (this.bindings !== null) {
            i = 0;
            ii = this.bindings.length;
            while (ii > i) {
                this.bindings[i].bind(this.scope);
                ++i;
            }
        }
        if (this.vmKind !== 2 && this._lifecycleHooks.bound != null) {
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.bound()`);
            }
            ret = kernel.resolveAll(...this._lifecycleHooks.bound.map(callBoundHook, this));
        }
        if (this._hooks.hasBound) {
            if (this.debug) {
                this.logger.trace(`bound()`);
            }
            ret = kernel.resolveAll(ret, this._vm.bound(this.$initiator, this.parent, this.$flags));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            ret.then(() => {
                this.isBound = true;
                this._attach();
            }).catch((err) => {
                this._reject(err);
            });
            return;
        }
        this.isBound = true;
        this._attach();
    }
    _append(...nodes) {
        switch (this.mountTarget) {
            case 1:
                this.host.append(...nodes);
                break;
            case 2:
                this.shadowRoot.append(...nodes);
                break;
            case 3: {
                let i = 0;
                for (; i < nodes.length; ++i) {
                    this.location.parentNode.insertBefore(nodes[i], this.location);
                }
                break;
            }
        }
    }
    _attach() {
        if (this.debug) {
            this.logger.trace(`attach()`);
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
                case 1:
                case 2:
                    this.hostController._append(this.host);
                    break;
                case 3:
                    this.hostController._append(this.location.$start, this.location);
                    break;
            }
        }
        switch (this.mountTarget) {
            case 1:
                this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
                break;
            case 2: {
                const container = this.container;
                const styles = container.has(IShadowDOMStyles, false)
                    ? container.get(IShadowDOMStyles)
                    : container.get(IShadowDOMGlobalStyles);
                styles.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }
            case 3:
                this.nodes.insertBefore(this.location);
                break;
        }
        let i = 0;
        let ret = void 0;
        if (this.vmKind !== 2 && this._lifecycleHooks.attaching != null) {
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.attaching()`);
            }
            ret = kernel.resolveAll(...this._lifecycleHooks.attaching.map(callAttachingHook, this));
        }
        if (this._hooks.hasAttaching) {
            if (this.debug) {
                this.logger.trace(`attaching()`);
            }
            ret = kernel.resolveAll(ret, this._vm.attaching(this.$initiator, this.parent, this.$flags));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            this._enterActivating();
            ret.then(() => {
                this._leaveActivating();
            }).catch((err) => {
                this._reject(err);
            });
        }
        if (this.children !== null) {
            for (; i < this.children.length; ++i) {
                void this.children[i].activate(this.$initiator, this, this.$flags, this.scope);
            }
        }
        this._leaveActivating();
    }
    deactivate(initiator, parent, flags) {
        switch ((this.state & ~16)) {
            case 2:
                this.state = 4;
                break;
            case 0:
            case 8:
            case 32:
            case 8 | 32:
                return;
            default:
                throw createError(`AUR0505: ${this.name} unexpected state: ${stringifyState(this.state)}.`);
        }
        if (this.debug) {
            this.logger.trace(`deactivate()`);
        }
        this.$initiator = initiator;
        this.$flags = flags;
        if (initiator === this) {
            this._enterDetaching();
        }
        let i = 0;
        let ret;
        if (this._childrenObs.length) {
            for (; i < this._childrenObs.length; ++i) {
                this._childrenObs[i].stop();
            }
        }
        if (this.children !== null) {
            for (i = 0; i < this.children.length; ++i) {
                void this.children[i].deactivate(initiator, this, flags);
            }
        }
        if (this.vmKind !== 2 && this._lifecycleHooks.detaching != null) {
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.detaching()`);
            }
            ret = kernel.resolveAll(...this._lifecycleHooks.detaching.map(callDetachingHook, this));
        }
        if (this._hooks.hasDetaching) {
            if (this.debug) {
                this.logger.trace(`detaching()`);
            }
            ret = kernel.resolveAll(ret, this._vm.detaching(this.$initiator, this.parent, this.$flags));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            initiator._enterDetaching();
            ret.then(() => {
                initiator._leaveDetaching();
            }).catch((err) => {
                initiator._reject(err);
            });
        }
        if (initiator.head === null) {
            initiator.head = this;
        }
        else {
            initiator.tail.next = this;
        }
        initiator.tail = this;
        if (initiator !== this) {
            return;
        }
        this._leaveDetaching();
        return this.$promise;
    }
    removeNodes() {
        switch (this.vmKind) {
            case 0:
            case 2:
                this.nodes.remove();
                this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
                case 1:
                case 2:
                    this.host.remove();
                    break;
                case 3:
                    this.location.$start.remove();
                    this.location.remove();
                    break;
            }
        }
    }
    unbind() {
        if (this.debug) {
            this.logger.trace(`unbind()`);
        }
        const flags = this.$flags | 2;
        let i = 0;
        if (this.bindings !== null) {
            for (; i < this.bindings.length; ++i) {
                this.bindings[i].unbind();
            }
        }
        this.parent = null;
        switch (this.vmKind) {
            case 1:
                this.scope = null;
                break;
            case 2:
                if (!this.hasLockedScope) {
                    this.scope = null;
                }
                if ((this.state & 16) === 16 &&
                    !this.viewFactory.tryReturnToCache(this) &&
                    this.$initiator === this) {
                    this.dispose();
                }
                break;
            case 0:
                this.scope.parent = null;
                break;
        }
        if ((flags & 4) === 4 && this.$initiator === this) {
            this.dispose();
        }
        this.state = (this.state & 32) | 8;
        this.$initiator = null;
        this._resolve();
    }
    _ensurePromise() {
        if (this.$promise === void 0) {
            this.$promise = new Promise((resolve, reject) => {
                this.$resolve = resolve;
                this.$reject = reject;
            });
            if (this.$initiator !== this) {
                this.parent._ensurePromise();
            }
        }
    }
    _resolve() {
        if (this.$promise !== void 0) {
            _resolve = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            _resolve();
            _resolve = void 0;
        }
    }
    _reject(err) {
        if (this.$promise !== void 0) {
            _reject = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            _reject(err);
            _reject = void 0;
        }
        if (this.$initiator !== this) {
            this.parent._reject(err);
        }
    }
    _enterActivating() {
        ++this._activatingStack;
        if (this.$initiator !== this) {
            this.parent._enterActivating();
        }
    }
    _leaveActivating() {
        if (--this._activatingStack === 0) {
            if (this.vmKind !== 2 && this._lifecycleHooks.attached != null) {
                _retPromise = kernel.resolveAll(...this._lifecycleHooks.attached.map(callAttachedHook, this));
            }
            if (this._hooks.hasAttached) {
                if (this.debug) {
                    this.logger.trace(`attached()`);
                }
                _retPromise = kernel.resolveAll(_retPromise, this._vm.attached(this.$initiator, this.$flags));
            }
            if (isPromise(_retPromise)) {
                this._ensurePromise();
                _retPromise.then(() => {
                    this.state = 2;
                    this._resolve();
                    if (this.$initiator !== this) {
                        this.parent._leaveActivating();
                    }
                }).catch((err) => {
                    this._reject(err);
                });
                _retPromise = void 0;
                return;
            }
            _retPromise = void 0;
            this.state = 2;
            this._resolve();
        }
        if (this.$initiator !== this) {
            this.parent._leaveActivating();
        }
    }
    _enterDetaching() {
        ++this._detachingStack;
    }
    _leaveDetaching() {
        if (--this._detachingStack === 0) {
            if (this.debug) {
                this.logger.trace(`detach()`);
            }
            this._enterUnbinding();
            this.removeNodes();
            let cur = this.$initiator.head;
            let ret;
            while (cur !== null) {
                if (cur !== this) {
                    if (cur.debug) {
                        cur.logger.trace(`detach()`);
                    }
                    cur.removeNodes();
                }
                if (cur.vmKind !== 2 && cur._lifecycleHooks.unbinding != null) {
                    ret = kernel.resolveAll(...cur._lifecycleHooks.unbinding.map(callUnbindingHook, this));
                }
                if (cur._hooks.hasUnbinding) {
                    if (cur.debug) {
                        cur.logger.trace('unbinding()');
                    }
                    ret = kernel.resolveAll(ret, cur.viewModel.unbinding(cur.$initiator, cur.parent, cur.$flags));
                }
                if (isPromise(ret)) {
                    this._ensurePromise();
                    this._enterUnbinding();
                    ret.then(() => {
                        this._leaveUnbinding();
                    }).catch((err) => {
                        this._reject(err);
                    });
                }
                ret = void 0;
                cur = cur.next;
            }
            this._leaveUnbinding();
        }
    }
    _enterUnbinding() {
        ++this._unbindingStack;
    }
    _leaveUnbinding() {
        if (--this._unbindingStack === 0) {
            if (this.debug) {
                this.logger.trace(`unbind()`);
            }
            let cur = this.$initiator.head;
            let next = null;
            while (cur !== null) {
                if (cur !== this) {
                    cur.isBound = false;
                    cur.unbind();
                }
                next = cur.next;
                cur.next = null;
                cur = next;
            }
            this.head = this.tail = null;
            this.isBound = false;
            this.unbind();
        }
    }
    addBinding(binding) {
        if (this.bindings === null) {
            this.bindings = [binding];
        }
        else {
            this.bindings[this.bindings.length] = binding;
        }
    }
    addChild(controller) {
        if (this.children === null) {
            this.children = [controller];
        }
        else {
            this.children[this.children.length] = controller;
        }
    }
    is(name) {
        switch (this.vmKind) {
            case 1: {
                return getAttributeDefinition(this._vm.constructor).name === name;
            }
            case 0: {
                return getElementDefinition(this._vm.constructor).name === name;
            }
            case 2:
                return this.viewFactory.name === name;
        }
    }
    lockScope(scope) {
        this.scope = scope;
        this.hasLockedScope = true;
    }
    setHost(host) {
        if (this.vmKind === 0) {
            setRef(host, elementBaseName, this);
            setRef(host, this.definition.key, this);
        }
        this.host = host;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(shadowRoot) {
        if (this.vmKind === 0) {
            setRef(shadowRoot, elementBaseName, this);
            setRef(shadowRoot, this.definition.key, this);
        }
        this.shadowRoot = shadowRoot;
        this.mountTarget = 2;
        return this;
    }
    setLocation(location) {
        if (this.vmKind === 0) {
            setRef(location, elementBaseName, this);
            setRef(location, this.definition.key, this);
        }
        this.location = location;
        this.mountTarget = 3;
        return this;
    }
    release() {
        this.state |= 16;
    }
    dispose() {
        if (this.debug) {
            this.logger.trace(`dispose()`);
        }
        if ((this.state & 32) === 32) {
            return;
        }
        this.state |= 32;
        if (this._hooks.hasDispose) {
            this._vm.dispose();
        }
        if (this.children !== null) {
            this.children.forEach(callDispose);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (this._vm !== null) {
            controllerLookup.delete(this._vm);
            this._vm = null;
        }
        this._vm = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(visitor) {
        if (visitor(this) === true) {
            return true;
        }
        if (this._hooks.hasAccept && this._vm.accept(visitor) === true) {
            return true;
        }
        if (this.children !== null) {
            const { children } = this;
            for (let i = 0, ii = children.length; i < ii; ++i) {
                if (children[i].accept(visitor) === true) {
                    return true;
                }
            }
        }
    }
}
function getLookup(instance) {
    let lookup = instance.$observers;
    if (lookup === void 0) {
        Reflect.defineProperty(instance, '$observers', {
            enumerable: false,
            value: lookup = {},
        });
    }
    return lookup;
}
function createObservers(controller, definition, _flags, instance) {
    const bindables = definition.bindables;
    const observableNames = getOwnPropertyNames(bindables);
    const length = observableNames.length;
    if (length > 0) {
        let name;
        let bindable;
        let i = 0;
        const observers = getLookup(instance);
        const container = controller.container;
        const coercionConfiguration = container.has(runtime.ICoercionConfiguration, true) ? container.get(runtime.ICoercionConfiguration) : null;
        for (; i < length; ++i) {
            name = observableNames[i];
            if (observers[name] === void 0) {
                bindable = bindables[name];
                observers[name] = new BindableObserver(instance, name, bindable.callback, bindable.set, controller, coercionConfiguration);
            }
        }
    }
}
function createChildrenObservers(controller, definition, instance) {
    const childrenObservers = definition.childrenObservers;
    const childObserverNames = getOwnPropertyNames(childrenObservers);
    const length = childObserverNames.length;
    if (length > 0) {
        const observers = getLookup(instance);
        const obs = [];
        let name;
        let i = 0;
        let childrenDescription;
        for (; i < length; ++i) {
            name = childObserverNames[i];
            if (observers[name] == null) {
                childrenDescription = childrenObservers[name];
                obs[obs.length] = observers[name] = new ChildrenObserver(controller, instance, name, childrenDescription.callback, childrenDescription.query, childrenDescription.filter, childrenDescription.map, childrenDescription.options);
            }
        }
        return obs;
    }
    return kernel.emptyArray;
}
const AccessScopeAstMap = new Map();
const getAccessScopeAst = (key) => {
    let ast = AccessScopeAstMap.get(key);
    if (ast == null) {
        ast = new runtime.AccessScopeExpression(key, 0);
        AccessScopeAstMap.set(key, ast);
    }
    return ast;
};
function createWatchers(controller, context, definition, instance) {
    const observerLocator = context.get(runtime.IObserverLocator);
    const expressionParser = context.get(runtime.IExpressionParser);
    const watches = definition.watches;
    const scope = controller.vmKind === 0
        ? controller.scope
        : runtime.Scope.create(instance, null, true);
    const ii = watches.length;
    let expression;
    let callback;
    let ast;
    let i = 0;
    for (; ii > i; ++i) {
        ({ expression, callback } = watches[i]);
        callback = isFunction(callback)
            ? callback
            : Reflect.get(instance, callback);
        if (!isFunction(callback)) {
            throw createError(`AUR0506: Invalid callback for @watch decorator: ${String(callback)}`);
        }
        if (isFunction(expression)) {
            controller.addBinding(new ComputedWatcher(instance, observerLocator, expression, callback, true));
        }
        else {
            ast = isString(expression)
                ? expressionParser.parse(expression, 16)
                : getAccessScopeAst(expression);
            controller.addBinding(new ExpressionWatcher(scope, context, observerLocator, ast, callback));
        }
    }
}
function isCustomElementController(value) {
    return value instanceof Controller && value.vmKind === 0;
}
function isCustomElementViewModel(value) {
    return metadata.isObject(value) && isElementType(value.constructor);
}
class HooksDefinition {
    constructor(target) {
        this.hasDefine = 'define' in target;
        this.hasHydrating = 'hydrating' in target;
        this.hasHydrated = 'hydrated' in target;
        this.hasCreated = 'created' in target;
        this.hasBinding = 'binding' in target;
        this.hasBound = 'bound' in target;
        this.hasAttaching = 'attaching' in target;
        this.hasAttached = 'attached' in target;
        this.hasDetaching = 'detaching' in target;
        this.hasUnbinding = 'unbinding' in target;
        this.hasDispose = 'dispose' in target;
        this.hasAccept = 'accept' in target;
    }
}
HooksDefinition.none = new HooksDefinition({});
const defaultShadowOptions = {
    mode: 'open'
};
exports.ViewModelKind = void 0;
(function (ViewModelKind) {
    ViewModelKind[ViewModelKind["customElement"] = 0] = "customElement";
    ViewModelKind[ViewModelKind["customAttribute"] = 1] = "customAttribute";
    ViewModelKind[ViewModelKind["synthetic"] = 2] = "synthetic";
})(exports.ViewModelKind || (exports.ViewModelKind = {}));
exports.State = void 0;
(function (State) {
    State[State["none"] = 0] = "none";
    State[State["activating"] = 1] = "activating";
    State[State["activated"] = 2] = "activated";
    State[State["deactivating"] = 4] = "deactivating";
    State[State["deactivated"] = 8] = "deactivated";
    State[State["released"] = 16] = "released";
    State[State["disposed"] = 32] = "disposed";
})(exports.State || (exports.State = {}));
function stringifyState(state) {
    const names = [];
    if ((state & 1) === 1) {
        names.push('activating');
    }
    if ((state & 2) === 2) {
        names.push('activated');
    }
    if ((state & 4) === 4) {
        names.push('deactivating');
    }
    if ((state & 8) === 8) {
        names.push('deactivated');
    }
    if ((state & 16) === 16) {
        names.push('released');
    }
    if ((state & 32) === 32) {
        names.push('disposed');
    }
    return names.length === 0 ? 'none' : names.join('|');
}
const IController = createInterface('IController');
const IHydrationContext = createInterface('IHydrationContext');
class HydrationContext {
    constructor(controller, instruction, parent) {
        this.instruction = instruction;
        this.parent = parent;
        this.controller = controller;
    }
}
function callDispose(disposable) {
    disposable.dispose();
}
function callCreatedHook(l) {
    l.instance.created(this._vm, this);
}
function callHydratingHook(l) {
    l.instance.hydrating(this._vm, this);
}
function callHydratedHook(l) {
    l.instance.hydrated(this._vm, this);
}
function callBindingHook(l) {
    return l.instance.binding(this._vm, this['$initiator'], this.parent, this['$flags']);
}
function callBoundHook(l) {
    return l.instance.bound(this._vm, this['$initiator'], this.parent, this['$flags']);
}
function callAttachingHook(l) {
    return l.instance.attaching(this._vm, this['$initiator'], this.parent, this['$flags']);
}
function callAttachedHook(l) {
    return l.instance.attached(this._vm, this['$initiator'], this['$flags']);
}
function callDetachingHook(l) {
    return l.instance.detaching(this._vm, this['$initiator'], this.parent, this['$flags']);
}
function callUnbindingHook(l) {
    return l.instance.unbinding(this._vm, this['$initiator'], this.parent, this['$flags']);
}
let _resolve;
let _reject;
let _retPromise;

const IAppRoot = createInterface('IAppRoot');
class AppRoot {
    constructor(config, platform, container, rootProvider) {
        this.config = config;
        this.platform = platform;
        this.container = container;
        this.controller = (void 0);
        this._hydratePromise = void 0;
        this.host = config.host;
        rootProvider.prepare(this);
        registerResolver(container, platform.HTMLElement, registerResolver(container, platform.Element, registerResolver(container, INode, new kernel.InstanceProvider('ElementResolver', config.host))));
        this._hydratePromise = kernel.onResolve(this._runAppTasks('creating'), () => {
            const component = config.component;
            const childCtn = container.createChild();
            let instance;
            if (isElementType(component)) {
                instance = this.container.get(component);
            }
            else {
                instance = config.component;
            }
            const hydrationInst = { hydrate: false, projections: null };
            const controller = (this.controller = Controller.$el(childCtn, instance, this.host, hydrationInst));
            controller._hydrateCustomElement(hydrationInst, null);
            return kernel.onResolve(this._runAppTasks('hydrating'), () => {
                controller._hydrate(null);
                return kernel.onResolve(this._runAppTasks('hydrated'), () => {
                    controller._hydrateChildren();
                    this._hydratePromise = void 0;
                });
            });
        });
    }
    activate() {
        return kernel.onResolve(this._hydratePromise, () => {
            return kernel.onResolve(this._runAppTasks('activating'), () => {
                return kernel.onResolve(this.controller.activate(this.controller, null, 1, void 0), () => {
                    return this._runAppTasks('activated');
                });
            });
        });
    }
    deactivate() {
        return kernel.onResolve(this._runAppTasks('deactivating'), () => {
            return kernel.onResolve(this.controller.deactivate(this.controller, null, 0), () => {
                return this._runAppTasks('deactivated');
            });
        });
    }
    _runAppTasks(slot) {
        return kernel.resolveAll(...this.container.getAll(IAppTask).reduce((results, task) => {
            if (task.slot === slot) {
                results.push(task.run());
            }
            return results;
        }, []));
    }
    dispose() {
        this.controller?.dispose();
    }
}

const auLocationStart = 'au-start';
const auLocationEnd = 'au-end';
const createElement = (p, name) => p.document.createElement(name);
const createComment = (p, text) => p.document.createComment(text);
const createLocation = (p) => {
    const locationEnd = createComment(p, auLocationEnd);
    locationEnd.$start = createComment(p, auLocationStart);
    return locationEnd;
};
const createText = (p, text) => p.document.createTextNode(text);
const insertBefore = (parent, newChildNode, target) => {
    return parent.insertBefore(newChildNode, target);
};
const insertManyBefore = (parent, target, newChildNodes) => {
    if (parent === null) {
        return;
    }
    const ii = newChildNodes.length;
    let i = 0;
    while (ii > i) {
        parent.insertBefore(newChildNodes[i], target);
        ++i;
    }
};
const getPreviousSibling = (node) => node.previousSibling;
const appendToTemplate = (parent, child) => {
    return parent.content.appendChild(child);
};
const appendManyToTemplate = (parent, children) => {
    const ii = children.length;
    let i = 0;
    while (ii > i) {
        parent.content.appendChild(children[i]);
        ++i;
    }
};
const markerToLocation = (el) => {
    const previousSibling = el.previousSibling;
    let locationEnd;
    if (previousSibling?.nodeType === 8 && previousSibling.textContent === 'au-end') {
        locationEnd = previousSibling;
        if ((locationEnd.$start = locationEnd.previousSibling) == null) {
            throw markerMalformedError();
        }
        el.parentNode?.removeChild(el);
        return locationEnd;
    }
    else {
        throw markerMalformedError();
    }
};
const markerMalformedError = () => createError(`AURxxxx: marker is malformed.`)
    ;

class Refs {
}
function getRef(node, name) {
    return node.$au?.[name] ?? null;
}
function setRef(node, name, controller) {
    var _a;
    ((_a = node).$au ?? (_a.$au = new Refs()))[name] = controller;
}
const INode = createInterface('INode');
const IEventTarget = createInterface('IEventTarget', x => x.cachedCallback(handler => {
    if (handler.has(IAppRoot, true)) {
        return handler.get(IAppRoot).host;
    }
    return handler.get(IPlatform).document;
}));
const IRenderLocation = createInterface('IRenderLocation');

const effectiveParentNodeOverrides = new WeakMap();
function getEffectiveParentNode(node) {
    if (effectiveParentNodeOverrides.has(node)) {
        return effectiveParentNodeOverrides.get(node);
    }
    let containerlessOffset = 0;
    let next = node.nextSibling;
    while (next !== null) {
        if (next.nodeType === 8) {
            switch (next.textContent) {
                case 'au-start':
                    ++containerlessOffset;
                    break;
                case 'au-end':
                    if (containerlessOffset-- === 0) {
                        return next;
                    }
            }
        }
        next = next.nextSibling;
    }
    if (node.parentNode === null && node.nodeType === 11) {
        const controller = findElementControllerFor(node);
        if (controller === void 0) {
            return null;
        }
        if (controller.mountTarget === 2) {
            return getEffectiveParentNode(controller.host);
        }
    }
    return node.parentNode;
}
function setEffectiveParentNode(childNodeOrNodeSequence, parentNode) {
    if (childNodeOrNodeSequence.platform !== void 0 && !(childNodeOrNodeSequence instanceof childNodeOrNodeSequence.platform.Node)) {
        const nodes = childNodeOrNodeSequence.childNodes;
        for (let i = 0, ii = nodes.length; i < ii; ++i) {
            effectiveParentNodeOverrides.set(nodes[i], parentNode);
        }
    }
    else {
        effectiveParentNodeOverrides.set(childNodeOrNodeSequence, parentNode);
    }
}
function convertToRenderLocation(node) {
    if (isRenderLocation(node)) {
        return node;
    }
    const locationEnd = node.ownerDocument.createComment('au-end');
    const locationStart = locationEnd.$start = node.ownerDocument.createComment('au-start');
    const parentNode = node.parentNode;
    if (parentNode !== null) {
        parentNode.replaceChild(locationEnd, node);
        parentNode.insertBefore(locationStart, locationEnd);
    }
    return locationEnd;
}
function isRenderLocation(node) {
    return node.textContent === 'au-end';
}
class FragmentNodeSequence {
    constructor(platform, fragment) {
        this.platform = platform;
        this.next = void 0;
        this._isMounted = false;
        this._isLinked = false;
        this.ref = null;
        this.f = fragment;
        const targetNodeList = fragment.querySelectorAll('.au');
        let i = 0;
        let ii = targetNodeList.length;
        let target;
        let targets = this.t = Array(ii);
        while (ii > i) {
            target = targetNodeList[i];
            if (target.nodeName === 'AU-M') {
                targets[i] = markerToLocation(target);
            }
            else {
                targets[i] = target;
            }
            ++i;
        }
        const childNodeList = fragment.childNodes;
        const childNodes = this.childNodes = Array(ii = childNodeList.length);
        i = 0;
        while (ii > i) {
            childNodes[i] = childNodeList[i];
            ++i;
        }
        this._firstChild = fragment.firstChild;
        this._lastChild = fragment.lastChild;
    }
    get firstChild() {
        return this._firstChild;
    }
    get lastChild() {
        return this._lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(refNode) {
        if (this._isLinked && !!this.ref) {
            this.addToLinked();
        }
        else {
            const parent = refNode.parentNode;
            if (this._isMounted) {
                let current = this._firstChild;
                let next;
                const end = this._lastChild;
                while (current != null) {
                    next = current.nextSibling;
                    parent.insertBefore(current, refNode);
                    if (current === end) {
                        break;
                    }
                    current = next;
                }
            }
            else {
                this._isMounted = true;
                refNode.parentNode.insertBefore(this.f, refNode);
            }
        }
    }
    appendTo(parent, enhance = false) {
        if (this._isMounted) {
            let current = this._firstChild;
            let next;
            const end = this._lastChild;
            while (current != null) {
                next = current.nextSibling;
                parent.appendChild(current);
                if (current === end) {
                    break;
                }
                current = next;
            }
        }
        else {
            this._isMounted = true;
            if (!enhance) {
                parent.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this._isMounted) {
            this._isMounted = false;
            const fragment = this.f;
            const end = this._lastChild;
            let next;
            let current = this._firstChild;
            while (current !== null) {
                next = current.nextSibling;
                fragment.appendChild(current);
                if (current === end) {
                    break;
                }
                current = next;
            }
        }
    }
    addToLinked() {
        const refNode = this.ref;
        const parent = refNode.parentNode;
        if (this._isMounted) {
            let current = this._firstChild;
            let next;
            const end = this._lastChild;
            while (current != null) {
                next = current.nextSibling;
                parent.insertBefore(current, refNode);
                if (current === end) {
                    break;
                }
                current = next;
            }
        }
        else {
            this._isMounted = true;
            parent.insertBefore(this.f, refNode);
        }
    }
    unlink() {
        this._isLinked = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(next) {
        this._isLinked = true;
        if (isRenderLocation(next)) {
            this.ref = next;
        }
        else {
            this.next = next;
            this._obtainRefNode();
        }
    }
    _obtainRefNode() {
        if (this.next !== void 0) {
            this.ref = this.next.firstChild;
        }
        else {
            this.ref = void 0;
        }
    }
}
const IWindow = createInterface('IWindow', x => x.callback(handler => handler.get(IPlatform).window));
const ILocation = createInterface('ILocation', x => x.callback(handler => handler.get(IWindow).location));
const IHistory = createInterface('IHistory', x => x.callback(handler => handler.get(IWindow).history));

function customElement(nameOrDef) {
    return function (target) {
        return defineElement(nameOrDef, target);
    };
}
function useShadowDOM(targetOrOptions) {
    if (targetOrOptions === void 0) {
        return function ($target) {
            annotateElementMetadata($target, 'shadowOptions', { mode: 'open' });
        };
    }
    if (!isFunction(targetOrOptions)) {
        return function ($target) {
            annotateElementMetadata($target, 'shadowOptions', targetOrOptions);
        };
    }
    annotateElementMetadata(targetOrOptions, 'shadowOptions', { mode: 'open' });
}
function containerless(target) {
    if (target === void 0) {
        return function ($target) {
            markContainerless($target);
        };
    }
    markContainerless(target);
}
function markContainerless(target) {
    const def = getOwnMetadata(elementBaseName, target);
    if (def === void 0) {
        annotateElementMetadata(target, 'containerless', true);
        return;
    }
    def.containerless = true;
}
function strict(target) {
    if (target === void 0) {
        return function ($target) {
            annotateElementMetadata($target, 'isStrictBinding', true);
        };
    }
    annotateElementMetadata(target, 'isStrictBinding', true);
}
const definitionLookup = new WeakMap();
class CustomElementDefinition {
    constructor(Type, name, aliases, key, cache, capture, template, instructions, dependencies, injectable, needsCompile, surrogates, bindables, childrenObservers, containerless, isStrictBinding, shadowOptions, hasSlots, enhance, watches, processContent) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
        this.cache = cache;
        this.capture = capture;
        this.template = template;
        this.instructions = instructions;
        this.dependencies = dependencies;
        this.injectable = injectable;
        this.needsCompile = needsCompile;
        this.surrogates = surrogates;
        this.bindables = bindables;
        this.childrenObservers = childrenObservers;
        this.containerless = containerless;
        this.isStrictBinding = isStrictBinding;
        this.shadowOptions = shadowOptions;
        this.hasSlots = hasSlots;
        this.enhance = enhance;
        this.watches = watches;
        this.processContent = processContent;
    }
    get type() { return 1; }
    static create(nameOrDef, Type = null) {
        if (Type === null) {
            const def = nameOrDef;
            if (isString(def)) {
                throw createError(`AUR0761: Cannot create a custom element definition with only a name and no type: ${nameOrDef}`);
            }
            const name = kernel.fromDefinitionOrDefault('name', def, generateElementName);
            if (isFunction(def.Type)) {
                Type = def.Type;
            }
            else {
                Type = generateElementType(kernel.pascalCase(name));
            }
            return new CustomElementDefinition(Type, name, kernel.mergeArrays(def.aliases), kernel.fromDefinitionOrDefault('key', def, () => getElementKeyFrom(name)), kernel.fromDefinitionOrDefault('cache', def, returnZero), kernel.fromDefinitionOrDefault('capture', def, returnFalse), kernel.fromDefinitionOrDefault('template', def, returnNull), kernel.mergeArrays(def.instructions), kernel.mergeArrays(def.dependencies), kernel.fromDefinitionOrDefault('injectable', def, returnNull), kernel.fromDefinitionOrDefault('needsCompile', def, returnTrue), kernel.mergeArrays(def.surrogates), Bindable.from(Type, def.bindables), Children.from(def.childrenObservers), kernel.fromDefinitionOrDefault('containerless', def, returnFalse), kernel.fromDefinitionOrDefault('isStrictBinding', def, returnFalse), kernel.fromDefinitionOrDefault('shadowOptions', def, returnNull), kernel.fromDefinitionOrDefault('hasSlots', def, returnFalse), kernel.fromDefinitionOrDefault('enhance', def, returnFalse), kernel.fromDefinitionOrDefault('watches', def, returnEmptyArray), kernel.fromAnnotationOrTypeOrDefault('processContent', Type, returnNull));
        }
        if (isString(nameOrDef)) {
            return new CustomElementDefinition(Type, nameOrDef, kernel.mergeArrays(getElementAnnotation(Type, 'aliases'), Type.aliases), getElementKeyFrom(nameOrDef), kernel.fromAnnotationOrTypeOrDefault('cache', Type, returnZero), kernel.fromAnnotationOrTypeOrDefault('capture', Type, returnFalse), kernel.fromAnnotationOrTypeOrDefault('template', Type, returnNull), kernel.mergeArrays(getElementAnnotation(Type, 'instructions'), Type.instructions), kernel.mergeArrays(getElementAnnotation(Type, 'dependencies'), Type.dependencies), kernel.fromAnnotationOrTypeOrDefault('injectable', Type, returnNull), kernel.fromAnnotationOrTypeOrDefault('needsCompile', Type, returnTrue), kernel.mergeArrays(getElementAnnotation(Type, 'surrogates'), Type.surrogates), Bindable.from(Type, ...Bindable.getAll(Type), getElementAnnotation(Type, 'bindables'), Type.bindables), Children.from(...Children.getAll(Type), getElementAnnotation(Type, 'childrenObservers'), Type.childrenObservers), kernel.fromAnnotationOrTypeOrDefault('containerless', Type, returnFalse), kernel.fromAnnotationOrTypeOrDefault('isStrictBinding', Type, returnFalse), kernel.fromAnnotationOrTypeOrDefault('shadowOptions', Type, returnNull), kernel.fromAnnotationOrTypeOrDefault('hasSlots', Type, returnFalse), kernel.fromAnnotationOrTypeOrDefault('enhance', Type, returnFalse), kernel.mergeArrays(Watch.getAnnotation(Type), Type.watches), kernel.fromAnnotationOrTypeOrDefault('processContent', Type, returnNull));
        }
        const name = kernel.fromDefinitionOrDefault('name', nameOrDef, generateElementName);
        return new CustomElementDefinition(Type, name, kernel.mergeArrays(getElementAnnotation(Type, 'aliases'), nameOrDef.aliases, Type.aliases), getElementKeyFrom(name), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('cache', nameOrDef, Type, returnZero), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('capture', nameOrDef, Type, returnFalse), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('template', nameOrDef, Type, returnNull), kernel.mergeArrays(getElementAnnotation(Type, 'instructions'), nameOrDef.instructions, Type.instructions), kernel.mergeArrays(getElementAnnotation(Type, 'dependencies'), nameOrDef.dependencies, Type.dependencies), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('injectable', nameOrDef, Type, returnNull), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('needsCompile', nameOrDef, Type, returnTrue), kernel.mergeArrays(getElementAnnotation(Type, 'surrogates'), nameOrDef.surrogates, Type.surrogates), Bindable.from(Type, ...Bindable.getAll(Type), getElementAnnotation(Type, 'bindables'), Type.bindables, nameOrDef.bindables), Children.from(...Children.getAll(Type), getElementAnnotation(Type, 'childrenObservers'), Type.childrenObservers, nameOrDef.childrenObservers), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('containerless', nameOrDef, Type, returnFalse), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('isStrictBinding', nameOrDef, Type, returnFalse), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('shadowOptions', nameOrDef, Type, returnNull), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('hasSlots', nameOrDef, Type, returnFalse), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('enhance', nameOrDef, Type, returnFalse), kernel.mergeArrays(nameOrDef.watches, Watch.getAnnotation(Type), Type.watches), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('processContent', nameOrDef, Type, returnNull));
    }
    static getOrCreate(partialDefinition) {
        if (partialDefinition instanceof CustomElementDefinition) {
            return partialDefinition;
        }
        if (definitionLookup.has(partialDefinition)) {
            return definitionLookup.get(partialDefinition);
        }
        const definition = CustomElementDefinition.create(partialDefinition);
        definitionLookup.set(partialDefinition, definition);
        defineMetadata(elementBaseName, definition, definition.Type);
        return definition;
    }
    register(container) {
        const { Type, key, aliases } = this;
        if (!container.has(key, false)) {
            transientRegistration(key, Type).register(container);
            aliasRegistration(key, Type).register(container);
            registerAliases(aliases, CustomElement, key, container);
        }
    }
}
const defaultForOpts = {
    name: undefined,
    searchParents: false,
    optional: false,
};
const returnZero = () => 0;
const returnNull = () => null;
const returnFalse = () => false;
const returnTrue = () => true;
const returnEmptyArray = () => kernel.emptyArray;
const elementBaseName = getResourceKeyFor('custom-element');
const getElementKeyFrom = (name) => `${elementBaseName}:${name}`;
const generateElementName = (() => {
    let id = 0;
    return () => `unnamed-${++id}`;
})();
const annotateElementMetadata = (Type, prop, value) => {
    defineMetadata(getAnnotationKeyFor(prop), value, Type);
};
const defineElement = (nameOrDef, Type) => {
    const definition = CustomElementDefinition.create(nameOrDef, Type);
    defineMetadata(elementBaseName, definition, definition.Type);
    defineMetadata(elementBaseName, definition, definition);
    appendResourceKey(definition.Type, elementBaseName);
    return definition.Type;
};
const isElementType = (value) => {
    return isFunction(value) && hasOwnMetadata(elementBaseName, value);
};
const findElementControllerFor = (node, opts = defaultForOpts) => {
    if (opts.name === void 0 && opts.searchParents !== true) {
        const controller = getRef(node, elementBaseName);
        if (controller === null) {
            if (opts.optional === true) {
                return null;
            }
            throw createError(`AUR0762: The provided node is not a custom element or containerless host.`);
        }
        return controller;
    }
    if (opts.name !== void 0) {
        if (opts.searchParents !== true) {
            const controller = getRef(node, elementBaseName);
            if (controller === null) {
                throw createError(`AUR0763: The provided node is not a custom element or containerless host.`);
            }
            if (controller.is(opts.name)) {
                return controller;
            }
            return (void 0);
        }
        let cur = node;
        let foundAController = false;
        while (cur !== null) {
            const controller = getRef(cur, elementBaseName);
            if (controller !== null) {
                foundAController = true;
                if (controller.is(opts.name)) {
                    return controller;
                }
            }
            cur = getEffectiveParentNode(cur);
        }
        if (foundAController) {
            return (void 0);
        }
        throw createError(`AUR0764: The provided node does does not appear to be part of an Aurelia app DOM tree, or it was added to the DOM in a way that Aurelia cannot properly resolve its position in the component tree.`);
    }
    let cur = node;
    while (cur !== null) {
        const controller = getRef(cur, elementBaseName);
        if (controller !== null) {
            return controller;
        }
        cur = getEffectiveParentNode(cur);
    }
    throw createError(`AUR0765: The provided node does does not appear to be part of an Aurelia app DOM tree, or it was added to the DOM in a way that Aurelia cannot properly resolve its position in the component tree.`);
};
const getElementAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const getElementDefinition = (Type) => {
    const def = getOwnMetadata(elementBaseName, Type);
    if (def === void 0) {
        throw createError(`AUR0760: No definition found for type ${Type.name}`);
    }
    return def;
};
const createElementInjectable = () => {
    const $injectable = function (target, property, index) {
        const annotationParamtypes = kernel.DI.getOrCreateAnnotationParamTypes(target);
        annotationParamtypes[index] = $injectable;
        return target;
    };
    $injectable.register = function (_container) {
        return {
            resolve(container, requestor) {
                if (requestor.has($injectable, true)) {
                    return requestor.get($injectable);
                }
                else {
                    return null;
                }
            },
        };
    };
    return $injectable;
};
const generateElementType = (function () {
    const nameDescriptor = {
        value: '',
        writable: false,
        enumerable: false,
        configurable: true,
    };
    const defaultProto = {};
    return function (name, proto = defaultProto) {
        const Type = class {
        };
        nameDescriptor.value = name;
        Reflect.defineProperty(Type, 'name', nameDescriptor);
        if (proto !== defaultProto) {
            objectAssign(Type.prototype, proto);
        }
        return Type;
    };
})();
const CustomElement = objectFreeze({
    name: elementBaseName,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: generateElementName,
    createInjectable: createElementInjectable,
    generateType: generateElementType,
});
const pcHookMetadataProperty = getAnnotationKeyFor('processContent');
function processContent(hook) {
    return hook === void 0
        ? function (target, propertyKey, _descriptor) {
            defineMetadata(pcHookMetadataProperty, ensureHook(target, propertyKey), target);
        }
        : function (target) {
            hook = ensureHook(target, hook);
            const def = getOwnMetadata(elementBaseName, target);
            if (def !== void 0) {
                def.processContent = hook;
            }
            else {
                defineMetadata(pcHookMetadataProperty, hook, target);
            }
            return target;
        };
}
function ensureHook(target, hook) {
    if (isString(hook)) {
        hook = target[hook];
    }
    if (!isFunction(hook)) {
        throw createError(`AUR0766: Invalid @processContent hook. Expected the hook to be a function (when defined in a class, it needs to be a static function) but got a ${typeof hook}.`);
    }
    return hook;
}
function capture(targetOrFilter) {
    return function ($target) {
        const value = isFunction(targetOrFilter) ? targetOrFilter : true;
        annotateElementMetadata($target, 'capture', value);
        if (isElementType($target)) {
            getElementDefinition($target).capture = value;
        }
    };
}

const IProjections = createInterface("IProjections");
const IAuSlotsInfo = createInterface('IAuSlotsInfo');
class AuSlotsInfo {
    constructor(projectedSlots) {
        this.projectedSlots = projectedSlots;
    }
}

exports.InstructionType = void 0;
(function (InstructionType) {
    InstructionType["hydrateElement"] = "ra";
    InstructionType["hydrateAttribute"] = "rb";
    InstructionType["hydrateTemplateController"] = "rc";
    InstructionType["hydrateLetElement"] = "rd";
    InstructionType["setProperty"] = "re";
    InstructionType["interpolation"] = "rf";
    InstructionType["propertyBinding"] = "rg";
    InstructionType["letBinding"] = "ri";
    InstructionType["refBinding"] = "rj";
    InstructionType["iteratorBinding"] = "rk";
    InstructionType["multiAttr"] = "rl";
    InstructionType["textBinding"] = "ha";
    InstructionType["listenerBinding"] = "hb";
    InstructionType["attributeBinding"] = "hc";
    InstructionType["stylePropertyBinding"] = "hd";
    InstructionType["setAttribute"] = "he";
    InstructionType["setClassAttribute"] = "hf";
    InstructionType["setStyleAttribute"] = "hg";
    InstructionType["spreadBinding"] = "hs";
    InstructionType["spreadElementProp"] = "hp";
})(exports.InstructionType || (exports.InstructionType = {}));
const IInstruction = createInterface('Instruction');
function isInstruction(value) {
    const type = value.type;
    return isString(type) && type.length === 2;
}
class InterpolationInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = "rf";
    }
}
class PropertyBindingInstruction {
    constructor(from, to, mode) {
        this.from = from;
        this.to = to;
        this.mode = mode;
        this.type = "rg";
    }
}
class IteratorBindingInstruction {
    constructor(forOf, to, props) {
        this.forOf = forOf;
        this.to = to;
        this.props = props;
        this.type = "rk";
    }
}
class RefBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = "rj";
    }
}
class SetPropertyInstruction {
    constructor(value, to) {
        this.value = value;
        this.to = to;
        this.type = "re";
    }
}
class MultiAttrInstruction {
    constructor(value, to, command) {
        this.value = value;
        this.to = to;
        this.command = command;
        this.type = "rl";
    }
}
class HydrateElementInstruction {
    constructor(res, alias, props, projections, containerless, captures) {
        this.res = res;
        this.alias = alias;
        this.props = props;
        this.projections = projections;
        this.containerless = containerless;
        this.captures = captures;
        this.type = "ra";
        this.auSlot = null;
    }
}
class HydrateAttributeInstruction {
    constructor(res, alias, props) {
        this.res = res;
        this.alias = alias;
        this.props = props;
        this.type = "rb";
    }
}
class HydrateTemplateController {
    constructor(def, res, alias, props) {
        this.def = def;
        this.res = res;
        this.alias = alias;
        this.props = props;
        this.type = "rc";
    }
}
class HydrateLetElementInstruction {
    constructor(instructions, toBindingContext) {
        this.instructions = instructions;
        this.toBindingContext = toBindingContext;
        this.type = "rd";
    }
}
class LetBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = "ri";
    }
}
class TextBindingInstruction {
    constructor(from, strict) {
        this.from = from;
        this.strict = strict;
        this.type = "ha";
    }
}
class ListenerBindingInstruction {
    constructor(from, to, preventDefault, capture) {
        this.from = from;
        this.to = to;
        this.preventDefault = preventDefault;
        this.capture = capture;
        this.type = "hb";
    }
}
class StylePropertyBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = "hd";
    }
}
class SetAttributeInstruction {
    constructor(value, to) {
        this.value = value;
        this.to = to;
        this.type = "he";
    }
}
class SetClassAttributeInstruction {
    constructor(value) {
        this.value = value;
        this.type = "hf";
    }
}
class SetStyleAttributeInstruction {
    constructor(value) {
        this.value = value;
        this.type = "hg";
    }
}
class AttributeBindingInstruction {
    constructor(attr, from, to) {
        this.attr = attr;
        this.from = from;
        this.to = to;
        this.type = "hc";
    }
}
class SpreadBindingInstruction {
    constructor() {
        this.type = "hs";
    }
}
class SpreadElementPropBindingInstruction {
    constructor(instructions) {
        this.instructions = instructions;
        this.type = "hp";
    }
}
const ITemplateCompiler = createInterface('ITemplateCompiler');
const IRenderer = createInterface('IRenderer');
function renderer(targetType) {
    return function decorator(target) {
        target.register = function (container) {
            singletonRegistration(IRenderer, this).register(container);
        };
        defineProp(target.prototype, 'target', {
            configurable: true,
            get: function () { return targetType; }
        });
        return target;
    };
}
function ensureExpression(parser, srcOrExpr, expressionType) {
    if (isString(srcOrExpr)) {
        return parser.parse(srcOrExpr, expressionType);
    }
    return srcOrExpr;
}
function getTarget(potentialTarget) {
    if (potentialTarget.viewModel != null) {
        return potentialTarget.viewModel;
    }
    return potentialTarget;
}
function getRefTarget(refHost, refTargetName) {
    if (refTargetName === 'element') {
        return refHost;
    }
    switch (refTargetName) {
        case 'controller':
            return findElementControllerFor(refHost);
        case 'view':
            throw createError(`AUR0750: Not supported API`);
        case 'view-model':
            return findElementControllerFor(refHost).viewModel;
        default: {
            const caController = findAttributeControllerFor(refHost, refTargetName);
            if (caController !== void 0) {
                return caController.viewModel;
            }
            const ceController = findElementControllerFor(refHost, { name: refTargetName });
            if (ceController === void 0) {
                throw createError(`AUR0751: Attempted to reference "${refTargetName}", but it was not found amongst the target's API.`);
            }
            return ceController.viewModel;
        }
    }
}
exports.SetPropertyRenderer = class SetPropertyRenderer {
    render(renderingCtrl, target, instruction) {
        const obj = getTarget(target);
        if (obj.$observers?.[instruction.to] !== void 0) {
            obj.$observers[instruction.to].setValue(instruction.value);
        }
        else {
            obj[instruction.to] = instruction.value;
        }
    }
};
exports.SetPropertyRenderer = __decorate([
    renderer("re")
], exports.SetPropertyRenderer);
exports.CustomElementRenderer = class CustomElementRenderer {
    constructor(rendering) {
        this._rendering = rendering;
    }
    static get inject() { return [IRendering]; }
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        let def;
        let Ctor;
        let component;
        let childCtrl;
        const res = instruction.res;
        const projections = instruction.projections;
        const ctxContainer = renderingCtrl.container;
        switch (typeof res) {
            case 'string':
                def = ctxContainer.find(CustomElement, res);
                if (def == null) {
                    throw createError(`AUR0752: Element ${res} is not registered in ${renderingCtrl['name']}.`);
                }
                break;
            default:
                def = res;
        }
        const containerless = instruction.containerless || def.containerless;
        const location = containerless ? convertToRenderLocation(target) : null;
        const container = createElementContainer(platform, renderingCtrl, target, instruction, location, projections == null ? void 0 : new AuSlotsInfo(objectKeys(projections)));
        Ctor = def.Type;
        component = container.invoke(Ctor);
        registerResolver(container, Ctor, new kernel.InstanceProvider(def.key, component));
        childCtrl = Controller.$el(container, component, target, instruction, def, location);
        setRef(target, def.key, childCtrl);
        const renderers = this._rendering.renderers;
        const props = instruction.props;
        const ii = props.length;
        let i = 0;
        let propInst;
        while (ii > i) {
            propInst = props[i];
            renderers[propInst.type].render(renderingCtrl, childCtrl, propInst, platform, exprParser, observerLocator);
            ++i;
        }
        renderingCtrl.addChild(childCtrl);
    }
};
exports.CustomElementRenderer = __decorate([
    renderer("ra")
], exports.CustomElementRenderer);
exports.CustomAttributeRenderer = class CustomAttributeRenderer {
    constructor(rendering) {
        this._rendering = rendering;
    }
    static get inject() { return [IRendering]; }
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        let ctxContainer = renderingCtrl.container;
        let def;
        switch (typeof instruction.res) {
            case 'string':
                def = ctxContainer.find(CustomAttribute, instruction.res);
                if (def == null) {
                    throw createError(`AUR0753: Attribute ${instruction.res} is not registered in ${renderingCtrl['name']}.`);
                }
                break;
            default:
                def = instruction.res;
        }
        const results = invokeAttribute(platform, def, renderingCtrl, target, instruction, void 0, void 0);
        const childController = Controller.$attr(results.ctn, results.vm, target, def);
        setRef(target, def.key, childController);
        const renderers = this._rendering.renderers;
        const props = instruction.props;
        const ii = props.length;
        let i = 0;
        let propInst;
        while (ii > i) {
            propInst = props[i];
            renderers[propInst.type].render(renderingCtrl, childController, propInst, platform, exprParser, observerLocator);
            ++i;
        }
        renderingCtrl.addChild(childController);
    }
};
exports.CustomAttributeRenderer = __decorate([
    renderer("rb")
], exports.CustomAttributeRenderer);
exports.TemplateControllerRenderer = class TemplateControllerRenderer {
    constructor(rendering, platform) {
        this._rendering = rendering;
        this._platform = platform;
    }
    static get inject() { return [IRendering, IPlatform]; }
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        let ctxContainer = renderingCtrl.container;
        let def;
        switch (typeof instruction.res) {
            case 'string':
                def = ctxContainer.find(CustomAttribute, instruction.res);
                if (def == null) {
                    throw createError(`AUR0754: Attribute ${instruction.res} is not registered in ${renderingCtrl['name']}.`);
                }
                break;
            default:
                def = instruction.res;
        }
        const viewFactory = this._rendering.getViewFactory(instruction.def, ctxContainer);
        const renderLocation = convertToRenderLocation(target);
        const results = invokeAttribute(this._platform, def, renderingCtrl, target, instruction, viewFactory, renderLocation);
        const childController = Controller.$attr(results.ctn, results.vm, target, def);
        setRef(renderLocation, def.key, childController);
        results.vm.link?.(renderingCtrl, childController, target, instruction);
        const renderers = this._rendering.renderers;
        const props = instruction.props;
        const ii = props.length;
        let i = 0;
        let propInst;
        while (ii > i) {
            propInst = props[i];
            renderers[propInst.type].render(renderingCtrl, childController, propInst, platform, exprParser, observerLocator);
            ++i;
        }
        renderingCtrl.addChild(childController);
    }
};
exports.TemplateControllerRenderer = __decorate([
    renderer("rc")
], exports.TemplateControllerRenderer);
exports.LetElementRenderer = class LetElementRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        target.remove();
        const childInstructions = instruction.instructions;
        const toBindingContext = instruction.toBindingContext;
        const container = renderingCtrl.container;
        const ii = childInstructions.length;
        let childInstruction;
        let expr;
        let i = 0;
        while (ii > i) {
            childInstruction = childInstructions[i];
            expr = ensureExpression(exprParser, childInstruction.from, 16);
            renderingCtrl.addBinding(new LetBinding(container, observerLocator, expr, childInstruction.to, toBindingContext));
            ++i;
        }
    }
};
exports.LetElementRenderer = __decorate([
    renderer("rd")
], exports.LetElementRenderer);
exports.RefBindingRenderer = class RefBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser) {
        renderingCtrl.addBinding(new RefBinding(renderingCtrl.container, ensureExpression(exprParser, instruction.from, 16), getRefTarget(target, instruction.to)));
    }
};
exports.RefBindingRenderer = __decorate([
    renderer("rj")
], exports.RefBindingRenderer);
exports.InterpolationBindingRenderer = class InterpolationBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new InterpolationBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, 1), getTarget(target), instruction.to, 2));
    }
};
exports.InterpolationBindingRenderer = __decorate([
    renderer("rf")
], exports.InterpolationBindingRenderer);
exports.PropertyBindingRenderer = class PropertyBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new PropertyBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, 16), getTarget(target), instruction.to, instruction.mode));
    }
};
exports.PropertyBindingRenderer = __decorate([
    renderer("rg")
], exports.PropertyBindingRenderer);
exports.IteratorBindingRenderer = class IteratorBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new PropertyBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.forOf, 2), getTarget(target), instruction.to, 2));
    }
};
exports.IteratorBindingRenderer = __decorate([
    renderer("rk")
], exports.IteratorBindingRenderer);
exports.TextBindingRenderer = class TextBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new ContentBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, platform, ensureExpression(exprParser, instruction.from, 16), insertBefore(target.parentNode, createText(platform, ''), target), instruction.strict));
    }
};
exports.TextBindingRenderer = __decorate([
    renderer("ha")
], exports.TextBindingRenderer);
exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser) {
        renderingCtrl.addBinding(new ListenerBinding(renderingCtrl.container, ensureExpression(exprParser, instruction.from, 8), target, instruction.to, new ListenerBindingOptions(instruction.preventDefault, instruction.capture)));
    }
};
exports.ListenerBindingRenderer = __decorate([
    renderer("hb")
], exports.ListenerBindingRenderer);
exports.SetAttributeRenderer = class SetAttributeRenderer {
    render(_, target, instruction) {
        target.setAttribute(instruction.to, instruction.value);
    }
};
exports.SetAttributeRenderer = __decorate([
    renderer("he")
], exports.SetAttributeRenderer);
exports.SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(_, target, instruction) {
        addClasses(target.classList, instruction.value);
    }
};
exports.SetClassAttributeRenderer = __decorate([
    renderer("hf")
], exports.SetClassAttributeRenderer);
exports.SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(_, target, instruction) {
        target.style.cssText += instruction.value;
    }
};
exports.SetStyleAttributeRenderer = __decorate([
    renderer("hg")
], exports.SetStyleAttributeRenderer);
exports.StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new PropertyBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, 16), target.style, instruction.to, 2));
    }
};
exports.StylePropertyBindingRenderer = __decorate([
    renderer("hd")
], exports.StylePropertyBindingRenderer);
exports.AttributeBindingRenderer = class AttributeBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new AttributeBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, 16), target, instruction.attr, instruction.to, 2));
    }
};
exports.AttributeBindingRenderer = __decorate([
    renderer("hc")
], exports.AttributeBindingRenderer);
exports.SpreadRenderer = class SpreadRenderer {
    constructor(_compiler, _rendering) {
        this._compiler = _compiler;
        this._rendering = _rendering;
    }
    static get inject() { return [ITemplateCompiler, IRendering]; }
    render(renderingCtrl, target, _instruction, platform, exprParser, observerLocator) {
        const container = renderingCtrl.container;
        const hydrationContext = container.get(IHydrationContext);
        const renderers = this._rendering.renderers;
        const getHydrationContext = (ancestor) => {
            let currentLevel = ancestor;
            let currentContext = hydrationContext;
            while (currentContext != null && currentLevel > 0) {
                currentContext = currentContext.parent;
                --currentLevel;
            }
            if (currentContext == null) {
                throw createError('No scope context for spread binding.');
            }
            return currentContext;
        };
        const renderSpreadInstruction = (ancestor) => {
            const context = getHydrationContext(ancestor);
            const spreadBinding = createSurrogateBinding(context);
            const instructions = this._compiler.compileSpread(context.controller.definition, context.instruction?.captures ?? kernel.emptyArray, context.controller.container, target);
            let inst;
            for (inst of instructions) {
                switch (inst.type) {
                    case "hs":
                        renderSpreadInstruction(ancestor + 1);
                        break;
                    case "hp":
                        renderers[inst.instructions.type].render(spreadBinding, findElementControllerFor(target), inst.instructions, platform, exprParser, observerLocator);
                        break;
                    default:
                        renderers[inst.type].render(spreadBinding, target, inst, platform, exprParser, observerLocator);
                }
            }
            renderingCtrl.addBinding(spreadBinding);
        };
        renderSpreadInstruction(0);
    }
};
exports.SpreadRenderer = __decorate([
    renderer("hs")
], exports.SpreadRenderer);
class SpreadBinding {
    constructor(_innerBindings, _hydrationContext) {
        this._innerBindings = _innerBindings;
        this._hydrationContext = _hydrationContext;
        this.isBound = false;
        this.ctrl = _hydrationContext.controller;
        this.locator = this.ctrl.container;
    }
    get container() {
        return this.locator;
    }
    get definition() {
        return this.ctrl.definition;
    }
    get isStrictBinding() {
        return this.ctrl.isStrictBinding;
    }
    get state() {
        return this.ctrl.state;
    }
    get(key) {
        return this.locator.get(key);
    }
    bind(_scope) {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        const innerScope = this.scope = this._hydrationContext.controller.scope.parent ?? void 0;
        if (innerScope == null) {
            throw createError('Invalid spreading. Context scope is null/undefined');
        }
        this._innerBindings.forEach(b => b.bind(innerScope));
    }
    unbind() {
        this._innerBindings.forEach(b => b.unbind());
        this.isBound = false;
    }
    addBinding(binding) {
        this._innerBindings.push(binding);
    }
    addChild(controller) {
        if (controller.vmKind !== 1) {
            throw createError('Spread binding does not support spreading custom attributes/template controllers');
        }
        this.ctrl.addChild(controller);
    }
    limit() {
        throw createError('not implemented');
    }
    useScope() {
        throw createError('not implemented');
    }
}
function addClasses(classList, className) {
    const len = className.length;
    let start = 0;
    for (let i = 0; i < len; ++i) {
        if (className.charCodeAt(i) === 0x20) {
            if (i !== start) {
                classList.add(className.slice(start, i));
            }
            start = i + 1;
        }
        else if (i + 1 === len) {
            classList.add(className.slice(start));
        }
    }
}
const createSurrogateBinding = (context) => new SpreadBinding([], context);
const controllerProviderName = 'IController';
const instructionProviderName = 'IInstruction';
const locationProviderName = 'IRenderLocation';
const slotInfoProviderName = 'IAuSlotsInfo';
function createElementContainer(p, renderingCtrl, host, instruction, location, auSlotsInfo) {
    const ctn = renderingCtrl.container.createChild();
    registerResolver(ctn, p.HTMLElement, registerResolver(ctn, p.Element, registerResolver(ctn, INode, new kernel.InstanceProvider('ElementResolver', host))));
    registerResolver(ctn, IController, new kernel.InstanceProvider(controllerProviderName, renderingCtrl));
    registerResolver(ctn, IInstruction, new kernel.InstanceProvider(instructionProviderName, instruction));
    registerResolver(ctn, IRenderLocation, location == null
        ? noLocationProvider
        : new RenderLocationProvider(location));
    registerResolver(ctn, IViewFactory, noViewFactoryProvider);
    registerResolver(ctn, IAuSlotsInfo, auSlotsInfo == null
        ? noAuSlotProvider
        : new kernel.InstanceProvider(slotInfoProviderName, auSlotsInfo));
    return ctn;
}
class ViewFactoryProvider {
    constructor(factory) {
        this.f = factory;
    }
    get $isResolver() { return true; }
    resolve() {
        const f = this.f;
        if (f === null) {
            throw createError(`AUR7055: Cannot resolve ViewFactory before the provider was prepared.`);
        }
        if (!isString(f.name) || f.name.length === 0) {
            throw createError(`AUR0756: Cannot resolve ViewFactory without a (valid) name.`);
        }
        return f;
    }
}
function invokeAttribute(p, definition, renderingCtrl, host, instruction, viewFactory, location, auSlotsInfo) {
    const ctn = renderingCtrl.container.createChild();
    registerResolver(ctn, p.HTMLElement, registerResolver(ctn, p.Element, registerResolver(ctn, INode, new kernel.InstanceProvider('ElementResolver', host))));
    renderingCtrl = renderingCtrl instanceof Controller
        ? renderingCtrl
        : renderingCtrl.ctrl;
    registerResolver(ctn, IController, new kernel.InstanceProvider(controllerProviderName, renderingCtrl));
    registerResolver(ctn, IInstruction, new kernel.InstanceProvider(instructionProviderName, instruction));
    registerResolver(ctn, IRenderLocation, location == null
        ? noLocationProvider
        : new kernel.InstanceProvider(locationProviderName, location));
    registerResolver(ctn, IViewFactory, viewFactory == null
        ? noViewFactoryProvider
        : new ViewFactoryProvider(viewFactory));
    registerResolver(ctn, IAuSlotsInfo, auSlotsInfo == null
        ? noAuSlotProvider
        : new kernel.InstanceProvider(slotInfoProviderName, auSlotsInfo));
    return { vm: ctn.invoke(definition.Type), ctn };
}
class RenderLocationProvider {
    constructor(_location) {
        this._location = _location;
    }
    get name() { return 'IRenderLocation'; }
    get $isResolver() { return true; }
    resolve() {
        return this._location;
    }
}
const noLocationProvider = new RenderLocationProvider(null);
const noViewFactoryProvider = new ViewFactoryProvider(null);
const noAuSlotProvider = new kernel.InstanceProvider(slotInfoProviderName, new AuSlotsInfo(kernel.emptyArray));

exports.CommandType = void 0;
(function (CommandType) {
    CommandType[CommandType["None"] = 0] = "None";
    CommandType[CommandType["IgnoreAttr"] = 1] = "IgnoreAttr";
})(exports.CommandType || (exports.CommandType = {}));
function bindingCommand(nameOrDefinition) {
    return function (target) {
        return BindingCommand.define(nameOrDefinition, target);
    };
}
class BindingCommandDefinition {
    constructor(Type, name, aliases, key, type) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
        this.type = type;
    }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new BindingCommandDefinition(Type, kernel.firstDefined(getCommandAnnotation(Type, 'name'), name), kernel.mergeArrays(getCommandAnnotation(Type, 'aliases'), def.aliases, Type.aliases), getCommandKeyFrom(name), kernel.firstDefined(getCommandAnnotation(Type, 'type'), def.type, Type.type, null));
    }
    register(container) {
        const { Type, key, aliases } = this;
        singletonRegistration(key, Type).register(container);
        aliasRegistration(key, Type).register(container);
        registerAliases(aliases, BindingCommand, key, container);
    }
}
const cmdBaseName = getResourceKeyFor('binding-command');
const getCommandKeyFrom = (name) => `${cmdBaseName}:${name}`;
const getCommandAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const BindingCommand = objectFreeze({
    name: cmdBaseName,
    keyFrom: getCommandKeyFrom,
    define(nameOrDef, Type) {
        const definition = BindingCommandDefinition.create(nameOrDef, Type);
        defineMetadata(cmdBaseName, definition, definition.Type);
        defineMetadata(cmdBaseName, definition, definition);
        appendResourceKey(Type, cmdBaseName);
        return definition.Type;
    },
    getAnnotation: getCommandAnnotation,
});
exports.OneTimeBindingCommand = class OneTimeBindingCommand {
    get type() { return 0; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        let value = info.attr.rawValue;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                ?? kernel.camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = kernel.camelCase(target);
            }
            target = info.bindable.property;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, 16), target, 1);
    }
};
exports.OneTimeBindingCommand = __decorate([
    bindingCommand('one-time')
], exports.OneTimeBindingCommand);
exports.ToViewBindingCommand = class ToViewBindingCommand {
    get type() { return 0; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        let value = info.attr.rawValue;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                ?? kernel.camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = kernel.camelCase(target);
            }
            target = info.bindable.property;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, 16), target, 2);
    }
};
exports.ToViewBindingCommand = __decorate([
    bindingCommand('to-view')
], exports.ToViewBindingCommand);
exports.FromViewBindingCommand = class FromViewBindingCommand {
    get type() { return 0; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        let value = attr.rawValue;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                ?? kernel.camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = kernel.camelCase(target);
            }
            target = info.bindable.property;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, 16), target, 4);
    }
};
exports.FromViewBindingCommand = __decorate([
    bindingCommand('from-view')
], exports.FromViewBindingCommand);
exports.TwoWayBindingCommand = class TwoWayBindingCommand {
    get type() { return 0; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        let value = attr.rawValue;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                ?? kernel.camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = kernel.camelCase(target);
            }
            target = info.bindable.property;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, 16), target, 6);
    }
};
exports.TwoWayBindingCommand = __decorate([
    bindingCommand('two-way')
], exports.TwoWayBindingCommand);
exports.DefaultBindingCommand = class DefaultBindingCommand {
    get type() { return 0; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        const bindable = info.bindable;
        let defaultMode;
        let mode;
        let target = attr.target;
        let value = attr.rawValue;
        if (bindable == null) {
            mode = attrMapper.isTwoWay(info.node, target) ? 6 : 2;
            target = attrMapper.map(info.node, target)
                ?? kernel.camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = kernel.camelCase(target);
            }
            defaultMode = info.def.defaultBindingMode;
            mode = bindable.mode === 8 || bindable.mode == null
                ? defaultMode == null || defaultMode === 8
                    ? 2
                    : defaultMode
                : bindable.mode;
            target = bindable.property;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, 16), target, mode);
    }
};
exports.DefaultBindingCommand = __decorate([
    bindingCommand('bind')
], exports.DefaultBindingCommand);
exports.ForBindingCommand = class ForBindingCommand {
    constructor(attrParser) {
        this._attrParser = attrParser;
    }
    get type() { return 0; }
    static get inject() { return [IAttributeParser]; }
    build(info, exprParser) {
        const target = info.bindable === null
            ? kernel.camelCase(info.attr.target)
            : info.bindable.property;
        const forOf = exprParser.parse(info.attr.rawValue, 2);
        let props = kernel.emptyArray;
        if (forOf.semiIdx > -1) {
            const attr = info.attr.rawValue.slice(forOf.semiIdx + 1);
            const i = attr.indexOf(':');
            if (i > -1) {
                const attrName = attr.slice(0, i).trim();
                const attrValue = attr.slice(i + 1).trim();
                const attrSyntax = this._attrParser.parse(attrName, attrValue);
                props = [new MultiAttrInstruction(attrValue, attrSyntax.target, attrSyntax.command)];
            }
        }
        return new IteratorBindingInstruction(forOf, target, props);
    }
};
exports.ForBindingCommand = __decorate([
    bindingCommand('for')
], exports.ForBindingCommand);
exports.TriggerBindingCommand = class TriggerBindingCommand {
    get type() { return 1; }
    build(info, exprParser) {
        return new ListenerBindingInstruction(exprParser.parse(info.attr.rawValue, 8), info.attr.target, true, false);
    }
};
exports.TriggerBindingCommand = __decorate([
    bindingCommand('trigger')
], exports.TriggerBindingCommand);
exports.CaptureBindingCommand = class CaptureBindingCommand {
    get type() { return 1; }
    build(info, exprParser) {
        return new ListenerBindingInstruction(exprParser.parse(info.attr.rawValue, 8), info.attr.target, false, true);
    }
};
exports.CaptureBindingCommand = __decorate([
    bindingCommand('capture')
], exports.CaptureBindingCommand);
exports.AttrBindingCommand = class AttrBindingCommand {
    get type() { return 1; }
    build(info, exprParser) {
        return new AttributeBindingInstruction(info.attr.target, exprParser.parse(info.attr.rawValue, 16), info.attr.target);
    }
};
exports.AttrBindingCommand = __decorate([
    bindingCommand('attr')
], exports.AttrBindingCommand);
exports.StyleBindingCommand = class StyleBindingCommand {
    get type() { return 1; }
    build(info, exprParser) {
        return new AttributeBindingInstruction('style', exprParser.parse(info.attr.rawValue, 16), info.attr.target);
    }
};
exports.StyleBindingCommand = __decorate([
    bindingCommand('style')
], exports.StyleBindingCommand);
exports.ClassBindingCommand = class ClassBindingCommand {
    get type() { return 1; }
    build(info, exprParser) {
        return new AttributeBindingInstruction('class', exprParser.parse(info.attr.rawValue, 16), info.attr.target);
    }
};
exports.ClassBindingCommand = __decorate([
    bindingCommand('class')
], exports.ClassBindingCommand);
let RefBindingCommand = class RefBindingCommand {
    get type() { return 1; }
    build(info, exprParser) {
        return new RefBindingInstruction(exprParser.parse(info.attr.rawValue, 16), info.attr.target);
    }
};
RefBindingCommand = __decorate([
    bindingCommand('ref')
], RefBindingCommand);
let SpreadBindingCommand = class SpreadBindingCommand {
    get type() { return 1; }
    build(_info) {
        return new SpreadBindingInstruction();
    }
};
SpreadBindingCommand = __decorate([
    bindingCommand('...$attrs')
], SpreadBindingCommand);

const ISVGAnalyzer = createInterface('ISVGAnalyzer', x => x.singleton(NoopSVGAnalyzer));
const o = (keys) => {
    const lookup = createLookup();
    keys = isString(keys) ? keys.split(' ') : keys;
    let key;
    for (key of keys) {
        lookup[key] = true;
    }
    return lookup;
};
class NoopSVGAnalyzer {
    isStandardSvgAttribute(_node, _attributeName) {
        return false;
    }
}
class SVGAnalyzer {
    constructor(platform) {
        this._svgElements = objectAssign(createLookup(), {
            'a': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'altGlyph': o('class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'altglyph': createLookup(),
            'altGlyphDef': o('id xml:base xml:lang xml:space'),
            'altglyphdef': createLookup(),
            'altGlyphItem': o('id xml:base xml:lang xml:space'),
            'altglyphitem': createLookup(),
            'animate': o('accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'animateColor': o('accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'animateMotion': o('accumulate additive begin by calcMode dur end externalResourcesRequired fill from id keyPoints keySplines keyTimes max min onbegin onend onload onrepeat origin path repeatCount repeatDur requiredExtensions requiredFeatures restart rotate systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'animateTransform': o('accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to type values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'circle': o('class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup r requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'clipPath': o('class clipPathUnits externalResourcesRequired id requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'color-profile': o('id local name rendering-intent xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'cursor': o('externalResourcesRequired id requiredExtensions requiredFeatures systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'defs': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'desc': o('class id style xml:base xml:lang xml:space'),
            'ellipse': o('class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform xml:base xml:lang xml:space'),
            'feBlend': o('class height id in in2 mode result style width x xml:base xml:lang xml:space y'),
            'feColorMatrix': o('class height id in result style type values width x xml:base xml:lang xml:space y'),
            'feComponentTransfer': o('class height id in result style width x xml:base xml:lang xml:space y'),
            'feComposite': o('class height id in in2 k1 k2 k3 k4 operator result style width x xml:base xml:lang xml:space y'),
            'feConvolveMatrix': o('bias class divisor edgeMode height id in kernelMatrix kernelUnitLength order preserveAlpha result style targetX targetY width x xml:base xml:lang xml:space y'),
            'feDiffuseLighting': o('class diffuseConstant height id in kernelUnitLength result style surfaceScale width x xml:base xml:lang xml:space y'),
            'feDisplacementMap': o('class height id in in2 result scale style width x xChannelSelector xml:base xml:lang xml:space y yChannelSelector'),
            'feDistantLight': o('azimuth elevation id xml:base xml:lang xml:space'),
            'feFlood': o('class height id result style width x xml:base xml:lang xml:space y'),
            'feFuncA': o('amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space'),
            'feFuncB': o('amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space'),
            'feFuncG': o('amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space'),
            'feFuncR': o('amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space'),
            'feGaussianBlur': o('class height id in result stdDeviation style width x xml:base xml:lang xml:space y'),
            'feImage': o('class externalResourcesRequired height id preserveAspectRatio result style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'feMerge': o('class height id result style width x xml:base xml:lang xml:space y'),
            'feMergeNode': o('id xml:base xml:lang xml:space'),
            'feMorphology': o('class height id in operator radius result style width x xml:base xml:lang xml:space y'),
            'feOffset': o('class dx dy height id in result style width x xml:base xml:lang xml:space y'),
            'fePointLight': o('id x xml:base xml:lang xml:space y z'),
            'feSpecularLighting': o('class height id in kernelUnitLength result specularConstant specularExponent style surfaceScale width x xml:base xml:lang xml:space y'),
            'feSpotLight': o('id limitingConeAngle pointsAtX pointsAtY pointsAtZ specularExponent x xml:base xml:lang xml:space y z'),
            'feTile': o('class height id in result style width x xml:base xml:lang xml:space y'),
            'feTurbulence': o('baseFrequency class height id numOctaves result seed stitchTiles style type width x xml:base xml:lang xml:space y'),
            'filter': o('class externalResourcesRequired filterRes filterUnits height id primitiveUnits style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'font': o('class externalResourcesRequired horiz-adv-x horiz-origin-x horiz-origin-y id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space'),
            'font-face': o('accent-height alphabetic ascent bbox cap-height descent font-family font-size font-stretch font-style font-variant font-weight hanging id ideographic mathematical overline-position overline-thickness panose-1 slope stemh stemv strikethrough-position strikethrough-thickness underline-position underline-thickness unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical widths x-height xml:base xml:lang xml:space'),
            'font-face-format': o('id string xml:base xml:lang xml:space'),
            'font-face-name': o('id name xml:base xml:lang xml:space'),
            'font-face-src': o('id xml:base xml:lang xml:space'),
            'font-face-uri': o('id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'foreignObject': o('class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xml:base xml:lang xml:space y'),
            'g': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'glyph': o('arabic-form class d glyph-name horiz-adv-x id lang orientation style unicode vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space'),
            'glyphRef': o('class dx dy format glyphRef id style x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'glyphref': createLookup(),
            'hkern': o('g1 g2 id k u1 u2 xml:base xml:lang xml:space'),
            'image': o('class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'line': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform x1 x2 xml:base xml:lang xml:space y1 y2'),
            'linearGradient': o('class externalResourcesRequired gradientTransform gradientUnits id spreadMethod style x1 x2 xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y1 y2'),
            'marker': o('class externalResourcesRequired id markerHeight markerUnits markerWidth orient preserveAspectRatio refX refY style viewBox xml:base xml:lang xml:space'),
            'mask': o('class externalResourcesRequired height id maskContentUnits maskUnits requiredExtensions requiredFeatures style systemLanguage width x xml:base xml:lang xml:space y'),
            'metadata': o('id xml:base xml:lang xml:space'),
            'missing-glyph': o('class d horiz-adv-x id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space'),
            'mpath': o('externalResourcesRequired id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'path': o('class d externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup pathLength requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'pattern': o('class externalResourcesRequired height id patternContentUnits patternTransform patternUnits preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage viewBox width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'polygon': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'polyline': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'radialGradient': o('class cx cy externalResourcesRequired fx fy gradientTransform gradientUnits id r spreadMethod style xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space'),
            'rect': o('class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform width x xml:base xml:lang xml:space y'),
            'script': o('externalResourcesRequired id type xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'set': o('attributeName attributeType begin dur end externalResourcesRequired fill id max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'stop': o('class id offset style xml:base xml:lang xml:space'),
            'style': o('id media title type xml:base xml:lang xml:space'),
            'svg': o('baseProfile class contentScriptType contentStyleType externalResourcesRequired height id onabort onactivate onclick onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onresize onscroll onunload onzoom preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage version viewBox width x xml:base xml:lang xml:space y zoomAndPan'),
            'switch': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'symbol': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio style viewBox xml:base xml:lang xml:space'),
            'text': o('class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength transform x xml:base xml:lang xml:space y'),
            'textPath': o('class externalResourcesRequired id lengthAdjust method onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures spacing startOffset style systemLanguage textLength xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space'),
            'title': o('class id style xml:base xml:lang xml:space'),
            'tref': o('class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y'),
            'tspan': o('class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xml:base xml:lang xml:space y'),
            'use': o('class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'view': o('externalResourcesRequired id preserveAspectRatio viewBox viewTarget xml:base xml:lang xml:space zoomAndPan'),
            'vkern': o('g1 g2 id k u1 u2 xml:base xml:lang xml:space'),
        });
        this._svgPresentationElements = o('a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use');
        this._svgPresentationAttributes = o('alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode');
        this.SVGElement = platform.globalThis.SVGElement;
        const div = platform.document.createElement('div');
        div.innerHTML = '<svg><altGlyph /></svg>';
        if (div.firstElementChild.nodeName === 'altglyph') {
            const svg = this._svgElements;
            let tmp = svg.altGlyph;
            svg.altGlyph = svg.altglyph;
            svg.altglyph = tmp;
            tmp = svg.altGlyphDef;
            svg.altGlyphDef = svg.altglyphdef;
            svg.altglyphdef = tmp;
            tmp = svg.altGlyphItem;
            svg.altGlyphItem = svg.altglyphitem;
            svg.altglyphitem = tmp;
            tmp = svg.glyphRef;
            svg.glyphRef = svg.glyphref;
            svg.glyphref = tmp;
        }
    }
    static register(container) {
        return singletonRegistration(ISVGAnalyzer, this).register(container);
    }
    isStandardSvgAttribute(node, attributeName) {
        if (!(node instanceof this.SVGElement)) {
            return false;
        }
        return (this._svgPresentationElements[node.nodeName] === true && this._svgPresentationAttributes[attributeName] === true ||
            this._svgElements[node.nodeName]?.[attributeName] === true);
    }
}
SVGAnalyzer.inject = [IPlatform];

const IAttrMapper = createInterface('IAttrMapper', x => x.singleton(AttrMapper));
class AttrMapper {
    constructor(svg) {
        this.svg = svg;
        this.fns = [];
        this._tagAttrMap = createLookup();
        this._globalAttrMap = createLookup();
        this.useMapping({
            LABEL: { for: 'htmlFor' },
            IMG: { usemap: 'useMap' },
            INPUT: {
                maxlength: 'maxLength',
                minlength: 'minLength',
                formaction: 'formAction',
                formenctype: 'formEncType',
                formmethod: 'formMethod',
                formnovalidate: 'formNoValidate',
                formtarget: 'formTarget',
                inputmode: 'inputMode',
            },
            TEXTAREA: { maxlength: 'maxLength' },
            TD: { rowspan: 'rowSpan', colspan: 'colSpan' },
            TH: { rowspan: 'rowSpan', colspan: 'colSpan' },
        });
        this.useGlobalMapping({
            accesskey: 'accessKey',
            contenteditable: 'contentEditable',
            tabindex: 'tabIndex',
            textcontent: 'textContent',
            innerhtml: 'innerHTML',
            scrolltop: 'scrollTop',
            scrollleft: 'scrollLeft',
            readonly: 'readOnly',
        });
    }
    static get inject() { return [ISVGAnalyzer]; }
    useMapping(config) {
        var _a;
        let newAttrMapping;
        let targetAttrMapping;
        let tagName;
        let attr;
        for (tagName in config) {
            newAttrMapping = config[tagName];
            targetAttrMapping = (_a = this._tagAttrMap)[tagName] ?? (_a[tagName] = createLookup());
            for (attr in newAttrMapping) {
                if (targetAttrMapping[attr] !== void 0) {
                    throw createMappedError(attr, tagName);
                }
                targetAttrMapping[attr] = newAttrMapping[attr];
            }
        }
    }
    useGlobalMapping(config) {
        const mapper = this._globalAttrMap;
        for (const attr in config) {
            if (mapper[attr] !== void 0) {
                throw createMappedError(attr, '*');
            }
            mapper[attr] = config[attr];
        }
    }
    useTwoWay(fn) {
        this.fns.push(fn);
    }
    isTwoWay(node, attrName) {
        return shouldDefaultToTwoWay(node, attrName)
            || this.fns.length > 0 && this.fns.some(fn => fn(node, attrName));
    }
    map(node, attr) {
        return this._tagAttrMap[node.nodeName]?.[attr]
            ?? this._globalAttrMap[attr]
            ?? (isDataAttribute(node, attr, this.svg)
                ? attr
                : null);
    }
}
function shouldDefaultToTwoWay(element, attr) {
    switch (element.nodeName) {
        case 'INPUT':
            switch (element.type) {
                case 'checkbox':
                case 'radio':
                    return attr === 'checked';
                default:
                    return attr === 'value' || attr === 'files' || attr === 'value-as-number' || attr === 'value-as-date';
            }
        case 'TEXTAREA':
        case 'SELECT':
            return attr === 'value';
        default:
            switch (attr) {
                case 'textcontent':
                case 'innerhtml':
                    return element.hasAttribute('contenteditable');
                case 'scrolltop':
                case 'scrollleft':
                    return true;
                default:
                    return false;
            }
    }
}
function createMappedError(attr, tagName) {
    return createError(`Attribute ${attr} has been already registered for ${tagName === '*' ? 'all elements' : `<${tagName}/>`}`);
}

const ITemplateElementFactory = createInterface('ITemplateElementFactory', x => x.singleton(TemplateElementFactory));
const markupCache = {};
class TemplateElementFactory {
    constructor(p) {
        this.p = p;
        this._template = createTemplate(this.p);
    }
    createTemplate(input) {
        if (isString(input)) {
            let result = markupCache[input];
            if (result === void 0) {
                const template = this._template;
                template.innerHTML = input;
                const node = template.content.firstElementChild;
                if (node == null || node.nodeName !== 'TEMPLATE' || node.nextElementSibling != null) {
                    this._template = createTemplate(this.p);
                    result = template;
                }
                else {
                    template.content.removeChild(node);
                    result = node;
                }
                markupCache[input] = result;
            }
            return result.cloneNode(true);
        }
        if (input.nodeName !== 'TEMPLATE') {
            const template = createTemplate(this.p);
            template.content.appendChild(input);
            return template;
        }
        input.parentNode?.removeChild(input);
        return input.cloneNode(true);
    }
}
TemplateElementFactory.inject = [IPlatform];
const createTemplate = (p) => p.document.createElement('template');

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(container) {
        return singletonRegistration(ITemplateCompiler, this).register(container);
    }
    compile(partialDefinition, container, compilationInstruction) {
        const definition = CustomElementDefinition.getOrCreate(partialDefinition);
        if (definition.template === null || definition.template === void 0) {
            return definition;
        }
        if (definition.needsCompile === false) {
            return definition;
        }
        compilationInstruction ?? (compilationInstruction = emptyCompilationInstructions);
        const context = new CompilationContext(partialDefinition, container, compilationInstruction, null, null, void 0);
        const template = isString(definition.template) || !partialDefinition.enhance
            ? context._templateFactory.createTemplate(definition.template)
            : definition.template;
        const isTemplateElement = template.nodeName === TEMPLATE_NODE_NAME && template.content != null;
        const content = isTemplateElement ? template.content : template;
        const hooks = container.get(allResources(ITemplateCompilerHooks));
        const ii = hooks.length;
        let i = 0;
        if (ii > 0) {
            while (ii > i) {
                hooks[i].compiling?.(template);
                ++i;
            }
        }
        if (template.hasAttribute(localTemplateIdentifier)) {
            throw createError(`AUR0701: The root cannot be a local template itself.`);
        }
        this._compileLocalElement(content, context);
        this._compileNode(content, context);
        return CustomElementDefinition.create({
            ...partialDefinition,
            name: partialDefinition.name || generateElementName(),
            dependencies: (partialDefinition.dependencies ?? kernel.emptyArray).concat(context.deps ?? kernel.emptyArray),
            instructions: context.rows,
            surrogates: isTemplateElement
                ? this._compileSurrogate(template, context)
                : kernel.emptyArray,
            template,
            hasSlots: context.hasSlot,
            needsCompile: false,
        });
    }
    compileSpread(definition, attrSyntaxs, container, el) {
        const context = new CompilationContext(definition, container, emptyCompilationInstructions, null, null, void 0);
        const instructions = [];
        const elDef = context._findElement(el.nodeName.toLowerCase());
        const isCustomElement = elDef !== null;
        const exprParser = context._exprParser;
        const ii = attrSyntaxs.length;
        let i = 0;
        let attrSyntax;
        let attrDef = null;
        let attrInstructions;
        let attrBindableInstructions;
        let bindablesInfo;
        let bindable;
        let primaryBindable;
        let bindingCommand = null;
        let expr;
        let isMultiBindings;
        let attrTarget;
        let attrValue;
        for (; ii > i; ++i) {
            attrSyntax = attrSyntaxs[i];
            attrTarget = attrSyntax.target;
            attrValue = attrSyntax.rawValue;
            bindingCommand = context._createCommand(attrSyntax);
            if (bindingCommand !== null && (bindingCommand.type & 1) > 0) {
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
                continue;
            }
            attrDef = context._findAttr(attrTarget);
            if (attrDef !== null) {
                if (attrDef.isTemplateController) {
                    throw createError(`AUR0703: Spreading template controller ${attrTarget} is not supported.`);
                }
                bindablesInfo = BindablesInfo.from(attrDef, true);
                isMultiBindings = attrDef.noMultiBindings === false
                    && bindingCommand === null
                    && hasInlineBindings(attrValue);
                if (isMultiBindings) {
                    attrBindableInstructions = this._compileMultiBindings(el, attrValue, attrDef, context);
                }
                else {
                    primaryBindable = bindablesInfo.primary;
                    if (bindingCommand === null) {
                        expr = exprParser.parse(attrValue, 1);
                        attrBindableInstructions = [
                            expr === null
                                ? new SetPropertyInstruction(attrValue, primaryBindable.property)
                                : new InterpolationInstruction(expr, primaryBindable.property)
                        ];
                    }
                    else {
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = primaryBindable;
                        commandBuildInfo.def = attrDef;
                        attrBindableInstructions = [bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper)];
                    }
                }
                (attrInstructions ?? (attrInstructions = [])).push(new HydrateAttributeInstruction(this.resolveResources ? attrDef : attrDef.name, attrDef.aliases != null && attrDef.aliases.includes(attrTarget) ? attrTarget : void 0, attrBindableInstructions));
                continue;
            }
            if (bindingCommand === null) {
                expr = exprParser.parse(attrValue, 1);
                if (isCustomElement) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    bindable = bindablesInfo.attrs[attrTarget];
                    if (bindable !== void 0) {
                        expr = exprParser.parse(attrValue, 1);
                        instructions.push(new SpreadElementPropBindingInstruction(expr == null
                            ? new SetPropertyInstruction(attrValue, bindable.property)
                            : new InterpolationInstruction(expr, bindable.property)));
                        continue;
                    }
                }
                if (expr != null) {
                    instructions.push(new InterpolationInstruction(expr, context._attrMapper.map(el, attrTarget) ?? kernel.camelCase(attrTarget)));
                }
                else {
                    switch (attrTarget) {
                        case 'class':
                            instructions.push(new SetClassAttributeInstruction(attrValue));
                            break;
                        case 'style':
                            instructions.push(new SetStyleAttributeInstruction(attrValue));
                            break;
                        default:
                            instructions.push(new SetAttributeInstruction(attrValue, attrTarget));
                    }
                }
            }
            else {
                if (isCustomElement) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    bindable = bindablesInfo.attrs[attrTarget];
                    if (bindable !== void 0) {
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = bindable;
                        commandBuildInfo.def = elDef;
                        instructions.push(new SpreadElementPropBindingInstruction(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper)));
                        continue;
                    }
                }
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
            }
        }
        resetCommandBuildInfo();
        if (attrInstructions != null) {
            return attrInstructions.concat(instructions);
        }
        return instructions;
    }
    _compileSurrogate(el, context) {
        const instructions = [];
        const attrs = el.attributes;
        const exprParser = context._exprParser;
        let ii = attrs.length;
        let i = 0;
        let attr;
        let attrName;
        let attrValue;
        let attrSyntax;
        let attrDef = null;
        let attrInstructions;
        let attrBindableInstructions;
        let bindableInfo;
        let primaryBindable;
        let bindingCommand = null;
        let expr;
        let isMultiBindings;
        let realAttrTarget;
        let realAttrValue;
        for (; ii > i; ++i) {
            attr = attrs[i];
            attrName = attr.name;
            attrValue = attr.value;
            attrSyntax = context._attrParser.parse(attrName, attrValue);
            realAttrTarget = attrSyntax.target;
            realAttrValue = attrSyntax.rawValue;
            if (invalidSurrogateAttribute[realAttrTarget]) {
                throw createError(`AUR0702: Attribute ${attrName} is invalid on surrogate.`);
            }
            bindingCommand = context._createCommand(attrSyntax);
            if (bindingCommand !== null && (bindingCommand.type & 1) > 0) {
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
                continue;
            }
            attrDef = context._findAttr(realAttrTarget);
            if (attrDef !== null) {
                if (attrDef.isTemplateController) {
                    throw createError(`AUR0703: Template controller ${realAttrTarget} is invalid on surrogate.`);
                }
                bindableInfo = BindablesInfo.from(attrDef, true);
                isMultiBindings = attrDef.noMultiBindings === false
                    && bindingCommand === null
                    && hasInlineBindings(realAttrValue);
                if (isMultiBindings) {
                    attrBindableInstructions = this._compileMultiBindings(el, realAttrValue, attrDef, context);
                }
                else {
                    primaryBindable = bindableInfo.primary;
                    if (bindingCommand === null) {
                        expr = exprParser.parse(realAttrValue, 1);
                        attrBindableInstructions = [
                            expr === null
                                ? new SetPropertyInstruction(realAttrValue, primaryBindable.property)
                                : new InterpolationInstruction(expr, primaryBindable.property)
                        ];
                    }
                    else {
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = primaryBindable;
                        commandBuildInfo.def = attrDef;
                        attrBindableInstructions = [bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper)];
                    }
                }
                el.removeAttribute(attrName);
                --i;
                --ii;
                (attrInstructions ?? (attrInstructions = [])).push(new HydrateAttributeInstruction(this.resolveResources ? attrDef : attrDef.name, attrDef.aliases != null && attrDef.aliases.includes(realAttrTarget) ? realAttrTarget : void 0, attrBindableInstructions));
                continue;
            }
            if (bindingCommand === null) {
                expr = exprParser.parse(realAttrValue, 1);
                if (expr != null) {
                    el.removeAttribute(attrName);
                    --i;
                    --ii;
                    instructions.push(new InterpolationInstruction(expr, context._attrMapper.map(el, realAttrTarget) ?? kernel.camelCase(realAttrTarget)));
                }
                else {
                    switch (attrName) {
                        case 'class':
                            instructions.push(new SetClassAttributeInstruction(realAttrValue));
                            break;
                        case 'style':
                            instructions.push(new SetStyleAttributeInstruction(realAttrValue));
                            break;
                        default:
                            instructions.push(new SetAttributeInstruction(realAttrValue, attrName));
                    }
                }
            }
            else {
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
            }
        }
        resetCommandBuildInfo();
        if (attrInstructions != null) {
            return attrInstructions.concat(instructions);
        }
        return instructions;
    }
    _compileNode(node, context) {
        switch (node.nodeType) {
            case 1:
                switch (node.nodeName) {
                    case 'LET':
                        return this._compileLet(node, context);
                    default:
                        return this._compileElement(node, context);
                }
            case 3:
                return this._compileText(node, context);
            case 11: {
                let current = node.firstChild;
                while (current !== null) {
                    current = this._compileNode(current, context);
                }
                break;
            }
        }
        return node.nextSibling;
    }
    _compileLet(el, context) {
        const attrs = el.attributes;
        const ii = attrs.length;
        const letInstructions = [];
        const exprParser = context._exprParser;
        let toBindingContext = false;
        let i = 0;
        let attr;
        let attrSyntax;
        let attrName;
        let attrValue;
        let bindingCommand;
        let realAttrTarget;
        let realAttrValue;
        let expr;
        for (; ii > i; ++i) {
            attr = attrs[i];
            attrName = attr.name;
            attrValue = attr.value;
            if (attrName === 'to-binding-context') {
                toBindingContext = true;
                continue;
            }
            attrSyntax = context._attrParser.parse(attrName, attrValue);
            realAttrTarget = attrSyntax.target;
            realAttrValue = attrSyntax.rawValue;
            bindingCommand = context._createCommand(attrSyntax);
            if (bindingCommand !== null) {
                if (attrSyntax.command === 'bind') {
                    letInstructions.push(new LetBindingInstruction(exprParser.parse(realAttrValue, 16), kernel.camelCase(realAttrTarget)));
                }
                else {
                    throw createError(`AUR0704: Invalid command ${attrSyntax.command} for <let>. Only to-view/bind supported.`);
                }
                continue;
            }
            expr = exprParser.parse(realAttrValue, 1);
            if (expr === null) {
                {
                    context._logger.warn(`Property ${realAttrTarget} is declared with literal string ${realAttrValue}. ` +
                        `Did you mean ${realAttrTarget}.bind="${realAttrValue}"?`);
                }
            }
            letInstructions.push(new LetBindingInstruction(expr === null ? new runtime.PrimitiveLiteralExpression(realAttrValue) : expr, kernel.camelCase(realAttrTarget)));
        }
        context.rows.push([new HydrateLetElementInstruction(letInstructions, toBindingContext)]);
        return this._markAsTarget(el).nextSibling;
    }
    _compileElement(el, context) {
        var _a, _b, _c, _d;
        const nextSibling = el.nextSibling;
        const elName = (el.getAttribute('as-element') ?? el.nodeName).toLowerCase();
        const elDef = context._findElement(elName);
        const isCustomElement = elDef !== null;
        const isShadowDom = isCustomElement && elDef.shadowOptions != null;
        const capture = elDef?.capture;
        const hasCaptureFilter = capture != null && typeof capture !== 'boolean';
        const captures = capture ? [] : kernel.emptyArray;
        const exprParser = context._exprParser;
        const removeAttr = this.debug
            ? kernel.noop
            : () => {
                el.removeAttribute(attrName);
                --i;
                --ii;
            };
        let attrs = el.attributes;
        let instructions;
        let ii = attrs.length;
        let i = 0;
        let attr;
        let attrName;
        let attrValue;
        let attrSyntax;
        let plainAttrInstructions;
        let elBindableInstructions;
        let attrDef = null;
        let isMultiBindings = false;
        let bindable;
        let attrInstructions;
        let attrBindableInstructions;
        let tcInstructions;
        let tcInstruction;
        let expr;
        let elementInstruction;
        let bindingCommand = null;
        let bindablesInfo;
        let primaryBindable;
        let realAttrTarget;
        let realAttrValue;
        let processContentResult = true;
        let hasContainerless = false;
        let canCapture = false;
        if (elName === 'slot') {
            if (context.root.def.shadowOptions == null) {
                throw createError(`AUR0717: detect a usage of "<slot>" element without specifying shadow DOM options in element: ${context.root.def.name}`);
            }
            context.root.hasSlot = true;
        }
        if (isCustomElement) {
            processContentResult = elDef.processContent?.call(elDef.Type, el, context.p);
            attrs = el.attributes;
            ii = attrs.length;
        }
        if (context.root.def.enhance && el.classList.contains('au')) {
            throw createError(`AUR0705: `
                    + 'Trying to enhance with a template that was probably compiled before. '
                    + 'This is likely going to cause issues. '
                    + 'Consider enhancing only untouched elements or first remove all "au" classes.');
        }
        for (; ii > i; ++i) {
            attr = attrs[i];
            attrName = attr.name;
            attrValue = attr.value;
            switch (attrName) {
                case 'as-element':
                case 'containerless':
                    removeAttr();
                    if (!hasContainerless) {
                        hasContainerless = attrName === 'containerless';
                    }
                    continue;
            }
            attrSyntax = context._attrParser.parse(attrName, attrValue);
            bindingCommand = context._createCommand(attrSyntax);
            realAttrTarget = attrSyntax.target;
            realAttrValue = attrSyntax.rawValue;
            if (capture && (!hasCaptureFilter || hasCaptureFilter && capture(realAttrTarget))) {
                if (bindingCommand != null && bindingCommand.type & 1) {
                    removeAttr();
                    captures.push(attrSyntax);
                    continue;
                }
                canCapture = realAttrTarget !== AU_SLOT && realAttrTarget !== 'slot';
                if (canCapture) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    if (bindablesInfo.attrs[realAttrTarget] == null && !context._findAttr(realAttrTarget)?.isTemplateController) {
                        removeAttr();
                        captures.push(attrSyntax);
                        continue;
                    }
                }
            }
            if (bindingCommand !== null && bindingCommand.type & 1) {
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                (plainAttrInstructions ?? (plainAttrInstructions = [])).push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
                removeAttr();
                continue;
            }
            attrDef = context._findAttr(realAttrTarget);
            if (attrDef !== null) {
                bindablesInfo = BindablesInfo.from(attrDef, true);
                isMultiBindings = attrDef.noMultiBindings === false
                    && bindingCommand === null
                    && hasInlineBindings(realAttrValue);
                if (isMultiBindings) {
                    attrBindableInstructions = this._compileMultiBindings(el, realAttrValue, attrDef, context);
                }
                else {
                    primaryBindable = bindablesInfo.primary;
                    if (bindingCommand === null) {
                        expr = exprParser.parse(realAttrValue, 1);
                        attrBindableInstructions = [
                            expr === null
                                ? new SetPropertyInstruction(realAttrValue, primaryBindable.property)
                                : new InterpolationInstruction(expr, primaryBindable.property)
                        ];
                    }
                    else {
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = primaryBindable;
                        commandBuildInfo.def = attrDef;
                        attrBindableInstructions = [bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper)];
                    }
                }
                removeAttr();
                if (attrDef.isTemplateController) {
                    (tcInstructions ?? (tcInstructions = [])).push(new HydrateTemplateController(voidDefinition, this.resolveResources ? attrDef : attrDef.name, void 0, attrBindableInstructions));
                }
                else {
                    (attrInstructions ?? (attrInstructions = [])).push(new HydrateAttributeInstruction(this.resolveResources ? attrDef : attrDef.name, attrDef.aliases != null && attrDef.aliases.includes(realAttrTarget) ? realAttrTarget : void 0, attrBindableInstructions));
                }
                continue;
            }
            if (bindingCommand === null) {
                if (isCustomElement) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    bindable = bindablesInfo.attrs[realAttrTarget];
                    if (bindable !== void 0) {
                        expr = exprParser.parse(realAttrValue, 1);
                        (elBindableInstructions ?? (elBindableInstructions = [])).push(expr == null
                            ? new SetPropertyInstruction(realAttrValue, bindable.property)
                            : new InterpolationInstruction(expr, bindable.property));
                        removeAttr();
                        continue;
                    }
                }
                expr = exprParser.parse(realAttrValue, 1);
                if (expr != null) {
                    removeAttr();
                    (plainAttrInstructions ?? (plainAttrInstructions = [])).push(new InterpolationInstruction(expr, context._attrMapper.map(el, realAttrTarget) ?? kernel.camelCase(realAttrTarget)));
                }
                continue;
            }
            removeAttr();
            if (isCustomElement) {
                bindablesInfo = BindablesInfo.from(elDef, false);
                bindable = bindablesInfo.attrs[realAttrTarget];
                if (bindable !== void 0) {
                    commandBuildInfo.node = el;
                    commandBuildInfo.attr = attrSyntax;
                    commandBuildInfo.bindable = bindable;
                    commandBuildInfo.def = elDef;
                    (elBindableInstructions ?? (elBindableInstructions = [])).push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
                    continue;
                }
            }
            commandBuildInfo.node = el;
            commandBuildInfo.attr = attrSyntax;
            commandBuildInfo.bindable = null;
            commandBuildInfo.def = null;
            (plainAttrInstructions ?? (plainAttrInstructions = [])).push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
        }
        resetCommandBuildInfo();
        if (this._shouldReorderAttrs(el) && plainAttrInstructions != null && plainAttrInstructions.length > 1) {
            this._reorder(el, plainAttrInstructions);
        }
        if (isCustomElement) {
            elementInstruction = new HydrateElementInstruction(this.resolveResources ? elDef : elDef.name, void 0, (elBindableInstructions ?? kernel.emptyArray), null, hasContainerless, captures);
            if (elName === AU_SLOT) {
                const slotName = el.getAttribute('name') || DEFAULT_SLOT_NAME;
                const template = context.t();
                const fallbackContentContext = context._createChild();
                let node = el.firstChild;
                while (node !== null) {
                    if (node.nodeType === 1 && node.hasAttribute(AU_SLOT)) {
                        el.removeChild(node);
                    }
                    else {
                        appendToTemplate(template, node);
                    }
                    node = el.firstChild;
                }
                this._compileNode(template.content, fallbackContentContext);
                elementInstruction.auSlot = {
                    name: slotName,
                    fallback: CustomElementDefinition.create({
                        name: generateElementName(),
                        template,
                        instructions: fallbackContentContext.rows,
                        needsCompile: false,
                    }),
                };
                el = this._replaceByMarker(el, context);
            }
        }
        if (plainAttrInstructions != null
            || elementInstruction != null
            || attrInstructions != null) {
            instructions = kernel.emptyArray.concat(elementInstruction ?? kernel.emptyArray, attrInstructions ?? kernel.emptyArray, plainAttrInstructions ?? kernel.emptyArray);
            this._markAsTarget(el);
        }
        let shouldCompileContent;
        if (tcInstructions != null) {
            ii = tcInstructions.length - 1;
            i = ii;
            tcInstruction = tcInstructions[i];
            let template;
            if (isMarker(el)) {
                template = context.t();
                appendManyToTemplate(template, [context._comment(auStartComment), context._comment(auEndComment), this._markAsTarget(context.h(MARKER_NODE_NAME))]);
            }
            else {
                this._replaceByMarker(el, context);
                if (el.nodeName === 'TEMPLATE') {
                    template = el;
                }
                else {
                    template = context.t();
                    appendToTemplate(template, el);
                }
            }
            const mostInnerTemplate = template;
            const childContext = context._createChild(instructions == null ? [] : [instructions]);
            let childEl;
            let targetSlot;
            let projections;
            let slotTemplateRecord;
            let slotTemplates;
            let slotTemplate;
            let marker;
            let projectionCompilationContext;
            let j = 0, jj = 0;
            let child = el.firstChild;
            let isEmptyTextNode = false;
            if (processContentResult !== false) {
                while (child !== null) {
                    targetSlot = child.nodeType === 1 ? child.getAttribute(AU_SLOT) : null;
                    if (targetSlot !== null) {
                        child.removeAttribute(AU_SLOT);
                    }
                    if (isCustomElement) {
                        childEl = child.nextSibling;
                        if (!isShadowDom) {
                            isEmptyTextNode = child.nodeType === 3 && child.textContent.trim() === '';
                            if (!isEmptyTextNode) {
                                ((_a = (slotTemplateRecord ?? (slotTemplateRecord = {})))[_b = targetSlot || DEFAULT_SLOT_NAME] ?? (_a[_b] = [])).push(child);
                            }
                            el.removeChild(child);
                        }
                        child = childEl;
                    }
                    else {
                        if (targetSlot !== null) {
                            targetSlot = targetSlot || DEFAULT_SLOT_NAME;
                            throw createError(`AUR0706: Projection with [au-slot="${targetSlot}"] is attempted on a non custom element ${el.nodeName}.`);
                        }
                        child = child.nextSibling;
                    }
                }
            }
            if (slotTemplateRecord != null) {
                projections = {};
                for (targetSlot in slotTemplateRecord) {
                    template = context.t();
                    slotTemplates = slotTemplateRecord[targetSlot];
                    for (j = 0, jj = slotTemplates.length; jj > j; ++j) {
                        slotTemplate = slotTemplates[j];
                        if (slotTemplate.nodeName === 'TEMPLATE') {
                            if (slotTemplate.attributes.length > 0) {
                                appendToTemplate(template, slotTemplate);
                            }
                            else {
                                appendToTemplate(template, slotTemplate.content);
                            }
                        }
                        else {
                            appendToTemplate(template, slotTemplate);
                        }
                    }
                    projectionCompilationContext = context._createChild();
                    this._compileNode(template.content, projectionCompilationContext);
                    projections[targetSlot] = CustomElementDefinition.create({
                        name: generateElementName(),
                        template,
                        instructions: projectionCompilationContext.rows,
                        needsCompile: false,
                        isStrictBinding: context.root.def.isStrictBinding,
                    });
                }
                elementInstruction.projections = projections;
            }
            if (isCustomElement && (hasContainerless || elDef.containerless)) {
                this._replaceByMarker(el, context);
            }
            shouldCompileContent = !isCustomElement || !elDef.containerless && !hasContainerless && processContentResult !== false;
            if (shouldCompileContent) {
                if (el.nodeName === TEMPLATE_NODE_NAME) {
                    this._compileNode(el.content, childContext);
                }
                else {
                    child = el.firstChild;
                    while (child !== null) {
                        child = this._compileNode(child, childContext);
                    }
                }
            }
            tcInstruction.def = CustomElementDefinition.create({
                name: generateElementName(),
                template: mostInnerTemplate,
                instructions: childContext.rows,
                needsCompile: false,
                isStrictBinding: context.root.def.isStrictBinding,
            });
            while (i-- > 0) {
                tcInstruction = tcInstructions[i];
                template = context.t();
                marker = this._markAsTarget(context.h(MARKER_NODE_NAME));
                appendManyToTemplate(template, [context._comment(auStartComment), context._comment(auEndComment), marker]);
                tcInstruction.def = CustomElementDefinition.create({
                    name: generateElementName(),
                    template,
                    needsCompile: false,
                    instructions: [[tcInstructions[i + 1]]],
                    isStrictBinding: context.root.def.isStrictBinding,
                });
            }
            context.rows.push([tcInstruction]);
        }
        else {
            if (instructions != null) {
                context.rows.push(instructions);
            }
            let child = el.firstChild;
            let childEl;
            let targetSlot;
            let projections = null;
            let slotTemplateRecord;
            let slotTemplates;
            let slotTemplate;
            let template;
            let projectionCompilationContext;
            let isEmptyTextNode = false;
            let j = 0, jj = 0;
            if (processContentResult !== false) {
                while (child !== null) {
                    targetSlot = child.nodeType === 1 ? child.getAttribute(AU_SLOT) : null;
                    if (targetSlot !== null) {
                        child.removeAttribute(AU_SLOT);
                    }
                    if (isCustomElement) {
                        childEl = child.nextSibling;
                        if (!isShadowDom) {
                            isEmptyTextNode = child.nodeType === 3 && child.textContent.trim() === '';
                            if (!isEmptyTextNode) {
                                ((_c = (slotTemplateRecord ?? (slotTemplateRecord = {})))[_d = targetSlot || DEFAULT_SLOT_NAME] ?? (_c[_d] = [])).push(child);
                            }
                            el.removeChild(child);
                        }
                        child = childEl;
                    }
                    else {
                        if (targetSlot !== null) {
                            targetSlot = targetSlot || DEFAULT_SLOT_NAME;
                            throw createError(`AUR0706: Projection with [au-slot="${targetSlot}"] is attempted on a non custom element ${el.nodeName}.`);
                        }
                        child = child.nextSibling;
                    }
                }
            }
            if (slotTemplateRecord != null) {
                projections = {};
                for (targetSlot in slotTemplateRecord) {
                    template = context.t();
                    slotTemplates = slotTemplateRecord[targetSlot];
                    for (j = 0, jj = slotTemplates.length; jj > j; ++j) {
                        slotTemplate = slotTemplates[j];
                        if (slotTemplate.nodeName === TEMPLATE_NODE_NAME) {
                            if (slotTemplate.attributes.length > 0) {
                                appendToTemplate(template, slotTemplate);
                            }
                            else {
                                appendToTemplate(template, slotTemplate.content);
                            }
                        }
                        else {
                            appendToTemplate(template, slotTemplate);
                        }
                    }
                    projectionCompilationContext = context._createChild();
                    this._compileNode(template.content, projectionCompilationContext);
                    projections[targetSlot] = CustomElementDefinition.create({
                        name: generateElementName(),
                        template,
                        instructions: projectionCompilationContext.rows,
                        needsCompile: false,
                        isStrictBinding: context.root.def.isStrictBinding,
                    });
                }
                elementInstruction.projections = projections;
            }
            if (isCustomElement && (hasContainerless || elDef.containerless)) {
                this._replaceByMarker(el, context);
            }
            shouldCompileContent = !isCustomElement || !elDef.containerless && !hasContainerless && processContentResult !== false;
            if (shouldCompileContent && el.childNodes.length > 0) {
                child = el.firstChild;
                while (child !== null) {
                    child = this._compileNode(child, context);
                }
            }
        }
        return nextSibling;
    }
    _compileText(node, context) {
        const parent = node.parentNode;
        const expr = context._exprParser.parse(node.textContent, 1);
        const next = node.nextSibling;
        let parts;
        let expressions;
        let i;
        let ii;
        let part;
        if (expr !== null) {
            ({ parts, expressions } = expr);
            if ((part = parts[0])) {
                insertBefore(parent, context._text(part), node);
            }
            for (i = 0, ii = expressions.length; ii > i; ++i) {
                insertManyBefore(parent, node, [
                    context._comment(auStartComment),
                    context._comment(auEndComment),
                    this._markAsTarget(context.h(MARKER_NODE_NAME)),
                ]);
                if ((part = parts[i + 1])) {
                    insertBefore(parent, context._text(part), node);
                }
                context.rows.push([new TextBindingInstruction(expressions[i], context.root.def.isStrictBinding)]);
            }
            parent.removeChild(node);
        }
        return next;
    }
    _compileMultiBindings(node, attrRawValue, attrDef, context) {
        const bindableAttrsInfo = BindablesInfo.from(attrDef, true);
        const valueLength = attrRawValue.length;
        const instructions = [];
        let attrName = void 0;
        let attrValue = void 0;
        let start = 0;
        let ch = 0;
        let expr;
        let attrSyntax;
        let command;
        let bindable;
        for (let i = 0; i < valueLength; ++i) {
            ch = attrRawValue.charCodeAt(i);
            if (ch === 92) {
                ++i;
            }
            else if (ch === 58) {
                attrName = attrRawValue.slice(start, i);
                while (attrRawValue.charCodeAt(++i) <= 32)
                    ;
                start = i;
                for (; i < valueLength; ++i) {
                    ch = attrRawValue.charCodeAt(i);
                    if (ch === 92) {
                        ++i;
                    }
                    else if (ch === 59) {
                        attrValue = attrRawValue.slice(start, i);
                        break;
                    }
                }
                if (attrValue === void 0) {
                    attrValue = attrRawValue.slice(start);
                }
                attrSyntax = context._attrParser.parse(attrName, attrValue);
                command = context._createCommand(attrSyntax);
                bindable = bindableAttrsInfo.attrs[attrSyntax.target];
                if (bindable == null) {
                    throw createError(`AUR0707: Bindable ${attrSyntax.target} not found on ${attrDef.name}.`);
                }
                if (command === null) {
                    expr = context._exprParser.parse(attrValue, 1);
                    instructions.push(expr === null
                        ? new SetPropertyInstruction(attrValue, bindable.property)
                        : new InterpolationInstruction(expr, bindable.property));
                }
                else {
                    commandBuildInfo.node = node;
                    commandBuildInfo.attr = attrSyntax;
                    commandBuildInfo.bindable = bindable;
                    commandBuildInfo.def = attrDef;
                    instructions.push(command.build(commandBuildInfo, context._exprParser, context._attrMapper));
                }
                while (i < valueLength && attrRawValue.charCodeAt(++i) <= 32)
                    ;
                start = i;
                attrName = void 0;
                attrValue = void 0;
            }
        }
        resetCommandBuildInfo();
        return instructions;
    }
    _compileLocalElement(template, context) {
        const root = template;
        const localTemplates = kernel.toArray(root.querySelectorAll('template[as-custom-element]'));
        const numLocalTemplates = localTemplates.length;
        if (numLocalTemplates === 0) {
            return;
        }
        if (numLocalTemplates === root.childElementCount) {
            throw createError(`AUR0708: The custom element does not have any content other than local template(s).`);
        }
        const localTemplateNames = new Set();
        const localElTypes = [];
        for (const localTemplate of localTemplates) {
            if (localTemplate.parentNode !== root) {
                throw createError(`AUR0709: Local templates needs to be defined directly under root.`);
            }
            const name = processTemplateName(localTemplate, localTemplateNames);
            const LocalTemplateType = class LocalTemplate {
            };
            const content = localTemplate.content;
            const bindableEls = kernel.toArray(content.querySelectorAll('bindable'));
            const bindableInstructions = Bindable.for(LocalTemplateType);
            const properties = new Set();
            const attributes = new Set();
            for (const bindableEl of bindableEls) {
                if (bindableEl.parentNode !== content) {
                    throw createError(`AUR0710: Bindable properties of local templates needs to be defined directly under root.`);
                }
                const property = bindableEl.getAttribute("property");
                if (property === null) {
                    throw createError(`AUR0711: The attribute 'property' is missing in ${bindableEl.outerHTML}`);
                }
                const attribute = bindableEl.getAttribute("attribute");
                if (attribute !== null
                    && attributes.has(attribute)
                    || properties.has(property)) {
                    throw createError(`Bindable property and attribute needs to be unique; found property: ${property}, attribute: ${attribute}`);
                }
                else {
                    if (attribute !== null) {
                        attributes.add(attribute);
                    }
                    properties.add(property);
                }
                bindableInstructions.add({
                    property,
                    attribute: attribute ?? void 0,
                    mode: getBindingMode(bindableEl),
                });
                const ignoredAttributes = bindableEl.getAttributeNames().filter((attrName) => !allowedLocalTemplateBindableAttributes.includes(attrName));
                if (ignoredAttributes.length > 0) {
                    context._logger.warn(`The attribute(s) ${ignoredAttributes.join(', ')} will be ignored for ${bindableEl.outerHTML}. Only ${allowedLocalTemplateBindableAttributes.join(', ')} are processed.`);
                }
                content.removeChild(bindableEl);
            }
            localElTypes.push(LocalTemplateType);
            context._addDep(defineElement({ name, template: localTemplate }, LocalTemplateType));
            root.removeChild(localTemplate);
        }
        let i = 0;
        const ii = localElTypes.length;
        for (; ii > i; ++i) {
            getElementDefinition(localElTypes[i]).dependencies.push(...context.def.dependencies ?? kernel.emptyArray, ...context.deps ?? kernel.emptyArray);
        }
    }
    _shouldReorderAttrs(el) {
        return el.nodeName === 'INPUT' && orderSensitiveInputType[el.type] === 1;
    }
    _reorder(el, instructions) {
        switch (el.nodeName) {
            case 'INPUT': {
                const _instructions = instructions;
                let modelOrValueOrMatcherIndex = void 0;
                let checkedIndex = void 0;
                let found = 0;
                let instruction;
                for (let i = 0; i < _instructions.length && found < 3; i++) {
                    instruction = _instructions[i];
                    switch (instruction.to) {
                        case 'model':
                        case 'value':
                        case 'matcher':
                            modelOrValueOrMatcherIndex = i;
                            found++;
                            break;
                        case 'checked':
                            checkedIndex = i;
                            found++;
                            break;
                    }
                }
                if (checkedIndex !== void 0 && modelOrValueOrMatcherIndex !== void 0 && checkedIndex < modelOrValueOrMatcherIndex) {
                    [_instructions[modelOrValueOrMatcherIndex], _instructions[checkedIndex]] = [_instructions[checkedIndex], _instructions[modelOrValueOrMatcherIndex]];
                }
            }
        }
    }
    _isMarker(el) {
        return el.nodeName === MARKER_NODE_NAME
            && isComment($prevSibling = getPreviousSibling(el)) && $prevSibling.textContent === auEndComment
            && isComment($prevSibling = getPreviousSibling($prevSibling)) && $prevSibling.textContent === auStartComment;
    }
    _markAsTarget(el) {
        el.classList.add('au');
        return el;
    }
    _replaceByMarker(node, context) {
        if (isMarker(node)) {
            return node;
        }
        const parent = node.parentNode;
        const marker = this._markAsTarget(context.h(MARKER_NODE_NAME));
        insertManyBefore(parent, node, [context._comment(auStartComment), context._comment(auEndComment), marker]);
        parent.removeChild(node);
        return marker;
    }
}
let $prevSibling;
const MARKER_NODE_NAME = 'AU-M';
const TEMPLATE_NODE_NAME = 'TEMPLATE';
const auStartComment = 'au-start';
const auEndComment = 'au-end';
const isMarker = (el) => el.nodeName === MARKER_NODE_NAME
    && isComment($prevSibling = getPreviousSibling(el)) && $prevSibling.textContent === auEndComment
    && isComment($prevSibling = getPreviousSibling($prevSibling)) && $prevSibling.textContent === auStartComment;
const isComment = (el) => el?.nodeType === 8;
class CompilationContext {
    constructor(def, container, compilationInstruction, parent, root, instructions) {
        this.hasSlot = false;
        this._commands = createLookup();
        const hasParent = parent !== null;
        this.c = container;
        this.root = root === null ? this : root;
        this.def = def;
        this.ci = compilationInstruction;
        this.parent = parent;
        this._templateFactory = hasParent ? parent._templateFactory : container.get(ITemplateElementFactory);
        this._attrParser = hasParent ? parent._attrParser : container.get(IAttributeParser);
        this._exprParser = hasParent ? parent._exprParser : container.get(runtime.IExpressionParser);
        this._attrMapper = hasParent ? parent._attrMapper : container.get(IAttrMapper);
        this._logger = hasParent ? parent._logger : container.get(kernel.ILogger);
        this.p = hasParent ? parent.p : container.get(IPlatform);
        this.localEls = hasParent ? parent.localEls : new Set();
        this.rows = instructions ?? [];
    }
    _addDep(dep) {
        var _a;
        ((_a = this.root).deps ?? (_a.deps = [])).push(dep);
        this.root.c.register(dep);
    }
    _text(text) {
        return createText(this.p, text);
    }
    _comment(text) {
        return createComment(this.p, text);
    }
    h(name) {
        const el = createElement(this.p, name);
        if (name === 'template') {
            this.p.document.adoptNode(el.content);
        }
        return el;
    }
    t() {
        return this.h('template');
    }
    _findElement(name) {
        return this.c.find(CustomElement, name);
    }
    _findAttr(name) {
        return this.c.find(CustomAttribute, name);
    }
    _createChild(instructions) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, instructions);
    }
    _createCommand(syntax) {
        if (this.root !== this) {
            return this.root._createCommand(syntax);
        }
        const name = syntax.command;
        if (name === null) {
            return null;
        }
        let result = this._commands[name];
        if (result === void 0) {
            result = this.c.create(BindingCommand, name);
            if (result === null) {
                throw createError(`AUR0713: Unknown binding command: ${name}`);
            }
            this._commands[name] = result;
        }
        return result;
    }
}
const hasInlineBindings = (rawValue) => {
    const len = rawValue.length;
    let ch = 0;
    let i = 0;
    while (len > i) {
        ch = rawValue.charCodeAt(i);
        if (ch === 92) {
            ++i;
        }
        else if (ch === 58) {
            return true;
        }
        else if (ch === 36 && rawValue.charCodeAt(i + 1) === 123) {
            return false;
        }
        ++i;
    }
    return false;
};
const resetCommandBuildInfo = () => {
    commandBuildInfo.node
        = commandBuildInfo.attr
            = commandBuildInfo.bindable
                = commandBuildInfo.def = null;
};
const emptyCompilationInstructions = { projections: null };
const voidDefinition = { name: 'unnamed' };
const commandBuildInfo = {
    node: null,
    attr: null,
    bindable: null,
    def: null,
};
const invalidSurrogateAttribute = objectAssign(createLookup(), {
    'id': true,
    'name': true,
    'au-slot': true,
    'as-element': true,
});
const orderSensitiveInputType = {
    checkbox: 1,
    radio: 1,
};
const bindableAttrsInfoCache = new WeakMap();
class BindablesInfo {
    constructor(attrs, bindables, primary) {
        this.attrs = attrs;
        this.bindables = bindables;
        this.primary = primary;
    }
    static from(def, isAttr) {
        let info = bindableAttrsInfoCache.get(def);
        if (info == null) {
            const bindables = def.bindables;
            const attrs = createLookup();
            const defaultBindingMode = isAttr
                ? def.defaultBindingMode === void 0
                    ? 8
                    : def.defaultBindingMode
                : 8;
            let bindable;
            let prop;
            let hasPrimary = false;
            let primary;
            let attr;
            for (prop in bindables) {
                bindable = bindables[prop];
                attr = bindable.attribute;
                if (bindable.primary === true) {
                    if (hasPrimary) {
                        throw createError(`AUR0714: Primary already exists on ${def.name}`);
                    }
                    hasPrimary = true;
                    primary = bindable;
                }
                else if (!hasPrimary && primary == null) {
                    primary = bindable;
                }
                attrs[attr] = BindableDefinition.create(prop, def.Type, bindable);
            }
            if (bindable == null && isAttr) {
                primary = attrs.value = BindableDefinition.create('value', def.Type, { mode: defaultBindingMode });
            }
            bindableAttrsInfoCache.set(def, info = new BindablesInfo(attrs, bindables, primary));
        }
        return info;
    }
}

const allowedLocalTemplateBindableAttributes = objectFreeze([
    "property",
    "attribute",
    "mode"
]);
const localTemplateIdentifier = 'as-custom-element';
const processTemplateName = (localTemplate, localTemplateNames) => {
    const name = localTemplate.getAttribute(localTemplateIdentifier);
    if (name === null || name === '') {
        throw createError(`AUR0715: The value of "as-custom-element" attribute cannot be empty for local template`);
    }
    if (localTemplateNames.has(name)) {
        throw createError(`AUR0716: Duplicate definition of the local template named ${name}`);
    }
    else {
        localTemplateNames.add(name);
        localTemplate.removeAttribute(localTemplateIdentifier);
    }
    return name;
};
const getBindingMode = (bindable) => {
    switch (bindable.getAttribute("mode")) {
        case 'oneTime':
            return 1;
        case 'toView':
            return 2;
        case 'fromView':
            return 4;
        case 'twoWay':
            return 6;
        case 'default':
        default:
            return 8;
    }
};
const ITemplateCompilerHooks = createInterface('ITemplateCompilerHooks');
const typeToHooksDefCache = new WeakMap();
const hooksBaseName = getResourceKeyFor('compiler-hooks');
const TemplateCompilerHooks = objectFreeze({
    name: hooksBaseName,
    define(Type) {
        let def = typeToHooksDefCache.get(Type);
        if (def === void 0) {
            typeToHooksDefCache.set(Type, def = new TemplateCompilerHooksDefinition(Type));
            defineMetadata(hooksBaseName, def, Type);
            appendResourceKey(Type, hooksBaseName);
        }
        return Type;
    }
});
class TemplateCompilerHooksDefinition {
    constructor(Type) {
        this.Type = Type;
    }
    get name() { return ''; }
    register(c) {
        c.register(singletonRegistration(ITemplateCompilerHooks, this.Type));
    }
}
const templateCompilerHooks = (target) => {
    return target === void 0 ? decorator : decorator(target);
    function decorator(t) {
        return TemplateCompilerHooks.define(t);
    }
};
const DEFAULT_SLOT_NAME = 'default';
const AU_SLOT = 'au-slot';

const originalModesMap = new Map();
class BindingModeBehavior {
    bind(scope, binding) {
        originalModesMap.set(binding, binding.mode);
        binding.mode = this.mode;
    }
    unbind(scope, binding) {
        binding.mode = originalModesMap.get(binding);
        originalModesMap.delete(binding);
    }
}
class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() { return 1; }
}
class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() { return 2; }
}
class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() { return 4; }
}
class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() { return 6; }
}
bindingBehavior('oneTime')(OneTimeBindingBehavior);
bindingBehavior('toView')(ToViewBindingBehavior);
bindingBehavior('fromView')(FromViewBindingBehavior);
bindingBehavior('twoWay')(TwoWayBindingBehavior);

const bindingHandlerMap$1 = new WeakMap();
const defaultDelay$1 = 200;
class DebounceBindingBehavior {
    constructor(platform) {
        this._platform = platform;
    }
    bind(scope, binding, delay) {
        delay = Number(delay);
        const opts = {
            type: 'debounce',
            delay: delay > 0 ? delay : defaultDelay$1,
            now: this._platform.performanceNow,
            queue: this._platform.taskQueue,
        };
        const handler = binding.limit?.(opts);
        if (handler == null) {
            {
                console.warn(`Binding ${binding.constructor.name} does not support debounce rate limiting`);
            }
        }
        else {
            bindingHandlerMap$1.set(binding, handler);
        }
    }
    unbind(scope, binding) {
        bindingHandlerMap$1.get(binding)?.dispose();
        bindingHandlerMap$1.delete(binding);
    }
}
DebounceBindingBehavior.inject = [kernel.IPlatform];
bindingBehavior('debounce')(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(signaler) {
        this._lookup = new Map();
        this._signaler = signaler;
    }
    bind(scope, binding, ...names) {
        if (!('handleChange' in binding)) {
            throw createError(`AUR0817: The signal behavior can only be used with bindings that have a "handleChange" method`);
        }
        if (names.length === 0) {
            throw createError(`AUR0818: At least one signal name must be passed to the signal behavior, e.g. "expr & signal:'my-signal'"`);
        }
        this._lookup.set(binding, names);
        let name;
        for (name of names) {
            this._signaler.addSignalListener(name, binding);
        }
    }
    unbind(scope, binding) {
        const names = this._lookup.get(binding);
        this._lookup.delete(binding);
        let name;
        for (name of names) {
            this._signaler.removeSignalListener(name, binding);
        }
    }
}
SignalBindingBehavior.inject = [runtime.ISignaler];
bindingBehavior('signal')(SignalBindingBehavior);

const bindingHandlerMap = new WeakMap();
const defaultDelay = 200;
class ThrottleBindingBehavior {
    constructor(platform) {
        this._now = platform.performanceNow;
        this._taskQueue = platform.taskQueue;
    }
    bind(scope, binding, delay) {
        delay = Number(delay);
        const opts = {
            type: 'throttle',
            delay: delay > 0 ? delay : defaultDelay,
            now: this._now,
            queue: this._taskQueue,
        };
        const handler = binding.limit?.(opts);
        if (handler == null) {
            {
                console.warn(`Binding ${binding.constructor.name} does not support debounce rate limiting`);
            }
        }
        else {
            bindingHandlerMap.set(binding, handler);
        }
    }
    unbind(scope, binding) {
        bindingHandlerMap.get(binding)?.dispose();
        bindingHandlerMap.delete(binding);
    }
}
ThrottleBindingBehavior.inject = [kernel.IPlatform];
bindingBehavior('throttle')(ThrottleBindingBehavior);

class DataAttributeAccessor {
    constructor() {
        this.type = 2 | 4;
    }
    getValue(obj, key) {
        return obj.getAttribute(key);
    }
    setValue(newValue, obj, key) {
        if (newValue == null) {
            obj.removeAttribute(key);
        }
        else {
            obj.setAttribute(key, newValue);
        }
    }
}
mixinNoopSubscribable(DataAttributeAccessor);
const attrAccessor = new DataAttributeAccessor();

class AttrBindingBehavior {
    bind(_scope, binding) {
        if (!(binding instanceof PropertyBinding)) {
            throw createError(`AURxxxx: & attr can be only used on property binding. It's used on ${binding.constructor.name}`);
        }
        binding.useTargetObserver(attrAccessor);
    }
}
bindingBehavior('attr')(AttrBindingBehavior);

class SelfBindingBehavior {
    bind(_scope, binding) {
        if (!(binding instanceof ListenerBinding)) {
            throw createError(`AUR0801: Self binding behavior only supports listener binding via trigger/capture command.`);
        }
        binding.self = true;
    }
    unbind(_scope, binding) {
        binding.self = false;
    }
}
bindingBehavior('self')(SelfBindingBehavior);

const nsMap = createLookup();
class AttributeNSAccessor {
    constructor(ns) {
        this.ns = ns;
        this.type = 2 | 4;
    }
    static forNs(ns) {
        return nsMap[ns] ?? (nsMap[ns] = new AttributeNSAccessor(ns));
    }
    getValue(obj, propertyKey) {
        return obj.getAttributeNS(this.ns, propertyKey);
    }
    setValue(newValue, obj, key) {
        if (newValue == null) {
            obj.removeAttributeNS(this.ns, key);
        }
        else {
            obj.setAttributeNS(this.ns, key, newValue);
        }
    }
}
mixinNoopSubscribable(AttributeNSAccessor);

function defaultMatcher$1(a, b) {
    return a === b;
}
class CheckedObserver {
    constructor(obj, _key, config, observerLocator) {
        this.type = 2 | 1 | 4;
        this._value = void 0;
        this._oldValue = void 0;
        this._collectionObserver = void 0;
        this._valueObserver = void 0;
        this._listened = false;
        this._el = obj;
        this.oL = observerLocator;
        this._config = config;
    }
    getValue() {
        return this._value;
    }
    setValue(newValue) {
        const currentValue = this._value;
        if (newValue === currentValue) {
            return;
        }
        this._value = newValue;
        this._oldValue = currentValue;
        this._observe();
        this._synchronizeElement();
        this._flush();
    }
    handleCollectionChange() {
        this._synchronizeElement();
    }
    handleChange(_newValue, _previousValue) {
        this._synchronizeElement();
    }
    _synchronizeElement() {
        const currentValue = this._value;
        const obj = this._el;
        const elementValue = hasOwnProperty.call(obj, 'model') ? obj.model : obj.value;
        const isRadio = obj.type === 'radio';
        const matcher = obj.matcher !== void 0 ? obj.matcher : defaultMatcher$1;
        if (isRadio) {
            obj.checked = !!matcher(currentValue, elementValue);
        }
        else if (currentValue === true) {
            obj.checked = true;
        }
        else {
            let hasMatch = false;
            if (isArray(currentValue)) {
                hasMatch = currentValue.findIndex(item => !!matcher(item, elementValue)) !== -1;
            }
            else if (currentValue instanceof Set) {
                for (const v of currentValue) {
                    if (matcher(v, elementValue)) {
                        hasMatch = true;
                        break;
                    }
                }
            }
            else if (currentValue instanceof Map) {
                for (const pair of currentValue) {
                    const existingItem = pair[0];
                    const $isChecked = pair[1];
                    if (matcher(existingItem, elementValue) && $isChecked === true) {
                        hasMatch = true;
                        break;
                    }
                }
            }
            obj.checked = hasMatch;
        }
    }
    handleEvent() {
        let currentValue = this._oldValue = this._value;
        const obj = this._el;
        const elementValue = hasOwnProperty.call(obj, 'model') ? obj.model : obj.value;
        const isChecked = obj.checked;
        const matcher = obj.matcher !== void 0 ? obj.matcher : defaultMatcher$1;
        if (obj.type === 'checkbox') {
            if (isArray(currentValue)) {
                const index = currentValue.findIndex(item => !!matcher(item, elementValue));
                if (isChecked && index === -1) {
                    currentValue.push(elementValue);
                }
                else if (!isChecked && index !== -1) {
                    currentValue.splice(index, 1);
                }
                return;
            }
            else if (currentValue instanceof Set) {
                const unset = {};
                let existingItem = unset;
                for (const value of currentValue) {
                    if (matcher(value, elementValue) === true) {
                        existingItem = value;
                        break;
                    }
                }
                if (isChecked && existingItem === unset) {
                    currentValue.add(elementValue);
                }
                else if (!isChecked && existingItem !== unset) {
                    currentValue.delete(existingItem);
                }
                return;
            }
            else if (currentValue instanceof Map) {
                let existingItem;
                for (const pair of currentValue) {
                    const currItem = pair[0];
                    if (matcher(currItem, elementValue) === true) {
                        existingItem = currItem;
                        break;
                    }
                }
                currentValue.set(existingItem, isChecked);
                return;
            }
            currentValue = isChecked;
        }
        else if (isChecked) {
            currentValue = elementValue;
        }
        else {
            return;
        }
        this._value = currentValue;
        this._flush();
    }
    _start() {
        this._observe();
    }
    _stop() {
        this._collectionObserver?.unsubscribe(this);
        this._valueObserver?.unsubscribe(this);
        this._collectionObserver = this._valueObserver = void 0;
    }
    _flush() {
        oV$2 = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV$2);
    }
    _observe() {
        const obj = this._el;
        (this._valueObserver ?? (this._valueObserver = obj.$observers?.model ?? obj.$observers?.value))?.subscribe(this);
        this._collectionObserver?.unsubscribe(this);
        this._collectionObserver = void 0;
        if (obj.type === 'checkbox') {
            (this._collectionObserver = getCollectionObserver(this._value, this.oL))?.subscribe(this);
        }
    }
}
mixinNodeObserverUseConfig(CheckedObserver);
runtime.subscriberCollection(CheckedObserver);
let oV$2 = void 0;

const childObserverOptions = {
    childList: true,
    subtree: true,
    characterData: true
};
function defaultMatcher(a, b) {
    return a === b;
}
class SelectValueObserver {
    constructor(obj, _key, config, observerLocator) {
        this.type = 2 | 1 | 4;
        this._value = void 0;
        this._oldValue = void 0;
        this._hasChanges = false;
        this._arrayObserver = void 0;
        this._nodeObserver = void 0;
        this._observing = false;
        this._listened = false;
        this._el = obj;
        this._observerLocator = observerLocator;
        this._config = config;
    }
    getValue() {
        return this._observing
            ? this._value
            : this._el.multiple
                ? getSelectedOptions(this._el.options)
                : this._el.value;
    }
    setValue(newValue) {
        this._oldValue = this._value;
        this._value = newValue;
        this._hasChanges = newValue !== this._oldValue;
        this._observeArray(newValue instanceof Array ? newValue : null);
        this._flushChanges();
    }
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        const value = this._value;
        const obj = this._el;
        const $isArray = isArray(value);
        const matcher = obj.matcher ?? defaultMatcher;
        const options = obj.options;
        let i = options.length;
        while (i-- > 0) {
            const option = options[i];
            const optionValue = hasOwnProperty.call(option, 'model') ? option.model : option.value;
            if ($isArray) {
                option.selected = value.findIndex(item => !!matcher(optionValue, item)) !== -1;
                continue;
            }
            option.selected = !!matcher(optionValue, value);
        }
    }
    syncValue() {
        const obj = this._el;
        const options = obj.options;
        const len = options.length;
        const currentValue = this._value;
        let i = 0;
        if (obj.multiple) {
            if (!(currentValue instanceof Array)) {
                return true;
            }
            let option;
            const matcher = obj.matcher || defaultMatcher;
            const values = [];
            while (i < len) {
                option = options[i];
                if (option.selected) {
                    values.push(hasOwnProperty.call(option, 'model')
                        ? option.model
                        : option.value);
                }
                ++i;
            }
            let a;
            i = 0;
            while (i < currentValue.length) {
                a = currentValue[i];
                if (values.findIndex(b => !!matcher(a, b)) === -1) {
                    currentValue.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
            i = 0;
            while (i < values.length) {
                a = values[i];
                if (currentValue.findIndex(b => !!matcher(a, b)) === -1) {
                    currentValue.push(a);
                }
                ++i;
            }
            return false;
        }
        let value = null;
        let option;
        while (i < len) {
            option = options[i];
            if (option.selected) {
                value = hasOwnProperty.call(option, 'model')
                    ? option.model
                    : option.value;
                break;
            }
            ++i;
        }
        this._oldValue = this._value;
        this._value = value;
        return true;
    }
    _start() {
        (this._nodeObserver = new this._el.ownerDocument.defaultView.MutationObserver(this._handleNodeChange.bind(this)))
            .observe(this._el, childObserverOptions);
        this._observeArray(this._value instanceof Array ? this._value : null);
        this._observing = true;
    }
    _stop() {
        this._nodeObserver.disconnect();
        this._arrayObserver?.unsubscribe(this);
        this._nodeObserver
            = this._arrayObserver
                = void 0;
        this._observing = false;
    }
    _observeArray(array) {
        this._arrayObserver?.unsubscribe(this);
        this._arrayObserver = void 0;
        if (array != null) {
            if (!this._el.multiple) {
                throw createError(`AUR0654: Only null or Array instances can be bound to a multi-select.`);
            }
            (this._arrayObserver = this._observerLocator.getArrayObserver(array)).subscribe(this);
        }
    }
    handleEvent() {
        const shouldNotify = this.syncValue();
        if (shouldNotify) {
            this._flush();
        }
    }
    _handleNodeChange(_records) {
        this.syncOptions();
        const shouldNotify = this.syncValue();
        if (shouldNotify) {
            this._flush();
        }
    }
    _flush() {
        oV$1 = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV$1);
    }
}
mixinNodeObserverUseConfig(SelectValueObserver);
runtime.subscriberCollection(SelectValueObserver);
function getSelectedOptions(options) {
    const selection = [];
    if (options.length === 0) {
        return selection;
    }
    const ii = options.length;
    let i = 0;
    let option;
    while (ii > i) {
        option = options[i];
        if (option.selected) {
            selection[selection.length] = hasOwnProperty.call(option, 'model') ? option.model : option.value;
        }
        ++i;
    }
    return selection;
}
let oV$1 = void 0;

const customPropertyPrefix = '--';
class StyleAttributeAccessor {
    constructor(obj) {
        this.obj = obj;
        this.type = 2 | 4;
        this._value = '';
        this._oldValue = '';
        this.styles = {};
        this.version = 0;
        this._hasChanges = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(newValue) {
        this._value = newValue;
        this._hasChanges = newValue !== this._oldValue;
        this._flushChanges();
    }
    _getStyleTuplesFromString(currentValue) {
        const styleTuples = [];
        const urlRegexTester = /url\([^)]+$/;
        let offset = 0;
        let currentChunk = '';
        let nextSplit;
        let indexOfColon;
        let attribute;
        let value;
        while (offset < currentValue.length) {
            nextSplit = currentValue.indexOf(';', offset);
            if (nextSplit === -1) {
                nextSplit = currentValue.length;
            }
            currentChunk += currentValue.substring(offset, nextSplit);
            offset = nextSplit + 1;
            if (urlRegexTester.test(currentChunk)) {
                currentChunk += ';';
                continue;
            }
            indexOfColon = currentChunk.indexOf(':');
            attribute = currentChunk.substring(0, indexOfColon).trim();
            value = currentChunk.substring(indexOfColon + 1).trim();
            styleTuples.push([attribute, value]);
            currentChunk = '';
        }
        return styleTuples;
    }
    _getStyleTuplesFromObject(currentValue) {
        let value;
        let property;
        const styles = [];
        for (property in currentValue) {
            value = currentValue[property];
            if (value == null) {
                continue;
            }
            if (isString(value)) {
                if (property.startsWith(customPropertyPrefix)) {
                    styles.push([property, value]);
                    continue;
                }
                styles.push([kernel.kebabCase(property), value]);
                continue;
            }
            styles.push(...this._getStyleTuples(value));
        }
        return styles;
    }
    _getStyleTuplesFromArray(currentValue) {
        const len = currentValue.length;
        if (len > 0) {
            const styles = [];
            let i = 0;
            for (; len > i; ++i) {
                styles.push(...this._getStyleTuples(currentValue[i]));
            }
            return styles;
        }
        return kernel.emptyArray;
    }
    _getStyleTuples(currentValue) {
        if (isString(currentValue)) {
            return this._getStyleTuplesFromString(currentValue);
        }
        if (currentValue instanceof Array) {
            return this._getStyleTuplesFromArray(currentValue);
        }
        if (currentValue instanceof Object) {
            return this._getStyleTuplesFromObject(currentValue);
        }
        return kernel.emptyArray;
    }
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            const currentValue = this._value;
            const styles = this.styles;
            const styleTuples = this._getStyleTuples(currentValue);
            let style;
            let version = this.version;
            this._oldValue = currentValue;
            let tuple;
            let name;
            let value;
            let i = 0;
            const len = styleTuples.length;
            for (; i < len; ++i) {
                tuple = styleTuples[i];
                name = tuple[0];
                value = tuple[1];
                this.setProperty(name, value);
                styles[name] = version;
            }
            this.styles = styles;
            this.version += 1;
            if (version === 0) {
                return;
            }
            version -= 1;
            for (style in styles) {
                if (!hasOwnProperty.call(styles, style) || styles[style] !== version) {
                    continue;
                }
                this.obj.style.removeProperty(style);
            }
        }
    }
    setProperty(style, value) {
        let priority = '';
        if (value != null && isFunction(value.indexOf) && value.includes('!important')) {
            priority = 'important';
            value = value.replace('!important', '');
        }
        this.obj.style.setProperty(style, value, priority);
    }
    bind() {
        this._value = this._oldValue = this.obj.style.cssText;
    }
}
mixinNoopSubscribable(StyleAttributeAccessor);

class ValueAttributeObserver {
    constructor(obj, key, config) {
        this.type = 2 | 1 | 4;
        this._value = '';
        this._oldValue = '';
        this._hasChanges = false;
        this._listened = false;
        this._el = obj;
        this._key = key;
        this._config = config;
    }
    getValue() {
        return this._value;
    }
    setValue(newValue) {
        if (areEqual(newValue, this._value)) {
            return;
        }
        this._oldValue = this._value;
        this._value = newValue;
        this._hasChanges = true;
        if (!this._config.readonly) {
            this._flushChanges();
        }
    }
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            this._el[this._key] = this._value ?? this._config.default;
            this._flush();
        }
    }
    handleEvent() {
        this._oldValue = this._value;
        this._value = this._el[this._key];
        if (this._oldValue !== this._value) {
            this._hasChanges = false;
            this._flush();
        }
    }
    _start() {
        this._value = this._oldValue = this._el[this._key];
    }
    _flush() {
        oV = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV);
    }
}
mixinNodeObserverUseConfig(ValueAttributeObserver);
runtime.subscriberCollection(ValueAttributeObserver);
let oV = void 0;

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const xmlnsNS = 'http://www.w3.org/2000/xmlns/';
const nsAttributes = objectAssign(createLookup(), {
    'xlink:actuate': ['actuate', xlinkNS],
    'xlink:arcrole': ['arcrole', xlinkNS],
    'xlink:href': ['href', xlinkNS],
    'xlink:role': ['role', xlinkNS],
    'xlink:show': ['show', xlinkNS],
    'xlink:title': ['title', xlinkNS],
    'xlink:type': ['type', xlinkNS],
    'xml:lang': ['lang', xmlNS],
    'xml:space': ['space', xmlNS],
    'xmlns': ['xmlns', xmlnsNS],
    'xmlns:xlink': ['xlink', xmlnsNS],
});
const elementPropertyAccessor = new runtime.PropertyAccessor();
elementPropertyAccessor.type = 2 | 4;
class NodeObserverLocator {
    constructor(locator, platform, dirtyChecker, svgAnalyzer) {
        this.locator = locator;
        this.platform = platform;
        this.dirtyChecker = dirtyChecker;
        this.svgAnalyzer = svgAnalyzer;
        this.allowDirtyCheck = true;
        this._events = createLookup();
        this._globalEvents = createLookup();
        this._overrides = createLookup();
        this._globalOverrides = createLookup();
        const inputEvents = ['change', 'input'];
        const inputEventsConfig = { events: inputEvents, default: '' };
        this.useConfig({
            INPUT: {
                value: inputEventsConfig,
                valueAsNumber: { events: inputEvents, default: 0 },
                checked: { type: CheckedObserver, events: inputEvents },
                files: { events: inputEvents, readonly: true },
            },
            SELECT: {
                value: { type: SelectValueObserver, events: ['change'], default: '' },
            },
            TEXTAREA: {
                value: inputEventsConfig,
            },
        });
        const contentEventsConfig = { events: ['change', 'input', 'blur', 'keyup', 'paste'], default: '' };
        const scrollEventsConfig = { events: ['scroll'], default: 0 };
        this.useConfigGlobal({
            scrollTop: scrollEventsConfig,
            scrollLeft: scrollEventsConfig,
            textContent: contentEventsConfig,
            innerHTML: contentEventsConfig,
        });
        this.overrideAccessorGlobal('css', 'style', 'class');
        this.overrideAccessor({
            INPUT: ['value', 'checked', 'model'],
            SELECT: ['value'],
            TEXTAREA: ['value'],
        });
    }
    static register(container) {
        aliasRegistration(runtime.INodeObserverLocator, NodeObserverLocator).register(container);
        singletonRegistration(runtime.INodeObserverLocator, NodeObserverLocator).register(container);
    }
    handles(obj, _key) {
        return obj instanceof this.platform.Node;
    }
    useConfig(nodeNameOrConfig, key, eventsConfig) {
        const lookup = this._events;
        let existingMapping;
        if (isString(nodeNameOrConfig)) {
            existingMapping = lookup[nodeNameOrConfig] ?? (lookup[nodeNameOrConfig] = createLookup());
            if (existingMapping[key] == null) {
                existingMapping[key] = eventsConfig;
            }
            else {
                throwMappingExisted(nodeNameOrConfig, key);
            }
        }
        else {
            for (const nodeName in nodeNameOrConfig) {
                existingMapping = lookup[nodeName] ?? (lookup[nodeName] = createLookup());
                const newMapping = nodeNameOrConfig[nodeName];
                for (key in newMapping) {
                    if (existingMapping[key] == null) {
                        existingMapping[key] = newMapping[key];
                    }
                    else {
                        throwMappingExisted(nodeName, key);
                    }
                }
            }
        }
    }
    useConfigGlobal(configOrKey, eventsConfig) {
        const lookup = this._globalEvents;
        if (typeof configOrKey === 'object') {
            for (const key in configOrKey) {
                if (lookup[key] == null) {
                    lookup[key] = configOrKey[key];
                }
                else {
                    throwMappingExisted('*', key);
                }
            }
        }
        else {
            if (lookup[configOrKey] == null) {
                lookup[configOrKey] = eventsConfig;
            }
            else {
                throwMappingExisted('*', configOrKey);
            }
        }
    }
    getAccessor(obj, key, requestor) {
        if (key in this._globalOverrides || (key in (this._overrides[obj.tagName] ?? kernel.emptyObject))) {
            return this.getObserver(obj, key, requestor);
        }
        switch (key) {
            case 'src':
            case 'href':
            case 'role':
            case 'minLength':
            case 'maxLength':
            case 'placeholder':
            case 'size':
            case 'pattern':
            case 'title':
                return attrAccessor;
            default: {
                const nsProps = nsAttributes[key];
                if (nsProps !== undefined) {
                    return AttributeNSAccessor.forNs(nsProps[1]);
                }
                if (isDataAttribute(obj, key, this.svgAnalyzer)) {
                    return attrAccessor;
                }
                return elementPropertyAccessor;
            }
        }
    }
    overrideAccessor(tagNameOrOverrides, key) {
        var _a, _b;
        let existingTagOverride;
        if (isString(tagNameOrOverrides)) {
            existingTagOverride = (_a = this._overrides)[tagNameOrOverrides] ?? (_a[tagNameOrOverrides] = createLookup());
            existingTagOverride[key] = true;
        }
        else {
            for (const tagName in tagNameOrOverrides) {
                for (const key of tagNameOrOverrides[tagName]) {
                    existingTagOverride = (_b = this._overrides)[tagName] ?? (_b[tagName] = createLookup());
                    existingTagOverride[key] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...keys) {
        for (const key of keys) {
            this._globalOverrides[key] = true;
        }
    }
    getNodeObserverConfig(el, key) {
        return this._events[el.tagName]?.[key] ?? this._globalEvents[key];
    }
    getNodeObserver(el, key, requestor) {
        const eventsConfig = this._events[el.tagName]?.[key] ?? this._globalEvents[key];
        let observer;
        if (eventsConfig != null) {
            observer = new (eventsConfig.type ?? ValueAttributeObserver)(el, key, eventsConfig, requestor, this.locator);
            if (!observer.doNotCache) {
                runtime.getObserverLookup(el)[key] = observer;
            }
            return observer;
        }
        return null;
    }
    getObserver(el, key, requestor) {
        switch (key) {
            case 'class':
                return new ClassAttributeAccessor(el);
            case 'css':
            case 'style':
                return new StyleAttributeAccessor(el);
        }
        const nodeObserver = this.getNodeObserver(el, key, requestor);
        if (nodeObserver != null) {
            return nodeObserver;
        }
        const nsProps = nsAttributes[key];
        if (nsProps !== undefined) {
            return AttributeNSAccessor.forNs(nsProps[1]);
        }
        if (isDataAttribute(el, key, this.svgAnalyzer)) {
            return attrAccessor;
        }
        if (key in el.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.dirtyChecker.createProperty(el, key);
            }
            throw createError(`AUR0652: Unable to observe property ${String(key)}. Register observation mapping with .useConfig().`);
        }
        else {
            return new runtime.SetterObserver(el, key);
        }
    }
}
NodeObserverLocator.inject = [kernel.IServiceLocator, IPlatform, runtime.IDirtyChecker, ISVGAnalyzer];
function getCollectionObserver(collection, observerLocator) {
    if (collection instanceof Array) {
        return observerLocator.getArrayObserver(collection);
    }
    if (collection instanceof Map) {
        return observerLocator.getMapObserver(collection);
    }
    if (collection instanceof Set) {
        return observerLocator.getSetObserver(collection);
    }
}
function throwMappingExisted(nodeName, key) {
    throw createError(`AUR0653: Mapping for property ${String(key)} of <${nodeName} /> already exists`);
}

class UpdateTriggerBindingBehavior {
    constructor(observerLocator, nodeObserverLocator) {
        if (!(nodeObserverLocator instanceof NodeObserverLocator)) {
            throw createError('AURxxxx: updateTrigger binding behavior only works with the default implementation of Aurelia HTML observation. Implement your own node observation + updateTrigger');
        }
        this._observerLocator = observerLocator;
        this._nodeObserverLocator = nodeObserverLocator;
    }
    bind(_scope, binding, ...events) {
        if (events.length === 0) {
            throw createError(`AUR0802: The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:'blur'">`);
        }
        if (!(binding instanceof PropertyBinding) || !(binding.mode & 4)) {
            throw createError(`AUR0803: The updateTrigger binding behavior can only be applied to two-way/ from-view bindings.`);
        }
        const targetConfig = this._nodeObserverLocator.getNodeObserverConfig(binding.target, binding.targetProperty);
        if (targetConfig == null) {
            {
                throw createError(`AURxxxx: node observer does not know how to use events to observe ${binding.target}@${binding.targetProperty}`);
            }
        }
        const targetObserver = this._nodeObserverLocator.getNodeObserver(binding.target, binding.targetProperty, this._observerLocator);
        targetObserver.useConfig({ readonly: targetConfig.readonly, default: targetConfig.default, events });
        binding.useTargetObserver(targetObserver);
    }
}
UpdateTriggerBindingBehavior.inject = [runtime.IObserverLocator, runtime.INodeObserverLocator];
bindingBehavior('updateTrigger')(UpdateTriggerBindingBehavior);

class Focus {
    constructor(element, platform) {
        this._needsApply = false;
        this._element = element;
        this._platform = platform;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this._apply();
        }
        else {
            this._needsApply = true;
        }
    }
    attached() {
        if (this._needsApply) {
            this._needsApply = false;
            this._apply();
        }
        this._element.addEventListener('focus', this);
        this._element.addEventListener('blur', this);
    }
    afterDetachChildren() {
        const el = this._element;
        el.removeEventListener('focus', this);
        el.removeEventListener('blur', this);
    }
    handleEvent(e) {
        if (e.type === 'focus') {
            this.value = true;
        }
        else if (!this._isElFocused) {
            this.value = false;
        }
    }
    _apply() {
        const el = this._element;
        const isFocused = this._isElFocused;
        const shouldFocus = this.value;
        if (shouldFocus && !isFocused) {
            el.focus();
        }
        else if (!shouldFocus && isFocused) {
            el.blur();
        }
    }
    get _isElFocused() {
        return this._element === this._platform.document.activeElement;
    }
}
Focus.inject = [INode, IPlatform];
__decorate([
    bindable({ mode: 6 })
], Focus.prototype, "value", void 0);
customAttribute('focus')(Focus);

let Show = class Show {
    constructor(el, p, instr) {
        this.el = el;
        this.p = p;
        this._isActive = false;
        this._task = null;
        this.$val = '';
        this.$prio = '';
        this.update = () => {
            this._task = null;
            if (Boolean(this.value) !== this._isToggled) {
                if (this._isToggled === this._base) {
                    this._isToggled = !this._base;
                    this.$val = this.el.style.getPropertyValue('display');
                    this.$prio = this.el.style.getPropertyPriority('display');
                    this.el.style.setProperty('display', 'none', 'important');
                }
                else {
                    this._isToggled = this._base;
                    this.el.style.setProperty('display', this.$val, this.$prio);
                    if (this.el.getAttribute('style') === '') {
                        this.el.removeAttribute('style');
                    }
                }
            }
        };
        this._isToggled = this._base = instr.alias !== 'hide';
    }
    binding() {
        this._isActive = true;
        this.update();
    }
    detaching() {
        this._isActive = false;
        this._task?.cancel();
        this._task = null;
    }
    valueChanged() {
        if (this._isActive && this._task === null) {
            this._task = this.p.domWriteQueue.queueTask(this.update);
        }
    }
};
__decorate([
    bindable
], Show.prototype, "value", void 0);
Show = __decorate([
    __param(0, INode),
    __param(1, IPlatform),
    __param(2, IInstruction)
], Show);
alias('hide')(Show);
customAttribute('show')(Show);

class Portal {
    constructor(factory, originalLoc, p) {
        this.position = 'beforeend';
        this.strict = false;
        this._platform = p;
        this._resolvedTarget = p.document.createElement('div');
        (this.view = factory.create()).setLocation(this._targetLocation = createLocation(p));
        setEffectiveParentNode(this.view.nodes, originalLoc);
    }
    attaching(initiator, parent, flags) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const newTarget = this._resolvedTarget = this._getTarget();
        this._moveLocation(newTarget, this.position);
        return this._activating(initiator, newTarget, flags);
    }
    detaching(initiator, parent, flags) {
        return this._deactivating(initiator, this._resolvedTarget, flags);
    }
    targetChanged() {
        const { $controller } = this;
        if (!$controller.isActive) {
            return;
        }
        const newTarget = this._getTarget();
        if (this._resolvedTarget === newTarget) {
            return;
        }
        this._resolvedTarget = newTarget;
        const ret = kernel.onResolve(this._deactivating(null, newTarget, $controller.flags), () => {
            this._moveLocation(newTarget, this.position);
            return this._activating(null, newTarget, $controller.flags);
        });
        if (isPromise(ret)) {
            ret.catch(rethrow);
        }
    }
    positionChanged() {
        const { $controller, _resolvedTarget } = this;
        if (!$controller.isActive) {
            return;
        }
        const ret = kernel.onResolve(this._deactivating(null, _resolvedTarget, $controller.flags), () => {
            this._moveLocation(_resolvedTarget, this.position);
            return this._activating(null, _resolvedTarget, $controller.flags);
        });
        if (isPromise(ret)) {
            ret.catch(rethrow);
        }
    }
    _activating(initiator, target, flags) {
        const { activating, callbackContext, view } = this;
        return kernel.onResolve(activating?.call(callbackContext, target, view), () => {
            return this._activate(initiator, target, flags);
        });
    }
    _activate(initiator, target, flags) {
        const { $controller, view } = this;
        if (initiator === null) {
            view.nodes.insertBefore(this._targetLocation);
        }
        else {
            return kernel.onResolve(view.activate(initiator ?? view, $controller, flags, $controller.scope), () => {
                return this._activated(target);
            });
        }
        return this._activated(target);
    }
    _activated(target) {
        const { activated, callbackContext, view } = this;
        return activated?.call(callbackContext, target, view);
    }
    _deactivating(initiator, target, flags) {
        const { deactivating, callbackContext, view } = this;
        return kernel.onResolve(deactivating?.call(callbackContext, target, view), () => {
            return this._deactivate(initiator, target, flags);
        });
    }
    _deactivate(initiator, target, flags) {
        const { $controller, view } = this;
        if (initiator === null) {
            view.nodes.remove();
        }
        else {
            return kernel.onResolve(view.deactivate(initiator, $controller, flags), () => {
                return this._deactivated(target);
            });
        }
        return this._deactivated(target);
    }
    _deactivated(target) {
        const { deactivated, callbackContext, view } = this;
        return deactivated?.call(callbackContext, target, view);
    }
    _getTarget() {
        const p = this._platform;
        const $document = p.document;
        let target = this.target;
        let context = this.renderContext;
        if (target === '') {
            if (this.strict) {
                throw createError(`AUR0811: Empty querySelector`);
            }
            return $document.body;
        }
        if (isString(target)) {
            let queryContext = $document;
            if (isString(context)) {
                context = $document.querySelector(context);
            }
            if (context instanceof p.Node) {
                queryContext = context;
            }
            target = queryContext.querySelector(target);
        }
        if (target instanceof p.Node) {
            return target;
        }
        if (target == null) {
            if (this.strict) {
                throw createError(`AUR0812: Portal target not found`);
            }
            return $document.body;
        }
        return target;
    }
    _moveLocation(target, position) {
        const end = this._targetLocation;
        const start = end.$start;
        const parent = target.parentNode;
        const nodes = [start, end];
        switch (position) {
            case 'beforeend':
                insertManyBefore(target, null, nodes);
                break;
            case 'afterbegin':
                insertManyBefore(target, target.firstChild, nodes);
                break;
            case 'beforebegin':
                insertManyBefore(parent, target, nodes);
                break;
            case 'afterend':
                insertManyBefore(parent, target.nextSibling, nodes);
                break;
            default:
                throw new Error('Invalid portal insertion position');
        }
    }
    dispose() {
        this.view.dispose();
        this.view = (void 0);
        this.callbackContext = null;
    }
    accept(visitor) {
        if (this.view?.accept(visitor) === true) {
            return true;
        }
    }
}
Portal.inject = [IViewFactory, IRenderLocation, IPlatform];
__decorate([
    bindable({ primary: true })
], Portal.prototype, "target", void 0);
__decorate([
    bindable()
], Portal.prototype, "position", void 0);
__decorate([
    bindable({ callback: 'targetChanged' })
], Portal.prototype, "renderContext", void 0);
__decorate([
    bindable()
], Portal.prototype, "strict", void 0);
__decorate([
    bindable()
], Portal.prototype, "deactivating", void 0);
__decorate([
    bindable()
], Portal.prototype, "activating", void 0);
__decorate([
    bindable()
], Portal.prototype, "deactivated", void 0);
__decorate([
    bindable()
], Portal.prototype, "activated", void 0);
__decorate([
    bindable()
], Portal.prototype, "callbackContext", void 0);
templateController('portal')(Portal);

class If {
    constructor(ifFactory, location) {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this._wantsDeactivate = false;
        this._swapId = 0;
        this._ifFactory = ifFactory;
        this._location = location;
    }
    attaching(initiator, parent, f) {
        let view;
        const ctrl = this.$controller;
        const swapId = this._swapId++;
        const isCurrent = () => !this._wantsDeactivate && this._swapId === swapId + 1;
        return kernel.onResolve(this.pending, () => {
            if (!isCurrent()) {
                return;
            }
            this.pending = void 0;
            if (this.value) {
                view = (this.view = this.ifView = this.cache && this.ifView != null
                    ? this.ifView
                    : this._ifFactory.create());
            }
            else {
                view = (this.view = this.elseView = this.cache && this.elseView != null
                    ? this.elseView
                    : this.elseFactory?.create());
            }
            if (view == null) {
                return;
            }
            view.setLocation(this._location);
            this.pending = kernel.onResolve(view.activate(initiator, ctrl, f, ctrl.scope), () => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            });
        });
    }
    detaching(initiator, parent, flags) {
        this._wantsDeactivate = true;
        return kernel.onResolve(this.pending, () => {
            this._wantsDeactivate = false;
            this.pending = void 0;
            void this.view?.deactivate(initiator, this.$controller, flags);
        });
    }
    valueChanged(newValue, oldValue, f) {
        if (!this.$controller.isActive) {
            return;
        }
        newValue = !!newValue;
        oldValue = !!oldValue;
        if (newValue === oldValue) {
            return;
        }
        const currView = this.view;
        const ctrl = this.$controller;
        const swapId = this._swapId++;
        const isCurrent = () => !this._wantsDeactivate && this._swapId === swapId + 1;
        let view;
        return kernel.onResolve(this.pending, () => this.pending = kernel.onResolve(currView?.deactivate(currView, ctrl, f), () => {
            if (!isCurrent()) {
                return;
            }
            if (newValue) {
                view = (this.view = this.ifView = this.cache && this.ifView != null
                    ? this.ifView
                    : this._ifFactory.create());
            }
            else {
                view = (this.view = this.elseView = this.cache && this.elseView != null
                    ? this.elseView
                    : this.elseFactory?.create());
            }
            if (view == null) {
                return;
            }
            view.setLocation(this._location);
            return kernel.onResolve(view.activate(view, ctrl, f, ctrl.scope), () => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            });
        }));
    }
    dispose() {
        this.ifView?.dispose();
        this.elseView?.dispose();
        this.ifView
            = this.elseView
                = this.view
                    = void 0;
    }
    accept(visitor) {
        if (this.view?.accept(visitor) === true) {
            return true;
        }
    }
}
If.inject = [IViewFactory, IRenderLocation];
__decorate([
    bindable
], If.prototype, "value", void 0);
__decorate([
    bindable({
        set: v => v === '' || !!v && v !== 'false'
    })
], If.prototype, "cache", void 0);
templateController('if')(If);
class Else {
    constructor(factory) {
        this._factory = factory;
    }
    link(controller, _childController, _target, _instruction) {
        const children = controller.children;
        const ifBehavior = children[children.length - 1];
        if (ifBehavior instanceof If) {
            ifBehavior.elseFactory = this._factory;
        }
        else if (ifBehavior.viewModel instanceof If) {
            ifBehavior.viewModel.elseFactory = this._factory;
        }
        else {
            throw createError(`AUR0810: Unsupported If behavior`);
        }
    }
}
Else.inject = [IViewFactory];
templateController({ name: 'else' })(Else);

function dispose(disposable) {
    disposable.dispose();
}
const wrappedExprs = [
    18,
    17,
];
class Repeat {
    constructor(instruction, parser, location, parent, factory) {
        this.views = [];
        this.key = null;
        this._keyMap = new Map();
        this._scopeMap = new Map();
        this._observer = void 0;
        this._observingInnerItems = false;
        this._reevaluating = false;
        this._innerItemsExpression = null;
        this._normalizedItems = void 0;
        this._hasDestructuredLocal = false;
        const keyProp = instruction.props[0].props[0];
        if (keyProp !== void 0) {
            const { to, value, command } = keyProp;
            if (to === 'key') {
                if (command === null) {
                    this.key = value;
                }
                else if (command === 'bind') {
                    this.key = parser.parse(value, 16);
                }
                else {
                    {
                        throw createError(`AUR775:invalid command ${command}`);
                    }
                }
            }
            else {
                {
                    throw createError(`AUR776:invalid target ${to}`);
                }
            }
        }
        this._location = location;
        this._parent = parent;
        this._factory = factory;
    }
    binding(_initiator, _parent, _flags) {
        const bindings = this._parent.bindings;
        const ii = bindings.length;
        let binding = (void 0);
        let forOf;
        let i = 0;
        for (; ii > i; ++i) {
            binding = bindings[i];
            if (binding.target === this && binding.targetProperty === 'items') {
                forOf = this.forOf = binding.ast;
                this._forOfBinding = binding;
                let expression = forOf.iterable;
                while (expression != null && wrappedExprs.includes(expression.$kind)) {
                    expression = expression.expression;
                    this._observingInnerItems = true;
                }
                this._innerItemsExpression = expression;
                break;
            }
        }
        this._refreshCollectionObserver();
        const dec = forOf.declaration;
        if (!(this._hasDestructuredLocal = dec.$kind === 24 || dec.$kind === 25)) {
            this.local = runtime.astEvaluate(dec, this.$controller.scope, binding, null);
        }
    }
    attaching(initiator, _parent, _flags) {
        this._normalizeToArray();
        return this._activateAllViews(initiator);
    }
    detaching(initiator, _parent, _flags) {
        this._refreshCollectionObserver();
        return this._deactivateAllViews(initiator);
    }
    unbinding(_initiator, _parent, _flags) {
        this._scopeMap.clear();
        this._keyMap.clear();
    }
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this._refreshCollectionObserver();
        this._normalizeToArray();
        this._applyIndexMap(this.items, void 0);
    }
    handleCollectionChange(collection, indexMap) {
        const $controller = this.$controller;
        if (!$controller.isActive) {
            return;
        }
        if (this._observingInnerItems) {
            if (this._reevaluating) {
                return;
            }
            this._reevaluating = true;
            this.items = runtime.astEvaluate(this.forOf.iterable, $controller.scope, this._forOfBinding, null);
            this._reevaluating = false;
            return;
        }
        this._normalizeToArray();
        this._applyIndexMap(collection, indexMap);
    }
    _applyIndexMap(collection, indexMap) {
        const oldViews = this.views;
        const oldLen = oldViews.length;
        const key = this.key;
        const hasKey = key !== null;
        if (hasKey || indexMap === void 0) {
            const local = this.local;
            const newItems = this._normalizedItems;
            const newLen = newItems.length;
            const forOf = this.forOf;
            const dec = forOf.declaration;
            const binding = this._forOfBinding;
            const hasDestructuredLocal = this._hasDestructuredLocal;
            indexMap = runtime.createIndexMap(newLen);
            let i = 0;
            if (oldLen === 0) {
                for (; i < newLen; ++i) {
                    indexMap[i] = -2;
                }
            }
            else if (newLen === 0) {
                if (hasDestructuredLocal) {
                    for (i = 0; i < oldLen; ++i) {
                        indexMap.deletedIndices.push(i);
                        indexMap.deletedItems.push(runtime.astEvaluate(dec, oldViews[i].scope, binding, null));
                    }
                }
                else {
                    for (i = 0; i < oldLen; ++i) {
                        indexMap.deletedIndices.push(i);
                        indexMap.deletedItems.push(oldViews[i].scope.bindingContext[local]);
                    }
                }
            }
            else {
                const oldItems = Array(oldLen);
                if (hasDestructuredLocal) {
                    for (i = 0; i < oldLen; ++i) {
                        oldItems[i] = runtime.astEvaluate(dec, oldViews[i].scope, binding, null);
                    }
                }
                else {
                    for (i = 0; i < oldLen; ++i) {
                        oldItems[i] = oldViews[i].scope.bindingContext[local];
                    }
                }
                let oldItem;
                let newItem;
                let oldKey;
                let newKey;
                let j = 0;
                const oldEnd = oldLen - 1;
                const newEnd = newLen - 1;
                const oldIndices = new Map();
                const newIndices = new Map();
                const keyMap = this._keyMap;
                const scopeMap = this._scopeMap;
                const parentScope = this.$controller.scope;
                i = 0;
                outer: {
                    while (true) {
                        oldItem = oldItems[i];
                        newItem = newItems[i];
                        oldKey = hasKey
                            ? getKeyValue(keyMap, key, oldItem, getScope(scopeMap, oldItems[i], forOf, parentScope, binding, local, hasDestructuredLocal), binding)
                            : oldItem;
                        newKey = hasKey
                            ? getKeyValue(keyMap, key, newItem, getScope(scopeMap, newItems[i], forOf, parentScope, binding, local, hasDestructuredLocal), binding)
                            : newItem;
                        if (oldKey !== newKey) {
                            keyMap.set(oldItem, oldKey);
                            keyMap.set(newItem, newKey);
                            break;
                        }
                        ++i;
                        if (i > oldEnd || i > newEnd) {
                            break outer;
                        }
                    }
                    if (oldEnd !== newEnd) {
                        break outer;
                    }
                    j = newEnd;
                    while (true) {
                        oldItem = oldItems[j];
                        newItem = newItems[j];
                        oldKey = hasKey
                            ? getKeyValue(keyMap, key, oldItem, getScope(scopeMap, oldItem, forOf, parentScope, binding, local, hasDestructuredLocal), binding)
                            : oldItem;
                        newKey = hasKey
                            ? getKeyValue(keyMap, key, newItem, getScope(scopeMap, newItem, forOf, parentScope, binding, local, hasDestructuredLocal), binding)
                            : newItem;
                        if (oldKey !== newKey) {
                            keyMap.set(oldItem, oldKey);
                            keyMap.set(newItem, newKey);
                            break;
                        }
                        --j;
                        if (i > j) {
                            break outer;
                        }
                    }
                }
                const oldStart = i;
                const newStart = i;
                for (i = newStart; i <= newEnd; ++i) {
                    if (keyMap.has(newItem = newItems[i])) {
                        newKey = keyMap.get(newItem);
                    }
                    else {
                        newKey = hasKey
                            ? getKeyValue(keyMap, key, newItem, getScope(scopeMap, newItem, forOf, parentScope, binding, local, hasDestructuredLocal), binding)
                            : newItem;
                        keyMap.set(newItem, newKey);
                    }
                    newIndices.set(newKey, i);
                }
                for (i = oldStart; i <= oldEnd; ++i) {
                    if (keyMap.has(oldItem = oldItems[i])) {
                        oldKey = keyMap.get(oldItem);
                    }
                    else {
                        oldKey = hasKey
                            ? getKeyValue(keyMap, key, oldItem, oldViews[i].scope, binding)
                            : oldItem;
                    }
                    oldIndices.set(oldKey, i);
                    if (newIndices.has(oldKey)) {
                        indexMap[newIndices.get(oldKey)] = i;
                    }
                    else {
                        indexMap.deletedIndices.push(i);
                        indexMap.deletedItems.push(oldItem);
                    }
                }
                for (i = newStart; i <= newEnd; ++i) {
                    if (!oldIndices.has(keyMap.get(newItems[i]))) {
                        indexMap[i] = -2;
                    }
                }
                oldIndices.clear();
                newIndices.clear();
            }
        }
        if (indexMap === void 0) {
            const ret = kernel.onResolve(this._deactivateAllViews(null), () => {
                return this._activateAllViews(null);
            });
            if (isPromise(ret)) {
                ret.catch(rethrow);
            }
        }
        else {
            const $indexMap = runtime.applyMutationsToIndices(indexMap);
            if ($indexMap.deletedIndices.length > 0) {
                const ret = kernel.onResolve(this._deactivateAndRemoveViewsByKey($indexMap), () => {
                    return this._createAndActivateAndSortViewsByKey(oldLen, $indexMap);
                });
                if (isPromise(ret)) {
                    ret.catch(rethrow);
                }
            }
            else {
                this._createAndActivateAndSortViewsByKey(oldLen, $indexMap);
            }
        }
    }
    _refreshCollectionObserver() {
        const scope = this.$controller.scope;
        let innerItems = this._innerItems;
        let observingInnerItems = this._observingInnerItems;
        let newObserver;
        if (observingInnerItems) {
            innerItems = this._innerItems = runtime.astEvaluate(this._innerItemsExpression, scope, this._forOfBinding, null) ?? null;
            observingInnerItems = this._observingInnerItems = !areEqual(this.items, innerItems);
        }
        const oldObserver = this._observer;
        if (this.$controller.isActive) {
            newObserver = this._observer = runtime.getCollectionObserver(observingInnerItems ? innerItems : this.items);
            if (oldObserver !== newObserver) {
                oldObserver?.unsubscribe(this);
                newObserver?.subscribe(this);
            }
        }
        else {
            oldObserver?.unsubscribe(this);
            this._observer = undefined;
        }
    }
    _normalizeToArray() {
        const { items } = this;
        if (isArray(items)) {
            this._normalizedItems = items;
            return;
        }
        const normalizedItems = [];
        iterate(items, (item, index) => {
            normalizedItems[index] = item;
        });
        this._normalizedItems = normalizedItems;
    }
    _activateAllViews(initiator) {
        let promises = void 0;
        let ret;
        let view;
        let viewScope;
        const { $controller, _factory, local, _location, items, _scopeMap, _forOfBinding, forOf, _hasDestructuredLocal } = this;
        const parentScope = $controller.scope;
        const newLen = getCount(items);
        const views = this.views = Array(newLen);
        iterate(items, (item, i) => {
            view = views[i] = _factory.create().setLocation(_location);
            view.nodes.unlink();
            viewScope = getScope(_scopeMap, item, forOf, parentScope, _forOfBinding, local, _hasDestructuredLocal);
            setContextualProperties(viewScope.overrideContext, i, newLen);
            ret = view.activate(initiator ?? view, $controller, 0, viewScope);
            if (isPromise(ret)) {
                (promises ?? (promises = [])).push(ret);
            }
        });
        if (promises !== void 0) {
            return promises.length === 1
                ? promises[0]
                : Promise.all(promises);
        }
    }
    _deactivateAllViews(initiator) {
        let promises = void 0;
        let ret;
        let view;
        let i = 0;
        const { views, $controller } = this;
        const ii = views.length;
        for (; ii > i; ++i) {
            view = views[i];
            view.release();
            ret = view.deactivate(initiator ?? view, $controller, 0);
            if (isPromise(ret)) {
                (promises ?? (promises = [])).push(ret);
            }
        }
        if (promises !== void 0) {
            return (promises.length === 1
                ? promises[0]
                : Promise.all(promises));
        }
    }
    _deactivateAndRemoveViewsByKey(indexMap) {
        let promises = void 0;
        let ret;
        let view;
        const { $controller, views } = this;
        const deleted = indexMap.deletedIndices;
        const deletedLen = deleted.length;
        let i = 0;
        for (; deletedLen > i; ++i) {
            view = views[deleted[i]];
            view.release();
            ret = view.deactivate(view, $controller, 0);
            if (isPromise(ret)) {
                (promises ?? (promises = [])).push(ret);
            }
        }
        i = 0;
        let j = 0;
        for (; deletedLen > i; ++i) {
            j = deleted[i] - i;
            views.splice(j, 1);
        }
        if (promises !== void 0) {
            return promises.length === 1
                ? promises[0]
                : Promise.all(promises);
        }
    }
    _createAndActivateAndSortViewsByKey(oldLength, indexMap) {
        let promises = void 0;
        let ret;
        let view;
        let viewScope;
        let i = 0;
        const { $controller, _factory, local, _normalizedItems, _location, views, _hasDestructuredLocal, _forOfBinding, _scopeMap, forOf } = this;
        const mapLen = indexMap.length;
        for (; mapLen > i; ++i) {
            if (indexMap[i] === -2) {
                view = _factory.create();
                views.splice(i, 0, view);
            }
        }
        if (views.length !== mapLen) {
            throw mismatchedLengthError(views.length, mapLen);
        }
        const parentScope = $controller.scope;
        const newLen = indexMap.length;
        runtime.synchronizeIndices(views, indexMap);
        const seq = longestIncreasingSubsequence(indexMap);
        const seqLen = seq.length;
        const dec = forOf.declaration;
        let next;
        let j = seqLen - 1;
        i = newLen - 1;
        for (; i >= 0; --i) {
            view = views[i];
            next = views[i + 1];
            view.nodes.link(next?.nodes ?? _location);
            if (indexMap[i] === -2) {
                viewScope = getScope(_scopeMap, _normalizedItems[i], forOf, parentScope, _forOfBinding, local, _hasDestructuredLocal);
                setContextualProperties(viewScope.overrideContext, i, newLen);
                view.setLocation(_location);
                ret = view.activate(view, $controller, 0, viewScope);
                if (isPromise(ret)) {
                    (promises ?? (promises = [])).push(ret);
                }
            }
            else if (j < 0 || seqLen === 1 || i !== seq[j]) {
                if (_hasDestructuredLocal) {
                    runtime.astAssign(dec, view.scope, _forOfBinding, _normalizedItems[i]);
                }
                else {
                    view.scope.bindingContext[local] = _normalizedItems[i];
                }
                setContextualProperties(view.scope.overrideContext, i, newLen);
                view.nodes.insertBefore(view.location);
            }
            else {
                if (_hasDestructuredLocal) {
                    runtime.astAssign(dec, view.scope, _forOfBinding, _normalizedItems[i]);
                }
                else {
                    view.scope.bindingContext[local] = _normalizedItems[i];
                }
                if (oldLength !== newLen) {
                    setContextualProperties(view.scope.overrideContext, i, newLen);
                }
                --j;
            }
        }
        if (promises !== void 0) {
            return promises.length === 1
                ? promises[0]
                : Promise.all(promises);
        }
    }
    dispose() {
        this.views.forEach(dispose);
        this.views = (void 0);
    }
    accept(visitor) {
        const { views } = this;
        if (views !== void 0) {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                if (views[i].accept(visitor) === true) {
                    return true;
                }
            }
        }
    }
}
Repeat.inject = [IInstruction, runtime.IExpressionParser, IRenderLocation, IController, IViewFactory];
__decorate([
    bindable
], Repeat.prototype, "items", void 0);
templateController('repeat')(Repeat);
let maxLen = 16;
let prevIndices = new Int32Array(maxLen);
let tailIndices = new Int32Array(maxLen);
function longestIncreasingSubsequence(indexMap) {
    const len = indexMap.length;
    if (len > maxLen) {
        maxLen = len;
        prevIndices = new Int32Array(len);
        tailIndices = new Int32Array(len);
    }
    let cursor = 0;
    let cur = 0;
    let prev = 0;
    let i = 0;
    let j = 0;
    let low = 0;
    let high = 0;
    let mid = 0;
    for (; i < len; i++) {
        cur = indexMap[i];
        if (cur !== -2) {
            j = prevIndices[cursor];
            prev = indexMap[j];
            if (prev !== -2 && prev < cur) {
                tailIndices[i] = j;
                prevIndices[++cursor] = i;
                continue;
            }
            low = 0;
            high = cursor;
            while (low < high) {
                mid = (low + high) >> 1;
                prev = indexMap[prevIndices[mid]];
                if (prev !== -2 && prev < cur) {
                    low = mid + 1;
                }
                else {
                    high = mid;
                }
            }
            prev = indexMap[prevIndices[low]];
            if (cur < prev || prev === -2) {
                if (low > 0) {
                    tailIndices[i] = prevIndices[low - 1];
                }
                prevIndices[low] = i;
            }
        }
    }
    i = ++cursor;
    const result = new Int32Array(i);
    cur = prevIndices[cursor - 1];
    while (cursor-- > 0) {
        result[cursor] = cur;
        cur = tailIndices[cur];
    }
    while (i-- > 0)
        prevIndices[i] = 0;
    return result;
}
const mismatchedLengthError = (viewCount, itemCount) => createError(`AUR0814: viewsLen=${viewCount}, mapLen=${itemCount}`)
    ;
const setContextualProperties = (oc, index, length) => {
    const isFirst = index === 0;
    const isLast = index === length - 1;
    const isEven = index % 2 === 0;
    oc.$index = index;
    oc.$first = isFirst;
    oc.$last = isLast;
    oc.$middle = !isFirst && !isLast;
    oc.$even = isEven;
    oc.$odd = !isEven;
    oc.$length = length;
};
const toStringTag = baseObjectPrototype.toString;
const getCount = (result) => {
    switch (toStringTag.call(result)) {
        case '[object Array]': return result.length;
        case '[object Map]': return result.size;
        case '[object Set]': return result.size;
        case '[object Number]': return result;
        case '[object Null]': return 0;
        case '[object Undefined]': return 0;
        default: throw createError(`Cannot count ${toStringTag.call(result)}`);
    }
};
const iterate = (result, func) => {
    switch (toStringTag.call(result)) {
        case '[object Array]': return $array(result, func);
        case '[object Map]': return $map(result, func);
        case '[object Set]': return $set(result, func);
        case '[object Number]': return $number(result, func);
        case '[object Null]': return;
        case '[object Undefined]': return;
        default: throw createError(`Cannot iterate over ${toStringTag.call(result)}`);
    }
};
const $array = (result, func) => {
    const ii = result.length;
    let i = 0;
    for (; i < ii; ++i) {
        func(result[i], i, result);
    }
};
const $map = (result, func) => {
    let i = -0;
    let entry;
    for (entry of result.entries()) {
        func(entry, i++, result);
    }
};
const $set = (result, func) => {
    let i = 0;
    let key;
    for (key of result.keys()) {
        func(key, i++, result);
    }
};
const $number = (result, func) => {
    let i = 0;
    for (; i < result; ++i) {
        func(i, i, result);
    }
};
const getKeyValue = (keyMap, key, item, scope, binding) => {
    let value = keyMap.get(item);
    if (value === void 0) {
        if (typeof key === 'string') {
            value = item[key];
        }
        else {
            value = runtime.astEvaluate(key, scope, binding, null);
        }
        keyMap.set(item, value);
    }
    return value;
};
const getScope = (scopeMap, item, forOf, parentScope, binding, local, hasDestructuredLocal) => {
    let scope = scopeMap.get(item);
    if (scope === void 0) {
        if (hasDestructuredLocal) {
            runtime.astAssign(forOf.declaration, scope = runtime.Scope.fromParent(parentScope, new runtime.BindingContext()), binding, item);
        }
        else {
            scope = runtime.Scope.fromParent(parentScope, new runtime.BindingContext(local, item));
        }
        scopeMap.set(item, scope);
    }
    return scope;
};

class With {
    constructor(factory, location) {
        this.view = factory.create().setLocation(location);
    }
    valueChanged(newValue, _oldValue, _flags) {
        const $controller = this.$controller;
        const bindings = this.view.bindings;
        let scope;
        let i = 0, ii = 0;
        if ($controller.isActive && bindings != null) {
            scope = runtime.Scope.fromParent($controller.scope, newValue === void 0 ? {} : newValue);
            for (ii = bindings.length; ii > i; ++i) {
                bindings[i].bind(scope);
            }
        }
    }
    attaching(initiator, parent, flags) {
        const { $controller, value } = this;
        const scope = runtime.Scope.fromParent($controller.scope, value === void 0 ? {} : value);
        return this.view.activate(initiator, $controller, flags, scope);
    }
    detaching(initiator, parent, flags) {
        return this.view.deactivate(initiator, this.$controller, flags);
    }
    dispose() {
        this.view.dispose();
        this.view = (void 0);
    }
    accept(visitor) {
        if (this.view?.accept(visitor) === true) {
            return true;
        }
    }
}
With.inject = [IViewFactory, IRenderLocation];
__decorate([
    bindable
], With.prototype, "value", void 0);
templateController('with')(With);

exports.Switch = class Switch {
    constructor(_factory, _location) {
        this._factory = _factory;
        this._location = _location;
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
    }
    link(_controller, _childController, _target, _instruction) {
        this.view = this._factory.create(this.$controller).setLocation(this._location);
    }
    attaching(initiator, parent, flags) {
        const view = this.view;
        const $controller = this.$controller;
        this.queue(() => view.activate(initiator, $controller, flags, $controller.scope));
        this.queue(() => this.swap(initiator, this.value));
        return this.promise;
    }
    detaching(initiator, parent, flags) {
        this.queue(() => {
            const view = this.view;
            return view.deactivate(initiator, this.$controller, flags);
        });
        return this.promise;
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
    valueChanged(_newValue, _oldValue) {
        if (!this.$controller.isActive) {
            return;
        }
        this.queue(() => this.swap(null, this.value));
    }
    caseChanged($case) {
        this.queue(() => this._handleCaseChange($case));
    }
    _handleCaseChange($case) {
        const isMatch = $case.isMatch(this.value);
        const activeCases = this.activeCases;
        const numActiveCases = activeCases.length;
        if (!isMatch) {
            if (numActiveCases > 0 && activeCases[0].id === $case.id) {
                return this._clearActiveCases(null);
            }
            return;
        }
        if (numActiveCases > 0 && activeCases[0].id < $case.id) {
            return;
        }
        const newActiveCases = [];
        let fallThrough = $case.fallThrough;
        if (!fallThrough) {
            newActiveCases.push($case);
        }
        else {
            const cases = this.cases;
            const idx = cases.indexOf($case);
            for (let i = idx, ii = cases.length; i < ii && fallThrough; i++) {
                const c = cases[i];
                newActiveCases.push(c);
                fallThrough = c.fallThrough;
            }
        }
        return kernel.onResolve(this._clearActiveCases(null, newActiveCases), () => {
            this.activeCases = newActiveCases;
            return this._activateCases(null);
        });
    }
    swap(initiator, value) {
        const newActiveCases = [];
        let fallThrough = false;
        for (const $case of this.cases) {
            if (fallThrough || $case.isMatch(value)) {
                newActiveCases.push($case);
                fallThrough = $case.fallThrough;
            }
            if (newActiveCases.length > 0 && !fallThrough) {
                break;
            }
        }
        const defaultCase = this.defaultCase;
        if (newActiveCases.length === 0 && defaultCase !== void 0) {
            newActiveCases.push(defaultCase);
        }
        return kernel.onResolve(this.activeCases.length > 0
            ? this._clearActiveCases(initiator, newActiveCases)
            : void 0, () => {
            this.activeCases = newActiveCases;
            if (newActiveCases.length === 0) {
                return;
            }
            return this._activateCases(initiator);
        });
    }
    _activateCases(initiator) {
        const controller = this.$controller;
        if (!controller.isActive) {
            return;
        }
        const cases = this.activeCases;
        const length = cases.length;
        if (length === 0) {
            return;
        }
        const scope = controller.scope;
        if (length === 1) {
            return cases[0].activate(initiator, 0, scope);
        }
        return kernel.resolveAll(...cases.map(($case) => $case.activate(initiator, 0, scope)));
    }
    _clearActiveCases(initiator, newActiveCases = []) {
        const cases = this.activeCases;
        const numCases = cases.length;
        if (numCases === 0) {
            return;
        }
        if (numCases === 1) {
            const firstCase = cases[0];
            if (!newActiveCases.includes(firstCase)) {
                cases.length = 0;
                return firstCase.deactivate(initiator, 0);
            }
            return;
        }
        return kernel.onResolve(kernel.resolveAll(...cases.reduce((acc, $case) => {
            if (!newActiveCases.includes($case)) {
                acc.push($case.deactivate(initiator, 0));
            }
            return acc;
        }, [])), () => {
            cases.length = 0;
        });
    }
    queue(action) {
        const previousPromise = this.promise;
        let promise = void 0;
        promise = this.promise = kernel.onResolve(kernel.onResolve(previousPromise, action), () => {
            if (this.promise === promise) {
                this.promise = void 0;
            }
        });
    }
    accept(visitor) {
        if (this.$controller.accept(visitor) === true) {
            return true;
        }
        if (this.activeCases.some(x => x.accept(visitor))) {
            return true;
        }
    }
};
__decorate([
    bindable
], exports.Switch.prototype, "value", void 0);
exports.Switch = __decorate([
    templateController('switch'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation)
], exports.Switch);
let caseId = 0;
exports.Case = class Case {
    constructor(_factory, _locator, _location, logger) {
        this._factory = _factory;
        this._locator = _locator;
        this._location = _location;
        this.id = ++caseId;
        this.fallThrough = false;
        this.view = void 0;
        this._debug = logger.config.level <= 1;
        this._logger = logger.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(controller, _childController, _target, _instruction) {
        const switchController = controller.parent;
        const $switch = switchController?.viewModel;
        if ($switch instanceof exports.Switch) {
            this.$switch = $switch;
            this.linkToSwitch($switch);
        }
        else {
            throw createError(`AUR0815: The parent switch not found; only "*[switch] > *[case|default-case]" relation is supported.`);
        }
    }
    detaching(initiator, parent, flags) {
        return this.deactivate(initiator, flags);
    }
    isMatch(value) {
        this._logger.debug('isMatch()');
        const $value = this.value;
        if (isArray($value)) {
            if (this._observer === void 0) {
                this._observer = this._observeCollection($value);
            }
            return $value.includes(value);
        }
        return $value === value;
    }
    valueChanged(newValue, _oldValue) {
        if (isArray(newValue)) {
            this._observer?.unsubscribe(this);
            this._observer = this._observeCollection(newValue);
        }
        else if (this._observer !== void 0) {
            this._observer.unsubscribe(this);
        }
        this.$switch.caseChanged(this);
    }
    handleCollectionChange() {
        this.$switch.caseChanged(this);
    }
    activate(initiator, flags, scope) {
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(initiator ?? view, this.$controller, flags, scope);
    }
    deactivate(initiator, flags) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(initiator ?? view, this.$controller, flags);
    }
    dispose() {
        this._observer?.unsubscribe(this);
        this.view?.dispose();
        this.view = (void 0);
    }
    linkToSwitch(auSwitch) {
        auSwitch.cases.push(this);
    }
    _observeCollection($value) {
        const observer = this._locator.getArrayObserver($value);
        observer.subscribe(this);
        return observer;
    }
    accept(visitor) {
        if (this.$controller.accept(visitor) === true) {
            return true;
        }
        return this.view?.accept(visitor);
    }
};
exports.Case.inject = [IViewFactory, runtime.IObserverLocator, IRenderLocation, kernel.ILogger];
__decorate([
    bindable
], exports.Case.prototype, "value", void 0);
__decorate([
    bindable({
        set: v => {
            switch (v) {
                case 'true': return true;
                case 'false': return false;
                default: return !!v;
            }
        },
        mode: 1
    })
], exports.Case.prototype, "fallThrough", void 0);
exports.Case = __decorate([
    templateController('case')
], exports.Case);
exports.DefaultCase = class DefaultCase extends exports.Case {
    linkToSwitch($switch) {
        if ($switch.defaultCase !== void 0) {
            throw createError(`AUR0816: Multiple 'default-case's are not allowed.`);
        }
        $switch.defaultCase = this;
    }
};
exports.DefaultCase = __decorate([
    templateController('default-case')
], exports.DefaultCase);

exports.PromiseTemplateController = class PromiseTemplateController {
    constructor(_factory, _location, _platform, logger) {
        this._factory = _factory;
        this._location = _location;
        this._platform = _platform;
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.logger = logger.scopeTo('promise.resolve');
    }
    link(_controller, _childController, _target, _instruction) {
        this.view = this._factory.create(this.$controller).setLocation(this._location);
    }
    attaching(initiator, parent, flags) {
        const view = this.view;
        const $controller = this.$controller;
        return kernel.onResolve(view.activate(initiator, $controller, flags, this.viewScope = runtime.Scope.fromParent($controller.scope, {})), () => this.swap(initiator, flags));
    }
    valueChanged(_newValue, _oldValue, flags) {
        if (!this.$controller.isActive) {
            return;
        }
        this.swap(null, flags);
    }
    swap(initiator, flags) {
        const value = this.value;
        if (!isPromise(value)) {
            this.logger.warn(`The value '${String(value)}' is not a promise. No change will be done.`);
            return;
        }
        const q = this._platform.domWriteQueue;
        const fulfilled = this.fulfilled;
        const rejected = this.rejected;
        const pending = this.pending;
        const s = this.viewScope;
        let preSettlePromise;
        const defaultQueuingOptions = { reusable: false };
        const $swap = () => {
            void kernel.resolveAll(preSettlePromise = (this.preSettledTask = q.queueTask(() => {
                return kernel.resolveAll(fulfilled?.deactivate(initiator, flags), rejected?.deactivate(initiator, flags), pending?.activate(initiator, flags, s));
            }, defaultQueuingOptions)).result.catch((err) => { if (!(err instanceof platform.TaskAbortError))
                throw err; }), value
                .then((data) => {
                if (this.value !== value) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = q.queueTask(() => kernel.resolveAll(pending?.deactivate(initiator, flags), rejected?.deactivate(initiator, flags), fulfilled?.activate(initiator, flags, s, data)), defaultQueuingOptions)).result;
                };
                if (this.preSettledTask.status === 1) {
                    void preSettlePromise.then(fulfill);
                }
                else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }, (err) => {
                if (this.value !== value) {
                    return;
                }
                const reject = () => {
                    this.postSettlePromise = (this.postSettledTask = q.queueTask(() => kernel.resolveAll(pending?.deactivate(initiator, flags), fulfilled?.deactivate(initiator, flags), rejected?.activate(initiator, flags, s, err)), defaultQueuingOptions)).result;
                };
                if (this.preSettledTask.status === 1) {
                    void preSettlePromise.then(reject);
                }
                else {
                    this.preSettledTask.cancel();
                    reject();
                }
            }));
        };
        if (this.postSettledTask?.status === 1) {
            void this.postSettlePromise.then($swap);
        }
        else {
            this.postSettledTask?.cancel();
            $swap();
        }
    }
    detaching(initiator, parent, flags) {
        this.preSettledTask?.cancel();
        this.postSettledTask?.cancel();
        this.preSettledTask = this.postSettledTask = null;
        return this.view.deactivate(initiator, this.$controller, flags);
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable
], exports.PromiseTemplateController.prototype, "value", void 0);
exports.PromiseTemplateController = __decorate([
    templateController('promise'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation),
    __param(2, IPlatform),
    __param(3, kernel.ILogger)
], exports.PromiseTemplateController);
exports.PendingTemplateController = class PendingTemplateController {
    constructor(_factory, _location) {
        this._factory = _factory;
        this._location = _location;
        this.view = void 0;
    }
    link(controller, _childController, _target, _instruction) {
        getPromiseController(controller).pending = this;
    }
    activate(initiator, flags, scope) {
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(view, this.$controller, flags, scope);
    }
    deactivate(initiator, flags) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(view, this.$controller, flags);
    }
    detaching(initiator, parent, flags) {
        return this.deactivate(initiator, flags);
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable({ mode: 2 })
], exports.PendingTemplateController.prototype, "value", void 0);
exports.PendingTemplateController = __decorate([
    templateController('pending'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation)
], exports.PendingTemplateController);
exports.FulfilledTemplateController = class FulfilledTemplateController {
    constructor(_factory, _location) {
        this._factory = _factory;
        this._location = _location;
        this.view = void 0;
    }
    link(controller, _childController, _target, _instruction) {
        getPromiseController(controller).fulfilled = this;
    }
    activate(initiator, flags, scope, resolvedValue) {
        this.value = resolvedValue;
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(view, this.$controller, flags, scope);
    }
    deactivate(initiator, flags) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(view, this.$controller, flags);
    }
    detaching(initiator, parent, flags) {
        return this.deactivate(initiator, flags);
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable({ mode: 4 })
], exports.FulfilledTemplateController.prototype, "value", void 0);
exports.FulfilledTemplateController = __decorate([
    templateController('then'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation)
], exports.FulfilledTemplateController);
exports.RejectedTemplateController = class RejectedTemplateController {
    constructor(_factory, _location) {
        this._factory = _factory;
        this._location = _location;
        this.view = void 0;
    }
    link(controller, _childController, _target, _instruction) {
        getPromiseController(controller).rejected = this;
    }
    activate(initiator, flags, scope, error) {
        this.value = error;
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(view, this.$controller, flags, scope);
    }
    deactivate(initiator, flags) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(view, this.$controller, flags);
    }
    detaching(initiator, parent, flags) {
        return this.deactivate(initiator, flags);
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable({ mode: 4 })
], exports.RejectedTemplateController.prototype, "value", void 0);
exports.RejectedTemplateController = __decorate([
    templateController('catch'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation)
], exports.RejectedTemplateController);
function getPromiseController(controller) {
    const promiseController = controller.parent;
    const $promise = promiseController?.viewModel;
    if ($promise instanceof exports.PromiseTemplateController) {
        return $promise;
    }
    throw createError(`AUR0813: The parent promise.resolve not found; only "*[promise.resolve] > *[pending|then|catch]" relation is supported.`);
}
let PromiseAttributePattern = class PromiseAttributePattern {
    'promise.resolve'(name, value, _parts) {
        return new AttrSyntax(name, value, 'promise', 'bind');
    }
};
PromiseAttributePattern = __decorate([
    attributePattern({ pattern: 'promise.resolve', symbols: '' })
], PromiseAttributePattern);
let FulfilledAttributePattern = class FulfilledAttributePattern {
    'then'(name, value, _parts) {
        return new AttrSyntax(name, value, 'then', 'from-view');
    }
};
FulfilledAttributePattern = __decorate([
    attributePattern({ pattern: 'then', symbols: '' })
], FulfilledAttributePattern);
let RejectedAttributePattern = class RejectedAttributePattern {
    'catch'(name, value, _parts) {
        return new AttrSyntax(name, value, 'catch', 'from-view');
    }
};
RejectedAttributePattern = __decorate([
    attributePattern({ pattern: 'catch', symbols: '' })
], RejectedAttributePattern);

class AuCompose {
    constructor(_container, parent, host, _location, _platform, instruction, contextFactory) {
        this._container = _container;
        this.parent = parent;
        this.host = host;
        this._location = _location;
        this._platform = _platform;
        this.scopeBehavior = 'auto';
        this._composition = void 0;
        this._rendering = _container.get(IRendering);
        this._instruction = instruction;
        this._contextFactory = contextFactory;
    }
    static get inject() {
        return [kernel.IContainer, IController, INode, IRenderLocation, IPlatform, IInstruction, kernel.transient(CompositionContextFactory)];
    }
    get pending() {
        return this._pending;
    }
    get composition() {
        return this._composition;
    }
    attaching(initiator, _parent, _flags) {
        return this._pending = kernel.onResolve(this.queue(new ChangeInfo(this.view, this.viewModel, this.model, void 0), initiator), (context) => {
            if (this._contextFactory.isCurrent(context)) {
                this._pending = void 0;
            }
        });
    }
    detaching(initiator) {
        const cmpstn = this._composition;
        const pending = this._pending;
        this._contextFactory.invalidate();
        this._composition = this._pending = void 0;
        return kernel.onResolve(pending, () => cmpstn?.deactivate(initiator));
    }
    propertyChanged(name) {
        if (name === 'model' && this._composition != null) {
            this._composition.update(this.model);
            return;
        }
        this._pending = kernel.onResolve(this._pending, () => kernel.onResolve(this.queue(new ChangeInfo(this.view, this.viewModel, this.model, name), void 0), (context) => {
            if (this._contextFactory.isCurrent(context)) {
                this._pending = void 0;
            }
        }));
    }
    queue(change, initiator) {
        const factory = this._contextFactory;
        const compositionCtrl = this._composition;
        return kernel.onResolve(factory.create(change), context => {
            if (factory.isCurrent(context)) {
                return kernel.onResolve(this.compose(context), (result) => {
                    if (factory.isCurrent(context)) {
                        return kernel.onResolve(result.activate(initiator), () => {
                            if (factory.isCurrent(context)) {
                                this._composition = result;
                                return kernel.onResolve(compositionCtrl?.deactivate(initiator), () => context);
                            }
                            else {
                                return kernel.onResolve(result.controller.deactivate(result.controller, this.$controller, 2), () => {
                                    result.controller.dispose();
                                    return context;
                                });
                            }
                        });
                    }
                    result.controller.dispose();
                    return context;
                });
            }
            return context;
        });
    }
    compose(context) {
        let comp;
        let compositionHost;
        let removeCompositionHost;
        const { view, viewModel, model } = context.change;
        const { _container: container, host, $controller, _location: loc } = this;
        const vmDef = this.getDef(viewModel);
        const childCtn = container.createChild();
        const parentNode = loc == null ? host.parentNode : loc.parentNode;
        if (vmDef !== null) {
            if (vmDef.containerless) {
                throw createError(`AUR0806: Containerless custom element is not supported by <au-compose/>`);
            }
            if (loc == null) {
                compositionHost = host;
                removeCompositionHost = () => {
                };
            }
            else {
                compositionHost = parentNode.insertBefore(this._platform.document.createElement(vmDef.name), loc);
                removeCompositionHost = () => {
                    compositionHost.remove();
                };
            }
            comp = this.getVm(childCtn, viewModel, compositionHost);
        }
        else {
            compositionHost = loc == null
                ? host
                : loc;
            comp = this.getVm(childCtn, viewModel, compositionHost);
        }
        const compose = () => {
            if (vmDef !== null) {
                const controller = Controller.$el(childCtn, comp, compositionHost, { projections: this._instruction.projections }, vmDef);
                return new CompositionController(controller, (attachInitiator) => controller.activate(attachInitiator ?? controller, $controller, 1, $controller.scope.parent), (deactachInitiator) => kernel.onResolve(controller.deactivate(deactachInitiator ?? controller, $controller, 2), removeCompositionHost), (model) => comp.activate?.(model), context);
            }
            else {
                const targetDef = CustomElementDefinition.create({
                    name: CustomElement.generateName(),
                    template: view,
                });
                const viewFactory = this._rendering.getViewFactory(targetDef, childCtn);
                const controller = Controller.$view(viewFactory, $controller);
                const scope = this.scopeBehavior === 'auto'
                    ? runtime.Scope.fromParent(this.parent.scope, comp)
                    : runtime.Scope.create(comp);
                if (isRenderLocation(compositionHost)) {
                    controller.setLocation(compositionHost);
                }
                else {
                    controller.setHost(compositionHost);
                }
                return new CompositionController(controller, (attachInitiator) => controller.activate(attachInitiator ?? controller, $controller, 1, scope), (detachInitiator) => controller.deactivate(detachInitiator ?? controller, $controller, 2), (model) => comp.activate?.(model), context);
            }
        };
        if ('activate' in comp) {
            return kernel.onResolve(comp.activate(model), () => compose());
        }
        else {
            return compose();
        }
    }
    getVm(container, comp, host) {
        if (comp == null) {
            return new EmptyComponent();
        }
        if (typeof comp === 'object') {
            return comp;
        }
        const p = this._platform;
        const isLocation = isRenderLocation(host);
        registerResolver(container, p.Element, registerResolver(container, INode, new kernel.InstanceProvider('ElementResolver', isLocation ? null : host)));
        registerResolver(container, IRenderLocation, new kernel.InstanceProvider('IRenderLocation', isLocation ? host : null));
        const instance = container.invoke(comp);
        registerResolver(container, comp, new kernel.InstanceProvider('au-compose.viewModel', instance));
        return instance;
    }
    getDef(component) {
        const Ctor = (isFunction(component)
            ? component
            : component?.constructor);
        return CustomElement.isType(Ctor)
            ? CustomElement.getDefinition(Ctor)
            : null;
    }
}
__decorate([
    bindable
], AuCompose.prototype, "view", void 0);
__decorate([
    bindable
], AuCompose.prototype, "viewModel", void 0);
__decorate([
    bindable
], AuCompose.prototype, "model", void 0);
__decorate([
    bindable({
        set: v => {
            if (v === 'scoped' || v === 'auto') {
                return v;
            }
            throw createError(`AUR0805: Invalid scope behavior config. Only "scoped" or "auto" allowed.`);
        }
    })
], AuCompose.prototype, "scopeBehavior", void 0);
customElement('au-compose')(AuCompose);
class EmptyComponent {
}
class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    isCurrent(context) {
        return context.id === this.id;
    }
    create(changes) {
        return kernel.onResolve(changes.load(), (loaded) => new CompositionContext(++this.id, loaded));
    }
    invalidate() {
        this.id++;
    }
}
class ChangeInfo {
    constructor(view, viewModel, model, src) {
        this.view = view;
        this.viewModel = viewModel;
        this.model = model;
        this.src = src;
    }
    load() {
        if (isPromise(this.view) || isPromise(this.viewModel)) {
            return Promise
                .all([this.view, this.viewModel])
                .then(([view, viewModel]) => {
                return new LoadedChangeInfo(view, viewModel, this.model, this.src);
            });
        }
        else {
            return new LoadedChangeInfo(this.view, this.viewModel, this.model, this.src);
        }
    }
}
class LoadedChangeInfo {
    constructor(view, viewModel, model, src) {
        this.view = view;
        this.viewModel = viewModel;
        this.model = model;
        this.src = src;
    }
}
class CompositionContext {
    constructor(id, change) {
        this.id = id;
        this.change = change;
    }
}
class CompositionController {
    constructor(controller, start, stop, update, context) {
        this.controller = controller;
        this.start = start;
        this.stop = stop;
        this.update = update;
        this.context = context;
        this.state = 0;
    }
    activate(initiator) {
        if (this.state !== 0) {
            throw createError(`AUR0807: Composition has already been activated/deactivated. Id: ${this.controller.name}`);
        }
        this.state = 1;
        return this.start(initiator);
    }
    deactivate(detachInitator) {
        switch (this.state) {
            case 1:
                this.state = -1;
                return this.stop(detachInitator);
            case -1:
                throw createError(`AUR0808: Composition has already been deactivated.`);
            default:
                this.state = -1;
        }
    }
}

exports.AuSlot = class AuSlot {
    constructor(location, instruction, hdrContext, rendering) {
        this._parentScope = null;
        this._outerScope = null;
        let factory;
        const slotInfo = instruction.auSlot;
        const projection = hdrContext.instruction?.projections?.[slotInfo.name];
        if (projection == null) {
            factory = rendering.getViewFactory(slotInfo.fallback, hdrContext.controller.container);
            this._hasProjection = false;
        }
        else {
            factory = rendering.getViewFactory(projection, hdrContext.parent.controller.container);
            this._hasProjection = true;
        }
        this._hdrContext = hdrContext;
        this.view = factory.create().setLocation(location);
    }
    static get inject() { return [IRenderLocation, IInstruction, IHydrationContext, IRendering]; }
    binding(_initiator, _parent, _flags) {
        this._parentScope = this.$controller.scope.parent;
        let outerScope;
        if (this._hasProjection) {
            outerScope = this._hdrContext.controller.scope.parent;
            (this._outerScope = runtime.Scope.fromParent(outerScope, outerScope.bindingContext))
                .overrideContext.$host = this.expose ?? this._parentScope.bindingContext;
        }
    }
    attaching(initiator, parent, flags) {
        return this.view.activate(initiator, this.$controller, flags, this._hasProjection ? this._outerScope : this._parentScope);
    }
    detaching(initiator, parent, flags) {
        return this.view.deactivate(initiator, this.$controller, flags);
    }
    exposeChanged(v) {
        if (this._hasProjection && this._outerScope != null) {
            this._outerScope.overrideContext.$host = v;
        }
    }
    dispose() {
        this.view.dispose();
        this.view = (void 0);
    }
    accept(visitor) {
        if (this.view?.accept(visitor) === true) {
            return true;
        }
    }
};
__decorate([
    bindable
], exports.AuSlot.prototype, "expose", void 0);
exports.AuSlot = __decorate([
    customElement({
        name: 'au-slot',
        template: null,
        containerless: true
    })
], exports.AuSlot);

const ISanitizer = createInterface('ISanitizer', x => x.singleton(class {
    sanitize() {
        throw createError('"sanitize" method not implemented');
    }
}));
exports.SanitizeValueConverter = class SanitizeValueConverter {
    constructor(_sanitizer) {
        this._sanitizer = _sanitizer;
    }
    toView(untrustedMarkup) {
        if (untrustedMarkup == null) {
            return null;
        }
        return this._sanitizer.sanitize(untrustedMarkup);
    }
};
exports.SanitizeValueConverter = __decorate([
    __param(0, ISanitizer)
], exports.SanitizeValueConverter);
valueConverter('sanitize')(exports.SanitizeValueConverter);

const DebounceBindingBehaviorRegistration = DebounceBindingBehavior;
const OneTimeBindingBehaviorRegistration = OneTimeBindingBehavior;
const ToViewBindingBehaviorRegistration = ToViewBindingBehavior;
const FromViewBindingBehaviorRegistration = FromViewBindingBehavior;
const SignalBindingBehaviorRegistration = SignalBindingBehavior;
const ThrottleBindingBehaviorRegistration = ThrottleBindingBehavior;
const TwoWayBindingBehaviorRegistration = TwoWayBindingBehavior;
const ITemplateCompilerRegistration = TemplateCompiler;
const INodeObserverLocatorRegistration = NodeObserverLocator;
const DefaultComponents = [
    ITemplateCompilerRegistration,
    INodeObserverLocatorRegistration,
];
const SVGAnalyzerRegistration = SVGAnalyzer;
const AtPrefixedTriggerAttributePatternRegistration = exports.AtPrefixedTriggerAttributePattern;
const ColonPrefixedBindAttributePatternRegistration = exports.ColonPrefixedBindAttributePattern;
const RefAttributePatternRegistration = exports.RefAttributePattern;
const DotSeparatedAttributePatternRegistration = exports.DotSeparatedAttributePattern;
const SpreadAttributePatternRegistration = SpreadAttributePattern;
const DefaultBindingSyntax = [
    RefAttributePatternRegistration,
    DotSeparatedAttributePatternRegistration,
    SpreadAttributePatternRegistration,
];
const ShortHandBindingSyntax = [
    AtPrefixedTriggerAttributePatternRegistration,
    ColonPrefixedBindAttributePatternRegistration
];
const DefaultBindingCommandRegistration = exports.DefaultBindingCommand;
const ForBindingCommandRegistration = exports.ForBindingCommand;
const FromViewBindingCommandRegistration = exports.FromViewBindingCommand;
const OneTimeBindingCommandRegistration = exports.OneTimeBindingCommand;
const ToViewBindingCommandRegistration = exports.ToViewBindingCommand;
const TwoWayBindingCommandRegistration = exports.TwoWayBindingCommand;
const RefBindingCommandRegistration = RefBindingCommand;
const TriggerBindingCommandRegistration = exports.TriggerBindingCommand;
const CaptureBindingCommandRegistration = exports.CaptureBindingCommand;
const AttrBindingCommandRegistration = exports.AttrBindingCommand;
const ClassBindingCommandRegistration = exports.ClassBindingCommand;
const StyleBindingCommandRegistration = exports.StyleBindingCommand;
const SpreadBindingCommandRegistration = SpreadBindingCommand;
const DefaultBindingLanguage = [
    DefaultBindingCommandRegistration,
    OneTimeBindingCommandRegistration,
    FromViewBindingCommandRegistration,
    ToViewBindingCommandRegistration,
    TwoWayBindingCommandRegistration,
    ForBindingCommandRegistration,
    RefBindingCommandRegistration,
    TriggerBindingCommandRegistration,
    CaptureBindingCommandRegistration,
    ClassBindingCommandRegistration,
    StyleBindingCommandRegistration,
    AttrBindingCommandRegistration,
    SpreadBindingCommandRegistration,
];
const SanitizeValueConverterRegistration = exports.SanitizeValueConverter;
const IfRegistration = If;
const ElseRegistration = Else;
const RepeatRegistration = Repeat;
const WithRegistration = With;
const SwitchRegistration = exports.Switch;
const CaseRegistration = exports.Case;
const DefaultCaseRegistration = exports.DefaultCase;
const PromiseTemplateControllerRegistration = exports.PromiseTemplateController;
const PendingTemplateControllerRegistration = exports.PendingTemplateController;
const FulfilledTemplateControllerRegistration = exports.FulfilledTemplateController;
const RejectedTemplateControllerRegistration = exports.RejectedTemplateController;
const PromiseAttributePatternRegistration = PromiseAttributePattern;
const FulfilledAttributePatternRegistration = FulfilledAttributePattern;
const RejectedAttributePatternRegistration = RejectedAttributePattern;
const SelfBindingBehaviorRegistration = SelfBindingBehavior;
const UpdateTriggerBindingBehaviorRegistration = UpdateTriggerBindingBehavior;
const AuComposeRegistration = AuCompose;
const PortalRegistration = Portal;
const FocusRegistration = Focus;
const ShowRegistration = Show;
const DefaultResources = [
    DebounceBindingBehaviorRegistration,
    OneTimeBindingBehaviorRegistration,
    ToViewBindingBehaviorRegistration,
    FromViewBindingBehaviorRegistration,
    SignalBindingBehaviorRegistration,
    ThrottleBindingBehaviorRegistration,
    TwoWayBindingBehaviorRegistration,
    SanitizeValueConverterRegistration,
    IfRegistration,
    ElseRegistration,
    RepeatRegistration,
    WithRegistration,
    SwitchRegistration,
    CaseRegistration,
    DefaultCaseRegistration,
    PromiseTemplateControllerRegistration,
    PendingTemplateControllerRegistration,
    FulfilledTemplateControllerRegistration,
    RejectedTemplateControllerRegistration,
    PromiseAttributePatternRegistration,
    FulfilledAttributePatternRegistration,
    RejectedAttributePatternRegistration,
    AttrBindingBehavior,
    SelfBindingBehaviorRegistration,
    UpdateTriggerBindingBehaviorRegistration,
    AuComposeRegistration,
    PortalRegistration,
    FocusRegistration,
    ShowRegistration,
    exports.AuSlot,
];
const DefaultRenderers = [
    exports.PropertyBindingRenderer,
    exports.IteratorBindingRenderer,
    exports.RefBindingRenderer,
    exports.InterpolationBindingRenderer,
    exports.SetPropertyRenderer,
    exports.CustomElementRenderer,
    exports.CustomAttributeRenderer,
    exports.TemplateControllerRenderer,
    exports.LetElementRenderer,
    exports.ListenerBindingRenderer,
    exports.AttributeBindingRenderer,
    exports.SetAttributeRenderer,
    exports.SetClassAttributeRenderer,
    exports.SetStyleAttributeRenderer,
    exports.StylePropertyBindingRenderer,
    exports.TextBindingRenderer,
    exports.SpreadRenderer,
];
const StandardConfiguration = createConfiguration(kernel.noop);
function createConfiguration(optionsProvider) {
    return {
        optionsProvider,
        register(container) {
            const runtimeConfigurationOptions = {
                coercingOptions: {
                    enableCoercion: false,
                    coerceNullish: false
                }
            };
            optionsProvider(runtimeConfigurationOptions);
            return container.register(instanceRegistration(runtime.ICoercionConfiguration, runtimeConfigurationOptions.coercingOptions), ...DefaultComponents, ...DefaultResources, ...DefaultBindingSyntax, ...DefaultBindingLanguage, ...DefaultRenderers);
        },
        customize(cb) {
            return createConfiguration(cb ?? optionsProvider);
        },
    };
}

const IAurelia = createInterface('IAurelia');
class Aurelia {
    constructor(container = kernel.DI.createContainer()) {
        this.container = container;
        this._isRunning = false;
        this._isStarting = false;
        this._isStopping = false;
        this._root = void 0;
        this.next = void 0;
        this._startPromise = void 0;
        this._stopPromise = void 0;
        if (container.has(IAurelia, true)) {
            throw createError(`AUR0768: An instance of Aurelia is already registered with the container or an ancestor of it.`);
        }
        registerResolver(container, IAurelia, new kernel.InstanceProvider('IAurelia', this));
        registerResolver(container, IAppRoot, this._rootProvider = new kernel.InstanceProvider('IAppRoot'));
    }
    get isRunning() { return this._isRunning; }
    get isStarting() { return this._isStarting; }
    get isStopping() { return this._isStopping; }
    get root() {
        if (this._root == null) {
            if (this.next == null) {
                throw createError(`AUR0767: root is not defined`);
            }
            return this.next;
        }
        return this._root;
    }
    register(...params) {
        this.container.register(...params);
        return this;
    }
    app(config) {
        this.next = new AppRoot(config, this._initPlatform(config.host), this.container, this._rootProvider);
        return this;
    }
    enhance(config, parentController) {
        const ctn = config.container ?? this.container.createChild();
        const host = config.host;
        const p = this._initPlatform(host);
        const comp = config.component;
        let bc;
        if (isFunction(comp)) {
            registerResolver(ctn, p.HTMLElement, registerResolver(ctn, p.Element, registerResolver(ctn, INode, new kernel.InstanceProvider('ElementResolver', host))));
            bc = ctn.invoke(comp);
        }
        else {
            bc = comp;
        }
        registerResolver(ctn, IEventTarget, new kernel.InstanceProvider('IEventTarget', host));
        parentController = parentController ?? null;
        const view = Controller.$el(ctn, bc, host, null, CustomElementDefinition.create({ name: generateElementName(), template: host, enhance: true }));
        return kernel.onResolve(view.activate(view, parentController, 1), () => view);
    }
    async waitForIdle() {
        const platform = this.root.platform;
        await platform.domWriteQueue.yield();
        await platform.domReadQueue.yield();
        await platform.taskQueue.yield();
    }
    _initPlatform(host) {
        let p;
        if (!this.container.has(IPlatform, false)) {
            if (host.ownerDocument.defaultView === null) {
                throw createError(`AUR0769: Failed to initialize the platform object. The host element's ownerDocument does not have a defaultView`);
            }
            p = new platformBrowser.BrowserPlatform(host.ownerDocument.defaultView);
            this.container.register(instanceRegistration(IPlatform, p));
        }
        else {
            p = this.container.get(IPlatform);
        }
        return p;
    }
    start(root = this.next) {
        if (root == null) {
            throw createError(`AUR0770: There is no composition root`);
        }
        if (isPromise(this._startPromise)) {
            return this._startPromise;
        }
        return this._startPromise = kernel.onResolve(this.stop(), () => {
            Reflect.set(root.host, '$aurelia', this);
            this._rootProvider.prepare(this._root = root);
            this._isStarting = true;
            return kernel.onResolve(root.activate(), () => {
                this._isRunning = true;
                this._isStarting = false;
                this._startPromise = void 0;
                this._dispatchEvent(root, 'au-started', root.host);
            });
        });
    }
    stop(dispose = false) {
        if (isPromise(this._stopPromise)) {
            return this._stopPromise;
        }
        if (this._isRunning === true) {
            const root = this._root;
            this._isRunning = false;
            this._isStopping = true;
            return this._stopPromise = kernel.onResolve(root.deactivate(), () => {
                Reflect.deleteProperty(root.host, '$aurelia');
                if (dispose) {
                    root.dispose();
                }
                this._root = void 0;
                this._rootProvider.dispose();
                this._isStopping = false;
                this._dispatchEvent(root, 'au-stopped', root.host);
            });
        }
    }
    dispose() {
        if (this._isRunning || this._isStopping) {
            throw createError(`AUR0771: The aurelia instance must be fully stopped before it can be disposed`);
        }
        this.container.dispose();
    }
    _dispatchEvent(root, name, target) {
        const ev = new root.platform.window.CustomEvent(name, { detail: this, bubbles: true, cancelable: true });
        target.dispatchEvent(ev);
    }
}

exports.BindingMode = void 0;
(function (BindingMode) {
    BindingMode[BindingMode["oneTime"] = 1] = "oneTime";
    BindingMode[BindingMode["toView"] = 2] = "toView";
    BindingMode[BindingMode["fromView"] = 4] = "fromView";
    BindingMode[BindingMode["twoWay"] = 6] = "twoWay";
    BindingMode[BindingMode["default"] = 8] = "default";
})(exports.BindingMode || (exports.BindingMode = {}));

exports.DefinitionType = void 0;
(function (DefinitionType) {
    DefinitionType[DefinitionType["Element"] = 1] = "Element";
    DefinitionType[DefinitionType["Attribute"] = 2] = "Attribute";
})(exports.DefinitionType || (exports.DefinitionType = {}));

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;
exports.AppRoot = AppRoot;
exports.AppTask = AppTask;
exports.AtPrefixedTriggerAttributePatternRegistration = AtPrefixedTriggerAttributePatternRegistration;
exports.AttrBindingBehavior = AttrBindingBehavior;
exports.AttrBindingCommandRegistration = AttrBindingCommandRegistration;
exports.AttrSyntax = AttrSyntax;
exports.AttributeBinding = AttributeBinding;
exports.AttributeBindingInstruction = AttributeBindingInstruction;
exports.AttributeNSAccessor = AttributeNSAccessor;
exports.AttributePattern = AttributePattern;
exports.AuCompose = AuCompose;
exports.AuSlotsInfo = AuSlotsInfo;
exports.Aurelia = Aurelia;
exports.Bindable = Bindable;
exports.BindableDefinition = BindableDefinition;
exports.BindableObserver = BindableObserver;
exports.BindablesInfo = BindablesInfo;
exports.BindingBehavior = BindingBehavior;
exports.BindingBehaviorDefinition = BindingBehaviorDefinition;
exports.BindingCommand = BindingCommand;
exports.BindingCommandDefinition = BindingCommandDefinition;
exports.BindingModeBehavior = BindingModeBehavior;
exports.BindingTargetSubscriber = BindingTargetSubscriber;
exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;
exports.CaptureBindingCommandRegistration = CaptureBindingCommandRegistration;
exports.CheckedObserver = CheckedObserver;
exports.Children = Children;
exports.ChildrenDefinition = ChildrenDefinition;
exports.ChildrenObserver = ChildrenObserver;
exports.ClassAttributeAccessor = ClassAttributeAccessor;
exports.ClassBindingCommandRegistration = ClassBindingCommandRegistration;
exports.ColonPrefixedBindAttributePatternRegistration = ColonPrefixedBindAttributePatternRegistration;
exports.ComputedWatcher = ComputedWatcher;
exports.ContentBinding = ContentBinding;
exports.Controller = Controller;
exports.CustomAttribute = CustomAttribute;
exports.CustomAttributeDefinition = CustomAttributeDefinition;
exports.CustomElement = CustomElement;
exports.CustomElementDefinition = CustomElementDefinition;
exports.DataAttributeAccessor = DataAttributeAccessor;
exports.DebounceBindingBehavior = DebounceBindingBehavior;
exports.DebounceBindingBehaviorRegistration = DebounceBindingBehaviorRegistration;
exports.DefaultBindingCommandRegistration = DefaultBindingCommandRegistration;
exports.DefaultBindingLanguage = DefaultBindingLanguage;
exports.DefaultBindingSyntax = DefaultBindingSyntax;
exports.DefaultComponents = DefaultComponents;
exports.DefaultRenderers = DefaultRenderers;
exports.DefaultResources = DefaultResources;
exports.DotSeparatedAttributePatternRegistration = DotSeparatedAttributePatternRegistration;
exports.Else = Else;
exports.ElseRegistration = ElseRegistration;
exports.ExpressionWatcher = ExpressionWatcher;
exports.FlushQueue = FlushQueue;
exports.Focus = Focus;
exports.ForBindingCommandRegistration = ForBindingCommandRegistration;
exports.FragmentNodeSequence = FragmentNodeSequence;
exports.FromViewBindingBehavior = FromViewBindingBehavior;
exports.FromViewBindingBehaviorRegistration = FromViewBindingBehaviorRegistration;
exports.FromViewBindingCommandRegistration = FromViewBindingCommandRegistration;
exports.HooksDefinition = HooksDefinition;
exports.HydrateAttributeInstruction = HydrateAttributeInstruction;
exports.HydrateElementInstruction = HydrateElementInstruction;
exports.HydrateLetElementInstruction = HydrateLetElementInstruction;
exports.HydrateTemplateController = HydrateTemplateController;
exports.IAppRoot = IAppRoot;
exports.IAppTask = IAppTask;
exports.IAttrMapper = IAttrMapper;
exports.IAttributeParser = IAttributeParser;
exports.IAttributePattern = IAttributePattern;
exports.IAuSlotsInfo = IAuSlotsInfo;
exports.IAurelia = IAurelia;
exports.IController = IController;
exports.IEventTarget = IEventTarget;
exports.IFlushQueue = IFlushQueue;
exports.IHistory = IHistory;
exports.IHydrationContext = IHydrationContext;
exports.IInstruction = IInstruction;
exports.ILifecycleHooks = ILifecycleHooks;
exports.ILocation = ILocation;
exports.INode = INode;
exports.INodeObserverLocatorRegistration = INodeObserverLocatorRegistration;
exports.IPlatform = IPlatform;
exports.IProjections = IProjections;
exports.IRenderLocation = IRenderLocation;
exports.IRenderer = IRenderer;
exports.IRendering = IRendering;
exports.ISVGAnalyzer = ISVGAnalyzer;
exports.ISanitizer = ISanitizer;
exports.IShadowDOMGlobalStyles = IShadowDOMGlobalStyles;
exports.IShadowDOMStyles = IShadowDOMStyles;
exports.ISyntaxInterpreter = ISyntaxInterpreter;
exports.ITemplateCompiler = ITemplateCompiler;
exports.ITemplateCompilerHooks = ITemplateCompilerHooks;
exports.ITemplateCompilerRegistration = ITemplateCompilerRegistration;
exports.ITemplateElementFactory = ITemplateElementFactory;
exports.IViewFactory = IViewFactory;
exports.IWindow = IWindow;
exports.If = If;
exports.IfRegistration = IfRegistration;
exports.InterpolationBinding = InterpolationBinding;
exports.InterpolationInstruction = InterpolationInstruction;
exports.InterpolationPartBinding = InterpolationPartBinding;
exports.Interpretation = Interpretation;
exports.IteratorBindingInstruction = IteratorBindingInstruction;
exports.LetBinding = LetBinding;
exports.LetBindingInstruction = LetBindingInstruction;
exports.LifecycleHooks = LifecycleHooks;
exports.LifecycleHooksDefinition = LifecycleHooksDefinition;
exports.LifecycleHooksEntry = LifecycleHooksEntry;
exports.ListenerBinding = ListenerBinding;
exports.ListenerBindingInstruction = ListenerBindingInstruction;
exports.ListenerBindingOptions = ListenerBindingOptions;
exports.MultiAttrInstruction = MultiAttrInstruction;
exports.NodeObserverLocator = NodeObserverLocator;
exports.NoopSVGAnalyzer = NoopSVGAnalyzer;
exports.OneTimeBindingBehavior = OneTimeBindingBehavior;
exports.OneTimeBindingBehaviorRegistration = OneTimeBindingBehaviorRegistration;
exports.OneTimeBindingCommandRegistration = OneTimeBindingCommandRegistration;
exports.Portal = Portal;
exports.PropertyBinding = PropertyBinding;
exports.PropertyBindingInstruction = PropertyBindingInstruction;
exports.RefAttributePatternRegistration = RefAttributePatternRegistration;
exports.RefBinding = RefBinding;
exports.RefBindingCommandRegistration = RefBindingCommandRegistration;
exports.RefBindingInstruction = RefBindingInstruction;
exports.Rendering = Rendering;
exports.Repeat = Repeat;
exports.RepeatRegistration = RepeatRegistration;
exports.SVGAnalyzer = SVGAnalyzer;
exports.SVGAnalyzerRegistration = SVGAnalyzerRegistration;
exports.SanitizeValueConverterRegistration = SanitizeValueConverterRegistration;
exports.SelectValueObserver = SelectValueObserver;
exports.SelfBindingBehavior = SelfBindingBehavior;
exports.SelfBindingBehaviorRegistration = SelfBindingBehaviorRegistration;
exports.SetAttributeInstruction = SetAttributeInstruction;
exports.SetClassAttributeInstruction = SetClassAttributeInstruction;
exports.SetPropertyInstruction = SetPropertyInstruction;
exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;
exports.ShadowDOMRegistry = ShadowDOMRegistry;
exports.ShortHandBindingSyntax = ShortHandBindingSyntax;
exports.SignalBindingBehavior = SignalBindingBehavior;
exports.SignalBindingBehaviorRegistration = SignalBindingBehaviorRegistration;
exports.SpreadBindingInstruction = SpreadBindingInstruction;
exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;
exports.StandardConfiguration = StandardConfiguration;
exports.StyleAttributeAccessor = StyleAttributeAccessor;
exports.StyleBindingCommandRegistration = StyleBindingCommandRegistration;
exports.StyleConfiguration = StyleConfiguration;
exports.StyleElementStyles = StyleElementStyles;
exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;
exports.TemplateCompiler = TemplateCompiler;
exports.TemplateCompilerHooks = TemplateCompilerHooks;
exports.TextBindingInstruction = TextBindingInstruction;
exports.ThrottleBindingBehavior = ThrottleBindingBehavior;
exports.ThrottleBindingBehaviorRegistration = ThrottleBindingBehaviorRegistration;
exports.ToViewBindingBehavior = ToViewBindingBehavior;
exports.ToViewBindingBehaviorRegistration = ToViewBindingBehaviorRegistration;
exports.ToViewBindingCommandRegistration = ToViewBindingCommandRegistration;
exports.TriggerBindingCommandRegistration = TriggerBindingCommandRegistration;
exports.TwoWayBindingBehavior = TwoWayBindingBehavior;
exports.TwoWayBindingBehaviorRegistration = TwoWayBindingBehaviorRegistration;
exports.TwoWayBindingCommandRegistration = TwoWayBindingCommandRegistration;
exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;
exports.UpdateTriggerBindingBehaviorRegistration = UpdateTriggerBindingBehaviorRegistration;
exports.ValueAttributeObserver = ValueAttributeObserver;
exports.ValueConverter = ValueConverter;
exports.ValueConverterDefinition = ValueConverterDefinition;
exports.ViewFactory = ViewFactory;
exports.Watch = Watch;
exports.With = With;
exports.WithRegistration = WithRegistration;
exports.alias = alias;
exports.allResources = allResources;
exports.attributePattern = attributePattern;
exports.bindable = bindable;
exports.bindingBehavior = bindingBehavior;
exports.bindingCommand = bindingCommand;
exports.capture = capture;
exports.children = children;
exports.coercer = coercer;
exports.containerless = containerless;
exports.convertToRenderLocation = convertToRenderLocation;
exports.cssModules = cssModules;
exports.customAttribute = customAttribute;
exports.customElement = customElement;
exports.getEffectiveParentNode = getEffectiveParentNode;
exports.getRef = getRef;
exports.isCustomElementController = isCustomElementController;
exports.isCustomElementViewModel = isCustomElementViewModel;
exports.isInstruction = isInstruction;
exports.isRenderLocation = isRenderLocation;
exports.lifecycleHooks = lifecycleHooks;
exports.mixinAstEvaluator = mixinAstEvaluator;
exports.mixinUseScope = mixinUseScope;
exports.mixingBindingLimited = mixingBindingLimited;
exports.processContent = processContent;
exports.registerAliases = registerAliases;
exports.renderer = renderer;
exports.setEffectiveParentNode = setEffectiveParentNode;
exports.setRef = setRef;
exports.shadowCSS = shadowCSS;
exports.strict = strict;
exports.templateCompilerHooks = templateCompilerHooks;
exports.templateController = templateController;
exports.useShadowDOM = useShadowDOM;
exports.valueConverter = valueConverter;
exports.watch = watch;
//# sourceMappingURL=index.dev.cjs.map
