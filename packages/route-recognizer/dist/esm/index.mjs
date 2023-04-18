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
    constructor(t, e) {
        this.route = t;
        this.params = e;
    }
}

class RecognizedRoute {
    constructor(t, e) {
        this.endpoint = t;
        this.params = e;
    }
}

class Candidate {
    constructor(t, e, s, n) {
        this.chars = t;
        this.states = e;
        this.skippedStates = s;
        this.result = n;
        this.head = e[e.length - 1];
        this.endpoint = this.head?.endpoint;
    }
    advance(t) {
        const {chars: e, states: s, skippedStates: n, result: i} = this;
        let r = null;
        let o = 0;
        const l = s[s.length - 1];
        function $process(a, c) {
            if (a.isMatch(t)) {
                if (++o === 1) {
                    r = a;
                } else {
                    i.add(new Candidate(e.concat(t), s.concat(a), c === null ? n : n.concat(c), i));
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
            i.remove(this);
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
        const n = {};
        for (const t of s.params) {
            n[t.name] = void 0;
        }
        for (let s = 0, i = t.length; s < i; ++s) {
            const i = t[s];
            if (i.isDynamic) {
                const t = i.segment.name;
                if (n[t] === void 0) {
                    n[t] = e[s];
                } else {
                    n[t] += e[s];
                }
            }
        }
        return n;
    }
    compareTo(t) {
        const e = this.states;
        const s = t.states;
        for (let t = 0, n = 0, i = Math.max(e.length, s.length); t < i; ++t) {
            let i = e[t];
            if (i === void 0) {
                return 1;
            }
            let r = s[n];
            if (r === void 0) {
                return -1;
            }
            let o = i.segment;
            let l = r.segment;
            if (o === null) {
                if (l === null) {
                    ++n;
                    continue;
                }
                if ((i = e[++t]) === void 0) {
                    return 1;
                }
                o = i.segment;
            } else if (l === null) {
                if ((r = s[++n]) === void 0) {
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
            ++n;
        }
        const n = this.skippedStates;
        const i = t.skippedStates;
        const r = n.length;
        const o = i.length;
        if (r < o) {
            return 1;
        }
        if (r > o) {
            return -1;
        }
        for (let t = 0; t < r; ++t) {
            const e = n[t];
            const s = i[t];
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
        let n;
        if (e instanceof Array) {
            for (const i of e) {
                n = this.$add(i, false).params;
                if (!s || (n[n.length - 1]?.isStar ?? false)) continue;
                this.$add({
                    ...i,
                    path: `${i.path}/*${t}`
                }, true);
            }
        } else {
            n = this.$add(e, false).params;
            if (s && !(n[n.length - 1]?.isStar ?? false)) {
                this.$add({
                    ...e,
                    path: `${e.path}/*${t}`
                }, true);
            }
        }
        this.cache.clear();
    }
    $add(e, s) {
        const n = e.path;
        const i = this.endpointLookup;
        if (i.has(n)) throw createError(`Cannot add duplicate path '${n}'.`);
        const r = new ConfigurableRoute(n, e.caseSensitive === true, e.handler);
        const o = n === "" ? [ "" ] : n.split("/").filter(isNotEmpty);
        const l = [];
        let a = this.rootState;
        for (const e of o) {
            a = a.append(null, "/");
            switch (e.charAt(0)) {
              case ":":
                {
                    const s = e.endsWith("?");
                    const n = s ? e.slice(1, -1) : e.slice(1);
                    if (n === t) throw new Error(`Invalid parameter name; usage of the reserved parameter name '${t}' is used.`);
                    l.push(new Parameter(n, s, false));
                    a = new DynamicSegment(n, s).appendTo(a);
                    break;
                }

              case "*":
                {
                    const n = e.slice(1);
                    let i;
                    if (n === t) {
                        if (!s) throw new Error(`Invalid parameter name; usage of the reserved parameter name '${t}' is used.`);
                        i = 1;
                    } else {
                        i = 2;
                    }
                    l.push(new Parameter(n, true, true));
                    a = new StarSegment(n, i).appendTo(a);
                    break;
                }

              default:
                {
                    a = new StaticSegment(e, r.caseSensitive).appendTo(a);
                    break;
                }
            }
        }
        const c = new Endpoint(r, l);
        a.setEndpoint(c);
        i.set(n, c);
        return c;
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
        for (let s = 0, n = t.length; s < n; ++s) {
            const n = t.charAt(s);
            e.advance(n);
            if (e.isEmpty) {
                return null;
            }
        }
        const s = e.getSolution();
        if (s === null) {
            return null;
        }
        const {endpoint: n} = s;
        const i = s.getParams();
        return new RecognizedRoute(n, i);
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
        let n = this.nextStates;
        if (n === null) {
            s = void 0;
            n = this.nextStates = [];
        } else if (t === null) {
            s = n.find((t => t.value === e));
        } else {
            s = n.find((e => e.segment?.equals(t)));
        }
        if (s === void 0) {
            n.push(s = new State(this, t, e));
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
            for (let n = 0; n < s; ++n) {
                t = t.append(this, e.charAt(n));
            }
        } else {
            for (let n = 0; n < s; ++n) {
                const s = e.charAt(n);
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

export { ConfigurableRoute, Endpoint, Parameter, t as RESIDUE, RecognizedRoute, RouteRecognizer };
//# sourceMappingURL=index.mjs.map
