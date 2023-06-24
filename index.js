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
console.log("[ INPUT ] =========================\n",input,"\n===================================\n");


let parser = new Parser(input);
let ast = parser.parse_statement_list();

console.log("[*] Parsing done.");

let interpreter = new Interpreter();

interpreter.ast = ast;
interpreter.run();


console.log("\n[ PROGRAM ] ===============================\n",{ ast: ast.declaration[0].init, data: interpreter.all_the_execution_context });
