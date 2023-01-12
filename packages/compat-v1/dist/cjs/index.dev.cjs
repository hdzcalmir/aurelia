'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var runtime = require('@aurelia/runtime');
var runtimeHtml = require('@aurelia/runtime-html');
var kernel = require('@aurelia/kernel');

let defined$1 = false;
function defineAstMethods() {
    if (defined$1) {
        return;
    }
    defined$1 = true;
    const def = (Klass, name, value) => Object.defineProperty(Klass.prototype, name, { configurable: true, enumerable: false, writable: true, value });
    [
        runtime.BindingBehaviorExpression,
        runtime.ValueConverterExpression,
        runtime.AssignExpression,
        runtime.ConditionalExpression,
        runtime.AccessThisExpression,
        runtime.AccessScopeExpression,
        runtime.AccessMemberExpression,
        runtime.AccessKeyedExpression,
        runtime.CallScopeExpression,
        runtime.CallMemberExpression,
        runtime.CallFunctionExpression,
        runtime.BinaryExpression,
        runtime.UnaryExpression,
        runtime.PrimitiveLiteralExpression,
        runtime.ArrayLiteralExpression,
        runtime.ObjectLiteralExpression,
        runtime.TemplateExpression,
        runtime.TaggedTemplateExpression,
        runtime.ArrayBindingPattern,
        runtime.ObjectBindingPattern,
        runtime.BindingIdentifier,
        runtime.ForOfStatement,
        runtime.Interpolation,
        runtime.DestructuringAssignmentExpression,
        runtime.DestructuringAssignmentSingleExpression,
        runtime.DestructuringAssignmentRestExpression,
        runtime.ArrowFunction,
    ].forEach(ast => {
        def(ast, 'evaluate', function (...args) {
            return runtime.astEvaluate(this, ...args);
        });
        def(ast, 'assign', function (...args) {
            return runtime.astAssign(this, ...args);
        });
        def(ast, 'accept', function (...args) {
            return runtime.astVisit(this, ...args);
        });
        def(ast, 'bind', function (...args) {
            return runtime.astBind(this, ...args);
        });
        def(ast, 'unbind', function (...args) {
            return runtime.astUnbind(this, ...args);
        });
        console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with $kind Custom.'
            + ' Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.');
    });
}

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

const createLookup = () => Object.create(null);
const isFunction = (v) => typeof v === 'function';
const isString = (v) => typeof v === 'string';
const ensureExpression = (parser, srcOrExpr, expressionType) => {
    if (isString(srcOrExpr)) {
        return parser.parse(srcOrExpr, expressionType);
    }
    return srcOrExpr;
};

