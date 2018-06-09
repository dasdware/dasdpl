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
  / "#explain" _ expression:RootExpression {
    return new Commands.ExplainCommand(expression);
  }
  / ident:Ident _ ":" _ expression:RootExpression {
    return new Commands.LetCommand(ident, expression);
  }
  / expression:RootExpression {
    return new Commands.ExpressionCommand(expression);
  }

RootExpression =
  FunctionDefinition
  / Expression

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
  / SymbolOrFunctionCall

Symbol
  = ident:Ident { 
        if (!options.symbolTable.has(ident)) {
          error(`Unknown symbol '${ident}'`);
        }
        return new Expressions.Symbol(ident); 
    }

ExpressionList 
  = firstParam:Expression _ restParams:("," _ Expression)* {
    return [].concat(firstParam).concat(
      restParams.map(e => e[2]));
  }

SymbolOrFunctionCall
  = symbol:Symbol parameters:("(" _ ExpressionList? _ ")")? {
    if (!parameters) {
      return symbol;
    } else {
      let params = [];
      if (parameters[2]) {
        params = parameters[2];
      }

      // check if the symbol resolves to a function
      const targetFunction = options.symbolTable.get(symbol.name);
      if (targetFunction.typeCaption !== 'Function') {
        error(`${symbol.name} is not a function`);
      }

      // check parameter count
      if (targetFunction.parameters.length !== params.length) {
        error(`Function ${symbol.name} expects ${targetFunction.parameters.length}, ${params.length} given`);
      }

      // check parameter types
      const paramTypes = params.map(param => calculateType(param, options.symbolTable));
      for (let i = 0; i < paramTypes.length; ++i) {
        if (paramTypes[i] !== targetFunction.parameters[i].type) {
          error(`expected ${targetFunction.parameters[i].type.name} as parameter #${i} for function ${symbol.name}, ${paramTypes[i].name} given`);
        }
      }

      return new Expressions.FunctionCall(symbol.name, params);
    }
  }

NumberType
  = "Number" { return Types.NumberType.getInstance() }

Type 
  = NumberType

Parameter
  = ident:Ident _ ":" _ type:Type {
    return new Expressions.Parameter(ident, type);
  }

ParameterList
  = firstParam:Parameter _ restParams:("," _ Parameter)* {
    return [].concat(firstParam).concat(
      restParams.map(e => e[2]));
  }

FunctionDefinition
  = parameters:("(" _ parameters:ParameterList? _ ")"  {
        options.symbolTable = new SymbolTable(options.symbolTable);
        for (let param of parameters) {
          options.symbolTable.put(param.name, param.type.defaultValue);
        }
        return parameters;
      })  
    _ "->" _ expression:Expression {
      try {
        return new Expressions.Function(parameters, expression);
      } finally {
        options.symbolTable = options.symbolTable.parent;
      }
    }

Integer "integer"
  = [0-9]+ { return new Expressions.Number(parseInt(text(), 10)); }

Ident "ident"
  = [a-zA-Z_][0-9a-zA-Z_]* { return text(); }

_ "whitespace"
  = [ \t\n\r]*
              