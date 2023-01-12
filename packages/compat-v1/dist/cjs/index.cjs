"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/runtime");

var e = require("@aurelia/runtime-html");

var i = require("@aurelia/kernel");

let s = false;

function n() {
    if (s) return;
    s = true;
    const e = (t, e, i) => Object.defineProperty(t.prototype, e, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: i
    });
    [ t.BindingBehaviorExpression, t.ValueConverterExpression, t.AssignExpression, t.ConditionalExpression, t.AccessThisExpression, t.AccessScopeExpression, t.AccessMemberExpression, t.AccessKeyedExpression, t.CallScopeExpression, t.CallMemberExpression, t.CallFunctionExpression, t.BinaryExpression, t.UnaryExpression, t.PrimitiveLiteralExpression, t.ArrayLiteralExpression, t.ObjectLiteralExpression, t.TemplateExpression, t.TaggedTemplateExpression, t.ArrayBindingPattern, t.ObjectBindingPattern, t.BindingIdentifier, t.ForOfStatement, t.Interpolation, t.DestructuringAssignmentExpression, t.DestructuringAssignmentSingleExpression, t.DestructuringAssignmentRestExpression, t.ArrowFunction ].forEach((i => {
        e(i, "evaluate", (function(...e) {
            return t.astEvaluate(this, ...e);
        }));
        e(i, "assign", (function(...e) {
            return t.astAssign(this, ...e);
        }));
        e(i, "accept", (function(...e) {
            return t.astVisit(this, ...e);
        }));
        e(i, "bind", (function(...e) {
            return t.astBind(this, ...e);
        }));
        e(i, "unbind", (function(...e) {
            return t.astUnbind(this, ...e);
        }));
        console.warn('"evaluate"/"assign"/"accept"/"visit"/"bind"/"unbind" are only valid on AST with $kind Custom.' + " Or import and use astEvaluate/astAssign/astVisit/astBind/astUnbind accordingly.");
    }));
}

function r(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, i) : s, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, i, s); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (n < 3 ? o(r) : n > 3 ? o(e, i, r) : o(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

const o = () => Object.create(null);

const l = t => "function" === typeof t;

const h = t => "string" === typeof t;

const c = (t, e, i) => {
    if (h(e)) return t.parse(e, i);
    return e;
};

const u = Symbol(".call");

const a = {
    register(t) {
        if (!t[u]) {
            t[u] = true;
            t.register(exports.CallBindingCommand, exports.CallBindingRenderer);
        }
    }
};

const d = "rh";

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
        this.type = d;
    }
}

exports.CallBindingCommand = class CallBindingCommand {
    get type() {
        return 0;
    }
    build(t, e) {
        const s = null === t.bindable ? i.camelCase(t.attr.target) : t.bindable.property;
        return new CallBindingInstruction(e.parse(t.attr.rawValue, 16 | 8), s);
    }
};

exports.CallBindingCommand = r([ e.bindingCommand("call") ], exports.CallBindingCommand);

exports.CallBindingRenderer = class CallBindingRenderer {
    render(t, e, i, s, n, r) {
        const o = c(n, i.from, 16 | 8);
        t.addBinding(new CallBinding(t.container, r, o, g(e), i.to));
    }
};

exports.CallBindingRenderer = r([ e.renderer(d) ], exports.CallBindingRenderer);

function g(t) {
    if (null != t.viewModel) return t.viewModel;
    return t;
}

class CallBinding {
    constructor(t, e, i, s, n) {
        this.ast = i;
        this.target = s;
        this.targetProperty = n;
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this.targetObserver = e.getAccessor(s, n);
    }
    callSource(e) {
        const i = this.s.overrideContext;
        i.$event = e;
        const s = t.astEvaluate(this.ast, this.s, this, null);
        Reflect.deleteProperty(i, "$event");
        return s;
    }
    bind(e) {
        if (this.isBound) {
            if (this.s === e) return;
            this.unbind();
        }
        this.s = e;
        t.astBind(this.ast, e, this);
        this.targetObserver.setValue((t => this.callSource(t)), this.target, this.targetProperty);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        t.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.targetObserver.setValue(null, this.target, this.targetProperty);
    }
}

e.mixinUseScope(CallBinding);

e.mixingBindingLimited(CallBinding, (() => "callSource"));

e.mixinAstEvaluator(true)(CallBinding);

const f = Symbol(".delegate");

const p = {
    register(t) {
        if (!t[f]) {
            t[f] = true;
            t.register(v, exports.DelegateBindingCommand, exports.ListenerBindingRenderer);
        }
    }
};

const b = "dl";

exports.DelegateBindingCommand = class DelegateBindingCommand {
    get type() {
        return 1;
    }
    build(t, e) {
        return new DelegateBindingInstruction(e.parse(t.attr.rawValue, 8), t.attr.target, false);
    }
};

exports.DelegateBindingCommand = r([ e.bindingCommand("delegate") ], exports.DelegateBindingCommand);

exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    constructor(t) {
        this.t = t;
    }
    static get inject() {
        return [ v ];
    }
    render(t, e, i, s, n) {
        const r = c(n, i.from, 8);
        t.addBinding(new DelegateListenerBinding(t.container, r, e, i.to, this.t, new DelegateListenerOptions(i.preventDefault)));
    }
};

exports.ListenerBindingRenderer = r([ e.renderer(b) ], exports.ListenerBindingRenderer);

class DelegateBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.type = "hb";
    }
}

