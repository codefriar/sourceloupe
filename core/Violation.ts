import ScanRule from "./ScanRule.ts";
import Point, { SyntaxNode } from "tree-sitter";
import Node from "tree-sitter-sfapex" ;

/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
export default class Violation{
    RuleQuery: any;
    SourceSyntaxNode: SyntaxNode;
    FilePath: string;

    /**
     * constructor(...) Entry point for new objects.
     * @param node 
     * @param rule 
     * @param args 
     */
    constructor(node: SyntaxNode, rule: any, ruleQuery: any, filePath: string){
        this.RuleQuery = ruleQuery;
        this.FilePath = filePath;
        this.SourceSyntaxNode = node;
    }

}