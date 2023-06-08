"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

class Parameter {
    constructor(t, e, s) {
        this.name = t;
        this.isOptional = e;
        this.isStar = s;
    }
}

class ConfigurableRoute {
    constructor(t, e, s) {
        this.path = t;
        this.caseSensitive = e;
        this.handler = s;
    }
}

class Endpoint {
    get residualEndpoint() {
        return this.t;
    }
    set residualEndpoint(t) {
        if (this.t !== null) throw new Error("Residual endpoint is already set");
        this.t = t;
    }
    constructor(t, e) {
        this.route = t;
        this.params = e;
        this.t = null;
    }
    equalsOrResidual(t) {
        return t != null && this === t || this.t === t;
    }
}

class RecognizedRoute {
    constructor(t, e) {
        this.endpoint = t;
        this.params = e;
    }
}

class Candidate {
    constructor(t, e, s, i) {
        this.chars = t;
        this.states = e;
        this.skippedStates = s;
        this.result = i;
        this.head = e[e.length - 1];
        this.endpoint = this.head?.endpoint;
    }
    advance(t) {
        const {chars: e, states: s, skippedStates: i, result: n} = this;
        let r = null;
        let o = 0;
        const l = s[s.length - 1];
        function $process(a, u) {
            if (a.isMatch(t)) {
                if (++o === 1) {
                    r = a;
                } else {
                    n.add(new Candidate(e.concat(t), s.concat(a), u === null ? i : i.concat(u), n));
                }
            }
            if (l.segment === null && a.isOptional && a.nextStates !== null) {
                if (a.nextStates.length > 1) {
                    throw createError(`${a.nextStates.length} nextStates`);
                }
                const t = a.nextStates[0];
                if (!t.isSeparator) {
                    throw createError(`Not a separator`);
                }
                if (t.nextStates !== null) {
                    for (const e of t.nextStates) {
                        $process(e, a);
                    }
                }
            }
        }
        if (l.isDynamic) {
            $process(l, null);
        }
        if (l.nextStates !== null) {
            for (const t of l.nextStates) {
                $process(t, null);
            }
        }
        if (r !== null) {
            s.push(this.head = r);
            e.push(t);
            if (r.endpoint !== null) {
                this.endpoint = r.endpoint;
            }
        }
        if (o === 0) {
            n.remove(this);
        }
    }
    finalize() {
        function collectSkippedStates(t, e) {
            const s = e.nextStates;
            if (s !== null) {
                if (s.length === 1 && s[0].segment === null) {
                    collectSkippedStates(t, s[0]);
                } else {
                    for (const e of s) {
                        if (e.isOptional && e.endpoint !== null) {
                            t.push(e);
                            if (e.nextStates !== null) {
                                for (const s of e.nextStates) {
                                    collectSkippedStates(t, s);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        collectSkippedStates(this.skippedStates, this.head);
    }
    getParams() {
        const {states: t, chars: e, endpoint: s} = this;
        const i = {};
        for (const t of s.params) {
            i[t.name] = void 0;
        }
        for (let s = 0, n = t.length; s < n; ++s) {
            const n = t[s];
            if (n.isDynamic) {
                const t = n.segment.name;
                if (i[t] === void 0) {
                    i[t] = e[s];
                } else {
                    i[t] += e[s];
                }
            }
        }
        return i;
    }
    compareTo(t) {
        const e = this.states;
        const s = t.states;
        for (let t = 0, i = 0, n = Math.max(e.length, s.length); t < n; ++t) {
            let n = e[t];
            if (n === void 0) {
                return 1;
            }
            let r = s[i];
            if (r === void 0) {
                return -1;
            }
            let o = n.segment;
            let l = r.segment;
            if (o === null) {
                if (l === null) {
                    ++i;
                    continue;
                }
                if ((n = e[++t]) === void 0) {
                    return 1;
                }
                o = n.segment;
            } else if (l === null) {
                if ((r = s[++i]) === void 0) {
                    return -1;
                }
                l = r.segment;
            }
            if (o.kind < l.kind) {
                return 1;
            }
            if (o.kind > l.kind) {
                return -1;
            }
            ++i;
        }
        const i = this.skippedStates;
        const n = t.skippedStates;
        const r = i.length;
        const o = n.length;
        if (r < o) {
            return 1;
        }
        if (r > o) {
            return -1;
        }
        for (let t = 0; t < r; ++t) {
            const e = i[t];
            const s = n[t];
            if (e.length < s.length) {
                return 1;
            }
            if (e.length > s.length) {
                return -1;
            }
        }
        return 0;
    }
}

function hasEndpoint(t) {
    return t.head.endpoint !== null;
}

function compareChains(t, e) {
    return t.compareTo(e);
}

class RecognizeResult {
    get isEmpty() {
        return this.candidates.length === 0;
    }
    constructor(t) {
        this.candidates = [];
        this.candidates = [ new Candidate([ "" ], [ t ], [], this) ];
    }
    getSolution() {
        const t = this.candidates.filter(hasEndpoint);
        if (t.length === 0) {
            return null;
        }
        for (const e of t) {
            e.finalize();
        }
        t.sort(compareChains);
        return t[0];
    }
    add(t) {
        this.candidates.push(t);
    }
    remove(t) {
        this.candidates.splice(this.candidates.indexOf(t), 1);
    }
    advance(t) {
        const e = this.candidates.slice();
        for (const s of e) {
            s.advance(t);
        }
    }
}

const t = "$$residue";

class RouteRecognizer {
    constructor() {
        this.rootState = new State(null, null, "");
        this.cache = new Map;
        this.endpointLookup = new Map;
    }
    add(e, s = false) {
        let i;
        let n;
        if (e instanceof Array) {
            for (const r of e) {
                n = this.$add(r, false);
                i = n.params;
                if (!s || (i[i.length - 1]?.isStar ?? false)) continue;
                n.residualEndpoint = this.$add({
                    ...r,
                    path: `${r.path}/*${t}`
                }, true);
            }
        } else {
            n = this.$add(e, false);
            i = n.params;
            if (s && !(i[i.length - 1]?.isStar ?? false)) {
                n.residualEndpoint = this.$add({
                    ...e,
                    path: `${e.path}/*${t}`
                }, true);
            }
        }
        this.cache.clear();
    }
    $add(e, s) {
        const i = e.path;
        const n = this.endpointLookup;
        if (n.has(i)) throw createError(`Cannot add duplicate path '${i}'.`);
        const r = new ConfigurableRoute(i, e.caseSensitive === true, e.handler);
        const o = i === "" ? [ "" ] : i.split("/").filter(isNotEmpty);
        const l = [];
        let a = this.rootState;
        for (const e of o) {
            a = a.append(null, "/");
            switch (e.charAt(0)) {
              case ":":
                {
                    const s = e.endsWith("?");
                    const i = s ? e.slice(1, -1) : e.slice(1);
                    if (i === t) throw new Error(`Invalid parameter name; usage of the reserved parameter name '${t}' is used.`);
                    l.push(new Parameter(i, s, false));
                    a = new DynamicSegment(i, s).appendTo(a);
                    break;
                }

              case "*":
                {
                    const i = e.slice(1);
                    let n;
                    if (i === t) {
                        if (!s) throw new Error(`Invalid parameter name; usage of the reserved parameter name '${t}' is used.`);
                        n = 1;
                    } else {
                        n = 2;
                    }
                    l.push(new Parameter(i, true, true));
                    a = new StarSegment(i, n).appendTo(a);
                    break;
                }

              default:
                {
                    a = new StaticSegment(e, r.caseSensitive).appendTo(a);
                    break;
                }
            }
        }
        const u = new Endpoint(r, l);
        a.setEndpoint(u);
        n.set(i, u);
        return u;
    }
    recognize(t) {
        let e = this.cache.get(t);
        if (e === void 0) {
            this.cache.set(t, e = this.$recognize(t));
        }
        return e;
    }
    $recognize(t) {
        t = decodeURI(t);
        if (!t.startsWith("/")) {
            t = `/${t}`;
        }
        if (t.length > 1 && t.endsWith("/")) {
            t = t.slice(0, -1);
        }
        const e = new RecognizeResult(this.rootState);
        for (let s = 0, i = t.length; s < i; ++s) {
            const i = t.charAt(s);
            e.advance(i);
            if (e.isEmpty) {
                return null;
            }
        }
        const s = e.getSolution();
        if (s === null) {
            return null;
        }
        const {endpoint: i} = s;
        const n = s.getParams();
        return new RecognizedRoute(i, n);
    }
    getEndpoint(t) {
        return this.endpointLookup.get(t) ?? null;
    }
}

class State {
    constructor(t, e, s) {
        this.prevState = t;
        this.segment = e;
        this.value = s;
        this.nextStates = null;
        this.endpoint = null;
        switch (e?.kind) {
          case 3:
            this.length = t.length + 1;
            this.isSeparator = false;
            this.isDynamic = true;
            this.isOptional = e.optional;
            break;

          case 2:
          case 1:
            this.length = t.length + 1;
            this.isSeparator = false;
            this.isDynamic = true;
            this.isOptional = false;
            break;

          case 4:
            this.length = t.length + 1;
            this.isSeparator = false;
            this.isDynamic = false;
            this.isOptional = false;
            break;

          case undefined:
            this.length = t === null ? 0 : t.length;
            this.isSeparator = true;
            this.isDynamic = false;
            this.isOptional = false;
            break;
        }
    }
    append(t, e) {
        let s;
        let i = this.nextStates;
        if (i === null) {
            s = void 0;
            i = this.nextStates = [];
        } else if (t === null) {
            s = i.find((t => t.value === e));
        } else {
            s = i.find((e => e.segment?.equals(t)));
        }
        if (s === void 0) {
            i.push(s = new State(this, t, e));
        }
        return s;
    }
    setEndpoint(t) {
        if (this.endpoint !== null) {
            throw createError(`Cannot add ambiguous route. The pattern '${t.route.path}' clashes with '${this.endpoint.route.path}'`);
        }
        this.endpoint = t;
        if (this.isOptional) {
            this.prevState.setEndpoint(t);
            if (this.prevState.isSeparator && this.prevState.prevState !== null) {
                this.prevState.prevState.setEndpoint(t);
            }
        }
    }
    isMatch(t) {
        const e = this.segment;
        switch (e?.kind) {
          case 3:
            return !this.value.includes(t);

          case 2:
          case 1:
            return true;

          case 4:
          case undefined:
            return this.value.includes(t);
        }
    }
}

function isNotEmpty(t) {
    return t.length > 0;
}

class StaticSegment {
    get kind() {
        return 4;
    }
    constructor(t, e) {
        this.value = t;
        this.caseSensitive = e;
    }
    appendTo(t) {
        const {value: e, value: {length: s}} = this;
        if (this.caseSensitive) {
            for (let i = 0; i < s; ++i) {
                t = t.append(this, e.charAt(i));
            }
        } else {
            for (let i = 0; i < s; ++i) {
                const s = e.charAt(i);
                t = t.append(this, s.toUpperCase() + s.toLowerCase());
            }
        }
        return t;
    }
    equals(t) {
        return t.kind === 4 && t.caseSensitive === this.caseSensitive && t.value === this.value;
    }
}

class DynamicSegment {
    get kind() {
        return 3;
    }
    constructor(t, e) {
        this.name = t;
        this.optional = e;
    }
    appendTo(t) {
        t = t.append(this, "/");
        return t;
    }
    equals(t) {
        return t.kind === 3 && t.optional === this.optional && t.name === this.name;
    }
}

class StarSegment {
    constructor(t, e) {
        this.name = t;
        this.kind = e;
    }
    appendTo(t) {
        t = t.append(this, "");
        return t;
    }
    equals(t) {
        return (t.kind === 2 || t.kind === 1) && t.name === this.name;
    }
}

const createError = t => new Error(t);

exports.ConfigurableRoute = ConfigurableRoute;

exports.Endpoint = Endpoint;

exports.Parameter = Parameter;

exports.RESIDUE = t;

exports.RecognizedRoute = RecognizedRoute;

exports.RouteRecognizer = RouteRecognizer;
//# sourceMappingURL=index.cjs.map
