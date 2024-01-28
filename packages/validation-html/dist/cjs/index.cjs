"use strict";

var t = require("@aurelia/kernel");

var e = require("@aurelia/validation");

var i = require("@aurelia/runtime-html");

var s = require("@aurelia/runtime");

function __decorate(t, e, i, s) {
    var r = arguments.length, o = r < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, n;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") o = Reflect.decorate(t, e, i, s); else for (var a = t.length - 1; a >= 0; a--) if (n = t[a]) o = (r < 3 ? n(o) : r > 3 ? n(e, i, o) : n(e, i)) || o;
    return r > 3 && o && Object.defineProperty(e, i, o), o;
}

function __param(t, e) {
    return function(i, s) {
        e(i, s, t);
    };
}

class ControllerValidateResult {
    constructor(t, e, i) {
        this.valid = t;
        this.results = e;
        this.instruction = i;
    }
}

class ValidationResultTarget {
    constructor(t, e) {
        this.result = t;
        this.targets = e;
    }
}

class ValidationEvent {
    constructor(t, e, i) {
        this.kind = t;
        this.addedResults = e;
        this.removedResults = i;
    }
}

class BindingInfo {
    constructor(t, e, i, s = void 0) {
        this.target = t;
        this.scope = e;
        this.rules = i;
        this.propertyInfo = s;
    }
}

class PropertyInfo {
    constructor(t, e) {
        this.object = t;
        this.propertyName = e;
    }
}

function getPropertyInfo(t, e) {
    let i = e.propertyInfo;
    if (i !== void 0) {
        return i;
    }
    const r = e.scope;
    let o = t.ast.expression;
    let n = true;
    let a = "";
    while (o !== void 0 && o?.$kind !== "AccessScope") {
        let e;
        switch (o.$kind) {
          case "BindingBehavior":
          case "ValueConverter":
            o = o.expression;
            continue;

          case "AccessMember":
            e = o.name;
            break;

          case "AccessKeyed":
            {
                const i = o.key;
                if (n) {
                    n = i.$kind === "PrimitiveLiteral";
                }
                e = `[${s.astEvaluate(i, r, t, null).toString()}]`;
                break;
            }

          default:
            throw new Error(`Unknown expression of type ${o.constructor.name}`);
        }
        const i = a.startsWith("[") ? "" : ".";
        a = a.length === 0 ? e : `${e}${i}${a}`;
        o = o.object;
    }
    if (o === void 0) {
        throw new Error(`Unable to parse binding expression: ${t.ast.expression}`);
    }
    let l;
    if (a.length === 0) {
        a = o.name;
        l = r.bindingContext;
    } else {
        l = s.astEvaluate(o, r, t, null);
    }
    if (l === null || l === void 0) {
        return void 0;
    }
    i = new PropertyInfo(l, a);
    if (n) {
        e.propertyInfo = i;
    }
    return i;
}

const r = /*@__PURE__*/ t.DI.createInterface("IValidationController");

