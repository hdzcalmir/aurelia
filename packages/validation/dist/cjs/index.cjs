"use strict";

var e = require("@aurelia/kernel");

var t = require("@aurelia/metadata");

var s = require("@aurelia/runtime");

var r = require("@aurelia/runtime-html");

function _interopNamespaceDefault(e) {
    var t = Object.create(null);
    if (e) {
        for (var s in e) {
            t[s] = e[s];
        }
    }
    t.default = e;
    return Object.freeze(t);
}

var i = /*#__PURE__*/ _interopNamespaceDefault(s);

const n = /*@__PURE__*/ e.DI.createInterface("IValidationExpressionHydrator");

function __decorate(e, t, s, r) {
    var i = arguments.length, n = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, s) : r, a;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") n = Reflect.decorate(e, t, s, r); else for (var o = e.length - 1; o >= 0; o--) if (a = e[o]) n = (i < 3 ? a(n) : i > 3 ? a(t, s, n) : a(t, s)) || n;
    return i > 3 && n && Object.defineProperty(t, s, n), n;
}

function __param(e, t) {
    return function(s, r) {
        t(s, r, e);
    };
}

const a = /*@__PURE__*/ e.DI.createInterface("IValidationMessageProvider");

const o = Object.freeze({
    aliasKey: e.Protocol.annotation.keyFor("validation-rule-alias-message"),
    define(e, t) {
        o.setDefaultMessage(e, t);
        return e;
    },
    setDefaultMessage(s, {aliases: r}, i = true) {
        const n = i ? t.Metadata.getOwn(this.aliasKey, s.prototype) : void 0;
        if (n !== void 0) {
            const t = {
                ...Object.fromEntries(n.map((({name: e, defaultMessage: t}) => [ e, t ]))),
                ...Object.fromEntries(r.map((({name: e, defaultMessage: t}) => [ e, t ])))
            };
            r = e.toArray(Object.entries(t)).map((([e, t]) => ({
                name: e,
                defaultMessage: t
            })));
        }
        t.Metadata.define(o.aliasKey, r, s instanceof Function ? s.prototype : s);
    },
    getDefaultMessages(e) {
        return t.Metadata.get(this.aliasKey, e instanceof Function ? e.prototype : e);
    }
});

function validationRule(e) {
    return function(t) {
        return o.define(t, e);
    };
}

exports.BaseValidationRule = class BaseValidationRule {
    constructor(e = void 0) {
        this.messageKey = e;
        this.tag = void 0;
    }
    canExecute(e) {
        return true;
    }
    execute(e, t) {
        throw new Error("No base implementation of execute. Did you forget to implement the execute method?");
    }
    accept(e) {
        throw new Error("No base implementation of accept. Did you forget to implement the accept method?");
    }
};

exports.BaseValidationRule.$TYPE = "";

exports.BaseValidationRule = __decorate([ validationRule({
    aliases: [ {
        name: void 0,
        defaultMessage: `\${$displayName} is invalid.`
    } ]
}) ], exports.BaseValidationRule);

exports.RequiredRule = class RequiredRule extends exports.BaseValidationRule {
    constructor() {
        super("required");
    }
    execute(e) {
        return e !== null && e !== void 0 && !(typeof e === "string" && !/\S/.test(e));
    }
    accept(e) {
        return e.visitRequiredRule(this);
    }
};

exports.RequiredRule.$TYPE = "RequiredRule";

exports.RequiredRule = __decorate([ validationRule({
    aliases: [ {
        name: "required",
        defaultMessage: `\${$displayName} is required.`
    } ]
}) ], exports.RequiredRule);

exports.RegexRule = class RegexRule extends exports.BaseValidationRule {
    constructor(e, t = "matches") {
        super(t);
        this.pattern = e;
    }
    execute(e) {
        return e === null || e === undefined || e.length === 0 || this.pattern.test(e);
    }
    accept(e) {
        return e.visitRegexRule(this);
    }
};

exports.RegexRule.$TYPE = "RegexRule";

exports.RegexRule = __decorate([ validationRule({
    aliases: [ {
        name: "matches",
        defaultMessage: `\${$displayName} is not correctly formatted.`
    }, {
        name: "email",
        defaultMessage: `\${$displayName} is not a valid email.`
    } ]
}) ], exports.RegexRule);

exports.LengthRule = class LengthRule extends exports.BaseValidationRule {
    constructor(e, t) {
        super(t ? "maxLength" : "minLength");
        this.length = e;
        this.isMax = t;
    }
    execute(e) {
        return e === null || e === undefined || e.length === 0 || (this.isMax ? e.length <= this.length : e.length >= this.length);
    }
    accept(e) {
        return e.visitLengthRule(this);
    }
};

exports.LengthRule.$TYPE = "LengthRule";

exports.LengthRule = __decorate([ validationRule({
    aliases: [ {
        name: "minLength",
        defaultMessage: `\${$displayName} must be at least \${$rule.length} character\${$rule.length === 1 ? '' : 's'}.`
    }, {
        name: "maxLength",
        defaultMessage: `\${$displayName} cannot be longer than \${$rule.length} character\${$rule.length === 1 ? '' : 's'}.`
    } ]
}) ], exports.LengthRule);

exports.SizeRule = class SizeRule extends exports.BaseValidationRule {
    constructor(e, t) {
        super(t ? "maxItems" : "minItems");
        this.count = e;
        this.isMax = t;
    }
    execute(e) {
        return e === null || e === undefined || (this.isMax ? e.length <= this.count : e.length >= this.count);
    }
    accept(e) {
        return e.visitSizeRule(this);
    }
};

exports.SizeRule.$TYPE = "SizeRule";

