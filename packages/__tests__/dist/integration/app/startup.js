import { Aurelia, CustomElement } from '@aurelia/runtime-html';
import { TestContext } from '@aurelia/testing';
import { App } from './app.js';
import { appTemplate as template } from './app-template.js';
import { atoms } from './atoms/index.js';
import { callCollection } from './debug.js';
import { molecules } from './molecules/index.js';
import { callSyntax, delegateSyntax } from '@aurelia/compat-v1';
export class TestExecutionContext {
    constructor(au, host, ctx, tearDown, callCollection) {
        this.au = au;
        this.host = host;
        this.ctx = ctx;
        this.tearDown = tearDown;
        this.callCollection = callCollection;
    }
}
export var ComponentMode;
(function (ComponentMode) {
    ComponentMode["class"] = "class";
    ComponentMode["instance"] = "instance";
})(ComponentMode || (ComponentMode = {}));
export async function startup(config = {}) {
    const ctx = TestContext.create();
    const host = ctx.doc.createElement('div');
    const au = new Aurelia(ctx.container);
    au
        .register(atoms, delegateSyntax, callSyntax, molecules.customize((molecularConfig) => {
        molecularConfig.useCSSModule = config.useCSSModule;
    }));
    let componentClass;
    const method = config.method;
    if (method === 'app') {
        componentClass = CustomElement.define({ name: 'app', template }, App);
    }
    else if (method === 'enhance') {
        componentClass = CustomElement.define('app', App);
        host.innerHTML = template;
    }
    let component;
    switch (config.componentMode) {
        case "class" /* ComponentMode.class */:
            component = componentClass;
            break;
        case "instance" /* ComponentMode.instance */:
            component = new componentClass();
            break;
    }
    let $deactivate;
    ctx.doc.body.appendChild(host);
    if (method === 'app') {
        au.app({ host, component });
        await au.start();
    }
    else {
        const enhanceRoot = (await au.enhance({ host, component }));
        $deactivate = () => enhanceRoot.deactivate();
    }
    async function tearDown() {
        await au.stop();
        await $deactivate?.();
        ctx.doc.body.removeChild(host);
        callCollection.calls.splice(0);
    }
    return new TestExecutionContext(au, host, ctx, tearDown, callCollection);
}
//# sourceMappingURL=startup.js.map