import { ComponentParameters, ComponentAppellation, ViewportHandle } from './interfaces';
import { ViewportInstruction } from './viewport-instruction';
import { Scope } from './scope';
import { INode } from '@aurelia/runtime';

export interface IInstructionResolverOptions {
  separators?: IRouteSeparators;
}

export interface IRouteSeparators extends Partial<ISeparators> { }

interface ISeparators {
  viewport: string;
  sibling: string;
  scope: string;
  scopeStart: string;
  scopeEnd: string;
  noScope: string;
  parameters: string;
  parametersEnd: string;
  parameterSeparator: string;
  parameterKeySeparator: string;
  parameter?: string;
  add: string;
  clear: string;
  action: string;
}

export interface IComponentParameter {
  key?: string | undefined;
  value: unknown;
}

export class InstructionResolver<T extends INode> {
  public separators: ISeparators = {
    viewport: '@', // ':',
    sibling: '+', // '/',
    scope: '/', // '+',
    scopeStart: '(', // ''
    scopeEnd: ')', // ''
    noScope: '!',
    parameters: '(', // '='
    parametersEnd: ')', // ''
    parameterSeparator: ',',
    parameterKeySeparator: '=',
    parameter: '&',
    add: '+',
    clear: '-',
    action: '.',
  };

  public activate(options?: IInstructionResolverOptions): void {
    options = options || {};
    this.separators = { ...this.separators, ...options.separators };
  }

  public get clearViewportInstruction(): string {
    return this.separators.clear;
  }

  public get addViewportInstruction(): string {
    return this.separators.add;
  }

  public isClearViewportInstruction(instruction: string | ViewportInstruction<T>): boolean {
    return instruction instanceof ViewportInstruction
      ? instruction.componentName === this.clearViewportInstruction && !!instruction.viewportName
      : instruction.startsWith(this.clearViewportInstruction) && instruction !== this.clearViewportInstruction;
  }

  public isAddViewportInstruction(instruction: string | ViewportInstruction<T>): boolean {
    return instruction instanceof ViewportInstruction
      ? instruction.componentName === this.addViewportInstruction
      : (instruction === this.addViewportInstruction
        || instruction.startsWith(`${this.separators.add}${this.separators.viewport}`));
  }

  public isClearViewportScopeInstruction(instruction: string | ViewportInstruction<T>): boolean {
    return instruction instanceof ViewportInstruction
      ? instruction.componentName === this.clearViewportInstruction && !!instruction.viewportScope
      : instruction.startsWith(this.clearViewportInstruction) && instruction !== this.clearViewportInstruction;
  }

  public isClearAllViewportsInstruction(instruction: string | ViewportInstruction<T>): boolean {
    return instruction instanceof ViewportInstruction
      ? instruction.componentName === this.clearViewportInstruction && !instruction.viewportName
      : instruction === this.clearViewportInstruction;
  }

  public isAddAllViewportsInstruction(instruction: string | ViewportInstruction<T>): boolean {
    return instruction instanceof ViewportInstruction
      ? instruction.componentName === this.addViewportInstruction && !instruction.viewportName
      : instruction === this.addViewportInstruction;
  }

  public createViewportInstruction(
    component: ComponentAppellation<T>,
    viewport?: ViewportHandle<T>,
    parameters?: ComponentParameters,
    ownsScope: boolean = true,
    nextScopeInstructions: ViewportInstruction<T>[] | null = null,
  ): ViewportInstruction<T> {
    const instruction: ViewportInstruction<T> = new ViewportInstruction(component, viewport, parameters, ownsScope, nextScopeInstructions);
    instruction.setInstructionResolver(this);
    return instruction;
  }

  public parseViewportInstructions(instructions: string): ViewportInstruction<T>[] {
    const match = /^[./]+/.exec(instructions);
    let context = '';
    if (Array.isArray(match) && match.length > 0) {
      context = match[0];
      instructions = instructions.slice(context.length);
    }
    const parsedInstructions: ViewportInstruction<T>[] = this.parseViewportInstructionsWorker(instructions, true).instructions;
    for (const instruction of parsedInstructions) {
      instruction.context = context;
    }
    return parsedInstructions;
  }

  public parseViewportInstruction(instruction: string): ViewportInstruction<T> {
    const instructions = this.parseViewportInstructions(instruction);
    if (instructions.length) {
      return instructions[0];
    }
    return this.createViewportInstruction('');
  }

  public stringifyViewportInstructions(
    instructions: ViewportInstruction<T>[],
    excludeViewport: boolean = false,
    viewportContext: boolean = false,
  ): string {
    return instructions
      .map(instruction => this.stringifyViewportInstruction(instruction, excludeViewport, viewportContext))
      .filter(instruction => instruction && instruction.length)
      .join(this.separators.sibling);
  }

