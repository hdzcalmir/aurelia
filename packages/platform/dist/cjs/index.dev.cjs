'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const lookup = new Map();
const notImplemented = (name) => {
    return () => {
        throw createError(`AUR1005: The PLATFORM did not receive a valid reference to the global function '${name}'.`)
            ;
    };
};
class Platform {
    constructor(g, overrides = {}) {
        this.macroTaskRequested = false;
        this.macroTaskHandle = -1;
        this.globalThis = g;
        'decodeURI decodeURIComponent encodeURI encodeURIComponent Date Reflect console'.split(' ').forEach(prop => {
            this[prop] = prop in overrides ? overrides[prop] : g[prop];
        });
        'clearInterval clearTimeout queueMicrotask setInterval setTimeout'.split(' ').forEach(method => {
            this[method] = method in overrides ? overrides[method] : g[method]?.bind(g) ?? notImplemented(method);
        });
        this.performanceNow = 'performanceNow' in overrides ? overrides.performanceNow : g.performance?.now?.bind(g.performance) ?? notImplemented('performance.now');
        this.flushMacroTask = this.flushMacroTask.bind(this);
        this.taskQueue = new TaskQueue(this, this.requestMacroTask.bind(this), this.cancelMacroTask.bind(this));
    }
    static getOrCreate(g, overrides = {}) {
        let platform = lookup.get(g);
        if (platform === void 0) {
            lookup.set(g, platform = new Platform(g, overrides));
        }
        return platform;
    }
    static set(g, platform) {
        lookup.set(g, platform);
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
    constructor(platform, $request, $cancel) {
        this.platform = platform;
        this.$request = $request;
        this.$cancel = $cancel;
        this._suspenderTask = void 0;
        this._pendingAsyncCount = 0;
        this._processing = [];
        this._pending = [];
        this._delayed = [];
        this._flushRequested = false;
        this._yieldPromise = void 0;
        this._taskPool = [];
        this._taskPoolSize = 0;
        this._lastRequest = 0;
        this._lastFlush = 0;
        this._requestFlush = () => {
            if (this._tracer.enabled) {
                this._tracer.enter(this, 'requestFlush');
            }
            if (!this._flushRequested) {
                this._flushRequested = true;
                this._lastRequest = this._now();
                this.$request();
            }
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'requestFlush');
            }
        };
        this._now = platform.performanceNow;
        this._tracer = new Tracer(platform.console);
    }
    get isEmpty() {
        return (this._pendingAsyncCount === 0 &&
            this._processing.length === 0 &&
            this._pending.length === 0 &&
            this._delayed.length === 0);
    }
    get _hasNoMoreFiniteWork() {
        return (this._pendingAsyncCount === 0 &&
            this._processing.every(isPersistent) &&
            this._pending.every(isPersistent) &&
            this._delayed.every(isPersistent));
    }
    flush(time = this._now()) {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'flush');
        }
        this._flushRequested = false;
        this._lastFlush = time;
        if (this._suspenderTask === void 0) {
            if (this._pending.length > 0) {
                this._processing.push(...this._pending);
                this._pending.length = 0;
            }
            if (this._delayed.length > 0) {
                let i = -1;
                while (++i < this._delayed.length && this._delayed[i].queueTime <= time) { }
                this._processing.push(...this._delayed.splice(0, i));
            }
            let cur;
            while (this._processing.length > 0) {
                (cur = this._processing.shift()).run();
                if (cur.status === 1) {
                    if (cur.suspend === true) {
                        this._suspenderTask = cur;
                        this._requestFlush();
                        if (this._tracer.enabled) {
                            this._tracer.leave(this, 'flush early async');
                        }
                        return;
                    }
                    else {
                        ++this._pendingAsyncCount;
                    }
                }
            }
            if (this._pending.length > 0) {
                this._processing.push(...this._pending);
                this._pending.length = 0;
            }
            if (this._delayed.length > 0) {
                let i = -1;
                while (++i < this._delayed.length && this._delayed[i].queueTime <= time) { }
                this._processing.push(...this._delayed.splice(0, i));
            }
            if (this._processing.length > 0 || this._delayed.length > 0 || this._pendingAsyncCount > 0) {
                this._requestFlush();
            }
            if (this._yieldPromise !== void 0 &&
                this._hasNoMoreFiniteWork) {
                const p = this._yieldPromise;
                this._yieldPromise = void 0;
                p.resolve();
            }
        }
        else {
            this._requestFlush();
        }
        if (this._tracer.enabled) {
            this._tracer.leave(this, 'flush full');
        }
    }
    cancel() {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'cancel');
        }
        if (this._flushRequested) {
            this.$cancel();
            this._flushRequested = false;
        }
        if (this._tracer.enabled) {
            this._tracer.leave(this, 'cancel');
        }
    }
    async yield() {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'yield');
        }
        if (this.isEmpty) {
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'yield empty');
            }
        }
        else {
            if (this._yieldPromise === void 0) {
                if (this._tracer.enabled) {
                    this._tracer.trace(this, 'yield - creating promise');
                }
                this._yieldPromise = createExposedPromise();
            }
            await this._yieldPromise;
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'yield task');
            }
        }
    }
    queueTask(callback, opts) {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'queueTask');
        }
        const { delay, preempt, persistent, reusable, suspend } = { ...defaultQueueTaskOptions, ...opts };
        if (preempt) {
            if (delay > 0) {
                throw preemptDelayComboError();
            }
            if (persistent) {
                throw preemptyPersistentComboError();
            }
        }
        if (this._processing.length === 0) {
            this._requestFlush();
        }
        const time = this._now();
        let task;
        if (reusable) {
            const taskPool = this._taskPool;
            const index = this._taskPoolSize - 1;
            if (index >= 0) {
                task = taskPool[index];
                taskPool[index] = (void 0);
                this._taskPoolSize = index;
                task.reuse(time, delay, preempt, persistent, suspend, callback);
            }
            else {
                task = new Task(this._tracer, this, time, time + delay, preempt, persistent, suspend, reusable, callback);
            }
        }
        else {
            task = new Task(this._tracer, this, time, time + delay, preempt, persistent, suspend, reusable, callback);
        }
        if (preempt) {
            this._processing[this._processing.length] = task;
        }
        else if (delay === 0) {
            this._pending[this._pending.length] = task;
        }
        else {
            this._delayed[this._delayed.length] = task;
        }
        if (this._tracer.enabled) {
            this._tracer.leave(this, 'queueTask');
        }
        return task;
    }
    remove(task) {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'remove');
        }
        let idx = this._processing.indexOf(task);
        if (idx > -1) {
            this._processing.splice(idx, 1);
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'remove processing');
            }
            return;
        }
        idx = this._pending.indexOf(task);
        if (idx > -1) {
            this._pending.splice(idx, 1);
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'remove pending');
            }
            return;
        }
        idx = this._delayed.indexOf(task);
        if (idx > -1) {
            this._delayed.splice(idx, 1);
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'remove delayed');
            }
            return;
        }
        if (this._tracer.enabled) {
            this._tracer.leave(this, 'remove error');
        }
        throw createError(`Task #${task.id} could not be found`);
    }
    _returnToPool(task) {
        if (this._tracer.enabled) {
            this._tracer.trace(this, 'returnToPool');
        }
        this._taskPool[this._taskPoolSize++] = task;
    }
    _resetPersistentTask(task) {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'resetPersistentTask');
        }
        task.reset(this._now());
        if (task.createdTime === task.queueTime) {
            this._pending[this._pending.length] = task;
        }
        else {
            this._delayed[this._delayed.length] = task;
        }
        if (this._tracer.enabled) {
            this._tracer.leave(this, 'resetPersistentTask');
        }
    }
    _completeAsyncTask(task) {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'completeAsyncTask');
        }
        if (task.suspend === true) {
            if (this._suspenderTask !== task) {
                if (this._tracer.enabled) {
                    this._tracer.leave(this, 'completeAsyncTask error');
                }
                throw createError(`Async task completion mismatch: suspenderTask=${this._suspenderTask?.id}, task=${task.id}`);
            }
            this._suspenderTask = void 0;
        }
        else {
            --this._pendingAsyncCount;
        }
        if (this._yieldPromise !== void 0 &&
            this._hasNoMoreFiniteWork) {
            const p = this._yieldPromise;
            this._yieldPromise = void 0;
            p.resolve();
        }
        if (this.isEmpty) {
            this.cancel();
        }
        if (this._tracer.enabled) {
            this._tracer.leave(this, 'completeAsyncTask');
        }
    }
}
class TaskAbortError extends Error {
    constructor(task) {
        super('Task was canceled.');
        this.task = task;
    }
}
let id = 0;
exports.TaskStatus = void 0;
(function (TaskStatus) {
    TaskStatus[TaskStatus["pending"] = 0] = "pending";
    TaskStatus[TaskStatus["running"] = 1] = "running";
    TaskStatus[TaskStatus["completed"] = 2] = "completed";
    TaskStatus[TaskStatus["canceled"] = 3] = "canceled";
})(exports.TaskStatus || (exports.TaskStatus = {}));
class Task {
    constructor(tracer, taskQueue, createdTime, queueTime, preempt, persistent, suspend, reusable, callback) {
        this.taskQueue = taskQueue;
        this.createdTime = createdTime;
        this.queueTime = queueTime;
        this.preempt = preempt;
        this.persistent = persistent;
        this.suspend = suspend;
        this.reusable = reusable;
        this.callback = callback;
        this.id = ++id;
        this._resolve = void 0;
        this._reject = void 0;
        this._result = void 0;
        this._status = 0;
        this._tracer = tracer;
    }
    get result() {
        const result = this._result;
        if (result === void 0) {
            switch (this._status) {
                case 0: {
                    const promise = this._result = createExposedPromise();
                    this._resolve = promise.resolve;
                    this._reject = promise.reject;
                    return promise;
                }
                case 1:
                    throw createError('Trying to await task from within task will cause a deadlock.');
                case 2:
                    return this._result = Promise.resolve();
                case 3:
                    return this._result = Promise.reject(new TaskAbortError(this));
            }
        }
        return result;
    }
    get status() {
        return this._status;
    }
    run(time = this.taskQueue.platform.performanceNow()) {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'run');
        }
        if (this._status !== 0) {
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'run error');
            }
            throw createError(`Cannot run task in ${this._status} state`);
        }
        const { persistent, reusable, taskQueue, callback, _resolve: resolve, _reject: reject, createdTime, } = this;
        let ret;
        this._status = 1;
        try {
            ret = callback(time - createdTime);
            if (ret instanceof Promise) {
                ret.then($ret => {
                    if (this.persistent) {
                        taskQueue._resetPersistentTask(this);
                    }
                    else {
                        if (persistent) {
                            this._status = 3;
                        }
                        else {
                            this._status = 2;
                        }
                        this.dispose();
                    }
                    taskQueue._completeAsyncTask(this);
                    if (true && this._tracer.enabled) {
                        this._tracer.leave(this, 'run async then');
                    }
                    if (resolve !== void 0) {
                        resolve($ret);
                    }
                    if (!this.persistent && reusable) {
                        taskQueue._returnToPool(this);
                    }
                })
                    .catch((err) => {
                    if (!this.persistent) {
                        this.dispose();
                    }
                    taskQueue._completeAsyncTask(this);
                    if (true && this._tracer.enabled) {
                        this._tracer.leave(this, 'run async catch');
                    }
                    if (reject !== void 0) {
                        reject(err);
                    }
                    else {
                        throw err;
                    }
                });
            }
            else {
                if (this.persistent) {
                    taskQueue._resetPersistentTask(this);
                }
                else {
                    if (persistent) {
                        this._status = 3;
                    }
                    else {
                        this._status = 2;
                    }
                    this.dispose();
                }
                if (true && this._tracer.enabled) {
                    this._tracer.leave(this, 'run sync success');
                }
                if (resolve !== void 0) {
                    resolve(ret);
                }
                if (!this.persistent && reusable) {
                    taskQueue._returnToPool(this);
                }
            }
        }
        catch (err) {
            if (!this.persistent) {
                this.dispose();
            }
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'run sync error');
            }
            if (reject !== void 0) {
                reject(err);
            }
            else {
                throw err;
            }
        }
    }
    cancel() {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'cancel');
        }
        if (this._status === 0) {
            const taskQueue = this.taskQueue;
            const reusable = this.reusable;
            const reject = this._reject;
            taskQueue.remove(this);
            if (taskQueue.isEmpty) {
                taskQueue.cancel();
            }
            this._status = 3;
            this.dispose();
            if (reusable) {
                taskQueue._returnToPool(this);
            }
            if (reject !== void 0) {
                reject(new TaskAbortError(this));
            }
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'cancel true =pending');
            }
            return true;
        }
        else if (this._status === 1 && this.persistent) {
            this.persistent = false;
            if (this._tracer.enabled) {
                this._tracer.leave(this, 'cancel true =running+persistent');
            }
            return true;
        }
        if (this._tracer.enabled) {
            this._tracer.leave(this, 'cancel false');
        }
        return false;
    }
    reset(time) {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'reset');
        }
        const delay = this.queueTime - this.createdTime;
        this.createdTime = time;
        this.queueTime = time + delay;
        this._status = 0;
        this._resolve = void 0;
        this._reject = void 0;
        this._result = void 0;
        if (this._tracer.enabled) {
            this._tracer.leave(this, 'reset');
        }
    }
    reuse(time, delay, preempt, persistent, suspend, callback) {
        if (this._tracer.enabled) {
            this._tracer.enter(this, 'reuse');
        }
        this.createdTime = time;
        this.queueTime = time + delay;
        this.preempt = preempt;
        this.persistent = persistent;
        this.suspend = suspend;
        this.callback = callback;
        this._status = 0;
        if (this._tracer.enabled) {
            this._tracer.leave(this, 'reuse');
        }
    }
    dispose() {
        if (this._tracer.enabled) {
            this._tracer.trace(this, 'dispose');
        }
        this.callback = (void 0);
        this._resolve = void 0;
        this._reject = void 0;
        this._result = void 0;
    }
}
exports.TaskQueuePriority = void 0;
(function (TaskQueuePriority) {
    TaskQueuePriority[TaskQueuePriority["render"] = 0] = "render";
    TaskQueuePriority[TaskQueuePriority["macroTask"] = 1] = "macroTask";
    TaskQueuePriority[TaskQueuePriority["postRender"] = 2] = "postRender";
})(exports.TaskQueuePriority || (exports.TaskQueuePriority = {}));
class Tracer {
    constructor(console) {
        this.console = console;
        this.enabled = false;
        this.depth = 0;
    }
    enter(obj, method) {
        this.log(`${'  '.repeat(this.depth++)}> `, obj, method);
    }
    leave(obj, method) {
        this.log(`${'  '.repeat(--this.depth)}< `, obj, method);
    }
    trace(obj, method) {
        this.log(`${'  '.repeat(this.depth)}- `, obj, method);
    }
    log(prefix, obj, method) {
        if (obj instanceof TaskQueue) {
            const processing = obj._processing.length;
            const pending = obj._pending.length;
            const delayed = obj._delayed.length;
            const flushReq = obj._flushRequested;
            const susTask = !!obj._suspenderTask;
            const info = `processing=${processing} pending=${pending} delayed=${delayed} flushReq=${flushReq} susTask=${susTask}`;
            this.console.log(`${prefix}[Q.${method}] ${info}`);
        }
        else {
            const id = obj['id'];
            const created = Math.round(obj['createdTime'] * 10) / 10;
            const queue = Math.round(obj['queueTime'] * 10) / 10;
            const preempt = obj['preempt'];
            const reusable = obj['reusable'];
            const persistent = obj['persistent'];
            const suspend = obj['suspend'];
            const status = taskStatus(obj['_status']);
            const info = `id=${id} created=${created} queue=${queue} preempt=${preempt} persistent=${persistent} reusable=${reusable} status=${status} suspend=${suspend}`;
            this.console.log(`${prefix}[T.${method}] ${info}`);
        }
    }
}
const taskStatus = (status) => {
    switch (status) {
        case 0: return 'pending';
        case 1: return 'running';
        case 3: return 'canceled';
        case 2: return 'completed';
    }
};
const defaultQueueTaskOptions = {
    delay: 0,
    preempt: false,
    persistent: false,
    reusable: true,
    suspend: false,
};
let $resolve;
let $reject;
const executor = (resolve, reject) => {
    $resolve = resolve;
    $reject = reject;
};
const createExposedPromise = () => {
    const p = new Promise(executor);
    p.resolve = $resolve;
    p.reject = $reject;
    return p;
};
const isPersistent = (task) => task.persistent;
const preemptDelayComboError = () => createError(`AUR1006: Invalid arguments: preempt cannot be combined with a greater-than-zero delay`)
    ;
const preemptyPersistentComboError = () => createError(`AUR1007: Invalid arguments: preempt cannot be combined with persistent`)
    ;
const createError = (msg) => new Error(msg);
const reportTaskQueue = (taskQueue) => {
    const processing = taskQueue._processing;
    const pending = taskQueue._pending;
    const delayed = taskQueue._delayed;
    const flushReq = taskQueue._flushRequested;
    return { processing, pending, delayed, flushRequested: flushReq };
};
const ensureEmpty = (taskQueue) => {
    taskQueue.flush();
    taskQueue._pending.forEach((x) => x.cancel());
};

exports.Platform = Platform;
exports.Task = Task;
exports.TaskAbortError = TaskAbortError;
exports.TaskQueue = TaskQueue;
exports.ensureEmpty = ensureEmpty;
exports.reportTaskQueue = reportTaskQueue;
//# sourceMappingURL=index.dev.cjs.map
