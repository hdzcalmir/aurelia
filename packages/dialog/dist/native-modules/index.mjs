import { DI as t, Registration as e, resolve as i, IContainer as s, onResolve as o, InstanceProvider as r, isFunction as n, onResolveAll as l, isPromise as a, noop as c } from "../../../kernel/dist/native-modules/index.mjs";

import { IPlatform as u, IEventTarget as g, INode as D, Controller as f, CustomElementDefinition as d, CustomElement as m, AppTask as p, IWindow as v } from "../../../runtime-html/dist/native-modules/index.mjs";

const C = t.createInterface;

const w = e.singleton;

const E = e.instance;

const R = /*@__PURE__*/ C("IDialogService");

const S = /*@__PURE__*/ C("IDialogController");

const b = /*@__PURE__*/ C("IDialogDomRenderer");

const y = /*@__PURE__*/ C("IDialogDom");

const O = /*@__PURE__*/ C("IDialogKeyboardService");

const P = /*@__PURE__*/ C("IDialogGlobalSettings");

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

const createMappedError = (t, ...e) => new Error(`AUR${String(t).padStart(4, "0")}:${e.map(String)}`);

class DialogController {
    constructor() {
        this.p = i(u);
        this.ctn = i(s);
        this.t = void 0;
        this.closed = new Promise(((t, e) => {
            this.i = t;
            this.u = e;
        }));
    }
    activate(t) {
        const e = this.ctn.createChild();
        const {model: i, template: s, rejectOnCancel: r, renderer: n = e.get(b)} = t;
        const l = t.host ?? this.p.document.body;
        const a = this.dom = n.render(l, t);
        const c = e.has(g, true) ? e.get(g) : null;
        const u = a.contentHost;
        const p = e.get(O);
        this.settings = t;
        if (c == null || !c.contains(l)) {
            e.register(E(g, l));
        }
        e.register(E(D, u), E(y, a));
        return new Promise((s => {
            const o = Object.assign(this.cmp = this.getOrCreateVm(e, t, u), {
                $dialog: this
            });
            s(o.canActivate?.(i) ?? true);
        })).then((t => {
            if (t !== true) {
                a.dispose();
                if (r) {
                    throw createDialogCancelError(null, 905);
                }
                return DialogOpenResult.create(true, this);
            }
            const n = this.cmp;
            return o(n.activate?.(i), (() => {
                const t = this.controller = f.$el(e, n, u, null, d.create(this.getDefinition(n) ?? {
                    name: m.generateName(),
                    template: s
                }));
                return o(t.activate(t, null), (() => {
                    this.t = p.add(this, a);
                    return DialogOpenResult.create(false, this);
                }));
            }));
        }), (t => {
            a.dispose();
            throw t;
        }));
    }
    deactivate(t, e) {
        if (this.h) {
            return this.h;
        }
        let i = true;
        const {controller: s, dom: r, cmp: n, settings: {rejectOnCancel: l}} = this;
        const a = DialogCloseResult.create(t, e);
        const c = new Promise((c => {
            c(o(n.canDeactivate?.(a) ?? true, (c => {
                if (c !== true) {
                    i = false;
                    this.h = void 0;
                    if (l) {
                        throw createDialogCancelError(null, 906);
                    }
                    return DialogCloseResult.create("abort");
                }
                return o(n.deactivate?.(a), (() => o(s.deactivate(s, null), (() => {
                    r.dispose();
                    this.t?.dispose();
                    if (!l && t !== "error") {
                        this.i(a);
                    } else {
                        this.u(createDialogCancelError(e, 907));
                    }
                    return a;
                }))));
            })));
        })).catch((t => {
            this.h = void 0;
            throw t;
        }));
        this.h = i ? c : void 0;
        return c;
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
            this.u(e);
        })))))));
    }
    getOrCreateVm(t, e, i) {
        const s = e.component;
        if (s == null) {
            return new EmptyComponent;
        }
        if (typeof s === "object") {
            return s;
        }
        const o = this.p;
        t.registerResolver(o.HTMLElement, t.registerResolver(o.Element, t.registerResolver(D, new r("ElementResolver", i))));
        return t.invoke(s);
    }
    getDefinition(t) {
        const e = n(t) ? t : t?.constructor;
        return m.isType(e) ? m.getDefinition(e) : null;
    }
}

class EmptyComponent {}

function createDialogCancelError(t, e) {
    const i = createMappedError(e);
    i.wasCancelled = true;
    i.value = t;
    return i;
}

function createDialogCloseError(t) {
    const e = createMappedError(908);
    e.wasCancelled = false;
    e.value = t;
    return e;
}

