import { AssignmentExpression, BinaryExpression, CallExpression, FunctionBody, FunctionDeclaration, Identifier, ScopeNode, Value, VariableDeclaration } from "./ast.js";
import Lexer from "./lexer.js";

const SUPPORTED_OP = {
    '*': "MULTIPLICATIVE",
    '/': "MULTIPLICATIVE",
    '%': "MULTIPLICATIVE",
    '+': "ADDITIVE",
    '-': "ADDITIVE",
    '<<': "BITWISE_SHIFT",
    '>>': "BITWISE_SHIFT",
    '&': "BITWISE_AND",
    '^': "BITWISE_XOR",
    '|': "BITWISE_OR",
    '&&': "LOGICAL_AND",
    '||': "LOGICAL_OR"
};

class Parser {
    constructor(input){
        this.lexer = new Lexer(input);
        this.current = this.lexer.next();
    }

    current_token(){ return this.current; }
    consume(){ 
        // console.log("CUR_TOKEN: ",this.current_token());
        this.current = this.lexer.next();
    }
    is_number(){ return this.current_token().type == "NUMBER"; }
    is_boolean(){ return this.current_token().type == "KEYWORD" && (this.current_token().value == "true" || this.current_token().value == "false"); }
    is_null(){ return this.current_token().type == "KEYWORD" && this.current_token().value == "null"; }
    is_identifier(){ return this.current_token().type == "IDENTIFIER"; }
    is_var(){ return this.current_token().type == "KEYWORD" && this.current_token().value == "var"; }
    is_fun(){ return this.current_token().type == "KEYWORD" && this.current_token().value == "fun"; }
    is_arg(){ return this.is_null() || this.is_boolean() || this.is_number(); }
    is_eof(){ return this.current_token().type == "EOF"; }
    is_binary_op(){
        if(
            this.current_token().type == "PLUS" ||
            this.current_token().type == "MINES" ||
            this.current_token().type == "STAR" ||
            this.current_token().type == "BITWISE_AND" ||
            this.current_token().type == "BITWISE_OR" ||
            this.current_token().type == "BITWISE_XOR" ||
            this.current_token().type == "SHIFT_LEFT" ||
            this.current_token().type == "SHIFT_RIGHT" ||
            this.current_token().type == "LOGICAL_OR" ||
            this.current_token().type == "LOGICAL_AND"
        )
            return true;

        return false;
    }

    parse_variable_declaration(){
        if(this.is_var()){
            this.consume();

            if(this.is_identifier()){
                let identifier = this.current_token().value;
                this.consume();
                // Parse assignment expression.
                let init = this.parse_assignment_expression(identifier);
                return new VariableDeclaration(identifier, init);
            }
        }
    }

    parse_statement_list(){
        let statements = [];
        let declaration = [];
        while(!this.is_eof()){
            // VariableDeclartion.
            if(this.is_var()){
                let var_decl = this.parse_variable_declaration();
                statements.push(var_decl);
                declaration.push(var_decl);
            }
            // FunctionDeclaration.
            if(this.is_fun()){
                let fun_decl = this.parse_function_declaration();
                statements.push(fun_decl);
                declaration.push(fun_decl);
            }
            // ExpressionStatement.
            let expr = this.parse_expression_statement();
            if(expr != null)
                statements.push(expr);
        }

        return new ScopeNode(declaration, statements);
    }

    parse_expression_statement(){
        if(!this.is_identifier())
            return null; // Expected 'identifier'.
        let identifier = this.current_token().value;
        this.consume();

        // CallExpression.
        if(this.current_token().type == "OPEN_PARENT_BRACKET")
            return this.parse_call_expression(identifier);
        
            // AssignmentExpression.
        if(this.current_token().type == "EQUAL")
            return this.parse_assignment_expression(identifier);
        return null;
    }

    parse_call_expression(identifier){
        // Parse function args.
        let args = this.parse_arguments();
        return new CallExpression(identifier, args);
    }

    parse_arguments(){
        if(this.current_token().type != "OPEN_PARENT_BRACKET")
            return null; // Expected ')'.
        this.consume();

        let args = [];
        while(this.current_token().type != "CLOSE_PARENT_BRACKET"){
            args.push(this.parse_primary_expression());

            if(this.current_token().type != "COMMA" && this.current_token().type != "CLOSE_PARENT_BRACKET")
                return null; // Expected ',' or ')'.
            if(this.current_token().type == "COMMA")
                this.consume();
        }

        if(this.current_token().type != "CLOSE_PARENT_BRACKET")
            return null; // Expected ')'.
        this.consume();

        return args;
    }

