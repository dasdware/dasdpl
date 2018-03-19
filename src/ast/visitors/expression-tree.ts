import {ExpressionVisitor} from '../visitors';
import * as Expressions from '../expressions';

import {generate} from 'ascii-tree';

export function expressionToTree(expression: Expressions.Expression) {
    return generate(expression.accept(new AsciiTreeVisitor()));
}

class AsciiTreeVisitor implements ExpressionVisitor<string> {
    private level = 0;

    private prefix() {
        return '\t'.repeat(this.level + 1);
    }

    private binaryOperation(
        name: string, 
        left: Expressions.Expression, 
        right: Expressions.Expression
    )  {
        this.level++;
        const leftTree = left.accept(this);
        const rightTree = right.accept(this);
        this.level--;
        return `${this.prefix()}${name}\n${leftTree}${rightTree}`;
        
    }

    visitNumber(expression: Expressions.Number) {
        return `${this.prefix()}Number<${expression.value}>\n`;
    }

    visitAdd(expression: Expressions.Add) {
        return this.binaryOperation(
            'Add',
            expression.left,
            expression.right
        );
    }

    visitSubtract(expression: Expressions.Subtract) {
        return this.binaryOperation(
            'Subtract',
            expression.left,
            expression.right
        );
    }

    visitMultiply(expression: Expressions.Multiply) {
        return this.binaryOperation(
            'Multiply',
            expression.left,
            expression.right
        );
    }

    visitDivide(expression: Expressions.Divide) {
        return this.binaryOperation(
            'Divide',
            expression.left,
            expression.right
        );
    }

    visitSymbol(expression: Expressions.Symbol) {
        return `${this.prefix()}Symbol<${expression.name}>\n`; 
    }

    visitFunction(expression: Expressions.Function) {
        return `${this.prefix()}Function\n`;   
    }

    visitFunctionCall(expression: Expressions.FunctionCall) {
        return '';
    }
}