exports.ValidationController = class ValidationController {
    constructor(t, e, i, s) {
        this.validator = t;
        this.parser = e;
        this.platform = i;
        this.locator = s;
        this.bindings = new Map;
        this.subscribers = new Set;
        this.results = [];
        this.validating = false;
        this.elements = new WeakMap;
        this.objects = new Map;
    }
    addObject(t, e) {
        this.objects.set(t, e);
    }
    removeObject(t) {
        this.objects.delete(t);
        this.processResultDelta("reset", this.results.filter((e => e.object === t)), []);
    }
    addError(t, i, s) {
        let r;
        if (s !== void 0) {
            [r] = e.parsePropertyName(s, this.parser);
        }
        const o = new e.ValidationResult(false, t, r, i, undefined, undefined, true);
        this.processResultDelta("validate", [], [ o ]);
        return o;
    }
    removeError(t) {
        if (this.results.includes(t)) {
            this.processResultDelta("reset", [ t ], []);
        }
    }
    addSubscriber(t) {
        this.subscribers.add(t);
    }
    removeSubscriber(t) {
        this.subscribers.delete(t);
    }
    registerBinding(t, e) {
        this.bindings.set(t, e);
    }
    unregisterBinding(t) {
        this.resetBinding(t);
        this.bindings.delete(t);
    }
    async validate(t) {
        const {object: i, objectTag: s} = t ?? {};
        let r;
        if (i !== void 0) {
            r = [ new e.ValidateInstruction(i, t?.propertyName, t?.rules ?? this.objects.get(i), s, t?.propertyTag) ];
        } else {
            r = [ ...Array.from(this.objects.entries()).map((([t, i]) => new e.ValidateInstruction(t, void 0, i, s))), ...Array.from(this.bindings.entries()).reduce(((i, [r, o]) => {
                const n = getPropertyInfo(r, o);
                if (n !== void 0 && !this.objects.has(n.object)) {
                    i.push(new e.ValidateInstruction(n.object, n.propertyName, o.rules, s, t?.propertyTag));
                }
                return i;
            }), []) ];
        }
        this.validating = true;
        const o = this.platform.domReadQueue.queueTask((async () => {
            try {
                const e = await Promise.all(r.map((async t => this.validator.validate(t))));
                const i = e.reduce(((t, e) => {
                    t.push(...e);
                    return t;
                }), []);
                const s = this.getInstructionPredicate(t);
                const o = this.results.filter(s);
                this.processResultDelta("validate", o, i);
                return new ControllerValidateResult(i.find((t => !t.valid)) === void 0, i, t);
            } finally {
                this.validating = false;
            }
        }));
        return o.result;
    }
    reset(t) {
        const e = this.getInstructionPredicate(t);
        const i = this.results.filter(e);
        this.processResultDelta("reset", i, []);
    }
    async validateBinding(t) {
        if (!t.isBound) {
            return;
        }
        const i = this.bindings.get(t);
        if (i === void 0) {
            return;
        }
        const s = getPropertyInfo(t, i);
        const r = i.rules;
        if (s === void 0) {
            return;
        }
        const {object: o, propertyName: n} = s;
        await this.validate(new e.ValidateInstruction(o, n, r));
    }
    resetBinding(t) {
        const i = this.bindings.get(t);
        if (i === void 0) {
            return;
        }
        const s = getPropertyInfo(t, i);
        if (s === void 0) {
            return;
        }
        i.propertyInfo = void 0;
        const {object: r, propertyName: o} = s;
        this.reset(new e.ValidateInstruction(r, o));
    }
    async revalidateErrors() {
        const t = this.results.reduce(((t, {isManual: e, object: i, propertyRule: s, rule: r, valid: o}) => {
            if (!o && !e && s !== void 0 && i !== void 0 && r !== void 0) {
                let e = t.get(i);
                if (e === void 0) {
                    t.set(i, e = new Map);
                }
                let o = e.get(s);
                if (o === void 0) {
                    e.set(s, o = []);
                }
                o.push(r);
            }
            return t;
        }), new Map);
        const i = [];
        for (const [s, r] of t) {
            i.push(this.validate(new e.ValidateInstruction(s, undefined, Array.from(r).map((([{validationRules: t, messageProvider: i, property: s}, r]) => new e.PropertyRule(this.locator, t, i, s, [ r ]))))));
        }
        await Promise.all(i);
    }
    getInstructionPredicate(t) {
        if (t === void 0) {
            return () => true;
        }
        const e = t.propertyName;
        const i = t.rules;
        return s => !s.isManual && s.object === t.object && (e === void 0 || s.propertyName === e) && (i === void 0 || i.includes(s.propertyRule) || i.some((t => s.propertyRule === void 0 || t.$rules.flat().every((t => s.propertyRule.$rules.flat().includes(t))))));
    }
    getAssociatedElements({object: t, propertyName: e}) {
        const i = [];
        for (const [s, r] of this.bindings.entries()) {
            const o = getPropertyInfo(s, r);
            if (o !== void 0 && o.object === t && o.propertyName === e) {
                i.push(r.target);
            }
        }
        return i;
    }
    processResultDelta(t, e, i) {
        const s = new ValidationEvent(t, [], []);
        i = i.slice(0);
        const r = this.elements;
        for (const t of e) {
            const e = r.get(t);
            r.delete(t);
            s.removedResults.push(new ValidationResultTarget(t, e));
            const o = i.findIndex((e => e.rule === t.rule && e.object === t.object && e.propertyName === t.propertyName));
            if (o === -1) {
                this.results.splice(this.results.indexOf(t), 1);
            } else {
                const e = i.splice(o, 1)[0];
                const n = this.getAssociatedElements(e);
                r.set(e, n);
                s.addedResults.push(new ValidationResultTarget(e, n));
                this.results.splice(this.results.indexOf(t), 1, e);
            }
        }
        for (const t of i) {
            const e = this.getAssociatedElements(t);
            s.addedResults.push(new ValidationResultTarget(t, e));
            r.set(t, e);
            this.results.push(t);
        }
        for (const t of this.subscribers) {
            t.handleValidationEvent(s);
        }
    }
};

