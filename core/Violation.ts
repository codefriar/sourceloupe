import ScanRule from "./ScanRule.ts";
import Point, { SyntaxNode } from "tree-sitter";
import Node from "tree-sitter-sfapex" ;

/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
export default class Violation{
    Message: string;
    Description: string;
    ScanRuleUsed: ScanRule;
    BeginningAtPosition: any;
    EndingAtPosition: any;
    SourceFragment: string;
    Priority: number;
    TargetNode: SyntaxNode;

    /**
     * constructor(...) Entry point for new objects.
     * @param node 
     * @param rule 
     * @param args 
     */
    constructor(node: SyntaxNode, rule: ScanRule,...args: any[]){
        this.Message = rule.RuleConfiguration.message;
        this.Description = rule.RuleConfiguration.description;
        this.SourceFragment = node.text;
        this.TargetNode = node;
        
    }

    protected getFragmentFromSource(fullSource: string){
        // Too bad I can't get cute with vector/matrix math
        let startindex: number = this.BeginningAtPosition.row * this.BeginningAtPosition.column;
        let endIndex: number = this.EndingAtPosition.row * this.EndingAtPosition.column;

        this.SourceFragment = fullSource.substring(startindex,endIndex);

    }
}