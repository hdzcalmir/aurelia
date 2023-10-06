import { DI as t, Registration as e, IContainer as i, onResolve as o, InstanceProvider as s, resolve as n, onResolveAll as r, noop as l } from "@aurelia/kernel";

import { IPlatform as a, IEventTarget as c, INode as u, Controller as g, CustomElementDefinition as D, CustomElement as f, AppTask as m } from "@aurelia/runtime-html";

const d = t.createInterface;

const p = e.singleton;

const C = e.instance;

e.callback;

const v = /*@__PURE__*/ d("IDialogService");

const w = /*@__PURE__*/ d("IDialogController");

const E = /*@__PURE__*/ d("IDialogDomRenderer");

const R = /*@__PURE__*/ d("IDialogDom");

const b = /*@__PURE__*/ d("IDialogGlobalSettings");

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

var y;

(function(t) {
    t["Ok"] = "ok";
    t["Error"] = "error";
    t["Cancel"] = "cancel";
    t["Abort"] = "abort";
})(y || (y = {}));

const createError = t => new Error(t);

const isPromise = t => t instanceof Promise;

const isFunction = t => typeof t === "function";

class DialogController {
    static get inject() {
        return [ a, i ];
    }
    constructor(t, e) {
        this.p = t;
        this.ctn = e;
        this.closed = new Promise(((t, e) => {
            this.t = t;
            this.i = e;
        }));
    }
    activate(t) {
        const e = this.ctn.createChild();
        const {model: i, template: s, rejectOnCancel: n} = t;
        const r = e.get(E);
        const l = t.host ?? this.p.document.body;
        const a = this.dom = r.render(l, t);
        const m = e.has(c, true) ? e.get(c) : null;
        const d = a.contentHost;
        this.settings = t;
        if (m == null || !m.contains(l)) {
            e.register(C(c, l));
        }
        e.register(C(u, d), C(R, a));
        return new Promise((o => {
            const s = Object.assign(this.cmp = this.getOrCreateVm(e, t, d), {
                $dialog: this
            });
            o(s.canActivate?.(i) ?? true);
        })).then((r => {
            if (r !== true) {
                a.dispose();
                if (n) {
                    throw createDialogCancelError(null, "Dialog activation rejected");
                }
                return DialogOpenResult.create(true, this);
            }
            const l = this.cmp;
            return o(l.activate?.(i), (() => {
                const i = this.controller = g.$el(e, l, d, null, D.create(this.getDefinition(l) ?? {
                    name: f.generateName(),
                    template: s
                }));
                return o(i.activate(i, null), (() => {
                    a.overlay.addEventListener(t.mouseEvent ?? "click", this);
                    return DialogOpenResult.create(false, this);
                }));
            }));
        }), (t => {
            a.dispose();
            throw t;
        }));
    }
    deactivate(t, e) {
        if (this.u) {
            return this.u;
        }
        let i = true;
        const {controller: s, dom: n, cmp: r, settings: {mouseEvent: l, rejectOnCancel: a}} = this;
        const c = DialogCloseResult.create(t, e);
        const u = new Promise((u => {
            u(o(r.canDeactivate?.(c) ?? true, (u => {
                if (u !== true) {
                    i = false;
                    this.u = void 0;
                    if (a) {
                        throw createDialogCancelError(null, "Dialog cancellation rejected");
                    }
                    return DialogCloseResult.create("abort");
                }
                return o(r.deactivate?.(c), (() => o(s.deactivate(s, null), (() => {
                    n.dispose();
                    n.overlay.removeEventListener(l ?? "click", this);
                    if (!a && t !== "error") {
                        this.t(c);
                    } else {
                        this.i(createDialogCancelError(e, "Dialog cancelled with a rejection on cancel"));
                    }
                    return c;
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
        const e = createDialogCloseError(t);
        return new Promise((t => t(o(this.cmp.deactivate?.(DialogCloseResult.create("error", e)), (() => o(this.controller.deactivate(this.controller, null), (() => {
            this.dom.dispose();
            this.i(e);
        })))))));
    }
    handleEvent(t) {
        if (this.settings.overlayDismiss && !this.dom.contentHost.contains(t.target)) {
            this.cancel();
        }
    }
    getOrCreateVm(t, e, i) {
        const o = e.component;
        if (o == null) {
            return new EmptyComponent;
        }
        if (typeof o === "object") {
            return o;
        }
        const n = this.p;
        t.registerResolver(n.HTMLElement, t.registerResolver(n.Element, t.registerResolver(u, new s("ElementResolver", i))));
        return t.invoke(o);
    }
    getDefinition(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return f.isType(e) ? f.getDefinition(e) : null;
    }
}

class EmptyComponent {}

function createDialogCancelError(t, e) {
    const i = createError(e);
    i.wasCancelled = true;
    i.value = t;
    return i;
}

function createDialogCloseError(t) {
    const e = createError("");
    e.wasCancelled = false;
    e.value = t;
    return e;
}

class DialogService {
    constructor() {
        this.dlgs = [];
        this.h = n(i);
        this.p = n(a);
        this.C = n(b);
    }
    static register(t) {
        t.register(p(this, this), e.aliasTo(this, v), m.deactivating(v, (t => o(t.closeAll(), (t => {
            if (t.length > 0) {
                throw createError(`AUR0901:${t.length}`);
            }
        })))));
    }
    get controllers() {
        return this.dlgs.slice(0);
    }
    get top() {
        const t = this.dlgs;
        return t.length > 0 ? t[t.length - 1] : null;
    }
    open(t) {
        return asDialogOpenPromise(new Promise((e => {
            const i = DialogSettings.from(this.C, t);
            const s = i.container ?? this.h.createChild();
            e(o(i.load(), (t => {
                const e = s.invoke(DialogController);
                s.register(C(w, e), C(DialogController, e));
                return o(e.activate(t), (t => {
                    if (!t.wasCancelled) {
                        if (this.dlgs.push(e) === 1) {
                            this.p.window.addEventListener("keydown", this);
                        }
                        const $removeController = () => this.remove(e);
                        e.closed.then($removeController, $removeController);
                    }
                    return t;
                }));
            })));
        })));
    }
    closeAll() {
        return Promise.all(Array.from(this.dlgs).map((t => {
            if (t.settings.rejectOnCancel) {
                return t.cancel().then((() => null));
            }
            return t.cancel().then((e => e.status === "cancel" ? null : t));
        }))).then((t => t.filter((t => !!t))));
    }
    remove(t) {
        const e = this.dlgs;
        const i = e.indexOf(t);
        if (i > -1) {
            this.dlgs.splice(i, 1);
        }
        if (e.length === 0) {
            this.p.window.removeEventListener("keydown", this);
        }
    }
    handleEvent(t) {
        const e = t;
        const i = getActionKey(e);
        if (i == null) {
            return;
        }
        const o = this.top;
        if (o === null || o.settings.keyboard.length === 0) {
            return;
        }
        const s = o.settings.keyboard;
        if (i === "Escape" && s.includes(i)) {
            void o.cancel();
        } else if (i === "Enter" && s.includes(i)) {
            void o.ok();
        }
    }
}

class DialogSettings {
    static from(...t) {
        return Object.assign(new DialogSettings, ...t).O().R();
    }
    load() {
        const t = this;
        const e = this.component;
        const i = this.template;
        const s = r(...[ e == null ? void 0 : o(e(), (e => {
            t.component = e;
        })), isFunction(i) ? o(i(), (e => {
            t.template = e;
        })) : void 0 ]);
        return isPromise(s) ? s.then((() => t)) : t;
    }
    O() {
        if (this.component == null && this.template == null) {
            throw createError(`AUR0903`);
        }
        return this;
    }
    R() {
        if (this.keyboard == null) {
            this.keyboard = this.lock ? [] : [ "Enter", "Escape" ];
        }
        if (typeof this.overlayDismiss !== "boolean") {
            this.overlayDismiss = !this.lock;
        }
        return this;
    }
}

function whenClosed(t, e) {
    return this.then((i => i.dialog.closed.then(t, e)), e);
}

function asDialogOpenPromise(t) {
    t.whenClosed = whenClosed;
    return t;
}

function getActionKey(t) {
    if ((t.code || t.key) === "Escape" || t.keyCode === 27) {
        return "Escape";
    }
    if ((t.code || t.key) === "Enter" || t.keyCode === 13) {
        return "Enter";
    }
    return undefined;
}

class DefaultDialogGlobalSettings {
    constructor() {
        this.lock = true;
        this.startingZIndex = 1e3;
        this.rejectOnCancel = false;
    }
    static register(t) {
        p(b, this).register(t);
    }
}

const O = "position:absolute;width:100%;height:100%;top:0;left:0;";

class DefaultDialogDomRenderer {
    constructor() {
        this.p = n(a);
        this.wrapperCss = `${O} display:flex;`;
        this.overlayCss = O;
        this.hostCss = "position:relative;margin:auto;";
    }
    static register(t) {
        t.register(p(E, this));
    }
    render(t, e) {
        const i = this.p.document;
        const h = (t, e) => {
            const o = i.createElement(t);
            o.style.cssText = e;
            return o;
        };
        const {startingZIndex: o} = e;
        const s = `${this.wrapperCss};${o == null ? "" : `z-index:${o}`}`;
        const n = t.appendChild(h("au-dialog-container", s));
        const r = n.appendChild(h("au-dialog-overlay", this.overlayCss));
        const l = n.appendChild(h("div", this.hostCss));
        return new DefaultDialogDom(n, r, l);
    }
}

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

function createDialogConfiguration(t, e) {
    return {
        settingsProvider: t,
        register: i => i.register(...e, m.creating((() => t(i.get(b))))),
        customize(t, i) {
            return createDialogConfiguration(t, i ?? e);
        }
    };
}

const S = /*@__PURE__*/ createDialogConfiguration((() => {
    throw createError(`AUR0904`);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(p(b, this));
    }
} ]);

const P = /*@__PURE__*/ createDialogConfiguration(l, [ DialogService, DefaultDialogGlobalSettings, DefaultDialogDomRenderer ]);

export { DefaultDialogDom, DefaultDialogDomRenderer, DefaultDialogGlobalSettings, DialogCloseResult, S as DialogConfiguration, DialogController, y as DialogDeactivationStatuses, P as DialogDefaultConfiguration, DialogOpenResult, DialogService, w as IDialogController, R as IDialogDom, E as IDialogDomRenderer, b as IDialogGlobalSettings, v as IDialogService };
//# sourceMappingURL=index.mjs.map
