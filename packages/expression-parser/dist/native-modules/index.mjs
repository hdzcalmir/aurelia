import { emptyArray as e, DI as s } from "../../../kernel/dist/native-modules/index.mjs";

const t = "AccessThis";

const n = "AccessBoundary";

const r = "AccessGlobal";

const i = "AccessScope";

const o = "ArrayLiteral";

const a = "ObjectLiteral";

const c = "PrimitiveLiteral";

const h = "Template";

const l = "Unary";

const u = "CallScope";

const p = "CallMember";

const f = "CallFunction";

const x = "CallGlobal";

const w = "AccessMember";

const E = "AccessKeyed";

const d = "TaggedTemplate";

const m = "Binary";

const k = "Conditional";

const b = "Assign";

const A = "ArrowFunction";

const g = "ValueConverter";

const T = "BindingBehavior";

const C = "ArrayBindingPattern";

const v = "ObjectBindingPattern";

const y = "BindingIdentifier";

const L = "ForOfStatement";

const P = "Interpolation";

const B = "ArrayDestructuring";

const I = "ObjectDestructuring";

const S = "DestructuringAssignmentLeaf";

const $ = "Custom";

class CustomExpression {
    constructor(e) {
        this.value = e;
        this.$kind = $;
    }
    evaluate(...e) {
        return this.value;
    }
    assign(...e) {
        return e;
    }
    bind(...e) {}
    unbind(...e) {}
    accept(e) {
        return void 0;
    }
}

class BindingBehaviorExpression {
    constructor(e, s, t) {
        this.expression = e;
        this.name = s;
        this.args = t;
        this.$kind = T;
        this.key = `_bb_${s}`;
    }
}

class ValueConverterExpression {
    constructor(e, s, t) {
        this.expression = e;
        this.name = s;
        this.args = t;
        this.$kind = g;
    }
}

class AssignExpression {
    constructor(e, s) {
        this.target = e;
        this.value = s;
        this.$kind = b;
    }
}

class ConditionalExpression {
    constructor(e, s, t) {
        this.condition = e;
        this.yes = s;
        this.no = t;
        this.$kind = k;
    }
}

class AccessGlobalExpression {
    constructor(e) {
        this.name = e;
        this.$kind = r;
    }
}

class AccessThisExpression {
    constructor(e = 0) {
        this.ancestor = e;
        this.$kind = t;
    }
}

class AccessBoundaryExpression {
    constructor() {
        this.$kind = n;
    }
}

class AccessScopeExpression {
    constructor(e, s = 0) {
        this.name = e;
        this.ancestor = s;
        this.$kind = i;
    }
}

const isAccessGlobal = e => e.$kind === r || (e.$kind === w || e.$kind === E) && e.accessGlobal;

class AccessMemberExpression {
    constructor(e, s, t = false) {
        this.object = e;
        this.name = s;
        this.optional = t;
        this.$kind = w;
        this.accessGlobal = isAccessGlobal(e);
    }
}

class AccessKeyedExpression {
    constructor(e, s, t = false) {
        this.object = e;
        this.key = s;
        this.optional = t;
        this.$kind = E;
        this.accessGlobal = isAccessGlobal(e);
    }
}

class CallScopeExpression {
    constructor(e, s, t = 0, n = false) {
        this.name = e;
        this.args = s;
        this.ancestor = t;
        this.optional = n;
        this.$kind = u;
    }
}

class CallMemberExpression {
    constructor(e, s, t, n = false, r = false) {
        this.object = e;
        this.name = s;
        this.args = t;
        this.optionalMember = n;
        this.optionalCall = r;
        this.$kind = p;
    }
}

class CallFunctionExpression {
    constructor(e, s, t = false) {
        this.func = e;
        this.args = s;
        this.optional = t;
        this.$kind = f;
    }
}

class CallGlobalExpression {
    constructor(e, s) {
        this.name = e;
        this.args = s;
        this.$kind = x;
    }
}

class BinaryExpression {
    constructor(e, s, t) {
        this.operation = e;
        this.left = s;
        this.right = t;
        this.$kind = m;
    }
}

class UnaryExpression {
    constructor(e, s) {
        this.operation = e;
        this.expression = s;
        this.$kind = l;
    }
}

class PrimitiveLiteralExpression {
    constructor(e) {
        this.value = e;
        this.$kind = c;
    }
}

PrimitiveLiteralExpression.$undefined = new PrimitiveLiteralExpression(void 0);

PrimitiveLiteralExpression.$null = new PrimitiveLiteralExpression(null);

PrimitiveLiteralExpression.$true = new PrimitiveLiteralExpression(true);

PrimitiveLiteralExpression.$false = new PrimitiveLiteralExpression(false);

PrimitiveLiteralExpression.$empty = new PrimitiveLiteralExpression("");

class ArrayLiteralExpression {
    constructor(e) {
        this.elements = e;
        this.$kind = o;
    }
}

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(e);

class ObjectLiteralExpression {
    constructor(e, s) {
        this.keys = e;
        this.values = s;
        this.$kind = a;
    }
}

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(e, e);

class TemplateExpression {
    constructor(s, t = e) {
        this.cooked = s;
        this.expressions = t;
        this.$kind = h;
    }
}

TemplateExpression.$empty = new TemplateExpression([ "" ]);

class TaggedTemplateExpression {
    constructor(s, t, n, r = e) {
        this.cooked = s;
        this.func = n;
        this.expressions = r;
        this.$kind = d;
        s.raw = t;
    }
}

class ArrayBindingPattern {
    constructor(e) {
        this.elements = e;
        this.$kind = C;
    }
}

class ObjectBindingPattern {
    constructor(e, s) {
        this.keys = e;
        this.values = s;
        this.$kind = v;
    }
}

