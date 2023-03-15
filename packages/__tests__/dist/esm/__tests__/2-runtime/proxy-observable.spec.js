var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ProxyObservable, nowrap, ConnectableSwitcher } from '@aurelia/runtime';
import { assert } from '@aurelia/testing';
describe('2-runtime/proxy-observable.spec.ts', function () {
    for (const { title, v, canWrap } of [
        // cant do
        { title: 'date', v: new Date(), canWrap: false },
        { title: 'date subclass', v: new class extends Date {
            }(), canWrap: false },
        { title: 'number', v: 1, canWrap: false },
        { title: 'string', v: '', canWrap: false },
        { title: 'bool', v: false, canWrap: false },
        { title: 'int 16', v: new Int16Array(), canWrap: false },
        // can do
        { title: 'proxy', v: new Proxy({}, {}), canWrap: true },
        { title: 'normal object', v: {}, canWrap: true },
        { title: 'Array', v: [], canWrap: true },
        { title: 'Array subclass', v: new class extends Array {
            }(), canWrap: true },
        { title: 'Map', v: new Map(), canWrap: true },
        { title: 'Map subclass', v: new class extends Map {
            }(), canWrap: true },
        { title: 'Set', v: new Set(), canWrap: true },
        { title: 'Set subclass', v: new class extends Set {
            }(), canWrap: true },
    ]) {
        it(`it wraps/unwraps (${title}) (can${canWrap ? '' : 'not'} wrap)`, function () {
            const wrapped = ProxyObservable.wrap(v);
            if (canWrap) {
                assert.notStrictEqual(wrapped, v);
            }
            else {
                assert.strictEqual(wrapped, v);
            }
        });
    }
    it('does not wrap object that has been marked as "nowrap"', function () {
        let MyModel = class MyModel {
        };
        MyModel = __decorate([
            nowrap
        ], MyModel);
        let MyModel2 = class MyModel2 {
        };
        MyModel2 = __decorate([
            nowrap()
        ], MyModel2);
        const m1 = new MyModel();
        assert.strictEqual(m1, ProxyObservable.wrap(m1));
        const m2 = new MyModel2();
        assert.strictEqual(m2, ProxyObservable.wrap(m2));
    });
    it('does not wrap object inheriting from marked class', function () {
        let MyModel = class MyModel {
        };
        MyModel = __decorate([
            nowrap
        ], MyModel);
        class MyActualModel extends MyModel {
        }
        const m = new MyActualModel();
        assert.strictEqual(m, ProxyObservable.wrap(m));
    });
    it('does not wrap PROP marked @nowrap', function () {
        class MyModel {
            constructor() {
                this.i18n = null;
            }
        }
        __decorate([
            nowrap,
            __metadata("design:type", Object)
        ], MyModel.prototype, "i18n", void 0);
        let count = 0;
        const m = ProxyObservable.wrap(new MyModel());
        const connectable = {
            observe() {
                count = 1;
            },
        };
        ConnectableSwitcher.enter(connectable);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        m.i18n;
        ConnectableSwitcher.exit(connectable);
        assert.strictEqual(count, 0);
    });
    it('does not wrap PROP marked from parent', function () {
        class BaseModel {
            constructor() {
                this.i18n = null;
            }
        }
        __decorate([
            nowrap,
            __metadata("design:type", Object)
        ], BaseModel.prototype, "i18n", void 0);
        class MyModel extends BaseModel {
        }
        let count = 0;
        const m = ProxyObservable.wrap(new MyModel());
        const connectable = {
            observe() {
                count++;
            },
        };
        ConnectableSwitcher.enter(connectable);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        m.i18n;
        ConnectableSwitcher.exit(connectable);
        assert.strictEqual(count, 0);
    });
});
//# sourceMappingURL=proxy-observable.spec.js.map