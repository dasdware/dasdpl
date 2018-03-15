import * as Expressions from '../expressions';
import { Type } from '../types';
import { ExpressionVisitor } from '../visitors';
import { NumberType } from '../types/number';

export function calculateType(expression: Expressions.Expression)  {
    return expression.accept(new TypeInfoVisitor());
}

class TypeInfoVisitor implements ExpressionVisitor<Type> {

    private functionParameters: Expressions.Parameter[] = [];

    private areCalculationCompatible(left: Type, right: Type) {
        return (left instanceof NumberType) && (right instanceof NumberType);
    }

    private combineTypes(leftType: Type, rightType: Type) {
        return leftType;
    }

    private checkTypes(left: Expressions.Expression, right: Expressions.Expression) {
        const leftType = left.accept(this);
        const rightType = right.accept(this);

        if (this.areCalculationCompatible(leftType, rightType)) {
            return this.combineTypes(leftType, rightType);
        } else {
            throw new Error(`Incompatible types: ${leftType.name} and ${rightType.name}`);
        }
    }

    visitNumber(expression: Expressions.Number): Type {
        return NumberType.getInstance();
    }

    visitAdd(expression: Expressions.Add) {
        return this.checkTypes(expression.left, expression.right);
    }

    visitSubtract(expression: Expressions.Subtract) {
        return this.checkTypes(expression.left, expression.right);
    }

    visitMultiply(expression: Expressions.Multiply) {
        return this.checkTypes(expression.left, expression.right);
    }

    visitDivide(expression: Expressions.Divide) {
        return this.checkTypes(expression.left, expression.right);
    }

    visitSymbol(expression: Expressions.Symbol) {
        //return this.checkTypes(expression.left, expression.right);
        for (let functionParameter of this.functionParameters) {
            if (functionParameter.name == expression.value) {
                return functionParameter.type;
            }
        }

        throw new Error(`Unknown function parameter '${expression.value}'`);
    }

    visitFunction(expression: Expressions.Function): Type {
        this.functionParameters = expression.parameters;
        return expression.expression.accept(this);
    }
}