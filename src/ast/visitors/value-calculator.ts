import {ExpressionVisitor} from '../visitors';
import * as Expressions from '../expressions';
import * as Values from '../values';
import { SymbolTable } from '../../symbol-table';


export function calculateValue(expression: Expressions.Expression, symbolTable: SymbolTable) {
    return expression.accept(new ValueInfoVisitor(symbolTable));
}

class ValueInfoVisitor implements ExpressionVisitor<Values.Value> {
    constructor(
        private _symbolTable: SymbolTable
    ) { }

    visitNumber(expression: Expressions.Number): Values.Value {
        return new Values.NumberValue(expression.value);
    }

    calculateBinary(expression: Expressions.Binary,
            calculator: (left: number, right: number) => number): Values.Value {
        const left = expression.left.accept(this);
        const right = expression.right.accept(this);

        if ((left instanceof Values.NumberValue) && (right instanceof Values.NumberValue)) {
            return new Values.NumberValue(calculator(left.content, right.content));
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
        return new Values.NumberValue(NaN);
    }

    visitFunction(expression: Expressions.Function): Values.Value {
        return new Values.FunctionValue(expression);
    }
}