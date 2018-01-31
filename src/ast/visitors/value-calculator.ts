import {ExpressionVisitor} from '../visitors';
import * as Expressions from '../expressions';
import { SymbolTable } from '../../symbol-table';


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

export function calculateValue(expression: Expressions.Expression, symbolTable: SymbolTable) {
    return expression.accept(new ValueInfoVisitor(symbolTable));
}

class ValueInfoVisitor implements ExpressionVisitor<Value> {

    constructor(
        private _symbolTable: SymbolTable
    ) { }

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
    
    visitSymbol(expression: Expressions.Symbol) {
        const targetExpression = this._symbolTable.get(expression.name);
        if (targetExpression) {
            return targetExpression.accept(this);
        }
        return new NumberValue(NaN);
    }
}