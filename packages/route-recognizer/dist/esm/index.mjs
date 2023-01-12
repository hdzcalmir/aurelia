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
        const {chars: e, states: s, skippedStates: n, result: r} = this;
        let o = null;
        let l = 0;
        const a = s[s.length - 1];
        function u(c, h) {
            if (c.isMatch(t)) if (1 === ++l) o = c; else r.add(new Candidate(e.concat(t), s.concat(c), null === h ? n : n.concat(h), r));
            if (null === a.segment && c.isOptional && null !== c.nextStates) {
                if (c.nextStates.length > 1) throw i(`${c.nextStates.length} nextStates`);
                const t = c.nextStates[0];
                if (!t.isSeparator) throw i(`Not a separator`);
                if (null !== t.nextStates) for (const e of t.nextStates) u(e, c);
            }
        }
        if (a.isDynamic) u(a, null);
        if (null !== a.nextStates) for (const t of a.nextStates) u(t, null);
        if (null !== o) {
            s.push(this.head = o);
            e.push(t);
            if (null !== o.endpoint) this.endpoint = o.endpoint;
        }
        if (0 === l) r.remove(this);
    }
    finalize() {
        function t(e, s) {
            const n = s.nextStates;
            if (null !== n) if (1 === n.length && null === n[0].segment) t(e, n[0]); else for (const s of n) if (s.isOptional && null !== s.endpoint) {
                e.push(s);
                if (null !== s.nextStates) for (const n of s.nextStates) t(e, n);
                break;
            }
        }
        t(this.skippedStates, this.head);
    }
    getParams() {
        const {states: t, chars: e, endpoint: s} = this;
        const n = {};
        for (const t of s.params) n[t.name] = void 0;
        for (let s = 0, i = t.length; s < i; ++s) {
            const i = t[s];
            if (i.isDynamic) {
                const t = i.segment.name;
                if (void 0 === n[t]) n[t] = e[s]; else n[t] += e[s];
            }
        }
        return n;
    }
    compareTo(t) {
        const e = this.states;
        const s = t.states;
        for (let t = 0, n = 0, i = Math.max(e.length, s.length); t < i; ++t) {
            let i = e[t];
            if (void 0 === i) return 1;
            let r = s[n];
            if (void 0 === r) return -1;
            let o = i.segment;
            let l = r.segment;
            if (null === o) {
                if (null === l) {
                    ++n;
                    continue;
                }
                if (void 0 === (i = e[++t])) return 1;
                o = i.segment;
            } else if (null === l) {
                if (void 0 === (r = s[++n])) return -1;
                l = r.segment;
            }
            if (o.kind < l.kind) return 1;
            if (o.kind > l.kind) return -1;
            ++n;
        }
        const n = this.skippedStates;
        const i = t.skippedStates;
        const r = n.length;
        const o = i.length;
        if (r < o) return 1;
        if (r > o) return -1;
        for (let t = 0; t < r; ++t) {
            const e = n[t];
            const s = i[t];
            if (e.length < s.length) return 1;
            if (e.length > s.length) return -1;
        }
        return 0;
    }
}

function t(t) {
    return null !== t.head.endpoint;
}

function e(t, e) {
    return t.compareTo(e);
}

class RecognizeResult {
    constructor(t) {
        this.candidates = [];
        this.candidates = [ new Candidate([ "" ], [ t ], [], this) ];
    }
    get isEmpty() {
        return 0 === this.candidates.length;
    }
    getSolution() {
        const s = this.candidates.filter(t);
        if (0 === s.length) return null;
        for (const t of s) t.finalize();
        s.sort(e);
        return s[0];
    }
    add(t) {
        this.candidates.push(t);
    }
    remove(t) {
        this.candidates.splice(this.candidates.indexOf(t), 1);
    }
    advance(t) {
        const e = this.candidates.slice();
        for (const s of e) s.advance(t);
    }
}

const s = "$$residue";

