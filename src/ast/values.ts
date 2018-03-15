import { Function } from "./expressions";
import { Type } from "./types";
import { NumberType } from './types/number';
import { FunctionType } from './types/function';

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

export class FunctionValue extends BaseValue {
    constructor(
        public value: Function
    ) {
        super(
            FunctionType.getInstance(value.parameters, value),
            undefined
        );
    }
}
