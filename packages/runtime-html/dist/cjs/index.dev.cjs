'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var metadata = require('@aurelia/metadata');
var runtime = require('@aurelia/runtime');
var platformBrowser = require('@aurelia/platform-browser');
var platform = require('@aurelia/platform');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

const O = Object;
/** @internal */ const safeString = String;
/** @internal */ const baseObjectPrototype = O.prototype;
/** @internal */ const createLookup = () => O.create(null);
/** @internal */ const createError$1 = (message) => new Error(message);
/** @internal */ const hasOwnProperty = baseObjectPrototype.hasOwnProperty;
/** @internal */ const objectFreeze = O.freeze;
/** @internal */ const objectAssign = O.assign;
/** @internal */ const getOwnPropertyNames = O.getOwnPropertyNames;
/** @internal */ const objectKeys = O.keys;
const IsDataAttribute = /*@__PURE__*/ createLookup();
/** @internal */ const isDataAttribute = (obj, key, svgAnalyzer) => {
    if (IsDataAttribute[key] === true) {
        return true;
    }
    if (!isString(key)) {
        return false;
    }
    const prefix = key.slice(0, 5);
    // https://html.spec.whatwg.org/multipage/dom.html#wai-aria
    // https://html.spec.whatwg.org/multipage/dom.html#custom-data-attribute
    return IsDataAttribute[key] =
        prefix === 'aria-' ||
            prefix === 'data-' ||
            svgAnalyzer.isStandardSvgAttribute(obj, key);
};
/** @internal */ const isPromise = (v) => v instanceof Promise;
/** @internal */ const isArray = (v) => v instanceof Array;
// eslint-disable-next-line @typescript-eslint/ban-types
/** @internal */ const isFunction = (v) => typeof v === 'function';
/** @internal */ const isString = (v) => typeof v === 'string';
/** @internal */ const rethrow = (err) => { throw err; };
/** @internal */ const areEqual = O.is;
/** @internal */
const def = Reflect.defineProperty;
/** @internal */
const defineHiddenProp = (obj, key, value) => {
    def(obj, key, {
        enumerable: false,
        configurable: true,
        writable: true,
        value
    });
    return value;
};
/** @internal */
const addSignalListener = (signaler, signal, listener) => signaler.addSignalListener(signal, listener);
/** @internal */
const removeSignalListener = (signaler, signal, listener) => signaler.removeSignalListener(signal, listener);
/** ExpressionType */
/** @internal */ const etInterpolation = 'Interpolation';
/** @internal */ const etIsIterator = 'IsIterator';
/** @internal */ const etIsFunction = 'IsFunction';
/** @internal */ const etIsProperty = 'IsProperty';
/** TaskStatus */
/** @internal */ const tsPending = 'pending';
/** @internal */ const tsRunning = 'running';
/** AccessorType */
/** @internal */ const atObserver = runtime.AccessorType.Observer;
/** @internal */ const atNode = runtime.AccessorType.Node;
/** @internal */ const atLayout = runtime.AccessorType.Layout;

// Note: the oneTime binding now has a non-zero value for 2 reasons:
//  - plays nicer with bitwise operations (more consistent code, more explicit settings)
//  - allows for potentially having something like BindingMode.oneTime | BindingMode.fromView, where an initial value is set once to the view but updates from the view also propagate back to the view model
//
// Furthermore, the "default" mode would be for simple ".bind" expressions to make it explicit for our logic that the default is being used.
// This essentially adds extra information which binding could use to do smarter things and allows bindingBehaviors that add a mode instead of simply overwriting it
/** @internal */ const oneTime = 0b0001;
/** @internal */ const toView = 0b0010;
/** @internal */ const fromView = 0b0100;
/** @internal */ const twoWay = 0b0110;
/** @internal */ const defaultMode = 0b1000;
/**
 * Mode of a binding to operate
 * - 1 / one time - bindings should only update the target once
 * - 2 / to view - bindings should update the target and observe the source for changes to update again
 * - 3 / from view - bindings should update the source and observe the target for changes to update again
 * - 6 / two way - bindings should observe both target and source for changes to update the other side
 * - 8 / default - undecided mode, bindings, depends on the circumstance, may decide what to do accordingly
 */
const BindingMode = /*@__PURE__*/ objectFreeze({
    oneTime,
    toView,
    fromView,
    twoWay,
    /**
     * Unspecified mode, bindings may act differently with this mode
     */
    default: defaultMode,
});

/** @internal */ const getOwnMetadata = metadata.Metadata.getOwn;
/** @internal */ const hasOwnMetadata = metadata.Metadata.hasOwn;
/** @internal */ const defineMetadata = metadata.Metadata.define;
const { annotation } = kernel.Protocol;
/** @internal */ const getAnnotationKeyFor = annotation.keyFor;
/** @internal */ const appendAnnotationKey = annotation.appendTo;
/** @internal */ const getAllAnnotations = annotation.getKeys;

function bindable(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            // Non invocation:
            // - @bindable
            // Invocation with or w/o opts:
            // - @bindable()
            // - @bindable({...opts})
            config.name = $prop;
        }
        defineMetadata(baseName, BindableDefinition.create($prop, $target, config), $target.constructor, $prop);
        appendAnnotationKey($target.constructor, Bindable.keyFrom($prop));
    }
    if (arguments.length > 1) {
        // Non invocation:
        // - @bindable
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    else if (isString(configOrTarget)) {
        // ClassDecorator
        // - @bindable('bar')
        // Direct call:
        // - @bindable('bar')(Foo)
        config = {};
        return decorator;
    }
    // Invocation with or w/o opts:
    // - @bindable()
    // - @bindable({...opts})
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}
function isBindableAnnotation(key) {
    return key.startsWith(baseName);
}
const baseName = /*@__PURE__*/ getAnnotationKeyFor('bindable');
const Bindable = objectFreeze({
    name: baseName,
    keyFrom: (name) => `${baseName}:${name}`,
    from(type, ...bindableLists) {
        const bindables = {};
        const isArray = Array.isArray;
        function addName(name) {
            bindables[name] = BindableDefinition.create(name, type);
        }
        function addDescription(name, def) {
            bindables[name] = def instanceof BindableDefinition ? def : BindableDefinition.create(name, type, def);
        }
        function addList(maybeList) {
            if (isArray(maybeList)) {
                maybeList.forEach(addName);
            }
            else if (maybeList instanceof BindableDefinition) {
                bindables[maybeList.name] = maybeList;
            }
            else if (maybeList !== void 0) {
                objectKeys(maybeList).forEach(name => addDescription(name, maybeList[name]));
            }
        }
        bindableLists.forEach(addList);
        return bindables;
    },
    getAll(Type) {
        const propStart = baseName.length + 1;
        const defs = [];
        const prototypeChain = kernel.getPrototypeChain(Type);
        let iProto = prototypeChain.length;
        let iDefs = 0;
        let keys;
        let keysLen;
        let Class;
        let i;
        while (--iProto >= 0) {
            Class = prototypeChain[iProto];
            keys = getAllAnnotations(Class).filter(isBindableAnnotation);
            keysLen = keys.length;
            for (i = 0; i < keysLen; ++i) {
                defs[iDefs++] = getOwnMetadata(baseName, Class, keys[i].slice(propStart));
            }
        }
        return defs;
    },
});
class BindableDefinition {
    constructor(attribute, callback, mode, primary, name, set) {
        this.attribute = attribute;
        this.callback = callback;
        this.mode = mode;
        this.primary = primary;
        this.name = name;
        this.set = set;
    }
    static create(prop, target, def = {}) {
        return new BindableDefinition(def.attribute ?? kernel.kebabCase(prop), def.callback ?? `${prop}Changed`, def.mode ?? toView, def.primary ?? false, def.name ?? prop, def.set ?? getInterceptor(prop, target, def));
    }
}
/* eslint-enable @typescript-eslint/no-unused-vars,spaced-comment */
function coercer(target, property, _descriptor) {
    Coercer.define(target, property);
}
const Coercer = {
    key: /*@__PURE__*/ getAnnotationKeyFor('coercer'),
    define(target, property) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        defineMetadata(Coercer.key, target[property].bind(target), target);
    },
    for(target) {
        return getOwnMetadata(Coercer.key, target);
    }
};
function getInterceptor(prop, target, def = {}) {
    const type = def.type ?? metadata.Metadata.get('design:type', target, prop) ?? null;
    if (type == null) {
        return kernel.noop;
    }
    let coercer;
    switch (type) {
        case Number:
        case Boolean:
        case String:
        case BigInt:
            coercer = type;
            break;
        default: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            const $coercer = type.coerce;
            coercer = typeof $coercer === 'function'
                ? $coercer.bind(type)
                : (Coercer.for(type) ?? kernel.noop);
            break;
        }
    }
    return coercer === kernel.noop
        ? coercer
        : createCoercer(coercer, def.nullable);
}
function createCoercer(coercer, nullable) {
    return function (value, coercionConfiguration) {
        if (!coercionConfiguration?.enableCoercion)
            return value;
        return ((nullable ?? ((coercionConfiguration?.coerceNullish ?? false) ? false : true)) && value == null)
            ? value
            : coercer(value, coercionConfiguration);
    };
}

/** @internal */
const createInterface = kernel.DI.createInterface;
/** @internal */
const singletonRegistration = kernel.Registration.singleton;
/** @internal */
const aliasRegistration = kernel.Registration.aliasTo;
/** @internal */
const instanceRegistration = kernel.Registration.instance;
/** @internal */
kernel.Registration.callback;
/** @internal */
const transientRegistration = kernel.Registration.transient;
/** @internal */
const registerResolver = (ctn, key, resolver) => ctn.registerResolver(key, resolver);
function alias(...aliases) {
    return function (target) {
        const key = getAnnotationKeyFor('aliases');
        const existing = getOwnMetadata(key, target);
        if (existing === void 0) {
            defineMetadata(key, aliases, target);
        }
        else {
            existing.push(...aliases);
        }
    };
}
function registerAliases(aliases, resource, key, container) {
    for (let i = 0, ii = aliases.length; i < ii; ++i) {
        kernel.Registration.aliasTo(key, resource.keyFrom(aliases[i])).register(container);
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-template */
/** @internal */
const createMappedError = (code, ...details) => new Error(`AUR${safeString(code).padStart(4, '0')}: ${getMessageByCode(code, ...details)}`)
    ;

const errorsMap = {
    [99 /* ErrorNames.method_not_implemented */]: 'Method {{0}} not implemented',
    [151 /* ErrorNames.binding_behavior_def_not_found */]: `No binding behavior definition found for type {{0:name}}`,
    [152 /* ErrorNames.value_converter_def_not_found */]: `No value converter definition found for type {{0:name}}`,
    [153 /* ErrorNames.element_existed */]: `Element {{0}} has already been registered.`,
    [154 /* ErrorNames.attribute_existed */]: `Attribute {{0}} has already been registered.`,
    [155 /* ErrorNames.value_converter_existed */]: `Value converter {{0}} has already been registered.`,
    [156 /* ErrorNames.binding_behavior_existed */]: `Binding behavior {{0}} has already been registered.`,
    [157 /* ErrorNames.binding_command_existed */]: `Binding command {{0}} has already been registered.`,
    [500 /* ErrorNames.controller_cached_not_found */]: `There is no cached controller for the provided ViewModel: {{0}}`,
    [501 /* ErrorNames.controller_no_shadow_on_containerless */]: `Invalid combination: cannot combine the containerless custom element option with Shadow DOM.`,
    [502 /* ErrorNames.controller_activating_disposed */]: `Trying to activate a disposed controller: {{0}}.`,
    [503 /* ErrorNames.controller_activation_unexpected_state */]: `Controller at {{0}} is in an unexpected state: {{1}} during activation.`,
    [504 /* ErrorNames.controller_activation_synthetic_no_scope */]: `Synthetic view at {{0}} is being activated with null/undefined scope.`,
    [505 /* ErrorNames.controller_deactivation_unexpected_state */]: `Controller at {{0}} is in an unexpected state: {{1}} during deactivation.`,
    [506 /* ErrorNames.controller_watch_invalid_callback */]: `Invalid callback for @watch decorator: {{0}}`,
    [507 /* ErrorNames.controller_property_not_coercible */]: `Observer for bindable property {{0}} does not support coercion.`,
    [508 /* ErrorNames.controller_property_no_change_handler */]: `Observer for property {{0}} does not support change handler.`,
    [759 /* ErrorNames.attribute_def_not_found */]: `No attribute definition found for type {{0:name}}`,
    [760 /* ErrorNames.element_def_not_found */]: `No element definition found for type {{0:name}}`,
    [761 /* ErrorNames.element_only_name */]: `Cannot create a custom element definition with only a name and no type: {{0}}`,
    [762 /* ErrorNames.node_is_not_a_host */]: `Trying to retrieve a custom element controller from a node, but the provided node <{{0:nodeName}} /> is not a custom element or containerless host.`,
    [763 /* ErrorNames.node_is_not_a_host2 */]: `Trying to retrieve a custom element controller from a node, but the provided node <{{0:nodeName}} /> is not a custom element or containerless host.`,
    [764 /* ErrorNames.node_is_not_part_of_aurelia_app */]: `Trying to retrieve a custom element controller from a node.`
        + ` But the provided node <{{0:nodeName}} /> does not appear to be part of an Aurelia app DOM tree,`
        + ` or it was added to the DOM in a way that Aurelia cannot properly resolve its position in the component tree.`,
    [765 /* ErrorNames.node_is_not_part_of_aurelia_app2 */]: `Trying to retrieve a custom element controller from a node.`
        + ` But the provided node <{{0:nodeName}} /> does not appear to be part of an Aurelia app DOM tree,`
        + ` or it was added to the DOM in a way that Aurelia cannot properly resolve its position in the component tree.`,
    [766 /* ErrorNames.invalid_process_content_hook */]: `Invalid @processContent hook. Expected the hook to be a function (when defined in a class, it needs to be a static function) but got a {{0:typeof}}.`,
    [652 /* ErrorNames.node_observer_strategy_not_found */]: `Aurelia is unable to observe property {{0}}. Register observation mapping with .useConfig().`,
    [653 /* ErrorNames.node_observer_mapping_existed */]: `Mapping for property {{0}} of <{{1}} /> already exists`,
    [654 /* ErrorNames.select_observer_array_on_non_multi_select */]: `Array values can only be bound to a multi-select.`,
    [701 /* ErrorNames.compiler_root_is_local */]: `Template compilation error in element "{{0:name}}": the root <template> cannot be a local element template.`,
    [702 /* ErrorNames.compiler_invalid_surrogate_attr */]: `Template compilation error: attribute "{{0}}" is invalid on element surrogate.`,
    [703 /* ErrorNames.compiler_no_tc_on_surrogate */]: `Template compilation error: template controller "{{0}}" is invalid on element surrogate.`,
    [704 /* ErrorNames.compiler_invalid_let_command */]: `Template compilation error: Invalid command "{{0:.command}}" for <let>. Only to-view/bind supported.`,
    [706 /* ErrorNames.compiler_au_slot_on_non_element */]: `Template compilation error: detected projection with [au-slot="{{0}}"] attempted on a non custom element {{1}}.`,
    [707 /* ErrorNames.compiler_binding_to_non_bindable */]: `Template compilation error: creating binding to non-bindable property {{0}} on {{1}}.`,
    [708 /* ErrorNames.compiler_template_only_local_template */]: `Template compilation error: the custom element "{{0}}" does not have any content other than local template(s).`,
    [709 /* ErrorNames.compiler_local_el_not_under_root */]: `Template compilation error: local element template needs to be defined directly under root of element "{{0}}".`,
    [710 /* ErrorNames.compiler_local_el_bindable_not_under_root */]: `Template compilation error: bindable properties of local element "{{0}}" template needs to be defined directly under <template>.`,
    [711 /* ErrorNames.compiler_local_el_bindable_name_missing */]: `Template compilation error: the attribute 'property' is missing in {{0:outerHTML}} in local element "{{1}}"`,
    [712 /* ErrorNames.compiler_local_el_bindable_duplicate */]: `Template compilation error: Bindable property and attribute needs to be unique; found property: {{0}}, attribute: {{1}}`,
    [713 /* ErrorNames.compiler_unknown_binding_command */]: `Template compilation error: unknown binding command: "{{0}}".{{0:bindingCommandHelp}}`,
    [714 /* ErrorNames.compiler_primary_already_existed */]: `Template compilation error: primary already exists on element/attribute "{{0}}"`,
    [715 /* ErrorNames.compiler_local_name_empty */]: `Template compilation error: the value of "as-custom-element" attribute cannot be empty for local element in element "{{0}}"`,
    [716 /* ErrorNames.compiler_duplicate_local_name */]: `Template compilation error: duplicate definition of the local template named "{{0}} in element {{1}}"`,
    [717 /* ErrorNames.compiler_slot_without_shadowdom */]: `Template compilation error: detected a usage of "<slot>" element without specifying shadow DOM options in element: {{0}}`,
    [719 /* ErrorNames.compiler_attr_mapper_duplicate_mapping */]: `Attribute {{0}} has been already registered for {{1:element}}`,
    [718 /* ErrorNames.compiler_no_spread_tc */]: `Spreading template controller "{{0}}" is not supported.`,
    [767 /* ErrorNames.root_not_found */]: `Aurelia.root was accessed without a valid root.`,
    [768 /* ErrorNames.aurelia_instance_existed_in_container */]: `An instance of Aurelia is already registered with the container or an ancestor of it.`,
    [769 /* ErrorNames.invalid_platform_impl */]: `Failed to initialize the platform object. The host element's ownerDocument does not have a defaultView, did you create the host from a DOMParser and forget to call adoptNode()?`,
    [770 /* ErrorNames.no_composition_root */]: `Aurelia.start() was called without a composition root`,
    [771 /* ErrorNames.invalid_dispose_call */]: `The aurelia instance must be fully stopped before it can be disposed`,
    [750 /* ErrorNames.not_supported_view_ref_api */]: `view.ref is not supported. If you are migrating from v1, this can be understood as the controller.`,
    [751 /* ErrorNames.ref_not_found */]: `Attempted to reference "{{0}}", but it was not found amongst the target's API.`,
    [752 /* ErrorNames.element_res_not_found */]: `Element {{0:.res}} is not registered in {{1:name}}.`,
    [753 /* ErrorNames.attribute_res_not_found */]: `Attribute {{0:.res}} is not registered in {{1:name}}.`,
    [754 /* ErrorNames.attribute_tc_res_not_found */]: `Attribute {{0:.res}} is not registered in {{1:name}}.`,
    [755 /* ErrorNames.view_factory_provider_not_ready */]: `Cannot resolve ViewFactory before the provider was prepared.`,
    [756 /* ErrorNames.view_factory_invalid_name */]: `Cannot resolve ViewFactory without a (valid) name.`,
    [757 /* ErrorNames.rendering_mismatch_length */]: `AUR0757: The compiled template is not aligned with the render instructions. There are {{0}} targets and {{1}} instructions.`,
    [772 /* ErrorNames.watch_null_config */]: `Invalid @watch decorator config. Expected an expression or a fn but received null/undefined.`,
    [773 /* ErrorNames.watch_invalid_change_handler */]: `Invalid @watch decorator change handler config.`
        + `Method "{{0}}" not found in class {{1}}`,
    [774 /* ErrorNames.watch_non_method_decorator_usage */]: `Invalid @watch decorator usage: decorated target {{0}} is not a class method.`,
    [775 /* ErrorNames.repeat_invalid_key_binding_command */]: `Invalid command "{{0}}" usage with [repeat]`,
    [776 /* ErrorNames.repeat_extraneous_binding */]: `Invalid [repeat] usage, found extraneous target "{{0}}"`,
    [777 /* ErrorNames.repeat_non_iterable */]: `Unsupported: [repeat] cannot iterate over {{0:toString}}`,
    [778 /* ErrorNames.repeat_non_countable */]: `Unsupported: [repeat] cannot count {{0:toString}}`,
    [814 /* ErrorNames.repeat_mismatch_length */]: `[repeat] encountered an error: number of views != number of items {{0:join(!=)}}`,
    [801 /* ErrorNames.self_behavior_invalid_usage */]: `"& self" binding behavior only supports listener binding via trigger/capture command.`,
    [802 /* ErrorNames.update_trigger_behavior_no_triggers */]: `"& updateTrigger" invalid usage. This binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:'blur'">`,
    [803 /* ErrorNames.update_trigger_invalid_usage */]: `"& updateTrigger" invalid usage. This binding behavior can only be applied to two-way/ from-view bindings.`,
    [805 /* ErrorNames.au_compose_invalid_scope_behavior */]: `Invalid scope behavior "{{0}}" on <au-compose />. Only "scoped" or "auto" allowed.`,
    // originally not supported
    [806 /* ErrorNames.au_compose_component_name_not_found */]: `<au-compose /> couldn't find a custom element with name "{{0}}", did you forget to register it locally or globally?`,
    [807 /* ErrorNames.au_compose_invalid_run */]: `Composition has already been activated/deactivated. Id: {{0:controller}}`,
    [808 /* ErrorNames.au_compose_duplicate_deactivate */]: `Composition has already been deactivated.`,
    [810 /* ErrorNames.else_without_if */]: `Invalid [else] usage, it should follow an [if]`,
    [811 /* ErrorNames.portal_query_empty */]: `Invalid portal strict target query, empty query.`,
    [812 /* ErrorNames.portal_no_target */]: `Invalid portal strict target resolution, target not found.`,
    [813 /* ErrorNames.promise_invalid_usage */]: `Invalid [pending]/[then]/[catch] usage. The parent [promise].resolve not found; only "*[promise.resolve] > *[pending|then|catch]" relation is supported.`,
    [815 /* ErrorNames.switch_invalid_usage */]: `Invalid [case/default-case] usage. The parent [switch] not found; only "*[switch] > *[case|default-case]" relation is supported.`,
    [816 /* ErrorNames.switch_no_multiple_default */]: `Invalid [default-case] usage. Multiple 'default-case's are not allowed.`,
    [817 /* ErrorNames.signal_behavior_invalid_usage */]: `"& signal" binding behavior can only be used with bindings that have a "handleChange" method`,
    [818 /* ErrorNames.signal_behavior_no_signals */]: `"& signal" invalid usage. At least one signal name must be passed to the signal behavior, e.g. "expr & signal:'my-signal'"`,
    [9999 /* ErrorNames.no_spread_scope_context_found */]: 'No scope context for spread binding.',
    [9998 /* ErrorNames.no_spread_template_controller */]: 'Spread binding does not support spreading custom attributes/template controllers. Did you build the spread instruction manually?',
    [9997 /* ErrorNames.marker_malformed */]: `Marker is malformed. This likely happens when a compiled template has been modified.`
        + ` Did you accidentally modified some compiled template? You can modify template before compilation with compiling Template compiler hook.`,
    [9996 /* ErrorNames.binding_already_has_rate_limited */]: `Invalid usage, a rate limit has already been applied. Did you have both throttle and debounce on the same binding?`,
    [9995 /* ErrorNames.binding_already_has_target_subscriber */]: `The binding already has a target subscriber.`,
    [9994 /* ErrorNames.attr_behavior_invalid_binding */]: `"& attr" can be only used on property binding. It's used on {{0:ctor}}`,
    [9993 /* ErrorNames.update_trigger_behavior_not_supported */]: '"& updateTrigger" binding behavior only works with the default implementation of Aurelia HTML observation. Implement your own node observation + updateTrigger',
    [9992 /* ErrorNames.update_trigger_behavior_node_property_not_observable */]: `"& updateTrigger" uses node observer to observe, but it does not know how to use events to observe property <{{0:target@property}} />`,
    [9991 /* ErrorNames.children_decorator_invalid_usage */]: `Invalid @children usage. @children decorator can only be used on a field`,
    [9990 /* ErrorNames.slotted_decorator_invalid_usage */]: `Invalid @slotted usage. @slotted decorator can only be used on a field`,
};
const getMessageByCode = (name, ...details) => {
    let cooked = errorsMap[name];
    for (let i = 0; i < details.length; ++i) {
        const regex = new RegExp(`{{${i}(:.*)?}}`, 'g');
        let matches = regex.exec(cooked);
        while (matches != null) {
            const method = matches[1]?.slice(1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let value = details[i];
            if (value != null) {
                switch (method) {
                    case 'nodeName':
                        value = value.nodeName.toLowerCase();
                        break;
                    case 'name':
                        value = value.name;
                        break;
                    case 'typeof':
                        value = typeof value;
                        break;
                    case 'ctor':
                        value = value.constructor.name;
                        break;
                    case 'controller':
                        value = value.controller.name;
                        break;
                    case 'target@property':
                        value = `${value.target}@${value.targetProperty}`;
                        break;
                    case 'toString':
                        value = Object.prototype.toString.call(value);
                        break;
                    case 'join(!=)':
                        value = value.join('!=');
                        break;
                    case 'bindingCommandHelp':
                        value = getBindingCommandHelp(value);
                        break;
                    case 'element':
                        value = value === '*' ? 'all elements' : `<${value} />`;
                        break;
                    default: {
                        // property access
                        if (method?.startsWith('.')) {
                            value = safeString(value[method.slice(1)]);
                        }
                        else {
                            value = safeString(value);
                        }
                    }
                }
            }
            cooked = cooked.slice(0, matches.index) + value + cooked.slice(regex.lastIndex);
            matches = regex.exec(cooked);
        }
    }
    return cooked;
};
function getBindingCommandHelp(name) {
    switch (name) {
        case 'delegate':
            return `\nThe ".delegate" binding command has been removed in v2.`
                + ` Binding command ".trigger" should be used instead.`
                + ` If you are migrating v1 application, install compat package`
                + ` to add back the ".delegate" binding command for ease of migration.`;
        case 'call':
            return `\nThe ".call" binding command has been removed in v2.`
                + ` If you want to pass a callback that preserves the context of the function call,`
                + ` you can use lambda instead. Refer to lambda expression doc for more details.`;
        default:
            return '';
    }
}

function bindingBehavior(nameOrDef) {
    return function (target) {
        return BindingBehavior.define(nameOrDef, target);
    };
}
class BindingBehaviorDefinition {
    constructor(Type, name, aliases, key) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
    }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new BindingBehaviorDefinition(Type, kernel.firstDefined(getBehaviorAnnotation(Type, 'name'), name), kernel.mergeArrays(getBehaviorAnnotation(Type, 'aliases'), def.aliases, Type.aliases), BindingBehavior.keyFrom(name));
    }
    register(container, aliasName) {
        const $Type = this.Type;
        const key = typeof aliasName === 'string' ? getBindingBehaviorKeyFrom(aliasName) : this.key;
        const aliases = this.aliases;
        if (!container.has(key, false)) {
            container.register(container.has($Type, false) ? null : singletonRegistration($Type, $Type), aliasRegistration($Type, key), ...aliases.map(alias => aliasRegistration($Type, getBindingBehaviorKeyFrom(alias))));
        } /* istanbul ignore next */
        else {
            // eslint-disable-next-line no-console
            console.warn(`[DEV:aurelia] ${createMappedError(156 /* ErrorNames.binding_behavior_existed */, this.name)}`);
        }
    }
}
const bbBaseName = /*@__PURE__*/ kernel.getResourceKeyFor('binding-behavior');
const getBehaviorAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const getBindingBehaviorKeyFrom = (name) => `${bbBaseName}:${name}`;
const BindingBehavior = objectFreeze({
    name: bbBaseName,
    keyFrom: getBindingBehaviorKeyFrom,
    isType(value) {
        return isFunction(value) && hasOwnMetadata(bbBaseName, value);
    },
    define(nameOrDef, Type) {
        const definition = BindingBehaviorDefinition.create(nameOrDef, Type);
        const $Type = definition.Type;
        defineMetadata(bbBaseName, definition, $Type);
        // a requirement for the resource system in kernel
        defineMetadata(kernel.resourceBaseName, definition, $Type);
        return $Type;
    },
    getDefinition(Type) {
        const def = getOwnMetadata(bbBaseName, Type);
        if (def === void 0) {
            throw createMappedError(151 /* ErrorNames.binding_behavior_def_not_found */, Type);
        }
        return def;
    },
    find(container, name) {
        const key = getBindingBehaviorKeyFrom(name);
        const Type = container.find(key);
        return Type == null ? null : getOwnMetadata(bbBaseName, Type) ?? null;
    },
    get(container, name) {
        {
            try {
                return container.get(kernel.resource(getBindingBehaviorKeyFrom(name)));
            }
            catch (ex) {
                // eslint-disable-next-line no-console
                console.error('[DEV:aurelia] Cannot retrieve binding behavior with name', name);
                throw ex;
            }
        }
        return container.get(kernel.resource(getBindingBehaviorKeyFrom(name)));
    },
});

const originalModesMap = new Map();
class BindingModeBehavior {
    bind(scope, binding) {
        originalModesMap.set(binding, binding.mode);
        binding.mode = this.mode;
    }
    unbind(scope, binding) {
        binding.mode = originalModesMap.get(binding);
        originalModesMap.delete(binding);
    }
}
class OneTimeBindingBehavior extends BindingModeBehavior {
    get mode() { return oneTime; }
}
class ToViewBindingBehavior extends BindingModeBehavior {
    get mode() { return toView; }
}
class FromViewBindingBehavior extends BindingModeBehavior {
    get mode() { return fromView; }
}
class TwoWayBindingBehavior extends BindingModeBehavior {
    get mode() { return twoWay; }
}
bindingBehavior('oneTime')(OneTimeBindingBehavior);
bindingBehavior('toView')(ToViewBindingBehavior);
bindingBehavior('fromView')(FromViewBindingBehavior);
bindingBehavior('twoWay')(TwoWayBindingBehavior);

const bindingHandlerMap$1 = new WeakMap();
const defaultDelay$1 = 200;
class DebounceBindingBehavior {
    constructor() {
        /** @internal */
        this._platform = kernel.resolve(kernel.IPlatform);
    }
    bind(scope, binding, delay, signals) {
        const opts = {
            type: 'debounce',
            delay: delay ?? defaultDelay$1,
            now: this._platform.performanceNow,
            queue: this._platform.taskQueue,
            signals: isString(signals) ? [signals] : (signals ?? kernel.emptyArray),
        };
        const handler = binding.limit?.(opts);
        if (handler == null) {
            /* istanbul ignore next */
            {
                // eslint-disable-next-line no-console
                console.warn(`Binding ${binding.constructor.name} does not support debounce rate limiting`);
            }
        }
        else {
            bindingHandlerMap$1.set(binding, handler);
        }
    }
    unbind(scope, binding) {
        bindingHandlerMap$1.get(binding)?.dispose();
        bindingHandlerMap$1.delete(binding);
    }
}
bindingBehavior('debounce')(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor() {
        /** @internal */
        this._lookup = new Map();
        /** @internal */
        this._signaler = kernel.resolve(runtime.ISignaler);
    }
    bind(scope, binding, ...names) {
        if (!('handleChange' in binding)) {
            throw createMappedError(817 /* ErrorNames.signal_behavior_invalid_usage */);
        }
        if (names.length === 0) {
            throw createMappedError(818 /* ErrorNames.signal_behavior_no_signals */);
        }
        this._lookup.set(binding, names);
        let name;
        for (name of names) {
            addSignalListener(this._signaler, name, binding);
        }
    }
    unbind(scope, binding) {
        const names = this._lookup.get(binding);
        this._lookup.delete(binding);
        let name;
        for (name of names) {
            removeSignalListener(this._signaler, name, binding);
        }
    }
}
bindingBehavior('signal')(SignalBindingBehavior);

const bindingHandlerMap = new WeakMap();
const defaultDelay = 200;
class ThrottleBindingBehavior {
    constructor() {
        ({ performanceNow: this._now, taskQueue: this._taskQueue } = kernel.resolve(kernel.IPlatform));
    }
    bind(scope, binding, delay, signals) {
        const opts = {
            type: 'throttle',
            delay: delay ?? defaultDelay,
            now: this._now,
            queue: this._taskQueue,
            signals: isString(signals) ? [signals] : (signals ?? kernel.emptyArray),
        };
        const handler = binding.limit?.(opts);
        if (handler == null) {
            /* istanbul ignore next */
            {
                // eslint-disable-next-line no-console
                console.warn(`Binding ${binding.constructor.name} does not support debounce rate limiting`);
            }
        }
        else {
            bindingHandlerMap.set(binding, handler);
        }
    }
    unbind(scope, binding) {
        bindingHandlerMap.get(binding)?.dispose();
        bindingHandlerMap.delete(binding);
    }
}
bindingBehavior('throttle')(ThrottleBindingBehavior);

const IAppTask = /*@__PURE__*/ createInterface('IAppTask');
class $AppTask {
    constructor(slot, key, cb) {
        /** @internal */
        this.c = (void 0);
        this.slot = slot;
        this.k = key;
        this.cb = cb;
    }
    register(container) {
        return this.c = container.register(instanceRegistration(IAppTask, this));
    }
    run() {
        const key = this.k;
        const cb = this.cb;
        return (key === null
            ? cb()
            : cb(this.c.get(key)));
    }
}
const AppTask = objectFreeze({
    /**
     * Returns a task that will run just before the root component is created by DI
     */
    creating: createAppTaskSlotHook('creating'),
    /**
     * Returns a task that will run after instantiating the root controller,
     * but before compiling its view (thus means before instantiating the child elements inside it)
     *
     * good chance for a router to do some initial work, or initial routing related in general
     */
    hydrating: createAppTaskSlotHook('hydrating'),
    /**
     * Return a task that will run after the hydration of the root controller,
     * but before hydrating the child element inside
     *
     * good chance for a router to do some initial work, or initial routing related in general
     */
    hydrated: createAppTaskSlotHook('hydrated'),
    /**
     * Return a task that will run right before the root component is activated.
     * In this phase, scope hierarchy is formed, and bindings are getting bound
     */
    activating: createAppTaskSlotHook('activating'),
    /**
     * Return a task that will run right after the root component is activated - the app is now running
     */
    activated: createAppTaskSlotHook('activated'),
    /**
     * Return a task that will runs right before the root component is deactivated.
     * In this phase, scope hierarchy is unlinked, and bindings are getting unbound
     */
    deactivating: createAppTaskSlotHook('deactivating'),
    /**
     * Return a task that will run right after the root component is deactivated
     */
    deactivated: createAppTaskSlotHook('deactivated'),
});
function createAppTaskSlotHook(slotName) {
    function appTaskFactory(keyOrCallback, callback) {
        if (isFunction(callback)) {
            return new $AppTask(slotName, keyOrCallback, callback);
        }
        return new $AppTask(slotName, null, keyOrCallback);
    }
    return appTaskFactory;
}

const IPlatform = kernel.IPlatform;

function watch(expressionOrPropertyAccessFn, changeHandlerOrCallback) {
    if (expressionOrPropertyAccessFn == null) {
        throw createMappedError(772 /* ErrorNames.watch_null_config */);
    }
    return function decorator(target, key, descriptor) {
        const isClassDecorator = key == null;
        const Type = isClassDecorator ? target : target.constructor;
        const watchDef = new WatchDefinition(expressionOrPropertyAccessFn, isClassDecorator ? changeHandlerOrCallback : descriptor.value);
        // basic validation
        if (isClassDecorator) {
            if (!isFunction(changeHandlerOrCallback)
                && (changeHandlerOrCallback == null || !(changeHandlerOrCallback in Type.prototype))) {
                throw createMappedError(773 /* ErrorNames.watch_invalid_change_handler */, `${safeString(changeHandlerOrCallback)}@${Type.name}}`);
            }
        }
        else if (!isFunction(descriptor?.value)) {
            throw createMappedError(774 /* ErrorNames.watch_non_method_decorator_usage */, key);
        }
        Watch.add(Type, watchDef);
        // if the code looks like this:
        // @watch(...)
        // @customAttribute(...)
        // class Abc {}
        //
        // then @watch is called after @customAttribute
        // which means the attribute definition won't have the watch definition
        //
        // temporarily works around this order sensitivity by manually add the watch def
        // manual
        if (isAttributeType(Type)) {
            getAttributeDefinition(Type).watches.push(watchDef);
        }
        if (isElementType(Type)) {
            getElementDefinition(Type).watches.push(watchDef);
        }
    };
}
class WatchDefinition {
    constructor(expression, callback) {
        this.expression = expression;
        this.callback = callback;
    }
}
const Watch = /*@__PURE__*/ (() => {
    const watches = new WeakMap();
    return objectFreeze({
        add(Type, definition) {
            let defs = watches.get(Type);
            if (defs == null) {
                watches.set(Type, defs = []);
            }
            defs.push(definition);
        },
        getDefinitions(Type) {
            return watches.get(Type) ?? kernel.emptyArray;
        }
    });
})();

/** @internal */ const dtElement = 'element';
/** @internal */ const dtAttribute = 'attribute';

function customAttribute(nameOrDef) {
    return function (target) {
        return defineAttribute(nameOrDef, target);
    };
}
function templateController(nameOrDef) {
    return function (target) {
        return defineAttribute(isString(nameOrDef)
            ? { isTemplateController: true, name: nameOrDef }
            : { isTemplateController: true, ...nameOrDef }, target);
    };
}
class CustomAttributeDefinition {
    // a simple marker to distinguish between Custom Element definition & Custom attribute definition
    get kind() { return dtAttribute; }
    constructor(Type, name, aliases, key, defaultBindingMode, isTemplateController, bindables, noMultiBindings, watches, dependencies, containerStrategy) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
        this.defaultBindingMode = defaultBindingMode;
        this.isTemplateController = isTemplateController;
        this.bindables = bindables;
        this.noMultiBindings = noMultiBindings;
        this.watches = watches;
        this.dependencies = dependencies;
        this.containerStrategy = containerStrategy;
    }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new CustomAttributeDefinition(Type, kernel.firstDefined(getAttributeAnnotation(Type, 'name'), name), kernel.mergeArrays(getAttributeAnnotation(Type, 'aliases'), def.aliases, Type.aliases), getAttributeKeyFrom(name), kernel.firstDefined(getAttributeAnnotation(Type, 'defaultBindingMode'), def.defaultBindingMode, Type.defaultBindingMode, toView), kernel.firstDefined(getAttributeAnnotation(Type, 'isTemplateController'), def.isTemplateController, Type.isTemplateController, false), Bindable.from(Type, ...Bindable.getAll(Type), getAttributeAnnotation(Type, 'bindables'), Type.bindables, def.bindables), kernel.firstDefined(getAttributeAnnotation(Type, 'noMultiBindings'), def.noMultiBindings, Type.noMultiBindings, false), kernel.mergeArrays(Watch.getDefinitions(Type), Type.watches), kernel.mergeArrays(getAttributeAnnotation(Type, 'dependencies'), def.dependencies, Type.dependencies), kernel.firstDefined(getAttributeAnnotation(Type, 'containerStrategy'), def.containerStrategy, Type.containerStrategy, 'reuse'));
    }
    register(container, aliasName) {
        const $Type = this.Type;
        const key = typeof aliasName === 'string' ? getAttributeKeyFrom(aliasName) : this.key;
        const aliases = this.aliases;
        if (!container.has(key, false)) {
            container.register(container.has($Type, false) ? null : transientRegistration($Type, $Type), aliasRegistration($Type, key), ...aliases.map(alias => aliasRegistration($Type, getAttributeKeyFrom(alias))));
        } /* istanbul ignore next */
        else {
            // eslint-disable-next-line no-console
            console.warn(`[DEV:aurelia] ${createMappedError(154 /* ErrorNames.attribute_existed */, this.name)}`);
        }
    }
    toString() {
        return `au:ca:${this.name}`;
    }
}
/** @internal */
const caBaseName = /*@__PURE__*/ kernel.getResourceKeyFor('custom-attribute');
/** @internal */
const getAttributeKeyFrom = (name) => `${caBaseName}:${name}`;
const getAttributeAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
/** @internal */
const isAttributeType = (value) => {
    return isFunction(value) && hasOwnMetadata(caBaseName, value);
};
/** @internal */
const findAttributeControllerFor = (node, name) => {
    return (getRef(node, getAttributeKeyFrom(name)) ?? void 0);
};
/** @internal */
const defineAttribute = (nameOrDef, Type) => {
    const definition = CustomAttributeDefinition.create(nameOrDef, Type);
    const $Type = definition.Type;
    defineMetadata(caBaseName, definition, $Type);
    // a requirement for the resource system in kernel
    defineMetadata(kernel.resourceBaseName, definition, $Type);
    return $Type;
};
/** @internal */
// eslint-disable-next-line @typescript-eslint/ban-types
const getAttributeDefinition = (Type) => {
    const def = getOwnMetadata(caBaseName, Type);
    if (def === void 0) {
        throw createMappedError(759 /* ErrorNames.attribute_def_not_found */, Type);
    }
    return def;
};
const findClosestControllerByName = (node, attrNameOrType) => {
    let key = '';
    let attrName = '';
    if (isString(attrNameOrType)) {
        key = getAttributeKeyFrom(attrNameOrType);
        attrName = attrNameOrType;
    }
    else {
        const definition = getAttributeDefinition(attrNameOrType);
        key = definition.key;
        attrName = definition.name;
    }
    let cur = node;
    while (cur !== null) {
        const controller = getRef(cur, key);
        if (controller?.is(attrName)) {
            return controller;
        }
        cur = getEffectiveParentNode(cur);
    }
    return null;
};
const CustomAttribute = objectFreeze({
    name: caBaseName,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    closest: findClosestControllerByName,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(Type, prop, value) {
        defineMetadata(getAnnotationKeyFor(prop), value, Type);
    },
    getAnnotation: getAttributeAnnotation,
    find(c, name) {
        const key = getAttributeKeyFrom(name);
        const Type = c.find(key);
        return Type === null ? null : getOwnMetadata(caBaseName, Type) ?? null;
    },
});

const ILifecycleHooks = /*@__PURE__*/ createInterface('ILifecycleHooks');
class LifecycleHooksEntry {
    constructor(definition, instance) {
        this.definition = definition;
        this.instance = instance;
    }
}
/**
 * This definition has no specific properties yet other than the type, but is in place for future extensions.
 *
 * See: https://github.com/aurelia/aurelia/issues/1044
 */
class LifecycleHooksDefinition {
    constructor(Type, propertyNames) {
        this.Type = Type;
        this.propertyNames = propertyNames;
    }
    /**
     * @param def - Placeholder for future extensions. Currently always an empty object.
     */
    static create(def, Type) {
        const propertyNames = new Set();
        let proto = Type.prototype;
        while (proto !== baseObjectPrototype) {
            for (const name of getOwnPropertyNames(proto)) {
                // This is the only check we will do for now. Filtering on e.g. function types might not always work properly when decorators come into play. This would need more testing first.
                if (name !== 'constructor' && !name.startsWith('_')) {
                    propertyNames.add(name);
                }
            }
            proto = Object.getPrototypeOf(proto);
        }
        return new LifecycleHooksDefinition(Type, propertyNames);
    }
}
const LifecycleHooks = /*@__PURE__*/ (() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const containerLookup = new WeakMap();
    // const lhBaseName = getAnnotationKeyFor('lifecycle-hooks');
    const definitionMap = new WeakMap();
    return objectFreeze({
        // name: lhBaseName,
        /**
         * @param def - Placeholder for future extensions. Currently always an empty object.
         */
        define(def, Type) {
            const definition = LifecycleHooksDefinition.create(def, Type);
            const $Type = definition.Type;
            definitionMap.set($Type, definition);
            return kernel.Registrable.define($Type, container => {
                singletonRegistration(ILifecycleHooks, $Type).register(container);
            });
        },
        /**
         * @param ctx - The container where the resolution starts
         * @param Type - The constructor of the Custom element/ Custom attribute with lifecycle metadata
         */
        resolve(ctx) {
            let lookup = containerLookup.get(ctx);
            if (lookup === void 0) {
                containerLookup.set(ctx, lookup = new LifecycleHooksLookupImpl());
                const root = ctx.root;
                const instances = root === ctx
                    ? ctx.getAll(ILifecycleHooks)
                    // if it's not root, only resolve it from the current context when it has the resolver
                    // to maintain resources semantic: current -> root
                    : ctx.has(ILifecycleHooks, false)
                        ? root.getAll(ILifecycleHooks).concat(ctx.getAll(ILifecycleHooks))
                        : root.getAll(ILifecycleHooks);
                let instance;
                let definition;
                let entry;
                let name;
                let entries;
                for (instance of instances) {
                    definition = definitionMap.get(instance.constructor);
                    entry = new LifecycleHooksEntry(definition, instance);
                    for (name of definition.propertyNames) {
                        entries = lookup[name];
                        if (entries === void 0) {
                            lookup[name] = [entry];
                        }
                        else {
                            entries.push(entry);
                        }
                    }
                }
            }
            return lookup;
        },
    });
})();
class LifecycleHooksLookupImpl {
}
/**
 * Decorator: Indicates that the decorated class is a custom element.
 */
function lifecycleHooks() {
    return function decorator(target) {
        return LifecycleHooks.define({}, target);
    };
}

function valueConverter(nameOrDef) {
    return function (target) {
        return ValueConverter.define(nameOrDef, target);
    };
}
class ValueConverterDefinition {
    constructor(Type, name, aliases, key) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
    }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new ValueConverterDefinition(Type, kernel.firstDefined(getConverterAnnotation(Type, 'name'), name), kernel.mergeArrays(getConverterAnnotation(Type, 'aliases'), def.aliases, Type.aliases), ValueConverter.keyFrom(name));
    }
    register(container, aliasName) {
        const $Type = this.Type;
        const key = typeof aliasName === 'string' ? getValueConverterKeyFrom(aliasName) : this.key;
        const aliases = this.aliases;
        if (!container.has(key, false)) {
            container.register(container.has($Type, false) ? null : singletonRegistration($Type, $Type), aliasRegistration($Type, key), ...aliases.map(alias => aliasRegistration($Type, getValueConverterKeyFrom(alias))));
        } /* istanbul ignore next */
        else {
            // eslint-disable-next-line no-console
            console.warn(`[DEV:aurelia] ${createMappedError(155 /* ErrorNames.value_converter_existed */, this.name)}`);
        }
    }
}
const vcBaseName = /*@__PURE__*/ kernel.getResourceKeyFor('value-converter');
const getConverterAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const getValueConverterKeyFrom = (name) => `${vcBaseName}:${name}`;
const ValueConverter = objectFreeze({
    name: vcBaseName,
    keyFrom: getValueConverterKeyFrom,
    isType(value) {
        return isFunction(value) && hasOwnMetadata(vcBaseName, value);
    },
    define(nameOrDef, Type) {
        const definition = ValueConverterDefinition.create(nameOrDef, Type);
        const $Type = definition.Type;
        defineMetadata(vcBaseName, definition, $Type);
        // a requirement for the resource system in kernel
        defineMetadata(kernel.resourceBaseName, definition, $Type);
        return $Type;
    },
    getDefinition(Type) {
        const def = getOwnMetadata(vcBaseName, Type);
        if (def === void 0) {
            throw createMappedError(152 /* ErrorNames.value_converter_def_not_found */, Type);
        }
        return def;
    },
    annotate(Type, prop, value) {
        defineMetadata(getAnnotationKeyFor(prop), value, Type);
    },
    getAnnotation: getConverterAnnotation,
    find(container, name) {
        const key = getValueConverterKeyFrom(name);
        const Type = container.find(key);
        return Type == null ? null : getOwnMetadata(vcBaseName, Type) ?? null;
    },
    get(container, name) {
        {
            try {
                return container.get(kernel.resource(getValueConverterKeyFrom(name)));
            }
            catch (ex) {
                // eslint-disable-next-line no-console
                console.error('[DEV:aurelia] Cannot retrieve value converter with name', name);
                throw ex;
            }
        }
        return container.get(kernel.resource(getValueConverterKeyFrom(name)));
    },
});

/**
 * A subscriber that is used for subcribing to target observer & invoking `updateSource` on a binding
 */
class BindingTargetSubscriber {
    constructor(b, 
    // flush queue is a way to handle the notification order in a synchronous change notification system
    // without a flush queue, changes are notified depth first
    // with    a flush queue, changes are notified breadth first
    flushQueue) {
        /** @internal */
        this._value = void 0;
        this.b = b;
        this._flushQueue = flushQueue;
    }
    flush() {
        this.b.updateSource(this._value);
    }
    // deepscan-disable-next-line
    handleChange(value, _) {
        const b = this.b;
        if (value !== runtime.astEvaluate(b.ast, b._scope, b, null)) {
            this._value = value;
            this._flushQueue.add(this);
        }
    }
}
/**
 * Implement method `useScope` in a common way for a binding. For internal use only for size saving.
 */
const mixinUseScope = (target) => {
    defineHiddenProp(target.prototype, 'useScope', useScope);
};
/**
 * Turns a class into AST evaluator. For internal use only
 *
 * @param strict - whether the evaluation of AST nodes will be in strict mode
 */
const mixinAstEvaluator = (strict, strictFnCall = true) => {
    return (target) => {
        const proto = target.prototype;
        // some evaluator may have their strict configurable in some way
        // undefined to leave the property alone
        if (strict != null) {
            def(proto, 'strict', { enumerable: true, get: function () { return strict; } });
        }
        def(proto, 'strictFnCall', { enumerable: true, get: function () { return strictFnCall; } });
        defineHiddenProp(proto, 'get', (evaluatorGet));
        defineHiddenProp(proto, 'getSignaler', (evaluatorGetSignaler));
        defineHiddenProp(proto, 'getConverter', (evaluatorGetConverter));
        defineHiddenProp(proto, 'getBehavior', (evaluatorGetBehavior));
    };
};
const converterResourceLookupCache = new WeakMap();
const behaviorResourceLookupCache = new WeakMap();
class ResourceLookup {
}
const IFlushQueue = /*@__PURE__*/ createInterface('IFlushQueue', x => x.singleton(FlushQueue));
class FlushQueue {
    constructor() {
        /** @internal */
        this._flushing = false;
        /** @internal */
        this._items = new Set();
    }
    get count() {
        return this._items.size;
    }
    add(flushable) {
        this._items.add(flushable);
        if (this._flushing) {
            return;
        }
        this._flushing = true;
        try {
            this._items.forEach(flushItem);
        }
        finally {
            this._flushing = false;
        }
    }
    clear() {
        this._items.clear();
        this._flushing = false;
    }
}
function useScope(scope) {
    this._scope = scope;
}
function evaluatorGet(key) {
    return this.l.get(key);
}
function evaluatorGetSignaler() {
    return this.l.root.get(runtime.ISignaler);
}
function evaluatorGetConverter(name) {
    let resourceLookup = converterResourceLookupCache.get(this);
    if (resourceLookup == null) {
        converterResourceLookupCache.set(this, resourceLookup = new ResourceLookup());
    }
    return resourceLookup[name] ??= ValueConverter.get(this.l, name);
}
function evaluatorGetBehavior(name) {
    let resourceLookup = behaviorResourceLookupCache.get(this);
    if (resourceLookup == null) {
        behaviorResourceLookupCache.set(this, resourceLookup = new ResourceLookup());
    }
    return resourceLookup[name] ??= BindingBehavior.get(this.l, name);
}
function flushItem(item, _, items) {
    items.delete(item);
    item.flush();
}
const withLimitationBindings = new WeakSet();
/**
 * A mixing for bindings to implement a set of default behvaviors for rate limiting their calls.
 *
 * For internal use only
 */
const mixingBindingLimited = (target, getMethodName) => {
    defineHiddenProp(target.prototype, 'limit', function (opts) {
        if (withLimitationBindings.has(this)) {
            throw createMappedError(9996 /* ErrorNames.binding_already_has_rate_limited */);
        }
        withLimitationBindings.add(this);
        const prop = getMethodName(this, opts);
        const signals = opts.signals;
        const signaler = signals.length > 0 ? this.get(runtime.ISignaler) : null;
        const originalFn = this[prop];
        const callOriginal = (...args) => originalFn.call(this, ...args);
        const limitedFn = opts.type === 'debounce'
            ? debounced(opts, callOriginal, this)
            : throttled(opts, callOriginal, this);
        const signalListener = signaler ? { handleChange: limitedFn.flush } : null;
        this[prop] = limitedFn;
        if (signaler) {
            signals.forEach(s => addSignalListener(signaler, s, signalListener));
        }
        return {
            dispose: () => {
                if (signaler) {
                    signals.forEach(s => removeSignalListener(signaler, s, signalListener));
                }
                withLimitationBindings.delete(this);
                limitedFn.dispose();
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this[prop];
            }
        };
    });
};
/**
 * A helper for creating rated limited functions for binding. For internal use only
 */
const debounced = (opts, callOriginal, binding) => {
    let limiterTask;
    let task;
    let latestValue;
    let isPending = false;
    const taskQueue = opts.queue;
    const callOriginalCallback = () => callOriginal(latestValue);
    const fn = (v) => {
        latestValue = v;
        if (binding.isBound) {
            task = limiterTask;
            limiterTask = taskQueue.queueTask(callOriginalCallback, { delay: opts.delay, reusable: false });
            task?.cancel();
        }
        else {
            callOriginalCallback();
        }
    };
    const dispose = fn.dispose = () => {
        task?.cancel();
        limiterTask?.cancel();
        task = limiterTask = void 0;
    };
    fn.flush = () => {
        // only call callback when there's actually task being queued
        isPending = limiterTask?.status === tsPending;
        dispose();
        if (isPending) {
            callOriginalCallback();
        }
    };
    return fn;
};
/**
 * A helper for creating rated limited functions for binding. For internal use only
 */
const throttled = (opts, callOriginal, binding) => {
    let limiterTask;
    let task;
    let last = 0;
    let elapsed = 0;
    let latestValue;
    let isPending = false;
    const taskQueue = opts.queue;
    const now = () => opts.now();
    const callOriginalCallback = () => callOriginal(latestValue);
    const fn = (v) => {
        latestValue = v;
        if (binding.isBound) {
            elapsed = now() - last;
            task = limiterTask;
            if (elapsed > opts.delay) {
                last = now();
                callOriginalCallback();
            }
            else {
                // Queue the new one before canceling the old one, to prevent early yield
                limiterTask = taskQueue.queueTask(() => {
                    last = now();
                    callOriginalCallback();
                }, { delay: opts.delay - elapsed, reusable: false });
            }
            task?.cancel();
        }
        else {
            callOriginalCallback();
        }
    };
    const dispose = fn.dispose = () => {
        task?.cancel();
        limiterTask?.cancel();
        task = limiterTask = void 0;
    };
    fn.flush = () => {
        // only call callback when there's actually task being queued
        isPending = limiterTask?.status === tsPending;
        dispose();
        if (isPending) {
            callOriginalCallback();
        }
    };
    return fn;
};

const taskOptions = {
    reusable: false,
    preempt: true,
};
/**
 * Attribute binding. Handle attribute binding betwen view/view model. Understand Html special attributes
 */
class AttributeBinding {
    constructor(controller, locator, observerLocator, taskQueue, ast, target, 
    // some attributes may have inner structure
    // such as class -> collection of class names
    // such as style -> collection of style rules
    //
    // for normal attributes, targetAttribute and targetProperty are the same and can be ignore
    targetAttribute, targetProperty, mode) {
        this.targetAttribute = targetAttribute;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.isBound = false;
        /** @internal */
        this._scope = void 0;
        /** @internal */
        this._task = null;
        /** @internal */
        this._value = void 0;
        // see Listener binding for explanation
        /** @internal */
        this.boundFn = false;
        this.l = locator;
        this.ast = ast;
        this._controller = controller;
        this.target = target;
        this.oL = observerLocator;
        this._taskQueue = taskQueue;
    }
    updateTarget(value) {
        const target = this.target;
        const targetAttribute = this.targetAttribute;
        const targetProperty = this.targetProperty;
        switch (targetAttribute) {
            case 'class':
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                target.classList.toggle(targetProperty, !!value);
                break;
            case 'style': {
                let priority = '';
                let newValue = safeString(value);
                if (isString(newValue) && newValue.includes('!important')) {
                    priority = 'important';
                    newValue = newValue.replace('!important', '');
                }
                target.style.setProperty(targetProperty, newValue, priority);
                break;
            }
            default: {
                if (value == null) {
                    target.removeAttribute(targetAttribute);
                }
                else {
                    target.setAttribute(targetAttribute, safeString(value));
                }
            }
        }
    }
    handleChange() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        let task;
        this.obs.version++;
        const newValue = runtime.astEvaluate(this.ast, this._scope, this, 
        // should observe?
        (this.mode & toView) > 0 ? this : null);
        this.obs.clear();
        if (newValue !== this._value) {
            this._value = newValue;
            const shouldQueueFlush = this._controller.state !== activating;
            if (shouldQueueFlush) {
                // Queue the new one before canceling the old one, to prevent early yield
                task = this._task;
                this._task = this._taskQueue.queueTask(() => {
                    this._task = null;
                    this.updateTarget(newValue);
                }, taskOptions);
                task?.cancel();
            }
            else {
                this.updateTarget(newValue);
            }
        }
    }
    // todo: based off collection and handle update accordingly instead off always start
    handleCollectionChange() {
        this.handleChange();
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                /* istanbul-ignore-next */
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        runtime.astBind(this.ast, _scope, this);
        if (this.mode & (toView | oneTime)) {
            this.updateTarget(this._value = runtime.astEvaluate(this.ast, _scope, this, /* should connect? */ (this.mode & toView) > 0 ? this : null));
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this._value = void 0;
        this._task?.cancel();
        this._task = null;
        this.obs.clearAll();
    }
}
mixinUseScope(AttributeBinding);
mixingBindingLimited(AttributeBinding, () => 'updateTarget');
runtime.connectable(AttributeBinding);
mixinAstEvaluator(true)(AttributeBinding);

const queueTaskOptions$1 = {
    reusable: false,
    preempt: true,
};
class InterpolationBinding {
    constructor(controller, locator, observerLocator, taskQueue, ast, target, targetProperty, mode) {
        this.ast = ast;
        this.target = target;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.isBound = false;
        /** @internal */
        this._scope = void 0;
        /** @internal */
        this._task = null;
        this._controller = controller;
        this.oL = observerLocator;
        this._taskQueue = taskQueue;
        this._targetObserver = observerLocator.getAccessor(target, targetProperty);
        const expressions = ast.expressions;
        const partBindings = this.partBindings = Array(expressions.length);
        const ii = expressions.length;
        let i = 0;
        for (; ii > i; ++i) {
            partBindings[i] = new InterpolationPartBinding(expressions[i], target, targetProperty, locator, observerLocator, this);
        }
    }
    /** @internal */
    _handlePartChange() {
        this.updateTarget();
    }
    updateTarget() {
        const partBindings = this.partBindings;
        const staticParts = this.ast.parts;
        const ii = partBindings.length;
        let result = '';
        let i = 0;
        if (ii === 1) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            result = staticParts[0] + partBindings[0]._value + staticParts[1];
        }
        else {
            result = staticParts[0];
            for (; ii > i; ++i) {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                result += partBindings[i]._value + staticParts[i + 1];
            }
        }
        const targetObserver = this._targetObserver;
        // Alpha: during bind a simple strategy for bind is always flush immediately
        // todo:
        //  (1). determine whether this should be the behavior
        //  (2). if not, then fix tests to reflect the changes/platform to properly yield all with aurelia.start()
        const shouldQueueFlush = this._controller.state !== activating && (targetObserver.type & atLayout) > 0;
        let task;
        if (shouldQueueFlush) {
            // Queue the new one before canceling the old one, to prevent early yield
            task = this._task;
            this._task = this._taskQueue.queueTask(() => {
                this._task = null;
                targetObserver.setValue(result, this.target, this.targetProperty);
            }, queueTaskOptions$1);
            task?.cancel();
            task = null;
        }
        else {
            targetObserver.setValue(result, this.target, this.targetProperty);
        }
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                /* istanbul-ignore-next */
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        const partBindings = this.partBindings;
        const ii = partBindings.length;
        let i = 0;
        for (; ii > i; ++i) {
            partBindings[i].bind(_scope);
        }
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.isBound = false;
        this._scope = void 0;
        const partBindings = this.partBindings;
        const ii = partBindings.length;
        let i = 0;
        for (; ii > i; ++i) {
            partBindings[i].unbind();
        }
        this._task?.cancel();
        this._task = null;
    }
}
class InterpolationPartBinding {
    constructor(ast, target, targetProperty, locator, observerLocator, owner) {
        this.ast = ast;
        this.target = target;
        this.targetProperty = targetProperty;
        this.owner = owner;
        // at runtime, mode may be overriden by binding behavior
        // but it wouldn't matter here, just start with something for later check
        this.mode = toView;
        this.task = null;
        this.isBound = false;
        /** @internal */
        this._value = '';
        // see Listener binding for explanation
        /** @internal */
        this.boundFn = false;
        this.l = locator;
        this.oL = observerLocator;
    }
    updateTarget() {
        this.owner._handlePartChange();
    }
    handleChange() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.obs.version++;
        const newValue = runtime.astEvaluate(this.ast, this._scope, this, 
        // should observe?
        (this.mode & toView) > 0 ? this : null);
        this.obs.clear();
        // todo(!=): maybe should do strict comparison?
        // eslint-disable-next-line eqeqeq
        if (newValue != this._value) {
            this._value = newValue;
            if (isArray(newValue)) {
                this.observeCollection(newValue);
            }
            this.updateTarget();
        }
    }
    handleCollectionChange() {
        this.updateTarget();
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                /* istanbul-ignore-next */
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        runtime.astBind(this.ast, _scope, this);
        this._value = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & toView) > 0 ? this : null);
        if (isArray(this._value)) {
            this.observeCollection(this._value);
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this.obs.clearAll();
    }
}
mixinUseScope(InterpolationPartBinding);
mixingBindingLimited(InterpolationPartBinding, () => 'updateTarget');
runtime.connectable(InterpolationPartBinding);
mixinAstEvaluator(true)(InterpolationPartBinding);

const queueTaskOptions = {
    reusable: false,
    preempt: true,
};
/**
 * A binding for handling the element content interpolation
 */
class ContentBinding {
    constructor(controller, locator, observerLocator, taskQueue, p, ast, target) {
        this.p = p;
        this.ast = ast;
        this.target = target;
        this.isBound = false;
        // at runtime, mode may be overriden by binding behavior
        // but it wouldn't matter here, just start with something for later check
        this.mode = toView;
        /** @internal */
        this._task = null;
        /** @internal */
        this._value = '';
        /** @internal */
        this._needsRemoveNode = false;
        // see Listener binding for explanation
        /** @internal */
        this.boundFn = false;
        this.strict = true;
        this.l = locator;
        this._controller = controller;
        this.oL = observerLocator;
        this._taskQueue = taskQueue;
    }
    updateTarget(value) {
        const target = this.target;
        const oldValue = this._value;
        this._value = value;
        if (this._needsRemoveNode) {
            oldValue.parentNode?.removeChild(oldValue);
            this._needsRemoveNode = false;
        }
        if (value instanceof this.p.Node) {
            target.parentNode?.insertBefore(value, target);
            value = '';
            this._needsRemoveNode = true;
        }
        // console.log({ value, type: typeof value });
        target.textContent = safeString(value ?? '');
    }
    handleChange() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.obs.version++;
        const newValue = runtime.astEvaluate(this.ast, this._scope, this, 
        // should observe?
        (this.mode & toView) > 0 ? this : null);
        this.obs.clear();
        if (newValue === this._value) {
            // in a frequent update, e.g collection mutation in a loop
            // value could be changing frequently and previous update task may be stale at this point
            // cancel if any task going on because the latest value is already the same
            this._task?.cancel();
            this._task = null;
            return;
        }
        const shouldQueueFlush = this._controller.state !== activating;
        if (shouldQueueFlush) {
            this._queueUpdate(newValue);
        }
        else {
            this.updateTarget(newValue);
        }
    }
    handleCollectionChange() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.obs.version++;
        const v = this._value = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & toView) > 0 ? this : null);
        this.obs.clear();
        if (isArray(v)) {
            this.observeCollection(v);
        }
        const shouldQueueFlush = this._controller.state !== activating;
        if (shouldQueueFlush) {
            this._queueUpdate(v);
        }
        else {
            this.updateTarget(v);
        }
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                /* istanbul-ignore-next */
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        runtime.astBind(this.ast, _scope, this);
        const v = this._value = runtime.astEvaluate(this.ast, this._scope, this, (this.mode & toView) > 0 ? this : null);
        if (isArray(v)) {
            this.observeCollection(v);
        }
        this.updateTarget(v);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        if (this._needsRemoveNode) {
            this._value.parentNode?.removeChild(this._value);
        }
        // TODO: should existing value (either connected node, or a string)
        // be removed when this binding is unbound?
        // this.updateTarget('');
        this._scope = void 0;
        this.obs.clearAll();
        this._task?.cancel();
        this._task = null;
    }
    // queue a force update
    /** @internal */
    _queueUpdate(newValue) {
        const task = this._task;
        this._task = this._taskQueue.queueTask(() => {
            this._task = null;
            this.updateTarget(newValue);
        }, queueTaskOptions);
        task?.cancel();
    }
}
mixinUseScope(ContentBinding);
mixingBindingLimited(ContentBinding, () => 'updateTarget');
runtime.connectable()(ContentBinding);
mixinAstEvaluator(void 0, false)(ContentBinding);

class LetBinding {
    constructor(locator, observerLocator, ast, targetProperty, toBindingContext = false) {
        this.ast = ast;
        this.targetProperty = targetProperty;
        this.isBound = false;
        /** @internal */
        this._scope = void 0;
        this.target = null;
        // see Listener binding for explanation
        /** @internal */
        this.boundFn = false;
        this.l = locator;
        this.oL = observerLocator;
        this._toBindingContext = toBindingContext;
    }
    updateTarget() {
        this.target[this.targetProperty] = this._value;
    }
    handleChange() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.obs.version++;
        this._value = runtime.astEvaluate(this.ast, this._scope, this, this);
        this.obs.clear();
        this.updateTarget();
    }
    handleCollectionChange() {
        this.handleChange();
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                /* istanbul-ignore-next */
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        this.target = (this._toBindingContext ? _scope.bindingContext : _scope.overrideContext);
        runtime.astBind(this.ast, _scope, this);
        this._value = runtime.astEvaluate(this.ast, this._scope, this, this);
        this.updateTarget();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this.obs.clearAll();
    }
}
mixinUseScope(LetBinding);
mixingBindingLimited(LetBinding, () => 'updateTarget');
runtime.connectable(LetBinding);
mixinAstEvaluator(true)(LetBinding);

class PropertyBinding {
    constructor(controller, locator, observerLocator, taskQueue, ast, target, targetProperty, mode) {
        this.ast = ast;
        this.target = target;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.isBound = false;
        /** @internal */
        this._scope = void 0;
        /** @internal */
        this._targetObserver = void 0;
        /** @internal */
        this._task = null;
        /** @internal */
        this._targetSubscriber = null;
        // see Listener binding for explanation
        /** @internal */
        this.boundFn = false;
        this.l = locator;
        this._controller = controller;
        this._taskQueue = taskQueue;
        this.oL = observerLocator;
    }
    updateTarget(value) {
        this._targetObserver.setValue(value, this.target, this.targetProperty);
    }
    updateSource(value) {
        runtime.astAssign(this.ast, this._scope, this, value);
    }
    handleChange() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.obs.version++;
        const newValue = runtime.astEvaluate(this.ast, this._scope, this, 
        // should observe?
        (this.mode & toView) > 0 ? this : null);
        this.obs.clear();
        const shouldQueueFlush = this._controller.state !== activating && (this._targetObserver.type & atLayout) > 0;
        if (shouldQueueFlush) {
            // Queue the new one before canceling the old one, to prevent early yield
            task = this._task;
            this._task = this._taskQueue.queueTask(() => {
                this.updateTarget(newValue);
                this._task = null;
            }, updateTaskOpts);
            task?.cancel();
            task = null;
        }
        else {
            this.updateTarget(newValue);
        }
    }
    // todo: based off collection and handle update accordingly instead off always start
    handleCollectionChange() {
        this.handleChange();
    }
    bind(scope) {
        if (this.isBound) {
            if (this._scope === scope) {
                /* istanbul-ignore-next */
                return;
            }
            this.unbind();
        }
        this._scope = scope;
        runtime.astBind(this.ast, scope, this);
        const observerLocator = this.oL;
        const $mode = this.mode;
        let targetObserver = this._targetObserver;
        if (!targetObserver) {
            if ($mode & fromView) {
                targetObserver = observerLocator.getObserver(this.target, this.targetProperty);
            }
            else {
                targetObserver = observerLocator.getAccessor(this.target, this.targetProperty);
            }
            this._targetObserver = targetObserver;
        }
        const shouldConnect = ($mode & toView) > 0;
        if ($mode & (toView | oneTime)) {
            this.updateTarget(runtime.astEvaluate(this.ast, this._scope, this, shouldConnect ? this : null));
        }
        if ($mode & fromView) {
            targetObserver.subscribe(this._targetSubscriber ??= new BindingTargetSubscriber(this, this.l.get(IFlushQueue)));
            if (!shouldConnect) {
                this.updateSource(targetObserver.getValue(this.target, this.targetProperty));
            }
        }
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        if (this._targetSubscriber) {
            this._targetObserver.unsubscribe(this._targetSubscriber);
            this._targetSubscriber = null;
        }
        this._task?.cancel();
        this._task = null;
        this.obs.clearAll();
    }
    /**
     * Start using a given observer to listen to changes on the target of this binding
     */
    useTargetObserver(observer) {
        this._targetObserver?.unsubscribe(this);
        (this._targetObserver = observer).subscribe(this);
    }
    /**
     * Provide a subscriber for target change observation.
     *
     * Binding behaviors can use this to setup custom observation handling during bind lifecycle
     * to alter the update source behavior during bind phase of this binding.
     */
    useTargetSubscriber(subscriber) {
        if (this._targetSubscriber != null) {
            throw createMappedError(9995 /* ErrorNames.binding_already_has_target_subscriber */);
        }
        this._targetSubscriber = subscriber;
    }
}
mixinUseScope(PropertyBinding);
mixingBindingLimited(PropertyBinding, (propBinding) => (propBinding.mode & fromView) ? 'updateSource' : 'updateTarget');
runtime.connectable(PropertyBinding);
mixinAstEvaluator(true, false)(PropertyBinding);
let task = null;
const updateTaskOpts = {
    reusable: false,
    preempt: true,
};

class RefBinding {
    constructor(locator, ast, target) {
        this.ast = ast;
        this.target = target;
        this.isBound = false;
        /** @internal */
        this._scope = void 0;
        this.l = locator;
    }
    bind(_scope) {
        if (this.isBound) {
            if (this._scope === _scope) {
                /* istanbul-ignore-next */
                return;
            }
            this.unbind();
        }
        this._scope = _scope;
        runtime.astBind(this.ast, _scope, this);
        runtime.astAssign(this.ast, this._scope, this, this.target);
        // add isBound flag and remove isBinding flag
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.isBound = false;
        if (runtime.astEvaluate(this.ast, this._scope, this, null) === this.target) {
            runtime.astAssign(this.ast, this._scope, this, null);
        }
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
    }
}
mixinAstEvaluator(false)(RefBinding);

class ListenerBindingOptions {
    constructor(prevent, capture = false) {
        this.prevent = prevent;
        this.capture = capture;
    }
}
/**
 * Listener binding. Handle event binding between view and view model
 */
class ListenerBinding {
    constructor(locator, ast, target, targetEvent, options, modifiedEventHandler) {
        this.ast = ast;
        this.target = target;
        this.targetEvent = targetEvent;
        this.isBound = false;
        /**
         * Whether this binding only handles events originate from the target this binding is bound to
         */
        this.self = false;
        /**
         * Indicates if this binding evaluates an ast and get a function, that function should be bound
         * to the instance it is on
         *
         * @internal
         */
        this.boundFn = true;
        /** @internal */
        this._modifiedEventHandler = null;
        this.l = locator;
        this._options = options;
        this._modifiedEventHandler = modifiedEventHandler;
    }
    callSource(event) {
        const overrideContext = this._scope.overrideContext;
        overrideContext.$event = event;
        let result = runtime.astEvaluate(this.ast, this._scope, this, null);
        delete overrideContext.$event;
        if (isFunction(result)) {
            result = result(event);
        }
        if (result !== true && this._options.prevent) {
            event.preventDefault();
        }
        return result;
    }
    handleEvent(event) {
        if (this.self) {
            if (this.target !== event.composedPath()[0]) {
                /* istanbul-ignore-next */
                return;
            }
        }
        if (this._modifiedEventHandler?.(event) !== false) {
            this.callSource(event);
        }
    }
    bind(scope) {
        if (this.isBound) {
            if (this._scope === scope) {
                /* istanbul-ignore-next */
                return;
            }
            this.unbind();
        }
        this._scope = scope;
        runtime.astBind(this.ast, scope, this);
        this.target.addEventListener(this.targetEvent, this, this._options);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.isBound = false;
        runtime.astUnbind(this.ast, this._scope, this);
        this._scope = void 0;
        this.target.removeEventListener(this.targetEvent, this, this._options);
    }
}
mixinUseScope(ListenerBinding);
mixingBindingLimited(ListenerBinding, () => 'callSource');
mixinAstEvaluator(true, true)(ListenerBinding);
const IModifiedEventHandlerCreator = /*@__PURE__*/ createInterface('IEventModifier');
const IKeyMapping = /*@__PURE__*/ createInterface('IKeyMapping', x => x.instance({
    meta: objectFreeze(['ctrl', 'alt', 'shift', 'meta']),
    keys: {
        escape: 'Escape',
        enter: 'Enter',
        space: 'Space',
        tab: 'tab',
        // by default, maps the key a-z and A-Z to their respective keycodes
        ...Array.from({ length: 25 }).reduce((acc, _, idx) => {
            // map keycode of upper case character from A-Z
            let char = String.fromCharCode(idx + 65);
            acc[idx + 65] = char;
            // map keycode and character code of lower case character from a-z
            char = String.fromCharCode(idx + 97);
            acc[idx + 97] = acc[char] = char;
            return acc;
        }, {})
    },
}));
class ModifiedMouseEventHandler {
    constructor() {
        this.type = ['click', 'mousedown', 'mousemove', 'mouseup', 'dblclick', 'contextmenu'];
        /** @internal */
        this._mapping = kernel.resolve(IKeyMapping);
        /** @internal */
        this._mouseButtons = ['left', 'middle', 'right'];
    }
    static register(c) {
        c.register(singletonRegistration(IModifiedEventHandlerCreator, ModifiedMouseEventHandler));
    }
    getHandler(modifier) {
        const modifiers = modifier.split(/[:+.]/);
        return ((event) => {
            let prevent = false;
            let stop = false;
            let m;
            for (m of modifiers) {
                switch (m) {
                    case 'prevent':
                        prevent = true;
                        continue;
                    case 'stop':
                        stop = true;
                        continue;
                    case 'left':
                    case 'middle':
                    case 'right':
                        if (event.button !== this._mouseButtons.indexOf(m))
                            return false;
                        continue;
                }
                if (this._mapping.meta.includes(m) && event[`${m}Key`] !== true) {
                    return false;
                }
                {
                    // eslint-disable-next-line no-console
                    console.warn(`Modifier '${m}' is not supported for mouse events.`);
                }
            }
            if (prevent)
                event.preventDefault();
            if (stop)
                event.stopPropagation();
            return true;
        });
    }
}
class ModifiedKeyboardEventHandler {
    constructor() {
        /** @internal */
        this._mapping = kernel.resolve(IKeyMapping);
        this.type = ['keydown', 'keyup'];
    }
    static register(c) {
        c.register(singletonRegistration(IModifiedEventHandlerCreator, ModifiedKeyboardEventHandler));
    }
    getHandler(modifier) {
        const modifiers = modifier.split(/[:+.]/);
        return ((event) => {
            let prevent = false;
            let stop = false;
            let mod;
            for (mod of modifiers) {
                switch (mod) {
                    case 'prevent':
                        prevent = true;
                        continue;
                    case 'stop':
                        stop = true;
                        continue;
                }
                if (this._mapping.meta.includes(mod)) {
                    if (event[`${mod}Key`] !== true) {
                        return false;
                    }
                    continue;
                }
                const mappedKey = this._mapping.keys[mod];
                if (mappedKey !== event.key) {
                    return false;
                }
                {
                    // eslint-disable-next-line no-console
                    console.warn(`Modifier '${mod}' is not supported for keyboard event with key "${event.key}".`);
                }
            }
            if (prevent)
                event.preventDefault();
            if (stop)
                event.stopPropagation();
            return true;
        });
    }
}
const IEventModifier = /*@__PURE__*/ createInterface('IEventModifierHandler', x => x.instance({
    getHandler: () => {
        {
            // eslint-disable-next-line no-console
            console.warn('No event modifier handler registered');
        }
        /* istanbul ignore next */
        return null;
    }
}));
class EventModifier {
    constructor() {
        /** @internal */
        this._reg = kernel.resolve(kernel.all(IModifiedEventHandlerCreator))
            .reduce((acc, cur) => {
            const types = isArray(cur.type) ? cur.type : [cur.type];
            types.forEach(t => acc[t] = cur);
            return acc;
        }, {});
    }
    static register(c) {
        c.register(singletonRegistration(IEventModifier, EventModifier));
    }
    getHandler(type, modifier) {
        return isString(modifier) ? this._reg[type]?.getHandler(modifier) ?? null : null;
    }
}
const EventModifierRegistration = {
    register(c) {
        c.register(EventModifier, ModifiedMouseEventHandler, ModifiedKeyboardEventHandler);
    }
};

const IViewFactory = /*@__PURE__*/ createInterface('IViewFactory');
class ViewFactory {
    constructor(container, def) {
        this.isCaching = false;
        /** @internal */
        this._cache = null;
        /** @internal */
        this._cacheSize = -1;
        this.name = def.name;
        this.container = container;
        this.def = def;
    }
    setCacheSize(size, doNotOverrideIfAlreadySet) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (size) {
            if (size === '*') {
                size = ViewFactory.maxCacheSize;
            }
            else if (isString(size)) {
                size = parseInt(size, 10);
            }
            if (this._cacheSize === -1 || !doNotOverrideIfAlreadySet) {
                this._cacheSize = size;
            }
        }
        if (this._cacheSize > 0) {
            this._cache = [];
        }
        else {
            this._cache = null;
        }
        this.isCaching = this._cacheSize > 0;
    }
    canReturnToCache(_controller) {
        return this._cache != null && this._cache.length < this._cacheSize;
    }
    tryReturnToCache(controller) {
        if (this.canReturnToCache(controller)) {
            this._cache.push(controller);
            return true;
        }
        return false;
    }
    create(parentController) {
        const cache = this._cache;
        let controller;
        if (cache != null && cache.length > 0) {
            controller = cache.pop();
            return controller;
        }
        controller = Controller.$view(this, parentController);
        return controller;
    }
}
ViewFactory.maxCacheSize = 0xFFFF;

/** @internal */
const auLocationStart = 'au-start';
/** @internal */
const auLocationEnd = 'au-end';
/** @internal */
const createElement 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
= (p, name) => p.document.createElement(name);
/** @internal */
const createComment = (p, text) => p.document.createComment(text);
/** @internal */
const createLocation = (p) => {
    const locationEnd = createComment(p, auLocationEnd);
    locationEnd.$start = createComment(p, auLocationStart);
    return locationEnd;
};
/** @internal */
const createText = (p, text) => p.document.createTextNode(text);
/** @internal */
const insertBefore = (parent, newChildNode, target) => {
    return parent.insertBefore(newChildNode, target);
};
/** @internal */
const insertManyBefore = (parent, target, newChildNodes) => {
    if (parent === null) {
        return;
    }
    const ii = newChildNodes.length;
    let i = 0;
    while (ii > i) {
        parent.insertBefore(newChildNodes[i], target);
        ++i;
    }
};
/** @internal */
const appendToTemplate = (parent, child) => {
    return parent.content.appendChild(child);
};
/** @internal */
const appendManyToTemplate = (parent, children) => {
    const ii = children.length;
    let i = 0;
    while (ii > i) {
        parent.content.appendChild(children[i]);
        ++i;
    }
};
/** @internal */
const createMutationObserver = (node, callback) => new node.ownerDocument.defaultView.MutationObserver(callback);
/** @internal */
const isElement = (node) => node.nodeType === 1;
/** @internal */
const isTextNode = (node) => node.nodeType === 3;

/** @internal */
const defaultSlotName = 'default';
/** @internal */
const auslotAttr = 'au-slot';
/**
 * Describing the projection information statically available for a custom element
 */
const IAuSlotsInfo = /*@__PURE__*/ createInterface('IAuSlotsInfo');
class AuSlotsInfo {
    constructor(projectedSlots) {
        this.projectedSlots = projectedSlots;
    }
}
const IAuSlotWatcher = /*@__PURE__*/ createInterface('IAuSlotWatcher');
class AuSlotWatcherBinding {
    constructor(obj, callback, slotName, query) {
        /** @internal */
        this._slots = new Set();
        /** @internal */
        this._nodes = kernel.emptyArray;
        this.isBound = false;
        this._callback = (this._obj = obj)[callback];
        this.slotName = slotName;
        this._query = query;
    }
    bind() {
        this.isBound = true;
    }
    unbind() {
        this.isBound = false;
    }
    getValue() {
        return this._nodes;
    }
    watch(slot) {
        if (!this._slots.has(slot)) {
            this._slots.add(slot);
            slot.subscribe(this);
        }
    }
    unwatch(slot) {
        if (this._slots.delete(slot)) {
            slot.unsubscribe(this);
        }
    }
    handleSlotChange(slot, nodes) {
        if (!this.isBound) {
            return;
        }
        const oldNodes = this._nodes;
        const $nodes = [];
        let $slot;
        let node;
        for ($slot of this._slots) {
            for (node of $slot === slot ? nodes : $slot.nodes) {
                if (this._query === '*' || (isElement(node) && node.matches(this._query))) {
                    $nodes[$nodes.length] = node;
                }
            }
        }
        if ($nodes.length !== oldNodes.length || $nodes.some((n, i) => n !== oldNodes[i])) {
            this._nodes = $nodes;
            this._callback?.call(this._obj, $nodes);
            this.subs.notify($nodes, oldNodes);
        }
    }
    /* istanbul ignore next */
    get() {
        throw createMappedError(99 /* ErrorNames.method_not_implemented */, 'get');
    }
}
class SlottedLifecycleHooks {
    constructor(_def) {
        this._def = _def;
    }
    register(c) {
        instanceRegistration(ILifecycleHooks, this).register(c);
    }
    hydrating(vm, controller) {
        const $def = this._def;
        const watcher = new AuSlotWatcherBinding(vm, $def.callback ?? `${safeString($def.name)}Changed`, $def.slotName ?? 'default', $def.query ?? '*');
        def(vm, $def.name, {
            enumerable: true,
            configurable: true,
            get: objectAssign(( /* SlotWatcherBinding */) => watcher.getValue(), { getObserver: () => watcher }),
            set: ( /* SlotWatcherBinding */) => { }
        });
        instanceRegistration(IAuSlotWatcher, watcher).register(controller.container);
        controller.addBinding(watcher);
    }
}
function slotted(queryOrDef, slotName) {
    if (!mixed$1) {
        mixed$1 = true;
        runtime.subscriberCollection(AuSlotWatcherBinding);
        lifecycleHooks()(SlottedLifecycleHooks);
    }
    const dependenciesKey = 'dependencies';
    function decorator($target, $prop, desc) {
        const config = (typeof queryOrDef === 'object'
            ? queryOrDef
            : {
                query: queryOrDef,
                slotName,
                name: ''
            });
        config.name = $prop;
        if (typeof $target === 'function' || typeof desc?.value !== 'undefined') {
            throw createMappedError(9990 /* ErrorNames.slotted_decorator_invalid_usage */);
        }
        const target = $target.constructor;
        let dependencies = CustomElement.getAnnotation(target, dependenciesKey);
        if (dependencies == null) {
            CustomElement.annotate(target, dependenciesKey, dependencies = []);
        }
        dependencies.push(new SlottedLifecycleHooks(config));
    }
    return decorator;
}
let mixed$1 = false;

/**
 * The public methods of this binding emulates the necessary of an IHydratableController,
 * which mainly is the addBinding method since a spread binding
 * is a surrogate of other bindings created from the captured attrs
 */
class SpreadBinding {
    /**
     * Create a list of SpreadBinding by searching for captured attributes in HydrationContexts
     * from a container
     */
    static create(hydrationContext, target, 
    /**
     * To be supplied to the compilation of spread' attrs
     * Sometimes in dynamic compilation scenario, this could be used to influence
     * what attributes can be compiled into (i.e bindable vs normal)
     */
    targetDef, rendering, compiler, platform, exprParser, observerLocator) {
        const bindings = [];
        const renderers = rendering.renderers;
        const getHydrationContext = (ancestor) => {
            let currentLevel = ancestor;
            let currentContext = hydrationContext;
            while (currentContext != null && currentLevel > 0) {
                currentContext = currentContext.parent;
                --currentLevel;
            }
            if (currentContext == null) {
                throw createMappedError(9999 /* ErrorNames.no_spread_scope_context_found */);
            }
            return currentContext;
        };
        const renderSpreadInstruction = (ancestor) => {
            const context = getHydrationContext(ancestor);
            const spreadBinding$1 = new SpreadBinding(context);
            const instructions = compiler.compileSpread(context.controller.definition, context.instruction?.captures ?? kernel.emptyArray, context.controller.container, target, targetDef);
            let inst;
            for (inst of instructions) {
                switch (inst.type) {
                    case spreadBinding:
                        renderSpreadInstruction(ancestor + 1);
                        break;
                    case spreadElementProp:
                        renderers[inst.instructions.type].render(spreadBinding$1, findElementControllerFor(target), inst.instructions, platform, exprParser, observerLocator);
                        break;
                    default:
                        renderers[inst.type].render(spreadBinding$1, target, inst, platform, exprParser, observerLocator);
                }
            }
            bindings.push(spreadBinding$1);
        };
        renderSpreadInstruction(0);
        return bindings;
    }
    get container() {
        return this.locator;
    }
    get definition() {
        return this.$controller.definition;
    }
    get state() {
        return this.$controller.state;
    }
    constructor(hydrationContext) {
        this.isBound = false;
        /** @internal */ this._innerBindings = [];
        this.locator = (this.$controller = (this._hydrationContext = hydrationContext).controller).container;
    }
    get(key) {
        return this.locator.get(key);
    }
    bind(_scope) {
        if (this.isBound) {
            /* istanbul-ignore-next */
            return;
        }
        this.isBound = true;
        const innerScope = this.scope = this._hydrationContext.controller.scope.parent ?? void 0;
        if (innerScope == null) {
            throw createMappedError(9999 /* ErrorNames.no_spread_scope_context_found */);
        }
        this._innerBindings.forEach(b => b.bind(innerScope));
    }
    unbind() {
        this._innerBindings.forEach(b => b.unbind());
        this.isBound = false;
    }
    addBinding(binding) {
        this._innerBindings.push(binding);
    }
    addChild(controller) {
        if (controller.vmKind !== vmkCa) {
            throw createMappedError(9998 /* ErrorNames.no_spread_template_controller */);
        }
        this.$controller.addChild(controller);
    }
}

/** @internal */ const hydrateElement = 'ra';
/** @internal */ const hydrateAttribute = 'rb';
/** @internal */ const hydrateTemplateController = 'rc';
/** @internal */ const hydrateLetElement = 'rd';
/** @internal */ const setProperty = 're';
/** @internal */ const interpolation = 'rf';
/** @internal */ const propertyBinding = 'rg';
/** @internal */ const letBinding = 'ri';
/** @internal */ const refBinding = 'rj';
/** @internal */ const iteratorBinding = 'rk';
/** @internal */ const multiAttr = 'rl';
/** @internal */ const textBinding = 'ha';
/** @internal */ const listenerBinding = 'hb';
/** @internal */ const attributeBinding = 'hc';
/** @internal */ const stylePropertyBinding = 'hd';
/** @internal */ const setAttribute = 'he';
/** @internal */ const setClassAttribute = 'hf';
/** @internal */ const setStyleAttribute = 'hg';
/** @internal */ const spreadBinding = 'hs';
/** @internal */ const spreadElementProp = 'hp';
const InstructionType = /*@__PURE__*/ objectFreeze({
    hydrateElement,
    hydrateAttribute,
    hydrateTemplateController,
    hydrateLetElement,
    setProperty,
    interpolation,
    propertyBinding,
    letBinding,
    refBinding,
    iteratorBinding,
    multiAttr,
    textBinding,
    listenerBinding,
    attributeBinding,
    stylePropertyBinding,
    setAttribute,
    setClassAttribute,
    setStyleAttribute,
    spreadBinding,
    spreadElementProp,
});
const IInstruction = /*@__PURE__*/ createInterface('Instruction');
function isInstruction(value) {
    const type = value.type;
    return isString(type) && type.length === 2;
}
class InterpolationInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = interpolation;
    }
}
class PropertyBindingInstruction {
    constructor(from, to, mode) {
        this.from = from;
        this.to = to;
        this.mode = mode;
        this.type = propertyBinding;
    }
}
class IteratorBindingInstruction {
    constructor(forOf, to, props) {
        this.forOf = forOf;
        this.to = to;
        this.props = props;
        this.type = iteratorBinding;
    }
}
class RefBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = refBinding;
    }
}
class SetPropertyInstruction {
    constructor(value, to) {
        this.value = value;
        this.to = to;
        this.type = setProperty;
    }
}
class MultiAttrInstruction {
    constructor(value, to, command) {
        this.value = value;
        this.to = to;
        this.command = command;
        this.type = multiAttr;
    }
}
class HydrateElementInstruction {
    constructor(
    /**
     * The name of the custom element this instruction is associated with
     */
    // in theory, Constructor of resources should be accepted too
    // though it would be unnecessary right now
    res, 
    /**
     * Bindable instructions for the custom element instance
     */
    props, 
    /**
     * Indicates what projections are associated with the element usage
     */
    projections, 
    /**
     * Indicates whether the usage of the custom element was with a containerless attribute or not
     */
    containerless, 
    /**
     * A list of captured attr syntaxes
     */
    captures, 
    /**
     * Any data associated with this instruction
     */
    data) {
        this.res = res;
        this.props = props;
        this.projections = projections;
        this.containerless = containerless;
        this.captures = captures;
        this.data = data;
        this.type = hydrateElement;
    }
}
class HydrateAttributeInstruction {
    constructor(
    // in theory, Constructor of resources should be accepted too
    // though it would be unnecessary right now
    res, alias, 
    /**
     * Bindable instructions for the custom attribute instance
     */
    props) {
        this.res = res;
        this.alias = alias;
        this.props = props;
        this.type = hydrateAttribute;
    }
}
class HydrateTemplateController {
    constructor(def, 
    // in theory, Constructor of resources should be accepted too
    // though it would be unnecessary right now
    res, alias, 
    /**
     * Bindable instructions for the template controller instance
     */
    props) {
        this.def = def;
        this.res = res;
        this.alias = alias;
        this.props = props;
        this.type = hydrateTemplateController;
    }
}
class HydrateLetElementInstruction {
    constructor(instructions, toBindingContext) {
        this.instructions = instructions;
        this.toBindingContext = toBindingContext;
        this.type = hydrateLetElement;
    }
}
class LetBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = letBinding;
    }
}
class TextBindingInstruction {
    constructor(from) {
        this.from = from;
        this.type = textBinding;
    }
}
class ListenerBindingInstruction {
    constructor(from, to, capture, modifier) {
        this.from = from;
        this.to = to;
        this.capture = capture;
        this.modifier = modifier;
        this.type = listenerBinding;
    }
}
class StylePropertyBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = stylePropertyBinding;
    }
}
class SetAttributeInstruction {
    constructor(value, to) {
        this.value = value;
        this.to = to;
        this.type = setAttribute;
    }
}
class SetClassAttributeInstruction {
    constructor(value) {
        this.value = value;
        this.type = setClassAttribute;
    }
}
class SetStyleAttributeInstruction {
    constructor(value) {
        this.value = value;
        this.type = setStyleAttribute;
    }
}
class AttributeBindingInstruction {
    constructor(
    /**
     * `attr` and `to` have the same value on a normal attribute
     * Will be different on `class` and `style`
     * on `class`: attr = `class` (from binding command), to = attribute name
     * on `style`: attr = `style` (from binding command), to = attribute name
     */
    attr, from, to) {
        this.attr = attr;
        this.from = from;
        this.to = to;
        this.type = attributeBinding;
    }
}
class SpreadBindingInstruction {
    constructor() {
        this.type = spreadBinding;
    }
}
class SpreadElementPropBindingInstruction {
    constructor(instructions) {
        this.instructions = instructions;
        this.type = spreadElementProp;
    }
}
const ITemplateCompiler = /*@__PURE__*/ createInterface('ITemplateCompiler');
const IRenderer = /*@__PURE__*/ createInterface('IRenderer');
function renderer(targetType) {
    return function decorator(target) {
        def(target.prototype, 'target', {
            configurable: true,
            get() { return targetType; }
        });
        return kernel.Registrable.define(target, function (container) {
            singletonRegistration(IRenderer, this).register(container);
        });
    };
}
function ensureExpression(parser, srcOrExpr, expressionType) {
    if (isString(srcOrExpr)) {
        return parser.parse(srcOrExpr, expressionType);
    }
    return srcOrExpr;
}
function getTarget(potentialTarget) {
    if (potentialTarget.viewModel != null) {
        return potentialTarget.viewModel;
    }
    return potentialTarget;
}
function getRefTarget(refHost, refTargetName) {
    if (refTargetName === 'element') {
        return refHost;
    }
    switch (refTargetName) {
        case 'controller':
            // this means it supports returning undefined
            return findElementControllerFor(refHost);
        case 'view':
            throw createMappedError(750 /* ErrorNames.not_supported_view_ref_api */);
        case 'component':
            // this means it supports returning undefined
            return findElementControllerFor(refHost).viewModel;
        default: {
            const caController = findAttributeControllerFor(refHost, refTargetName);
            if (caController !== void 0) {
                return caController.viewModel;
            }
            const ceController = findElementControllerFor(refHost, { name: refTargetName });
            if (ceController === void 0) {
                throw createMappedError(751 /* ErrorNames.ref_not_found */, refTargetName);
            }
            return ceController.viewModel;
        }
    }
}
exports.SetPropertyRenderer = class SetPropertyRenderer {
    render(renderingCtrl, target, instruction) {
        const obj = getTarget(target);
        if (obj.$observers?.[instruction.to] !== void 0) {
            obj.$observers[instruction.to].setValue(instruction.value);
        }
        else {
            obj[instruction.to] = instruction.value;
        }
    }
};
exports.SetPropertyRenderer = __decorate([
    renderer(setProperty)
    /** @internal */
], exports.SetPropertyRenderer);
exports.CustomElementRenderer = class CustomElementRenderer {
    constructor() {
        /** @internal */ this._rendering = kernel.resolve(IRendering);
    }
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        /* eslint-disable prefer-const */
        let def;
        let component;
        let childCtrl;
        const res = instruction.res;
        const projections = instruction.projections;
        const ctxContainer = renderingCtrl.container;
        switch (typeof res) {
            case 'string':
                def = CustomElement.find(ctxContainer, res);
                if (def == null) {
                    throw createMappedError(752 /* ErrorNames.element_res_not_found */, instruction, renderingCtrl);
                }
                break;
            // constructor based instruction
            // will be enabled later if needed.
            // As both AOT + runtime based can use definition for perf
            // -----------------
            // case 'function':
            //   def = CustomElement.getDefinition(res);
            //   break;
            default:
                def = res;
        }
        const containerless = instruction.containerless || def.containerless;
        const location = containerless ? convertToRenderLocation(target) : null;
        const container = createElementContainer(
        /* platform         */ platform, 
        /* parentController */ renderingCtrl, 
        /* host             */ target, 
        /* instruction      */ instruction, 
        /* location         */ location, 
        /* SlotsInfo      */ projections == null ? void 0 : new AuSlotsInfo(objectKeys(projections)));
        component = container.invoke(def.Type);
        childCtrl = Controller.$el(
        /* own container       */ container, 
        /* viewModel           */ component, 
        /* host                */ target, 
        /* instruction         */ instruction, 
        /* definition          */ def, 
        /* location            */ location);
        setRef(target, def.key, childCtrl);
        const renderers = this._rendering.renderers;
        const props = instruction.props;
        const ii = props.length;
        let i = 0;
        let propInst;
        while (ii > i) {
            propInst = props[i];
            renderers[propInst.type].render(renderingCtrl, childCtrl, propInst, platform, exprParser, observerLocator);
            ++i;
        }
        renderingCtrl.addChild(childCtrl);
        /* eslint-enable prefer-const */
    }
};
exports.CustomElementRenderer = __decorate([
    renderer(hydrateElement)
    /** @internal */
], exports.CustomElementRenderer);
exports.CustomAttributeRenderer = class CustomAttributeRenderer {
    constructor() {
        /** @internal */ this._rendering = kernel.resolve(IRendering);
    }
    render(
    /**
     * The cotroller that is currently invoking this renderer
     */
    renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        /* eslint-disable prefer-const */
        let ctxContainer = renderingCtrl.container;
        let def;
        switch (typeof instruction.res) {
            case 'string':
                def = CustomAttribute.find(ctxContainer, instruction.res);
                if (def == null) {
                    throw createMappedError(753 /* ErrorNames.attribute_res_not_found */, instruction, renderingCtrl);
                }
                break;
            // constructor based instruction
            // will be enabled later if needed.
            // As both AOT + runtime based can use definition for perf
            // -----------------
            // case 'function':
            //   def = CustomAttribute.getDefinition(instruction.res);
            //   break;
            default:
                def = instruction.res;
        }
        const results = invokeAttribute(
        /* platform         */ platform, 
        /* attr definition  */ def, 
        /* parentController */ renderingCtrl, 
        /* host             */ target, 
        /* instruction      */ instruction, 
        /* viewFactory      */ void 0, 
        /* location         */ void 0);
        const childController = Controller.$attr(
        /* context ct */ results.ctn, 
        /* viewModel  */ results.vm, 
        /* host       */ target, 
        /* definition */ def);
        setRef(target, def.key, childController);
        const renderers = this._rendering.renderers;
        const props = instruction.props;
        const ii = props.length;
        let i = 0;
        let propInst;
        while (ii > i) {
            propInst = props[i];
            renderers[propInst.type].render(renderingCtrl, childController, propInst, platform, exprParser, observerLocator);
            ++i;
        }
        renderingCtrl.addChild(childController);
        /* eslint-enable prefer-const */
    }
};
exports.CustomAttributeRenderer = __decorate([
    renderer(hydrateAttribute)
    /** @internal */
], exports.CustomAttributeRenderer);
exports.TemplateControllerRenderer = class TemplateControllerRenderer {
    constructor() {
        /** @internal */ this._rendering = kernel.resolve(IRendering);
    }
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        /* eslint-disable prefer-const */
        let ctxContainer = renderingCtrl.container;
        let def;
        switch (typeof instruction.res) {
            case 'string':
                def = CustomAttribute.find(ctxContainer, instruction.res);
                if (def == null) {
                    throw createMappedError(754 /* ErrorNames.attribute_tc_res_not_found */, instruction, renderingCtrl);
                }
                break;
            // constructor based instruction
            // will be enabled later if needed.
            // As both AOT + runtime based can use definition for perf
            // -----------------
            // case 'function':
            //   def = CustomAttribute.getDefinition(instruction.res);
            //   break;
            default:
                def = instruction.res;
        }
        // const viewFactory = this._rendering.getViewFactory(
        //   instruction.def,
        //   ctxContainer
        // );
        const viewFactory = this._rendering.getViewFactory(instruction.def, def.containerStrategy === 'new'
            ? ctxContainer.createChild({ inheritParentResources: true })
            : ctxContainer);
        const renderLocation = convertToRenderLocation(target);
        const results = invokeAttribute(
        /* platform         */ platform, 
        /* attr definition  */ def, 
        /* parentController */ renderingCtrl, 
        /* host             */ target, 
        /* instruction      */ instruction, 
        /* viewFactory      */ viewFactory, 
        /* location         */ renderLocation);
        const childController = Controller.$attr(
        /* container ct */ results.ctn, 
        /* viewModel    */ results.vm, 
        /* host         */ target, 
        /* definition   */ def);
        setRef(renderLocation, def.key, childController);
        results.vm.link?.(renderingCtrl, childController, target, instruction);
        const renderers = this._rendering.renderers;
        const props = instruction.props;
        const ii = props.length;
        let i = 0;
        let propInst;
        while (ii > i) {
            propInst = props[i];
            renderers[propInst.type].render(renderingCtrl, childController, propInst, platform, exprParser, observerLocator);
            ++i;
        }
        renderingCtrl.addChild(childController);
        /* eslint-enable prefer-const */
    }
};
exports.TemplateControllerRenderer = __decorate([
    renderer(hydrateTemplateController)
    /** @internal */
], exports.TemplateControllerRenderer);
exports.LetElementRenderer = class LetElementRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        target.remove();
        const childInstructions = instruction.instructions;
        const toBindingContext = instruction.toBindingContext;
        const container = renderingCtrl.container;
        const ii = childInstructions.length;
        let childInstruction;
        let expr;
        let i = 0;
        while (ii > i) {
            childInstruction = childInstructions[i];
            expr = ensureExpression(exprParser, childInstruction.from, etIsProperty);
            renderingCtrl.addBinding(new LetBinding(container, observerLocator, expr, childInstruction.to, toBindingContext));
            ++i;
        }
    }
};
exports.LetElementRenderer = __decorate([
    renderer(hydrateLetElement)
    /** @internal */
], exports.LetElementRenderer);
exports.RefBindingRenderer = class RefBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser) {
        renderingCtrl.addBinding(new RefBinding(renderingCtrl.container, ensureExpression(exprParser, instruction.from, etIsProperty), getRefTarget(target, instruction.to)));
    }
};
exports.RefBindingRenderer = __decorate([
    renderer(refBinding)
    /** @internal */
], exports.RefBindingRenderer);
exports.InterpolationBindingRenderer = class InterpolationBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new InterpolationBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, etInterpolation), getTarget(target), instruction.to, toView));
    }
};
exports.InterpolationBindingRenderer = __decorate([
    renderer(interpolation)
    /** @internal */
], exports.InterpolationBindingRenderer);
exports.PropertyBindingRenderer = class PropertyBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new PropertyBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, etIsProperty), getTarget(target), instruction.to, instruction.mode));
    }
};
exports.PropertyBindingRenderer = __decorate([
    renderer(propertyBinding)
    /** @internal */
], exports.PropertyBindingRenderer);
exports.IteratorBindingRenderer = class IteratorBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new PropertyBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.forOf, etIsIterator), getTarget(target), instruction.to, toView));
    }
};
exports.IteratorBindingRenderer = __decorate([
    renderer(iteratorBinding)
    /** @internal */
], exports.IteratorBindingRenderer);
exports.TextBindingRenderer = class TextBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        renderingCtrl.addBinding(new ContentBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, platform, ensureExpression(exprParser, instruction.from, etIsProperty), target));
    }
};
exports.TextBindingRenderer = __decorate([
    renderer(textBinding)
    /** @internal */
], exports.TextBindingRenderer);
const IListenerBindingOptions = createInterface('IListenerBindingOptions', x => x.instance({
    prevent: false,
}));
exports.ListenerBindingRenderer = class ListenerBindingRenderer {
    constructor() {
        /** @internal */
        this._modifierHandler = kernel.resolve(IEventModifier);
        /** @internal */
        this._defaultOptions = kernel.resolve(IListenerBindingOptions);
    }
    render(renderingCtrl, target, instruction, platform, exprParser) {
        renderingCtrl.addBinding(new ListenerBinding(renderingCtrl.container, ensureExpression(exprParser, instruction.from, etIsFunction), target, instruction.to, new ListenerBindingOptions(this._defaultOptions.prevent, instruction.capture), this._modifierHandler.getHandler(instruction.to, instruction.modifier)));
    }
};
exports.ListenerBindingRenderer = __decorate([
    renderer(listenerBinding)
    /** @internal */
], exports.ListenerBindingRenderer);
exports.SetAttributeRenderer = class SetAttributeRenderer {
    render(_, target, instruction) {
        target.setAttribute(instruction.to, instruction.value);
    }
};
exports.SetAttributeRenderer = __decorate([
    renderer(setAttribute)
    /** @internal */
], exports.SetAttributeRenderer);
exports.SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(_, target, instruction) {
        addClasses(target.classList, instruction.value);
    }
};
exports.SetClassAttributeRenderer = __decorate([
    renderer(setClassAttribute)
], exports.SetClassAttributeRenderer);
exports.SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(_, target, instruction) {
        target.style.cssText += instruction.value;
    }
};
exports.SetStyleAttributeRenderer = __decorate([
    renderer(setStyleAttribute)
], exports.SetStyleAttributeRenderer);
/* istanbul ignore next */
const ambiguousStyles = [
    'height',
    'width',
    'border-width',
    'padding',
    'padding-left',
    'padding-right',
    'padding-top',
    'padding-right',
    'padding-inline',
    'padding-block',
    'margin',
    'margin-left',
    'margin-right',
    'margin-top',
    'margin-bottom',
    'margin-inline',
    'margin-block',
    'top',
    'right',
    'bottom',
    'left',
];
exports.StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        {
            /* istanbul ignore next */
            if (ambiguousStyles.includes(instruction.to)) {
                renderingCtrl.addBinding(new DevStylePropertyBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, etIsProperty), target.style, instruction.to, toView));
                return;
            }
        }
        renderingCtrl.addBinding(new PropertyBinding(renderingCtrl, renderingCtrl.container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, etIsProperty), target.style, instruction.to, toView));
    }
};
exports.StylePropertyBindingRenderer = __decorate([
    renderer(stylePropertyBinding)
    /** @internal */
], exports.StylePropertyBindingRenderer);
/* istanbul ignore next */
class DevStylePropertyBinding extends PropertyBinding {
    updateTarget(value) {
        if (typeof value === 'number' && value > 0) {
            // eslint-disable-next-line no-console
            console.warn(`[DEV]: Setting number ${value} as value for style.${this.targetProperty}. Did you meant "${value}px"?`);
        }
        return super.updateTarget(value);
    }
}
exports.AttributeBindingRenderer = class AttributeBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        const container = renderingCtrl.container;
        const classMapping = container.has(ICssModulesMapping, false)
            ? container.get(ICssModulesMapping)
            : null;
        renderingCtrl.addBinding(new AttributeBinding(renderingCtrl, container, observerLocator, platform.domWriteQueue, ensureExpression(exprParser, instruction.from, etIsProperty), target, instruction.attr /* targetAttribute */, classMapping == null
            ? instruction.to /* targetKey */
            : instruction.to.split(/\s/g).map(c => classMapping[c] ?? c).join(' '), toView));
    }
};
exports.AttributeBindingRenderer = __decorate([
    renderer(attributeBinding)
    /** @internal */
], exports.AttributeBindingRenderer);
exports.SpreadRenderer = class SpreadRenderer {
    constructor() {
        /** @internal */ this._compiler = kernel.resolve(ITemplateCompiler);
        /** @internal */ this._rendering = kernel.resolve(IRendering);
    }
    render(renderingCtrl, target, _instruction, platform, exprParser, observerLocator) {
        SpreadBinding
            .create(renderingCtrl.container.get(IHydrationContext), target, void 0, this._rendering, this._compiler, platform, exprParser, observerLocator)
            .forEach(b => renderingCtrl.addBinding(b));
    }
};
exports.SpreadRenderer = __decorate([
    renderer(spreadBinding)
], exports.SpreadRenderer);
// http://jsben.ch/7n5Kt
function addClasses(classList, className) {
    const len = className.length;
    let start = 0;
    for (let i = 0; i < len; ++i) {
        if (className.charCodeAt(i) === 0x20) {
            if (i !== start) {
                classList.add(className.slice(start, i));
            }
            start = i + 1;
        }
        else if (i + 1 === len) {
            classList.add(className.slice(start));
        }
    }
}
// const createSurrogateBinding = (context: IHydrationContext<object>) =>
//   new SpreadBinding([], context) as SpreadBinding & IHydratableController;
const controllerProviderName = 'IController';
const instructionProviderName = 'IInstruction';
const locationProviderName = 'IRenderLocation';
const slotInfoProviderName = 'ISlotsInfo';
function createElementContainer(p, renderingCtrl, host, instruction, location, auSlotsInfo) {
    const ctn = renderingCtrl.container.createChild();
    registerHostNode(ctn, p, host);
    registerResolver(ctn, IController, new kernel.InstanceProvider(controllerProviderName, renderingCtrl));
    registerResolver(ctn, IInstruction, new kernel.InstanceProvider(instructionProviderName, instruction));
    registerResolver(ctn, IRenderLocation, location == null
        ? noLocationProvider
        : new RenderLocationProvider(location));
    registerResolver(ctn, IViewFactory, noViewFactoryProvider);
    registerResolver(ctn, IAuSlotsInfo, auSlotsInfo == null
        ? noAuSlotProvider
        : new kernel.InstanceProvider(slotInfoProviderName, auSlotsInfo));
    return ctn;
}
class ViewFactoryProvider {
    get $isResolver() { return true; }
    constructor(
    /**
     * The factory instance that this provider will resolves to,
     * until explicitly overridden by prepare call
     */
    factory) {
        this.f = factory;
    }
    resolve() {
        const f = this.f;
        if (f === null) {
            throw createMappedError(755 /* ErrorNames.view_factory_provider_not_ready */);
        }
        if (!isString(f.name) || f.name.length === 0) {
            throw createMappedError(756 /* ErrorNames.view_factory_invalid_name */);
        }
        return f;
    }
}
function invokeAttribute(p, definition, $renderingCtrl, host, instruction, viewFactory, location, auSlotsInfo) {
    const renderingCtrl = $renderingCtrl instanceof Controller
        ? $renderingCtrl
        : $renderingCtrl.$controller;
    const ctn = renderingCtrl.container.createChild();
    registerHostNode(ctn, p, host);
    registerResolver(ctn, IController, new kernel.InstanceProvider(controllerProviderName, renderingCtrl));
    registerResolver(ctn, IInstruction, new kernel.InstanceProvider(instructionProviderName, instruction));
    registerResolver(ctn, IRenderLocation, location == null
        ? noLocationProvider
        : new kernel.InstanceProvider(locationProviderName, location));
    registerResolver(ctn, IViewFactory, viewFactory == null
        ? noViewFactoryProvider
        : new ViewFactoryProvider(viewFactory));
    registerResolver(ctn, IAuSlotsInfo, auSlotsInfo == null
        ? noAuSlotProvider
        : new kernel.InstanceProvider(slotInfoProviderName, auSlotsInfo));
    return { vm: ctn.invoke(definition.Type), ctn };
}
class RenderLocationProvider {
    get name() { return 'IRenderLocation'; }
    get $isResolver() { return true; }
    constructor(_location) {
        this._location = _location;
    }
    resolve() {
        return this._location;
    }
}
const noLocationProvider = new RenderLocationProvider(null);
const noViewFactoryProvider = new ViewFactoryProvider(null);
const noAuSlotProvider = new kernel.InstanceProvider(slotInfoProviderName, new AuSlotsInfo(kernel.emptyArray));

const IRendering = /*@__PURE__*/ createInterface('IRendering', x => x.singleton(Rendering));
class Rendering {
    get renderers() {
        return this._renderers ??= this._ctn.getAll(IRenderer, false).reduce((all, r) => {
            all[r.target] = r;
            return all;
        }, createLookup());
    }
    constructor() {
        /** @internal */
        this._compilationCache = new WeakMap();
        /** @internal */
        this._fragmentCache = new WeakMap();
        const ctn = this._ctn = kernel.resolve(kernel.IContainer).root;
        this._platform = ctn.get(IPlatform);
        this._exprParser = ctn.get(runtime.IExpressionParser);
        this._observerLocator = ctn.get(runtime.IObserverLocator);
        this._empty = new FragmentNodeSequence(this._platform, this._platform.document.createDocumentFragment());
    }
    compile(definition, container, compilationInstruction) {
        if (definition.needsCompile !== false) {
            const compiledMap = this._compilationCache;
            const compiler = container.get(ITemplateCompiler);
            let compiled = compiledMap.get(definition);
            if (compiled == null) {
                compiledMap.set(definition, compiled = compiler.compile(definition, container, compilationInstruction));
            }
            else {
                // todo:
                // should only register if the compiled def resolution is string
                // instead of direct resources
                container.register(...compiled.dependencies);
            }
            return compiled;
        }
        return definition;
    }
    getViewFactory(definition, container) {
        return new ViewFactory(container, CustomElementDefinition.getOrCreate(definition));
    }
    createNodes(definition) {
        if (definition.enhance === true) {
            return new FragmentNodeSequence(this._platform, this._transformMarker(definition.template));
        }
        let fragment;
        let needsImportNode = false;
        const cache = this._fragmentCache;
        const p = this._platform;
        const doc = p.document;
        if (cache.has(definition)) {
            fragment = cache.get(definition);
        }
        else {
            const template = definition.template;
            let tpl;
            if (template === null) {
                fragment = null;
            }
            else if (template instanceof p.Node) {
                if (template.nodeName === 'TEMPLATE') {
                    fragment = template.content;
                    needsImportNode = true;
                }
                else {
                    (fragment = doc.createDocumentFragment()).appendChild(template.cloneNode(true));
                }
            }
            else {
                tpl = doc.createElement('template');
                if (isString(template)) {
                    tpl.innerHTML = template;
                }
                fragment = tpl.content;
                needsImportNode = true;
            }
            this._transformMarker(fragment);
            cache.set(definition, fragment);
        }
        return fragment == null
            ? this._empty
            : new FragmentNodeSequence(this._platform, needsImportNode
                ? doc.importNode(fragment, true)
                : doc.adoptNode(fragment.cloneNode(true)));
    }
    render(controller, targets, definition, host) {
        const rows = definition.instructions;
        const renderers = this.renderers;
        const ii = targets.length;
        let i = 0;
        let j = 0;
        let jj = rows.length;
        let row;
        let instruction;
        let target;
        if (ii !== jj) {
            throw createMappedError(757 /* ErrorNames.rendering_mismatch_length */, ii, jj);
        }
        if (ii > 0) {
            while (ii > i) {
                row = rows[i];
                target = targets[i];
                j = 0;
                jj = row.length;
                while (jj > j) {
                    instruction = row[j];
                    renderers[instruction.type].render(controller, target, instruction, this._platform, this._exprParser, this._observerLocator);
                    ++j;
                }
                ++i;
            }
        }
        if (host != null) {
            row = definition.surrogates;
            if ((jj = row.length) > 0) {
                j = 0;
                while (jj > j) {
                    instruction = row[j];
                    renderers[instruction.type].render(controller, host, instruction, this._platform, this._exprParser, this._observerLocator);
                    ++j;
                }
            }
        }
    }
    /** @internal */
    _marker() {
        return this._platform.document.createElement('au-m');
    }
    /** @internal */
    _transformMarker(fragment) {
        if (fragment == null) {
            return null;
        }
        let parent = fragment;
        let current = parent.firstChild;
        let next = null;
        while (current != null) {
            if (current.nodeType === 8 && current.nodeValue === 'au*') {
                next = current.nextSibling;
                parent.removeChild(current);
                parent.insertBefore(this._marker(), next);
                if (next.nodeType === 8) {
                    current = next.nextSibling;
                    // todo: maybe validate?
                }
                else {
                    current = next;
                }
            }
            next = current?.firstChild;
            if (next == null) {
                next = current?.nextSibling;
                if (next == null) {
                    current = parent.nextSibling;
                    parent = parent.parentNode;
                    // needs to keep walking up all the way til a valid next node
                    while (current == null && parent != null) {
                        current = parent.nextSibling;
                        parent = parent.parentNode;
                    }
                }
                else {
                    current = next;
                }
            }
            else {
                parent = current;
                current = next;
            }
        }
        return fragment;
    }
}

const addListener = (target, name, handler, options) => {
    target.addEventListener(name, handler, options);
};
const removeListener = (target, name, handler, options) => {
    target.removeEventListener(name, handler, options);
};
/** @internal */
const mixinNodeObserverUseConfig = (target) => {
    let event;
    const prototype = target.prototype;
    defineHiddenProp(prototype, 'subscribe', function (subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            for (event of this._config.events) {
                addListener(this._el, event, this);
            }
            this._listened = true;
            this._start?.();
        }
    });
    defineHiddenProp(prototype, 'unsubscribe', function (subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            for (event of this._config.events) {
                removeListener(this._el, event, this);
            }
            this._listened = false;
            this._stop?.();
        }
    });
    defineHiddenProp(prototype, 'useConfig', function (config) {
        this._config = config;
        if (this._listened) {
            for (event of this._config.events) {
                removeListener(this._el, event, this);
            }
            for (event of this._config.events) {
                addListener(this._el, event, this);
            }
        }
    });
};
/** @internal */
const mixinNoopSubscribable = (target) => {
    defineHiddenProp(target.prototype, 'subscribe', kernel.noop);
    defineHiddenProp(target.prototype, 'unsubscribe', kernel.noop);
};

class ClassAttributeAccessor {
    get doNotCache() { return true; }
    constructor(obj) {
        this.obj = obj;
        this.type = (atNode | atLayout);
        /** @internal */
        this._value = '';
        /** @internal */
        this._nameIndex = {};
        /** @internal */
        this._version = 0;
    }
    getValue() {
        return this._value;
    }
    setValue(newValue) {
        if (newValue !== this._value) {
            this._value = newValue;
            this._flushChanges();
        }
    }
    /** @internal */
    _flushChanges() {
        const nameIndex = this._nameIndex;
        const version = ++this._version;
        const classList = this.obj.classList;
        const classesToAdd = getClassesToAdd(this._value);
        const ii = classesToAdd.length;
        let i = 0;
        let name;
        // Get strings split on a space not including empties
        if (ii > 0) {
            for (; i < ii; i++) {
                name = classesToAdd[i];
                if (name.length === 0) {
                    continue;
                }
                nameIndex[name] = this._version;
                classList.add(name);
            }
        }
        // First call to setValue?  We're done.
        if (version === 1) {
            return;
        }
        for (name in nameIndex) {
            if (nameIndex[name] === version) {
                continue;
            }
            // TODO: this has the side-effect that classes already present which are added again,
            // will be removed if they're not present in the next update.
            // Better would be do have some configurability for this behavior, allowing the user to
            // decide whether initial classes always need to be kept, always removed, or something in between
            classList.remove(name);
        }
    }
}
function getClassesToAdd(object) {
    if (isString(object)) {
        return splitClassString(object);
    }
    if (typeof object !== 'object') {
        return kernel.emptyArray;
    }
    if (object instanceof Array) {
        const len = object.length;
        if (len > 0) {
            const classes = [];
            let i = 0;
            for (; len > i; ++i) {
                classes.push(...getClassesToAdd(object[i]));
            }
            return classes;
        }
        else {
            return kernel.emptyArray;
        }
    }
    const classes = [];
    let property;
    for (property in object) {
        // Let non typical values also evaluate true so disable bool check
        // eslint-disable-next-line no-extra-boolean-cast
        if (Boolean(object[property])) {
            // We must do this in case object property has a space in the name which results in two classes
            if (property.includes(' ')) {
                classes.push(...splitClassString(property));
            }
            else {
                classes.push(property);
            }
        }
    }
    return classes;
}
function splitClassString(classString) {
    const matches = classString.match(/\S+/g);
    if (matches === null) {
        return kernel.emptyArray;
    }
    return matches;
}
mixinNoopSubscribable(ClassAttributeAccessor);

/**
 * There are 2 implementations of CSS registry: css module registry and shadow dom registry.
 *
 * CSS registry alters the way class attribute works instead.
 *
 * Shadow dom registry regisiters some interfaces with the custom element container to handle shadow dom styles.
 * abtraction summary:
 * CSS registry ---(register)---> IShadowDOMStyleFactory ---(createStyles)---> IShadowDOMStyles ---(applyTo)---> ShadowRoot
 */
/**
 * create a registry to register CSS module handling for a custom element.
 * The resulting registry can be registered as a dependency of a custom element.
 */
function cssModules(...modules) {
    return new CSSModulesProcessorRegistry(modules);
}
class CSSModulesProcessorRegistry {
    constructor(modules) {
        this.modules = modules;
    }
    register(container) {
        // it'd be nice to be able to register a template compiler hook instead
        // so that it's lighter weight on the creation of a custom element with css module
        // also it'll be more consitent in terms as CSS class output
        // if custom attribute is used, the class controlled by custom attribute may come after
        // other bindings, regardless what their declaration order is in the template
        const classLookup = objectAssign({}, ...this.modules);
        const ClassCustomAttribute = defineAttribute({
            name: 'class',
            bindables: ['value'],
            noMultiBindings: true,
        }, class CustomAttributeClass {
            constructor() {
                /** @internal */
                this._accessor = new ClassAttributeAccessor(kernel.resolve(INode));
                this.value = '';
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                this._accessor.setValue(this.value?.split(/\s+/g).map(x => classLookup[x] || x) ?? '');
            }
        });
        container.register(ClassCustomAttribute, instanceRegistration(ICssModulesMapping, classLookup));
    }
}
/**
 * Creates a registry to register shadow dom styles handling for a custom element.
 * The resulting registry can be registered as a dependency of a custom element.
 */
function shadowCSS(...css) {
    return new ShadowDOMRegistry(css);
}
const IShadowDOMStyleFactory = /*@__PURE__*/ createInterface('IShadowDOMStyleFactory', x => x.cachedCallback(handler => {
    if (AdoptedStyleSheetsStyles.supported(handler.get(IPlatform))) {
        return handler.get(AdoptedStyleSheetsStylesFactory);
    }
    return handler.get(StyleElementStylesFactory);
}));
class ShadowDOMRegistry {
    constructor(css) {
        this.css = css;
    }
    register(container) {
        const sharedStyles = container.get(IShadowDOMGlobalStyles);
        const factory = container.get(IShadowDOMStyleFactory);
        container.register(instanceRegistration(IShadowDOMStyles, factory.createStyles(this.css, sharedStyles)));
    }
}
class AdoptedStyleSheetsStylesFactory {
    constructor() {
        this.p = kernel.resolve(IPlatform);
        this.cache = new Map();
    }
    createStyles(localStyles, sharedStyles) {
        return new AdoptedStyleSheetsStyles(this.p, localStyles, this.cache, sharedStyles);
    }
}
// not really needed nowadays since all browsers support adopted style sheet
// though keep it here for a bit longer before removing
/* istanbul ignore next */
class StyleElementStylesFactory {
    constructor() {
        this.p = kernel.resolve(IPlatform);
    }
    createStyles(localStyles, sharedStyles) {
        return new StyleElementStyles(this.p, localStyles, sharedStyles);
    }
}
const IShadowDOMStyles = /*@__PURE__*/ createInterface('IShadowDOMStyles');
const IShadowDOMGlobalStyles = /*@__PURE__*/ createInterface('IShadowDOMGlobalStyles', x => x.instance({ applyTo: kernel.noop }));
class AdoptedStyleSheetsStyles {
    constructor(p, localStyles, styleSheetCache, sharedStyles = null) {
        this.sharedStyles = sharedStyles;
        this.styleSheets = localStyles.map(x => {
            let sheet;
            if (x instanceof p.CSSStyleSheet) {
                sheet = x;
            }
            else {
                sheet = styleSheetCache.get(x);
                if (sheet === void 0) {
                    sheet = new p.CSSStyleSheet();
                    sheet.replaceSync(x);
                    styleSheetCache.set(x, sheet);
                }
            }
            return sheet;
        });
    }
    static supported(p) {
        return 'adoptedStyleSheets' in p.ShadowRoot.prototype;
    }
    applyTo(shadowRoot) {
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(shadowRoot);
        }
        // https://wicg.github.io/construct-stylesheets/
        // https://developers.google.com/web/updates/2019/02/constructable-stylesheets
        shadowRoot.adoptedStyleSheets = [
            ...shadowRoot.adoptedStyleSheets,
            ...this.styleSheets
        ];
    }
}
class StyleElementStyles {
    constructor(p, localStyles, sharedStyles = null) {
        this.p = p;
        this.localStyles = localStyles;
        this.sharedStyles = sharedStyles;
    }
    applyTo(shadowRoot) {
        const styles = this.localStyles;
        const p = this.p;
        for (let i = styles.length - 1; i > -1; --i) {
            const element = p.document.createElement('style');
            element.innerHTML = styles[i];
            shadowRoot.prepend(element);
        }
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(shadowRoot);
        }
    }
}
const StyleConfiguration = {
    shadowDOM(config) {
        return AppTask.creating(kernel.IContainer, container => {
            if (config.sharedStyles != null) {
                const factory = container.get(IShadowDOMStyleFactory);
                container.register(instanceRegistration(IShadowDOMGlobalStyles, factory.createStyles(config.sharedStyles, null)));
            }
        });
    }
};

const { enter, exit } = runtime.ConnectableSwitcher;
const { wrap, unwrap } = runtime.ProxyObservable;
class ComputedWatcher {
    get value() {
        return this._value;
    }
    constructor(obj, observerLocator, $get, cb, useProxy) {
        this.obj = obj;
        this.$get = $get;
        this.useProxy = useProxy;
        this.isBound = false;
        // todo: maybe use a counter allow recursive call to a certain level
        this.running = false;
        /** @internal */
        this._value = void 0;
        this._callback = cb;
        this.oL = observerLocator;
    }
    handleChange() {
        this.run();
    }
    handleCollectionChange() {
        this.run();
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.compute();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
    }
    run() {
        if (!this.isBound || this.running) {
            return;
        }
        const obj = this.obj;
        const oldValue = this._value;
        const newValue = this.compute();
        if (!areEqual(newValue, oldValue)) {
            // should optionally queue
            this._callback.call(obj, newValue, oldValue, obj);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            enter(this);
            return this._value = unwrap(this.$get.call(void 0, this.useProxy ? wrap(this.obj) : this.obj, this));
        }
        finally {
            this.obs.clear();
            this.running = false;
            exit(this);
        }
    }
}
class ExpressionWatcher {
    get value() {
        return this._value;
    }
    constructor(scope, l, oL, expression, callback) {
        this.scope = scope;
        this.l = l;
        this.oL = oL;
        this.isBound = false;
        // see Listener binding for explanation
        /** @internal */
        this.boundFn = false;
        this.obj = scope.bindingContext;
        this._expression = expression;
        this._callback = callback;
    }
    handleChange(value) {
        const expr = this._expression;
        const obj = this.obj;
        const oldValue = this._value;
        const canOptimize = expr.$kind === 'AccessScope' && this.obs.count === 1;
        if (!canOptimize) {
            this.obs.version++;
            value = runtime.astEvaluate(expr, this.scope, this, this);
            this.obs.clear();
        }
        if (!areEqual(value, oldValue)) {
            this._value = value;
            // should optionally queue for batch synchronous
            this._callback.call(obj, value, oldValue, obj);
        }
    }
    bind() {
        if (this.isBound) {
            return;
        }
        this.obs.version++;
        this._value = runtime.astEvaluate(this._expression, this.scope, this, this);
        this.obs.clear();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
        this._value = void 0;
    }
}
runtime.connectable(ComputedWatcher);
runtime.connectable(ExpressionWatcher);
mixinAstEvaluator(true)(ExpressionWatcher);

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
class Controller {
    get lifecycleHooks() {
        return this._lifecycleHooks;
    }
    get isActive() {
        return (this.state & (activating | activated)) > 0 && (this.state & deactivating) === 0;
    }
    get name() {
        if (this.parent === null) {
            switch (this.vmKind) {
                case vmkCa:
                    return `[${this.definition.name}]`;
                case vmkCe:
                    return this.definition.name;
                case vmkSynth:
                    return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
            case vmkCa:
                return `${this.parent.name}>[${this.definition.name}]`;
            case vmkCe:
                return `${this.parent.name}>${this.definition.name}`;
            case vmkSynth:
                return this.viewFactory.name === this.parent.definition?.name
                    ? `${this.parent.name}[view]`
                    : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    get viewModel() {
        return this._vm;
    }
    set viewModel(v) {
        this._vm = v;
        this._vmHooks = v == null || this.vmKind === vmkSynth ? HooksDefinition.none : new HooksDefinition(v);
    }
    constructor(container, vmKind, definition, 
    /**
     * The viewFactory. Only present for synthetic views.
     */
    viewFactory, 
    /**
     * The backing viewModel. Only present for custom attributes and elements.
     */
    viewModel, 
    /**
     * The physical host dom node.
     *
     * For containerless elements, this node will be removed from the DOM and replaced by a comment, which is assigned to the `location` property.
     *
     * For ShadowDOM elements, this will be the original declaring element, NOT the shadow root (the shadow root is stored on the `shadowRoot` property)
     */
    host, 
    /**
     * The render location replacement for the host on containerless elements
     */
    location) {
        this.container = container;
        this.vmKind = vmKind;
        this.definition = definition;
        this.viewFactory = viewFactory;
        this.host = host;
        this.head = null;
        this.tail = null;
        this.next = null;
        this.parent = null;
        this.bindings = null;
        this.children = null;
        this.hasLockedScope = false;
        this.scope = null;
        this.isBound = false;
        /** @internal */
        this._isBindingDone = false;
        // If a host from another custom element was passed in, then this will be the controller for that custom element (could be `au-viewport` for example).
        // In that case, this controller will create a new host node (with the definition's name) and use that as the target host for the nodes instead.
        // That host node is separately mounted to the host controller's original host node.
        this.hostController = null;
        this.mountTarget = targetNone;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        /** @internal */
        this._lifecycleHooks = null;
        this.state = none;
        /** @internal */
        this._fullyNamed = false;
        this.$initiator = null;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        /** @internal */
        this._activatingStack = 0;
        /** @internal */
        this._detachingStack = 0;
        /** @internal */
        this._unbindingStack = 0;
        this._vm = viewModel;
        this._vmHooks = vmKind === vmkSynth ? HooksDefinition.none : new HooksDefinition(viewModel);
        {
            this.logger = null;
            this.debug = false;
        }
        this.location = location;
        this._rendering = container.root.get(IRendering);
        this.coercion = vmKind === vmkSynth
            ? void 0
            : container.get(optionalCoercionConfigResolver);
    }
    static getCached(viewModel) {
        return controllerLookup.get(viewModel);
    }
    static getCachedOrThrow(viewModel) {
        const $el = Controller.getCached(viewModel);
        if ($el === void 0) {
            throw createMappedError(500 /* ErrorNames.controller_cached_not_found */, viewModel);
        }
        return $el;
    }
    /**
     * Create a controller for a custom element based on a given set of parameters
     *
     * @param ctn - The own container of the custom element
     * @param viewModel - The view model object (can be any object if a definition is specified)
     *
     * Semi private API
     */
    static $el(ctn, viewModel, host, hydrationInst, 
    // Use this when `instance.constructor` is not a custom element type
    // to pass on the CustomElement definition
    definition = void 0, 
    // the associated render location of the host
    // if the element is containerless
    location = null) {
        if (controllerLookup.has(viewModel)) {
            return controllerLookup.get(viewModel);
        }
        {
            if (definition == null) {
                try {
                    definition = getElementDefinition(viewModel.constructor);
                }
                catch (ex) {
                    // eslint-disable-next-line no-console
                    console.error(`[DEV:aurelia] Custom element definition not found for creating a controller with host: <${host.nodeName} /> and component ${JSON.stringify(viewModel)}`);
                    throw ex;
                }
            }
        }
        registerResolver(ctn, definition.Type, new kernel.InstanceProvider(definition.key, viewModel, definition.Type));
        const controller = new Controller(
        /* container      */ ctn, 
        /* vmKind         */ vmkCe, 
        /* definition     */ definition, 
        /* viewFactory    */ null, 
        /* viewModel      */ viewModel, 
        /* host           */ host, 
        /* location       */ location);
        // the hydration context this controller is provided with
        const hydrationContext = ctn.get(kernel.optional(IHydrationContext));
        if (definition.dependencies.length > 0) {
            ctn.register(...definition.dependencies);
        }
        // each CE controller provides its own hydration context for its internal template
        registerResolver(ctn, IHydrationContext, new kernel.InstanceProvider('IHydrationContext', new HydrationContext(controller, hydrationInst, hydrationContext)));
        controllerLookup.set(viewModel, controller);
        if (hydrationInst == null || hydrationInst.hydrate !== false) {
            controller._hydrateCustomElement(hydrationInst, hydrationContext);
        }
        return controller;
    }
    /**
     * Create a controller for a custom attribute based on a given set of parameters
     *
     * @param ctn - own container associated with the custom attribute object
     * @param viewModel - the view model object
     * @param host - host element where this custom attribute is used
     * @param flags - todo(comment)
     * @param definition - the definition of the custom attribute,
     * will be used to override the definition associated with the view model object contructor if given
     */
    static $attr(ctn, viewModel, host, 
    /**
     * The definition that will be used to hydrate the custom attribute view model
     *
     * If not given, will be the one associated with the constructor of the attribute view model given.
     */
    definition) {
        if (controllerLookup.has(viewModel)) {
            return controllerLookup.get(viewModel);
        }
        definition = definition ?? getAttributeDefinition(viewModel.constructor);
        registerResolver(ctn, definition.Type, new kernel.InstanceProvider(definition.key, viewModel, definition.Type));
        const controller = new Controller(
        /* own ct         */ ctn, 
        /* vmKind         */ vmkCa, 
        /* definition     */ definition, 
        /* viewFactory    */ null, 
        /* viewModel      */ viewModel, 
        /* host           */ host, 
        /* location       */ null);
        if (definition.dependencies.length > 0) {
            ctn.register(...definition.dependencies);
        }
        controllerLookup.set(viewModel, controller);
        controller._hydrateCustomAttribute();
        return controller;
    }
    /**
     * Create a synthetic view (controller) for a given factory
     *
     * @param viewFactory - todo(comment)
     * @param flags - todo(comment)
     * @param parentController - the parent controller to connect the created view with. Used in activation
     *
     * Semi private API
     */
    static $view(viewFactory, parentController = void 0) {
        const controller = new Controller(
        /* container      */ viewFactory.container, 
        /* vmKind         */ vmkSynth, 
        /* definition     */ null, 
        /* viewFactory    */ viewFactory, 
        /* viewModel      */ null, 
        /* host           */ null, 
        /* location       */ null);
        controller.parent = parentController ?? null;
        controller._hydrateSynthetic();
        return controller;
    }
    /** @internal */
    _hydrateCustomElement(hydrationInst, 
    /**
     * The context where this custom element is hydrated.
     *
     * This is the context controller creating this this controller
     */
    _hydrationContext) {
        {
            this.logger = this.container.get(kernel.ILogger).root;
            this.debug = this.logger.config.level <= kernel.LogLevel.debug;
            if (this.debug) {
                this.logger = this.logger.scopeTo(this.name);
            }
        }
        const container = this.container;
        const instance = this._vm;
        const definition = this.definition;
        this.scope = runtime.Scope.create(instance, null, true);
        if (definition.watches.length > 0) {
            createWatchers(this, container, definition, instance);
        }
        createObservers(this, definition, instance);
        this._lifecycleHooks = LifecycleHooks.resolve(container);
        // Support Recursive Components by adding self to own context
        container.register(definition.Type);
        // definition.register(container);
        if (definition.injectable !== null) {
            registerResolver(container, definition.injectable, new kernel.InstanceProvider('definition.injectable', instance));
        }
        // If this is the root controller, then the AppRoot will invoke things in the following order:
        // - Controller.hydrateCustomElement
        // - runAppTasks('hydrating') // may return a promise
        // - Controller.compile
        // - runAppTasks('hydrated') // may return a promise
        // - Controller.compileChildren
        // This keeps hydration synchronous while still allowing the composition root compile hooks to do async work.
        if (hydrationInst == null || hydrationInst.hydrate !== false) {
            this._hydrate(hydrationInst);
            this._hydrateChildren();
        }
    }
    /** @internal */
    _hydrate(hydrationInst) {
        if (this._lifecycleHooks.hydrating != null) {
            this._lifecycleHooks.hydrating.forEach(callHydratingHook, this);
        }
        if (this._vmHooks._hydrating) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`invoking hydrating() hook`);
            }
            this._vm.hydrating(this);
        }
        const definition = this.definition;
        const compiledDef = this._compiledDef = this._rendering.compile(definition, this.container, hydrationInst);
        const shadowOptions = compiledDef.shadowOptions;
        const hasSlots = compiledDef.hasSlots;
        const containerless = compiledDef.containerless;
        let host = this.host;
        let location = this.location;
        if ((this.hostController = findElementControllerFor(host, optionalCeFind)) !== null) {
            host = this.host = this.container.root.get(IPlatform).document.createElement(definition.name);
            if (containerless && location == null) {
                location = this.location = convertToRenderLocation(host);
            }
        }
        setRef(host, elementBaseName, this);
        setRef(host, definition.key, this);
        if (shadowOptions !== null || hasSlots) {
            if (location != null) {
                throw createMappedError(501 /* ErrorNames.controller_no_shadow_on_containerless */);
            }
            setRef(this.shadowRoot = host.attachShadow(shadowOptions ?? defaultShadowOptions), elementBaseName, this);
            setRef(this.shadowRoot, definition.key, this);
            this.mountTarget = targetShadowRoot;
        }
        else if (location != null) {
            setRef(location, elementBaseName, this);
            setRef(location, definition.key, this);
            this.mountTarget = targetLocation;
        }
        else {
            this.mountTarget = targetHost;
        }
        this._vm.$controller = this;
        this.nodes = this._rendering.createNodes(compiledDef);
        if (this._lifecycleHooks.hydrated !== void 0) {
            this._lifecycleHooks.hydrated.forEach(callHydratedHook, this);
        }
        if (this._vmHooks._hydrated) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`invoking hydrated() hook`);
            }
            this._vm.hydrated(this);
        }
    }
    /** @internal */
    _hydrateChildren() {
        this._rendering.render(
        /* controller */ this, 
        /* targets    */ this.nodes.findTargets(), 
        /* definition */ this._compiledDef, 
        /* host       */ this.host);
        if (this._lifecycleHooks.created !== void 0) {
            this._lifecycleHooks.created.forEach(callCreatedHook, this);
        }
        if (this._vmHooks._created) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`invoking created() hook`);
            }
            this._vm.created(this);
        }
    }
    /** @internal */
    _hydrateCustomAttribute() {
        const definition = this.definition;
        const instance = this._vm;
        if (definition.watches.length > 0) {
            createWatchers(this, this.container, definition, instance);
        }
        createObservers(this, definition, instance);
        instance.$controller = this;
        this._lifecycleHooks = LifecycleHooks.resolve(this.container);
        if (this._lifecycleHooks.created !== void 0) {
            this._lifecycleHooks.created.forEach(callCreatedHook, this);
        }
        if (this._vmHooks._created) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`invoking created() hook`);
            }
            this._vm.created(this);
        }
    }
    /** @internal */
    _hydrateSynthetic() {
        this._compiledDef = this._rendering.compile(this.viewFactory.def, this.container, null);
        this._rendering.render(
        /* controller */ this, 
        /* targets    */ (this.nodes = this._rendering.createNodes(this._compiledDef)).findTargets(), 
        /* definition */ this._compiledDef, 
        /* host       */ void 0);
    }
    activate(initiator, parent, scope) {
        switch (this.state) {
            case none:
            case deactivated:
                if (!(parent === null || parent.isActive)) {
                    // If this is not the root, and the parent is either:
                    // 1. Not activated, or activating children OR
                    // 2. Deactivating itself
                    // abort.
                    return;
                }
                // Otherwise, proceed normally.
                // 'deactivated' and 'none' are treated the same because, from an activation perspective, they mean the same thing.
                this.state = activating;
                break;
            case activated:
                // If we're already activated, no need to do anything.
                return;
            case disposed:
                throw createMappedError(502 /* ErrorNames.controller_activating_disposed */, this.name);
            default:
                throw createMappedError(503 /* ErrorNames.controller_activation_unexpected_state */, this.name, stringifyState(this.state));
        }
        this.parent = parent;
        if (this.debug && !this._fullyNamed) {
            this._fullyNamed = true;
            (this.logger ??= this.container.get(kernel.ILogger).root.scopeTo(this.name)).trace(`activate()`);
        }
        switch (this.vmKind) {
            case vmkCe:
                // Custom element scope is created and assigned during hydration
                this.scope.parent = scope ?? null;
                break;
            case vmkCa:
                this.scope = scope ?? null;
                break;
            case vmkSynth:
                // maybe only check when there's not already a scope
                if (scope === void 0 || scope === null) {
                    throw createMappedError(504 /* ErrorNames.controller_activation_synthetic_no_scope */, this.name);
                }
                if (!this.hasLockedScope) {
                    this.scope = scope;
                }
                break;
        }
        this.$initiator = initiator;
        // opposing leave is called in attach() (which will trigger attached())
        this._enterActivating();
        let ret = void 0;
        if (this.vmKind !== vmkSynth && this._lifecycleHooks.binding != null) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.binding()`);
            }
            ret = kernel.onResolveAll(...this._lifecycleHooks.binding.map(callBindingHook, this));
        }
        if (this._vmHooks._binding) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`binding()`);
            }
            ret = kernel.onResolveAll(ret, this._vm.binding(this.$initiator, this.parent));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            ret.then(() => {
                this._isBindingDone = true;
                if (this.state !== activating) {
                    // because controller can be deactivated, during a long running promise in the binding phase
                    this._leaveActivating();
                }
                else {
                    this.bind();
                }
            }).catch((err) => {
                this._reject(err);
            });
            return this.$promise;
        }
        this._isBindingDone = true;
        this.bind();
        return this.$promise;
    }
    bind() {
        /* istanbul ignore next */
        if (this.debug) {
            this.logger.trace(`bind()`);
        }
        let i = 0;
        let ii = 0;
        let ret = void 0;
        if (this.bindings !== null) {
            i = 0;
            ii = this.bindings.length;
            while (ii > i) {
                this.bindings[i].bind(this.scope);
                ++i;
            }
        }
        if (this.vmKind !== vmkSynth && this._lifecycleHooks.bound != null) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.bound()`);
            }
            ret = kernel.onResolveAll(...this._lifecycleHooks.bound.map(callBoundHook, this));
        }
        if (this._vmHooks._bound) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`bound()`);
            }
            ret = kernel.onResolveAll(ret, this._vm.bound(this.$initiator, this.parent));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            ret.then(() => {
                this.isBound = true;
                // because controller can be deactivated, during a long running promise in the bound phase
                if (this.state !== activating) {
                    this._leaveActivating();
                }
                else {
                    this._attach();
                }
            }).catch((err) => {
                this._reject(err);
            });
            return;
        }
        this.isBound = true;
        this._attach();
    }
    /** @internal */
    _append(...nodes) {
        switch (this.mountTarget) {
            case targetHost:
                this.host.append(...nodes);
                break;
            case targetShadowRoot:
                this.shadowRoot.append(...nodes);
                break;
            case targetLocation: {
                let i = 0;
                for (; i < nodes.length; ++i) {
                    this.location.parentNode.insertBefore(nodes[i], this.location);
                }
                break;
            }
        }
    }
    /** @internal */
    _attach() {
        /* istanbul ignore next */
        if (this.debug) {
            this.logger.trace(`attach()`);
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
                case targetHost:
                case targetShadowRoot:
                    this.hostController._append(this.host);
                    break;
                case targetLocation:
                    this.hostController._append(this.location.$start, this.location);
                    break;
            }
        }
        switch (this.mountTarget) {
            case targetHost:
                this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
                break;
            case targetShadowRoot: {
                const container = this.container;
                const styles = container.has(IShadowDOMStyles, false)
                    ? container.get(IShadowDOMStyles)
                    : container.get(IShadowDOMGlobalStyles);
                styles.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }
            case targetLocation:
                this.nodes.insertBefore(this.location);
                break;
        }
        let i = 0;
        let ret = void 0;
        if (this.vmKind !== vmkSynth && this._lifecycleHooks.attaching != null) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.attaching()`);
            }
            ret = kernel.onResolveAll(...this._lifecycleHooks.attaching.map(callAttachingHook, this));
        }
        if (this._vmHooks._attaching) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`attaching()`);
            }
            ret = kernel.onResolveAll(ret, this._vm.attaching(this.$initiator, this.parent));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            this._enterActivating();
            ret.then(() => {
                this._leaveActivating();
            }).catch((err) => {
                this._reject(err);
            });
        }
        // attaching() and child activation run in parallel, and attached() is called when both are finished
        if (this.children !== null) {
            for (; i < this.children.length; ++i) {
                // Any promises returned from child activation are cumulatively awaited before this.$promise resolves
                void this.children[i].activate(this.$initiator, this, this.scope);
            }
        }
        // attached() is invoked by Controller#leaveActivating when `activatingStack` reaches 0
        this._leaveActivating();
    }
    deactivate(initiator, _parent) {
        let prevActivation = void 0;
        switch ((this.state & ~released)) {
            case activated:
                this.state = deactivating;
                break;
            case activating:
                this.state = deactivating;
                // we are about to deactivate, the error from activation can be ignored
                prevActivation = this.$promise?.catch(err => {
                        this.logger.warn('The activation error will be ignored, as the controller is already scheduled for deactivation. The activation was rejected with: %s', err);
                    }
                    );
                break;
            case none:
            case deactivated:
            case disposed:
            case deactivated | disposed:
                // If we're already deactivated (or even disposed), or never activated in the first place, no need to do anything.
                return;
            default:
                throw createMappedError(505 /* ErrorNames.controller_deactivation_unexpected_state */, this.name, this.state);
        }
        /* istanbul-ignore-next */
        if (this.debug) {
            this.logger.trace(`deactivate()`);
        }
        this.$initiator = initiator;
        if (initiator === this) {
            this._enterDetaching();
        }
        let i = 0;
        let ret;
        if (this.children !== null) {
            for (i = 0; i < this.children.length; ++i) {
                // Child promise results are tracked by enter/leave combo's
                void this.children[i].deactivate(initiator, this);
            }
        }
        return kernel.onResolve(prevActivation, () => {
            if (this.isBound) {
                if (this.vmKind !== vmkSynth && this._lifecycleHooks.detaching != null) {
                    if (this.debug) {
                        this.logger.trace(`lifecycleHooks.detaching()`);
                    }
                    ret = kernel.onResolveAll(...this._lifecycleHooks.detaching.map(callDetachingHook, this));
                }
                if (this._vmHooks._detaching) {
                    if (this.debug) {
                        this.logger.trace(`detaching()`);
                    }
                    ret = kernel.onResolveAll(ret, this._vm.detaching(this.$initiator, this.parent));
                }
            }
            if (isPromise(ret)) {
                this._ensurePromise();
                initiator._enterDetaching();
                ret.then(() => {
                    initiator._leaveDetaching();
                }).catch((err) => {
                    initiator._reject(err);
                });
            }
            // Note: if a 3rd party plugin happens to do any async stuff in a template controller before calling deactivate on its view,
            // then the linking will become out of order.
            // For framework components, this shouldn't cause issues.
            // We can only prevent that by linking up after awaiting the detaching promise, which would add an extra tick + a fair bit of
            // overhead on this hot path, so it's (for now) a deliberate choice to not account for such situation.
            // Just leaving the note here so that we know to look here if a weird detaching-related timing issue is ever reported.
            if (initiator.head === null) {
                initiator.head = this;
            }
            else {
                initiator.tail.next = this;
            }
            initiator.tail = this;
            if (initiator !== this) {
                // Only detaching is called + the linked list is built when any controller that is not the initiator, is deactivated.
                // The rest is handled by the initiator.
                // This means that descendant controllers have to make sure to await the initiator's promise before doing any subsequent
                // controller api calls, or race conditions might occur.
                return;
            }
            this._leaveDetaching();
            return this.$promise;
        });
    }
    removeNodes() {
        switch (this.vmKind) {
            case vmkCe:
            case vmkSynth:
                this.nodes.remove();
                this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
                case targetHost:
                case targetShadowRoot:
                    this.host.remove();
                    break;
                case targetLocation:
                    this.location.$start.remove();
                    this.location.remove();
                    break;
            }
        }
    }
    unbind() {
        /* istanbul ignore next */
        if (this.debug) {
            this.logger.trace(`unbind()`);
        }
        let i = 0;
        if (this.bindings !== null) {
            for (; i < this.bindings.length; ++i) {
                this.bindings[i].unbind();
            }
        }
        this.parent = null;
        switch (this.vmKind) {
            case vmkCa:
                this.scope = null;
                break;
            case vmkSynth:
                if (!this.hasLockedScope) {
                    this.scope = null;
                }
                if ((this.state & released) === released &&
                    !this.viewFactory.tryReturnToCache(this) &&
                    this.$initiator === this) {
                    this.dispose();
                }
                break;
            case vmkCe:
                this.scope.parent = null;
                break;
        }
        this.state = deactivated;
        this.$initiator = null;
        this._resolve();
    }
    /** @internal */
    _ensurePromise() {
        if (this.$promise === void 0) {
            this.$promise = new Promise((resolve, reject) => {
                this.$resolve = resolve;
                this.$reject = reject;
            });
            if (this.$initiator !== this) {
                this.parent._ensurePromise();
            }
        }
    }
    /** @internal */
    _resolve() {
        if (this.$promise !== void 0) {
            _resolve = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            _resolve();
            _resolve = void 0;
        }
    }
    /** @internal */
    _reject(err) {
        if (this.$promise !== void 0) {
            _reject = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            _reject(err);
            _reject = void 0;
        }
        if (this.$initiator !== this) {
            this.parent._reject(err);
        }
    }
    /** @internal */
    _enterActivating() {
        ++this._activatingStack;
        if (this.$initiator !== this) {
            this.parent._enterActivating();
        }
    }
    /** @internal */
    _leaveActivating() {
        if (this.state !== activating) {
            --this._activatingStack;
            // skip doing rest of the work if the controller is deactivated.
            this._resolve();
            if (this.$initiator !== this) {
                this.parent._leaveActivating();
            }
            return;
        }
        if (--this._activatingStack === 0) {
            if (this.vmKind !== vmkSynth && this._lifecycleHooks.attached != null) {
                _retPromise = kernel.onResolveAll(...this._lifecycleHooks.attached.map(callAttachedHook, this));
            }
            if (this._vmHooks._attached) {
                /* istanbul ignore next */
                if (this.debug) {
                    this.logger.trace(`attached()`);
                }
                _retPromise = kernel.onResolveAll(_retPromise, this._vm.attached(this.$initiator));
            }
            if (isPromise(_retPromise)) {
                this._ensurePromise();
                _retPromise.then(() => {
                    this.state = activated;
                    // Resolve this.$promise, signaling that activation is done (path 1 of 2)
                    this._resolve();
                    if (this.$initiator !== this) {
                        this.parent._leaveActivating();
                    }
                }).catch((err) => {
                    this._reject(err);
                });
                _retPromise = void 0;
                return;
            }
            _retPromise = void 0;
            this.state = activated;
            // Resolve this.$promise (if present), signaling that activation is done (path 2 of 2)
            this._resolve();
        }
        if (this.$initiator !== this) {
            this.parent._leaveActivating();
        }
    }
    /** @internal */
    _enterDetaching() {
        ++this._detachingStack;
    }
    /** @internal */
    _leaveDetaching() {
        if (--this._detachingStack === 0) {
            // Note: this controller is the initiator (detach is only ever called on the initiator)
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`detach()`);
            }
            this._enterUnbinding();
            this.removeNodes();
            let cur = this.$initiator.head;
            let ret = void 0;
            while (cur !== null) {
                if (cur !== this) {
                    /* istanbul ignore next */
                    if (cur.debug) {
                        cur.logger.trace(`detach()`);
                    }
                    cur.removeNodes();
                }
                if (cur._isBindingDone) {
                    if (cur.vmKind !== vmkSynth && cur._lifecycleHooks.unbinding != null) {
                        ret = kernel.onResolveAll(...cur._lifecycleHooks.unbinding.map(callUnbindingHook, cur));
                    }
                    if (cur._vmHooks._unbinding) {
                        if (cur.debug) {
                            cur.logger.trace('unbinding()');
                        }
                        ret = kernel.onResolveAll(ret, cur.viewModel.unbinding(cur.$initiator, cur.parent));
                    }
                }
                if (isPromise(ret)) {
                    this._ensurePromise();
                    this._enterUnbinding();
                    ret.then(() => {
                        this._leaveUnbinding();
                    }).catch((err) => {
                        this._reject(err);
                    });
                }
                ret = void 0;
                cur = cur.next;
            }
            this._leaveUnbinding();
        }
    }
    /** @internal */
    _enterUnbinding() {
        ++this._unbindingStack;
    }
    /** @internal */
    _leaveUnbinding() {
        if (--this._unbindingStack === 0) {
            /* istanbul ignore next */
            if (this.debug) {
                this.logger.trace(`unbind()`);
            }
            let cur = this.$initiator.head;
            let next = null;
            while (cur !== null) {
                if (cur !== this) {
                    cur._isBindingDone = false;
                    cur.isBound = false;
                    cur.unbind();
                }
                next = cur.next;
                cur.next = null;
                cur = next;
            }
            this.head = this.tail = null;
            this._isBindingDone = false;
            this.isBound = false;
            this.unbind();
        }
    }
    addBinding(binding) {
        if (this.bindings === null) {
            this.bindings = [binding];
        }
        else {
            this.bindings[this.bindings.length] = binding;
        }
    }
    addChild(controller) {
        if (this.children === null) {
            this.children = [controller];
        }
        else {
            this.children[this.children.length] = controller;
        }
    }
    is(name) {
        switch (this.vmKind) {
            case vmkCa:
            case vmkCe: {
                return this.definition.name === name;
            }
            case vmkSynth:
                return this.viewFactory.name === name;
        }
    }
    lockScope(scope) {
        this.scope = scope;
        this.hasLockedScope = true;
    }
    setHost(host) {
        if (this.vmKind === vmkCe) {
            setRef(host, elementBaseName, this);
            setRef(host, this.definition.key, this);
        }
        this.host = host;
        this.mountTarget = targetHost;
        return this;
    }
    setShadowRoot(shadowRoot) {
        if (this.vmKind === vmkCe) {
            setRef(shadowRoot, elementBaseName, this);
            setRef(shadowRoot, this.definition.key, this);
        }
        this.shadowRoot = shadowRoot;
        this.mountTarget = targetShadowRoot;
        return this;
    }
    setLocation(location) {
        if (this.vmKind === vmkCe) {
            setRef(location, elementBaseName, this);
            setRef(location, this.definition.key, this);
        }
        this.location = location;
        this.mountTarget = targetLocation;
        return this;
    }
    release() {
        this.state |= released;
    }
    dispose() {
        /* istanbul ignore next */
        if (this.debug) {
            this.logger.trace(`dispose()`);
        }
        if ((this.state & disposed) === disposed) {
            return;
        }
        this.state |= disposed;
        if (this._vmHooks._dispose) {
            this._vm.dispose();
        }
        if (this.children !== null) {
            this.children.forEach(callDispose);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (this._vm !== null) {
            controllerLookup.delete(this._vm);
            this._vm = null;
        }
        this._vm = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(visitor) {
        if (visitor(this) === true) {
            return true;
        }
        if (this._vmHooks._accept && this._vm.accept(visitor) === true) {
            return true;
        }
        if (this.children !== null) {
            const { children } = this;
            for (let i = 0, ii = children.length; i < ii; ++i) {
                if (children[i].accept(visitor) === true) {
                    return true;
                }
            }
        }
    }
}
const controllerLookup = new WeakMap();
const targetNone = 0;
const targetHost = 1;
const targetShadowRoot = 2;
const targetLocation = 3;
/**
 * Describes the type of the host node/location of a controller
 * - `none` / 1:       no host
 * - `host` / 2:       an HTML element is the host of a controller
 * - `shadowRoot` / 3: a shadow root is the host of a controller
 * - `location` / 4:   a render location is the location of a controller, this is often used for template controllers
 */
const MountTarget = objectFreeze({
    none: targetNone,
    host: targetHost,
    shadowRoot: targetShadowRoot,
    location: targetLocation,
});
const optionalCeFind = { optional: true };
const optionalCoercionConfigResolver = kernel.optionalResource(runtime.ICoercionConfiguration);
function createObservers(controller, definition, instance) {
    const bindables = definition.bindables;
    const observableNames = getOwnPropertyNames(bindables);
    const length = observableNames.length;
    const locator = controller.container.get(runtime.IObserverLocator);
    if (length > 0) {
        for (let i = 0; i < length; ++i) {
            const name = observableNames[i];
            const bindable = bindables[name];
            const handler = bindable.callback;
            const obs = locator.getObserver(instance, name);
            if (bindable.set !== kernel.noop) {
                if (obs.useCoercer?.(bindable.set, controller.coercion) !== true) {
                    throw createMappedError(507 /* ErrorNames.controller_property_not_coercible */, name);
                }
            }
            if (instance[handler] != null || instance.propertyChanged != null) {
                const callback = (newValue, oldValue) => {
                    if (controller.isBound) {
                        instance[handler]?.(newValue, oldValue);
                        instance.propertyChanged?.(name, newValue, oldValue);
                    }
                };
                if (obs.useCallback?.(callback) !== true) {
                    throw createMappedError(508 /* ErrorNames.controller_property_no_change_handler */, name);
                }
            }
        }
    }
}
const AccessScopeAstMap = new Map();
const getAccessScopeAst = (key) => {
    let ast = AccessScopeAstMap.get(key);
    if (ast == null) {
        ast = new runtime.AccessScopeExpression(key, 0);
        AccessScopeAstMap.set(key, ast);
    }
    return ast;
};
function createWatchers(controller, context, definition, instance) {
    const observerLocator = context.get(runtime.IObserverLocator);
    const expressionParser = context.get(runtime.IExpressionParser);
    const watches = definition.watches;
    const scope = controller.vmKind === vmkCe
        ? controller.scope
        // custom attribute does not have own scope
        : runtime.Scope.create(instance, null, true);
    const ii = watches.length;
    let expression;
    let callback;
    let ast;
    let i = 0;
    for (; ii > i; ++i) {
        ({ expression, callback } = watches[i]);
        callback = isFunction(callback)
            ? callback
            : Reflect.get(instance, callback);
        if (!isFunction(callback)) {
            throw createMappedError(506 /* ErrorNames.controller_watch_invalid_callback */, callback);
        }
        if (isFunction(expression)) {
            controller.addBinding(new ComputedWatcher(instance, observerLocator, expression, callback, true));
        }
        else {
            ast = isString(expression)
                ? expressionParser.parse(expression, etIsProperty)
                : getAccessScopeAst(expression);
            controller.addBinding(new ExpressionWatcher(scope, context, observerLocator, ast, callback));
        }
    }
}
function isCustomElementController(value) {
    return value instanceof Controller && value.vmKind === vmkCe;
}
function isCustomElementViewModel(value) {
    return metadata.isObject(value) && isElementType(value.constructor);
}
class HooksDefinition {
    constructor(target) {
        this._define = 'define' in target;
        this._hydrating = 'hydrating' in target;
        this._hydrated = 'hydrated' in target;
        this._created = 'created' in target;
        this._binding = 'binding' in target;
        this._bound = 'bound' in target;
        this._attaching = 'attaching' in target;
        this._attached = 'attached' in target;
        this._detaching = 'detaching' in target;
        this._unbinding = 'unbinding' in target;
        this._dispose = 'dispose' in target;
        this._accept = 'accept' in target;
    }
}
HooksDefinition.none = new HooksDefinition({});
const defaultShadowOptions = {
    mode: 'open'
};
/** @internal */ const vmkCe = 'customElement';
/** @internal */ const vmkCa = 'customAttribute';
const vmkSynth = 'synthetic';
/** @internal */ const none = 0b00_00_00;
/** @internal */ const activating = 0b00_00_01;
/** @internal */ const activated = 0b00_00_10;
/** @internal */ const deactivating = 0b00_01_00;
/** @internal */ const deactivated = 0b00_10_00;
/** @internal */ const released = 0b01_00_00;
/** @internal */ const disposed = 0b10_00_00;
const State = /*@__PURE__*/ objectFreeze({
    none,
    activating,
    activated,
    deactivating,
    deactivated,
    released,
    disposed,
});
function stringifyState(state) {
    const names = [];
    if ((state & activating) === activating) {
        names.push('activating');
    }
    if ((state & activated) === activated) {
        names.push('activated');
    }
    if ((state & deactivating) === deactivating) {
        names.push('deactivating');
    }
    if ((state & deactivated) === deactivated) {
        names.push('deactivated');
    }
    if ((state & released) === released) {
        names.push('released');
    }
    if ((state & disposed) === disposed) {
        names.push('disposed');
    }
    return names.length === 0 ? 'none' : names.join('|');
}
const IController = /*@__PURE__*/ createInterface('IController');
const IHydrationContext = /*@__PURE__*/ createInterface('IHydrationContext');
/** @internal */
class HydrationContext {
    constructor(controller, instruction, parent) {
        this.instruction = instruction;
        this.parent = parent;
        this.controller = controller;
    }
}
function callDispose(disposable) {
    disposable.dispose();
}
function callCreatedHook(l) {
    l.instance.created(this._vm, this);
}
function callHydratingHook(l) {
    l.instance.hydrating(this._vm, this);
}
function callHydratedHook(l) {
    l.instance.hydrated(this._vm, this);
}
function callBindingHook(l) {
    return l.instance.binding(this._vm, this['$initiator'], this.parent);
}
function callBoundHook(l) {
    return l.instance.bound(this._vm, this['$initiator'], this.parent);
}
function callAttachingHook(l) {
    return l.instance.attaching(this._vm, this['$initiator'], this.parent);
}
function callAttachedHook(l) {
    return l.instance.attached(this._vm, this['$initiator']);
}
function callDetachingHook(l) {
    return l.instance.detaching(this._vm, this['$initiator'], this.parent);
}
function callUnbindingHook(l) {
    return l.instance.unbinding(this._vm, this['$initiator'], this.parent);
}
// some reuseable variables to avoid creating nested blocks inside hot paths of controllers
let _resolve;
let _reject;
let _retPromise;

class Refs {
}
function getRef(node, name) {
    return node.$au?.[name] ?? null;
}
function setRef(node, name, controller) {
    (node.$au ??= new Refs())[name] = controller;
}
const INode = /*@__PURE__*/ createInterface('INode');
const IEventTarget = /*@__PURE__*/ createInterface('IEventTarget', x => x.cachedCallback(handler => {
    if (handler.has(IAppRoot, true)) {
        return handler.get(IAppRoot).host;
    }
    return handler.get(IPlatform).document;
}));
const IRenderLocation = /*@__PURE__*/ createInterface('IRenderLocation');
const ICssModulesMapping = /*@__PURE__*/ createInterface('CssModules');

const effectiveParentNodeOverrides = new WeakMap();
/**
 * Returns the effective parentNode according to Aurelia's component hierarchy.
 *
 * Used by Aurelia to find the closest parent controller relative to a node.
 *
 * This method supports 3 additional scenarios that `node.parentNode` does not support:
 * - Containerless elements. The parentNode in this case is a comment precending the element under specific conditions, rather than a node wrapping the element.
 * - ShadowDOM. If a `ShadowRoot` is encountered, this method retrieves the associated controller via the metadata api to locate the original host.
 * - Portals. If the provided node was moved to a different location in the DOM by a `portal` attribute, then the original parent of the node will be returned.
 *
 * @param node - The node to get the parent for.
 * @returns Either the closest parent node, the closest `IRenderLocation` (comment node that is the containerless host), original portal host, or `null` if this is either the absolute document root or a disconnected node.
 */
function getEffectiveParentNode(node) {
    // TODO: this method needs more tests!
    // First look for any overrides
    if (effectiveParentNodeOverrides.has(node)) {
        return effectiveParentNodeOverrides.get(node);
    }
    // Then try to get the nearest au-start render location, which would be the containerless parent,
    // again looking for any overrides along the way.
    // otherwise return the normal parent node
    let containerlessOffset = 0;
    let next = node.nextSibling;
    while (next !== null) {
        if (next.nodeType === 8 /* NodeType.Comment */) {
            switch (next.textContent) {
                case 'au-start':
                    // If we see an au-start before we see au-end, it will precede the host of a sibling containerless element rather than a parent.
                    // So we use the offset to ignore the next au-end
                    ++containerlessOffset;
                    break;
                case 'au-end':
                    if (containerlessOffset-- === 0) {
                        return next;
                    }
            }
        }
        next = next.nextSibling;
    }
    if (node.parentNode === null && node.nodeType === 11 /* NodeType.DocumentFragment */) {
        // Could be a shadow root; see if there's a controller and if so, get the original host via the projector
        const controller = findElementControllerFor(node, { optional: true });
        if (controller == null) {
            // Not a shadow root (or at least, not one created by Aurelia)
            // Nothing more we can try, just return null
            return null;
        }
        if (controller.mountTarget === MountTarget.shadowRoot) {
            return getEffectiveParentNode(controller.host);
        }
    }
    return node.parentNode;
}
function setEffectiveParentNode(childNodeOrNodeSequence, parentNode) {
    if (childNodeOrNodeSequence.platform !== void 0 && !(childNodeOrNodeSequence instanceof childNodeOrNodeSequence.platform.Node)) {
        const nodes = childNodeOrNodeSequence.childNodes;
        for (let i = 0, ii = nodes.length; i < ii; ++i) {
            effectiveParentNodeOverrides.set(nodes[i], parentNode);
        }
    }
    else {
        effectiveParentNodeOverrides.set(childNodeOrNodeSequence, parentNode);
    }
}
function convertToRenderLocation(node) {
    if (isRenderLocation(node)) {
        return node; // it's already a IRenderLocation (converted by FragmentNodeSequence)
    }
    const locationEnd = node.ownerDocument.createComment('au-end');
    const locationStart = locationEnd.$start = node.ownerDocument.createComment('au-start');
    const parentNode = node.parentNode;
    if (parentNode !== null) {
        parentNode.replaceChild(locationEnd, node);
        parentNode.insertBefore(locationStart, locationEnd);
    }
    return locationEnd;
}
function isRenderLocation(node) {
    return node.textContent === 'au-end';
}
class FragmentNodeSequence {
    get firstChild() {
        return this._firstChild;
    }
    get lastChild() {
        return this._lastChild;
    }
    constructor(platform, fragment) {
        this.platform = platform;
        this.next = void 0;
        /** @internal */
        this._isMounted = false;
        /** @internal */
        this._isLinked = false;
        /** @internal */
        this.ref = null;
        const targetNodeList = (this.f = fragment).querySelectorAll('au-m');
        let i = 0;
        let ii = targetNodeList.length;
        // eslint-disable-next-line
        let targets = this.t = Array(ii);
        let target;
        let marker;
        while (ii > i) {
            marker = targetNodeList[i];
            target = marker.nextSibling;
            marker.remove();
            if (target.nodeType === 8) {
                marker = target;
                (target = target.nextSibling).$start = marker;
            }
            targets[i] = target;
            ++i;
        }
        const childNodeList = fragment.childNodes;
        const childNodes = this.childNodes = Array(ii = childNodeList.length);
        i = 0;
        while (ii > i) {
            childNodes[i] = childNodeList[i];
            ++i;
        }
        this._firstChild = fragment.firstChild;
        this._lastChild = fragment.lastChild;
    }
    findTargets() {
        return this.t;
    }
    insertBefore(refNode) {
        if (this._isLinked && !!this.ref) {
            this.addToLinked();
        }
        else {
            const parent = refNode.parentNode;
            if (this._isMounted) {
                let current = this._firstChild;
                let next;
                const end = this._lastChild;
                while (current != null) {
                    next = current.nextSibling;
                    parent.insertBefore(current, refNode);
                    if (current === end) {
                        break;
                    }
                    current = next;
                }
            }
            else {
                this._isMounted = true;
                refNode.parentNode.insertBefore(this.f, refNode);
            }
        }
    }
    appendTo(parent, enhance = false) {
        if (this._isMounted) {
            let current = this._firstChild;
            let next;
            const end = this._lastChild;
            while (current != null) {
                next = current.nextSibling;
                parent.appendChild(current);
                if (current === end) {
                    break;
                }
                current = next;
            }
        }
        else {
            this._isMounted = true;
            if (!enhance) {
                parent.appendChild(this.f);
            }
        }
    }
    remove() {
        if (this._isMounted) {
            this._isMounted = false;
            const fragment = this.f;
            const end = this._lastChild;
            let next;
            let current = this._firstChild;
            while (current !== null) {
                next = current.nextSibling;
                fragment.appendChild(current);
                if (current === end) {
                    break;
                }
                current = next;
            }
        }
    }
    addToLinked() {
        const refNode = this.ref;
        const parent = refNode.parentNode;
        if (this._isMounted) {
            let current = this._firstChild;
            let next;
            const end = this._lastChild;
            while (current != null) {
                next = current.nextSibling;
                parent.insertBefore(current, refNode);
                if (current === end) {
                    break;
                }
                current = next;
            }
        }
        else {
            this._isMounted = true;
            parent.insertBefore(this.f, refNode);
        }
    }
    unlink() {
        this._isLinked = false;
        this.next = void 0;
        this.ref = void 0;
    }
    link(next) {
        this._isLinked = true;
        if (isRenderLocation(next)) {
            this.ref = next;
        }
        else {
            this.next = next;
            this._obtainRefNode();
        }
    }
    /** @internal */
    _obtainRefNode() {
        if (this.next !== void 0) {
            this.ref = this.next.firstChild;
        }
        else {
            this.ref = void 0;
        }
    }
}
const IWindow = /*@__PURE__*/ createInterface('IWindow', x => x.callback(handler => handler.get(IPlatform).window));
const ILocation = /*@__PURE__*/ createInterface('ILocation', x => x.callback(handler => handler.get(IWindow).location));
const IHistory = /*@__PURE__*/ createInterface('IHistory', x => x.callback(handler => handler.get(IWindow).history));
/** @internal */
const registerHostNode = (container, platform, host) => {
    registerResolver(container, platform.HTMLElement, registerResolver(container, platform.Element, registerResolver(container, INode, new kernel.InstanceProvider('ElementResolver', host))));
    return container;
};

function customElement(nameOrDef) {
    return function (target) {
        return defineElement(nameOrDef, target);
    };
}
function useShadowDOM(targetOrOptions) {
    if (targetOrOptions === void 0) {
        return function ($target) {
            annotateElementMetadata($target, 'shadowOptions', { mode: 'open' });
        };
    }
    if (!isFunction(targetOrOptions)) {
        return function ($target) {
            annotateElementMetadata($target, 'shadowOptions', targetOrOptions);
        };
    }
    annotateElementMetadata(targetOrOptions, 'shadowOptions', { mode: 'open' });
}
function containerless(target) {
    if (target === void 0) {
        return function ($target) {
            markContainerless($target);
        };
    }
    markContainerless(target);
}
/** Manipulates the `containerless` property of the custom element definition for the type, when present else it annotates the type. */
function markContainerless(target) {
    const def = getOwnMetadata(elementBaseName, target);
    if (def === void 0) {
        annotateElementMetadata(target, 'containerless', true);
        return;
    }
    def.containerless = true;
}
const definitionLookup = new WeakMap();
class CustomElementDefinition {
    get kind() { return dtElement; }
    constructor(Type, name, aliases, key, cache, capture, template, instructions, dependencies, injectable, needsCompile, surrogates, bindables, containerless, shadowOptions, 
    /**
     * Indicates whether the custom element has <slot/> in its template
     */
    hasSlots, enhance, watches, processContent) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
        this.cache = cache;
        this.capture = capture;
        this.template = template;
        this.instructions = instructions;
        this.dependencies = dependencies;
        this.injectable = injectable;
        this.needsCompile = needsCompile;
        this.surrogates = surrogates;
        this.bindables = bindables;
        this.containerless = containerless;
        this.shadowOptions = shadowOptions;
        this.hasSlots = hasSlots;
        this.enhance = enhance;
        this.watches = watches;
        this.processContent = processContent;
    }
    static create(nameOrDef, Type = null) {
        if (Type === null) {
            const def = nameOrDef;
            if (isString(def)) {
                throw createMappedError(761 /* ErrorNames.element_only_name */, nameOrDef);
            }
            const name = kernel.fromDefinitionOrDefault('name', def, generateElementName);
            if (isFunction(def.Type)) {
                // This needs to be a clone (it will usually be the compiler calling this signature)
                // TODO: we need to make sure it's documented that passing in the type via the definition (while passing in null
                // as the "Type" parameter) effectively skips type analysis, so it should only be used this way for cloning purposes.
                Type = def.Type;
            }
            else {
                Type = generateElementType(kernel.pascalCase(name));
            }
            return new CustomElementDefinition(Type, name, kernel.mergeArrays(def.aliases), kernel.fromDefinitionOrDefault('key', def, () => getElementKeyFrom(name)), kernel.fromDefinitionOrDefault('cache', def, returnZero), kernel.fromDefinitionOrDefault('capture', def, returnFalse), kernel.fromDefinitionOrDefault('template', def, returnNull), kernel.mergeArrays(def.instructions), kernel.mergeArrays(def.dependencies), kernel.fromDefinitionOrDefault('injectable', def, returnNull), kernel.fromDefinitionOrDefault('needsCompile', def, returnTrue), kernel.mergeArrays(def.surrogates), Bindable.from(Type, def.bindables), kernel.fromDefinitionOrDefault('containerless', def, returnFalse), kernel.fromDefinitionOrDefault('shadowOptions', def, returnNull), kernel.fromDefinitionOrDefault('hasSlots', def, returnFalse), kernel.fromDefinitionOrDefault('enhance', def, returnFalse), kernel.fromDefinitionOrDefault('watches', def, returnEmptyArray), kernel.fromAnnotationOrTypeOrDefault('processContent', Type, returnNull));
        }
        // If a type is passed in, we ignore the Type property on the definition if it exists.
        // TODO: document this behavior
        if (isString(nameOrDef)) {
            return new CustomElementDefinition(Type, nameOrDef, kernel.mergeArrays(getElementAnnotation(Type, 'aliases'), Type.aliases), getElementKeyFrom(nameOrDef), kernel.fromAnnotationOrTypeOrDefault('cache', Type, returnZero), kernel.fromAnnotationOrTypeOrDefault('capture', Type, returnFalse), kernel.fromAnnotationOrTypeOrDefault('template', Type, returnNull), kernel.mergeArrays(getElementAnnotation(Type, 'instructions'), Type.instructions), kernel.mergeArrays(getElementAnnotation(Type, 'dependencies'), Type.dependencies), kernel.fromAnnotationOrTypeOrDefault('injectable', Type, returnNull), kernel.fromAnnotationOrTypeOrDefault('needsCompile', Type, returnTrue), kernel.mergeArrays(getElementAnnotation(Type, 'surrogates'), Type.surrogates), Bindable.from(Type, ...Bindable.getAll(Type), getElementAnnotation(Type, 'bindables'), Type.bindables), kernel.fromAnnotationOrTypeOrDefault('containerless', Type, returnFalse), kernel.fromAnnotationOrTypeOrDefault('shadowOptions', Type, returnNull), kernel.fromAnnotationOrTypeOrDefault('hasSlots', Type, returnFalse), kernel.fromAnnotationOrTypeOrDefault('enhance', Type, returnFalse), kernel.mergeArrays(Watch.getDefinitions(Type), Type.watches), kernel.fromAnnotationOrTypeOrDefault('processContent', Type, returnNull));
        }
        // This is the typical default behavior, e.g. from regular CustomElement.define invocations or from @customElement deco
        // The ViewValueConverter also uses this signature and passes in a definition where everything except for the 'hooks'
        // property needs to be copied. So we have that exception for 'hooks', but we may need to revisit that default behavior
        // if this turns out to be too opinionated.
        const name = kernel.fromDefinitionOrDefault('name', nameOrDef, generateElementName);
        return new CustomElementDefinition(Type, name, kernel.mergeArrays(getElementAnnotation(Type, 'aliases'), nameOrDef.aliases, Type.aliases), getElementKeyFrom(name), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('cache', nameOrDef, Type, returnZero), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('capture', nameOrDef, Type, returnFalse), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('template', nameOrDef, Type, returnNull), kernel.mergeArrays(getElementAnnotation(Type, 'instructions'), nameOrDef.instructions, Type.instructions), kernel.mergeArrays(getElementAnnotation(Type, 'dependencies'), nameOrDef.dependencies, Type.dependencies), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('injectable', nameOrDef, Type, returnNull), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('needsCompile', nameOrDef, Type, returnTrue), kernel.mergeArrays(getElementAnnotation(Type, 'surrogates'), nameOrDef.surrogates, Type.surrogates), Bindable.from(Type, ...Bindable.getAll(Type), getElementAnnotation(Type, 'bindables'), Type.bindables, nameOrDef.bindables), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('containerless', nameOrDef, Type, returnFalse), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('shadowOptions', nameOrDef, Type, returnNull), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('hasSlots', nameOrDef, Type, returnFalse), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('enhance', nameOrDef, Type, returnFalse), kernel.mergeArrays(nameOrDef.watches, Watch.getDefinitions(Type), Type.watches), kernel.fromAnnotationOrDefinitionOrTypeOrDefault('processContent', nameOrDef, Type, returnNull));
    }
    static getOrCreate(partialDefinition) {
        if (partialDefinition instanceof CustomElementDefinition) {
            return partialDefinition;
        }
        if (definitionLookup.has(partialDefinition)) {
            return definitionLookup.get(partialDefinition);
        }
        const definition = CustomElementDefinition.create(partialDefinition);
        definitionLookup.set(partialDefinition, definition);
        // Make sure the full definition can be retrieved from dynamically created classes as well
        defineMetadata(elementBaseName, definition, definition.Type);
        return definition;
    }
    register(container, aliasName) {
        const $Type = this.Type;
        const key = typeof aliasName === 'string' ? getElementKeyFrom(aliasName) : this.key;
        const aliases = this.aliases;
        // todo: warn if alreay has key
        if (!container.has(key, false)) {
            container.register(container.has($Type, false) ? null : transientRegistration($Type, $Type), aliasRegistration($Type, key), ...aliases.map(alias => aliasRegistration($Type, getElementKeyFrom(alias))));
        } /* istanbul ignore next */
        else {
            // eslint-disable-next-line no-console
            console.warn(`[DEV:aurelia] ${createMappedError(153 /* ErrorNames.element_existed */, this.name)}`);
        }
    }
    toString() {
        return `au:ce:${this.name}`;
    }
}
const defaultForOpts = {
    name: undefined,
    searchParents: false,
    optional: false,
};
const returnZero = () => 0;
const returnNull = () => null;
const returnFalse = () => false;
const returnTrue = () => true;
const returnEmptyArray = () => kernel.emptyArray;
/** @internal */
const elementBaseName = /*@__PURE__*/ kernel.getResourceKeyFor('custom-element');
/** @internal */
const getElementKeyFrom = (name) => `${elementBaseName}:${name}`;
/** @internal */
const generateElementName = /*@__PURE__*/ (() => {
    let id = 0;
    return () => `unnamed-${++id}`;
})();
const annotateElementMetadata = (Type, prop, value) => {
    defineMetadata(getAnnotationKeyFor(prop), value, Type);
};
/** @internal */
const defineElement = (nameOrDef, Type) => {
    const definition = CustomElementDefinition.create(nameOrDef, Type);
    const $Type = definition.Type;
    defineMetadata(elementBaseName, definition, $Type);
    // a requirement for the resource system in kernel
    defineMetadata(kernel.resourceBaseName, definition, $Type);
    return $Type;
};
/** @internal */
const isElementType = (value) => {
    return isFunction(value) && hasOwnMetadata(elementBaseName, value);
};
/** @internal */
const findElementControllerFor = (node, opts = defaultForOpts) => {
    if (opts.name === void 0 && opts.searchParents !== true) {
        const controller = getRef(node, elementBaseName);
        if (controller === null) {
            if (opts.optional === true) {
                return null;
            }
            throw createMappedError(762 /* ErrorNames.node_is_not_a_host */, node);
        }
        return controller;
    }
    if (opts.name !== void 0) {
        if (opts.searchParents !== true) {
            const controller = getRef(node, elementBaseName);
            if (controller === null) {
                throw createMappedError(763 /* ErrorNames.node_is_not_a_host2 */, node);
            }
            if (controller.is(opts.name)) {
                return controller;
            }
            return (void 0);
        }
        let cur = node;
        let foundAController = false;
        while (cur !== null) {
            const controller = getRef(cur, elementBaseName);
            if (controller !== null) {
                foundAController = true;
                if (controller.is(opts.name)) {
                    return controller;
                }
            }
            cur = getEffectiveParentNode(cur);
        }
        if (foundAController) {
            return (void 0);
        }
        throw createMappedError(764 /* ErrorNames.node_is_not_part_of_aurelia_app */, node);
    }
    let cur = node;
    while (cur !== null) {
        const controller = getRef(cur, elementBaseName);
        if (controller !== null) {
            return controller;
        }
        cur = getEffectiveParentNode(cur);
    }
    throw createMappedError(765 /* ErrorNames.node_is_not_part_of_aurelia_app2 */, node);
};
const getElementAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
/** @internal */
// eslint-disable-next-line @typescript-eslint/ban-types
const getElementDefinition = (Type) => {
    const def = getOwnMetadata(elementBaseName, Type);
    if (def === void 0) {
        throw createMappedError(760 /* ErrorNames.element_def_not_found */, Type);
    }
    return def;
};
/** @internal */
const createElementInjectable = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const $injectable = function (target, property, index) {
        const annotationParamtypes = kernel.DI.getOrCreateAnnotationParamTypes(target);
        annotationParamtypes[index] = $injectable;
        return target;
    };
    $injectable.register = () => ({
        $isResolver: true,
        resolve(container, requestor) {
            if (requestor.has($injectable, true)) {
                return requestor.get($injectable);
            }
            else {
                return null;
            }
        }
    });
    return $injectable;
};
/** @internal */
const generateElementType = /*@__PURE__*/ (function () {
    const nameDescriptor = {
        value: '',
        writable: false,
        enumerable: false,
        configurable: true,
    };
    const defaultProto = {};
    return function (name, proto = defaultProto) {
        // Anonymous class ensures that minification cannot cause unintended side-effects, and keeps the class
        // looking similarly from the outside (when inspected via debugger, etc).
        const Type = class Anonymous {
        };
        // Define the name property so that Type.name can be used by end users / plugin authors if they really need to,
        // even when minified.
        nameDescriptor.value = name;
        def(Type, 'name', nameDescriptor);
        // Assign anything from the prototype that was passed in
        if (proto !== defaultProto) {
            objectAssign(Type.prototype, proto);
        }
        return Type;
    };
})();
const CustomElement = objectFreeze({
    name: elementBaseName,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: generateElementName,
    createInjectable: createElementInjectable,
    generateType: generateElementType,
    find(c, name) {
        const key = getElementKeyFrom(name);
        const Type = c.find(key);
        return Type == null ? null : getOwnMetadata(elementBaseName, Type) ?? null;
    }
});
const pcHookMetadataProperty = /*@__PURE__*/ getAnnotationKeyFor('processContent');
function processContent(hook) {
    return hook === void 0
        ? function (target, propertyKey, _descriptor) {
            defineMetadata(pcHookMetadataProperty, ensureHook(target, propertyKey), target);
        }
        : function (target) {
            hook = ensureHook(target, hook);
            const def = getOwnMetadata(elementBaseName, target);
            if (def !== void 0) {
                def.processContent = hook;
            }
            else {
                defineMetadata(pcHookMetadataProperty, hook, target);
            }
            return target;
        };
}
function ensureHook(target, hook) {
    if (isString(hook)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any
        hook = target[hook];
    }
    if (!isFunction(hook)) {
        throw createMappedError(766 /* ErrorNames.invalid_process_content_hook */, hook);
    }
    return hook;
}
function capture(targetOrFilter) {
    return function ($target) {
        const value = isFunction(targetOrFilter) ? targetOrFilter : true;
        annotateElementMetadata($target, 'capture', value);
        // also do this to make order of the decorator irrelevant
        if (isElementType($target)) {
            getElementDefinition($target).capture = value;
        }
    };
}

const IAppRoot = /*@__PURE__*/ createInterface('IAppRoot');
class AppRoot {
    get controller() {
        return this._controller;
    }
    constructor(config, container, rootProvider, enhance = false) {
        this.config = config;
        this.container = container;
        /** @internal */
        this._hydratePromise = void 0;
        this._useOwnAppTasks = enhance;
        const host = this.host = config.host;
        rootProvider.prepare(this);
        registerHostNode(container, this.platform = this._createPlatform(container, host), host);
        this._hydratePromise = kernel.onResolve(this._runAppTasks('creating'), () => {
            if (!config.allowActionlessForm !== false) {
                host.addEventListener('submit', (e) => {
                    const target = e.target;
                    const hasAction = (target.getAttribute('action')?.length ?? 0) > 0;
                    if (target.tagName === 'FORM' && !hasAction) {
                        e.preventDefault();
                    }
                }, false);
            }
            const childCtn = enhance ? container : container.createChild();
            const component = config.component;
            let instance;
            if (isFunction(component)) {
                instance = childCtn.invoke(component);
                instanceRegistration(component, instance);
            }
            else {
                instance = config.component;
            }
            const hydrationInst = { hydrate: false, projections: null };
            const definition = enhance
                ? CustomElementDefinition.create({ name: generateElementName(), template: this.host, enhance: true })
                // leave the work of figuring out the definition to the controller
                // there's proper error messages in case of failure inside the $el() call
                : void 0;
            const controller = (this._controller = Controller.$el(childCtn, instance, host, hydrationInst, definition));
            controller._hydrateCustomElement(hydrationInst, /* root does not have hydration context */ null);
            return kernel.onResolve(this._runAppTasks('hydrating'), () => {
                controller._hydrate(null);
                return kernel.onResolve(this._runAppTasks('hydrated'), () => {
                    controller._hydrateChildren();
                    this._hydratePromise = void 0;
                });
            });
        });
    }
    activate() {
        return kernel.onResolve(this._hydratePromise, () => {
            return kernel.onResolve(this._runAppTasks('activating'), () => {
                return kernel.onResolve(this._controller.activate(this._controller, null, void 0), () => {
                    return this._runAppTasks('activated');
                });
            });
        });
    }
    deactivate() {
        return kernel.onResolve(this._runAppTasks('deactivating'), () => {
            return kernel.onResolve(this._controller.deactivate(this._controller, null), () => {
                return this._runAppTasks('deactivated');
            });
        });
    }
    /** @internal */
    _runAppTasks(slot) {
        const container = this.container;
        const appTasks = this._useOwnAppTasks && !container.has(IAppTask, false)
            ? []
            : container.getAll(IAppTask);
        return kernel.onResolveAll(...appTasks.reduce((results, task) => {
            if (task.slot === slot) {
                results.push(task.run());
            }
            return results;
        }, []));
    }
    /** @internal */
    _createPlatform(container, host) {
        let p;
        if (!container.has(IPlatform, false)) {
            if (host.ownerDocument.defaultView === null) {
                throw createMappedError(769 /* ErrorNames.invalid_platform_impl */);
            }
            p = new platformBrowser.BrowserPlatform(host.ownerDocument.defaultView);
            container.register(instanceRegistration(IPlatform, p));
        }
        else {
            p = container.get(IPlatform);
        }
        return p;
    }
    dispose() {
        this._controller?.dispose();
    }
}

const IAurelia = /*@__PURE__*/ createInterface('IAurelia');
class Aurelia {
    get isRunning() { return this._isRunning; }
    get isStarting() { return this._isStarting; }
    get isStopping() { return this._isStopping; }
    get root() {
        if (this._root == null) {
            if (this.next == null) {
                throw createMappedError(767 /* ErrorNames.root_not_found */);
            }
            return this.next;
        }
        return this._root;
    }
    constructor(container = kernel.DI.createContainer()) {
        this.container = container;
        /** @internal */
        this._isRunning = false;
        /** @internal */
        this._isStarting = false;
        /** @internal */
        this._isStopping = false;
        // TODO:
        // root should just be a controller,
        // in all other parts of the framework, root of something is always the same type of that thing
        // i.e: container.root => a container, RouteContext.root => a RouteContext
        // Aurelia.root of a controller hierarchy should behave similarly
        /** @internal */
        this._root = void 0;
        this.next = void 0;
        /** @internal */
        this._startPromise = void 0;
        /** @internal */
        this._stopPromise = void 0;
        if (container.has(IAurelia, true) || container.has(Aurelia, true)) {
            throw createMappedError(768 /* ErrorNames.aurelia_instance_existed_in_container */);
        }
        registerResolver(container, IAurelia, new kernel.InstanceProvider('IAurelia', this));
        registerResolver(container, Aurelia, new kernel.InstanceProvider('Aurelia', this));
        registerResolver(container, IAppRoot, this._rootProvider = new kernel.InstanceProvider('IAppRoot'));
    }
    register(...params) {
        this.container.register(...params);
        return this;
    }
    app(config) {
        this.next = new AppRoot(config, this.container, this._rootProvider);
        return this;
    }
    /**
     * @param parentController - The owning controller of the view created by this enhance call
     */
    enhance(config) {
        const appRoot = new AppRoot({ host: config.host, component: config.component }, config.container ?? this.container.createChild(), new kernel.InstanceProvider('IAppRoot'), true);
        return kernel.onResolve(appRoot.activate(), () => appRoot);
    }
    async waitForIdle() {
        const platform = this.root.platform;
        await platform.domWriteQueue.yield();
        await platform.domReadQueue.yield();
        await platform.taskQueue.yield();
    }
    start(root = this.next) {
        if (root == null) {
            throw createMappedError(770 /* ErrorNames.no_composition_root */);
        }
        if (isPromise(this._startPromise)) {
            return this._startPromise;
        }
        return this._startPromise = kernel.onResolve(this.stop(), () => {
            Reflect.set(root.host, '$aurelia', this);
            this._rootProvider.prepare(this._root = root);
            this._isStarting = true;
            return kernel.onResolve(root.activate(), () => {
                this._isRunning = true;
                this._isStarting = false;
                this._startPromise = void 0;
                this._dispatchEvent(root, 'au-started', root.host);
            });
        });
    }
    stop(dispose = false) {
        if (isPromise(this._stopPromise)) {
            return this._stopPromise;
        }
        if (this._isRunning === true) {
            const root = this._root;
            this._isRunning = false;
            this._isStopping = true;
            return this._stopPromise = kernel.onResolve(root.deactivate(), () => {
                Reflect.deleteProperty(root.host, '$aurelia');
                if (dispose) {
                    root.dispose();
                }
                this._root = void 0;
                this._rootProvider.dispose();
                this._isStopping = false;
                this._dispatchEvent(root, 'au-stopped', root.host);
            });
        }
    }
    dispose() {
        if (this._isRunning || this._isStopping) {
            throw createMappedError(771 /* ErrorNames.invalid_dispose_call */);
        }
        this.container.dispose();
    }
    /** @internal */
    _dispatchEvent(root, name, target) {
        const ev = new root.platform.window.CustomEvent(name, { detail: this, bubbles: true, cancelable: true });
        target.dispatchEvent(ev);
    }
}

class CharSpec {
    constructor(chars, repeat, isSymbol, isInverted) {
        this.chars = chars;
        this.repeat = repeat;
        this.isSymbol = isSymbol;
        this.isInverted = isInverted;
        if (isInverted) {
            switch (chars.length) {
                case 0:
                    this.has = this._hasOfNoneInverse;
                    break;
                case 1:
                    this.has = this._hasOfSingleInverse;
                    break;
                default:
                    this.has = this._hasOfMultipleInverse;
            }
        }
        else {
            switch (chars.length) {
                case 0:
                    this.has = this._hasOfNone;
                    break;
                case 1:
                    this.has = this._hasOfSingle;
                    break;
                default:
                    this.has = this._hasOfMultiple;
            }
        }
    }
    equals(other) {
        return this.chars === other.chars
            && this.repeat === other.repeat
            && this.isSymbol === other.isSymbol
            && this.isInverted === other.isInverted;
    }
    /** @internal */
    _hasOfMultiple(char) {
        return this.chars.includes(char);
    }
    /** @internal */
    _hasOfSingle(char) {
        return this.chars === char;
    }
    /** @internal */
    _hasOfNone(_char) {
        return false;
    }
    /** @internal */
    _hasOfMultipleInverse(char) {
        return !this.chars.includes(char);
    }
    /** @internal */
    _hasOfSingleInverse(char) {
        return this.chars !== char;
    }
    /** @internal */
    _hasOfNoneInverse(_char) {
        return true;
    }
}
class Interpretation {
    constructor() {
        this.parts = kernel.emptyArray;
        /** @internal */
        this._pattern = '';
        /** @internal */
        this._currentRecord = {};
        /** @internal */
        this._partsRecord = {};
    }
    get pattern() {
        const value = this._pattern;
        if (value === '') {
            return null;
        }
        else {
            return value;
        }
    }
    set pattern(value) {
        if (value == null) {
            this._pattern = '';
            this.parts = kernel.emptyArray;
        }
        else {
            this._pattern = value;
            this.parts = this._partsRecord[value];
        }
    }
    append(pattern, ch) {
        const currentRecord = this._currentRecord;
        if (currentRecord[pattern] === undefined) {
            currentRecord[pattern] = ch;
        }
        else {
            currentRecord[pattern] += ch;
        }
    }
    next(pattern) {
        const currentRecord = this._currentRecord;
        let partsRecord;
        if (currentRecord[pattern] !== undefined) {
            partsRecord = this._partsRecord;
            if (partsRecord[pattern] === undefined) {
                partsRecord[pattern] = [currentRecord[pattern]];
            }
            else {
                partsRecord[pattern].push(currentRecord[pattern]);
            }
            currentRecord[pattern] = undefined;
        }
    }
}
class AttrParsingState {
    get _pattern() {
        return this._isEndpoint ? this._patterns[0] : null;
    }
    constructor(charSpec, ...patterns) {
        this.charSpec = charSpec;
        this._nextStates = [];
        this._types = null;
        this._isEndpoint = false;
        this._patterns = patterns;
    }
    findChild(charSpec) {
        const nextStates = this._nextStates;
        const len = nextStates.length;
        let child = null;
        let i = 0;
        for (; i < len; ++i) {
            child = nextStates[i];
            if (charSpec.equals(child.charSpec)) {
                return child;
            }
        }
        return null;
    }
    append(charSpec, pattern) {
        const patterns = this._patterns;
        if (!patterns.includes(pattern)) {
            patterns.push(pattern);
        }
        let state = this.findChild(charSpec);
        if (state == null) {
            state = new AttrParsingState(charSpec, pattern);
            this._nextStates.push(state);
            if (charSpec.repeat) {
                state._nextStates.push(state);
            }
        }
        return state;
    }
    findMatches(ch, interpretation) {
        // TODO: reuse preallocated arrays
        const results = [];
        const nextStates = this._nextStates;
        const len = nextStates.length;
        let childLen = 0;
        let child = null;
        let i = 0;
        let j = 0;
        for (; i < len; ++i) {
            child = nextStates[i];
            if (child.charSpec.has(ch)) {
                results.push(child);
                childLen = child._patterns.length;
                j = 0;
                if (child.charSpec.isSymbol) {
                    for (; j < childLen; ++j) {
                        interpretation.next(child._patterns[j]);
                    }
                }
                else {
                    for (; j < childLen; ++j) {
                        interpretation.append(child._patterns[j], ch);
                    }
                }
            }
        }
        return results;
    }
}
/** @internal */
class StaticSegment {
    constructor(text) {
        this.text = text;
        const len = this._len = text.length;
        const specs = this._specs = [];
        let i = 0;
        for (; len > i; ++i) {
            specs.push(new CharSpec(text[i], false, false, false));
        }
    }
    eachChar(callback) {
        const len = this._len;
        const specs = this._specs;
        let i = 0;
        for (; len > i; ++i) {
            callback(specs[i]);
        }
    }
}
/** @internal */
class DynamicSegment {
    constructor(symbols) {
        this.text = 'PART';
        this._spec = new CharSpec(symbols, true, false, true);
    }
    eachChar(callback) {
        callback(this._spec);
    }
}
/** @internal */
class SymbolSegment {
    constructor(text) {
        this.text = text;
        this._spec = new CharSpec(text, false, true, false);
    }
    eachChar(callback) {
        callback(this._spec);
    }
}
class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}
const ISyntaxInterpreter = /*@__PURE__*/ createInterface('ISyntaxInterpreter', x => x.singleton(SyntaxInterpreter));
class SyntaxInterpreter {
    constructor() {
        /** @internal */
        this._rootState = new AttrParsingState(null);
        /** @internal */
        this._initialStates = [this._rootState];
    }
    // todo: this only works if this method is ever called only once
    add(defs) {
        defs = defs.slice(0).sort((d1, d2) => d1.pattern > d2.pattern ? 1 : -1);
        const ii = defs.length;
        let currentState;
        let def;
        let pattern;
        let types;
        let segments;
        let len;
        let charSpecCb;
        let i = 0;
        let j;
        while (ii > i) {
            currentState = this._rootState;
            def = defs[i];
            pattern = def.pattern;
            types = new SegmentTypes();
            segments = this._parse(def, types);
            len = segments.length;
            charSpecCb = (ch) => currentState = currentState.append(ch, pattern);
            for (j = 0; len > j; ++j) {
                segments[j].eachChar(charSpecCb);
            }
            currentState._types = types;
            currentState._isEndpoint = true;
            ++i;
        }
    }
    interpret(name) {
        const interpretation = new Interpretation();
        const len = name.length;
        let states = this._initialStates;
        let i = 0;
        let state;
        for (; i < len; ++i) {
            states = this._getNextStates(states, name.charAt(i), interpretation);
            if (states.length === 0) {
                break;
            }
        }
        states = states.filter(isEndpoint);
        if (states.length > 0) {
            states.sort(sortEndpoint);
            state = states[0];
            if (!state.charSpec.isSymbol) {
                interpretation.next(state._pattern);
            }
            interpretation.pattern = state._pattern;
        }
        return interpretation;
    }
    /** @internal */
    _getNextStates(states, ch, interpretation) {
        // TODO: reuse preallocated arrays
        const nextStates = [];
        let state = null;
        const len = states.length;
        let i = 0;
        for (; i < len; ++i) {
            state = states[i];
            nextStates.push(...state.findMatches(ch, interpretation));
        }
        return nextStates;
    }
    /** @internal */
    _parse(def, types) {
        const result = [];
        const pattern = def.pattern;
        const len = pattern.length;
        const symbols = def.symbols;
        let i = 0;
        let start = 0;
        let c = '';
        while (i < len) {
            c = pattern.charAt(i);
            if (symbols.length === 0 || !symbols.includes(c)) {
                if (i === start) {
                    if (c === 'P' && pattern.slice(i, i + 4) === 'PART') {
                        start = i = (i + 4);
                        result.push(new DynamicSegment(symbols));
                        ++types.dynamics;
                    }
                    else {
                        ++i;
                    }
                }
                else {
                    ++i;
                }
            }
            else if (i !== start) {
                result.push(new StaticSegment(pattern.slice(start, i)));
                ++types.statics;
                start = i;
            }
            else {
                result.push(new SymbolSegment(pattern.slice(start, i + 1)));
                ++types.symbols;
                start = ++i;
            }
        }
        if (start !== i) {
            result.push(new StaticSegment(pattern.slice(start, i)));
            ++types.statics;
        }
        return result;
    }
}
function isEndpoint(a) {
    return a._isEndpoint;
}
function sortEndpoint(a, b) {
    // both a and b are endpoints
    // compare them based on the number of static, then dynamic & symbol fragments
    const aTypes = a._types;
    const bTypes = b._types;
    if (aTypes.statics !== bTypes.statics) {
        return bTypes.statics - aTypes.statics;
    }
    if (aTypes.dynamics !== bTypes.dynamics) {
        return bTypes.dynamics - aTypes.dynamics;
    }
    if (aTypes.symbols !== bTypes.symbols) {
        return bTypes.symbols - aTypes.symbols;
    }
    return 0;
}
class AttrSyntax {
    constructor(rawName, rawValue, target, command, parts = null) {
        this.rawName = rawName;
        this.rawValue = rawValue;
        this.target = target;
        this.command = command;
        this.parts = parts;
    }
}
const IAttributePattern = /*@__PURE__*/ createInterface('IAttributePattern');
const IAttributeParser = /*@__PURE__*/ createInterface('IAttributeParser', x => x.singleton(AttributeParser));
class AttributeParser {
    constructor() {
        /** @internal */
        this._cache = {};
        const interpreter = this._interpreter = kernel.resolve(ISyntaxInterpreter);
        const attrPatterns = AttributePattern.findAll(kernel.resolve(kernel.IContainer));
        const patterns = this._patterns = {};
        const allDefs = attrPatterns.reduce((allDefs, attrPattern) => {
            const patternDefs = getAllPatternDefinitions(attrPattern.constructor);
            patternDefs.forEach(def => patterns[def.pattern] = attrPattern);
            return allDefs.concat(patternDefs);
        }, kernel.emptyArray);
        interpreter.add(allDefs);
    }
    parse(name, value) {
        let interpretation = this._cache[name];
        if (interpretation == null) {
            interpretation = this._cache[name] = this._interpreter.interpret(name);
        }
        const pattern = interpretation.pattern;
        if (pattern == null) {
            return new AttrSyntax(name, value, name, null, null);
        }
        else {
            return this._patterns[pattern][pattern](name, value, interpretation.parts);
        }
    }
}
function attributePattern(...patternDefs) {
    return function decorator(target) {
        return AttributePattern.define(patternDefs, target);
    };
}
const getAllPatternDefinitions = (Type) => patterns.get(Type) ?? kernel.emptyArray;
const patterns = new WeakMap();
const AttributePattern = objectFreeze({
    name: kernel.getResourceKeyFor('attribute-pattern'),
    define(patternDefs, Type) {
        patterns.set(Type, patternDefs);
        return kernel.Registrable.define(Type, (container) => {
            singletonRegistration(IAttributePattern, Type).register(container);
        });
    },
    getPatternDefinitions: getAllPatternDefinitions,
    findAll: (container) => container.root.getAll(IAttributePattern),
});
exports.DotSeparatedAttributePattern = class DotSeparatedAttributePattern {
    'PART.PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], parts[1]);
    }
    'PART.PART.PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, `${parts[0]}.${parts[1]}`, parts[2]);
    }
};
exports.DotSeparatedAttributePattern = __decorate([
    attributePattern({ pattern: 'PART.PART', symbols: '.' }, { pattern: 'PART.PART.PART', symbols: '.' })
], exports.DotSeparatedAttributePattern);
exports.RefAttributePattern = class RefAttributePattern {
    'ref'(rawName, rawValue, _parts) {
        return new AttrSyntax(rawName, rawValue, 'element', 'ref');
    }
    'PART.ref'(rawName, rawValue, parts) {
        let target = parts[0];
        if (target === 'view-model') {
            target = 'component';
            {
                // eslint-disable-next-line no-console
                console.warn(`[aurelia] Detected view-model.ref usage: "${rawName}=${rawValue}".`
                    + ` This is deprecated and component.ref should be used instead`);
            }
        }
        return new AttrSyntax(rawName, rawValue, target, 'ref');
    }
};
exports.RefAttributePattern = __decorate([
    attributePattern({ pattern: 'ref', symbols: '' }, { pattern: 'PART.ref', symbols: '.' })
], exports.RefAttributePattern);
let EventAttributePattern = class EventAttributePattern {
    'PART.trigger:PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'trigger', parts);
    }
    'PART.capture:PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'capture', parts);
    }
};
EventAttributePattern = __decorate([
    attributePattern({ pattern: 'PART.trigger:PART', symbols: '.:' }, { pattern: 'PART.capture:PART', symbols: '.:' })
], EventAttributePattern);
exports.ColonPrefixedBindAttributePattern = class ColonPrefixedBindAttributePattern {
    ':PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'bind');
    }
};
exports.ColonPrefixedBindAttributePattern = __decorate([
    attributePattern({ pattern: ':PART', symbols: ':' })
], exports.ColonPrefixedBindAttributePattern);
exports.AtPrefixedTriggerAttributePattern = class AtPrefixedTriggerAttributePattern {
    '@PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'trigger');
    }
    '@PART:PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'trigger', [parts[0], 'trigger', ...parts.slice(1)]);
    }
};
exports.AtPrefixedTriggerAttributePattern = __decorate([
    attributePattern({ pattern: '@PART', symbols: '@' }, { pattern: '@PART:PART', symbols: '@:' })
], exports.AtPrefixedTriggerAttributePattern);
let SpreadAttributePattern = class SpreadAttributePattern {
    '...$attrs'(rawName, rawValue, _parts) {
        return new AttrSyntax(rawName, rawValue, '', '...$attrs');
    }
};
SpreadAttributePattern = __decorate([
    attributePattern({ pattern: '...$attrs', symbols: '' })
], SpreadAttributePattern);

/** @internal */ const ctNone = 'None';
/** @internal */ const ctIgnoreAttr = 'IgnoreAttr';
function bindingCommand(nameOrDefinition) {
    return function (target) {
        return BindingCommand.define(nameOrDefinition, target);
    };
}
class BindingCommandDefinition {
    constructor(Type, name, aliases, key, type) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
        this.type = type;
    }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new BindingCommandDefinition(Type, kernel.firstDefined(getCommandAnnotation(Type, 'name'), name), kernel.mergeArrays(getCommandAnnotation(Type, 'aliases'), def.aliases, Type.aliases), getCommandKeyFrom(name), kernel.firstDefined(getCommandAnnotation(Type, 'type'), def.type, Type.type, null));
    }
    register(container, aliasName) {
        const $Type = this.Type;
        const key = typeof aliasName === 'string' ? getCommandKeyFrom(aliasName) : this.key;
        const aliases = this.aliases;
        if (!container.has(key, false)) {
            container.register(container.has($Type, false) ? null : singletonRegistration($Type, $Type), aliasRegistration($Type, key), ...aliases.map(alias => aliasRegistration($Type, getCommandKeyFrom(alias))));
        } /* istanbul ignore next */
        else {
            // eslint-disable-next-line no-console
            console.warn(`[DEV:aurelia] ${createMappedError(157 /* ErrorNames.binding_command_existed */, this.name)}`);
        }
    }
}
const cmdBaseName = /*@__PURE__*/ kernel.getResourceKeyFor('binding-command');
const getCommandKeyFrom = (name) => `${cmdBaseName}:${name}`;
const getCommandAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const BindingCommand = objectFreeze({
    name: cmdBaseName,
    keyFrom: getCommandKeyFrom,
    // need this?
    // isType<T>(value: T): value is (T extends Constructable ? BindingCommandType<T> : never) {
    //   return isFunction(value) && hasOwnMetadata(cmdBaseName, value);
    // },
    define(nameOrDef, Type) {
        const definition = BindingCommandDefinition.create(nameOrDef, Type);
        const $Type = definition.Type;
        defineMetadata(cmdBaseName, definition, $Type);
        // a requirement for the resource system in kernel
        defineMetadata(kernel.resourceBaseName, definition, $Type);
        return $Type;
    },
    getAnnotation: getCommandAnnotation,
    find(container, name) {
        const key = getCommandKeyFrom(name);
        const Type = container.find(key);
        return Type == null ? null : getOwnMetadata(cmdBaseName, Type) ?? null;
    },
    get(container, name) {
        {
            try {
                return container.get(kernel.resource(getCommandKeyFrom(name)));
            }
            catch (ex) {
                // eslint-disable-next-line no-console
                console.log(`\n\n\n[DEV:aurelia] Cannot retrieve binding command with name\n\n\n\n\n`, name);
                throw ex;
            }
        }
        return container.get(kernel.resource(getCommandKeyFrom(name)));
    },
});
exports.OneTimeBindingCommand = class OneTimeBindingCommand {
    get type() { return ctNone; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        let value = info.attr.rawValue;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                // if the mapper doesn't know how to map it
                // use the default behavior, which is camel-casing
                ?? kernel.camelCase(target);
        }
        else {
            // if it looks like: <my-el value.bind>
            // it means        : <my-el value.bind="value">
            if (value === '' && info.def.kind === dtElement) {
                value = kernel.camelCase(target);
            }
            target = info.bindable.name;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, etIsProperty), target, oneTime);
    }
};
exports.OneTimeBindingCommand = __decorate([
    bindingCommand('one-time')
], exports.OneTimeBindingCommand);
exports.ToViewBindingCommand = class ToViewBindingCommand {
    get type() { return ctNone; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        let value = info.attr.rawValue;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                // if the mapper doesn't know how to map it
                // use the default behavior, which is camel-casing
                ?? kernel.camelCase(target);
        }
        else {
            // if it looks like: <my-el value.bind>
            // it means        : <my-el value.bind="value">
            if (value === '' && info.def.kind === dtElement) {
                value = kernel.camelCase(target);
            }
            target = info.bindable.name;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, etIsProperty), target, toView);
    }
};
exports.ToViewBindingCommand = __decorate([
    bindingCommand('to-view')
], exports.ToViewBindingCommand);
exports.FromViewBindingCommand = class FromViewBindingCommand {
    get type() { return ctNone; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        let value = attr.rawValue;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                // if the mapper doesn't know how to map it
                // use the default behavior, which is camel-casing
                ?? kernel.camelCase(target);
        }
        else {
            // if it looks like: <my-el value.bind>
            // it means        : <my-el value.bind="value">
            if (value === '' && info.def.kind === dtElement) {
                value = kernel.camelCase(target);
            }
            target = info.bindable.name;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, etIsProperty), target, fromView);
    }
};
exports.FromViewBindingCommand = __decorate([
    bindingCommand('from-view')
], exports.FromViewBindingCommand);
exports.TwoWayBindingCommand = class TwoWayBindingCommand {
    get type() { return ctNone; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        let value = attr.rawValue;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                // if the mapper doesn't know how to map it
                // use the default behavior, which is camel-casing
                ?? kernel.camelCase(target);
        }
        else {
            // if it looks like: <my-el value.bind>
            // it means        : <my-el value.bind="value">
            if (value === '' && info.def.kind === dtElement) {
                value = kernel.camelCase(target);
            }
            target = info.bindable.name;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, etIsProperty), target, twoWay);
    }
};
exports.TwoWayBindingCommand = __decorate([
    bindingCommand('two-way')
], exports.TwoWayBindingCommand);
exports.DefaultBindingCommand = class DefaultBindingCommand {
    get type() { return ctNone; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        const bindable = info.bindable;
        let defaultMode$1;
        let mode;
        let target = attr.target;
        let value = attr.rawValue;
        if (bindable == null) {
            mode = attrMapper.isTwoWay(info.node, target) ? twoWay : toView;
            target = attrMapper.map(info.node, target)
                // if the mapper doesn't know how to map it
                // use the default behavior, which is camel-casing
                ?? kernel.camelCase(target);
        }
        else {
            // if it looks like: <my-el value.bind>
            // it means        : <my-el value.bind="value">
            if (value === '' && info.def.kind === dtElement) {
                value = kernel.camelCase(target);
            }
            defaultMode$1 = info.def.defaultBindingMode;
            mode = bindable.mode === defaultMode || bindable.mode == null
                ? defaultMode$1 == null || defaultMode$1 === defaultMode
                    ? toView
                    : defaultMode$1
                : bindable.mode;
            target = bindable.name;
        }
        return new PropertyBindingInstruction(exprParser.parse(value, etIsProperty), target, mode);
    }
};
exports.DefaultBindingCommand = __decorate([
    bindingCommand('bind')
], exports.DefaultBindingCommand);
exports.ForBindingCommand = class ForBindingCommand {
    get type() { return ctNone; }
    static get inject() { return [IAttributeParser]; }
    constructor(attrParser) {
        this._attrParser = attrParser;
    }
    build(info, exprParser) {
        const target = info.bindable === null
            ? kernel.camelCase(info.attr.target)
            : info.bindable.name;
        const forOf = exprParser.parse(info.attr.rawValue, etIsIterator);
        let props = kernel.emptyArray;
        if (forOf.semiIdx > -1) {
            const attr = info.attr.rawValue.slice(forOf.semiIdx + 1);
            const i = attr.indexOf(':');
            if (i > -1) {
                const attrName = attr.slice(0, i).trim();
                const attrValue = attr.slice(i + 1).trim();
                const attrSyntax = this._attrParser.parse(attrName, attrValue);
                props = [new MultiAttrInstruction(attrValue, attrSyntax.target, attrSyntax.command)];
            }
        }
        return new IteratorBindingInstruction(forOf, target, props);
    }
};
exports.ForBindingCommand = __decorate([
    bindingCommand('for')
], exports.ForBindingCommand);
exports.TriggerBindingCommand = class TriggerBindingCommand {
    get type() { return ctIgnoreAttr; }
    build(info, exprParser) {
        return new ListenerBindingInstruction(exprParser.parse(info.attr.rawValue, etIsFunction), info.attr.target, false, info.attr.parts?.[2] ?? null);
    }
};
exports.TriggerBindingCommand = __decorate([
    bindingCommand('trigger')
], exports.TriggerBindingCommand);
exports.CaptureBindingCommand = class CaptureBindingCommand {
    get type() { return ctIgnoreAttr; }
    build(info, exprParser) {
        return new ListenerBindingInstruction(exprParser.parse(info.attr.rawValue, etIsFunction), info.attr.target, true, info.attr.parts?.[2] ?? null);
    }
};
exports.CaptureBindingCommand = __decorate([
    bindingCommand('capture')
], exports.CaptureBindingCommand);
/**
 * Attr binding command. Compile attr with binding symbol with command `attr` to `AttributeBindingInstruction`
 */
exports.AttrBindingCommand = class AttrBindingCommand {
    get type() { return ctIgnoreAttr; }
    build(info, exprParser) {
        return new AttributeBindingInstruction(info.attr.target, exprParser.parse(info.attr.rawValue, etIsProperty), info.attr.target);
    }
};
exports.AttrBindingCommand = __decorate([
    bindingCommand('attr')
], exports.AttrBindingCommand);
/**
 * Style binding command. Compile attr with binding symbol with command `style` to `AttributeBindingInstruction`
 */
exports.StyleBindingCommand = class StyleBindingCommand {
    get type() { return ctIgnoreAttr; }
    build(info, exprParser) {
        return new AttributeBindingInstruction('style', exprParser.parse(info.attr.rawValue, etIsProperty), info.attr.target);
    }
};
exports.StyleBindingCommand = __decorate([
    bindingCommand('style')
], exports.StyleBindingCommand);
/**
 * Class binding command. Compile attr with binding symbol with command `class` to `AttributeBindingInstruction`
 */
exports.ClassBindingCommand = class ClassBindingCommand {
    get type() { return ctIgnoreAttr; }
    build(info, exprParser) {
        return new AttributeBindingInstruction('class', exprParser.parse(info.attr.rawValue, etIsProperty), info.attr.target);
    }
};
exports.ClassBindingCommand = __decorate([
    bindingCommand('class')
], exports.ClassBindingCommand);
/**
 * Binding command to refer different targets (element, custom element/attribute view models, controller) attached to an element
 */
let RefBindingCommand = class RefBindingCommand {
    get type() { return ctIgnoreAttr; }
    build(info, exprParser) {
        return new RefBindingInstruction(exprParser.parse(info.attr.rawValue, etIsProperty), info.attr.target);
    }
};
RefBindingCommand = __decorate([
    bindingCommand('ref')
], RefBindingCommand);
let SpreadBindingCommand = class SpreadBindingCommand {
    get type() { return ctIgnoreAttr; }
    build(_info) {
        return new SpreadBindingInstruction();
    }
};
SpreadBindingCommand = __decorate([
    bindingCommand('...$attrs')
], SpreadBindingCommand);

const ISVGAnalyzer = /*@__PURE__*/ createInterface('ISVGAnalyzer', x => x.singleton(NoopSVGAnalyzer));
const o = (keys) => {
    const lookup = createLookup();
    keys = isString(keys) ? keys.split(' ') : keys;
    let key;
    for (key of keys) {
        lookup[key] = true;
    }
    return lookup;
};
class NoopSVGAnalyzer {
    isStandardSvgAttribute(_node, _attributeName) {
        return false;
    }
}
class SVGAnalyzer {
    static register(container) {
        container.register(singletonRegistration(this, this), aliasRegistration(this, ISVGAnalyzer));
    }
    constructor() {
        /** @internal */
        this._svgElements = objectAssign(createLookup(), {
            'a': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage target transform xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'altGlyph': o('class dx dy externalResourcesRequired format glyphRef id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'altglyph': createLookup(),
            'altGlyphDef': o('id xml:base xml:lang xml:space'),
            'altglyphdef': createLookup(),
            'altGlyphItem': o('id xml:base xml:lang xml:space'),
            'altglyphitem': createLookup(),
            'animate': o('accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'animateColor': o('accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'animateMotion': o('accumulate additive begin by calcMode dur end externalResourcesRequired fill from id keyPoints keySplines keyTimes max min onbegin onend onload onrepeat origin path repeatCount repeatDur requiredExtensions requiredFeatures restart rotate systemLanguage to values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'animateTransform': o('accumulate additive attributeName attributeType begin by calcMode dur end externalResourcesRequired fill from id keySplines keyTimes max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to type values xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'circle': o('class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup r requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'clipPath': o('class clipPathUnits externalResourcesRequired id requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'color-profile': o('id local name rendering-intent xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'cursor': o('externalResourcesRequired id requiredExtensions requiredFeatures systemLanguage x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'defs': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'desc': o('class id style xml:base xml:lang xml:space'),
            'ellipse': o('class cx cy externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform xml:base xml:lang xml:space'),
            'feBlend': o('class height id in in2 mode result style width x xml:base xml:lang xml:space y'),
            'feColorMatrix': o('class height id in result style type values width x xml:base xml:lang xml:space y'),
            'feComponentTransfer': o('class height id in result style width x xml:base xml:lang xml:space y'),
            'feComposite': o('class height id in in2 k1 k2 k3 k4 operator result style width x xml:base xml:lang xml:space y'),
            'feConvolveMatrix': o('bias class divisor edgeMode height id in kernelMatrix kernelUnitLength order preserveAlpha result style targetX targetY width x xml:base xml:lang xml:space y'),
            'feDiffuseLighting': o('class diffuseConstant height id in kernelUnitLength result style surfaceScale width x xml:base xml:lang xml:space y'),
            'feDisplacementMap': o('class height id in in2 result scale style width x xChannelSelector xml:base xml:lang xml:space y yChannelSelector'),
            'feDistantLight': o('azimuth elevation id xml:base xml:lang xml:space'),
            'feFlood': o('class height id result style width x xml:base xml:lang xml:space y'),
            'feFuncA': o('amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space'),
            'feFuncB': o('amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space'),
            'feFuncG': o('amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space'),
            'feFuncR': o('amplitude exponent id intercept offset slope tableValues type xml:base xml:lang xml:space'),
            'feGaussianBlur': o('class height id in result stdDeviation style width x xml:base xml:lang xml:space y'),
            'feImage': o('class externalResourcesRequired height id preserveAspectRatio result style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'feMerge': o('class height id result style width x xml:base xml:lang xml:space y'),
            'feMergeNode': o('id xml:base xml:lang xml:space'),
            'feMorphology': o('class height id in operator radius result style width x xml:base xml:lang xml:space y'),
            'feOffset': o('class dx dy height id in result style width x xml:base xml:lang xml:space y'),
            'fePointLight': o('id x xml:base xml:lang xml:space y z'),
            'feSpecularLighting': o('class height id in kernelUnitLength result specularConstant specularExponent style surfaceScale width x xml:base xml:lang xml:space y'),
            'feSpotLight': o('id limitingConeAngle pointsAtX pointsAtY pointsAtZ specularExponent x xml:base xml:lang xml:space y z'),
            'feTile': o('class height id in result style width x xml:base xml:lang xml:space y'),
            'feTurbulence': o('baseFrequency class height id numOctaves result seed stitchTiles style type width x xml:base xml:lang xml:space y'),
            'filter': o('class externalResourcesRequired filterRes filterUnits height id primitiveUnits style width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'font': o('class externalResourcesRequired horiz-adv-x horiz-origin-x horiz-origin-y id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space'),
            'font-face': o('accent-height alphabetic ascent bbox cap-height descent font-family font-size font-stretch font-style font-variant font-weight hanging id ideographic mathematical overline-position overline-thickness panose-1 slope stemh stemv strikethrough-position strikethrough-thickness underline-position underline-thickness unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical widths x-height xml:base xml:lang xml:space'),
            'font-face-format': o('id string xml:base xml:lang xml:space'),
            'font-face-name': o('id name xml:base xml:lang xml:space'),
            'font-face-src': o('id xml:base xml:lang xml:space'),
            'font-face-uri': o('id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'foreignObject': o('class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xml:base xml:lang xml:space y'),
            'g': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'glyph': o('arabic-form class d glyph-name horiz-adv-x id lang orientation style unicode vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space'),
            'glyphRef': o('class dx dy format glyphRef id style x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'glyphref': createLookup(),
            'hkern': o('g1 g2 id k u1 u2 xml:base xml:lang xml:space'),
            'image': o('class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'line': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform x1 x2 xml:base xml:lang xml:space y1 y2'),
            'linearGradient': o('class externalResourcesRequired gradientTransform gradientUnits id spreadMethod style x1 x2 xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y1 y2'),
            'marker': o('class externalResourcesRequired id markerHeight markerUnits markerWidth orient preserveAspectRatio refX refY style viewBox xml:base xml:lang xml:space'),
            'mask': o('class externalResourcesRequired height id maskContentUnits maskUnits requiredExtensions requiredFeatures style systemLanguage width x xml:base xml:lang xml:space y'),
            'metadata': o('id xml:base xml:lang xml:space'),
            'missing-glyph': o('class d horiz-adv-x id style vert-adv-y vert-origin-x vert-origin-y xml:base xml:lang xml:space'),
            'mpath': o('externalResourcesRequired id xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'path': o('class d externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup pathLength requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'pattern': o('class externalResourcesRequired height id patternContentUnits patternTransform patternUnits preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage viewBox width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'polygon': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'polyline': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup points requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'radialGradient': o('class cx cy externalResourcesRequired fx fy gradientTransform gradientUnits id r spreadMethod style xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space'),
            'rect': o('class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rx ry style systemLanguage transform width x xml:base xml:lang xml:space y'),
            'script': o('externalResourcesRequired id type xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'set': o('attributeName attributeType begin dur end externalResourcesRequired fill id max min onbegin onend onload onrepeat repeatCount repeatDur requiredExtensions requiredFeatures restart systemLanguage to xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space'),
            'stop': o('class id offset style xml:base xml:lang xml:space'),
            'style': o('id media title type xml:base xml:lang xml:space'),
            'svg': o('baseProfile class contentScriptType contentStyleType externalResourcesRequired height id onabort onactivate onclick onerror onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup onresize onscroll onunload onzoom preserveAspectRatio requiredExtensions requiredFeatures style systemLanguage version viewBox width x xml:base xml:lang xml:space y zoomAndPan'),
            'switch': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform xml:base xml:lang xml:space'),
            'symbol': o('class externalResourcesRequired id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup preserveAspectRatio style viewBox xml:base xml:lang xml:space'),
            'text': o('class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength transform x xml:base xml:lang xml:space y'),
            'textPath': o('class externalResourcesRequired id lengthAdjust method onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures spacing startOffset style systemLanguage textLength xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space'),
            'title': o('class id style xml:base xml:lang xml:space'),
            'tref': o('class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xlink:arcrole xlink:href xlink:role xlink:title xlink:type xml:base xml:lang xml:space y'),
            'tspan': o('class dx dy externalResourcesRequired id lengthAdjust onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures rotate style systemLanguage textLength x xml:base xml:lang xml:space y'),
            'use': o('class externalResourcesRequired height id onactivate onclick onfocusin onfocusout onload onmousedown onmousemove onmouseout onmouseover onmouseup requiredExtensions requiredFeatures style systemLanguage transform width x xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xml:lang xml:space y'),
            'view': o('externalResourcesRequired id preserveAspectRatio viewBox viewTarget xml:base xml:lang xml:space zoomAndPan'),
            'vkern': o('g1 g2 id k u1 u2 xml:base xml:lang xml:space'),
        });
        /** @internal */
        this._svgPresentationElements = o('a altGlyph animate animateColor circle clipPath defs ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feFlood feGaussianBlur feImage feMerge feMorphology feOffset feSpecularLighting feTile feTurbulence filter font foreignObject g glyph glyphRef image line linearGradient marker mask missing-glyph path pattern polygon polyline radialGradient rect stop svg switch symbol text textPath tref tspan use');
        /** @internal */
        this._svgPresentationAttributes = o('alignment-baseline baseline-shift clip-path clip-rule clip color-interpolation-filters color-interpolation color-profile color-rendering color cursor direction display dominant-baseline enable-background fill-opacity fill-rule fill filter flood-color flood-opacity font-family font-size-adjust font-size font-stretch font-style font-variant font-weight glyph-orientation-horizontal glyph-orientation-vertical image-rendering kerning letter-spacing lighting-color marker-end marker-mid marker-start mask opacity overflow pointer-events shape-rendering stop-color stop-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width stroke text-anchor text-decoration text-rendering unicode-bidi visibility word-spacing writing-mode');
        const platform = kernel.resolve(IPlatform);
        this.SVGElement = platform.globalThis.SVGElement;
        const div = platform.document.createElement('div');
        div.innerHTML = '<svg><altGlyph /></svg>';
        if (div.firstElementChild.nodeName === 'altglyph') {
            // handle chrome casing inconsistencies.
            const svg = this._svgElements;
            let tmp = svg.altGlyph;
            svg.altGlyph = svg.altglyph;
            svg.altglyph = tmp;
            tmp = svg.altGlyphDef;
            svg.altGlyphDef = svg.altglyphdef;
            svg.altglyphdef = tmp;
            tmp = svg.altGlyphItem;
            svg.altGlyphItem = svg.altglyphitem;
            svg.altglyphitem = tmp;
            tmp = svg.glyphRef;
            svg.glyphRef = svg.glyphref;
            svg.glyphref = tmp;
        }
    }
    isStandardSvgAttribute(node, attributeName) {
        if (!(node instanceof this.SVGElement)) {
            return false;
        }
        return (this._svgPresentationElements[node.nodeName] === true && this._svgPresentationAttributes[attributeName] === true ||
            this._svgElements[node.nodeName]?.[attributeName] === true);
    }
}

const IAttrMapper = /*@__PURE__*/ createInterface('IAttrMapper', x => x.singleton(AttrMapper));
class AttrMapper {
    constructor() {
        /** @internal */ this.fns = [];
        /** @internal */ this._tagAttrMap = createLookup();
        /** @internal */ this._globalAttrMap = createLookup();
        this.svg = kernel.resolve(ISVGAnalyzer);
        this.useMapping({
            LABEL: { for: 'htmlFor' },
            IMG: { usemap: 'useMap' },
            INPUT: {
                maxlength: 'maxLength',
                minlength: 'minLength',
                formaction: 'formAction',
                formenctype: 'formEncType',
                formmethod: 'formMethod',
                formnovalidate: 'formNoValidate',
                formtarget: 'formTarget',
                inputmode: 'inputMode',
            },
            TEXTAREA: { maxlength: 'maxLength' },
            TD: { rowspan: 'rowSpan', colspan: 'colSpan' },
            TH: { rowspan: 'rowSpan', colspan: 'colSpan' },
        });
        this.useGlobalMapping({
            accesskey: 'accessKey',
            contenteditable: 'contentEditable',
            tabindex: 'tabIndex',
            textcontent: 'textContent',
            innerhtml: 'innerHTML',
            scrolltop: 'scrollTop',
            scrollleft: 'scrollLeft',
            readonly: 'readOnly',
        });
    }
    /**
     * Allow application to teach Aurelia how to define how to map attributes to properties
     * based on element tagName
     */
    useMapping(config) {
        let newAttrMapping;
        let targetAttrMapping;
        let tagName;
        let attr;
        for (tagName in config) {
            newAttrMapping = config[tagName];
            targetAttrMapping = this._tagAttrMap[tagName] ??= createLookup();
            for (attr in newAttrMapping) {
                if (targetAttrMapping[attr] !== void 0) {
                    throw createError(attr, tagName);
                }
                targetAttrMapping[attr] = newAttrMapping[attr];
            }
        }
    }
    /**
     * Allow applications to teach Aurelia how to define how to map attributes to properties
     * for all elements
     */
    useGlobalMapping(config) {
        const mapper = this._globalAttrMap;
        for (const attr in config) {
            if (mapper[attr] !== void 0) {
                throw createError(attr, '*');
            }
            mapper[attr] = config[attr];
        }
    }
    /**
     * Add a given function to a list of fns that will be used
     * to check if `'bind'` command can be understood as `'two-way'` command.
     */
    useTwoWay(fn) {
        this.fns.push(fn);
    }
    /**
     * Returns true if an attribute should be two way bound based on an element
     */
    isTwoWay(node, attrName) {
        return shouldDefaultToTwoWay(node, attrName)
            || this.fns.length > 0 && this.fns.some(fn => fn(node, attrName));
    }
    /**
     * Retrieves the mapping information this mapper have for an attribute on an element
     */
    map(node, attr) {
        return this._tagAttrMap[node.nodeName]?.[attr]
            ?? this._globalAttrMap[attr]
            ?? (isDataAttribute(node, attr, this.svg)
                ? attr
                : null);
    }
}
function shouldDefaultToTwoWay(element, attr) {
    switch (element.nodeName) {
        case 'INPUT':
            switch (element.type) {
                case 'checkbox':
                case 'radio':
                    return attr === 'checked';
                // note:
                // ideally, it should check for corresponding input type first
                // as 'files' shouldn't be two way on a number input, for example
                // but doing it this way is acceptable-ish, as the common user expectations,
                // and the behavior of the control for these properties are the same,
                // regardless the type of the <input>
                default:
                    return attr === 'value' || attr === 'files' || attr === 'value-as-number' || attr === 'value-as-date';
            }
        case 'TEXTAREA':
        case 'SELECT':
            return attr === 'value';
        default:
            switch (attr) {
                case 'textcontent':
                case 'innerhtml':
                    return element.hasAttribute('contenteditable');
                case 'scrolltop':
                case 'scrollleft':
                    return true;
                default:
                    return false;
            }
    }
}
function createError(attr, tagName) {
    return createMappedError(719 /* ErrorNames.compiler_attr_mapper_duplicate_mapping */, attr, tagName);
}

const nsMap = createLookup();
/**
 * Attribute accessor in a XML document/element that can be accessed via a namespace.
 * Wraps [`getAttributeNS`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS).
 */
class AttributeNSAccessor {
    static forNs(ns) {
        return nsMap[ns] ??= new AttributeNSAccessor(ns);
    }
    constructor(
    /**
     * The namespace associated with this accessor
     */
    ns) {
        this.ns = ns;
        // ObserverType.Layout is not always true, it depends on the property
        // but for simplicity, always treat as such
        this.type = (atNode | atLayout);
    }
    getValue(obj, propertyKey) {
        return obj.getAttributeNS(this.ns, propertyKey);
    }
    setValue(newValue, obj, key) {
        if (newValue == null) {
            obj.removeAttributeNS(this.ns, key);
        }
        else {
            obj.setAttributeNS(this.ns, key, newValue);
        }
    }
}
mixinNoopSubscribable(AttributeNSAccessor);

/**
 * Attribute accessor for HTML elements.
 * Note that Aurelia works with properties, so in all case it will try to assign to property instead of attributes.
 * Unless the property falls into a special set, then it will use attribute for it.
 *
 * @see PropertyAccessor
 */
class DataAttributeAccessor {
    constructor() {
        // ObserverType.Layout is not always true, it depends on the property
        // but for simplicity, always treat as such
        this.type = (atNode | atLayout);
    }
    getValue(obj, key) {
        return obj.getAttribute(key);
    }
    setValue(newValue, obj, key) {
        if (newValue == null) {
            obj.removeAttribute(key);
        }
        else {
            obj.setAttribute(key, newValue);
        }
    }
}
mixinNoopSubscribable(DataAttributeAccessor);
const attrAccessor = new DataAttributeAccessor();

const childObserverOptions$1 = {
    childList: true,
    subtree: true,
    characterData: true
};
function defaultMatcher$1(a, b) {
    return a === b;
}
class SelectValueObserver {
    constructor(obj, 
    // deepscan-disable-next-line
    _key, config, observerLocator) {
        // ObserverType.Layout is not always true
        // but for simplicity, always treat as such
        this.type = (atNode | atObserver | atLayout);
        /** @internal */
        this._value = void 0;
        /** @internal */
        this._oldValue = void 0;
        /** @internal */
        this._hasChanges = false;
        /** @internal */
        this._arrayObserver = void 0;
        /** @internal */
        this._nodeObserver = void 0;
        /** @internal */
        this._observing = false;
        /**
         * Used by mixing defined methods subscribe/unsubscribe
         *
         * @internal
         */
        this._listened = false;
        this._el = obj;
        this._observerLocator = observerLocator;
        this._config = config;
    }
    getValue() {
        // is it safe to assume the observer has the latest value?
        // todo: ability to turn on/off cache based on type
        return this._observing
            ? this._value
            : this._el.multiple
                // todo: maybe avoid double iteration?
                ? getSelectedOptions(this._el.options)
                : this._el.value;
    }
    setValue(newValue) {
        this._oldValue = this._value;
        this._value = newValue;
        this._hasChanges = newValue !== this._oldValue;
        this._observeArray(newValue instanceof Array ? newValue : null);
        this._flushChanges();
    }
    /** @internal */
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        // always sync "selected" property of <options/>
        // immediately whenever the array notifies its mutation
        this.syncOptions();
    }
    syncOptions() {
        const value = this._value;
        const obj = this._el;
        const $isArray = isArray(value);
        const matcher = obj.matcher ?? defaultMatcher$1;
        const options = obj.options;
        let i = options.length;
        while (i-- > 0) {
            const option = options[i];
            const optionValue = hasOwnProperty.call(option, 'model') ? option.model : option.value;
            if ($isArray) {
                option.selected = value.findIndex(item => !!matcher(optionValue, item)) !== -1;
                continue;
            }
            option.selected = !!matcher(optionValue, value);
        }
    }
    syncValue() {
        // Spec for synchronizing value from `<select/>`  to `SelectObserver`
        // When synchronizing value to observed <select/> element, do the following steps:
        // A. If `<select/>` is multiple
        //    1. Check if current value, called `currentValue` is an array
        //      a. If not an array, return true to signal value has changed
        //      b. If is an array:
        //        i. gather all current selected <option/>, in to array called `values`
        //        ii. loop through the `currentValue` array and remove items that are nolonger selected based on matcher
        //        iii. loop through the `values` array and add items that are selected based on matcher
        //        iv. Return false to signal value hasn't changed
        // B. If the select is single
        //    1. Let `value` equal the first selected option, if no option selected, then `value` is `null`
        //    2. assign `this.currentValue` to `this.oldValue`
        //    3. assign `value` to `this.currentValue`
        //    4. return `true` to signal value has changed
        const obj = this._el;
        const options = obj.options;
        const len = options.length;
        const currentValue = this._value;
        let i = 0;
        if (obj.multiple) {
            // A.
            if (!(currentValue instanceof Array)) {
                // A.1.a
                return true;
            }
            // A.1.b
            // multi select
            let option;
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            const matcher = obj.matcher || defaultMatcher$1;
            // A.1.b.i
            const values = [];
            while (i < len) {
                option = options[i];
                if (option.selected) {
                    values.push(hasOwnProperty.call(option, 'model')
                        ? option.model
                        : option.value);
                }
                ++i;
            }
            let a;
            // A.1.b.ii
            i = 0;
            while (i < currentValue.length) {
                a = currentValue[i];
                // Todo: remove arrow fn
                if (values.findIndex(b => !!matcher(a, b)) === -1) {
                    currentValue.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
            // A.1.b.iii
            i = 0;
            while (i < values.length) {
                a = values[i];
                // Todo: remove arrow fn
                if (currentValue.findIndex(b => !!matcher(a, b)) === -1) {
                    currentValue.push(a);
                }
                ++i;
            }
            // A.1.b.iv
            return false;
        }
        // B. single select
        // B.1
        let value = null;
        let option;
        while (i < len) {
            option = options[i];
            if (option.selected) {
                value = hasOwnProperty.call(option, 'model')
                    ? option.model
                    : option.value;
                break;
            }
            ++i;
        }
        // B.2
        this._oldValue = this._value;
        // B.3
        this._value = value;
        // B.4
        return true;
    }
    /**
     * Used by mixing defined methods subscribe
     *
     * @internal
     */
    _start() {
        (this._nodeObserver = createMutationObserver(this._el, this._handleNodeChange.bind(this))).observe(this._el, childObserverOptions$1);
        this._observeArray(this._value instanceof Array ? this._value : null);
        this._observing = true;
    }
    /**
     * Used by mixing defined method unsubscribe
     *
     * @internal
     */
    _stop() {
        this._nodeObserver.disconnect();
        this._arrayObserver?.unsubscribe(this);
        this._nodeObserver
            = this._arrayObserver
                = void 0;
        this._observing = false;
    }
    // todo: observe all kind of collection
    /** @internal */
    _observeArray(array) {
        this._arrayObserver?.unsubscribe(this);
        this._arrayObserver = void 0;
        if (array != null) {
            if (!this._el.multiple) {
                throw createError$1(`AUR0654: array values can only be bound to a multi-select.`);
            }
            (this._arrayObserver = this._observerLocator.getArrayObserver(array)).subscribe(this);
        }
    }
    handleEvent() {
        const shouldNotify = this.syncValue();
        if (shouldNotify) {
            this._flush();
        }
    }
    /** @internal */
    _handleNodeChange(_records) {
        // syncing options first means forcing the UI to take the existing state from the model
        // example: if existing state has only 3 selected option
        //          and it's adding a 4th <option/> with selected state
        //          [selected] state will be disregarded as it's not present in the model
        //          this force uni-direction flow: where UI update is only via user event, or model changes
        //          Cons:
        //          Sometimes, an <option selected /> maybe added to the UI, and causes confusion, as it's not selected anymore after the sync
        //          Consider this before entering release candidate
        this.syncOptions();
        const shouldNotify = this.syncValue();
        if (shouldNotify) {
            this._flush();
        }
    }
    /** @internal */
    _flush() {
        oV$2 = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV$2);
    }
}
mixinNodeObserverUseConfig(SelectValueObserver);
runtime.subscriberCollection(SelectValueObserver);
function getSelectedOptions(options) {
    const selection = [];
    if (options.length === 0) {
        return selection;
    }
    const ii = options.length;
    let i = 0;
    let option;
    while (ii > i) {
        option = options[i];
        if (option.selected) {
            selection[selection.length] = hasOwnProperty.call(option, 'model') ? option.model : option.value;
        }
        ++i;
    }
    return selection;
}
// a shared variable for `.flush()` methods of observers
// so that there doesn't need to create an env record for every call
let oV$2 = void 0;

const customPropertyPrefix = '--';
class StyleAttributeAccessor {
    constructor(obj) {
        this.obj = obj;
        this.type = (atNode | atLayout);
        /** @internal */
        this._value = '';
        /** @internal */
        this._oldValue = '';
        this.styles = {};
        this.version = 0;
        /** @internal */
        this._hasChanges = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(newValue) {
        this._value = newValue;
        this._hasChanges = newValue !== this._oldValue;
        this._flushChanges();
    }
    /** @internal */
    _getStyleTuplesFromString(currentValue) {
        const styleTuples = [];
        const urlRegexTester = /url\([^)]+$/;
        let offset = 0;
        let currentChunk = '';
        let nextSplit;
        let indexOfColon;
        let attribute;
        let value;
        while (offset < currentValue.length) {
            nextSplit = currentValue.indexOf(';', offset);
            if (nextSplit === -1) {
                nextSplit = currentValue.length;
            }
            currentChunk += currentValue.substring(offset, nextSplit);
            offset = nextSplit + 1;
            // Make sure we never split a url so advance to next
            if (urlRegexTester.test(currentChunk)) {
                currentChunk += ';';
                continue;
            }
            indexOfColon = currentChunk.indexOf(':');
            attribute = currentChunk.substring(0, indexOfColon).trim();
            value = currentChunk.substring(indexOfColon + 1).trim();
            styleTuples.push([attribute, value]);
            currentChunk = '';
        }
        return styleTuples;
    }
    /** @internal */
    _getStyleTuplesFromObject(currentValue) {
        let value;
        let property;
        const styles = [];
        for (property in currentValue) {
            value = currentValue[property];
            if (value == null) {
                continue;
            }
            if (isString(value)) {
                // Custom properties should not be tampered with
                if (property.startsWith(customPropertyPrefix)) {
                    styles.push([property, value]);
                    continue;
                }
                styles.push([kernel.kebabCase(property), value]);
                continue;
            }
            styles.push(...this._getStyleTuples(value));
        }
        return styles;
    }
    /** @internal */
    _getStyleTuplesFromArray(currentValue) {
        const len = currentValue.length;
        if (len > 0) {
            const styles = [];
            let i = 0;
            for (; len > i; ++i) {
                styles.push(...this._getStyleTuples(currentValue[i]));
            }
            return styles;
        }
        return kernel.emptyArray;
    }
    /** @internal */
    _getStyleTuples(currentValue) {
        if (isString(currentValue)) {
            return this._getStyleTuplesFromString(currentValue);
        }
        if (currentValue instanceof Array) {
            return this._getStyleTuplesFromArray(currentValue);
        }
        if (currentValue instanceof Object) {
            return this._getStyleTuplesFromObject(currentValue);
        }
        return kernel.emptyArray;
    }
    /** @internal */
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            const currentValue = this._value;
            const styles = this.styles;
            const styleTuples = this._getStyleTuples(currentValue);
            let style;
            let version = this.version;
            this._oldValue = currentValue;
            let tuple;
            let name;
            let value;
            let i = 0;
            const len = styleTuples.length;
            for (; i < len; ++i) {
                tuple = styleTuples[i];
                name = tuple[0];
                value = tuple[1];
                this.setProperty(name, value);
                styles[name] = version;
            }
            this.styles = styles;
            this.version += 1;
            if (version === 0) {
                return;
            }
            version -= 1;
            for (style in styles) {
                if (!hasOwnProperty.call(styles, style) || styles[style] !== version) {
                    continue;
                }
                this.obj.style.removeProperty(style);
            }
        }
    }
    setProperty(style, value) {
        let priority = '';
        if (value != null && isFunction(value.indexOf) && value.includes('!important')) {
            priority = 'important';
            value = value.replace('!important', '');
        }
        this.obj.style.setProperty(style, value, priority);
    }
    bind() {
        this._value = this._oldValue = this.obj.style.cssText;
    }
}
mixinNoopSubscribable(StyleAttributeAccessor);

/**
 * Observer for non-radio, non-checkbox input.
 */
class ValueAttributeObserver {
    constructor(obj, key, config) {
        // ObserverType.Layout is not always true, it depends on the element & property combo
        // but for simplicity, always treat as such
        this.type = (atNode | atObserver | atLayout);
        /** @internal */
        this._value = '';
        /** @internal */
        this._oldValue = '';
        /** @internal */
        this._hasChanges = false;
        /**
         * Used by mixing defined methods subscribe/unsubscribe
         *
         * @internal
         */
        this._listened = false;
        this._el = obj;
        this._key = key;
        this._config = config;
    }
    getValue() {
        // is it safe to assume the observer has the latest value?
        // todo: ability to turn on/off cache based on type
        return this._value;
    }
    setValue(newValue) {
        if (areEqual(newValue, this._value)) {
            return;
        }
        this._oldValue = this._value;
        this._value = newValue;
        this._hasChanges = true;
        if (!this._config.readonly) {
            this._flushChanges();
        }
    }
    /** @internal */
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            this._el[this._key] = this._value ?? this._config.default;
            this._flush();
        }
    }
    handleEvent() {
        this._oldValue = this._value;
        this._value = this._el[this._key];
        if (this._oldValue !== this._value) {
            this._hasChanges = false;
            this._flush();
        }
    }
    /**
     * Used by mixing defined methods subscribe
     *
     * @internal
     */
    _start() {
        this._value = this._oldValue = this._el[this._key];
    }
    /** @internal */
    _flush() {
        oV$1 = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV$1);
    }
}
mixinNodeObserverUseConfig(ValueAttributeObserver);
runtime.subscriberCollection(ValueAttributeObserver);
// a reusable variable for `.flush()` methods of observers
// so that there doesn't need to create an env record for every call
let oV$1 = void 0;

// https://infra.spec.whatwg.org/#namespaces
// const htmlNS = 'http://www.w3.org/1999/xhtml';
// const mathmlNS = 'http://www.w3.org/1998/Math/MathML';
// const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const xmlnsNS = 'http://www.w3.org/2000/xmlns/';
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
const nsAttributes = objectAssign(createLookup(), {
    'xlink:actuate': ['actuate', xlinkNS],
    'xlink:arcrole': ['arcrole', xlinkNS],
    'xlink:href': ['href', xlinkNS],
    'xlink:role': ['role', xlinkNS],
    'xlink:show': ['show', xlinkNS],
    'xlink:title': ['title', xlinkNS],
    'xlink:type': ['type', xlinkNS],
    'xml:lang': ['lang', xmlNS],
    'xml:space': ['space', xmlNS],
    'xmlns': ['xmlns', xmlnsNS],
    'xmlns:xlink': ['xlink', xmlnsNS],
});
const elementPropertyAccessor = new runtime.PropertyAccessor();
elementPropertyAccessor.type = (atNode | atLayout);
class NodeObserverLocator {
    static register(container) {
        container.register(singletonRegistration(this, this), aliasRegistration(this, runtime.INodeObserverLocator));
    }
    constructor() {
        /**
         * Indicates whether the node observer will be allowed to use dirty checking for a property it doesn't know how to observe
         */
        this.allowDirtyCheck = true;
        /** @internal */
        this._events = createLookup();
        /** @internal */
        this._globalEvents = createLookup();
        /** @internal */
        this._overrides = createLookup();
        /** @internal */
        this._globalOverrides = createLookup();
        /** @internal */
        this._locator = kernel.resolve(kernel.IServiceLocator);
        /** @internal */
        this._platform = kernel.resolve(IPlatform);
        /** @internal */
        this._dirtyChecker = kernel.resolve(runtime.IDirtyChecker);
        /** @internal */
        this.svg = kernel.resolve(ISVGAnalyzer);
        // todo: atm, platform is required to be resolved too eagerly for the `.handles()` check
        // also a lot of tests assume default availability of observation
        // those 2 assumptions make it not the right time to extract the following line into a
        // default configuration for NodeObserverLocator yet
        // but in the future, they should be, so apps that don't use check box/select, or implement a different
        // observer don't have to pay the of the default implementation
        const inputEvents = ['change', 'input'];
        const inputEventsConfig = { events: inputEvents, default: '' };
        this.useConfig({
            INPUT: {
                value: inputEventsConfig,
                valueAsNumber: { events: inputEvents, default: 0 },
                checked: { type: CheckedObserver, events: inputEvents },
                files: { events: inputEvents, readonly: true },
            },
            SELECT: {
                value: { type: SelectValueObserver, events: ['change'], default: '' },
            },
            TEXTAREA: {
                value: inputEventsConfig,
            },
        });
        const contentEventsConfig = { events: ['change', 'input', 'blur', 'keyup', 'paste'], default: '' };
        const scrollEventsConfig = { events: ['scroll'], default: 0 };
        this.useConfigGlobal({
            scrollTop: scrollEventsConfig,
            scrollLeft: scrollEventsConfig,
            textContent: contentEventsConfig,
            innerHTML: contentEventsConfig,
        });
        this.overrideAccessorGlobal('css', 'style', 'class');
        this.overrideAccessor({
            INPUT: ['value', 'checked', 'model'],
            SELECT: ['value'],
            TEXTAREA: ['value'],
        });
    }
    // deepscan-disable-next-line
    handles(obj, _key) {
        return obj instanceof this._platform.Node;
    }
    useConfig(nodeNameOrConfig, key, eventsConfig) {
        const lookup = this._events;
        let existingMapping;
        if (isString(nodeNameOrConfig)) {
            existingMapping = lookup[nodeNameOrConfig] ??= createLookup();
            if (existingMapping[key] == null) {
                existingMapping[key] = eventsConfig;
            }
            else {
                throwMappingExisted(nodeNameOrConfig, key);
            }
        }
        else {
            for (const nodeName in nodeNameOrConfig) {
                existingMapping = lookup[nodeName] ??= createLookup();
                const newMapping = nodeNameOrConfig[nodeName];
                for (key in newMapping) {
                    if (existingMapping[key] == null) {
                        existingMapping[key] = newMapping[key];
                    }
                    else {
                        throwMappingExisted(nodeName, key);
                    }
                }
            }
        }
    }
    useConfigGlobal(configOrKey, eventsConfig) {
        const lookup = this._globalEvents;
        if (typeof configOrKey === 'object') {
            for (const key in configOrKey) {
                if (lookup[key] == null) {
                    lookup[key] = configOrKey[key];
                }
                else {
                    throwMappingExisted('*', key);
                }
            }
        }
        else {
            if (lookup[configOrKey] == null) {
                lookup[configOrKey] = eventsConfig;
            }
            else {
                throwMappingExisted('*', configOrKey);
            }
        }
    }
    // deepscan-disable-nextline
    getAccessor(obj, key, requestor) {
        if (key in this._globalOverrides || (key in (this._overrides[obj.tagName] ?? kernel.emptyObject))) {
            return this.getObserver(obj, key, requestor);
        }
        switch (key) {
            // class / style / css attribute will be observed using .getObserver() per overrides
            //
            // TODO: there are (many) more situation where we want to default to DataAttributeAccessor
            case 'src':
            case 'href':
            case 'role':
            case 'minLength':
            case 'maxLength':
            case 'placeholder':
            case 'size':
            case 'pattern':
            case 'title':
            case 'popovertarget':
            case 'popovertargetaction':
                /* istanbul-ignore-next */
                {
                    if ((key === 'popovertarget' || key === 'popovertargetaction') && obj.nodeName !== 'INPUT' && obj.nodeName !== 'BUTTON') {
                        // eslint-disable-next-line no-console
                        console.warn(`[aurelia] Popover API are only valid on <input> or <button>. Detected ${key} on <${obj.nodeName.toLowerCase()}>`);
                    }
                }
                // assigning null/undefined to size on input is an error
                // though it may be fine on other elements.
                // todo: make an effort to distinguish properties based on element name
                // https://html.spec.whatwg.org/multipage/dom.html#wai-aria
                return attrAccessor;
            default: {
                const nsProps = nsAttributes[key];
                if (nsProps !== undefined) {
                    return AttributeNSAccessor.forNs(nsProps[1]);
                }
                if (isDataAttribute(obj, key, this.svg)) {
                    return attrAccessor;
                }
                return elementPropertyAccessor;
            }
        }
    }
    overrideAccessor(tagNameOrOverrides, key) {
        let existingTagOverride;
        if (isString(tagNameOrOverrides)) {
            existingTagOverride = this._overrides[tagNameOrOverrides] ??= createLookup();
            existingTagOverride[key] = true;
        }
        else {
            for (const tagName in tagNameOrOverrides) {
                for (const key of tagNameOrOverrides[tagName]) {
                    existingTagOverride = this._overrides[tagName] ??= createLookup();
                    existingTagOverride[key] = true;
                }
            }
        }
    }
    /**
     * For all elements:
     * compose a list of properties,
     * to indicate that an overser should be returned instead of an accessor in `.getAccessor()`
     */
    overrideAccessorGlobal(...keys) {
        for (const key of keys) {
            this._globalOverrides[key] = true;
        }
    }
    getNodeObserverConfig(el, key) {
        return this._events[el.tagName]?.[key] ?? this._globalEvents[key];
    }
    getNodeObserver(el, key, requestor) {
        const eventsConfig = this._events[el.tagName]?.[key] ?? this._globalEvents[key];
        let observer;
        if (eventsConfig != null) {
            observer = new (eventsConfig.type ?? ValueAttributeObserver)(el, key, eventsConfig, requestor, this._locator);
            if (!observer.doNotCache) {
                runtime.getObserverLookup(el)[key] = observer;
            }
            return observer;
        }
        return null;
    }
    getObserver(el, key, requestor) {
        switch (key) {
            case 'class':
                // todo: invalid accessor returned for a get observer call
                //       for now it's a noop observer
                return new ClassAttributeAccessor(el);
            case 'css':
            case 'style':
                // todo: invalid accessor returned for a get observer call
                //       for now it's a noop observer
                return new StyleAttributeAccessor(el);
        }
        const nodeObserver = this.getNodeObserver(el, key, requestor);
        if (nodeObserver != null) {
            return nodeObserver;
        }
        const nsProps = nsAttributes[key];
        if (nsProps !== undefined) {
            // todo: invalid accessor returned for a get observer call
            //       for now it's a noop observer
            return AttributeNSAccessor.forNs(nsProps[1]);
        }
        if (isDataAttribute(el, key, this.svg)) {
            // todo: invalid accessor returned for a get observer call
            //       for now it's a noop observer
            return attrAccessor;
        }
        if (key in el.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this._dirtyChecker.createProperty(el, key);
            }
            // consider:
            // - maybe add a adapter API to handle unknown obj/key combo
            throw createMappedError(652 /* ErrorNames.node_observer_strategy_not_found */, key);
        }
        else {
            // todo: probably still needs to get the property descriptor via getOwnPropertyDescriptor
            // but let's start with simplest scenario
            return new runtime.SetterObserver(el, key);
        }
    }
}
function getCollectionObserver(collection, observerLocator) {
    if (collection instanceof Array) {
        return observerLocator.getArrayObserver(collection);
    }
    if (collection instanceof Map) {
        return observerLocator.getMapObserver(collection);
    }
    if (collection instanceof Set) {
        return observerLocator.getSetObserver(collection);
    }
}
function throwMappingExisted(nodeName, key) {
    throw createMappedError(653 /* ErrorNames.node_observer_mapping_existed */, nodeName, key);
}

function defaultMatcher(a, b) {
    return a === b;
}
class CheckedObserver {
    constructor(obj, 
    // deepscan-disable-next-line
    _key, config, observerLocator) {
        this.type = (atNode | atObserver | atLayout);
        /** @internal */
        this._value = void 0;
        /** @internal */
        this._oldValue = void 0;
        /** @internal */
        this._collectionObserver = void 0;
        /**
         * There' situation when a checked observers is used together with `model.bind` on the checkbox
         *
         * Then this checked box also needs to observe the changes of tht model so that it will be able to referesh the value accordingly
         *
         * @internal
         */
        this._valueObserver = void 0;
        /**
         * Used by mixing defined methods subscribe/unsubscribe
         *
         * @internal
         */
        this._listened = false;
        this._el = obj;
        this.oL = observerLocator;
        this._config = config;
    }
    getValue() {
        return this._value;
    }
    setValue(newValue) {
        const currentValue = this._value;
        if (newValue === currentValue) {
            return;
        }
        this._value = newValue;
        this._oldValue = currentValue;
        this._observe();
        this._synchronizeElement();
        this._flush();
    }
    handleCollectionChange() {
        this._synchronizeElement();
    }
    handleChange(_newValue, _previousValue) {
        this._synchronizeElement();
    }
    /** @internal */
    _synchronizeElement() {
        const currentValue = this._value;
        const obj = this._el;
        const elementValue = hasOwnProperty.call(obj, 'model') ? obj.model : obj.value;
        const isRadio = obj.type === 'radio';
        const matcher = obj.matcher !== void 0 ? obj.matcher : defaultMatcher;
        if (isRadio) {
            obj.checked = !!matcher(currentValue, elementValue);
        }
        else if (currentValue === true) {
            obj.checked = true;
        }
        else {
            let hasMatch = false;
            if (isArray(currentValue)) {
                hasMatch = currentValue.findIndex(item => !!matcher(item, elementValue)) !== -1;
            }
            else if (currentValue instanceof Set) {
                for (const v of currentValue) {
                    if (matcher(v, elementValue)) {
                        hasMatch = true;
                        break;
                    }
                }
            }
            else if (currentValue instanceof Map) {
                for (const pair of currentValue) {
                    const existingItem = pair[0];
                    const $isChecked = pair[1];
                    // a potential complain, when only `true` is supported
                    // but it's consistent with array
                    if (matcher(existingItem, elementValue) && $isChecked === true) {
                        hasMatch = true;
                        break;
                    }
                }
            }
            obj.checked = hasMatch;
        }
    }
    handleEvent() {
        let currentValue = this._oldValue = this._value;
        const obj = this._el;
        const elementValue = hasOwnProperty.call(obj, 'model') ? obj.model : obj.value;
        const isChecked = obj.checked;
        const matcher = obj.matcher !== void 0 ? obj.matcher : defaultMatcher;
        if (obj.type === 'checkbox') {
            if (isArray(currentValue)) {
                // Array binding steps on a change event:
                // 1. find corresponding item INDEX in the Set based on current model/value and matcher
                // 2. is the checkbox checked?
                //    2.1. Yes: is the corresponding item in the Array (index === -1)?
                //        2.1.1 No: push the current model/value to the Array
                //    2.2. No: is the corresponding item in the Array (index !== -1)?
                //        2.2.1: Yes: remove the corresponding item
                // =================================================
                const index = currentValue.findIndex(item => !!matcher(item, elementValue));
                // if the checkbox is checkde, and there's no matching value in the existing array
                // add the checkbox model/value to the array
                if (isChecked && index === -1) {
                    currentValue.push(elementValue);
                }
                else if (!isChecked && index !== -1) {
                    // if the checkbox is not checked, and found a matching item in the array
                    // based on the checkbox model/value
                    // remove the existing item
                    currentValue.splice(index, 1);
                }
                // when existing currentValue is an array,
                // do not invoke callback as only the array obj has changed
                return;
            }
            else if (currentValue instanceof Set) {
                // Set binding steps on a change event:
                // 1. find corresponding item in the Set based on current model/value and matcher
                // 2. is the checkbox checked?
                //    2.1. Yes: is the corresponding item in the Set?
                //        2.1.1 No: add the current model/value to the Set
                //    2.2. No: is the corresponding item in the Set?
                //        2.2.1: Yes: remove the corresponding item
                // =================================================
                // 1. find corresponding item
                const unset = {};
                let existingItem = unset;
                for (const value of currentValue) {
                    if (matcher(value, elementValue) === true) {
                        existingItem = value;
                        break;
                    }
                }
                // 2.1. Checkbox is checked, is the corresponding item in the Set?
                //
                // if checkbox is checked and there's no value in the existing Set
                // add the checkbox model/value to the Set
                if (isChecked && existingItem === unset) {
                    // 2.1.1. add the current model/value to the Set
                    currentValue.add(elementValue);
                }
                else if (!isChecked && existingItem !== unset) {
                    // 2.2.1 Checkbox is unchecked, corresponding is in the Set
                    //
                    // if checkbox is not checked, and found a matching item in the Set
                    // based on the checkbox model/value
                    // remove the existing item
                    currentValue.delete(existingItem);
                }
                // when existing value is a Set,
                // do not invoke callback as only the Set has been mutated
                return;
            }
            else if (currentValue instanceof Map) {
                // Map binding steps on a change event
                // 1. find corresponding item in the Map based on current model/value and matcher
                // 2. Set the value of the corresponding item in the Map based on checked state of the checkbox
                // =================================================
                // 1. find the corresponding item
                let existingItem;
                for (const pair of currentValue) {
                    const currItem = pair[0];
                    if (matcher(currItem, elementValue) === true) {
                        existingItem = currItem;
                        break;
                    }
                }
                // 2. set the value of the corresponding item in the map
                // if checkbox is checked and there's no value in the existing Map
                // add the checkbox model/value to the Map as key,
                // and value will be checked state of the checkbox
                currentValue.set(existingItem, isChecked);
                // when existing value is a Map,
                // do not invoke callback as only the Map has been mutated
                return;
            }
            currentValue = isChecked;
        }
        else if (isChecked) {
            currentValue = elementValue;
        }
        else {
            // if it's a radio and it has been unchecked
            // do nothing, as the radio that was checked will fire change event and it will be handle there
            // a radio cannot be unchecked by user
            return;
        }
        this._value = currentValue;
        this._flush();
    }
    /**
     * Used by mixing defined methods subscribe
     *
     * @internal
     */
    _start() {
        this._observe();
    }
    /**
     * Used by mixing defined methods unsubscribe
     *
     * @internal
     */
    _stop() {
        this._collectionObserver?.unsubscribe(this);
        this._valueObserver?.unsubscribe(this);
        this._collectionObserver = this._valueObserver = void 0;
    }
    /** @internal */
    _flush() {
        oV = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV);
    }
    /** @internal */
    _observe() {
        const obj = this._el;
        (this._valueObserver ??= obj.$observers?.model ?? obj.$observers?.value)?.subscribe(this);
        this._collectionObserver?.unsubscribe(this);
        this._collectionObserver = void 0;
        if (obj.type === 'checkbox') {
            (this._collectionObserver = getCollectionObserver(this._value, this.oL))?.subscribe(this);
        }
    }
}
mixinNodeObserverUseConfig(CheckedObserver);
runtime.subscriberCollection(CheckedObserver);
// a reusable variable for `.flush()` methods of observers
// so that there doesn't need to create an env record for every call
let oV = void 0;

class AttrBindingBehavior {
    bind(_scope, binding) {
        if (!(binding instanceof PropertyBinding)) {
            throw createMappedError(9994 /* ErrorNames.attr_behavior_invalid_binding */, binding);
        }
        binding.useTargetObserver(attrAccessor);
    }
}
bindingBehavior('attr')(AttrBindingBehavior);

class SelfBindingBehavior {
    bind(_scope, binding) {
        if (!(binding instanceof ListenerBinding)) {
            throw createMappedError(801 /* ErrorNames.self_behavior_invalid_usage */);
        }
        binding.self = true;
    }
    unbind(_scope, binding) {
        binding.self = false;
    }
}
bindingBehavior('self')(SelfBindingBehavior);

class UpdateTriggerBindingBehavior {
    constructor() {
        /** @internal */ this._observerLocator = kernel.resolve(runtime.IObserverLocator);
        /** @internal */ this._nodeObserverLocator = kernel.resolve(runtime.INodeObserverLocator);
    }
    bind(_scope, binding, ...events) {
        if (!(this._nodeObserverLocator instanceof NodeObserverLocator)) {
            throw createMappedError(9993 /* ErrorNames.update_trigger_behavior_not_supported */);
        }
        if (events.length === 0) {
            throw createMappedError(802 /* ErrorNames.update_trigger_behavior_no_triggers */);
        }
        if (!(binding instanceof PropertyBinding) || !(binding.mode & fromView)) {
            throw createMappedError(803 /* ErrorNames.update_trigger_invalid_usage */);
        }
        // ensure the binding's target observer has been set.
        const targetConfig = this._nodeObserverLocator.getNodeObserverConfig(binding.target, binding.targetProperty);
        // todo(bigopon): potentially updateTrigger can be used to teach Aurelia adhoc listening capability
        //                since event names are the only thing needed
        if (targetConfig == null) {
            throw createMappedError(9992 /* ErrorNames.update_trigger_behavior_node_property_not_observable */, binding);
        }
        const targetObserver = this._nodeObserverLocator.getNodeObserver(binding.target, binding.targetProperty, this._observerLocator); // the check on targetConfig ensures it's not null, save execessive check her
        targetObserver.useConfig({ readonly: targetConfig.readonly, default: targetConfig.default, events });
        binding.useTargetObserver(targetObserver);
    }
}
bindingBehavior('updateTrigger')(UpdateTriggerBindingBehavior);

class If {
    constructor() {
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        /**
         * `false` to always dispose the existing `view` whenever the value of if changes to false
         */
        this.cache = true;
        this.pending = void 0;
        /** @internal */ this._wantsDeactivate = false;
        /** @internal */ this._swapId = 0;
        /** @internal */ this._ifFactory = kernel.resolve(IViewFactory);
        /** @internal */ this._location = kernel.resolve(IRenderLocation);
    }
    attaching(_initiator, _parent) {
        return this._swap(this.value);
    }
    detaching(initiator, _parent) {
        this._wantsDeactivate = true;
        return kernel.onResolve(this.pending, () => {
            this._wantsDeactivate = false;
            this.pending = void 0;
            // Promise return values from user VM hooks are awaited by the initiator
            void this.view?.deactivate(initiator, this.$controller);
        });
    }
    valueChanged(newValue, oldValue) {
        if (!this.$controller.isActive)
            return;
        newValue = !!newValue;
        oldValue = !!oldValue;
        if (newValue !== oldValue)
            return this._swap(newValue);
    }
    _swap(value) {
        const currView = this.view;
        const ctrl = this.$controller;
        const swapId = this._swapId++;
        /**
         * returns true when
         * 1. entering deactivation of the [if] itself
         * 2. new swap has started since this change
         */
        const isCurrent = () => !this._wantsDeactivate && this._swapId === swapId + 1;
        let view;
        return kernel.onResolve(this.pending, () => this.pending = kernel.onResolve(currView?.deactivate(currView, ctrl), () => {
            if (!isCurrent()) {
                return;
            }
            // falsy -> truthy
            if (value) {
                view = (this.view = this.ifView = this.cache && this.ifView != null
                    ? this.ifView
                    : this._ifFactory.create());
            }
            else {
                // truthy -> falsy
                view = (this.view = this.elseView = this.cache && this.elseView != null
                    ? this.elseView
                    : this.elseFactory?.create());
            }
            // if the value is falsy
            // and there's no [else], `view` will be null
            if (view == null) {
                return;
            }
            // todo: location should be based on either the [if]/[else] attribute
            //       instead of always of the [if]
            view.setLocation(this._location);
            return kernel.onResolve(view.activate(view, ctrl, ctrl.scope), () => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            });
        }));
    }
    dispose() {
        this.ifView?.dispose();
        this.elseView?.dispose();
        this.ifView
            = this.elseView
                = this.view
                    = void 0;
    }
    accept(visitor) {
        if (this.view?.accept(visitor) === true) {
            return true;
        }
    }
}
__decorate([
    bindable
], If.prototype, "value", void 0);
__decorate([
    bindable({
        set: v => v === '' || !!v && v !== 'false'
    })
], If.prototype, "cache", void 0);
templateController('if')(If);
class Else {
    constructor() {
        /** @internal */ this._factory = kernel.resolve(IViewFactory);
    }
    link(controller, _childController, _target, _instruction) {
        const children = controller.children;
        const ifBehavior = children[children.length - 1];
        if (ifBehavior instanceof If) {
            ifBehavior.elseFactory = this._factory;
        }
        else if (ifBehavior.viewModel instanceof If) {
            ifBehavior.viewModel.elseFactory = this._factory;
        }
        else {
            throw createMappedError(810 /* ErrorNames.else_without_if */);
        }
    }
}
templateController({ name: 'else' })(Else);

function dispose(disposable) {
    disposable.dispose();
}
const wrappedExprs = [
    'BindingBehavior',
    'ValueConverter',
];
class Repeat {
    constructor(instruction, parser, location, parent, factory) {
        this.views = [];
        this._oldViews = [];
        this.key = null;
        /** @internal */ this._keyMap = new Map();
        /** @internal */ this._scopeMap = new Map();
        /** @internal */ this._observer = void 0;
        /** @internal */ this._observingInnerItems = false;
        /** @internal */ this._reevaluating = false;
        /** @internal */ this._innerItemsExpression = null;
        /** @internal */ this._normalizedItems = void 0;
        /** @internal */ this._hasDestructuredLocal = false;
        const keyProp = instruction.props[0].props[0];
        if (keyProp !== void 0) {
            const { to, value, command } = keyProp;
            if (to === 'key') {
                if (command === null) {
                    this.key = value;
                }
                else if (command === 'bind') {
                    this.key = parser.parse(value, etIsProperty);
                }
                else {
                    throw createMappedError(775 /* ErrorNames.repeat_invalid_key_binding_command */, command);
                }
            }
            else {
                throw createMappedError(776 /* ErrorNames.repeat_extraneous_binding */, to);
            }
        }
        this._location = location;
        this._parent = parent;
        this._factory = factory;
    }
    binding(_initiator, _parent) {
        const bindings = this._parent.bindings;
        const ii = bindings.length;
        let binding = (void 0);
        let forOf;
        let i = 0;
        for (; ii > i; ++i) {
            binding = bindings[i];
            if (binding.target === this && binding.targetProperty === 'items') {
                forOf = this.forOf = binding.ast;
                this._forOfBinding = binding;
                let expression = forOf.iterable;
                while (expression != null && wrappedExprs.includes(expression.$kind)) {
                    expression = expression.expression;
                    this._observingInnerItems = true;
                }
                this._innerItemsExpression = expression;
                break;
            }
        }
        this._refreshCollectionObserver();
        const dec = forOf.declaration;
        if (!(this._hasDestructuredLocal = dec.$kind === 'ArrayDestructuring' || dec.$kind === 'ObjectDestructuring')) {
            this.local = runtime.astEvaluate(dec, this.$controller.scope, binding, null);
        }
    }
    attaching(initiator, _parent) {
        this._normalizeToArray();
        return this._activateAllViews(initiator);
    }
    detaching(initiator, _parent) {
        this._refreshCollectionObserver();
        return this._deactivateAllViews(initiator);
    }
    unbinding(_initiator, _parent) {
        this._scopeMap.clear();
        this._keyMap.clear();
    }
    // called by SetterObserver
    itemsChanged() {
        if (!this.$controller.isActive) {
            return;
        }
        this._refreshCollectionObserver();
        this._normalizeToArray();
        this._applyIndexMap(this.items, void 0);
    }
    handleCollectionChange(collection, indexMap) {
        const $controller = this.$controller;
        if (!$controller.isActive) {
            return;
        }
        if (this._observingInnerItems) {
            if (this._reevaluating) {
                return;
            }
            this._reevaluating = true;
            this.items = runtime.astEvaluate(this.forOf.iterable, $controller.scope, this._forOfBinding, null);
            this._reevaluating = false;
            return;
        }
        this._normalizeToArray();
        this._applyIndexMap(collection, indexMap);
    }
    /** @internal */
    _applyIndexMap(collection, indexMap) {
        const oldViews = this.views;
        this._oldViews = oldViews.slice();
        const oldLen = oldViews.length;
        const key = this.key;
        const hasKey = key !== null;
        if (hasKey || indexMap === void 0) {
            const local = this.local;
            const newItems = this._normalizedItems;
            const newLen = newItems.length;
            const forOf = this.forOf;
            const dec = forOf.declaration;
            const binding = this._forOfBinding;
            const hasDestructuredLocal = this._hasDestructuredLocal;
            indexMap = runtime.createIndexMap(newLen);
            let i = 0;
            if (oldLen === 0) {
                // Only add new views
                for (; i < newLen; ++i) {
                    indexMap[i] = -2;
                }
            }
            else if (newLen === 0) {
                // Only remove old views
                if (hasDestructuredLocal) {
                    for (i = 0; i < oldLen; ++i) {
                        indexMap.deletedIndices.push(i);
                        indexMap.deletedItems.push(runtime.astEvaluate(dec, oldViews[i].scope, binding, null));
                    }
                }
                else {
                    for (i = 0; i < oldLen; ++i) {
                        indexMap.deletedIndices.push(i);
                        indexMap.deletedItems.push(oldViews[i].scope.bindingContext[local]);
                    }
                }
            }
            else {
                const oldItems = Array(oldLen);
                if (hasDestructuredLocal) {
                    for (i = 0; i < oldLen; ++i) {
                        oldItems[i] = runtime.astEvaluate(dec, oldViews[i].scope, binding, null);
                    }
                }
                else {
                    for (i = 0; i < oldLen; ++i) {
                        oldItems[i] = oldViews[i].scope.bindingContext[local];
                    }
                }
                let oldItem;
                let newItem;
                let oldKey;
                let newKey;
                let j = 0;
                const oldEnd = oldLen - 1;
                const newEnd = newLen - 1;
                const oldIndices = new Map();
                const newIndices = new Map();
                const keyMap = this._keyMap;
                const scopeMap = this._scopeMap;
                const parentScope = this.$controller.scope;
                i = 0;
                // Step 1: narrow down the loop range as much as possible by checking the start and end for key equality
                outer: {
                    // views with same key at start
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        if (hasKey) {
                            oldItem = oldItems[i];
                            newItem = newItems[i];
                            oldKey = getKeyValue(keyMap, key, oldItem, getScope(scopeMap, oldItem, forOf, parentScope, binding, local, hasDestructuredLocal), binding);
                            newKey = getKeyValue(keyMap, key, newItem, getScope(scopeMap, newItem, forOf, parentScope, binding, local, hasDestructuredLocal), binding);
                        }
                        else {
                            oldItem = oldKey = ensureUnique(oldItems[i], i);
                            newItem = newKey = ensureUnique(newItems[i], i);
                        }
                        if (oldKey !== newKey) {
                            keyMap.set(oldItem, oldKey);
                            keyMap.set(newItem, newKey);
                            break;
                        }
                        ++i;
                        if (i > oldEnd || i > newEnd) {
                            break outer;
                        }
                    }
                    // TODO(perf): might be able to remove this condition with some offset magic?
                    if (oldEnd !== newEnd) {
                        break outer;
                    }
                    // views with same key at end
                    j = newEnd;
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        if (hasKey) {
                            oldItem = oldItems[j];
                            newItem = newItems[j];
                            oldKey = getKeyValue(keyMap, key, oldItem, getScope(scopeMap, oldItem, forOf, parentScope, binding, local, hasDestructuredLocal), binding);
                            newKey = getKeyValue(keyMap, key, newItem, getScope(scopeMap, newItem, forOf, parentScope, binding, local, hasDestructuredLocal), binding);
                        }
                        else {
                            oldItem = oldKey = ensureUnique(oldItems[i], i);
                            newItem = newKey = ensureUnique(newItems[i], i);
                        }
                        if (oldKey !== newKey) {
                            keyMap.set(oldItem, oldKey);
                            keyMap.set(newItem, newKey);
                            break;
                        }
                        --j;
                        if (i > j) {
                            break outer;
                        }
                    }
                }
                // Step 2: map keys to indices and adjust the indexMap
                const oldStart = i;
                const newStart = i;
                for (i = newStart; i <= newEnd; ++i) {
                    if (keyMap.has(newItem = hasKey ? newItems[i] : ensureUnique(newItems[i], i))) {
                        newKey = keyMap.get(newItem);
                    }
                    else {
                        newKey = hasKey
                            ? getKeyValue(keyMap, key, newItem, getScope(scopeMap, newItem, forOf, parentScope, binding, local, hasDestructuredLocal), binding)
                            : newItem;
                        keyMap.set(newItem, newKey);
                    }
                    newIndices.set(newKey, i);
                }
                for (i = oldStart; i <= oldEnd; ++i) {
                    if (keyMap.has(oldItem = hasKey ? oldItems[i] : ensureUnique(oldItems[i], i))) {
                        oldKey = keyMap.get(oldItem);
                    }
                    else {
                        oldKey = hasKey
                            ? getKeyValue(keyMap, key, oldItem, oldViews[i].scope, binding)
                            : oldItem;
                    }
                    oldIndices.set(oldKey, i);
                    if (newIndices.has(oldKey)) {
                        indexMap[newIndices.get(oldKey)] = i;
                    }
                    else {
                        indexMap.deletedIndices.push(i);
                        indexMap.deletedItems.push(oldItem);
                    }
                }
                for (i = newStart; i <= newEnd; ++i) {
                    if (!oldIndices.has(keyMap.get(hasKey ? newItems[i] : ensureUnique(newItems[i], i)))) {
                        indexMap[i] = -2;
                    }
                }
                oldIndices.clear();
                newIndices.clear();
            }
        }
        if (indexMap === void 0) {
            const ret = kernel.onResolve(this._deactivateAllViews(null), () => {
                // TODO(fkleuver): add logic to the controller that ensures correct handling of race conditions and add a variety of `if` integration tests
                return this._activateAllViews(null);
            });
            if (isPromise(ret)) {
                ret.catch(rethrow);
            }
        }
        else {
            // first detach+unbind+(remove from array) the deleted view indices
            if (indexMap.deletedIndices.length > 0) {
                const ret = kernel.onResolve(this._deactivateAndRemoveViewsByKey(indexMap), () => {
                    // TODO(fkleuver): add logic to the controller that ensures correct handling of race conditions and add a variety of `if` integration tests
                    return this._createAndActivateAndSortViewsByKey(oldLen, indexMap);
                });
                if (isPromise(ret)) {
                    ret.catch(rethrow);
                }
            }
            else {
                // TODO(fkleuver): add logic to the controller that ensures correct handling of race conditions and add integration tests
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this._createAndActivateAndSortViewsByKey(oldLen, indexMap);
            }
        }
    }
    // todo: subscribe to collection from inner expression
    /** @internal */
    _refreshCollectionObserver() {
        const scope = this.$controller.scope;
        let innerItems = this._innerItems;
        let observingInnerItems = this._observingInnerItems;
        let newObserver;
        if (observingInnerItems) {
            innerItems = this._innerItems = runtime.astEvaluate(this._innerItemsExpression, scope, this._forOfBinding, null) ?? null;
            observingInnerItems = this._observingInnerItems = !areEqual(this.items, innerItems);
        }
        const oldObserver = this._observer;
        if (this.$controller.isActive) {
            newObserver = this._observer = runtime.getCollectionObserver(observingInnerItems ? innerItems : this.items);
            if (oldObserver !== newObserver) {
                oldObserver?.unsubscribe(this);
                newObserver?.subscribe(this);
            }
        }
        else {
            oldObserver?.unsubscribe(this);
            this._observer = undefined;
        }
    }
    /** @internal */
    _normalizeToArray() {
        const { items } = this;
        if (isArray(items)) {
            this._normalizedItems = items;
            return;
        }
        const normalizedItems = [];
        iterate(items, (item, index) => {
            normalizedItems[index] = item;
        });
        this._normalizedItems = normalizedItems;
    }
    /** @internal */
    _activateAllViews(initiator) {
        let promises = void 0;
        let ret;
        let view;
        let viewScope;
        const { $controller, _factory, local, _location, items, _scopeMap, _forOfBinding, forOf, _hasDestructuredLocal } = this;
        const parentScope = $controller.scope;
        const newLen = getCount(items);
        const views = this.views = Array(newLen);
        iterate(items, (item, i) => {
            view = views[i] = _factory.create().setLocation(_location);
            view.nodes.unlink();
            viewScope = getScope(_scopeMap, item, forOf, parentScope, _forOfBinding, local, _hasDestructuredLocal);
            setContextualProperties(viewScope.overrideContext, i, newLen);
            ret = view.activate(initiator ?? view, $controller, viewScope);
            if (isPromise(ret)) {
                (promises ?? (promises = [])).push(ret);
            }
        });
        if (promises !== void 0) {
            return promises.length === 1
                ? promises[0]
                : Promise.all(promises);
        }
    }
    /** @internal */
    _deactivateAllViews(initiator) {
        let promises = void 0;
        let ret;
        let view;
        let i = 0;
        const { views, $controller } = this;
        const ii = views.length;
        for (; ii > i; ++i) {
            view = views[i];
            view.release();
            ret = view.deactivate(initiator ?? view, $controller);
            if (isPromise(ret)) {
                (promises ?? (promises = [])).push(ret);
            }
        }
        if (promises !== void 0) {
            return (promises.length === 1
                ? promises[0]
                : Promise.all(promises));
        }
    }
    /** @internal */
    _deactivateAndRemoveViewsByKey(indexMap) {
        let promises = void 0;
        let ret;
        let view;
        const { $controller, views } = this;
        const deleted = indexMap.deletedIndices.slice().sort(compareNumber);
        const deletedLen = deleted.length;
        let i = 0;
        for (; deletedLen > i; ++i) {
            view = views[deleted[i]];
            view.release();
            ret = view.deactivate(view, $controller);
            if (isPromise(ret)) {
                (promises ?? (promises = [])).push(ret);
            }
        }
        i = 0;
        for (; deletedLen > i; ++i) {
            views.splice(deleted[i] - i, 1);
        }
        if (promises !== void 0) {
            return promises.length === 1
                ? promises[0]
                : Promise.all(promises);
        }
    }
    /** @internal */
    _createAndActivateAndSortViewsByKey(oldLength, indexMap) {
        let promises = void 0;
        let ret;
        let view;
        let viewScope;
        let i = 0;
        const { $controller, _factory, local, _normalizedItems, _location, views, _hasDestructuredLocal, _forOfBinding, _scopeMap, _oldViews, forOf } = this;
        const mapLen = indexMap.length;
        for (; mapLen > i; ++i) {
            if (indexMap[i] === -2) {
                view = _factory.create();
                views.splice(i, 0, view);
            }
        }
        if (views.length !== mapLen) {
            throw createMappedError(814 /* ErrorNames.repeat_mismatch_length */, [views.length, mapLen]);
        }
        const parentScope = $controller.scope;
        const newLen = indexMap.length;
        let source = 0;
        i = 0;
        for (; i < indexMap.length; ++i) {
            if ((source = indexMap[i]) !== -2) {
                views[i] = _oldViews[source];
            }
        }
        // this algorithm retrieves the indices of the longest increasing subsequence of items in the repeater
        // the items on those indices are not moved; this minimizes the number of DOM operations that need to be performed
        const seq = longestIncreasingSubsequence(indexMap);
        const seqLen = seq.length;
        const dec = forOf.declaration;
        let next;
        let j = seqLen - 1;
        i = newLen - 1;
        for (; i >= 0; --i) {
            view = views[i];
            next = views[i + 1];
            view.nodes.link(next?.nodes ?? _location);
            if (indexMap[i] === -2) {
                viewScope = getScope(_scopeMap, _normalizedItems[i], forOf, parentScope, _forOfBinding, local, _hasDestructuredLocal);
                setContextualProperties(viewScope.overrideContext, i, newLen);
                view.setLocation(_location);
                ret = view.activate(view, $controller, viewScope);
                if (isPromise(ret)) {
                    (promises ?? (promises = [])).push(ret);
                }
            }
            else if (j < 0 || seqLen === 1 || i !== seq[j]) {
                if (_hasDestructuredLocal) {
                    runtime.astAssign(dec, view.scope, _forOfBinding, _normalizedItems[i]);
                }
                else {
                    view.scope.bindingContext[local] = _normalizedItems[i];
                }
                setContextualProperties(view.scope.overrideContext, i, newLen);
                view.nodes.insertBefore(view.location);
            }
            else {
                if (_hasDestructuredLocal) {
                    runtime.astAssign(dec, view.scope, _forOfBinding, _normalizedItems[i]);
                }
                else {
                    view.scope.bindingContext[local] = _normalizedItems[i];
                }
                if (oldLength !== newLen) {
                    setContextualProperties(view.scope.overrideContext, i, newLen);
                }
                --j;
            }
        }
        if (promises !== void 0) {
            return promises.length === 1
                ? promises[0]
                : Promise.all(promises);
        }
    }
    dispose() {
        this.views.forEach(dispose);
        this.views = (void 0);
    }
    accept(visitor) {
        const { views } = this;
        if (views !== void 0) {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                if (views[i].accept(visitor) === true) {
                    return true;
                }
            }
        }
    }
}
/** @internal */ Repeat.inject = [IInstruction, runtime.IExpressionParser, IRenderLocation, IController, IViewFactory];
__decorate([
    bindable
], Repeat.prototype, "items", void 0);
templateController('repeat')(Repeat);
let maxLen = 16;
let prevIndices = new Int32Array(maxLen);
let tailIndices = new Int32Array(maxLen);
// Based on inferno's lis_algorithm @ https://github.com/infernojs/inferno/blob/master/packages/inferno/src/DOM/patching.ts#L732
// with some tweaks to make it just a bit faster + account for IndexMap (and some names changes for readability)
/** @internal */
function longestIncreasingSubsequence(indexMap) {
    const len = indexMap.length;
    if (len > maxLen) {
        maxLen = len;
        prevIndices = new Int32Array(len);
        tailIndices = new Int32Array(len);
    }
    let cursor = 0;
    let cur = 0;
    let prev = 0;
    let i = 0;
    let j = 0;
    let low = 0;
    let high = 0;
    let mid = 0;
    for (; i < len; i++) {
        cur = indexMap[i];
        if (cur !== -2) {
            j = prevIndices[cursor];
            prev = indexMap[j];
            if (prev !== -2 && prev < cur) {
                tailIndices[i] = j;
                prevIndices[++cursor] = i;
                continue;
            }
            low = 0;
            high = cursor;
            while (low < high) {
                mid = (low + high) >> 1;
                prev = indexMap[prevIndices[mid]];
                if (prev !== -2 && prev < cur) {
                    low = mid + 1;
                }
                else {
                    high = mid;
                }
            }
            prev = indexMap[prevIndices[low]];
            if (cur < prev || prev === -2) {
                if (low > 0) {
                    tailIndices[i] = prevIndices[low - 1];
                }
                prevIndices[low] = i;
            }
        }
    }
    i = ++cursor;
    const result = new Int32Array(i);
    cur = prevIndices[cursor - 1];
    while (cursor-- > 0) {
        result[cursor] = cur;
        cur = tailIndices[cur];
    }
    while (i-- > 0)
        prevIndices[i] = 0;
    return result;
}
const setContextualProperties = (oc, index, length) => {
    const isFirst = index === 0;
    const isLast = index === length - 1;
    const isEven = index % 2 === 0;
    oc.$index = index;
    oc.$first = isFirst;
    oc.$last = isLast;
    oc.$middle = !isFirst && !isLast;
    oc.$even = isEven;
    oc.$odd = !isEven;
    oc.$length = length;
};
const toStringTag = baseObjectPrototype.toString;
const getCount = (result) => {
    switch (toStringTag.call(result)) {
        case '[object Array]': return result.length;
        case '[object Map]': return result.size;
        case '[object Set]': return result.size;
        case '[object Number]': return result;
        case '[object Null]': return 0;
        case '[object Undefined]': return 0;
        default: throw createMappedError(778 /* ErrorNames.repeat_non_countable */, result);
    }
};
const iterate = (result, func) => {
    switch (toStringTag.call(result)) {
        case '[object Array]': return $array(result, func);
        case '[object Map]': return $map(result, func);
        case '[object Set]': return $set(result, func);
        case '[object Number]': return $number(result, func);
        case '[object Null]': return;
        case '[object Undefined]': return;
        // todo: remove this count method
        default: createMappedError(777 /* ErrorNames.repeat_non_iterable */, result);
    }
};
const $array = (result, func) => {
    const ii = result.length;
    let i = 0;
    for (; i < ii; ++i) {
        func(result[i], i, result);
    }
};
const $map = (result, func) => {
    let i = -0;
    let entry;
    for (entry of result.entries()) {
        func(entry, i++, result);
    }
};
const $set = (result, func) => {
    let i = 0;
    let key;
    for (key of result.keys()) {
        func(key, i++, result);
    }
};
const $number = (result, func) => {
    let i = 0;
    for (; i < result; ++i) {
        func(i, i, result);
    }
};
const getKeyValue = (keyMap, key, item, scope, binding) => {
    let value = keyMap.get(item);
    if (value === void 0) {
        if (typeof key === 'string') {
            value = item[key];
        }
        else {
            value = runtime.astEvaluate(key, scope, binding, null);
        }
        keyMap.set(item, value);
    }
    return value;
};
const getScope = (scopeMap, item, forOf, parentScope, binding, local, hasDestructuredLocal) => {
    let scope = scopeMap.get(item);
    if (scope === void 0) {
        if (hasDestructuredLocal) {
            runtime.astAssign(forOf.declaration, scope = runtime.Scope.fromParent(parentScope, new runtime.BindingContext()), binding, item);
        }
        else {
            scope = runtime.Scope.fromParent(parentScope, new runtime.BindingContext(local, item));
        }
        scopeMap.set(item, scope);
    }
    return scope;
};
const ensureUnique = (item, index) => {
    const type = typeof item;
    switch (type) {
        case 'object':
            if (item !== null)
                return item;
        // falls through
        case 'string':
        case 'number':
        case 'bigint':
        case 'undefined':
        case 'boolean':
            return `${index}${type}${item}`;
        default:
            return item;
    }
};
const compareNumber = (a, b) => a - b;

class With {
    constructor() {
        this.view = kernel.resolve(IViewFactory).create().setLocation(kernel.resolve(IRenderLocation));
    }
    valueChanged(newValue, _oldValue) {
        const $controller = this.$controller;
        const bindings = this.view.bindings;
        let scope;
        let i = 0, ii = 0;
        if ($controller.isActive && bindings != null) {
            scope = runtime.Scope.fromParent($controller.scope, newValue === void 0 ? {} : newValue);
            for (ii = bindings.length; ii > i; ++i) {
                bindings[i].bind(scope);
            }
        }
    }
    attaching(initiator, _parent) {
        const { $controller, value } = this;
        const scope = runtime.Scope.fromParent($controller.scope, value === void 0 ? {} : value);
        return this.view.activate(initiator, $controller, scope);
    }
    detaching(initiator, _parent) {
        return this.view.deactivate(initiator, this.$controller);
    }
    dispose() {
        this.view.dispose();
        this.view = (void 0);
    }
    accept(visitor) {
        if (this.view?.accept(visitor) === true) {
            return true;
        }
    }
}
__decorate([
    bindable
], With.prototype, "value", void 0);
templateController('with')(With);

exports.Switch = class Switch {
    constructor() {
        /** @internal */
        this.cases = [];
        this.activeCases = [];
        /**
         * This is kept around here so that changes can be awaited from the tests.
         * This needs to be removed after the scheduler is ready to handle/queue the floating promises.
         */
        this.promise = void 0;
        /** @internal */ this._factory = kernel.resolve(IViewFactory);
        /** @internal */ this._location = kernel.resolve(IRenderLocation);
    }
    link(_controller, _childController, _target, _instruction) {
        this.view = this._factory.create(this.$controller).setLocation(this._location);
    }
    attaching(initiator, _parent) {
        const view = this.view;
        const $controller = this.$controller;
        this.queue(() => view.activate(initiator, $controller, $controller.scope));
        this.queue(() => this.swap(initiator, this.value));
        return this.promise;
    }
    detaching(initiator, _parent) {
        this.queue(() => {
            const view = this.view;
            return view.deactivate(initiator, this.$controller);
        });
        return this.promise;
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
    valueChanged(_newValue, _oldValue) {
        if (!this.$controller.isActive) {
            return;
        }
        this.queue(() => this.swap(null, this.value));
    }
    caseChanged($case) {
        this.queue(() => this._handleCaseChange($case));
    }
    /** @internal */
    _handleCaseChange($case) {
        const isMatch = $case.isMatch(this.value);
        const activeCases = this.activeCases;
        const numActiveCases = activeCases.length;
        // Early termination #1
        if (!isMatch) {
            /** The previous match started with this; thus clear. */
            if (numActiveCases > 0 && activeCases[0].id === $case.id) {
                return this._clearActiveCases(null);
            }
            /**
             * There are 2 different scenarios here:
             * 1. $case in activeCases: Indicates by-product of fallthrough. The starting case still satisfies. Return.
             * 2. $case not in activeCases: It was previously not active, and currently also not a match. Return.
             */
            return;
        }
        // Early termination #2
        if (numActiveCases > 0 && activeCases[0].id < $case.id) {
            // Even if this case now a match, the previous case still wins by as that has lower ordinal.
            return;
        }
        // compute the new active cases
        const newActiveCases = [];
        let fallThrough = $case.fallThrough;
        if (!fallThrough) {
            newActiveCases.push($case);
        }
        else {
            const cases = this.cases;
            const idx = cases.indexOf($case);
            for (let i = idx, ii = cases.length; i < ii && fallThrough; i++) {
                const c = cases[i];
                newActiveCases.push(c);
                fallThrough = c.fallThrough;
            }
        }
        return kernel.onResolve(this._clearActiveCases(null, newActiveCases), () => {
            this.activeCases = newActiveCases;
            return this._activateCases(null);
        });
    }
    swap(initiator, value) {
        const newActiveCases = [];
        let fallThrough = false;
        for (const $case of this.cases) {
            if (fallThrough || $case.isMatch(value)) {
                newActiveCases.push($case);
                fallThrough = $case.fallThrough;
            }
            if (newActiveCases.length > 0 && !fallThrough) {
                break;
            }
        }
        const defaultCase = this.defaultCase;
        if (newActiveCases.length === 0 && defaultCase !== void 0) {
            newActiveCases.push(defaultCase);
        }
        return kernel.onResolve(this.activeCases.length > 0
            ? this._clearActiveCases(initiator, newActiveCases)
            : void 0, () => {
            this.activeCases = newActiveCases;
            if (newActiveCases.length === 0) {
                return;
            }
            return this._activateCases(initiator);
        });
    }
    /** @internal */
    _activateCases(initiator) {
        const controller = this.$controller;
        if (!controller.isActive) {
            return;
        }
        const cases = this.activeCases;
        const length = cases.length;
        if (length === 0) {
            return;
        }
        const scope = controller.scope;
        // most common case
        if (length === 1) {
            return cases[0].activate(initiator, scope);
        }
        return kernel.onResolveAll(...cases.map(($case) => $case.activate(initiator, scope)));
    }
    /** @internal */
    _clearActiveCases(initiator, newActiveCases = []) {
        const cases = this.activeCases;
        const numCases = cases.length;
        if (numCases === 0) {
            return;
        }
        if (numCases === 1) {
            const firstCase = cases[0];
            if (!newActiveCases.includes(firstCase)) {
                cases.length = 0;
                return firstCase.deactivate(initiator);
            }
            return;
        }
        return kernel.onResolve(kernel.onResolveAll(...cases.reduce((acc, $case) => {
            if (!newActiveCases.includes($case)) {
                acc.push($case.deactivate(initiator));
            }
            return acc;
        }, [])), () => {
            cases.length = 0;
        });
    }
    queue(action) {
        const previousPromise = this.promise;
        let promise = void 0;
        promise = this.promise = kernel.onResolve(kernel.onResolve(previousPromise, action), () => {
            if (this.promise === promise) {
                this.promise = void 0;
            }
        });
    }
    accept(visitor) {
        if (this.$controller.accept(visitor) === true) {
            return true;
        }
        if (this.activeCases.some(x => x.accept(visitor))) {
            return true;
        }
    }
};
__decorate([
    bindable
], exports.Switch.prototype, "value", void 0);
exports.Switch = __decorate([
    templateController('switch')
], exports.Switch);
let caseId = 0;
exports.Case = class Case {
    constructor() {
        /** @internal */ this.id = ++caseId;
        this.fallThrough = false;
        this.view = void 0;
        /** @internal */ this._factory = kernel.resolve(IViewFactory);
        /** @internal */ this._locator = kernel.resolve(runtime.IObserverLocator);
        /** @internal */ this._location = kernel.resolve(IRenderLocation);
        /** @internal */ this._logger = kernel.resolve(kernel.ILogger).scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(controller, _childController, _target, _instruction) {
        const switchController = controller.parent;
        const $switch = switchController?.viewModel;
        if ($switch instanceof exports.Switch) {
            this.$switch = $switch;
            this.linkToSwitch($switch);
        }
        else {
            throw createMappedError(815 /* ErrorNames.switch_invalid_usage */);
        }
    }
    detaching(initiator, _parent) {
        return this.deactivate(initiator);
    }
    isMatch(value) {
        this._logger.debug('isMatch()');
        const $value = this.value;
        if (isArray($value)) {
            if (this._observer === void 0) {
                this._observer = this._observeCollection($value);
            }
            return $value.includes(value);
        }
        return $value === value;
    }
    valueChanged(newValue, _oldValue) {
        if (isArray(newValue)) {
            this._observer?.unsubscribe(this);
            this._observer = this._observeCollection(newValue);
        }
        else if (this._observer !== void 0) {
            this._observer.unsubscribe(this);
        }
        this.$switch.caseChanged(this);
    }
    handleCollectionChange() {
        this.$switch.caseChanged(this);
    }
    activate(initiator, scope) {
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(initiator ?? view, this.$controller, scope);
    }
    deactivate(initiator) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(initiator ?? view, this.$controller);
    }
    dispose() {
        this._observer?.unsubscribe(this);
        this.view?.dispose();
        this.view = (void 0);
    }
    linkToSwitch(auSwitch) {
        auSwitch.cases.push(this);
    }
    /** @internal */
    _observeCollection($value) {
        const observer = this._locator.getArrayObserver($value);
        observer.subscribe(this);
        return observer;
    }
    accept(visitor) {
        if (this.$controller.accept(visitor) === true) {
            return true;
        }
        return this.view?.accept(visitor);
    }
};
__decorate([
    bindable
], exports.Case.prototype, "value", void 0);
__decorate([
    bindable({
        set: v => {
            switch (v) {
                case 'true': return true;
                case 'false': return false;
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                default: return !!v;
            }
        },
        mode: oneTime
    })
], exports.Case.prototype, "fallThrough", void 0);
exports.Case = __decorate([
    templateController('case')
], exports.Case);
exports.DefaultCase = class DefaultCase extends exports.Case {
    linkToSwitch($switch) {
        if ($switch.defaultCase !== void 0) {
            throw createMappedError(816 /* ErrorNames.switch_no_multiple_default */);
        }
        $switch.defaultCase = this;
    }
};
exports.DefaultCase = __decorate([
    templateController('default-case')
], exports.DefaultCase);

exports.PromiseTemplateController = class PromiseTemplateController {
    constructor() {
        this.preSettledTask = null;
        this.postSettledTask = null;
        /** @internal */ this._factory = kernel.resolve(IViewFactory);
        /** @internal */ this._location = kernel.resolve(IRenderLocation);
        /** @internal */ this._platform = kernel.resolve(IPlatform);
        /** @internal */ this.logger = kernel.resolve(kernel.ILogger).scopeTo('promise.resolve');
    }
    link(_controller, _childController, _target, _instruction) {
        this.view = this._factory.create(this.$controller).setLocation(this._location);
    }
    attaching(initiator, _parent) {
        const view = this.view;
        const $controller = this.$controller;
        return kernel.onResolve(view.activate(initiator, $controller, this.viewScope = runtime.Scope.fromParent($controller.scope, {})), () => this.swap(initiator));
    }
    valueChanged(_newValue, _oldValue) {
        if (!this.$controller.isActive) {
            return;
        }
        this.swap(null);
    }
    swap(initiator) {
        const value = this.value;
        if (!isPromise(value)) {
            {
                /* istanbul ignore next */
                this.logger.warn(`The value '${safeString(value)}' is not a promise. No change will be done.`);
            }
            return;
        }
        const q = this._platform.domWriteQueue;
        const fulfilled = this.fulfilled;
        const rejected = this.rejected;
        const pending = this.pending;
        const s = this.viewScope;
        let preSettlePromise;
        const defaultQueuingOptions = { reusable: false };
        const $swap = () => {
            // Note that the whole thing is not wrapped in a q.queueTask intentionally.
            // Because that would block the app till the actual promise is resolved, which is not the goal anyway.
            void kernel.onResolveAll(
            // At first deactivate the fulfilled and rejected views, as well as activate the pending view.
            // The order of these 3 should not necessarily be sequential (i.e. order-irrelevant).
            preSettlePromise = (this.preSettledTask = q.queueTask(() => {
                return kernel.onResolveAll(fulfilled?.deactivate(initiator), rejected?.deactivate(initiator), pending?.activate(initiator, s));
            }, defaultQueuingOptions)).result.catch((err) => { if (!(err instanceof platform.TaskAbortError))
                throw err; }), value
                .then((data) => {
                if (this.value !== value) {
                    return;
                }
                const fulfill = () => {
                    // Deactivation of pending view and the activation of the fulfilled view should not necessarily be sequential.
                    this.postSettlePromise = (this.postSettledTask = q.queueTask(() => kernel.onResolveAll(pending?.deactivate(initiator), rejected?.deactivate(initiator), fulfilled?.activate(initiator, s, data)), defaultQueuingOptions)).result;
                };
                if (this.preSettledTask.status === tsRunning) {
                    void preSettlePromise.then(fulfill);
                }
                else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }, (err) => {
                if (this.value !== value) {
                    return;
                }
                const reject = () => {
                    // Deactivation of pending view and the activation of the rejected view should also not necessarily be sequential.
                    this.postSettlePromise = (this.postSettledTask = q.queueTask(() => kernel.onResolveAll(pending?.deactivate(initiator), fulfilled?.deactivate(initiator), rejected?.activate(initiator, s, err)), defaultQueuingOptions)).result;
                };
                if (this.preSettledTask.status === tsRunning) {
                    void preSettlePromise.then(reject);
                }
                else {
                    this.preSettledTask.cancel();
                    reject();
                }
            }));
        };
        if (this.postSettledTask?.status === tsRunning) {
            void this.postSettlePromise.then($swap);
        }
        else {
            this.postSettledTask?.cancel();
            $swap();
        }
    }
    detaching(initiator, _parent) {
        this.preSettledTask?.cancel();
        this.postSettledTask?.cancel();
        this.preSettledTask = this.postSettledTask = null;
        return this.view.deactivate(initiator, this.$controller);
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable
], exports.PromiseTemplateController.prototype, "value", void 0);
exports.PromiseTemplateController = __decorate([
    templateController('promise')
], exports.PromiseTemplateController);
exports.PendingTemplateController = class PendingTemplateController {
    constructor() {
        this.view = void 0;
        /** @internal */ this._factory = kernel.resolve(IViewFactory);
        /** @internal */ this._location = kernel.resolve(IRenderLocation);
    }
    link(controller, _childController, _target, _instruction) {
        getPromiseController(controller).pending = this;
    }
    activate(initiator, scope) {
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(view, this.$controller, scope);
    }
    deactivate(_initiator) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(view, this.$controller);
    }
    detaching(initiator) {
        return this.deactivate(initiator);
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable({ mode: toView })
], exports.PendingTemplateController.prototype, "value", void 0);
exports.PendingTemplateController = __decorate([
    templateController(tsPending)
], exports.PendingTemplateController);
exports.FulfilledTemplateController = class FulfilledTemplateController {
    constructor() {
        this.view = void 0;
        /** @internal */ this._factory = kernel.resolve(IViewFactory);
        /** @internal */ this._location = kernel.resolve(IRenderLocation);
    }
    link(controller, _childController, _target, _instruction) {
        getPromiseController(controller).fulfilled = this;
    }
    activate(initiator, scope, resolvedValue) {
        this.value = resolvedValue;
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(view, this.$controller, scope);
    }
    deactivate(_initiator) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(view, this.$controller);
    }
    detaching(initiator, _parent) {
        return this.deactivate(initiator);
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable({ mode: fromView })
], exports.FulfilledTemplateController.prototype, "value", void 0);
exports.FulfilledTemplateController = __decorate([
    templateController('then')
], exports.FulfilledTemplateController);
exports.RejectedTemplateController = class RejectedTemplateController {
    constructor() {
        this.view = void 0;
        /** @internal */ this._factory = kernel.resolve(IViewFactory);
        /** @internal */ this._location = kernel.resolve(IRenderLocation);
    }
    link(controller, _childController, _target, _instruction) {
        getPromiseController(controller).rejected = this;
    }
    activate(initiator, scope, error) {
        this.value = error;
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(view, this.$controller, scope);
    }
    deactivate(_initiator) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(view, this.$controller);
    }
    detaching(initiator, _parent) {
        return this.deactivate(initiator);
    }
    dispose() {
        this.view?.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable({ mode: fromView })
], exports.RejectedTemplateController.prototype, "value", void 0);
exports.RejectedTemplateController = __decorate([
    templateController('catch')
], exports.RejectedTemplateController);
function getPromiseController(controller) {
    const promiseController = controller.parent;
    const $promise = promiseController?.viewModel;
    if ($promise instanceof exports.PromiseTemplateController) {
        return $promise;
    }
    throw createMappedError(813 /* ErrorNames.promise_invalid_usage */);
}
let PromiseAttributePattern = class PromiseAttributePattern {
    'promise.resolve'(name, value) {
        return new AttrSyntax(name, value, 'promise', 'bind');
    }
};
PromiseAttributePattern = __decorate([
    attributePattern({ pattern: 'promise.resolve', symbols: '' })
], PromiseAttributePattern);
let FulfilledAttributePattern = class FulfilledAttributePattern {
    'then'(name, value) {
        return new AttrSyntax(name, value, 'then', 'from-view');
    }
};
FulfilledAttributePattern = __decorate([
    attributePattern({ pattern: 'then', symbols: '' })
], FulfilledAttributePattern);
let RejectedAttributePattern = class RejectedAttributePattern {
    'catch'(name, value) {
        return new AttrSyntax(name, value, 'catch', 'from-view');
    }
};
RejectedAttributePattern = __decorate([
    attributePattern({ pattern: 'catch', symbols: '' })
], RejectedAttributePattern);

/**
 * Focus attribute for element focus binding
 */
class Focus {
    constructor() {
        /**
         * Indicates whether `apply` should be called when `attached` callback is invoked
         *
         * @internal
         */
        this._needsApply = false;
        /** @internal */
        this._element = kernel.resolve(INode);
        /** @internal */
        this._platform = kernel.resolve(IPlatform);
    }
    binding() {
        this.valueChanged();
    }
    /**
     * Invoked everytime the bound value changes.
     *
     * @param newValue - The new value.
     */
    valueChanged() {
        // In theory, we could/should react immediately
        // but focus state of an element cannot be achieved
        // while it's disconnected from the document
        // thus, there neesd to be a check if it's currently connected or not
        // before applying the value to the element
        if (this.$controller.isActive) {
            this._apply();
        }
        else {
            // If the element is not currently connect
            // toggle the flag to add pending work for later
            // in attached lifecycle
            this._needsApply = true;
        }
    }
    /**
     * Invoked when the attribute is attached to the DOM.
     */
    attached() {
        if (this._needsApply) {
            this._needsApply = false;
            this._apply();
        }
        this._element.addEventListener('focus', this);
        this._element.addEventListener('blur', this);
    }
    /**
     * Invoked when the attribute is afterDetachChildren from the DOM.
     */
    detaching() {
        const el = this._element;
        el.removeEventListener('focus', this);
        el.removeEventListener('blur', this);
    }
    /**
     * EventTarget interface handler for better memory usage
     */
    handleEvent(e) {
        // there are only two event listened to
        // if the even is focus, it menans the element is focused
        // only need to switch the value to true
        if (e.type === 'focus') {
            this.value = true;
        }
        else if (!this._isElFocused) {
            // else, it's blur event
            // when a blur event happens, there are two situations
            // 1. the element itself lost the focus
            // 2. window lost the focus
            // To handle both (1) and (2), only need to check if
            // current active element is still the same element of this focus custom attribute
            // If it's not, it's a blur event happened on Window because the browser tab lost focus
            this.value = false;
        }
    }
    /**
     * Focus/blur based on current value
     *
     * @internal
     */
    _apply() {
        const el = this._element;
        const isFocused = this._isElFocused;
        const shouldFocus = this.value;
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (shouldFocus && !isFocused) {
            el.focus();
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        }
        else if (!shouldFocus && isFocused) {
            el.blur();
        }
    }
    /** @internal */
    get _isElFocused() {
        return this._element === this._platform.document.activeElement;
    }
}
__decorate([
    bindable({ mode: twoWay })
], Focus.prototype, "value", void 0);
customAttribute('focus')(Focus);

class Portal {
    constructor() {
        this.position = 'beforeend';
        this.strict = false;
        const factory = kernel.resolve(IViewFactory);
        const originalLoc = kernel.resolve(IRenderLocation);
        const p = kernel.resolve(IPlatform);
        this._platform = p;
        // to make the shape of this object consistent.
        // todo: is this necessary
        this._resolvedTarget = p.document.createElement('div');
        (this.view = factory.create()).setLocation(this._targetLocation = createLocation(p));
        setEffectiveParentNode(this.view.nodes, originalLoc);
    }
    attaching(initiator) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const newTarget = this._resolvedTarget = this._getTarget();
        this._moveLocation(newTarget, this.position);
        return this._activating(initiator, newTarget);
    }
    detaching(initiator) {
        return this._deactivating(initiator, this._resolvedTarget);
    }
    targetChanged() {
        const { $controller } = this;
        if (!$controller.isActive) {
            return;
        }
        const newTarget = this._getTarget();
        if (this._resolvedTarget === newTarget) {
            return;
        }
        this._resolvedTarget = newTarget;
        // TODO(fkleuver): fix and test possible race condition
        const ret = kernel.onResolve(this._deactivating(null, newTarget), () => {
            this._moveLocation(newTarget, this.position);
            return this._activating(null, newTarget);
        });
        if (isPromise(ret)) {
            ret.catch(rethrow);
        }
    }
    positionChanged() {
        const { $controller, _resolvedTarget } = this;
        if (!$controller.isActive) {
            return;
        }
        // TODO(fkleuver): fix and test possible race condition
        const ret = kernel.onResolve(this._deactivating(null, _resolvedTarget), () => {
            this._moveLocation(_resolvedTarget, this.position);
            return this._activating(null, _resolvedTarget);
        });
        if (isPromise(ret)) {
            ret.catch(rethrow);
        }
    }
    /** @internal */
    _activating(initiator, target) {
        const { activating, callbackContext, view } = this;
        // view.setHost(target);
        return kernel.onResolve(activating?.call(callbackContext, target, view), () => {
            return this._activate(initiator, target);
        });
    }
    /** @internal */
    _activate(initiator, target) {
        const { $controller, view } = this;
        if (initiator === null) {
            view.nodes.insertBefore(this._targetLocation);
        }
        else {
            // TODO(fkleuver): fix and test possible race condition
            return kernel.onResolve(view.activate(initiator ?? view, $controller, $controller.scope), () => {
                return this._activated(target);
            });
        }
        return this._activated(target);
    }
    /** @internal */
    _activated(target) {
        const { activated, callbackContext, view } = this;
        return activated?.call(callbackContext, target, view);
    }
    /** @internal */
    _deactivating(initiator, target) {
        const { deactivating, callbackContext, view } = this;
        return kernel.onResolve(deactivating?.call(callbackContext, target, view), () => {
            return this._deactivate(initiator, target);
        });
    }
    /** @internal */
    _deactivate(initiator, target) {
        const { $controller, view } = this;
        if (initiator === null) {
            view.nodes.remove();
        }
        else {
            return kernel.onResolve(view.deactivate(initiator, $controller), () => {
                return this._deactivated(target);
            });
        }
        return this._deactivated(target);
    }
    /** @internal */
    _deactivated(target) {
        const { deactivated, callbackContext, view } = this;
        return kernel.onResolve(deactivated?.call(callbackContext, target, view), () => this._removeLocation());
    }
    /** @internal */
    _getTarget() {
        const p = this._platform;
        // with a $ in front to make it less confusing/error prone
        const $document = p.document;
        let target = this.target;
        let context = this.renderContext;
        if (target === '') {
            if (this.strict) {
                throw createMappedError(811 /* ErrorNames.portal_query_empty */);
            }
            return $document.body;
        }
        if (isString(target)) {
            let queryContext = $document;
            if (isString(context)) {
                context = $document.querySelector(context);
            }
            if (context instanceof p.Node) {
                queryContext = context;
            }
            target = queryContext.querySelector(target);
        }
        if (target instanceof p.Node) {
            return target;
        }
        if (target == null) {
            if (this.strict) {
                throw createMappedError(812 /* ErrorNames.portal_no_target */);
            }
            return $document.body;
        }
        return target;
    }
    /** @internal */
    _removeLocation() {
        this._targetLocation.remove();
        this._targetLocation.$start.remove();
    }
    /** @internal */
    _moveLocation(target, position) {
        const end = this._targetLocation;
        const start = end.$start;
        const parent = target.parentNode;
        const nodes = [start, end];
        switch (position) {
            case 'beforeend':
                insertManyBefore(target, null, nodes);
                break;
            case 'afterbegin':
                insertManyBefore(target, target.firstChild, nodes);
                break;
            case 'beforebegin':
                insertManyBefore(parent, target, nodes);
                break;
            case 'afterend':
                insertManyBefore(parent, target.nextSibling, nodes);
                break;
            default:
                throw new Error('Invalid portal insertion position');
        }
    }
    dispose() {
        this.view.dispose();
        this.view = (void 0);
        this.callbackContext = null;
    }
    accept(visitor) {
        if (this.view?.accept(visitor) === true) {
            return true;
        }
    }
}
__decorate([
    bindable({ primary: true })
], Portal.prototype, "target", void 0);
__decorate([
    bindable()
], Portal.prototype, "position", void 0);
__decorate([
    bindable({ callback: 'targetChanged' })
], Portal.prototype, "renderContext", void 0);
__decorate([
    bindable()
], Portal.prototype, "strict", void 0);
__decorate([
    bindable()
], Portal.prototype, "deactivating", void 0);
__decorate([
    bindable()
], Portal.prototype, "activating", void 0);
__decorate([
    bindable()
], Portal.prototype, "deactivated", void 0);
__decorate([
    bindable()
], Portal.prototype, "activated", void 0);
__decorate([
    bindable()
], Portal.prototype, "callbackContext", void 0);
templateController('portal')(Portal);

let emptyTemplate;
exports.AuSlot = class AuSlot {
    constructor() {
        /** @internal */ this._parentScope = null;
        /** @internal */ this._outerScope = null;
        /** @internal */ this._attached = false;
        /**
         * The binding context that will be exposed to slotted content
         */
        this.expose = null;
        /**
         * A callback that will be called when the content of this slot changed
         */
        this.slotchange = null;
        /** @internal */
        this._subs = new Set();
        /** @internal */
        this._observer = null;
        const hdrContext = kernel.resolve(IHydrationContext);
        const location = kernel.resolve(IRenderLocation);
        const instruction = kernel.resolve(IInstruction);
        const rendering = kernel.resolve(IRendering);
        const slotName = this.name = instruction.data.name;
        // when <au-slot> is empty, there's not even projections
        // hence ?. operator is used
        // for fallback, there's only default slot used
        const fallback = instruction.projections?.[defaultSlotName];
        const projection = hdrContext.instruction?.projections?.[slotName];
        const contextContainer = hdrContext.controller.container;
        let factory;
        let container;
        if (projection == null) {
            container = contextContainer.createChild({ inheritParentResources: true });
            factory = rendering.getViewFactory(fallback ?? (emptyTemplate ??= CustomElementDefinition.create({
                name: 'au-slot-empty-template',
                template: '',
                needsCompile: false,
            })), container);
            this._hasProjection = false;
        }
        else {
            // projection could happen within a projection, example:
            // --my-app--
            // <s-1>
            //   ---projection 1---
            //   <s-2>
            //     ---projection 2---
            //     <s-3>
            // for the template above, if <s-3> is injecting <S1>,
            // we won't find the information in the hydration context hierarchy <MyApp>/<S3>
            // as it's a flat wysiwyg structure based on the template html
            //
            // since we are construction the projection (2) view based on the
            // container of <my-app>, we need to pre-register all information stored
            // in projection (1) into the container created for the projection (2) view
            // =============================
            // my-app template:
            // my-app  --- hydration context
            // <el>     --- owning element (this has this <au-slot> that uses ---projection)
            //   <s-1>  --- projection
            //
            container = contextContainer.createChild();
            // registering resources from the parent hydration context is necessary
            // as that's where the projection is declared in the template
            //
            // if neccessary, we can do the same gymnastic of registering information related to
            // a custom element registration like in renderer.ts from line 1088 to 1098
            // so we don't accidentally get information related to owning element (host, controller, instruction etc...)
            // although it may be more desirable to have owning element information available here
            container.useResources(hdrContext.parent.controller.container);
            // doing this to shadow the owning element hydration context
            // since we created a container out of the owning element container
            // instead of the hydration context container
            registerResolver(container, IHydrationContext, new kernel.InstanceProvider(void 0, hdrContext.parent));
            factory = rendering.getViewFactory(projection, container);
            this._hasProjection = true;
            this._slotwatchers = contextContainer.getAll(IAuSlotWatcher, false)?.filter(w => w.slotName === '*' || w.slotName === slotName) ?? kernel.emptyArray;
        }
        this._hasSlotWatcher = (this._slotwatchers ??= kernel.emptyArray).length > 0;
        this._hdrContext = hdrContext;
        this.view = factory.create().setLocation(this._location = location);
    }
    get nodes() {
        const nodes = [];
        const location = this._location;
        let curr = location.$start.nextSibling;
        while (curr != null && curr !== location) {
            if (curr.nodeType !== /* comment */ 8) {
                nodes.push(curr);
            }
            curr = curr.nextSibling;
        }
        return nodes;
    }
    subscribe(subscriber) {
        this._subs.add(subscriber);
    }
    unsubscribe(subscriber) {
        this._subs.delete(subscriber);
    }
    binding(_initiator, _parent) {
        this._parentScope = this.$controller.scope.parent;
        let outerScope;
        if (this._hasProjection) {
            // if there is a projection,
            // then the au-slot should connect the outer scope with the inner scope binding context
            // via overlaying the outerscope with another scope that has
            // - binding context & override context pointing to the outer scope binding & override context respectively
            // - override context has the $host pointing to inner scope binding context
            outerScope = this._hdrContext.controller.scope.parent;
            (this._outerScope = runtime.Scope.fromParent(outerScope, outerScope.bindingContext))
                .overrideContext.$host = this.expose ?? this._parentScope.bindingContext;
        }
    }
    attaching(initiator, _parent) {
        return kernel.onResolve(this.view.activate(initiator, this.$controller, this._hasProjection ? this._outerScope : this._parentScope), () => {
            if (this._hasSlotWatcher) {
                this._slotwatchers.forEach(w => w.watch(this));
                this._observe();
                this._notifySlotChange();
                this._attached = true;
            }
        });
    }
    detaching(initiator, _parent) {
        this._attached = false;
        this._unobserve();
        this._slotwatchers.forEach(w => w.unwatch(this));
        return this.view.deactivate(initiator, this.$controller);
    }
    exposeChanged(v) {
        if (this._hasProjection && this._outerScope != null) {
            this._outerScope.overrideContext.$host = v;
        }
    }
    dispose() {
        this.view.dispose();
        this.view = (void 0);
    }
    accept(visitor) {
        if (this.view?.accept(visitor) === true) {
            return true;
        }
    }
    /** @internal */
    _observe() {
        if (this._observer != null) {
            return;
        }
        const location = this._location;
        const parent = location.parentElement;
        if (parent == null) {
            return;
        }
        (this._observer = createMutationObserver(parent, records => {
            if (isMutationWithinLocation(location, records)) {
                this._notifySlotChange();
            }
        })).observe(parent, { childList: true });
    }
    /** @internal */
    _unobserve() {
        this._observer?.disconnect();
        this._observer = null;
    }
    /** @internal */
    _notifySlotChange() {
        const nodes = this.nodes;
        const subs = new Set(this._subs);
        let sub;
        if (this._attached) {
            this.slotchange?.call(void 0, this.name, nodes);
        }
        for (sub of subs) {
            sub.handleSlotChange(this, nodes);
        }
    }
};
__decorate([
    bindable
], exports.AuSlot.prototype, "expose", void 0);
__decorate([
    bindable
], exports.AuSlot.prototype, "slotchange", void 0);
exports.AuSlot = __decorate([
    customElement({
        name: 'au-slot',
        template: null,
        containerless: true,
        processContent(el, p, data) {
            data.name = el.getAttribute('name') ?? defaultSlotName;
            let node = el.firstChild;
            let next = null;
            while (node !== null) {
                next = node.nextSibling;
                if (isElement(node) && node.hasAttribute(auslotAttr)) {
                    {
                        // eslint-disable-next-line no-console
                        console.warn(`[DEV:aurelia] detected [au-slot] attribute on a child node`, `of an <au-slot> element: "<${node.nodeName} au-slot>".`, `This element will be ignored and removed`);
                    }
                    el.removeChild(node);
                }
                node = next;
            }
        },
    })
], exports.AuSlot);
const comparePosition = (a, b) => a.compareDocumentPosition(b);
const isMutationWithinLocation = (location, records) => {
    for (const { addedNodes, removedNodes, nextSibling } of records) {
        let i = 0;
        // eslint-disable-next-line prefer-const
        let ii = addedNodes.length;
        let node;
        for (; i < ii; ++i) {
            node = addedNodes[i];
            if (comparePosition(location.$start, node) === /* DOCUMENT_POSITION_FOLLOWING */ 4
                && comparePosition(location, node) === /* DOCUMENT_POSITION_PRECEDING */ 2) {
                return true;
            }
        }
        if (removedNodes.length > 0) {
            if (nextSibling != null && comparePosition(location.$start, nextSibling) === /* DOCUMENT_POSITION_FOLLOWING */ 4
                && comparePosition(location, nextSibling) === /* DOCUMENT_POSITION_PRECEDING */ 2) {
                return true;
            }
        }
    }
};

// Desired usage:
// <au-component template.bind="Promise<string>" component.bind="" model.bind="" />
// <au-component template.bind="<string>" model.bind="" />
//
class AuCompose {
    constructor() {
        /**
         * Control scoping behavior of the view created by the au-compose.
         * This only affects template-only composition. Does not have effects on custom element composition.
         *
         * auto = inherit parent scope
         * scoped = do not inherit parent scope
         */
        this.scopeBehavior = 'auto';
        /** @internal */
        this._composition = void 0;
        /**
         * The tag name of the element to be created for non custom element composition.
         *
         * `null`/`undefined` means containerless
         */
        this.tag = null;
        /** @internal */ this._container = kernel.resolve(kernel.IContainer);
        /** @internal */ this.parent = kernel.resolve(IController);
        /** @internal */ this._host = kernel.resolve(INode);
        /** @internal */ this._location = kernel.resolve(IRenderLocation);
        /** @internal */ this._platform = kernel.resolve(IPlatform);
        /** @internal */ this._rendering = kernel.resolve(IRendering);
        /** @internal */ this._instruction = kernel.resolve(IInstruction);
        /** @internal */ this._contextFactory = kernel.resolve(kernel.transient(CompositionContextFactory));
        /** @internal */ this._compiler = kernel.resolve(ITemplateCompiler);
        /** @internal */ this._hydrationContext = kernel.resolve(IHydrationContext);
        /** @internal */ this._exprParser = kernel.resolve(runtime.IExpressionParser);
        /** @internal */ this._observerLocator = kernel.resolve(runtime.IObserverLocator);
    }
    get composing() {
        return this._composing;
    }
    get composition() {
        return this._composition;
    }
    attaching(initiator, _parent) {
        return this._composing = kernel.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, void 0), initiator), (context) => {
            if (this._contextFactory._isCurrent(context)) {
                this._composing = void 0;
            }
        });
    }
    detaching(initiator) {
        const cmpstn = this._composition;
        const pending = this._composing;
        this._contextFactory.invalidate();
        this._composition = this._composing = void 0;
        return kernel.onResolve(pending, () => cmpstn?.deactivate(initiator));
    }
    /** @internal */
    propertyChanged(name) {
        if (name === 'composing' || name === 'composition')
            return;
        if (name === 'model' && this._composition != null) {
            this._composition.update(this.model);
            return;
        }
        // tag change does not affect existing custom element composition
        if (name === 'tag' && this._composition?.controller.vmKind === vmkCe) {
            {
                console.warn('[DEV:aurelia] Changing tag name of a custom element composition is ignored.'); // eslint-disable-line
            }
            return;
        }
        this._composing = kernel.onResolve(this._composing, () => kernel.onResolve(this.queue(new ChangeInfo(this.template, this.component, this.model, name), void 0), (context) => {
            if (this._contextFactory._isCurrent(context)) {
                this._composing = void 0;
            }
        }));
    }
    /** @internal */
    queue(change, initiator) {
        const factory = this._contextFactory;
        const prevCompositionCtrl = this._composition;
        // todo: handle consequitive changes that create multiple queues
        return kernel.onResolve(factory.create(change), context => {
            // Don't compose [stale] template/component
            // by always ensuring that the composition context is the latest one
            if (factory._isCurrent(context)) {
                return kernel.onResolve(this.compose(context), (result) => {
                    // Don't activate [stale] controller
                    // by always ensuring that the composition context is the latest one
                    if (factory._isCurrent(context)) {
                        return kernel.onResolve(result.activate(initiator), () => {
                            // Don't conclude the [stale] composition
                            // by always ensuring that the composition context is the latest one
                            if (factory._isCurrent(context)) {
                                // after activation, if the composition context is still the most recent one
                                // then the job is done
                                this._composition = result;
                                return kernel.onResolve(prevCompositionCtrl?.deactivate(initiator), () => context);
                            }
                            else {
                                // the stale controller should be deactivated
                                return kernel.onResolve(result.controller.deactivate(result.controller, this.$controller), 
                                // todo: do we need to deactivate?
                                () => {
                                    result.controller.dispose();
                                    return context;
                                });
                            }
                        });
                    }
                    result.controller.dispose();
                    return context;
                });
            }
            return context;
        });
    }
    /** @internal */
    compose(context) {
        // todo: when both component and template are empty
        //       should it throw or try it best to proceed?
        //       current: proceed
        const { _template: template, _component: component, _model: model } = context.change;
        const { _container: container, $controller, _location: loc, _instruction } = this;
        const vmDef = this._getDefinition(this._hydrationContext.controller.container, component);
        const childCtn = container.createChild();
        const compositionHost = this._platform.document.createElement(vmDef == null ? this.tag ?? 'div' : vmDef.name);
        loc.parentNode.insertBefore(compositionHost, loc);
        let compositionLocation;
        if (vmDef == null) {
            compositionLocation = this.tag == null ? convertToRenderLocation(compositionHost) : null;
        }
        else {
            compositionLocation = vmDef.containerless ? convertToRenderLocation(compositionHost) : null;
        }
        const removeCompositionHost = () => {
            compositionHost.remove();
            if (compositionLocation != null) {
                let curr = compositionLocation.$start.nextSibling;
                let next = null;
                while (curr !== null && curr !== compositionLocation) {
                    next = curr.nextSibling;
                    curr.remove();
                    curr = next;
                }
                compositionLocation.$start?.remove();
                compositionLocation.remove();
            }
        };
        const comp = this._createComponentInstance(childCtn, typeof component === 'string' ? vmDef.Type : component, compositionHost, compositionLocation);
        const compose = () => {
            const aucomposeCapturedAttrs = _instruction.captures ?? kernel.emptyArray;
            // custom element based composition
            if (vmDef !== null) {
                const capture = vmDef.capture;
                const [capturedBindingAttrs, transferedToHostBindingAttrs] = aucomposeCapturedAttrs
                    .reduce((attrGroups, attr) => {
                    const shouldCapture = !(attr.target in vmDef.bindables)
                        && (capture === true
                            || isFunction(capture) && !!capture(attr.target));
                    attrGroups[shouldCapture ? 0 : 1].push(attr);
                    return attrGroups;
                }, [[], []]);
                const controller = Controller.$el(childCtn, comp, compositionHost, {
                    projections: _instruction.projections,
                    captures: capturedBindingAttrs
                }, vmDef, compositionLocation);
                // Theoretically these bindings aren't bindings of the composed custom element
                // Though they are meant to be activated (bound)/ deactivated (unbound) together
                // with the custom element controller, so it's practically ok to let the composed
                // custom element manage these bindings
                this._createSpreadBindings(compositionHost, vmDef, transferedToHostBindingAttrs).forEach(b => controller.addBinding(b));
                return new CompositionController(controller, (attachInitiator) => controller.activate(attachInitiator ?? controller, $controller, $controller.scope.parent), 
                // todo: call deactivate on the component component
                (deactachInitiator) => kernel.onResolve(controller.deactivate(deactachInitiator ?? controller, $controller), removeCompositionHost), 
                // casting is technically incorrect
                // but it's ignored in the caller anyway
                (model) => comp.activate?.(model), context);
            }
            else {
                const targetDef = CustomElementDefinition.create({
                    name: CustomElement.generateName(),
                    template: template,
                });
                const viewFactory = this._rendering.getViewFactory(targetDef, childCtn);
                const controller = Controller.$view(viewFactory, $controller);
                const scope = this.scopeBehavior === 'auto'
                    ? runtime.Scope.fromParent(this.parent.scope, comp)
                    : runtime.Scope.create(comp);
                controller.setHost(compositionHost);
                if (compositionLocation == null) {
                    // only spread the bindings if there is an actual host
                    // otherwise we may accidentally do unnecessary work
                    this._createSpreadBindings(compositionHost, targetDef, aucomposeCapturedAttrs).forEach(b => controller.addBinding(b));
                }
                else {
                    controller.setLocation(compositionLocation);
                }
                return new CompositionController(controller, (attachInitiator) => controller.activate(attachInitiator ?? controller, $controller, scope), 
                // todo: call deactivate on the component
                // a difference with composing custom element is that we leave render location/host alone
                // as they all share the same host/render location
                (detachInitiator) => kernel.onResolve(controller.deactivate(detachInitiator ?? controller, $controller), removeCompositionHost), 
                // casting is technically incorrect
                // but it's ignored in the caller anyway
                (model) => comp.activate?.(model), context);
            }
        };
        if ('activate' in comp) {
            // todo: try catch
            // req:  ensure synchronosity of compositions that dont employ promise
            return kernel.onResolve(comp.activate(model), () => compose());
        }
        else {
            return compose();
        }
    }
    /** @internal */
    _createComponentInstance(container, comp, host, location) {
        if (comp == null) {
            return new EmptyComponent();
        }
        if (typeof comp === 'object') {
            return comp;
        }
        const p = this._platform;
        registerHostNode(container, p, host);
        registerResolver(container, IRenderLocation, new kernel.InstanceProvider('IRenderLocation', location));
        const instance = container.invoke(comp);
        registerResolver(container, comp, new kernel.InstanceProvider('au-compose.component', instance));
        return instance;
    }
    /** @internal */
    _getDefinition(container, component) {
        if (typeof component === 'string') {
            const def = CustomElement.find(container, component);
            if (def == null) {
                throw createMappedError(806 /* ErrorNames.au_compose_component_name_not_found */, component);
            }
            return def;
        }
        const Ctor = (isFunction(component)
            ? component
            : component?.constructor);
        return CustomElement.isType(Ctor)
            ? CustomElement.getDefinition(Ctor)
            : null;
    }
    /** @internal */
    _createSpreadBindings(host, def, capturedAttrs) {
        const transferHydrationContext = new HydrationContext(this.$controller, { projections: null, captures: capturedAttrs }, this._hydrationContext.parent);
        return SpreadBinding.create(transferHydrationContext, host, def, this._rendering, this._compiler, this._platform, this._exprParser, this._observerLocator);
    }
}
__decorate([
    bindable
], AuCompose.prototype, "template", void 0);
__decorate([
    bindable
], AuCompose.prototype, "component", void 0);
__decorate([
    bindable
], AuCompose.prototype, "model", void 0);
__decorate([
    bindable({
        set: v => {
            if (v === 'scoped' || v === 'auto') {
                return v;
            }
            throw createMappedError(805 /* ErrorNames.au_compose_invalid_scope_behavior */, v);
        }
    })
], AuCompose.prototype, "scopeBehavior", void 0);
__decorate([
    bindable({
        mode: fromView
    })
], AuCompose.prototype, "composing", null);
__decorate([
    bindable({
        mode: fromView
    })
], AuCompose.prototype, "composition", null);
__decorate([
    bindable
], AuCompose.prototype, "tag", void 0);
customElement({
    name: 'au-compose',
    capture: true,
    containerless: true,
})(AuCompose);
class EmptyComponent {
}
class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    _isCurrent(context) {
        return context.id === this.id;
    }
    create(changes) {
        return kernel.onResolve(changes.load(), (loaded) => new CompositionContext(++this.id, loaded));
    }
    // simplify increasing the id will invalidate all previously created context
    invalidate() {
        this.id++;
    }
}
class ChangeInfo {
    constructor(_template, _component, _model, _src) {
        this._template = _template;
        this._component = _component;
        this._model = _model;
        this._src = _src;
    }
    load() {
        if (isPromise(this._template) || isPromise(this._component)) {
            return Promise
                .all([this._template, this._component])
                .then(([template, component]) => {
                return new LoadedChangeInfo(template, component, this._model, this._src);
            });
        }
        else {
            return new LoadedChangeInfo(this._template, this._component, this._model, this._src);
        }
    }
}
class LoadedChangeInfo {
    constructor(_template, _component, _model, _src) {
        this._template = _template;
        this._component = _component;
        this._model = _model;
        this._src = _src;
    }
}
class CompositionContext {
    constructor(id, change) {
        this.id = id;
        this.change = change;
    }
}
class CompositionController {
    constructor(controller, start, stop, update, context) {
        this.controller = controller;
        this.start = start;
        this.stop = stop;
        this.update = update;
        this.context = context;
        this.state = 0;
    }
    activate(initiator) {
        if (this.state !== 0) {
            throw createMappedError(807 /* ErrorNames.au_compose_invalid_run */, this);
        }
        this.state = 1;
        return this.start(initiator);
    }
    deactivate(detachInitator) {
        switch (this.state) {
            case 1:
                this.state = -1;
                return this.stop(detachInitator);
            case -1:
                throw createMappedError(808 /* ErrorNames.au_compose_duplicate_deactivate */);
            default:
                this.state = -1;
        }
    }
}

const ISanitizer = /*@__PURE__*/ createInterface('ISanitizer', x => x.singleton(class {
    sanitize() {
        throw createMappedError(99 /* ErrorNames.method_not_implemented */, 'sanitize');
    }
}));
/**
 * Simple html sanitization converter to preserve whitelisted elements and attributes on a bound property containing html.
 */
class SanitizeValueConverter {
    constructor() {
        /** @internal */ this._sanitizer = kernel.resolve(ISanitizer);
    }
    /**
     * Process the provided markup that flows to the view.
     *
     * @param untrustedMarkup - The untrusted markup to be sanitized.
     */
    toView(untrustedMarkup) {
        if (untrustedMarkup == null) {
            return null;
        }
        return this._sanitizer.sanitize(untrustedMarkup);
    }
}
valueConverter('sanitize')(SanitizeValueConverter);

const ITemplateElementFactory = /*@__PURE__*/ createInterface('ITemplateElementFactory', x => x.singleton(TemplateElementFactory));
const markupCache = {};
class TemplateElementFactory {
    constructor() {
        /** @internal */
        this.p = kernel.resolve(IPlatform);
        /** @internal */
        this._template = this.t();
    }
    t() {
        return this.p.document.createElement('template');
    }
    createTemplate(input) {
        if (isString(input)) {
            let result = markupCache[input];
            if (result === void 0) {
                const template = this._template;
                template.innerHTML = input;
                const node = template.content.firstElementChild;
                // if the input is either not wrapped in a template or there is more than one node,
                // return the whole template that wraps it/them (and create a new one for the next input)
                if (needsWrapping(node)) {
                    this._template = this.t();
                    result = template;
                }
                else {
                    // the node to return is both a template and the only node, so return just the node
                    // and clean up the template for the next input
                    template.content.removeChild(node);
                    result = node;
                }
                markupCache[input] = result;
            }
            return result.cloneNode(true);
        }
        if (input.nodeName !== 'TEMPLATE') {
            // if we get one node that is not a template, wrap it in one
            const template = this.t();
            template.content.appendChild(input);
            return template;
        }
        // we got a template element, remove it from the DOM if it's present there and don't
        // do any other processing
        input.parentNode?.removeChild(input);
        return input.cloneNode(true);
        function needsWrapping(node) {
            if (node == null)
                return true;
            if (node.nodeName !== 'TEMPLATE')
                return true;
            // At this point the node is a template element.
            // If the template has meaningful siblings, then it needs wrapping.
            // low-hanging fruit: check the next element sibling
            const nextElementSibling = node.nextElementSibling;
            if (nextElementSibling != null)
                return true;
            // check the previous sibling
            const prevSibling = node.previousSibling;
            if (prevSibling != null) {
                switch (prevSibling.nodeType) {
                    // The previous sibling cannot be an element, because the node is the first element in the template.
                    case 3: // Text
                        return prevSibling.textContent.trim().length > 0;
                }
            }
            // the previous sibling was not meaningful, so check the next sibling
            const nextSibling = node.nextSibling;
            if (nextSibling != null) {
                switch (nextSibling.nodeType) {
                    // element is already checked above
                    case 3: // Text
                        return nextSibling.textContent.trim().length > 0;
                }
            }
            // neither the previous nor the next sibling was meaningful, hence the template does not need wrapping
            return false;
        }
    }
}

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(container) {
        container.register(singletonRegistration(this, this), aliasRegistration(this, ITemplateCompiler));
    }
    compile(partialDefinition, container, compilationInstruction) {
        const definition = CustomElementDefinition.getOrCreate(partialDefinition);
        if (definition.template === null || definition.template === void 0) {
            return definition;
        }
        if (definition.needsCompile === false) {
            return definition;
        }
        compilationInstruction ??= emptyCompilationInstructions;
        const context = new CompilationContext(partialDefinition, container, compilationInstruction, null, null, void 0);
        const template = isString(definition.template) || !partialDefinition.enhance
            ? context._templateFactory.createTemplate(definition.template)
            : definition.template;
        const isTemplateElement = template.nodeName === TEMPLATE_NODE_NAME && template.content != null;
        const content = isTemplateElement ? template.content : template;
        const hooks = TemplateCompilerHooks.findAll(container);
        const ii = hooks.length;
        let i = 0;
        if (ii > 0) {
            while (ii > i) {
                hooks[i].compiling?.(template);
                ++i;
            }
        }
        if (template.hasAttribute(localTemplateIdentifier)) {
            throw createMappedError(701 /* ErrorNames.compiler_root_is_local */, definition);
        }
        this._compileLocalElement(content, context);
        this._compileNode(content, context);
        const compiledDef = CustomElementDefinition.create({
            ...partialDefinition,
            name: partialDefinition.name || generateElementName(),
            dependencies: (partialDefinition.dependencies ?? kernel.emptyArray).concat(context.deps ?? kernel.emptyArray),
            instructions: context.rows,
            surrogates: isTemplateElement
                ? this._compileSurrogate(template, context)
                : kernel.emptyArray,
            template,
            hasSlots: context.hasSlot,
            needsCompile: false,
        });
        if (context.deps != null) {
            // if we have a template like this
            //
            // my-app.html
            // <template as-custom-element="le-1">
            //  <le-2></le-2>
            // </template>
            // <template as-custom-element="le-2">...</template>
            //
            // without registering dependencies properly, <le-1> will not see <le-2> as a custom element
            const allDepsForLocalElements = [compiledDef.Type, ...compiledDef.dependencies, ...context.deps];
            for (const localElementType of context.deps) {
                getElementDefinition(localElementType).dependencies.push(...allDepsForLocalElements.filter(d => d !== localElementType));
            }
        }
        return compiledDef;
    }
    compileSpread(requestor, attrSyntaxs, container, target, targetDef) {
        const context = new CompilationContext(requestor, container, emptyCompilationInstructions, null, null, void 0);
        const instructions = [];
        const elDef = targetDef ?? context._findElement(target.nodeName.toLowerCase());
        const isCustomElement = elDef !== null;
        const exprParser = context._exprParser;
        const ii = attrSyntaxs.length;
        let i = 0;
        let attrSyntax;
        let attrDef = null;
        let attrInstructions;
        let attrBindableInstructions;
        // eslint-disable-next-line
        let bindablesInfo;
        let bindable;
        let primaryBindable;
        let bindingCommand = null;
        let expr;
        let isMultiBindings;
        let attrTarget;
        let attrValue;
        for (; ii > i; ++i) {
            attrSyntax = attrSyntaxs[i];
            attrTarget = attrSyntax.target;
            attrValue = attrSyntax.rawValue;
            bindingCommand = context._createCommand(attrSyntax);
            if (bindingCommand !== null && bindingCommand.type === ctIgnoreAttr) {
                // when the binding command overrides everything
                // just pass the target as is to the binding command, and treat it as a normal attribute:
                // active.class="..."
                // background.style="..."
                // my-attr.attr="..."
                commandBuildInfo.node = target;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
                // to next attribute
                continue;
            }
            attrDef = context._findAttr(attrTarget);
            if (attrDef !== null) {
                if (attrDef.isTemplateController) {
                    throw createMappedError(9998 /* ErrorNames.no_spread_template_controller */, attrTarget);
                }
                bindablesInfo = BindablesInfo.from(attrDef, true);
                // Custom attributes are always in multiple binding mode,
                // except when they can't be
                // When they cannot be:
                //        * has explicit configuration noMultiBindings: false
                //        * has binding command, ie: <div my-attr.bind="...">.
                //          In this scenario, the value of the custom attributes is required to be a valid expression
                //        * has no colon: ie: <div my-attr="abcd">
                //          In this scenario, it's simply invalid syntax.
                //          Consider style attribute rule-value pair: <div style="rule: ruleValue">
                isMultiBindings = attrDef.noMultiBindings === false
                    && bindingCommand === null
                    && hasInlineBindings(attrValue);
                if (isMultiBindings) {
                    attrBindableInstructions = this._compileMultiBindings(target, attrValue, attrDef, context);
                }
                else {
                    primaryBindable = bindablesInfo.primary;
                    // custom attribute + single value + WITHOUT binding command:
                    // my-attr=""
                    // my-attr="${}"
                    if (bindingCommand === null) {
                        expr = exprParser.parse(attrValue, etInterpolation);
                        attrBindableInstructions = [
                            expr === null
                                ? new SetPropertyInstruction(attrValue, primaryBindable.name)
                                : new InterpolationInstruction(expr, primaryBindable.name)
                        ];
                    }
                    else {
                        // custom attribute with binding command:
                        // my-attr.bind="..."
                        // my-attr.two-way="..."
                        commandBuildInfo.node = target;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = primaryBindable;
                        commandBuildInfo.def = attrDef;
                        attrBindableInstructions = [bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper)];
                    }
                }
                (attrInstructions ??= []).push(new HydrateAttributeInstruction(
                // todo: def/ def.Type or def.name should be configurable
                //       example: AOT/runtime can use def.Type, but there are situation
                //       where instructions need to be serialized, def.name should be used
                this.resolveResources ? attrDef : attrDef.name, attrDef.aliases != null && attrDef.aliases.includes(attrTarget) ? attrTarget : void 0, attrBindableInstructions));
                continue;
            }
            if (bindingCommand === null) {
                expr = exprParser.parse(attrValue, etInterpolation);
                // reaching here means:
                // + maybe a bindable attribute with interpolation
                // + maybe a plain attribute with interpolation
                // + maybe a plain attribute
                if (isCustomElement) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    bindable = bindablesInfo.attrs[attrTarget];
                    if (bindable !== void 0) {
                        expr = exprParser.parse(attrValue, etInterpolation);
                        instructions.push(new SpreadElementPropBindingInstruction(expr == null
                            ? new SetPropertyInstruction(attrValue, bindable.name)
                            : new InterpolationInstruction(expr, bindable.name)));
                        continue;
                    }
                }
                if (expr != null) {
                    instructions.push(new InterpolationInstruction(expr, 
                    // if not a bindable, then ensure plain attribute are mapped correctly:
                    // e.g: colspan -> colSpan
                    //      innerhtml -> innerHTML
                    //      minlength -> minLength etc...
                    context._attrMapper.map(target, attrTarget) ?? kernel.camelCase(attrTarget)));
                }
                else {
                    switch (attrTarget) {
                        case 'class':
                            instructions.push(new SetClassAttributeInstruction(attrValue));
                            break;
                        case 'style':
                            instructions.push(new SetStyleAttributeInstruction(attrValue));
                            break;
                        default:
                            // if not a custom attribute + no binding command + not a bindable + not an interpolation
                            // then it's just a plain attribute
                            instructions.push(new SetAttributeInstruction(attrValue, attrTarget));
                    }
                }
            }
            else {
                if (isCustomElement) {
                    // if the element is a custom element
                    // - prioritize bindables on a custom element before plain attributes
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    bindable = bindablesInfo.attrs[attrTarget];
                    if (bindable !== void 0) {
                        commandBuildInfo.node = target;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = bindable;
                        commandBuildInfo.def = elDef;
                        instructions.push(new SpreadElementPropBindingInstruction(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper)));
                        continue;
                    }
                }
                commandBuildInfo.node = target;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
            }
        }
        resetCommandBuildInfo();
        if (attrInstructions != null) {
            return attrInstructions.concat(instructions);
        }
        return instructions;
    }
    /** @internal */
    _compileSurrogate(el, context) {
        const instructions = [];
        const attrs = el.attributes;
        const exprParser = context._exprParser;
        let ii = attrs.length;
        let i = 0;
        let attr;
        let attrName;
        let attrValue;
        let attrSyntax;
        let attrDef = null;
        let attrInstructions;
        let attrBindableInstructions;
        // eslint-disable-next-line
        let bindableInfo;
        let primaryBindable;
        let bindingCommand = null;
        let expr;
        let isMultiBindings;
        let realAttrTarget;
        let realAttrValue;
        for (; ii > i; ++i) {
            attr = attrs[i];
            attrName = attr.name;
            attrValue = attr.value;
            attrSyntax = context._attrParser.parse(attrName, attrValue);
            realAttrTarget = attrSyntax.target;
            realAttrValue = attrSyntax.rawValue;
            if (invalidSurrogateAttribute[realAttrTarget]) {
                throw createMappedError(702 /* ErrorNames.compiler_invalid_surrogate_attr */, attrName);
            }
            bindingCommand = context._createCommand(attrSyntax);
            if (bindingCommand !== null && bindingCommand.type === ctIgnoreAttr) {
                // when the binding command overrides everything
                // just pass the target as is to the binding command, and treat it as a normal attribute:
                // active.class="..."
                // background.style="..."
                // my-attr.attr="..."
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
                // to next attribute
                continue;
            }
            attrDef = context._findAttr(realAttrTarget);
            if (attrDef !== null) {
                if (attrDef.isTemplateController) {
                    throw createMappedError(703 /* ErrorNames.compiler_no_tc_on_surrogate */, realAttrTarget);
                }
                bindableInfo = BindablesInfo.from(attrDef, true);
                // Custom attributes are always in multiple binding mode,
                // except when they can't be
                // When they cannot be:
                //        * has explicit configuration noMultiBindings: false
                //        * has binding command, ie: <div my-attr.bind="...">.
                //          In this scenario, the value of the custom attributes is required to be a valid expression
                //        * has no colon: ie: <div my-attr="abcd">
                //          In this scenario, it's simply invalid syntax.
                //          Consider style attribute rule-value pair: <div style="rule: ruleValue">
                isMultiBindings = attrDef.noMultiBindings === false
                    && bindingCommand === null
                    && hasInlineBindings(realAttrValue);
                if (isMultiBindings) {
                    attrBindableInstructions = this._compileMultiBindings(el, realAttrValue, attrDef, context);
                }
                else {
                    primaryBindable = bindableInfo.primary;
                    // custom attribute + single value + WITHOUT binding command:
                    // my-attr=""
                    // my-attr="${}"
                    if (bindingCommand === null) {
                        expr = exprParser.parse(realAttrValue, etInterpolation);
                        attrBindableInstructions = expr === null
                            ? realAttrValue === ''
                                // when the attribute usage is <div attr>
                                // it's considered as no bindings
                                ? []
                                : [new SetPropertyInstruction(realAttrValue, primaryBindable.name)]
                            : [new InterpolationInstruction(expr, primaryBindable.name)];
                    }
                    else {
                        // custom attribute with binding command:
                        // my-attr.bind="..."
                        // my-attr.two-way="..."
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = primaryBindable;
                        commandBuildInfo.def = attrDef;
                        attrBindableInstructions = [bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper)];
                    }
                }
                el.removeAttribute(attrName);
                --i;
                --ii;
                (attrInstructions ??= []).push(new HydrateAttributeInstruction(
                // todo: def/ def.Type or def.name should be configurable
                //       example: AOT/runtime can use def.Type, but there are situation
                //       where instructions need to be serialized, def.name should be used
                this.resolveResources ? attrDef : attrDef.name, attrDef.aliases != null && attrDef.aliases.includes(realAttrTarget) ? realAttrTarget : void 0, attrBindableInstructions));
                continue;
            }
            if (bindingCommand === null) {
                expr = exprParser.parse(realAttrValue, etInterpolation);
                if (expr != null) {
                    el.removeAttribute(attrName);
                    --i;
                    --ii;
                    instructions.push(new InterpolationInstruction(expr, 
                    // if not a bindable, then ensure plain attribute are mapped correctly:
                    // e.g: colspan -> colSpan
                    //      innerhtml -> innerHTML
                    //      minlength -> minLength etc...
                    context._attrMapper.map(el, realAttrTarget) ?? kernel.camelCase(realAttrTarget)));
                }
                else {
                    switch (attrName) {
                        case 'class':
                            instructions.push(new SetClassAttributeInstruction(realAttrValue));
                            break;
                        case 'style':
                            instructions.push(new SetStyleAttributeInstruction(realAttrValue));
                            break;
                        default:
                            // if not a custom attribute + no binding command + not a bindable + not an interpolation
                            // then it's just a plain attribute
                            instructions.push(new SetAttributeInstruction(realAttrValue, attrName));
                    }
                }
            }
            else {
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
            }
        }
        resetCommandBuildInfo();
        if (attrInstructions != null) {
            return attrInstructions.concat(instructions);
        }
        return instructions;
    }
    // overall flow:
    // each of the method will be responsible for compiling its corresponding node type
    // and it should return the next node to be compiled
    /** @internal */
    _compileNode(node, context) {
        switch (node.nodeType) {
            case 1:
                switch (node.nodeName) {
                    case 'LET':
                        return this._compileLet(node, context);
                    // ------------------------------------
                    // todo: possible optimization:
                    // when two conditions below are met:
                    // 1. there's no attribute on au slot,
                    // 2. there's no projection
                    //
                    // -> flatten the au-slot into children as this is just a static template
                    // ------------------------------------
                    // case 'AU-SLOT':
                    //   return this.auSlot(node as Element, container, context);
                    default:
                        return this._compileElement(node, context);
                }
            case 3:
                return this._compileText(node, context);
            case 11: {
                let current = node.firstChild;
                while (current !== null) {
                    current = this._compileNode(current, context);
                }
                break;
            }
        }
        return node.nextSibling;
    }
    /** @internal */
    _compileLet(el, context) {
        const attrs = el.attributes;
        const ii = attrs.length;
        const letInstructions = [];
        const exprParser = context._exprParser;
        let toBindingContext = false;
        let i = 0;
        let attr;
        let attrSyntax;
        let attrName;
        let attrValue;
        let bindingCommand;
        let realAttrTarget;
        let realAttrValue;
        let expr;
        for (; ii > i; ++i) {
            attr = attrs[i];
            attrName = attr.name;
            attrValue = attr.value;
            if (attrName === 'to-binding-context') {
                toBindingContext = true;
                continue;
            }
            attrSyntax = context._attrParser.parse(attrName, attrValue);
            realAttrTarget = attrSyntax.target;
            realAttrValue = attrSyntax.rawValue;
            bindingCommand = context._createCommand(attrSyntax);
            if (bindingCommand !== null) {
                if (attrSyntax.command === 'bind') {
                    letInstructions.push(new LetBindingInstruction(exprParser.parse(realAttrValue, etIsProperty), kernel.camelCase(realAttrTarget)));
                }
                else {
                    throw createMappedError(704 /* ErrorNames.compiler_invalid_let_command */, attrSyntax);
                }
                continue;
            }
            expr = exprParser.parse(realAttrValue, etInterpolation);
            if (expr === null) {
                {
                    // eslint-disable-next-line no-console
                    console.warn(`[DEV:aurelia] Property "${realAttrTarget}" is declared with literal string ${realAttrValue}. ` +
                        `Did you mean ${realAttrTarget}.bind="${realAttrValue}"?`);
                }
            }
            letInstructions.push(new LetBindingInstruction(expr === null ? new runtime.PrimitiveLiteralExpression(realAttrValue) : expr, kernel.camelCase(realAttrTarget)));
        }
        context.rows.push([new HydrateLetElementInstruction(letInstructions, toBindingContext)]);
        // probably no need to replace
        // as the let itself can be used as is
        // though still need to mark el as target to ensure the instruction is matched with a target
        return this._markAsTarget(el, context).nextSibling;
    }
    /** @internal */
    // eslint-disable-next-line
    _compileElement(el, context) {
        // overall, the template compiler does it job by compiling one node,
        // and let that the process of compiling that node point to the next node to be compiled.
        // ----------------------------------------
        // a summary of this 650 line long function:
        // 1. walk through all attributes to put them into their corresponding instruction groups
        //    template controllers      -> list 1
        //    custom attributes         -> list 2
        //    plain attrs with bindings -> list 3
        //    el bindables              -> list 4
        // 2. ensure element instruction is present
        // 3. sort instructions:
        //    hydrate custom element instruction
        //    hydrate custom attribute instructions
        //    rest kept as is (except special cases & to-be-decided)
        //    3.1
        //      mark this element as a target for later hydration
        // 4. Compiling child nodes of this element
        //    4.1.
        //      If 1 or more [Template controller]:
        //      4.1.1.
        //          Start processing the most inner (most right TC in list 1) similarly to step 4.2:
        //          4.1.1.0.
        //          let innerContext = context.createChild();
        //          4.1.1.1.
        //              walks through the child nodes, and perform a [au-slot] check
        //              - if this is a custom element, then extract all [au-slot] annotated elements into corresponding templates by their target slot name
        //              - else throw an error as [au-slot] is used on non-custom-element
        //          4.1.1.2.
        //              recursively compiles the child nodes into the innerContext
        //      4.1.2.
        //          Start processing other Template controllers by walking the TC list (list 1) RIGHT -> LEFT
        //          Explanation:
        //              If there' are multiple template controllers on an element,
        //              only the most inner template controller will have access to the template with the current element
        //              other "outer" template controller will only need to see a marker pointing to a definition of the inner one
        //    4.2.
        //      NO [Template controller]
        //      4.2.1.
        //          walks through the child nodes, and perform a [au-slot] check
        //          - if this is a custom element, then extract all [au-slot] annotated elements into corresponding templates by their target slot name
        //          - else throw an error as [au-slot] is used on non-custom-element
        //      4.2.2
        //          recursively compiles the child nodes into the current context
        // 5. Returning the next node for the compilation
        const nextSibling = el.nextSibling;
        const elName = (el.getAttribute('as-element') ?? el.nodeName).toLowerCase();
        const elDef = context._findElement(elName);
        const isCustomElement = elDef !== null;
        const isShadowDom = isCustomElement && elDef.shadowOptions != null;
        const capture = elDef?.capture;
        const hasCaptureFilter = capture != null && typeof capture !== 'boolean';
        const captures = capture ? [] : kernel.emptyArray;
        const exprParser = context._exprParser;
        const removeAttr = this.debug
            ? kernel.noop
            : () => {
                el.removeAttribute(attrName);
                --i;
                --ii;
            };
        let attrs = el.attributes;
        let instructions;
        let ii = attrs.length;
        let i = 0;
        let attr;
        let attrName;
        let attrValue;
        let attrSyntax;
        /**
         * A list of plain attribute bindings/interpolation bindings
         */
        let plainAttrInstructions;
        let elBindableInstructions;
        let attrDef = null;
        let isMultiBindings = false;
        let bindable;
        let attrInstructions;
        let attrBindableInstructions;
        let tcInstructions;
        let tcInstruction;
        let expr;
        let elementInstruction;
        let bindingCommand = null;
        // eslint-disable-next-line
        let bindablesInfo;
        let primaryBindable;
        let realAttrTarget;
        let realAttrValue;
        let processContentResult = true;
        let hasContainerless = false;
        let canCapture = false;
        let needsMarker = false;
        let elementMetadata;
        if (elName === 'slot') {
            if (context.root.def.shadowOptions == null) {
                throw createMappedError(717 /* ErrorNames.compiler_slot_without_shadowdom */, context.root.def.name);
            }
            context.root.hasSlot = true;
        }
        if (isCustomElement) {
            elementMetadata = {};
            // todo: this is a bit ... powerful
            // maybe do not allow it to process its own attributes
            processContentResult = elDef.processContent?.call(elDef.Type, el, context.p, elementMetadata);
            // might have changed during the process
            attrs = el.attributes;
            ii = attrs.length;
        }
        // 1. walk and compile through all attributes
        //    for each of them, put in appropriate group.
        //    ex. plain attr with binding -> plain attr instruction list
        //        template controller     -> tc instruction list
        //        custom attribute        -> ca instruction list
        //        el bindable attribute   -> el bindable instruction list
        for (; ii > i; ++i) {
            attr = attrs[i];
            attrName = attr.name;
            attrValue = attr.value;
            switch (attrName) {
                case 'as-element':
                case 'containerless':
                    removeAttr();
                    if (!hasContainerless) {
                        hasContainerless = attrName === 'containerless';
                    }
                    continue;
            }
            attrSyntax = context._attrParser.parse(attrName, attrValue);
            bindingCommand = context._createCommand(attrSyntax);
            realAttrTarget = attrSyntax.target;
            realAttrValue = attrSyntax.rawValue;
            if (capture && (!hasCaptureFilter || hasCaptureFilter && capture(realAttrTarget))) {
                if (bindingCommand != null && bindingCommand.type === ctIgnoreAttr) {
                    removeAttr();
                    captures.push(attrSyntax);
                    continue;
                }
                canCapture = realAttrTarget !== auslotAttr && realAttrTarget !== 'slot';
                if (canCapture) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    // if capture is on, capture everything except:
                    // - as-element
                    // - containerless
                    // - bindable properties
                    // - template controller
                    // - custom attribute
                    if (bindablesInfo.attrs[realAttrTarget] == null && !context._findAttr(realAttrTarget)?.isTemplateController) {
                        removeAttr();
                        captures.push(attrSyntax);
                        continue;
                    }
                }
            }
            if (bindingCommand?.type === ctIgnoreAttr) {
                // when the binding command overrides everything
                // just pass the target as is to the binding command, and treat it as a normal attribute:
                // active.class="..."
                // background.style="..."
                // my-attr.attr="..."
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                (plainAttrInstructions ??= []).push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
                removeAttr();
                // to next attribute
                continue;
            }
            // reaching here means:
            // + there may or may not be a binding command, but it won't be an overriding command
            if (isCustomElement) {
                // if the element is a custom element
                // - prioritize bindables on a custom element before plain attributes
                bindablesInfo = BindablesInfo.from(elDef, false);
                bindable = bindablesInfo.attrs[realAttrTarget];
                if (bindable !== void 0) {
                    if (bindingCommand === null) {
                        expr = exprParser.parse(realAttrValue, etInterpolation);
                        (elBindableInstructions ??= []).push(expr == null
                            ? new SetPropertyInstruction(realAttrValue, bindable.name)
                            : new InterpolationInstruction(expr, bindable.name));
                    }
                    else {
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = bindable;
                        commandBuildInfo.def = elDef;
                        (elBindableInstructions ??= []).push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
                    }
                    removeAttr();
                    {
                        attrDef = context._findAttr(realAttrTarget);
                        if (attrDef !== null) {
                            // eslint-disable-next-line no-console
                            console.warn(`[DEV:aurelia] Binding with bindable "${realAttrTarget}" on custom element "${elDef.name}" is ambiguous.` +
                                `There is a custom attribute with the same name.`);
                        }
                    }
                    continue;
                }
            }
            // reaching here means:
            // + there may or may not be a binding command, but it won't be an overriding command
            // + the attribute is not targeting a bindable property of a custom element
            //
            // + maybe it's a custom attribute
            // + maybe it's a plain attribute
            // check for custom attributes before plain attributes
            attrDef = context._findAttr(realAttrTarget);
            if (attrDef !== null) {
                bindablesInfo = BindablesInfo.from(attrDef, true);
                // Custom attributes are always in multiple binding mode,
                // except when they can't be
                // When they cannot be:
                //        * has explicit configuration noMultiBindings: false
                //        * has binding command, ie: <div my-attr.bind="...">.
                //          In this scenario, the value of the custom attributes is required to be a valid expression
                //        * has no colon: ie: <div my-attr="abcd">
                //          In this scenario, it's simply invalid syntax.
                //          Consider style attribute rule-value pair: <div style="rule: ruleValue">
                isMultiBindings = attrDef.noMultiBindings === false
                    && bindingCommand === null
                    && hasInlineBindings(realAttrValue);
                if (isMultiBindings) {
                    attrBindableInstructions = this._compileMultiBindings(el, realAttrValue, attrDef, context);
                }
                else {
                    primaryBindable = bindablesInfo.primary;
                    // custom attribute + single value + WITHOUT binding command:
                    // my-attr=""
                    // my-attr="${}"
                    if (bindingCommand === null) {
                        expr = exprParser.parse(realAttrValue, etInterpolation);
                        attrBindableInstructions = expr === null
                            ? realAttrValue === ''
                                // when the attribute usage is <div attr>
                                // it's considered as no bindings
                                ? []
                                : [new SetPropertyInstruction(realAttrValue, primaryBindable.name)]
                            : [new InterpolationInstruction(expr, primaryBindable.name)];
                    }
                    else {
                        // custom attribute with binding command:
                        // my-attr.bind="..."
                        // my-attr.two-way="..."
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = primaryBindable;
                        commandBuildInfo.def = attrDef;
                        attrBindableInstructions = [bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper)];
                    }
                }
                removeAttr();
                if (attrDef.isTemplateController) {
                    (tcInstructions ??= []).push(new HydrateTemplateController(voidDefinition, 
                    // todo: def/ def.Type or def.name should be configurable
                    //       example: AOT/runtime can use def.Type, but there are situation
                    //       where instructions need to be serialized, def.name should be used
                    this.resolveResources ? attrDef : attrDef.name, void 0, attrBindableInstructions));
                }
                else {
                    (attrInstructions ??= []).push(new HydrateAttributeInstruction(
                    // todo: def/ def.Type or def.name should be configurable
                    //       example: AOT/runtime can use def.Type, but there are situation
                    //       where instructions need to be serialized, def.name should be used
                    this.resolveResources ? attrDef : attrDef.name, attrDef.aliases != null && attrDef.aliases.includes(realAttrTarget) ? realAttrTarget : void 0, attrBindableInstructions));
                }
                continue;
            }
            // reaching here means:
            // + it's a plain attribute
            // + there may or may not be a binding command, but it won't be an overriding command
            if (bindingCommand === null) {
                // reaching here means:
                // + maybe a plain attribute with interpolation
                // + maybe a plain attribute
                expr = exprParser.parse(realAttrValue, etInterpolation);
                if (expr != null) {
                    // if it's an interpolation, remove the attribute
                    removeAttr();
                    (plainAttrInstructions ??= []).push(new InterpolationInstruction(expr, 
                    // if not a bindable, then ensure plain attribute are mapped correctly:
                    // e.g: colspan -> colSpan
                    //      innerhtml -> innerHTML
                    //      minlength -> minLength etc...
                    context._attrMapper.map(el, realAttrTarget) ?? kernel.camelCase(realAttrTarget)));
                }
                continue;
            }
            // reaching here means:
            // + has binding command
            // + not an overriding binding command
            // + not a custom attribute
            // + not a custom element bindable
            commandBuildInfo.node = el;
            commandBuildInfo.attr = attrSyntax;
            commandBuildInfo.bindable = null;
            commandBuildInfo.def = null;
            (plainAttrInstructions ??= []).push(bindingCommand.build(commandBuildInfo, context._exprParser, context._attrMapper));
            removeAttr();
        }
        resetCommandBuildInfo();
        if (this._shouldReorderAttrs(el, plainAttrInstructions) && plainAttrInstructions != null && plainAttrInstructions.length > 1) {
            this._reorder(el, plainAttrInstructions);
        }
        // 2. ensure that element instruction is present if this element is a custom element
        if (isCustomElement) {
            elementInstruction = new HydrateElementInstruction(
            // todo: def/ def.Type or def.name should be configurable
            //       example: AOT/runtime can use def.Type, but there are situation
            //       where instructions need to be serialized, def.name should be used
            this.resolveResources ? elDef : elDef.name, (elBindableInstructions ?? kernel.emptyArray), null, hasContainerless, captures, elementMetadata);
        }
        // 3. merge and sort all instructions into a single list
        //    as instruction list for this element
        if (plainAttrInstructions != null
            || elementInstruction != null
            || attrInstructions != null) {
            instructions = kernel.emptyArray.concat(elementInstruction ?? kernel.emptyArray, attrInstructions ?? kernel.emptyArray, plainAttrInstructions ?? kernel.emptyArray);
            // 3.1 mark as template for later hydration
            // this._markAsTarget(el, context);
            needsMarker = true;
        }
        // 4. compiling child nodes
        let shouldCompileContent;
        if (tcInstructions != null) {
            // 4.1 if there is 1 or more [Template controller]
            ii = tcInstructions.length - 1;
            i = ii;
            tcInstruction = tcInstructions[i];
            let template;
            if (isMarker(el)) {
                template = context.t();
                appendManyToTemplate(template, [
                    // context.h(MARKER_NODE_NAME),
                    context._marker(),
                    context._comment(auStartComment),
                    context._comment(auEndComment),
                ]);
            }
            else {
                // assumption: el.parentNode is not null
                // but not always the case: e.g compile/enhance an element without parent with TC on it
                this._replaceByMarker(el, context);
                if (el.nodeName === 'TEMPLATE') {
                    template = el;
                }
                else {
                    template = context.t();
                    appendToTemplate(template, el);
                }
            }
            const mostInnerTemplate = template;
            // 4.1.1.0. prepare child context for the inner template compilation
            const childContext = context._createChild(instructions == null ? [] : [instructions]);
            let childEl;
            let targetSlot;
            let hasAuSlot = false;
            let projections;
            let slotTemplateRecord;
            let slotTemplates;
            let slotTemplate;
            let marker;
            let projectionCompilationContext;
            let j = 0, jj = 0;
            // 4.1.1.1.
            //  walks through the child nodes, and perform [au-slot] check
            //  note: this is a bit different with the summary above, possibly wrong since it will not throw
            //        on [au-slot] used on a non-custom-element + with a template controller on it
            // for each child element of a custom element
            // scan for [au-slot], if there's one
            // then extract the element into a projection definition
            // this allows support for [au-slot] declared on the same element with anther template controller
            // e.g:
            //
            // can do:
            //  <my-el>
            //    <div au-slot if.bind="..."></div>
            //    <div if.bind="..." au-slot></div>
            //  </my-el>
            //
            // instead of:
            //  <my-el>
            //    <template au-slot><div if.bind="..."></div>
            //  </my-el>
            let child = el.firstChild;
            let isEmptyTextNode = false;
            if (processContentResult !== false) {
                while (child !== null) {
                    targetSlot = isElement(child) ? child.getAttribute(auslotAttr) : null;
                    hasAuSlot = targetSlot !== null || isCustomElement && !isShadowDom;
                    childEl = child.nextSibling;
                    if (hasAuSlot) {
                        if (!isCustomElement) {
                            throw createMappedError(706 /* ErrorNames.compiler_au_slot_on_non_element */, targetSlot, elName);
                        }
                        child.removeAttribute?.(auslotAttr);
                        // ignore all whitespace
                        isEmptyTextNode = isTextNode(child) && child.textContent.trim() === '';
                        if (!isEmptyTextNode) {
                            ((slotTemplateRecord ??= {})[targetSlot || defaultSlotName] ??= []).push(child);
                        }
                        el.removeChild(child);
                    }
                    child = childEl;
                }
            }
            if (slotTemplateRecord != null) {
                projections = {};
                // aggregate all content targeting the same slot
                // into a single template
                // with some special rule around <template> element
                for (targetSlot in slotTemplateRecord) {
                    template = context.t();
                    slotTemplates = slotTemplateRecord[targetSlot];
                    for (j = 0, jj = slotTemplates.length; jj > j; ++j) {
                        slotTemplate = slotTemplates[j];
                        if (slotTemplate.nodeName === 'TEMPLATE') {
                            // this means user has some thing more than [au-slot] on a template
                            // consider this intentional, and use it as is
                            // e.g:
                            // case 1
                            // <my-element>
                            //   <template au-slot repeat.for="i of items">
                            // ----vs----
                            // case 2
                            // <my-element>
                            //   <template au-slot>this is just some static stuff <b>And a b</b></template>
                            if (slotTemplate.attributes.length > 0) {
                                // case 1
                                appendToTemplate(template, slotTemplate);
                            }
                            else {
                                // case 2
                                appendToTemplate(template, slotTemplate.content);
                            }
                        }
                        else {
                            appendToTemplate(template, slotTemplate);
                        }
                    }
                    // after aggregating all the [au-slot] templates into a single one
                    // compile it
                    // technically, the most inner template controller compilation context
                    // is the parent of this compilation context
                    // but for simplicity in compilation, maybe start with a flatter hierarchy
                    // also, it wouldn't have any real uses
                    projectionCompilationContext = context._createChild();
                    this._compileNode(template.content, projectionCompilationContext);
                    projections[targetSlot] = CustomElementDefinition.create({
                        name: generateElementName(),
                        template,
                        instructions: projectionCompilationContext.rows,
                        needsCompile: false,
                    });
                }
                elementInstruction.projections = projections;
            }
            if (needsMarker) {
                if (isCustomElement && (hasContainerless || elDef.containerless)) {
                    this._replaceByMarker(el, context);
                }
                else {
                    this._markAsTarget(el, context);
                }
            }
            shouldCompileContent = !isCustomElement || !elDef.containerless && !hasContainerless && processContentResult !== false;
            if (shouldCompileContent) {
                // 4.1.1.2:
                //  recursively compiles the child nodes into the inner context
                // important:
                // ======================
                // only goes inside a template, if there is a template controller on it
                // otherwise, leave it alone
                if (el.nodeName === TEMPLATE_NODE_NAME) {
                    this._compileNode(el.content, childContext);
                }
                else {
                    child = el.firstChild;
                    while (child !== null) {
                        child = this._compileNode(child, childContext);
                    }
                }
            }
            tcInstruction.def = CustomElementDefinition.create({
                name: generateElementName(),
                template: mostInnerTemplate,
                instructions: childContext.rows,
                needsCompile: false,
            });
            // 4.1.2.
            //  Start processing other Template controllers by walking the TC list (list 1) RIGHT -> LEFT
            while (i-- > 0) {
                // for each of the template controller from [right] to [left]
                // do create:
                // (1) a template
                // (2) add a marker to the template
                // (3) an instruction
                // instruction will be corresponded to the marker
                // =========================
                tcInstruction = tcInstructions[i];
                template = context.t();
                // appending most inner template is inaccurate, as the most outer one
                // is not really the parent of the most inner one
                // but it's only for the purpose of creating a marker,
                // so it's just an optimization hack
                // marker = this._markAsTarget(context.h(MARKER_NODE_NAME));
                // marker = context.h(MARKER_NODE_NAME);
                marker = context._marker();
                appendManyToTemplate(template, [
                    marker,
                    context._comment(auStartComment),
                    context._comment(auEndComment),
                ]);
                tcInstruction.def = CustomElementDefinition.create({
                    name: generateElementName(),
                    template,
                    needsCompile: false,
                    instructions: [[tcInstructions[i + 1]]],
                });
            }
            // the most outer template controller should be
            // the only instruction for peek instruction of the current context
            // e.g
            // <div if.bind="yes" with.bind="scope" repeat.for="i of items" data-id="i.id">
            // results in:
            // -----------
            //
            //  TC(if-[value=yes])
            //    | TC(with-[value=scope])
            //        | TC(repeat-[...])
            //            | div(data-id-[value=i.id])
            context.rows.push([tcInstruction]);
        }
        else {
            // 4.2
            //
            // if there's no template controller
            // then the instruction built is appropriate to be assigned as the peek row
            // and before the children compilation
            if (instructions != null) {
                context.rows.push(instructions);
            }
            let child = el.firstChild;
            let childEl;
            let targetSlot;
            let hasAuSlot = false;
            let projections = null;
            let slotTemplateRecord;
            let slotTemplates;
            let slotTemplate;
            let template;
            let projectionCompilationContext;
            let isEmptyTextNode = false;
            let j = 0, jj = 0;
            // 4.2.1.
            //    walks through the child nodes and perform [au-slot] check
            // --------------------
            // for each child element of a custom element
            // scan for [au-slot], if there's one
            // then extract the element into a projection definition
            // this allows support for [au-slot] declared on the same element with anther template controller
            // e.g:
            //
            // can do:
            //  <my-el>
            //    <div au-slot if.bind="..."></div>
            //    <div if.bind="..." au-slot></div>
            //  </my-el>
            //
            // instead of:
            //  <my-el>
            //    <template au-slot><div if.bind="..."></div>
            //  </my-el>
            if (processContentResult !== false) {
                while (child !== null) {
                    targetSlot = isElement(child) ? child.getAttribute(auslotAttr) : null;
                    hasAuSlot = targetSlot !== null || isCustomElement && !isShadowDom;
                    childEl = child.nextSibling;
                    if (hasAuSlot) {
                        if (!isCustomElement) {
                            throw createMappedError(706 /* ErrorNames.compiler_au_slot_on_non_element */, targetSlot, elName);
                        }
                        child.removeAttribute?.(auslotAttr);
                        // ignore all whitespace
                        isEmptyTextNode = isTextNode(child) && child.textContent.trim() === '';
                        if (!isEmptyTextNode) {
                            ((slotTemplateRecord ??= {})[targetSlot || defaultSlotName] ??= []).push(child);
                        }
                        el.removeChild(child);
                    }
                    child = childEl;
                }
            }
            if (slotTemplateRecord != null) {
                projections = {};
                // aggregate all content targeting the same slot
                // into a single template
                // with some special rule around <template> element
                for (targetSlot in slotTemplateRecord) {
                    template = context.t();
                    slotTemplates = slotTemplateRecord[targetSlot];
                    for (j = 0, jj = slotTemplates.length; jj > j; ++j) {
                        slotTemplate = slotTemplates[j];
                        if (slotTemplate.nodeName === TEMPLATE_NODE_NAME) {
                            // this means user has some thing more than [au-slot] on a template
                            // consider this intentional, and use it as is
                            // e.g:
                            // case 1
                            // <my-element>
                            //   <template au-slot repeat.for="i of items">
                            // ----vs----
                            // case 2
                            // <my-element>
                            //   <template au-slot>this is just some static stuff <b>And a b</b></template>
                            if (slotTemplate.attributes.length > 0) {
                                // case 1
                                appendToTemplate(template, slotTemplate);
                            }
                            else {
                                // case 2
                                appendToTemplate(template, slotTemplate.content);
                            }
                        }
                        else {
                            appendToTemplate(template, slotTemplate);
                        }
                    }
                    // after aggregating all the [au-slot] templates into a single one
                    // compile it
                    projectionCompilationContext = context._createChild();
                    this._compileNode(template.content, projectionCompilationContext);
                    projections[targetSlot] = CustomElementDefinition.create({
                        name: generateElementName(),
                        template,
                        instructions: projectionCompilationContext.rows,
                        needsCompile: false,
                    });
                }
                elementInstruction.projections = projections;
            }
            if (needsMarker) {
                if (isCustomElement && (hasContainerless || elDef.containerless)) {
                    this._replaceByMarker(el, context);
                }
                else {
                    this._markAsTarget(el, context);
                }
            }
            shouldCompileContent = !isCustomElement || !elDef.containerless && !hasContainerless && processContentResult !== false;
            if (shouldCompileContent && el.childNodes.length > 0) {
                // 4.2.2
                //    recursively compiles the child nodes into current context
                child = el.firstChild;
                while (child !== null) {
                    child = this._compileNode(child, context);
                }
            }
        }
        // 5. returns the next node to be compiled
        return nextSibling;
    }
    /** @internal */
    _compileText(node, context) {
        const parent = node.parentNode;
        const expr = context._exprParser.parse(node.textContent, etInterpolation);
        const next = node.nextSibling;
        let parts;
        let expressions;
        let i;
        let ii;
        let part;
        if (expr !== null) {
            ({ parts, expressions } = expr);
            // foreach normal part, turn into a standard text node
            if ((part = parts[0])) {
                insertBefore(parent, context._text(part), node);
            }
            for (i = 0, ii = expressions.length; ii > i; ++i) {
                // foreach expression part, turn into a marker
                insertManyBefore(parent, node, [
                    // context.h(MARKER_NODE_NAME),
                    context._marker(),
                    // empty text node will not be cloned when doing fragment.cloneNode()
                    // so give it an empty space instead
                    context._text(' '),
                ]);
                // foreach normal part, turn into a standard text node
                if ((part = parts[i + 1])) {
                    insertBefore(parent, context._text(part), node);
                }
                // and the corresponding instruction
                context.rows.push([new TextBindingInstruction(expressions[i])]);
            }
            parent.removeChild(node);
        }
        return next;
    }
    /** @internal */
    _compileMultiBindings(node, attrRawValue, attrDef, context) {
        // custom attribute + multiple values:
        // my-attr="prop1: literal1 prop2.bind: ...; prop3: literal3"
        // my-attr="prop1.bind: ...; prop2.bind: ..."
        // my-attr="prop1: ${}; prop2.bind: ...; prop3: ${}"
        const bindableAttrsInfo = BindablesInfo.from(attrDef, true);
        const valueLength = attrRawValue.length;
        const instructions = [];
        let attrName = void 0;
        let attrValue = void 0;
        let start = 0;
        let ch = 0;
        let expr;
        let attrSyntax;
        let command;
        let bindable;
        for (let i = 0; i < valueLength; ++i) {
            ch = attrRawValue.charCodeAt(i);
            if (ch === 92 /* Char.Backslash */) {
                ++i;
                // Ignore whatever comes next because it's escaped
            }
            else if (ch === 58 /* Char.Colon */) {
                attrName = attrRawValue.slice(start, i);
                // Skip whitespace after colon
                while (attrRawValue.charCodeAt(++i) <= 32 /* Char.Space */)
                    ;
                start = i;
                for (; i < valueLength; ++i) {
                    ch = attrRawValue.charCodeAt(i);
                    if (ch === 92 /* Char.Backslash */) {
                        ++i;
                        // Ignore whatever comes next because it's escaped
                    }
                    else if (ch === 59 /* Char.Semicolon */) {
                        attrValue = attrRawValue.slice(start, i);
                        break;
                    }
                }
                if (attrValue === void 0) {
                    // No semicolon found, so just grab the rest of the value
                    attrValue = attrRawValue.slice(start);
                }
                attrSyntax = context._attrParser.parse(attrName, attrValue);
                // ================================================
                // todo: should it always camel case???
                // const attrTarget = camelCase(attrSyntax.target);
                // ================================================
                command = context._createCommand(attrSyntax);
                bindable = bindableAttrsInfo.attrs[attrSyntax.target];
                if (bindable == null) {
                    throw createMappedError(707 /* ErrorNames.compiler_binding_to_non_bindable */, attrSyntax.target, attrDef.name);
                }
                if (command === null) {
                    expr = context._exprParser.parse(attrValue, etInterpolation);
                    instructions.push(expr === null
                        ? new SetPropertyInstruction(attrValue, bindable.name)
                        : new InterpolationInstruction(expr, bindable.name));
                }
                else {
                    commandBuildInfo.node = node;
                    commandBuildInfo.attr = attrSyntax;
                    commandBuildInfo.bindable = bindable;
                    commandBuildInfo.def = attrDef;
                    instructions.push(command.build(commandBuildInfo, context._exprParser, context._attrMapper));
                }
                // Skip whitespace after semicolon
                while (i < valueLength && attrRawValue.charCodeAt(++i) <= 32 /* Char.Space */)
                    ;
                start = i;
                attrName = void 0;
                attrValue = void 0;
            }
        }
        resetCommandBuildInfo();
        return instructions;
    }
    /** @internal */
    _compileLocalElement(template, context) {
        const elName = context.root.def.name;
        const root = template;
        const localTemplates = kernel.toArray(root.querySelectorAll('template[as-custom-element]'));
        const numLocalTemplates = localTemplates.length;
        if (numLocalTemplates === 0) {
            return;
        }
        if (numLocalTemplates === root.childElementCount) {
            throw createMappedError(708 /* ErrorNames.compiler_template_only_local_template */, elName);
        }
        const localTemplateNames = new Set();
        for (const localTemplate of localTemplates) {
            if (localTemplate.parentNode !== root) {
                throw createMappedError(709 /* ErrorNames.compiler_local_el_not_under_root */, elName);
            }
            const name = processTemplateName(elName, localTemplate, localTemplateNames);
            const content = localTemplate.content;
            const bindableEls = kernel.toArray(content.querySelectorAll('bindable'));
            const properties = new Set();
            const attributes = new Set();
            const bindables = bindableEls.reduce((allBindables, bindableEl) => {
                if (bindableEl.parentNode !== content) {
                    throw createMappedError(710 /* ErrorNames.compiler_local_el_bindable_not_under_root */, name);
                }
                const property = bindableEl.getAttribute("name" /* LocalTemplateBindableAttributes.name */);
                if (property === null) {
                    throw createMappedError(711 /* ErrorNames.compiler_local_el_bindable_name_missing */, bindableEl, name);
                }
                const attribute = bindableEl.getAttribute("attribute" /* LocalTemplateBindableAttributes.attribute */);
                if (attribute !== null
                    && attributes.has(attribute)
                    || properties.has(property)) {
                    throw createMappedError(712 /* ErrorNames.compiler_local_el_bindable_duplicate */, properties, attribute);
                }
                else {
                    if (attribute !== null) {
                        attributes.add(attribute);
                    }
                    properties.add(property);
                }
                const ignoredAttributes = kernel.toArray(bindableEl.attributes).filter((attr) => !allowedLocalTemplateBindableAttributes.includes(attr.name));
                if (ignoredAttributes.length > 0) {
                    console.warn(`[DEV:aurelia] The attribute(s) ${ignoredAttributes.map(attr => attr.name).join(', ')} will be ignored for ${bindableEl.outerHTML}. Only ${allowedLocalTemplateBindableAttributes.join(', ')} are processed.`);
                }
                bindableEl.remove();
                allBindables[property] = { attribute: attribute ?? void 0, mode: getBindingMode(bindableEl) };
                return allBindables;
            }, {});
            class LocalTemplateType {
            }
            def(LocalTemplateType, 'name', { value: name });
            context._addLocalDep(defineElement({ name, template: localTemplate, bindables }, LocalTemplateType));
            root.removeChild(localTemplate);
        }
    }
    /** @internal */
    _shouldReorderAttrs(el, instructions) {
        const nodeName = el.nodeName;
        return nodeName === 'INPUT' && orderSensitiveInputType[el.type] === 1
            || nodeName === 'SELECT' && (el.hasAttribute('multiple')
                || instructions?.some(i => i.type === propertyBinding && i.to === 'multiple'));
    }
    /** @internal */
    _reorder(el, instructions) {
        switch (el.nodeName) {
            case 'INPUT': {
                const _instructions = instructions;
                // swap the order of checked and model/value attribute,
                // so that the required observers are prepared for checked-observer
                let modelOrValueOrMatcherIndex = void 0;
                let checkedIndex = void 0;
                let found = 0;
                let instruction;
                for (let i = 0; i < _instructions.length && found < 3; i++) {
                    instruction = _instructions[i];
                    switch (instruction.to) {
                        case 'model':
                        case 'value':
                        case 'matcher':
                            modelOrValueOrMatcherIndex = i;
                            found++;
                            break;
                        case 'checked':
                            checkedIndex = i;
                            found++;
                            break;
                    }
                }
                if (checkedIndex !== void 0 && modelOrValueOrMatcherIndex !== void 0 && checkedIndex < modelOrValueOrMatcherIndex) {
                    [_instructions[modelOrValueOrMatcherIndex], _instructions[checkedIndex]] = [_instructions[checkedIndex], _instructions[modelOrValueOrMatcherIndex]];
                }
                break;
            }
            case 'SELECT': {
                const _instructions = instructions;
                let valueIndex = 0;
                let multipleIndex = 0;
                // a variable to stop the loop as soon as we find both value & multiple binding indices
                let found = 0;
                let instruction;
                // swap the order of multiple and value bindings
                for (let i = 0; i < _instructions.length && found < 2; ++i) {
                    instruction = _instructions[i];
                    switch (instruction.to) {
                        case 'multiple':
                            multipleIndex = i;
                            found++;
                            break;
                        case 'value':
                            valueIndex = i;
                            found++;
                            break;
                    }
                    if (found === 2 && valueIndex < multipleIndex) {
                        [_instructions[multipleIndex], _instructions[valueIndex]] = [_instructions[valueIndex], _instructions[multipleIndex]];
                    }
                }
            }
        }
    }
    /**
     * Mark an element as target with a special css class
     * and return it
     *
     * @internal
     */
    _markAsTarget(el, context) {
        insertBefore(el.parentNode, context._comment('au*'), el);
        // el.classList.add('au');
        return el;
    }
    /**
     * Replace an element with a marker, and return the marker
     *
     * @internal
     */
    _replaceByMarker(node, context) {
        if (isMarker(node)) {
            return node;
        }
        // todo: assumption made: parentNode won't be null
        const parent = node.parentNode;
        // const marker = this._markAsTarget(context.h(MARKER_NODE_NAME));
        const marker = context._marker();
        // insertBefore(parent, marker, node);
        insertManyBefore(parent, node, [
            marker,
            context._comment(auStartComment),
            context._comment(auEndComment),
        ]);
        parent.removeChild(node);
        return marker;
    }
}
// let nextSibling: Node | null;
// const MARKER_NODE_NAME = 'AU-M';
const TEMPLATE_NODE_NAME = 'TEMPLATE';
const auStartComment = 'au-start';
const auEndComment = 'au-end';
const isMarker = (el) => el.nodeValue === 'au*';
// && isComment(nextSibling = el.nextSibling) && nextSibling.textContent === auStartComment
// && isComment(nextSibling = el.nextSibling) && nextSibling.textContent === auEndComment;
// const isComment = (el: Node | null): el is Comment => el?.nodeType === 8;
// this class is intended to be an implementation encapsulating the information at the root level of a template
// this works at the time this is created because everything inside a template should be retrieved
// from the root itself.
// if anytime in the future, where it's desirable to retrieve information from somewhere other than root
// then consider dropping this
// goal: hide the root container, and all the resources finding calls
class CompilationContext {
    constructor(def, container, compilationInstruction, parent, root, instructions) {
        this.hasSlot = false;
        // todo: ideally binding command shouldn't have to be cached
        // it can just be a singleton where it' retrieved
        // the resources semantic should be defined by the resource itself,
        // rather than baked in the container
        this._commands = createLookup();
        const hasParent = parent !== null;
        this.c = container;
        this.root = root === null ? this : root;
        this.def = def;
        this.ci = compilationInstruction;
        this.parent = parent;
        this._templateFactory = hasParent ? parent._templateFactory : container.get(ITemplateElementFactory);
        // todo: attr parser should be retrieved based in resource semantic (current leaf + root + ignore parent)
        this._attrParser = hasParent ? parent._attrParser : container.get(IAttributeParser);
        this._exprParser = hasParent ? parent._exprParser : container.get(runtime.IExpressionParser);
        this._attrMapper = hasParent ? parent._attrMapper : container.get(IAttrMapper);
        this._logger = hasParent ? parent._logger : container.get(kernel.ILogger);
        this.p = hasParent ? parent.p : container.get(IPlatform);
        this.localEls = hasParent ? parent.localEls : new Set();
        this.rows = instructions ?? [];
    }
    _addLocalDep(dep) {
        (this.root.deps ??= []).push(dep);
        this.root.c.register(dep);
        return dep;
    }
    _text(text) {
        return createText(this.p, text);
    }
    _comment(text) {
        return createComment(this.p, text);
    }
    _marker() {
        return this._comment('au*');
    }
    h(name) {
        const el = createElement(this.p, name);
        if (name === 'template') {
            this.p.document.adoptNode(el.content);
        }
        return el;
    }
    t() {
        return this.h('template');
    }
    /**
     * Find the custom element definition of a given name
     */
    _findElement(name) {
        return CustomElement.find(this.c, name);
    }
    /**
     * Find the custom attribute definition of a given name
     */
    _findAttr(name) {
        return CustomAttribute.find(this.c, name);
    }
    /**
     * Create a new child compilation context
     */
    _createChild(instructions) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, instructions);
    }
    /**
     * Retrieve a binding command resource instance.
     *
     * @param name - The parsed `AttrSyntax`
     *
     * @returns An instance of the command if it exists, or `null` if it does not exist.
     */
    _createCommand(syntax) {
        if (this.root !== this) {
            return this.root._createCommand(syntax);
        }
        const name = syntax.command;
        if (name === null) {
            return null;
        }
        let result = this._commands[name];
        let commandDef;
        if (result === void 0) {
            commandDef = BindingCommand.find(this.c, name);
            if (commandDef == null) {
                throw createMappedError(713 /* ErrorNames.compiler_unknown_binding_command */, name);
            }
            this._commands[name] = result = BindingCommand.get(this.c, name);
        }
        return result;
    }
}
const hasInlineBindings = (rawValue) => {
    const len = rawValue.length;
    let ch = 0;
    let i = 0;
    while (len > i) {
        ch = rawValue.charCodeAt(i);
        if (ch === 92 /* Char.Backslash */) {
            ++i;
            // Ignore whatever comes next because it's escaped
        }
        else if (ch === 58 /* Char.Colon */) {
            return true;
        }
        else if (ch === 36 /* Char.Dollar */ && rawValue.charCodeAt(i + 1) === 123 /* Char.OpenBrace */) {
            return false;
        }
        ++i;
    }
    return false;
};
const resetCommandBuildInfo = () => {
    commandBuildInfo.node
        = commandBuildInfo.attr
            = commandBuildInfo.bindable
                = commandBuildInfo.def = null;
};
const emptyCompilationInstructions = { projections: null };
// eslint-disable-next-line
const voidDefinition = { name: 'unnamed' };
const commandBuildInfo = {
    node: null,
    attr: null,
    bindable: null,
    def: null,
};
const invalidSurrogateAttribute = objectAssign(createLookup(), {
    'id': true,
    'name': true,
    'au-slot': true,
    'as-element': true,
});
const orderSensitiveInputType = {
    checkbox: 1,
    radio: 1,
    // todo: range is also sensitive to order, for min/max
};
const bindableAttrsInfoCache = new WeakMap();
class BindablesInfo {
    static from(def, isAttr) {
        let info = bindableAttrsInfoCache.get(def);
        if (info == null) {
            const bindables = def.bindables;
            const attrs = createLookup();
            const defaultBindingMode = isAttr
                ? def.defaultBindingMode === void 0
                    ? defaultMode
                    : def.defaultBindingMode
                : defaultMode;
            let bindable;
            let prop;
            let hasPrimary = false;
            let primary;
            let attr;
            // from all bindables, pick the first primary bindable
            // if there is no primary, pick the first bindable
            // if there's no bindables, create a new primary with property value
            for (prop in bindables) {
                bindable = bindables[prop];
                attr = bindable.attribute;
                if (bindable.primary === true) {
                    if (hasPrimary) {
                        throw createMappedError(714 /* ErrorNames.compiler_primary_already_existed */, def);
                    }
                    hasPrimary = true;
                    primary = bindable;
                }
                else if (!hasPrimary && primary == null) {
                    primary = bindable;
                }
                attrs[attr] = BindableDefinition.create(prop, def.Type, bindable);
            }
            if (bindable == null && isAttr) {
                // if no bindables are present, default to "value"
                primary = attrs.value = BindableDefinition.create('value', def.Type, { mode: defaultBindingMode });
            }
            bindableAttrsInfoCache.set(def, info = new BindablesInfo(attrs, bindables, primary));
        }
        return info;
    }
    constructor(attrs, bindables, primary) {
        this.attrs = attrs;
        this.bindables = bindables;
        this.primary = primary;
    }
}

const allowedLocalTemplateBindableAttributes = objectFreeze([
    "name" /* LocalTemplateBindableAttributes.name */,
    "attribute" /* LocalTemplateBindableAttributes.attribute */,
    "mode" /* LocalTemplateBindableAttributes.mode */
]);
const localTemplateIdentifier = 'as-custom-element';
const processTemplateName = (owningElementName, localTemplate, localTemplateNames) => {
    const name = localTemplate.getAttribute(localTemplateIdentifier);
    if (name === null || name === '') {
        throw createMappedError(715 /* ErrorNames.compiler_local_name_empty */, owningElementName);
    }
    if (localTemplateNames.has(name)) {
        throw createMappedError(716 /* ErrorNames.compiler_duplicate_local_name */, name, owningElementName);
    }
    else {
        localTemplateNames.add(name);
        localTemplate.removeAttribute(localTemplateIdentifier);
    }
    return name;
};
const getBindingMode = (bindable) => {
    switch (bindable.getAttribute("mode" /* LocalTemplateBindableAttributes.mode */)) {
        case 'oneTime':
            return oneTime;
        case 'toView':
            return toView;
        case 'fromView':
            return fromView;
        case 'twoWay':
            return twoWay;
        case 'default':
        default:
            return defaultMode;
    }
};
/**
 * An interface describing the hooks a compilation process should invoke.
 *
 * A feature available to the default template compiler.
 */
const ITemplateCompilerHooks = /*@__PURE__*/ createInterface('ITemplateCompilerHooks');
const TemplateCompilerHooks = objectFreeze({
    name: /*@__PURE__*/ kernel.getResourceKeyFor('compiler-hooks'),
    define(Type) {
        return kernel.Registrable.define(Type, function (container) {
            singletonRegistration(ITemplateCompilerHooks, this).register(container);
        });
    },
    findAll(container) {
        return container.get(kernel.allResources(ITemplateCompilerHooks));
    }
});
/**
 * Decorator: Indicates that the decorated class is a template compiler hooks.
 *
 * An instance of this class will be created and appropriate compilation hooks will be invoked
 * at different phases of the default compiler.
 */
/* eslint-disable */
// deepscan-disable-next-line
const templateCompilerHooks = (target) => {
    return target === void 0 ? decorator : decorator(target);
    function decorator(t) {
        return TemplateCompilerHooks.define(t);
    }
};

class Show {
    constructor() {
        this.el = kernel.resolve(INode);
        this.p = kernel.resolve(IPlatform);
        /** @internal */ this._isActive = false;
        /** @internal */ this._task = null;
        this.$val = '';
        this.$prio = '';
        this.update = () => {
            this._task = null;
            // Only compare at the synchronous moment when we're about to update, because the value might have changed since the update was queued.
            if (Boolean(this.value) !== this._isToggled) {
                if (this._isToggled === this._base) {
                    this._isToggled = !this._base;
                    // Note: in v1 we used the 'au-hide' class, but in v2 it's so trivial to conditionally apply classes (e.g. 'hide.class="someCondition"'),
                    // that it's probably better to avoid the CSS inject infra involvement and keep this CA as simple as possible.
                    // Instead, just store and restore the property values (with each mutation, to account for in-between updates), to cover the common cases, until there is convincing feedback to do otherwise.
                    this.$val = this.el.style.getPropertyValue('display');
                    this.$prio = this.el.style.getPropertyPriority('display');
                    this.el.style.setProperty('display', 'none', 'important');
                }
                else {
                    this._isToggled = this._base;
                    this.el.style.setProperty('display', this.$val, this.$prio);
                    // If the style attribute is now empty, remove it.
                    if (this.el.getAttribute('style') === '') {
                        this.el.removeAttribute('style');
                    }
                }
            }
        };
        const instr = kernel.resolve(IInstruction);
        // if this is declared as a 'hide' attribute, then this.base will be false, inverting everything.
        this._isToggled = this._base = instr.alias !== 'hide';
    }
    binding() {
        this._isActive = true;
        this.update();
    }
    detaching() {
        this._isActive = false;
        this._task?.cancel();
        this._task = null;
    }
    valueChanged() {
        if (this._isActive && this._task === null) {
            this._task = this.p.domWriteQueue.queueTask(this.update);
        }
    }
}
__decorate([
    bindable
], Show.prototype, "value", void 0);
alias('hide')(Show);
customAttribute('show')(Show);

/**
 * Default HTML-specific (but environment-agnostic) implementations for the following interfaces:
 * - `ITemplateCompiler`
 * - `ITargetAccessorLocator`
 * - `ITargetObserverLocator`
 */
const DefaultComponents = [
    TemplateCompiler,
    runtime.DirtyChecker,
    NodeObserverLocator,
];
/**
 * Default binding syntax for the following attribute name patterns:
 * - `ref`
 * - `target.command` (dot-separated)
 */
const DefaultBindingSyntax = [
    exports.RefAttributePattern,
    exports.DotSeparatedAttributePattern,
    SpreadAttributePattern,
    EventAttributePattern,
    EventModifierRegistration,
];
/**
 * Binding syntax for short-hand attribute name patterns:
 * - `@target` (short-hand for `target.trigger`)
 * - `:target` (short-hand for `target.bind`)
 */
const ShortHandBindingSyntax = [
    exports.AtPrefixedTriggerAttributePattern,
    exports.ColonPrefixedBindAttributePattern
];
/**
 * Default HTML-specific (but environment-agnostic) binding commands:
 * - Property observation: `.bind`, `.one-time`, `.from-view`, `.to-view`, `.two-way
 * - Collection observation: `.for`
 * - Event listeners: `.trigger`, `.capture`
 */
const DefaultBindingLanguage = [
    exports.DefaultBindingCommand,
    exports.OneTimeBindingCommand,
    exports.FromViewBindingCommand,
    exports.ToViewBindingCommand,
    exports.TwoWayBindingCommand,
    exports.ForBindingCommand,
    RefBindingCommand,
    exports.TriggerBindingCommand,
    exports.CaptureBindingCommand,
    exports.ClassBindingCommand,
    exports.StyleBindingCommand,
    exports.AttrBindingCommand,
    SpreadBindingCommand,
];
/**
 * Default HTML-specific (but environment-agnostic) resources:
 * - Binding Behaviors: `oneTime`, `toView`, `fromView`, `twoWay`, `signal`, `debounce`, `throttle`, `attr`, `self`, `updateTrigger`
 * - Custom Elements: `au-compose`, `au-slot`
 * - Custom Attributes: `blur`, `focus`, `portal`
 * - Template controllers: `if`/`else`, `repeat`, `with`
 * - Value Converters: `sanitize`
 */
const DefaultResources = [
    DebounceBindingBehavior,
    OneTimeBindingBehavior,
    ToViewBindingBehavior,
    FromViewBindingBehavior,
    SignalBindingBehavior,
    ThrottleBindingBehavior,
    TwoWayBindingBehavior,
    SanitizeValueConverter,
    If,
    Else,
    Repeat,
    With,
    exports.Switch,
    exports.Case,
    exports.DefaultCase,
    exports.PromiseTemplateController,
    exports.PendingTemplateController,
    exports.FulfilledTemplateController,
    exports.RejectedTemplateController,
    // TODO: activate after the attribute parser and/or interpreter such that for `t`, `then` is not picked up.
    PromiseAttributePattern,
    FulfilledAttributePattern,
    RejectedAttributePattern,
    AttrBindingBehavior,
    SelfBindingBehavior,
    UpdateTriggerBindingBehavior,
    AuCompose,
    Portal,
    Focus,
    Show,
    exports.AuSlot,
];
/**
 * Default renderers for:
 * - PropertyBinding: `bind`, `one-time`, `to-view`, `from-view`, `two-way`
 * - IteratorBinding: `for`
 * - CallBinding: `call`
 * - RefBinding: `ref`
 * - InterpolationBinding: `${}`
 * - SetProperty
 * - `customElement` hydration
 * - `customAttribute` hydration
 * - `templateController` hydration
 * - `let` element hydration
 * - Listener Bindings: `trigger`, `capture`, `delegate`
 * - SetAttribute
 * - StyleProperty: `style`, `css`
 * - TextBinding: `${}`
 */
const DefaultRenderers = [
    exports.PropertyBindingRenderer,
    exports.IteratorBindingRenderer,
    exports.RefBindingRenderer,
    exports.InterpolationBindingRenderer,
    exports.SetPropertyRenderer,
    exports.CustomElementRenderer,
    exports.CustomAttributeRenderer,
    exports.TemplateControllerRenderer,
    exports.LetElementRenderer,
    exports.ListenerBindingRenderer,
    exports.AttributeBindingRenderer,
    exports.SetAttributeRenderer,
    exports.SetClassAttributeRenderer,
    exports.SetStyleAttributeRenderer,
    exports.StylePropertyBindingRenderer,
    exports.TextBindingRenderer,
    exports.SpreadRenderer,
];
const StandardConfiguration = /*@__PURE__*/ createConfiguration(kernel.noop);
function createConfiguration(optionsProvider) {
    return {
        optionsProvider,
        /**
         * Apply this configuration to the provided container.
         */
        register(container) {
            const runtimeConfigurationOptions = {
                coercingOptions: {
                    enableCoercion: false,
                    coerceNullish: false
                }
            };
            optionsProvider(runtimeConfigurationOptions);
            /**
             * Standard DI configuration containing html-specific (but environment-agnostic) registrations:
             * - `RuntimeConfiguration` from `@aurelia/runtime`
             * - `DefaultComponents`
             * - `DefaultResources`
             * - `DefaultRenderers`
             */
            return container.register(instanceRegistration(runtime.ICoercionConfiguration, runtimeConfigurationOptions.coercingOptions), ...DefaultComponents, ...DefaultResources, ...DefaultBindingSyntax, ...DefaultBindingLanguage, ...DefaultRenderers);
        },
        customize(cb) {
            return createConfiguration(cb ?? optionsProvider);
        },
    };
}

function children(configOrTarget, prop) {
    if (!mixed) {
        mixed = true;
        runtime.subscriberCollection(ChildrenBinding);
        lifecycleHooks()(ChildrenLifecycleHooks);
    }
    let config;
    const dependenciesKey = 'dependencies';
    function decorator($target, $prop, desc) {
        if (arguments.length > 1) {
            // Non invocation:
            // - @children
            // Invocation with or w/o opts:
            // - @children()
            // - @children({...opts})
            config.name = $prop;
        }
        if (typeof $target === 'function' || typeof desc?.value !== 'undefined') {
            throw createMappedError(9991 /* ErrorNames.children_decorator_invalid_usage */);
        }
        const target = $target.constructor;
        let dependencies = CustomElement.getAnnotation(target, dependenciesKey);
        if (dependencies == null) {
            CustomElement.annotate(target, dependenciesKey, dependencies = []);
        }
        dependencies.push(new ChildrenLifecycleHooks(config));
    }
    if (arguments.length > 1) {
        // Non invocation:
        // - @children
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    else if (isString(configOrTarget)) {
        // Direct call:
        // - @children('div')(Foo)
        config = {
            filter: (node) => isElement(node) && node.matches(configOrTarget),
            map: el => el
        };
        return decorator;
    }
    // Invocation with or w/o opts:
    // - @children()
    // - @children({...opts})
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}
/**
 * A binding for observing & notifying the children of a custom element.
 */
class ChildrenBinding {
    constructor(controller, obj, callback, query = defaultChildQuery, filter = defaultChildFilter, map = defaultChildMap, options = childObserverOptions) {
        /** @internal */
        this._children = (void 0);
        /** @internal */
        this._query = defaultChildQuery;
        /** @internal */
        this._filter = defaultChildFilter;
        /** @internal */
        this._map = defaultChildMap;
        this.isBound = false;
        this._controller = controller;
        this.obj = obj;
        this._callback = callback;
        this._query = query;
        this._filter = filter;
        this._map = map;
        this._options = options;
        this._observer = createMutationObserver(this._host = controller.host, () => {
            this._onChildrenChanged();
        });
    }
    getValue() {
        return this.isBound ? this._children : this._getNodes();
    }
    setValue(_value) { }
    bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this._observer.observe(this._host, this._options);
        this._children = this._getNodes();
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this._observer.disconnect();
        this._children = kernel.emptyArray;
    }
    /** @internal */
    _onChildrenChanged() {
        this._children = this._getNodes();
        this._callback?.call(this.obj);
        this.subs.notify(this._children, undefined);
    }
    get() {
        throw createMappedError(99 /* ErrorNames.method_not_implemented */, 'get');
    }
    /** @internal */
    // freshly retrieve the children everytime
    // in case this observer is not observing
    _getNodes() {
        return filterChildren(this._controller, this._query, this._filter, this._map);
    }
}
const childObserverOptions = { childList: true };
const defaultChildQuery = (controller) => controller.host.childNodes;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultChildFilter = (node, controller, viewModel) => 
// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
!!viewModel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultChildMap = (node, controller, viewModel) => viewModel;
const forOpts = { optional: true };
const filterChildren = (controller, query, filter, map
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => {
    const nodes = query(controller);
    const ii = nodes.length;
    const children = [];
    let node;
    let $controller;
    let viewModel;
    let i = 0;
    for (; i < ii; ++i) {
        node = nodes[i];
        $controller = findElementControllerFor(node, forOpts);
        viewModel = $controller?.viewModel ?? null;
        if (filter(node, $controller, viewModel)) {
            children.push(map(node, $controller, viewModel));
        }
    }
    return children;
};
class ChildrenLifecycleHooks {
    constructor(_def) {
        this._def = _def;
    }
    register(c) {
        instanceRegistration(ILifecycleHooks, this).register(c);
    }
    hydrating(vm, controller) {
        const $def = this._def;
        const childrenObserver = new ChildrenBinding(controller, vm, vm[$def.callback ?? `${safeString($def.name)}Changed`], $def.query ?? defaultChildQuery, $def.filter ?? defaultChildFilter, $def.map ?? defaultChildMap, $def.options ?? childObserverOptions);
        def(vm, $def.name, {
            enumerable: true,
            configurable: true,
            get: objectAssign(( /* ChildrenBinding */) => childrenObserver.getValue(), { getObserver: () => childrenObserver }),
            set: ( /* ChildrenBinding */) => {
                {
                    // eslint-disable-next-line no-console
                    console.warn(`[DEV:aurelia] property ${safeString($def.name)} decorated with @children is readonly`);
                }
            },
        });
        controller.addBinding(childrenObserver);
    }
}
let mixed = false;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;
exports.AppRoot = AppRoot;
exports.AppTask = AppTask;
exports.AttrBindingBehavior = AttrBindingBehavior;
exports.AttrSyntax = AttrSyntax;
exports.AttributeBinding = AttributeBinding;
exports.AttributeBindingInstruction = AttributeBindingInstruction;
exports.AttributeNSAccessor = AttributeNSAccessor;
exports.AttributePattern = AttributePattern;
exports.AuCompose = AuCompose;
exports.AuSlotsInfo = AuSlotsInfo;
exports.Aurelia = Aurelia;
exports.Bindable = Bindable;
exports.BindableDefinition = BindableDefinition;
exports.BindablesInfo = BindablesInfo;
exports.BindingBehavior = BindingBehavior;
exports.BindingBehaviorDefinition = BindingBehaviorDefinition;
exports.BindingCommand = BindingCommand;
exports.BindingCommandDefinition = BindingCommandDefinition;
exports.BindingMode = BindingMode;
exports.BindingModeBehavior = BindingModeBehavior;
exports.BindingTargetSubscriber = BindingTargetSubscriber;
exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;
exports.CheckedObserver = CheckedObserver;
exports.ChildrenBinding = ChildrenBinding;
exports.ClassAttributeAccessor = ClassAttributeAccessor;
exports.ComputedWatcher = ComputedWatcher;
exports.ContentBinding = ContentBinding;
exports.Controller = Controller;
exports.CustomAttribute = CustomAttribute;
exports.CustomAttributeDefinition = CustomAttributeDefinition;
exports.CustomElement = CustomElement;
exports.CustomElementDefinition = CustomElementDefinition;
exports.DataAttributeAccessor = DataAttributeAccessor;
exports.DebounceBindingBehavior = DebounceBindingBehavior;
exports.DefaultBindingLanguage = DefaultBindingLanguage;
exports.DefaultBindingSyntax = DefaultBindingSyntax;
exports.DefaultComponents = DefaultComponents;
exports.DefaultRenderers = DefaultRenderers;
exports.DefaultResources = DefaultResources;
exports.Else = Else;
exports.EventModifier = EventModifier;
exports.EventModifierRegistration = EventModifierRegistration;
exports.ExpressionWatcher = ExpressionWatcher;
exports.FlushQueue = FlushQueue;
exports.Focus = Focus;
exports.FragmentNodeSequence = FragmentNodeSequence;
exports.FromViewBindingBehavior = FromViewBindingBehavior;
exports.HydrateAttributeInstruction = HydrateAttributeInstruction;
exports.HydrateElementInstruction = HydrateElementInstruction;
exports.HydrateLetElementInstruction = HydrateLetElementInstruction;
exports.HydrateTemplateController = HydrateTemplateController;
exports.IAppRoot = IAppRoot;
exports.IAppTask = IAppTask;
exports.IAttrMapper = IAttrMapper;
exports.IAttributeParser = IAttributeParser;
exports.IAttributePattern = IAttributePattern;
exports.IAuSlotWatcher = IAuSlotWatcher;
exports.IAuSlotsInfo = IAuSlotsInfo;
exports.IAurelia = IAurelia;
exports.IController = IController;
exports.IEventModifier = IEventModifier;
exports.IEventTarget = IEventTarget;
exports.IFlushQueue = IFlushQueue;
exports.IHistory = IHistory;
exports.IHydrationContext = IHydrationContext;
exports.IInstruction = IInstruction;
exports.IKeyMapping = IKeyMapping;
exports.ILifecycleHooks = ILifecycleHooks;
exports.IListenerBindingOptions = IListenerBindingOptions;
exports.ILocation = ILocation;
exports.IModifiedEventHandlerCreator = IModifiedEventHandlerCreator;
exports.INode = INode;
exports.IPlatform = IPlatform;
exports.IRenderLocation = IRenderLocation;
exports.IRenderer = IRenderer;
exports.IRendering = IRendering;
exports.ISVGAnalyzer = ISVGAnalyzer;
exports.ISanitizer = ISanitizer;
exports.IShadowDOMGlobalStyles = IShadowDOMGlobalStyles;
exports.IShadowDOMStyleFactory = IShadowDOMStyleFactory;
exports.IShadowDOMStyles = IShadowDOMStyles;
exports.ISyntaxInterpreter = ISyntaxInterpreter;
exports.ITemplateCompiler = ITemplateCompiler;
exports.ITemplateCompilerHooks = ITemplateCompilerHooks;
exports.ITemplateElementFactory = ITemplateElementFactory;
exports.IViewFactory = IViewFactory;
exports.IWindow = IWindow;
exports.If = If;
exports.InstructionType = InstructionType;
exports.InterpolationBinding = InterpolationBinding;
exports.InterpolationInstruction = InterpolationInstruction;
exports.InterpolationPartBinding = InterpolationPartBinding;
exports.Interpretation = Interpretation;
exports.IteratorBindingInstruction = IteratorBindingInstruction;
exports.LetBinding = LetBinding;
exports.LetBindingInstruction = LetBindingInstruction;
exports.LifecycleHooks = LifecycleHooks;
exports.LifecycleHooksDefinition = LifecycleHooksDefinition;
exports.LifecycleHooksEntry = LifecycleHooksEntry;
exports.ListenerBinding = ListenerBinding;
exports.ListenerBindingInstruction = ListenerBindingInstruction;
exports.ListenerBindingOptions = ListenerBindingOptions;
exports.MultiAttrInstruction = MultiAttrInstruction;
exports.NodeObserverLocator = NodeObserverLocator;
exports.NoopSVGAnalyzer = NoopSVGAnalyzer;
exports.OneTimeBindingBehavior = OneTimeBindingBehavior;
exports.Portal = Portal;
exports.PropertyBinding = PropertyBinding;
exports.PropertyBindingInstruction = PropertyBindingInstruction;
exports.RefBinding = RefBinding;
exports.RefBindingInstruction = RefBindingInstruction;
exports.Rendering = Rendering;
exports.Repeat = Repeat;
exports.SVGAnalyzer = SVGAnalyzer;
exports.SanitizeValueConverter = SanitizeValueConverter;
exports.SelectValueObserver = SelectValueObserver;
exports.SelfBindingBehavior = SelfBindingBehavior;
exports.SetAttributeInstruction = SetAttributeInstruction;
exports.SetClassAttributeInstruction = SetClassAttributeInstruction;
exports.SetPropertyInstruction = SetPropertyInstruction;
exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;
exports.ShadowDOMRegistry = ShadowDOMRegistry;
exports.ShortHandBindingSyntax = ShortHandBindingSyntax;
exports.SignalBindingBehavior = SignalBindingBehavior;
exports.SpreadBindingInstruction = SpreadBindingInstruction;
exports.SpreadElementPropBindingInstruction = SpreadElementPropBindingInstruction;
exports.StandardConfiguration = StandardConfiguration;
exports.State = State;
exports.StyleAttributeAccessor = StyleAttributeAccessor;
exports.StyleConfiguration = StyleConfiguration;
exports.StyleElementStyles = StyleElementStyles;
exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;
exports.TemplateCompiler = TemplateCompiler;
exports.TemplateCompilerHooks = TemplateCompilerHooks;
exports.TextBindingInstruction = TextBindingInstruction;
exports.ThrottleBindingBehavior = ThrottleBindingBehavior;
exports.ToViewBindingBehavior = ToViewBindingBehavior;
exports.TwoWayBindingBehavior = TwoWayBindingBehavior;
exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;
exports.ValueAttributeObserver = ValueAttributeObserver;
exports.ValueConverter = ValueConverter;
exports.ValueConverterDefinition = ValueConverterDefinition;
exports.ViewFactory = ViewFactory;
exports.Watch = Watch;
exports.With = With;
exports.alias = alias;
exports.attributePattern = attributePattern;
exports.bindable = bindable;
exports.bindingBehavior = bindingBehavior;
exports.bindingCommand = bindingCommand;
exports.capture = capture;
exports.children = children;
exports.coercer = coercer;
exports.containerless = containerless;
exports.convertToRenderLocation = convertToRenderLocation;
exports.cssModules = cssModules;
exports.customAttribute = customAttribute;
exports.customElement = customElement;
exports.getEffectiveParentNode = getEffectiveParentNode;
exports.getRef = getRef;
exports.isCustomElementController = isCustomElementController;
exports.isCustomElementViewModel = isCustomElementViewModel;
exports.isInstruction = isInstruction;
exports.isRenderLocation = isRenderLocation;
exports.lifecycleHooks = lifecycleHooks;
exports.mixinAstEvaluator = mixinAstEvaluator;
exports.mixinUseScope = mixinUseScope;
exports.mixingBindingLimited = mixingBindingLimited;
exports.processContent = processContent;
exports.registerAliases = registerAliases;
exports.renderer = renderer;
exports.setEffectiveParentNode = setEffectiveParentNode;
exports.setRef = setRef;
exports.shadowCSS = shadowCSS;
exports.slotted = slotted;
exports.templateCompilerHooks = templateCompilerHooks;
exports.templateController = templateController;
exports.useShadowDOM = useShadowDOM;
exports.valueConverter = valueConverter;
exports.watch = watch;
//# sourceMappingURL=index.dev.cjs.map
