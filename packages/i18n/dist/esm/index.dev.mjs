import { DI, IEventAggregator, toArray, camelCase, Registration } from '@aurelia/kernel';
import { bindingBehavior, valueConverter, mixinAstEvaluator, mixingBindingLimited, CustomElement, attributePattern, bindingCommand, renderer, AttrSyntax, AttributePattern, BindingCommand, AppTask } from '@aurelia/runtime-html';
import { ValueConverterExpression, ISignaler, connectable, CustomExpression, Interpolation, astEvaluate, astUnbind, astBind } from '@aurelia/runtime';
import i18next from 'i18next';

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

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

var Signals;
(function (Signals) {
    Signals["I18N_EA_CHANNEL"] = "i18n:locale:changed";
    Signals["I18N_SIGNAL"] = "aurelia-translation-signal";
    Signals["RT_SIGNAL"] = "aurelia-relativetime-signal";
})(Signals || (Signals = {}));
var ValueConverters;
(function (ValueConverters) {
    ValueConverters["translationValueConverterName"] = "t";
    ValueConverters["dateFormatValueConverterName"] = "df";
    ValueConverters["numberFormatValueConverterName"] = "nf";
    ValueConverters["relativeTimeValueConverterName"] = "rt";
})(ValueConverters || (ValueConverters = {}));
function createIntlFormatValueConverterExpression(name, binding) {
    const expression = binding.ast.expression;
    if (!(expression instanceof ValueConverterExpression)) {
        const vcExpression = new ValueConverterExpression(expression, name, binding.ast.args);
        binding.ast.expression = vcExpression;
    }
}

let DateFormatBindingBehavior = class DateFormatBindingBehavior {
    bind(_scope, binding) {
        createIntlFormatValueConverterExpression("df", binding);
    }
};
DateFormatBindingBehavior = __decorate([
    bindingBehavior("df")
], DateFormatBindingBehavior);

const I18nInitOptions = DI.createInterface('I18nInitOptions');

const I18nWrapper = DI.createInterface('I18nextWrapper');
class I18nextWrapper {
    constructor() {
        this.i18next = i18next;
    }
}

