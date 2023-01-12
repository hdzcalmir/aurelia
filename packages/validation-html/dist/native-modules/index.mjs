import { DI as t, IServiceLocator as i, optional as s, IContainer as e, Registration as n, noop as r } from "../kernel/dist/native-modules/index.mjs";

import { parsePropertyName as o, ValidationResult as a, ValidateInstruction as l, PropertyRule as h, IValidator as c, getDefaultValidationConfiguration as u, ValidationConfiguration as d } from "../validation/dist/native-modules/index.mjs";

import { IPlatform as f, bindable as v, INode as g, customAttribute as w, bindingBehavior as p, mixinAstEvaluator as b, PropertyBinding as m, IFlushQueue as V, BindingTargetSubscriber as C, CustomElement as y } from "../runtime-html/dist/native-modules/index.mjs";

import { astEvaluate as E, IExpressionParser as R, connectable as B, IObserverLocator as T } from "../runtime/dist/native-modules/index.mjs";

function M(t, i, s, e) {
    var n = arguments.length, r = n < 3 ? i : null === e ? e = Object.getOwnPropertyDescriptor(i, s) : e, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, i, s, e); else for (var a = t.length - 1; a >= 0; a--) if (o = t[a]) r = (n < 3 ? o(r) : n > 3 ? o(i, s, r) : o(i, s)) || r;
    return n > 3 && r && Object.defineProperty(i, s, r), r;
}

function $(t, i) {
    return function(s, e) {
        i(s, e, t);
    };
}

var j;

(function(t) {
    t["validate"] = "validate";
    t["reset"] = "reset";
})(j || (j = {}));

class ControllerValidateResult {
    constructor(t, i, s) {
        this.valid = t;
        this.results = i;
        this.instruction = s;
    }
}

class ValidationResultTarget {
    constructor(t, i) {
        this.result = t;
        this.targets = i;
    }
}

class ValidationEvent {
    constructor(t, i, s) {
        this.kind = t;
        this.addedResults = i;
        this.removedResults = s;
    }
}

class BindingInfo {
    constructor(t, i, s, e = void 0) {
        this.target = t;
        this.scope = i;
        this.rules = s;
        this.propertyInfo = e;
    }
}

class PropertyInfo {
    constructor(t, i) {
        this.object = t;
        this.propertyName = i;
    }
}

function A(t, i, s = 0) {
    let e = i.propertyInfo;
    if (void 0 !== e) return e;
    const n = i.scope;
    let r = t.ast.expression;
    let o = true;
    let a = "";
    while (void 0 !== r && 1 !== r?.$kind) {
        let i;
        switch (r.$kind) {
          case 18:
          case 17:
            r = r.expression;
            continue;

          case 10:
            i = r.name;
            break;

          case 11:
            {
                const s = r.key;
                if (o) o = 4 === s.$kind;
                i = `[${E(s, n, t, null).toString()}]`;
                break;
            }

          default:
            throw new Error(`Unknown expression of type ${r.constructor.name}`);
        }
        const s = a.startsWith("[") ? "" : ".";
        a = 0 === a.length ? i : `${i}${s}${a}`;
        r = r.object;
    }
    if (void 0 === r) throw new Error(`Unable to parse binding expression: ${t.ast.expression}`);
    let l;
    if (0 === a.length) {
        a = r.name;
        l = n.bindingContext;
    } else l = E(r, n, t, null);
    if (null === l || void 0 === l) return;
    e = new PropertyInfo(l, a);
    if (o) i.propertyInfo = e;
    return e;
}

const k = t.createInterface("IValidationController");

