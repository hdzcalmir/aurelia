/* eslint-disable no-template-curly-in-string */
import { preprocessOptions, preprocessResource } from '@aurelia/plugin-conventions';
import { assert } from '@aurelia/testing';
import {
  ModuleKind,
  ModuleResolutionKind,
  createCompilerHost,
  createProgram,
  createSourceFile,
  flattenDiagnosticMessageText,
  getPreEmitDiagnostics,
  type CompilerOptions,
} from "typescript";
import { EOL } from 'os';

describe.only('preprocess-resource.typechecking', function () {
  const nonConventionalOptions = preprocessOptions({
    enableConventions: false,
    typeCheckTemplate: true,
  });

  const assetsTypeFile = 'assets-modules.d.ts';
  const assetTypes = `
declare module '*.html' {
  const value: string;
  export default value;
}`;
  const options: CompilerOptions = {
    baseUrl: '.',
    skipLibCheck: true,
    module: ModuleKind.ES2022,
    moduleResolution: ModuleResolutionKind.Node10,
    noEmit: true,
  };

  type $Module = Record<string, string>;
  function compileProcessedCode(entryPoint: string, modules: $Module = {}): string[] {
    modules = { ...modules, [assetsTypeFile]: assetTypes };
    const fileNames = Object.keys(modules);
    const host = createCompilerHost(options);
    const program = createProgram([entryPoint, assetsTypeFile], options, {
      ...host,
      getSourceFile: (fileName, languageVersion) => fileNames.includes(fileName)
        ? createSourceFile(fileName, modules[fileName], languageVersion)
        : host.getSourceFile(fileName, languageVersion),
      readFile: (fileName) => modules[fileName] ?? host.readFile(fileName),
      fileExists: (fileName) => fileNames.includes(fileName) ? true : host.fileExists(fileName),
    });
    const emitResult = program.emit();
    // Need to incorporate the sourcemap from the HTML template??
    return getPreEmitDiagnostics(program)
      .concat(emitResult.diagnostics)
      .map(d => flattenDiagnosticMessageText(d.messageText, EOL));
  }

  it('@customElement - short-hand assignment - pass', function () {
    const entry = 'foo.ts';
    const markupFile = 'foo.html';
    const markup = '${prop}';
    const result = preprocessResource(
      {
        path: entry,
        contents: `
import { customElement } from '@aurelia/runtime-html';
import template from './${markupFile}';

@customElement({ name: 'foo', template })
export class Foo {
  public prop: string;
}
`,
        readFile(path) {
          if (path.endsWith(markupFile)) return markup;
          throw new Error(`unexpected path: ${path}`);
        },
      }, nonConventionalOptions);

    const errors = compileProcessedCode(entry, { [entry]: result.code });
    assert.deepStrictEqual(errors, [], errors.join(EOL));
  });

  it('@customElement - short-hand assignment - fail', function () {
    const entry = 'foo.ts';
    const markupFile = 'foo.html';
    const markup = '${prop1}';
    const result = preprocessResource(
      {
        path: entry,
        contents: `
import { customElement } from '@aurelia/runtime-html';
import template from './${markupFile}';

@customElement({ name: 'foo', template })
export class Foo {
  public prop: string;
}
`,
        readFile(path) {
          if (path.endsWith(markupFile)) return markup;
          throw new Error(`unexpected path: ${path}`);
        },
      }, nonConventionalOptions);

    const errors = compileProcessedCode(entry, { [entry]: result.code });
    assert.strictEqual(errors.length, 1);
    assert.match(errors[0], /Property 'prop1' does not exist on type 'Foo'./);
  });

  it('@customElement - property assignment - pass', function () {
    const entry = 'foo.ts';
    const markupFile = 'foo.html';
    const markup = '${prop}';
    const result = preprocessResource(
      {
        path: entry,
        contents: `
import { customElement } from '@aurelia/runtime-html';
import x from './${markupFile}';

@customElement({ name: 'foo', template: x })
export class Foo {
  public prop: string;
}
`,
        readFile(path) {
          if (path.endsWith(markupFile)) return markup;
          throw new Error(`unexpected path: ${path}`);
        },
      }, nonConventionalOptions);

    const errors = compileProcessedCode(entry, { [entry]: result.code });
    assert.deepStrictEqual(errors, [], errors.join(EOL));
  });

  it('@customElement - property assignment - fail', function () {
    const entry = 'foo.ts';
    const markupFile = 'foo.html';
    const markup = '${prop1}';
    const result = preprocessResource(
      {
        path: entry,
        contents: `
import { customElement } from '@aurelia/runtime-html';
import x from './${markupFile}';

@customElement({ name: 'foo', template: x })
export class Foo {
  public prop: string;
}
`,
        readFile(path) {
          if (path.endsWith(markupFile)) return markup;
          throw new Error(`unexpected path: ${path}`);
        },
      }, nonConventionalOptions);

    const errors = compileProcessedCode(entry, { [entry]: result.code });
    assert.strictEqual(errors.length, 1);
    assert.match(errors[0], /Property 'prop1' does not exist on type 'Foo'./);
  });

  it('@customElement - string literal assignment - pass', function () {
    const entry = 'foo.ts';
    const markupFile = 'foo.html';
    const markup = '${prop}';
    const result = preprocessResource(
      {
        path: entry,
        contents: `
import { customElement } from '@aurelia/runtime-html';
import x from './${markupFile}';

@customElement({ name: 'foo', template: '${markup}' })
export class Foo {
  public prop: string;
}
`,
        readFile(path) {
          if (path.endsWith(markupFile)) return markup;
          throw new Error(`unexpected path: ${path}`);
        },
      }, nonConventionalOptions);

    const errors = compileProcessedCode(entry, { [entry]: result.code });
    assert.deepStrictEqual(errors, [], errors.join(EOL));
  });

  it('@customElement - string literal assignment - fail', function () {
    const entry = 'foo.ts';
    const markupFile = 'foo.html';
    const markup = '${prop1}';
    const result = preprocessResource(
      {
        path: entry,
        contents: `
import { customElement } from '@aurelia/runtime-html';
import x from './${markupFile}';

@customElement({ name: 'foo', template: '${markup}' })
export class Foo {
  public prop: string;
}
`,
        readFile(path) {
          if (path.endsWith(markupFile)) return markup;
          throw new Error(`unexpected path: ${path}`);
        },
      }, nonConventionalOptions);

    const errors = compileProcessedCode(entry, { [entry]: result.code });
    assert.strictEqual(errors.length, 1);
    assert.match(errors[0], /Property 'prop1' does not exist on type 'Foo'./);
  });
});