var TimeSpan;
(function (TimeSpan) {
    TimeSpan[TimeSpan["Second"] = 1000] = "Second";
    TimeSpan[TimeSpan["Minute"] = 60000] = "Minute";
    TimeSpan[TimeSpan["Hour"] = 3600000] = "Hour";
    TimeSpan[TimeSpan["Day"] = 86400000] = "Day";
    TimeSpan[TimeSpan["Week"] = 604800000] = "Week";
    TimeSpan[TimeSpan["Month"] = 2592000000] = "Month";
    TimeSpan[TimeSpan["Year"] = 31536000000] = "Year";
})(TimeSpan || (TimeSpan = {}));
class I18nKeyEvaluationResult {
    constructor(keyExpr) {
        this.value = (void 0);
        const re = /\[([a-z\-, ]*)\]/ig;
        this.attributes = [];
        const matches = re.exec(keyExpr);
        if (matches) {
            keyExpr = keyExpr.replace(matches[0], '');
            this.attributes = matches[1].split(',');
        }
        this.key = keyExpr;
    }
}
const I18N = DI.createInterface('I18N');
let I18nService = class I18nService {
    constructor(i18nextWrapper, options, ea, signaler) {
        this.ea = ea;
        this._localeSubscribers = new Set();
        this.i18next = i18nextWrapper.i18next;
        this.initPromise = this._initializeI18next(options);
        this._signaler = signaler;
    }
    evaluate(keyExpr, options) {
        const parts = keyExpr.split(';');
        const results = [];
        for (const part of parts) {
            const result = new I18nKeyEvaluationResult(part);
            const key = result.key;
            const translation = this.tr(key, options);
            if (this.options.skipTranslationOnMissingKey && translation === key) {
                console.warn(`Couldn't find translation for key: ${key}`);
            }
            else {
                result.value = translation;
                results.push(result);
            }
        }
        return results;
    }
    tr(key, options) {
        return this.i18next.t(key, options);
    }
    getLocale() {
        return this.i18next.language;
    }
    async setLocale(newLocale) {
        const oldLocale = this.getLocale();
        const locales = { oldLocale, newLocale };
        await this.i18next.changeLanguage(newLocale);
        this.ea.publish("i18n:locale:changed", locales);
        this._localeSubscribers.forEach(sub => sub.handleLocaleChange(locales));
        this._signaler.dispatchSignal("aurelia-translation-signal");
    }
    createNumberFormat(options, locales) {
        return Intl.NumberFormat(locales || this.getLocale(), options);
    }
    nf(input, options, locales) {
        return this.createNumberFormat(options, locales).format(input);
    }
    createDateTimeFormat(options, locales) {
        return Intl.DateTimeFormat(locales || this.getLocale(), options);
    }
    df(input, options, locales) {
        return this.createDateTimeFormat(options, locales).format(input);
    }
    uf(numberLike, locale) {
        const comparer = this.nf(10000 / 3, undefined, locale);
        let thousandSeparator = comparer[1];
        const decimalSeparator = comparer[5];
        if (thousandSeparator === '.') {
            thousandSeparator = '\\.';
        }
        const result = numberLike.replace(new RegExp(thousandSeparator, 'g'), '')
            .replace(/[^\d.,-]/g, '')
            .replace(decimalSeparator, '.');
        return Number(result);
    }
    createRelativeTimeFormat(options, locales) {
        return new Intl.RelativeTimeFormat(locales || this.getLocale(), options);
    }
    rt(input, options, locales) {
        let difference = input.getTime() - this.now();
        const epsilon = this.options.rtEpsilon * (difference > 0 ? 1 : 0);
        const formatter = this.createRelativeTimeFormat(options, locales);
        let value = difference / 31536000000;
        if (Math.abs(value + epsilon) >= 1) {
            return formatter.format(Math.round(value), 'year');
        }
        value = difference / 2592000000;
        if (Math.abs(value + epsilon) >= 1) {
            return formatter.format(Math.round(value), 'month');
        }
        value = difference / 604800000;
        if (Math.abs(value + epsilon) >= 1) {
            return formatter.format(Math.round(value), 'week');
        }
        value = difference / 86400000;
        if (Math.abs(value + epsilon) >= 1) {
            return formatter.format(Math.round(value), 'day');
        }
        value = difference / 3600000;
        if (Math.abs(value + epsilon) >= 1) {
            return formatter.format(Math.round(value), 'hour');
        }
        value = difference / 60000;
        if (Math.abs(value + epsilon) >= 1) {
            return formatter.format(Math.round(value), 'minute');
        }
        difference = Math.abs(difference) < 1000 ? 1000 : difference;
        value = difference / 1000;
        return formatter.format(Math.round(value), 'second');
    }
    subscribeLocaleChange(subscriber) {
        this._localeSubscribers.add(subscriber);
    }
    now() {
        return new Date().getTime();
    }
    async _initializeI18next(options) {
        const defaultOptions = {
            lng: 'en',
            fallbackLng: ['en'],
            debug: false,
            plugins: [],
            rtEpsilon: 0.01,
            skipTranslationOnMissingKey: false,
        };
        this.options = { ...defaultOptions, ...options };
        for (const plugin of this.options.plugins) {
            this.i18next.use(plugin);
        }
        await this.i18next.init(this.options);
    }
};
I18nService = __decorate([
    __param(0, I18nWrapper),
    __param(1, I18nInitOptions),
    __param(2, IEventAggregator),
    __param(3, ISignaler)
], I18nService);

let DateFormatValueConverter = class DateFormatValueConverter {
    constructor(i18n) {
        this.i18n = i18n;
        this.signals = ["aurelia-translation-signal"];
    }
    toView(value, options, locale) {
        if ((!value && value !== 0) || (typeof value === 'string' && value.trim() === '')) {
            return value;
        }
        if (typeof value === 'string') {
            const numValue = Number(value);
            const tempDate = new Date(Number.isInteger(numValue) ? numValue : value);
            if (isNaN(tempDate.getTime())) {
                return value;
            }
            value = tempDate;
        }
        return this.i18n.df(value, options, locale);
    }
};
DateFormatValueConverter = __decorate([
    valueConverter("df"),
    __param(0, I18N)
], DateFormatValueConverter);

let NumberFormatBindingBehavior = class NumberFormatBindingBehavior {
    bind(_scope, binding) {
        createIntlFormatValueConverterExpression("nf", binding);
    }
};
NumberFormatBindingBehavior = __decorate([
    bindingBehavior("nf")
], NumberFormatBindingBehavior);

