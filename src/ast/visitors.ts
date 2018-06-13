import * as Expressions from './expressions';

export interface ExpressionVisitor<T> {
    // equality
    visitEqual(expression: Expressions.Equal);
    visitNotEqual(expression: Expressions.NotEqual);

    // comparison
    visitLess(expression: Expressions.Less);
    visitLessOrEqual(expression: Expressions.LessOrEqual);
    visitGreater(expression: Expressions.Greater);
    visitGreaterOrEqual(expression: Expressions.GreaterOrEqual);

    // addition
    visitAdd(expression: Expressions.Add): T;
    visitSubtract(expression: Expressions.Subtract): T;

    // multiplication
    visitMultiply(expression: Expressions.Multiply): T;
    visitDivide(expression: Expressions.Divide): T;

    // primaries
    visitNumber(expression: Expressions.Number): T;
    visitBoolean(expression: Expressions.Boolean): T;
    visitSymbol(expression: Expressions.Symbol): T;
    visitFunctionCall(expression: Expressions.FunctionCall): T;

    // functions
    visitParameter(expression: Expressions.Parameter): T;
    visitFunction(expression: Expressions.Function): T;
    visitNativeCode(expression: Expressions.NativeCode): T;
}
