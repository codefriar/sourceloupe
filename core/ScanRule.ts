import fs from "node:fs";
import Node, { type SyntaxNode } from "tree-sitter";
import Violation from "./Violation.ts";

export default abstract class ScanRule{

    Arguments: Map<string,any>; 
    Violations: Array<Violation>;

    // base class for rules
    abstract inspect(whatToScan: Array<SyntaxNode>, args: any):Array<Violation>;

    // We'll stick with one for now and expand as needed
    constructor(){
        this.Arguments = new Map<string,any>();
        this.Violations = new Array<Violation>();
    }

    addViolation(contextNode: SyntaxNode){
        const violation: Violation = new Violation(contextNode,this);
        violation.ScanRuleUsed = this;
        this.Violations.push(violation);        
    }

}
