import { parse } from './parser';

import { SymbolTable } from './symbol-table';
import { Number } from './ast/expressions';
import { Command, ExpressionCommand, CommandHandler, ErrorCommand, 
    ExitCommand, ExplainCommand, SymbolsCommand, LetCommand } from './ast/commands';

function createDefaultSymbolTable() {
   const symbolTable = new SymbolTable();
   symbolTable.put('#', new Number(0))     
   return symbolTable;
}

class RuntimeCommandHandler implements CommandHandler {
    constructor(
        private _runtime: Runtime
    ) { }

    handleErrorCommand(command: ErrorCommand) {
        // nothing to do
    }

    handleExitCommand(command: ExitCommand) {
        // nothing to do
    }

    handleExplainCommand(command: ExplainCommand) {
        // nothing to do
    }

    handleExpressionCommand(command: ExpressionCommand) {
        // nothing to do
        this._runtime.symbolTable.put('#', command.expression);
    }

    handleLetCommand(command: LetCommand) {
        this._runtime.symbolTable.put(command.ident, command.expression);
    }

    handleSymbolsCommand(command: SymbolsCommand) {
        // nothing to do
    }
}

export class Runtime {

    private _commandHandlers: CommandHandler[] = [];

    constructor(
        handler: CommandHandler = null,
        public symbolTable: SymbolTable = createDefaultSymbolTable()
    ) { 
        this._commandHandlers.push(new RuntimeCommandHandler(this));
        if (handler) {
            this._commandHandlers.push(handler);
        }
    }

    execute(line: string) {
        let command: Command;
        try {
            command = parse(line, { symbolTable: this.symbolTable }) as Command;
        } catch (error) {
            command = new ErrorCommand(error.message, line, error.location.start.offset);
        }

        for (const handler of this._commandHandlers) {
            command.processHandler(handler);
        }
    }
}