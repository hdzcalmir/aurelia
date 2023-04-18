import { DI as e, Protocol as t, toArray as i, IServiceLocator as s, ILogger as r, Registration as n, noop as a } from "@aurelia/kernel";

import { Metadata as o } from "@aurelia/metadata";

import * as u from "@aurelia/runtime";

import { Scope as l, astEvaluate as c, PrimitiveLiteralExpression as h, IExpressionParser as d } from "@aurelia/runtime";

import { mixinAstEvaluator as m } from "@aurelia/runtime-html";

const $ = /*@__PURE__*/ e.createInterface("IValidationExpressionHydrator");

function __decorate(e, t, i, s) {
    var r = arguments.length, n = r < 3 ? t : s === null ? s = Object.getOwnPropertyDescriptor(t, i) : s, a;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") n = Reflect.decorate(e, t, i, s); else for (var o = e.length - 1; o >= 0; o--) if (a = e[o]) n = (r < 3 ? a(n) : r > 3 ? a(t, i, n) : a(t, i)) || n;
    return r > 3 && n && Object.defineProperty(t, i, n), n;
}

function __param(e, t) {
    return function(i, s) {
        t(i, s, e);
    };
}

const p = /*@__PURE__*/ e.createInterface("IValidationMessageProvider");

const f = Object.freeze({
    aliasKey: t.annotation.keyFor("validation-rule-alias-message"),
    define(e, t) {
        f.setDefaultMessage(e, t);
        return e;
    },
    setDefaultMessage(e, {aliases: t}, s = true) {
        const r = s ? o.getOwn(this.aliasKey, e.prototype) : void 0;
        if (r !== void 0) {
            const e = {
                ...Object.fromEntries(r.map((({name: e, defaultMessage: t}) => [ e, t ]))),
                ...Object.fromEntries(t.map((({name: e, defaultMessage: t}) => [ e, t ])))
            };
            t = i(Object.entries(e)).map((([e, t]) => ({
                name: e,
                defaultMessage: t
            })));
        }
        o.define(f.aliasKey, t, e instanceof Function ? e.prototype : e);
    },
    getDefaultMessages(e) {
        return o.get(this.aliasKey, e instanceof Function ? e.prototype : e);
    }
});

