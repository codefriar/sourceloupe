import fs from "node:fs";
import Node, { type SyntaxNode } from "npm:tree-sitter";
import Violation from "./Violation.ts";


export default abstract class ScanRule{

    RuleConfiguration: configuration;
    Violations: Array<Violation>;

    // base class for rules
    abstract inspect(whatToScan: Array<SyntaxNode>):void;

    // We'll stick with one for now and expand as needed
    constructor(ruleVariantName:string){
        this.Violations = new Array<Violation>();
        let configurationFileName: string= `./rules/configuration/${this.constructor.name}.json`;
        let jsonObject: any = this.readJsonFile(configurationFileName);
        this.RuleConfiguration = jsonObject[ruleVariantName] as configuration;
    }

    private readJsonFile(path: string) {
        const file = fs.readFileSync(path, "utf8");
        return JSON.parse(file);
    }

    addViolation(contextNode: Node){
        const violation: Violation = new Violation(contextNode,this);
        violation.BeginningAtPosition = contextNode.startPosition;
        violation.EndingAtPosition = contextNode.endPosition;
        violation.Description = this.RuleConfiguration.description;
        violation.Message = this.RuleConfiguration.message;
        violation.Priority = this.RuleConfiguration.priority;
        violation.ScanRuleUsed = this;
        this.Violations.push(violation);        
    }

}

export class configuration{
    targetNodeTypeNames: string[];
    parentNodeTypeNames: string[];
    description: string;
    message: string;
    priority: number;
    enabled: boolean;

    constructor(){
        this.targetNodeTypeNames = [];
        this.parentNodeTypeNames = [];
        this.description = "";
        this.message = "";
        this.priority = 0;
        this.enabled = false;
    }
}