class BindingIdentifier {
    constructor(e) {
        this.name = e;
        this.$kind = y;
    }
}

class ForOfStatement {
    constructor(e, s, t) {
        this.declaration = e;
        this.iterable = s;
        this.semiIdx = t;
        this.$kind = L;
    }
}

class Interpolation {
    constructor(s, t = e) {
        this.parts = s;
        this.expressions = t;
        this.$kind = P;
        this.isMulti = t.length > 1;
        this.firstExpression = t[0];
    }
}

class DestructuringAssignmentExpression {
    constructor(e, s, t, n) {
        this.$kind = e;
        this.list = s;
        this.source = t;
        this.initializer = n;
    }
}

class DestructuringAssignmentSingleExpression {
    constructor(e, s, t) {
        this.target = e;
        this.source = s;
        this.initializer = t;
        this.$kind = S;
    }
}

class DestructuringAssignmentRestExpression {
    constructor(e, s) {
        this.target = e;
        this.indexOrProperties = s;
        this.$kind = S;
    }
}

class ArrowFunction {
    constructor(e, s, t = false) {
        this.args = e;
        this.body = s;
        this.rest = t;
        this.$kind = A;
    }
}

const createError = e => new Error(e);

const isString = e => typeof e === "string";

const O = String;

const createLookup = () => Object.create(null);

const astVisit = (e, s) => {
    switch (e.$kind) {
      case E:
        return s.visitAccessKeyed(e);

      case w:
        return s.visitAccessMember(e);

      case i:
        return s.visitAccessScope(e);

      case t:
        return s.visitAccessThis(e);

      case n:
        return s.visitAccessBoundary(e);

      case C:
        return s.visitArrayBindingPattern(e);

      case B:
        return s.visitDestructuringAssignmentExpression(e);

      case o:
        return s.visitArrayLiteral(e);

      case A:
        return s.visitArrowFunction(e);

      case b:
        return s.visitAssign(e);

      case m:
        return s.visitBinary(e);

      case T:
        return s.visitBindingBehavior(e);

      case y:
        return s.visitBindingIdentifier(e);

      case f:
        return s.visitCallFunction(e);

      case p:
        return s.visitCallMember(e);

      case u:
        return s.visitCallScope(e);

      case k:
        return s.visitConditional(e);

      case S:
        return s.visitDestructuringAssignmentSingleExpression(e);

      case L:
        return s.visitForOfStatement(e);

      case P:
        return s.visitInterpolation(e);

      case v:
        return s.visitObjectBindingPattern(e);

      case I:
        return s.visitDestructuringAssignmentExpression(e);

      case a:
        return s.visitObjectLiteral(e);

      case c:
        return s.visitPrimitiveLiteral(e);

      case d:
        return s.visitTaggedTemplate(e);

      case h:
        return s.visitTemplate(e);

      case l:
        return s.visitUnary(e);

      case g:
        return s.visitValueConverter(e);

      case $:
        return s.visitCustom(e);

      default:
        {
            throw createError(`Trying to visit unknown ast node ${JSON.stringify(e)}`);
        }
    }
};

