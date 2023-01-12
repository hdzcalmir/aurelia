import { DI as e, Protocol as t, toArray as s, IServiceLocator as i, ILogger as r, Registration as n, noop as a } from "@aurelia/kernel";

import { Metadata as o } from "@aurelia/metadata";

import * as u from "@aurelia/runtime";

import { Scope as c, astEvaluate as l, PrimitiveLiteralExpression as h, IExpressionParser as $ } from "@aurelia/runtime";

import { mixinAstEvaluator as d } from "@aurelia/runtime-html";

const m = e.createInterface("IValidationExpressionHydrator");

function f(e, t, s, i) {
    var r = arguments.length, n = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, s) : i, a;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) n = Reflect.decorate(e, t, s, i); else for (var o = e.length - 1; o >= 0; o--) if (a = e[o]) n = (r < 3 ? a(n) : r > 3 ? a(t, s, n) : a(t, s)) || n;
    return r > 3 && n && Object.defineProperty(t, s, n), n;
}

function p(e, t) {
    return function(s, i) {
        t(s, i, e);
    };
}

const g = e.createInterface("IValidationMessageProvider");

const w = Object.freeze({
    aliasKey: t.annotation.keyFor("validation-rule-alias-message"),
    define(e, t) {
        w.setDefaultMessage(e, t);
        return e;
    },
    setDefaultMessage(e, {aliases: t}, i = true) {
        const r = i ? o.getOwn(this.aliasKey, e.prototype) : void 0;
        if (void 0 !== r) {
            const e = {
                ...Object.fromEntries(r.map((({name: e, defaultMessage: t}) => [ e, t ]))),
                ...Object.fromEntries(t.map((({name: e, defaultMessage: t}) => [ e, t ])))
            };
            t = s(Object.entries(e)).map((([e, t]) => ({
                name: e,
                defaultMessage: t
            })));
        }
        o.define(w.aliasKey, t, e instanceof Function ? e.prototype : e);
    },
    getDefaultMessages(e) {
        return o.get(this.aliasKey, e instanceof Function ? e.prototype : e);
    }
});

function y(e) {
    return function(t) {
        return w.define(t, e);
    };
}

