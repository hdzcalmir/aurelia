// // NOTE: These linting rules are *only* disabled here because these tests are specifically tailored to simulate different timing
// // situations, one of which being where end-users don't use async/await. Using async/await on top of a Promise.resolve-like construct
// // results in two microTask ticks that must be awaited, and we want to specifically test whether that works of course, but also
// // whether things behave correctly with just one tick.
// // Thus, due to the nature of these tests, we just don't want any squiggles here suggesting that anything needs fixing here,
// // because it doesn't. Please leave these two rules disabled even if it so happens that one of them doesn't even apply.

// /* eslint-disable @typescript-eslint/require-await */
// import {
//   Registration,
//   LoggerConfiguration,
//   LogLevel,
//   Constructable,
//   pascalCase,
// } from '@aurelia/kernel';
// import {
//   customElement,
//   bindable,
//   Controller,
//   LifecycleFlags,
//   Aurelia,
// } from '@aurelia/runtime-html';

// import {
//   TestContext,
//   assert,
// } from '@aurelia/testing';

// function createAuFixture<T extends Constructable>(
//   Component: T,
//   createConfig: () => Config,
// ) {
//   const config = createConfig();
//   const ctx = TestContext.create();
//   const { container } = ctx;

//   container.register(Registration.instance(Config, config));
//   container.register(LoggerConfiguration.create({ $console: console, level: LogLevel.warn }));
//   const calls = container.get(Calls);
//   const component = container.get(Component);

//   const au = new Aurelia(container);
//   const host = ctx.createElement('div');

//   au.app({ component, host });

//   return { ctx, au, host, config, calls, component };
// }

// function createControllerFixture<T extends Constructable>(
//   Component: T,
//   createConfig: () => Config,
// ) {
//   const config = createConfig();
//   const ctx = TestContext.create();
//   const { container } = ctx;

//   container.register(Registration.instance(Config, config));
//   container.register(LoggerConfiguration.create({ $console: console, level: LogLevel.warn }));
//   const calls = container.get(Calls);
//   const component = container.get(Component);

//   const controller = createController(ctx, Component);

//   return { ctx, controller, config, calls, component };
// }

// function createController<T extends Constructable>(
//   ctx: TestContext,
//   Component: T,
// ) {
//   const { container } = ctx;
//   const component = container.get(Component);

//   const host = ctx.createElement('div');
//   return Controller.forCustomElement(
//     null,
//     container,
//     component,
//     host,
//     void 0,
//   );
// }

// function createWaiter(ms: number): () => Promise<void> {
//   function wait(): Promise<void> {
//     return new Promise(function (resolve) {
//       setTimeout(function () {
//         resolve();
//       }, ms);
//     });
//   }

//   wait.toString = function () {
//     return `setTimeout(cb,${ms})`;
//   };

//   return wait;
// }

// class PromiseTracker {
//   public get promise(): Promise<void> {
//     this.setTimeout(100); // can make this configurable if necessary
//     return this._promise;
//   }
//   private _promise: Promise<void>;
//   private timeout: unknown = null;
//   public history: string[] = [];
//   private $resolve: () => void;

//   public constructor(
//     private readonly calls: Calls,
//     private readonly name: Exclude<keyof Calls, 'history'>,
//   ) {
//     this._promise = new Promise(resolve => this.$resolve = resolve);
//   }

//   public notify(owner: string, callResolve: boolean): void {
//     this.history.push(owner);
//     this.calls.history.push(`${owner}.${this.name}`);

//     if (callResolve) {
//       const $resolve = this.$resolve;
//       this._promise = new Promise(resolve => this.$resolve = resolve);
//       this.clearTimeout();
//       $resolve();
//     }
//   }

//   private setTimeout(ms: number): void {
//     if (this.timeout === null) {
//       this.timeout = setTimeout(() => {
//         throw new Error(`${this.name} timed out after ${ms}ms. Resolution history: [${this.history.join(',')}]. Lifecycle call history: [${this.calls.history.join(',')}]`);
//       }, ms);
//     }
//   }

