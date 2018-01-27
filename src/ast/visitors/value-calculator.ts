import {ExpressionVisitor} from '../visitors';
import * as Expressions from '../expressions';


export interface Value {
    type: string;
    value: any;

    description: string;
}

class NumberValue implements Value {
    constructor(
        public value: number
    ) { }

    get type() {
        return 'Number';
    }

    get description() {
        return `${this.type}<${this.value}>`;
    }
}

export function calculateValue(expression: Expressions.Expression) {
    return expression.accept(new ValueInfoVisitor());
}

class ValueInfoVisitor implements ExpressionVisitor<Value> {

    visitNumber(expression: Expressions.Number): Value {
        return new NumberValue(expression.value);
    }

    calculateBinary(expression: Expressions.Binary,
            calculator: (left: number, right: number) => number): Value {
        const left = expression.left.accept(this);
        const right = expression.right.accept(this);

        if ((left instanceof NumberValue) && (right instanceof NumberValue)) {
            return new NumberValue(calculator(left.value, right.value));
        } else {
            throw new Error('Invalid valid types for binary calculation operation.');
        }
    }

    visitAdd(expression: Expressions.Add) {
        return this.calculateBinary(expression,
            ((left, right) => left + right));
    }

    visitSubtract(expression: Expressions.Subtract) {
        return this.calculateBinary(expression,
            ((left, right) => left - right));
    }

    visitMultiply(expression: Expressions.Multiply) {
        return this.calculateBinary(expression,
            ((left, right) => left * right));
    }

    visitDivide(expression: Expressions.Divide) {
        return this.calculateBinary(expression,
            ((left, right) => left / right));
    }
    
}