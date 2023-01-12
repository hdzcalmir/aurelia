import { DI as t, Registration as e, IContainer as i, onResolve as s, InstanceProvider as o, resolveAll as n, noop as r } from "@aurelia/kernel";

import { IPlatform as l, IEventTarget as c, INode as a, Controller as u, CustomElementDefinition as h, CustomElement as g, AppTask as D } from "@aurelia/runtime-html";

const f = t.createInterface;

const m = e.singleton;

const d = e.instance;

const p = e.callback;

const v = f("IDialogService");

const w = f("IDialogController");

const R = f("IDialogDomRenderer");

const C = f("IDialogDom");

const E = f("IDialogGlobalSettings");

class DialogOpenResult {
    constructor(t, e) {
        this.wasCancelled = t;
        this.dialog = e;
    }
    static create(t, e) {
        return new DialogOpenResult(t, e);
    }
}

class DialogCloseResult {
    constructor(t, e) {
        this.status = t;
        this.value = e;
    }
    static create(t, e) {
        return new DialogCloseResult(t, e);
    }
}

var b;

(function(t) {
    t["Ok"] = "ok";
    t["Error"] = "error";
    t["Cancel"] = "cancel";
    t["Abort"] = "abort";
})(b || (b = {}));

const S = t => new Error(t);

const j = t => t instanceof Promise;

const y = t => "function" === typeof t;

class DialogController {
    constructor(t, e) {
        this.p = t;
        this.ctn = e;
        this.closed = new Promise(((t, e) => {
            this.t = t;
            this.i = e;
        }));
    }
    static get inject() {
        return [ l, i ];
    }
    activate(t) {
        const e = this.ctn.createChild();
        const {model: i, template: o, rejectOnCancel: n} = t;
        const r = e.get(R);
        const l = t.host ?? this.p.document.body;
        const D = this.dom = r.render(l, t);
        const f = e.has(c, true) ? e.get(c) : null;
        const m = D.contentHost;
        this.settings = t;
        if (null == f || !f.contains(l)) e.register(d(c, l));
        e.register(d(a, m), d(C, D));
        return new Promise((s => {
            const o = Object.assign(this.cmp = this.getOrCreateVm(e, t, m), {
                $dialog: this
            });
            s(o.canActivate?.(i) ?? true);
        })).then((r => {
            if (true !== r) {
                D.dispose();
                if (n) throw O(null, "Dialog activation rejected");
                return DialogOpenResult.create(true, this);
            }
            const l = this.cmp;
            return s(l.activate?.(i), (() => {
                const i = this.controller = u.$el(e, l, m, null, h.create(this.getDefinition(l) ?? {
                    name: g.generateName(),
                    template: o
                }));
                return s(i.activate(i, null, 1), (() => {
                    D.overlay.addEventListener(t.mouseEvent ?? "click", this);
                    return DialogOpenResult.create(false, this);
                }));
            }));
        }), (t => {
            D.dispose();
            throw t;
        }));
    }
    deactivate(t, e) {
        if (this.u) return this.u;
        let i = true;
        const {controller: o, dom: n, cmp: r, settings: {mouseEvent: l, rejectOnCancel: c}} = this;
        const a = DialogCloseResult.create(t, e);
        const u = new Promise((u => {
            u(s(r.canDeactivate?.(a) ?? true, (u => {
                if (true !== u) {
                    i = false;
                    this.u = void 0;
                    if (c) throw O(null, "Dialog cancellation rejected");
                    return DialogCloseResult.create("abort");
                }
                return s(r.deactivate?.(a), (() => s(o.deactivate(o, null, 2), (() => {
                    n.dispose();
                    n.overlay.removeEventListener(l ?? "click", this);
                    if (!c && "error" !== t) this.t(a); else this.i(O(e, "Dialog cancelled with a rejection on cancel"));
                    return a;
                }))));
            })));
        })).catch((t => {
            this.u = void 0;
            throw t;
        }));
        this.u = i ? u : void 0;
        return u;
    }
    ok(t) {
        return this.deactivate("ok", t);
    }
    cancel(t) {
        return this.deactivate("cancel", t);
    }
    error(t) {
        const e = k(t);
        return new Promise((t => t(s(this.cmp.deactivate?.(DialogCloseResult.create("error", e)), (() => s(this.controller.deactivate(this.controller, null, 2), (() => {
            this.dom.dispose();
            this.i(e);
        })))))));
    }
    handleEvent(t) {
        if (this.settings.overlayDismiss && !this.dom.contentHost.contains(t.target)) this.cancel();
    }
    getOrCreateVm(t, e, i) {
        const s = e.component;
        if (null == s) return new EmptyComponent;
        if ("object" === typeof s) return s;
        const n = this.p;
        t.registerResolver(n.HTMLElement, t.registerResolver(n.Element, t.registerResolver(a, new o("ElementResolver", i))));
        return t.invoke(s);
    }
    getDefinition(t) {
        const e = y(t) ? t : t?.constructor;
        return g.isType(e) ? g.getDefinition(e) : null;
    }
}

class EmptyComponent {}

function O(t, e) {
    const i = S(e);
    i.wasCancelled = true;
    i.value = t;
    return i;
}

function k(t) {
    const e = S("");
    e.wasCancelled = false;
    e.value = t;
    return e;
}

