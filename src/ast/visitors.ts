import * as Expressions from './expressions';

export interface ExpressionVisitor<T> {
    visitNumber(expression: Expressions.Number): T;
    visitAdd(expression: Expressions.Add): T;
    visitSubtract(expression: Expressions.Subtract): T;
    visitMultiply(expression: Expressions.Multiply): T;
    visitDivide(expression: Expressions.Divide): T;
    visitSymbol(expression: Expressions.Symbol): T;
    visitFunction(expression: Expressions.Function): T;
}
