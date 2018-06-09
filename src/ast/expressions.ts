import {ExpressionVisitor} from './visitors';
import {Type} from './types';
import { Value } from './values';

export interface Expression {    
    typeCaption: string;
    value: any;

    accept<T>(visitor: ExpressionVisitor<T>): T;
}

abstract class Base implements Expression {

    constructor(
        private _typeCaption: string,
        private _value: any
    ) {}

    
    get typeCaption() {
        return this._typeCaption;
    }

    get value() {
        return this._value;
    }

    abstract accept<T>(visitor: ExpressionVisitor<T>): T;
}

export class Number extends Base {
    constructor(
        value: any
    ) {
        super('Number', value);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitNumber(this);
    }
}

export abstract class Binary extends Base {
    constructor(
        operation: string,
        left: Expression,
        right: Expression
    ) {
        super(operation, [left, right]);
    }

    get left() {
        return <Expression>this.value[0];
    }

    get right() {
        return <Expression>this.value[1];
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
        name: string
    ) {
        super('Symbol', name);
    }

    get name() {
        return <string>this.value;
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitSymbol(this);
    }
}

export class Parameter extends Base {
    constructor(
        name: string,
        type: Type
    ) {
        super('Parameter', [name, type]);
    }

    get name() {
        return <string>this.value[0];
    }

    get type() {
        return <Type>this.value[1];
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
        super('Function', '');
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
        super('FunctionCall', '');
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
        super('NativeCode', '');
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitNativeCode(this);
    }
}