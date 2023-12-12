import { DI as e, Registration as r } from "../../../@aurelia/kernel/dist/native-modules/index.mjs";

export { ColorOptions, ConsoleSink, DI, EventAggregator, IContainer, IEventAggregator, ILogger, IServiceLocator, InstanceProvider, LogLevel, LoggerConfiguration, Registration, all, bound, camelCase, emptyArray, emptyObject, inject, isArrayIndex, kebabCase, lazy, noop, optional, pascalCase, resolve, singleton, toArray, transient } from "../../../@aurelia/kernel/dist/native-modules/index.mjs";

import { Aurelia as t, CustomElement as o, IPlatform as a, StandardConfiguration as n } from "../../../@aurelia/runtime-html/dist/native-modules/index.mjs";

export { AppTask, AuSlotsInfo, Bindable, BindingBehavior, BindingMode, ChildrenBinding, Controller, CustomAttribute, CustomElement, FlushQueue, IAppRoot, IAttrMapper, IAttributePattern, IAuSlotWatcher, IAuSlotsInfo, IAurelia, IEventTarget, IFlushQueue, ILifecycleHooks, INode, IPlatform, IRenderLocation, ITemplateCompiler, ITemplateCompilerHooks, LifecycleHooks, NodeObserverLocator, ShortHandBindingSyntax, StyleConfiguration, TemplateCompilerHooks, ValueConverter, ViewFactory, alias, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, cssModules, customAttribute, customElement, lifecycleHooks, registerAliases, renderer, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter } from "../../../@aurelia/runtime-html/dist/native-modules/index.mjs";

import { BrowserPlatform as i } from "../../../@aurelia/platform-browser/dist/native-modules/index.mjs";

export { HttpClient, HttpClientConfiguration, IHttpClient, json } from "../../../@aurelia/fetch-client/dist/native-modules/index.mjs";

export { Metadata } from "../../../@aurelia/metadata/dist/native-modules/index.mjs";

export { Platform, Task, TaskAbortError, TaskQueue, TaskQueuePriority, TaskStatus } from "../../../@aurelia/platform/dist/native-modules/index.mjs";

export { CollectionKind, ComputedObserver, IObserverLocator, ISignaler, batch, observable, subscriberCollection } from "../../../@aurelia/runtime/dist/native-modules/index.mjs";

const l = i.getOrCreate(globalThis);

function createContainer() {
    return e.createContainer().register(r.instance(a, l), n);
}

class Aurelia extends t {
    constructor(e = createContainer()) {
        super(e);
    }
    static start(e) {
        return (new Aurelia).start(e);
    }
    static app(e) {
        return (new Aurelia).app(e);
    }
    static enhance(e, r) {
        return (new Aurelia).enhance(e, r);
    }
    static register(...e) {
        return (new Aurelia).register(...e);
    }
    app(e) {
        if (o.isType(e)) {
            const r = o.getDefinition(e);
            let t = document.querySelector(r.name);
            if (t === null) {
                t = document.body;
            }
            return super.app({
                host: t,
                component: e
            });
        }
        return super.app(e);
    }
}

export { Aurelia, l as PLATFORM, Aurelia as default };

