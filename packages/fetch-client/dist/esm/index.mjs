import { DI as t } from "@aurelia/kernel";

function json(t, e) {
    return JSON.stringify(t !== undefined ? t : {}, e);
}

const e = {
    fixed: 0,
    incremental: 1,
    exponential: 2,
    random: 3
};

const r = {
    maxRetries: 3,
    interval: 1e3,
    strategy: e.fixed
};

class RetryInterceptor {
    constructor(t) {
        this.retryConfig = {
            ...r,
            ...t !== undefined ? t : {}
        };
        if (this.retryConfig.strategy === e.exponential && this.retryConfig.interval <= 1e3) {
            throw new Error("An interval less than or equal to 1 second is not allowed when using the exponential retry strategy");
        }
    }
    request(t) {
        if (!t.retryConfig) {
            t.retryConfig = {
                ...this.retryConfig
            };
            t.retryConfig.counter = 0;
        }
        t.retryConfig.requestClone = t.clone();
        return t;
    }
    response(t, e) {
        Reflect.deleteProperty(e, "retryConfig");
        return t;
    }
    responseError(t, e, r) {
        const {retryConfig: n} = e;
        const {requestClone: s} = n;
        return Promise.resolve().then((() => {
            if (n.counter < n.maxRetries) {
                const i = n.doRetry !== undefined ? n.doRetry(t, e) : true;
                return Promise.resolve(i).then((i => {
                    if (i) {
                        n.counter++;
                        const t = calculateDelay(n);
                        return new Promise((e => setTimeout(e, !isNaN(t) ? t : 0))).then((() => {
                            const t = s.clone();
                            if (typeof n.beforeRetry === "function") {
                                return n.beforeRetry(t, r);
                            }
                            return t;
                        })).then((t => {
                            const e = {
                                ...t,
                                retryConfig: n
                            };
                            return r.fetch(e);
                        }));
                    }
                    Reflect.deleteProperty(e, "retryConfig");
                    throw t;
                }));
            }
            Reflect.deleteProperty(e, "retryConfig");
            throw t;
        }));
    }
}

function calculateDelay(t) {
    const {interval: r, strategy: s, minRandomInterval: i, maxRandomInterval: o, counter: u} = t;
    if (typeof s === "function") {
        return t.strategy(u);
    }
    switch (s) {
      case e.fixed:
        return n[e.fixed](r);

      case e.incremental:
        return n[e.incremental](u, r);

      case e.exponential:
        return n[e.exponential](u, r);

      case e.random:
        return n[e.random](u, r, i, o);

      default:
        throw new Error("Unrecognized retry strategy");
    }
}

const n = [ t => t, (t, e) => e * t, (t, e) => t === 1 ? e : e ** t / 1e3, (t, e, r = 0, n = 6e4) => Math.random() * (n - r) + r ];

class HttpClientConfiguration {
    constructor() {
        this.baseUrl = "";
        this.defaults = {};
        this.interceptors = [];
        this.dispatcher = null;
    }
    withBaseUrl(t) {
        this.baseUrl = t;
        return this;
    }
    withDefaults(t) {
        this.defaults = t;
        return this;
    }
    withInterceptor(t) {
        this.interceptors.push(t);
        return this;
    }
    useStandardConfiguration() {
        const t = {
            credentials: "same-origin"
        };
        Object.assign(this.defaults, t, this.defaults);
        return this.rejectErrorResponses();
    }
    rejectErrorResponses() {
        return this.withInterceptor({
            response: rejectOnError
        });
    }
    withRetry(t) {
        const e = new RetryInterceptor(t);
        return this.withInterceptor(e);
    }
    withDispatcher(t) {
        this.dispatcher = t;
        return this;
    }
}

function rejectOnError(t) {
    if (!t.ok) {
        throw t;
    }
    return t;
}

const s = /^([a-z][a-z0-9+\-.]*:)?\/\//i;

const i = /*@__PURE__*/ t.createInterface("IHttpClient", (t => t.singleton(HttpClient)));

