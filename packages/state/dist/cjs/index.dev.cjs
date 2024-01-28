'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var runtime = require('@aurelia/runtime');
var runtimeHtml = require('@aurelia/runtime-html');

/** @internal */
const createInterface = kernel.DI.createInterface;
/** @internal */
function createStateBindingScope(state, scope) {
    const overrideContext = { bindingContext: state };
    const stateScope = runtime.Scope.create(state, overrideContext, true);
    stateScope.parent = scope;
    return stateScope;
}
/** @internal */
function isSubscribable$1(v) {
    return v instanceof Object && 'subscribe' in v;
}

const IActionHandler = /*@__PURE__*/ createInterface('IActionHandler');
const IStore = /*@__PURE__*/ createInterface('IStore');
const IState = /*@__PURE__*/ createInterface('IState');

const actionHandlerSymbol = '__au_ah__';
const ActionHandler = Object.freeze({
    define(actionHandler) {
        function registry(state, action) {
            return actionHandler(state, action);
        }
        registry[actionHandlerSymbol] = true;
        registry.register = function (c) {
            kernel.Registration.instance(IActionHandler, actionHandler).register(c);
        };
        return registry;
    },
    isType: (r) => typeof r === 'function' && actionHandlerSymbol in r,
});

const IDevToolsExtension = /*@__PURE__*/ createInterface("IDevToolsExtension", x => x.cachedCallback((container) => {
    const win = container.get(runtimeHtml.IWindow);
    const devToolsExtension = win.__REDUX_DEVTOOLS_EXTENSION__;
    return devToolsExtension ?? null;
}));