class DialogService {
    constructor(t, e, i) {
        this.h = t;
        this.p = e;
        this.R = i;
        this.dlgs = [];
    }
    get controllers() {
        return this.dlgs.slice(0);
    }
    get top() {
        const t = this.dlgs;
        return t.length > 0 ? t[t.length - 1] : null;
    }
    static get inject() {
        return [ i, l, E ];
    }
    static register(t) {
        t.register(m(v, this), D.deactivating(v, (t => s(t.closeAll(), (t => {
            if (t.length > 0) throw S(`AUR0901:${t.length}`);
        })))));
    }
    open(t) {
        return A(new Promise((e => {
            const i = DialogSettings.from(this.R, t);
            const o = i.container ?? this.h.createChild();
            e(s(i.load(), (t => {
                const e = o.invoke(DialogController);
                o.register(d(w, e));
                o.register(p(DialogController, (() => {
                    throw S(`AUR0902`);
                })));
                return s(e.activate(t), (t => {
                    if (!t.wasCancelled) {
                        if (1 === this.dlgs.push(e)) this.p.window.addEventListener("keydown", this);
                        const t = () => this.remove(e);
                        e.closed.then(t, t);
                    }
                    return t;
                }));
            })));
        })));
    }
    closeAll() {
        return Promise.all(Array.from(this.dlgs).map((t => {
            if (t.settings.rejectOnCancel) return t.cancel().then((() => null));
            return t.cancel().then((e => "cancel" === e.status ? null : t));
        }))).then((t => t.filter((t => !!t))));
    }
    remove(t) {
        const e = this.dlgs;
        const i = e.indexOf(t);
        if (i > -1) this.dlgs.splice(i, 1);
        if (0 === e.length) this.p.window.removeEventListener("keydown", this);
    }
    handleEvent(t) {
        const e = t;
        const i = G(e);
        if (null == i) return;
        const s = this.top;
        if (null === s || 0 === s.settings.keyboard.length) return;
        const o = s.settings.keyboard;
        if ("Escape" === i && o.includes(i)) void s.cancel(); else if ("Enter" === i && o.includes(i)) void s.ok();
    }
}

class DialogSettings {
    static from(...t) {
        return Object.assign(new DialogSettings, ...t).j().C();
    }
    load() {
        const t = this;
        const e = this.component;
        const i = this.template;
        const o = n(null == e ? void 0 : s(e(), (e => {
            t.component = e;
        })), y(i) ? s(i(), (e => {
            t.template = e;
        })) : void 0);
        return j(o) ? o.then((() => t)) : t;
    }
    j() {
        if (null == this.component && null == this.template) throw S(`AUR0903`);
        return this;
    }
    C() {
        if (null == this.keyboard) this.keyboard = this.lock ? [] : [ "Enter", "Escape" ];
        if ("boolean" !== typeof this.overlayDismiss) this.overlayDismiss = !this.lock;
        return this;
    }
}

function P(t, e) {
    return this.then((i => i.dialog.closed.then(t, e)), e);
}

function A(t) {
    t.whenClosed = P;
    return t;
}

function G(t) {
    if ("Escape" === (t.code || t.key) || 27 === t.keyCode) return "Escape";
    if ("Enter" === (t.code || t.key) || 13 === t.keyCode) return "Enter";
    return;
}

class DefaultDialogGlobalSettings {
    constructor() {
        this.lock = true;
        this.startingZIndex = 1e3;
        this.rejectOnCancel = false;
    }
    static register(t) {
        m(E, this).register(t);
    }
}

const I = "position:absolute;width:100%;height:100%;top:0;left:0;";

class DefaultDialogDomRenderer {
    constructor(t) {
        this.p = t;
        this.wrapperCss = `${I} display:flex;`;
        this.overlayCss = I;
        this.hostCss = "position:relative;margin:auto;";
    }
    static register(t) {
        m(R, this).register(t);
    }
    render(t) {
        const e = this.p.document;
        const i = (t, i) => {
            const s = e.createElement(t);
            s.style.cssText = i;
            return s;
        };
        const s = t.appendChild(i("au-dialog-container", this.wrapperCss));
        const o = s.appendChild(i("au-dialog-overlay", this.overlayCss));
        const n = s.appendChild(i("div", this.hostCss));
        return new DefaultDialogDom(s, o, n);
    }
}

DefaultDialogDomRenderer.inject = [ l ];

class DefaultDialogDom {
    constructor(t, e, i) {
        this.wrapper = t;
        this.overlay = e;
        this.contentHost = i;
    }
    dispose() {
        this.wrapper.remove();
    }
}

function U(t, e) {
    return {
        settingsProvider: t,
        register: i => i.register(...e, D.creating((() => t(i.get(E))))),
        customize(t, i) {
            return U(t, i ?? e);
        }
    };
}

const $ = U((() => {
    throw S(`AUR0904`);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(m(E, this));
    }
} ]);

const x = U(r, [ DialogService, DefaultDialogGlobalSettings, DefaultDialogDomRenderer ]);

export { DefaultDialogDom, DefaultDialogDomRenderer, DefaultDialogGlobalSettings, DialogCloseResult, $ as DialogConfiguration, DialogController, b as DialogDeactivationStatuses, x as DialogDefaultConfiguration, DialogOpenResult, DialogService, w as IDialogController, C as IDialogDom, R as IDialogDomRenderer, E as IDialogGlobalSettings, v as IDialogService };
//# sourceMappingURL=index.mjs.map
