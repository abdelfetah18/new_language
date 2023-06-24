import { FunctionBody, FunctionObject, NativeFunction } from "./ast.js";

class Interpreter {
    constructor(){
        this.execution_contexts = [];
        this.ast = null;
        // DEBUG: Only.
        this.all_the_execution_context = [];
    }

    current_execution_context(){
        return this.execution_contexts[0];
    }

    append_new_execution_context(){
        this.execution_contexts.unshift(new Map());
    }

    pop_current_execution_context(){
        let old_context = this.execution_contexts.shift();
        // DEBUG: Only.
        this.all_the_execution_context.push(old_context);
    }

    resolve_identifer(id){
        for(let context of this.execution_contexts){
            let target = context.get(id);
            if(target)
                return target;
        }
        return null;
    }

    run(){
        this.append_new_execution_context();
        this.current_execution_context().set("println", new FunctionObject("println", ["value"], new FunctionBody([], [new NativeFunction("println")])));
        this.ast.execute(this);
        this.pop_current_execution_context();
    }
};

export default Interpreter;