class Store {
    static register(c) {
        kernel.Registration.singleton(IStore, this).register(c);
    }
    constructor(initialState, actionHandlers, logger, getDevTools) {
        /** @internal */ this._subs = new Set();
        /** @internal */ this._dispatching = 0;
        /** @internal */ this._dispatchQueues = [];
        this._initialState = this._state = initialState ?? new State();
        this._handlers = actionHandlers;
        this._logger = logger;
        this._getDevTools = getDevTools;
    }
    subscribe(subscriber) {
        {
            if (this._subs.has(subscriber)) {
                this._logger.warn('A subscriber is trying to subscribe to state change again.');
                return;
            }
        }
        this._subs.add(subscriber);
    }
    unsubscribe(subscriber) {
        {
            if (!this._subs.has(subscriber)) {
                this._logger.warn('Unsubscribing a non-listening subscriber');
                return;
            }
        }
        this._subs.delete(subscriber);
    }
    /** @internal */
    _setState(state) {
        const prevState = this._state;
        this._state = state;
        this._subs.forEach(sub => sub.handleStateChange(state, prevState));
    }
    getState() {
        {
            return new Proxy(this._state, new StateProxyHandler(this, this._logger));
        }
    }
    dispatch(action) {
        if (this._dispatching > 0) {
            this._dispatchQueues.push(action);
            return;
        }
        this._dispatching++;
        let $$action;
        const reduce = ($state, $action) => this._handlers.reduce(($state, handler) => {
            if ($state instanceof Promise) {
                return $state.then($ => handler($, $action));
            }
            return handler($state, $action);
        }, $state);
        const afterDispatch = ($state) => {
            if (this._dispatchQueues.length > 0) {
                $$action = this._dispatchQueues.shift();
                const newState = reduce($state, $$action);
                if (newState instanceof Promise) {
                    return newState.then($ => afterDispatch($));
                }
                else {
                    return afterDispatch(newState);
                }
            }
        };
        const newState = reduce(this._state, action);
        if (newState instanceof Promise) {
            return newState.then($state => {
                this._setState($state);
                this._dispatching--;
                return afterDispatch(this._state);
            }, ex => {
                this._dispatching--;
                throw ex;
            });
        }
        else {
            this._setState(newState);
            this._dispatching--;
            return afterDispatch(this._state);
        }
    }
    /* istanbul ignore next */
    connectDevTools(options) {
        const extension = this._getDevTools();
        const hasDevTools = extension != null;
        if (!hasDevTools) {
            throw new Error('Devtools extension is not available');
        }
        options.name ?? (options.name = 'Aurelia State plugin');
        const devTools = extension.connect(options);
        devTools.init(this._initialState);
        devTools.subscribe((message) => {
            this._logger.info('DevTools sent a message:', message);
            const payload = typeof message.payload === 'string'
                ? tryParseJson(message.payload)
                : message.payload;
            if (payload === void 0) {
                return;
            }
            if (message.type === "ACTION") {
                if (payload == null) {
                    throw new Error('DevTools sent an action with no payload');
                }
                void new Promise(r => {
                    r(this.dispatch(payload));
                }).catch((ex) => {
                    throw new Error(`Issue when trying to dispatch an action through devtools:\n${ex}`);
                }).then(() => {
                    devTools.send('ACTION', this._state);
                });
                return;
            }
            if (message.type === "DISPATCH" && payload != null) {
                switch (payload.type) {
                    case "JUMP_TO_STATE":
                    case "JUMP_TO_ACTION":
                        this._setState(JSON.parse(message.state));
                        return;
                    case "COMMIT":
                        devTools.init(this._state);
                        return;
                    case "RESET":
                        devTools.init(this._initialState);
                        this._setState(this._initialState);
                        return;
                    case "ROLLBACK": {
                        const parsedState = JSON.parse(message.state);
                        this._setState(parsedState);
                        devTools.send('ROLLBACK', parsedState);
                        return;
                    }
                }
            }
        });
    }
}
/** @internal */ Store.inject = [
    kernel.optional(IState),
    kernel.all(IActionHandler),
    kernel.ILogger,
    kernel.lazy(IDevToolsExtension)
];
class State {
}
class StateProxyHandler {
    constructor(
    /** @internal */ _owner, 
    /** @internal */ _logger) {
        this._owner = _owner;
        this._logger = _logger;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(target, prop, value, receiver) {
        this._logger.warn(`Setting State is immutable. Dispatch an action to create a new state`);
        return true;
    }
}
/* eslint-enable */
function tryParseJson(str) {
    try {
        return JSON.parse(str);
    }
    catch (ex) {
        // eslint-disable-next-line no-console
        console.log(`Error parsing JSON:\n${(str ?? '').slice(0, 200)}\n${ex}`);
        return undefined;
    }
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
/* global Reflect, Promise */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

const atLayout = runtime.AccessorType.Layout;
const stateActivating = runtimeHtml.State.activating;
class StateBinding {
    constructor(controller, locator, observerLocator, taskQueue, ast, target, prop, store) {
        this.isBound = false;
        /** @internal */ this._task = null;
        /** @internal */ this._value = void 0;
        /** @internal */ this._sub = void 0;
        /** @internal */ this._updateCount = 0;
        // see Listener binding for explanation
        /** @internal */
        this.boundFn = false;
        this.mode = runtimeHtml.BindingMode.toView;
        this._controller = controller;
        this.l = locator;
        this._taskQueue = taskQueue;
        this._store = store;
        this.oL = observerLocator;
        this.ast = ast;
        this.target = target;
        this.targetProperty = prop;
    }
    updateTarget(value) {
        const targetAccessor = this._targetObserver;
        const target = this.target;
        const prop = this.targetProperty;
        const updateCount = this._updateCount++;
        const isCurrentValue = () => updateCount === this._updateCount - 1;
        this._unsub();
        if (isSubscribable(value)) {
            this._sub = value.subscribe($value => {
                if (isCurrentValue()) {
                    targetAccessor.setValue($value, target, prop);
                }
            });
            return;
        }
        if (value instanceof Promise) {
            void value.then($value => {
                if (isCurrentValue()) {
                    targetAccessor.setValue($value, target, prop);
                }
            }, () => { });
            return;
        }
        targetAccessor.setValue(value, target, prop);
    }
    bind(_scope) {
        if (this.isBound) {
            return;
        }
        this._targetObserver = this.oL.getAccessor(this.target, this.targetProperty);
        this._store.subscribe(this);
        this.updateTarget(this._value = runtime.astEvaluate(this.ast, this._scope = createStateBindingScope(this._store.getState(), _scope), this, this.mode > runtimeHtml.BindingMode.oneTime ? this : null));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this._unsub();
        // also disregard incoming future value of promise resolution if any
        this._updateCount++;
        this._scope = void 0;
        this._task?.cancel();
        this._task = null;
        this._store.unsubscribe(this);
    }
    handleChange(newValue) {
        if (!this.isBound) {
            return;
        }
        // Alpha: during bind a simple strategy for bind is always flush immediately
        // todo:
        //  (1). determine whether this should be the behavior
        //  (2). if not, then fix tests to reflect the changes/platform to properly yield all with aurelia.start()
        const shouldQueueFlush = this._controller.state !== stateActivating && (this._targetObserver.type & atLayout) > 0;
        const obsRecord = this.obs;
        obsRecord.version++;
        newValue = runtime.astEvaluate(this.ast, this._scope, this, this);
        obsRecord.clear();
        let task;
        if (shouldQueueFlush) {
            // Queue the new one before canceling the old one, to prevent early yield
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
    handleStateChange() {
        if (!this.isBound) {
            return;
        }
        const state = this._store.getState();
        const _scope = this._scope;
        const overrideContext = _scope.overrideContext;
        _scope.bindingContext = overrideContext.bindingContext = overrideContext.$state = state;
        const value = runtime.astEvaluate(this.ast, _scope, this, this.mode > runtimeHtml.BindingMode.oneTime ? this : null);
        const shouldQueueFlush = this._controller.state !== stateActivating && (this._targetObserver.type & atLayout) > 0;
        if (value === this._value) {
            return;
        }
        this._value = value;
        let task = null;
        if (shouldQueueFlush) {
            // Queue the new one before canceling the old one, to prevent early yield
            task = this._task;
            this._task = this._taskQueue.queueTask(() => {
                this.updateTarget(value);
                this._task = null;
            }, updateTaskOpts);
            task?.cancel();
        }
        else {
            this.updateTarget(this._value);
        }
    }
    /** @internal */
    _unsub() {
        if (typeof this._sub === 'function') {
            this._sub();
        }
        else if (this._sub !== void 0) {
            this._sub.dispose?.();
            this._sub.unsubscribe?.();
        }
        this._sub = void 0;
    }
}
function isSubscribable(v) {
    return v instanceof Object && 'subscribe' in v;
}
const updateTaskOpts = {
    reusable: false,
    preempt: true,
};
runtime.connectable(StateBinding);
runtimeHtml.mixinAstEvaluator(true)(StateBinding);
runtimeHtml.mixingBindingLimited(StateBinding, () => 'updateTarget');

const bindingStateSubscriberMap = new WeakMap();
exports.StateBindingBehavior = class StateBindingBehavior {
    constructor(store) {
        this._store = store;
    }
    bind(scope, binding) {
        const isStateBinding = binding instanceof StateBinding;
        scope = isStateBinding ? scope : createStateBindingScope(this._store.getState(), scope);
        let subscriber;
        if (!isStateBinding) {
            subscriber = bindingStateSubscriberMap.get(binding);
            if (subscriber == null) {
                bindingStateSubscriberMap.set(binding, subscriber = new StateSubscriber(binding, scope));
            }
            else {
                subscriber._wrappedScope = scope;
            }
            this._store.subscribe(subscriber);
            if (!binding.useScope) {
                // eslint-disable-next-line no-console
                console.warn(`Binding ${binding.constructor.name} does not support "state" binding behavior`);
            }
            binding.useScope?.(scope);
        }
    }
    unbind(scope, binding) {
        const isStateBinding = binding instanceof StateBinding;
        if (!isStateBinding) {
            this._store.unsubscribe(bindingStateSubscriberMap.get(binding));
            bindingStateSubscriberMap.delete(binding);
        }
    }
};
/** @internal */ exports.StateBindingBehavior.inject = [IStore];
exports.StateBindingBehavior = __decorate([
    runtimeHtml.bindingBehavior('state')
], exports.StateBindingBehavior);
class StateSubscriber {
    constructor(_binding, _wrappedScope) {
        this._binding = _binding;
        this._wrappedScope = _wrappedScope;
    }
    handleStateChange(state) {
        const scope = this._wrappedScope;
        const overrideContext = scope.overrideContext;
        scope.bindingContext = overrideContext.bindingContext = overrideContext.$state = state;
        this._binding.handleChange?.(undefined, undefined);
    }
}

class StateDispatchBinding {
    constructor(locator, expr, target, prop, store) {
        this.isBound = false;
        // see Listener binding for explanation
        /** @internal */
        this.boundFn = false;
        this.l = locator;
        this._store = store;
        this.ast = expr;
        this._target = target;
        this._targetProperty = prop;
    }
    callSource(e) {
        const scope = this._scope;
        scope.overrideContext.$event = e;
        const value = runtime.astEvaluate(this.ast, scope, this, null);
        delete scope.overrideContext.$event;
        void this._store.dispatch(value);
    }
    handleEvent(e) {
        this.callSource(e);
    }
    bind(_scope) {
        if (this.isBound) {
            return;
        }
        runtime.astBind(this.ast, _scope, this);
        this._scope = createStateBindingScope(this._store.getState(), _scope);
        this._target.addEventListener(this._targetProperty, this);
        this._store.subscribe(this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this._target.removeEventListener(this._targetProperty, this);
        this._store.unsubscribe(this);
    }
    handleStateChange(state) {
        const scope = this._scope;
        const overrideContext = scope.overrideContext;
        scope.bindingContext = overrideContext.bindingContext = state;
    }
}
runtime.connectable(StateDispatchBinding);
runtimeHtml.mixinAstEvaluator(true)(StateDispatchBinding);
runtimeHtml.mixingBindingLimited(StateDispatchBinding, () => 'callSource');

exports.StateAttributePattern = class StateAttributePattern {
    'PART.state'(rawName, rawValue, parts) {
        return new runtimeHtml.AttrSyntax(rawName, rawValue, parts[0], 'state');
    }
};
exports.StateAttributePattern = __decorate([
    runtimeHtml.attributePattern({ pattern: 'PART.state', symbols: '.' })
], exports.StateAttributePattern);
exports.DispatchAttributePattern = class DispatchAttributePattern {
    'PART.dispatch'(rawName, rawValue, parts) {
        return new runtimeHtml.AttrSyntax(rawName, rawValue, parts[0], 'dispatch');
    }
};
exports.DispatchAttributePattern = __decorate([
    runtimeHtml.attributePattern({ pattern: 'PART.dispatch', symbols: '.' })
], exports.DispatchAttributePattern);
exports.StateBindingCommand = class StateBindingCommand {
    get type() { return 'None'; }
    get name() { return 'state'; }
    build(info, parser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        let value = attr.rawValue;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                // if the mapper doesn't know how to map it
                // use the default behavior, which is camel-casing
                ?? kernel.camelCase(target);
        }
        else {
            // if it looks like: <my-el value.bind>
            // it means        : <my-el value.bind="value">
            if (value === '' && info.def.type === 'Element') {
                value = kernel.camelCase(target);
            }
            target = info.bindable.name;
        }
        return new StateBindingInstruction(value, target);
    }
};
exports.StateBindingCommand = __decorate([
    runtimeHtml.bindingCommand('state')
], exports.StateBindingCommand);
exports.DispatchBindingCommand = class DispatchBindingCommand {
    get type() { return 'IgnoreAttr'; }
    get name() { return 'dispatch'; }
    build(info) {
        const attr = info.attr;
        return new DispatchBindingInstruction(attr.target, attr.rawValue);
    }
};
exports.DispatchBindingCommand = __decorate([
    runtimeHtml.bindingCommand('dispatch')
], exports.DispatchBindingCommand);
class StateBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = 'sb';
    }
}
class DispatchBindingInstruction {
    constructor(from, ast) {
        this.from = from;
        this.ast = ast;
        this.type = 'sd';
    }
}
exports.StateBindingInstructionRenderer = class StateBindingInstructionRenderer {
    constructor(
    /** @internal */ _stateContainer) {
        this._stateContainer = _stateContainer;
    }
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new StateBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, 'IsFunction'), target, instruction.to, this._stateContainer));
    }
};
/** @internal */ exports.StateBindingInstructionRenderer.inject = [IStore];
exports.StateBindingInstructionRenderer = __decorate([
    runtimeHtml.renderer('sb')
], exports.StateBindingInstructionRenderer);
exports.DispatchBindingInstructionRenderer = class DispatchBindingInstructionRenderer {
    constructor(
    /** @internal */ _stateContainer) {
        this._stateContainer = _stateContainer;
    }
    render(renderingCtrl, target, instruction, platform, exprParser) {
        const expr = ensureExpression(exprParser, instruction.ast, 'IsProperty');
        renderingCtrl.addBinding(new StateDispatchBinding(renderingCtrl.container, expr, target, instruction.from, this._stateContainer));
    }
};
/** @internal */ exports.DispatchBindingInstructionRenderer.inject = [IStore];
exports.DispatchBindingInstructionRenderer = __decorate([
    runtimeHtml.renderer('sd')
], exports.DispatchBindingInstructionRenderer);
function ensureExpression(parser, srcOrExpr, expressionType) {
    if (typeof srcOrExpr === 'string') {
        return parser.parse(srcOrExpr, expressionType);
    }
    return srcOrExpr;
}