  public stringifyViewportInstruction(
    instruction: ViewportInstruction<T> | string,
    excludeViewport: boolean = false,
    viewportContext: boolean = false,
  ): string {
    if (typeof instruction === 'string') {
      return this.stringifyAViewportInstruction(instruction, excludeViewport);
    } else {
      let excludeCurrentViewport = excludeViewport;
      let excludeCurrentComponent = false;
      if (viewportContext) {
        if (instruction.viewport && instruction.viewport.options.noLink) {
          return '';
        }
        if (!instruction.needsViewportDescribed && instruction.viewport && !instruction.viewport.options.forceDescription) {
          excludeCurrentViewport = true;
        }
        if (instruction.viewport && instruction.viewport.options.fallback === instruction.componentName) {
          excludeCurrentComponent = true;
        }
        if (!instruction.needsViewportDescribed && instruction.viewportScope) {
          excludeCurrentViewport = true;
        }
      }
      const route: string | null = instruction.route;
      const nextInstructions: ViewportInstruction<T>[] | null = instruction.nextScopeInstructions;
      let stringified: string = instruction.context;
      // It's a configured route
      if (route !== null) {
        // Already added as part of a configuration, skip to next scope
        if (route === '') {
          return Array.isArray(nextInstructions)
            ? this.stringifyViewportInstructions(nextInstructions, excludeViewport, viewportContext)
            : '';
        }
        stringified += route.endsWith(this.separators.scope) ? route.slice(0, -this.separators.scope.length) : route;
      } else {
        stringified += this.stringifyAViewportInstruction(instruction, excludeCurrentViewport, excludeCurrentComponent);
      }
      if (Array.isArray(nextInstructions) && nextInstructions.length) {
        const nextStringified: string = this.stringifyViewportInstructions(nextInstructions, excludeViewport, viewportContext);
        if (nextStringified.length > 0) {
          stringified += nextInstructions.length === 1 // TODO: This should really also check that the instructions have value
            ? `${this.separators.scope}${nextStringified}`
            : `${this.separators.scope}${this.separators.scopeStart}${nextStringified}${this.separators.scopeEnd}`;
        }
      }
      return stringified;
    }
  }

  public stringifyScopedViewportInstructions(
    instructions: ViewportInstruction<T> | string | (ViewportInstruction<T> | string)[],
  ): string {
    if (!Array.isArray(instructions)) {
      return this.stringifyScopedViewportInstructions([instructions]);
    }
    return instructions.map((instruction) => this.stringifyViewportInstruction(instruction)).join(this.separators.scope);
  }

  public encodeViewportInstructions(instructions: ViewportInstruction<T>[]): string {
    return encodeURIComponent(this.stringifyViewportInstructions(instructions)).replace(/\(/g, '%28').replace(/\)/g, '%29');
  }
  public decodeViewportInstructions(instructions: string): ViewportInstruction<T>[] {
    return this.parseViewportInstructions(decodeURIComponent(instructions));
  }

  public buildScopedLink(scopeContext: string, href: string): string {
    if (scopeContext) {
      href = `/${scopeContext}${this.separators.scope}${href}`;
    }
    return href;
  }

  public shouldClearViewports(path: string): { clearViewports: boolean; newPath: string } {
    const clearViewports = (path === this.separators.clear || path.startsWith(this.separators.clear + this.separators.add));
    const newPath = path.startsWith(this.separators.clear) ? path.slice(2) : path;
    return { clearViewports, newPath };
  }

  public mergeViewportInstructions(instructions: (string | ViewportInstruction<T>)[]): ViewportInstruction<T>[] {
    const merged: ViewportInstruction<T>[] = [];

    for (let instruction of instructions) {
      if (typeof instruction === 'string') {
        instruction = this.parseViewportInstruction(instruction);
      }
      const index = merged.findIndex(merge => merge.sameViewport(instruction as ViewportInstruction<T>));
      if (index >= 0) {
        merged.splice(index, 1, instruction);
      } else {
        merged.push(instruction);
      }
    }
    return merged;
  }

  public flattenViewportInstructions(instructions: ViewportInstruction<T>[]): ViewportInstruction<T>[] {
    const flat: ViewportInstruction<T>[] = [];
    for (const instruction of instructions) {
      flat.push(instruction);
      if (instruction.nextScopeInstructions) {
        flat.push(...this.flattenViewportInstructions(instruction.nextScopeInstructions));
      }
    }
    return flat;
  }

