var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { DI } from '@aurelia/kernel';
import { IPlatform } from '@aurelia/runtime-html';
export class HookInvocationTracker {
    get promise() {
        this.setTimeout(this.aggregator.config.resolveTimeoutMs);
        return this._promise;
    }
    constructor(aggregator, methodName) {
        this.aggregator = aggregator;
        this.methodName = methodName;
        this.timeout = -1;
        this.notifyHistory = [];
        this.platform = aggregator.platform;
        this._promise = new Promise(resolve => this.$resolve = resolve);
    }
    notify(componentName) {
        this.notifyHistory.push(componentName);
        this.aggregator.notify(componentName, this);
    }
    resolve() {
        const $resolve = this.$resolve;
        // Also re-create the promise immediately, for any potential subsequent await
        this._promise = new Promise(resolve => this.$resolve = resolve);
        this.clearTimeout();
        $resolve();
    }
    setTimeout(ms) {
        if (this.timeout === -1) {
            this.timeout = this.platform.setTimeout(() => {
                throw new Error(`${this.methodName} timed out after ${ms}ms. Notification history: [${this.notifyHistory.join(',')}]. Lifecycle call history: [${this.aggregator.notifyHistory.join(',')}]`);
            }, ms);
        }
    }
    clearTimeout() {
        const timeout = this.timeout;
        if (timeout >= 0) {
            this.timeout = -1;
            this.platform.clearTimeout(timeout);
        }
    }
    dispose() {
        const $this = this;
        this.clearTimeout();
        $this.notifyHistory = void 0;
        $this._promise = void 0;
        $this.$resolve = void 0;
        $this.platform = void 0;
        $this.aggregator = void 0;
    }
}
export const IHIAConfig = /*@__PURE__*/ DI.createInterface('IHIAConfig');
export class HIAConfig {
    constructor(resolveLabels, resolveTimeoutMs) {
        this.resolveLabels = resolveLabels;
        this.resolveTimeoutMs = resolveTimeoutMs;
    }
}
export const IHookInvocationAggregator = /*@__PURE__*/ DI.createInterface('IHookInvocationAggregator', x => x.singleton(HookInvocationAggregator));
let HookInvocationAggregator = class HookInvocationAggregator {
    constructor(platform, config) {
        this.platform = platform;
        this.config = config;
        this.notifyHistory = [];
        this.phase = '';
        this.binding = new HookInvocationTracker(this, 'binding');
        this.bound = new HookInvocationTracker(this, 'bound');
        this.attaching = new HookInvocationTracker(this, 'attaching');
        this.attached = new HookInvocationTracker(this, 'attached');
        this.detaching = new HookInvocationTracker(this, 'detaching');
        this.unbinding = new HookInvocationTracker(this, 'unbinding');
        this.$$dispose = new HookInvocationTracker(this, 'dispose');
        this.canLoad = new HookInvocationTracker(this, 'canLoad');
        this.loading = new HookInvocationTracker(this, 'loading');
        this.canUnload = new HookInvocationTracker(this, 'canUnload');
        this.unloading = new HookInvocationTracker(this, 'unloading');
    }
    notify(componentName, tracker) {
        const label = `${this.phase}.${componentName}.${tracker.methodName}`;
        this.notifyHistory.push(label);
        if (this.config.resolveLabels.includes(label)) {
            tracker.resolve();
        }
    }
    setPhase(label) {
        this.phase = label;
    }
    dispose() {
        this.binding.dispose();
        this.bound.dispose();
        this.attaching.dispose();
        this.attached.dispose();
        this.detaching.dispose();
        this.unbinding.dispose();
        this.$$dispose.dispose();
        this.canLoad.dispose();
        this.loading.dispose();
        this.canUnload.dispose();
        this.unloading.dispose();
        const $this = this;
        $this.notifyHistory = void 0;
        $this.platform = void 0;
        $this.config = void 0;
        $this.binding = void 0;
        $this.bound = void 0;
        $this.attaching = void 0;
        $this.attached = void 0;
        $this.detaching = void 0;
        $this.unbinding = void 0;
        $this.$$dispose = void 0;
        $this.canLoad = void 0;
        $this.loading = void 0;
        $this.canUnload = void 0;
        $this.unloading = void 0;
    }
};
HookInvocationAggregator = __decorate([
    __param(0, IPlatform),
    __param(1, IHIAConfig),
    __metadata("design:paramtypes", [Object, Object])
], HookInvocationAggregator);
export { HookInvocationAggregator };
//# sourceMappingURL=hook-invocation-tracker.js.map