exports.ValidationController = __decorate([ __param(0, e.IValidator), __param(1, s.IExpressionParser), __param(2, i.IPlatform), __param(3, t.IServiceLocator) ], exports.ValidationController);

class ValidationControllerFactory {
    constructor() {
        this.Type = void 0;
    }
    registerTransformer(t) {
        return false;
    }
    construct(t, e) {
        return t.invoke(exports.ValidationController, e);
    }
}

function compareDocumentPositionFlat(t, e) {
    switch (t.compareDocumentPosition(e) & 2) {
      case 0:
        return 0;

      case 2:
        return 1;

      default:
        return -1;
    }
}

const o = `\n<slot></slot>\n<slot name='secondary'>\n  <span repeat.for="error of errors">\n    \${error.result.message}\n  </span>\n</slot>\n`;

const n = {
    name: "validation-container",
    shadowOptions: {
        mode: "open"
    },
    hasSlots: true
};

exports.ValidationContainerCustomElement = class ValidationContainerCustomElement {
    constructor(t, e) {
        this.host = t;
        this.scopedController = e;
        this.errors = [];
    }
    handleValidationEvent(t) {
        for (const {result: e} of t.removedResults) {
            const t = this.errors.findIndex((t => t.result === e));
            if (t !== -1) {
                this.errors.splice(t, 1);
            }
        }
        for (const {result: e, targets: i} of t.addedResults) {
            if (e.valid) {
                continue;
            }
            const t = i.filter((t => this.host.contains(t)));
            if (t.length > 0) {
                this.errors.push(new ValidationResultTarget(e, t));
            }
        }
        this.errors.sort(((t, e) => {
            if (t.targets[0] === e.targets[0]) {
                return 0;
            }
            return compareDocumentPositionFlat(t.targets[0], e.targets[0]);
        }));
    }
    binding() {
        this.controller = this.controller ?? this.scopedController;
        this.controller.addSubscriber(this);
    }
    unbinding() {
        this.controller.removeSubscriber(this);
    }
};

__decorate([ i.bindable ], exports.ValidationContainerCustomElement.prototype, "controller", void 0);

__decorate([ i.bindable ], exports.ValidationContainerCustomElement.prototype, "errors", void 0);

exports.ValidationContainerCustomElement = __decorate([ __param(0, i.INode), __param(1, t.optional(r)) ], exports.ValidationContainerCustomElement);

