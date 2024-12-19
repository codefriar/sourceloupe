'use strict';
import Parser from "tree-sitter";
import TsSfApex from "tree-sitter-sfapex";
import ScanManager from "./core/ScanManager.ts";
import NameLengthRule from "./rules/implementation/NameLengthRule.ts";
import type ScanRule from "./core/ScanRule.ts";
import SystemDebugRule from "./rules/implementation/SystemDebugRule.ts";
import {Command,Option,Argument} from "commander";

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

let parser = new Parser();
parser.setLanguage(TsSfApex.apex);
const manager = new ScanManager(testSource,"local",parser);

const program = new Command();

program
    .name('sourceloupe')
    .description('CLI for Salesforce static code analysis using tree-sitter')
    .version('0.0.1')
const metricsCommand = new Command("metrics");
const dumpCommand = new Command("dump");
const scanCommand = new Command("scan");
const sourceOption = new Option("-s, --source <path>", "Path to the source to be inspected");
metricsCommand.addOption(sourceOption);
scanCommand.addOption(sourceOption);
dumpCommand.addOption(sourceOption);
program
    .addCommand(metricsCommand)
    .addCommand(dumpCommand)
    .addCommand(scanCommand)
    .addOption(sourceOption)
    .parse(process.argv)
    .action((name, options, command: Command) => {
        switch(command.name()){
            case "scan":
                manager.scan(scanRuleList);
            case "dump":
                manager.dump(manager.TreeRootNode);
            case "netrics":
                manager.metrics();
        }
    });