class HttpClient {
    constructor() {
        this.dispatcher = null;
        this.activeRequestCount = 0;
        this.isRequesting = false;
        this.isConfigured = false;
        this.baseUrl = "";
        this.defaults = null;
        this.interceptors = [];
    }
    configure(t) {
        let e;
        if (typeof t === "object") {
            const r = {
                defaults: t
            };
            e = r;
        } else if (typeof t === "function") {
            e = new HttpClientConfiguration;
            e.baseUrl = this.baseUrl;
            e.defaults = {
                ...this.defaults
            };
            e.interceptors = this.interceptors;
            e.dispatcher = this.dispatcher;
            const r = t(e);
            if (Object.prototype.isPrototypeOf.call(HttpClientConfiguration.prototype, r)) {
                e = r;
            }
        } else {
            throw new Error("invalid config");
        }
        const r = e.defaults;
        if (r !== undefined && Object.prototype.isPrototypeOf.call(Headers.prototype, r.headers)) {
            throw new Error("Default headers must be a plain object.");
        }
        const n = e.interceptors;
        if (n !== undefined && n.length) {
            if (n.filter((t => Object.prototype.isPrototypeOf.call(RetryInterceptor.prototype, t))).length > 1) {
                throw new Error("Only one RetryInterceptor is allowed.");
            }
            const t = n.findIndex((t => Object.prototype.isPrototypeOf.call(RetryInterceptor.prototype, t)));
            if (t >= 0 && t !== n.length - 1) {
                throw new Error("The retry interceptor must be the last interceptor defined.");
            }
        }
        this.baseUrl = e.baseUrl;
        this.defaults = r;
        this.interceptors = e.interceptors !== undefined ? e.interceptors : [];
        this.dispatcher = e.dispatcher;
        this.isConfigured = true;
        return this;
    }
    fetch(t, e) {
        this.trackRequestStart();
        let r = this.buildRequest(t, e);
        return this.processRequest(r, this.interceptors).then((t => {
            let e;
            if (Object.prototype.isPrototypeOf.call(Response.prototype, t)) {
                e = Promise.resolve(t);
            } else if (Object.prototype.isPrototypeOf.call(Request.prototype, t)) {
                r = t;
                e = fetch(r);
            } else {
                throw new Error(`An invalid result was returned by the interceptor chain. Expected a Request or Response instance, but got [${t}]`);
            }
            return this.processResponse(e, this.interceptors, r);
        })).then((t => {
            if (Object.prototype.isPrototypeOf.call(Request.prototype, t)) {
                return this.fetch(t);
            }
            return t;
        })).then((t => {
            this.trackRequestEnd();
            return t;
        }), (t => {
            this.trackRequestEnd();
            throw t;
        }));
    }
    buildRequest(t, e) {
        const r = this.defaults !== null ? this.defaults : {};
        let n;
        let s;
        let i;
        const o = parseHeaderValues(r.headers);
        if (Object.prototype.isPrototypeOf.call(Request.prototype, t)) {
            n = t;
            i = new Headers(n.headers).get("Content-Type");
        } else {
            if (!e) {
                e = {};
            }
            s = e.body;
            const o = s !== undefined ? {
                body: s
            } : null;
            const u = {
                ...r,
                headers: {},
                ...e,
                ...o
            };
            i = new Headers(u.headers).get("Content-Type");
            n = new Request(getRequestUrl(this.baseUrl, t), u);
        }
        if (!i) {
            if (new Headers(o).has("content-type")) {
                n.headers.set("Content-Type", new Headers(o).get("content-type"));
            } else if (s !== undefined && isJSON(s)) {
                n.headers.set("Content-Type", "application/json");
            }
        }
        setDefaultHeaders(n.headers, o);
        if (s !== undefined && Object.prototype.isPrototypeOf.call(Blob.prototype, s) && s.type) {
            n.headers.set("Content-Type", s.type);
        }
        return n;
    }
    get(t, e) {
        return this.fetch(t, e);
    }
    post(t, e, r) {
        return this.callFetch(t, e, r, "POST");
    }
    put(t, e, r) {
        return this.callFetch(t, e, r, "PUT");
    }
    patch(t, e, r) {
        return this.callFetch(t, e, r, "PATCH");
    }
    delete(t, e, r) {
        return this.callFetch(t, e, r, "DELETE");
    }
    trackRequestStart() {
        this.isRequesting = !!++this.activeRequestCount;
        if (this.isRequesting && this.dispatcher !== null) {
            const t = new this.dispatcher.ownerDocument.defaultView.CustomEvent("aurelia-fetch-client-request-started", {
                bubbles: true,
                cancelable: true
            });
            setTimeout((() => {
                this.dispatcher.dispatchEvent(t);
            }), 1);
        }
    }
    trackRequestEnd() {
        this.isRequesting = !! --this.activeRequestCount;
        if (!this.isRequesting && this.dispatcher !== null) {
            const t = new this.dispatcher.ownerDocument.defaultView.CustomEvent("aurelia-fetch-client-requests-drained", {
                bubbles: true,
                cancelable: true
            });
            setTimeout((() => {
                this.dispatcher.dispatchEvent(t);
            }), 1);
        }
    }
    processRequest(t, e) {
        return this.applyInterceptors(t, e, "request", "requestError", this);
    }
    processResponse(t, e, r) {
        return this.applyInterceptors(t, e, "response", "responseError", r, this);
    }
    applyInterceptors(t, e, r, n, ...s) {
        return (e !== undefined ? e : []).reduce(((t, e) => {
            const i = e[r];
            const o = e[n];
            return t.then(i ? t => i.call(e, t, ...s) : identity, o ? t => o.call(e, t, ...s) : thrower);
        }), Promise.resolve(t));
    }
    callFetch(t, e, r, n) {
        if (!r) {
            r = {};
        }
        r.method = n;
        if (e) {
            r.body = e;
        }
        return this.fetch(t, r);
    }
}

function parseHeaderValues(t) {
    const e = {};
    const r = t !== undefined ? t : {};
    for (const t in r) {
        if (Object.prototype.hasOwnProperty.call(r, t)) {
            e[t] = typeof r[t] === "function" ? r[t]() : r[t];
        }
    }
    return e;
}

function getRequestUrl(t, e) {
    if (s.test(e)) {
        return e;
    }
    return (t !== undefined ? t : "") + e;
}

function setDefaultHeaders(t, e) {
    const r = e !== undefined ? e : {};
    for (const e in r) {
        if (Object.prototype.hasOwnProperty.call(r, e) && !t.has(e)) {
            t.set(e, r[e]);
        }
    }
}

function isJSON(t) {
    try {
        JSON.parse(t);
    } catch (t) {
        return false;
    }
    return true;
}

function identity(t) {
    return t;
}

function thrower(t) {
    throw t;
}

export { HttpClient, HttpClientConfiguration, i as IHttpClient, RetryInterceptor, json, e as retryStrategy };
//# sourceMappingURL=index.mjs.map