let NumberFormatValueConverter = class NumberFormatValueConverter {
    constructor(i18n) {
        this.i18n = i18n;
        this.signals = ["aurelia-translation-signal"];
    }
    toView(value, options, locale) {
        if (typeof value !== 'number') {
            return value;
        }
        return this.i18n.nf(value, options, locale);
    }
};
NumberFormatValueConverter = __decorate([
    valueConverter("nf"),
    __param(0, I18N)
], NumberFormatValueConverter);

let RelativeTimeBindingBehavior = class RelativeTimeBindingBehavior {
    bind(_scope, binding) {
        createIntlFormatValueConverterExpression("rt", binding);
    }
};
RelativeTimeBindingBehavior = __decorate([
    bindingBehavior("rt")
], RelativeTimeBindingBehavior);

let RelativeTimeValueConverter = class RelativeTimeValueConverter {
    constructor(i18n) {
        this.i18n = i18n;
        this.signals = ["aurelia-translation-signal", "aurelia-relativetime-signal"];
    }
    toView(value, options, locale) {
        if (!(value instanceof Date)) {
            return value;
        }
        return this.i18n.rt(value, options, locale);
    }
};
RelativeTimeValueConverter = __decorate([
    valueConverter("rt"),
    __param(0, I18N)
], RelativeTimeValueConverter);

let TranslationBindingBehavior = class TranslationBindingBehavior {
    bind(_scope, binding) {
        const expression = binding.ast.expression;
        if (!(expression instanceof ValueConverterExpression)) {
            const vcExpression = new ValueConverterExpression(expression, "t", binding.ast.args);
            binding.ast.expression = vcExpression;
        }
    }
};
TranslationBindingBehavior = __decorate([
    bindingBehavior("t")
], TranslationBindingBehavior);