class DialogService {
    constructor() {
        this.dlgs = [];
        this.C = i(s);
        this.R = i(P);
    }
    static register(t) {
        t.register(w(this, this), e.aliasTo(this, R), p.deactivating(R, (t => o(t.closeAll(), (t => {
            if (t.length > 0) {
                throw createMappedError(901, t.length);
            }
        })))));
    }
    get controllers() {
        return this.dlgs.slice(0);
    }
    open(t) {
        return asDialogOpenPromise(new Promise((e => {
            const i = DialogSettings.from(this.R, t);
            const s = i.container ?? this.C.createChild();
            e(o(i.load(), (t => {
                const e = s.invoke(DialogController);
                s.register(E(S, e), E(DialogController, e));
                return o(e.activate(t), (t => {
                    if (!t.wasCancelled) {
                        this.dlgs.push(e);
                        const $removeController = () => this.remove(e);
                        void e.closed.finally($removeController);
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
        const e = this.dlgs.indexOf(t);
        if (e > -1) {
            this.dlgs.splice(e, 1);
        }
    }
}

class DialogSettings {
    static from(...t) {
        return Object.assign(new DialogSettings, ...t).P().O();
    }
    load() {
        const t = this;
        const e = this.component;
        const i = this.template;
        const s = l(...[ e == null ? void 0 : o(e(), (e => {
            t.component = e;
        })), n(i) ? o(i(), (e => {
            t.template = e;
        })) : void 0 ]);
        return a(s) ? s.then((() => t)) : t;
    }
    P() {
        if (this.component == null && this.template == null) {
            throw createMappedError(903);
        }
        return this;
    }
    O() {
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

class DefaultDialogGlobalSettings {
    constructor() {
        this.lock = true;
        this.startingZIndex = 1e3;
        this.rejectOnCancel = false;
    }
    static register(t) {
        w(P, this).register(t);
    }
}

class DefaultDialogDomRenderer {
    constructor() {
        this.p = i(u);
        this.overlayCss = "position:absolute;width:100%;height:100%;top:0;left:0;";
        this.wrapperCss = `${this.overlayCss} display:flex;`;
        this.hostCss = "position:relative;margin:auto;";
    }
    static register(t) {
        t.register(w(b, this));
    }
    render(t, e) {
        const i = this.p.document;
        const h = (t, e) => {
            const s = i.createElement(t);
            s.style.cssText = e;
            return s;
        };
        const {startingZIndex: s} = e;
        const o = `${this.wrapperCss};${s == null ? "" : `z-index:${s}`}`;
        const r = t.appendChild(h("au-dialog-container", o));
        const n = r.appendChild(h("au-dialog-overlay", this.overlayCss));
        const l = r.appendChild(h("div", this.hostCss));
        return new DefaultDialogDom(r, n, l);
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

class DefaultDialogEventManager {
    constructor() {
        this.ctrls = [];
        this.w = i(v);
    }
    static register(t) {
        w(O, this).register(t);
    }
    add(t, e) {
        if (this.ctrls.push(t) === 1) {
            this.w.addEventListener("keydown", this);
        }
        const i = t.settings.mouseEvent ?? "click";
        const handleClick = i => {
            if (t.settings.overlayDismiss && !e.contentHost.contains(i.target)) {
                void t.cancel();
            }
        };
        e.overlay.addEventListener(i, handleClick);
        return {
            dispose: () => {
                this.I(t);
                e.overlay.removeEventListener(i, handleClick);
            }
        };
    }
    I(t) {
        const e = this.ctrls;
        const i = e.indexOf(t);
        if (i !== -1) {
            e.splice(i, 1);
        }
        if (e.length === 0) {
            this.w.removeEventListener("keydown", this);
        }
    }
    handleEvent(t) {
        const e = t;
        const i = getActionKey(e);
        if (i == null) {
            return;
        }
        const s = this.ctrls.slice(-1)[0];
        if (s == null || s.settings.keyboard.length === 0) {
            return;
        }
        const o = s.settings.keyboard;
        if (i === "Escape" && o.includes(i)) {
            void s.cancel();
        } else if (i === "Enter" && o.includes(i)) {
            void s.ok();
        }
    }
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

function createDialogConfiguration(t, e) {
    return {
        settingsProvider: t,
        register: i => i.register(...e, p.creating((() => t(i.get(P))))),
        customize(t, i) {
            return createDialogConfiguration(t, i ?? e);
        }
    };
}

const I = /*@__PURE__*/ createDialogConfiguration((() => {
    throw createMappedError(904);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(w(P, this));
    }
} ]);

const $ = /*@__PURE__*/ createDialogConfiguration(c, [ DialogService, DefaultDialogGlobalSettings, DefaultDialogDomRenderer, DefaultDialogEventManager ]);

export { DefaultDialogDom, DefaultDialogDomRenderer, DefaultDialogEventManager, DefaultDialogGlobalSettings, DialogCloseResult, I as DialogConfiguration, DialogController, $ as DialogDefaultConfiguration, DialogOpenResult, DialogService, S as IDialogController, y as IDialogDom, b as IDialogDomRenderer, P as IDialogGlobalSettings, R as IDialogService };

