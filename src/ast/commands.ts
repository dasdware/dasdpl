import { Expression } from './expressions';

export interface Command {
    processHandler(handler: CommandHandler);
}

export class ErrorCommand implements Command {
    constructor(
        public message: string,
        public line: string,
        public position: number
    ) {}

    processHandler(handler: CommandHandler) {
        handler.handleErrorCommand(this);
    }
}

export class ExitCommand implements Command {
    processHandler(handler: CommandHandler) {
        handler.handleExitCommand(this);
    }
}

export class ExplainCommand implements Command {
    constructor(
        public expression: Expression
    ) {}

    processHandler(handler: CommandHandler) {
        handler.handleExplainCommand(this);
    }
}

export class ExpressionCommand implements Command {
    constructor(
        public expression: Expression
    ) {}

    processHandler(handler: CommandHandler) {
        handler.handleExpressionCommand(this);
    }
}

export class LetCommand implements Command {
    constructor(
        public ident: string,
        public expression: Expression
    ) { }

    processHandler(handler: CommandHandler) {
        handler.handleLetCommand(this);
    }
}

export class SymbolsCommand implements Command {
    processHandler(handler: CommandHandler) {
        handler.handleSymbolsCommand(this);
    }
}

export interface CommandHandler {
    handleErrorCommand(command: ErrorCommand);
    handleExitCommand(command: ExitCommand);
    handleExplainCommand(command: ExplainCommand);
    handleExpressionCommand(command: ExpressionCommand);
    handleLetCommand(command: LetCommand);
    handleSymbolsCommand(command: SymbolsCommand);
}