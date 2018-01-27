import {ExpressionVisitor} from './visitors';

export interface Expression {    
    type: string;
    value: any;

    accept<T>(visitor: ExpressionVisitor<T>): T;
}

abstract class Base implements Expression {


    constructor(
        private _type: string,
        private _value: any
    ) {}

    
    get type() {
        return this._type;
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

