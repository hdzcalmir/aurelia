import { preprocess } from '@aurelia/plugin-conventions';
import { createFilter } from '@rollup/pluginutils';
import { resolve, dirname } from 'path';
import { promises } from 'fs';

function au(options = {}) {
    const { include = 'src/**/*.{ts,js,html}', exclude, pre = true, useDev, ...additionalOptions } = options;
    const filter = createFilter(include, exclude);
    const isVirtualTsFileFromHtml = (id) => id.endsWith('.$au.ts');
    const devPlugin = {
        name: 'aurelia:dev-alias',
        config(config) {
            var _a, _b;
            var _c;
            const isDev = useDev || (!useDev && config.mode !== 'production');
            if (!isDev) {
                return;
            }
            [
                'platform',
                'platform-browser',
                'aurelia',
                'fetch-client',
                'router-lite',
                'router',
                'kernel',
                'metadata',
                'i18n',
                'state',
                'route-recognizer',
                'compat-v1',
                'dialog',
                'runtime',
                'runtime-html',
                'router-lite',
            ].reduce((aliases, pkg) => {
                const name = pkg === 'aurelia' ? pkg : `@aurelia/${pkg}`;
                try {
                    const packageLocation = require.resolve(name);
                    aliases[name] = resolve(packageLocation, `../../esm/index.dev.mjs`);
                }
                catch (_a) { }
                return aliases;
            }, ((_b = (_c = ((_a = config.resolve) !== null && _a !== void 0 ? _a : (config.resolve = {}))).alias) !== null && _b !== void 0 ? _b : (_c.alias = {})));
        },
    };
    const auPlugin = {
        name: 'au2',
        enforce: pre ? 'pre' : 'post',
        async transform(code, id) {
            if (!filter(id))
                return;
            if (isVirtualTsFileFromHtml(id))
                return;
            const result = preprocess({
                path: id,
                contents: code,
            }, {
                hmrModule: 'import.meta',
                getHmrCode,
                transformHtmlImportSpecifier: (s) => {
                    return this.meta.watchMode
                        ? s
                        : s.replace(/\.html$/, '.$au.ts');
                },
                ...additionalOptions
            });
            return result;
        },
        resolveId(id, importer) {
            if (!isVirtualTsFileFromHtml(id)) {
                return null;
            }
            id = resolve(dirname(importer !== null && importer !== void 0 ? importer : ''), this.meta.watchMode ? id.replace(/^\//, './') : id);
            return id;
        },
        async load(id) {
            if (!isVirtualTsFileFromHtml(id)) {
                return null;
            }
            const htmlId = id.replace('.$au.ts', '.html');
            const code = await promises.readFile(htmlId, { encoding: 'utf-8' });
            const result = preprocess({
                path: htmlId,
                contents: code,
            }, {
                hmrModule: 'import.meta',
                transformHtmlImportSpecifier: s => s.replace(/\.html$/, '.$au.ts')
            });
            return result.code;
        }
    };
    return [devPlugin, auPlugin];
}
function getHmrCode(className, moduleNames = '') {
    const moduleText = 'import.meta';
    const code = `import { Metadata as $$M } from '@aurelia/metadata';
import { ExpressionKind as $$EK } from '@aurelia/runtime';
import {
  Controller as $$C,
  CustomElement as $$CE,
  IHydrationContext as $$IHC,
  PropertyBinding as $$PB,
  ContentBinding as $$CB,
} from '@aurelia/runtime-html';

// @ts-ignore
const controllers = [];

// @ts-ignore
if (${moduleText}.hot) {

  // @ts-ignore
  ${moduleText}.hot.accept(/* ${moduleNames ? `${JSON.stringify(moduleNames)}, ` : ''}  */function (newModule, oldModule) {
    // console.log({ newModule, oldModule });
  });

  let aurelia = ${moduleText}.hot.data?.aurelia;

  // @ts-ignore
  document.addEventListener('au-started', (event) => {aurelia= event.detail; });
  const currentClassType = ${className};

  // @ts-ignore
  const proto = ${className}.prototype;

  // @ts-ignore
  const ogCreated = proto ? proto.created : undefined;

  if (proto) {
    // @ts-ignore
    proto.created = function(controller) {
      // @ts-ignore
      ogCreated && ogCreated.call(this, controller);
      controllers.push(controller);
    }
  }

  // @ts-ignore
  ${moduleText}.hot.dispose(function (data) {
    // @ts-ignore
    data.controllers = controllers;
    data.aurelia = aurelia;
  });

  if (${moduleText}.hot.data?.aurelia) {
    const newDefinition = $$CE.getDefinition(currentClassType);
    $$M.define(newDefinition.name, newDefinition, currentClassType);
    $$M.define(newDefinition.name, newDefinition, newDefinition);
    ${moduleText}.hot.data.aurelia.container.res[$$CE.keyFrom(newDefinition.name)] = newDefinition;

    const previousControllers = ${moduleText}.hot.data.controllers;
    if (previousControllers == null || previousControllers.length === 0) {
      // @ts-ignore
      ${moduleText}.hot.invalidate();
    }

    // @ts-ignore
    previousControllers.forEach(controller => {
      const values = { ...controller.viewModel };
      const hydrationContext = controller.container.get($$IHC)
      const hydrationInst = hydrationContext.instruction;

      const bindableNames = Object.keys(controller.definition.bindables);
      // @ts-ignore
      Object.keys(values).forEach(key => {
        if (bindableNames.includes(key)) {
          return;
        }
        // if there' some bindings that target the existing property
        // @ts-ignore
        const isTargettedByBinding = controller.bindings?.some(y =>
          y instanceof $$PB
            && y.ast.$kind === $$EK.AccessScope
            && y.ast.name === key
          || y instanceof $$CB
            && y.ast.$kind === $$EK.ValueConverter
            && y.ast.expression.$kind === $$EK.AccessScope
            && y.ast.expression.name === key
        );
        if (!isTargettedByBinding) {
          delete values[key];
        }
      });
      const h = controller.host;
      delete controller._compiledDef;
      controller.viewModel = controller.container.invoke(currentClassType);
      controller.definition = newDefinition;
      console.log('assigning', JSON.stringify(Object.entries(values)));
      Object.assign(controller.viewModel, values);
      if (controller._hydrateCustomElement) {
        controller._hydrateCustomElement(hydrationInst, hydrationContext);
      } else {
        controller.hE(hydrationInst, hydrationContext);
      }
      h.parentNode.replaceChild(controller.host, h);
      controller.hostController = null;
      controller.deactivate(controller, controller.parent ?? null, 0);
      controller.activate(controller, controller.parent ?? null, 0);
    });
  }
}`;
    return code;
}

export { au as default };
//# sourceMappingURL=index.mjs.map
