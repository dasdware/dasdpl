import { SymbolTable } from '../symbol-table';
import { Command } from '../ast/commands';

import { parse } from './parser-impl';


export class Parser {
    constructor(
        private _symbolTable: SymbolTable
    ) { }

    parse(line: string) {
        return parse(line, { symbolTable: this._symbolTable}) as Command;
    }
}