import { DI as t, Registration as i, optional as s, all as n, ILogger as e, camelCase as h } from "@aurelia/kernel";

import { mixinAstEvaluator as r, mixingBindingLimited as o, bindingBehavior as c, attributePattern as a, bindingCommand as u, renderer as l, AttrSyntax as f, lifecycleHooks as d, CustomElement as g, CustomAttribute as p, ILifecycleHooks as S } from "@aurelia/runtime-html";

import { Scope as b, connectable as B, astEvaluate as m, astBind as v, astUnbind as y, IExpressionParser as w } from "@aurelia/runtime";

const I = t.createInterface("IActionHandler");

const D = t.createInterface("IStore");

const P = t.createInterface("IState");

const A = "__au_ah__";

const C = Object.freeze({
    define(t) {
        function s(i, s, ...n) {
            return t(i, s, ...n);
        }
        s[A] = true;
        s.register = function(s) {
            i.instance(I, t).register(s);
        };
        return s;
    },
    isType: t => "function" === typeof t && A in t
});

class Store {
    constructor(t, i, s) {
        this.t = new Set;
        this.i = 0;
        this.h = [];
        this._state = t ?? new State;
        this.u = i;
        this.B = s;
    }
    static register(t) {
        i.singleton(D, this).register(t);
    }
    subscribe(t) {
        this.t.add(t);
    }
    unsubscribe(t) {
        this.t.delete(t);
    }
    I(t) {
        const i = this._state;
        this._state = t;
        this.t.forEach((s => s.handleStateChange(t, i)));
    }
    getState() {
        return this._state;
    }
    dispatch(t, ...i) {
        if (this.i > 0) {
            this.h.push({
                type: t,
                params: i
            });
            return;
        }
        this.i++;
        let s;
        const n = (t, i, s) => this.u.reduce(((t, n) => {
            if (t instanceof Promise) return t.then((t => n(t, i, ...s ?? [])));
            return n(t, i, ...s ?? []);
        }), t);
        const e = t => {
            if (this.h.length > 0) {
                s = this.h.shift();
                const i = n(t, s.type, s.params);
                if (i instanceof Promise) return i.then((t => e(t))); else return e(i);
            }
        };
        const h = n(this._state, t, i);
        if (h instanceof Promise) return h.then((t => {
            this.I(t);
            this.i--;
            return e(this._state);
        }), (t => {
            this.i--;
            throw t;
        })); else {
            this.I(h);
            this.i--;
            return e(this._state);
        }
    }
}

Store.inject = [ s(P), n(I), e ];

class State {}

function R(t, i, s, n) {
    var e = arguments.length, h = e < 3 ? i : null === n ? n = Object.getOwnPropertyDescriptor(i, s) : n, r;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) h = Reflect.decorate(t, i, s, n); else for (var o = t.length - 1; o >= 0; o--) if (r = t[o]) h = (e < 3 ? r(h) : e > 3 ? r(i, s, h) : r(i, s)) || h;
    return e > 3 && h && Object.defineProperty(i, s, h), h;
}

function T(t, i) {
    const s = {
        bindingContext: t
    };
    const n = b.create(t, s, true);
    n.parent = i;
    return n;
}

function _(t) {
    return t instanceof Object && "subscribe" in t;
}

