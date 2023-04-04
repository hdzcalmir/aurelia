import { Platform as t, TaskQueue as s } from "@aurelia/platform";

const i = new Map;

class BrowserPlatform extends t {
    constructor(t, i = {}) {
        super(t, i);
        this.t = false;
        this.i = -1;
        this.h = false;
        this.u = -1;
        ("Node Element HTMLElement CustomEvent CSSStyleSheet ShadowRoot MutationObserver " + "window document customElements").split(" ").forEach((s => this[s] = s in i ? i[s] : t[s]));
        "fetch requestAnimationFrame cancelAnimationFrame".split(" ").forEach((s => this[s] = s in i ? i[s] : t[s]?.bind(t) ?? e(s)));
        this.flushDomRead = this.flushDomRead.bind(this);
        this.flushDomWrite = this.flushDomWrite.bind(this);
        this.domReadQueue = new s(this, this.requestDomRead.bind(this), this.cancelDomRead.bind(this));
        this.domWriteQueue = new s(this, this.requestDomWrite.bind(this), this.cancelDomWrite.bind(this));
    }
    static getOrCreate(t, s = {}) {
        let e = i.get(t);
        if (void 0 === e) i.set(t, e = new BrowserPlatform(t, s));
        return e;
    }
    static set(t, s) {
        i.set(t, s);
    }
    requestDomRead() {
        this.t = true;
        if (-1 === this.u) this.u = this.requestAnimationFrame(this.flushDomWrite);
    }
    cancelDomRead() {
        this.t = false;
        if (this.i > -1) {
            this.clearTimeout(this.i);
            this.i = -1;
        }
        if (false === this.h && this.u > -1) {
            this.cancelAnimationFrame(this.u);
            this.u = -1;
        }
    }
    flushDomRead() {
        this.i = -1;
        if (true === this.t) {
            this.t = false;
            this.domReadQueue.flush();
        }
    }
    requestDomWrite() {
        this.h = true;
        if (-1 === this.u) this.u = this.requestAnimationFrame(this.flushDomWrite);
    }
    cancelDomWrite() {
        this.h = false;
        if (this.u > -1 && (false === this.t || this.i > -1)) {
            this.cancelAnimationFrame(this.u);
            this.u = -1;
        }
    }
    flushDomWrite() {
        this.u = -1;
        if (true === this.h) {
            this.h = false;
            this.domWriteQueue.flush();
        }
        if (true === this.t && -1 === this.i) this.i = this.setTimeout(this.flushDomRead, 0);
    }
}

const e = t => () => {
    throw new Error(`The PLATFORM did not receive a valid reference to the global function '${t}'.`);
};

export { BrowserPlatform };
//# sourceMappingURL=index.mjs.map