class Unparser {
    constructor() {
        this.text = "";
    }
    static unparse(e) {
        const s = new Unparser;
        astVisit(e, s);
        return s.text;
    }
    visitAccessMember(e) {
        astVisit(e.object, this);
        this.text += `${e.optional ? "?" : ""}.${e.name}`;
    }
    visitAccessKeyed(e) {
        astVisit(e.object, this);
        this.text += `${e.optional ? "?." : ""}[`;
        astVisit(e.key, this);
        this.text += "]";
    }
    visitAccessThis(e) {
        if (e.ancestor === 0) {
            this.text += "$this";
            return;
        }
        this.text += "$parent";
        let s = e.ancestor - 1;
        while (s--) {
            this.text += ".$parent";
        }
    }
    visitAccessBoundary(e) {
        this.text += "this";
    }
    visitAccessScope(e) {
        let s = e.ancestor;
        while (s--) {
            this.text += "$parent.";
        }
        this.text += e.name;
    }
    visitArrayLiteral(e) {
        const s = e.elements;
        this.text += "[";
        for (let e = 0, t = s.length; e < t; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            astVisit(s[e], this);
        }
        this.text += "]";
    }
    visitArrowFunction(e) {
        const s = e.args;
        const t = s.length;
        let n = 0;
        let r = "(";
        let i;
        for (;n < t; ++n) {
            i = s[n].name;
            if (n > 0) {
                r += ", ";
            }
            if (n < t - 1) {
                r += i;
            } else {
                r += e.rest ? `...${i}` : i;
            }
        }
        this.text += `${r}) => `;
        astVisit(e.body, this);
    }
    visitObjectLiteral(e) {
        const s = e.keys;
        const t = e.values;
        this.text += "{";
        for (let e = 0, n = s.length; e < n; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            this.text += `'${s[e]}':`;
            astVisit(t[e], this);
        }
        this.text += "}";
    }
    visitPrimitiveLiteral(e) {
        this.text += "(";
        if (isString(e.value)) {
            const s = e.value.replace(/'/g, "\\'");
            this.text += `'${s}'`;
        } else {
            this.text += `${e.value}`;
        }
        this.text += ")";
    }
    visitCallFunction(e) {
        this.text += "(";
        astVisit(e.func, this);
        this.text += e.optional ? "?." : "";
        this.writeArgs(e.args);
        this.text += ")";
    }
    visitCallMember(e) {
        this.text += "(";
        astVisit(e.object, this);
        this.text += `${e.optionalMember ? "?." : ""}.${e.name}${e.optionalCall ? "?." : ""}`;
        this.writeArgs(e.args);
        this.text += ")";
    }
    visitCallScope(e) {
        this.text += "(";
        let s = e.ancestor;
        while (s--) {
            this.text += "$parent.";
        }
        this.text += `${e.name}${e.optional ? "?." : ""}`;
        this.writeArgs(e.args);
        this.text += ")";
    }
    visitTemplate(e) {
        const {cooked: s, expressions: t} = e;
        const n = t.length;
        this.text += "`";
        this.text += s[0];
        for (let e = 0; e < n; e++) {
            astVisit(t[e], this);
            this.text += s[e + 1];
        }
        this.text += "`";
    }
    visitTaggedTemplate(e) {
        const {cooked: s, expressions: t} = e;
        const n = t.length;
        astVisit(e.func, this);
        this.text += "`";
        this.text += s[0];
        for (let e = 0; e < n; e++) {
            astVisit(t[e], this);
            this.text += s[e + 1];
        }
        this.text += "`";
    }
    visitUnary(e) {
        this.text += `(${e.operation}`;
        if (e.operation.charCodeAt(0) >= 97) {
            this.text += " ";
        }
        astVisit(e.expression, this);
        this.text += ")";
    }
    visitBinary(e) {
        this.text += "(";
        astVisit(e.left, this);
        if (e.operation.charCodeAt(0) === 105) {
            this.text += ` ${e.operation} `;
        } else {
            this.text += e.operation;
        }
        astVisit(e.right, this);
        this.text += ")";
    }
    visitConditional(e) {
        this.text += "(";
        astVisit(e.condition, this);
        this.text += "?";
        astVisit(e.yes, this);
        this.text += ":";
        astVisit(e.no, this);
        this.text += ")";
    }
    visitAssign(e) {
        this.text += "(";
        astVisit(e.target, this);
        this.text += "=";
        astVisit(e.value, this);
        this.text += ")";
    }
    visitValueConverter(e) {
        const s = e.args;
        astVisit(e.expression, this);
        this.text += `|${e.name}`;
        for (let e = 0, t = s.length; e < t; ++e) {
            this.text += ":";
            astVisit(s[e], this);
        }
    }
    visitBindingBehavior(e) {
        const s = e.args;
        astVisit(e.expression, this);
        this.text += `&${e.name}`;
        for (let e = 0, t = s.length; e < t; ++e) {
            this.text += ":";
            astVisit(s[e], this);
        }
    }
    visitArrayBindingPattern(e) {
        const s = e.elements;
        this.text += "[";
        for (let e = 0, t = s.length; e < t; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            astVisit(s[e], this);
        }
        this.text += "]";
    }
    visitObjectBindingPattern(e) {
        const s = e.keys;
        const t = e.values;
        this.text += "{";
        for (let e = 0, n = s.length; e < n; ++e) {
            if (e !== 0) {
                this.text += ",";
            }
            this.text += `'${s[e]}':`;
            astVisit(t[e], this);
        }
        this.text += "}";
    }
    visitBindingIdentifier(e) {
        this.text += e.name;
    }
    visitForOfStatement(e) {
        astVisit(e.declaration, this);
        this.text += " of ";
        astVisit(e.iterable, this);
    }
    visitInterpolation(e) {
        const {parts: s, expressions: t} = e;
        const n = t.length;
        this.text += "${";
        this.text += s[0];
        for (let e = 0; e < n; e++) {
            astVisit(t[e], this);
            this.text += s[e + 1];
        }
        this.text += "}";
    }
    visitDestructuringAssignmentExpression(e) {
        const s = e.$kind;
        const t = s === I;
        this.text += t ? "{" : "[";
        const n = e.list;
        const r = n.length;
        let i;
        let o;
        for (i = 0; i < r; i++) {
            o = n[i];
            switch (o.$kind) {
              case S:
                astVisit(o, this);
                break;

              case B:
              case I:
                {
                    const e = o.source;
                    if (e) {
                        astVisit(e, this);
                        this.text += ":";
                    }
                    astVisit(o, this);
                    break;
                }
            }
        }
        this.text += t ? "}" : "]";
    }
    visitDestructuringAssignmentSingleExpression(e) {
        astVisit(e.source, this);
        this.text += ":";
        astVisit(e.target, this);
        const s = e.initializer;
        if (s !== void 0) {
            this.text += "=";
            astVisit(s, this);
        }
    }
    visitDestructuringAssignmentRestExpression(e) {
        this.text += "...";
        astVisit(e.target, this);
    }
    visitCustom(e) {
        this.text += O(e.value);
    }
    writeArgs(e) {
        this.text += "(";
        for (let s = 0, t = e.length; s < t; ++s) {
            if (s !== 0) {
                this.text += ",";
            }
            astVisit(e[s], this);
        }
        this.text += ")";
    }
}

const createMappedError = (e, ...s) => new Error(`AUR${O(e).padStart(4, "0")}:${s.map(O)}`);

const F = /*@__PURE__*/ s.createInterface("IExpressionParser", (e => e.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.t = createLookup();
        this.i = createLookup();
        this.h = createLookup();
    }
    parse(e, s) {
        let t;
        switch (s) {
          case q:
            return new CustomExpression(e);

          case H:
            t = this.h[e];
            if (t === void 0) {
                t = this.h[e] = this.$parse(e, s);
            }
            return t;

          case V:
            t = this.i[e];
            if (t === void 0) {
                t = this.i[e] = this.$parse(e, s);
            }
            return t;

          default:
            {
                if (e.length === 0) {
                    if (s === J || s === _) {
                        return PrimitiveLiteralExpression.$empty;
                    }
                    throw invalidEmptyExpression();
                }
                t = this.t[e];
                if (t === void 0) {
                    t = this.t[e] = this.$parse(e, s);
                }
                return t;
            }
        }
    }
    $parse(e, s) {
        Q = e;
        W = 0;
        X = e.length;
        Y = 0;
        Z = 0;
        ee = 6291456;
        se = "";
        te = $charCodeAt(0);
        ne = true;
        re = false;
        ie = true;
        oe = -1;
        return parse(61, s === void 0 ? _ : s);
    }
}

function unescapeCode(e) {
    switch (e) {
      case 98:
        return 8;

      case 116:
        return 9;

      case 110:
        return 10;

      case 118:
        return 11;

      case 102:
        return 12;

      case 114:
        return 13;

      case 34:
        return 34;

      case 39:
        return 39;

      case 92:
        return 92;

      default:
        return e;
    }
}

const M = PrimitiveLiteralExpression.$false;

const j = PrimitiveLiteralExpression.$true;

const D = PrimitiveLiteralExpression.$null;

const U = PrimitiveLiteralExpression.$undefined;

const K = new AccessThisExpression(0);

const N = new AccessThisExpression(1);

const R = new AccessBoundaryExpression;

const G = "None";

const H = "Interpolation";

const V = "IsIterator";

const z = "IsChainable";

const J = "IsFunction";

const _ = "IsProperty";

const q = "IsCustom";

let Q = "";

let W = 0;

let X = 0;

let Y = 0;

let Z = 0;

let ee = 6291456;

let se = "";

let te;

let ne = true;

let re = false;

let ie = true;

let oe = -1;

const ae = String.fromCharCode;

const $charCodeAt = e => Q.charCodeAt(e);

const $tokenRaw = () => Q.slice(Z, W);

const ce = ("Infinity NaN isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent" + " Array BigInt Boolean Date Map Number Object RegExp Set String JSON Math Intl").split(" ");

function parseExpression(e, s) {
    Q = e;
    W = 0;
    X = e.length;
    Y = 0;
    Z = 0;
    ee = 6291456;
    se = "";
    te = $charCodeAt(0);
    ne = true;
    re = false;
    ie = true;
    oe = -1;
    return parse(61, s === void 0 ? _ : s);
}

function parse(e, s) {
    if (s === q) {
        return new CustomExpression(Q);
    }
    if (W === 0) {
        if (s === H) {
            return parseInterpolation();
        }
        nextToken();
        if (ee & 4194304) {
            throw invalidStartOfExpression();
        }
    }
    ne = 513 > e;
    re = false;
    ie = 514 > e;
    let n = false;
    let o = void 0;
    let a = 0;
    if (ee & 131072) {
        const e = le[ee & 63];
        nextToken();
        o = new UnaryExpression(e, parse(514, s));
        ne = false;
    } else {
        e: switch (ee) {
          case 12295:
            a = Y;
            ne = false;
            ie = false;
            do {
                nextToken();
                ++a;
                switch (ee) {
                  case 65546:
                    nextToken();
                    if ((ee & 12288) === 0) {
                        throw expectedIdentifier();
                    }
                    break;

                  case 11:
                  case 12:
                    throw expectedIdentifier();

                  case 2162701:
                    re = true;
                    nextToken();
                    if ((ee & 12288) === 0) {
                        o = a === 0 ? K : a === 1 ? N : new AccessThisExpression(a);
                        n = true;
                        break e;
                    }
                    break;

                  default:
                    if (ee & 2097152) {
                        o = a === 0 ? K : a === 1 ? N : new AccessThisExpression(a);
                        break e;
                    }
                    throw invalidMemberExpression();
                }
            } while (ee === 12295);

          case 4096:
            {
                const e = se;
                if (s === V) {
                    o = new BindingIdentifier(e);
                } else if (ie && ce.includes(e)) {
                    o = new AccessGlobalExpression(e);
                } else if (ie && e === "import") {
                    throw unexpectedImportKeyword();
                } else {
                    o = new AccessScopeExpression(e, a);
                }
                ne = !re;
                nextToken();
                if (consumeOpt(51)) {
                    if (ee === 524297) {
                        throw functionBodyInArrowFn();
                    }
                    const s = re;
                    const t = Y;
                    ++Y;
                    const n = parse(62, G);
                    re = s;
                    Y = t;
                    ne = false;
                    o = new ArrowFunction([ new BindingIdentifier(e) ], n);
                }
                break;
            }

          case 11:
            throw unexpectedDoubleDot();

          case 12:
            throw invalidSpreadOp();

          case 12292:
            ne = false;
            nextToken();
            switch (Y) {
              case 0:
                o = K;
                break;

              case 1:
                o = N;
                break;

              default:
                o = new AccessThisExpression(Y);
                break;
            }
            break;

          case 12293:
            ne = false;
            nextToken();
            o = R;
            break;

          case 2688008:
            o = parseCoverParenthesizedExpressionAndArrowParameterList(s);
            break;

          case 2688019:
            o = Q.search(/\s+of\s+/) > W ? parseArrayDestructuring() : parseArrayLiteralExpression(s);
            break;

          case 524297:
            o = parseObjectLiteralExpression(s);
            break;

          case 2163760:
            o = new TemplateExpression([ se ]);
            ne = false;
            nextToken();
            break;

          case 2163761:
            o = parseTemplate(s, o, false);
            break;

          case 16384:
          case 32768:
            o = new PrimitiveLiteralExpression(se);
            ne = false;
            nextToken();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            o = le[ee & 63];
            ne = false;
            nextToken();
            break;

          default:
            if (W >= X) {
                throw unexpectedEndOfExpression();
            } else {
                throw unconsumedToken();
            }
        }
        if (s === V) {
            return parseForOfStatement(o);
        }
        if (514 < e) {
            return o;
        }
        if (ee === 11 || ee === 12) {
            throw expectedIdentifier();
        }
        if (o.$kind === t) {
            switch (ee) {
              case 2162701:
                re = true;
                ne = false;
                nextToken();
                if ((ee & 13312) === 0) {
                    throw unexpectedTokenInOptionalChain();
                }
                if (ee & 12288) {
                    o = new AccessScopeExpression(se, o.ancestor);
                    nextToken();
                } else if (ee === 2688008) {
                    o = new CallFunctionExpression(o, parseArguments(), true);
                } else if (ee === 2688019) {
                    o = parseKeyedExpression(o, true);
                } else {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                break;

              case 65546:
                ne = !re;
                nextToken();
                if ((ee & 12288) === 0) {
                    throw expectedIdentifier();
                }
                o = new AccessScopeExpression(se, o.ancestor);
                nextToken();
                break;

              case 11:
              case 12:
                throw expectedIdentifier();

              case 2688008:
                o = new CallFunctionExpression(o, parseArguments(), n);
                break;

              case 2688019:
                o = parseKeyedExpression(o, n);
                break;

              case 2163760:
                o = createTemplateTail(o);
                break;

              case 2163761:
                o = parseTemplate(s, o, true);
                break;
            }
        }
        while ((ee & 65536) > 0) {
            switch (ee) {
              case 2162701:
                o = parseOptionalChainLHS(o);
                break;

              case 65546:
                nextToken();
                if ((ee & 12288) === 0) {
                    throw expectedIdentifier();
                }
                o = parseMemberExpressionLHS(o, false);
                break;

              case 11:
              case 12:
                throw expectedIdentifier();

              case 2688008:
                if (o.$kind === i) {
                    o = new CallScopeExpression(o.name, parseArguments(), o.ancestor, false);
                } else if (o.$kind === w) {
                    o = new CallMemberExpression(o.object, o.name, parseArguments(), o.optional, false);
                } else if (o.$kind === r) {
                    o = new CallGlobalExpression(o.name, parseArguments());
                } else {
                    o = new CallFunctionExpression(o, parseArguments(), false);
                }
                break;

              case 2688019:
                o = parseKeyedExpression(o, false);
                break;

              case 2163760:
                if (re) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                o = createTemplateTail(o);
                break;

              case 2163761:
                if (re) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                o = parseTemplate(s, o, true);
                break;
            }
        }
    }
    if (ee === 11 || ee === 12) {
        throw expectedIdentifier();
    }
    if (513 < e) {
        return o;
    }
    while ((ee & 262144) > 0) {
        const t = ee;
        if ((t & 960) <= e) {
            break;
        }
        nextToken();
        o = new BinaryExpression(le[t & 63], o, parse(t & 960, s));
        ne = false;
    }
    if (63 < e) {
        return o;
    }
    if (consumeOpt(6291479)) {
        const e = parse(62, s);
        consume(6291477);
        o = new ConditionalExpression(o, e, parse(62, s));
        ne = false;
    }
    if (62 < e) {
        return o;
    }
    if (consumeOpt(4194350)) {
        if (!ne) {
            throw lhsNotAssignable();
        }
        o = new AssignExpression(o, parse(62, s));
    }
    if (61 < e) {
        return o;
    }
    while (consumeOpt(6291481)) {
        if (ee === 6291456) {
            throw expectedValueConverterIdentifier();
        }
        const e = se;
        nextToken();
        const t = new Array;
        while (consumeOpt(6291477)) {
            t.push(parse(62, s));
        }
        o = new ValueConverterExpression(o, e, t);
    }
    while (consumeOpt(6291480)) {
        if (ee === 6291456) {
            throw expectedBindingBehaviorIdentifier();
        }
        const e = se;
        nextToken();
        const t = new Array;
        while (consumeOpt(6291477)) {
            t.push(parse(62, s));
        }
        o = new BindingBehaviorExpression(o, e, t);
    }
    if (ee !== 6291456) {
        if (s === H && ee === 7340046) {
            return o;
        }
        if (s === z && ee === 6291478) {
            if (W === X) {
                throw unconsumedToken();
            }
            oe = W - 1;
            return o;
        }
        if ($tokenRaw() === "of") {
            throw unexpectedOfKeyword();
        }
        throw unconsumedToken();
    }
    return o;
}

function parseArrayDestructuring() {
    const e = [];
    const s = new DestructuringAssignmentExpression(B, e, void 0, void 0);
    let t = "";
    let n = true;
    let r = 0;
    while (n) {
        nextToken();
        switch (ee) {
          case 7340052:
            n = false;
            addItem();
            break;

          case 6291472:
            addItem();
            break;

          case 4096:
            t = $tokenRaw();
            break;

          default:
            throw unexpectedTokenInDestructuring();
        }
    }
    consume(7340052);
    return s;
    function addItem() {
        if (t !== "") {
            e.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(K, t), new AccessKeyedExpression(K, new PrimitiveLiteralExpression(r++)), void 0));
            t = "";
        } else {
            r++;
        }
    }
}

