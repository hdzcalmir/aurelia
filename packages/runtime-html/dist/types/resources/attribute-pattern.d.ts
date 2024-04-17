import { IContainer } from '@aurelia/kernel';
import type { Constructable } from '@aurelia/kernel';
export interface AttributePatternDefinition<T extends string = string> {
    pattern: T;
    symbols: string;
}
export interface ICharSpec {
    chars: string;
    repeat: boolean;
    isSymbol: boolean;
    isInverted: boolean;
    has(char: string): boolean;
    equals(other: ICharSpec): boolean;
}
export declare class CharSpec implements ICharSpec {
    chars: string;
    repeat: boolean;
    isSymbol: boolean;
    isInverted: boolean;
    has: (char: string) => boolean;
    constructor(chars: string, repeat: boolean, isSymbol: boolean, isInverted: boolean);
    equals(other: ICharSpec): boolean;
}
export declare class Interpretation {
    parts: readonly string[];
    get pattern(): string | null;
    set pattern(value: string | null);
    append(pattern: string, ch: string): void;
    next(pattern: string): void;
}
export interface ISegment {
    text: string;
    eachChar(callback: (spec: CharSpec) => void): void;
}
export declare class SegmentTypes {
    statics: number;
    dynamics: number;
    symbols: number;
}
export interface ISyntaxInterpreter {
    add(defs: AttributePatternDefinition[]): void;
    interpret(name: string): Interpretation;
}
export declare const ISyntaxInterpreter: import("@aurelia/kernel").InterfaceSymbol<ISyntaxInterpreter>;
export declare class SyntaxInterpreter implements ISyntaxInterpreter {
    add(defs: AttributePatternDefinition[]): void;
    interpret(name: string): Interpretation;
}
export declare class AttrSyntax {
    rawName: string;
    rawValue: string;
    target: string;
    command: string | null;
    parts: readonly string[] | null;
    constructor(rawName: string, rawValue: string, target: string, command: string | null, parts?: readonly string[] | null);
}
export type IAttributePattern<T extends string = string> = Record<T, (rawName: string, rawValue: string, parts: readonly string[]) => AttrSyntax>;
export declare const IAttributePattern: import("@aurelia/kernel").InterfaceSymbol<IAttributePattern<string>>;
export interface IAttributeParser {
    parse(name: string, value: string): AttrSyntax;
}
export declare const IAttributeParser: import("@aurelia/kernel").InterfaceSymbol<IAttributeParser>;
export declare class AttributeParser implements IAttributeParser {
    constructor();
    parse(name: string, value: string): AttrSyntax;
}
export interface AttributePatternKind {
    readonly name: string;
    define<const K extends AttributePatternDefinition, P extends Constructable<IAttributePattern<K['pattern']>> = Constructable<IAttributePattern<K['pattern']>>>(patternDefs: K[], Type: P): P;
    getPatternDefinitions(Type: Constructable): AttributePatternDefinition[];
    findAll(container: IContainer): readonly IAttributePattern[];
}
export declare function attributePattern<const K extends AttributePatternDefinition>(...patternDefs: K[]): <T extends Constructable<IAttributePattern<K['pattern']>>>(target: T, context: ClassDecoratorContext) => T;
export declare const AttributePattern: Readonly<AttributePatternKind>;
export declare const DotSeparatedAttributePattern: {
    new (): {
        'PART.PART'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
        'PART.PART.PART'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
    };
};
export declare const RefAttributePattern: {
    new (): {
        ref(rawName: string, rawValue: string, _parts: readonly string[]): AttrSyntax;
        'PART.ref'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
    };
};
export declare const EventAttributePattern: {
    new (): {
        'PART.trigger:PART'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
        'PART.capture:PART'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
    };
};
export declare const ColonPrefixedBindAttributePattern: {
    new (): {
        ':PART'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
    };
};
export declare const AtPrefixedTriggerAttributePattern: {
    new (): {
        '@PART'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
        '@PART:PART'(rawName: string, rawValue: string, parts: readonly string[]): AttrSyntax;
    };
};
export declare const SpreadAttributePattern: {
    new (): {
        '...$attrs'(rawName: string, rawValue: string, _parts: readonly string[]): AttrSyntax;
    };
};
//# sourceMappingURL=attribute-pattern.d.ts.map