function validationRule(e) {
    return function(t) {
        return f.define(t, e);
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

v = __decorate([ validationRule({
    aliases: [ {
        name: void 0,
        defaultMessage: `\${$displayName} is invalid.`
    } ]
}) ], v);

let g = class RequiredRule extends v {
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

g.$TYPE = "RequiredRule";

g = __decorate([ validationRule({
    aliases: [ {
        name: "required",
        defaultMessage: `\${$displayName} is required.`
    } ]
}) ], g);

let y = class RegexRule extends v {
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

y.$TYPE = "RegexRule";

y = __decorate([ validationRule({
    aliases: [ {
        name: "matches",
        defaultMessage: `\${$displayName} is not correctly formatted.`
    }, {
        name: "email",
        defaultMessage: `\${$displayName} is not a valid email.`
    } ]
}) ], y);

let w = class LengthRule extends v {
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

w.$TYPE = "LengthRule";

w = __decorate([ validationRule({
    aliases: [ {
        name: "minLength",
        defaultMessage: `\${$displayName} must be at least \${$rule.length} character\${$rule.length === 1 ? '' : 's'}.`
    }, {
        name: "maxLength",
        defaultMessage: `\${$displayName} cannot be longer than \${$rule.length} character\${$rule.length === 1 ? '' : 's'}.`
    } ]
}) ], w);

let P = class SizeRule extends v {
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

P.$TYPE = "SizeRule";

P = __decorate([ validationRule({
    aliases: [ {
        name: "minItems",
        defaultMessage: `\${$displayName} must contain at least \${$rule.count} item\${$rule.count === 1 ? '' : 's'}.`
    }, {
        name: "maxItems",
        defaultMessage: `\${$displayName} cannot contain more than \${$rule.count} item\${$rule.count === 1 ? '' : 's'}.`
    } ]
}) ], P);

let R = class RangeRule extends v {
    constructor(e, {min: t, max: i}) {
        super(t !== void 0 && i !== void 0 ? e ? "range" : "between" : t !== void 0 ? "min" : "max");
        this.isInclusive = e;
        this.min = Number.NEGATIVE_INFINITY;
        this.max = Number.POSITIVE_INFINITY;
        this.min = t ?? this.min;
        this.max = i ?? this.max;
    }
    execute(e, t) {
        return e === null || e === undefined || (this.isInclusive ? e >= this.min && e <= this.max : e > this.min && e < this.max);
    }
    accept(e) {
        return e.visitRangeRule(this);
    }
};

R.$TYPE = "RangeRule";

R = __decorate([ validationRule({
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
}) ], R);

let x = class EqualsRule extends v {
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

x.$TYPE = "EqualsRule";

x = __decorate([ validationRule({
    aliases: [ {
        name: "equals",
        defaultMessage: `\${$displayName} must be \${$rule.expectedValue}.`
    } ]
}) ], x);

const E = /*@__PURE__*/ e.createInterface("ICustomMessages");

class RuleProperty {
    constructor(e, t = void 0, i = void 0) {
        this.expression = e;
        this.name = t;
        this.displayName = i;
    }
    accept(e) {
        return e.visitRuleProperty(this);
    }
}

RuleProperty.$TYPE = "RuleProperty";

const z = Object.freeze({
    name: "validation-rules",
    defaultRuleSetName: "__default",
    set(e, i, s) {
        const r = `${z.name}:${s ?? z.defaultRuleSetName}`;
        o.define(t.annotation.keyFor(r), i, e);
        const n = o.getOwn(t.annotation.name, e);
        if (n === void 0) {
            o.define(t.annotation.name, [ r ], e);
        } else {
            n.push(r);
        }
    },
    get(e, i) {
        const s = t.annotation.keyFor(z.name, i ?? z.defaultRuleSetName);
        return o.get(s, e) ?? o.getOwn(s, e.constructor);
    },
    unset(e, i) {
        const s = o.getOwn(t.annotation.name, e);
        for (const r of s.slice(0)) {
            if (r.startsWith(z.name) && (i === void 0 || r.endsWith(i))) {
                o.delete(t.annotation.keyFor(r), e);
                const i = s.indexOf(r);
                if (i > -1) {
                    s.splice(i, 1);
                }
            }
        }
    },
    isValidationRulesSet(e) {
        const i = o.getOwn(t.annotation.name, e);
        return i !== void 0 && i.some((e => e.startsWith(z.name)));
    }
});

class ValidationMessageEvaluationContext {
    constructor(e, t, i, s, r, n) {
        this.messageProvider = e;
        this.$displayName = t;
        this.$propertyName = i;
        this.$value = s;
        this.$rule = r;
        this.$object = n;
    }
    $getDisplayName(e, t) {
        return this.messageProvider.getDisplayName(e, t);
    }
}

class PropertyRule {
    constructor(e, t, i, s, r = [ [] ]) {
        this.validationRules = t;
        this.messageProvider = i;
        this.property = s;
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
    async validate(e, t, i) {
        if (i === void 0) {
            i = l.create({
                [N]: e
            });
        }
        const s = this.property.expression;
        let r;
        if (s === void 0) {
            r = e;
        } else {
            r = c(s, i, this, null);
        }
        let n = true;
        const validateRuleset = async i => {
            const validateRule = async t => {
                let i = t.execute(r, e);
                if (i instanceof Promise) {
                    i = await i;
                }
                n = n && i;
                const {displayName: s, name: a} = this.property;
                let o;
                if (!i) {
                    const i = l.create(new ValidationMessageEvaluationContext(this.messageProvider, this.messageProvider.getDisplayName(a, s), a, r, t, e));
                    o = c(this.messageProvider.getMessage(t), i, this, null);
                }
                return new ValidationResult(i, o, a, e, t, this);
            };
            const s = [];
            for (const r of i) {
                if (r.canExecute(e) && (t === void 0 || r.tag === t)) {
                    s.push(validateRule(r));
                }
            }
            return Promise.all(s);
        };
        const accumulateResult = async (e, t) => {
            const i = await validateRuleset(t);
            e.push(...i);
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
        return this.addRule(new g);
    }
    matches(e) {
        return this.addRule(new y(e));
    }
    email() {
        const e = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return this.addRule(new y(e, "email"));
    }
    minLength(e) {
        return this.addRule(new w(e, false));
    }
    maxLength(e) {
        return this.addRule(new w(e, true));
    }
    minItems(e) {
        return this.addRule(new P(e, false));
    }
    maxItems(e) {
        return this.addRule(new P(e, true));
    }
    min(e) {
        return this.addRule(new R(true, {
            min: e
        }));
    }
    max(e) {
        return this.addRule(new R(true, {
            max: e
        }));
    }
    range(e, t) {
        return this.addRule(new R(true, {
            min: e,
            max: t
        }));
    }
    between(e, t) {
        return this.addRule(new R(false, {
            min: e,
            max: t
        }));
    }
    equals(e) {
        return this.addRule(new x(e));
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

m()(PropertyRule);

class ModelBasedRule {
    constructor(e, t = z.defaultRuleSetName) {
        this.ruleset = e;
        this.tag = t;
    }
}

const b = /*@__PURE__*/ e.createInterface("IValidationRules");

let _ = class ValidationRules {
    constructor(e, t, i, s) {
        this.locator = e;
        this.parser = t;
        this.messageProvider = i;
        this.deserializer = s;
        this.rules = [];
        this.targets = new Set;
    }
    ensure(e) {
        const [t, i] = parsePropertyName(e, this.parser);
        let s = this.rules.find((e => e.property.name == t));
        if (s === void 0) {
            s = new PropertyRule(this.locator, this, this.messageProvider, new RuleProperty(i, t));
            this.rules.push(s);
        }
        return s;
    }
    ensureObject() {
        const e = new PropertyRule(this.locator, this, this.messageProvider, new RuleProperty);
        this.rules.push(e);
        return e;
    }
    on(e, t) {
        const i = z.get(e, t);
        if (Object.is(i, this.rules)) {
            return this;
        }
        this.rules = i ?? [];
        z.set(e, this.rules, t);
        this.targets.add(e);
        return this;
    }
    off(e, t) {
        const i = e !== void 0 ? [ e ] : Array.from(this.targets);
        for (const e of i) {
            z.unset(e, t);
            if (!z.isValidationRulesSet(e)) {
                this.targets.delete(e);
            }
        }
    }
    applyModelBasedRules(e, t) {
        const i = new Set;
        for (const s of t) {
            const t = s.tag;
            if (i.has(t)) {
                console.warn(`A ruleset for tag ${t} is already defined which will be overwritten`);
            }
            const r = this.deserializer.hydrateRuleset(s.ruleset, this);
            z.set(e, r, t);
            i.add(t);
        }
    }
};

_ = __decorate([ __param(0, s), __param(1, d), __param(2, p), __param(3, $) ], _);

const T = /^function\s*\([$_\w\d]+\)\s*\{(?:\s*["']{1}use strict["']{1};)?(?:[$_\s\w\d\/\*.['"\]+;]+)?\s*return\s+[$_\w\d]+((\.[$_\w\d]+|\[['"$_\w\d]+\])+)\s*;?\s*\}$/;

const M = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+((\.[$_\w\d]+|\[['"$_\w\d]+\])+)$/;

const N = "$root";

function parsePropertyName(e, t) {
    switch (typeof e) {
      case "string":
        break;

      case "function":
        {
            const t = e.toString();
            const i = M.exec(t) ?? T.exec(t);
            if (i === null) {
                throw new Error(`Unable to parse accessor function:\n${t}`);
            }
            e = i[1].substring(1);
            break;
        }

      default:
        throw new Error(`Unable to parse accessor function:\n${e}`);
    }
    return [ e, t.parse(`${N}.${e}`, 16) ];
}

class ValidationResult {
    constructor(e, t, i, s, r, n, a = false) {
        this.valid = e;
        this.message = t;
        this.propertyName = i;
        this.object = s;
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

const V = new Set([ "displayName", "propertyName", "value", "object", "config", "getDisplayName" ]);

let Y = class ValidationMessageProvider {
    constructor(e, t, i) {
        this.parser = e;
        this.registeredMessages = new WeakMap;
        this.logger = t.scopeTo(ValidationMessageProvider.name);
        for (const {rule: e, aliases: t} of i) {
            f.setDefaultMessage(e, {
                aliases: t
            });
        }
    }
    getMessage(e) {
        const t = this.registeredMessages.get(e);
        if (t !== void 0) {
            return t;
        }
        const i = f.getDefaultMessages(e);
        const s = e.messageKey;
        let r;
        const n = i.length;
        if (n === 1 && s === void 0) {
            r = i[0].defaultMessage;
        } else {
            r = i.find((e => e.name === s))?.defaultMessage;
        }
        if (!r) {
            r = f.getDefaultMessages(v)[0].defaultMessage;
        }
        return this.setMessage(e, r);
    }
    setMessage(e, t) {
        const i = this.parseMessage(t);
        this.registeredMessages.set(e, i);
        return i;
    }
    parseMessage(e) {
        const t = this.parser.parse(e, 1);
        if (t?.$kind === 23) {
            for (const i of t.expressions) {
                const t = i.name;
                if (V.has(t)) {
                    this.logger.warn(`Did you mean to use "$${t}" instead of "${t}" in this validation message template: "${e}"?`);
                }
                if (i.$kind === 0 || i.ancestor > 0) {
                    throw new Error("$parent is not permitted in validation message expressions.");
                }
            }
            return t;
        }
        return new h(e);
    }
    getDisplayName(e, t) {
        if (t !== null && t !== undefined) {
            return t instanceof Function ? t() : t;
        }
        if (e === void 0) {
            return;
        }
        const i = e.toString().split(/(?=[A-Z])/).join(" ");
        return i.charAt(0).toUpperCase() + i.slice(1);
    }
};

Y = __decorate([ __param(0, d), __param(1, r), __param(2, E) ], Y);

const A = u.astVisit;

var S;

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
})(S || (S = {}));

class Deserializer {
    static deserialize(e) {
        const t = new Deserializer;
        const i = JSON.parse(e);
        return t.hydrate(i);
    }
    hydrate(e) {
        switch (e.$TYPE) {
          case S.AccessMemberExpression:
            {
                const t = e;
                return new u.AccessMemberExpression(this.hydrate(t.object), t.name);
            }

          case S.AccessKeyedExpression:
            {
                const t = e;
                return new u.AccessKeyedExpression(this.hydrate(t.object), this.hydrate(t.key));
            }

          case S.AccessThisExpression:
            {
                const t = e;
                return new u.AccessThisExpression(t.ancestor);
            }

          case S.AccessScopeExpression:
            {
                const t = e;
                return new u.AccessScopeExpression(t.name, t.ancestor);
            }

          case S.ArrayLiteralExpression:
            {
                const t = e;
                return new u.ArrayLiteralExpression(this.hydrate(t.elements));
            }

          case S.ObjectLiteralExpression:
            {
                const t = e;
                return new u.ObjectLiteralExpression(this.hydrate(t.keys), this.hydrate(t.values));
            }

          case S.PrimitiveLiteralExpression:
            {
                const t = e;
                return new u.PrimitiveLiteralExpression(this.hydrate(t.value));
            }

          case S.CallFunctionExpression:
            {
                const t = e;
                return new u.CallFunctionExpression(this.hydrate(t.func), this.hydrate(t.args));
            }

          case S.CallMemberExpression:
            {
                const t = e;
                return new u.CallMemberExpression(this.hydrate(t.object), t.name, this.hydrate(t.args));
            }

          case S.CallScopeExpression:
            {
                const t = e;
                return new u.CallScopeExpression(t.name, this.hydrate(t.args), t.ancestor);
            }

          case S.TemplateExpression:
            {
                const t = e;
                return new u.TemplateExpression(this.hydrate(t.cooked), this.hydrate(t.expressions));
            }

          case S.TaggedTemplateExpression:
            {
                const t = e;
                return new u.TaggedTemplateExpression(this.hydrate(t.cooked), this.hydrate(t.raw), this.hydrate(t.func), this.hydrate(t.expressions));
            }

          case S.UnaryExpression:
            {
                const t = e;
                return new u.UnaryExpression(t.operation, this.hydrate(t.expression));
            }

          case S.BinaryExpression:
            {
                const t = e;
                return new u.BinaryExpression(t.operation, this.hydrate(t.left), this.hydrate(t.right));
            }

          case S.ConditionalExpression:
            {
                const t = e;
                return new u.ConditionalExpression(this.hydrate(t.condition), this.hydrate(t.yes), this.hydrate(t.no));
            }

          case S.AssignExpression:
            {
                const t = e;
                return new u.AssignExpression(this.hydrate(t.target), this.hydrate(t.value));
            }

          case S.ValueConverterExpression:
            {
                const t = e;
                return new u.ValueConverterExpression(this.hydrate(t.expression), t.name, this.hydrate(t.args));
            }

          case S.BindingBehaviorExpression:
            {
                const t = e;
                return new u.BindingBehaviorExpression(this.hydrate(t.expression), t.name, this.hydrate(t.args));
            }

          case S.ArrayBindingPattern:
            {
                const t = e;
                return new u.ArrayBindingPattern(this.hydrate(t.elements));
            }

          case S.ObjectBindingPattern:
            {
                const t = e;
                return new u.ObjectBindingPattern(this.hydrate(t.keys), this.hydrate(t.values));
            }

          case S.BindingIdentifier:
            {
                const t = e;
                return new u.BindingIdentifier(t.name);
            }

          case S.ForOfStatement:
            {
                const t = e;
                return new u.ForOfStatement(this.hydrate(t.declaration), this.hydrate(t.iterable), this.hydrate(t.semiIdx));
            }

          case S.Interpolation:
            {
                const t = e;
                return new u.Interpolation(this.hydrate(t.cooked), this.hydrate(t.expressions));
            }

          case S.DestructuringAssignment:
            {
                return new u.DestructuringAssignmentExpression(this.hydrate(e.$kind), this.hydrate(e.list), this.hydrate(e.source), this.hydrate(e.initializer));
            }

          case S.DestructuringSingleAssignment:
            {
                return new u.DestructuringAssignmentSingleExpression(this.hydrate(e.target), this.hydrate(e.source), this.hydrate(e.initializer));
            }

          case S.DestructuringRestAssignment:
            {
                return new u.DestructuringAssignmentRestExpression(this.hydrate(e.target), this.hydrate(e.indexOrProperties));
            }

          case S.ArrowFunction:
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
        for (const i of e) {
            t.push(this.hydrate(i));
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
        return A(e, t);
    }
    visitAccessMember(e) {
        return `{"$TYPE":"${S.AccessMemberExpression}","name":"${e.name}","object":${A(e.object, this)}}`;
    }
    visitAccessKeyed(e) {
        return `{"$TYPE":"${S.AccessKeyedExpression}","object":${A(e.object, this)},"key":${A(e.key, this)}}`;
    }
    visitAccessThis(e) {
        return `{"$TYPE":"${S.AccessThisExpression}","ancestor":${e.ancestor}}`;
    }
    visitAccessScope(e) {
        return `{"$TYPE":"${S.AccessScopeExpression}","name":"${e.name}","ancestor":${e.ancestor}}`;
    }
    visitArrayLiteral(e) {
        return `{"$TYPE":"${S.ArrayLiteralExpression}","elements":${this.serializeExpressions(e.elements)}}`;
    }
    visitObjectLiteral(e) {
        return `{"$TYPE":"${S.ObjectLiteralExpression}","keys":${serializePrimitives(e.keys)},"values":${this.serializeExpressions(e.values)}}`;
    }
    visitPrimitiveLiteral(e) {
        return `{"$TYPE":"${S.PrimitiveLiteralExpression}","value":${serializePrimitive(e.value)}}`;
    }
    visitCallFunction(e) {
        return `{"$TYPE":"${S.CallFunctionExpression}","func":${A(e.func, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitCallMember(e) {
        return `{"$TYPE":"${S.CallMemberExpression}","name":"${e.name}","object":${A(e.object, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitCallScope(e) {
        return `{"$TYPE":"${S.CallScopeExpression}","name":"${e.name}","ancestor":${e.ancestor},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitTemplate(e) {
        return `{"$TYPE":"${S.TemplateExpression}","cooked":${serializePrimitives(e.cooked)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitTaggedTemplate(e) {
        return `{"$TYPE":"${S.TaggedTemplateExpression}","cooked":${serializePrimitives(e.cooked)},"raw":${serializePrimitives(e.cooked.raw)},"func":${A(e.func, this)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitUnary(e) {
        return `{"$TYPE":"${S.UnaryExpression}","operation":"${e.operation}","expression":${A(e.expression, this)}}`;
    }
    visitBinary(e) {
        return `{"$TYPE":"${S.BinaryExpression}","operation":"${e.operation}","left":${A(e.left, this)},"right":${A(e.right, this)}}`;
    }
    visitConditional(e) {
        return `{"$TYPE":"${S.ConditionalExpression}","condition":${A(e.condition, this)},"yes":${A(e.yes, this)},"no":${A(e.no, this)}}`;
    }
    visitAssign(e) {
        return `{"$TYPE":"${S.AssignExpression}","target":${A(e.target, this)},"value":${A(e.value, this)}}`;
    }
    visitValueConverter(e) {
        return `{"$TYPE":"${S.ValueConverterExpression}","name":"${e.name}","expression":${A(e.expression, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitBindingBehavior(e) {
        return `{"$TYPE":"${S.BindingBehaviorExpression}","name":"${e.name}","expression":${A(e.expression, this)},"args":${this.serializeExpressions(e.args)}}`;
    }
    visitArrayBindingPattern(e) {
        return `{"$TYPE":"${S.ArrayBindingPattern}","elements":${this.serializeExpressions(e.elements)}}`;
    }
    visitObjectBindingPattern(e) {
        return `{"$TYPE":"${S.ObjectBindingPattern}","keys":${serializePrimitives(e.keys)},"values":${this.serializeExpressions(e.values)}}`;
    }
    visitBindingIdentifier(e) {
        return `{"$TYPE":"${S.BindingIdentifier}","name":"${e.name}"}`;
    }
    visitForOfStatement(e) {
        return `{"$TYPE":"${S.ForOfStatement}","declaration":${A(e.declaration, this)},"iterable":${A(e.iterable, this)},"semiIdx":${serializePrimitive(e.semiIdx)}}`;
    }
    visitInterpolation(e) {
        return `{"$TYPE":"${S.Interpolation}","cooked":${serializePrimitives(e.parts)},"expressions":${this.serializeExpressions(e.expressions)}}`;
    }
    visitDestructuringAssignmentExpression(e) {
        return `{"$TYPE":"${S.DestructuringAssignment}","$kind":${serializePrimitive(e.$kind)},"list":${this.serializeExpressions(e.list)},"source":${e.source === void 0 ? serializePrimitive(e.source) : A(e.source, this)},"initializer":${e.initializer === void 0 ? serializePrimitive(e.initializer) : A(e.initializer, this)}}`;
    }
    visitDestructuringAssignmentSingleExpression(e) {
        return `{"$TYPE":"${S.DestructuringSingleAssignment}","source":${A(e.source, this)},"target":${A(e.target, this)},"initializer":${e.initializer === void 0 ? serializePrimitive(e.initializer) : A(e.initializer, this)}}`;
    }
    visitDestructuringAssignmentRestExpression(e) {
        return `{"$TYPE":"${S.DestructuringRestAssignment}","target":${A(e.target, this)},"indexOrProperties":${Array.isArray(e.indexOrProperties) ? serializePrimitives(e.indexOrProperties) : serializePrimitive(e.indexOrProperties)}}`;
    }
    visitArrowFunction(e) {
        return `{"$TYPE":"${S.ArrowFunction}","parameters":${this.serializeExpressions(e.args)},"body":${A(e.body, this)},"rest":${serializePrimitive(e.rest)}}`;
    }
    visitCustom(e) {
        return `{"$TYPE":"${S.Custom}","body":${e.value}}`;
    }
    serializeExpressions(e) {
        let t = "[";
        for (let i = 0, s = e.length; i < s; ++i) {
            if (i !== 0) {
                t += ",";
            }
            t += A(e[i], this);
        }
        t += "]";
        return t;
    }
}

function serializePrimitives(e) {
    let t = "[";
    for (let i = 0, s = e.length; i < s; ++i) {
        if (i !== 0) {
            t += ",";
        }
        t += serializePrimitive(e[i]);
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
    for (let i = 0, s = e.length; i < s; ++i) {
        t += escape(e.charAt(i));
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
        return `{"$TYPE":"${g.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)}}`;
    }
    visitRegexRule(e) {
        const t = e.pattern;
        return `{"$TYPE":"${y.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"pattern":{"source":${serializePrimitive(t.source)},"flags":"${t.flags}"}}`;
    }
    visitLengthRule(e) {
        return `{"$TYPE":"${w.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"length":${serializePrimitive(e.length)},"isMax":${serializePrimitive(e.isMax)}}`;
    }
    visitSizeRule(e) {
        return `{"$TYPE":"${P.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"count":${serializePrimitive(e.count)},"isMax":${serializePrimitive(e.isMax)}}`;
    }
    visitRangeRule(e) {
        return `{"$TYPE":"${R.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"isInclusive":${e.isInclusive},"min":${this.serializeNumber(e.min)},"max":${this.serializeNumber(e.max)}}`;
    }
    visitEqualsRule(e) {
        const t = e.expectedValue;
        let i;
        if (typeof t !== "object" || t === null) {
            i = serializePrimitive(t);
        } else {
            i = JSON.stringify(t);
        }
        return `{"$TYPE":"${x.$TYPE}","messageKey":"${e.messageKey}","tag":${serializePrimitive(e.tag)},"expectedValue":${i}}`;
    }
    visitRuleProperty(e) {
        const t = e.displayName;
        if (t !== void 0 && typeof t !== "string") {
            throw new Error("Serializing a non-string displayName for rule property is not supported.");
        }
        const i = e.expression;
        return `{"$TYPE":"${RuleProperty.$TYPE}","name":${serializePrimitive(e.name)},"expression":${i ? Serializer.serialize(i) : null},"displayName":${serializePrimitive(t)}}`;
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

let j = class ValidationDeserializer {
    static register(e) {
        this.container = e;
    }
    static deserialize(e, t) {
        const i = this.container.get(p);
        const s = this.container.get(d);
        const r = new ValidationDeserializer(this.container, i, s);
        const n = JSON.parse(e);
        return r.hydrate(n, t);
    }
    constructor(e, t, i) {
        this.locator = e;
        this.messageProvider = t;
        this.parser = i;
        this.astDeserializer = new Deserializer;
    }
    hydrate(e, t) {
        switch (e.$TYPE) {
          case g.$TYPE:
            {
                const t = e;
                const i = new g;
                i.messageKey = t.messageKey;
                i.tag = this.astDeserializer.hydrate(t.tag);
                return i;
            }

          case y.$TYPE:
            {
                const t = e;
                const i = t.pattern;
                const s = this.astDeserializer;
                const r = new y(new RegExp(s.hydrate(i.source), i.flags), t.messageKey);
                r.tag = s.hydrate(t.tag);
                return r;
            }

          case w.$TYPE:
            {
                const t = e;
                const i = new w(t.length, t.isMax);
                i.messageKey = t.messageKey;
                i.tag = this.astDeserializer.hydrate(t.tag);
                return i;
            }

          case P.$TYPE:
            {
                const t = e;
                const i = new P(t.count, t.isMax);
                i.messageKey = t.messageKey;
                i.tag = this.astDeserializer.hydrate(t.tag);
                return i;
            }

          case R.$TYPE:
            {
                const t = e;
                const i = new R(t.isInclusive, {
                    min: t.min ?? Number.NEGATIVE_INFINITY,
                    max: t.max ?? Number.POSITIVE_INFINITY
                });
                i.messageKey = t.messageKey;
                i.tag = this.astDeserializer.hydrate(t.tag);
                return i;
            }

          case x.$TYPE:
            {
                const t = e;
                const i = this.astDeserializer;
                const s = new x(typeof t.expectedValue !== "object" ? i.hydrate(t.expectedValue) : t.expectedValue);
                s.messageKey = t.messageKey;
                s.tag = i.hydrate(t.tag);
                return s;
            }

          case RuleProperty.$TYPE:
            {
                const t = e;
                const i = this.astDeserializer;
                let s = t.name;
                s = s === "undefined" ? void 0 : i.hydrate(s);
                let r = t.expression;
                if (r !== null && r !== void 0) {
                    r = i.hydrate(r);
                } else if (s !== void 0) {
                    [, r] = parsePropertyName(s, this.parser);
                } else {
                    r = void 0;
                }
                let n = t.displayName;
                n = n === "undefined" ? void 0 : i.hydrate(n);
                return new RuleProperty(r, s, n);
            }

          case PropertyRule.$TYPE:
            {
                const i = e;
                return new PropertyRule(this.locator, t, this.messageProvider, this.hydrate(i.property, t), i.$rules.map((e => e.map((e => this.hydrate(e, t))))));
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

j = __decorate([ __param(0, s), __param(1, p), __param(2, d) ], j);

let D = class ModelValidationExpressionHydrator {
    constructor(e, t, i) {
        this.l = e;
        this.messageProvider = t;
        this.parser = i;
        this.astDeserializer = new Deserializer;
    }
    hydrate(e, t) {
        throw new Error("Method not implemented.");
    }
    hydrateRuleset(e, t) {
        const i = [];
        const iterate = (e, s = []) => {
            for (const [r, n] of e) {
                if (this.isModelPropertyRule(n)) {
                    const e = n.rules.map((e => Object.entries(e).map((([e, t]) => this.hydrateRule(e, t)))));
                    const a = s.join(".");
                    const o = this.hydrateRuleProperty({
                        name: a !== "" ? `${a}.${r}` : r,
                        displayName: n.displayName
                    });
                    i.push(new PropertyRule(this.l, t, this.messageProvider, o, e));
                } else {
                    iterate(Object.entries(n), [ ...s, r ]);
                }
            }
        };
        iterate(Object.entries(e));
        return i;
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
        const i = e.messageKey;
        if (i !== void 0 && i !== null) {
            t.messageKey = i;
        }
        t.tag = e.tag;
        const s = e.when;
        if (s) {
            if (typeof s === "string") {
                const e = this.parser.parse(s, 0);
                t.canExecute = t => c(e, l.create({
                    $object: t
                }), this, null);
            } else if (typeof s === "function") {
                t.canExecute = s;
            }
        }
    }
    isModelPropertyRule(e) {
        return typeof e === "object" && "rules" in e;
    }
    hydrateRequiredRule(e) {
        const t = new g;
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRegexRule(e) {
        const t = e.pattern;
        const i = new y(new RegExp(t.source, t.flags), e.messageKey);
        i.tag = e.tag;
        return i;
    }
    hydrateLengthRule(e) {
        const t = new w(e.length, e.isMax);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateSizeRule(e) {
        const t = new P(e.count, e.isMax);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRangeRule(e) {
        const t = new R(e.isInclusive, {
            min: e.min,
            max: e.max
        });
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateEqualsRule(e) {
        const t = new x(e.expectedValue);
        this.setCommonRuleProperties(e, t);
        return t;
    }
    hydrateRuleProperty(e) {
        const t = e.name;
        if (!t || typeof t !== "string") {
            throw new Error("The property name needs to be a non-empty string");
        }
        const [i, s] = parsePropertyName(t, this.parser);
        return new RuleProperty(s, i, e.displayName);
    }
};

D = __decorate([ __param(0, s), __param(1, p), __param(2, d) ], D);

m()(D);

class ValidateInstruction {
    constructor(e = void 0, t = void 0, i = void 0, s = void 0, r = void 0) {
        this.object = e;
        this.propertyName = t;
        this.rules = i;
        this.objectTag = s;
        this.propertyTag = r;
    }
}

const C = /*@__PURE__*/ e.createInterface("IValidator");

class StandardValidator {
    async validate(e) {
        const t = e.object;
        const i = e.propertyName;
        const s = e.propertyTag;
        const r = e.rules ?? z.get(t, e.objectTag) ?? [];
        const n = l.create({
            [N]: t
        });
        if (i !== void 0) {
            return await (r.find((e => e.property.name === i))?.validate(t, s, n)) ?? [];
        }
        return (await Promise.all(r.map((async e => e.validate(t, s, n))))).flat();
    }
}

function getDefaultValidationConfiguration() {
    return {
        ValidatorType: StandardValidator,
        MessageProviderType: Y,
        CustomMessages: [],
        HydratorType: D
    };
}

function createConfiguration(e) {
    return {
        optionsProvider: e,
        register(t) {
            const i = getDefaultValidationConfiguration();
            e(i);
            t.register(n.instance(E, i.CustomMessages), n.singleton(C, i.ValidatorType), n.singleton(p, i.MessageProviderType), n.singleton($, i.HydratorType), n.transient(b, _), j);
            return t;
        },
        customize(t) {
            return createConfiguration(t ?? e);
        }
    };
}

const I = createConfiguration(a);

export { v as BaseValidationRule, Deserializer, x as EqualsRule, E as ICustomMessages, $ as IValidationExpressionHydrator, p as IValidationMessageProvider, b as IValidationRules, C as IValidator, w as LengthRule, ModelBasedRule, D as ModelValidationExpressionHydrator, PropertyRule, R as RangeRule, y as RegexRule, g as RequiredRule, RuleProperty, Serializer, P as SizeRule, StandardValidator, ValidateInstruction, I as ValidationConfiguration, j as ValidationDeserializer, Y as ValidationMessageProvider, ValidationResult, f as ValidationRuleAliasMessage, _ as ValidationRules, ValidationSerializer, deserializePrimitive, getDefaultValidationConfiguration, parsePropertyName, N as rootObjectSymbol, serializePrimitive, serializePrimitives, validationRule, z as validationRulesRegistrar };
//# sourceMappingURL=index.mjs.map
