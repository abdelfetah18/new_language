class AST {

};

class ScopeNode {
    constructor(declaration, statements){
        this.declaration = declaration;
        this.statements = statements;
    }

    execute(interpreter){
        interpreter.append_new_execution_context();
        for(let stmt of this.statements){
            stmt.execute(interpreter);
        }
        interpreter.pop_current_execution_context();
    }
};

class FunctionBody {
    constructor(declaration, statements){
        this.declaration = declaration;
        this.statements = statements;
    }

    execute(interpreter){
        for(let stmt of this.statements){
            if(stmt instanceof ReturnExpression){
                return stmt.execute(interpreter);
            }
            stmt.execute(interpreter);
        }
    }
}

class FunctionObject {
    constructor(name, params, body){
        this.name = name;
        this.params = params;
        this.body = body;
    }

    execute(interpreter, args){
        if(this.params.length != args.length){
            // TODO: Expected number of params.
        }
        interpreter.append_new_execution_context();
        for(let i = 0; i < args.length; i++){
            interpreter.current_execution_context().set(this.params[i], args[i].execute(interpreter));
        }
        let return_value = this.body.execute(interpreter);
        interpreter.pop_current_execution_context();
        if(return_value != undefined)
            return return_value;
    }
};

class FunctionDeclaration {
    constructor(name, params, body){
        this.name = name;
        this.params = params;
        this.body = body;
    }

    execute(interpreter){
        interpreter.current_execution_context().set(this.name, new FunctionObject(this.name, this.params, this.body));
    }
}

class AssignmentExpression {
    constructor(lhs, rhs){
        this.lhs = lhs;
        this.rhs = rhs;
    }

    execute(interpreter){
        let result = this.rhs.execute(interpreter);
        let lhs_target = interpreter.resolve_identifer(this.lhs);
        if(lhs_target == null){
            // TODO: can't resolve identifer.
        }
        interpreter.current_execution_context().set(this.lhs, result);
    }
};

class CallExpression {
    constructor(name, args){
        this.name = name;
        this.args = args;
    }

    execute(interpreter){
        let target = interpreter.resolve_identifer(this.name);
        if(target == null){
            // TODO: Function not declaraed.
        }
        return target.execute(interpreter, this.args);
    }
};

class VariableDeclaration { 
    constructor(identifier, init){
        this.identifier = identifier;
        this.init = init;
    }

    execute(interpreter){
        this.init.execute(interpreter);
    }
};

class Value {
    constructor(value){
        this.value = value;
    }

    execute(interpreter){
        return parseInt(this.value);
    }
};

class Identifier {
    constructor(id){
        this.id = id;
    }

    execute(interpreter){
        return interpreter.resolve_identifer(this.id);
    }
};

class BinaryExpression {
    constructor(op, lhs, rhs){
        this.op = op;
        this.lhs = lhs;
        this.rhs = rhs;
    }

    execute(interpreter){
        let left_hande_side = this.lhs.execute(interpreter);
        let right_hande_side = this.rhs.execute(interpreter);
        switch(this.op){
            case '*':
                return left_hande_side * right_hande_side;

            case '/':
                return left_hande_side / right_hande_side;

            case '%':
                return left_hande_side % right_hande_side;

            case '+':
                return left_hande_side + right_hande_side;

            case '-':
                return left_hande_side - right_hande_side;

            case '<<':
                return left_hande_side << right_hande_side;

            case '>>':
                return left_hande_side >> right_hande_side;

            case '&':
                return left_hande_side & right_hande_side;

            case '^':
                return left_hande_side ^ right_hande_side;

            case '|':
                return left_hande_side | right_hande_side;

            case '&&':
                return left_hande_side && right_hande_side;

            case '||':
                return left_hande_side || right_hande_side;
        }
    }
};

class ReturnExpression {
    constructor(expr){
        this.expr = expr;
    }

    execute(interpreter){
        return this.expr.execute(interpreter);
    }
};

class NativeFunction {
    constructor(name){
        this.name = name;
    }

    execute(interpreter){
        switch(this.name){
            case "println":{
                console.log(interpreter.resolve_identifer("value"));
                break;
            }
        }
    }
};

export { AST, AssignmentExpression, BinaryExpression, CallExpression, FunctionBody, FunctionObject, FunctionDeclaration, Identifier, Value, VariableDeclaration, ScopeNode, ReturnExpression, NativeFunction };