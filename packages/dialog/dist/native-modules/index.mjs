import { DI as t, Registration as e, IContainer as i, onResolve as o, InstanceProvider as r, resolveAll as s, noop as n } from "../kernel/dist/native-modules/index.mjs";

import { IPlatform as l, IEventTarget as a, INode as c, Controller as u, CustomElementDefinition as g, CustomElement as D, AppTask as f } from "../runtime-html/dist/native-modules/index.mjs";

const m = t.createInterface;

const d = e.singleton;

const p = e.instance;

const C = e.callback;

const w = /*@__PURE__*/ m("IDialogService");

const v = /*@__PURE__*/ m("IDialogController");

const E = /*@__PURE__*/ m("IDialogDomRenderer");

const R = /*@__PURE__*/ m("IDialogDom");

const b = /*@__PURE__*/ m("IDialogGlobalSettings");

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
        return [ l, i ];
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
        const {model: i, template: r, rejectOnCancel: s} = t;
        const n = e.get(E);
        const l = t.host ?? this.p.document.body;
        const f = this.dom = n.render(l, t);
        const m = e.has(a, true) ? e.get(a) : null;
        const d = f.contentHost;
        this.settings = t;
        if (m == null || !m.contains(l)) {
            e.register(p(a, l));
        }
        e.register(p(c, d), p(R, f));
        return new Promise((o => {
            const r = Object.assign(this.cmp = this.getOrCreateVm(e, t, d), {
                $dialog: this
            });
            o(r.canActivate?.(i) ?? true);
        })).then((n => {
            if (n !== true) {
                f.dispose();
                if (s) {
                    throw createDialogCancelError(null, "Dialog activation rejected");
                }
                return DialogOpenResult.create(true, this);
            }
            const l = this.cmp;
            return o(l.activate?.(i), (() => {
                const i = this.controller = u.$el(e, l, d, null, g.create(this.getDefinition(l) ?? {
                    name: D.generateName(),
                    template: r
                }));
                return o(i.activate(i, null), (() => {
                    f.overlay.addEventListener(t.mouseEvent ?? "click", this);
                    return DialogOpenResult.create(false, this);
                }));
            }));
        }), (t => {
            f.dispose();
            throw t;
        }));
    }
    deactivate(t, e) {
        if (this.u) {
            return this.u;
        }
        let i = true;
        const {controller: r, dom: s, cmp: n, settings: {mouseEvent: l, rejectOnCancel: a}} = this;
        const c = DialogCloseResult.create(t, e);
        const u = new Promise((u => {
            u(o(n.canDeactivate?.(c) ?? true, (u => {
                if (u !== true) {
                    i = false;
                    this.u = void 0;
                    if (a) {
                        throw createDialogCancelError(null, "Dialog cancellation rejected");
                    }
                    return DialogCloseResult.create("abort");
                }
                return o(n.deactivate?.(c), (() => o(r.deactivate(r, null), (() => {
                    s.dispose();
                    s.overlay.removeEventListener(l ?? "click", this);
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
        const s = this.p;
        t.registerResolver(s.HTMLElement, t.registerResolver(s.Element, t.registerResolver(c, new r("ElementResolver", i))));
        return t.invoke(o);
    }
    getDefinition(t) {
        const e = isFunction(t) ? t : t?.constructor;
        return D.isType(e) ? D.getDefinition(e) : null;
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
    get controllers() {
        return this.dlgs.slice(0);
    }
    get top() {
        const t = this.dlgs;
        return t.length > 0 ? t[t.length - 1] : null;
    }
    static get inject() {
        return [ i, l, b ];
    }
    constructor(t, e, i) {
        this.h = t;
        this.p = e;
        this.C = i;
        this.dlgs = [];
    }
    static register(t) {
        t.register(d(w, this), f.deactivating(w, (t => o(t.closeAll(), (t => {
            if (t.length > 0) {
                throw createError(`AUR0901:${t.length}`);
            }
        })))));
    }
    open(t) {
        return asDialogOpenPromise(new Promise((e => {
            const i = DialogSettings.from(this.C, t);
            const r = i.container ?? this.h.createChild();
            e(o(i.load(), (t => {
                const e = r.invoke(DialogController);
                r.register(p(v, e));
                r.register(C(DialogController, (() => {
                    throw createError(`AUR0902`);
                })));
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
        const r = o.settings.keyboard;
        if (i === "Escape" && r.includes(i)) {
            void o.cancel();
        } else if (i === "Enter" && r.includes(i)) {
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
        const r = s(...[ e == null ? void 0 : o(e(), (e => {
            t.component = e;
        })), isFunction(i) ? o(i(), (e => {
            t.template = e;
        })) : void 0 ]);
        return isPromise(r) ? r.then((() => t)) : t;
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
        d(b, this).register(t);
    }
}

const O = "position:absolute;width:100%;height:100%;top:0;left:0;";

class DefaultDialogDomRenderer {
    constructor(t) {
        this.p = t;
        this.wrapperCss = `${O} display:flex;`;
        this.overlayCss = O;
        this.hostCss = "position:relative;margin:auto;";
    }
    static register(t) {
        d(E, this).register(t);
    }
    render(t) {
        const e = this.p.document;
        const h = (t, i) => {
            const o = e.createElement(t);
            o.style.cssText = i;
            return o;
        };
        const i = t.appendChild(h("au-dialog-container", this.wrapperCss));
        const o = i.appendChild(h("au-dialog-overlay", this.overlayCss));
        const r = i.appendChild(h("div", this.hostCss));
        return new DefaultDialogDom(i, o, r);
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

function createDialogConfiguration(t, e) {
    return {
        settingsProvider: t,
        register: i => i.register(...e, f.creating((() => t(i.get(b))))),
        customize(t, i) {
            return createDialogConfiguration(t, i ?? e);
        }
    };
}

const S = /*@__PURE__*/ createDialogConfiguration((() => {
    throw createError(`AUR0904`);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(d(b, this));
    }
} ]);

const j = /*@__PURE__*/ createDialogConfiguration(n, [ DialogService, DefaultDialogGlobalSettings, DefaultDialogDomRenderer ]);

export { DefaultDialogDom, DefaultDialogDomRenderer, DefaultDialogGlobalSettings, DialogCloseResult, S as DialogConfiguration, DialogController, y as DialogDeactivationStatuses, j as DialogDefaultConfiguration, DialogOpenResult, DialogService, v as IDialogController, R as IDialogDom, E as IDialogDomRenderer, b as IDialogGlobalSettings, w as IDialogService };

