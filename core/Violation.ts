import ScanRule from "./ScanRule.ts";
import Point from "npm:tree-sitter";
import Node from "npm:tree-sitter-sfapex" ;


export default class Violation{
    Message: string;
    Description: string;
    ScanRuleUsed: ScanRule;
    BeginningAtPosition: Point;
    EndingAtPosition: Point;
    SourceFragment: string;
    Priority: number;

    constructor(node: Node, rule: ScanRule,...args: any[]){
        this.Message = rule.RuleConfiguration.message;
        this.Description = rule.RuleConfiguration.description;
        this.SourceFragment = node.text;
        
    }

    protected getFragmentFromSource(fullSource: string){
        // Too bad I can't get cute with vector/matrix math
        let startindex: number = this.BeginningAtPosition.row * this.BeginningAtPosition.column;
        let endIndex: number = this.EndingAtPosition.row * this.EndingAtPosition.column;

        this.SourceFragment = fullSource.substring(startindex,endIndex);

    }
}