exports.ValidationErrorsCustomAttribute = class ValidationErrorsCustomAttribute {
    constructor(t, e) {
        this.host = t;
        this.scopedController = e;
        this.errors = [];
        this.errorsInternal = [];
    }
    handleValidationEvent(t) {
        for (const {result: e} of t.removedResults) {
            const t = this.errorsInternal.findIndex((t => t.result === e));
            if (t !== -1) {
                this.errorsInternal.splice(t, 1);
            }
        }
        for (const {result: e, targets: i} of t.addedResults) {
            if (e.valid) {
                continue;
            }
            const t = i.filter((t => this.host.contains(t)));
            if (t.length > 0) {
                this.errorsInternal.push(new ValidationResultTarget(e, t));
            }
        }
        this.errorsInternal.sort(((t, e) => {
            if (t.targets[0] === e.targets[0]) {
                return 0;
            }
            return compareDocumentPositionFlat(t.targets[0], e.targets[0]);
        }));
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

__decorate([ i.bindable ], exports.ValidationErrorsCustomAttribute.prototype, "controller", void 0);

__decorate([ i.bindable({
    primary: true,
    mode: i.BindingMode.twoWay
}) ], exports.ValidationErrorsCustomAttribute.prototype, "errors", void 0);

exports.ValidationErrorsCustomAttribute = __decorate([ i.customAttribute("validation-errors"), __param(0, i.INode), __param(1, t.optional(r)) ], exports.ValidationErrorsCustomAttribute);

exports.ValidationTrigger = void 0;

(function(t) {
    t["manual"] = "manual";
    t["blur"] = "blur";
    t["focusout"] = "focusout";
    t["change"] = "change";
    t["changeOrBlur"] = "changeOrBlur";
    t["changeOrFocusout"] = "changeOrFocusout";
})(exports.ValidationTrigger || (exports.ValidationTrigger = {}));

const a = /*@__PURE__*/ t.DI.createInterface("IDefaultTrigger");

const l = new WeakMap;

const h = new WeakMap;

exports.ValidateBindingBehavior = class ValidateBindingBehavior {
    constructor(t, e) {
        this.p = t;
        this.oL = e;
    }
    bind(e, s) {
        if (!(s instanceof i.PropertyBinding)) {
            throw new Error("Validate behavior used on non property binding");
        }
        let r = l.get(s);
        if (r == null) {
            l.set(s, r = new ValidatitionConnector(this.p, this.oL, s.get(a), s, s.get(t.IContainer)));
        }
        let o = h.get(s);
        if (o == null) {
            h.set(s, o = new WithValidationTargetSubscriber(r, s, s.get(i.IFlushQueue)));
        }
        r.start(e);
        s.useTargetSubscriber(o);
    }
    unbind(t, e) {
        l.get(e)?.stop();
    }
};

exports.ValidateBindingBehavior.inject = [ i.IPlatform, s.IObserverLocator ];

exports.ValidateBindingBehavior = __decorate([ i.bindingBehavior("validate") ], exports.ValidateBindingBehavior);

class ValidatitionConnector {
    constructor(t, e, i, s, o) {
        this.isChangeTrigger = false;
        this.isDirty = false;
        this.validatedOnce = false;
        this.triggerEvent = null;
        this.task = null;
        this.propertyBinding = s;
        this.target = s.target;
        this.defaultTrigger = i;
        this.p = t;
        this.oL = e;
        this.l = o;
        this.t = new BindingMediator("handleTriggerChange", this, e, o);
        this.i = new BindingMediator("handleControllerChange", this, e, o);
        this.h = new BindingMediator("handleRulesChange", this, e, o);
        if (o.has(r, true)) {
            this.scopedController = o.get(r);
        }
    }
    u() {
        this.isDirty = true;
        const t = this.triggerEvent;
        if (this.isChangeTrigger && (t === null || t !== null && this.validatedOnce)) {
            this.validateBinding();
        }
    }
    handleEvent(t) {
        if (!this.isChangeTrigger || this.isChangeTrigger && this.isDirty) {
            this.validateBinding();
        }
    }
    start(t) {
        this.scope = t;
        this.target = this._();
        const e = this.V();
        this.C(e);
    }
    stop() {
        this.task?.cancel();
        this.scope = void 0;
        this.task = null;
        const t = this.triggerEvent;
        if (t !== null) {
            this.target?.removeEventListener(t, this);
        }
        this.controller?.removeSubscriber(this);
    }
    handleTriggerChange(t, e) {
        this.C(new ValidateArgumentsDelta(void 0, this.R(t), void 0));
    }
    handleControllerChange(t, e) {
        this.C(new ValidateArgumentsDelta(this.B(t), void 0, void 0));
    }
    handleRulesChange(t, e) {
        this.C(new ValidateArgumentsDelta(void 0, void 0, this.T(t)));
    }
    handleValidationEvent(t) {
        if (this.validatedOnce || !this.isChangeTrigger) return;
        const e = this.triggerEvent;
        if (e === null) return;
        const i = this.bindingInfo.propertyInfo?.propertyName;
        if (i === void 0) return;
        this.validatedOnce = t.addedResults.find((t => t.result.propertyName === i)) !== void 0;
    }
    V() {
        const t = this.scope;
        let e;
        let i;
        let r;
        let o = this.propertyBinding.ast;
        while (o.name !== "validate" && o !== void 0) {
            o = o.expression;
        }
        const n = o.args;
        for (let o = 0, a = n.length; o < a; o++) {
            const a = n[o];
            switch (o) {
              case 0:
                i = this.R(s.astEvaluate(a, t, this, this.t));
                break;

              case 1:
                r = this.B(s.astEvaluate(a, t, this, this.i));
                break;

              case 2:
                e = this.T(s.astEvaluate(a, t, this, this.h));
                break;

              default:
                throw new Error(`Unconsumed argument#${o + 1} for validate binding behavior: ${s.astEvaluate(a, t, this, null)}`);
            }
        }
        return new ValidateArgumentsDelta(this.B(r), this.R(i), e);
    }
    validateBinding() {
        const t = this.task;
        this.task = this.p.domReadQueue.queueTask((() => this.controller.validateBinding(this.propertyBinding)));
        if (t !== this.task) {
            t?.cancel();
        }
    }
    C(t) {
        const e = t.trigger ?? this.trigger;
        const i = t.controller ?? this.controller;
        const s = t.rules;
        if (this.trigger !== e) {
            let t = this.triggerEvent;
            if (t !== null) {
                this.target.removeEventListener(t, this);
            }
            this.validatedOnce = false;
            this.isDirty = false;
            this.trigger = e;
            this.isChangeTrigger = e === exports.ValidationTrigger.change || e === exports.ValidationTrigger.changeOrBlur || e === exports.ValidationTrigger.changeOrFocusout;
            t = this.triggerEvent = this.M(this.trigger);
            if (t !== null) {
                this.target.addEventListener(t, this);
            }
        }
        if (this.controller !== i || s !== void 0) {
            this.controller?.removeSubscriber(this);
            this.controller?.unregisterBinding(this.propertyBinding);
            this.controller = i;
            i.registerBinding(this.propertyBinding, this.P(s));
            i.addSubscriber(this);
        }
    }
    R(t) {
        if (t === void 0 || t === null) {
            t = this.defaultTrigger;
        } else if (!Object.values(exports.ValidationTrigger).includes(t)) {
            throw new Error(`${t} is not a supported validation trigger`);
        }
        return t;
    }
    B(t) {
        if (t === void 0 || t === null) {
            t = this.scopedController;
        } else if (!(t instanceof exports.ValidationController)) {
            throw new Error(`${t} is not of type ValidationController`);
        }
        return t;
    }
    T(t) {
        if (Array.isArray(t) && t.every((t => t instanceof e.PropertyRule))) {
            return t;
        }
    }
    _() {
        const t = this.propertyBinding.target;
        if (t instanceof this.p.Node) {
            return t;
        } else {
            const e = t?.$controller;
            if (e === void 0) {
                throw new Error("Invalid binding target");
            }
            return e.host;
        }
    }
    M(t) {
        let e = null;
        switch (t) {
          case exports.ValidationTrigger.blur:
          case exports.ValidationTrigger.changeOrBlur:
            e = "blur";
            break;

          case exports.ValidationTrigger.focusout:
          case exports.ValidationTrigger.changeOrFocusout:
            e = "focusout";
            break;
        }
        return e;
    }
    P(t) {
        return this.bindingInfo = new BindingInfo(this.target, this.scope, t);
    }
}

ValidatitionConnector.inject = [ i.IPlatform, s.IObserverLocator, a ];

s.connectable()(ValidatitionConnector);

i.mixinAstEvaluator(true)(ValidatitionConnector);

class WithValidationTargetSubscriber extends i.BindingTargetSubscriber {
    constructor(t, e, i) {
        super(e, i);
        this.I = t;
    }
    handleChange(t, e) {
        super.handleChange(t, e);
        this.I.u();
    }
}

class ValidateArgumentsDelta {
    constructor(t, e, i) {
        this.controller = t;
        this.trigger = e;
        this.rules = i;
    }
}

class BindingMediator {
    constructor(t, e, i, s) {
        this.key = t;
        this.binding = e;
        this.oL = i;
        this.l = s;
    }
    handleChange(t, e) {
        this.binding[this.key](t, e);
    }
}

s.connectable()(BindingMediator);

i.mixinAstEvaluator(true)(BindingMediator);

function getDefaultValidationHtmlConfiguration() {
    return {
        ...e.getDefaultValidationConfiguration(),
        ValidationControllerFactoryType: ValidationControllerFactory,
        DefaultTrigger: exports.ValidationTrigger.focusout,
        UseSubscriberCustomAttribute: true,
        SubscriberCustomElementTemplate: o
    };
}

function createConfiguration(s) {
    return {
        optionsProvider: s,
        register(o) {
            const l = getDefaultValidationHtmlConfiguration();
            s(l);
            o.registerFactory(r, new l.ValidationControllerFactoryType);
            o.register(e.ValidationConfiguration.customize((t => {
                for (const e of Object.keys(t)) {
                    if (e in l) {
                        t[e] = l[e];
                    }
                }
            })), t.Registration.instance(a, l.DefaultTrigger), exports.ValidateBindingBehavior);
            if (l.UseSubscriberCustomAttribute) {
                o.register(exports.ValidationErrorsCustomAttribute);
            }
            const h = l.SubscriberCustomElementTemplate;
            if (h) {
                o.register(i.CustomElement.define({
                    ...n,
                    template: h
                }, exports.ValidationContainerCustomElement));
            }
            return o;
        },
        customize(t) {
            return createConfiguration(t ?? s);
        }
    };
}

const c = createConfiguration(t.noop);

const u = "validation-result-id";

const d = "validation-result-container";

const f = /*@__PURE__*/ t.DI.createInterface("IValidationResultPresenterService", (t => t.transient(exports.ValidationResultPresenterService)));

exports.ValidationResultPresenterService = class ValidationResultPresenterService {
    constructor(t) {
        this.platform = t;
    }
    handleValidationEvent(t) {
        for (const [e, i] of this.reverseMap(t.removedResults)) {
            this.remove(e, i);
        }
        for (const [e, i] of this.reverseMap(t.addedResults)) {
            this.add(e, i);
        }
    }
    remove(t, e) {
        const i = this.getValidationMessageContainer(t);
        if (i === null) {
            return;
        }
        this.removeResults(i, e);
    }
    add(t, e) {
        const i = this.getValidationMessageContainer(t);
        if (i === null) {
            return;
        }
        this.showResults(i, e);
    }
    getValidationMessageContainer(t) {
        const e = t.parentElement;
        if (e === null) {
            return null;
        }
        let i = e.querySelector(`[${d}]`);
        if (i === null) {
            i = this.platform.document.createElement("div");
            i.setAttribute(d, "");
            e.appendChild(i);
        }
        return i;
    }
    showResults(t, e) {
        t.append(...e.reduce(((t, e) => {
            if (!e.valid) {
                const i = this.platform.document.createElement("span");
                i.setAttribute(u, e.id.toString());
                i.textContent = e.message;
                t.push(i);
            }
            return t;
        }), []));
    }
    removeResults(t, e) {
        for (const i of e) {
            if (!i.valid) {
                t.querySelector(`[${u}="${i.id}"]`)?.remove();
            }
        }
    }
    reverseMap(t) {
        const e = new Map;
        for (const {result: i, targets: s} of t) {
            for (const t of s) {
                let s = e.get(t);
                if (s === void 0) {
                    e.set(t, s = []);
                }
                s.push(i);
            }
        }
        return e;
    }
};

exports.ValidationResultPresenterService = __decorate([ __param(0, i.IPlatform) ], exports.ValidationResultPresenterService);

exports.BindingInfo = BindingInfo;

exports.BindingMediator = BindingMediator;

exports.ControllerValidateResult = ControllerValidateResult;

exports.IDefaultTrigger = a;

exports.IValidationController = r;

exports.IValidationResultPresenterService = f;

exports.ValidationControllerFactory = ValidationControllerFactory;

exports.ValidationEvent = ValidationEvent;

exports.ValidationHtmlConfiguration = c;

exports.ValidationResultTarget = ValidationResultTarget;

exports.defaultContainerDefinition = n;

exports.defaultContainerTemplate = o;

exports.getDefaultValidationHtmlConfiguration = getDefaultValidationHtmlConfiguration;

exports.getPropertyInfo = getPropertyInfo;
//# sourceMappingURL=index.cjs.map
