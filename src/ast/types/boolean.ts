import { Type } from "../types";
import { Value, BooleanValue } from "../values";

export class BooleanType implements Type {
    private _defaultValue: Value = null;

    get defaultValue() {
        if (!this._defaultValue) {
            this._defaultValue = new BooleanValue(false);
        }
        return this._defaultValue;
    }

    get name() {
        return 'Boolean';
    }

    describeValue(value: Value): string {
        return this.name + ': ' + (value as BooleanValue).content;
    }

    private static instance = new BooleanType();

    static getInstance() {
        return BooleanType.instance;
    }
}