const contentAttributes = ['textContent', 'innerHTML', 'prepend', 'append'];
const attributeAliases = new Map([['text', 'textContent'], ['html', 'innerHTML']]);
const forOpts = { optional: true };
const taskQueueOpts = {
    reusable: false,
    preempt: true,
};
class TranslationBinding {
    constructor(controller, locator, observerLocator, platform, target) {
        this.isBound = false;
        this._contentAttributes = contentAttributes;
        this._task = null;
        this.parameter = null;
        this.boundFn = false;
        this.l = locator;
        this._controller = controller;
        this.target = target;
        this.i18n = locator.get(I18N);
        this._platform = platform;
        this._targetAccessors = new Set();
        this.oL = observerLocator;
        this.i18n.subscribeLocaleChange(this);
        this._taskQueue = platform.domWriteQueue;
    }
    static create({ parser, observerLocator, context, controller, target, instruction, platform, isParameterContext, }) {
        const binding = this._getBinding({ observerLocator, context, controller, target, platform });
        const expr = typeof instruction.from === 'string'
            ? parser.parse(instruction.from, 16)
            : instruction.from;
        if (isParameterContext) {
            binding.useParameter(expr);
        }
        else {
            const interpolation = expr instanceof CustomExpression ? parser.parse(expr.value, 1) : undefined;
            binding.ast = interpolation || expr;
        }
    }
    static _getBinding({ observerLocator, context, controller, target, platform, }) {
        let binding = controller.bindings && controller.bindings.find((b) => b instanceof TranslationBinding && b.target === target);
        if (!binding) {
            binding = new TranslationBinding(controller, context, observerLocator, platform, target);
            controller.addBinding(binding);
        }
        return binding;
    }
    bind(_scope) {
        if (this.isBound) {
            return;
        }
        if (!this.ast) {
            throw new Error('key expression is missing');
        }
        this._scope = _scope;
        this._isInterpolation = this.ast instanceof Interpolation;
        this._keyExpression = astEvaluate(this.ast, _scope, this, this);
        this._ensureKeyExpression();
        this.parameter?.bind(_scope);
        this.updateTranslations();
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        astUnbind(this.ast, this._scope, this);
        this.parameter?.unbind();
        this._targetAccessors.clear();
        if (this._task !== null) {
            this._task.cancel();
            this._task = null;
        }
        this._scope = (void 0);
        this.obs.clearAll();
    }
    handleChange(newValue, _previousValue) {
        this.obs.version++;
        this._keyExpression = this._isInterpolation
            ? astEvaluate(this.ast, this._scope, this, this)
            : newValue;
        this.obs.clear();
        this._ensureKeyExpression();
        this.updateTranslations();
    }
    handleLocaleChange() {
        this.updateTranslations();
    }
    useParameter(expr) {
        if (this.parameter != null) {
            throw new Error('This translation parameter has already been specified.');
        }
        this.parameter = new ParameterBinding(this, expr, () => this.updateTranslations());
    }
    updateTranslations() {
        const results = this.i18n.evaluate(this._keyExpression, this.parameter?.value);
        const content = Object.create(null);
        const accessorUpdateTasks = [];
        const task = this._task;
        this._targetAccessors.clear();
        for (const item of results) {
            const value = item.value;
            const attributes = this._preprocessAttributes(item.attributes);
            for (const attribute of attributes) {
                if (this._isContentAttribute(attribute)) {
                    content[attribute] = value;
                }
                else {
                    const controller = CustomElement.for(this.target, forOpts);
                    const accessor = controller?.viewModel
                        ? this.oL.getAccessor(controller.viewModel, attribute)
                        : this.oL.getAccessor(this.target, attribute);
                    const shouldQueueUpdate = this._controller.state !== 1 && (accessor.type & 4) > 0;
                    if (shouldQueueUpdate) {
                        accessorUpdateTasks.push(new AccessorUpdateTask(accessor, value, this.target, attribute));
                    }
                    else {
                        accessor.setValue(value, this.target, attribute);
                    }
                    this._targetAccessors.add(accessor);
                }
            }
        }
        let shouldQueueContent = false;
        if (Object.keys(content).length > 0) {
            shouldQueueContent = this._controller.state !== 1;
            if (!shouldQueueContent) {
                this._updateContent(content);
            }
        }
        if (accessorUpdateTasks.length > 0 || shouldQueueContent) {
            this._task = this._taskQueue.queueTask(() => {
                this._task = null;
                for (const updateTask of accessorUpdateTasks) {
                    updateTask.run();
                }
                if (shouldQueueContent) {
                    this._updateContent(content);
                }
            }, taskQueueOpts);
        }
        task?.cancel();
    }
    _preprocessAttributes(attributes) {
        if (attributes.length === 0) {
            attributes = this.target.tagName === 'IMG' ? ['src'] : ['textContent'];
        }
        for (const [alias, attribute] of attributeAliases) {
            const aliasIndex = attributes.findIndex((attr) => attr === alias);
            if (aliasIndex > -1) {
                attributes.splice(aliasIndex, 1, attribute);
            }
        }
        return attributes;
    }
    _isContentAttribute(attribute) {
        return this._contentAttributes.includes(attribute);
    }
    _updateContent(content) {
        const children = toArray(this.target.childNodes);
        const fallBackContents = [];
        const marker = 'au-i18n';
        for (const child of children) {
            if (!Reflect.get(child, marker)) {
                fallBackContents.push(child);
            }
        }
        const template = this._prepareTemplate(content, marker, fallBackContents);
        this.target.innerHTML = '';
        for (const child of toArray(template.content.childNodes)) {
            this.target.appendChild(child);
        }
    }
    _prepareTemplate(content, marker, fallBackContents) {
        const template = this._platform.document.createElement('template');
        this._addContentToTemplate(template, content.prepend, marker);
        if (!this._addContentToTemplate(template, content.innerHTML ?? content.textContent, marker)) {
            for (const fallbackContent of fallBackContents) {
                template.content.append(fallbackContent);
            }
        }
        this._addContentToTemplate(template, content.append, marker);
        return template;
    }
    _addContentToTemplate(template, content, marker) {
        if (content !== void 0 && content !== null) {
            const parser = this._platform.document.createElement('div');
            parser.innerHTML = content;
            for (const child of toArray(parser.childNodes)) {
                Reflect.set(child, marker, true);
                template.content.append(child);
            }
            return true;
        }
        return false;
    }
    _ensureKeyExpression() {
        const expr = this._keyExpression ?? (this._keyExpression = '');
        const exprType = typeof expr;
        if (exprType !== 'string') {
            throw new Error(`Expected the i18n key to be a string, but got ${expr} of type ${exprType}`);
        }
    }
}
connectable(TranslationBinding);
mixinAstEvaluator(true)(TranslationBinding);
mixingBindingLimited(TranslationBinding, () => 'updateTranslations');
class AccessorUpdateTask {
    constructor(accessor, v, el, attr) {
        this.accessor = accessor;
        this.v = v;
        this.el = el;
        this.attr = attr;
    }
    run() {
        this.accessor.setValue(this.v, this.el, this.attr);
    }
}
class ParameterBinding {
    constructor(owner, ast, updater) {
        this.owner = owner;
        this.ast = ast;
        this.updater = updater;
        this.isBound = false;
        this.boundFn = false;
        this.oL = owner.oL;
        this.l = owner.l;
    }
    handleChange(_newValue, _previousValue) {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        this.value = astEvaluate(this.ast, this._scope, this, this);
        this.obs.clear();
        this.updater();
    }
    bind(_scope) {
        if (this.isBound) {
            return;
        }
        this._scope = _scope;
        astBind(this.ast, _scope, this);
        this.value = astEvaluate(this.ast, _scope, this, this);
        this.isBound = true;
    }
    unbind() {
        if (!this.isBound) {
            return;
        }
        astUnbind(this.ast, this._scope, this);
        this._scope = (void 0);
        this.obs.clearAll();
    }
}
connectable(ParameterBinding);
mixinAstEvaluator(true)(ParameterBinding);