//   private clearTimeout(): void {
//     const timeout = this.timeout as any; // can be NodeJS.Timeout or number, global typings aren't accurate in this env
//     if (timeout !== null) {
//       this.timeout = null;
//       clearTimeout(timeout);
//     }
//   }
// }

// class Calls {
//   public readonly history: string[] = [];
//   public readonly binding: PromiseTracker = new PromiseTracker(this, 'binding');
//   public readonly bound: PromiseTracker = new PromiseTracker(this, 'bound');
//   public readonly attaching: PromiseTracker = new PromiseTracker(this, 'attaching');
//   public readonly attached: PromiseTracker = new PromiseTracker(this, 'attached');
//   public readonly detaching: PromiseTracker = new PromiseTracker(this, 'detaching');
//   public readonly unbinding: PromiseTracker = new PromiseTracker(this, 'unbinding');
//   public readonly afterUnbind: PromiseTracker = new PromiseTracker(this, 'afterUnbind');
//   public readonly afterUnbindChildren: PromiseTracker = new PromiseTracker(this, 'afterUnbindChildren');
// }

// async function noop(): Promise<void> {
//   return;
// }

// noop.toString = function () {
//   return 'Promise.resolve()';
// };

// class Config {
//   public constructor(
//     public hasPromise: boolean,
//     public hasTimeout: boolean,
//     public wait: () => Promise<void>,
//   ) {}

//   public toString(): string {
//     return `{${this.hasPromise ? this.wait.toString() : 'noWait'}}`;
//   }
// }

// const configFactories = [
//   function () {
//     return new Config(false, false, noop);
//   },
//   function () {
//     return new Config(true, false, noop);
//   },
//   function () {
//     return new Config(true, true, createWaiter(0));
//   },
//   function () {
//     return new Config(true, true, createWaiter(5));
//   },
// ];

// function createComponentType(name: string, template: string, callResolve: boolean) {
//   @customElement({ name, template })
//   class Component {
//     public constructor(
//       private readonly calls: Calls,
//       private readonly config: Config,
//     ) {}

//     public async binding(): Promise<void> {
//       if (this.config.hasPromise) {
//         await this.config.wait();
//       }

//       this.calls.binding.notify(name, callResolve);
//     }

//     public async bound(): Promise<void> {
//       if (this.config.hasPromise) {
//         await this.config.wait();
//       }

//       this.calls.bound.notify(name, callResolve);
//     }

//     public async attaching(): Promise<void> {
//       if (this.config.hasPromise) {
//         await this.config.wait();
//       }

//       this.calls.attaching.notify(name, callResolve);
//     }

//     public async attached(): Promise<void> {
//       if (this.config.hasPromise) {
//         await this.config.wait();
//       }

//       this.calls.attached.notify(name, callResolve);
//     }

//     public async detaching(): Promise<void> {
//       if (this.config.hasPromise) {
//         await this.config.wait();
//       }

//       this.calls.detaching.notify(name, callResolve);
//     }

//     public async unbinding(): Promise<void> {
//       if (this.config.hasPromise) {
//         await this.config.wait();
//       }

//       this.calls.unbinding.notify(name, callResolve);
//     }

//     public async afterUnbind(): Promise<void> {
//       if (this.config.hasPromise) {
//         await this.config.wait();
//       }

//       this.calls.afterUnbind.notify(name, callResolve);
//     }

//     public async afterUnbindChildren(): Promise<void> {
//       if (this.config.hasPromise) {
//         await this.config.wait();
//       }

//       this.calls.afterUnbindChildren.notify(name, callResolve);
//     }
//   }

//   Reflect.defineProperty(Component, 'name', {
//     writable: false,
//     enumerable: false,
//     configurable: true,
//     value: pascalCase(name),
//   });

//   return Component;
// }

// const A1 = createComponentType('a-1', 'a1', true);
// const B1 = createComponentType('b-1', 'b1', false);
// const B2 = createComponentType('b-2', 'b2', false);

