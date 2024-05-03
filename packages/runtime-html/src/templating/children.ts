import { emptyArray, type IContainer, type IServiceLocator, Key , IIndexable } from '@aurelia/kernel';
import { subscriberCollection , type ISubscriberCollection } from '@aurelia/runtime';
import { findElementControllerFor } from '../resources/custom-element';
import { ILifecycleHooks, lifecycleHooks } from './lifecycle-hooks';
import { def, isString, objectAssign, safeString } from '../utilities';
import { instanceRegistration } from '../utilities-di';
import { type ICustomElementViewModel, type ICustomElementController } from './controller';
import { createMutationObserver, isElement } from '../utilities-dom';

import type { INode } from '../dom';
import { ErrorNames, createMappedError } from '../errors';
import { getAnnotationKeyFor } from '../utilities-metadata';
import { IBinding } from '../binding/interfaces-bindings';

export type PartialChildrenDefinition = {
  callback?: PropertyKey;
  name?: PropertyKey;
  options?: MutationObserverInit;
  query?: (controller: ICustomElementController) => ArrayLike<Node>;
  filter?: (node: Node, controller?: ICustomElementController | null, viewModel?: ICustomElementViewModel) => boolean;
  map?: (node: Node, controller?: ICustomElementController | null, viewModel?: ICustomElementViewModel) => unknown;
};

/**
 * Decorator: Specifies custom behavior for an array children property that synchronizes its items with child content nodes of the element.
 *
 * @param config - The overrides
 */
export function children<TThis,TValue>(config?: PartialChildrenDefinition): (target: undefined, context: ClassFieldDecoratorContext<TThis,TValue>) => void;
/**
 * Decorator: Specifies an array property on a class that synchronizes its items with child content nodes of the element.
 *
 * @param selector - The CSS element selector for filtering children
 */
export function children<TThis,TValue>(selector: string): (target: undefined, context: ClassFieldDecoratorContext<TThis,TValue>) => void;
/**
 * Decorator: Decorator: Specifies an array property that synchronizes its items with child content nodes of the element.
 *
 * @param target - The class
 * @param prop - The property name
 */
export function children<TThis,TValue>(target: undefined, context: ClassFieldDecoratorContext<TThis,TValue>): void;
export function children<TThis,TValue>(configOrTarget?: PartialChildrenDefinition | string | undefined, context?: ClassFieldDecoratorContext<TThis,TValue>): void | ((target: undefined, context: ClassFieldDecoratorContext<TThis,TValue>) => void) {
  if (!mixed) {
    mixed = true;
    subscriberCollection(ChildrenBinding, null!);
    lifecycleHooks()(ChildrenLifecycleHooks, null!);
  }
  let config: PartialChildrenDefinition;

  const dependenciesKey = getAnnotationKeyFor('dependencies');
  function decorator(_target: undefined, context: ClassFieldDecoratorContext): void {
    switch (context.kind) {
      case 'field':
        config.name = context.name;
        break;
    }

    const dependencies = (context.metadata[dependenciesKey] ??= []) as Key[];
    dependencies.push(new ChildrenLifecycleHooks(config as PartialChildrenDefinition & { name: PropertyKey }));
  }

  if (arguments.length > 1) {
    // Non invocation:
    // - @children
    config = {};
    decorator(configOrTarget as undefined, context!);
    return;
  } else if (isString(configOrTarget)) {
    // Direct call:
    // - @children('div')(Foo)
    config = {
      filter: (node: Node) => isElement(node) && node.matches(configOrTarget),
      map: el => el
    };
    return decorator;
  }

  // Invocation with or w/o opts:
  // - @children()
  // - @children({...opts})
  config = configOrTarget === void 0 ? {} : configOrTarget;
  return decorator;
}

export interface ChildrenBinding extends ISubscriberCollection { }

/**
 * A binding for observing & notifying the children of a custom element.
 */
export class ChildrenBinding implements IBinding {
  /** @internal */
  private readonly _callback: undefined | (() => void);
  /** @internal */
  private _children: unknown[] = (void 0)!;
  /** @internal */
  private readonly _observer: MutationObserver;
  /** @internal */
  private readonly _host: HTMLElement;
  /** @internal */
  private readonly _controller: ICustomElementController;
  /** @internal */
  private readonly _query = defaultChildQuery;
  /** @internal */
  private readonly _filter = defaultChildFilter;
  /** @internal */
  private readonly _map = defaultChildMap;
  /** @internal */
  private readonly _options?: MutationObserverInit;