function parseArguments() {
    const e = re;
    nextToken();
    const s = [];
    while (ee !== 7340047) {
        s.push(parse(62, G));
        if (!consumeOpt(6291472)) {
            break;
        }
    }
    consume(7340047);
    ne = false;
    re = e;
    return s;
}

function parseKeyedExpression(e, s) {
    const t = re;
    nextToken();
    e = new AccessKeyedExpression(e, parse(62, G), s);
    consume(7340052);
    ne = !t;
    re = t;
    return e;
}

function parseOptionalChainLHS(e) {
    re = true;
    ne = false;
    nextToken();
    if ((ee & 13312) === 0) {
        throw unexpectedTokenInOptionalChain();
    }
    if (ee & 12288) {
        return parseMemberExpressionLHS(e, true);
    }
    if (ee === 2688008) {
        if (e.$kind === i) {
            return new CallScopeExpression(e.name, parseArguments(), e.ancestor, true);
        } else if (e.$kind === w) {
            return new CallMemberExpression(e.object, e.name, parseArguments(), e.optional, true);
        } else {
            return new CallFunctionExpression(e, parseArguments(), true);
        }
    }
    if (ee === 2688019) {
        return parseKeyedExpression(e, true);
    }
    throw invalidTaggedTemplateOnOptionalChain();
}