class RouteRecognizer {
    constructor() {
        this.rootState = new State(null, null, "");
        this.cache = new Map;
        this.endpointLookup = new Map;
    }
    add(t, e = false) {
        let n;
        if (t instanceof Array) for (const i of t) {
            n = this.$add(i, false).params;
            if (!e || (n[n.length - 1]?.isStar ?? false)) continue;
            this.$add({
                ...i,
                path: `${i.path}/*${s}`
            }, true);
        } else {
            n = this.$add(t, false).params;
            if (e && !(n[n.length - 1]?.isStar ?? false)) this.$add({
                ...t,
                path: `${t.path}/*${s}`
            }, true);
        }
        this.cache.clear();
    }
    $add(t, e) {
        const r = t.path;
        const o = this.endpointLookup;
        if (o.has(r)) throw i(`Cannot add duplicate path '${r}'.`);
        const l = new ConfigurableRoute(r, true === t.caseSensitive, t.handler);
        const a = "" === r ? [ "" ] : r.split("/").filter(n);
        const u = [];
        let c = this.rootState;
        for (const t of a) {
            c = c.append(null, "/");
            switch (t.charAt(0)) {
              case ":":
                {
                    const e = t.endsWith("?");
                    const n = e ? t.slice(1, -1) : t.slice(1);
                    if (n === s) throw new Error(`Invalid parameter name; usage of the reserved parameter name '${s}' is used.`);
                    u.push(new Parameter(n, e, false));
                    c = new DynamicSegment(n, e).appendTo(c);
                    break;
                }

              case "*":
                {
                    const n = t.slice(1);
                    let i;
                    if (n === s) {
                        if (!e) throw new Error(`Invalid parameter name; usage of the reserved parameter name '${s}' is used.`);
                        i = 1;
                    } else i = 2;
                    u.push(new Parameter(n, true, true));
                    c = new StarSegment(n, i).appendTo(c);
                    break;
                }

              default:
                c = new StaticSegment(t, l.caseSensitive).appendTo(c);
                break;
            }
        }
        const h = new Endpoint(l, u);
        c.setEndpoint(h);
        o.set(r, h);
        return h;
    }
    recognize(t) {
        let e = this.cache.get(t);
        if (void 0 === e) this.cache.set(t, e = this.$recognize(t));
        return e;
    }
    $recognize(t) {
        t = decodeURI(t);
        if (!t.startsWith("/")) t = `/${t}`;
        if (t.length > 1 && t.endsWith("/")) t = t.slice(0, -1);
        const e = new RecognizeResult(this.rootState);
        for (let s = 0, n = t.length; s < n; ++s) {
            const n = t.charAt(s);
            e.advance(n);
            if (e.isEmpty) return null;
        }
        const s = e.getSolution();
        if (null === s) return null;
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

          case void 0:
            this.length = null === t ? 0 : t.length;
            this.isSeparator = true;
            this.isDynamic = false;
            this.isOptional = false;
            break;
        }
    }
    append(t, e) {
        let s;
        let n = this.nextStates;
        if (null === n) {
            s = void 0;
            n = this.nextStates = [];
        } else if (null === t) s = n.find((t => t.value === e)); else s = n.find((e => e.segment?.equals(t)));
        if (void 0 === s) n.push(s = new State(this, t, e));
        return s;
    }
    setEndpoint(t) {
        if (null !== this.endpoint) throw i(`Cannot add ambiguous route. The pattern '${t.route.path}' clashes with '${this.endpoint.route.path}'`);
        this.endpoint = t;
        if (this.isOptional) {
            this.prevState.setEndpoint(t);
            if (this.prevState.isSeparator && null !== this.prevState.prevState) this.prevState.prevState.setEndpoint(t);
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
          case void 0:
            return this.value.includes(t);
        }
    }
}

function n(t) {
    return t.length > 0;
}

class StaticSegment {
    constructor(t, e) {
        this.value = t;
        this.caseSensitive = e;
    }
    get kind() {
        return 4;
    }
    appendTo(t) {
        const {value: e, value: {length: s}} = this;
        if (this.caseSensitive) for (let n = 0; n < s; ++n) t = t.append(this, e.charAt(n)); else for (let n = 0; n < s; ++n) {
            const s = e.charAt(n);
            t = t.append(this, s.toUpperCase() + s.toLowerCase());
        }
        return t;
    }
    equals(t) {
        return 4 === t.kind && t.caseSensitive === this.caseSensitive && t.value === this.value;
    }
}

class DynamicSegment {
    constructor(t, e) {
        this.name = t;
        this.optional = e;
    }
    get kind() {
        return 3;
    }
    appendTo(t) {
        t = t.append(this, "/");
        return t;
    }
    equals(t) {
        return 3 === t.kind && t.optional === this.optional && t.name === this.name;
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
        return (2 === t.kind || 1 === t.kind) && t.name === this.name;
    }
}

const i = t => new Error(t);

export { ConfigurableRoute, Endpoint, Parameter, s as RESIDUE, RecognizedRoute, RouteRecognizer };
//# sourceMappingURL=index.mjs.map
