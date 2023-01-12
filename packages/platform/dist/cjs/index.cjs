"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const s = new Map;

const t = s => () => {
    throw u(`AUR1005:${s}`);
};

class Platform {
    constructor(s, i = {}) {
        this.macroTaskRequested = false;
        this.macroTaskHandle = -1;
        this.globalThis = s;
        "decodeURI decodeURIComponent encodeURI encodeURIComponent Date Reflect console".split(" ").forEach((t => {
            this[t] = t in i ? i[t] : s[t];
        }));
        "clearInterval clearTimeout queueMicrotask setInterval setTimeout".split(" ").forEach((e => {
            this[e] = e in i ? i[e] : s[e]?.bind(s) ?? t(e);
        }));
        this.performanceNow = "performanceNow" in i ? i.performanceNow : s.performance?.now?.bind(s.performance) ?? t("performance.now");
        this.flushMacroTask = this.flushMacroTask.bind(this);
        this.taskQueue = new TaskQueue(this, this.requestMacroTask.bind(this), this.cancelMacroTask.bind(this));
    }
    static getOrCreate(t, i = {}) {
        let e = s.get(t);
        if (void 0 === e) s.set(t, e = new Platform(t, i));
        return e;
    }
    static set(t, i) {
        s.set(t, i);
    }
    requestMacroTask() {
        this.macroTaskRequested = true;
        if (-1 === this.macroTaskHandle) this.macroTaskHandle = this.setTimeout(this.flushMacroTask, 0);
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
        if (true === this.macroTaskRequested) {
            this.macroTaskRequested = false;
            this.taskQueue.flush();
        }
    }
}

class TaskQueue {
    constructor(s, t, i) {
        this.platform = s;
        this.$request = t;
        this.$cancel = i;
        this.t = void 0;
        this.i = 0;
        this.h = [];
        this.u = [];
        this.T = [];
        this.$ = false;
        this.R = void 0;
        this.A = [];
        this.M = 0;
        this.P = 0;
        this._ = 0;
        this.U = () => {
            if (!this.$) {
                this.$ = true;
                this.P = this.q();
                this.$request();
            }
        };
        this.q = s.performanceNow;
        this.I = new Tracer(s.console);
    }
    get isEmpty() {
        return 0 === this.i && 0 === this.h.length && 0 === this.u.length && 0 === this.T.length;
    }
    get C() {
        return 0 === this.i && this.h.every(a) && this.u.every(a) && this.T.every(a);
    }
    flush(s = this.q()) {
        this.$ = false;
        this._ = s;
        if (void 0 === this.t) {
            if (this.u.length > 0) {
                this.h.push(...this.u);
                this.u.length = 0;
            }
            if (this.T.length > 0) {
                let t = -1;
                while (++t < this.T.length && this.T[t].queueTime <= s) ;
                this.h.push(...this.T.splice(0, t));
            }
            let t;
            while (this.h.length > 0) {
                (t = this.h.shift()).run();
                if (1 === t.status) if (true === t.suspend) {
                    this.t = t;
                    this.U();
                    return;
                } else ++this.i;
            }
            if (this.u.length > 0) {
                this.h.push(...this.u);
                this.u.length = 0;
            }
            if (this.T.length > 0) {
                let t = -1;
                while (++t < this.T.length && this.T[t].queueTime <= s) ;
                this.h.push(...this.T.splice(0, t));
            }
            if (this.h.length > 0 || this.T.length > 0 || this.i > 0) this.U();
            if (void 0 !== this.R && this.C) {
                const s = this.R;
                this.R = void 0;
                s.resolve();
            }
        } else this.U();
    }
    cancel() {
        if (this.$) {
            this.$cancel();
            this.$ = false;
        }
    }
    async yield() {
        if (this.isEmpty) ; else {
            if (void 0 === this.R) this.R = c();
            await this.R;
        }
    }
    queueTask(s, t) {
        const {delay: i, preempt: e, persistent: r, reusable: o, suspend: n} = {
            ...h,
            ...t
        };
        if (e) {
            if (i > 0) throw l();
            if (r) throw f();
        }
        if (0 === this.h.length) this.U();
        const c = this.q();
        let a;
        if (o) {
            const t = this.A;
            const h = this.M - 1;
            if (h >= 0) {
                a = t[h];
                t[h] = void 0;
                this.M = h;
                a.reuse(c, i, e, r, n, s);
            } else a = new Task(this.I, this, c, c + i, e, r, n, o, s);
        } else a = new Task(this.I, this, c, c + i, e, r, n, o, s);
        if (e) this.h[this.h.length] = a; else if (0 === i) this.u[this.u.length] = a; else this.T[this.T.length] = a;
        return a;
    }
    remove(s) {
        let t = this.h.indexOf(s);
        if (t > -1) {
            this.h.splice(t, 1);
            return;
        }
        t = this.u.indexOf(s);
        if (t > -1) {
            this.u.splice(t, 1);
            return;
        }
        t = this.T.indexOf(s);
        if (t > -1) {
            this.T.splice(t, 1);
            return;
        }
        throw u(`Task #${s.id} could not be found`);
    }
    j(s) {
        this.A[this.M++] = s;
    }
    N(s) {
        s.reset(this.q());
        if (s.createdTime === s.queueTime) this.u[this.u.length] = s; else this.T[this.T.length] = s;
    }
    O(s) {
        if (true === s.suspend) {
            if (this.t !== s) throw u(`Async task completion mismatch: suspenderTask=${this.t?.id}, task=${s.id}`);
            this.t = void 0;
        } else --this.i;
        if (void 0 !== this.R && this.C) {
            const s = this.R;
            this.R = void 0;
            s.resolve();
        }
        if (this.isEmpty) this.cancel();
    }
}

