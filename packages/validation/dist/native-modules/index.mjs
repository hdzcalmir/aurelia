import { DI as e, Protocol as t, toArray as s, resolve as i, IServiceLocator as r, ILogger as n, Registration as a, noop as o } from "../../../kernel/dist/native-modules/index.mjs";

import * as u from "../../../expression-parser/dist/native-modules/index.mjs";

import { IExpressionParser as l, PrimitiveLiteralExpression as c } from "../../../expression-parser/dist/native-modules/index.mjs";

import { mixinAstEvaluator as h, Scope as d, astEvaluate as $ } from "../../../runtime-html/dist/native-modules/index.mjs";

import { Metadata as m } from "../../../metadata/dist/native-modules/index.mjs";

const p = /*@__PURE__*/ e.createInterface("IValidationExpressionHydrator");

const f = m.get;

const g = m.define;

const R = m.delete;

const {annotation: v} = t;

const y = v.keyFor;

const w = /*@__PURE__*/ e.createInterface("IValidationMessageProvider");

const P = Object.freeze({
    aliasKey: y("validation-rule-alias-message"),
    define(e, t, s) {
        this.setDefaultMessage(e, t, s);
    },
    setDefaultMessage(e, {aliases: t}, i) {
        const r = i ? f(this.aliasKey, e) : void 0;
        if (r !== void 0) {
            const e = {
                ...Object.fromEntries(r.map((({name: e, defaultMessage: t}) => [ e, t ]))),
                ...Object.fromEntries(t.map((({name: e, defaultMessage: t}) => [ e, t ])))
            };
            t = s(Object.entries(e)).map((([e, t]) => ({
                name: e,
                defaultMessage: t
            })));
        }
        g(t, e instanceof Function ? e : e.constructor, this.aliasKey);
    },
    getDefaultMessages(e) {
        return f(this.aliasKey, e instanceof Function ? e : e.constructor);
    }
});

function validationRule(e) {
    return function(t, s) {
        s.addInitializer((function() {
            P.define(this, e, false);
        }));
        return t;
    };
}

class BaseValidationRule {
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
}

BaseValidationRule.$TYPE = "";

class RequiredRule extends BaseValidationRule {
    constructor() {
        super("required");
    }
    execute(e) {
        return e !== null && e !== void 0 && !(typeof e === "string" && !/\S/.test(e));
    }
    accept(e) {
        return e.visitRequiredRule(this);
    }
}

RequiredRule.$TYPE = "RequiredRule";

class RegexRule extends BaseValidationRule {
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
}

RegexRule.$TYPE = "RegexRule";

class LengthRule extends BaseValidationRule {
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
}

LengthRule.$TYPE = "LengthRule";

class SizeRule extends BaseValidationRule {
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
}

SizeRule.$TYPE = "SizeRule";

class RangeRule extends BaseValidationRule {
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
}

RangeRule.$TYPE = "RangeRule";

class EqualsRule extends BaseValidationRule {
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
}

EqualsRule.$TYPE = "EqualsRule";

P.define(EqualsRule, {
    aliases: [ {
        name: "equals",
        defaultMessage: `\${$displayName} must be \${$rule.expectedValue}.`
    } ]
}, false);

P.define(RangeRule, {
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
}, false);

P.define(SizeRule, {
    aliases: [ {
        name: "minItems",
        defaultMessage: `\${$displayName} must contain at least \${$rule.count} item\${$rule.count === 1 ? '' : 's'}.`
    }, {
        name: "maxItems",
        defaultMessage: `\${$displayName} cannot contain more than \${$rule.count} item\${$rule.count === 1 ? '' : 's'}.`
    } ]
}, false);

P.define(LengthRule, {
    aliases: [ {
        name: "minLength",
        defaultMessage: `\${$displayName} must be at least \${$rule.length} character\${$rule.length === 1 ? '' : 's'}.`
    }, {
        name: "maxLength",
        defaultMessage: `\${$displayName} cannot be longer than \${$rule.length} character\${$rule.length === 1 ? '' : 's'}.`
    } ]
}, false);