function parseMemberExpressionLHS(e, s) {
    const t = se;
    switch (ee) {
      case 2162701:
        {
            re = true;
            ne = false;
            const n = W;
            const r = Z;
            const i = ee;
            const o = te;
            const a = se;
            const c = ne;
            const h = re;
            nextToken();
            if ((ee & 13312) === 0) {
                throw unexpectedTokenInOptionalChain();
            }
            if (ee === 2688008) {
                return new CallMemberExpression(e, t, parseArguments(), s, true);
            }
            W = n;
            Z = r;
            ee = i;
            te = o;
            se = a;
            ne = c;
            re = h;
            return new AccessMemberExpression(e, t, s);
        }

      case 2688008:
        {
            ne = false;
            return new CallMemberExpression(e, t, parseArguments(), s, false);
        }

      default:
        {
            ne = !re;
            nextToken();
            return new AccessMemberExpression(e, t, s);
        }
    }
}

function parseCoverParenthesizedExpressionAndArrowParameterList(e) {
    nextToken();
    const s = W;
    const t = Z;
    const n = ee;
    const r = te;
    const i = se;
    const o = ne;
    const a = re;
    const c = [];
    let h = 1;
    let l = false;
    e: while (true) {
        if (ee === 12) {
            nextToken();
            if (ee !== 4096) {
                throw expectedIdentifier();
            }
            c.push(new BindingIdentifier(se));
            nextToken();
            if (ee === 6291472) {
                throw restParamsMustBeLastParam();
            }
            if (ee !== 7340047) {
                throw invalidSpreadOp();
            }
            nextToken();
            if (ee !== 51) {
                throw invalidSpreadOp();
            }
            nextToken();
            const e = re;
            const s = Y;
            ++Y;
            const t = parse(62, G);
            re = e;
            Y = s;
            ne = false;
            return new ArrowFunction(c, t, true);
        }
        switch (ee) {
          case 4096:
            c.push(new BindingIdentifier(se));
            nextToken();
            break;

          case 7340047:
            nextToken();
            break e;

          case 524297:
          case 2688019:
            nextToken();
            h = 4;
            break;

          case 6291472:
            h = 2;
            l = true;
            break e;

          case 2688008:
            h = 2;
            break e;

          default:
            nextToken();
            h = 2;
            break;
        }
        switch (ee) {
          case 6291472:
            nextToken();
            l = true;
            if (h === 1) {
                break;
            }
            break e;

          case 7340047:
            nextToken();
            break e;

          case 4194350:
            if (h === 1) {
                h = 3;
            }
            break e;

          case 51:
            if (l) {
                throw invalidArrowParameterList();
            }
            nextToken();
            h = 2;
            break e;

          default:
            if (h === 1) {
                h = 2;
            }
            break e;
        }
    }
    if (ee === 51) {
        if (h === 1) {
            nextToken();
            if (ee === 524297) {
                throw functionBodyInArrowFn();
            }
            const e = re;
            const s = Y;
            ++Y;
            const t = parse(62, G);
            re = e;
            Y = s;
            ne = false;
            return new ArrowFunction(c, t);
        }
        throw invalidArrowParameterList();
    } else if (h === 1 && c.length === 0) {
        throw missingExpectedToken();
    }
    if (l) {
        switch (h) {
          case 2:
            throw invalidArrowParameterList();

          case 3:
            throw defaultParamsInArrowFn();

          case 4:
            throw destructuringParamsInArrowFn();
        }
    }
    W = s;
    Z = t;
    ee = n;
    te = r;
    se = i;
    ne = o;
    re = a;
    const u = re;
    const p = parse(62, e);
    re = u;
    consume(7340047);
    if (ee === 51) {
        switch (h) {
          case 2:
            throw invalidArrowParameterList();

          case 3:
            throw defaultParamsInArrowFn();

          case 4:
            throw destructuringParamsInArrowFn();
        }
    }
    return p;
}