class TaskAbortError extends Error {
    constructor(s) {
        super("Task was canceled.");
        this.task = s;
    }
}

let i = 0;

exports.TaskStatus = void 0;

(function(s) {
    s[s["pending"] = 0] = "pending";
    s[s["running"] = 1] = "running";
    s[s["completed"] = 2] = "completed";
    s[s["canceled"] = 3] = "canceled";
})(exports.TaskStatus || (exports.TaskStatus = {}));

class Task {
    constructor(s, t, e, h, r, o, n, c, a) {
        this.taskQueue = t;
        this.createdTime = e;
        this.queueTime = h;
        this.preempt = r;
        this.persistent = o;
        this.suspend = n;
        this.reusable = c;
        this.callback = a;
        this.id = ++i;
        this.F = void 0;
        this.W = void 0;
        this.B = void 0;
        this.G = 0;
        this.I = s;
    }
    get result() {
        const s = this.B;
        if (void 0 === s) switch (this.G) {
          case 0:
            {
                const s = this.B = c();
                this.F = s.resolve;
                this.W = s.reject;
                return s;
            }

          case 1:
            throw u("Trying to await task from within task will cause a deadlock.");

          case 2:
            return this.B = Promise.resolve();

          case 3:
            return this.B = Promise.reject(new TaskAbortError(this));
        }
        return s;
    }
    get status() {
        return this.G;
    }
    run(s = this.taskQueue.platform.performanceNow()) {
        if (0 !== this.G) throw u(`Cannot run task in ${this.G} state`);
        const {persistent: t, reusable: i, taskQueue: e, callback: h, F: r, W: o, createdTime: n} = this;
        let c;
        this.G = 1;
        try {
            c = h(s - n);
            if (c instanceof Promise) c.then((s => {
                if (this.persistent) e.N(this); else {
                    if (t) this.G = 3; else this.G = 2;
                    this.dispose();
                }
                e.O(this);
                if (false && this.I.enabled) ;
                if (void 0 !== r) r(s);
                if (!this.persistent && i) e.j(this);
            })).catch((s => {
                if (!this.persistent) this.dispose();
                e.O(this);
                if (false && this.I.enabled) ;
                if (void 0 !== o) o(s); else throw s;
            })); else {
                if (this.persistent) e.N(this); else {
                    if (t) this.G = 3; else this.G = 2;
                    this.dispose();
                }
                if (false && this.I.enabled) ;
                if (void 0 !== r) r(c);
                if (!this.persistent && i) e.j(this);
            }
        } catch (s) {
            if (!this.persistent) this.dispose();
            if (void 0 !== o) o(s); else throw s;
        }
    }
    cancel() {
        if (0 === this.G) {
            const s = this.taskQueue;
            const t = this.reusable;
            const i = this.W;
            s.remove(this);
            if (s.isEmpty) s.cancel();
            this.G = 3;
            this.dispose();
            if (t) s.j(this);
            if (void 0 !== i) i(new TaskAbortError(this));
            return true;
        } else if (1 === this.G && this.persistent) {
            this.persistent = false;
            return true;
        }
        return false;
    }
    reset(s) {
        const t = this.queueTime - this.createdTime;
        this.createdTime = s;
        this.queueTime = s + t;
        this.G = 0;
        this.F = void 0;
        this.W = void 0;
        this.B = void 0;
    }
    reuse(s, t, i, e, h, r) {
        this.createdTime = s;
        this.queueTime = s + t;
        this.preempt = i;
        this.persistent = e;
        this.suspend = h;
        this.callback = r;
        this.G = 0;
    }
    dispose() {
        this.callback = void 0;
        this.F = void 0;
        this.W = void 0;
        this.B = void 0;
    }
}

exports.TaskQueuePriority = void 0;

(function(s) {
    s[s["render"] = 0] = "render";
    s[s["macroTask"] = 1] = "macroTask";
    s[s["postRender"] = 2] = "postRender";
})(exports.TaskQueuePriority || (exports.TaskQueuePriority = {}));

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
            const e = t.h.length;
            const h = t.u.length;
            const r = t.T.length;
            const o = t.$;
            const n = !!t.t;
            const c = `processing=${e} pending=${h} delayed=${r} flushReq=${o} susTask=${n}`;
            this.console.log(`${s}[Q.${i}] ${c}`);
        } else {
            const h = t["id"];
            const r = Math.round(10 * t["createdTime"]) / 10;
            const o = Math.round(10 * t["queueTime"]) / 10;
            const n = t["preempt"];
            const c = t["reusable"];
            const a = t["persistent"];
            const l = t["suspend"];
            const f = e(t["G"]);
            const u = `id=${h} created=${r} queue=${o} preempt=${n} persistent=${a} reusable=${c} status=${f} suspend=${l}`;
            this.console.log(`${s}[T.${i}] ${u}`);
        }
    }
}

const e = s => {
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

const n = (s, t) => {
    r = s;
    o = t;
};

const c = () => {
    const s = new Promise(n);
    s.resolve = r;
    s.reject = o;
    return s;
};

const a = s => s.persistent;

const l = () => u(`AUR1006`);

const f = () => u(`AUR1007`);

const u = s => new Error(s);

const d = s => {
    const t = s.h;
    const i = s.u;
    const e = s.T;
    const h = s.$;
    return {
        processing: t,
        pending: i,
        delayed: e,
        flushRequested: h
    };
};

const p = s => {
    s.flush();
    s.u.forEach((s => s.cancel()));
};

exports.Platform = Platform;

exports.Task = Task;

exports.TaskAbortError = TaskAbortError;

exports.TaskQueue = TaskQueue;

exports.ensureEmpty = p;

exports.reportTaskQueue = d;
//# sourceMappingURL=index.cjs.map
