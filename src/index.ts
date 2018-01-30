import 'colors';
import { createInterface } from 'readline';

import { Runtime } from './runtime';
import { calculateValue } from './ast/visitors/value-calculator';
import { ExpressionCommand, CommandHandler, ExitCommand, SymbolsCommand, 
    ErrorCommand, ExplainCommand, LetCommand } from './ast/commands';
import { expressionToTree } from './ast/visitors/expression-tree';
import { Expression } from './ast/expressions';

class RuntimeConsole implements CommandHandler {
    private readLine = createInterface(process.stdin, process.stdin);
    private runtime = new Runtime(this);

    constructor(
        promptLabel = '\u001b[1;36m>'
    ) {
        this.readLine.setPrompt(promptLabel + ' ');
        this.readLine.prompt();
        this.readLine.on('line', (line) => this.runtime.execute(line));
    }

    processLine(line: string) {
        this.runtime.execute(line);
    }

    showValue(expression: Expression) {
        console.log(
            calculateValue(
                expression, 
                this.runtime.symbolTable)
            .description.yellow);
    }

    handleErrorCommand(command: ErrorCommand) {
        const message = command.message + '\n  ' 
            + command.line + '\n  ' 
            + ' '.repeat(command.position) + '^';
        console.log(message.red);
        this.readLine.prompt();
    }

    handleExitCommand(command: ExitCommand) {
        this.readLine.close();
        console.log('\u001b[0m');
    }

    handleExplainCommand(command: ExplainCommand) {
        console.log(
            expressionToTree(command.expression).yellow);
        this.readLine.prompt();
    }

    handleExpressionCommand(command: ExpressionCommand) {
        this.showValue(command.expression);
        this.readLine.prompt();
    }
    
    handleLetCommand(command: LetCommand) {
        this.showValue(command.expression);
        this.readLine.prompt();
    }

    handleSymbolsCommand(command: SymbolsCommand) {
        console.log(this.runtime.symbolTable.toString().yellow);
        this.readLine.prompt();
    }
}

function mainLoop(promptLabel = '\u001b[1;36m>') {
    new RuntimeConsole(promptLabel);
}

mainLoop();