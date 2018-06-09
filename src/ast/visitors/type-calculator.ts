import * as Expressions from '../expressions';
import { Type } from '../types';
import { ExpressionVisitor } from '../visitors';
import { NumberType } from '../types/number';
import { SymbolTable } from '../../symbol-table';

export function calculateType(expression: Expressions.Expression,
     symbolTable: SymbolTable)  {
    return expression.accept(new TypeInfoVisitor(symbolTable));
}

class TypeInfoVisitor implements ExpressionVisitor<Type> {

    constructor(
        private _symbols: SymbolTable
    ) {}

    private areCalculationCompatible(left: Type, right: Type) {
        return (left instanceof NumberType) && (right instanceof NumberType);
    }

    private areCompatible(left: Type, right: Type) {
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

    visitAdd(expression: Expressions.Add): Type {
        return this.checkTypes(expression.left, expression.right);
    }

    visitSubtract(expression: Expressions.Subtract): Type {
        return this.checkTypes(expression.left, expression.right);
    }

    visitMultiply(expression: Expressions.Multiply): Type {
        return this.checkTypes(expression.left, expression.right);
    }

    visitDivide(expression: Expressions.Divide): Type {
        return this.checkTypes(expression.left, expression.right);
    }

    visitSymbol(expression: Expressions.Symbol): Type {
        let target = this._symbols.get(expression.value);
        if (!target) {
            throw new Error(`Unknown symbol '${expression.value}'`);
        }

        return target.accept(this);
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
                if (!this.areCompatible(expectedType, actualType)) {
                    throw new Error(`Incompatible types '${actualType.name}' and '${expectedType.name}'`);
                }
        })

        return this.visitFunction(func);
    }

    visitParameter(expression: Expressions.Parameter): Type {
        return expression.type;  
    }

    visitNativeCode(expression: Expressions.NativeCode): Type {
        return expression.resultType;
    }
}