  public cloneViewportInstructions(
    instructions: ViewportInstruction<T>[],
    keepInstances: boolean = false,
    context: boolean = false,
  ): ViewportInstruction<T>[] {
    const clones: ViewportInstruction<T>[] = [];
    for (const instruction of instructions) {
      const clone = this.createViewportInstruction(
        (keepInstances ? instruction.componentInstance : null) || instruction.componentType || instruction.componentName!,
        keepInstances ? instruction.viewport || instruction.viewportName! : instruction.viewportName!,
        instruction.typedParameters !== null ? instruction.typedParameters : void 0,
      );
      clone.needsViewportDescribed = instruction.needsViewportDescribed;
      clone.route = instruction.route;
      if (context) {
        clone.context = instruction.context;
      }
      clone.viewportScope = keepInstances ? instruction.viewportScope : null;
      clone.scope = keepInstances ? instruction.scope : null;
      if (instruction.nextScopeInstructions) {
        clone.nextScopeInstructions = this.cloneViewportInstructions(instruction.nextScopeInstructions, keepInstances, context);
      }
      clones.push(clone);
    }
    return clones;
  }

  // TODO: Deal with separators in data and complex types
  public parseComponentParameters(
    parameters: ComponentParameters | null,
    uriComponent: boolean = false,
  ): IComponentParameter[] {
    if (parameters === undefined || parameters === null || parameters.length === 0) {
      return [];
    }
    if (typeof parameters === 'string') {
      const list: IComponentParameter[] = [];
      const params = parameters.split(this.separators.parameterSeparator);
      for (const param of params) {
        let key: string | undefined;
        let value: string;
        [key, value] = param.split(this.separators.parameterKeySeparator);
        if (value === void 0) {
          value = uriComponent ? decodeURIComponent(key) : key;
          key = void 0;
        } else if (uriComponent) {
          key = decodeURIComponent(key);
          value = decodeURIComponent(value);
        }
        list.push({ key, value });
      }
      return list;
    }
    if (Array.isArray(parameters)) {
      return parameters.map(param => ({ key: void 0, value: param }));
    }
    const keys = Object.keys(parameters);
    keys.sort();
    return keys.map(key => ({ key, value: parameters[key] }));
  }
  // TODO: Deal with separators in data and complex types
  public stringifyComponentParameters(parameters: IComponentParameter[], uriComponent: boolean = false): string {
    if (!Array.isArray(parameters) || parameters.length === 0) {
      return '';
    }
    const seps = this.separators;
    return parameters
      .map(param => {
        const key = param.key !== void 0 && uriComponent ? encodeURIComponent(param.key) : param.key;
        const value = uriComponent ? encodeURIComponent(param.value as string) : param.value as string;
        return key !== void 0 && key !== value ? key + seps.parameterKeySeparator + value : value;
      })
      .join(seps.parameterSeparator);
  }

  public matchScope(
    instructions: ViewportInstruction<T>[],
    scope: Scope<T>,
  ): ViewportInstruction<T>[] {
    const matching: ViewportInstruction<T>[] = [];

    matching.push(...instructions.filter(instruction => instruction.scope === scope));
    matching.push(...instructions
      .filter(instr => instr.scope !== scope)
      .map(instr => Array.isArray(instr.nextScopeInstructions) ? this.matchScope(instr.nextScopeInstructions!, scope) : [])
      .flat()
    );
    return matching;
  }

  public matchChildren(
    instructions: ViewportInstruction<T>[],
    active: ViewportInstruction<T>[],
  ): boolean {
    for (const instruction of instructions) {
      const matching = active.filter(instr => instr.sameComponent(instruction));
      if (matching.length === 0) {
        return false;
      }
      if (Array.isArray(instruction.nextScopeInstructions)
        && instruction.nextScopeInstructions.length > 0
        && this.matchChildren(
          instruction.nextScopeInstructions,
          matching.map(instr => Array.isArray(instr.nextScopeInstructions) ? instr.nextScopeInstructions : []).flat()
        ) === false) {
        return false;
      }
    }
    return true;
  }

  private parseViewportInstructionsWorker(
    instructions: string,
    grouped: boolean = false,
  ): {
    instructions: ViewportInstruction<T>[];
    remaining: string;
  } {
    if (!instructions) {
      return { instructions: [], remaining: '' };
    }
    if (instructions.startsWith(this.separators.scopeStart)) {
      instructions = `${this.separators.scope}${instructions}`;
    }
    const viewportInstructions: ViewportInstruction<T>[] = [];
    let guard = 1000;
    while (instructions.length && guard) {
      guard--;
      if (instructions.startsWith(this.separators.scope)) {
        instructions = instructions.slice(this.separators.scope.length);
        const scopeStart = instructions.startsWith(this.separators.scopeStart);
        if (scopeStart) {
          instructions = instructions.slice(this.separators.scopeStart.length);
        }
        const { instructions: found, remaining } = this.parseViewportInstructionsWorker(instructions, scopeStart);
        if (viewportInstructions.length) {
          viewportInstructions[viewportInstructions.length - 1].nextScopeInstructions = found;
        } else {
          viewportInstructions.push(...found);
        }
        instructions = remaining;

      } else if (instructions.startsWith(this.separators.scopeEnd)) {
        if (grouped) {
          instructions = instructions.slice(this.separators.scopeEnd.length);
        }
        return { instructions: viewportInstructions, remaining: instructions };

      } else if (instructions.startsWith(this.separators.sibling) && !this.isAddViewportInstruction(instructions)) {
        if (!grouped) {
          return { instructions: viewportInstructions, remaining: instructions };
        }
        instructions = instructions.slice(this.separators.sibling.length);

      } else {
        const { instruction: viewportInstruction, remaining } = this.parseAViewportInstruction(instructions);
        viewportInstructions.push(viewportInstruction);
        instructions = remaining;
      }
    }

    return { instructions: viewportInstructions, remaining: instructions };
  }

