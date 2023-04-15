import { DI as t, Registration as i, optional as s, all as n, ILogger as e, camelCase as h } from "../kernel/dist/native-modules/index.mjs";

import { mixinAstEvaluator as r, mixingBindingLimited as c, bindingBehavior as o, attributePattern as a, bindingCommand as u, renderer as l, AttrSyntax as f, lifecycleHooks as d, CustomElement as g, CustomAttribute as p, ILifecycleHooks as S } from "../runtime-html/dist/native-modules/index.mjs";

import { Scope as b, connectable as B, astEvaluate as m, astBind as v, astUnbind as w } from "../runtime/dist/native-modules/index.mjs";

const y = t.createInterface("IActionHandler");

const I = t.createInterface("IStore");

const D = t.createInterface("IState");

const P = "__au_ah__";

const C = Object.freeze({
    define(t) {
        function s(i, s) {
            return t(i, s);
        }
        s[P] = true;
        s.register = function(s) {
            i.instance(y, t).register(s);
        };
        return s;
    },
    isType: t => "function" === typeof t && P in t
});

class Store {
    static register(t) {
        i.singleton(I, this).register(t);
    }
    constructor(t, i, s) {
        this.t = new Set;
        this.i = 0;
        this.h = [];
        this._state = t ?? new State;
        this.u = i;
        this.B = s;
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
    dispatch(t) {
        if (this.i > 0) {
            this.h.push(t);
            return;
        }
        this.i++;
        let i;
        const s = (t, i) => this.u.reduce(((t, s) => {
            if (t instanceof Promise) return t.then((t => s(t, i)));
            return s(t, i);
        }), t);
        const n = t => {
            if (this.h.length > 0) {
                i = this.h.shift();
                const e = s(t, i);
                if (e instanceof Promise) return e.then((t => n(t))); else return n(e);
            }
        };
        const e = s(this._state, t);
        if (e instanceof Promise) return e.then((t => {
            this.I(t);
            this.i--;
            return n(this._state);
        }), (t => {
            this.i--;
            throw t;
        })); else {
            this.I(e);
            this.i--;
            return n(this._state);
        }
    }
}

Store.inject = [ s(D), n(y), e ];

class State {}

function R(t, i, s, n) {
    var e = arguments.length, h = e < 3 ? i : null === n ? n = Object.getOwnPropertyDescriptor(i, s) : n, r;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) h = Reflect.decorate(t, i, s, n); else for (var c = t.length - 1; c >= 0; c--) if (r = t[c]) h = (e < 3 ? r(h) : e > 3 ? r(i, s, h) : r(i, s)) || h;
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
    constructor(t, i, s, n, e, h, r, c) {
        this.isBound = false;
        this.P = null;
        this.v = void 0;
        this.C = void 0;
        this.R = 0;
        this.boundFn = false;
        this.mode = 2;
        this.T = t;
        this.l = i;
        this._ = n;
        this.A = c;
        this.oL = s;
        this.ast = e;
        this.target = h;
        this.targetProperty = r;
    }
    updateTarget(t) {
        const i = this.j;
        const s = this.target;
        const n = this.targetProperty;
        const e = this.R++;
        const h = () => e === this.R - 1;
        this.O();
        if (A(t)) {
            this.C = t.subscribe((t => {
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
        this.A.subscribe(this);
        this.updateTarget(this.v = m(this.ast, this.s = T(this.A.getState(), t), this, this.mode > 1 ? this : null));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.O();
        this.R++;
        this.s = void 0;
        this.P?.cancel();
        this.P = null;
        this.A.unsubscribe(this);
    }
    handleChange(t) {
        if (!this.isBound) return;
        const i = 1 !== this.T.state && (4 & this.j.type) > 0;
        const s = this.obs;
        s.version++;
        t = m(this.ast, this.s, this, this);
        s.clear();
        let n;
        if (i) {
            n = this.P;
            this.P = this._.queueTask((() => {
                this.updateTarget(t);
                this.P = null;
            }), j);
            n?.cancel();
            n = null;
        } else this.updateTarget(t);
    }
    handleStateChange() {
        if (!this.isBound) return;
        const t = this.A.getState();
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const n = m(this.ast, i, this, this.mode > 1 ? this : null);
        const e = 1 !== this.T.state && (4 & this.j.type) > 0;
        if (n === this.v) return;
        this.v = n;
        let h = null;
        if (e) {
            h = this.P;
            this.P = this._.queueTask((() => {
                this.updateTarget(n);
                this.P = null;
            }), j);
            h?.cancel();
        } else this.updateTarget(this.v);
    }
    O() {
        if ("function" === typeof this.C) this.C(); else if (void 0 !== this.C) {
            this.C.dispose?.();
            this.C.unsubscribe?.();
        }
        this.C = void 0;
    }
}

function A(t) {
    return t instanceof Object && "subscribe" in t;
}

const j = {
    reusable: false,
    preempt: true
};

B(StateBinding);

r(true)(StateBinding);

c(StateBinding, (() => "updateTarget"));

const O = new WeakMap;

let k = class StateBindingBehavior {
    constructor(t) {
        this.A = t;
    }
    bind(t, i) {
        const s = i instanceof StateBinding;
        t = s ? t : T(this.A.getState(), t);
        let n;
        if (!s) {
            n = O.get(i);
            if (null == n) O.set(i, n = new StateSubscriber(i, t)); else n.H = t;
            this.A.subscribe(n);
            i.useScope?.(t);
        }
    }
    unbind(t, i) {
        const s = i instanceof StateBinding;
        if (!s) {
            this.A.unsubscribe(O.get(i));
            O.delete(i);
        }
    }
};

k.inject = [ I ];

k = R([ o("state") ], k);

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
        this.A = e;
        this.ast = i;
        this.G = s;
        this.M = n;
    }
    callSource(t) {
        const i = this.s;
        i.overrideContext.$event = t;
        const s = m(this.ast, i, this, null);
        delete i.overrideContext.$event;
        void this.A.dispatch(s);
    }
    handleEvent(t) {
        this.callSource(t);
    }
    bind(t) {
        if (this.isBound) return;
        v(this.ast, t, this);
        this.s = T(this.A.getState(), t);
        this.G.addEventListener(this.M, this);
        this.A.subscribe(this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        w(this.ast, this.s, this);
        this.s = void 0;
        this.G.removeEventListener(this.M, this);
        this.A.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = t;
    }
}

B(StateDispatchBinding);

r(true)(StateDispatchBinding);

c(StateDispatchBinding, (() => "callSource"));

let H = class StateAttributePattern {
    "PART.state"(t, i, s) {
        return new f(t, i, s[0], "state");
    }
};

H = R([ a({
    pattern: "PART.state",
    symbols: "."
}) ], H);

let E = class DispatchAttributePattern {
    "PART.dispatch"(t, i, s) {
        return new f(t, i, s[0], "dispatch");
    }
};

E = R([ a({
    pattern: "PART.dispatch",
    symbols: "."
}) ], E);

let x = class StateBindingCommand {
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

x = R([ u("state") ], x);

let L = class DispatchBindingCommand {
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

L = R([ u("dispatch") ], L);

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
        this.W = t;
    }
    render(t, i, s, n, e, h) {
        t.addBinding(new StateBinding(t, t.container, h, n.domWriteQueue, W(e, s.from, 8), i, s.to, this.W));
    }
};

G.inject = [ I ];

G = R([ l("sb") ], G);

let M = class DispatchBindingInstructionRenderer {
    constructor(t) {
        this.W = t;
    }
    render(t, i, s, n, e) {
        const h = W(e, s.ast, 16);
        t.addBinding(new StateDispatchBinding(t.container, h, i, s.from, this.W));
    }
};

M.inject = [ I ];

M = R([ l("sd") ], M);

function W(t, i, s) {
    if ("string" === typeof i) return t.parse(i, s);
    return i;
}

const q = [ H, x, G, E, L, M, k, Store ];

const z = (t, s) => ({
    register: n => {
        n.register(i.instance(D, t), ...q, ...s.map(C.define));
    },
    init: (t, ...i) => z(t, i)
});

const F = z({}, []);

let J = class StateGetterBinding {
    constructor(t, i, s, n) {
        this.isBound = false;
        this.v = void 0;
        this.C = void 0;
        this.R = 0;
        this.A = s;
        this.$get = n;
        this.target = t;
        this.key = i;
    }
    updateTarget(t) {
        const i = this.target;
        const s = this.key;
        const n = this.R++;
        const e = () => n === this.R - 1;
        this.O();
        if (_(t)) {
            this.C = t.subscribe((t => {
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
        const i = this.A.getState();
        this.s = T(i, t);
        this.A.subscribe(this);
        this.updateTarget(this.v = this.$get(i));
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.O();
        this.R++;
        this.s = void 0;
        this.A.unsubscribe(this);
    }
    handleStateChange(t) {
        const i = this.s;
        const s = i.overrideContext;
        i.bindingContext = s.bindingContext = s.$state = t;
        const n = this.$get(this.A.getState());
        if (n === this.v) return;
        this.v = n;
        this.updateTarget(n);
    }
    O() {
        if ("function" === typeof this.C) this.C(); else if (void 0 !== this.C) {
            this.C.dispose?.();
            this.C.unsubscribe?.();
        }
        this.C = void 0;
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
        i.addBinding(new J(t, this.key, s.get(I), this.$get));
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
        i.addBinding(new J(t, this.key, s.get(I), this.$get));
    }
};

U = R([ d() ], U);

export { C as ActionHandler, E as DispatchAttributePattern, L as DispatchBindingCommand, DispatchBindingInstruction, M as DispatchBindingInstructionRenderer, y as IActionHandler, D as IState, I as IStore, H as StateAttributePattern, StateBinding, k as StateBindingBehavior, x as StateBindingCommand, StateBindingInstruction, G as StateBindingInstructionRenderer, F as StateDefaultConfiguration, StateDispatchBinding, K as fromState };