function parseArrayLiteralExpression(e) {
    const s = re;
    nextToken();
    const t = new Array;
    while (ee !== 7340052) {
        if (consumeOpt(6291472)) {
            t.push(U);
            if (ee === 7340052) {
                break;
            }
        } else {
            t.push(parse(62, e === V ? G : e));
            if (consumeOpt(6291472)) {
                if (ee === 7340052) {
                    break;
                }
            } else {
                break;
            }
        }
    }
    re = s;
    consume(7340052);
    if (e === V) {
        return new ArrayBindingPattern(t);
    } else {
        ne = false;
        return new ArrayLiteralExpression(t);
    }
}

const he = [ C, v, y, B, I ];

function parseForOfStatement(e) {
    if (!he.includes(e.$kind)) {
        throw invalidLHSBindingIdentifierInForOf(e.$kind);
    }
    if (ee !== 4204594) {
        throw invalidLHSBindingIdentifierInForOf(e.$kind);
    }
    nextToken();
    const s = e;
    const t = parse(61, z);
    return new ForOfStatement(s, t, oe);
}

function parseObjectLiteralExpression(e) {
    const s = re;
    const t = new Array;
    const n = new Array;
    nextToken();
    while (ee !== 7340046) {
        t.push(se);
        if (ee & 49152) {
            nextToken();
            consume(6291477);
            n.push(parse(62, e === V ? G : e));
        } else if (ee & 12288) {
            const s = te;
            const t = ee;
            const r = W;
            nextToken();
            if (consumeOpt(6291477)) {
                n.push(parse(62, e === V ? G : e));
            } else {
                te = s;
                ee = t;
                W = r;
                n.push(parse(515, e === V ? G : e));
            }
        } else {
            throw invalidPropDefInObjLiteral();
        }
        if (ee !== 7340046) {
            consume(6291472);
        }
    }
    re = s;
    consume(7340046);
    if (e === V) {
        return new ObjectBindingPattern(t, n);
    } else {
        ne = false;
        return new ObjectLiteralExpression(t, n);
    }
}

