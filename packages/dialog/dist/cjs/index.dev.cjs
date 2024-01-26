'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var runtimeHtml = require('@aurelia/runtime-html');

/** @internal */
const createInterface = kernel.DI.createInterface;
/** @internal */
const singletonRegistration = kernel.Registration.singleton;
/** @internal */
const instanceRegistration = kernel.Registration.instance;
/** @internal */
kernel.Registration.callback;

/**
 * The dialog service for composing view & view model into a dialog
 */
const IDialogService = /*@__PURE__*/ createInterface('IDialogService');
/**
 * The controller asscociated with every dialog view model
 */
const IDialogController = /*@__PURE__*/ createInterface('IDialogController');
/**
 * An interface describing the object responsible for creating the dom structure of a dialog
 */
const IDialogDomRenderer = /*@__PURE__*/ createInterface('IDialogDomRenderer');
/**
 * An interface describing the DOM structure of a dialog
 */
const IDialogDom = /*@__PURE__*/ createInterface('IDialogDom');
const IDialogGlobalSettings = /*@__PURE__*/ createInterface('IDialogGlobalSettings');
class DialogOpenResult {
    constructor(wasCancelled, dialog) {
        this.wasCancelled = wasCancelled;
        this.dialog = dialog;
    }
    static create(wasCancelled, dialog) {
        return new DialogOpenResult(wasCancelled, dialog);
    }
}
class DialogCloseResult {
    constructor(status, value) {
        this.status = status;
        this.value = value;
    }
    static create(status, value) {
        return new DialogCloseResult(status, value);
    }
}
// #endregion

/** @internal */ const createError = (message) => new Error(message);
/** @internal */ const isPromise = (v) => v instanceof Promise;
// eslint-disable-next-line @typescript-eslint/ban-types
/** @internal */ const isFunction = (v) => typeof v === 'function';

/**
 * A controller object for a Dialog instance.
 */
