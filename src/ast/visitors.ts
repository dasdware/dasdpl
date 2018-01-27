import * as Expressions from './expressions';
import * as asciitree from 'ascii-tree';

export interface ExpressionVisitor<T> {
    visitNumber(expression: Expressions.Number): T;
    visitAdd(expression: Expressions.Add): T;
    visitSubtract(expression: Expressions.Subtract): T;
    visitMultiply(expression: Expressions.Multiply): T;
    visitDivide(expression: Expressions.Divide): T;
}



export class ToStringVisitor implements ExpressionVisitor<string> {
    visitNumber(expression: Expressions.Number) {
        return `Number<${expression.value}>`;
    }

    visitAdd(expression: Expressions.Add) {
        return `Add<${expression.left.accept(this)}, ${expression.right.accept(this)}>`;
    }

    visitSubtract(expression: Expressions.Subtract) {
        return `Subtract<${expression.left.accept(this)}, ${expression.right.accept(this)}>`;
    }
    
    visitMultiply(expression: Expressions.Multiply) {
        return `Multiply<${expression.left.accept(this)}, ${expression.right.accept(this)}>`;
    }
    
    visitDivide(expression: Expressions.Divide) {
        return `Divide<${expression.left.accept(this)}, ${expression.right.accept(this)}>`;
    }
}

export class CalculateVisitor implements ExpressionVisitor<number> {
    visitNumber(expression: Expressions.Number): number {
        return expression.value;
    }

    visitAdd(expression: Expressions.Add): number {
        return expression.left.accept(this) + expression.right.accept(this);
    }
    visitSubtract(expression: Expressions.Subtract): number {
        return expression.left.accept(this) - expression.right.accept(this);
    }
    visitMultiply(expression: Expressions.Multiply): number {
        return expression.left.accept(this) * expression.right.accept(this);
    }
    visitDivide(expression: Expressions.Divide): number {
        return expression.left.accept(this) / expression.right.accept(this);
    }
}