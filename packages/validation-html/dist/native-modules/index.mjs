import { DI as t, IServiceLocator as i, optional as e, IContainer as s, Registration as n, noop as r } from "../kernel/dist/native-modules/index.mjs";

import { parsePropertyName as o, ValidationResult as a, ValidateInstruction as l, PropertyRule as h, IValidator as c, getDefaultValidationConfiguration as u, ValidationConfiguration as d } from "../validation/dist/native-modules/index.mjs";

import { IPlatform as f, bindable as g, INode as v, customAttribute as p, bindingBehavior as m, mixinAstEvaluator as w, PropertyBinding as b, IFlushQueue as _, BindingTargetSubscriber as V, CustomElement as C } from "../runtime-html/dist/native-modules/index.mjs";

import { astEvaluate as y, IExpressionParser as E, connectable as R, IObserverLocator as B } from "../runtime/dist/native-modules/index.mjs";

function __decorate(t, i, e, s) {
    var n = arguments.length, r = n < 3 ? i : s === null ? s = Object.getOwnPropertyDescriptor(i, e) : s, o;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(t, i, e, s); else for (var a = t.length - 1; a >= 0; a--) if (o = t[a]) r = (n < 3 ? o(r) : n > 3 ? o(i, e, r) : o(i, e)) || r;
    return n > 3 && r && Object.defineProperty(i, e, r), r;
}

function __param(t, i) {
    return function(e, s) {
        i(e, s, t);
    };
}

var T;

(function(t) {
    t["validate"] = "validate";
    t["reset"] = "reset";
})(T || (T = {}));

class ControllerValidateResult {
    constructor(t, i, e) {
        this.valid = t;
        this.results = i;
        this.instruction = e;
    }
}

class ValidationResultTarget {
    constructor(t, i) {
        this.result = t;
        this.targets = i;
    }
}

class ValidationEvent {
    constructor(t, i, e) {
        this.kind = t;
        this.addedResults = i;
        this.removedResults = e;
    }
}

class BindingInfo {
    constructor(t, i, e, s = void 0) {
        this.target = t;
        this.scope = i;
        this.rules = e;
        this.propertyInfo = s;
    }
}

class PropertyInfo {
    constructor(t, i) {
        this.object = t;
        this.propertyName = i;
    }
}

function getPropertyInfo(t, i) {
    let e = i.propertyInfo;
    if (e !== void 0) {
        return e;
    }
    const s = i.scope;
    let n = t.ast.expression;
    let r = true;
    let o = "";
    while (n !== void 0 && n?.$kind !== 1) {
        let i;
        switch (n.$kind) {
          case 18:
          case 17:
            n = n.expression;
            continue;

          case 10:
            i = n.name;
            break;

          case 11:
            {
                const e = n.key;
                if (r) {
                    r = e.$kind === 4;
                }
                i = `[${y(e, s, t, null).toString()}]`;
                break;
            }

          default:
            throw new Error(`Unknown expression of type ${n.constructor.name}`);
        }
        const e = o.startsWith("[") ? "" : ".";
        o = o.length === 0 ? i : `${i}${e}${o}`;
        n = n.object;
    }
    if (n === void 0) {
        throw new Error(`Unable to parse binding expression: ${t.ast.expression}`);
    }
    let a;
    if (o.length === 0) {
        o = n.name;
        a = s.bindingContext;
    } else {
        a = y(n, s, t, null);
    }
    if (a === null || a === void 0) {
        return void 0;
    }
    e = new PropertyInfo(a, o);
    if (r) {
        i.propertyInfo = e;
    }
    return e;
}

const M = /*@__PURE__*/ t.createInterface("IValidationController");