const TranslationParametersInstructionType = 'tpt';
const attribute = 't-params.bind';
let TranslationParametersAttributePattern = class TranslationParametersAttributePattern {
    [attribute](rawName, rawValue, _parts) {
        return new AttrSyntax(rawName, rawValue, '', attribute);
    }
};
TranslationParametersAttributePattern = __decorate([
    attributePattern({ pattern: attribute, symbols: '' })
], TranslationParametersAttributePattern);
class TranslationParametersBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = TranslationParametersInstructionType;
        this.mode = 2;
    }
}
let TranslationParametersBindingCommand = class TranslationParametersBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() { return attribute; }
    build(info, exprParser, attrMapper) {
        const attr = info.attr;
        let target = attr.target;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, target)
                ?? camelCase(target);
        }
        else {
            target = info.bindable.property;
        }
        return new TranslationParametersBindingInstruction(exprParser.parse(attr.rawValue, 16), target);
    }
};
TranslationParametersBindingCommand = __decorate([
    bindingCommand(attribute)
], TranslationParametersBindingCommand);
let TranslationParametersBindingRenderer = class TranslationParametersBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        TranslationBinding.create({
            parser: exprParser,
            observerLocator,
            context: renderingCtrl.container,
            controller: renderingCtrl,
            target,
            instruction,
            isParameterContext: true,
            platform,
        });
    }
};
TranslationParametersBindingRenderer = __decorate([
    renderer(TranslationParametersInstructionType)
], TranslationParametersBindingRenderer);

const TranslationInstructionType = 'tt';
class TranslationAttributePattern {
    static registerAlias(alias) {
        this.prototype[alias] = function (rawName, rawValue, parts) {
            return new AttrSyntax(rawName, rawValue, '', alias);
        };
    }
}
class TranslationBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = TranslationInstructionType;
        this.mode = 2;
    }
}
class TranslationBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() { return 't'; }
    build(info, parser, attrMapper) {
        let target;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, info.attr.target)
                ?? camelCase(info.attr.target);
        }
        else {
            target = info.bindable.property;
        }
        return new TranslationBindingInstruction(new CustomExpression(info.attr.rawValue), target);
    }
}
let TranslationBindingRenderer = class TranslationBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        TranslationBinding.create({
            parser: exprParser,
            observerLocator,
            context: renderingCtrl.container,
            controller: renderingCtrl,
            target,
            instruction,
            platform,
        });
    }
};
TranslationBindingRenderer = __decorate([
    renderer(TranslationInstructionType)
], TranslationBindingRenderer);
const TranslationBindInstructionType = 'tbt';
class TranslationBindAttributePattern {
    static registerAlias(alias) {
        const bindPattern = `${alias}.bind`;
        this.prototype[bindPattern] = function (rawName, rawValue, parts) {
            return new AttrSyntax(rawName, rawValue, parts[1], bindPattern);
        };
    }
}
class TranslationBindBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.type = TranslationBindInstructionType;
        this.mode = 2;
    }
}
class TranslationBindBindingCommand {
    constructor() {
        this.type = 0;
    }
    get name() { return 't-bind'; }
    build(info, exprParser, attrMapper) {
        let target;
        if (info.bindable == null) {
            target = attrMapper.map(info.node, info.attr.target)
                ?? camelCase(info.attr.target);
        }
        else {
            target = info.bindable.property;
        }
        return new TranslationBindBindingInstruction(exprParser.parse(info.attr.rawValue, 16), target);
    }
}
let TranslationBindBindingRenderer = class TranslationBindBindingRenderer {
    render(renderingCtrl, target, instruction, platform, exprParser, observerLocator) {
        TranslationBinding.create({
            parser: exprParser,
            observerLocator,
            context: renderingCtrl.container,
            controller: renderingCtrl,
            target,
            instruction,
            platform
        });
    }
};
TranslationBindBindingRenderer = __decorate([
    renderer(TranslationBindInstructionType)
], TranslationBindBindingRenderer);

