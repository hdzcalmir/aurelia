import { DI as e, Registration as r } from "@aurelia/kernel";

export { ConsoleSink, DI, EventAggregator, IContainer, IEventAggregator, ILogger, IServiceLocator, InstanceProvider, LogLevel, LoggerConfiguration, Registration, all, allResources, bound, camelCase, emptyArray, emptyObject, factory, ignore, inject, isArrayIndex, kebabCase, lazy, newInstanceForScope, newInstanceOf, noop, optional, pascalCase, resolve, resource, singleton, toArray, transient } from "@aurelia/kernel";

import { Aurelia as o, CustomElement as t, IPlatform as a, StandardConfiguration as n } from "@aurelia/runtime-html";

export { AppTask, AuSlotsInfo, Bindable, BindingBehavior, BindingMode, ChildrenBinding, Controller, CustomAttribute, CustomElement, FlushQueue, IAppRoot, IAttrMapper, IAttributePattern, IAuSlotWatcher, IAuSlotsInfo, IAurelia, IController, IEventModifier, IEventTarget, IFlushQueue, IKeyMapping, ILifecycleHooks, IModifiedEventHandlerCreator, INode, IPlatform, IRenderLocation, ISignaler, ITemplateCompiler, ITemplateCompilerHooks, IViewFactory, LifecycleHooks, NodeObserverLocator, Scope, ShortHandBindingSyntax, StyleConfiguration, TemplateCompilerHooks, ValueConverter, ViewFactory, alias, attributePattern, bindable, bindingBehavior, bindingCommand, capture, children, coercer, containerless, cssModules, customAttribute, customElement, lifecycleHooks, processContent, registerAliases, renderer, shadowCSS, slotted, templateCompilerHooks, templateController, useShadowDOM, valueConverter, watch } from "@aurelia/runtime-html";

import { BrowserPlatform as i } from "@aurelia/platform-browser";

export { Platform, Task, TaskAbortError, TaskQueue } from "@aurelia/platform";

export { CustomExpression, IExpressionParser } from "@aurelia/expression-parser";

export { ComputedObserver, IObserverLocator, batch, observable, subscriberCollection } from "@aurelia/runtime";

const l = i.getOrCreate(globalThis);

function createContainer() {
    return e.createContainer().register(r.instance(a, l), n);
}

class Aurelia extends o {
    constructor(e = createContainer()) {
        super(e);
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
        if (t.isType(e)) {
            const r = t.getDefinition(e);
            let o = document.querySelector(r.name);
            if (o === null) {
                o = document.body;
            }
            return super.app({
                host: o,
                component: e
            });
        }
        return super.app(e);
    }
}

export { Aurelia, l as PLATFORM, Aurelia as default };
//# sourceMappingURL=index.mjs.map
