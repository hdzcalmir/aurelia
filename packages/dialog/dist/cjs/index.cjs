"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var e = require("@aurelia/runtime-html");

const s = t.DI.createInterface;

const i = t.Registration.singleton;

const o = t.Registration.instance;

const r = t.Registration.callback;

const n = s("IDialogService");

const l = s("IDialogController");

const c = s("IDialogDomRenderer");

const a = s("IDialogDom");

const u = s("IDialogGlobalSettings");

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

const h = t => new Error(t);

const g = t => t instanceof Promise;

const D = t => "function" === typeof t;

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
        return [ e.IPlatform, t.IContainer ];
    }
    activate(s) {
        const i = this.ctn.createChild();
        const {model: r, template: n, rejectOnCancel: l} = s;
        const u = i.get(c);
        const h = s.host ?? this.p.document.body;
        const g = this.dom = u.render(h, s);
        const D = i.has(e.IEventTarget, true) ? i.get(e.IEventTarget) : null;
        const p = g.contentHost;
        this.settings = s;
        if (null == D || !D.contains(h)) i.register(o(e.IEventTarget, h));
        i.register(o(e.INode, p), o(a, g));
        return new Promise((t => {
            const e = Object.assign(this.cmp = this.getOrCreateVm(i, s, p), {
                $dialog: this
            });
            t(e.canActivate?.(r) ?? true);
        })).then((o => {
            if (true !== o) {
                g.dispose();
                if (l) throw f(null, "Dialog activation rejected");
                return DialogOpenResult.create(true, this);
            }
            const c = this.cmp;
            return t.onResolve(c.activate?.(r), (() => {
                const o = this.controller = e.Controller.$el(i, c, p, null, e.CustomElementDefinition.create(this.getDefinition(c) ?? {
                    name: e.CustomElement.generateName(),
                    template: n
                }));
                return t.onResolve(o.activate(o, null, 1), (() => {
                    g.overlay.addEventListener(s.mouseEvent ?? "click", this);
                    return DialogOpenResult.create(false, this);
                }));
            }));
        }), (t => {
            g.dispose();
            throw t;
        }));
    }
    deactivate(e, s) {
        if (this.u) return this.u;
        let i = true;
        const {controller: o, dom: r, cmp: n, settings: {mouseEvent: l, rejectOnCancel: c}} = this;
        const a = DialogCloseResult.create(e, s);
        const u = new Promise((u => {
            u(t.onResolve(n.canDeactivate?.(a) ?? true, (u => {
                if (true !== u) {
                    i = false;
                    this.u = void 0;
                    if (c) throw f(null, "Dialog cancellation rejected");
                    return DialogCloseResult.create("abort");
                }
                return t.onResolve(n.deactivate?.(a), (() => t.onResolve(o.deactivate(o, null, 2), (() => {
                    r.dispose();
                    r.overlay.removeEventListener(l ?? "click", this);
                    if (!c && "error" !== e) this.t(a); else this.i(f(s, "Dialog cancelled with a rejection on cancel"));
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
    error(e) {
        const s = p(e);
        return new Promise((e => e(t.onResolve(this.cmp.deactivate?.(DialogCloseResult.create("error", s)), (() => t.onResolve(this.controller.deactivate(this.controller, null, 2), (() => {
            this.dom.dispose();
            this.i(s);
        })))))));
    }
    handleEvent(t) {
        if (this.settings.overlayDismiss && !this.dom.contentHost.contains(t.target)) this.cancel();
    }
    getOrCreateVm(s, i, o) {
        const r = i.component;
        if (null == r) return new EmptyComponent;
        if ("object" === typeof r) return r;
        const n = this.p;
        s.registerResolver(n.HTMLElement, s.registerResolver(n.Element, s.registerResolver(e.INode, new t.InstanceProvider("ElementResolver", o))));
        return s.invoke(r);
    }
    getDefinition(t) {
        const s = D(t) ? t : t?.constructor;
        return e.CustomElement.isType(s) ? e.CustomElement.getDefinition(s) : null;
    }
}

class EmptyComponent {}

function f(t, e) {
    const s = h(e);
    s.wasCancelled = true;
    s.value = t;
    return s;
}

function p(t) {
    const e = h("");
    e.wasCancelled = false;
    e.value = t;
    return e;
}

class DialogService {
    constructor(t, e, s) {
        this.h = t;
        this.p = e;
        this.R = s;
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
        return [ t.IContainer, e.IPlatform, u ];
    }
    static register(s) {
        s.register(i(n, this), e.AppTask.deactivating(n, (e => t.onResolve(e.closeAll(), (t => {
            if (t.length > 0) throw h(`AUR0901:${t.length}`);
        })))));
    }
    open(e) {
        return d(new Promise((s => {
            const i = DialogSettings.from(this.R, e);
            const n = i.container ?? this.h.createChild();
            s(t.onResolve(i.load(), (e => {
                const s = n.invoke(DialogController);
                n.register(o(l, s));
                n.register(r(DialogController, (() => {
                    throw h(`AUR0902`);
                })));
                return t.onResolve(s.activate(e), (t => {
                    if (!t.wasCancelled) {
                        if (1 === this.dlgs.push(s)) this.p.window.addEventListener("keydown", this);
                        const t = () => this.remove(s);
                        s.closed.then(t, t);
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
        const s = e.indexOf(t);
        if (s > -1) this.dlgs.splice(s, 1);
        if (0 === e.length) this.p.window.removeEventListener("keydown", this);
    }
    handleEvent(t) {
        const e = t;
        const s = v(e);
        if (null == s) return;
        const i = this.top;
        if (null === i || 0 === i.settings.keyboard.length) return;
        const o = i.settings.keyboard;
        if ("Escape" === s && o.includes(s)) void i.cancel(); else if ("Enter" === s && o.includes(s)) void i.ok();
    }
}

class DialogSettings {
    static from(...t) {
        return Object.assign(new DialogSettings, ...t).j().C();
    }
    load() {
        const e = this;
        const s = this.component;
        const i = this.template;
        const o = t.resolveAll(null == s ? void 0 : t.onResolve(s(), (t => {
            e.component = t;
        })), D(i) ? t.onResolve(i(), (t => {
            e.template = t;
        })) : void 0);
        return g(o) ? o.then((() => e)) : e;
    }
    j() {
        if (null == this.component && null == this.template) throw h(`AUR0903`);
        return this;
    }
    C() {
        if (null == this.keyboard) this.keyboard = this.lock ? [] : [ "Enter", "Escape" ];
        if ("boolean" !== typeof this.overlayDismiss) this.overlayDismiss = !this.lock;
        return this;
    }
}

function m(t, e) {
    return this.then((s => s.dialog.closed.then(t, e)), e);
}

function d(t) {
    t.whenClosed = m;
    return t;
}

function v(t) {
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
        i(u, this).register(t);
    }
}

const w = "position:absolute;width:100%;height:100%;top:0;left:0;";

class DefaultDialogDomRenderer {
    constructor(t) {
        this.p = t;
        this.wrapperCss = `${w} display:flex;`;
        this.overlayCss = w;
        this.hostCss = "position:relative;margin:auto;";
    }
    static register(t) {
        i(c, this).register(t);
    }
    render(t) {
        const e = this.p.document;
        const s = (t, s) => {
            const i = e.createElement(t);
            i.style.cssText = s;
            return i;
        };
        const i = t.appendChild(s("au-dialog-container", this.wrapperCss));
        const o = i.appendChild(s("au-dialog-overlay", this.overlayCss));
        const r = i.appendChild(s("div", this.hostCss));
        return new DefaultDialogDom(i, o, r);
    }
}

DefaultDialogDomRenderer.inject = [ e.IPlatform ];

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

function R(t, s) {
    return {
        settingsProvider: t,
        register: i => i.register(...s, e.AppTask.creating((() => t(i.get(u))))),
        customize(t, e) {
            return R(t, e ?? s);
        }
    };
}

const x = R((() => {
    throw h(`AUR0904`);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(i(u, this));
    }
} ]);

const C = R(t.noop, [ DialogService, DefaultDialogGlobalSettings, DefaultDialogDomRenderer ]);

exports.DefaultDialogDom = DefaultDialogDom;

exports.DefaultDialogDomRenderer = DefaultDialogDomRenderer;

exports.DefaultDialogGlobalSettings = DefaultDialogGlobalSettings;

exports.DialogCloseResult = DialogCloseResult;

exports.DialogConfiguration = x;

exports.DialogController = DialogController;

exports.DialogDefaultConfiguration = C;

exports.DialogOpenResult = DialogOpenResult;

exports.DialogService = DialogService;

exports.IDialogController = l;

exports.IDialogDom = a;

exports.IDialogDomRenderer = c;

exports.IDialogGlobalSettings = u;

exports.IDialogService = n;
//# sourceMappingURL=index.cjs.map