let P = class ValidationController {
    constructor(t, i, e, s) {
        this.validator = t;
        this.parser = i;
        this.platform = e;
        this.locator = s;
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
    addError(t, i, e) {
        let s;
        if (e !== void 0) {
            [s] = o(e, this.parser);
        }
        const n = new a(false, t, s, i, undefined, undefined, true);
        this.processResultDelta("validate", [], [ n ]);
        return n;
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
    registerBinding(t, i) {
        this.bindings.set(t, i);
    }
    unregisterBinding(t) {
        this.resetBinding(t);
        this.bindings.delete(t);
    }
    async validate(t) {
        const {object: i, objectTag: e} = t ?? {};
        let s;
        if (i !== void 0) {
            s = [ new l(i, t.propertyName, t.rules ?? this.objects.get(i), e, t.propertyTag) ];
        } else {
            s = [ ...Array.from(this.objects.entries()).map((([t, i]) => new l(t, void 0, i, e))), ...(!e ? Array.from(this.bindings.entries()) : []).reduce(((t, [i, e]) => {
                const s = getPropertyInfo(i, e);
                if (s !== void 0 && !this.objects.has(s.object)) {
                    t.push(new l(s.object, s.propertyName, e.rules));
                }
                return t;
            }), []) ];
        }
        this.validating = true;
        const n = this.platform.domReadQueue.queueTask((async () => {
            try {
                const i = await Promise.all(s.map((async t => this.validator.validate(t))));
                const e = i.reduce(((t, i) => {
                    t.push(...i);
                    return t;
                }), []);
                const n = this.getInstructionPredicate(t);
                const r = this.results.filter(n);
                this.processResultDelta("validate", r, e);
                return new ControllerValidateResult(e.find((t => !t.valid)) === void 0, e, t);
            } finally {
                this.validating = false;
            }
        }));
        return n.result;
    }
    reset(t) {
        const i = this.getInstructionPredicate(t);
        const e = this.results.filter(i);
        this.processResultDelta("reset", e, []);
    }
    async validateBinding(t) {
        if (!t.isBound) {
            return;
        }
        const i = this.bindings.get(t);
        if (i === void 0) {
            return;
        }
        const e = getPropertyInfo(t, i);
        const s = i.rules;
        if (e === void 0) {
            return;
        }
        const {object: n, propertyName: r} = e;
        await this.validate(new l(n, r, s));
    }
    resetBinding(t) {
        const i = this.bindings.get(t);
        if (i === void 0) {
            return;
        }
        const e = getPropertyInfo(t, i);
        if (e === void 0) {
            return;
        }
        i.propertyInfo = void 0;
        const {object: s, propertyName: n} = e;
        this.reset(new l(s, n));
    }
    async revalidateErrors() {
        const t = this.results.reduce(((t, {isManual: i, object: e, propertyRule: s, rule: n, valid: r}) => {
            if (!r && !i && s !== void 0 && e !== void 0 && n !== void 0) {
                let i = t.get(e);
                if (i === void 0) {
                    t.set(e, i = new Map);
                }
                let r = i.get(s);
                if (r === void 0) {
                    i.set(s, r = []);
                }
                r.push(n);
            }
            return t;
        }), new Map);
        const i = [];
        for (const [e, s] of t) {
            i.push(this.validate(new l(e, undefined, Array.from(s).map((([{validationRules: t, messageProvider: i, property: e}, s]) => new h(this.locator, t, i, e, [ s ]))))));
        }
        await Promise.all(i);
    }
    getInstructionPredicate(t) {
        if (t === void 0) {
            return () => true;
        }
        const i = t.propertyName;
        const e = t.rules;
        return s => !s.isManual && s.object === t.object && (i === void 0 || s.propertyName === i) && (e === void 0 || e.includes(s.propertyRule) || e.some((t => s.propertyRule === void 0 || t.$rules.flat().every((t => s.propertyRule.$rules.flat().includes(t))))));
    }
    getAssociatedElements({object: t, propertyName: i}) {
        const e = [];
        for (const [s, n] of this.bindings.entries()) {
            const r = getPropertyInfo(s, n);
            if (r !== void 0 && r.object === t && r.propertyName === i) {
                e.push(n.target);
            }
        }
        return e;
    }
    processResultDelta(t, i, e) {
        const s = new ValidationEvent(t, [], []);
        e = e.slice(0);
        const n = this.elements;
        for (const t of i) {
            const i = n.get(t);
            n.delete(t);
            s.removedResults.push(new ValidationResultTarget(t, i));
            const r = e.findIndex((i => i.rule === t.rule && i.object === t.object && i.propertyName === t.propertyName));
            if (r === -1) {
                this.results.splice(this.results.indexOf(t), 1);
            } else {
                const i = e.splice(r, 1)[0];
                const o = this.getAssociatedElements(i);
                n.set(i, o);
                s.addedResults.push(new ValidationResultTarget(i, o));
                this.results.splice(this.results.indexOf(t), 1, i);
            }
        }
        for (const t of e) {
            const i = this.getAssociatedElements(t);
            s.addedResults.push(new ValidationResultTarget(t, i));
            n.set(t, i);
            this.results.push(t);
        }
        for (const t of this.subscribers) {
            t.handleValidationEvent(s);
        }
    }
};

P = __decorate([ __param(0, c), __param(1, E), __param(2, f), __param(3, i) ], P);

class ValidationControllerFactory {
    constructor() {
        this.Type = void 0;
    }
    registerTransformer(t) {
        return false;
    }
    construct(t, i) {
        return t.invoke(P, i);
    }
}

function compareDocumentPositionFlat(t, i) {
    switch (t.compareDocumentPosition(i) & 2) {
      case 0:
        return 0;

      case 2:
        return 1;

      default:
        return -1;
    }
}

const I = `\n<slot></slot>\n<slot name='secondary'>\n  <span repeat.for="error of errors">\n    \${error.result.message}\n  </span>\n</slot>\n`;

const D = {
    name: "validation-container",
    shadowOptions: {
        mode: "open"
    },
    hasSlots: true
};

let $ = class ValidationContainerCustomElement {
    constructor(t, i) {
        this.host = t;
        this.scopedController = i;
        this.errors = [];
    }
    handleValidationEvent(t) {
        for (const {result: i} of t.removedResults) {
            const t = this.errors.findIndex((t => t.result === i));
            if (t !== -1) {
                this.errors.splice(t, 1);
            }
        }
        for (const {result: i, targets: e} of t.addedResults) {
            if (i.valid) {
                continue;
            }
            const t = e.filter((t => this.host.contains(t)));
            if (t.length > 0) {
                this.errors.push(new ValidationResultTarget(i, t));
            }
        }
        this.errors.sort(((t, i) => {
            if (t.targets[0] === i.targets[0]) {
                return 0;
            }
            return compareDocumentPositionFlat(t.targets[0], i.targets[0]);
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

__decorate([ g ], $.prototype, "controller", void 0);

__decorate([ g ], $.prototype, "errors", void 0);

$ = __decorate([ __param(0, v), __param(1, e(M)) ], $);

let j = class ValidationErrorsCustomAttribute {
    constructor(t, i) {
        this.host = t;
        this.scopedController = i;
        this.errors = [];
        this.errorsInternal = [];
    }
    handleValidationEvent(t) {
        for (const {result: i} of t.removedResults) {
            const t = this.errorsInternal.findIndex((t => t.result === i));
            if (t !== -1) {
                this.errorsInternal.splice(t, 1);
            }
        }
        for (const {result: i, targets: e} of t.addedResults) {
            if (i.valid) {
                continue;
            }
            const t = e.filter((t => this.host.contains(t)));
            if (t.length > 0) {
                this.errorsInternal.push(new ValidationResultTarget(i, t));
            }
        }
        this.errorsInternal.sort(((t, i) => {
            if (t.targets[0] === i.targets[0]) {
                return 0;
            }
            return compareDocumentPositionFlat(t.targets[0], i.targets[0]);
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

__decorate([ g ], j.prototype, "controller", void 0);

__decorate([ g({
    primary: true,
    mode: 6
}) ], j.prototype, "errors", void 0);

j = __decorate([ p("validation-errors"), __param(0, v), __param(1, e(M)) ], j);

var A;

(function(t) {
    t["manual"] = "manual";
    t["blur"] = "blur";
    t["focusout"] = "focusout";
    t["change"] = "change";
    t["changeOrBlur"] = "changeOrBlur";
    t["changeOrFocusout"] = "changeOrFocusout";
})(A || (A = {}));

const k = /*@__PURE__*/ t.createInterface("IDefaultTrigger");

const S = new WeakMap;

const O = new WeakMap;

let F = class ValidateBindingBehavior {
    constructor(t, i) {
        this.p = t;
        this.oL = i;
    }
    bind(t, i) {
        if (!(i instanceof b)) {
            throw new Error("Validate behavior used on non property binding");
        }
        let e = S.get(i);
        if (e == null) {
            S.set(i, e = new ValidatitionConnector(this.p, this.oL, i.get(k), i, i.get(s)));
        }
        let n = O.get(i);
        if (n == null) {
            O.set(i, n = new WithValidationTargetSubscriber(e, i, i.get(_)));
        }
        e.start(t);
        i.useTargetSubscriber(n);
    }
    unbind(t, i) {
        S.get(i)?.stop();
    }
};

F.inject = [ f, B ];

F = __decorate([ m("validate") ], F);

class ValidatitionConnector {
    constructor(t, i, e, s, n) {
        this.isChangeTrigger = false;
        this.isDirty = false;
        this.validatedOnce = false;
        this.triggerEvent = null;
        this.task = null;
        this.propertyBinding = s;
        this.target = s.target;
        this.defaultTrigger = e;
        this.p = t;
        this.oL = i;
        this.l = n;
        this.t = new BindingMediator("handleTriggerChange", this, i, n);
        this.i = new BindingMediator("handleControllerChange", this, i, n);
        this.h = new BindingMediator("handleRulesChange", this, i, n);
        if (n.has(M, true)) {
            this.scopedController = n.get(M);
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
        const i = this.V();
        this.C(i);
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
    handleTriggerChange(t, i) {
        this.C(new ValidateArgumentsDelta(void 0, this.R(t), void 0));
    }
    handleControllerChange(t, i) {
        this.C(new ValidateArgumentsDelta(this.B(t), void 0, void 0));
    }
    handleRulesChange(t, i) {
        this.C(new ValidateArgumentsDelta(void 0, void 0, this.T(t)));
    }
    handleValidationEvent(t) {
        if (this.validatedOnce || !this.isChangeTrigger) return;
        const i = this.triggerEvent;
        if (i === null) return;
        const e = this.bindingInfo.propertyInfo?.propertyName;
        if (e === void 0) return;
        this.validatedOnce = t.addedResults.find((t => t.result.propertyName === e)) !== void 0;
    }
    V() {
        const t = this.scope;
        let i;
        let e;
        let s;
        let n = this.propertyBinding.ast;
        while (n.name !== "validate" && n !== void 0) {
            n = n.expression;
        }
        const r = n.args;
        for (let n = 0, o = r.length; n < o; n++) {
            const o = r[n];
            switch (n) {
              case 0:
                e = this.R(y(o, t, this, this.t));
                break;

              case 1:
                s = this.B(y(o, t, this, this.i));
                break;

              case 2:
                i = this.T(y(o, t, this, this.h));
                break;

              default:
                throw new Error(`Unconsumed argument#${n + 1} for validate binding behavior: ${y(o, t, this, null)}`);
            }
        }
        return new ValidateArgumentsDelta(this.B(s), this.R(e), i);
    }
    validateBinding() {
        const t = this.task;
        this.task = this.p.domReadQueue.queueTask((() => this.controller.validateBinding(this.propertyBinding)));
        if (t !== this.task) {
            t?.cancel();
        }
    }
    C(t) {
        const i = t.trigger ?? this.trigger;
        const e = t.controller ?? this.controller;
        const s = t.rules;
        if (this.trigger !== i) {
            let t = this.triggerEvent;
            if (t !== null) {
                this.target.removeEventListener(t, this);
            }
            this.validatedOnce = false;
            this.isDirty = false;
            this.trigger = i;
            this.isChangeTrigger = i === A.change || i === A.changeOrBlur || i === A.changeOrFocusout;
            t = this.triggerEvent = this.M(this.trigger);
            if (t !== null) {
                this.target.addEventListener(t, this);
            }
        }
        if (this.controller !== e || s !== void 0) {
            this.controller?.removeSubscriber(this);
            this.controller?.unregisterBinding(this.propertyBinding);
            this.controller = e;
            e.registerBinding(this.propertyBinding, this.P(s));
            e.addSubscriber(this);
        }
    }
    R(t) {
        if (t === void 0 || t === null) {
            t = this.defaultTrigger;
        } else if (!Object.values(A).includes(t)) {
            throw new Error(`${t} is not a supported validation trigger`);
        }
        return t;
    }
    B(t) {
        if (t === void 0 || t === null) {
            t = this.scopedController;
        } else if (!(t instanceof P)) {
            throw new Error(`${t} is not of type ValidationController`);
        }
        return t;
    }
    T(t) {
        if (Array.isArray(t) && t.every((t => t instanceof h))) {
            return t;
        }
    }
    _() {
        const t = this.propertyBinding.target;
        if (t instanceof this.p.Node) {
            return t;
        } else {
            const i = t?.$controller;
            if (i === void 0) {
                throw new Error("Invalid binding target");
            }
            return i.host;
        }
    }
    M(t) {
        let i = null;
        switch (t) {
          case A.blur:
          case A.changeOrBlur:
            i = "blur";
            break;

          case A.focusout:
          case A.changeOrFocusout:
            i = "focusout";
            break;
        }
        return i;
    }
    P(t) {
        return this.bindingInfo = new BindingInfo(this.target, this.scope, t);
    }
}

ValidatitionConnector.inject = [ f, B, k ];

R()(ValidatitionConnector);

w(true)(ValidatitionConnector);

class WithValidationTargetSubscriber extends V {
    constructor(t, i, e) {
        super(i, e);
        this.I = t;
    }
    handleChange(t, i) {
        super.handleChange(t, i);
        this.I.u();
    }
}

class ValidateArgumentsDelta {
    constructor(t, i, e) {
        this.controller = t;
        this.trigger = i;
        this.rules = e;
    }
}

class BindingMediator {
    constructor(t, i, e, s) {
        this.key = t;
        this.binding = i;
        this.oL = e;
        this.l = s;
    }
    handleChange(t, i) {
        this.binding[this.key](t, i);
    }
}

R()(BindingMediator);

w(true)(BindingMediator);

function getDefaultValidationHtmlConfiguration() {
    return {
        ...u(),
        ValidationControllerFactoryType: ValidationControllerFactory,
        DefaultTrigger: A.focusout,
        UseSubscriberCustomAttribute: true,
        SubscriberCustomElementTemplate: I
    };
}

function createConfiguration(t) {
    return {
        optionsProvider: t,
        register(i) {
            const e = getDefaultValidationHtmlConfiguration();
            t(e);
            i.registerFactory(M, new e.ValidationControllerFactoryType);
            i.register(d.customize((t => {
                for (const i of Object.keys(t)) {
                    if (i in e) {
                        t[i] = e[i];
                    }
                }
            })), n.instance(k, e.DefaultTrigger), F);
            if (e.UseSubscriberCustomAttribute) {
                i.register(j);
            }
            const s = e.SubscriberCustomElementTemplate;
            if (s) {
                i.register(C.define({
                    ...D,
                    template: s
                }, $));
            }
            return i;
        },
        customize(i) {
            return createConfiguration(i ?? t);
        }
    };
}

const x = createConfiguration(r);

const U = "validation-result-id";

const W = "validation-result-container";

const H = /*@__PURE__*/ t.createInterface("IValidationResultPresenterService", (t => t.transient(N)));

let N = class ValidationResultPresenterService {
    constructor(t) {
        this.platform = t;
    }
    handleValidationEvent(t) {
        for (const [i, e] of this.reverseMap(t.removedResults)) {
            this.remove(i, e);
        }
        for (const [i, e] of this.reverseMap(t.addedResults)) {
            this.add(i, e);
        }
    }
    remove(t, i) {
        const e = this.getValidationMessageContainer(t);
        if (e === null) {
            return;
        }
        this.removeResults(e, i);
    }
    add(t, i) {
        const e = this.getValidationMessageContainer(t);
        if (e === null) {
            return;
        }
        this.showResults(e, i);
    }
    getValidationMessageContainer(t) {
        const i = t.parentElement;
        if (i === null) {
            return null;
        }
        let e = i.querySelector(`[${W}]`);
        if (e === null) {
            e = this.platform.document.createElement("div");
            e.setAttribute(W, "");
            i.appendChild(e);
        }
        return e;
    }
    showResults(t, i) {
        t.append(...i.reduce(((t, i) => {
            if (!i.valid) {
                const e = this.platform.document.createElement("span");
                e.setAttribute(U, i.id.toString());
                e.textContent = i.message;
                t.push(e);
            }
            return t;
        }), []));
    }
    removeResults(t, i) {
        for (const e of i) {
            if (!e.valid) {
                t.querySelector(`[${U}="${e.id}"]`)?.remove();
            }
        }
    }
    reverseMap(t) {
        const i = new Map;
        for (const {result: e, targets: s} of t) {
            for (const t of s) {
                let s = i.get(t);
                if (s === void 0) {
                    i.set(t, s = []);
                }
                s.push(e);
            }
        }
        return i;
    }
};

N = __decorate([ __param(0, f) ], N);

export { BindingInfo, BindingMediator, ControllerValidateResult, k as IDefaultTrigger, M as IValidationController, H as IValidationResultPresenterService, F as ValidateBindingBehavior, T as ValidateEventKind, $ as ValidationContainerCustomElement, P as ValidationController, ValidationControllerFactory, j as ValidationErrorsCustomAttribute, ValidationEvent, x as ValidationHtmlConfiguration, N as ValidationResultPresenterService, ValidationResultTarget, A as ValidationTrigger, D as defaultContainerDefinition, I as defaultContainerTemplate, getDefaultValidationHtmlConfiguration, getPropertyInfo };

