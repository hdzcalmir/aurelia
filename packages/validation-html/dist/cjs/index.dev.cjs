'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var validation = require('@aurelia/validation');
var runtimeHtml = require('@aurelia/runtime-html');
var runtime = require('@aurelia/runtime');

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

exports.ValidateEventKind = void 0;
(function (ValidateEventKind) {
    ValidateEventKind["validate"] = "validate";
    ValidateEventKind["reset"] = "reset";
})(exports.ValidateEventKind || (exports.ValidateEventKind = {}));
class ControllerValidateResult {
    constructor(valid, results, instruction) {
        this.valid = valid;
        this.results = results;
        this.instruction = instruction;
    }
}
class ValidationResultTarget {
    constructor(result, targets) {
        this.result = result;
        this.targets = targets;
    }
}
class ValidationEvent {
    constructor(kind, addedResults, removedResults) {
        this.kind = kind;
        this.addedResults = addedResults;
        this.removedResults = removedResults;
    }
}
class BindingInfo {
    constructor(target, scope, rules, propertyInfo = void 0) {
        this.target = target;
        this.scope = scope;
        this.rules = rules;
        this.propertyInfo = propertyInfo;
    }
}
class PropertyInfo {
    constructor(object, propertyName) {
        this.object = object;
        this.propertyName = propertyName;
    }
}
function getPropertyInfo(binding, info, _flags = 0) {
    let propertyInfo = info.propertyInfo;
    if (propertyInfo !== void 0) {
        return propertyInfo;
    }
    const scope = info.scope;
    let expression = binding.ast.expression;
    let toCachePropertyName = true;
    let propertyName = '';
    while (expression !== void 0 && expression?.$kind !== 1) {
        let memberName;
        switch (expression.$kind) {
            case 18:
            case 17:
                expression = expression.expression;
                continue;
            case 10:
                memberName = expression.name;
                break;
            case 11: {
                const keyExpr = expression.key;
                if (toCachePropertyName) {
                    toCachePropertyName = keyExpr.$kind === 4;
                }
                memberName = `[${runtime.astEvaluate(keyExpr, scope, binding, null).toString()}]`;
                break;
            }
            default:
                throw new Error(`Unknown expression of type ${expression.constructor.name}`);
        }
        const separator = propertyName.startsWith('[') ? '' : '.';
        propertyName = propertyName.length === 0 ? memberName : `${memberName}${separator}${propertyName}`;
        expression = expression.object;
    }
    if (expression === void 0) {
        throw new Error(`Unable to parse binding expression: ${binding.ast.expression}`);
    }
    let object;
    if (propertyName.length === 0) {
        propertyName = expression.name;
        object = scope.bindingContext;
    }
    else {
        object = runtime.astEvaluate(expression, scope, binding, null);
    }
    if (object === null || object === void 0) {
        return (void 0);
    }
    propertyInfo = new PropertyInfo(object, propertyName);
    if (toCachePropertyName) {
        info.propertyInfo = propertyInfo;
    }
    return propertyInfo;
}
const IValidationController = kernel.DI.createInterface('IValidationController');
exports.ValidationController = class ValidationController {
    constructor(validator, parser, platform, locator) {
        this.validator = validator;
        this.parser = parser;
        this.platform = platform;
        this.locator = locator;
        this.bindings = new Map();
        this.subscribers = new Set();
        this.results = [];
        this.validating = false;
        this.elements = new WeakMap();
        this.objects = new Map();
    }
    addObject(object, rules) {
        this.objects.set(object, rules);
    }
    removeObject(object) {
        this.objects.delete(object);
        this.processResultDelta("reset", this.results.filter(result => result.object === object), []);
    }
    addError(message, object, propertyName) {
        let resolvedPropertyName;
        if (propertyName !== void 0) {
            [resolvedPropertyName] = validation.parsePropertyName(propertyName, this.parser);
        }
        const result = new validation.ValidationResult(false, message, resolvedPropertyName, object, undefined, undefined, true);
        this.processResultDelta("validate", [], [result]);
        return result;
    }
    removeError(result) {
        if (this.results.includes(result)) {
            this.processResultDelta("reset", [result], []);
        }
    }
    addSubscriber(subscriber) {
        this.subscribers.add(subscriber);
    }
    removeSubscriber(subscriber) {
        this.subscribers.delete(subscriber);
    }
    registerBinding(binding, info) {
        this.bindings.set(binding, info);
    }
    unregisterBinding(binding) {
        this.resetBinding(binding);
        this.bindings.delete(binding);
    }
    async validate(instruction) {
        const { object: obj, objectTag, flags } = instruction ?? {};
        let instructions;
        if (obj !== void 0) {
            instructions = [new validation.ValidateInstruction(obj, instruction.propertyName, instruction.rules ?? this.objects.get(obj), objectTag, instruction.propertyTag)];
        }
        else {
            instructions = [
                ...Array.from(this.objects.entries())
                    .map(([object, rules]) => new validation.ValidateInstruction(object, void 0, rules, objectTag)),
                ...(!objectTag ? Array.from(this.bindings.entries()) : [])
                    .reduce((acc, [binding, info]) => {
                    const propertyInfo = getPropertyInfo(binding, info, flags);
                    if (propertyInfo !== void 0 && !this.objects.has(propertyInfo.object)) {
                        acc.push(new validation.ValidateInstruction(propertyInfo.object, propertyInfo.propertyName, info.rules));
                    }
                    return acc;
                }, [])
            ];
        }
        this.validating = true;
        const task = this.platform.domReadQueue.queueTask(async () => {
            try {
                const results = await Promise.all(instructions.map(async (x) => this.validator.validate(x)));
                const newResults = results.reduce((acc, resultSet) => {
                    acc.push(...resultSet);
                    return acc;
                }, []);
                const predicate = this.getInstructionPredicate(instruction);
                const oldResults = this.results.filter(predicate);
                this.processResultDelta("validate", oldResults, newResults);
                return new ControllerValidateResult(newResults.find(r => !r.valid) === void 0, newResults, instruction);
            }
            finally {
                this.validating = false;
            }
        });
        return task.result;
    }
    reset(instruction) {
        const predicate = this.getInstructionPredicate(instruction);
        const oldResults = this.results.filter(predicate);
        this.processResultDelta("reset", oldResults, []);
    }
    async validateBinding(binding) {
        if (!binding.isBound) {
            return;
        }
        const bindingInfo = this.bindings.get(binding);
        if (bindingInfo === void 0) {
            return;
        }
        const propertyInfo = getPropertyInfo(binding, bindingInfo);
        const rules = bindingInfo.rules;
        if (propertyInfo === void 0) {
            return;
        }
        const { object, propertyName } = propertyInfo;
        await this.validate(new validation.ValidateInstruction(object, propertyName, rules));
    }
    resetBinding(binding) {
        const bindingInfo = this.bindings.get(binding);
        if (bindingInfo === void 0) {
            return;
        }
        const propertyInfo = getPropertyInfo(binding, bindingInfo);
        if (propertyInfo === void 0) {
            return;
        }
        bindingInfo.propertyInfo = void 0;
        const { object, propertyName } = propertyInfo;
        this.reset(new validation.ValidateInstruction(object, propertyName));
    }
    async revalidateErrors() {
        const map = this.results
            .reduce((acc, { isManual, object, propertyRule, rule, valid }) => {
            if (!valid && !isManual && propertyRule !== void 0 && object !== void 0 && rule !== void 0) {
                let value = acc.get(object);
                if (value === void 0) {
                    acc.set(object, value = new Map());
                }
                let rules = value.get(propertyRule);
                if (rules === void 0) {
                    value.set(propertyRule, rules = []);
                }
                rules.push(rule);
            }
            return acc;
        }, new Map());
        const promises = [];
        for (const [object, innerMap] of map) {
            promises.push(this.validate(new validation.ValidateInstruction(object, undefined, Array.from(innerMap)
                .map(([{ validationRules, messageProvider, property }, rules]) => new validation.PropertyRule(this.locator, validationRules, messageProvider, property, [rules])))));
        }
        await Promise.all(promises);
    }
    getInstructionPredicate(instruction) {
        if (instruction === void 0) {
            return () => true;
        }
        const propertyName = instruction.propertyName;
        const rules = instruction.rules;
        return x => !x.isManual
            && x.object === instruction.object
            && (propertyName === void 0 || x.propertyName === propertyName)
            && (rules === void 0
                || rules.includes(x.propertyRule)
                || rules.some((r) => x.propertyRule === void 0 || r.$rules.flat().every(($r) => x.propertyRule.$rules.flat().includes($r))));
    }
    getAssociatedElements({ object, propertyName }) {
        const elements = [];
        for (const [binding, info] of this.bindings.entries()) {
            const propertyInfo = getPropertyInfo(binding, info);
            if (propertyInfo !== void 0 && propertyInfo.object === object && propertyInfo.propertyName === propertyName) {
                elements.push(info.target);
            }
        }
        return elements;
    }
    processResultDelta(kind, oldResults, newResults) {
        const eventData = new ValidationEvent(kind, [], []);
        newResults = newResults.slice(0);
        const elements = this.elements;
        for (const oldResult of oldResults) {
            const removalTargets = elements.get(oldResult);
            elements.delete(oldResult);
            eventData.removedResults.push(new ValidationResultTarget(oldResult, removalTargets));
            const newResultIndex = newResults.findIndex(x => x.rule === oldResult.rule && x.object === oldResult.object && x.propertyName === oldResult.propertyName);
            if (newResultIndex === -1) {
                this.results.splice(this.results.indexOf(oldResult), 1);
            }
            else {
                const newResult = newResults.splice(newResultIndex, 1)[0];
                const newTargets = this.getAssociatedElements(newResult);
                elements.set(newResult, newTargets);
                eventData.addedResults.push(new ValidationResultTarget(newResult, newTargets));
                this.results.splice(this.results.indexOf(oldResult), 1, newResult);
            }
        }
        for (const result of newResults) {
            const newTargets = this.getAssociatedElements(result);
            eventData.addedResults.push(new ValidationResultTarget(result, newTargets));
            elements.set(result, newTargets);
            this.results.push(result);
        }
        for (const subscriber of this.subscribers) {
            subscriber.handleValidationEvent(eventData);
        }
    }
};
exports.ValidationController = __decorate([
    __param(0, validation.IValidator),
    __param(1, runtime.IExpressionParser),
    __param(2, runtimeHtml.IPlatform),
    __param(3, kernel.IServiceLocator)
], exports.ValidationController);
class ValidationControllerFactory {
    constructor() {
        this.Type = (void 0);
    }
    registerTransformer(_transformer) {
        return false;
    }
    construct(container, _dynamicDependencies) {
        return container.invoke(exports.ValidationController, _dynamicDependencies);
    }
}

