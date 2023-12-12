"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var e = require("@aurelia/runtime-html");

const o = t.DI.createInterface;

const s = t.Registration.singleton;

const i = t.Registration.instance;

t.Registration.callback;

const r = /*@__PURE__*/ o("IDialogService");

const n = /*@__PURE__*/ o("IDialogController");

const l = /*@__PURE__*/ o("IDialogDomRenderer");

const a = /*@__PURE__*/ o("IDialogDom");

const c = /*@__PURE__*/ o("IDialogGlobalSettings");

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

exports.DialogDeactivationStatuses = void 0;

(function(t) {
    t["Ok"] = "ok";
    t["Error"] = "error";
    t["Cancel"] = "cancel";
    t["Abort"] = "abort";
})(exports.DialogDeactivationStatuses || (exports.DialogDeactivationStatuses = {}));

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
    activate(o) {
        const s = this.ctn.createChild();
        const {model: r, template: n, rejectOnCancel: c} = o;
        const u = s.get(l);
        const g = o.host ?? this.p.document.body;
        const D = this.dom = u.render(g, o);
        const f = s.has(e.IEventTarget, true) ? s.get(e.IEventTarget) : null;
        const p = D.contentHost;
        this.settings = o;
        if (f == null || !f.contains(g)) {
            s.register(i(e.IEventTarget, g));
        }
        s.register(i(e.INode, p), i(a, D));
        return new Promise((t => {
            const e = Object.assign(this.cmp = this.getOrCreateVm(s, o, p), {
                $dialog: this
            });
            t(e.canActivate?.(r) ?? true);
        })).then((i => {
            if (i !== true) {
                D.dispose();
                if (c) {
                    throw createDialogCancelError(null, "Dialog activation rejected");
                }
                return DialogOpenResult.create(true, this);
            }
            const l = this.cmp;
            return t.onResolve(l.activate?.(r), (() => {
                const i = this.controller = e.Controller.$el(s, l, p, null, e.CustomElementDefinition.create(this.getDefinition(l) ?? {
                    name: e.CustomElement.generateName(),
                    template: n
                }));
                return t.onResolve(i.activate(i, null), (() => {
                    D.overlay.addEventListener(o.mouseEvent ?? "click", this);
                    return DialogOpenResult.create(false, this);
                }));
            }));
        }), (t => {
            D.dispose();
            throw t;
        }));
    }
    deactivate(e, o) {
        if (this.u) {
            return this.u;
        }
        let s = true;
        const {controller: i, dom: r, cmp: n, settings: {mouseEvent: l, rejectOnCancel: a}} = this;
        const c = DialogCloseResult.create(e, o);
        const u = new Promise((u => {
            u(t.onResolve(n.canDeactivate?.(c) ?? true, (u => {
                if (u !== true) {
                    s = false;
                    this.u = void 0;
                    if (a) {
                        throw createDialogCancelError(null, "Dialog cancellation rejected");
                    }
                    return DialogCloseResult.create("abort");
                }
                return t.onResolve(n.deactivate?.(c), (() => t.onResolve(i.deactivate(i, null), (() => {
                    r.dispose();
                    r.overlay.removeEventListener(l ?? "click", this);
                    if (!a && e !== "error") {
                        this.t(c);
                    } else {
                        this.i(createDialogCancelError(o, "Dialog cancelled with a rejection on cancel"));
                    }
                    return c;
                }))));
            })));
        })).catch((t => {
            this.u = void 0;
            throw t;
        }));
        this.u = s ? u : void 0;
        return u;
    }
    ok(t) {
        return this.deactivate("ok", t);
    }
    cancel(t) {
        return this.deactivate("cancel", t);
    }
    error(e) {
        const o = createDialogCloseError(e);
        return new Promise((e => e(t.onResolve(this.cmp.deactivate?.(DialogCloseResult.create("error", o)), (() => t.onResolve(this.controller.deactivate(this.controller, null), (() => {
            this.dom.dispose();
            this.i(o);
        })))))));
    }
    handleEvent(t) {
        if (this.settings.overlayDismiss && !this.dom.contentHost.contains(t.target)) {
            this.cancel();
        }
    }
    getOrCreateVm(o, s, i) {
        const r = s.component;
        if (r == null) {
            return new EmptyComponent;
        }
        if (typeof r === "object") {
            return r;
        }
        const n = this.p;
        o.registerResolver(n.HTMLElement, o.registerResolver(n.Element, o.registerResolver(e.INode, new t.InstanceProvider("ElementResolver", i))));
        return o.invoke(r);
    }
    getDefinition(t) {
        const o = isFunction(t) ? t : t?.constructor;
        return e.CustomElement.isType(o) ? e.CustomElement.getDefinition(o) : null;
    }
}

