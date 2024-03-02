import { DI as e, Registration as r } from "@aurelia/kernel";

export { ConsoleSink, DI, EventAggregator, IContainer, IEventAggregator, ILogger, IServiceLocator, InstanceProvider, LogLevel, LoggerConfiguration, Registration, all, bound, camelCase, emptyArray, emptyObject, inject, isArrayIndex, kebabCase, lazy, noop, optional, pascalCase, resolve, singleton, toArray, transient } from "@aurelia/kernel";

import { Aurelia as t, CustomElement as o, IPlatform as a, StandardConfiguration as n } from "@aurelia/runtime-html";

export { AppTask, AuSlotsInfo, Bindable, BindingBehavior, BindingMode, ChildrenBinding, Controller, CustomAttribute, CustomElement, FlushQueue, IAppRoot, IAttrMapper, IAttributePattern, IAuSlotWatcher, IAuSlotsInfo, IAurelia, IEventModifier, IEventTarget, IFlushQueue, IKeyMapping, ILifecycleHooks, IModifiedEventHandlerCreator, INode, IPlatform, IRenderLocation, ITemplateCompiler, ITemplateCompilerHooks, LifecycleHooks, NodeObserverLocator, ShortHandBindingSyntax, StyleConfiguration, TemplateCompilerHooks, ValueConverter, ViewFactory, alias, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, cssModules, customAttribute, customElement, lifecycleHooks, processContent, registerAliases, renderer, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch } from "@aurelia/runtime-html";

import { BrowserPlatform as i } from "@aurelia/platform-browser";

export { HttpClient, HttpClientConfiguration, IFetchFn, IHttpClient, json } from "@aurelia/fetch-client";

export { Metadata } from "@aurelia/metadata";

export { Platform, Task, TaskAbortError, TaskQueue } from "@aurelia/platform";

export { ComputedObserver, IObserverLocator, ISignaler, batch, observable, subscriberCollection } from "@aurelia/runtime";

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
    static enhance(e) {
        return (new Aurelia).enhance(e);
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
//# sourceMappingURL=index.mjs.map
