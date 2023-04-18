'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var runtimeHtml = require('@aurelia/runtime-html');
var platformBrowser = require('@aurelia/platform-browser');
var fetchClient = require('@aurelia/fetch-client');
var metadata = require('@aurelia/metadata');
var platform = require('@aurelia/platform');
var runtime = require('@aurelia/runtime');

const PLATFORM = platformBrowser.BrowserPlatform.getOrCreate(globalThis);
function createContainer() {
    return kernel.DI.createContainer()
        .register(kernel.Registration.instance(runtimeHtml.IPlatform, PLATFORM), runtimeHtml.StandardConfiguration);
}
class Aurelia extends runtimeHtml.Aurelia {
    constructor(container = createContainer()) {
        super(container);
    }
    static start(root) {
        return new Aurelia().start(root);
    }
    static app(config) {
        return new Aurelia().app(config);
    }
    static enhance(config, parentController) {
        return new Aurelia().enhance(config, parentController);
    }
    static register(...params) {
        return new Aurelia().register(...params);
    }
    app(config) {
        if (runtimeHtml.CustomElement.isType(config)) {
            // Default to custom element element name
            const definition = runtimeHtml.CustomElement.getDefinition(config);
            let host = document.querySelector(definition.name);
            if (host === null) {
                // When no target is found, default to body.
                // For example, when user forgot to write <my-app></my-app> in html.
                host = document.body;
            }
            return super.app({
                host: host,
                component: config
            });
        }
        return super.app(config);
    }
}

exports.ColorOptions = kernel.ColorOptions;
exports.ConsoleSink = kernel.ConsoleSink;
exports.DI = kernel.DI;
exports.EventAggregator = kernel.EventAggregator;
exports.IContainer = kernel.IContainer;
exports.IEventAggregator = kernel.IEventAggregator;
exports.ILogger = kernel.ILogger;
exports.IServiceLocator = kernel.IServiceLocator;
exports.InstanceProvider = kernel.InstanceProvider;
exports.LogLevel = kernel.LogLevel;
exports.LoggerConfiguration = kernel.LoggerConfiguration;
exports.Registration = kernel.Registration;
exports.all = kernel.all;
exports.bound = kernel.bound;
exports.camelCase = kernel.camelCase;
exports.emptyArray = kernel.emptyArray;
exports.emptyObject = kernel.emptyObject;
exports.inject = kernel.inject;
exports.isArrayIndex = kernel.isArrayIndex;
exports.kebabCase = kernel.kebabCase;
exports.lazy = kernel.lazy;
exports.noop = kernel.noop;
exports.optional = kernel.optional;
exports.pascalCase = kernel.pascalCase;
exports.singleton = kernel.singleton;
exports.toArray = kernel.toArray;
exports.transient = kernel.transient;
exports.AppTask = runtimeHtml.AppTask;
exports.AuSlotsInfo = runtimeHtml.AuSlotsInfo;
exports.Bindable = runtimeHtml.Bindable;
exports.BindingBehavior = runtimeHtml.BindingBehavior;
exports.BindingMode = runtimeHtml.BindingMode;
exports.ChildrenBinding = runtimeHtml.ChildrenBinding;
exports.Controller = runtimeHtml.Controller;
exports.CustomAttribute = runtimeHtml.CustomAttribute;
exports.CustomElement = runtimeHtml.CustomElement;
exports.FlushQueue = runtimeHtml.FlushQueue;
exports.IAppRoot = runtimeHtml.IAppRoot;
exports.IAttrMapper = runtimeHtml.IAttrMapper;
exports.IAttributePattern = runtimeHtml.IAttributePattern;
exports.IAuSlotWatcher = runtimeHtml.IAuSlotWatcher;
exports.IAuSlotsInfo = runtimeHtml.IAuSlotsInfo;
exports.IAurelia = runtimeHtml.IAurelia;
exports.IEventTarget = runtimeHtml.IEventTarget;
exports.IFlushQueue = runtimeHtml.IFlushQueue;
exports.ILifecycleHooks = runtimeHtml.ILifecycleHooks;
exports.INode = runtimeHtml.INode;
exports.IPlatform = runtimeHtml.IPlatform;
exports.IRenderLocation = runtimeHtml.IRenderLocation;
exports.ITemplateCompiler = runtimeHtml.ITemplateCompiler;
exports.ITemplateCompilerHooks = runtimeHtml.ITemplateCompilerHooks;
exports.LifecycleHooks = runtimeHtml.LifecycleHooks;
exports.NodeObserverLocator = runtimeHtml.NodeObserverLocator;
exports.ShortHandBindingSyntax = runtimeHtml.ShortHandBindingSyntax;
exports.StyleConfiguration = runtimeHtml.StyleConfiguration;
exports.TemplateCompilerHooks = runtimeHtml.TemplateCompilerHooks;
exports.ValueConverter = runtimeHtml.ValueConverter;
exports.ViewFactory = runtimeHtml.ViewFactory;
exports.alias = runtimeHtml.alias;
exports.attributePattern = runtimeHtml.attributePattern;
exports.bindable = runtimeHtml.bindable;
exports.bindingBehavior = runtimeHtml.bindingBehavior;
exports.bindingCommand = runtimeHtml.bindingCommand;
exports.capture = runtimeHtml.capture;
exports.children = runtimeHtml.children;
exports.coercer = runtimeHtml.coercer;
exports.containerless = runtimeHtml.containerless;
exports.cssModules = runtimeHtml.cssModules;
exports.customAttribute = runtimeHtml.customAttribute;
exports.customElement = runtimeHtml.customElement;
exports.lifecycleHooks = runtimeHtml.lifecycleHooks;
exports.registerAliases = runtimeHtml.registerAliases;
exports.renderer = runtimeHtml.renderer;
exports.shadowCSS = runtimeHtml.shadowCSS;
exports.slotted = runtimeHtml.slotted;
exports.strict = runtimeHtml.strict;
exports.templateCompilerHooks = runtimeHtml.templateCompilerHooks;
exports.templateController = runtimeHtml.templateController;
exports.useShadowDOM = runtimeHtml.useShadowDOM;
exports.valueConverter = runtimeHtml.valueConverter;
exports.HttpClient = fetchClient.HttpClient;
exports.HttpClientConfiguration = fetchClient.HttpClientConfiguration;
exports.IHttpClient = fetchClient.IHttpClient;
exports.json = fetchClient.json;
exports.Metadata = metadata.Metadata;
exports.Platform = platform.Platform;
exports.Task = platform.Task;
exports.TaskAbortError = platform.TaskAbortError;
exports.TaskQueue = platform.TaskQueue;
exports.TaskQueuePriority = platform.TaskQueuePriority;
exports.TaskStatus = platform.TaskStatus;
exports.CollectionKind = runtime.CollectionKind;
exports.ComputedObserver = runtime.ComputedObserver;
exports.IObserverLocator = runtime.IObserverLocator;
exports.ISignaler = runtime.ISignaler;
exports.batch = runtime.batch;
exports.observable = runtime.observable;
exports.subscriberCollection = runtime.subscriberCollection;
exports.Aurelia = Aurelia;
exports.PLATFORM = PLATFORM;
exports["default"] = Aurelia;
//# sourceMappingURL=index.dev.cjs.map