class StateBinding {
    constructor(t, i, s, n, e, h, r, o) {
        this.isBound = false;
        this.P = null;
        this.v = void 0;
        this.A = void 0;
        this.C = 0;
        this.boundFn = false;
        this.mode = 2;
        this.R = t;
        this.l = i;
        this.T = n;
        this._ = o;
        this.oL = s;
        this.ast = e;
        this.target = h;
        this.targetProperty = r;
    }
    updateTarget(t) {
        const i = this.j;
        const s = this.target;
        const n = this.targetProperty;
        const e = this.C++;
        const h = () => e === this.C - 1;
        this.O();
        if (j(t)) {
            this.A = t.subscribe((t => {
                if (h()) i.setValue(t, s, n);
            }));
            return;
        }
        if (t instanceof Promise) {
            void t.then((t => {
                if (h()) i.setValue(t, s, n);
            }), (() => {}));
            return;
        }
        i.setValue(t, s, n);
    }
    bind(t) {
        if (this.isBound) return;
        this.j = this.oL.getAccessor(this.target, this.targetProperty);
        this._.subscribe(this);
        this.updateTarget(this.v = m(this.ast, this.s = T(this._.getState(), t), this, this.mode > 1 ? this : null));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.O();
        this.C++;
        this.s = void 0;
        this.P?.cancel();
        this.P = null;
        this._.unsubscribe(this);
    }
    handleChange(t) {
        if (!this.isBound) return;
        const i = 1 !== this.R.state && (4 & this.j.type) > 0;
        const s = this.obs;
        s.version++;
        t = m(this.ast, this.s, this, this);
        s.clear();
        let n;
        if (i) {
            n = this.P;
            this.P = this.T.queueTask((() => {
                this.updateTarget(t);
                this.P = null;
            }), O);
            n?.cancel();
            n = null;
        } else this.updateTarget(t);
    }
    handleStateChange() {
        if (!this.isBound) return;
        const t = this._.getState();
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const n = m(this.ast, i, this, this.mode > 1 ? this : null);
        const e = 1 !== this.R.state && (4 & this.j.type) > 0;
        if (n === this.v) return;
        this.v = n;
        let h = null;
        if (e) {
            h = this.P;
            this.P = this.T.queueTask((() => {
                this.updateTarget(n);
                this.P = null;
            }), O);
            h?.cancel();
        } else this.updateTarget(this.v);
    }
    O() {
        if ("function" === typeof this.A) this.A(); else if (void 0 !== this.A) {
            this.A.dispose?.();
            this.A.unsubscribe?.();
        }
        this.A = void 0;
    }
}

function j(t) {
    return t instanceof Object && "subscribe" in t;
}

const O = {
    reusable: false,
    preempt: true
};

B(StateBinding);

r(true)(StateBinding);

o(StateBinding, (() => "updateTarget"));

const k = new WeakMap;

let E = class StateBindingBehavior {
    constructor(t) {
        this._ = t;
    }
    bind(t, i) {
        const s = i instanceof StateBinding;
        t = s ? t : T(this._.getState(), t);
        let n;
        if (!s) {
            n = k.get(i);
            if (null == n) k.set(i, n = new StateSubscriber(i, t)); else n.H = t;
            this._.subscribe(n);
            i.useScope(t);
        }
    }
    unbind(t, i) {
        const s = i instanceof StateBinding;
        if (!s) {
            this._.unsubscribe(k.get(i));
            k.delete(i);
        }
    }
};

E.inject = [ D ];

E = R([ c("state") ], E);

class StateSubscriber {
    constructor(t, i) {
        this.L = t;
        this.H = i;
    }
    handleStateChange(t) {
        const i = this.H;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        this.L.handleChange?.(void 0, void 0);
    }
}

class StateDispatchBinding {
    constructor(t, i, s, n, e) {
        this.isBound = false;
        this.boundFn = false;
        this.l = t;
        this._ = e;
        this.ast = i;
        this.$ = s;
        this.G = n;
    }
    callSource(t) {
        const i = this.s;
        i.overrideContext.$event = t;
        const s = m(this.ast, i, this, null);
        delete i.overrideContext.$event;
        if (!this.isAction(s)) throw new Error(`Invalid dispatch value from expression on ${this.$} on event: "${t.type}"`);
        void this._.dispatch(s.type, ...s.params instanceof Array ? s.params : []);
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) return;
        v(this.ast, t, this);
        this.s = T(this._.getState(), t);
        this.$.addEventListener(this.G, this);
        this._.subscribe(this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        y(this.ast, this.s, this);
        this.s = void 0;
        this.$.removeEventListener(this.G, this);
        this._.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = t;
    }
    isAction(t) {
        return null != t && "object" === typeof t && "type" in t;
    }
}

B(StateDispatchBinding);

r(true)(StateDispatchBinding);

o(StateDispatchBinding, (() => "callSource"));

let H = class StateAttributePattern {
    "PART.state"(t, i, s) {
        return new f(t, i, s[0], "state");
    }
};

H = R([ a({
    pattern: "PART.state",
    symbols: "."
}) ], H);

let x = class DispatchAttributePattern {
    "PART.dispatch"(t, i, s) {
        return new f(t, i, s[0], "dispatch");
    }
};

x = R([ a({
    pattern: "PART.dispatch",
    symbols: "."
}) ], x);

let L = class StateBindingCommand {
    get type() {
        return 0;
    }
    get name() {
        return "state";
    }
    build(t, i, s) {
        const n = t.attr;
        let e = n.target;
        let r = n.rawValue;
        if (null == t.bindable) e = s.map(t.node, e) ?? h(e); else {
            if ("" === r && 1 === t.def.type) r = h(e);
            e = t.bindable.property;
        }
        return new StateBindingInstruction(r, e);
    }
};

L = R([ u("state") ], L);