    parse_function_declaration(){
        if(!this.is_fun())
            return null; // Expected 'fun' keyword.
        this.consume();

        if(!this.is_identifier())
            return null; // Expected 'identifier'.
        let name = this.current_token().value;
        this.consume();

        if(this.current_token().type != "OPEN_PARENT_BRACKET")
            return null; // Expected '('.
        this.consume();

        // Parse function params.
        let params = [];
        while(this.current_token().type != "CLOSE_PARENT_BRACKET"){
            if(!this.is_identifier())
                return null; // Expected 'identifier'.
            
            params.push(this.current_token().value);
            this.consume();
            
            if(this.current_token().type != "COMMA" && this.current_token().type != "CLOSE_PARENT_BRACKET")
                return null; // Expected ',' or ')'.
            
            if(this.current_token().type == "COMMA")
                this.consume();
        }    
        
        
        if(this.current_token().type != "CLOSE_PARENT_BRACKET")
            return null; // Expected ')'.
        this.consume();
        
        // Parse function body
        let body = this.parse_function_body();
        
        return new FunctionDeclaration(name, params, body); 
    }

    /*
    
    Multiplicative
    Additive
    Bitwise shift
    Bitwise-AND
    Bitwise-exclusive-OR
    Bitwise-inclusive-OR
    Logical-AND
    Logical-OR
    

'*': "MULTIPLICATIVE",
'/': "MULTIPLICATIVE",
'%': "MULTIPLICATIVE",
'+': "ADDITIVE",
'-': "ADDITIVE",
'<<': "BITWISE_SHIFT",
'>>': "BITWISE_SHIFT",
'&': "BITWISE_AND",
'^': ""BITWISE_XOR",
'|': "BITWISE_OR",
'&&': "LOGICAL_AND",
'||': "LOGICAL_OR",


*/
    parse_factor(left_hande_side = null){
        if(left_hande_side != null)
            return left_hande_side;
        if(this.is_number()){
            let factor = new Value(this.current_token().value);
            this.consume();
            return factor;
        }
        
        if(this.is_identifier()){
            let factor = new Identifier(this.current_token().value);
            this.consume();
            return factor;
        }

        return null;
    }

    parse_multiplicative_expression(left_hande_side = null){
        let lhs = this.parse_factor(left_hande_side);

        while(true){
            if(lhs != null){
                let token = this.current_token();
                if(token && SUPPORTED_OP[token.value] == "MULTIPLICATIVE"){
                    this.consume();
                    let rhs = this.parse_factor();
                    if(rhs != null){
                        lhs = new BinaryExpression(token.value, lhs, rhs);
                    }
                }else{
                    return lhs;
                }      
            }else{
                return null;
            }
        }
    }
    
    parse_additive_expression(left_hande_side = null){
        let lhs = this.parse_multiplicative_expression(left_hande_side);
        while(true){
            if(lhs != null){
                let token = this.current_token();
                if(token && SUPPORTED_OP[token.value] == "ADDITIVE"){
                    this.consume();
                    let rhs = this.parse_multiplicative_expression();
                    if(rhs != null){
                        lhs = new BinaryExpression(token.value, lhs, rhs);
                    }
                }else{
                    return lhs;
                }           
            }else{
                return null;
            }
        }
    }
    
    parse_bitwise_shift_expression(left_hande_side = null){
        let lhs = this.parse_additive_expression(left_hande_side);

        while(true){
            if(lhs != null){
                let token = this.current_token();
                if(token && SUPPORTED_OP[token.value] == "BITWISE_SHIFT"){
                    this.consume();
                    let rhs = this.parse_additive_expression();
                    if(rhs != null){
                        lhs = new BinaryExpression(token.value, lhs, rhs);
                    }
                }else{
                    return lhs;
                }           
            }else{
                return null;
            }
        }
    }
    
    parse_bitwise_and_expression(left_hande_side = null){
        let lhs = this.parse_bitwise_shift_expression(left_hande_side);

        while(true){
            if(lhs != null){
                let token = this.current_token();
                if(token && SUPPORTED_OP[token.value] == "BITWISE_AND"){
                    this.consume();
                    let rhs = this.parse_bitwise_shift_expression();
                    if(rhs != null){
                        lhs = new BinaryExpression(token.value, lhs, rhs);
                    }
                }else{
                    return lhs;
                }           
            }else{
                return null;
            }
        }
    }
    