function compareDocumentPositionFlat(a, b) {
    switch (a.compareDocumentPosition(b) & 2) {
        case 0: return 0;
        case 2: return 1;
        default: return -1;
    }
}

const defaultContainerTemplate = `
<slot></slot>
<slot name='secondary'>
  <span repeat.for="error of errors">
    \${error.result.message}
  </span>
</slot>
`;
const defaultContainerDefinition = {
    name: 'validation-container',
    shadowOptions: { mode: 'open' },
    hasSlots: true,
};
exports.ValidationContainerCustomElement = class ValidationContainerCustomElement {
    constructor(host, scopedController) {
        this.host = host;
        this.scopedController = scopedController;
        this.errors = [];
    }
    handleValidationEvent(event) {
        for (const { result } of event.removedResults) {
            const index = this.errors.findIndex(x => x.result === result);
            if (index !== -1) {
                this.errors.splice(index, 1);
            }
        }
        for (const { result, targets: elements } of event.addedResults) {
            if (result.valid) {
                continue;
            }
            const targets = elements.filter(e => this.host.contains(e));
            if (targets.length > 0) {
                this.errors.push(new ValidationResultTarget(result, targets));
            }
        }
        this.errors.sort((a, b) => {
            if (a.targets[0] === b.targets[0]) {
                return 0;
            }
            return compareDocumentPositionFlat(a.targets[0], b.targets[0]);
        });
    }
    binding() {
        this.controller = this.controller ?? this.scopedController;
        this.controller.addSubscriber(this);
    }
    unbinding() {
        this.controller.removeSubscriber(this);
    }
};
__decorate([
    runtimeHtml.bindable
], exports.ValidationContainerCustomElement.prototype, "controller", void 0);
__decorate([
    runtimeHtml.bindable
], exports.ValidationContainerCustomElement.prototype, "errors", void 0);
exports.ValidationContainerCustomElement = __decorate([
    __param(0, runtimeHtml.INode),
    __param(1, kernel.optional(IValidationController))
], exports.ValidationContainerCustomElement);

