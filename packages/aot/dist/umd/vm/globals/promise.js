(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../types/object", "../types/function", "../types/undefined", "./iteration", "../types/error", "../operations", "../types/list", "../job", "../types/empty", "./_shared", "../exotics/array"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$PromiseInstance = exports.PromiseState = exports.$PerformPromiseThen = exports.$PromiseProto_then = exports.$Thrower = exports.$CatchFinally = exports.$ValueThunk = exports.$ThenFinally = exports.$PromiseProto_finally = exports.$PromiseProto_catch = exports.$PromisePrototype = exports.$PromiseResolve = exports.$Promise_resolve = exports.$Promise_reject = exports.$PerformPromiseRace = exports.$Promise_race = exports.$Promise_all_ResolveElement = exports.$Promise_all = exports.$PromiseConstructor = exports.PromiseResolveThenableJob = exports.PromiseReactionJob = exports.$HostPromiseRejectionTracker = exports.PromiseRejectionOperation = exports.$TriggerPromiseReactions = exports.$RejectPromise = exports.$GetCapabilitiesExecutor = exports.$NewPromiseCapability = exports.$FulfillPromise = exports.$PromiseResolveFunction = exports.$PromiseRejectFunction = exports.$PromiseResolvingFunctions = exports.$PromiseReaction = exports.PromiseReactionType = exports.$IfAbruptRejectPromise = exports.$PromiseCapability = void 0;
    const object_1 = require("../types/object");
    const function_1 = require("../types/function");
    const undefined_1 = require("../types/undefined");
    const iteration_1 = require("./iteration");
    const error_1 = require("../types/error");
    const operations_1 = require("../operations");
    const list_1 = require("../types/list");
    const job_1 = require("../job");
    const empty_1 = require("../types/empty");
    const _shared_1 = require("./_shared");
    const array_1 = require("../exotics/array");
    // http://www.ecma-international.org/ecma-262/#sec-promise-abstract-operations
    // #region 25.6.1 Promise Abstract Operation
    // http://www.ecma-international.org/ecma-262/#sec-promisecapability-records
    // 25.6.1.1 PromiseCapability Records
    class $PromiseCapability {
        constructor(promise, resolve, reject) {
            this['[[Promise]]'] = promise;
            this['[[Resolve]]'] = resolve;
            this['[[Reject]]'] = reject;
        }
        get isUndefined() { return false; }
        get isAbrupt() { return false; }
    }
    exports.$PromiseCapability = $PromiseCapability;
    // http://www.ecma-international.org/ecma-262/#sec-ifabruptrejectpromise
    // 25.6.1.1.1 IfAbruptRejectPromise ( value , capability )
    function $IfAbruptRejectPromise(ctx, value, capability) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        // 1. If value is an abrupt completion, then
        if (value.isAbrupt) {
            // 1. a. Perform ? Call(capability.[[Reject]], undefined, « value.[[Value]] »).
            const $CallResult = operations_1.$Call(ctx, capability['[[Reject]]'], intrinsics.undefined, new list_1.$List(value));
            if ($CallResult.isAbrupt) {
                return $CallResult;
            }
            // 1. b. Return capability.[[Promise]].
            return capability['[[Promise]]'];
        }
        // 2. Else if value is a Completion Record, set value to value.[[Value]].
        return value;
    }
    exports.$IfAbruptRejectPromise = $IfAbruptRejectPromise;
    var PromiseReactionType;
    (function (PromiseReactionType) {
        PromiseReactionType[PromiseReactionType["Fulfill"] = 1] = "Fulfill";
        PromiseReactionType[PromiseReactionType["Reject"] = 2] = "Reject";
    })(PromiseReactionType = exports.PromiseReactionType || (exports.PromiseReactionType = {}));
    // http://www.ecma-international.org/ecma-262/#sec-promisereaction-records
    // 25.6.1.2 PromiseReaction Records
    class $PromiseReaction {
        constructor(capability, type, handler) {
            this['[[Capability]]'] = capability;
            this['[[Type]]'] = type;
            this['[[Handler]]'] = handler;
        }
        is(other) {
            return this === other;
        }
    }
    exports.$PromiseReaction = $PromiseReaction;
    // http://www.ecma-international.org/ecma-262/#sec-createresolvingfunctions
    // 25.6.1.3 CreateResolvingFunctions ( promise )
    class $PromiseResolvingFunctions {
        constructor(realm, promise) {
            // 1. Let alreadyResolved be a new Record { [[Value]]: false }.
            const alreadyResolved = new _shared_1.$ValueRecord(false);
            // 2. Let stepsResolve be the algorithm steps defined in Promise Resolve Functions (25.6.1.3.2).
            // 3. Let resolve be CreateBuiltinFunction(stepsResolve, « [[Promise]], [[AlreadyResolved]] »).
            // 4. Set resolve.[[Promise]] to promise.
            // 5. Set resolve.[[AlreadyResolved]] to alreadyResolved.
            this['[[Resolve]]'] = new $PromiseResolveFunction(realm, promise, alreadyResolved);
            // 6. Let stepsReject be the algorithm steps defined in Promise Reject Functions (25.6.1.3.1).
            // 7. Let reject be CreateBuiltinFunction(stepsReject, « [[Promise]], [[AlreadyResolved]] »).
            // 8. Set reject.[[Promise]] to promise.
            // 9. Set reject.[[AlreadyResolved]] to alreadyResolved.
            this['[[Reject]]'] = new $PromiseRejectFunction(realm, promise, alreadyResolved);
            // 10. Return a new Record { [[Resolve]]: resolve, [[Reject]]: reject }.
        }
    }
    exports.$PromiseResolvingFunctions = $PromiseResolvingFunctions;
    // http://www.ecma-international.org/ecma-262/#sec-promise-reject-functions
    // 25.6.1.3.1 Promise Reject Functions
    class $PromiseRejectFunction extends function_1.$BuiltinFunction {
        constructor(realm, promise, alreadyResolved) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, 'PromiseRejectFunction', intrinsics['%FunctionPrototype%']);
            this['[[Promise]]'] = promise;
            this['[[AlreadyResolved]]'] = alreadyResolved;
        }
        performSteps(ctx, thisArgument, [reason], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (reason === void 0) {
                reason = intrinsics.undefined;
            }
            // 1. Let F be the active function object.
            const F = this;
            // 2. Assert: F has a [[Promise]] internal slot whose value is an Object.
            // 3. Let promise be F.[[Promise]].
            const promise = F['[[Promise]]'];
            // 4. Let alreadyResolved be F.[[AlreadyResolved]].
            const alreadyResolved = F['[[AlreadyResolved]]'];
            // 5. If alreadyResolved.[[Value]] is true, return undefined.
            if (alreadyResolved['[[Value]]']) {
                return intrinsics.undefined;
            }
            // 6. Set alreadyResolved.[[Value]] to true.
            alreadyResolved['[[Value]]'] = true;
            // 7. Return RejectPromise(promise, reason).
            return $RejectPromise(ctx, promise, reason);
        }
    }
    exports.$PromiseRejectFunction = $PromiseRejectFunction;
    // http://www.ecma-international.org/ecma-262/#sec-promise-resolve-functions
    // 25.6.1.3.2 Promise Resolve Functions
    class $PromiseResolveFunction extends function_1.$BuiltinFunction {
        constructor(realm, promise, alreadyResolved) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, 'PromiseResolveFunction', intrinsics['%FunctionPrototype%']);
            this['[[Promise]]'] = promise;
            this['[[AlreadyResolved]]'] = alreadyResolved;
        }
        performSteps(ctx, thisArgument, [resolution], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (resolution === void 0) {
                resolution = intrinsics.undefined;
            }
            // 1. Let F be the active function object.
            const F = this;
            // 2. Assert: F has a [[Promise]] internal slot whose value is an Object.
            // 3. Let promise be F.[[Promise]].
            const promise = F['[[Promise]]'];
            // 4. Let alreadyResolved be F.[[AlreadyResolved]].
            const alreadyResolved = F['[[AlreadyResolved]]'];
            // 5. If alreadyResolved.[[Value]] is true, return undefined.
            if (alreadyResolved['[[Value]]']) {
                return intrinsics.undefined;
            }
            // 6. Set alreadyResolved.[[Value]] to true.
            alreadyResolved['[[Value]]'] = true;
            // 7. If SameValue(resolution, promise) is true, then
            if (resolution.is(promise)) {
                // 7. a. Let selfResolutionError be a newly created TypeError object.
                const selfResolutionError = new error_1.$TypeError(realm, `Failed to resolve self`); // ?
                // 7. b. Return RejectPromise(promise, selfResolutionError).
                return $RejectPromise(ctx, promise, selfResolutionError);
            }
            // 8. If Type(resolution) is not Object, then
            if (!resolution.isObject) {
                // 8. a. Return FulfillPromise(promise, resolution).
                return $FulfillPromise(ctx, promise, resolution);
            }
            // 9. Let then be Get(resolution, "then").
            const then = resolution['[[Get]]'](ctx, intrinsics.then, resolution);
            // 10. If then is an abrupt completion, then
            if (then.isAbrupt) {
                // 10. a. Return RejectPromise(promise, then.[[Value]]).
                return $RejectPromise(ctx, promise, then);
            }
            // 11. Let thenAction be then.[[Value]].
            // 12. If IsCallable(thenAction) is false, then
            if (!then.isFunction) {
                // 12. a. Return FulfillPromise(promise, resolution).
                return $FulfillPromise(ctx, promise, resolution);
            }
            // 13. Perform EnqueueJob("PromiseJobs", PromiseResolveThenableJob, « promise, resolution, thenAction »).
            const mos = ctx.ScriptOrModule;
            if (mos.isNull) {
                throw new Error(`No ScriptOrModule found in this realm`);
            }
            realm.PromiseJobs.EnqueueJob(ctx, new PromiseResolveThenableJob(realm, mos, promise, resolution, then));
            // 14. Return undefined.
            return new undefined_1.$Undefined(realm);
        }
    }
    exports.$PromiseResolveFunction = $PromiseResolveFunction;
    // http://www.ecma-international.org/ecma-262/#sec-fulfillpromise
    // 25.6.1.4 FulfillPromise ( promise , value )
    function $FulfillPromise(ctx, promise, value) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        // 1. Assert: The value of promise.[[PromiseState]] is "pending".
        // 2. Let reactions be promise.[[PromiseFulfillReactions]].
        const reactions = promise['[[PromiseFulfillReactions]]'];
        // 3. Set promise.[[PromiseResult]] to value.
        promise['[[PromiseResult]]'] = value;
        // 4. Set promise.[[PromiseFulfillReactions]] to undefined.
        promise['[[PromiseFulfillReactions]]'] = void 0;
        // 5. Set promise.[[PromiseRejectReactions]] to undefined.
        promise['[[PromiseRejectReactions]]'] = void 0;
        // 6. Set promise.[[PromiseState]] to "fulfilled".
        promise['[[PromiseState]]'] = 2 /* fulfilled */;
        // 7. Return TriggerPromiseReactions(reactions, value).
        return $TriggerPromiseReactions(ctx, reactions, value);
    }
    exports.$FulfillPromise = $FulfillPromise;
    // http://www.ecma-international.org/ecma-262/#sec-newpromisecapability
    // 25.6.1.5 NewPromiseCapability ( C )
    function $NewPromiseCapability(ctx, C) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        // 1. If IsConstructor(C) is false, throw a TypeError exception.
        if (!C.isFunction) {
            return new error_1.$TypeError(realm, `Expected constructor, but got: ${C}`);
        }
        // 2. NOTE: C is assumed to be a constructor function that supports the parameter conventions of the Promise constructor (see 25.6.3.1).
        // 3. Let promiseCapability be a new PromiseCapability { [[Promise]]: undefined, [[Resolve]]: undefined, [[Reject]]: undefined }.
        const promiseCapability = new $PromiseCapability(intrinsics.undefined, intrinsics.undefined, intrinsics.undefined);
        // 4. Let steps be the algorithm steps defined in GetCapabilitiesExecutor Functions.
        // 5. Let executor be CreateBuiltinFunction(steps, « [[Capability]] »).
        // 6. Set executor.[[Capability]] to promiseCapability.
        const executor = new $GetCapabilitiesExecutor(realm, promiseCapability);
        // 7. Let promise be ? Construct(C, « executor »).
        const promise = operations_1.$Construct(ctx, C, new list_1.$List(executor), intrinsics.undefined);
        // 8. If IsCallable(promiseCapability.[[Resolve]]) is false, throw a TypeError exception.
        if (!promiseCapability['[[Resolve]]'].isFunction) {
            return new error_1.$TypeError(realm, `Expected [[Resolve]] to be callable, but got: ${promiseCapability['[[Resolve]]']}`);
        }
        // 9. If IsCallable(promiseCapability.[[Reject]]) is false, throw a TypeError exception.
        if (!promiseCapability['[[Reject]]'].isFunction) {
            return new error_1.$TypeError(realm, `Expected [[Reject]] to be callable, but got: ${promiseCapability['[[Reject]]']}`);
        }
        // 10. Set promiseCapability.[[Promise]] to promise.
        promiseCapability['[[Promise]]'] = promise;
        // 11. Return promiseCapability.
        return promiseCapability;
    }
    exports.$NewPromiseCapability = $NewPromiseCapability;
    // http://www.ecma-international.org/ecma-262/#sec-getcapabilitiesexecutor-functions
    // 25.6.1.5.1 GetCapabilitiesExecutor Functions
    class $GetCapabilitiesExecutor extends function_1.$BuiltinFunction {
        constructor(realm, capability) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, 'GetCapabilitiesExecutor', intrinsics['%FunctionPrototype%']);
            this['[[Capability]]'] = capability;
        }
        performSteps(ctx, thisArgument, [resolve, reject], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (resolve === void 0) {
                resolve = intrinsics.undefined;
            }
            if (reject === void 0) {
                reject = intrinsics.undefined;
            }
            // 1. Let F be the active function object.
            const F = this;
            // 2. Assert: F has a [[Capability]] internal slot whose value is a PromiseCapability Record.
            // 3. Let promiseCapability be F.[[Capability]].
            const promiseCapability = F['[[Capability]]'];
            // 4. If promiseCapability.[[Resolve]] is not undefined, throw a TypeError exception.
            if (!promiseCapability['[[Resolve]]'].isUndefined) {
                return new error_1.$TypeError(realm, `[[Resolve]] is already defined`);
            }
            // 5. If promiseCapability.[[Reject]] is not undefined, throw a TypeError exception.
            if (!promiseCapability['[[Reject]]'].isUndefined) {
                return new error_1.$TypeError(realm, `[[Reject]] is already defined`);
            }
            // 6. Set promiseCapability.[[Resolve]] to resolve.
            promiseCapability['[[Resolve]]'] = resolve;
            // 7. Set promiseCapability.[[Reject]] to reject.
            promiseCapability['[[Reject]]'] = reject;
            // 8. Return undefined.
            return intrinsics.undefined;
        }
    }
    exports.$GetCapabilitiesExecutor = $GetCapabilitiesExecutor;
    // http://www.ecma-international.org/ecma-262/#sec-rejectpromise
    // 25.6.1.7 RejectPromise ( promise , reason )
    function $RejectPromise(ctx, promise, reason) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        // 1. Assert: The value of promise.[[PromiseState]] is "pending".
        // 2. Let reactions be promise.[[PromiseRejectReactions]].
        const reactions = promise['[[PromiseRejectReactions]]'];
        // 3. Set promise.[[PromiseResult]] to reason.
        promise['[[PromiseResult]]'] = reason;
        // 4. Set promise.[[PromiseFulfillReactions]] to undefined.
        promise['[[PromiseFulfillReactions]]'] = void 0;
        // 5. Set promise.[[PromiseRejectReactions]] to undefined.
        promise['[[PromiseRejectReactions]]'] = void 0;
        // 6. Set promise.[[PromiseState]] to "rejected".
        promise['[[PromiseState]]'] = 3 /* rejected */;
        // 7. If promise.[[PromiseIsHandled]] is false, perform HostPromiseRejectionTracker(promise, "reject").
        if (!promise['[[PromiseIsHandled]]']) {
            $HostPromiseRejectionTracker(ctx, promise, 1 /* reject */);
        }
        // 8. Return TriggerPromiseReactions(reactions, reason).
        return $TriggerPromiseReactions(ctx, reactions, reason);
    }
    exports.$RejectPromise = $RejectPromise;
    // http://www.ecma-international.org/ecma-262/#sec-triggerpromisereactions
    // 25.6.1.8 TriggerPromiseReactions ( reactions , argument )
    function $TriggerPromiseReactions(ctx, reactions, argument) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        const promiseJobs = realm.PromiseJobs;
        const mos = ctx.ScriptOrModule;
        if (mos.isNull) {
            throw new Error(`No ScriptOrModule found in this realm`);
        }
        // 1. For each reaction in reactions, in original insertion order, do
        for (const reaction of reactions) {
            // 1. a. Perform EnqueueJob("PromiseJobs", PromiseReactionJob, « reaction, argument »).
            promiseJobs.EnqueueJob(ctx, new PromiseReactionJob(realm, mos, reaction, argument));
        }
        // 2. Return undefined.
        return new undefined_1.$Undefined(realm);
    }
    exports.$TriggerPromiseReactions = $TriggerPromiseReactions;
    var PromiseRejectionOperation;
    (function (PromiseRejectionOperation) {
        PromiseRejectionOperation[PromiseRejectionOperation["reject"] = 1] = "reject";
        PromiseRejectionOperation[PromiseRejectionOperation["handle"] = 2] = "handle";
    })(PromiseRejectionOperation = exports.PromiseRejectionOperation || (exports.PromiseRejectionOperation = {}));
    // http://www.ecma-international.org/ecma-262/#sec-host-promise-rejection-tracker
    // 25.6.1.9 HostPromiseRejectionTracker ( promise , operation )
    function $HostPromiseRejectionTracker(ctx, promise, operation) {
        ctx.logger.error(`Promise rejected: ${promise}`);
    }
    exports.$HostPromiseRejectionTracker = $HostPromiseRejectionTracker;
    // #endregion
    // http://www.ecma-international.org/ecma-262/#sec-promise-jobs
    // #region 25.6.2 Promise Jobs
    class PromiseReactionJob extends job_1.Job {
        constructor(realm, scriptOrModule, reaction, argument) {
            super(realm.logger.root, realm, scriptOrModule);
            this.reaction = reaction;
            this.argument = argument;
        }
        // http://www.ecma-international.org/ecma-262/#sec-promisereactionjob
        // 25.6.2.1 PromiseReactionJob ( reaction , argument )
        Run(ctx) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            this.logger.debug(`Run(#${ctx.id})`);
            const reaction = this.reaction;
            const argument = this.argument;
            // 1. Assert: reaction is a PromiseReaction Record.
            // 2. Let promiseCapability be reaction.[[Capability]].
            const promiseCapability = reaction['[[Capability]]'];
            // 3. Let type be reaction.[[Type]].
            const type = reaction['[[Type]]'];
            // 4. Let handler be reaction.[[Handler]].
            const handler = reaction['[[Handler]]'];
            let handlerResult;
            // 5. If handler is undefined, then
            if (handler.isUndefined) {
                // 5. a. If type is "Fulfill", let handlerResult be NormalCompletion(argument).
                if (type === 1 /* Fulfill */) {
                    handlerResult = argument;
                }
                // 5. b. Else,
                else {
                    // 5. b. i. Assert: type is "Reject".
                    // 5. b. ii. Let handlerResult be ThrowCompletion(argument).
                    handlerResult = argument.ToCompletion(5 /* throw */, intrinsics.empty);
                }
            }
            // 6. Else, let handlerResult be Call(handler, undefined, « argument »).
            else {
                handlerResult = operations_1.$Call(ctx, handler, intrinsics.undefined, new list_1.$List(argument));
            }
            // 7. If promiseCapability is undefined, then
            if (promiseCapability.isUndefined) {
                // 7. a. Assert: handlerResult is not an abrupt completion.
                // 7. b. Return NormalCompletion(empty).
                return new empty_1.$Empty(realm);
            }
            let status;
            // 8. If handlerResult is an abrupt completion, then
            if (handlerResult.isAbrupt) {
                // 8. a. Let status be Call(promiseCapability.[[Reject]], undefined, « handlerResult.[[Value]] »).
                status = operations_1.$Call(ctx, promiseCapability['[[Reject]]'], intrinsics.undefined, new list_1.$List(handlerResult));
            }
            // 9. Else,
            else {
                // 9. a. Let status be Call(promiseCapability.[[Resolve]], undefined, « handlerResult.[[Value]] »).
                status = operations_1.$Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new list_1.$List(handlerResult));
            }
            // 10. Return Completion(status).
            return status;
        }
    }
    exports.PromiseReactionJob = PromiseReactionJob;
    class PromiseResolveThenableJob extends job_1.Job {
        constructor(realm, scriptOrModule, promiseToResolve, thenable, then) {
            super(realm.logger.root, realm, scriptOrModule);
            this.promiseToResolve = promiseToResolve;
            this.thenable = thenable;
            this.then = then;
        }
        // http://www.ecma-international.org/ecma-262/#sec-promiseresolvethenablejob
        // 25.6.2.2 PromiseResolveThenableJob ( promiseToResolve , thenable , then )
        Run(ctx) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            this.logger.debug(`Run(#${ctx.id})`);
            const promiseToResolve = this.promiseToResolve;
            const thenable = this.thenable;
            const then = this.then;
            // 1. Let resolvingFunctions be CreateResolvingFunctions(promiseToResolve).
            const resolvingFunctions = new $PromiseResolvingFunctions(realm, promiseToResolve);
            // 2. Let thenCallResult be Call(then, thenable, « resolvingFunctions.[[Resolve]], resolvingFunctions.[[Reject]] »).
            const thenCallResult = operations_1.$Call(ctx, then, thenable, new list_1.$List(resolvingFunctions['[[Resolve]]'], resolvingFunctions['[[Reject]]']));
            // 3. If thenCallResult is an abrupt completion, then
            if (thenCallResult.isAbrupt) {
                // 3. a. Let status be Call(resolvingFunctions.[[Reject]], undefined, « thenCallResult.[[Value]] »).
                const status = operations_1.$Call(ctx, resolvingFunctions['[[Reject]]'], intrinsics.undefined, new list_1.$List(thenCallResult));
                // 3. b. Return Completion(status).
                return status;
            }
            // 4. Return Completion(thenCallResult).
            return thenCallResult;
        }
    }
    exports.PromiseResolveThenableJob = PromiseResolveThenableJob;
    // #endregion
    // http://www.ecma-international.org/ecma-262/#sec-promise-constructor
    // #region 25.6.3 The Promise Constructor
    class $PromiseConstructor extends function_1.$BuiltinFunction {
        // http://www.ecma-international.org/ecma-262/#sec-promise.prototype
        // 25.6.4.2 Promise.prototype
        get $prototype() {
            return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'];
        }
        set $prototype(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
        }
        // http://www.ecma-international.org/ecma-262/#sec-promise.all
        // 25.6.4.1 Promise.all ( iterable )
        get all() {
            return this.getProperty(this.realm['[[Intrinsics]]'].all)['[[Value]]'];
        }
        set all(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]'].all, value);
        }
        // http://www.ecma-international.org/ecma-262/#sec-promise.race
        // 25.6.4.3 Promise.race ( iterable )
        get race() {
            return this.getProperty(this.realm['[[Intrinsics]]'].race)['[[Value]]'];
        }
        set race(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]'].race, value);
        }
        // http://www.ecma-international.org/ecma-262/#sec-promise.reject
        // 25.6.4.4 Promise.reject ( r )
        get reject() {
            return this.getProperty(this.realm['[[Intrinsics]]'].reject)['[[Value]]'];
        }
        set reject(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]'].reject, value);
        }
        // http://www.ecma-international.org/ecma-262/#sec-promise.resolve
        // 25.6.4.5 Promise.resolve ( x )
        get resolve() {
            return this.getProperty(this.realm['[[Intrinsics]]'].resolve)['[[Value]]'];
        }
        set resolve(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]'].resolve, value, false, false, false);
        }
        // http://www.ecma-international.org/ecma-262/#sec-get-promise-@@species
        // 25.6.4.6 get Promise [ @@species ]
        get ['@@species']() {
            return this.getProperty(this.realm['[[Intrinsics]]']['@@species'])['[[Value]]'];
        }
        set ['@@species'](value) {
            this.setDataProperty(this.realm['[[Intrinsics]]']['@@species'], value, false, false, false);
        }
        constructor(realm, functionPrototype) {
            super(realm, '%Promise%', functionPrototype);
        }
        // http://www.ecma-international.org/ecma-262/#sec-promise-executor
        // 25.6.3.1 Promise ( executor )
        performSteps(ctx, thisArgument, [executor], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            // 1. If NewTarget is undefined, throw a TypeError exception.
            if (NewTarget.isUndefined) {
                return new error_1.$TypeError(realm, `Promise cannot be called as a function.`);
            }
            // 2. If IsCallable(executor) is false, throw a TypeError exception.
            if (executor === void 0 || !executor.isFunction) {
                return new error_1.$TypeError(realm, `The promise constructor requires an executor function`);
            }
            // 3. Let promise be ? OrdinaryCreateFromConstructor(NewTarget, "%PromisePrototype%", « [[PromiseState]], [[PromiseResult]], [[PromiseFulfillReactions]], [[PromiseRejectReactions]], [[PromiseIsHandled]] »).
            const promise = $PromiseInstance.Create(ctx, NewTarget);
            if (promise.isAbrupt) {
                return promise;
            }
            // 4. Set promise.[[PromiseState]] to "pending".
            promise['[[PromiseState]]'] = 1 /* pending */;
            // 5. Set promise.[[PromiseFulfillReactions]] to a new empty List.
            promise['[[PromiseFulfillReactions]]'] = new list_1.$List();
            // 6. Set promise.[[PromiseRejectReactions]] to a new empty List.
            promise['[[PromiseRejectReactions]]'] = new list_1.$List();
            // 7. Set promise.[[PromiseIsHandled]] to false.
            promise['[[PromiseIsHandled]]'] = false;
            // 8. Let resolvingFunctions be CreateResolvingFunctions(promise).
            const resolvingFunctions = new $PromiseResolvingFunctions(realm, promise);
            // 9. Let completion be Call(executor, undefined, « resolvingFunctions.[[Resolve]], resolvingFunctions.[[Reject]] »).
            const completion = operations_1.$Call(ctx, executor, intrinsics.undefined, new list_1.$List(resolvingFunctions['[[Resolve]]'], resolvingFunctions['[[Reject]]']));
            // 10. If completion is an abrupt completion, then
            if (completion.isAbrupt) {
                // 10. a. Perform ? Call(resolvingFunctions.[[Reject]], undefined, « completion.[[Value]] »).
                const $CallResult = operations_1.$Call(ctx, resolvingFunctions['[[Reject]]'], intrinsics.undefined, new list_1.$List(completion));
                if ($CallResult.isAbrupt) {
                    return $CallResult;
                }
            }
            // 11. Return promise.
            return promise;
        }
    }
    exports.$PromiseConstructor = $PromiseConstructor;
    // http://www.ecma-international.org/ecma-262/#sec-properties-of-the-promise-constructor
    // 25.6.4 Properties of the Promise Constructor
    // http://www.ecma-international.org/ecma-262/#sec-promise.all
    // 25.6.4.1 Promise.all ( iterable )
    class $Promise_all extends function_1.$BuiltinFunction {
        constructor(realm, functionPrototype) {
            super(realm, '%Promise_all%', functionPrototype);
        }
        performSteps(ctx, thisArgument, [iterable], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (iterable === void 0) {
                iterable = intrinsics.undefined;
            }
            // 1. Let C be the this value.
            const C = thisArgument;
            // 2. If Type(C) is not Object, throw a TypeError exception.
            if (!C.isObject) {
                return new error_1.$TypeError(realm, `Expected 'this' to be an object, but got: ${C}`);
            }
            // 3. Let promiseCapability be ? NewPromiseCapability(C).
            const promiseCapability = $NewPromiseCapability(ctx, C);
            if (promiseCapability.isAbrupt) {
                return promiseCapability;
            }
            // 4. Let iteratorRecord be GetIterator(iterable).
            const iteratorRecord = iteration_1.$GetIterator(ctx, iterable);
            if (iteratorRecord.isAbrupt) {
                return iteratorRecord;
            } // TODO: we sure about this? spec doesn't say
            // 5. IfAbruptRejectPromise(iteratorRecord, promiseCapability).
            const maybeAbrupt = $IfAbruptRejectPromise(ctx, iteratorRecord, promiseCapability);
            if (maybeAbrupt.isAbrupt) {
                return maybeAbrupt;
            }
            // 6. Let result be PerformPromiseAll(iteratorRecord, C, promiseCapability).
            let result = PerformPromiseAll(ctx, iteratorRecord, C, promiseCapability);
            // 7. If result is an abrupt completion, then
            if (result.isAbrupt) {
                // 7. a. If iteratorRecord.[[Done]] is false, set result to IteratorClose(iteratorRecord, result).
                if (iteratorRecord['[[Done]]'].isFalsey) {
                    result = iteration_1.$IteratorClose(ctx, iteratorRecord, result);
                }
                // 7. b. IfAbruptRejectPromise(result, promiseCapability).
                const maybeAbrupt = $IfAbruptRejectPromise(ctx, result, promiseCapability);
                if (maybeAbrupt.isAbrupt) {
                    return maybeAbrupt;
                }
            }
            // 8. Return Completion(result).
            return result; // TODO: fix typings $Empty shenanigans
        }
    }
    exports.$Promise_all = $Promise_all;
    // http://www.ecma-international.org/ecma-262/#sec-performpromiseall
    // 25.6.4.1.1 Runtime Semantics: PerformPromiseAll ( iteratorRecord , constructor , resultCapability )
    function PerformPromiseAll(ctx, iteratorRecord, constructor, resultCapability) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        // 1. Assert: IsConstructor(constructor) is true.
        // 2. Assert: resultCapability is a PromiseCapability Record.
        // 3. Let values be a new empty List.
        const values = new list_1.$List();
        // 4. Let remainingElementsCount be a new Record { [[Value]]: 1 }.
        const remainingElementsCount = new _shared_1.$ValueRecord(1);
        // 5. Let index be 0.
        let index = 0;
        // 6. Repeat,
        while (true) {
            // 6. a. Let next be IteratorStep(iteratorRecord).
            const next = iteration_1.$IteratorStep(ctx, iteratorRecord);
            // 6. b. If next is an abrupt completion, set iteratorRecord.[[Done]] to true.
            // 6. c. ReturnIfAbrupt(next).
            if (next.isAbrupt) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
                return next;
            }
            // 6. d. If next is false, then
            if (next.isFalsey) {
                // 6. d. i. Set iteratorRecord.[[Done]] to true.
                iteratorRecord['[[Done]]'] = intrinsics.true;
                // 6. d. ii. Set remainingElementsCount.[[Value]] to remainingElementsCount.[[Value]] - 1.
                // 6. d. iii. If remainingElementsCount.[[Value]] is 0, then
                if (--remainingElementsCount['[[Value]]'] === 0) {
                    // 6. d. iii. 1. Let valuesArray be CreateArrayFromList(values).
                    const valuesArray = array_1.$CreateArrayFromList(ctx, values);
                    // 6. d. iii. 2. Perform ? Call(resultCapability.[[Resolve]], undefined, « valuesArray »).
                    const $CallResult = operations_1.$Call(ctx, resultCapability['[[Resolve]]'], intrinsics.undefined, new list_1.$List(valuesArray));
                    if ($CallResult.isAbrupt) {
                        return $CallResult;
                    }
                }
                // 6. d. iv. Return resultCapability.[[Promise]].
                return resultCapability['[[Promise]]'];
            }
            // 6. e. Let nextValue be IteratorValue(next).
            const nextValue = iteration_1.$IteratorValue(ctx, next);
            // 6. f. If nextValue is an abrupt completion, set iteratorRecord.[[Done]] to true.
            // 6. g. ReturnIfAbrupt(nextValue).
            if (nextValue.isAbrupt) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
                return nextValue;
            }
            // 6. h. Append undefined to values.
            values.push(new undefined_1.$Undefined(realm));
            // 6. i. Let nextPromise be ? Invoke(constructor, "resolve", « nextValue »).
            const nextPromise = operations_1.$Invoke(ctx, constructor, intrinsics.resolve, new list_1.$List(nextValue)); // TODO: fix $Empty typing shenanigans
            if (nextPromise.isAbrupt) {
                return nextPromise;
            }
            // 6. j. Let steps be the algorithm steps defined in Promise.all Resolve Element Functions.
            // 6. k. Let resolveElement be CreateBuiltinFunction(steps, « [[AlreadyCalled]], [[Index]], [[Values]], [[Capability]], [[RemainingElements]] »).
            // 6. l. Set resolveElement.[[AlreadyCalled]] to a new Record { [[Value]]: false }.
            // 6. m. Set resolveElement.[[Index]] to index.
            // 6. n. Set resolveElement.[[Values]] to values.
            // 6. o. Set resolveElement.[[Capability]] to resultCapability.
            // 6. p. Set resolveElement.[[RemainingElements]] to remainingElementsCount.
            const resolveElement = new $Promise_all_ResolveElement(realm, new _shared_1.$ValueRecord(false), index, values, resultCapability, remainingElementsCount);
            // 6. q. Set remainingElementsCount.[[Value]] to remainingElementsCount.[[Value]] + 1.
            ++remainingElementsCount['[[Value]]'];
            // 6. r. Perform ? Invoke(nextPromise, "then", « resolveElement, resultCapability.[[Reject]] »).
            const $InvokeResult = operations_1.$Invoke(ctx, nextPromise, intrinsics.then, new list_1.$List(resolveElement, resultCapability['[[Reject]]']));
            if ($InvokeResult.isAbrupt) {
                return $InvokeResult;
            }
            // 6. s. Increase index by 1.
            ++index;
        }
    }
    // http://www.ecma-international.org/ecma-262/#sec-promise.all-resolve-element-functions
    // 25.6.4.1.2 Promise.all Resolve Element Functions
    class $Promise_all_ResolveElement extends function_1.$BuiltinFunction {
        constructor(realm, alreadyCalled, index, values, capability, remainingElements) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, 'Promise.all Resolve Element', intrinsics['%FunctionPrototype%']);
            this['[[AlreadyCalled]]'] = alreadyCalled;
            this['[[Index]]'] = index;
            this['[[Values]]'] = values;
            this['[[Capability]]'] = capability;
            this['[[RemainingElements]]'] = remainingElements;
        }
        performSteps(ctx, thisArgument, [x], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (x === void 0) {
                x = intrinsics.undefined;
            }
            // 1. Let F be the active function object.
            const F = this;
            // 2. Let alreadyCalled be F.[[AlreadyCalled]].
            const alreadyCalled = F['[[AlreadyCalled]]'];
            // 3. If alreadyCalled.[[Value]] is true, return undefined.
            if (alreadyCalled['[[Value]]']) {
                return intrinsics.undefined;
            }
            // 4. Set alreadyCalled.[[Value]] to true.
            alreadyCalled['[[Value]]'] = true;
            // 5. Let index be F.[[Index]].
            const index = F['[[Index]]'];
            // 6. Let values be F.[[Values]].
            const values = F['[[Values]]'];
            // 7. Let promiseCapability be F.[[Capability]].
            const promiseCapability = F['[[Capability]]'];
            // 8. Let remainingElementsCount be F.[[RemainingElements]].
            const remainingElementsCount = F['[[RemainingElements]]'];
            // 9. Set values[index] to x.
            values[index] = x;
            // 10. Set remainingElementsCount.[[Value]] to remainingElementsCount.[[Value]] - 1.
            // 11. If remainingElementsCount.[[Value]] is 0, then
            if (--remainingElementsCount['[[Value]]'] === 0) {
                // 11. a. Let valuesArray be CreateArrayFromList(values).
                const valuesArray = array_1.$CreateArrayFromList(ctx, values);
                // 11. b. Return ? Call(promiseCapability.[[Resolve]], undefined, « valuesArray »).
                return operations_1.$Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new list_1.$List(valuesArray));
            }
            // 12. Return undefined.
            return intrinsics.undefined;
        }
    }
    exports.$Promise_all_ResolveElement = $Promise_all_ResolveElement;
    // http://www.ecma-international.org/ecma-262/#sec-promise.race
    // 25.6.4.3 Promise.race ( iterable )
    class $Promise_race extends function_1.$BuiltinFunction {
        constructor(realm, functionPrototype) {
            super(realm, '%Promise_race%', functionPrototype);
        }
        performSteps(ctx, thisArgument, [iterable], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (iterable === void 0) {
                iterable = intrinsics.undefined;
            }
            // 1. Let C be the this value.
            const C = thisArgument;
            // 2. If Type(C) is not Object, throw a TypeError exception.
            if (!C.isObject) {
                return new error_1.$TypeError(realm, `Expected 'this' to be an object, but got: ${C}`);
            }
            // 3. Let promiseCapability be ? NewPromiseCapability(C).
            const promiseCapability = $NewPromiseCapability(ctx, C);
            if (promiseCapability.isAbrupt) {
                return promiseCapability;
            }
            // 4. Let iteratorRecord be GetIterator(iterable).
            const iteratorRecord = iteration_1.$GetIterator(ctx, iterable);
            if (iteratorRecord.isAbrupt) {
                return iteratorRecord;
            } // TODO: we sure about this? spec doesn't say
            // 5. IfAbruptRejectPromise(iteratorRecord, promiseCapability).
            const maybeAbrupt = $IfAbruptRejectPromise(ctx, iteratorRecord, promiseCapability);
            if (maybeAbrupt.isAbrupt) {
                return maybeAbrupt;
            }
            // 6. Let result be PerformPromiseAll(iteratorRecord, C, promiseCapability).
            let result = PerformPromiseAll(ctx, iteratorRecord, C, promiseCapability);
            // 7. If result is an abrupt completion, then
            if (result.isAbrupt) {
                // 7. a. If iteratorRecord.[[Done]] is false, set result to IteratorClose(iteratorRecord, result).
                if (iteratorRecord['[[Done]]'].isFalsey) {
                    result = iteration_1.$IteratorClose(ctx, iteratorRecord, result);
                }
                // 7. b. IfAbruptRejectPromise(result, promiseCapability).
                const maybeAbrupt = $IfAbruptRejectPromise(ctx, result, promiseCapability);
                if (maybeAbrupt.isAbrupt) {
                    return maybeAbrupt;
                }
            }
            // 8. Return Completion(result).
            return result; // TODO: fix typings $Empty shenanigans
        }
    }
    exports.$Promise_race = $Promise_race;
    // http://www.ecma-international.org/ecma-262/#sec-performpromiserace
    // 25.6.4.3.1 Runtime Semantics: PerformPromiseRace ( iteratorRecord , constructor , resultCapability )
    function $PerformPromiseRace(ctx, iteratorRecord, constructor, resultCapability) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        // 1. Assert: IsConstructor(constructor) is true.
        // 2. Assert: resultCapability is a PromiseCapability Record.
        // 3. Repeat,
        while (true) {
            // 3. a. Let next be IteratorStep(iteratorRecord).
            const next = iteration_1.$IteratorStep(ctx, iteratorRecord);
            // 3. b. If next is an abrupt completion, set iteratorRecord.[[Done]] to true.
            // 3. c. ReturnIfAbrupt(next).
            if (next.isAbrupt) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
                return next;
            }
            // 3. d. If next is false, then
            if (next.isFalsey) {
                // 3. d. i. Set iteratorRecord.[[Done]] to true.
                iteratorRecord['[[Done]]'] = intrinsics.true;
                // 3. d. ii. Return resultCapability.[[Promise]].
                return resultCapability['[[Promise]]'];
            }
            // 3. e. Let nextValue be IteratorValue(next).
            const nextValue = iteration_1.$IteratorValue(ctx, next);
            // 3. f. If nextValue is an abrupt completion, set iteratorRecord.[[Done]] to true.
            // 3. g. ReturnIfAbrupt(nextValue).
            if (nextValue.isAbrupt) {
                iteratorRecord['[[Done]]'] = intrinsics.true;
                return nextValue;
            }
            // 3. h. Let nextPromise be ? Invoke(constructor, "resolve", « nextValue »).
            const nextPromise = operations_1.$Invoke(ctx, constructor, intrinsics.resolve, new list_1.$List(nextValue)); // TODO: fix $Empty typing shenanigans
            if (nextPromise.isAbrupt) {
                return nextPromise;
            }
            // 3. i. Perform ? Invoke(nextPromise, "then", « resultCapability.[[Resolve]], resultCapability.[[Reject]] »).
            const $InvokeResult = operations_1.$Invoke(ctx, nextPromise, intrinsics.then, new list_1.$List(resultCapability['[[Resolve]]'], resultCapability['[[Reject]]']));
            if ($InvokeResult.isAbrupt) {
                return $InvokeResult;
            }
        }
    }
    exports.$PerformPromiseRace = $PerformPromiseRace;
    // http://www.ecma-international.org/ecma-262/#sec-promise.reject
    // 25.6.4.4 Promise.reject ( r )
    class $Promise_reject extends function_1.$BuiltinFunction {
        constructor(realm, functionPrototype) {
            super(realm, '%Promise_reject%', functionPrototype);
        }
        performSteps(ctx, thisArgument, [r], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (r === void 0) {
                r = intrinsics.undefined;
            }
            // 1. Let C be the this value.
            const C = thisArgument;
            // 2. If Type(C) is not Object, throw a TypeError exception.
            if (!C.isObject) {
                return new error_1.$TypeError(realm, `Expected 'this' to be an object, but got: ${C}`);
            }
            // 3. Let promiseCapability be ? NewPromiseCapability(C).
            const promiseCapability = $NewPromiseCapability(ctx, C);
            if (promiseCapability.isAbrupt) {
                return promiseCapability;
            }
            // 4. Perform ? Call(promiseCapability.[[Reject]], undefined, « r »).
            const $CallResult = operations_1.$Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new list_1.$List(r));
            if ($CallResult.isAbrupt) {
                return $CallResult;
            }
            // 5. Return promiseCapability.[[Promise]].
            return promiseCapability['[[Promise]]']; // TODO: verify if cast is safe
        }
    }
    exports.$Promise_reject = $Promise_reject;
    // http://www.ecma-international.org/ecma-262/#sec-promise.resolve
    // 25.6.4.5 Promise.resolve ( x )
    class $Promise_resolve extends function_1.$BuiltinFunction {
        constructor(realm, functionPrototype) {
            super(realm, '%Promise_resolve%', functionPrototype);
        }
        performSteps(ctx, thisArgument, [x], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (x === void 0) {
                x = intrinsics.undefined;
            }
            // 1. Let C be the this value.
            const C = thisArgument;
            // 2. If Type(C) is not Object, throw a TypeError exception.
            if (!C.isObject) {
                return new error_1.$TypeError(realm, `Expected 'this' to be an object, but got: ${C}`);
            }
            // 3. Return ? PromiseResolve(C, x).
            return $PromiseResolve(ctx, C, x);
        }
    }
    exports.$Promise_resolve = $Promise_resolve;
    // http://www.ecma-international.org/ecma-262/#sec-promise-resolve
    // 25.6.4.5.1 PromiseResolve ( C , x )
    function $PromiseResolve(ctx, C, x) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        // 1. Assert: Type(C) is Object.
        // 2. If IsPromise(x) is true, then
        if (x instanceof $PromiseInstance) {
            // 2. a. Let xConstructor be ? Get(x, "constructor").
            const xConstructor = x['[[Get]]'](ctx, intrinsics.$constructor, x);
            // 2. b. If SameValue(xConstructor, C) is true, return x.
            if (xConstructor.is(C)) {
                return x;
            }
        }
        // 3. Let promiseCapability be ? NewPromiseCapability(C).
        const promiseCapability = $NewPromiseCapability(ctx, C);
        if (promiseCapability.isAbrupt) {
            return promiseCapability;
        }
        // 4. Perform ? Call(promiseCapability.[[Resolve]], undefined, « x »).
        const $CallResult = operations_1.$Call(ctx, promiseCapability['[[Resolve]]'], intrinsics.undefined, new list_1.$List(x));
        if ($CallResult.isAbrupt) {
            return $CallResult;
        }
        // 5. Return promiseCapability.[[Promise]].
        return promiseCapability['[[Promise]]']; // TODO: verify if cast is safe
    }
    exports.$PromiseResolve = $PromiseResolve;
    // #endregion
    // http://www.ecma-international.org/ecma-262/#sec-properties-of-the-promise-prototype-object
    // #region 25.6.5 Properties of the Promise Prototype Object
    class $PromisePrototype extends object_1.$Object {
        // http://www.ecma-international.org/ecma-262/#sec-promise.prototype.catch
        // 25.6.5.1 Promise.prototype.catch ( onRejected )
        get catch() {
            return this.getProperty(this.realm['[[Intrinsics]]'].catch)['[[Value]]'];
        }
        set catch(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]'].catch, value);
        }
        // http://www.ecma-international.org/ecma-262/#sec-promise.prototype.constructor
        // 25.6.5.2 Promise.prototype.constructor
        get $constructor() {
            return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'];
        }
        set $constructor(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
        }
        // http://www.ecma-international.org/ecma-262/#sec-promise.prototype.finally
        // 25.6.5.3 Promise.prototype.finally ( onFinally )
        get finally() {
            return this.getProperty(this.realm['[[Intrinsics]]'].finally)['[[Value]]'];
        }
        set finally(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]'].finally, value);
        }
        // http://www.ecma-international.org/ecma-262/#sec-promise.prototype.then
        // 25.6.5.4 Promise.prototype.then ( onFulfilled , onRejected )
        get then() {
            return this.getProperty(this.realm['[[Intrinsics]]'].then)['[[Value]]'];
        }
        set then(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]'].then, value);
        }
        // http://www.ecma-international.org/ecma-262/#sec-promise.prototype-@@tostringtag
        // 25.6.5.5 Promise.prototype [ @@toStringTag ]
        get '@@toStringTag'() {
            return this.getProperty(this.realm['[[Intrinsics]]']['@@toStringTag'])['[[Value]]'];
        }
        set '@@toStringTag'(value) {
            this.setDataProperty(this.realm['[[Intrinsics]]']['@@toStringTag'], value, false, false, true);
        }
        constructor(realm, proto) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, '%PromisePrototype%', proto, 1 /* normal */, intrinsics.empty);
        }
    }
    exports.$PromisePrototype = $PromisePrototype;
    // http://www.ecma-international.org/ecma-262/#sec-promise.prototype.catch
    // 25.6.5.1 Promise.prototype.catch ( onRejected )
    class $PromiseProto_catch extends function_1.$BuiltinFunction {
        constructor(realm, proto) {
            super(realm, '%PromiseProto_catch%', proto);
        }
        performSteps(ctx, thisArgument, [onRejected], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (onRejected === void 0) {
                onRejected = intrinsics.undefined;
            }
            // 1. Let promise be the this value.
            const promise = thisArgument;
            // 2. Return ? Invoke(promise, "then", « undefined, onRejected »).
            return operations_1.$Invoke(ctx, promise, intrinsics.then, new list_1.$List(intrinsics.undefined, onRejected)); // TODO: fix $Empty typings
        }
    }
    exports.$PromiseProto_catch = $PromiseProto_catch;
    // http://www.ecma-international.org/ecma-262/#sec-promise.prototype.finally
    // 25.6.5.3 Promise.prototype.finally ( onFinally )
    class $PromiseProto_finally extends function_1.$BuiltinFunction {
        constructor(realm, proto) {
            super(realm, '%PromiseProto_finally%', proto);
        }
        performSteps(ctx, thisArgument, [onFinally], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (onFinally === void 0) {
                onFinally = intrinsics.undefined;
            }
            // 1. Let promise be the this value.
            const promise = thisArgument;
            // 2. If Type(promise) is not Object, throw a TypeError exception.
            if (!promise.isObject) {
                return new error_1.$TypeError(realm, `Expected 'this' to be an object, but got: ${promise}`);
            }
            // 3. Let C be ? SpeciesConstructor(promise, %Promise%).
            const C = operations_1.$SpeciesConstructor(ctx, promise, intrinsics['%Promise%']);
            if (C.isAbrupt) {
                return C;
            }
            let thenFinally;
            let catchFinally;
            // 4. Assert: IsConstructor(C) is true.
            // 5. If IsCallable(onFinally) is false, then
            if (!onFinally.isFunction) {
                // 5. a. Let thenFinally be onFinally.
                thenFinally = onFinally;
                // 5. b. Let catchFinally be onFinally.
                catchFinally = onFinally;
            }
            // 6. Else,
            else {
                // 6. a. Let stepsThenFinally be the algorithm steps defined in Then Finally Functions.
                // 6. b. Let thenFinally be CreateBuiltinFunction(stepsThenFinally, « [[Constructor]], [[OnFinally]] »).
                // 6. c. Set thenFinally.[[Constructor]] to C.
                // 6. d. Set thenFinally.[[OnFinally]] to onFinally.
                thenFinally = new $ThenFinally(realm, C, onFinally);
                // 6. e. Let stepsCatchFinally be the algorithm steps defined in Catch Finally Functions.
                // 6. f. Let catchFinally be CreateBuiltinFunction(stepsCatchFinally, « [[Constructor]], [[OnFinally]] »).
                // 6. g. Set catchFinally.[[Constructor]] to C.
                // 6. h. Set catchFinally.[[OnFinally]] to onFinally.
                catchFinally = new $CatchFinally(realm, C, onFinally);
            }
            // 7. Return ? Invoke(promise, "then", « thenFinally, catchFinally »).
            return operations_1.$Invoke(ctx, promise, intrinsics.then, new list_1.$List(thenFinally, catchFinally)); // TODO: fix typings $Empty shenanigans
        }
    }
    exports.$PromiseProto_finally = $PromiseProto_finally;
    // http://www.ecma-international.org/ecma-262/#sec-thenfinallyfunctions
    // 25.6.5.3.1 Then Finally Functions
    class $ThenFinally extends function_1.$BuiltinFunction {
        constructor(realm, constructor, onFinally) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, 'Then Finally', intrinsics['%FunctionPrototype%']);
            this['[[Constructor]]'] = constructor;
            this['[[OnFinally]]'] = onFinally;
        }
        performSteps(ctx, thisArgument, [value], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (value === void 0) {
                value = intrinsics.undefined;
            }
            // 1. Let F be the active function object.
            const F = this;
            // 2. Let onFinally be F.[[OnFinally]].
            const onFinally = F['[[OnFinally]]'];
            // 3. Assert: IsCallable(onFinally) is true.
            // 4. Let result be ? Call(onFinally, undefined).
            const result = operations_1.$Call(ctx, onFinally, intrinsics.undefined, intrinsics.undefined);
            if (result.isAbrupt) {
                return result;
            }
            // 5. Let C be F.[[Constructor]].
            const C = F['[[Constructor]]'];
            // 6. Assert: IsConstructor(C) is true.
            // 7. Let promise be ? PromiseResolve(C, result).
            const promise = $PromiseResolve(ctx, C, result);
            if (promise.isAbrupt) {
                return promise;
            }
            // 8. Let valueThunk be equivalent to a function that returns value.
            const valueThunk = new $ValueThunk(realm, value);
            // 9. Return ? Invoke(promise, "then", « valueThunk »).
            return operations_1.$Invoke(ctx, promise, intrinsics.then, new list_1.$List(valueThunk)); // TODO: fix typings $Empty shenanigans
        }
    }
    exports.$ThenFinally = $ThenFinally;
    class $ValueThunk extends function_1.$BuiltinFunction {
        constructor(realm, value) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, 'ValueThunk', intrinsics['%FunctionPrototype%']);
            this.value = value;
        }
        performSteps(ctx, thisArgument, argumentsList, NewTarget) {
            return this.value;
        }
    }
    exports.$ValueThunk = $ValueThunk;
    // http://www.ecma-international.org/ecma-262/#sec-catchfinallyfunctions
    // 25.6.5.3.2 Catch Finally Functions
    class $CatchFinally extends function_1.$BuiltinFunction {
        constructor(realm, constructor, onFinally) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, 'Catch Finally', intrinsics['%FunctionPrototype%']);
            this['[[Constructor]]'] = constructor;
            this['[[OnFinally]]'] = onFinally;
        }
        performSteps(ctx, thisArgument, [value], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (value === void 0) {
                value = intrinsics.undefined;
            }
            // 1. Let F be the active function object.
            const F = this;
            // 2. Let onFinally be F.[[OnFinally]].
            const onFinally = F['[[OnFinally]]'];
            // 3. Assert: IsCallable(onFinally) is true.
            // 4. Let result be ? Call(onFinally, undefined).
            const result = operations_1.$Call(ctx, onFinally, intrinsics.undefined, intrinsics.undefined);
            if (result.isAbrupt) {
                return result;
            }
            // 5. Let C be F.[[Constructor]].
            const C = F['[[Constructor]]'];
            // 6. Assert: IsConstructor(C) is true.
            // 7. Let promise be ? PromiseResolve(C, result).
            const promise = $PromiseResolve(ctx, C, result);
            if (promise.isAbrupt) {
                return promise;
            }
            // 8. Let thrower be equivalent to a function that throws reason.
            const thrower = new $Thrower(realm, value);
            // 9. Return ? Invoke(promise, "then", « thrower »).
            return operations_1.$Invoke(ctx, promise, intrinsics.then, new list_1.$List(thrower)); // TODO: fix typings $Empty shenanigans
        }
    }
    exports.$CatchFinally = $CatchFinally;
    class $Thrower extends function_1.$BuiltinFunction {
        constructor(realm, reason) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, 'Thrower', intrinsics['%FunctionPrototype%']);
            this.reason = reason;
        }
        performSteps(ctx, thisArgument, argumentsList, NewTarget) {
            // TODO: double check if this is the correct way to throw
            return this.reason.ToCompletion(5 /* throw */, ctx.Realm['[[Intrinsics]]'].empty);
        }
    }
    exports.$Thrower = $Thrower;
    // http://www.ecma-international.org/ecma-262/#sec-promise.prototype.then
    // 25.6.5.4 Promise.prototype.then ( onFulfilled , onRejected )
    class $PromiseProto_then extends function_1.$BuiltinFunction {
        constructor(realm, proto) {
            super(realm, '%PromiseProto_then%', proto);
        }
        performSteps(ctx, thisArgument, [onFulfilled, onRejected], NewTarget) {
            const realm = ctx.Realm;
            const intrinsics = realm['[[Intrinsics]]'];
            if (onFulfilled === void 0) {
                onFulfilled = intrinsics.undefined;
            }
            if (onRejected === void 0) {
                onRejected = intrinsics.undefined;
            }
            // 1. Let promise be the this value.
            const promise = thisArgument;
            // 2. If IsPromise(promise) is false, throw a TypeError exception.
            if (!promise.isObject) {
                return new error_1.$TypeError(realm, `Expected 'this' to be an object, but got: ${promise}`);
            }
            // 3. Let C be ? SpeciesConstructor(promise, %Promise%).
            const C = operations_1.$SpeciesConstructor(ctx, promise, intrinsics['%Promise%']);
            if (C.isAbrupt) {
                return C;
            }
            // 4. Let resultCapability be ? NewPromiseCapability(C).
            const resultCapability = $NewPromiseCapability(ctx, C);
            if (resultCapability.isAbrupt) {
                return resultCapability;
            }
            // 5. Return PerformPromiseThen(promise, onFulfilled, onRejected, resultCapability).
            return $PerformPromiseThen(ctx, 
            // TODO: verify if this cast is safe
            promise, onFulfilled, onRejected, resultCapability);
        }
    }
    exports.$PromiseProto_then = $PromiseProto_then;
    // http://www.ecma-international.org/ecma-262/#sec-performpromisethen
    // 25.6.5.4.1 PerformPromiseThen ( promise , onFulfilled , onRejected [ , resultCapability ] )
    function $PerformPromiseThen(ctx, promise, onFulfilled, onRejected, resultCapability) {
        const realm = ctx.Realm;
        const intrinsics = realm['[[Intrinsics]]'];
        // 1. Assert: IsPromise(promise) is true.
        // 2. If resultCapability is present, then
        if (resultCapability !== void 0) {
            // 2. a. Assert: resultCapability is a PromiseCapability Record.
        }
        // 3. Else,
        else {
            // 3. a. Set resultCapability to undefined.
            resultCapability = intrinsics.undefined;
        }
        // 4. If IsCallable(onFulfilled) is false, then
        if (!onFulfilled.isFunction) {
            // 4. a. Set onFulfilled to undefined.
            onFulfilled = intrinsics.undefined;
        }
        // 5. If IsCallable(onRejected) is false, then
        if (!onRejected.isFunction) {
            // 5. a. Set onRejected to undefined.
            onRejected = intrinsics.undefined;
        }
        // 6. Let fulfillReaction be the PromiseReaction { [[Capability]]: resultCapability, [[Type]]: "Fulfill", [[Handler]]: onFulfilled }.
        const fulfillReaction = new $PromiseReaction(resultCapability, 1 /* Fulfill */, onFulfilled);
        // 7. Let rejectReaction be the PromiseReaction { [[Capability]]: resultCapability, [[Type]]: "Reject", [[Handler]]: onRejected }.
        const rejectReaction = new $PromiseReaction(resultCapability, 2 /* Reject */, onRejected);
        // 8. If promise.[[PromiseState]] is "pending", then
        if (promise['[[PromiseState]]'] === 1 /* pending */) {
            // 8. a. Append fulfillReaction as the last element of the List that is promise.[[PromiseFulfillReactions]].
            promise['[[PromiseFulfillReactions]]'].push(fulfillReaction);
            // 8. b. Append rejectReaction as the last element of the List that is promise.[[PromiseRejectReactions]].
            promise['[[PromiseRejectReactions]]'].push(rejectReaction);
        }
        // 9. Else if promise.[[PromiseState]] is "fulfilled", then
        else if (promise['[[PromiseState]]'] === 2 /* fulfilled */) {
            // 9. a. Let value be promise.[[PromiseResult]].
            const value = promise['[[PromiseResult]]'];
            // 9. b. Perform EnqueueJob("PromiseJobs", PromiseReactionJob, « fulfillReaction, value »).
            realm.PromiseJobs.EnqueueJob(ctx, new PromiseReactionJob(realm, ctx.ScriptOrModule, fulfillReaction, value));
        }
        // 10. Else,
        else {
            // 10. a. Assert: The value of promise.[[PromiseState]] is "rejected".
            // 10. b. Let reason be promise.[[PromiseResult]].
            const reason = promise['[[PromiseResult]]'];
            // 10. c. If promise.[[PromiseIsHandled]] is false, perform HostPromiseRejectionTracker(promise, "handle").
            if (!promise['[[PromiseIsHandled]]']) {
                $HostPromiseRejectionTracker(ctx, promise, 2 /* handle */);
            }
            // 10. d. Perform EnqueueJob("PromiseJobs", PromiseReactionJob, « rejectReaction, reason »).
            realm.PromiseJobs.EnqueueJob(ctx, new PromiseReactionJob(realm, ctx.ScriptOrModule, rejectReaction, reason));
        }
        // 11. Set promise.[[PromiseIsHandled]] to true.
        promise['[[PromiseIsHandled]]'] = true;
        // 12. If resultCapability is undefined, then
        if (resultCapability === void 0 || resultCapability.isUndefined) {
            // 12. a. Return undefined.
            return intrinsics.undefined;
        }
        // 13. Else,
        else {
            // 13. a. Return resultCapability.[[Promise]].
            return resultCapability['[[Promise]]'];
        }
    }
    exports.$PerformPromiseThen = $PerformPromiseThen;
    // #endregion
    // http://www.ecma-international.org/ecma-262/#sec-properties-of-promise-instances
    // #region 25.6.6 Properties of Promise Instances
    var PromiseState;
    (function (PromiseState) {
        PromiseState[PromiseState["pending"] = 1] = "pending";
        PromiseState[PromiseState["fulfilled"] = 2] = "fulfilled";
        PromiseState[PromiseState["rejected"] = 3] = "rejected";
    })(PromiseState = exports.PromiseState || (exports.PromiseState = {}));
    // http://www.ecma-international.org/ecma-262/#sec-properties-of-promise-instances
    // 25.6.6 Properties of Promise Instances
    class $PromiseInstance extends object_1.$Object {
        constructor(realm, proto) {
            const intrinsics = realm['[[Intrinsics]]'];
            super(realm, 'PromiseInstance', proto, 1 /* normal */, intrinsics.empty);
            // 4. Set promise.[[PromiseState]] to "pending".
            this['[[PromiseState]]'] = 1 /* pending */;
            this['[[PromiseResult]]'] = void 0;
            // 5. Set promise.[[PromiseFulfillReactions]] to a new empty List.
            this['[[PromiseFulfillReactions]]'] = new list_1.$List();
            // 6. Set promise.[[PromiseRejectReactions]] to a new empty List.
            this['[[PromiseRejectReactions]]'] = new list_1.$List();
            // 7. Set promise.[[PromiseIsHandled]] to false.
            this['[[PromiseIsHandled]]'] = false;
        }
        static Create(ctx, NewTarget) {
            const proto = function_1.$GetPrototypeFromConstructor(ctx, NewTarget, '%PromisePrototype%');
            if (proto.isAbrupt) {
                return proto;
            }
            return new $PromiseInstance(ctx.Realm, proto);
        }
    }
    exports.$PromiseInstance = $PromiseInstance;
});
// #endregion
//# sourceMappingURL=promise.js.map