P.define(RegexRule, {
    aliases: [ {
        name: "matches",
        defaultMessage: `\${$displayName} is not correctly formatted.`
    }, {
        name: "email",
        defaultMessage: `\${$displayName} is not a valid email.`
    } ]
}, false);

P.define(RequiredRule, {
    aliases: [ {
        name: "required",
        defaultMessage: `\${$displayName} is required.`
    } ]
}, false);

P.define(BaseValidationRule, {
    aliases: [ {
        name: void 0,
        defaultMessage: `\${$displayName} is invalid.`
    } ]
}, false);

const x = /*@__PURE__*/ e.createInterface("ICustomMessages");

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

const E = Object.freeze({
    allRulesAnnotations: y("validation-rules-annotations"),
    name: "validation-rules",
    defaultRuleSetName: "__default",
    set(e, t, s) {
        const i = `${E.name}:${s ?? E.defaultRuleSetName}`;
        g(t, e, y(i));
        const r = f(this.allRulesAnnotations, e);
        if (r === void 0) {
            g([ i ], e, this.allRulesAnnotations);
        } else {
            r.push(i);
        }
    },
    get(e, t) {
        const s = y(E.name, t ?? E.defaultRuleSetName);
        return f(s, e) ?? f(s, e.constructor);
    },
    unset(e, t) {
        const s = f(this.allRulesAnnotations, e);
        if (!Array.isArray(s)) return;
        for (const i of s.slice(0)) {
            if (i.startsWith(E.name) && (t === void 0 || i.endsWith(t))) {
                R(y(i), e);
                const t = s.indexOf(i);
                if (t > -1) {
                    s.splice(t, 1);
                }
            }
        }
    },
    isValidationRulesSet(e) {
        const t = f(this.allRulesAnnotations, e);
        return t !== void 0 && t.some((e => e.startsWith(E.name)));
    }
});

class ValidationMessageEvaluationContext {
    constructor(e, t, s, i, r, n) {
        this.messageProvider = e;
        this.$displayName = t;
        this.$propertyName = s;
        this.$value = i;
        this.$rule = r;
        this.$object = n;
    }
    $getDisplayName(e, t) {
        return this.messageProvider.getDisplayName(e, t);
    }
}

