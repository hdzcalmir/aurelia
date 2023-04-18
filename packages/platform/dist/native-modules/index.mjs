const s = new Map;

const notImplemented = s => () => {
    throw createError(`AUR1005:${s}`);
};

class Platform {
    constructor(s, t = {}) {
        this.macroTaskRequested = false;
        this.macroTaskHandle = -1;
        this.globalThis = s;
        "decodeURI decodeURIComponent encodeURI encodeURIComponent Date Reflect console".split(" ").forEach((i => {
            this[i] = i in t ? t[i] : s[i];
        }));
        "clearInterval clearTimeout queueMicrotask setInterval setTimeout".split(" ").forEach((i => {
            this[i] = i in t ? t[i] : s[i]?.bind(s) ?? notImplemented(i);
        }));
        this.performanceNow = "performanceNow" in t ? t.performanceNow : s.performance?.now?.bind(s.performance) ?? notImplemented("performance.now");
        this.flushMacroTask = this.flushMacroTask.bind(this);
        this.taskQueue = new TaskQueue(this, this.requestMacroTask.bind(this), this.cancelMacroTask.bind(this));
    }
    static getOrCreate(t, i = {}) {
        let e = s.get(t);
        if (e === void 0) {
            s.set(t, e = new Platform(t, i));
        }
        return e;
    }
    static set(t, i) {
        s.set(t, i);
    }
    requestMacroTask() {
        this.macroTaskRequested = true;
        if (this.macroTaskHandle === -1) {
            this.macroTaskHandle = this.setTimeout(this.flushMacroTask, 0);
        }
    }
    cancelMacroTask() {
        this.macroTaskRequested = false;
        if (this.macroTaskHandle > -1) {
            this.clearTimeout(this.macroTaskHandle);
            this.macroTaskHandle = -1;
        }
    }
    flushMacroTask() {
        this.macroTaskHandle = -1;
        if (this.macroTaskRequested === true) {
            this.macroTaskRequested = false;
            this.taskQueue.flush();
        }
    }
}

class TaskQueue {
    get isEmpty() {
        return this.t === 0 && this.i.length === 0 && this.h.length === 0 && this.u.length === 0;
    }
    get T() {
        return this.t === 0 && this.i.every(isPersistent) && this.h.every(isPersistent) && this.u.every(isPersistent);
    }
    constructor(s, t, i) {
        this.platform = s;
        this.$request = t;
        this.$cancel = i;
        this.$ = void 0;
        this.t = 0;
        this.i = [];
        this.h = [];
        this.u = [];
        this.R = false;
        this.A = void 0;
        this.P = [];
        this.M = 0;
        this.U = 0;
        this.q = 0;
        this.I = () => {
            if (!this.R) {
                this.R = true;
                this.U = this._();
                this.$request();
            }
        };
        this._ = s.performanceNow;
        this.C = new Tracer(s.console);
    }
    flush(s = this._()) {
        this.R = false;
        this.q = s;
        if (this.$ === void 0) {
            if (this.h.length > 0) {
                this.i.push(...this.h);
                this.h.length = 0;
            }
            if (this.u.length > 0) {
                let t = -1;
                while (++t < this.u.length && this.u[t].queueTime <= s) {}
                this.i.push(...this.u.splice(0, t));
            }
            let t;
            while (this.i.length > 0) {
                (t = this.i.shift()).run();
                if (t.status === 1) {
                    if (t.suspend === true) {
                        this.$ = t;
                        this.I();
                        return;
                    } else {
                        ++this.t;
                    }
                }
            }
            if (this.h.length > 0) {
                this.i.push(...this.h);
                this.h.length = 0;
            }
            if (this.u.length > 0) {
                let t = -1;
                while (++t < this.u.length && this.u[t].queueTime <= s) {}
                this.i.push(...this.u.splice(0, t));
            }
            if (this.i.length > 0 || this.u.length > 0 || this.t > 0) {
                this.I();
            }
            if (this.A !== void 0 && this.T) {
                const s = this.A;
                this.A = void 0;
                s.resolve();
            }
        } else {
            this.I();
        }
    }
    cancel() {
        if (this.R) {
            this.$cancel();
            this.R = false;
        }
    }
    async yield() {
        if (this.isEmpty) ; else {
            if (this.A === void 0) {
                this.A = createExposedPromise();
            }
            await this.A;
        }
    }
    queueTask(s, t) {
        const {delay: i, preempt: e, persistent: r, reusable: o, suspend: n} = {
            ...h,
            ...t
        };
        if (e) {
            if (i > 0) {
                throw preemptDelayComboError();
            }
            if (r) {
                throw preemptyPersistentComboError();
            }
        }
        if (this.i.length === 0) {
            this.I();
        }
        const c = this._();
        let a;
        if (o) {
            const t = this.P;
            const h = this.M - 1;
            if (h >= 0) {
                a = t[h];
                t[h] = void 0;
                this.M = h;
                a.reuse(c, i, e, r, n, s);
            } else {
                a = new Task(this.C, this, c, c + i, e, r, n, o, s);
            }
        } else {
            a = new Task(this.C, this, c, c + i, e, r, n, o, s);
        }
        if (e) {
            this.i[this.i.length] = a;
        } else if (i === 0) {
            this.h[this.h.length] = a;
        } else {
            this.u[this.u.length] = a;
        }
        return a;
    }
    remove(s) {
        let t = this.i.indexOf(s);
        if (t > -1) {
            this.i.splice(t, 1);
            return;
        }
        t = this.h.indexOf(s);
        if (t > -1) {
            this.h.splice(t, 1);
            return;
        }
        t = this.u.indexOf(s);
        if (t > -1) {
            this.u.splice(t, 1);
            return;
        }
        throw createError(`Task #${s.id} could not be found`);
    }
    N(s) {
        this.P[this.M++] = s;
    }
    j(s) {
        s.reset(this._());
        if (s.createdTime === s.queueTime) {
            this.h[this.h.length] = s;
        } else {
            this.u[this.u.length] = s;
        }
    }
    F(s) {
        if (s.suspend === true) {
            if (this.$ !== s) {
                throw createError(`Async task completion mismatch: suspenderTask=${this.$?.id}, task=${s.id}`);
            }
            this.$ = void 0;
        } else {
            --this.t;
        }
        if (this.A !== void 0 && this.T) {
            const s = this.A;
            this.A = void 0;
            s.resolve();
        }
        if (this.isEmpty) {
            this.cancel();
        }
    }
}