const standardRegistrations = [
    exports.StateAttributePattern,
    exports.StateBindingCommand,
    exports.StateBindingInstructionRenderer,
    exports.DispatchAttributePattern,
    exports.DispatchBindingCommand,
    exports.DispatchBindingInstructionRenderer,
    exports.StateBindingBehavior,
    Store,
];
const createConfiguration = (initialState, actionHandlers, options = {}) => {
    return {
        register: (c) => {
            c.register(kernel.Registration.instance(IState, initialState), ...standardRegistrations, ...actionHandlers.map(ActionHandler.define), 
            /* istanbul ignore next */
            runtimeHtml.AppTask.creating(kernel.IContainer, container => {
                const store = container.get(IStore);
                const devTools = container.get(IDevToolsExtension);
                if (options.devToolsOptions?.disable !== true && devTools != null) {
                    store.connectDevTools(options.devToolsOptions ?? {});
                }
            }));
        },
        init: (state, optionsOrHandler, ...actionHandlers) => {
            const isHandler = typeof optionsOrHandler === 'function';
            const options = isHandler ? {} : optionsOrHandler;
            actionHandlers = isHandler ? [optionsOrHandler, ...actionHandlers] : actionHandlers;
            return createConfiguration(state, actionHandlers, options);
        }
    };
};
const StateDefaultConfiguration = /*@__PURE__*/ createConfiguration({}, []);