  private findNextToken(
    instruction: string,
    tokens: string[],
  ): {
    token: string;
    pos: number;
  } {
    const matches: Record<string, number> = {};
    // Tokens can have length > 1
    for (const token of tokens) {
      const tokenPos = instruction.indexOf(token);
      if (tokenPos > -1) {
        matches[token] = instruction.indexOf(token);
      }
    }
    const pos = Math.min(...Object.values(matches));
    for (const token in matches) {
      if (matches[token] === pos) {
        return { token, pos };
      }
    }
    return { token: '', pos: -1 };
  }

  private parseAViewportInstruction(
    instruction: string,
  ): {
    instruction: ViewportInstruction<T>;
    remaining: string;
  } {
    const seps = this.separators;
    const tokens = [seps.parameters, seps.viewport, seps.noScope, seps.scopeEnd, seps.scope, seps.sibling];
    let component: string | undefined = void 0;
    let parametersString: string | undefined = void 0;
    let viewport: string | undefined = void 0;
    let scope = true;
    let token!: string;
    let pos: number;

    const specials = [seps.add, seps.clear];
    for (const special of specials) {
      if (instruction === special) {
        component = instruction;
        instruction = '';
        tokens.shift(); // parameters
        tokens.shift(); // viewport
        token = seps.viewport;
        break;
      }
    }
    if (component === void 0) {
      for (const special of specials) {
        if (instruction.startsWith(`${special}${seps.viewport}`)) {
          component = special;
          instruction = instruction.slice(`${special}${seps.viewport}`.length);
          tokens.shift(); // parameters
          tokens.shift(); // viewport
          token = seps.viewport;
          break;
        }
      }
    }

    if (component === void 0) {
      ({ token, pos } = this.findNextToken(instruction, tokens));

      component = pos !== -1 ? instruction.slice(0, pos) : instruction;
      instruction = pos !== -1 ? instruction.slice(pos + token.length) : '';

      tokens.shift(); // parameters
      if (token === seps.parameters) {
        ({ token, pos } = this.findNextToken(instruction, [seps.parametersEnd]));
        parametersString = instruction.slice(0, pos);
        instruction = instruction.slice(pos + token.length);

        ({ token } = this.findNextToken(instruction, tokens));
        instruction = instruction.slice(token.length);
      }

      tokens.shift(); // viewport
    }
    if (token === seps.viewport) {
      ({ token, pos } = this.findNextToken(instruction, tokens));
      viewport = pos !== -1 ? instruction.slice(0, pos) : instruction;
      instruction = pos !== -1 ? instruction.slice(pos + token.length) : '';
    }

    tokens.shift(); // noScope
    if (token === seps.noScope) {
      scope = false;
    }

    // Restore token that belongs to next instruction
    if (token === seps.scopeEnd || token === seps.scope || token === seps.sibling) {
      instruction = `${token}${instruction}`;
    }

    const viewportInstruction: ViewportInstruction<T> = this.createViewportInstruction(component, viewport, parametersString, scope);

    return { instruction: viewportInstruction, remaining: instruction };
  }

  private stringifyAViewportInstruction(
    instruction: ViewportInstruction<T> | string,
    excludeViewport: boolean = false,
    excludeComponent: boolean = false,
  ): string {
    if (typeof instruction === 'string') {
      return this.stringifyViewportInstruction(this.parseViewportInstruction(instruction), excludeViewport, excludeComponent);
    } else {
      let instructionString = !excludeComponent ? instruction.componentName : '';
      const specification = instruction.componentType ? instruction.componentType.parameters : null;
      const parameters = this.stringifyComponentParameters(instruction.toSortedParameters(specification));
      if (parameters.length > 0) {
        instructionString += !excludeComponent
          ? `${this.separators.parameters}${parameters}${this.separators.parametersEnd}`
          : parameters;
      }
      if (instruction.viewportName !== null && !excludeViewport) {
        instructionString += this.separators.viewport + instruction.viewportName;
      }
      if (!instruction.ownsScope) {
        instructionString += this.separators.noScope;
      }
      return instructionString || '';
    }
  }
}