class DialogController {
    static get inject() { return [runtimeHtml.IPlatform, kernel.IContainer]; }
    constructor(p, container) {
        this.p = p;
        this.ctn = container;
        this.closed = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    /** @internal */
    activate(settings) {
        const container = this.ctn.createChild();
        const { model, template, rejectOnCancel } = settings;
        const hostRenderer = container.get(IDialogDomRenderer);
        const dialogTargetHost = settings.host ?? this.p.document.body;
        const dom = this.dom = hostRenderer.render(dialogTargetHost, settings);
        const rootEventTarget = container.has(runtimeHtml.IEventTarget, true)
            ? container.get(runtimeHtml.IEventTarget)
            : null;
        const contentHost = dom.contentHost;
        this.settings = settings;
        // application root host may be a different element with the dialog root host
        // example:
        // <body>
        //   <my-app>
        //   <au-dialog-container>
        // when it's different, needs to ensure delegate bindings work
        if (rootEventTarget == null || !rootEventTarget.contains(dialogTargetHost)) {
            container.register(instanceRegistration(runtimeHtml.IEventTarget, dialogTargetHost));
        }
        container.register(instanceRegistration(runtimeHtml.INode, contentHost), instanceRegistration(IDialogDom, dom));
        return new Promise(r => {
            const cmp = Object.assign(this.cmp = this.getOrCreateVm(container, settings, contentHost), { $dialog: this });
            r(cmp.canActivate?.(model) ?? true);
        })
            .then(canActivate => {
            if (canActivate !== true) {
                dom.dispose();
                if (rejectOnCancel) {
                    throw createDialogCancelError(null, 'Dialog activation rejected');
                }
                return DialogOpenResult.create(true, this);
            }
            const cmp = this.cmp;
            return kernel.onResolve(cmp.activate?.(model), () => {
                const ctrlr = this.controller = runtimeHtml.Controller.$el(container, cmp, contentHost, null, runtimeHtml.CustomElementDefinition.create(this.getDefinition(cmp) ?? { name: runtimeHtml.CustomElement.generateName(), template }));
                return kernel.onResolve(ctrlr.activate(ctrlr, null), () => {
                    dom.overlay.addEventListener(settings.mouseEvent ?? 'click', this);
                    return DialogOpenResult.create(false, this);
                });
            });
        }, e => {
            dom.dispose();
            throw e;
        });
    }
    /** @internal */
    deactivate(status, value) {
        if (this._closingPromise) {
            return this._closingPromise;
        }
        let deactivating = true;
        const { controller, dom, cmp, settings: { mouseEvent, rejectOnCancel } } = this;
        const dialogResult = DialogCloseResult.create(status, value);
        const promise = new Promise(r => {
            r(kernel.onResolve(cmp.canDeactivate?.(dialogResult) ?? true, canDeactivate => {
                if (canDeactivate !== true) {
                    // we are done, do not block consecutive calls
                    deactivating = false;
                    this._closingPromise = void 0;
                    if (rejectOnCancel) {
                        throw createDialogCancelError(null, 'Dialog cancellation rejected');
                    }
                    return DialogCloseResult.create('abort');
                }
                return kernel.onResolve(cmp.deactivate?.(dialogResult), () => kernel.onResolve(controller.deactivate(controller, null), () => {
                    dom.dispose();
                    dom.overlay.removeEventListener(mouseEvent ?? 'click', this);
                    if (!rejectOnCancel && status !== 'error') {
                        this._resolve(dialogResult);
                    }
                    else {
                        this._reject(createDialogCancelError(value, 'Dialog cancelled with a rejection on cancel'));
                    }
                    return dialogResult;
                }));
            }));
        }).catch(reason => {
            this._closingPromise = void 0;
            throw reason;
        });
        // when component canDeactivate is synchronous, and returns something other than true
        // then the below assignment will override
        // the assignment inside the callback without the deactivating variable check
        this._closingPromise = deactivating ? promise : void 0;
        return promise;
    }
    /**
     * Closes the dialog with a successful output.
     *
     * @param value - The returned success output.
     */
    ok(value) {
        return this.deactivate('ok', value);
    }
    /**
     * Closes the dialog with a cancel output.
     *
     * @param value - The returned cancel output.
     */
    cancel(value) {
        return this.deactivate('cancel', value);
    }
    /**
     * Closes the dialog with an error output.
     *
     * @param value - A reason for closing with an error.
     * @returns Promise An empty promise object.
     */
    error(value) {
        const closeError = createDialogCloseError(value);
        return new Promise(r => r(kernel.onResolve(this.cmp.deactivate?.(DialogCloseResult.create('error', closeError)), () => kernel.onResolve(this.controller.deactivate(this.controller, null), () => {
            this.dom.dispose();
            this._reject(closeError);
        }))));
    }
    /** @internal */
    handleEvent(event) {
        if ( /* user allows dismiss on overlay click */this.settings.overlayDismiss
            && /* did not click inside the host element */ !this.dom.contentHost.contains(event.target)) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.cancel();
        }
    }
    getOrCreateVm(container, settings, host) {
        const Component = settings.component;
        if (Component == null) {
            return new EmptyComponent();
        }
        if (typeof Component === 'object') {
            return Component;
        }
        const p = this.p;
        container.registerResolver(p.HTMLElement, container.registerResolver(p.Element, container.registerResolver(runtimeHtml.INode, new kernel.InstanceProvider('ElementResolver', host))));
        return container.invoke(Component);
    }
    getDefinition(component) {
        const Ctor = (isFunction(component)
            ? component
            : component?.constructor);
        return runtimeHtml.CustomElement.isType(Ctor)
            ? runtimeHtml.CustomElement.getDefinition(Ctor)
            : null;
    }
}
class EmptyComponent {
}
function createDialogCancelError(output, msg) {
    const error = createError(msg);
    error.wasCancelled = true;
    error.value = output;
    return error;
}
function createDialogCloseError(output) {
    const error = createError('');
    error.wasCancelled = false;
    error.value = output;
    return error;
}

/**
 * A default implementation for the dialog service allowing for the creation of dialogs.
 */