let I = class ValidationController {
    constructor(t, i, s, e) {
        this.validator = t;
        this.parser = i;
        this.platform = s;
        this.locator = e;
        this.bindings = new Map;
        this.subscribers = new Set;
        this.results = [];
        this.validating = false;
        this.elements = new WeakMap;
        this.objects = new Map;
    }
    addObject(t, i) {
        this.objects.set(t, i);
    }
    removeObject(t) {
        this.objects.delete(t);
        this.processResultDelta("reset", this.results.filter((i => i.object === t)), []);
    }
    addError(t, i, s) {
        let e;
        if (void 0 !== s) [e] = o(s, this.parser);
        const n = new a(false, t, e, i, void 0, void 0, true);
        this.processResultDelta("validate", [], [ n ]);
        return n;
    }
    removeError(t) {
        if (this.results.includes(t)) this.processResultDelta("reset", [ t ], []);
    }
    addSubscriber(t) {
        this.subscribers.add(t);
    }
    removeSubscriber(t) {
        this.subscribers.delete(t);
    }
    registerBinding(t, i) {
        this.bindings.set(t, i);
    }
    unregisterBinding(t) {
        this.resetBinding(t);
        this.bindings.delete(t);
    }
    async validate(t) {
        const {object: i, objectTag: s, flags: e} = t ?? {};
        let n;
        if (void 0 !== i) n = [ new l(i, t.propertyName, t.rules ?? this.objects.get(i), s, t.propertyTag) ]; else n = [ ...Array.from(this.objects.entries()).map((([t, i]) => new l(t, void 0, i, s))), ...(!s ? Array.from(this.bindings.entries()) : []).reduce(((t, [i, s]) => {
            const n = A(i, s, e);
            if (void 0 !== n && !this.objects.has(n.object)) t.push(new l(n.object, n.propertyName, s.rules));
            return t;
        }), []) ];
        this.validating = true;
        const r = this.platform.domReadQueue.queueTask((async () => {
            try {
                const i = await Promise.all(n.map((async t => this.validator.validate(t))));
                const s = i.reduce(((t, i) => {
                    t.push(...i);
                    return t;
                }), []);
                const e = this.getInstructionPredicate(t);
                const r = this.results.filter(e);
                this.processResultDelta("validate", r, s);
                return new ControllerValidateResult(void 0 === s.find((t => !t.valid)), s, t);
            } finally {
                this.validating = false;
            }
        }));
        return r.result;
    }
    reset(t) {
        const i = this.getInstructionPredicate(t);
        const s = this.results.filter(i);
        this.processResultDelta("reset", s, []);
    }
    async validateBinding(t) {
        if (!t.isBound) return;
        const i = this.bindings.get(t);
        if (void 0 === i) return;
        const s = A(t, i);
        const e = i.rules;
        if (void 0 === s) return;
        const {object: n, propertyName: r} = s;
        await this.validate(new l(n, r, e));
    }
    resetBinding(t) {
        const i = this.bindings.get(t);
        if (void 0 === i) return;
        const s = A(t, i);
        if (void 0 === s) return;
        i.propertyInfo = void 0;
        const {object: e, propertyName: n} = s;
        this.reset(new l(e, n));
    }
    async revalidateErrors() {
        const t = this.results.reduce(((t, {isManual: i, object: s, propertyRule: e, rule: n, valid: r}) => {
            if (!r && !i && void 0 !== e && void 0 !== s && void 0 !== n) {
                let i = t.get(s);
                if (void 0 === i) t.set(s, i = new Map);
                let r = i.get(e);
                if (void 0 === r) i.set(e, r = []);
                r.push(n);
            }
            return t;
        }), new Map);
        const i = [];
        for (const [s, e] of t) i.push(this.validate(new l(s, void 0, Array.from(e).map((([{validationRules: t, messageProvider: i, property: s}, e]) => new h(this.locator, t, i, s, [ e ]))))));
        await Promise.all(i);
    }
    getInstructionPredicate(t) {
        if (void 0 === t) return () => true;
        const i = t.propertyName;
        const s = t.rules;
        return e => !e.isManual && e.object === t.object && (void 0 === i || e.propertyName === i) && (void 0 === s || s.includes(e.propertyRule) || s.some((t => void 0 === e.propertyRule || t.$rules.flat().every((t => e.propertyRule.$rules.flat().includes(t))))));
    }
    getAssociatedElements({object: t, propertyName: i}) {
        const s = [];
        for (const [e, n] of this.bindings.entries()) {
            const r = A(e, n);
            if (void 0 !== r && r.object === t && r.propertyName === i) s.push(n.target);
        }
        return s;
    }
    processResultDelta(t, i, s) {
        const e = new ValidationEvent(t, [], []);
        s = s.slice(0);
        const n = this.elements;
        for (const t of i) {
            const i = n.get(t);
            n.delete(t);
            e.removedResults.push(new ValidationResultTarget(t, i));
            const r = s.findIndex((i => i.rule === t.rule && i.object === t.object && i.propertyName === t.propertyName));
            if (-1 === r) this.results.splice(this.results.indexOf(t), 1); else {
                const i = s.splice(r, 1)[0];
                const o = this.getAssociatedElements(i);
                n.set(i, o);
                e.addedResults.push(new ValidationResultTarget(i, o));
                this.results.splice(this.results.indexOf(t), 1, i);
            }
        }
        for (const t of s) {
            const i = this.getAssociatedElements(t);
            e.addedResults.push(new ValidationResultTarget(t, i));
            n.set(t, i);
            this.results.push(t);
        }
        for (const t of this.subscribers) t.handleValidationEvent(e);
    }
};

