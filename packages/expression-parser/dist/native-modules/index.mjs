import { emptyArray as e, DI as s } from "../../../kernel/dist/native-modules/index.mjs";

const t = "AccessThis";

const r = "AccessBoundary";

const n = "AccessGlobal";

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

const C = "BindingBehavior";

const T = "ArrayBindingPattern";

const v = "ObjectBindingPattern";

const y = "BindingIdentifier";

const L = "ForOfStatement";

const P = "Interpolation";

const I = "ArrayDestructuring";

const S = "ObjectDestructuring";

const B = "DestructuringAssignmentLeaf";

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
        this.$kind = C;
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
        this.$kind = n;
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
        this.$kind = r;
    }
}

class AccessScopeExpression {
    constructor(e, s = 0) {
        this.name = e;
        this.ancestor = s;
        this.$kind = i;
    }
}

const isAccessGlobal = e => e.$kind === n || (e.$kind === w || e.$kind === E) && e.accessGlobal;

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
    constructor(e, s, t = 0, r = false) {
        this.name = e;
        this.args = s;
        this.ancestor = t;
        this.optional = r;
        this.$kind = u;
    }
}

class CallMemberExpression {
    constructor(e, s, t, r = false, n = false) {
        this.object = e;
        this.name = s;
        this.args = t;
        this.optionalMember = r;
        this.optionalCall = n;
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
    constructor(s, t, r, n = e) {
        this.cooked = s;
        this.func = r;
        this.expressions = n;
        this.$kind = d;
        s.raw = t;
    }
}

class ArrayBindingPattern {
    constructor(e) {
        this.elements = e;
        this.$kind = T;
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
    constructor(e, s, t, r) {
        this.$kind = e;
        this.list = s;
        this.source = t;
        this.initializer = r;
    }
}

class DestructuringAssignmentSingleExpression {
    constructor(e, s, t) {
        this.target = e;
        this.source = s;
        this.initializer = t;
        this.$kind = B;
    }
}

class DestructuringAssignmentRestExpression {
    constructor(e, s) {
        this.target = e;
        this.indexOrProperties = s;
        this.$kind = B;
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

      case r:
        return s.visitAccessBoundary(e);

      case T:
        return s.visitArrayBindingPattern(e);

      case I:
        return s.visitDestructuringAssignmentExpression(e);

      case o:
        return s.visitArrayLiteral(e);

      case A:
        return s.visitArrowFunction(e);

      case b:
        return s.visitAssign(e);

      case m:
        return s.visitBinary(e);

      case C:
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

      case B:
        return s.visitDestructuringAssignmentSingleExpression(e);

      case L:
        return s.visitForOfStatement(e);

      case P:
        return s.visitInterpolation(e);

      case v:
        return s.visitObjectBindingPattern(e);

      case S:
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
        let r = 0;
        let n = "(";
        let i;
        for (;r < t; ++r) {
            i = s[r].name;
            if (r > 0) {
                n += ", ";
            }
            if (r < t - 1) {
                n += i;
            } else {
                n += e.rest ? `...${i}` : i;
            }
        }
        this.text += `${n}) => `;
        astVisit(e.body, this);
    }
    visitObjectLiteral(e) {
        const s = e.keys;
        const t = e.values;
        this.text += "{";
        for (let e = 0, r = s.length; e < r; ++e) {
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
        const r = t.length;
        this.text += "`";
        this.text += s[0];
        for (let e = 0; e < r; e++) {
            astVisit(t[e], this);
            this.text += s[e + 1];
        }
        this.text += "`";
    }
    visitTaggedTemplate(e) {
        const {cooked: s, expressions: t} = e;
        const r = t.length;
        astVisit(e.func, this);
        this.text += "`";
        this.text += s[0];
        for (let e = 0; e < r; e++) {
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
        for (let e = 0, r = s.length; e < r; ++e) {
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
        const r = t.length;
        this.text += "${";
        this.text += s[0];
        for (let e = 0; e < r; e++) {
            astVisit(t[e], this);
            this.text += s[e + 1];
        }
        this.text += "}";
    }
    visitDestructuringAssignmentExpression(e) {
        const s = e.$kind;
        const t = s === S;
        this.text += t ? "{" : "[";
        const r = e.list;
        const n = r.length;
        let i;
        let o;
        for (i = 0; i < n; i++) {
            o = r[i];
            switch (o.$kind) {
              case B:
                astVisit(o, this);
                break;

              case I:
              case S:
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
        re = true;
        ne = false;
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

let re = true;

let ne = false;

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
    re = true;
    ne = false;
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
    re = 513 > e;
    ne = false;
    ie = 514 > e;
    let r = false;
    let o = void 0;
    let a = 0;
    if (ee & 131072) {
        const e = le[ee & 63];
        nextToken();
        o = new UnaryExpression(e, parse(514, s));
        re = false;
    } else {
        e: switch (ee) {
          case 12295:
            a = Y;
            re = false;
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
                    ne = true;
                    nextToken();
                    if ((ee & 12288) === 0) {
                        o = a === 0 ? K : a === 1 ? N : new AccessThisExpression(a);
                        r = true;
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
                re = !ne;
                nextToken();
                if (consumeOpt(51)) {
                    if (ee === 524297) {
                        throw functionBodyInArrowFn();
                    }
                    const s = ne;
                    const t = Y;
                    ++Y;
                    const r = parse(62, G);
                    ne = s;
                    Y = t;
                    re = false;
                    o = new ArrowFunction([ new BindingIdentifier(e) ], r);
                }
                break;
            }

          case 11:
            throw unexpectedDoubleDot();

          case 12:
            throw invalidSpreadOp();

          case 12292:
            re = false;
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
            re = false;
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
            re = false;
            nextToken();
            break;

          case 2163761:
            o = parseTemplate(s, o, false);
            break;

          case 16384:
          case 32768:
            o = new PrimitiveLiteralExpression(se);
            re = false;
            nextToken();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            o = le[ee & 63];
            re = false;
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
                ne = true;
                re = false;
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
                re = !ne;
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
                o = new CallFunctionExpression(o, parseArguments(), r);
                break;

              case 2688019:
                o = parseKeyedExpression(o, r);
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
                } else if (o.$kind === n) {
                    o = new CallGlobalExpression(o.name, parseArguments());
                } else {
                    o = new CallFunctionExpression(o, parseArguments(), false);
                }
                break;

              case 2688019:
                o = parseKeyedExpression(o, false);
                break;

              case 2163760:
                if (ne) {
                    throw invalidTaggedTemplateOnOptionalChain();
                }
                o = createTemplateTail(o);
                break;

              case 2163761:
                if (ne) {
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
        re = false;
    }
    if (63 < e) {
        return o;
    }
    if (consumeOpt(6291479)) {
        const e = parse(62, s);
        consume(6291477);
        o = new ConditionalExpression(o, e, parse(62, s));
        re = false;
    }
    if (62 < e) {
        return o;
    }
    if (consumeOpt(4194350)) {
        if (!re) {
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
    const s = new DestructuringAssignmentExpression(I, e, void 0, void 0);
    let t = "";
    let r = true;
    let n = 0;
    while (r) {
        nextToken();
        switch (ee) {
          case 7340052:
            r = false;
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
            e.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(K, t), new AccessKeyedExpression(K, new PrimitiveLiteralExpression(n++)), void 0));
            t = "";
        } else {
            n++;
        }
    }
}

function parseArguments() {
    const e = ne;
    nextToken();
    const s = [];
    while (ee !== 7340047) {
        s.push(parse(62, G));
        if (!consumeOpt(6291472)) {
            break;
        }
    }
    consume(7340047);
    re = false;
    ne = e;
    return s;
}

function parseKeyedExpression(e, s) {
    const t = ne;
    nextToken();
    e = new AccessKeyedExpression(e, parse(62, G), s);
    consume(7340052);
    re = !t;
    ne = t;
    return e;
}

function parseOptionalChainLHS(e) {
    ne = true;
    re = false;
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
            ne = true;
            re = false;
            const r = W;
            const n = Z;
            const i = ee;
            const o = te;
            const a = se;
            const c = re;
            const h = ne;
            nextToken();
            if ((ee & 13312) === 0) {
                throw unexpectedTokenInOptionalChain();
            }
            if (ee === 2688008) {
                return new CallMemberExpression(e, t, parseArguments(), s, true);
            }
            W = r;
            Z = n;
            ee = i;
            te = o;
            se = a;
            re = c;
            ne = h;
            return new AccessMemberExpression(e, t, s);
        }

      case 2688008:
        {
            re = false;
            return new CallMemberExpression(e, t, parseArguments(), s, false);
        }

      default:
        {
            re = !ne;
            nextToken();
            return new AccessMemberExpression(e, t, s);
        }
    }
}

function parseCoverParenthesizedExpressionAndArrowParameterList(e) {
    nextToken();
    const s = W;
    const t = Z;
    const r = ee;
    const n = te;
    const i = se;
    const o = re;
    const a = ne;
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
            const e = ne;
            const s = Y;
            ++Y;
            const t = parse(62, G);
            ne = e;
            Y = s;
            re = false;
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
            const e = ne;
            const s = Y;
            ++Y;
            const t = parse(62, G);
            ne = e;
            Y = s;
            re = false;
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
    ee = r;
    te = n;
    se = i;
    re = o;
    ne = a;
    const u = ne;
    const p = parse(62, e);
    ne = u;
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
    const s = ne;
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
    ne = s;
    consume(7340052);
    if (e === V) {
        return new ArrayBindingPattern(t);
    } else {
        re = false;
        return new ArrayLiteralExpression(t);
    }
}

const he = [ T, v, y, I, S ];

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
    const s = ne;
    const t = new Array;
    const r = new Array;
    nextToken();
    while (ee !== 7340046) {
        t.push(se);
        if (ee & 49152) {
            nextToken();
            consume(6291477);
            r.push(parse(62, e === V ? G : e));
        } else if (ee & 12288) {
            const s = te;
            const t = ee;
            const n = W;
            nextToken();
            if (consumeOpt(6291477)) {
                r.push(parse(62, e === V ? G : e));
            } else {
                te = s;
                ee = t;
                W = n;
                r.push(parse(515, e === V ? G : e));
            }
        } else {
            throw invalidPropDefInObjLiteral();
        }
        if (ee !== 7340046) {
            consume(6291472);
        }
    }
    ne = s;
    consume(7340046);
    if (e === V) {
        return new ObjectBindingPattern(t, r);
    } else {
        re = false;
        return new ObjectLiteralExpression(t, r);
    }
}

function parseInterpolation() {
    const e = [];
    const s = [];
    const t = X;
    let r = "";
    while (W < t) {
        switch (te) {
          case 36:
            if ($charCodeAt(W + 1) === 123) {
                e.push(r);
                r = "";
                W += 2;
                te = $charCodeAt(W);
                nextToken();
                const t = parse(61, H);
                s.push(t);
                continue;
            } else {
                r += "$";
            }
            break;

          case 92:
            r += ae(unescapeCode(nextChar()));
            break;

          default:
            r += ae(te);
        }
        nextChar();
    }
    if (s.length) {
        e.push(r);
        return new Interpolation(e, s);
    }
    return null;
}

function parseTemplate(e, s, t) {
    const r = ne;
    const n = [ se ];
    consume(2163761);
    const i = [ parse(62, e) ];
    while ((ee = scanTemplateTail()) !== 2163760) {
        n.push(se);
        consume(2163761);
        i.push(parse(62, e));
    }
    n.push(se);
    re = false;
    ne = r;
    if (t) {
        nextToken();
        return new TaggedTemplateExpression(n, n, s, i);
    } else {
        nextToken();
        return new TemplateExpression(n, i);
    }
}

function createTemplateTail(e) {
    re = false;
    const s = [ se ];
    nextToken();
    return new TaggedTemplateExpression(s, s, e);
}

function nextToken() {
    while (W < X) {
        Z = W;
        if ((ee = pe[te]()) != null) {
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
    let r = W;
    while (te !== e) {
        if (te === 92) {
            t.push(Q.slice(r, W));
            nextChar();
            s = unescapeCode(te);
            nextChar();
            t.push(ae(s));
            r = W;
        } else if (W >= X) {
            throw unterminatedStringLiteral();
        } else {
            nextChar();
        }
    }
    const n = Q.slice(r, W);
    nextChar();
    t.push(n);
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

const {CharScanners: pe, IdParts: fe} = /*@__PURE__*/ (() => {
    const unexpectedCharacter = () => {
        throw createMappedError(168, Q);
    };
    unexpectedCharacter.notMapped = true;
    const e = {
        AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
        IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
        Digit: [ 48, 58 ],
        Skip: [ 0, 33, 127, 161 ]
    };
    const decompress = (e, s, t, r) => {
        const n = t.length;
        for (let i = 0; i < n; i += 2) {
            const n = t[i];
            let o = t[i + 1];
            o = o > 0 ? o : n + 1;
            if (e) {
                e.fill(r, n, o);
            }
            if (s) {
                for (let e = n; e < o; e++) {
                    s.add(e);
                }
            }
        }
    };
    const s = /*@__PURE__*/ (s => {
        decompress(s, null, e.IdStart, 1);
        decompress(s, null, e.Digit, 1);
        return s;
    })(new Uint8Array(65535));
    const returnToken = e => () => {
        nextChar();
        return e;
    };
    const t = new Array(65535);
    t.fill(unexpectedCharacter, 0, 65535);
    decompress(t, null, e.Skip, (() => {
        nextChar();
        return null;
    }));
    decompress(t, null, e.IdStart, scanIdentifier);
    decompress(t, null, e.Digit, (() => scanNumber(false)));
    t[34] = t[39] = () => scanString();
    t[96] = () => scanTemplate();
    t[33] = () => {
        if (nextChar() !== 61) {
            return 131119;
        }
        if (nextChar() !== 61) {
            return 6553950;
        }
        nextChar();
        return 6553952;
    };
    t[61] = () => {
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
    t[38] = () => {
        if (nextChar() !== 38) {
            return 6291480;
        }
        nextChar();
        return 6553884;
    };
    t[124] = () => {
        if (nextChar() !== 124) {
            return 6291481;
        }
        nextChar();
        return 6553819;
    };
    t[63] = () => {
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
    t[46] = () => {
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
    t[60] = () => {
        if (nextChar() !== 61) {
            return 6554017;
        }
        nextChar();
        return 6554019;
    };
    t[62] = () => {
        if (nextChar() !== 61) {
            return 6554018;
        }
        nextChar();
        return 6554020;
    };
    t[37] = returnToken(6554156);
    t[40] = returnToken(2688008);
    t[41] = returnToken(7340047);
    t[42] = returnToken(6554155);
    t[43] = returnToken(2490855);
    t[44] = returnToken(6291472);
    t[45] = returnToken(2490856);
    t[47] = returnToken(6554157);
    t[58] = returnToken(6291477);
    t[59] = returnToken(6291478);
    t[91] = returnToken(2688019);
    t[93] = returnToken(7340052);
    t[123] = returnToken(524297);
    t[125] = returnToken(7340046);
    return {
        CharScanners: t,
        IdParts: s
    };
})();

export { AccessBoundaryExpression, AccessGlobalExpression, AccessKeyedExpression, AccessMemberExpression, AccessScopeExpression, AccessThisExpression, ArrayBindingPattern, ArrayLiteralExpression, ArrowFunction, AssignExpression, BinaryExpression, BindingBehaviorExpression, BindingIdentifier, CallFunctionExpression, CallGlobalExpression, CallMemberExpression, CallScopeExpression, ConditionalExpression, CustomExpression, DestructuringAssignmentExpression, DestructuringAssignmentRestExpression, DestructuringAssignmentSingleExpression, ExpressionParser, ForOfStatement, F as IExpressionParser, Interpolation, ObjectBindingPattern, ObjectLiteralExpression, PrimitiveLiteralExpression, TaggedTemplateExpression, TemplateExpression, UnaryExpression, Unparser, ValueConverterExpression, astVisit, parseExpression };

