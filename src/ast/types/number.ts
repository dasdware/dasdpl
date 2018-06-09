import { Type } from "../types";
import { Value, NumberValue } from "../values";

export class NumberType implements Type {
    private _defaultValue: Value = null;

    get defaultValue() {
        if (!this._defaultValue) {
            this._defaultValue = new NumberValue(0);
        }
        return this._defaultValue;
    }

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