import { Expression } from "./ast/expressions";
import { Map } from "es6-shim";

import { calculateValue } from './ast/visitors/value-calculator';
import * as  asciitable from 'ascii-table';

export class SymbolTableEntry {
    constructor(
        public ident: string,
        public expression: Expression
    ) { }
}

export class SymbolTable {

    private _expressions: Map<string, Expression> = new Map();

    constructor(
        private _parent: SymbolTable = null
    ) { }

    get(ident: string): Expression {
        if (this._expressions.has(ident)) {
            return this._expressions.get(ident);
        } else if (this._parent !== null) {
            return this._parent.get(ident);
        }
        return null;
    }

    has(ident: string) {
        return this._expressions.has(ident)
            || (this._parent && this._parent.has(ident));
    }

    put(ident: string, expression: Expression) {
        this._expressions.set(ident, expression);
    }

    remove(ident: string) {
        return this._expressions.delete(ident);
    }

    get entries() {
        return Array.from(this._expressions.entries())
            .map(entry => new SymbolTableEntry(entry[0], entry[1]))
            .sort((a, b) => a.ident.localeCompare(b.ident));
    }

    get parent() {
        return this._parent;
    }

    toString(): string {
        const asciiTable = asciitable.factory();
        asciiTable.setHeading('Ident', 'Expression');
        for (const entry of this.entries) {
            asciiTable.addRow(
                entry.ident, 
                calculateValue(entry.expression, this).description);
        }
        return asciiTable.toString();
    }
}