let TranslationValueConverter = class TranslationValueConverter {
    constructor(i18n) {
        this.i18n = i18n;
        this.signals = ["aurelia-translation-signal"];
    }
    toView(value, options) {
        return this.i18n.tr(value, options);
    }
};
TranslationValueConverter = __decorate([
    valueConverter("t"),
    __param(0, I18N)
], TranslationValueConverter);

const translation = [
    TranslationValueConverter,
    TranslationBindingBehavior,
];
function coreComponents(options) {
    const configuredAliases = options.translationAttributeAliases;
    const aliases = Array.isArray(configuredAliases) ? configuredAliases : ['t'];
    const patterns = [];
    const bindPatterns = [];
    const commandAliases = [];
    const bindCommandAliases = [];
    for (const alias of aliases) {
        const bindAlias = `${alias}.bind`;
        patterns.push({ pattern: alias, symbols: '' });
        TranslationAttributePattern.registerAlias(alias);
        bindPatterns.push({ pattern: bindAlias, symbols: '.' });
        TranslationBindAttributePattern.registerAlias(alias);
        if (alias !== 't') {
            commandAliases.push(alias);
            bindCommandAliases.push(bindAlias);
        }
    }
    const renderers = [
        AttributePattern.define(patterns, TranslationAttributePattern),
        BindingCommand.define({ name: 't', aliases: commandAliases }, TranslationBindingCommand),
        TranslationBindingRenderer,
        AttributePattern.define(bindPatterns, TranslationBindAttributePattern),
        BindingCommand.define({ name: 't.bind', aliases: bindCommandAliases }, TranslationBindBindingCommand),
        TranslationBindBindingRenderer,
        TranslationParametersAttributePattern,
        TranslationParametersBindingCommand,
        TranslationParametersBindingRenderer
    ];
    return {
        register(container) {
            return container.register(Registration.callback(I18nInitOptions, () => options.initOptions), AppTask.activating(I18N, i18n => i18n.initPromise), Registration.singleton(I18nWrapper, I18nextWrapper), Registration.singleton(I18N, I18nService), ...renderers, ...translation);
        }
    };
}
const dateFormat = [
    DateFormatValueConverter,
    DateFormatBindingBehavior,
];
const numberFormat = [
    NumberFormatValueConverter,
    NumberFormatBindingBehavior,
];
const relativeTimeFormat = [
    RelativeTimeValueConverter,
    RelativeTimeBindingBehavior,
];
function createI18nConfiguration(optionsProvider) {
    return {
        optionsProvider,
        register(container) {
            const options = { initOptions: Object.create(null) };
            optionsProvider(options);
            return container.register(coreComponents(options), ...dateFormat, ...numberFormat, ...relativeTimeFormat);
        },
        customize(cb) {
            return createI18nConfiguration(cb || optionsProvider);
        },
    };
}
const I18nConfiguration = createI18nConfiguration(() => { });

export { DateFormatBindingBehavior, DateFormatValueConverter, I18N, I18nConfiguration, I18nInitOptions, I18nKeyEvaluationResult, I18nService, NumberFormatBindingBehavior, NumberFormatValueConverter, RelativeTimeBindingBehavior, RelativeTimeValueConverter, Signals, TranslationAttributePattern, TranslationBindAttributePattern, TranslationBindBindingCommand, TranslationBindBindingInstruction, TranslationBindBindingRenderer, TranslationBindInstructionType, TranslationBinding, TranslationBindingBehavior, TranslationBindingCommand, TranslationBindingInstruction, TranslationBindingRenderer, TranslationInstructionType, TranslationParametersAttributePattern, TranslationParametersBindingCommand, TranslationParametersBindingInstruction, TranslationParametersBindingRenderer, TranslationParametersInstructionType, TranslationValueConverter };
//# sourceMappingURL=index.dev.mjs.map
