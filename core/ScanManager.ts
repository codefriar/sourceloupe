import Parser, { type SyntaxNode, type Tree } from "npm:tree-sitter";
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
        const rawTree: Tree = parser.parse(sourceCode);
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
            this.TotalViolations = new Array<Violation>();
        }
        for(const rule of scanRules){
            const config : configuration = rule.RuleConfiguration;
            if(config.targetNodeTypeNames.includes("*")){
                rule.inspect(this.TreeRootNode);
            }
            else{
                const targetDescendants: Array<SyntaxNode> = this.TreeRootNode.descendantsOfType(config.targetNodeTypeNames);
                rule.inspect(targetDescendants);    
                this.TotalViolations.concat(rule.Violations);
                this.TotalViolations.forEach(viol=>{
                    console.log(viol.SourceFragment);
                })
            }
        }
        return(this);
    }

    render(){

    }


}