I = M([ $(0, c), $(1, R), $(2, f), $(3, i) ], I);

class ValidationControllerFactory {
    constructor() {
        this.Type = void 0;
    }
    registerTransformer(t) {
        return false;
    }
    construct(t, i) {
        return t.invoke(I, i);
    }
}

function S(t, i) {
    switch (2 & t.compareDocumentPosition(i)) {
      case 0:
        return 0;

      case 2:
        return 1;

      default:
        return -1;
    }
}

const D = `\n<slot></slot>\n<slot name='secondary'>\n  <span repeat.for="error of errors">\n    \${error.result.message}\n  </span>\n</slot>\n`;

const O = {
    name: "validation-container",
    shadowOptions: {
        mode: "open"
    },
    hasSlots: true
};

let P = class ValidationContainerCustomElement {
    constructor(t, i) {
        this.host = t;
        this.scopedController = i;
        this.errors = [];
    }
    handleValidationEvent(t) {
        for (const {result: i} of t.removedResults) {
            const t = this.errors.findIndex((t => t.result === i));
            if (-1 !== t) this.errors.splice(t, 1);
        }
        for (const {result: i, targets: s} of t.addedResults) {
            if (i.valid) continue;
            const t = s.filter((t => this.host.contains(t)));
            if (t.length > 0) this.errors.push(new ValidationResultTarget(i, t));
        }
        this.errors.sort(((t, i) => {
            if (t.targets[0] === i.targets[0]) return 0;
            return S(t.targets[0], i.targets[0]);
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

M([ v ], P.prototype, "controller", void 0);

M([ v ], P.prototype, "errors", void 0);

P = M([ $(0, g), $(1, s(k)) ], P);

let _ = class ValidationErrorsCustomAttribute {
    constructor(t, i) {
        this.host = t;
        this.scopedController = i;
        this.errors = [];
        this.errorsInternal = [];
    }
    handleValidationEvent(t) {
        for (const {result: i} of t.removedResults) {
            const t = this.errorsInternal.findIndex((t => t.result === i));
            if (-1 !== t) this.errorsInternal.splice(t, 1);
        }
        for (const {result: i, targets: s} of t.addedResults) {
            if (i.valid) continue;
            const t = s.filter((t => this.host.contains(t)));
            if (t.length > 0) this.errorsInternal.push(new ValidationResultTarget(i, t));
        }
        this.errorsInternal.sort(((t, i) => {
            if (t.targets[0] === i.targets[0]) return 0;
            return S(t.targets[0], i.targets[0]);
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

M([ v ], _.prototype, "controller", void 0);

M([ v({
    primary: true,
    mode: 6
}) ], _.prototype, "errors", void 0);

_ = M([ w("validation-errors"), $(0, g), $(1, s(k)) ], _);

var x;

(function(t) {
    t["manual"] = "manual";
    t["blur"] = "blur";
    t["focusout"] = "focusout";
    t["change"] = "change";
    t["changeOrBlur"] = "changeOrBlur";
    t["changeOrFocusout"] = "changeOrFocusout";
})(x || (x = {}));

const F = t.createInterface("IDefaultTrigger");

const U = new WeakMap;

const W = new WeakMap;

let N = class ValidateBindingBehavior {
    constructor(t, i) {
        this.p = t;
        this.oL = i;
    }
    bind(t, i) {
        if (!(i instanceof m)) throw new Error("Validate behavior used on non property binding");
        let s = U.get(i);
        if (null == s) U.set(i, s = new ValidatitionConnector(this.p, this.oL, i.get(F), i, i.get(e)));
        let n = W.get(i);
        if (null == n) W.set(i, n = new WithValidationTargetSubscriber(s, i, i.get(V)));
        s.start(t);
        i.useTargetSubscriber(n);
    }
    unbind(t, i) {
        U.get(i)?.stop();
    }
};

N.inject = [ f, T ];

N = M([ p("validate") ], N);

class ValidatitionConnector {
    constructor(t, i, s, e, n) {
        this.isChangeTrigger = false;
        this.isDirty = false;
        this.validatedOnce = false;
        this.triggerEvent = null;
        this.task = null;
        this.propertyBinding = e;
        this.target = e.target;
        this.defaultTrigger = s;
        this.p = t;
        this.oL = i;
        this.l = n;
        this.t = new BindingMediator("handleTriggerChange", this, i, n);
        this.i = new BindingMediator("handleControllerChange", this, i, n);
        this.h = new BindingMediator("handleRulesChange", this, i, n);
        if (n.has(k, true)) this.scopedController = n.get(k);
    }
    u() {
        this.isDirty = true;
        const t = this.triggerEvent;
        if (this.isChangeTrigger && (null === t || null !== t && this.validatedOnce)) this.validateBinding();
    }
    handleEvent(t) {
        if (!this.isChangeTrigger || this.isChangeTrigger && this.isDirty) this.validateBinding();
    }
    start(t) {
        this.scope = t;
        this.target = this.V();
        const i = this.C();
        this.R(i);
    }
    stop() {
        this.task?.cancel();
        this.scope = void 0;
        this.task = null;
        const t = this.triggerEvent;
        if (null !== t) this.target?.removeEventListener(t, this);
        this.controller?.removeSubscriber(this);
    }
    handleTriggerChange(t, i) {
        this.R(new ValidateArgumentsDelta(void 0, this.B(t), void 0));
    }
    handleControllerChange(t, i) {
        this.R(new ValidateArgumentsDelta(this.T(t), void 0, void 0));
    }
    handleRulesChange(t, i) {
        this.R(new ValidateArgumentsDelta(void 0, void 0, this.M(t)));
    }
    handleValidationEvent(t) {
        if (this.validatedOnce || !this.isChangeTrigger) return;
        const i = this.triggerEvent;
        if (null === i) return;
        const s = this.bindingInfo.propertyInfo?.propertyName;
        if (void 0 === s) return;
        this.validatedOnce = void 0 !== t.addedResults.find((t => t.result.propertyName === s));
    }
    C() {
        const t = this.scope;
        let i;
        let s;
        let e;
        let n = this.propertyBinding.ast;
        while ("validate" !== n.name && void 0 !== n) n = n.expression;
        const r = n.args;
        for (let n = 0, o = r.length; n < o; n++) {
            const o = r[n];
            switch (n) {
              case 0:
                s = this.B(E(o, t, this, this.t));
                break;

              case 1:
                e = this.T(E(o, t, this, this.i));
                break;

              case 2:
                i = this.M(E(o, t, this, this.h));
                break;

              default:
                throw new Error(`Unconsumed argument#${n + 1} for validate binding behavior: ${E(o, t, this, null)}`);
            }
        }
        return new ValidateArgumentsDelta(this.T(e), this.B(s), i);
    }
    validateBinding() {
        const t = this.task;
        this.task = this.p.domReadQueue.queueTask((() => this.controller.validateBinding(this.propertyBinding)));
        if (t !== this.task) t?.cancel();
    }
    R(t) {
        const i = t.trigger ?? this.trigger;
        const s = t.controller ?? this.controller;
        const e = t.rules;
        if (this.trigger !== i) {
            let t = this.triggerEvent;
            if (null !== t) this.target.removeEventListener(t, this);
            this.validatedOnce = false;
            this.isDirty = false;
            this.trigger = i;
            this.isChangeTrigger = i === x.change || i === x.changeOrBlur || i === x.changeOrFocusout;
            t = this.triggerEvent = this.$(this.trigger);
            if (null !== t) this.target.addEventListener(t, this);
        }
        if (this.controller !== s || void 0 !== e) {
            this.controller?.removeSubscriber(this);
            this.controller?.unregisterBinding(this.propertyBinding);
            this.controller = s;
            s.registerBinding(this.propertyBinding, this.j(e));
            s.addSubscriber(this);
        }
    }
    B(t) {
        if (void 0 === t || null === t) t = this.defaultTrigger; else if (!Object.values(x).includes(t)) throw new Error(`${t} is not a supported validation trigger`);
        return t;
    }
    T(t) {
        if (void 0 === t || null === t) t = this.scopedController; else if (!(t instanceof I)) throw new Error(`${t} is not of type ValidationController`);
        return t;
    }
    M(t) {
        if (Array.isArray(t) && t.every((t => t instanceof h))) return t;
    }
    V() {
        const t = this.propertyBinding.target;
        if (t instanceof this.p.Node) return t; else {
            const i = t?.$controller;
            if (void 0 === i) throw new Error("Invalid binding target");
            return i.host;
        }
    }
    $(t) {
        let i = null;
        switch (t) {
          case x.blur:
          case x.changeOrBlur:
            i = "blur";
            break;

          case x.focusout:
          case x.changeOrFocusout:
            i = "focusout";
            break;
        }
        return i;
    }
    j(t) {
        return this.bindingInfo = new BindingInfo(this.target, this.scope, t);
    }
}

ValidatitionConnector.inject = [ f, T, F ];

B()(ValidatitionConnector);

b(true)(ValidatitionConnector);

class WithValidationTargetSubscriber extends C {
    constructor(t, i, s) {
        super(i, s);
        this.A = t;
    }
    handleChange(t, i) {
        super.handleChange(t, i);
        this.A.u();
    }
}

class ValidateArgumentsDelta {
    constructor(t, i, s) {
        this.controller = t;
        this.trigger = i;
        this.rules = s;
    }
}

class BindingMediator {
    constructor(t, i, s, e) {
        this.key = t;
        this.binding = i;
        this.oL = s;
        this.l = e;
    }
    handleChange(t, i) {
        this.binding[this.key](t, i);
    }
}

B()(BindingMediator);

b(true)(BindingMediator);

function z() {
    return {
        ...u(),
        ValidationControllerFactoryType: ValidationControllerFactory,
        DefaultTrigger: x.focusout,
        UseSubscriberCustomAttribute: true,
        SubscriberCustomElementTemplate: D
    };
}

function q(t) {
    return {
        optionsProvider: t,
        register(i) {
            const s = z();
            t(s);
            i.registerFactory(k, new s.ValidationControllerFactoryType);
            i.register(d.customize((t => {
                for (const i of Object.keys(t)) if (i in s) t[i] = s[i];
            })), n.instance(F, s.DefaultTrigger), N);
            if (s.UseSubscriberCustomAttribute) i.register(_);
            const e = s.SubscriberCustomElementTemplate;
            if (e) i.register(y.define({
                ...O,
                template: e
            }, P));
            return i;
        },
        customize(i) {
            return q(i ?? t);
        }
    };
}

const G = q(r);

const H = "validation-result-id";

const J = "validation-result-container";

const K = t.createInterface("IValidationResultPresenterService", (t => t.transient(L)));

let L = class ValidationResultPresenterService {
    constructor(t) {
        this.platform = t;
    }
    handleValidationEvent(t) {
        for (const [i, s] of this.reverseMap(t.removedResults)) this.remove(i, s);
        for (const [i, s] of this.reverseMap(t.addedResults)) this.add(i, s);
    }
    remove(t, i) {
        const s = this.getValidationMessageContainer(t);
        if (null === s) return;
        this.removeResults(s, i);
    }
    add(t, i) {
        const s = this.getValidationMessageContainer(t);
        if (null === s) return;
        this.showResults(s, i);
    }
    getValidationMessageContainer(t) {
        const i = t.parentElement;
        if (null === i) return null;
        let s = i.querySelector(`[${J}]`);
        if (null === s) {
            s = this.platform.document.createElement("div");
            s.setAttribute(J, "");
            i.appendChild(s);
        }
        return s;
    }
    showResults(t, i) {
        t.append(...i.reduce(((t, i) => {
            if (!i.valid) {
                const s = this.platform.document.createElement("span");
                s.setAttribute(H, i.id.toString());
                s.textContent = i.message;
                t.push(s);
            }
            return t;
        }), []));
    }
    removeResults(t, i) {
        for (const s of i) if (!s.valid) t.querySelector(`[${H}="${s.id}"]`)?.remove();
    }
    reverseMap(t) {
        const i = new Map;
        for (const {result: s, targets: e} of t) for (const t of e) {
            let e = i.get(t);
            if (void 0 === e) i.set(t, e = []);
            e.push(s);
        }
        return i;
    }
};

L = M([ $(0, f) ], L);

export { BindingInfo, BindingMediator, ControllerValidateResult, F as IDefaultTrigger, k as IValidationController, K as IValidationResultPresenterService, N as ValidateBindingBehavior, j as ValidateEventKind, P as ValidationContainerCustomElement, I as ValidationController, ValidationControllerFactory, _ as ValidationErrorsCustomAttribute, ValidationEvent, G as ValidationHtmlConfiguration, L as ValidationResultPresenterService, ValidationResultTarget, x as ValidationTrigger, O as defaultContainerDefinition, D as defaultContainerTemplate, z as getDefaultValidationHtmlConfiguration, A as getPropertyInfo };

