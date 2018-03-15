import { Type } from "../types";
import { Parameter, Expression } from "../expressions";
import { Value } from "../values";
import { calculateType } from '../visitors/type-calculator';

export class FunctionType implements Type {
    constructor(
        public parameters: Parameter[],
        public result: Type
    ) { }

    get name() {
        return 'Function' + '[' + this.signature + ']';
    }

    get signature() {
        let signature = '(';

        for (let i = 0; i < this.parameters.length; ++i) {
            if (i > 0) {
                signature += ', ';
            }
            signature += this.parameters[i].type.name;
        }

        signature += ') -> ' + this.result.name;
        return signature;        
    }

    describeValue(value: Value): string {
        return this.name;
    }


    static getInstance(parameters: Parameter[], expression: Expression) {
        return new FunctionType(parameters, calculateType(expression));
    }
}
