import Parser from "npm:tree-sitter";
import Node from "npm:tree-sitter-sfapex";
import ScanRule, { configuration } from "./ScanRule.ts";
import ScanRuleInspection from "./ScanRuleInspection.ts"
import Violation from "./Violation.ts"

export default class ScanManager{
    ScanTargetSource: string;
    ScanTargetSourceFile: string;
    TotalViolations: Array<Violation>;
    ParserInstance: Parser;
    TreeRootNode: Node;
    ScanRules: Array<ScanRule>;

    protected ScanRuleList: Array<ScanRule>;


    constructor(sourceCode:string, sourceFileName: string, parser: Parser){
        this.ScanTargetSource = sourceCode;
        this.ScanTargetSourceFile = sourceFileName;
        this.ParserInstance = parser;
        let rawTree: Tree = parser.parse(sourceCode);
        this.TreeRootNode = rawTree.rootNode;
        this.ScanRuleList = new Array<ScanRule>();
    }

    dump(contextNode: Node){

    }
    /**
     * begins the scan workflow.  (change to scan unless render = end)
     * 
     */
    scan(scanRules: Array<ScanRule>): ScanManager{
        if(!this.TotalViolations){
            this.TotalViolations - new Array<Violation>();
        }
        for(let rule of scanRules){
            const config : configuration = rule.RuleConfiguration;
            if(config.targetNodeTypeName == "*"){
                rule.inspect(this.TreeRootNode);
            }
            else{
                const targetDescendants = this.TreeRootNode.descendantsOfType(config.targetNodeTypeName);
                rule.inspect(targetDescendants);    
                this.TotalViolations.concat(rule.Violations);
            }
        }
        return(this);
    }

    render(){
        
    }


}






