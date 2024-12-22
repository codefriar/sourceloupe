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

const testSource = `
public with sharing class SampleThing{

    private Integer i;

    public SampleThing(Integer newValue){
        i = newValue;
        Integer j;
        Integer k = 10;
        j = i * 2;
        i = j;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
        i++;
    }

    public Boolean myMethod(Integer someStuff){
        // TODO: Sys!
        System.debug('hello');
        if(someStuff < 10){
            i = -1;
            return true;
        }
        return false;
    }
}
`;



// New rules get added here. Ideally this would be in an include or something
let scanRuleList: ScanRule[] = [
    new NameLengthRule("VariableNames") as ScanRule,
    new SystemDebugRule("default") as ScanRule
];


//manager.TotalViolations.forEach(v=>console.log(v.SourceFragment));


const onWindows = process.platform === `win32`;

const startingFromDirectory = "c:/repos/bah/va/team-3/ff/va-teams/force-app/main/default/classes"; // Replace with your directory path

function getEverything(dir) {
  const listCommand = onWindows ? `dir /b/o/s "${dir}"` : `find ${dir}`;
  return execSync(listCommand).toString(`utf-8`).split(/\r?\n/);
}

const resultReport: node_counts = new node_counts();

var totalCount: number = 0;
console.log('{ "node_counts": { "per_file_counts": [');
getEverything(startingFromDirectory).forEach(fileName=>{
    if(fileName.endsWith('.cls')){
        fs.readFile(fileName,'utf8')
            .then(fileContents=>{
                //console.log(fileContents);
                let parser = new Parser();
                parser.setLanguage(TsSfApex.apex);
                const manager = new ScanManager(fileContents,fileName,parser);

                const fileResult: per_file_nodes = manager.measure(['formal_parameter','variable_declarator']);
                for(let nodeType of fileResult.source_node_types){
                    totalCount += nodeType.total_count;
                }
                console.log(`${JSON.stringify(fileResult)},`);
                //resultReport.addFileMetrics(fileResult);
            });
        }
});

