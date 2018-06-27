import {ExpressionVisitor} from './visitors';
import {Type} from './types';
import { Value } from './values';

export class SourceLocation {
    constructor(
        public offset: number,
        public line: number,
        public column: number
    ) { }

    static Empty = new SourceLocation(-1, -1, -1);
}

export class SourceRange {
    constructor(
        public start: SourceLocation,
        public end: SourceLocation
    ) {}

    static Empty = new SourceRange(
        SourceLocation.Empty, SourceLocation.Empty);
}

export interface Expression {    
    typeCaption: string;
    range: SourceRange;

    accept<T>(visitor: ExpressionVisitor<T>): T;
}

abstract class Base implements Expression {

    constructor(
        private _typeCaption: string,
        private _range: SourceRange
    ) {}

    
    get typeCaption() {
        return this._typeCaption;
    }

    get range() {
        return this._range;
    }

    abstract accept<T>(visitor: ExpressionVisitor<T>): T;
}

export abstract class Binary extends Base {
    constructor(
        operation: string,
        public left: Expression,
        public right: Expression
    ) {
        super(
            operation,
            new SourceRange(left.range.start, right.range.end)
        );
    }
}

// =======================================================================
// EQUALITY
// =======================================================================

export class Equal extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('Equal', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitEqual(this);
    }
}

export class NotEqual extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('NotEqual', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitNotEqual(this);
    }
}

// =======================================================================
// COMPARISON
// =======================================================================

export class Less extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('Less', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitLess(this);
    }
}

export class LessOrEqual extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('LessOrEqual', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitLessOrEqual(this);
    }
}

export class Greater extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('Greater', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitGreater(this);
    }
}

export class GreaterOrEqual extends Binary {
    constructor(
        left: Expression,
        right: Expression
    ) {
        super('GreaterOrEqual', left, right);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitGreaterOrEqual(this);
    }
}

// =======================================================================
// ADDITION
// =======================================================================

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

// =======================================================================
// MULTIPLICATION
// =======================================================================

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

// =======================================================================
// PRIMARIES
// =======================================================================

export class Number extends Base {
    constructor(
        public value: number,
        range: SourceRange = SourceRange.Empty
    ) {
        super('Number', range);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitNumber(this);
    }
}

export class Boolean extends Base {
    constructor(
        public value: boolean,
        range: SourceRange = SourceRange.Empty
    ) {
        super('Boolean', range);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitBoolean(this);
    }
}

export class Symbol extends Base {
    constructor(
        public name: string,
        range: SourceRange = SourceRange.Empty
    ) {
        super('Symbol', range);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitSymbol(this);
    }
}

export class FunctionCall extends Base {
    constructor(
        public name: string,
        public parameters: Expression[],
        range: SourceRange = SourceRange.Empty
    ) { 
        super('FunctionCall', range);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitFunctionCall(this);
    }
}

// =======================================================================
// FUNCTIONS
// =======================================================================

export class Parameter extends Base {
    constructor(
        public name: string,
        public type: Type,
        range: SourceRange = SourceRange.Empty
    ) {
        super('Parameter', range);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitParameter(this);
    }
}

export class Function extends Base {
    constructor(
        public parameters: Parameter[],
        public expression: Expression,
        range: SourceRange = SourceRange.Empty
    ) {
        super('Function', range);
        if (expression instanceof NativeCode) {
            expression.wrapper = this;
        }
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitFunction(this);
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
        super('NativeCode', SourceRange.Empty);
    }

    accept<T>(visitor: ExpressionVisitor<T>): T {
        return visitor.visitNativeCode(this);
    }
}