class TaskAbortError extends Error {
    constructor(s) {
        super("Task was canceled.");
        this.task = s;
    }
}

let t = 0;

var i;

(function(s) {
    s[s["pending"] = 0] = "pending";
    s[s["running"] = 1] = "running";
    s[s["completed"] = 2] = "completed";
    s[s["canceled"] = 3] = "canceled";
})(i || (i = {}));

class Task {
    get result() {
        const s = this.O;
        if (s === void 0) {
            switch (this.W) {
              case 0:
                {
                    const s = this.O = createExposedPromise();
                    this.B = s.resolve;
                    this.G = s.reject;
                    return s;
                }

              case 1:
                throw createError("Trying to await task from within task will cause a deadlock.");

              case 2:
                return this.O = Promise.resolve();

              case 3:
                return this.O = Promise.reject(new TaskAbortError(this));
            }
        }
        return s;
    }
    get status() {
        return this.W;
    }
    constructor(s, i, e, h, r, o, n, c, a) {
        this.taskQueue = i;
        this.createdTime = e;
        this.queueTime = h;
        this.preempt = r;
        this.persistent = o;
        this.suspend = n;
        this.reusable = c;
        this.callback = a;
        this.id = ++t;
        this.B = void 0;
        this.G = void 0;
        this.O = void 0;
        this.W = 0;
        this.C = s;
    }
    run(s = this.taskQueue.platform.performanceNow()) {
        if (this.W !== 0) {
            throw createError(`Cannot run task in ${this.W} state`);
        }
        const {persistent: t, reusable: i, taskQueue: e, callback: h, B: r, G: o, createdTime: n} = this;
        let c;
        this.W = 1;
        try {
            c = h(s - n);
            if (c instanceof Promise) {
                c.then((s => {
                    if (this.persistent) {
                        e.j(this);
                    } else {
                        if (t) {
                            this.W = 3;
                        } else {
                            this.W = 2;
                        }
                        this.dispose();
                    }
                    e.F(this);
                    if (false && this.C.enabled) ;
                    if (r !== void 0) {
                        r(s);
                    }
                    if (!this.persistent && i) {
                        e.N(this);
                    }
                })).catch((s => {
                    if (!this.persistent) {
                        this.dispose();
                    }
                    e.F(this);
                    if (false && this.C.enabled) ;
                    if (o !== void 0) {
                        o(s);
                    } else {
                        throw s;
                    }
                }));
            } else {
                if (this.persistent) {
                    e.j(this);
                } else {
                    if (t) {
                        this.W = 3;
                    } else {
                        this.W = 2;
                    }
                    this.dispose();
                }
                if (false && this.C.enabled) ;
                if (r !== void 0) {
                    r(c);
                }
                if (!this.persistent && i) {
                    e.N(this);
                }
            }
        } catch (s) {
            if (!this.persistent) {
                this.dispose();
            }
            if (o !== void 0) {
                o(s);
            } else {
                throw s;
            }
        }
    }
    cancel() {
        if (this.W === 0) {
            const s = this.taskQueue;
            const t = this.reusable;
            const i = this.G;
            s.remove(this);
            if (s.isEmpty) {
                s.cancel();
            }
            this.W = 3;
            this.dispose();
            if (t) {
                s.N(this);
            }
            if (i !== void 0) {
                i(new TaskAbortError(this));
            }
            return true;
        } else if (this.W === 1 && this.persistent) {
            this.persistent = false;
            return true;
        }
        return false;
    }
    reset(s) {
        const t = this.queueTime - this.createdTime;
        this.createdTime = s;
        this.queueTime = s + t;
        this.W = 0;
        this.B = void 0;
        this.G = void 0;
        this.O = void 0;
    }
    reuse(s, t, i, e, h, r) {
        this.createdTime = s;
        this.queueTime = s + t;
        this.preempt = i;
        this.persistent = e;
        this.suspend = h;
        this.callback = r;
        this.W = 0;
    }
    dispose() {
        this.callback = void 0;
        this.B = void 0;
        this.G = void 0;
        this.O = void 0;
    }
}