exports.ValidationErrorsCustomAttribute = class ValidationErrorsCustomAttribute {
    constructor(host, scopedController) {
        this.host = host;
        this.scopedController = scopedController;
        this.errors = [];
        this.errorsInternal = [];
    }
    handleValidationEvent(event) {
        for (const { result } of event.removedResults) {
            const index = this.errorsInternal.findIndex((x) => x.result === result);
            if (index !== -1) {
                this.errorsInternal.splice(index, 1);
            }
        }
        for (const { result, targets: elements } of event.addedResults) {
            if (result.valid) {
                continue;
            }
            const targets = elements.filter((e) => this.host.contains(e));
            if (targets.length > 0) {
                this.errorsInternal.push(new ValidationResultTarget(result, targets));
            }
        }
        this.errorsInternal.sort((a, b) => {
            if (a.targets[0] === b.targets[0]) {
                return 0;
            }
            return compareDocumentPositionFlat(a.targets[0], b.targets[0]);
        });
        this.errors = this.errorsInternal;
    }
    binding() {
        this.controller = this.controller ?? this.scopedController;
        this.controller.addSubscriber(this);
    }
    unbinding() {
        this.controller.removeSubscriber(this);
    }
};
__decorate([
    runtimeHtml.bindable
], exports.ValidationErrorsCustomAttribute.prototype, "controller", void 0);
__decorate([
    runtimeHtml.bindable({ primary: true, mode: 6 })
], exports.ValidationErrorsCustomAttribute.prototype, "errors", void 0);
exports.ValidationErrorsCustomAttribute = __decorate([
    runtimeHtml.customAttribute('validation-errors'),
    __param(0, runtimeHtml.INode),
    __param(1, kernel.optional(IValidationController))
], exports.ValidationErrorsCustomAttribute);