class DialogService {
    constructor() {
        /**
         * The current dialog controllers
         *
         * @internal
         */
        this.dlgs = [];
        /** @internal */ this._ctn = kernel.resolve(kernel.IContainer);
        /** @internal */ this.p = kernel.resolve(runtimeHtml.IPlatform);
        /** @internal */ this._defaultSettings = kernel.resolve(IDialogGlobalSettings);
    }
    static register(container) {
        container.register(singletonRegistration(this, this), kernel.Registration.aliasTo(this, IDialogService), runtimeHtml.AppTask.deactivating(IDialogService, dialogService => kernel.onResolve(dialogService.closeAll(), (openDialogController) => {
            if (openDialogController.length > 0) {
                // todo: what to do?
                throw createError(`AUR0901: There are still ${openDialogController.length} open dialog(s).`);
            }
        })));
    }
    get controllers() {
        return this.dlgs.slice(0);
    }
    get top() {
        const dlgs = this.dlgs;
        return dlgs.length > 0 ? dlgs[dlgs.length - 1] : null;
    }
    /**
     * Opens a new dialog.
     *
     * @param settings - Dialog settings for this dialog instance.
     * @returns A promise that settles when the dialog is closed.
     *
     * Example usage:
     * ```ts
     * dialogService.open({ component: () => MyDialog, template: 'my-template' })
     * dialogService.open({ component: () => MyDialog, template: document.createElement('my-template') })
     *
     * // JSX to hyperscript
     * dialogService.open({ component: () => MyDialog, template: <my-template /> })
     *
     * dialogService.open({ component: () => import('...'), template: () => fetch('my.server/dialog-view.html') })
     * ```
     */
    open(settings) {
        return asDialogOpenPromise(new Promise(resolve => {
            const $settings = DialogSettings.from(this._defaultSettings, settings);
            const container = $settings.container ?? this._ctn.createChild();
            resolve(kernel.onResolve($settings.load(), loadedSettings => {
                const dialogController = container.invoke(DialogController);
                container.register(instanceRegistration(IDialogController, dialogController), instanceRegistration(DialogController, dialogController));
                return kernel.onResolve(dialogController.activate(loadedSettings), openResult => {
                    if (!openResult.wasCancelled) {
                        if (this.dlgs.push(dialogController) === 1) {
                            this.p.window.addEventListener('keydown', this);
                        }
                        const $removeController = () => this.remove(dialogController);
                        dialogController.closed.then($removeController, $removeController);
                    }
                    return openResult;
                });
            }));
        }));
    }
    /**
     * Closes all open dialogs at the time of invocation.
     *
     * @returns All controllers whose close operation was cancelled.
     */
    closeAll() {
        return Promise
            .all(Array.from(this.dlgs)
            .map(controller => {
            if (controller.settings.rejectOnCancel) {
                // this will throw when calling cancel
                // so only leave return null as noop
                return controller.cancel().then(() => null);
            }
            return controller.cancel().then(result => result.status === 'cancel'
                ? null
                : controller);
        }))
            .then(unclosedControllers => unclosedControllers.filter(unclosed => !!unclosed));
    }
    /** @internal */
    remove(controller) {
        const dlgs = this.dlgs;
        const idx = dlgs.indexOf(controller);
        if (idx > -1) {
            this.dlgs.splice(idx, 1);
        }
        if (dlgs.length === 0) {
            this.p.window.removeEventListener('keydown', this);
        }
    }
    /** @internal */
    handleEvent(e) {
        const keyEvent = e;
        const key = getActionKey(keyEvent);
        if (key == null) {
            return;
        }
        const top = this.top;
        if (top === null || top.settings.keyboard.length === 0) {
            return;
        }
        const keyboard = top.settings.keyboard;
        if (key === 'Escape' && keyboard.includes(key)) {
            void top.cancel();
        }
        else if (key === 'Enter' && keyboard.includes(key)) {
            void top.ok();
        }
    }
}
class DialogSettings {
    static from(...srcs) {
        return Object.assign(new DialogSettings(), ...srcs)
            ._validate()
            ._normalize();
    }
    load() {
        const loaded = this;
        const cmp = this.component;
        const template = this.template;
        const maybePromise = kernel.onResolveAll(...[
            cmp == null
                ? void 0
                : kernel.onResolve(cmp(), loadedCmp => { loaded.component = loadedCmp; }),
            isFunction(template)
                ? kernel.onResolve(template(), loadedTpl => { loaded.template = loadedTpl; })
                : void 0
        ]);
        return isPromise(maybePromise)
            ? maybePromise.then(() => loaded)
            : loaded;
    }
    /** @internal */
    _validate() {
        if (this.component == null && this.template == null) {
            throw createError(`AUR0903: Invalid Dialog Settings. You must provide "component", "template" or both.`);
        }
        return this;
    }
    /** @internal */
    _normalize() {
        if (this.keyboard == null) {
            this.keyboard = this.lock ? [] : ['Enter', 'Escape'];
        }
        if (typeof this.overlayDismiss !== 'boolean') {
            this.overlayDismiss = !this.lock;
        }
        return this;
    }
}
function whenClosed(onfulfilled, onrejected) {
    return this.then(openResult => openResult.dialog.closed.then(onfulfilled, onrejected), onrejected);
}
function asDialogOpenPromise(promise) {
    promise.whenClosed = whenClosed;
    return promise;
}
function getActionKey(e) {
    if ((e.code || e.key) === 'Escape' || e.keyCode === 27) {
        return 'Escape';
    }
    if ((e.code || e.key) === 'Enter' || e.keyCode === 13) {
        return 'Enter';
    }
    return undefined;
}

