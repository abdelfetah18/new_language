const TOKENS = {
  '{': "OPEN_CURLY_BRACKET",  
  '}': "CLOSE_CURLY_BRACKET",  
  '(': "OPEN_PARENT_BRACKET",  
  ')': "CLOSE_PARENT_BRACKET",  
  '[': "OPEN_SQUARE_BRACKET",  
  ']': "CLOSE_SQUARE_BRACKET",  
  '<': "OPEN_ANGLE_BRACKET",  
  '>': "CLOSE_ANGLE_BRACKET",
  '=': "EQUAL",  
  '+': "PLUS",  
  '-': "MINES",  
  '*': "STAR",  
  '&': "BITWISE_AND",  
  '|': "BITWISE_OR",  
  '^': "BITWISE_XOR",  
  '\'': "SINGLE_QUOAT",  
  '"': "DOUBLE_QUOAT",
  ',': "COMMA",
  '<<': "SHIFT_LEFT",
  '>>': "SHIFT_RIGHT",
  '||': "LOGICAL_OR",
  '&&': "LOGICAL_AND"
};

const KEYWORDS = ["var", "fun", "null", "true", "false", "return"];

class Token {
    constructor(type, value, startPos, length){
        this.type = type;
        this.value = value;
        this.startPos = startPos;
        this.length = length;
    }
}

class Lexer {
    constructor(input){
        this.input = input;
        this.pos = 0;
    }

    current(){ return this.input[this.pos]; }
    current_pos(){ return this.pos; }
    is_digit(){ return (this.current() >= '0' && this.current() <= '9'); }
    is_alpha(){ return (this.current() >= 'a' && this.current() <= 'z') || (this.current() >= 'A' && this.current() <= 'Z'); }
    is_eof(){ return this.pos >= this.input.length; }

    skipWhiteSpace(){
        while(this.current() == ' ' || this.current() == '\r' || this.current() == '\n')
            this.consume();
    }

    consume_three_chars_token(){
        let token_value = this.input.slice(this.pos, this.pos + 3);
        let token_type = TOKENS[token_value];
        if(token_type != undefined){
            let token = new Token(token_type, token_value, this.pos, 3);
            this.pos += 3;
            return token;
        }
        return null;
    }

    consume_two_chars_token(){
        let token_value = this.input.slice(this.pos, this.pos + 2);
        let token_type = TOKENS[token_value];
        if(token_type != undefined){
            let token = new Token(token_type, token_value, this.pos, 2);
            this.pos += 2;
            return token;
        }
        return null;
    }

    consume_one_char_token(){
        let token_value = this.input.slice(this.pos, this.pos + 1);
        let token_type = TOKENS[token_value];
        if(token_type != undefined){
            let token = new Token(token_type, token_value, this.pos, 1);
            this.pos += 1;
            return token;
        }
        return null;
    }

    consume(){ this.pos += 1; }
    next(){
        if(this.is_eof())
            return new Token("EOF", "", this.current_pos(), 0);

        this.skipWhiteSpace();

        let token = this.consume_three_chars_token();
        if(token != null)
            return token;
            
        token = this.consume_two_chars_token();
        if(token != null)
            return token;
        
        token = this.consume_one_char_token();
        if(token != null)
            return token;
        
        if(this.is_digit()){
            let value = "";
            let startPos = this.current_pos();
            while(this.is_digit()){
                value += this.current();
                this.consume();
            }
            
            return new Token("NUMBER", value, startPos, value.length);
        }

        if(this.is_alpha()){
            let value = "";
            let startPos = this.current_pos();
            while(this.is_alpha()){
                value += this.current();
                this.consume();
            }
            
            if(KEYWORDS.includes(value)){
                return new Token("KEYWORD", value, startPos, value.length);
            }
            return new Token("IDENTIFIER", value, startPos, value.length);
        }

        // This indicate that the token is invalid.
        return null;
    }
};

export default Lexer;