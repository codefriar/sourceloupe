'use strict';
import Parser from "npm:tree-sitter";
import TsSfApex from "npm:tree-sitter-sfapex";
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


/**
 * Identifiers that have a parent of variable_declarators or formal_parameters are variables
 * Identifiers that have a method_declaration as the parent are methods
 * Binary expressions are trie/false tests such as a < 100
 * if_statement is self-explanatory
 * parenthesized_expression is the magic that haooens after a statement
 * block is the code after an expression that is usally boxed in by braces
 */


// New rules get added here. Ideally this would be in an include or something
// TODO: Ask why this is giving an error when the rule inherits from ScanRule?!?!?
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