// const flags = LifecycleFlags.none;

// @customElement({ name: 'component', template: '<a-1 if.bind="showA1"></a-1>', dependencies: [A1] })
// class A1Toggle {
//   @bindable()
//   public showA1: boolean = false;
// }

// describe('controller short-circuit', function () {
//   for (const createConfig of configFactories) {
//     describe(createConfig().toString(), function () {
//       for (const repeatActivate of [false, true]) {
//         describe(repeatActivate ? 'activate->deactivate->activate' : 'activate', function () {
//           for (const repeatDeactivate of [false, true]) {
//             describe(repeatDeactivate ? 'deactivate->activate->deactivate' : 'deactivate', function () {
//               describe(A1.name, function () {
//                 it('binding', async function () {
//                   const { controller, calls, config } = createControllerFixture(A1, createConfig);
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await Promise.all(promises);
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   controller.dispose();
//                 });

//                 it('bound', async function () {
//                   const { controller, calls, config } = createControllerFixture(A1, createConfig);
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.4`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await Promise.all(promises);
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   controller.dispose();
//                 });

//                 it('attaching', async function () {
//                   const { controller, calls, config } = createControllerFixture(A1, createConfig);
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);
//                   await calls.attaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attaching',
//                   ], `1.5`);

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.5`);
//                   await calls.detaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.detaching',
//                   ], `2.4`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await Promise.all(promises);
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   controller.dispose();
//                 });

//                 it('attached', async function () {
//                   const { controller, calls, config } = createControllerFixture(A1, createConfig);
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);
//                   await calls.attaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attaching',
//                   ], `1.5`);
//                   await calls.attached.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attached',
//                   ], `1.6`);

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.6`);
//                   await calls.detaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.detaching',
//                   ], `2.5`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.4`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.3`);
//                   await calls.afterUnbindChildren.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbindChildren',
//                   ], `2.2`);
//                   await Promise.all(promises);
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   controller.dispose();
//                 });
//               });

//               describe(`${A1.name}>[${B1.name}]`, function () {
//                 // attaching is the last hook before children get involved,
//                 // so no need to also test binding and bound since they also wouldn't have children involved.
//                 // These cases are already covered by A1 tests above.
//                 // Technically this is also a "duplicate" test but it does verify the async parent-child boundary and therefore important to prevent regressions.
//                 it('attaching', async function () {
//                   const { controller, calls, config, ctx } = createControllerFixture(A1, createConfig);
//                   controller.addController(createController(ctx, B1));
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);
//                   await calls.attaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attaching',
//                   ], `1.5`);

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.5`);
//                   await calls.detaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.detaching',
//                   ], `2.4`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await Promise.all(promises);
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   controller.dispose();
//                 });

//                 it('attached', async function () {
//                   const { controller, calls, config, ctx } = createControllerFixture(A1, createConfig);
//                   controller.addController(createController(ctx, B1));
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);
//                   await calls.attaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attaching',
//                   ], `1.5`);
//                   await calls.attached.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'b-1.binding',
//                     'b-1.bound',
//                     'b-1.attaching',
//                     'b-1.attached',
//                     'a-1.attached',
//                   ], `1.6`);

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.6`);
//                   await calls.detaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.detaching',
//                   ], `2.5`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.4`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.3`);
//                   await calls.afterUnbindChildren.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'b-1.detaching',
//                     'b-1.unbinding',
//                     'b-1.afterUnbind',
//                     'b-1.afterUnbindChildren',
//                     'a-1.afterUnbindChildren',
//                   ], `2.2`);
//                   await Promise.all(promises);
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   controller.dispose();
//                 });
//               });

//               describe(`${B1.name}>[${A1.name}]`, function () {
//                 it('binding', async function () {
//                   const { controller, calls, config, ctx } = createControllerFixture(B1, createConfig);
//                   controller.addController(createController(ctx, A1));
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.binding',
//                       'b-1.bound',
//                       'b-1.attaching',
//                       'a-1.binding',
//                     ], `1.1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.binding',
//                     ], `1.2.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.bound',
//                       'b-1.attaching',
//                       'a-1.binding',
//                     ], `1.2.2`);
//                   }

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await Promise.all(promises);
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'b-1.detaching',
//                     'b-1.unbinding',
//                     'b-1.afterUnbind',
//                   ], `2.1`);