exports.ValidationTrigger = void 0;
(function (ValidationTrigger) {
    ValidationTrigger["manual"] = "manual";
    ValidationTrigger["blur"] = "blur";
    ValidationTrigger["focusout"] = "focusout";
    ValidationTrigger["change"] = "change";
    ValidationTrigger["changeOrBlur"] = "changeOrBlur";
    ValidationTrigger["changeOrFocusout"] = "changeOrFocusout";
})(exports.ValidationTrigger || (exports.ValidationTrigger = {}));
const IDefaultTrigger = kernel.DI.createInterface('IDefaultTrigger');
const validationConnectorMap = new WeakMap();
const validationTargetSubscriberMap = new WeakMap();
exports.ValidateBindingBehavior = class ValidateBindingBehavior {
    constructor(platform, observerLocator) {
        this._platform = platform;
        this._observerLocator = observerLocator;
    }
    bind(scope, binding) {
        if (!(binding instanceof runtimeHtml.PropertyBinding)) {
            throw new Error('Validate behavior used on non property binding');
        }
        let connector = validationConnectorMap.get(binding);
        if (connector == null) {
            validationConnectorMap.set(binding, connector = new ValidatitionConnector(this._platform, this._observerLocator, binding.get(IDefaultTrigger), binding, binding.get(kernel.IContainer)));
        }
        let targetSubscriber = validationTargetSubscriberMap.get(binding);
        if (targetSubscriber == null) {
            validationTargetSubscriberMap.set(binding, targetSubscriber = new WithValidationTargetSubscriber(connector, binding, binding.get(runtimeHtml.IFlushQueue)));
        }
        connector.start(scope);
        binding.useTargetSubscriber(targetSubscriber);
    }
    unbind(scope, binding) {
        validationConnectorMap.get(binding)?.stop();
    }
};
exports.ValidateBindingBehavior.inject = [runtimeHtml.IPlatform, runtime.IObserverLocator];
exports.ValidateBindingBehavior = __decorate([
    runtimeHtml.bindingBehavior('validate')
], exports.ValidateBindingBehavior);
class ValidatitionConnector {
    constructor(platform, observerLocator, defaultTrigger, propertyBinding, locator) {
        this.isChangeTrigger = false;
        this.isDirty = false;
        this.validatedOnce = false;
        this.triggerEvent = null;
        this.task = null;
        this.propertyBinding = propertyBinding;
        this.target = propertyBinding.target;
        this.defaultTrigger = defaultTrigger;
        this._platform = platform;
        this.oL = observerLocator;
        this.l = locator;
        this._triggerMediator = new BindingMediator('handleTriggerChange', this, observerLocator, locator);
        this._controllerMediator = new BindingMediator('handleControllerChange', this, observerLocator, locator);
        this._rulesMediator = new BindingMediator('handleRulesChange', this, observerLocator, locator);
        if (locator.has(IValidationController, true)) {
            this.scopedController = locator.get(IValidationController);
        }
    }
    _onUpdateSource() {
        this.isDirty = true;
        const event = this.triggerEvent;
        if (this.isChangeTrigger && (event === null || event !== null && this.validatedOnce)) {
            this.validateBinding();
        }
    }
    handleEvent(_event) {
        if (!this.isChangeTrigger || this.isChangeTrigger && this.isDirty) {
            this.validateBinding();
        }
    }
    start(scope) {
        this.scope = scope;
        this.target = this._getTarget();
        const delta = this._processBindingExpressionArgs();
        this._processDelta(delta);
    }
    stop() {
        this.task?.cancel();
        this.scope = void 0;
        this.task = null;
        const triggerEventName = this.triggerEvent;
        if (triggerEventName !== null) {
            this.target?.removeEventListener(triggerEventName, this);
        }
        this.controller?.removeSubscriber(this);
    }
    handleTriggerChange(newValue, _previousValue) {
        this._processDelta(new ValidateArgumentsDelta(void 0, this._ensureTrigger(newValue), void 0));
    }
    handleControllerChange(newValue, _previousValue) {
        this._processDelta(new ValidateArgumentsDelta(this._ensureController(newValue), void 0, void 0));
    }
    handleRulesChange(newValue, _previousValue) {
        this._processDelta(new ValidateArgumentsDelta(void 0, void 0, this._ensureRules(newValue)));
    }
    handleValidationEvent(event) {
        if (this.validatedOnce || !this.isChangeTrigger)
            return;
        const triggerEvent = this.triggerEvent;
        if (triggerEvent === null)
            return;
        const propertyName = this.bindingInfo.propertyInfo?.propertyName;
        if (propertyName === void 0)
            return;
        this.validatedOnce = event.addedResults.find((r) => r.result.propertyName === propertyName) !== void 0;
    }
    _processBindingExpressionArgs() {
        const scope = this.scope;
        let rules;
        let trigger;
        let controller;
        let ast = this.propertyBinding.ast;
        while (ast.name !== 'validate' && ast !== void 0) {
            ast = ast.expression;
        }
        const args = ast.args;
        for (let i = 0, ii = args.length; i < ii; i++) {
            const arg = args[i];
            switch (i) {
                case 0:
                    trigger = this._ensureTrigger(runtime.astEvaluate(arg, scope, this, this._triggerMediator));
                    break;
                case 1:
                    controller = this._ensureController(runtime.astEvaluate(arg, scope, this, this._controllerMediator));
                    break;
                case 2:
                    rules = this._ensureRules(runtime.astEvaluate(arg, scope, this, this._rulesMediator));
                    break;
                default:
                    throw new Error(`Unconsumed argument#${i + 1} for validate binding behavior: ${runtime.astEvaluate(arg, scope, this, null)}`);
            }
        }
        return new ValidateArgumentsDelta(this._ensureController(controller), this._ensureTrigger(trigger), rules);
    }
    validateBinding() {
        const task = this.task;
        this.task = this._platform.domReadQueue.queueTask(() => this.controller.validateBinding(this.propertyBinding));
        if (task !== this.task) {
            task?.cancel();
        }
    }
    _processDelta(delta) {
        const trigger = delta.trigger ?? this.trigger;
        const controller = delta.controller ?? this.controller;
        const rules = delta.rules;
        if (this.trigger !== trigger) {
            let event = this.triggerEvent;
            if (event !== null) {
                this.target.removeEventListener(event, this);
            }
            this.validatedOnce = false;
            this.isDirty = false;
            this.trigger = trigger;
            this.isChangeTrigger = trigger === exports.ValidationTrigger.change
                || trigger === exports.ValidationTrigger.changeOrBlur
                || trigger === exports.ValidationTrigger.changeOrFocusout;
            event = this.triggerEvent = this._getTriggerEvent(this.trigger);
            if (event !== null) {
                this.target.addEventListener(event, this);
            }
        }
        if (this.controller !== controller || rules !== void 0) {
            this.controller?.removeSubscriber(this);
            this.controller?.unregisterBinding(this.propertyBinding);
            this.controller = controller;
            controller.registerBinding(this.propertyBinding, this._setBindingInfo(rules));
            controller.addSubscriber(this);
        }
    }
    _ensureTrigger(trigger) {
        if (trigger === (void 0) || trigger === null) {
            trigger = this.defaultTrigger;
        }
        else if (!Object.values(exports.ValidationTrigger).includes(trigger)) {
            throw new Error(`${trigger} is not a supported validation trigger`);
        }
        return trigger;
    }
    _ensureController(controller) {
        if (controller === (void 0) || controller === null) {
            controller = this.scopedController;
        }
        else if (!(controller instanceof exports.ValidationController)) {
            throw new Error(`${controller} is not of type ValidationController`);
        }
        return controller;
    }
    _ensureRules(rules) {
        if (Array.isArray(rules) && rules.every((item) => item instanceof validation.PropertyRule)) {
            return rules;
        }
    }
    _getTarget() {
        const target = this.propertyBinding.target;
        if (target instanceof this._platform.Node) {
            return target;
        }
        else {
            const controller = target?.$controller;
            if (controller === void 0) {
                throw new Error('Invalid binding target');
            }
            return controller.host;
        }
    }
    _getTriggerEvent(trigger) {
        let triggerEvent = null;
        switch (trigger) {
            case exports.ValidationTrigger.blur:
            case exports.ValidationTrigger.changeOrBlur:
                triggerEvent = 'blur';
                break;
            case exports.ValidationTrigger.focusout:
            case exports.ValidationTrigger.changeOrFocusout:
                triggerEvent = 'focusout';
                break;
        }
        return triggerEvent;
    }
    _setBindingInfo(rules) {
        return this.bindingInfo = new BindingInfo(this.target, this.scope, rules);
    }
}
ValidatitionConnector.inject = [runtimeHtml.IPlatform, runtime.IObserverLocator, IDefaultTrigger];
runtime.connectable()(ValidatitionConnector);
runtimeHtml.mixinAstEvaluator(true)(ValidatitionConnector);
class WithValidationTargetSubscriber extends runtimeHtml.BindingTargetSubscriber {
    constructor(_validationSubscriber, binding, flushQueue) {
        super(binding, flushQueue);
        this._validationSubscriber = _validationSubscriber;
    }
    handleChange(value, _) {
        super.handleChange(value, _);
        this._validationSubscriber._onUpdateSource();
    }
}
class ValidateArgumentsDelta {
    constructor(controller, trigger, rules) {
        this.controller = controller;
        this.trigger = trigger;
        this.rules = rules;
    }
}
class BindingMediator {
    constructor(key, binding, oL, l) {
        this.key = key;
        this.binding = binding;
        this.oL = oL;
        this.l = l;
    }
    handleChange(newValue, previousValue) {
        this.binding[this.key](newValue, previousValue);
    }
}
runtime.connectable()(BindingMediator);
runtimeHtml.mixinAstEvaluator(true)(BindingMediator);

