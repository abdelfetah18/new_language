import Parser from "./parser.js";
import Interpreter from "./interpreter.js";
import { readFileSync } from "node:fs";
import { exit } from "node:process";


if(process.argv.length == 2){
    console.log("USAGE:", "node index.js <path_to_source>");
    exit(1);
}

let file_path = process.argv[2];

let input = readFileSync(file_path).toString();
console.log(input);


let parser = new Parser(input);
let ast = parser.parse_statement_list();

let interpreter = new Interpreter();

interpreter.ast = ast;
interpreter.run();


console.log({ ast: ast.declaration[0].init, data: interpreter.all_the_execution_context });