    parse_bitwise_or_expression(left_hande_side = null){
        let lhs = this.parse_bitwise_and_expression(left_hande_side);

        while(true){
            if(lhs != null){
                let token = this.current_token();
                if(token && SUPPORTED_OP[token.value] == "BITWISE_OR"){
                    this.consume();
                    let rhs = this.parse_bitwise_and_expression();
                    if(rhs != null){
                        lhs = new BinaryExpression(token.value, lhs, rhs);
                    }
                }else{
                    return lhs;
                }           
            }else{
                return null;
            }
        }
    }
    
    parse_bitwise_xor_expression(left_hande_side = null){
        let lhs = this.parse_bitwise_or_expression(left_hande_side);

        while(true){
            if(lhs != null){
                let token = this.current_token();
                if(token && SUPPORTED_OP[token.value] == "BITWISE_XOR"){
                    this.consume();
                    let rhs = this.parse_bitwise_or_expression();
                    if(rhs != null){
                        lhs = new BinaryExpression(token.value, lhs, rhs);
                    }
                }else{
                    return lhs;
                }           
            }else{
                return null;
            }
        }
    }

    parse_logical_and_expression(left_hande_side = null){ 
        let lhs = this.parse_bitwise_xor_expression(left_hande_side);

        while(true){
            if(lhs != null){
                let token = this.current_token();
                if(token && SUPPORTED_OP[token.value] == "LOGICAL_AND"){
                    this.consume();
                    let rhs = this.parse_bitwise_xor_expression();
                    if(rhs != null){
                        lhs = new BinaryExpression(token.value, lhs, rhs);
                    }
                }else{
                    return lhs;
                }           
            }else{
                return null;
            }
        }
    }
  
    parse_logical_or_expression(left_hande_side = null){
        let lhs = this.parse_logical_and_expression(left_hande_side);

        while(true){
            if(lhs != null){
                let token = this.current_token();
                if(token && SUPPORTED_OP[token.value] == "LOGICAL_OR"){
                    this.consume();
                    let rhs = this.parse_logical_and_expression();
                    if(rhs != null){
                        lhs = new BinaryExpression(token.value, lhs, rhs);
                    }
                }else{
                    return lhs;
                }           
            }else{
                return null;
            }
        }
    }

    parse_binary_expression(first_item){
        return this.parse_logical_or_expression(first_item);
    }

    parse_assignment_expression(identifier){
        if(this.current_token().type != "EQUAL")
            return null; // Expected '='.
        this.consume();
            
        return new AssignmentExpression(identifier, this.parse_primary_expression());        
    }

    parse_primary_expression(){
        if(this.is_identifier()){
            let id = this.current_token().value;
            this.consume();
            if(this.current_token().type == "OPEN_PARENT_BRACKET")
                return this.parse_call_expression(id);
            // TODO: If it Operation then parseBinaryExpression.
            if(this.is_binary_op())
                return this.parse_binary_expression(new Identifier(id));

            // Else.
            return new Identifier(id);
        }
        
        if(this.is_number()){
            let value = this.current_token().value;
            this.consume();
            // TODO: If it Operation then parseBinaryExpression.
            if(this.is_binary_op())
                return this.parse_binary_expression(new Value(value));
            // Else.
            return new Value(value);
        }
        
        if(this.is_boolean() || this.is_null()){
            let value = this/this.current_token().value;
            return new Value(value);
        }
    }

    parse_function_body(){
        if(this.current_token().type != "OPEN_CURLY_BRACKET")
            return null; // Expected '{'.
        this.consume();
        let statements = [];
        let declaration = [];
        while(this.current_token().type != "CLOSE_CURLY_BRACKET"){
            // VariableDeclartion.
            if(this.is_var()){
                let var_decl = this.parse_variable_declaration();
                statements.push(var_decl);
                declaration.push(var_decl);
            }
            // FunctionDeclaration.
            if(this.is_fun()){
                let fun_decl = this.parse_function_declaration();
                statements.push(fun_decl);
                declaration.push(fun_decl);

            }
            // ExpressionStatement.
            let expr = this.parse_expression_statement();
            if(expr != null)
                statements.push(expr);
        }

        if(this.current_token().type != "CLOSE_CURLY_BRACKET")
            return null; // Expected '}'.
        this.consume();

        return new FunctionBody(declaration, statements);
    }
};

/*

var test = "Hello"
var num = test + "Hi"

PrimaryExpression
    CallExpression
    BinaryExpression
    Identifier

CallExpression
    Identifier (Args)

BinaryExpression
    Identifier OP BinaryExpression
    Value OP BinaryExpression
    Value

AssignmentExpression
    Value
    CallExpression
    BinaryExpression

Value
    Number
    Boolean
    String
    Null

*/

export default Parser;