function getDefaultValidationHtmlConfiguration() {
    return {
        ...validation.getDefaultValidationConfiguration(),
        ValidationControllerFactoryType: ValidationControllerFactory,
        DefaultTrigger: exports.ValidationTrigger.focusout,
        UseSubscriberCustomAttribute: true,
        SubscriberCustomElementTemplate: defaultContainerTemplate
    };
}
function createConfiguration(optionsProvider) {
    return {
        optionsProvider,
        register(container) {
            const options = getDefaultValidationHtmlConfiguration();
            optionsProvider(options);
            container.registerFactory(IValidationController, new options.ValidationControllerFactoryType());
            container.register(validation.ValidationConfiguration.customize((opt) => {
                for (const optKey of Object.keys(opt)) {
                    if (optKey in options) {
                        opt[optKey] = options[optKey];
                    }
                }
            }), kernel.Registration.instance(IDefaultTrigger, options.DefaultTrigger), exports.ValidateBindingBehavior);
            if (options.UseSubscriberCustomAttribute) {
                container.register(exports.ValidationErrorsCustomAttribute);
            }
            const template = options.SubscriberCustomElementTemplate;
            if (template) {
                container.register(runtimeHtml.CustomElement.define({ ...defaultContainerDefinition, template }, exports.ValidationContainerCustomElement));
            }
            return container;
        },
        customize(cb) {
            return createConfiguration(cb ?? optionsProvider);
        },
    };
}
const ValidationHtmlConfiguration = createConfiguration(kernel.noop);

