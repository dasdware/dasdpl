import {ExpressionVisitor} from './visitors';
import {Type} from './types';
import { Value } from './values';

export interface Expression {    
    typeCaption: string;

    accept<T>(visitor: ExpressionVisitor<T>): T;
}

abstract class Base implements Expression {

    constructor(
        private _typeCaption: string,
    ) {}

    
    get typeCaption() {
        return this._typeCaption;
    }

    abstract accept<T>(visitor: ExpressionVisitor<T>): T;
}

export class Number extends Base {
    constructor(
        public value: number
    ) {
        super('Number');
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitNumber(this);
    }
}

export abstract class Binary extends Base {
    constructor(
        operation: string,
        public left: Expression,
        public right: Expression
    ) {
        super(operation);
    }
}

export class Add extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('Add', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitAdd(this);
    }
}

export class Subtract extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('Subtract', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitSubtract(this);
    }
}


export class Multiply extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('Multiply', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitMultiply(this);
    }
}


export class Divide extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('Divide', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitDivide(this);
    }
}

export class Symbol extends Base {
    constructor(
        public name: string
    ) {
        super('Symbol');
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitSymbol(this);
    }
}

export class Parameter extends Base {
    constructor(
        public name: string,
        public type: Type
    ) {
        super('Parameter');
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitParameter(this);
    }
}

export class Function extends Base {
    constructor(
        public parameters: Parameter[],
        public expression: Expression
    ) {
        super('Function');
        if (expression instanceof NativeCode) {
            expression.wrapper = this;
        }
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitFunction(this);
    }
}

export class FunctionCall extends Base {
    constructor(
        public name: string,
        public parameters: Expression[]
    ) { 
        super('FunctionCall');
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitFunctionCall(this);
    }
}

export interface NativeCodeCallback {
    (parameters: Value[]): Value;
}

export class NativeCode extends Base {

    public wrapper: Function;

    constructor(
        public resultType: Type,
        public callback: NativeCodeCallback
    ) {
        super('NativeCode');
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitNativeCode(this);
    }
}