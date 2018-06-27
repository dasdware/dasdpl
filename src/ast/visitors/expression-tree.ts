import {ExpressionVisitor} from '../visitors';
import * as Expressions from '../expressions';

import {generate} from 'ascii-tree';
import { FunctionType } from '../types/function';

export function expressionToTree(expression: Expressions.Expression) {
    return generate(expression.accept(new AsciiTreeVisitor()));
}

class AsciiTreeVisitor implements ExpressionVisitor<string> {
    private level = 0;

    private prefix() {
        return '\t'.repeat(this.level + 1);
    }

    private location(location: Expressions.SourceLocation) {
        return `${location.line}:${location.column}`;
    }

    private range(expression: Expressions.Expression) {
        let result = this.location(expression.range.start);
        if (expression.range.start != expression.range.end) {
            result += '-' + this.location(expression.range.end);
        }
        return result;
    }

    private binaryOperation(binary: Expressions.Binary)  {
        this.level++;
        const leftTree = binary.left.accept(this);
        const rightTree = binary.right.accept(this);
        this.level--;
        return `${this.prefix()}${binary.typeCaption} (${this.range(binary)})\n${leftTree}${rightTree}`;
    }

    // equality

    visitEqual(expression: Expressions.Equal) {
        return this.binaryOperation(expression);
    }

    visitNotEqual(expression: Expressions.NotEqual) {
        return this.binaryOperation(expression);
    }

    // comparison

    visitLess(expression: Expressions.Less) {
        return this.binaryOperation(expression);
    }

    visitLessOrEqual(expression: Expressions.LessOrEqual) {
        return this.binaryOperation(expression);
    }

    visitGreater(expression: Expressions.Greater) {
        return this.binaryOperation(expression);
    }

    visitGreaterOrEqual(expression: Expressions.GreaterOrEqual) {
        return this.binaryOperation(expression);
    }

    // addition

    visitAdd(expression: Expressions.Add) {
        return this.binaryOperation(expression);
    }

    visitSubtract(expression: Expressions.Subtract) {
        return this.binaryOperation(expression);
    }    

    // multiplication

    visitMultiply(expression: Expressions.Multiply) {
        return this.binaryOperation(expression);
    }

    visitDivide(expression: Expressions.Divide) {
        return this.binaryOperation(expression);
    }

    // primaries

    visitNumber(expression: Expressions.Number) {
        return `${this.prefix()}Number: ${expression.value} (${this.range(expression)})\n`;
    }

    visitBoolean(expression: Expressions.Boolean) {
        return `${this.prefix()}Boolean: ${expression.value} (${this.range(expression)})\n`;
    }

    visitSymbol(expression: Expressions.Symbol) {
        return `${this.prefix()}Symbol: ${expression.name} (${this.range(expression)})\n`; 
    }

    visitFunctionCall(expression: Expressions.FunctionCall) {
        return `${this.prefix()}FunctionCall: ${expression.name} (${this.range(expression)})`;
    }

    // functions

    visitParameter(expression: Expressions.Parameter): string {
        return `${this.prefix()}${expression.name}: ${expression.type.name} (${this.range(expression)})\n`;
    }

    visitFunction(expression: Expressions.Function) {
        return `${this.prefix()}Function (${this.range(expression)})\n`;   
    }

    visitNativeCode(expression: Expressions.NativeCode): string {
        return `${this.prefix()}NativeCode (${this.range(expression)})\n`;
    }
}