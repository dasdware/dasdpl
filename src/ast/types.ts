import { Parameter } from "./expressions";
import { Value } from "./values";

export * from './types/number';

export interface Type {
    name: string;
    
    describeValue(value: Value): string;
    defaultValue: Value;
}