const registeredSymbol$1 = Symbol('.call');
const callSyntax = {
    register(container) {
        if (!container[registeredSymbol$1]) {
            container[registeredSymbol$1] = true;
            container.register(exports.CallBindingCommand, exports.CallBindingRenderer);
        }
    }
};
const instructionType$1 = 'rh';
class CallBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = instructionType$1;
    }
}
exports.CallBindingCommand = class CallBindingCommand {
    get type() { return 0; }
    build(info, exprParser) {
        const target = info.bindable === null
            ? kernel.camelCase(info.attr.target)
            : info.bindable.property;
        return new CallBindingInstruction(exprParser.parse(info.attr.rawValue, (16 | 8)), target);
    }
};
exports.CallBindingCommand = __decorate([
    runtimeHtml.bindingCommand('call')
], exports.CallBindingCommand);
exports.CallBindingRenderer = class CallBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        const expr = ensureExpression(exprParser, instruction.from, 16 | 8);
        renderingCtrl.addBinding(new CallBinding(renderingCtrl.container, observerLocator, expr, getTarget(target), instruction.to));
    }
};
exports.CallBindingRenderer = __decorate([
    runtimeHtml.renderer(instructionType$1)
], exports.CallBindingRenderer);
function getTarget(potentialTarget) {
    if (potentialTarget.viewModel != null) {
        return potentialTarget.viewModel;
    }
    return potentialTarget;
}
class CallBinding {
    constructor(locator, observerLocator, ast, target, targetProperty) {
        this.ast = ast;
        this.target = target;
        this.targetProperty = targetProperty;
        this.isBound = false;
        this.boundFn = false;
        this.l = locator;
        this.targetObserver = observerLocator.getAccessor(target, targetProperty);
    }
    callSource(args) {
        const overrideContext = this._scope.overrideContext;
        overrideContext.$event = args;
        const result = runtime.astEvaluate(this.ast, this._scope, this, null);
        Reflect.deleteProperty(overrideContext, '$event');
        return result;
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
        this.targetObserver.setValue(($args) => this.callSource($args), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}
runtimeHtml.mixinUseScope(CallBinding);
runtimeHtml.mixingBindingLimited(CallBinding, () => 'callSource');
runtimeHtml.mixinAstEvaluator(true)(CallBinding);

const registeredSymbol = Symbol('.delegate');
const delegateSyntax = {
    register(container) {
        if (!container[registeredSymbol]) {
            container[registeredSymbol] = true;
            container.register(IEventDelegator, exports.DelegateBindingCommand, exports.ListenerBindingRenderer);
        }
    }
};
const instructionType = 'dl';
exports.DelegateBindingCommand = class DelegateBindingCommand {
    get type() { return 1; }
    build(info, exprParser) {
        return new DelegateBindingInstruction(exprParser.parse(info.attr.rawValue, 8), info.attr.target, false);
    }
};
exports.DelegateBindingCommand = __decorate([
    runtimeHtml.bindingCommand('delegate')
], exports.DelegateBindingCommand);
exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    constructor(eventDelegator) {
        this._eventDelegator = eventDelegator;
    }
    static get inject() { return [IEventDelegator]; }
    render(renderingCtrl, target, instruction, platform, exprParser) {
        const expr = ensureExpression(exprParser, instruction.from, 8);
        renderingCtrl.addBinding(new DelegateListenerBinding(renderingCtrl.container, expr, target, instruction.to, this._eventDelegator, new DelegateListenerOptions(instruction.preventDefault)));
    }
};
exports.ListenerBindingRenderer = __decorate([
    runtimeHtml.renderer(instructionType)
], exports.ListenerBindingRenderer);
class DelegateBindingInstruction {
    constructor(from, to, preventDefault) {
        this.from = from;
        this.to = to;
        this.preventDefault = preventDefault;
        this.type = "hb";
    }
}
class DelegateListenerOptions {
    constructor(prevent) {
        this.prevent = prevent;
    }
}
class DelegateListenerBinding {
    constructor(locator, ast, target, targetEvent, eventDelegator, options) {
        this.ast = ast;
        this.target = target;
        this.targetEvent = targetEvent;
        this.eventDelegator = eventDelegator;
        this.isBound = false;
        this.handler = null;
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
        this.callSource(event);
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
        this.handler = this.eventDelegator.addEventListener(this.l.get(runtimeHtml.IEventTarget), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}
runtimeHtml.mixinUseScope(DelegateListenerBinding);
runtimeHtml.mixingBindingLimited(DelegateListenerBinding, () => 'callSource');
runtimeHtml.mixinAstEvaluator(true, true)(DelegateListenerBinding);
const defaultOptions = {
    capture: false,
};
class ListenerTracker {
    constructor(_publisher, _eventName, _options = defaultOptions) {
        this._publisher = _publisher;
        this._eventName = _eventName;
        this._options = _options;
        this._count = 0;
        this._captureLookups = new Map();
        this._bubbleLookups = new Map();
    }
    _increment() {
        if (++this._count === 1) {
            this._publisher.addEventListener(this._eventName, this, this._options);
        }
    }
    _decrement() {
        if (--this._count === 0) {
            this._publisher.removeEventListener(this._eventName, this, this._options);
        }
    }
    dispose() {
        if (this._count > 0) {
            this._count = 0;
            this._publisher.removeEventListener(this._eventName, this, this._options);
        }
        this._captureLookups.clear();
        this._bubbleLookups.clear();
    }
    _getLookup(target) {
        const lookups = this._options.capture === true ? this._captureLookups : this._bubbleLookups;
        let lookup = lookups.get(target);
        if (lookup === void 0) {
            lookups.set(target, lookup = createLookup());
        }
        return lookup;
    }
    handleEvent(event) {
        const lookups = this._options.capture === true ? this._captureLookups : this._bubbleLookups;
        const path = event.composedPath();
        if (this._options.capture === true) {
            path.reverse();
        }
        for (const target of path) {
            const lookup = lookups.get(target);
            if (lookup === void 0) {
                continue;
            }
            const listener = lookup[this._eventName];
            if (listener === void 0) {
                continue;
            }
            if (isFunction(listener)) {
                listener(event);
            }
            else {
                listener.handleEvent(event);
            }
            if (event.cancelBubble === true) {
                return;
            }
        }
    }
}
class DelegateSubscription {
    constructor(_tracker, _lookup, _eventName, callback) {
        this._tracker = _tracker;
        this._lookup = _lookup;
        this._eventName = _eventName;
        _tracker._increment();
        _lookup[_eventName] = callback;
    }
    dispose() {
        this._tracker._decrement();
        this._lookup[this._eventName] = void 0;
    }
}
const IEventDelegator = kernel.DI.createInterface('IEventDelegator', x => x.cachedCallback((handler) => {
    const instance = handler.invoke(EventDelegator);
    handler.register(runtimeHtml.AppTask.deactivating(() => instance.dispose()));
    return instance;
}));
class EventDelegator {
    constructor() {
        this._trackerMaps = createLookup();
    }
    addEventListener(publisher, target, eventName, listener, options) {
        var _a;
        const trackerMap = (_a = this._trackerMaps)[eventName] ?? (_a[eventName] = new Map());
        let tracker = trackerMap.get(publisher);
        if (tracker === void 0) {
            trackerMap.set(publisher, tracker = new ListenerTracker(publisher, eventName, options));
        }
        return new DelegateSubscription(tracker, tracker._getLookup(target), eventName, listener);
    }
    dispose() {
        for (const eventName in this._trackerMaps) {
            const trackerMap = this._trackerMaps[eventName];
            for (const tracker of trackerMap.values()) {
                tracker.dispose();
            }
            trackerMap.clear();
        }
    }
}

let defined = false;
const defineBindingMethods = () => {
    if (defined)
        return;
    defined = true;
    [
        [runtimeHtml.PropertyBinding, 'Property binding'],
        [runtimeHtml.AttributeBinding, 'Attribute binding'],
        [runtimeHtml.ListenerBinding, 'Listener binding'],
        [CallBinding, 'Call binding'],
        [runtimeHtml.LetBinding, 'Let binding'],
        [runtimeHtml.InterpolationPartBinding, 'Interpolation binding'],
        [runtimeHtml.ContentBinding, 'Text binding'],
        [runtimeHtml.RefBinding, 'Ref binding'],
        [DelegateListenerBinding, 'Delegate Listener binding']
    ].forEach(([b, name]) => {
        Object.defineProperty(b.prototype, 'sourceExpression', {
            configurable: true, enumerable: false, writable: true, get() {
                console.warn(`@deprecated "sourceExpression" property for expression on ${name}. It has been renamed to "ast". expression: "${runtime.Unparser.unparse(this.ast)}"`);
                return this.ast;
            }
        });
    });
};

const PreventFormActionlessSubmit = runtimeHtml.AppTask.creating(runtimeHtml.IEventTarget, appRoot => {
    appRoot.addEventListener('submit', (e) => {
        const target = e.target;
        const action = target.action;
        if (target.tagName.toLowerCase() === 'form' && !action) {
            e.preventDefault();
        }
    }, false);
});

const compatRegistration = {
    register(container) {
        defineAstMethods();
        defineBindingMethods();
        container.register(PreventFormActionlessSubmit);
        delegateSyntax.register(container);
        callSyntax.register(container);
    }
};

exports.CallBinding = CallBinding;
exports.CallBindingInstruction = CallBindingInstruction;
exports.DelegateBindingInstruction = DelegateBindingInstruction;
exports.DelegateListenerBinding = DelegateListenerBinding;
exports.DelegateListenerOptions = DelegateListenerOptions;
exports.EventDelegator = EventDelegator;
exports.IEventDelegator = IEventDelegator;
exports.PreventFormActionlessSubmit = PreventFormActionlessSubmit;
exports.callSyntax = callSyntax;
exports.compatRegistration = compatRegistration;
exports.delegateSyntax = delegateSyntax;
//# sourceMappingURL=index.dev.cjs.map
