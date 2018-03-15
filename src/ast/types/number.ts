import { Type } from "../types";
import { Value, NumberValue } from "../values";

export class NumberType implements Type {
    get name() {
        return 'Number';
    }

    describeValue(value: Value): string {
        return this.name + ': ' + (value as NumberValue).content;
    }

    private static instance = new NumberType();

    static getInstance() {
        return NumberType.instance;
    }
}