class PropertyRule {
    constructor(e, t, s, i, r = [ [] ]) {
        this.validationRules = t;
        this.messageProvider = s;
        this.property = i;
        this.$rules = r;
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
    async validate(e, t, s) {
        if (s === void 0) {
            s = d.create({
                [M]: e
            });
        }
        const i = this.property.expression;
        let r;
        if (i === void 0) {
            r = e;
        } else {
            r = $(i, s, this, null);
        }
        let n = true;
        const validateRuleset = async s => {
            const validateRule = async t => {
                let s = t.execute(r, e);
                if (s instanceof Promise) {
                    s = await s;
                }
                n = n && s;
                const {displayName: i, name: a} = this.property;
                let o;
                if (!s) {
                    const s = d.create(new ValidationMessageEvaluationContext(this.messageProvider, this.messageProvider.getDisplayName(a, i), a, r, t, e));
                    o = $(this.messageProvider.getMessage(t), s, this, null);
                }
                return new ValidationResult(s, o, a, e, t, this);
            };
            const i = [];
            for (const r of s) {
                if (r.canExecute(e) && (t === void 0 || r.tag === t)) {
                    i.push(validateRule(r));
                }
            }
            return Promise.all(i);
        };
        const accumulateResult = async (e, t) => {
            const s = await validateRuleset(t);
            e.push(...s);
            return e;
        };
        return this.$rules.reduce((async (e, t) => e.then((async e => n ? accumulateResult(e, t) : Promise.resolve(e)))), Promise.resolve([]));
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
        const t = new class extends BaseValidationRule {
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
        return this.addRule(new RequiredRule);
    }
    matches(e) {
        return this.addRule(new RegexRule(e));
    }
    email() {
        const e = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return this.addRule(new RegexRule(e, "email"));
    }
    minLength(e) {
        return this.addRule(new LengthRule(e, false));
    }
    maxLength(e) {
        return this.addRule(new LengthRule(e, true));
    }
    minItems(e) {
        return this.addRule(new SizeRule(e, false));
    }
    maxItems(e) {
        return this.addRule(new SizeRule(e, true));
    }
    min(e) {
        return this.addRule(new RangeRule(true, {
            min: e
        }));
    }
    max(e) {
        return this.addRule(new RangeRule(true, {
            max: e
        }));
    }
    range(e, t) {
        return this.addRule(new RangeRule(true, {
            min: e,
            max: t
        }));
    }
    between(e, t) {
        return this.addRule(new RangeRule(false, {
            min: e,
            max: t
        }));
    }
    equals(e) {
        return this.addRule(new EqualsRule(e));
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

h()(PropertyRule);

class ModelBasedRule {
    constructor(e, t = E.defaultRuleSetName) {
        this.ruleset = e;
        this.tag = t;
    }
}

const z = /*@__PURE__*/ e.createInterface("IValidationRules");

class ValidationRules {
    constructor() {
        this.rules = [];
        this.targets = new Set;
        this.locator = i(r);
        this.parser = i(l);
        this.messageProvider = i(w);
        this.deserializer = i(p);
    }
    ensure(e) {
        const [t, s] = parsePropertyName(e, this.parser);
        let i = this.rules.find((e => e.property.name == t));
        if (i === void 0) {
            i = new PropertyRule(this.locator, this, this.messageProvider, new RuleProperty(s, t));
            this.rules.push(i);
        }
        return i;
    }
    ensureObject() {
        const e = new PropertyRule(this.locator, this, this.messageProvider, new RuleProperty);
        this.rules.push(e);
        return e;
    }
    on(e, t) {
        const s = E.get(e, t);
        if (Object.is(s, this.rules)) {
            return this;
        }
        this.rules = s ?? [];
        E.set(e, this.rules, t);
        this.targets.add(e);
        return this;
    }
    off(e, t) {
        const s = e !== void 0 ? [ e ] : Array.from(this.targets);
        for (const e of s) {
            E.unset(e, t);
            if (!E.isValidationRulesSet(e)) {
                this.targets.delete(e);
            }
        }
    }
    applyModelBasedRules(e, t) {
        const s = new Set;
        for (const i of t) {
            const t = i.tag;
            if (s.has(t)) {
                console.warn(`A ruleset for tag ${t} is already defined which will be overwritten`);
            }
            const r = this.deserializer.hydrateRuleset(i.ruleset, this);
            E.set(e, r, t);
            s.add(t);
        }
    }
}

const b = /^(?:function)?\s*\(?[$_\w\d]+\)?\s*(?:=>)?\s*\{(?:\s*["']{1}use strict["']{1};)?(?:[$_\s\w\d\/\*.['"\]+;\(\)]+)?\s*return\s+[$_\w\d]+((\.[$_\w\d]+|\[['"$_\w\d]+\])+)\s*;?\s*\}$/;

const V = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+((\.[$_\w\d]+|\[['"$_\w\d]+\])+)$/;

const M = "$root";

function parsePropertyName(e, t) {
    switch (typeof e) {
      case "string":
        break;

      case "function":
        {
            const t = e.toString();
            const s = V.exec(t) ?? b.exec(t);
            if (s === null) {
                throw new Error(`Unable to parse accessor function:\n${t}`);
            }
            e = s[1].substring(1);
            break;
        }

      default:
        throw new Error(`Unable to parse accessor function:\n${e}`);
    }
    return [ e, t.parse(`${M}.${e}`, "IsProperty") ];
}

class ValidationResult {
    constructor(e, t, s, i, r, n, a = false) {
        this.valid = e;
        this.message = t;
        this.propertyName = s;
        this.object = i;
        this.rule = r;
        this.propertyRule = n;
        this.isManual = a;
        this.id = ValidationResult.nextId++;
    }
    toString() {
        return this.valid ? "Valid." : this.message;
    }
}

ValidationResult.nextId = 0;

const T = new Set([ "displayName", "propertyName", "value", "object", "config", "getDisplayName" ]);

class ValidationMessageProvider {
    constructor(e = i(n), t = i(x)) {
        this.registeredMessages = new WeakMap;
        this.parser = i(l);
        this.logger = e.scopeTo(ValidationMessageProvider.name);
        for (const {rule: e, aliases: s} of t) {
            P.setDefaultMessage(e, {
                aliases: s
            }, true);
        }
    }
    getMessage(e) {
        const t = this.registeredMessages.get(e);
        if (t !== void 0) {
            return t;
        }
        const s = P.getDefaultMessages(e);
        const i = e.messageKey;
        let r;
        const n = s.length;
        if (n === 1 && i === void 0) {
            r = s[0].defaultMessage;
        } else {
            r = s.find((e => e.name === i))?.defaultMessage;
        }
        if (!r) {
            r = P.getDefaultMessages(BaseValidationRule)[0].defaultMessage;
        }
        return this.setMessage(e, r);
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
                if (T.has(t)) {
                    this.logger.warn(`Did you mean to use "$${t}" instead of "${t}" in this validation message template: "${e}"?`);
                }
                if (s.$kind === "AccessThis" || s.ancestor > 0) {
                    throw new Error("$parent is not permitted in validation message expressions.");
                }
            }
            return t;
        }
        return new c(e);
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
}

const S = u.astVisit;

var N;

(function(e) {
    e["BindingBehaviorExpression"] = "BindingBehaviorExpression";
    e["ValueConverterExpression"] = "ValueConverterExpression";
    e["AssignExpression"] = "AssignExpression";
    e["ConditionalExpression"] = "ConditionalExpression";
    e["AccessThisExpression"] = "AccessThisExpression";
    e["AccessBoundaryExpression"] = "AccessBoundaryExpression";
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
})(N || (N = {}));

class Deserializer {
    static deserialize(e) {
        const t = new Deserializer;
        const s = JSON.parse(e);
        return t.hydrate(s);
    }
    hydrate(e) {
        switch (e.$TYPE) {
          case N.AccessMemberExpression:
            {
                const t = e;
                return new u.AccessMemberExpression(this.hydrate(t.object), t.name);
            }

          case N.AccessKeyedExpression:
            {
                const t = e;
                return new u.AccessKeyedExpression(this.hydrate(t.object), this.hydrate(t.key));
            }

          case N.AccessThisExpression:
            {
                const t = e;
                return new u.AccessThisExpression(t.ancestor);
            }

          case N.AccessBoundaryExpression:
            {
                return new u.AccessBoundaryExpression;
            }

          case N.AccessScopeExpression:
            {
                const t = e;
                return new u.AccessScopeExpression(t.name, t.ancestor);
            }

          case N.ArrayLiteralExpression:
            {
                const t = e;
                return new u.ArrayLiteralExpression(this.hydrate(t.elements));
            }

          case N.ObjectLiteralExpression:
            {
                const t = e;
                return new u.ObjectLiteralExpression(this.hydrate(t.keys), this.hydrate(t.values));
            }

          case N.PrimitiveLiteralExpression:
            {
                const t = e;
                return new u.PrimitiveLiteralExpression(this.hydrate(t.value));
            }

          case N.CallFunctionExpression:
            {
                const t = e;
                return new u.CallFunctionExpression(this.hydrate(t.func), this.hydrate(t.args));
            }

          case N.CallMemberExpression:
            {
                const t = e;
                return new u.CallMemberExpression(this.hydrate(t.object), t.name, this.hydrate(t.args));
            }

          case N.CallScopeExpression:
            {
                const t = e;
                return new u.CallScopeExpression(t.name, this.hydrate(t.args), t.ancestor);
            }

          case N.TemplateExpression:
            {
                const t = e;
                return new u.TemplateExpression(this.hydrate(t.cooked), this.hydrate(t.expressions));
            }

          case N.TaggedTemplateExpression:
            {
                const t = e;
                return new u.TaggedTemplateExpression(this.hydrate(t.cooked), this.hydrate(t.raw), this.hydrate(t.func), this.hydrate(t.expressions));
            }

          case N.UnaryExpression:
            {
                const t = e;
                return new u.UnaryExpression(t.operation, this.hydrate(t.expression));
            }

          case N.BinaryExpression:
            {
                const t = e;
                return new u.BinaryExpression(t.operation, this.hydrate(t.left), this.hydrate(t.right));
            }

          case N.ConditionalExpression:
            {
                const t = e;
                return new u.ConditionalExpression(this.hydrate(t.condition), this.hydrate(t.yes), this.hydrate(t.no));
            }

          case N.AssignExpression:
            {
                const t = e;
                return new u.AssignExpression(this.hydrate(t.target), this.hydrate(t.value));
            }

          case N.ValueConverterExpression:
            {
                const t = e;
                return new u.ValueConverterExpression(this.hydrate(t.expression), t.name, this.hydrate(t.args));
            }

          case N.BindingBehaviorExpression:
            {
                const t = e;
                return new u.BindingBehaviorExpression(this.hydrate(t.expression), t.name, this.hydrate(t.args));
            }

          case N.ArrayBindingPattern:
            {
                const t = e;
                return new u.ArrayBindingPattern(this.hydrate(t.elements));
            }

          case N.ObjectBindingPattern:
            {
                const t = e;
                return new u.ObjectBindingPattern(this.hydrate(t.keys), this.hydrate(t.values));
            }

          case N.BindingIdentifier:
            {
                const t = e;
                return new u.BindingIdentifier(t.name);
            }

          case N.ForOfStatement:
            {
                const t = e;
                return new u.ForOfStatement(this.hydrate(t.declaration), this.hydrate(t.iterable), this.hydrate(t.semiIdx));
            }

          case N.Interpolation:
            {
                const t = e;
                return new u.Interpolation(this.hydrate(t.cooked), this.hydrate(t.expressions));
            }

          case N.DestructuringAssignment:
            {
                return new u.DestructuringAssignmentExpression(this.hydrate(e.$kind), this.hydrate(e.list), this.hydrate(e.source), this.hydrate(e.initializer));
            }

          case N.DestructuringSingleAssignment:
            {
                return new u.DestructuringAssignmentSingleExpression(this.hydrate(e.target), this.hydrate(e.source), this.hydrate(e.initializer));
            }

          case N.DestructuringRestAssignment:
            {
                return new u.DestructuringAssignmentRestExpression(this.hydrate(e.target), this.hydrate(e.indexOrProperties));
            }

          case N.ArrowFunction:
            {
                return new u.ArrowFunction(this.hydrate(e.parameters), this.hydrate(e.body), this.hydrate(e.rest));
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
        return S(e, t);
    }
    visitAccessMember(e) {
        return `{"$TYPE":"${N.AccessMemberExpression}","name":"${e.name}","object":${S(e.object, this)}}`;
    }
    visitAccessKeyed(e) {
        return `{"$TYPE":"${N.AccessKeyedExpression}","object":${S(e.object, this)},"key":${S(e.key, this)}}`;
    }
    visitAccessThis(e) {
        return `{"$TYPE":"${N.AccessThisExpression}","ancestor":${e.ancestor}}`;
    }
    visitAccessBoundary(e) {
        return `{"$TYPE":"${N.AccessBoundaryExpression}"}`;
    }
    visitAccessScope(e) {
        return `{"$TYPE":"${N.AccessScopeExpression}","name":"${e.name}","ancestor":${e.ancestor}}`;
    }
    visitArrayLiteral(e) {
        return `{"$TYPE":"${N.ArrayLiteralExpression}","elements":${this.serializeExpressions(e.elements)}}`;
    }
    visitObjectLiteral(e) {
        return `{"$TYPE":"${N.ObjectLiteralExpression}","keys":${serializePrimitives(e.keys)},"values":${this.serializeExpressions(e.values)}}`;
    }
    visitPrimitiveLiteral(e) {
        return `{"$TYPE":"${N.PrimitiveLiteralExpression}","value":${serializePrimitive(e.value)}}`;
    }
    visitCallFunction(e) {
        return `{"$TYPE":"${N.CallFunctionExpression}","func":${S(e.func, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitCallMember(e) {
        return `{"$TYPE":"${N.CallMemberExpression}","name":"${e.name}","object":${S(e.object, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitCallScope(e) {
        return `{"$TYPE":"${N.CallScopeExpression}","name":"${e.name}","ancestor":${e.ancestor},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitTemplate(e) {
        return `{"$TYPE":"${N.TemplateExpression}","cooked":${serializePrimitives(e.cooked)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitTaggedTemplate(e) {
        return `{"$TYPE":"${N.TaggedTemplateExpression}","cooked":${serializePrimitives(e.cooked)},"raw":${serializePrimitives(e.cooked.raw)},"func":${S(e.func, this)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitUnary(e) {
        return `{"$TYPE":"${N.UnaryExpression}","operation":"${e.operation}","expression":${S(e.expression, this)}}`;
    }
    visitBinary(e) {
        return `{"$TYPE":"${N.BinaryExpression}","operation":"${e.operation}","left":${S(e.left, this)},"right":${S(e.right, this)}}`;
    }
    visitConditional(e) {
        return `{"$TYPE":"${N.ConditionalExpression}","condition":${S(e.condition, this)},"yes":${S(e.yes, this)},"no":${S(e.no, this)}}`;
    }
    visitAssign(e) {
        return `{"$TYPE":"${N.AssignExpression}","target":${S(e.target, this)},"value":${S(e.value, this)}}`;
    }
    visitValueConverter(e) {
        return `{"$TYPE":"${N.ValueConverterExpression}","name":"${e.name}","expression":${S(e.expression, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitBindingBehavior(e) {
        return `{"$TYPE":"${N.BindingBehaviorExpression}","name":"${e.name}","expression":${S(e.expression, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitArrayBindingPattern(e) {
        return `{"$TYPE":"${N.ArrayBindingPattern}","elements":${this.serializeExpressions(e.elements)}}`;
    }
    visitObjectBindingPattern(e) {
        return `{"$TYPE":"${N.ObjectBindingPattern}","keys":${serializePrimitives(e.keys)},"values":${this.serializeExpressions(e.values)}}`;
    }
    visitBindingIdentifier(e) {
        return `{"$TYPE":"${N.BindingIdentifier}","name":"${e.name}"}`;
    }
    visitForOfStatement(e) {
        return `{"$TYPE":"${N.ForOfStatement}","declaration":${S(e.declaration, this)},"iterable":${S(e.iterable, this)},"semiIdx":${serializePrimitive(e.semiIdx)}}`;
    }
    visitInterpolation(e) {
        return `{"$TYPE":"${N.Interpolation}","cooked":${serializePrimitives(e.parts)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitDestructuringAssignmentExpression(e) {
        return `{"$TYPE":"${N.DestructuringAssignment}","$kind":${serializePrimitive(e.$kind)},"list":${this.serializeExpressions(e.list)},"source":${e.source === void 0 ? serializePrimitive(e.source) : S(e.source, this)},"initializer":${e.initializer === void 0 ? serializePrimitive(e.initializer) : S(e.initializer, this)}}`;
    }
    visitDestructuringAssignmentSingleExpression(e) {
        return `{"$TYPE":"${N.DestructuringSingleAssignment}","source":${S(e.source, this)},"target":${S(e.target, this)},"initializer":${e.initializer === void 0 ? serializePrimitive(e.initializer) : S(e.initializer, this)}}`;
    }
    visitDestructuringAssignmentRestExpression(e) {
        return `{"$TYPE":"${N.DestructuringRestAssignment}","target":${S(e.target, this)},"indexOrProperties":${Array.isArray(e.indexOrProperties) ? serializePrimitives(e.indexOrProperties) : serializePrimitive(e.indexOrProperties)}}`;
    }
    visitArrowFunction(e) {
        return `{"$TYPE":"${N.ArrowFunction}","parameters":${this.serializeExpressions(e.args)},"body":${S(e.body, this)},"rest":${serializePrimitive(e.rest)}}`;
    }
    visitCustom(e) {
        return `{"$TYPE":"${N.Custom}","body":${e.value}}`;
    }
    serializeExpressions(e) {
        let t = "[";
        for (let s = 0, i = e.length; s < i; ++s) {
            if (s !== 0) {
                t += ",";
            }
            t += S(e[s], this);
        }
        t += "]";
        return t;
    }
}

function serializePrimitives(e) {
    let t = "[";
    for (let s = 0, i = e.length; s < i; ++s) {
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
    for (let s = 0, i = e.length; s < i; ++s) {
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

class ValidationSerializer {
    static serialize(e) {
        if (e == null || typeof e.accept !== "function") {
            return `${e}`;
        }
        const t = new ValidationSerializer;
        return e.accept(t);
    }
    visitRequiredRule(e) {
        return `{"$TYPE":"${RequiredRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)}}`;
    }
    visitRegexRule(e) {
        const t = e.pattern;
        return `{"$TYPE":"${RegexRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"pattern":{"source":${serializePrimitive(t.source)},"flags":"${t.flags}"}}`;
    }
    visitLengthRule(e) {
        return `{"$TYPE":"${LengthRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"length":${serializePrimitive(e.length)},"isMax":${serializePrimitive(e.isMax)}}`;
    }
    visitSizeRule(e) {
        return `{"$TYPE":"${SizeRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"count":${serializePrimitive(e.count)},"isMax":${serializePrimitive(e.isMax)}}`;
    }
    visitRangeRule(e) {
        return `{"$TYPE":"${RangeRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"isInclusive":${e.isInclusive},"min":${this.serializeNumber(e.min)},"max":${this.serializeNumber(e.max)}}`;
    }
    visitEqualsRule(e) {
        const t = e.expectedValue;
        let s;
        if (typeof t !== "object" || t === null) {
            s = serializePrimitive(t);
        } else {
            s = JSON.stringify(t);
        }
        return `{"$TYPE":"${EqualsRule.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"expectedValue":${s}}`;
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

class ValidationDeserializer {
    static register(e) {
        this.container = e;
    }
    static deserialize(e, t) {
        const s = this.container.get(w);
        const i = this.container.get(l);
        const r = new ValidationDeserializer(this.container, s, i);
        const n = JSON.parse(e);
        return r.hydrate(n, t);
    }
    constructor(e = i(r), t = i(w), s = i(l)) {
        this.locator = e;
        this.messageProvider = t;
        this.parser = s;
        this.astDeserializer = new Deserializer;
    }
    hydrate(e, t) {
        switch (e.$TYPE) {
          case RequiredRule.$TYPE:
            {
                const t = e;
                const s = new RequiredRule;
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case RegexRule.$TYPE:
            {
                const t = e;
                const s = t.pattern;
                const i = this.astDeserializer;
                const r = new RegexRule(new RegExp(i.hydrate(s.source), s.flags), t.messageKey);
                r.tag = i.hydrate(t.tag);
                return r;
            }

          case LengthRule.$TYPE:
            {
                const t = e;
                const s = new LengthRule(t.length, t.isMax);
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case SizeRule.$TYPE:
            {
                const t = e;
                const s = new SizeRule(t.count, t.isMax);
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case RangeRule.$TYPE:
            {
                const t = e;
                const s = new RangeRule(t.isInclusive, {
                    min: t.min ?? Number.NEGATIVE_INFINITY,
                    max: t.max ?? Number.POSITIVE_INFINITY
                });
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case EqualsRule.$TYPE:
            {
                const t = e;
                const s = this.astDeserializer;
                const i = new EqualsRule(typeof t.expectedValue !== "object" ? s.hydrate(t.expectedValue) : t.expectedValue);
                i.messageKey = t.messageKey;
                i.tag = s.hydrate(t.tag);
                return i;
            }

          case RuleProperty.$TYPE:
            {
                const t = e;
                const s = this.astDeserializer;
                let i = t.name;
                i = i === "undefined" ? void 0 : s.hydrate(i);
                let r = t.expression;
                if (r !== null && r !== void 0) {
                    r = s.hydrate(r);
                } else if (i !== void 0) {
                    [, r] = parsePropertyName(i, this.parser);
                } else {
                    r = void 0;
                }
                let n = t.displayName;
                n = n === "undefined" ? void 0 : s.hydrate(n);
                return new RuleProperty(r, i, n);
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
}

class ModelValidationExpressionHydrator {
    constructor() {
        this.astDeserializer = new Deserializer;
        this.l = i(r);
        this.messageProvider = i(w);
        this.parser = i(l);
    }
    hydrate(e, t) {
        throw new Error("Method not implemented.");
    }
    hydrateRuleset(e, t) {
        const s = [];
        const iterate = (e, i = []) => {
            for (const [r, n] of e) {
                if (this.isModelPropertyRule(n)) {
                    const e = n.rules.map((e => Object.entries(e).map((([e, t]) => this.hydrateRule(e, t)))));
                    const a = i.join(".");
                    const o = this.hydrateRuleProperty({
                        name: a !== "" ? `${a}.${r}` : r,
                        displayName: n.displayName
                    });
                    s.push(new PropertyRule(this.l, t, this.messageProvider, o, e));
                } else {
                    iterate(Object.entries(n), [ ...i, r ]);
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
        const s = e.messageKey;
        if (s !== void 0 && s !== null) {
            t.messageKey = s;
        }
        t.tag = e.tag;
        const i = e.when;
        if (i) {
            if (typeof i === "string") {
                const e = this.parser.parse(i, "None");
                t.canExecute = t => $(e, d.create({
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
        const t = new RequiredRule;
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRegexRule(e) {
        const t = e.pattern;
        const s = new RegexRule(new RegExp(t.source, t.flags), e.messageKey);
        s.tag = e.tag;
        return s;
    }
    hydrateLengthRule(e) {
        const t = new LengthRule(e.length, e.isMax);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateSizeRule(e) {
        const t = new SizeRule(e.count, e.isMax);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRangeRule(e) {
        const t = new RangeRule(e.isInclusive, {
            min: e.min,
            max: e.max
        });
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateEqualsRule(e) {
        const t = new EqualsRule(e.expectedValue);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRuleProperty(e) {
        const t = e.name;
        if (!t || typeof t !== "string") {
            throw new Error("The property name needs to be a non-empty string");
        }
        const [s, i] = parsePropertyName(t, this.parser);
        return new RuleProperty(i, s, e.displayName);
    }
}

h()(ModelValidationExpressionHydrator);

class ValidateInstruction {
    constructor(e = void 0, t = void 0, s = void 0, i = void 0, r = void 0) {
        this.object = e;
        this.propertyName = t;
        this.rules = s;
        this.objectTag = i;
        this.propertyTag = r;
    }
}

const A = /*@__PURE__*/ e.createInterface("IValidator");

class StandardValidator {
    async validate(e) {
        const t = e.object;
        const s = e.propertyName;
        const i = e.propertyTag;
        const r = e.rules ?? E.get(t, e.objectTag) ?? [];
        const n = d.create({
            [M]: t
        });
        if (s !== void 0) {
            return await (r.find((e => e.property.name === s))?.validate(t, i, n)) ?? [];
        }
        return (await Promise.all(r.map((async e => e.validate(t, i, n))))).flat();
    }
}

function getDefaultValidationConfiguration() {
    return {
        ValidatorType: StandardValidator,
        MessageProviderType: ValidationMessageProvider,
        CustomMessages: [],
        HydratorType: ModelValidationExpressionHydrator
    };
}

function createConfiguration(e) {
    return {
        optionsProvider: e,
        register(t) {
            const s = getDefaultValidationConfiguration();
            e(s);
            t.register(a.instance(x, s.CustomMessages), a.singleton(A, s.ValidatorType), a.singleton(w, s.MessageProviderType), a.singleton(p, s.HydratorType), a.transient(z, ValidationRules), ValidationDeserializer);
            return t;
        },
        customize(t) {
            return createConfiguration(t ?? e);
        }
    };
}

const Y = createConfiguration(o);

export { BaseValidationRule, Deserializer, EqualsRule, x as ICustomMessages, p as IValidationExpressionHydrator, w as IValidationMessageProvider, z as IValidationRules, A as IValidator, LengthRule, ModelBasedRule, ModelValidationExpressionHydrator, PropertyRule, RangeRule, RegexRule, RequiredRule, RuleProperty, Serializer, SizeRule, StandardValidator, ValidateInstruction, Y as ValidationConfiguration, ValidationDeserializer, ValidationMessageProvider, ValidationResult, P as ValidationRuleAliasMessage, ValidationRules, ValidationSerializer, deserializePrimitive, getDefaultValidationConfiguration, parsePropertyName, M as rootObjectSymbol, serializePrimitive, serializePrimitives, validationRule, E as validationRulesRegistrar };