function parseInterpolation() {
    const e = [];
    const s = [];
    const t = X;
    let n = "";
    while (W < t) {
        switch (te) {
          case 36:
            if ($charCodeAt(W + 1) === 123) {
                e.push(n);
                n = "";
                W += 2;
                te = $charCodeAt(W);
                nextToken();
                const t = parse(61, H);
                s.push(t);
                continue;
            } else {
                n += "$";
            }
            break;

          case 92:
            n += ae(unescapeCode(nextChar()));
            break;

          default:
            n += ae(te);
        }
        nextChar();
    }
    if (s.length) {
        e.push(n);
        return new Interpolation(e, s);
    }
    return null;
}

function parseTemplate(e, s, t) {
    const n = re;
    const r = [ se ];
    consume(2163761);
    const i = [ parse(62, e) ];
    while ((ee = scanTemplateTail()) !== 2163760) {
        r.push(se);
        consume(2163761);
        i.push(parse(62, e));
    }
    r.push(se);
    ne = false;
    re = n;
    if (t) {
        nextToken();
        return new TaggedTemplateExpression(r, r, s, i);
    } else {
        nextToken();
        return new TemplateExpression(r, i);
    }
}

function createTemplateTail(e) {
    ne = false;
    const s = [ se ];
    nextToken();
    return new TaggedTemplateExpression(s, s, e);
}

function nextToken() {
    while (W < X) {
        Z = W;
        if ((ee = xe[te]()) != null) {
            return;
        }
    }
    ee = 6291456;
}

function nextChar() {
    return te = $charCodeAt(++W);
}

function scanIdentifier() {
    while (fe[nextChar()]) ;
    const e = ue[se = $tokenRaw()];
    return e === undefined ? 4096 : e;
}

function scanNumber(e) {
    let s = te;
    if (e === false) {
        do {
            s = nextChar();
        } while (s <= 57 && s >= 48);
        if (s !== 46) {
            se = parseInt($tokenRaw(), 10);
            return 32768;
        }
        s = nextChar();
        if (W >= X) {
            se = parseInt($tokenRaw().slice(0, -1), 10);
            return 32768;
        }
    }
    if (s <= 57 && s >= 48) {
        do {
            s = nextChar();
        } while (s <= 57 && s >= 48);
    } else {
        te = $charCodeAt(--W);
    }
    se = parseFloat($tokenRaw());
    return 32768;
}

function scanString() {
    const e = te;
    nextChar();
    let s = 0;
    const t = new Array;
    let n = W;
    while (te !== e) {
        if (te === 92) {
            t.push(Q.slice(n, W));
            nextChar();
            s = unescapeCode(te);
            nextChar();
            t.push(ae(s));
            n = W;
        } else if (W >= X) {
            throw unterminatedStringLiteral();
        } else {
            nextChar();
        }
    }
    const r = Q.slice(n, W);
    nextChar();
    t.push(r);
    const i = t.join("");
    se = i;
    return 16384;
}

function scanTemplate() {
    let e = true;
    let s = "";
    while (nextChar() !== 96) {
        if (te === 36) {
            if (W + 1 < X && $charCodeAt(W + 1) === 123) {
                W++;
                e = false;
                break;
            } else {
                s += "$";
            }
        } else if (te === 92) {
            s += ae(unescapeCode(nextChar()));
        } else {
            if (W >= X) {
                throw unterminatedTemplateLiteral();
            }
            s += ae(te);
        }
    }
    nextChar();
    se = s;
    if (e) {
        return 2163760;
    }
    return 2163761;
}

const scanTemplateTail = () => {
    if (W >= X) {
        throw unterminatedTemplateLiteral();
    }
    W--;
    return scanTemplate();
};

const consumeOpt = e => {
    if (ee === e) {
        nextToken();
        return true;
    }
    return false;
};

const consume = e => {
    if (ee === e) {
        nextToken();
    } else {
        throw missingExpectedToken();
    }
};

const invalidStartOfExpression = () => createMappedError(151, Q);

const invalidSpreadOp = () => createMappedError(152, Q);

const expectedIdentifier = () => createMappedError(153, Q);

const invalidMemberExpression = () => createMappedError(154, Q);

const unexpectedEndOfExpression = () => createMappedError(155, Q);

const unconsumedToken = () => createMappedError(156, $tokenRaw(), W, Q);

const invalidEmptyExpression = () => createMappedError(157);

const lhsNotAssignable = () => createMappedError(158, Q);

const expectedValueConverterIdentifier = () => createMappedError(159, Q);

const expectedBindingBehaviorIdentifier = () => createMappedError(160, Q);

const unexpectedOfKeyword = () => createMappedError(161, Q);

const unexpectedImportKeyword = () => createMappedError(162, Q);

const invalidLHSBindingIdentifierInForOf = e => createMappedError(163, Q, e);

