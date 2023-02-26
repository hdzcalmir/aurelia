import { $Undefined } from './undefined';
import { $Null } from './null';
import { $Boolean } from './boolean';
import { $String } from './string';
import { $Symbol } from './symbol';
import { $Number } from './number';
import { $Empty } from './empty';
import { $Object } from './object';
import { $Function, $BuiltinFunction } from './function';
import { $BoundFunctionExoticObject } from '../exotics/bound-function';
import { $ArrayExoticObject } from '../exotics/array';
import { $ProxyExoticObject } from '../exotics/proxy';
import { $ImmutablePrototypeExoticObject } from '../exotics/immutable-prototype';
import { $NamespaceExoticObject } from '../exotics/namespace';
import { $StringExoticObject } from '../exotics/string';
import { $IntegerIndexedExoticObject } from '../exotics/integer-indexed';
import { $ArgumentsExoticObject } from '../exotics/arguments';
import { $Error } from './error';
export declare const enum CompletionType {
    normal = 1,
    break = 2,
    continue = 3,
    return = 4,
    throw = 5
}
export type AbruptCompletionType = (CompletionType.break | CompletionType.continue | CompletionType.return | CompletionType.throw);
export type PotentialNonEmptyCompletionType = (CompletionType.normal | CompletionType.return | CompletionType.throw);
export type PotentialEmptyCompletionType = (CompletionType.normal | CompletionType.break | CompletionType.continue);
export type CompletionTarget = $String | $Empty;
export declare const nextValueId: () => number;
export type $Primitive = ($Undefined | $Null | $Boolean | $String | $Symbol | $Number);
export type $AnyNonEmpty = ($Primitive | $AnyObject | $Error);
export type $AnyNonEmptyNonError = ($Primitive | $AnyObject);
export type $AnyObject = ($ArgumentsExoticObject | $ArrayExoticObject | $BoundFunctionExoticObject | $BuiltinFunction | $Function | $ImmutablePrototypeExoticObject | $IntegerIndexedExoticObject | $NamespaceExoticObject | $Object | $ProxyExoticObject | $StringExoticObject);
export type $AnyNonError = ($Empty | $AnyNonEmpty);
export type $Any = ($AnyNonError | $Error);
export type $PropertyKey = ($String | $Symbol);
export type ESType = 'Undefined' | 'Null' | 'Boolean' | 'String' | 'Symbol' | 'Number' | 'Object';
export type $NonNumberPrimitive = Exclude<$Primitive, $Number>;
export type $NonNilPrimitive = Exclude<$Primitive, $Undefined | $Null>;
export type $NonNil = Exclude<$AnyNonError, $Undefined | $Null>;
export declare function getPath(obj: {
    path: string;
}): string;
export declare const Int32: (value: unknown) => number;
export declare const Uint32: (value: unknown) => number;
export declare const Int16: (value: unknown) => number;
export declare const Uint16: (value: unknown) => number;
export declare const Int8: (value: unknown) => number;
export declare const Uint8: (value: unknown) => number;
export declare const Uint8Clamp: (value: unknown) => number;
export declare function compareIndices(a: $String, b: $String): number;
//# sourceMappingURL=_shared.d.ts.map