const resultIdAttribute = 'validation-result-id';
const resultContainerAttribute = 'validation-result-container';
const IValidationResultPresenterService = kernel.DI.createInterface('IValidationResultPresenterService', (x) => x.transient(exports.ValidationResultPresenterService));
exports.ValidationResultPresenterService = class ValidationResultPresenterService {
    constructor(platform) {
        this.platform = platform;
    }
    handleValidationEvent(event) {
        for (const [target, results] of this.reverseMap(event.removedResults)) {
            this.remove(target, results);
        }
        for (const [target, results] of this.reverseMap(event.addedResults)) {
            this.add(target, results);
        }
    }
    remove(target, results) {
        const messageContainer = this.getValidationMessageContainer(target);
        if (messageContainer === null) {
            return;
        }
        this.removeResults(messageContainer, results);
    }
    add(target, results) {
        const messageContainer = this.getValidationMessageContainer(target);
        if (messageContainer === null) {
            return;
        }
        this.showResults(messageContainer, results);
    }
    getValidationMessageContainer(target) {
        const parent = target.parentElement;
        if (parent === null) {
            return null;
        }
        let messageContainer = parent.querySelector(`[${resultContainerAttribute}]`);
        if (messageContainer === null) {
            messageContainer = this.platform.document.createElement('div');
            messageContainer.setAttribute(resultContainerAttribute, '');
            parent.appendChild(messageContainer);
        }
        return messageContainer;
    }
    showResults(messageContainer, results) {
        messageContainer.append(...results.reduce((acc, result) => {
            if (!result.valid) {
                const span = this.platform.document.createElement('span');
                span.setAttribute(resultIdAttribute, result.id.toString());
                span.textContent = result.message;
                acc.push(span);
            }
            return acc;
        }, []));
    }
    removeResults(messageContainer, results) {
        for (const result of results) {
            if (!result.valid) {
                messageContainer.querySelector(`[${resultIdAttribute}="${result.id}"]`)?.remove();
            }
        }
    }
    reverseMap(results) {
        const map = new Map();
        for (const { result, targets } of results) {
            for (const target of targets) {
                let targetResults = map.get(target);
                if (targetResults === void 0) {
                    map.set(target, targetResults = []);
                }
                targetResults.push(result);
            }
        }
        return map;
    }
};
exports.ValidationResultPresenterService = __decorate([
    __param(0, runtimeHtml.IPlatform)
], exports.ValidationResultPresenterService);

exports.BindingInfo = BindingInfo;
exports.BindingMediator = BindingMediator;
exports.ControllerValidateResult = ControllerValidateResult;
exports.IDefaultTrigger = IDefaultTrigger;
exports.IValidationController = IValidationController;
exports.IValidationResultPresenterService = IValidationResultPresenterService;
exports.ValidationControllerFactory = ValidationControllerFactory;
exports.ValidationEvent = ValidationEvent;
exports.ValidationHtmlConfiguration = ValidationHtmlConfiguration;
exports.ValidationResultTarget = ValidationResultTarget;
exports.defaultContainerDefinition = defaultContainerDefinition;
exports.defaultContainerTemplate = defaultContainerTemplate;
exports.getDefaultValidationHtmlConfiguration = getDefaultValidationHtmlConfiguration;
exports.getPropertyInfo = getPropertyInfo;
//# sourceMappingURL=index.dev.cjs.map
