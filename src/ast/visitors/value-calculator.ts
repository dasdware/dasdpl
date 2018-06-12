import {ExpressionVisitor} from '../visitors';
import * as Expressions from '../expressions';
import * as Values from '../values';
import { SymbolTable } from '../../symbol-table';
import { areCalculationCompatible, areComparisonCompatible, areEqualityCompatible } from '../types/checks';


export function calculateValue(expression: Expressions.Expression, symbolTable: SymbolTable) {
    return expression.accept(new ValueInfoVisitor(symbolTable));
}

class ValueInfoVisitor implements ExpressionVisitor<Values.Value> {
    
    constructor(
        private _symbolTable: SymbolTable
    ) { }


    equal(expression: Expressions.Binary,  comparer: (left: any, right: any) => boolean): Values.Value {
        const left = expression.left.accept(this);
        const right = expression.right.accept(this);

        if (areEqualityCompatible(left.type, right.type)) {
            return new Values.BooleanValue(comparer(left.content, right.content));
        } else {
            throw new Error('Invalid types for comparison operation.');
        }
    }

    compare(expression: Expressions.Binary, comparer: (left: any, right: any) => boolean): Values.Value {
        const left = expression.left.accept(this);
        const right = expression.right.accept(this);

        if (areComparisonCompatible(left.type, right.type)) {
            return new Values.BooleanValue(comparer(left.content, right.content));
        } else {
            throw new Error('Invalid types for comparison operation.');
        }
    }


    calculate(expression: Expressions.Binary,
            calculator: (left: number, right: number) => number): Values.Value {
        const left = expression.left.accept(this);
        const right = expression.right.accept(this);

        if (areCalculationCompatible(left.type, right.type)) {
            return new Values.NumberValue(calculator(left.content, right.content));
        } else {
            throw new Error('Invalid valid types for calculation operation.');
        }
    }

    // equality

    visitEqual(expression: Expressions.Equal) {
        return this.equal(expression, (left, right) => left === right);
    }

    visitNotEqual(expression: Expressions.NotEqual) {
        return this.equal(expression, (left, right) => left !== right);
    }

    // comparison

    visitLess(expression: Expressions.Less) {
        return this.compare(expression, (left, right) => left < right);
    }

    visitLessOrEqual(expression: Expressions.LessOrEqual) {
        return this.compare(expression, (left, right) => left <= right);
    }

    visitGreater(expression: Expressions.Greater) {
        return this.compare(expression, (left, right) => left > right);
    }

    visitGreaterOrEqual(expression: Expressions.GreaterOrEqual) {
        return this.compare(expression, (left, right) => left >= right);
    }

    // addition

    visitAdd(expression: Expressions.Add): Values.Value {
        return this.calculate(expression,
            ((left, right) => left + right));
    }

    visitSubtract(expression: Expressions.Subtract): Values.Value {
        return this.calculate(expression,
            ((left, right) => left - right));
    }

    // multiplication

    visitMultiply(expression: Expressions.Multiply): Values.Value {
        return this.calculate(expression,
            ((left, right) => left * right));
    }

    visitDivide(expression: Expressions.Divide): Values.Value {
        return this.calculate(expression,
            ((left, right) => left / right));
    }

    // primaries

    visitNumber(expression: Expressions.Number): Values.Value {
        return new Values.NumberValue(expression.value);
    }

    visitBoolean(expression: Expressions.Boolean): Values.Value {
        return new Values.BooleanValue(expression.value);
    }

    visitSymbol(expression: Expressions.Symbol): Values.Value {
        const targetExpression = this._symbolTable.get(expression.name);
        if (targetExpression) {
            return targetExpression.accept(this);
        }
        return new Values.NumberValue(NaN);
    }

    visitFunctionCall(expression: Expressions.FunctionCall): Values.Value {
        const func = this._symbolTable.get(expression.name) as Expressions.Function;

        this._symbolTable = new SymbolTable(this._symbolTable);
        for (let i = 0; i < func.parameters.length; ++i) {
            this._symbolTable.put(func.parameters[i].name, expression.parameters[i]);
        }

        try {
            return func.expression.accept(this);
        } finally {
            this._symbolTable = this._symbolTable.parent;
        }
    }

    // functions

    visitParameter(expression: Expressions.Parameter): Values.Value {
        return null;
    }

    visitFunction(expression: Expressions.Function): Values.Value {
        return new Values.FunctionValue(
            new Values.FunctionDescriptor(expression, this._symbolTable));
    }

    visitNativeCode(expression: Expressions.NativeCode): Values.Value {
        const params: Values.Value[] = [];
        for (let param of expression.wrapper.parameters) {
            params.push(
                calculateValue(this._symbolTable.get(param.name), this._symbolTable));
        }
        return expression.callback(params);
    }
}