exports.SizeRule = __decorate([ validationRule({
    aliases: [ {
        name: "minItems",
        defaultMessage: `\${$displayName} must contain at least \${$rule.count} item\${$rule.count === 1 ? '' : 's'}.`
    }, {
        name: "maxItems",
        defaultMessage: `\${$displayName} cannot contain more than \${$rule.count} item\${$rule.count === 1 ? '' : 's'}.`
    } ]
}) ], exports.SizeRule);

exports.RangeRule = class RangeRule extends exports.BaseValidationRule {
    constructor(e, {min: t, max: s}) {
        super(t !== void 0 && s !== void 0 ? e ? "range" : "between" : t !== void 0 ? "min" : "max");
        this.isInclusive = e;
        this.min = Number.NEGATIVE_INFINITY;
        this.max = Number.POSITIVE_INFINITY;
        this.min = t ?? this.min;
        this.max = s ?? this.max;
    }
    execute(e, t) {
        return e === null || e === undefined || (this.isInclusive ? e >= this.min && e <= this.max : e > this.min && e < this.max);
    }
    accept(e) {
        return e.visitRangeRule(this);
    }
};

exports.RangeRule.$TYPE = "RangeRule";

exports.RangeRule = __decorate([ validationRule({
    aliases: [ {
        name: "min",
        defaultMessage: `\${$displayName} must be at least \${$rule.min}.`
    }, {
        name: "max",
        defaultMessage: `\${$displayName} must be at most \${$rule.max}.`
    }, {
        name: "range",
        defaultMessage: `\${$displayName} must be between or equal to \${$rule.min} and \${$rule.max}.`
    }, {
        name: "between",
        defaultMessage: `\${$displayName} must be between but not equal to \${$rule.min} and \${$rule.max}.`
    } ]
}) ], exports.RangeRule);

exports.EqualsRule = class EqualsRule extends exports.BaseValidationRule {
    constructor(e) {
        super("equals");
        this.expectedValue = e;
    }
    execute(e) {
        return e === null || e === undefined || e === "" || e === this.expectedValue;
    }
    accept(e) {
        return e.visitEqualsRule(this);
    }
};

exports.EqualsRule.$TYPE = "EqualsRule";

exports.EqualsRule = __decorate([ validationRule({
    aliases: [ {
        name: "equals",
        defaultMessage: `\${$displayName} must be \${$rule.expectedValue}.`
    } ]
}) ], exports.EqualsRule);

var u;

const l = /*@__PURE__*/ e.DI.createInterface("ICustomMessages");

class RuleProperty {
    constructor(e, t = void 0, s = void 0) {
        this.expression = e;
        this.name = t;
        this.displayName = s;
    }
    accept(e) {
        return e.visitRuleProperty(this);
    }
}

RuleProperty.$TYPE = "RuleProperty";

const c = Object.freeze({
    name: "validation-rules",
    defaultRuleSetName: "__default",
    set(s, r, i) {
        const n = `${c.name}:${i ?? c.defaultRuleSetName}`;
        t.Metadata.define(e.Protocol.annotation.keyFor(n), r, s);
        const a = t.Metadata.getOwn(e.Protocol.annotation.name, s);
        if (a === void 0) {
            t.Metadata.define(e.Protocol.annotation.name, [ n ], s);
        } else {
            a.push(n);
        }
    },
    get(s, r) {
        const i = e.Protocol.annotation.keyFor(c.name, r ?? c.defaultRuleSetName);
        return t.Metadata.get(i, s) ?? t.Metadata.getOwn(i, s.constructor);
    },
    unset(s, r) {
        const i = t.Metadata.getOwn(e.Protocol.annotation.name, s);
        if (!Array.isArray(i)) return;
        for (const n of i.slice(0)) {
            if (n.startsWith(c.name) && (r === void 0 || n.endsWith(r))) {
                t.Metadata.delete(e.Protocol.annotation.keyFor(n), s);
                const r = i.indexOf(n);
                if (r > -1) {
                    i.splice(r, 1);
                }
            }
        }
    },
    isValidationRulesSet(s) {
        const r = t.Metadata.getOwn(e.Protocol.annotation.name, s);
        return r !== void 0 && r.some((e => e.startsWith(c.name)));
    }
});

class ValidationMessageEvaluationContext {
    constructor(e, t, s, r, i, n) {
        this.messageProvider = e;
        this.$displayName = t;
        this.$propertyName = s;
        this.$value = r;
        this.$rule = i;
        this.$object = n;
    }
    $getDisplayName(e, t) {
        return this.messageProvider.getDisplayName(e, t);
    }
}

