'use strict';
import Parser from "tree-sitter";
import TsSfApex from "tree-sitter-sfapex";
import ScanManager from "./core/ScanManager.ts";
import NameLengthRule from "./rules/implementation/NameLengthRule.ts";
import type ScanRule from "./core/ScanRule.ts";

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
        if(someStuff < 10){
            return true;
        }
        return false;
    }
}
`;



// New rules get added here. Ideally this would be in an include or something
// TODO: Why this is giving an error when the rule inherits from ScanRule?!?!?
let scanRuleList: ScanRule[] = [
    new NameLengthRule("VariableNames") as ScanRule,
    new NameLengthRule("MethodNames") as ScanRule
];


// TODO: Figure out a better way to leverage events for loading things dynamically
let parser = new Parser();
parser.setLanguage(TsSfApex.apex);
const manager = new ScanManager(testSource,"local",parser);

//manager.dump(manager.TreeRootNode);
manager.scan(scanRuleList);

//manager.TotalViolations.forEach(v=>console.log(v.SourceFragment));