const invalidPropDefInObjLiteral = () => createMappedError(164, Q);

const unterminatedStringLiteral = () => createMappedError(165, Q);

const unterminatedTemplateLiteral = () => createMappedError(166, Q);

const missingExpectedToken = e => createMappedError(167, Q);

const unexpectedCharacter = () => {
    throw createMappedError(168, Q);
};

unexpectedCharacter.notMapped = true;

const unexpectedTokenInDestructuring = () => createMappedError(170, Q);

const unexpectedTokenInOptionalChain = () => createMappedError(171, Q);

const invalidTaggedTemplateOnOptionalChain = () => createMappedError(172, Q);

const invalidArrowParameterList = () => createMappedError(173, Q);

const defaultParamsInArrowFn = () => createMappedError(174, Q);

const destructuringParamsInArrowFn = () => createMappedError(175, Q);

const restParamsMustBeLastParam = () => createMappedError(176, Q);

const functionBodyInArrowFn = () => createMappedError(178, Q);

const unexpectedDoubleDot = () => createMappedError(179, Q);

const le = [ M, j, D, U, "this", "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", ";", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163760, 2163761, "of", "=>" ];

const ue = /*@__PURE__*/ Object.assign(createLookup(), {
    true: 8193,
    null: 8194,
    false: 8192,
    undefined: 8195,
    this: 12293,
    $this: 12292,
    $parent: 12295,
    in: 6562213,
    instanceof: 6562214,
    typeof: 139305,
    void: 139306,
    of: 4204594
});

const pe = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

const decompress = (e, s, t, n) => {
    const r = t.length;
    for (let i = 0; i < r; i += 2) {
        const r = t[i];
        let o = t[i + 1];
        o = o > 0 ? o : r + 1;
        if (e) {
            e.fill(n, r, o);
        }
        if (s) {
            for (let e = r; e < o; e++) {
                s.add(e);
            }
        }
    }
};

const returnToken = e => () => {
    nextChar();
    return e;
};

const fe = /*@__PURE__*/ (e => {
    decompress(e, null, pe.IdStart, 1);
    decompress(e, null, pe.Digit, 1);
    return e;
})(new Uint8Array(65535));

const xe = /*@__PURE__*/ (() => {
    const e = new Array(65535);
    e.fill(unexpectedCharacter, 0, 65535);
    decompress(e, null, pe.Skip, (() => {
        nextChar();
        return null;
    }));
    decompress(e, null, pe.IdStart, scanIdentifier);
    decompress(e, null, pe.Digit, (() => scanNumber(false)));
    e[34] = e[39] = () => scanString();
    e[96] = () => scanTemplate();
    e[33] = () => {
        if (nextChar() !== 61) {
            return 131119;
        }
        if (nextChar() !== 61) {
            return 6553950;
        }
        nextChar();
        return 6553952;
    };
    e[61] = () => {
        if (nextChar() === 62) {
            nextChar();
            return 51;
        }
        if (te !== 61) {
            return 4194350;
        }
        if (nextChar() !== 61) {
            return 6553949;
        }
        nextChar();
        return 6553951;
    };
    e[38] = () => {
        if (nextChar() !== 38) {
            return 6291480;
        }
        nextChar();
        return 6553884;
    };
    e[124] = () => {
        if (nextChar() !== 124) {
            return 6291481;
        }
        nextChar();
        return 6553819;
    };
    e[63] = () => {
        if (nextChar() === 46) {
            const e = $charCodeAt(W + 1);
            if (e <= 48 || e >= 57) {
                nextChar();
                return 2162701;
            }
            return 6291479;
        }
        if (te !== 63) {
            return 6291479;
        }
        nextChar();
        return 6553754;
    };
    e[46] = () => {
        if (nextChar() <= 57 && te >= 48) {
            return scanNumber(true);
        }
        if (te === 46) {
            if (nextChar() !== 46) {
                return 11;
            }
            nextChar();
            return 12;
        }
        return 65546;
    };
    e[60] = () => {
        if (nextChar() !== 61) {
            return 6554017;
        }
        nextChar();
        return 6554019;
    };
    e[62] = () => {
        if (nextChar() !== 61) {
            return 6554018;
        }
        nextChar();
        return 6554020;
    };
    e[37] = returnToken(6554156);
    e[40] = returnToken(2688008);
    e[41] = returnToken(7340047);
    e[42] = returnToken(6554155);
    e[43] = returnToken(2490855);
    e[44] = returnToken(6291472);
    e[45] = returnToken(2490856);
    e[47] = returnToken(6554157);
    e[58] = returnToken(6291477);
    e[59] = returnToken(6291478);
    e[91] = returnToken(2688019);
    e[93] = returnToken(7340052);
    e[123] = returnToken(524297);
    e[125] = returnToken(7340046);
    return e;
})();

export { AccessBoundaryExpression, AccessGlobalExpression, AccessKeyedExpression, AccessMemberExpression, AccessScopeExpression, AccessThisExpression, ArrayBindingPattern, ArrayLiteralExpression, ArrowFunction, AssignExpression, BinaryExpression, BindingBehaviorExpression, BindingIdentifier, CallFunctionExpression, CallGlobalExpression, CallMemberExpression, CallScopeExpression, ConditionalExpression, CustomExpression, DestructuringAssignmentExpression, DestructuringAssignmentRestExpression, DestructuringAssignmentSingleExpression, ExpressionParser, ForOfStatement, F as IExpressionParser, Interpolation, ObjectBindingPattern, ObjectLiteralExpression, PrimitiveLiteralExpression, TaggedTemplateExpression, TemplateExpression, UnaryExpression, Unparser, ValueConverterExpression, astVisit, parseExpression };