let $ = class DispatchBindingCommand {
    get type() {
        return 1;
    }
    get name() {
        return "dispatch";
    }
    build(t) {
        const i = t.attr;
        return new DispatchBindingInstruction(i.target, i.rawValue);
    }
};

$ = R([ u("dispatch") ], $);

class StateBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
        this.type = "sb";
    }
}

class DispatchBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.ast = i;
        this.type = "sd";
    }
}

let G = class StateBindingInstructionRenderer {
    constructor(t) {
        this.M = t;
    }
    render(t, i, s, n, e, h) {
        t.addBinding(new StateBinding(t, t.container, h, n.domWriteQueue, W(e, s.from, 8), i, s.to, this.M));
    }
};

G.inject = [ D ];

G = R([ l("sb") ], G);

let M = class DispatchBindingInstructionRenderer {
    constructor(t, i) {
        this.ep = t;
        this.M = i;
    }
    render(t, i, s) {
        const n = W(this.ep, s.ast, 16);
        t.addBinding(new StateDispatchBinding(t.container, n, i, s.from, this.M));
    }
};

M.inject = [ w, D ];

M = R([ l("sd") ], M);

function W(t, i, s) {
    if ("string" === typeof i) return t.parse(i, s);
    return i;
}

const q = [ H, L, G, x, $, M, E, Store ];

const z = (t, s) => ({
    register: n => {
        n.register(i.instance(P, t), ...q, ...s.map(C.define));
    },
    init: (t, ...i) => z(t, i)
});

const F = z({}, []);

let J = class StateGetterBinding {
    constructor(t, i, s, n) {
        this.isBound = false;
        this.v = void 0;
        this.A = void 0;
        this.C = 0;
        this._ = s;
        this.$get = n;
        this.target = t;
        this.key = i;
    }
    updateTarget(t) {
        const i = this.target;
        const s = this.key;
        const n = this.C++;
        const e = () => n === this.C - 1;
        this.O();
        if (_(t)) {
            this.A = t.subscribe((t => {
                if (e()) i[s] = t;
            }));
            return;
        }
        if (t instanceof Promise) {
            void t.then((t => {
                if (e()) i[s] = t;
            }), (() => {}));
            return;
        }
        i[s] = t;
    }
    bind(t) {
        if (this.isBound) return;
        const i = this._.getState();
        this.s = T(i, t);
        this._.subscribe(this);
        this.updateTarget(this.v = this.$get(i));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.O();
        this.C++;
        this.s = void 0;
        this._.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const n = this.$get(this._.getState());
        if (n === this.v) return;
        this.v = n;
        this.updateTarget(n);
    }
    O() {
        if ("function" === typeof this.A) this.A(); else if (void 0 !== this.A) {
            this.A.dispose?.();
            this.A.unsubscribe?.();
        }
        this.A = void 0;
    }
};

J = R([ B() ], J);

function K(t) {
    return function(i, s, n) {
        if ("function" === typeof i) throw new Error(`Invalid usage. @state can only be used on a field`);
        if ("undefined" !== typeof n?.value) throw new Error(`Invalid usage. @state can only be used on a field`);
        i = i.constructor;
        let e = g.getAnnotation(i, N);
        if (null == e) g.annotate(i, N, e = []);
        e.push(new Q(t, s));
        e = p.getAnnotation(i, N);
        if (null == e) g.annotate(i, N, e = []);
        e.push(new U(t, s));
    };
}

const N = "dependencies";

let Q = class HydratingLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(S, this).register(t);
    }
    hydrating(t, i) {
        const s = i.container;
        i.addBinding(new J(t, this.key, s.get(D), this.$get));
    }
};

Q = R([ d() ], Q);

let U = class CreatedLifecycleHooks {
    constructor(t, i) {
        this.$get = t;
        this.key = i;
    }
    register(t) {
        i.instance(S, this).register(t);
    }
    created(t, i) {
        const s = i.container;
        i.addBinding(new J(t, this.key, s.get(D), this.$get));
    }
};

U = R([ d() ], U);

export { C as ActionHandler, x as DispatchAttributePattern, $ as DispatchBindingCommand, DispatchBindingInstruction, M as DispatchBindingInstructionRenderer, I as IActionHandler, P as IState, D as IStore, H as StateAttributePattern, StateBinding, E as StateBindingBehavior, L as StateBindingCommand, StateBindingInstruction, G as StateBindingInstructionRenderer, F as StateDefaultConfiguration, StateDispatchBinding, K as fromState };
//# sourceMappingURL=index.mjs.map