let StateGetterBinding = class StateGetterBinding {
    constructor(target, prop, store, getValue) {
        this.isBound = false;
        /** @internal */ this._value = void 0;
        /** @internal */ this._sub = void 0;
        /** @internal */ this._updateCount = 0;
        this._store = store;
        this.$get = getValue;
        this.target = target;
        this.key = prop;
    }
    updateTarget(value) {
        const target = this.target;
        const prop = this.key;
        const updateCount = this._updateCount++;
        const isCurrentValue = () => updateCount === this._updateCount - 1;
        this._unsub();
        if (isSubscribable$1(value)) {
            this._sub = value.subscribe($value => {
                if (isCurrentValue()) {
                    target[prop] = $value;
                }
            });
            return;
        }
        if (value instanceof Promise) {
            void value.then($value => {
                if (isCurrentValue()) {
                    target[prop] = $value;
                }
            }, () => { });
            return;
        }
        target[prop] = value;
    }
    bind(_scope) {
        if (this.isBound) {
            return;
        }
        const state = this._store.getState();
        this._scope = createStateBindingScope(state, _scope);
        this._store.subscribe(this);
        this.updateTarget(this._value = this.$get(state));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this._unsub();
        // also disregard incoming future value of promise resolution if any
        this._updateCount++;
        this._scope = void 0;
        this._store.unsubscribe(this);
    }
    handleStateChange(state) {
        const _scope = this._scope;
        const overrideContext = _scope.overrideContext;
        _scope.bindingContext = overrideContext.bindingContext = overrideContext.$state = state;
        const value = this.$get(this._store.getState());
        if (value === this._value) {
            return;
        }
        this._value = value;
        this.updateTarget(value);
    }
    /** @internal */
    _unsub() {
        if (typeof this._sub === 'function') {
            this._sub();
        }
        else if (this._sub !== void 0) {
            this._sub.dispose?.();
            this._sub.unsubscribe?.();
        }
        this._sub = void 0;
    }
};
StateGetterBinding = __decorate([
    runtime.connectable()
], StateGetterBinding);