class DefaultDialogGlobalSettings {
    constructor() {
        this.lock = true;
        this.startingZIndex = 1000;
        this.rejectOnCancel = false;
    }
    static register(container) {
        singletonRegistration(IDialogGlobalSettings, this).register(container);
    }
}
const baseWrapperCss = 'position:absolute;width:100%;height:100%;top:0;left:0;';
class DefaultDialogDomRenderer {
    constructor() {
        this.p = kernel.resolve(runtimeHtml.IPlatform);
        this.wrapperCss = `${baseWrapperCss} display:flex;`;
        this.overlayCss = baseWrapperCss;
        this.hostCss = 'position:relative;margin:auto;';
    }
    static register(container) {
        container.register(singletonRegistration(IDialogDomRenderer, this));
    }
    render(dialogHost, settings) {
        const doc = this.p.document;
        const h = (name, css) => {
            const el = doc.createElement(name);
            el.style.cssText = css;
            return el;
        };
        const { startingZIndex } = settings;
        const wrapperCss = `${this.wrapperCss};${startingZIndex == null ? '' : `z-index:${startingZIndex}`}`;
        const wrapper = dialogHost.appendChild(h('au-dialog-container', wrapperCss));
        const overlay = wrapper.appendChild(h('au-dialog-overlay', this.overlayCss));
        const host = wrapper.appendChild(h('div', this.hostCss));
        return new DefaultDialogDom(wrapper, overlay, host);
    }
}
class DefaultDialogDom {
    constructor(wrapper, overlay, contentHost) {
        this.wrapper = wrapper;
        this.overlay = overlay;
        this.contentHost = contentHost;
    }
    dispose() {
        this.wrapper.remove();
    }
}

function createDialogConfiguration(settingsProvider, registrations) {
    return {
        settingsProvider: settingsProvider,
        register: (ctn) => ctn.register(...registrations, runtimeHtml.AppTask.creating(() => settingsProvider(ctn.get(IDialogGlobalSettings)))),
        customize(cb, regs) {
            return createDialogConfiguration(cb, regs ?? registrations);
        },
    };
}
/**
 * A noop configuration for Dialog, should be used as:
```ts
DialogConfiguration.customize(settings => {
  // adjust default value of the settings
}, [all_implementations_here])
```
 */
const DialogConfiguration = /*@__PURE__*/ createDialogConfiguration(() => {
    throw createError(`AUR0904: Invalid dialog configuration. ` +
            'Specify the implementations for ' +
            '<IDialogService>, <IDialogGlobalSettings> and <IDialogDomRenderer>, ' +
            'or use the DialogDefaultConfiguration export.');
}, [class NoopDialogGlobalSettings {
        static register(container) {
            container.register(singletonRegistration(IDialogGlobalSettings, this));
        }
    }]);
const DialogDefaultConfiguration = /*@__PURE__*/ createDialogConfiguration(kernel.noop, [
    DialogService,
    DefaultDialogGlobalSettings,
    DefaultDialogDomRenderer,
]);

exports.DefaultDialogDom = DefaultDialogDom;
exports.DefaultDialogDomRenderer = DefaultDialogDomRenderer;
exports.DefaultDialogGlobalSettings = DefaultDialogGlobalSettings;
exports.DialogCloseResult = DialogCloseResult;
exports.DialogConfiguration = DialogConfiguration;
exports.DialogController = DialogController;
exports.DialogDefaultConfiguration = DialogDefaultConfiguration;
exports.DialogOpenResult = DialogOpenResult;
exports.DialogService = DialogService;
exports.IDialogController = IDialogController;
exports.IDialogDom = IDialogDom;
exports.IDialogDomRenderer = IDialogDomRenderer;
exports.IDialogGlobalSettings = IDialogGlobalSettings;
exports.IDialogService = IDialogService;
//# sourceMappingURL=index.dev.cjs.map