class EmptyComponent {}

function createDialogCancelError(t, e) {
    const o = createError(e);
    o.wasCancelled = true;
    o.value = t;
    return o;
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
    static register(o) {
        o.register(s(this, this), t.Registration.aliasTo(this, r), e.AppTask.deactivating(r, (e => t.onResolve(e.closeAll(), (t => {
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
        return asDialogOpenPromise(new Promise((o => {
            const s = DialogSettings.from(this.C, e);
            const r = s.container ?? this.h.createChild();
            o(t.onResolve(s.load(), (e => {
                const o = r.invoke(DialogController);
                r.register(i(n, o), i(DialogController, o));
                return t.onResolve(o.activate(e), (t => {
                    if (!t.wasCancelled) {
                        if (this.dlgs.push(o) === 1) {
                            this.p.window.addEventListener("keydown", this);
                        }
                        const $removeController = () => this.remove(o);
                        o.closed.then($removeController, $removeController);
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
        const o = e.indexOf(t);
        if (o > -1) {
            this.dlgs.splice(o, 1);
        }
        if (e.length === 0) {
            this.p.window.removeEventListener("keydown", this);
        }
    }
    handleEvent(t) {
        const e = t;
        const o = getActionKey(e);
        if (o == null) {
            return;
        }
        const s = this.top;
        if (s === null || s.settings.keyboard.length === 0) {
            return;
        }
        const i = s.settings.keyboard;
        if (o === "Escape" && i.includes(o)) {
            void s.cancel();
        } else if (o === "Enter" && i.includes(o)) {
            void s.ok();
        }
    }
}

class DialogSettings {
    static from(...t) {
        return Object.assign(new DialogSettings, ...t).O().R();
    }
    load() {
        const e = this;
        const o = this.component;
        const s = this.template;
        const i = t.onResolveAll(...[ o == null ? void 0 : t.onResolve(o(), (t => {
            e.component = t;
        })), isFunction(s) ? t.onResolve(s(), (t => {
            e.template = t;
        })) : void 0 ]);
        return isPromise(i) ? i.then((() => e)) : e;
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
    return this.then((o => o.dialog.closed.then(t, e)), e);
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
        s(c, this).register(t);
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
        t.register(s(l, this));
    }
    render(t, e) {
        const o = this.p.document;
        const h = (t, e) => {
            const s = o.createElement(t);
            s.style.cssText = e;
            return s;
        };
        const {startingZIndex: s} = e;
        const i = `${this.wrapperCss};${s == null ? "" : `z-index:${s}`}`;
        const r = t.appendChild(h("au-dialog-container", i));
        const n = r.appendChild(h("au-dialog-overlay", this.overlayCss));
        const l = r.appendChild(h("div", this.hostCss));
        return new DefaultDialogDom(r, n, l);
    }
}

class DefaultDialogDom {
    constructor(t, e, o) {
        this.wrapper = t;
        this.overlay = e;
        this.contentHost = o;
    }
    dispose() {
        this.wrapper.remove();
    }
}

function createDialogConfiguration(t, o) {
    return {
        settingsProvider: t,
        register: s => s.register(...o, e.AppTask.creating((() => t(s.get(c))))),
        customize(t, e) {
            return createDialogConfiguration(t, e ?? o);
        }
    };
}

const g = /*@__PURE__*/ createDialogConfiguration((() => {
    throw createError(`AUR0904`);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(s(c, this));
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
