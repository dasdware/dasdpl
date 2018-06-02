import {ExpressionVisitor} from '../visitors';
import * as Expressions from '../expressions';
import * as Values from '../values';
import { SymbolTable } from '../../symbol-table';


export function calculateValue(expression: Expressions.Expression, symbolTable: SymbolTable) {
    return expression.accept(new ValueInfoVisitor(symbolTable));
}

export function calculateType(expression: Expressions.Expression, symbolTable: SymbolTable) {
    return calculateValue(expression, symbolTable).type;
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

    visitAdd(expression: Expressions.Add): Values.Value {
        return this.calculateBinary(expression,
            ((left, right) => left + right));
    }

    visitSubtract(expression: Expressions.Subtract): Values.Value {
        return this.calculateBinary(expression,
            ((left, right) => left - right));
    }

    visitMultiply(expression: Expressions.Multiply): Values.Value {
        return this.calculateBinary(expression,
            ((left, right) => left * right));
    }

    visitDivide(expression: Expressions.Divide): Values.Value {
        return this.calculateBinary(expression,
            ((left, right) => left / right));
    }
    
    visitSymbol(expression: Expressions.Symbol): Values.Value {
        const targetExpression = this._symbolTable.get(expression.name);
        if (targetExpression) {
            return targetExpression.accept(this);
        }
        return new Values.NumberValue(NaN);
    }

    visitFunction(expression: Expressions.Function): Values.Value {
        return new Values.FunctionValue(
            new Values.FunctionDescriptor(expression, this._symbolTable));
    }

    visitFunctionCall(expression: Expressions.FunctionCall): Values.Value {
        const func = this._symbolTable.get(expression.name) as Expressions.Function;

        this._symbolTable = new SymbolTable(this._symbolTable);
        for (let i = 0; i < func.parameters.length; ++i) {
            this._symbolTable.put(func.parameters[i].name, expression.parameters[i]);
        }
        this._symbolTable.put('#currentFunction', func);

        try {
            return func.expression.accept(this);
        } finally {
            this._symbolTable = this._symbolTable.parent;
        }
        
    }

    visitNativeFunction(expression: Expressions.NativeFunction): Values.Value {
        const func = this._symbolTable.get('#currentFunction') as Expressions.Function;
        return new Values.NumberValue(0);
    }


}