//                   controller.dispose();
//                 });

//                 it('bound', async function () {
//                   const { controller, calls, config, ctx } = createControllerFixture(B1, createConfig);
//                   controller.addController(createController(ctx, A1));
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.binding',
//                       'b-1.bound',
//                       'b-1.attaching',
//                       'a-1.binding',
//                     ], `1.1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.binding',
//                     ], `1.2.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.bound',
//                       'b-1.attaching',
//                       'a-1.binding',
//                     ], `1.2.2`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.4`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await Promise.all(promises);
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'b-1.detaching',
//                     'b-1.unbinding',
//                     'b-1.afterUnbind',
//                   ], `2.1`);

//                   controller.dispose();
//                 });

//                 it('attaching', async function () {
//                   const { controller, calls, config, ctx } = createControllerFixture(B1, createConfig);
//                   controller.addController(createController(ctx, A1));
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.binding',
//                       'b-1.bound',
//                       'b-1.attaching',
//                       'a-1.binding',
//                     ], `1.1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.binding',
//                     ], `1.2.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.bound',
//                       'b-1.attaching',
//                       'a-1.binding',
//                     ], `1.2.2`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);
//                   await calls.attaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attaching',
//                   ], `1.5`);

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.5`);
//                   await calls.detaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.detaching',
//                   ], `2.4`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await Promise.all(promises);
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'b-1.detaching',
//                     'b-1.unbinding',
//                     'b-1.afterUnbind',
//                   ], `2.1`);

//                   controller.dispose();
//                 });

//                 it('attached', async function () {
//                   const { controller, calls, config, ctx } = createControllerFixture(B1, createConfig);
//                   controller.addController(createController(ctx, A1));
//                   const promises: (void | Promise<void>)[] = [];

//                   promises.push(controller.activate(controller, null!, flags));
//                   if (repeatActivate) {
//                     promises.push(controller.deactivate(controller, null!, flags));
//                     promises.push(controller.activate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.binding',
//                       'b-1.bound',
//                       'b-1.attaching',
//                       'a-1.binding',
//                     ], `1.1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.binding',
//                     ], `1.2.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.bound',
//                       'b-1.attaching',
//                       'a-1.binding',
//                     ], `1.2.2`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);
//                   await calls.attaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attaching',
//                   ], `1.5`);
//                   await calls.attached.promise;
//                   if (config.hasTimeout) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.attached',
//                     ], `1.6.1`);
//                     await Promise.all(promises.splice(0));
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.attached',
//                     ], `1.6.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.attached',
//                       'b-1.attached',
//                     ], `1.7.1`);
//                     await Promise.all(promises.splice(0));
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.7.2`);
//                   }

//                   promises.push(controller.deactivate(controller, null!, flags));
//                   if (repeatDeactivate) {
//                     promises.push(controller.activate(controller, null!, flags));
//                     promises.push(controller.deactivate(controller, null!, flags));
//                   }

//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `2.7.1`);
//                     await calls.detaching.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.detaching',
//                       'b-1.unbinding',
//                       'b-1.afterUnbind',
//                       'a-1.detaching',
//                     ], `2.7.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.detaching',
//                     ], `2.6.1`);
//                     await calls.detaching.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.unbinding',
//                       'b-1.afterUnbind',
//                       'a-1.detaching',
//                     ], `2.6.2`);
//                   }
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.4`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.3`);
//                   await calls.afterUnbindChildren.promise;
//                   if (config.hasTimeout) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.afterUnbindChildren',
//                     ], `2.2.1`);
//                     await Promise.all(promises);
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'b-1.afterUnbindChildren',
//                     ], `2.2.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.afterUnbindChildren',
//                       'b-1.afterUnbindChildren',
//                     ], `2.1.1`);
//                     await Promise.all(promises);
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `2.1.2`);
//                   }

