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
 * @description This is the console/main wrapper script for the code scanning framework. It should be considered a reference implementation. This does not guarantee that it shows the right or wrong way to do things. See indivisual JSDoc comments for more information.
 * This is a work-in-progress that is subject to drastic change. The following is meant as a list of things that are in flux:
 * 1. Rule definitions started as pure TypeScript, but other approaches are being considered. See the ./rules directory for more information. This is also a question of code vs. configuration (and can code BE configuration.) Considered and tested options are:
 *      - Pure TS rules. The author needs to know a little about tree-sitter and how the parser represents the source.
 *      - TS with heavy JSON configuration. This is the current implementation. Refer to the following:
 *          - ./rules/configuration/NameLengthRule.json:    JSON configration that lays out metadata about a rule that is significant (how the nodes arew organized, the details of the violation messages, etc.)
 *          - ./rules/implementation/NameLengthRule.ts:     The implemmentation for the rule looks at the configuration and uses values therein to identify what nodes it should be looking at and how they would trigger a violation.'
 * 2. Rendering results. How should the framework spit out the results of a scan if asked? PDF? Smoke signal?
 * 3. Approaches to LWCs (or more generally, appraches to multifile analysis)
 * 4. Dependency comprehension and analysis is considered but not implemented. This would be a useful feature.
 * 5. Currently, the source being tested should be considered a best-case-scenario
 * @implementation The way tree-sitter looks at leaves is largely generic and abstracted in contrast to the way .g4 grammars see things
 * ANTLR4, although it uses an AST, sees things as strongly-differentiated elements. Tree-sitter sees many things as identifiers.
 * 
 * Identifiers that have a parent of variable_declarators or formal_parameters are variables
 * Identifiers that have a method_declaration as the parent are methods
 * Binary expressions are true/false tests such as a < 100
 * if_statement is self-explanatory
 * parenthesized_expression is the magic that happens after a statement
 * block is the code after an expression that is usally boxed in by braces
 * 
 * NOTE: If something isn't playing nicely or a strange node appears, it is more than likely that the given relationship it has within its immediate branch isn't understood.
 */


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