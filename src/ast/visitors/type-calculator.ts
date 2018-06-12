import * as Expressions from '../expressions';
import { Type } from '../types';
import { ExpressionVisitor } from '../visitors';
import { NumberType } from '../types/number';
import { SymbolTable } from '../../symbol-table';
import { BooleanType } from '../types/boolean';
import { areCompatible, areComparisonCompatible,
    areCalculationCompatible, combineTypes, areEqualityCompatible } from '../types/checks';

export function calculateType(expression: Expressions.Expression,
     symbolTable: SymbolTable)  {
    return expression.accept(new TypeInfoVisitor(symbolTable));
}

class TypeInfoVisitor implements ExpressionVisitor<Type> {

    constructor(
        private _symbols: SymbolTable
    ) {}

    private checkEquality(equality: Expressions.Binary) {
        const leftType = equality.left.accept(this);
        const rightType = equality.right.accept(this);

        if (areEqualityCompatible(leftType, rightType)) {
            return combineTypes(leftType, rightType);
        } else {
            throw new Error(`Incompatible types: ${leftType.name} and ${rightType.name}`);
        }
    }

    private checkComparison(comparison: Expressions.Binary) {
        const leftType = comparison.left.accept(this);
        const rightType = comparison.right.accept(this);

        if (areComparisonCompatible(leftType, rightType)) {
            return combineTypes(leftType, rightType);
        } else {
            throw new Error(`Incompatible types: ${leftType.name} and ${rightType.name}`);
        }
    }

    private checkCalculation(calculation: Expressions.Binary) {
        const leftType = calculation.left.accept(this);
        const rightType = calculation.right.accept(this);

        if (areCalculationCompatible(leftType, rightType)) {
            return combineTypes(leftType, rightType);
        } else {
            throw new Error(`Incompatible types: ${leftType.name} and ${rightType.name}`);
        }
    }

    // equality

    visitEqual(expression: Expressions.Equal) {
        return this.checkEquality(expression);
    }

    visitNotEqual(expression: Expressions.NotEqual) {
        return this.checkEquality(expression);
    }

    // comparison

    visitLess(expression: Expressions.Less) {
        return this.checkComparison(expression);
    }

    visitLessOrEqual(expression: Expressions.LessOrEqual) {
        return this.checkComparison(expression);
    }

    visitGreater(expression: Expressions.Greater) {
        return this.checkComparison(expression);
    }

    visitGreaterOrEqual(expression: Expressions.GreaterOrEqual) {
        return this.checkComparison(expression);
    }

    // multiplication

    visitMultiply(expression: Expressions.Multiply): Type {
        return this.checkCalculation(expression);
    }

    visitDivide(expression: Expressions.Divide): Type {
        return this.checkCalculation(expression);
    }

    // addition

    visitAdd(expression: Expressions.Add): Type {
        return this.checkCalculation(expression);
    }

    visitSubtract(expression: Expressions.Subtract): Type {
        return this.checkCalculation(expression);
    }

    // primaries

    visitNumber(expression: Expressions.Number): Type {
        return NumberType.getInstance();
    }

    visitBoolean(expression: Expressions.Boolean): Type {
        return BooleanType.getInstance();
    }    

    visitSymbol(expression: Expressions.Symbol): Type {
        let target = this._symbols.get(expression.name);
        if (!target) {
            throw new Error(`Unknown symbol '${expression.name}'`);
        }

        return target.accept(this);
    }

    visitFunctionCall(expression: Expressions.FunctionCall): Type {
        let func = this._symbols.get(expression.name);
        if (!func || !(func instanceof Expressions.Function)) {
            throw new Error(`Unknown function '${expression.name}'`);
        }

        if (func.parameters.length != expression.parameters.length) {
            throw new Error(`Function '${expression.name}' needs ${func.parameters.length} paramaters, got ${expression.parameters.length}`);
        }

        func.parameters.forEach(
            (param, index) => {
                let expectedType: Type = param.accept(this);
                let actualType: Type = expression.parameters[index].accept(this);
                if (!areCompatible(expectedType, actualType)) {
                    throw new Error(`Incompatible types '${actualType.name}' and '${expectedType.name}'`);
                }
        })

        return this.visitFunction(func);
    }

    // functions

    visitParameter(expression: Expressions.Parameter): Type {
        return expression.type;  
    }

    visitFunction(expression: Expressions.Function): Type {
        this._symbols = new SymbolTable(this._symbols);
        try {
            for (let parameter of expression.parameters) {
                this._symbols.put(parameter.name, parameter);
            }
            return expression.expression.accept(this);
        } finally {
            this._symbols = this._symbols.parent;
        }        
    }

    visitNativeCode(expression: Expressions.NativeCode): Type {
        return expression.resultType;
    }
}