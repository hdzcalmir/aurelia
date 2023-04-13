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
import { IPlatform } from '@aurelia/kernel';
import { IRouter, IRouterEvents, route } from '@aurelia/router-lite';
import { customElement, IHistory, IWindow } from '@aurelia/runtime-html';
import { assert } from '@aurelia/testing';
import { isNode } from '../util.js';
import { getLocationChangeHandlerRegistration } from './_shared/configuration.js';
import { start } from './_shared/create-fixture.js';
describe('router-lite/location-manager.spec.ts', function () {
    if (isNode()) {
        return;
    }
    for (const [useHash, event] of [[true, 'hashchange'], [false, 'popstate']]) {
        it(`listens to ${event} event and facilitates navigation when useUrlFragmentHash is set to ${useHash}`, async function () {
            let C1 = class C1 {
            };
            C1 = __decorate([
                customElement({ name: 'c-1', template: 'c1' })
            ], C1);
            let C2 = class C2 {
            };
            C2 = __decorate([
                customElement({ name: 'c-2', template: 'c2' })
            ], C2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: ['', 'c1'], component: C1 },
                        { path: 'c2', component: C2 },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, useHash, registrations: [getLocationChangeHandlerRegistration()], historyStrategy: 'push' });
            const router = container.get(IRouter);
            const queue = container.get(IPlatform).taskQueue;
            const eventLog = [];
            const subscriber = container.get(IRouterEvents)
                .subscribe('au:router:location-change', (ev) => {
                eventLog.push([ev.trigger, ev.url]);
            });
            assert.html.textContent(host, 'c1', 'init');
            assert.deepStrictEqual(eventLog, [], 'init event log');
            // first make some navigation
            await router.load('c2');
            assert.html.textContent(host, 'c2', 'nav1');
            assert.deepStrictEqual(eventLog, [], 'nav1 event log');
            await router.load('c1');
            assert.html.textContent(host, 'c1', 'nav2');
            assert.deepStrictEqual(eventLog, [], 'nav2 event log');
            // navigate through history states - round#1
            const history = container.get(IHistory);
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c2', 'back');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c2$/, 'back event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c1', 'forward');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1$/, 'back event log path');
            // navigate through history states - round#2
            eventLog.length = 0;
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c2', 'back');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c2$/, 'back event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c1', 'forward');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1$/, 'back event log path');
            // navigate through history states - round#3
            eventLog.length = 0;
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c2', 'back');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c2$/, 'back event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c1', 'forward');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1$/, 'back event log path');
            // lastly dispatch a hashchange event
            eventLog.length = 0;
            const unsubscribedEvent = useHash ? 'popstate' : 'hashchange';
            container.get(IWindow).dispatchEvent(new HashChangeEvent(unsubscribedEvent));
            await queue.yield();
            assert.deepStrictEqual(eventLog, [], `${unsubscribedEvent} event log`);
            subscriber.dispose();
            await au.stop(true);
        });
        it(`listens to ${event} event and facilitates navigation when useUrlFragmentHash is set to ${useHash} - parent-child`, async function () {
            let GC1 = class GC1 {
            };
            GC1 = __decorate([
                customElement({ name: 'gc-1', template: 'gc1' })
            ], GC1);
            let GC2 = class GC2 {
            };
            GC2 = __decorate([
                customElement({ name: 'gc-2', template: 'gc2' })
            ], GC2);
            let C1 = class C1 {
            };
            C1 = __decorate([
                route({
                    routes: [
                        { path: ['', 'gc-1'], component: GC1 },
                        { path: 'gc-2', component: GC2 },
                    ]
                }),
                customElement({ name: 'c-1', template: '<a href="gc-2"></a> c1 <au-viewport></au-viewport>' })
            ], C1);
            let C2 = class C2 {
            };
            C2 = __decorate([
                customElement({ name: 'c-2', template: 'c2' })
            ], C2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: ['', 'c1'], component: C1 },
                        { path: 'c2', component: C2 },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, useHash, registrations: [getLocationChangeHandlerRegistration()], historyStrategy: 'push' });
            const router = container.get(IRouter);
            const queue = container.get(IPlatform).taskQueue;
            const eventLog = [];
            const subscriber = container.get(IRouterEvents)
                .subscribe('au:router:location-change', (ev) => {
                eventLog.push([ev.trigger, ev.url]);
            });
            assert.html.textContent(host, 'c1 gc1', 'init');
            assert.deepStrictEqual(eventLog, [], 'init event log');
            // first make some navigation
            await router.load('c2');
            assert.html.textContent(host, 'c2', 'nav1');
            assert.deepStrictEqual(eventLog, [], 'nav1 event log');
            await router.load('c1');
            assert.html.textContent(host, 'c1 gc1', 'nav2');
            assert.deepStrictEqual(eventLog, [], 'nav2 event log');
            host.querySelector('a').click();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc2', 'nav3');
            assert.deepStrictEqual(eventLog, [], 'nav1 event log');
            // navigate through history states - round#1
            const history = container.get(IHistory);
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc1', 'back');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1$/, 'back event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc2', 'forward');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1\/gc-2$/, 'back event log path');
            // navigate through history states - round#2
            eventLog.length = 0;
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc1', 'back');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1$/, 'back event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc2', 'forward');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1\/gc-2$/, 'back event log path');
            // navigate through history states - round#3
            eventLog.length = 0;
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc1', 'back');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1$/, 'back event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc2', 'forward');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1\/gc-2$/, 'back event log path');
            subscriber.dispose();
            await au.stop(true);
        });
        it(`listens to ${event} event and facilitates navigation when useUrlFragmentHash is set to ${useHash} - sibling`, async function () {
            let C1 = class C1 {
            };
            C1 = __decorate([
                customElement({ name: 'c-1', template: 'c1' })
            ], C1);
            let C2 = class C2 {
            };
            C2 = __decorate([
                customElement({ name: 'c-2', template: 'c2' })
            ], C2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 'c1', component: C1 },
                        { path: 'c2', component: C2 },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport> <au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, useHash, registrations: [getLocationChangeHandlerRegistration()], historyStrategy: 'push' });
            const router = container.get(IRouter);
            const queue = container.get(IPlatform).taskQueue;
            const eventLog = [];
            const subscriber = container.get(IRouterEvents)
                .subscribe('au:router:location-change', (ev) => {
                eventLog.push([ev.trigger, ev.url]);
            });
            // first make some navigation
            await router.load('c1+c2');
            assert.html.textContent(host, 'c1 c2', 'nav1');
            assert.deepStrictEqual(eventLog, [], 'nav1 event log');
            await router.load('c2+c1');
            assert.html.textContent(host, 'c2 c1', 'nav2');
            assert.deepStrictEqual(eventLog, [], 'nav2 event log');
            // navigate through history states - round#1
            const history = container.get(IHistory);
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c1 c2', 'back1');
            assert.strictEqual(eventLog.length, 1, 'back1 event log length');
            assert.strictEqual(eventLog[0][0], event, 'back1 event log trigger');
            assert.match(eventLog[0][1], /c1\+c2$/, 'back1 event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c2 c1', 'forward1');
            assert.strictEqual(eventLog.length, 1, 'forward1 event log length');
            assert.strictEqual(eventLog[0][0], event, 'forward1 event log trigger');
            assert.match(eventLog[0][1], /c2\+c1$/, 'forward1 event log path');
            // navigate through history states - round#2
            eventLog.length = 0;
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c1 c2', 'back2');
            assert.strictEqual(eventLog.length, 1, 'back2 event log length');
            assert.strictEqual(eventLog[0][0], event, 'back2 event log trigger');
            assert.match(eventLog[0][1], /c1\+c2$/, 'back2 event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c2 c1', 'forward2');
            assert.strictEqual(eventLog.length, 1, 'forward2 event log length');
            assert.strictEqual(eventLog[0][0], event, 'forward2 event log trigger');
            assert.match(eventLog[0][1], /c2\+c1$/, 'forward2 event log path');
            // navigate through history states - round#3
            eventLog.length = 0;
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c1 c2', 'back3');
            assert.strictEqual(eventLog.length, 1, 'back3 event log length');
            assert.strictEqual(eventLog[0][0], event, 'back3 event log trigger');
            assert.match(eventLog[0][1], /c1\+c2$/, 'back3 event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c2 c1', 'forward3');
            assert.strictEqual(eventLog.length, 1, 'forward3 event log length');
            assert.strictEqual(eventLog[0][0], event, 'forward3 event log trigger');
            assert.match(eventLog[0][1], /c2\+c1$/, 'forward3 event log path');
            subscriber.dispose();
            await au.stop(true);
        });
        it(`listens to ${event} event and facilitates navigation when useUrlFragmentHash is set to ${useHash} - sibling/child`, async function () {
            let GC11 = class GC11 {
            };
            GC11 = __decorate([
                customElement({ name: 'gc-11', template: 'gc11' })
            ], GC11);
            let GC12 = class GC12 {
            };
            GC12 = __decorate([
                customElement({ name: 'gc-12', template: 'gc12' })
            ], GC12);
            let GC21 = class GC21 {
            };
            GC21 = __decorate([
                customElement({ name: 'gc-21', template: 'gc21' })
            ], GC21);
            let GC22 = class GC22 {
            };
            GC22 = __decorate([
                customElement({ name: 'gc-22', template: 'gc22' })
            ], GC22);
            let C1 = class C1 {
            };
            C1 = __decorate([
                route({
                    routes: [
                        { path: ['', 'gc-11'], component: GC11 },
                        { path: 'gc-12', component: GC12 },
                    ]
                }),
                customElement({ name: 'c-1', template: 'c1 <au-viewport></au-viewport>' })
            ], C1);
            let C2 = class C2 {
            };
            C2 = __decorate([
                route({
                    routes: [
                        { path: ['', 'gc-21'], component: GC21 },
                        { path: 'gc-22', component: GC22 },
                    ]
                }),
                customElement({ name: 'c-2', template: 'c2 <au-viewport></au-viewport>' })
            ], C2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 'c1', component: C1 },
                        { path: 'c2', component: C2 },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport> <au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, useHash, registrations: [getLocationChangeHandlerRegistration()], historyStrategy: 'push' });
            const router = container.get(IRouter);
            const queue = container.get(IPlatform).taskQueue;
            const eventLog = [];
            const subscriber = container.get(IRouterEvents)
                .subscribe('au:router:location-change', (ev) => {
                eventLog.push([ev.trigger, ev.url]);
            });
            // first make some navigation
            await router.load('c1+c2');
            assert.html.textContent(host, 'c1 gc11 c2 gc21', 'nav1');
            assert.deepStrictEqual(eventLog, [], 'nav1 event log');
            await router.load('c2/gc-22+c1/gc-12');
            assert.html.textContent(host, 'c2 gc22 c1 gc12', 'nav2');
            assert.deepStrictEqual(eventLog, [], 'nav2 event log');
            // navigate through history states - round#1
            const history = container.get(IHistory);
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc11 c2 gc21', 'back1');
            assert.strictEqual(eventLog.length, 1, 'back1 event log length');
            assert.strictEqual(eventLog[0][0], event, 'back1 event log trigger');
            assert.match(eventLog[0][1], /c1\+c2$/, 'back1 event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c2 gc22 c1 gc12', 'forward1');
            assert.strictEqual(eventLog.length, 1, 'forward1 event log length');
            assert.strictEqual(eventLog[0][0], event, 'forward1 event log trigger');
            assert.match(eventLog[0][1], /c2\/gc-22\+c1\/gc-12$/, 'forward1 event log path');
            // navigate through history states - round#2
            eventLog.length = 0;
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc11 c2 gc21', 'back2');
            assert.strictEqual(eventLog.length, 1, 'back2 event log length');
            assert.strictEqual(eventLog[0][0], event, 'back2 event log trigger');
            assert.match(eventLog[0][1], /c1\+c2$/, 'back2 event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c2 gc22 c1 gc12', 'forward2');
            assert.strictEqual(eventLog.length, 1, 'forward2 event log length');
            assert.strictEqual(eventLog[0][0], event, 'forward2 event log trigger');
            assert.match(eventLog[0][1], /c2\/gc-22\+c1\/gc-12$/, 'forward2 event log path');
            // navigate through history states - round#3
            eventLog.length = 0;
            history.back();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc11 c2 gc21', 'back3');
            assert.strictEqual(eventLog.length, 1, 'back3 event log length');
            assert.strictEqual(eventLog[0][0], event, 'back3 event log trigger');
            assert.match(eventLog[0][1], /c1\+c2$/, 'back3 event log path');
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c2 gc22 c1 gc12', 'forward3');
            assert.strictEqual(eventLog.length, 1, 'forward3 event log length');
            assert.strictEqual(eventLog[0][0], event, 'forward3 event log trigger');
            assert.match(eventLog[0][1], /c2\/gc-22\+c1\/gc-12$/, 'forward3 event log path');
            subscriber.dispose();
            await au.stop(true);
        });
        it(`parent-child - replicates GH issue 1658 - useUrlFragmentHash: ${useHash}, event: ${event}`, async function () {
            let GC1 = class GC1 {
            };
            GC1 = __decorate([
                customElement({ name: 'gc-1', template: 'gc1 <a href="../gc-2"></a>' })
            ], GC1);
            let GC2 = class GC2 {
                constructor(history) {
                    this.history = history;
                }
                goBack() { history.back(); }
            };
            GC2 = __decorate([
                customElement({ name: 'gc-2', template: 'gc2 <button click.trigger="goBack()"></button>' }),
                __param(0, IHistory),
                __metadata("design:paramtypes", [Object])
            ], GC2);
            let C1 = class C1 {
            };
            C1 = __decorate([
                route({
                    routes: [
                        { path: ['', 'gc-1'], component: GC1 },
                        { path: 'gc-2', component: GC2 },
                    ]
                }),
                customElement({ name: 'c-1', template: 'c1 <au-viewport></au-viewport>' })
            ], C1);
            let C2 = class C2 {
            };
            C2 = __decorate([
                customElement({ name: 'c-2', template: 'c2' })
            ], C2);
            let Root = class Root {
            };
            Root = __decorate([
                route({
                    routes: [
                        { path: 'c1', component: C1 },
                        { path: 'c2', component: C2 },
                    ]
                }),
                customElement({ name: 'ro-ot', template: '<au-viewport></au-viewport>' })
            ], Root);
            const { au, container, host } = await start({ appRoot: Root, useHash, registrations: [getLocationChangeHandlerRegistration()], historyStrategy: 'push' });
            const router = container.get(IRouter);
            const queue = container.get(IPlatform).taskQueue;
            const history = container.get(IHistory);
            const eventLog = [];
            const subscriber = container.get(IRouterEvents)
                .subscribe('au:router:location-change', (ev) => {
                eventLog.push([ev.trigger, ev.url]);
            });
            assert.html.textContent(host, '', 'init');
            // load c1/gc-1
            await router.load('c1');
            assert.html.textContent(host, 'c1 gc1', 'nav1');
            assert.deepStrictEqual(eventLog, [], 'nav1 event log');
            // round#1
            // go to c1/gc-2 by clicking the link
            host.querySelector('a').click();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc2', 'nav2');
            assert.deepStrictEqual(eventLog, [], 'nav2 event log');
            // go back to c1/gc-1 by clicking the button
            host.querySelector('button').click();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc1', 'back1');
            assert.strictEqual(eventLog.length, 1, 'back event log length');
            assert.strictEqual(eventLog[0][0], event, 'back event log trigger');
            assert.match(eventLog[0][1], /c1$/, 'back event log path');
            // round#2
            // go to c1/gc-2 by clicking the link
            eventLog.length = 0;
            host.querySelector('a').click();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc2', 'nav3');
            assert.deepStrictEqual(eventLog, [], 'nav3 event log');
            // go back to c1/gc-1 by clicking the button
            eventLog.length = 0;
            host.querySelector('button').click();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc1', 'back2');
            assert.strictEqual(eventLog.length, 1, 'back2 event log length');
            assert.strictEqual(eventLog[0][0], event, 'back2 event log trigger');
            assert.match(eventLog[0][1], /c1$/, 'back2 event log path');
            // go forward using history state
            eventLog.length = 0;
            history.forward();
            await queue.yield();
            assert.html.textContent(host, 'c1 gc2', 'forward');
            assert.strictEqual(eventLog.length, 1, 'forward event log length');
            assert.strictEqual(eventLog[0][0], event, 'forward event log trigger');
            assert.match(eventLog[0][1], /c1\/gc-2$/, 'forward event log path');
            subscriber.dispose();
            await au.stop(true);
        });
    }
});
//# sourceMappingURL=location-manager.spec.js.map