class DelegateListenerOptions {
    constructor(t) {
        this.prevent = t;
    }
}

class DelegateListenerBinding {
    constructor(t, e, i, s, n, r) {
        this.ast = e;
        this.target = i;
        this.targetEvent = s;
        this.eventDelegator = n;
        this.isBound = false;
        this.handler = null;
        this.boundFn = true;
        this.l = t;
        this.i = r;
    }
    callSource(e) {
        const i = this.s.overrideContext;
        i.$event = e;
        let s = t.astEvaluate(this.ast, this.s, this, null);
        delete i.$event;
        if (l(s)) s = s(e);
        if (true !== s && this.i.prevent) e.preventDefault();
        return s;
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(i) {
        if (this.isBound) {
            if (this.s === i) return;
            this.unbind();
        }
        this.s = i;
        t.astBind(this.ast, i, this);
        this.handler = this.eventDelegator.addEventListener(this.l.get(e.IEventTarget), this.target, this.targetEvent, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        t.astUnbind(this.ast, this.s, this);
        this.s = void 0;
        this.handler.dispose();
        this.handler = null;
    }
}

e.mixinUseScope(DelegateListenerBinding);

e.mixingBindingLimited(DelegateListenerBinding, (() => "callSource"));

e.mixinAstEvaluator(true, true)(DelegateListenerBinding);

const x = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = x) {
        this.h = t;
        this.u = e;
        this.i = i;
        this.B = 0;
        this.L = new Map;
        this.C = new Map;
    }
    O() {
        if (1 === ++this.B) this.h.addEventListener(this.u, this, this.i);
    }
    I() {
        if (0 === --this.B) this.h.removeEventListener(this.u, this, this.i);
    }
    dispose() {
        if (this.B > 0) {
            this.B = 0;
            this.h.removeEventListener(this.u, this, this.i);
        }
        this.L.clear();
        this.C.clear();
    }
    j(t) {
        const e = true === this.i.capture ? this.L : this.C;
        let i = e.get(t);
        if (void 0 === i) e.set(t, i = o());
        return i;
    }
    handleEvent(t) {
        const e = true === this.i.capture ? this.L : this.C;
        const i = t.composedPath();
        if (true === this.i.capture) i.reverse();
        for (const s of i) {
            const i = e.get(s);
            if (void 0 === i) continue;
            const n = i[this.u];
            if (void 0 === n) continue;
            if (l(n)) n(t); else n.handleEvent(t);
            if (true === t.cancelBubble) return;
        }
    }
}

class DelegateSubscription {
    constructor(t, e, i, s) {
        this.R = t;
        this._ = e;
        this.u = i;
        t.O();
        e[i] = s;
    }
    dispose() {
        this.R.I();
        this._[this.u] = void 0;
    }
}

const v = i.DI.createInterface("IEventDelegator", (t => t.cachedCallback((t => {
    const i = t.invoke(EventDelegator);
    t.register(e.AppTask.deactivating((() => i.dispose())));
    return i;
}))));

class EventDelegator {
    constructor() {
        this.M = o();
    }
    addEventListener(t, e, i, s, n) {
        var r;
        const o = (r = this.M)[i] ?? (r[i] = new Map);
        let l = o.get(t);
        if (void 0 === l) o.set(t, l = new ListenerTracker(t, i, n));
        return new DelegateSubscription(l, l.j(e), i, s);
    }
    dispose() {
        for (const t in this.M) {
            const e = this.M[t];
            for (const t of e.values()) t.dispose();
            e.clear();
        }
    }
}

let B = false;

const D = () => {
    if (B) return;
    B = true;
    [ [ e.PropertyBinding, "Property binding" ], [ e.AttributeBinding, "Attribute binding" ], [ e.ListenerBinding, "Listener binding" ], [ CallBinding, "Call binding" ], [ e.LetBinding, "Let binding" ], [ e.InterpolationPartBinding, "Interpolation binding" ], [ e.ContentBinding, "Text binding" ], [ e.RefBinding, "Ref binding" ], [ DelegateListenerBinding, "Delegate Listener binding" ] ].forEach((([e, i]) => {
        Object.defineProperty(e.prototype, "sourceExpression", {
            configurable: true,
            enumerable: false,
            writable: true,
            get() {
                console.warn(`@deprecated "sourceExpression" property for expression on ${i}. It has been renamed to "ast". expression: "${t.Unparser.unparse(this.ast)}"`);
                return this.ast;
            }
        });
    }));
};

const m = e.AppTask.creating(e.IEventTarget, (t => {
    t.addEventListener("submit", (t => {
        const e = t.target;
        const i = e.action;
        if ("form" === e.tagName.toLowerCase() && !i) t.preventDefault();
    }), false);
}));

const L = {
    register(t) {
        n();
        D();
        t.register(m);
        p.register(t);
        a.register(t);
    }
};

exports.CallBinding = CallBinding;

exports.CallBindingInstruction = CallBindingInstruction;

exports.DelegateBindingInstruction = DelegateBindingInstruction;

exports.DelegateListenerBinding = DelegateListenerBinding;

exports.DelegateListenerOptions = DelegateListenerOptions;

exports.EventDelegator = EventDelegator;

exports.IEventDelegator = v;

exports.PreventFormActionlessSubmit = m;

exports.callSyntax = a;

exports.compatRegistration = L;

exports.delegateSyntax = p;
//# sourceMappingURL=index.cjs.map
