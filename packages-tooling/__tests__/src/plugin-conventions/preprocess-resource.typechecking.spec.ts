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

  function createMarkupReader(fileName: string, markup: string) {
    return (path: string) => {
      if (path.endsWith(fileName)) return markup;
      throw new Error(`unexpected path: ${path}`);
    };
  }

  function assertSuccess(entry: string, code: string) {
    const errors = compileProcessedCode(entry, { [entry]: code });
    assert.deepStrictEqual(errors, [], `Errors: ${errors.join(EOL)}${EOL}Code: ${code}`);
  }

  function assertFailure(entry: string, code: string, expectedErrors: RegExp[]) {
    const errors = compileProcessedCode(entry, { [entry]: code });
    const len = expectedErrors.length;
    assert.strictEqual(errors.length, len);
    for (let i = 0; i < len; i++) {
      const pattern = expectedErrors[i];
      assert.strictEqual(errors.some(e => pattern.test(e)), true, `Expected error not found: ${pattern}${EOL}Errors: ${errors.join(EOL)}${EOL}Code: ${code}`);
    }
  }

  describe('@customElement', function () {
    describe('short-hand assignment', function () {
      it('single class - pass', function () {
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
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertSuccess(entry, result.code);
      });

      it('single class - fail', function () {
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
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertFailure(entry, result.code, [/Property 'prop1' does not exist on type 'Foo'\./]);
      });

      it('multiple classes - pass', function () {
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

  @customElement({ name: 'bar', template })
  export class Bar {
    public prop: string;
  }
  `,
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertSuccess(entry, result.code);
      });

      it('multiple classes - fail', function () {
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

  @customElement({ name: 'bar', template })
  export class Bar {
    public prop1: string;
  }
  `,
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertFailure(entry, result.code, [/Property 'prop' does not exist on type 'Bar'\./]);
      });
    });

    describe('property assignment', function () {
      it('single class - pass', function () {
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
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertSuccess(entry, result.code);
      });

      it('single class - fail', function () {
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
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertFailure(entry, result.code, [/Property 'prop1' does not exist on type 'Foo'\./]);
      });

      it('multiple classes - pass', function () {
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

  @customElement({ name: 'bar', template: x })
  export class Bar {
    public prop: string;
  }
  `,
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertSuccess(entry, result.code);
      });

      it('multiple classes - fail', function () {
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

  @customElement({ name: 'bar', template: x })
  export class Bar {
    public prop1: string;
  }
  `,
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertFailure(entry, result.code, [/Property 'prop' does not exist on type 'Bar'\./]);
      });
    });

    describe('string literal assignment', function () {
      it('single class - pass', function () {
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
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertSuccess(entry, result.code);
      });

      it('single class - fail', function () {
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
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertFailure(entry, result.code, [/Property 'prop1' does not exist on type 'Foo'\./]);
      });

      it('multiple classes - pass', function () {
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

  @customElement({ name: 'bar', template: '${markup}' })
  export class Bar {
    public prop: string;
  }
  `,
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertSuccess(entry, result.code);
      });

      it('multiple classes - fail', function () {
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

  @customElement({ name: 'bar', template: '${markup}' })
  export class Bar {
    public prop1: string;
  }
  `,
            readFile: createMarkupReader(markupFile, markup),
          }, nonConventionalOptions);

        assertFailure(entry, result.code, [/Property 'prop' does not exist on type 'Bar'\./]);
      });
    });
  });
});
