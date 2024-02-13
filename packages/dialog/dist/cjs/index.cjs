"use strict";

var t = require("@aurelia/kernel");

var e = require("@aurelia/runtime-html");

const s = t.DI.createInterface;

const i = t.Registration.singleton;

const o = t.Registration.instance;

t.Registration.callback;

const r = /*@__PURE__*/ s("IDialogService");

const n = /*@__PURE__*/ s("IDialogController");

const l = /*@__PURE__*/ s("IDialogDomRenderer");

const a = /*@__PURE__*/ s("IDialogDom");

const c = /*@__PURE__*/ s("IDialogGlobalSettings");

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

const createError = t => new Error(t);

const isPromise = t => t instanceof Promise;

const isFunction = t => typeof t === "function";

class DialogController {
    static get inject() {
        return [ e.IPlatform, t.IContainer ];
    }
    constructor(t, e) {
        this.p = t;
        this.ctn = e;
        this.closed = new Promise(((t, e) => {
            this.t = t;
            this.i = e;
        }));
    }
    activate(s) {
        const i = this.ctn.createChild();
        const {model: r, template: n, rejectOnCancel: c} = s;
        const u = i.get(l);
        const g = s.host ?? this.p.document.body;
        const D = this.dom = u.render(g, s);
        const f = i.has(e.IEventTarget, true) ? i.get(e.IEventTarget) : null;
        const p = D.contentHost;
        this.settings = s;
        if (f == null || !f.contains(g)) {
            i.register(o(e.IEventTarget, g));
        }
        i.register(o(e.INode, p), o(a, D));
        return new Promise((t => {
            const e = Object.assign(this.cmp = this.getOrCreateVm(i, s, p), {
                $dialog: this
            });
            t(e.canActivate?.(r) ?? true);
        })).then((o => {
            if (o !== true) {
                D.dispose();
                if (c) {
                    throw createDialogCancelError(null, "Dialog activation rejected");
                }
                return DialogOpenResult.create(true, this);
            }
            const l = this.cmp;
            return t.onResolve(l.activate?.(r), (() => {
                const o = this.controller = e.Controller.$el(i, l, p, null, e.CustomElementDefinition.create(this.getDefinition(l) ?? {
                    name: e.CustomElement.generateName(),
                    template: n
                }));
                return t.onResolve(o.activate(o, null), (() => {
                    D.overlay.addEventListener(s.mouseEvent ?? "click", this);
                    return DialogOpenResult.create(false, this);
                }));
            }));
        }), (t => {
            D.dispose();
            throw t;
        }));
    }
    deactivate(e, s) {
        if (this.u) {
            return this.u;
        }
        let i = true;
        const {controller: o, dom: r, cmp: n, settings: {mouseEvent: l, rejectOnCancel: a}} = this;
        const c = DialogCloseResult.create(e, s);
        const u = new Promise((u => {
            u(t.onResolve(n.canDeactivate?.(c) ?? true, (u => {
                if (u !== true) {
                    i = false;
                    this.u = void 0;
                    if (a) {
                        throw createDialogCancelError(null, "Dialog cancellation rejected");
                    }
                    return DialogCloseResult.create("abort");
                }
                return t.onResolve(n.deactivate?.(c), (() => t.onResolve(o.deactivate(o, null), (() => {
                    r.dispose();
                    r.overlay.removeEventListener(l ?? "click", this);
                    if (!a && e !== "error") {
                        this.t(c);
                    } else {
                        this.i(createDialogCancelError(s, "Dialog cancelled with a rejection on cancel"));
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
    error(e) {
        const s = createDialogCloseError(e);
        return new Promise((e => e(t.onResolve(this.cmp.deactivate?.(DialogCloseResult.create("error", s)), (() => t.onResolve(this.controller.deactivate(this.controller, null), (() => {
            this.dom.dispose();
            this.i(s);
        })))))));
    }
    handleEvent(t) {
        if (this.settings.overlayDismiss && !this.dom.contentHost.contains(t.target)) {
            this.cancel();
        }
    }
    getOrCreateVm(s, i, o) {
        const r = i.component;
        if (r == null) {
            return new EmptyComponent;
        }
        if (typeof r === "object") {
            return r;
        }
        const n = this.p;
        s.registerResolver(n.HTMLElement, s.registerResolver(n.Element, s.registerResolver(e.INode, new t.InstanceProvider("ElementResolver", o))));
        return s.invoke(r);
    }
    getDefinition(t) {
        const s = isFunction(t) ? t : t?.constructor;
        return e.CustomElement.isType(s) ? e.CustomElement.getDefinition(s) : null;
    }
}

class EmptyComponent {}

function createDialogCancelError(t, e) {
    const s = createError(e);
    s.wasCancelled = true;
    s.value = t;
    return s;
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
        this.h = t.resolve(t.IContainer);
        this.p = t.resolve(e.IPlatform);
        this.C = t.resolve(c);
    }
    static register(s) {
        s.register(i(this, this), t.Registration.aliasTo(this, r), e.AppTask.deactivating(r, (e => t.onResolve(e.closeAll(), (t => {
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
    open(e) {
        return asDialogOpenPromise(new Promise((s => {
            const i = DialogSettings.from(this.C, e);
            const r = i.container ?? this.h.createChild();
            s(t.onResolve(i.load(), (e => {
                const s = r.invoke(DialogController);
                r.register(o(n, s), o(DialogController, s));
                return t.onResolve(s.activate(e), (t => {
                    if (!t.wasCancelled) {
                        if (this.dlgs.push(s) === 1) {
                            this.p.window.addEventListener("keydown", this);
                        }
                        const $removeController = () => this.remove(s);
                        s.closed.then($removeController, $removeController);
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
        const s = e.indexOf(t);
        if (s > -1) {
            this.dlgs.splice(s, 1);
        }
        if (e.length === 0) {
            this.p.window.removeEventListener("keydown", this);
        }
    }
    handleEvent(t) {
        const e = t;
        const s = getActionKey(e);
        if (s == null) {
            return;
        }
        const i = this.top;
        if (i === null || i.settings.keyboard.length === 0) {
            return;
        }
        const o = i.settings.keyboard;
        if (s === "Escape" && o.includes(s)) {
            void i.cancel();
        } else if (s === "Enter" && o.includes(s)) {
            void i.ok();
        }
    }
}

class DialogSettings {
    static from(...t) {
        return Object.assign(new DialogSettings, ...t).O().R();
    }
    load() {
        const e = this;
        const s = this.component;
        const i = this.template;
        const o = t.onResolveAll(...[ s == null ? void 0 : t.onResolve(s(), (t => {
            e.component = t;
        })), isFunction(i) ? t.onResolve(i(), (t => {
            e.template = t;
        })) : void 0 ]);
        return isPromise(o) ? o.then((() => e)) : e;
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
    return this.then((s => s.dialog.closed.then(t, e)), e);
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
        i(c, this).register(t);
    }
}

const u = "position:absolute;width:100%;height:100%;top:0;left:0;";

class DefaultDialogDomRenderer {
    constructor() {
        this.p = t.resolve(e.IPlatform);
        this.wrapperCss = `${u} display:flex;`;
        this.overlayCss = u;
        this.hostCss = "position:relative;margin:auto;";
    }
    static register(t) {
        t.register(i(l, this));
    }
    render(t, e) {
        const s = this.p.document;
        const h = (t, e) => {
            const i = s.createElement(t);
            i.style.cssText = e;
            return i;
        };
        const {startingZIndex: i} = e;
        const o = `${this.wrapperCss};${i == null ? "" : `z-index:${i}`}`;
        const r = t.appendChild(h("au-dialog-container", o));
        const n = r.appendChild(h("au-dialog-overlay", this.overlayCss));
        const l = r.appendChild(h("div", this.hostCss));
        return new DefaultDialogDom(r, n, l);
    }
}

class DefaultDialogDom {
    constructor(t, e, s) {
        this.wrapper = t;
        this.overlay = e;
        this.contentHost = s;
    }
    dispose() {
        this.wrapper.remove();
    }
}

function createDialogConfiguration(t, s) {
    return {
        settingsProvider: t,
        register: i => i.register(...s, e.AppTask.creating((() => t(i.get(c))))),
        customize(t, e) {
            return createDialogConfiguration(t, e ?? s);
        }
    };
}

const g = /*@__PURE__*/ createDialogConfiguration((() => {
    throw createError(`AUR0904`);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(i(c, this));
    }
} ]);

const D = /*@__PURE__*/ createDialogConfiguration(t.noop, [ DialogService, DefaultDialogGlobalSettings, DefaultDialogDomRenderer ]);

exports.DefaultDialogDom = DefaultDialogDom;

exports.DefaultDialogDomRenderer = DefaultDialogDomRenderer;

exports.DefaultDialogGlobalSettings = DefaultDialogGlobalSettings;

exports.DialogCloseResult = DialogCloseResult;

exports.DialogConfiguration = g;

exports.DialogController = DialogController;

exports.DialogDefaultConfiguration = D;

exports.DialogOpenResult = DialogOpenResult;

exports.DialogService = DialogService;

exports.IDialogController = n;

exports.IDialogDom = a;

exports.IDialogDomRenderer = l;

exports.IDialogGlobalSettings = c;

exports.IDialogService = r;
//# sourceMappingURL=index.cjs.map