var e;

(function(s) {
    s[s["render"] = 0] = "render";
    s[s["macroTask"] = 1] = "macroTask";
    s[s["postRender"] = 2] = "postRender";
})(e || (e = {}));

class Tracer {
    constructor(s) {
        this.console = s;
        this.enabled = false;
        this.depth = 0;
    }
    enter(s, t) {
        this.log(`${"  ".repeat(this.depth++)}> `, s, t);
    }
    leave(s, t) {
        this.log(`${"  ".repeat(--this.depth)}< `, s, t);
    }
    trace(s, t) {
        this.log(`${"  ".repeat(this.depth)}- `, s, t);
    }
    log(s, t, i) {
        if (t instanceof TaskQueue) {
            const e = t.i.length;
            const h = t.h.length;
            const r = t.u.length;
            const o = t.R;
            const n = !!t.$;
            const c = `processing=${e} pending=${h} delayed=${r} flushReq=${o} susTask=${n}`;
            this.console.log(`${s}[Q.${i}] ${c}`);
        } else {
            const e = t["id"];
            const h = Math.round(t["createdTime"] * 10) / 10;
            const r = Math.round(t["queueTime"] * 10) / 10;
            const o = t["preempt"];
            const n = t["reusable"];
            const c = t["persistent"];
            const a = t["suspend"];
            const l = taskStatus(t["W"]);
            const f = `id=${e} created=${h} queue=${r} preempt=${o} persistent=${c} reusable=${n} status=${l} suspend=${a}`;
            this.console.log(`${s}[T.${i}] ${f}`);
        }
    }
}

const taskStatus = s => {
    switch (s) {
      case 0:
        return "pending";

      case 1:
        return "running";

      case 3:
        return "canceled";

      case 2:
        return "completed";
    }
};

const h = {
    delay: 0,
    preempt: false,
    persistent: false,
    reusable: true,
    suspend: false
};

let r;

let o;

const executor = (s, t) => {
    r = s;
    o = t;
};

const createExposedPromise = () => {
    const s = new Promise(executor);
    s.resolve = r;
    s.reject = o;
    return s;
};

const isPersistent = s => s.persistent;

const preemptDelayComboError = () => createError(`AUR1006`);

const preemptyPersistentComboError = () => createError(`AUR1007`);

const createError = s => new Error(s);

const reportTaskQueue = s => {
    const t = s.i;
    const i = s.h;
    const e = s.u;
    const h = s.R;
    return {
        processing: t,
        pending: i,
        delayed: e,
        flushRequested: h
    };
};

const ensureEmpty = s => {
    s.flush();
    s.h.forEach((s => s.cancel()));
};

export { Platform, Task, TaskAbortError, TaskQueue, e as TaskQueuePriority, i as TaskStatus, ensureEmpty, reportTaskQueue };