class PropertyRule {
    constructor(e, t, s, r, i = [ [] ]) {
        this.validationRules = t;
        this.messageProvider = s;
        this.property = r;
        this.$rules = i;
        this.l = e;
    }
    accept(e) {
        return e.visitPropertyRule(this);
    }
    addRule(e) {
        const t = this.getLeafRules();
        t.push(this.latestRule = e);
        return this;
    }
    getLeafRules() {
        const e = this.$rules.length - 1;
        return this.$rules[e];
    }
    async validate(e, t, r) {
        if (r === void 0) {
            r = s.Scope.create({
                [$]: e
            });
        }
        const i = this.property.expression;
        let n;
        if (i === void 0) {
            n = e;
        } else {
            n = s.astEvaluate(i, r, this, null);
        }
        let a = true;
        const validateRuleset = async r => {
            const validateRule = async t => {
                let r = t.execute(n, e);
                if (r instanceof Promise) {
                    r = await r;
                }
                a = a && r;
                const {displayName: i, name: o} = this.property;
                let u;
                if (!r) {
                    const r = s.Scope.create(new ValidationMessageEvaluationContext(this.messageProvider, this.messageProvider.getDisplayName(o, i), o, n, t, e));
                    u = s.astEvaluate(this.messageProvider.getMessage(t), r, this, null);
                }
                return new ValidationResult(r, u, o, e, t, this);
            };
            const i = [];
            for (const s of r) {
                if (s.canExecute(e) && (t === void 0 || s.tag === t)) {
                    i.push(validateRule(s));
                }
            }
            return Promise.all(i);
        };
        const accumulateResult = async (e, t) => {
            const s = await validateRuleset(t);
            e.push(...s);
            return e;
        };
        return this.$rules.reduce((async (e, t) => e.then((async e => a ? accumulateResult(e, t) : Promise.resolve(e)))), Promise.resolve([]));
    }
    then() {
        this.$rules.push([]);
        return this;
    }
    withMessageKey(e) {
        this.assertLatestRule(this.latestRule);
        this.latestRule.messageKey = e;
        return this;
    }
    withMessage(e) {
        const t = this.latestRule;
        this.assertLatestRule(t);
        this.messageProvider.setMessage(t, e);
        return this;
    }
    when(e) {
        this.assertLatestRule(this.latestRule);
        this.latestRule.canExecute = e;
        return this;
    }
    tag(e) {
        this.assertLatestRule(this.latestRule);
        this.latestRule.tag = e;
        return this;
    }
    assertLatestRule(e) {
        if (e === void 0) {
            throw new Error("No rule has been added");
        }
    }
    displayName(e) {
        this.property.displayName = e;
        return this;
    }
    satisfies(e) {
        const t = new class extends exports.BaseValidationRule {
            constructor() {
                super(...arguments);
                this.execute = e;
            }
        };
        return this.addRule(t);
    }
    satisfiesRule(e) {
        return this.addRule(e);
    }
    required() {
        return this.addRule(new exports.RequiredRule);
    }
    matches(e) {
        return this.addRule(new exports.RegexRule(e));
    }
    email() {
        const e = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return this.addRule(new exports.RegexRule(e, "email"));
    }
    minLength(e) {
        return this.addRule(new exports.LengthRule(e, false));
    }
    maxLength(e) {
        return this.addRule(new exports.LengthRule(e, true));
    }
    minItems(e) {
        return this.addRule(new exports.SizeRule(e, false));
    }
    maxItems(e) {
        return this.addRule(new exports.SizeRule(e, true));
    }
    min(e) {
        return this.addRule(new exports.RangeRule(true, {
            min: e
        }));
    }
    max(e) {
        return this.addRule(new exports.RangeRule(true, {
            max: e
        }));
    }
    range(e, t) {
        return this.addRule(new exports.RangeRule(true, {
            min: e,
            max: t
        }));
    }
    between(e, t) {
        return this.addRule(new exports.RangeRule(false, {
            min: e,
            max: t
        }));
    }
    equals(e) {
        return this.addRule(new exports.EqualsRule(e));
    }
    ensure(e) {
        this.latestRule = void 0;
        return this.validationRules.ensure(e);
    }
    ensureObject() {
        this.latestRule = void 0;
        return this.validationRules.ensureObject();
    }
    get rules() {
        return this.validationRules.rules;
    }
    on(e, t) {
        return this.validationRules.on(e, t);
    }
}

PropertyRule.$TYPE = "PropertyRule";

r.mixinAstEvaluator()(PropertyRule);

class ModelBasedRule {
    constructor(e, t = c.defaultRuleSetName) {
        this.ruleset = e;
        this.tag = t;
    }
}

const h = /*@__PURE__*/ e.DI.createInterface("IValidationRules");

exports.ValidationRules = class ValidationRules {
    constructor(e, t, s, r) {
        this.locator = e;
        this.parser = t;
        this.messageProvider = s;
        this.deserializer = r;
        this.rules = [];
        this.targets = new Set;
    }
    ensure(e) {
        const [t, s] = parsePropertyName(e, this.parser);
        let r = this.rules.find((e => e.property.name == t));
        if (r === void 0) {
            r = new PropertyRule(this.locator, this, this.messageProvider, new RuleProperty(s, t));
            this.rules.push(r);
        }
        return r;
    }
    ensureObject() {
        const e = new PropertyRule(this.locator, this, this.messageProvider, new RuleProperty);
        this.rules.push(e);
        return e;
    }
    on(e, t) {
        const s = c.get(e, t);
        if (Object.is(s, this.rules)) {
            return this;
        }
        this.rules = s ?? [];
        c.set(e, this.rules, t);
        this.targets.add(e);
        return this;
    }
    off(e, t) {
        const s = e !== void 0 ? [ e ] : Array.from(this.targets);
        for (const e of s) {
            c.unset(e, t);
            if (!c.isValidationRulesSet(e)) {
                this.targets.delete(e);
            }
        }
    }
    applyModelBasedRules(e, t) {
        const s = new Set;
        for (const r of t) {
            const t = r.tag;
            if (s.has(t)) {
                console.warn(`A ruleset for tag ${t} is already defined which will be overwritten`);
            }
            const i = this.deserializer.hydrateRuleset(r.ruleset, this);
            c.set(e, i, t);
            s.add(t);
        }
    }
};

exports.ValidationRules = __decorate([ __param(0, e.IServiceLocator), __param(1, s.IExpressionParser), __param(2, a), __param(3, n) ], exports.ValidationRules);

const p = /^(?:function)?\s*\(?[$_\w\d]+\)?\s*(?:=>)?\s*\{(?:\s*["']{1}use strict["']{1};)?(?:[$_\s\w\d\/\*.['"\]+;\(\)]+)?\s*return\s+[$_\w\d]+((\.[$_\w\d]+|\[['"$_\w\d]+\])+)\s*;?\s*\}$/;

