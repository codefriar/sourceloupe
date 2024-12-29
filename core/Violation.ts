import ScanRule from "./ScanRule.ts";
import Point, { SyntaxNode } from "tree-sitter";
import Node from "tree-sitter-sfapex" ;

/**
 * Violation class
 * Simple object for providing some structure and behavior to the rule on the subject of parsing
 */
export default class Violation{
    ScanRuleUsed: ScanRule;
    TargetNode: SyntaxNode;

    /**
     * constructor(...) Entry point for new objects.
     * @param node 
     * @param rule 
     * @param args 
     */
    constructor(node: SyntaxNode, rule: ScanRule){
        this.TargetNode = node;
        this.ScanRuleUsed = rule;
    }

}