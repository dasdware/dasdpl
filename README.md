# DasdPL - Expression-based programming language #

DasdPL is a project for teaching myself parsing text and creating an
expression-based programming language. It is not intended to be used
for any kind of production.

It uses a REPL approach. After start via `npm run start`, you are
greeted with a console prompt and can start typing commands.

## Supported commands ##

At the moment, the following commands are supported:

* Expressions: At the moment, expressions are simple mathematical
  operations using numbers and the `+`, `-`, `*` and `/` operators.
* `#exit`: Exits the command prompt.
* `#explain [expression]`: Shows the internal AST of the expression
  given.
* `#symbols`: Displays the current symbol table.

As of now, the symbol table contains only the special symbol `#`
which starts with the number `0` and is set to the value of the 
last expression command that was given.