const d = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+((\.[$_\w\d]+|\[['"$_\w\d]+\])+)$/;

const $ = "$root";

function parsePropertyName(e, t) {
    switch (typeof e) {
      case "string":
        break;

      case "function":
        {
            const t = e.toString();
            const s = d.exec(t) ?? p.exec(t);
            if (s === null) {
                throw new Error(`Unable to parse accessor function:\n${t}`);
            }
            e = s[1].substring(1);
            break;
        }

      default:
        throw new Error(`Unable to parse accessor function:\n${e}`);
    }
    return [ e, t.parse(`${$}.${e}`, "IsProperty") ];
}

class ValidationResult {
    constructor(e, t, s, r, i, n, a = false) {
        this.valid = e;
        this.message = t;
        this.propertyName = s;
        this.object = r;
        this.rule = i;
        this.propertyRule = n;
        this.isManual = a;
        this.id = ValidationResult.nextId++;
    }
    toString() {
        return this.valid ? "Valid." : this.message;
    }
}

ValidationResult.nextId = 0;

const m = new Set([ "displayName", "propertyName", "value", "object", "config", "getDisplayName" ]);

exports.ValidationMessageProvider = u = class ValidationMessageProvider {
    constructor(e, t, s) {
        this.parser = e;
        this.registeredMessages = new WeakMap;
        this.logger = t.scopeTo(u.name);
        for (const {rule: e, aliases: t} of s) {
            o.setDefaultMessage(e, {
                aliases: t
            });
        }
    }
    getMessage(e) {
        const t = this.registeredMessages.get(e);
        if (t !== void 0) {
            return t;
        }
        const s = o.getDefaultMessages(e);
        const r = e.messageKey;
        let i;
        const n = s.length;
        if (n === 1 && r === void 0) {
            i = s[0].defaultMessage;
        } else {
            i = s.find((e => e.name === r))?.defaultMessage;
        }
        if (!i) {
            i = o.getDefaultMessages(exports.BaseValidationRule)[0].defaultMessage;
        }
        return this.setMessage(e, i);
    }
    setMessage(e, t) {
        const s = this.parseMessage(t);
        this.registeredMessages.set(e, s);
        return s;
    }
    parseMessage(e) {
        const t = this.parser.parse(e, "Interpolation");
        if (t?.$kind === "Interpolation") {
            for (const s of t.expressions) {
                const t = s.name;
                if (m.has(t)) {
                    this.logger.warn(`Did you mean to use "$${t}" instead of "${t}" in this validation message template: "${e}"?`);
                }
                if (s.$kind === "AccessThis" || s.ancestor > 0) {
                    throw new Error("$parent is not permitted in validation message expressions.");
                }
            }
            return t;
        }
        return new s.PrimitiveLiteralExpression(e);
    }
    getDisplayName(e, t) {
        if (t !== null && t !== undefined) {
            return t instanceof Function ? t() : t;
        }
        if (e === void 0) {
            return;
        }
        const s = e.toString().split(/(?=[A-Z])/).join(" ");
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
};

exports.ValidationMessageProvider = u = __decorate([ __param(0, s.IExpressionParser), __param(1, e.ILogger), __param(2, l) ], exports.ValidationMessageProvider);

const x = i.astVisit;

var f;

(function(e) {
    e["BindingBehaviorExpression"] = "BindingBehaviorExpression";
    e["ValueConverterExpression"] = "ValueConverterExpression";
    e["AssignExpression"] = "AssignExpression";
    e["ConditionalExpression"] = "ConditionalExpression";
    e["AccessThisExpression"] = "AccessThisExpression";
    e["AccessScopeExpression"] = "AccessScopeExpression";
    e["AccessMemberExpression"] = "AccessMemberExpression";
    e["AccessKeyedExpression"] = "AccessKeyedExpression";
    e["CallScopeExpression"] = "CallScopeExpression";
    e["CallMemberExpression"] = "CallMemberExpression";
    e["CallFunctionExpression"] = "CallFunctionExpression";
    e["BinaryExpression"] = "BinaryExpression";
    e["UnaryExpression"] = "UnaryExpression";
    e["PrimitiveLiteralExpression"] = "PrimitiveLiteralExpression";
    e["ArrayLiteralExpression"] = "ArrayLiteralExpression";
    e["ObjectLiteralExpression"] = "ObjectLiteralExpression";
    e["TemplateExpression"] = "TemplateExpression";
    e["TaggedTemplateExpression"] = "TaggedTemplateExpression";
    e["ArrayBindingPattern"] = "ArrayBindingPattern";
    e["ObjectBindingPattern"] = "ObjectBindingPattern";
    e["BindingIdentifier"] = "BindingIdentifier";
    e["ForOfStatement"] = "ForOfStatement";
    e["Interpolation"] = "Interpolation";
    e["DestructuringAssignment"] = "DestructuringAssignment";
    e["DestructuringSingleAssignment"] = "DestructuringSingleAssignment";
    e["DestructuringRestAssignment"] = "DestructuringRestAssignment";
    e["ArrowFunction"] = "ArrowFunction";
    e["Custom"] = "Custom";
})(f || (f = {}));

class Deserializer {
    static deserialize(e) {
        const t = new Deserializer;
        const s = JSON.parse(e);
        return t.hydrate(s);
    }
    hydrate(e) {
        switch (e.$TYPE) {
          case f.AccessMemberExpression:
            {
                const t = e;
                return new i.AccessMemberExpression(this.hydrate(t.object), t.name);
            }

          case f.AccessKeyedExpression:
            {
                const t = e;
                return new i.AccessKeyedExpression(this.hydrate(t.object), this.hydrate(t.key));
            }

          case f.AccessThisExpression:
            {
                const t = e;
                return new i.AccessThisExpression(t.ancestor);
            }

          case f.AccessScopeExpression:
            {
                const t = e;
                return new i.AccessScopeExpression(t.name, t.ancestor);
            }

          case f.ArrayLiteralExpression:
            {
                const t = e;
                return new i.ArrayLiteralExpression(this.hydrate(t.elements));
            }

          case f.ObjectLiteralExpression:
            {
                const t = e;
                return new i.ObjectLiteralExpression(this.hydrate(t.keys), this.hydrate(t.values));
            }

          case f.PrimitiveLiteralExpression:
            {
                const t = e;
                return new i.PrimitiveLiteralExpression(this.hydrate(t.value));
            }

          case f.CallFunctionExpression:
            {
                const t = e;
                return new i.CallFunctionExpression(this.hydrate(t.func), this.hydrate(t.args));
            }

          case f.CallMemberExpression:
            {
                const t = e;
                return new i.CallMemberExpression(this.hydrate(t.object), t.name, this.hydrate(t.args));
            }

          case f.CallScopeExpression:
            {
                const t = e;
                return new i.CallScopeExpression(t.name, this.hydrate(t.args), t.ancestor);
            }

          case f.TemplateExpression:
            {
                const t = e;
                return new i.TemplateExpression(this.hydrate(t.cooked), this.hydrate(t.expressions));
            }

          case f.TaggedTemplateExpression:
            {
                const t = e;
                return new i.TaggedTemplateExpression(this.hydrate(t.cooked), this.hydrate(t.raw), this.hydrate(t.func), this.hydrate(t.expressions));
            }

          case f.UnaryExpression:
            {
                const t = e;
                return new i.UnaryExpression(t.operation, this.hydrate(t.expression));
            }

          case f.BinaryExpression:
            {
                const t = e;
                return new i.BinaryExpression(t.operation, this.hydrate(t.left), this.hydrate(t.right));
            }

          case f.ConditionalExpression:
            {
                const t = e;
                return new i.ConditionalExpression(this.hydrate(t.condition), this.hydrate(t.yes), this.hydrate(t.no));
            }

          case f.AssignExpression:
            {
                const t = e;
                return new i.AssignExpression(this.hydrate(t.target), this.hydrate(t.value));
            }

          case f.ValueConverterExpression:
            {
                const t = e;
                return new i.ValueConverterExpression(this.hydrate(t.expression), t.name, this.hydrate(t.args));
            }

          case f.BindingBehaviorExpression:
            {
                const t = e;
                return new i.BindingBehaviorExpression(this.hydrate(t.expression), t.name, this.hydrate(t.args));
            }

          case f.ArrayBindingPattern:
            {
                const t = e;
                return new i.ArrayBindingPattern(this.hydrate(t.elements));
            }

          case f.ObjectBindingPattern:
            {
                const t = e;
                return new i.ObjectBindingPattern(this.hydrate(t.keys), this.hydrate(t.values));
            }

          case f.BindingIdentifier:
            {
                const t = e;
                return new i.BindingIdentifier(t.name);
            }

          case f.ForOfStatement:
            {
                const t = e;
                return new i.ForOfStatement(this.hydrate(t.declaration), this.hydrate(t.iterable), this.hydrate(t.semiIdx));
            }

          case f.Interpolation:
            {
                const t = e;
                return new i.Interpolation(this.hydrate(t.cooked), this.hydrate(t.expressions));
            }

          case f.DestructuringAssignment:
            {
                return new i.DestructuringAssignmentExpression(this.hydrate(e.$kind), this.hydrate(e.list), this.hydrate(e.source), this.hydrate(e.initializer));
            }

          case f.DestructuringSingleAssignment:
            {
                return new i.DestructuringAssignmentSingleExpression(this.hydrate(e.target), this.hydrate(e.source), this.hydrate(e.initializer));
            }

          case f.DestructuringRestAssignment:
            {
                return new i.DestructuringAssignmentRestExpression(this.hydrate(e.target), this.hydrate(e.indexOrProperties));
            }

          case f.ArrowFunction:
            {
                return new i.ArrowFunction(this.hydrate(e.parameters), this.hydrate(e.body), this.hydrate(e.rest));
            }

          default:
            if (Array.isArray(e)) {
                if (typeof e[0] === "object") {
                    return this.deserializeExpressions(e);
                } else {
                    return e.map(deserializePrimitive);
                }
            } else if (typeof e !== "object") {
                return deserializePrimitive(e);
            }
            throw new Error(`unable to deserialize the expression: ${e}`);
        }
    }
    deserializeExpressions(e) {
        const t = [];
        for (const s of e) {
            t.push(this.hydrate(s));
        }
        return t;
    }
}

class Serializer {
    static serialize(e) {
        const t = new Serializer;
        if (e == null) {
            return `${e}`;
        }
        return x(e, t);
    }
    visitAccessMember(e) {
        return `{"$TYPE":"${f.AccessMemberExpression}","name":"${e.name}","object":${x(e.object, this)}}`;
    }
    visitAccessKeyed(e) {
        return `{"$TYPE":"${f.AccessKeyedExpression}","object":${x(e.object, this)},"key":${x(e.key, this)}}`;
    }
    visitAccessThis(e) {
        return `{"$TYPE":"${f.AccessThisExpression}","ancestor":${e.ancestor}}`;
    }
    visitAccessScope(e) {
        return `{"$TYPE":"${f.AccessScopeExpression}","name":"${e.name}","ancestor":${e.ancestor}}`;
    }
    visitArrayLiteral(e) {
        return `{"$TYPE":"${f.ArrayLiteralExpression}","elements":${this.serializeExpressions(e.elements)}}`;
    }
    visitObjectLiteral(e) {
        return `{"$TYPE":"${f.ObjectLiteralExpression}","keys":${serializePrimitives(e.keys)},"values":${this.serializeExpressions(e.values)}}`;
    }
    visitPrimitiveLiteral(e) {
        return `{"$TYPE":"${f.PrimitiveLiteralExpression}","value":${serializePrimitive(e.value)}}`;
    }
    visitCallFunction(e) {
        return `{"$TYPE":"${f.CallFunctionExpression}","func":${x(e.func, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitCallMember(e) {
        return `{"$TYPE":"${f.CallMemberExpression}","name":"${e.name}","object":${x(e.object, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitCallScope(e) {
        return `{"$TYPE":"${f.CallScopeExpression}","name":"${e.name}","ancestor":${e.ancestor},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitTemplate(e) {
        return `{"$TYPE":"${f.TemplateExpression}","cooked":${serializePrimitives(e.cooked)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitTaggedTemplate(e) {
        return `{"$TYPE":"${f.TaggedTemplateExpression}","cooked":${serializePrimitives(e.cooked)},"raw":${serializePrimitives(e.cooked.raw)},"func":${x(e.func, this)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitUnary(e) {
        return `{"$TYPE":"${f.UnaryExpression}","operation":"${e.operation}","expression":${x(e.expression, this)}}`;
    }
    visitBinary(e) {
        return `{"$TYPE":"${f.BinaryExpression}","operation":"${e.operation}","left":${x(e.left, this)},"right":${x(e.right, this)}}`;
    }
    visitConditional(e) {
        return `{"$TYPE":"${f.ConditionalExpression}","condition":${x(e.condition, this)},"yes":${x(e.yes, this)},"no":${x(e.no, this)}}`;
    }
    visitAssign(e) {
        return `{"$TYPE":"${f.AssignExpression}","target":${x(e.target, this)},"value":${x(e.value, this)}}`;
    }
    visitValueConverter(e) {
        return `{"$TYPE":"${f.ValueConverterExpression}","name":"${e.name}","expression":${x(e.expression, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitBindingBehavior(e) {
        return `{"$TYPE":"${f.BindingBehaviorExpression}","name":"${e.name}","expression":${x(e.expression, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitArrayBindingPattern(e) {
        return `{"$TYPE":"${f.ArrayBindingPattern}","elements":${this.serializeExpressions(e.elements)}}`;
    }
    visitObjectBindingPattern(e) {
        return `{"$TYPE":"${f.ObjectBindingPattern}","keys":${serializePrimitives(e.keys)},"values":${this.serializeExpressions(e.values)}}`;
    }
    visitBindingIdentifier(e) {
        return `{"$TYPE":"${f.BindingIdentifier}","name":"${e.name}"}`;
    }
    visitForOfStatement(e) {
        return `{"$TYPE":"${f.ForOfStatement}","declaration":${x(e.declaration, this)},"iterable":${x(e.iterable, this)},"semiIdx":${serializePrimitive(e.semiIdx)}}`;
    }
    visitInterpolation(e) {
        return `{"$TYPE":"${f.Interpolation}","cooked":${serializePrimitives(e.parts)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitDestructuringAssignmentExpression(e) {
        return `{"$TYPE":"${f.DestructuringAssignment}","$kind":${serializePrimitive(e.$kind)},"list":${this.serializeExpressions(e.list)},"source":${e.source === void 0 ? serializePrimitive(e.source) : x(e.source, this)},"initializer":${e.initializer === void 0 ? serializePrimitive(e.initializer) : x(e.initializer, this)}}`;
    }
    visitDestructuringAssignmentSingleExpression(e) {
        return `{"$TYPE":"${f.DestructuringSingleAssignment}","source":${x(e.source, this)},"target":${x(e.target, this)},"initializer":${e.initializer === void 0 ? serializePrimitive(e.initializer) : x(e.initializer, this)}}`;
    }
    visitDestructuringAssignmentRestExpression(e) {
        return `{"$TYPE":"${f.DestructuringRestAssignment}","target":${x(e.target, this)},"indexOrProperties":${Array.isArray(e.indexOrProperties) ? serializePrimitives(e.indexOrProperties) : serializePrimitive(e.indexOrProperties)}}`;
    }
    visitArrowFunction(e) {
        return `{"$TYPE":"${f.ArrowFunction}","parameters":${this.serializeExpressions(e.args)},"body":${x(e.body, this)},"rest":${serializePrimitive(e.rest)}}`;
    }
    visitCustom(e) {
        return `{"$TYPE":"${f.Custom}","body":${e.value}}`;
    }
    serializeExpressions(e) {
        let t = "[";
        for (let s = 0, r = e.length; s < r; ++s) {
            if (s !== 0) {
                t += ",";
            }
            t += x(e[s], this);
        }
        t += "]";
        return t;
    }
}

function serializePrimitives(e) {
    let t = "[";
    for (let s = 0, r = e.length; s < r; ++s) {
        if (s !== 0) {
            t += ",";
        }
        t += serializePrimitive(e[s]);
    }
    t += "]";
    return t;
}

function serializePrimitive(e) {
    if (typeof e === "string") {
        return `"\\"${escapeString(e)}\\""`;
    } else if (e == null) {
        return `"${e}"`;
    } else {
        return `${e}`;
    }
}

function escapeString(e) {
    let t = "";
    for (let s = 0, r = e.length; s < r; ++s) {
        t += escape(e.charAt(s));
    }
    return t;
}

function escape(e) {
    switch (e) {
      case "\b":
        return "\\b";

      case "\t":
        return "\\t";

      case "\n":
        return "\\n";

      case "\v":
        return "\\v";

      case "\f":
        return "\\f";

      case "\r":
        return "\\r";

      case '"':
        return '\\"';

      case "\\":
        return "\\\\";

      default:
        return e;
    }
}

function deserializePrimitive(e) {
    if (typeof e === "string") {
        if (e === "null") {
            return null;
        }
        if (e === "undefined") {
            return undefined;
        }
        return e.substring(1, e.length - 1);
    } else {
        return e;
    }
}

var v;

class ValidationSerializer {
    static serialize(e) {
        if (e == null || typeof e.accept !== "function") {
            return `${e}`;
        }
        const t = new ValidationSerializer;
        return e.accept(t);
    }
    visitRequiredRule(e) {
        return `{"$TYPE":"${exports.RequiredRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)}}`;
    }
    visitRegexRule(e) {
        const t = e.pattern;
        return `{"$TYPE":"${exports.RegexRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"pattern":{"source":${serializePrimitive(t.source)},"flags":"${t.flags}"}}`;
    }
    visitLengthRule(e) {
        return `{"$TYPE":"${exports.LengthRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"length":${serializePrimitive(e.length)},"isMax":${serializePrimitive(e.isMax)}}`;
    }
    visitSizeRule(e) {
        return `{"$TYPE":"${exports.SizeRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"count":${serializePrimitive(e.count)},"isMax":${serializePrimitive(e.isMax)}}`;
    }
    visitRangeRule(e) {
        return `{"$TYPE":"${exports.RangeRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"isInclusive":${e.isInclusive},"min":${this.serializeNumber(e.min)},"max":${this.serializeNumber(e.max)}}`;
    }
    visitEqualsRule(e) {
        const t = e.expectedValue;
        let s;
        if (typeof t !== "object" || t === null) {
            s = serializePrimitive(t);
        } else {
            s = JSON.stringify(t);
        }
        return `{"$TYPE":"${exports.EqualsRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"expectedValue":${s}}`;
    }
    visitRuleProperty(e) {
        const t = e.displayName;
        if (t !== void 0 && typeof t !== "string") {
            throw new Error("Serializing a non-string displayName for rule property is not supported.");
        }
        const s = e.expression;
        return `{"$TYPE":"${RuleProperty.$TYPE}","name":${serializePrimitive(e.name)},"expression":${s ? Serializer.serialize(s) : null},"displayName":${serializePrimitive(t)}}`;
    }
    visitPropertyRule(e) {
        return `{"$TYPE":"${PropertyRule.$TYPE}","property":${e.property.accept(this)},"$rules":${this.serializeRules(e.$rules)}}`;
    }
    serializeNumber(e) {
        return e === Number.POSITIVE_INFINITY || e === Number.NEGATIVE_INFINITY ? null : e.toString();
    }
    serializeRules(e) {
        return `[${e.map((e => `[${e.map((e => e.accept(this))).join(",")}]`)).join(",")}]`;
    }
}

exports.ValidationDeserializer = v = class ValidationDeserializer {
    static register(e) {
        this.container = e;
    }
    static deserialize(e, t) {
        const r = this.container.get(a);
        const i = this.container.get(s.IExpressionParser);
        const n = new v(this.container, r, i);
        const o = JSON.parse(e);
        return n.hydrate(o, t);
    }
    constructor(e, t, s) {
        this.locator = e;
        this.messageProvider = t;
        this.parser = s;
        this.astDeserializer = new Deserializer;
    }
    hydrate(e, t) {
        switch (e.$TYPE) {
          case exports.RequiredRule.$TYPE:
            {
                const t = e;
                const s = new exports.RequiredRule;
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case exports.RegexRule.$TYPE:
            {
                const t = e;
                const s = t.pattern;
                const r = this.astDeserializer;
                const i = new exports.RegexRule(new RegExp(r.hydrate(s.source), s.flags), t.messageKey);
                i.tag = r.hydrate(t.tag);
                return i;
            }

          case exports.LengthRule.$TYPE:
            {
                const t = e;
                const s = new exports.LengthRule(t.length, t.isMax);
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case exports.SizeRule.$TYPE:
            {
                const t = e;
                const s = new exports.SizeRule(t.count, t.isMax);
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case exports.RangeRule.$TYPE:
            {
                const t = e;
                const s = new exports.RangeRule(t.isInclusive, {
                    min: t.min ?? Number.NEGATIVE_INFINITY,
                    max: t.max ?? Number.POSITIVE_INFINITY
                });
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case exports.EqualsRule.$TYPE:
            {
                const t = e;
                const s = this.astDeserializer;
                const r = new exports.EqualsRule(typeof t.expectedValue !== "object" ? s.hydrate(t.expectedValue) : t.expectedValue);
                r.messageKey = t.messageKey;
                r.tag = s.hydrate(t.tag);
                return r;
            }

          case RuleProperty.$TYPE:
            {
                const t = e;
                const s = this.astDeserializer;
                let r = t.name;
                r = r === "undefined" ? void 0 : s.hydrate(r);
                let i = t.expression;
                if (i !== null && i !== void 0) {
                    i = s.hydrate(i);
                } else if (r !== void 0) {
                    [, i] = parsePropertyName(r, this.parser);
                } else {
                    i = void 0;
                }
                let n = t.displayName;
                n = n === "undefined" ? void 0 : s.hydrate(n);
                return new RuleProperty(i, r, n);
            }

          case PropertyRule.$TYPE:
            {
                const s = e;
                return new PropertyRule(this.locator, t, this.messageProvider, this.hydrate(s.property, t), s.$rules.map((e => e.map((e => this.hydrate(e, t))))));
            }
        }
    }
    hydrateRuleset(e, t) {
        if (!Array.isArray(e)) {
            throw new Error("The ruleset has to be an array of serialized property rule objects");
        }
        return e.map((e => this.hydrate(e, t)));
    }
};

exports.ValidationDeserializer = v = __decorate([ __param(0, e.IServiceLocator), __param(1, a), __param(2, s.IExpressionParser) ], exports.ValidationDeserializer);

exports.ModelValidationExpressionHydrator = class ModelValidationExpressionHydrator {
    constructor(e, t, s) {
        this.l = e;
        this.messageProvider = t;
        this.parser = s;
        this.astDeserializer = new Deserializer;
    }
    hydrate(e, t) {
        throw new Error("Method not implemented.");
    }
    hydrateRuleset(e, t) {
        const s = [];
        const iterate = (e, r = []) => {
            for (const [i, n] of e) {
                if (this.isModelPropertyRule(n)) {
                    const e = n.rules.map((e => Object.entries(e).map((([e, t]) => this.hydrateRule(e, t)))));
                    const a = r.join(".");
                    const o = this.hydrateRuleProperty({
                        name: a !== "" ? `${a}.${i}` : i,
                        displayName: n.displayName
                    });
                    s.push(new PropertyRule(this.l, t, this.messageProvider, o, e));
                } else {
                    iterate(Object.entries(n), [ ...r, i ]);
                }
            }
        };
        iterate(Object.entries(e));
        return s;
    }
    hydrateRule(e, t) {
        switch (e) {
          case "required":
            return this.hydrateRequiredRule(t);

          case "regex":
            return this.hydrateRegexRule(t);

          case "maxLength":
            return this.hydrateLengthRule({
                ...t,
                isMax: true
            });

          case "minLength":
            return this.hydrateLengthRule({
                ...t,
                isMax: false
            });

          case "maxItems":
            return this.hydrateSizeRule({
                ...t,
                isMax: true
            });

          case "minItems":
            return this.hydrateSizeRule({
                ...t,
                isMax: false
            });

          case "range":
            return this.hydrateRangeRule({
                ...t,
                isInclusive: true
            });

          case "between":
            return this.hydrateRangeRule({
                ...t,
                isInclusive: false
            });

          case "equals":
            return this.hydrateEqualsRule(t);

          default:
            throw new Error(`Unsupported rule ${e}`);
        }
    }
    setCommonRuleProperties(e, t) {
        const r = e.messageKey;
        if (r !== void 0 && r !== null) {
            t.messageKey = r;
        }
        t.tag = e.tag;
        const i = e.when;
        if (i) {
            if (typeof i === "string") {
                const e = this.parser.parse(i, "None");
                t.canExecute = t => s.astEvaluate(e, s.Scope.create({
                    $object: t
                }), this, null);
            } else if (typeof i === "function") {
                t.canExecute = i;
            }
        }
    }
    isModelPropertyRule(e) {
        return typeof e === "object" && "rules" in e;
    }
    hydrateRequiredRule(e) {
        const t = new exports.RequiredRule;
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRegexRule(e) {
        const t = e.pattern;
        const s = new exports.RegexRule(new RegExp(t.source, t.flags), e.messageKey);
        s.tag = e.tag;
        return s;
    }
    hydrateLengthRule(e) {
        const t = new exports.LengthRule(e.length, e.isMax);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateSizeRule(e) {
        const t = new exports.SizeRule(e.count, e.isMax);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRangeRule(e) {
        const t = new exports.RangeRule(e.isInclusive, {
            min: e.min,
            max: e.max
        });
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateEqualsRule(e) {
        const t = new exports.EqualsRule(e.expectedValue);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRuleProperty(e) {
        const t = e.name;
        if (!t || typeof t !== "string") {
            throw new Error("The property name needs to be a non-empty string");
        }
        const [s, r] = parsePropertyName(t, this.parser);
        return new RuleProperty(r, s, e.displayName);
    }
};

exports.ModelValidationExpressionHydrator = __decorate([ __param(0, e.IServiceLocator), __param(1, a), __param(2, s.IExpressionParser) ], exports.ModelValidationExpressionHydrator);

r.mixinAstEvaluator()(exports.ModelValidationExpressionHydrator);

class ValidateInstruction {
    constructor(e = void 0, t = void 0, s = void 0, r = void 0, i = void 0) {
        this.object = e;
        this.propertyName = t;
        this.rules = s;
        this.objectTag = r;
        this.propertyTag = i;
    }
}

const g = /*@__PURE__*/ e.DI.createInterface("IValidator");

class StandardValidator {
    async validate(e) {
        const t = e.object;
        const r = e.propertyName;
        const i = e.propertyTag;
        const n = e.rules ?? c.get(t, e.objectTag) ?? [];
        const a = s.Scope.create({
            [$]: t
        });
        if (r !== void 0) {
            return await (n.find((e => e.property.name === r))?.validate(t, i, a)) ?? [];
        }
        return (await Promise.all(n.map((async e => e.validate(t, i, a))))).flat();
    }
}

function getDefaultValidationConfiguration() {
    return {
        ValidatorType: StandardValidator,
        MessageProviderType: exports.ValidationMessageProvider,
        CustomMessages: [],
        HydratorType: exports.ModelValidationExpressionHydrator
    };
}

function createConfiguration(t) {
    return {
        optionsProvider: t,
        register(s) {
            const r = getDefaultValidationConfiguration();
            t(r);
            s.register(e.Registration.instance(l, r.CustomMessages), e.Registration.singleton(g, r.ValidatorType), e.Registration.singleton(a, r.MessageProviderType), e.Registration.singleton(n, r.HydratorType), e.Registration.transient(h, exports.ValidationRules), exports.ValidationDeserializer);
            return s;
        },
        customize(e) {
            return createConfiguration(e ?? t);
        }
    };
}

const y = createConfiguration(e.noop);

exports.Deserializer = Deserializer;

exports.ICustomMessages = l;

exports.IValidationExpressionHydrator = n;

exports.IValidationMessageProvider = a;

exports.IValidationRules = h;

exports.IValidator = g;

exports.ModelBasedRule = ModelBasedRule;

exports.PropertyRule = PropertyRule;

exports.RuleProperty = RuleProperty;

exports.Serializer = Serializer;

exports.StandardValidator = StandardValidator;

exports.ValidateInstruction = ValidateInstruction;

exports.ValidationConfiguration = y;

exports.ValidationResult = ValidationResult;

exports.ValidationRuleAliasMessage = o;

exports.ValidationSerializer = ValidationSerializer;

exports.deserializePrimitive = deserializePrimitive;

exports.getDefaultValidationConfiguration = getDefaultValidationConfiguration;

exports.parsePropertyName = parsePropertyName;

exports.rootObjectSymbol = $;

exports.serializePrimitive = serializePrimitive;

exports.serializePrimitives = serializePrimitives;

exports.validationRule = validationRule;

exports.validationRulesRegistrar = c;
//# sourceMappingURL=index.cjs.map