  public isBound = false;
  public readonly obj: ICustomElementViewModel;

  public constructor(
    controller: ICustomElementController,
    obj: ICustomElementViewModel,
    callback: undefined | (() => void),
    query = defaultChildQuery,
    filter = defaultChildFilter,
    map = defaultChildMap,
    options = childObserverOptions,
  ) {
    this._controller = controller;
    this.obj = obj;
    this._callback = callback;
    this._query = query;
    this._filter = filter;
    this._map = map;
    this._options = options;
    this._observer = createMutationObserver(this._host = controller.host, () => {
      this._onChildrenChanged();
    });
  }

  public getValue(): unknown[] {
    return this.isBound ? this._children : this._getNodes();
  }

  public setValue(_value: unknown): void { /* do nothing */ }

  public bind(): void {
    if (this.isBound) {
      return;
    }
    this.isBound = true;
    this._observer.observe(this._host, this._options);
    this._children = this._getNodes();
  }

  public unbind(): void {
    if (!this.isBound) {
      return;
    }
    this.isBound = false;
    this._observer.disconnect();
    this._children = emptyArray;
  }

  /** @internal */
  private _onChildrenChanged(): void {
    this._children = this._getNodes();

    this._callback?.call(this.obj);
    this.subs.notify(this._children, undefined);
  }

  public get(): ReturnType<IServiceLocator['get']> {
    throw createMappedError(ErrorNames.method_not_implemented, 'get');
  }

  /** @internal */
  // freshly retrieve the children everytime
  // in case this observer is not observing
  private _getNodes() {
    return filterChildren(this._controller, this._query, this._filter, this._map);
  }
}

const childObserverOptions: MutationObserverInit = { childList: true };

const defaultChildQuery = (controller: ICustomElementController): ArrayLike<INode> => controller.host.childNodes;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultChildFilter = (node: INode, controller?: ICustomElementController | null, viewModel?: any): boolean =>
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  !!viewModel;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultChildMap = (node: INode, controller?: ICustomElementController | null, viewModel?: any): any => viewModel;

const forOpts = { optional: true } as const;

const filterChildren = (
  controller: ICustomElementController,
  query: typeof defaultChildQuery,
  filter: typeof defaultChildFilter,
  map: typeof defaultChildMap
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] => {
  const nodes = query(controller);
  const ii = nodes.length;
  const children: unknown[] = [];

  let node: INode;
  let $controller: ICustomElementController | null;
  let viewModel: ICustomElementViewModel | null;
  let i = 0;
  for (; i < ii; ++i) {
    node = nodes[i];
    $controller = findElementControllerFor(node, forOpts);
    viewModel = $controller?.viewModel ?? null;

    if (filter(node, $controller, viewModel)) {
      children.push(map(node, $controller, viewModel));
    }
  }

  return children;
};

class ChildrenLifecycleHooks {
  public constructor(
    private readonly _def: PartialChildrenDefinition & { name: PropertyKey },
  ) {}

  public register(c: IContainer) {
    instanceRegistration(ILifecycleHooks, this).register(c);
  }

  public hydrating(vm: IIndexable, controller: ICustomElementController) {
    const $def = this._def;
    const childrenObserver = new ChildrenBinding(
      controller,
      vm,
      vm[$def.callback ?? `${safeString($def.name)}Changed`] as () => void,
      $def.query ?? defaultChildQuery,
      $def.filter ?? defaultChildFilter,
      $def.map ?? defaultChildMap,
      $def.options ?? childObserverOptions,
    );
    def(vm, $def.name, {
      enumerable: true,
      configurable: true,
      get: objectAssign((/* ChildrenBinding */) => childrenObserver.getValue(), { getObserver: () => childrenObserver }),
      set: (/* ChildrenBinding */) => {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn(`[DEV:aurelia] property ${safeString($def.name)} decorated with @children is readonly`);
        }
      },
    });
    controller.addBinding(childrenObserver);
  }
}

let mixed = false;
