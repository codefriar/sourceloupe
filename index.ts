'use strict';
import * as fs from "fs/promises";
import * as path from "path";
import Parser from "tree-sitter";
import TsSfApex from "tree-sitter-sfapex";
import ScanManager, { node_counts, per_file_nodes } from "./core/ScanManager.ts";
import NameLengthRule from "./rules/implementation/NameLengthRule.ts";
import type ScanRule from "./core/ScanRule.ts";
import SystemDebugRule from "./rules/implementation/SystemDebugRule.ts";
import {Command,Option,Argument} from "commander";
import { readFile } from "fs";
import { execSync } from "child_process";
import { sourceMapsEnabled } from "process";


const program = new Command();

program
    .name("SourceLoupe")
    .description("Static analysis with TypeScript and tree-sitter")
    .version("0.0.1")
    
program
    .command("scan <sourcePath>")
    .description("Scan Apex files in the given source path (recursively.) Apply all rules in order to flag violations.")
    .action((sourcePath,Command)=>{
        run("scan", sourcePath);
    });

program
    .command("dump <sourcePath>")
    .description("Dump the raw syntax tree. Primarily for debugging.")
    .action((sourcePath,Command)=>{
        run("dump", sourcePath);
    });

program
    .command("measure <sourcePath>")
    .description("Get raw data about source code for analysis.")
    .action((sourcePath,Command)=>{
        run("measure", sourcePath);
    });

program.parse(process.argv);


function run(command: string, path: string){
    // Scan config file to handle limiting, global options
    let parser = new Parser();
    parser.setLanguage(TsSfApex.apex);

}