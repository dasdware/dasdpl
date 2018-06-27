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
  = Equality

Equality
  = head:Comparison tail:(_ ("==" / "!=") _ Comparison)* {
      return tail.reduce(
        (result, element) => {
          if (element[1] === "==") { 
            return new Expressions.Equal(result, element[3]); 
          }
          if (element[1] === "!=") { 
            return new Expressions.NotEqual(result, element[3]); 
          }
        }, 
        head);
    }

Comparison
  = head:Addition tail:(_ ("<" / "<=" / ">" / ">=") _ Addition)* {
      return tail.reduce(
        (result, element) => {
          if (element[1] === "<") { 
            return new Expressions.Less(result, element[3]); 
          }
          if (element[1] === "<=") { 
            return new Expressions.LessOrEqual(result, element[3]); 
          }
          if (element[1] === ">") { 
            return new Expressions.Greater(result, element[3]); 
          }
          if (element[1] === ">=") { 
            return new Expressions.GreaterOrEqual(result, element[3]); 
          }
        }, 
        head);
    }

Addition
  = head:Multiplication tail:(_ ("+" / "-") _ Multiplication)* {
      return tail.reduce(
        (result, element) => {
          if (element[1] === "+") { 
            return new Expressions.Add(result, element[3]); 
          }
          if (element[1] === "-") { 
            return new Expressions.Subtract(result, element[3]); 
          }
        }, 
        head);
    }

Multiplication
  = head:Primary tail:( _ ("*" / "/") _ Primary)* {
      return tail.reduce(
        (result, element) => {
          if (element[1] === "*") { 
              return new Expressions.Multiply(result, element[3]); 
          }
          if (element[1] === "/") { 
            return new Expressions.Divide(result, element[3]); 
          }
        }, 
        head);
    }

Primary
  = "(" _ expr:Expression _ ")" { return expr; }
  / Number
  / Boolean
  / SymbolOrFunctionCall

Symbol
  = ident:Ident { 
        if (!options.symbolTable.has(ident)) {
          error(`Unknown symbol '${ident}'`);
        }
        return new Expressions.Symbol(ident, location()); 
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

      return new Expressions.FunctionCall(symbol.name, params, location());
    }
  }

NumberType
  = "Number" { return Types.NumberType.getInstance() }

Type 
  = NumberType

Parameter
  = ident:Ident _ ":" _ type:Type {
    return new Expressions.Parameter(ident, type, location());
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
          options.symbolTable.put(param.name, param);
        }
        return parameters;
      })  
    _ "->" _ expression:Expression {
      try {
        return new Expressions.Function(parameters, expression, location());
      } finally {
        options.symbolTable = options.symbolTable.parent;
      }
    }

Number "number"
  = [0-9]+('.'[0-9]+)? { return new Expressions.Number(parseFloat(text()), location()); }

Boolean "boolean"
  = ("true" / "false") { return new Expressions.Boolean(text() === "true", location()); }

Ident "ident"
  = [a-zA-Z_][0-9a-zA-Z_]* { return text(); }

_ "whitespace"
  = [ \t\n\r]*
              