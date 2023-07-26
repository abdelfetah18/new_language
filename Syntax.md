# Syntax

**Program:** \
&nbsp;&nbsp;&nbsp;&nbsp; Statements

**Statements:** \
&nbsp;&nbsp;&nbsp;&nbsp; VariableDeclaration \
&nbsp;&nbsp;&nbsp;&nbsp; FunctionDeclaration \
&nbsp;&nbsp;&nbsp;&nbsp; Expression

**VariableDeclaration:** \
&nbsp;&nbsp;&nbsp;&nbsp; ‘var’ Identifier AssignmentExpression

**FunctionDeclaration:** \
&nbsp;&nbsp;&nbsp;&nbsp; ‘fun’ Identifier ‘(‘ Params ‘)’ ‘{‘  FunctionBody ‘}’

**Expression:** \
&nbsp;&nbsp;&nbsp;&nbsp; CallExpression \
&nbsp;&nbsp;&nbsp;&nbsp; Identifier AssignmentExpression

**Identifier:** \
&nbsp;&nbsp;&nbsp;&nbsp; AlphaDigit

**AssignmentExpression:** \
&nbsp;&nbsp;&nbsp;&nbsp; ‘=’ PrimaryExpression

**Params:** \
&nbsp;&nbsp;&nbsp;&nbsp; Identifier \
&nbsp;&nbsp;&nbsp;&nbsp; Identifier ‘,’ Identifier

**FunctionBody:** \
&nbsp;&nbsp;&nbsp;&nbsp; VariableDeclaration \
&nbsp;&nbsp;&nbsp;&nbsp; FunctionDeclaration \
&nbsp;&nbsp;&nbsp;&nbsp; Expression

**CallExpression:** \
&nbsp;&nbsp;&nbsp;&nbsp; Identifier ‘(‘ Arguments ‘)’

**Arguments:** \
&nbsp;&nbsp;&nbsp;&nbsp; Argument \
&nbsp;&nbsp;&nbsp;&nbsp; Argument ‘,’ Argument

**Argument:** \
&nbsp;&nbsp;&nbsp;&nbsp; PrimaryExpression

**PrimaryExpression:** \
&nbsp;&nbsp;&nbsp;&nbsp; Identifier \
&nbsp;&nbsp;&nbsp;&nbsp; Number \
&nbsp;&nbsp;&nbsp;&nbsp; String \
&nbsp;&nbsp;&nbsp;&nbsp; Boolean \
&nbsp;&nbsp;&nbsp;&nbsp; Null

**Number:** \
&nbsp;&nbsp;&nbsp;&nbsp; [0_9]+ 

**String:** \
&nbsp;&nbsp;&nbsp;&nbsp; '"' AlphaDigit '"' 

**Boolean:** \
&nbsp;&nbsp;&nbsp;&nbsp; 'true' \
&nbsp;&nbsp;&nbsp;&nbsp; 'false' \


**Null:** \
&nbsp;&nbsp;&nbsp;&nbsp; 'null' \

**AlphaDigit:** \
&nbsp;&nbsp;&nbsp;&nbsp; [a-zA-Z]+ \