/**
 * A decorator for component properties whose values derived from global state
 * Usage example:
 *
 * ```ts
 * class MyComponent {
 *  \@fromState(s => s.items)
 *   data: Item[]
 * }
 * ```
 */
function fromState(getValue) {
    return function (target, key, desc) {
        if (typeof target === 'function') {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        if (typeof desc?.value !== 'undefined') {
            throw new Error(`Invalid usage. @state can only be used on a field`);
        }
        target = target.constructor;
        let dependencies = runtimeHtml.CustomElement.getAnnotation(target, dependenciesKey);
        if (dependencies == null) {
            runtimeHtml.CustomElement.annotate(target, dependenciesKey, dependencies = []);
        }
        dependencies.push(new HydratingLifecycleHooks(getValue, key));
        dependencies = runtimeHtml.CustomAttribute.getAnnotation(target, dependenciesKey);
        if (dependencies == null) {
            runtimeHtml.CustomElement.annotate(target, dependenciesKey, dependencies = []);
        }
        dependencies.push(new CreatedLifecycleHooks(getValue, key));
    };
}
const dependenciesKey = 'dependencies';
let HydratingLifecycleHooks = class HydratingLifecycleHooks {
    constructor($get, key) {
        this.$get = $get;
        this.key = key;
    }
    register(c) {
        kernel.Registration.instance(runtimeHtml.ILifecycleHooks, this).register(c);
    }
    hydrating(vm, controller) {
        const container = controller.container;
        controller.addBinding(new StateGetterBinding(vm, this.key, container.get(IStore), this.$get));
    }
};
HydratingLifecycleHooks = __decorate([
    runtimeHtml.lifecycleHooks()
], HydratingLifecycleHooks);
let CreatedLifecycleHooks = class CreatedLifecycleHooks {
    constructor($get, key) {
        this.$get = $get;
        this.key = key;
    }
    register(c) {
        kernel.Registration.instance(runtimeHtml.ILifecycleHooks, this).register(c);
    }
    created(vm, controller) {
        const container = controller.container;
        controller.addBinding(new StateGetterBinding(vm, this.key, container.get(IStore), this.$get));
    }
};
CreatedLifecycleHooks = __decorate([
    runtimeHtml.lifecycleHooks()
], CreatedLifecycleHooks);

exports.ActionHandler = ActionHandler;
exports.DispatchBindingInstruction = DispatchBindingInstruction;
exports.IActionHandler = IActionHandler;
exports.IState = IState;
exports.IStore = IStore;
exports.StateBinding = StateBinding;
exports.StateBindingInstruction = StateBindingInstruction;
exports.StateDefaultConfiguration = StateDefaultConfiguration;
exports.StateDispatchBinding = StateDispatchBinding;
exports.fromState = fromState;
//# sourceMappingURL=index.dev.cjs.map
