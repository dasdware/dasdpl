import { Type } from "../types";
import { Parameter, Expression, Function } from "../expressions";
import { Value, FunctionValue } from "../values";
import { calculateType } from '../visitors/type-calculator';
import { SymbolTable } from "../../symbol-table";

export class FunctionType implements Type {

    defaultValue: Value;

    constructor(
        public parameters: Parameter[],
        public result: Type
    ) { 
        this.defaultValue = new FunctionValue(this);
    }

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


    static getInstance(parameters: Parameter[], expression: Expression, symbolTable: SymbolTable) {
        return new FunctionType(parameters, 
            calculateType(new Function(parameters, expression), symbolTable));
    }
}
