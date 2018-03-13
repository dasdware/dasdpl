// Simple Arithmetics Grammar
// ==========================
//
// Accepts expressions like "2 * (3 + 4)" and computes their value.

Command =
  "#exit" {
    return new Commands.ExitCommand();
  }
  / "#symbols" {
    return new Commands.SymbolsCommand();
  }
  / "#explain" _ expression:Expression {
    return new Commands.ExplainCommand(expression);
  }
  / ident:Ident _ ":" _ expression:Expression {
    return new Commands.LetCommand(ident, expression);
  }
  / expression:Expression {
    return new Commands.ExpressionCommand(expression);
  }

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      const num = tail.reduce(function(result, element) {
        if (element[1] === "+") { return new Expressions.Add(result, element[3]); }
        if (element[1] === "-") { return new Expressions.Subtract(result, element[3]); }
      }, head);
      return num;
    }

Term
  = head:Factor tail:( _ ("*" / "/") _ Factor)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return new Expressions.Multiply(result, element[3]); }
        if (element[1] === "/") { return new Expressions.Divide(result, element[3]); }
      }, head);
    }

Factor
  = "(" _ expr:Expression _ ")" { return expr; }
  / Integer
  / Symbol

Symbol
  = ident:Ident { 
        if (!options.symbolTable.has(ident)) {
          error(`Unknown symbol '${ident}'`);
        }
        return new Expressions.Symbol(ident); 
    }

Integer "integer"
  = [0-9]+ { return new Expressions.Number(parseInt(text(), 10)); }

Ident "ident"
  = [a-zA-Z_][0-9a-zA-Z_]* { return text(); }

_ "whitespace"
  = [ \t\n\r]*
              