import { Function } from "./expressions";
import { Type } from "./types";
import { NumberType } from './types/number';
import { FunctionType } from './types/function';
import { SymbolTable } from "../symbol-table";

export interface Value {
    type: Type;
    content: any;

    description: string;
}

class BaseValue implements Value {
    constructor(
        public type: Type,
        public content: any
    ) { }

    get description() {
        return this.type.describeValue(this);
    }
}

export class NumberValue extends BaseValue {
    constructor(
        public content: number
    ) { 
        super(NumberType.getInstance(), content);
    }
}

export class FunctionDescriptor {
    constructor(
        public func: Function,
        public symbolTable: SymbolTable
    ) {}
}

export class FunctionValue extends BaseValue {
    constructor(
        info: FunctionDescriptor | FunctionType,
    ) {
        super(
            (info instanceof FunctionDescriptor)
                ? FunctionType.getInstance(info.func.parameters, info.func.expression, info.symbolTable)
                : info,
            undefined
        );
    }
}
