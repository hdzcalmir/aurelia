"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var e = require("@aurelia/runtime-html");

const o = t.DI.createInterface;

const r = t.Registration.singleton;

const s = t.Registration.instance;

const i = t.Registration.callback;

const n = /*@__PURE__*/ o("IDialogService");

const l = /*@__PURE__*/ o("IDialogController");

const a = /*@__PURE__*/ o("IDialogDomRenderer");

const c = /*@__PURE__*/ o("IDialogDom");

const u = /*@__PURE__*/ o("IDialogGlobalSettings");

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
        const r = this.ctn.createChild();
        const {model: i, template: n, rejectOnCancel: l} = o;
        const u = r.get(a);
        const g = o.host ?? this.p.document.body;
        const D = this.dom = u.render(g, o);
        const f = r.has(e.IEventTarget, true) ? r.get(e.IEventTarget) : null;
        const p = D.contentHost;
        this.settings = o;
        if (f == null || !f.contains(g)) {
            r.register(s(e.IEventTarget, g));
        }
        r.register(s(e.INode, p), s(c, D));
        return new Promise((t => {
            const e = Object.assign(this.cmp = this.getOrCreateVm(r, o, p), {
                $dialog: this
            });
            t(e.canActivate?.(i) ?? true);
        })).then((s => {
            if (s !== true) {
                D.dispose();
                if (l) {
                    throw createDialogCancelError(null, "Dialog activation rejected");
                }
                return DialogOpenResult.create(true, this);
            }
            const a = this.cmp;
            return t.onResolve(a.activate?.(i), (() => {
                const s = this.controller = e.Controller.$el(r, a, p, null, e.CustomElementDefinition.create(this.getDefinition(a) ?? {
                    name: e.CustomElement.generateName(),
                    template: n
                }));
                return t.onResolve(s.activate(s, null), (() => {
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
        let r = true;
        const {controller: s, dom: i, cmp: n, settings: {mouseEvent: l, rejectOnCancel: a}} = this;
        const c = DialogCloseResult.create(e, o);
        const u = new Promise((u => {
            u(t.onResolve(n.canDeactivate?.(c) ?? true, (u => {
                if (u !== true) {
                    r = false;
                    this.u = void 0;
                    if (a) {
                        throw createDialogCancelError(null, "Dialog cancellation rejected");
                    }
                    return DialogCloseResult.create("abort");
                }
                return t.onResolve(n.deactivate?.(c), (() => t.onResolve(s.deactivate(s, null), (() => {
                    i.dispose();
                    i.overlay.removeEventListener(l ?? "click", this);
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
        this.u = r ? u : void 0;
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
    getOrCreateVm(o, r, s) {
        const i = r.component;
        if (i == null) {
            return new EmptyComponent;
        }
        if (typeof i === "object") {
            return i;
        }
        const n = this.p;
        o.registerResolver(n.HTMLElement, o.registerResolver(n.Element, o.registerResolver(e.INode, new t.InstanceProvider("ElementResolver", s))));
        return o.invoke(i);
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
    get controllers() {
        return this.dlgs.slice(0);
    }
    get top() {
        const t = this.dlgs;
        return t.length > 0 ? t[t.length - 1] : null;
    }
    static get inject() {
        return [ t.IContainer, e.IPlatform, u ];
    }
    constructor(t, e, o) {
        this.h = t;
        this.p = e;
        this.C = o;
        this.dlgs = [];
    }
    static register(o) {
        o.register(r(n, this), e.AppTask.deactivating(n, (e => t.onResolve(e.closeAll(), (t => {
            if (t.length > 0) {
                throw createError(`AUR0901:${t.length}`);
            }
        })))));
    }
    open(e) {
        return asDialogOpenPromise(new Promise((o => {
            const r = DialogSettings.from(this.C, e);
            const n = r.container ?? this.h.createChild();
            o(t.onResolve(r.load(), (e => {
                const o = n.invoke(DialogController);
                n.register(s(l, o));
                n.register(i(DialogController, (() => {
                    throw createError(`AUR0902`);
                })));
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
        const r = this.top;
        if (r === null || r.settings.keyboard.length === 0) {
            return;
        }
        const s = r.settings.keyboard;
        if (o === "Escape" && s.includes(o)) {
            void r.cancel();
        } else if (o === "Enter" && s.includes(o)) {
            void r.ok();
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
        const r = this.template;
        const s = t.resolveAll(...[ o == null ? void 0 : t.onResolve(o(), (t => {
            e.component = t;
        })), isFunction(r) ? t.onResolve(r(), (t => {
            e.template = t;
        })) : void 0 ]);
        return isPromise(s) ? s.then((() => e)) : e;
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
        r(u, this).register(t);
    }
}

const g = "position:absolute;width:100%;height:100%;top:0;left:0;";

class DefaultDialogDomRenderer {
    constructor(t) {
        this.p = t;
        this.wrapperCss = `${g} display:flex;`;
        this.overlayCss = g;
        this.hostCss = "position:relative;margin:auto;";
    }
    static register(t) {
        r(a, this).register(t);
    }
    render(t) {
        const e = this.p.document;
        const h = (t, o) => {
            const r = e.createElement(t);
            r.style.cssText = o;
            return r;
        };
        const o = t.appendChild(h("au-dialog-container", this.wrapperCss));
        const r = o.appendChild(h("au-dialog-overlay", this.overlayCss));
        const s = o.appendChild(h("div", this.hostCss));
        return new DefaultDialogDom(o, r, s);
    }
}

DefaultDialogDomRenderer.inject = [ e.IPlatform ];

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
        register: r => r.register(...o, e.AppTask.creating((() => t(r.get(u))))),
        customize(t, e) {
            return createDialogConfiguration(t, e ?? o);
        }
    };
}

const D = /*@__PURE__*/ createDialogConfiguration((() => {
    throw createError(`AUR0904`);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(r(u, this));
    }
} ]);

const f = /*@__PURE__*/ createDialogConfiguration(t.noop, [ DialogService, DefaultDialogGlobalSettings, DefaultDialogDomRenderer ]);

exports.DefaultDialogDom = DefaultDialogDom;

exports.DefaultDialogDomRenderer = DefaultDialogDomRenderer;

exports.DefaultDialogGlobalSettings = DefaultDialogGlobalSettings;

exports.DialogCloseResult = DialogCloseResult;

exports.DialogConfiguration = D;

exports.DialogController = DialogController;

exports.DialogDefaultConfiguration = f;

exports.DialogOpenResult = DialogOpenResult;

exports.DialogService = DialogService;

exports.IDialogController = l;

exports.IDialogDom = c;

exports.IDialogDomRenderer = a;

exports.IDialogGlobalSettings = u;

exports.IDialogService = n;
//# sourceMappingURL=index.cjs.map
