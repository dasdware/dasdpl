import { SymbolTable } from './symbol-table';
import { Parser } from './parser/parser';

import { Number, Function, Parameter, Add, Symbol, NativeCode } from './ast/expressions';
import { Command, ExpressionCommand, CommandHandler, ErrorCommand, 
    ExitCommand, ExplainCommand, SymbolsCommand, LetCommand } from './ast/commands';
import { NumberType } from './ast/types/number';
import { Value, NumberValue } from './ast/values';

function createDefaultSymbolTable() {
    const symbolTable = new SymbolTable();
    symbolTable.put('#', new Number(0))     
    symbolTable.put('sum', 
        new Function(
            [
                new Parameter('a', NumberType.getInstance()),
                new Parameter('b', NumberType.getInstance())
            ], 
            new Add(
                new Symbol('a'),
                new Symbol('b')
            )
        )
    );
    symbolTable.put('sin',
        new Function(
            [
                new Parameter('value', NumberType.getInstance())
            ],
            new NativeCode(
                NumberType.getInstance(),
                (parameters: Value[])  => 
                    new NumberValue(Math.sin(parameters[0].content))
            )
        )
    );

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
        public symbolTable: SymbolTable = createDefaultSymbolTable(),
        public parser: Parser = new Parser(symbolTable)
    ) { 
        this._commandHandlers.push(new RuntimeCommandHandler(this));
        if (handler) {
            this._commandHandlers.push(handler);
        }
    }

    execute(line: string) {
        let command: Command;
        try {
            command = this.parser.parse(line);
        } catch (error) {
            command = new ErrorCommand(error.message, line, error.location.start.offset);
        }

        for (const handler of this._commandHandlers) {
            command.processHandler(handler);
        }
    }
}