let v = class BaseValidationRule {
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

v.$TYPE = "";

v = f([ y({
    aliases: [ {
        name: void 0,
        defaultMessage: `\${$displayName} is invalid.`
    } ]
}) ], v);

let x = class RequiredRule extends v {
    constructor() {
        super("required");
    }
    execute(e) {
        return null !== e && void 0 !== e && !("string" === typeof e && !/\S/.test(e));
    }
    accept(e) {
        return e.visitRequiredRule(this);
    }
};

x.$TYPE = "RequiredRule";

x = f([ y({
    aliases: [ {
        name: "required",
        defaultMessage: `\${$displayName} is required.`
    } ]
}) ], x);

let R = class RegexRule extends v {
    constructor(e, t = "matches") {
        super(t);
        this.pattern = e;
    }
    execute(e) {
        return null === e || void 0 === e || 0 === e.length || this.pattern.test(e);
    }
    accept(e) {
        return e.visitRegexRule(this);
    }
};

R.$TYPE = "RegexRule";

R = f([ y({
    aliases: [ {
        name: "matches",
        defaultMessage: `\${$displayName} is not correctly formatted.`
    }, {
        name: "email",
        defaultMessage: `\${$displayName} is not a valid email.`
    } ]
}) ], R);

let E = class LengthRule extends v {
    constructor(e, t) {
        super(t ? "maxLength" : "minLength");
        this.length = e;
        this.isMax = t;
    }
    execute(e) {
        return null === e || void 0 === e || 0 === e.length || (this.isMax ? e.length <= this.length : e.length >= this.length);
    }
    accept(e) {
        return e.visitLengthRule(this);
    }
};

E.$TYPE = "LengthRule";

E = f([ y({
    aliases: [ {
        name: "minLength",
        defaultMessage: `\${$displayName} must be at least \${$rule.length} character\${$rule.length === 1 ? '' : 's'}.`
    }, {
        name: "maxLength",
        defaultMessage: `\${$displayName} cannot be longer than \${$rule.length} character\${$rule.length === 1 ? '' : 's'}.`
    } ]
}) ], E);

let P = class SizeRule extends v {
    constructor(e, t) {
        super(t ? "maxItems" : "minItems");
        this.count = e;
        this.isMax = t;
    }
    execute(e) {
        return null === e || void 0 === e || (this.isMax ? e.length <= this.count : e.length >= this.count);
    }
    accept(e) {
        return e.visitSizeRule(this);
    }
};

P.$TYPE = "SizeRule";

P = f([ y({
    aliases: [ {
        name: "minItems",
        defaultMessage: `\${$displayName} must contain at least \${$rule.count} item\${$rule.count === 1 ? '' : 's'}.`
    }, {
        name: "maxItems",
        defaultMessage: `\${$displayName} cannot contain more than \${$rule.count} item\${$rule.count === 1 ? '' : 's'}.`
    } ]
}) ], P);

let b = class RangeRule extends v {
    constructor(e, {min: t, max: s}) {
        super(void 0 !== t && void 0 !== s ? e ? "range" : "between" : void 0 !== t ? "min" : "max");
        this.isInclusive = e;
        this.min = Number.NEGATIVE_INFINITY;
        this.max = Number.POSITIVE_INFINITY;
        this.min = t ?? this.min;
        this.max = s ?? this.max;
    }
    execute(e, t) {
        return null === e || void 0 === e || (this.isInclusive ? e >= this.min && e <= this.max : e > this.min && e < this.max);
    }
    accept(e) {
        return e.visitRangeRule(this);
    }
};

b.$TYPE = "RangeRule";

b = f([ y({
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
}) ], b);

let T = class EqualsRule extends v {
    constructor(e) {
        super("equals");
        this.expectedValue = e;
    }
    execute(e) {
        return null === e || void 0 === e || "" === e || e === this.expectedValue;
    }
    accept(e) {
        return e.visitEqualsRule(this);
    }
};

T.$TYPE = "EqualsRule";

T = f([ y({
    aliases: [ {
        name: "equals",
        defaultMessage: `\${$displayName} must be \${$rule.expectedValue}.`
    } ]
}) ], T);

const M = e.createInterface("ICustomMessages");

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

const z = Object.freeze({
    name: "validation-rules",
    defaultRuleSetName: "__default",
    set(e, s, i) {
        const r = `${z.name}:${i ?? z.defaultRuleSetName}`;
        o.define(t.annotation.keyFor(r), s, e);
        const n = o.getOwn(t.annotation.name, e);
        if (void 0 === n) o.define(t.annotation.name, [ r ], e); else n.push(r);
    },
    get(e, s) {
        const i = t.annotation.keyFor(z.name, s ?? z.defaultRuleSetName);
        return o.get(i, e) ?? o.getOwn(i, e.constructor);
    },
    unset(e, s) {
        const i = o.getOwn(t.annotation.name, e);
        for (const r of i.slice(0)) if (r.startsWith(z.name) && (void 0 === s || r.endsWith(s))) {
            o.delete(t.annotation.keyFor(r), e);
            const s = i.indexOf(r);
            if (s > -1) i.splice(s, 1);
        }
    },
    isValidationRulesSet(e) {
        const s = o.getOwn(t.annotation.name, e);
        return void 0 !== s && s.some((e => e.startsWith(z.name)));
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
    async validate(e, t, s, i) {
        if (void 0 === i) i = c.create({
            [V]: e
        });
        const r = this.property.expression;
        let n;
        if (void 0 === r) n = e; else n = l(r, i, this, null);
        let a = true;
        const o = async s => {
            const i = async t => {
                let s = t.execute(n, e);
                if (s instanceof Promise) s = await s;
                a = a && s;
                const {displayName: i, name: r} = this.property;
                let o;
                if (!s) {
                    const s = c.create(new ValidationMessageEvaluationContext(this.messageProvider, this.messageProvider.getDisplayName(r, i), r, n, t, e));
                    o = l(this.messageProvider.getMessage(t), s, this, null);
                }
                return new ValidationResult(s, o, r, e, t, this);
            };
            const r = [];
            for (const n of s) if (n.canExecute(e) && (void 0 === t || n.tag === t)) r.push(i(n));
            return Promise.all(r);
        };
        const u = async (e, t) => {
            const s = await o(t);
            e.push(...s);
            return e;
        };
        return this.$rules.reduce((async (e, t) => e.then((async e => a ? u(e, t) : Promise.resolve(e)))), Promise.resolve([]));
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
        if (void 0 === e) throw new Error("No rule has been added");
    }
    displayName(e) {
        this.property.displayName = e;
        return this;
    }
    satisfies(e) {
        const t = new class extends v {
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
        return this.addRule(new x);
    }
    matches(e) {
        return this.addRule(new R(e));
    }
    email() {
        const e = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return this.addRule(new R(e, "email"));
    }
    minLength(e) {
        return this.addRule(new E(e, false));
    }
    maxLength(e) {
        return this.addRule(new E(e, true));
    }
    minItems(e) {
        return this.addRule(new P(e, false));
    }
    maxItems(e) {
        return this.addRule(new P(e, true));
    }
    min(e) {
        return this.addRule(new b(true, {
            min: e
        }));
    }
    max(e) {
        return this.addRule(new b(true, {
            max: e
        }));
    }
    range(e, t) {
        return this.addRule(new b(true, {
            min: e,
            max: t
        }));
    }
    between(e, t) {
        return this.addRule(new b(false, {
            min: e,
            max: t
        }));
    }
    equals(e) {
        return this.addRule(new T(e));
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

d()(PropertyRule);

class ModelBasedRule {
    constructor(e, t = z.defaultRuleSetName) {
        this.ruleset = e;
        this.tag = t;
    }
}

const N = e.createInterface("IValidationRules");

let Y = class ValidationRules {
    constructor(e, t, s, i) {
        this.locator = e;
        this.parser = t;
        this.messageProvider = s;
        this.deserializer = i;
        this.rules = [];
        this.targets = new Set;
    }
    ensure(e) {
        const [t, s] = j(e, this.parser);
        let i = this.rules.find((e => e.property.name == t));
        if (void 0 === i) {
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
        const s = z.get(e, t);
        if (Object.is(s, this.rules)) return this;
        this.rules = s ?? [];
        z.set(e, this.rules, t);
        this.targets.add(e);
        return this;
    }
    off(e, t) {
        const s = void 0 !== e ? [ e ] : Array.from(this.targets);
        for (const e of s) {
            z.unset(e, t);
            if (!z.isValidationRulesSet(e)) this.targets.delete(e);
        }
    }
    applyModelBasedRules(e, t) {
        const s = new Set;
        for (const i of t) {
            const t = i.tag;
            if (s.has(t)) console.warn(`A ruleset for tag ${t} is already defined which will be overwritten`);
            const r = this.deserializer.hydrateRuleset(i.ruleset, this);
            z.set(e, r, t);
            s.add(t);
        }
    }
};

Y = f([ p(0, i), p(1, $), p(2, g), p(3, m) ], Y);

const A = /^function\s*\([$_\w\d]+\)\s*\{(?:\s*["']{1}use strict["']{1};)?(?:[$_\s\w\d\/\*.['"\]+;]+)?\s*return\s+[$_\w\d]+((\.[$_\w\d]+|\[['"$_\w\d]+\])+)\s*;?\s*\}$/;

const S = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+((\.[$_\w\d]+|\[['"$_\w\d]+\])+)$/;

const V = "$root";

function j(e, t) {
    switch (typeof e) {
      case "string":
        break;

      case "function":
        {
            const t = e.toString();
            const s = S.exec(t) ?? A.exec(t);
            if (null === s) throw new Error(`Unable to parse accessor function:\n${t}`);
            e = s[1].substring(1);
            break;
        }

      default:
        throw new Error(`Unable to parse accessor function:\n${e}`);
    }
    return [ e, t.parse(`${V}.${e}`, 16) ];
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

const I = new Set([ "displayName", "propertyName", "value", "object", "config", "getDisplayName" ]);

let O = class ValidationMessageProvider {
    constructor(e, t, s) {
        this.parser = e;
        this.registeredMessages = new WeakMap;
        this.logger = t.scopeTo(ValidationMessageProvider.name);
        for (const {rule: e, aliases: t} of s) w.setDefaultMessage(e, {
            aliases: t
        });
    }
    getMessage(e) {
        const t = this.registeredMessages.get(e);
        if (void 0 !== t) return t;
        const s = w.getDefaultMessages(e);
        const i = e.messageKey;
        let r;
        const n = s.length;
        if (1 === n && void 0 === i) r = s[0].defaultMessage; else r = s.find((e => e.name === i))?.defaultMessage;
        if (!r) r = w.getDefaultMessages(v)[0].defaultMessage;
        return this.setMessage(e, r);
    }
    setMessage(e, t) {
        const s = this.parseMessage(t);
        this.registeredMessages.set(e, s);
        return s;
    }
    parseMessage(e) {
        const t = this.parser.parse(e, 1);
        if (23 === t?.$kind) {
            for (const s of t.expressions) {
                const t = s.name;
                if (I.has(t)) this.logger.warn(`Did you mean to use "$${t}" instead of "${t}" in this validation message template: "${e}"?`);
                if (0 === s.$kind || s.ancestor > 0) throw new Error("$parent is not permitted in validation message expressions.");
            }
            return t;
        }
        return new h(e);
    }
    getDisplayName(e, t) {
        if (null !== t && void 0 !== t) return t instanceof Function ? t() : t;
        if (void 0 === e) return;
        const s = e.toString().split(/(?=[A-Z])/).join(" ");
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
};

O = f([ p(0, $), p(1, r), p(2, M) ], O);

const D = u.astVisit;

var L;

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
})(L || (L = {}));

class Deserializer {
    static deserialize(e) {
        const t = new Deserializer;
        const s = JSON.parse(e);
        return t.hydrate(s);
    }
    hydrate(e) {
        switch (e.$TYPE) {
          case L.AccessMemberExpression:
            {
                const t = e;
                return new u.AccessMemberExpression(this.hydrate(t.object), t.name);
            }

          case L.AccessKeyedExpression:
            {
                const t = e;
                return new u.AccessKeyedExpression(this.hydrate(t.object), this.hydrate(t.key));
            }

          case L.AccessThisExpression:
            {
                const t = e;
                return new u.AccessThisExpression(t.ancestor);
            }

          case L.AccessScopeExpression:
            {
                const t = e;
                return new u.AccessScopeExpression(t.name, t.ancestor);
            }

          case L.ArrayLiteralExpression:
            {
                const t = e;
                return new u.ArrayLiteralExpression(this.hydrate(t.elements));
            }

          case L.ObjectLiteralExpression:
            {
                const t = e;
                return new u.ObjectLiteralExpression(this.hydrate(t.keys), this.hydrate(t.values));
            }

          case L.PrimitiveLiteralExpression:
            {
                const t = e;
                return new u.PrimitiveLiteralExpression(this.hydrate(t.value));
            }

          case L.CallFunctionExpression:
            {
                const t = e;
                return new u.CallFunctionExpression(this.hydrate(t.func), this.hydrate(t.args));
            }

          case L.CallMemberExpression:
            {
                const t = e;
                return new u.CallMemberExpression(this.hydrate(t.object), t.name, this.hydrate(t.args));
            }

          case L.CallScopeExpression:
            {
                const t = e;
                return new u.CallScopeExpression(t.name, this.hydrate(t.args), t.ancestor);
            }

          case L.TemplateExpression:
            {
                const t = e;
                return new u.TemplateExpression(this.hydrate(t.cooked), this.hydrate(t.expressions));
            }

          case L.TaggedTemplateExpression:
            {
                const t = e;
                return new u.TaggedTemplateExpression(this.hydrate(t.cooked), this.hydrate(t.raw), this.hydrate(t.func), this.hydrate(t.expressions));
            }

          case L.UnaryExpression:
            {
                const t = e;
                return new u.UnaryExpression(t.operation, this.hydrate(t.expression));
            }

          case L.BinaryExpression:
            {
                const t = e;
                return new u.BinaryExpression(t.operation, this.hydrate(t.left), this.hydrate(t.right));
            }

          case L.ConditionalExpression:
            {
                const t = e;
                return new u.ConditionalExpression(this.hydrate(t.condition), this.hydrate(t.yes), this.hydrate(t.no));
            }

          case L.AssignExpression:
            {
                const t = e;
                return new u.AssignExpression(this.hydrate(t.target), this.hydrate(t.value));
            }

          case L.ValueConverterExpression:
            {
                const t = e;
                return new u.ValueConverterExpression(this.hydrate(t.expression), t.name, this.hydrate(t.args));
            }

          case L.BindingBehaviorExpression:
            {
                const t = e;
                return new u.BindingBehaviorExpression(this.hydrate(t.expression), t.name, this.hydrate(t.args));
            }

          case L.ArrayBindingPattern:
            {
                const t = e;
                return new u.ArrayBindingPattern(this.hydrate(t.elements));
            }

          case L.ObjectBindingPattern:
            {
                const t = e;
                return new u.ObjectBindingPattern(this.hydrate(t.keys), this.hydrate(t.values));
            }

          case L.BindingIdentifier:
            {
                const t = e;
                return new u.BindingIdentifier(t.name);
            }

          case L.ForOfStatement:
            {
                const t = e;
                return new u.ForOfStatement(this.hydrate(t.declaration), this.hydrate(t.iterable), this.hydrate(t.semiIdx));
            }

          case L.Interpolation:
            {
                const t = e;
                return new u.Interpolation(this.hydrate(t.cooked), this.hydrate(t.expressions));
            }

          case L.DestructuringAssignment:
            return new u.DestructuringAssignmentExpression(this.hydrate(e.$kind), this.hydrate(e.list), this.hydrate(e.source), this.hydrate(e.initializer));

          case L.DestructuringSingleAssignment:
            return new u.DestructuringAssignmentSingleExpression(this.hydrate(e.target), this.hydrate(e.source), this.hydrate(e.initializer));

          case L.DestructuringRestAssignment:
            return new u.DestructuringAssignmentRestExpression(this.hydrate(e.target), this.hydrate(e.indexOrProperties));

          case L.ArrowFunction:
            return new u.ArrowFunction(this.hydrate(e.parameters), this.hydrate(e.body), this.hydrate(e.rest));

          default:
            if (Array.isArray(e)) if ("object" === typeof e[0]) return this.deserializeExpressions(e); else return e.map(k); else if ("object" !== typeof e) return k(e);
            throw new Error(`unable to deserialize the expression: ${e}`);
        }
    }
    deserializeExpressions(e) {
        const t = [];
        for (const s of e) t.push(this.hydrate(s));
        return t;
    }
}

class Serializer {
    static serialize(e) {
        const t = new Serializer;
        if (null == e) return `${e}`;
        return D(e, t);
    }
    visitAccessMember(e) {
        return `{"$TYPE":"${L.AccessMemberExpression}","name":"${e.name}","object":${D(e.object, this)}}`;
    }
    visitAccessKeyed(e) {
        return `{"$TYPE":"${L.AccessKeyedExpression}","object":${D(e.object, this)},"key":${D(e.key, this)}}`;
    }
    visitAccessThis(e) {
        return `{"$TYPE":"${L.AccessThisExpression}","ancestor":${e.ancestor}}`;
    }
    visitAccessScope(e) {
        return `{"$TYPE":"${L.AccessScopeExpression}","name":"${e.name}","ancestor":${e.ancestor}}`;
    }
    visitArrayLiteral(e) {
        return `{"$TYPE":"${L.ArrayLiteralExpression}","elements":${this.serializeExpressions(e.elements)}}`;
    }
    visitObjectLiteral(e) {
        return `{"$TYPE":"${L.ObjectLiteralExpression}","keys":${q(e.keys)},"values":${this.serializeExpressions(e.values)}}`;
    }
    visitPrimitiveLiteral(e) {
        return `{"$TYPE":"${L.PrimitiveLiteralExpression}","value":${C(e.value)}}`;
    }
    visitCallFunction(e) {
        return `{"$TYPE":"${L.CallFunctionExpression}","func":${D(e.func, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitCallMember(e) {
        return `{"$TYPE":"${L.CallMemberExpression}","name":"${e.name}","object":${D(e.object, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitCallScope(e) {
        return `{"$TYPE":"${L.CallScopeExpression}","name":"${e.name}","ancestor":${e.ancestor},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitTemplate(e) {
        return `{"$TYPE":"${L.TemplateExpression}","cooked":${q(e.cooked)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitTaggedTemplate(e) {
        return `{"$TYPE":"${L.TaggedTemplateExpression}","cooked":${q(e.cooked)},"raw":${q(e.cooked.raw)},"func":${D(e.func, this)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitUnary(e) {
        return `{"$TYPE":"${L.UnaryExpression}","operation":"${e.operation}","expression":${D(e.expression, this)}}`;
    }
    visitBinary(e) {
        return `{"$TYPE":"${L.BinaryExpression}","operation":"${e.operation}","left":${D(e.left, this)},"right":${D(e.right, this)}}`;
    }
    visitConditional(e) {
        return `{"$TYPE":"${L.ConditionalExpression}","condition":${D(e.condition, this)},"yes":${D(e.yes, this)},"no":${D(e.no, this)}}`;
    }
    visitAssign(e) {
        return `{"$TYPE":"${L.AssignExpression}","target":${D(e.target, this)},"value":${D(e.value, this)}}`;
    }
    visitValueConverter(e) {
        return `{"$TYPE":"${L.ValueConverterExpression}","name":"${e.name}","expression":${D(e.expression, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitBindingBehavior(e) {
        return `{"$TYPE":"${L.BindingBehaviorExpression}","name":"${e.name}","expression":${D(e.expression, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitArrayBindingPattern(e) {
        return `{"$TYPE":"${L.ArrayBindingPattern}","elements":${this.serializeExpressions(e.elements)}}`;
    }
    visitObjectBindingPattern(e) {
        return `{"$TYPE":"${L.ObjectBindingPattern}","keys":${q(e.keys)},"values":${this.serializeExpressions(e.values)}}`;
    }
    visitBindingIdentifier(e) {
        return `{"$TYPE":"${L.BindingIdentifier}","name":"${e.name}"}`;
    }
    visitForOfStatement(e) {
        return `{"$TYPE":"${L.ForOfStatement}","declaration":${D(e.declaration, this)},"iterable":${D(e.iterable, this)},"semiIdx":${C(e.semiIdx)}}`;
    }
    visitInterpolation(e) {
        return `{"$TYPE":"${L.Interpolation}","cooked":${q(e.parts)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitDestructuringAssignmentExpression(e) {
        return `{"$TYPE":"${L.DestructuringAssignment}","$kind":${C(e.$kind)},"list":${this.serializeExpressions(e.list)},"source":${void 0 === e.source ? C(e.source) : D(e.source, this)},"initializer":${void 0 === e.initializer ? C(e.initializer) : D(e.initializer, this)}}`;
    }
    visitDestructuringAssignmentSingleExpression(e) {
        return `{"$TYPE":"${L.DestructuringSingleAssignment}","source":${D(e.source, this)},"target":${D(e.target, this)},"initializer":${void 0 === e.initializer ? C(e.initializer) : D(e.initializer, this)}}`;
    }
    visitDestructuringAssignmentRestExpression(e) {
        return `{"$TYPE":"${L.DestructuringRestAssignment}","target":${D(e.target, this)},"indexOrProperties":${Array.isArray(e.indexOrProperties) ? q(e.indexOrProperties) : C(e.indexOrProperties)}}`;
    }
    visitArrowFunction(e) {
        return `{"$TYPE":"${L.ArrowFunction}","parameters":${this.serializeExpressions(e.args)},"body":${D(e.body, this)},"rest":${C(e.rest)}}`;
    }
    visitCustom(e) {
        return `{"$TYPE":"${L.Custom}","body":${e.value}}`;
    }
    serializeExpressions(e) {
        let t = "[";
        for (let s = 0, i = e.length; s < i; ++s) {
            if (0 !== s) t += ",";
            t += D(e[s], this);
        }
        t += "]";
        return t;
    }
}

function q(e) {
    let t = "[";
    for (let s = 0, i = e.length; s < i; ++s) {
        if (0 !== s) t += ",";
        t += C(e[s]);
    }
    t += "]";
    return t;
}

function C(e) {
    if ("string" === typeof e) return `"\\"${B(e)}\\""`; else if (null == e) return `"${e}"`; else return `${e}`;
}

function B(e) {
    let t = "";
    for (let s = 0, i = e.length; s < i; ++s) t += _(e.charAt(s));
    return t;
}

function _(e) {
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

function k(e) {
    if ("string" === typeof e) {
        if ("null" === e) return null;
        if ("undefined" === e) return;
        return e.substring(1, e.length - 1);
    } else return e;
}

class ValidationSerializer {
    static serialize(e) {
        if (null == e || "function" !== typeof e.accept) return `${e}`;
        const t = new ValidationSerializer;
        return e.accept(t);
    }
    visitRequiredRule(e) {
        return `{"$TYPE":"${x.$TYPE}","messageKey":"${e.messageKey}","tag":${C(e.tag)}}`;
    }
    visitRegexRule(e) {
        const t = e.pattern;
        return `{"$TYPE":"${R.$TYPE}","messageKey":"${e.messageKey}","tag":${C(e.tag)},"pattern":{"source":${C(t.source)},"flags":"${t.flags}"}}`;
    }
    visitLengthRule(e) {
        return `{"$TYPE":"${E.$TYPE}","messageKey":"${e.messageKey}","tag":${C(e.tag)},"length":${C(e.length)},"isMax":${C(e.isMax)}}`;
    }
    visitSizeRule(e) {
        return `{"$TYPE":"${P.$TYPE}","messageKey":"${e.messageKey}","tag":${C(e.tag)},"count":${C(e.count)},"isMax":${C(e.isMax)}}`;
    }
    visitRangeRule(e) {
        return `{"$TYPE":"${b.$TYPE}","messageKey":"${e.messageKey}","tag":${C(e.tag)},"isInclusive":${e.isInclusive},"min":${this.serializeNumber(e.min)},"max":${this.serializeNumber(e.max)}}`;
    }
    visitEqualsRule(e) {
        const t = e.expectedValue;
        let s;
        if ("object" !== typeof t || null === t) s = C(t); else s = JSON.stringify(t);
        return `{"$TYPE":"${T.$TYPE}","messageKey":"${e.messageKey}","tag":${C(e.tag)},"expectedValue":${s}}`;
    }
    visitRuleProperty(e) {
        const t = e.displayName;
        if (void 0 !== t && "string" !== typeof t) throw new Error("Serializing a non-string displayName for rule property is not supported.");
        const s = e.expression;
        return `{"$TYPE":"${RuleProperty.$TYPE}","name":${C(e.name)},"expression":${s ? Serializer.serialize(s) : null},"displayName":${C(t)}}`;
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

let K = class ValidationDeserializer {
    constructor(e, t, s) {
        this.locator = e;
        this.messageProvider = t;
        this.parser = s;
        this.astDeserializer = new Deserializer;
    }
    static register(e) {
        this.container = e;
    }
    static deserialize(e, t) {
        const s = this.container.get(g);
        const i = this.container.get($);
        const r = new ValidationDeserializer(this.container, s, i);
        const n = JSON.parse(e);
        return r.hydrate(n, t);
    }
    hydrate(e, t) {
        switch (e.$TYPE) {
          case x.$TYPE:
            {
                const t = e;
                const s = new x;
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case R.$TYPE:
            {
                const t = e;
                const s = t.pattern;
                const i = this.astDeserializer;
                const r = new R(new RegExp(i.hydrate(s.source), s.flags), t.messageKey);
                r.tag = i.hydrate(t.tag);
                return r;
            }

          case E.$TYPE:
            {
                const t = e;
                const s = new E(t.length, t.isMax);
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case P.$TYPE:
            {
                const t = e;
                const s = new P(t.count, t.isMax);
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case b.$TYPE:
            {
                const t = e;
                const s = new b(t.isInclusive, {
                    min: t.min ?? Number.NEGATIVE_INFINITY,
                    max: t.max ?? Number.POSITIVE_INFINITY
                });
                s.messageKey = t.messageKey;
                s.tag = this.astDeserializer.hydrate(t.tag);
                return s;
            }

          case T.$TYPE:
            {
                const t = e;
                const s = this.astDeserializer;
                const i = new T("object" !== typeof t.expectedValue ? s.hydrate(t.expectedValue) : t.expectedValue);
                i.messageKey = t.messageKey;
                i.tag = s.hydrate(t.tag);
                return i;
            }

          case RuleProperty.$TYPE:
            {
                const t = e;
                const s = this.astDeserializer;
                let i = t.name;
                i = "undefined" === i ? void 0 : s.hydrate(i);
                let r = t.expression;
                if (null !== r && void 0 !== r) r = s.hydrate(r); else if (void 0 !== i) [, r] = j(i, this.parser); else r = void 0;
                let n = t.displayName;
                n = "undefined" === n ? void 0 : s.hydrate(n);
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
        if (!Array.isArray(e)) throw new Error("The ruleset has to be an array of serialized property rule objects");
        return e.map((e => this.hydrate(e, t)));
    }
};

K = f([ p(0, i), p(1, g), p(2, $) ], K);

let F = class ModelValidationExpressionHydrator {
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
        const i = (e, r = []) => {
            for (const [n, a] of e) if (this.isModelPropertyRule(a)) {
                const e = a.rules.map((e => Object.entries(e).map((([e, t]) => this.hydrateRule(e, t)))));
                const i = r.join(".");
                const o = this.hydrateRuleProperty({
                    name: "" !== i ? `${i}.${n}` : n,
                    displayName: a.displayName
                });
                s.push(new PropertyRule(this.l, t, this.messageProvider, o, e));
            } else i(Object.entries(a), [ ...r, n ]);
        };
        i(Object.entries(e));
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
        if (void 0 !== s && null !== s) t.messageKey = s;
        t.tag = e.tag;
        const i = e.when;
        if (i) if ("string" === typeof i) {
            const e = this.parser.parse(i, 0);
            t.canExecute = t => l(e, c.create({
                $object: t
            }), this, null);
        } else if ("function" === typeof i) t.canExecute = i;
    }
    isModelPropertyRule(e) {
        return "object" === typeof e && "rules" in e;
    }
    hydrateRequiredRule(e) {
        const t = new x;
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRegexRule(e) {
        const t = e.pattern;
        const s = new R(new RegExp(t.source, t.flags), e.messageKey);
        s.tag = e.tag;
        return s;
    }
    hydrateLengthRule(e) {
        const t = new E(e.length, e.isMax);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateSizeRule(e) {
        const t = new P(e.count, e.isMax);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRangeRule(e) {
        const t = new b(e.isInclusive, {
            min: e.min,
            max: e.max
        });
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateEqualsRule(e) {
        const t = new T(e.expectedValue);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRuleProperty(e) {
        const t = e.name;
        if (!t || "string" !== typeof t) throw new Error("The property name needs to be a non-empty string");
        const [s, i] = j(t, this.parser);
        return new RuleProperty(i, s, e.displayName);
    }
};

F = f([ p(0, i), p(1, g), p(2, $) ], F);

d()(F);

class ValidateInstruction {
    constructor(e = void 0, t = void 0, s = void 0, i = void 0, r = void 0, n = 0) {
        this.object = e;
        this.propertyName = t;
        this.rules = s;
        this.objectTag = i;
        this.propertyTag = r;
        this.flags = n;
    }
}

const Z = e.createInterface("IValidator");

class StandardValidator {
    async validate(e) {
        const t = e.object;
        const s = e.propertyName;
        const i = e.propertyTag;
        const r = e.flags;
        const n = e.rules ?? z.get(t, e.objectTag) ?? [];
        const a = c.create({
            [V]: t
        });
        if (void 0 !== s) return await (n.find((e => e.property.name === s))?.validate(t, i, r, a)) ?? [];
        return (await Promise.all(n.map((async e => e.validate(t, i, r, a))))).flat();
    }
}

function U() {
    return {
        ValidatorType: StandardValidator,
        MessageProviderType: O,
        CustomMessages: [],
        HydratorType: F
    };
}

function H(e) {
    return {
        optionsProvider: e,
        register(t) {
            const s = U();
            e(s);
            t.register(n.instance(M, s.CustomMessages), n.singleton(Z, s.ValidatorType), n.singleton(g, s.MessageProviderType), n.singleton(m, s.HydratorType), n.transient(N, Y), K);
            return t;
        },
        customize(t) {
            return H(t ?? e);
        }
    };
}

const J = H(a);

export { v as BaseValidationRule, Deserializer, T as EqualsRule, M as ICustomMessages, m as IValidationExpressionHydrator, g as IValidationMessageProvider, N as IValidationRules, Z as IValidator, E as LengthRule, ModelBasedRule, F as ModelValidationExpressionHydrator, PropertyRule, b as RangeRule, R as RegexRule, x as RequiredRule, RuleProperty, Serializer, P as SizeRule, StandardValidator, ValidateInstruction, J as ValidationConfiguration, K as ValidationDeserializer, O as ValidationMessageProvider, ValidationResult, w as ValidationRuleAliasMessage, Y as ValidationRules, ValidationSerializer, k as deserializePrimitive, U as getDefaultValidationConfiguration, j as parsePropertyName, V as rootObjectSymbol, C as serializePrimitive, q as serializePrimitives, y as validationRule, z as validationRulesRegistrar };
//# sourceMappingURL=index.mjs.map
