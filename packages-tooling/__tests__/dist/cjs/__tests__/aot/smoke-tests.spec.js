"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable mocha/no-skipped-tests */
const kernel_1 = require("@aurelia/kernel");
const aot_1 = require("@aurelia/aot");
const virtual_file_system_1 = require("./virtual-file-system");
const testing_1 = require("@aurelia/testing");
// NOTE: These tests are not meant to be even close to exhaustive. That's what the 262 test suite is for.
// These tests exist solely for having an easy way to quickly test some high-level things when a feature is not yet ready for exposure to the 262 test suite.
describe.skip('AOT (smoke tests)', function () {
    async function execute(content) {
        const container = kernel_1.DI.createContainer();
        container.register(kernel_1.LoggerConfiguration.create({ sinks: [kernel_1.ConsoleSink], level: 1 /* LogLevel.debug */, colorOptions: 1 /* ColorOptions.colors */ }), kernel_1.Registration.singleton(aot_1.IFileSystem, virtual_file_system_1.VirtualFileSystem));
        const host = new aot_1.ServiceHost(container);
        const result = await host.executeSpecificFile({
            shortName: '',
            shortPath: '',
            kind: 1 /* FileKind.Script */,
            path: '',
            dir: '',
            rootlessPath: '',
            name: '',
            ext: '',
            async getContent() {
                return content;
            },
            getContentSync() {
                return content;
            },
        }, 'module');
        if (result.isAbrupt) {
            testing_1.assert.fail(`Evaluation error`);
        }
        return result.sourceNode.ExecutionResult;
    }
    it('simple return statement with binary expression', async function () {
        const result = await execute(`
      return 1 + 1;
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 2);
    });
    it('simple if statement with binary expression', async function () {
        const result = await execute(`
      if (true) {
        return 1 + 1;
      }
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 2);
    });
    it('simple if/else statement with binary expression', async function () {
        const result = await execute(`
      if (false) {
        return 1 + 1;
      } else {
        return 5;
      }
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 5);
    });
    it('simple function declaration with binary expression', async function () {
        const result = await execute(`
      function foo() {
        return 1 + 1;
      }
      return foo();
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 2);
    });
    it('simple function declaration with parameters and binary expression', async function () {
        const result = await execute(`
      function foo(a, b) {
        return a + b;
      }
      return foo(1, 1);
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 2);
    });
    it('new class instance', async function () {
        const result = await execute(`
      class Foo {
        get value() {
          return 42;
        }
      }
      return new Foo().value;
    `);
        testing_1.assert.equal(result['[[Value]]'], "42");
    });
    it('new object', async function () {
        const result = await execute(`
      function Foo() {
        this.value = 42;
      }
      return new Foo().value;
    `);
        testing_1.assert.equal(result['[[Value]]'], "42");
    });
    it.skip('new Number', async function () {
        const result = await execute(`
      return new Number();
    `);
        testing_1.assert.instanceOf(result['[[Value]]'], Number);
    });
    it.skip('new error', async function () {
        const result = await execute(`
      return new Error();
    `);
        testing_1.assert.instanceOf(result['[[Value]]'], Error);
    });
    it.skip('try catch with thrown error', async function () {
        const result = await execute(`
      try {
        throw new Error();
      } catch {
        return 1;
      }
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 1);
    });
    it.skip('try catch with reference error', async function () {
        const result = await execute(`
      try {
        foo.bar;
      } catch {
        return 1;
      }
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 1);
    });
    it('try catch with no error', async function () {
        const result = await execute(`
      try {
        return 42;
      } catch {
        return 1;
      }
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 42);
    });
    it('simple switch', async function () {
        const result = await execute(`
      switch(1){
        case 1:
          return 1;
        default:
          return 2;
      }
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 1);
    });
    it('switch with default', async function () {
        const result = await execute(`
      switch(2){
        case 1:
          return 1;
        default:
          return 2;
      }
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 2);
    });
    it('switch with default in the middle', async function () {
        const result = await execute(`
      switch(3){
        case 1:
          return 1;
        default:
          return 2;
        case 3:
          return 3;
      }
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], 3);
    });
    it('void operator', async function () {
        const result = await execute(`
      function answer(){
        return 42;
      }
      return void answer();
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], undefined);
    });
    it.skip('void operator with throw', async function () {
        const result = await execute(`
      function answer(){
        throw new Error();
      }
      return void answer();
    `);
        testing_1.assert.instanceOf(result['[[Value]]'], Error);
    });
    it.skip('delete', async function () {
        const result = await execute(`
      function foo(){}
      // foo.a = 123;
      foo.b = 123;
      // delete foo.a;
      return foo;
    `);
        const foo = result['[[Value]]'];
        testing_1.assert.equal(foo.a, void 0);
        testing_1.assert.equal(foo.b, 123);
    });
    [
        { input: undefined, type: "undefined" },
        { input: null, type: "object" },
        { input: true, type: "boolean" },
        { input: 1, type: "number" },
        { input: "'1'", type: "string" },
        { input: '{ }', type: "object" },
    ].map(({ input, type }) => it(`typeof ${input} is "${type}"`, async function () {
        const result = await execute(`
      return typeof ${input};
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], type);
    }));
    it(`typeof function is "function"`, async function () {
        const result = await execute(`
      function foo() { }
      return typeof foo;
    `);
        testing_1.assert.strictEqual(result['[[Value]]'], "function");
    });
});
//# sourceMappingURL=smoke-tests.spec.js.map