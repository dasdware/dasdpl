import { Parameter } from "./expressions";
import { Value, NumberValue } from "./values";

export interface Type {
    name: string;
    
    describeValue(value: Value): string;
}


/*export const Types = {
    NUMBER: () => new NumberType(),
    FUNCTION: (parameters: Parameter[], result: Type) => 
        new FunctionType(parameters, result)
};

export function AreCompatible(left: Type, right: Type) {

}

export function AreCalculationCompatible(left: Type, right: Type) {
    return (left instanceof NumberType) && (right instanceof NumberType);
}*/