//                   controller.dispose();
//                 });
//               });
//             });
//           }
//         });
//       }

//       describe(A1Toggle.name, function () {
//         for (const repeatShow of [false]) {
//           describe(repeatShow ? 'show->hide->show' : 'show', function () {
//             for (const repeatHide of [false, true]) {
//               describe(repeatHide ? 'hide->show->hide' : 'hide', function () {
//                 it('binding', async function () {
//                   const { au, calls, component, config } = createAuFixture(A1Toggle, createConfig);
//                   await au.start();
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `0`);

//                   component.showA1 = true;
//                   if (repeatShow) {
//                     component.showA1 = false;
//                     component.showA1 = true;
//                   }
//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }

//                   component.showA1 = false;
//                   if (repeatHide) {
//                     component.showA1 = true;
//                     component.showA1 = false;
//                   }
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await au.stop();
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   au.dispose();
//                 });

//                 it('bound', async function () {
//                   const { au, calls, component, config } = createAuFixture(A1Toggle, createConfig);
//                   await au.start();
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `0`);

//                   component.showA1 = true;
//                   if (repeatShow) {
//                     component.showA1 = false;
//                     component.showA1 = true;
//                   }
//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);

//                   component.showA1 = false;
//                   if (repeatHide) {
//                     component.showA1 = true;
//                     component.showA1 = false;
//                   }
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.4`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await au.stop();
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   au.dispose();
//                 });

//                 it('attaching', async function () {
//                   const { au, calls, component, config } = createAuFixture(A1Toggle, createConfig);
//                   await au.start();
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `0`);

//                   component.showA1 = true;
//                   if (repeatShow) {
//                     component.showA1 = false;
//                     component.showA1 = true;
//                   }
//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);
//                   await calls.attaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attaching',
//                   ], `1.5`);

//                   component.showA1 = false;
//                   if (repeatHide) {
//                     component.showA1 = true;
//                     component.showA1 = false;
//                   }
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.5`);
//                   await calls.detaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.detaching',
//                   ], `2.4`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.3`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.2`);
//                   await au.stop();
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   au.dispose();
//                 });

//                 it('attached', async function () {
//                   const { au, calls, component, config } = createAuFixture(A1Toggle, createConfig);
//                   await au.start();
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `0`);

//                   component.showA1 = true;
//                   if (repeatShow) {
//                     component.showA1 = false;
//                     component.showA1 = true;
//                   }
//                   if (config.hasPromise) {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                     ], `1.1`);
//                     await calls.binding.promise;
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.2`);
//                   } else {
//                     assert.deepStrictEqual(calls.history.splice(0), [
//                       'a-1.binding',
//                     ], `1.3`);
//                   }
//                   await calls.bound.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.bound',
//                   ], `1.4`);
//                   await calls.attaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attaching',
//                   ], `1.5`);
//                   await calls.attached.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.attached',
//                   ], `1.6`);

//                   component.showA1 = false;
//                   if (repeatHide) {
//                     component.showA1 = true;
//                     component.showA1 = false;
//                   }
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.6`);
//                   await calls.detaching.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.detaching',
//                   ], `2.5`);
//                   await calls.unbinding.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.unbinding',
//                   ], `2.4`);
//                   await calls.afterUnbind.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbind',
//                   ], `2.3`);
//                   await calls.afterUnbindChildren.promise;
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                     'a-1.afterUnbindChildren',
//                   ], `2.2`);
//                   await au.stop();
//                   assert.deepStrictEqual(calls.history.splice(0), [
//                   ], `2.1`);

//                   au.dispose();
//                 });
//               });
//             }
//           });
//         }
//       });
//     });
//   }
// });
