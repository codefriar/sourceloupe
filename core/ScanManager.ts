import Parser, { Point, type SyntaxNode, type Tree } from "tree-sitter";
import ScanRule, { configuration } from "./ScanRule.ts";
import ScanRuleInspection from "./ScanRuleInspection.ts"
import Violation from "./Violation.ts"

export default class ScanManager{
    ScanTargetSource: string;
    ScanTargetSourceFile: string;
    TotalViolations: Array<Violation>;
    ParserInstance: Parser;
    TreeRootNode: SyntaxNode;
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

    dump(contextNode: SyntaxNode){
        if(contextNode !== undefined){
            console.log(`${contextNode.type}=${contextNode.text}`);
        }
        for(let childNode in contextNode.children){
            console.log(childNode);
            //this.dump(childNode);
        }
    }


    metrics(): Map<string,any>{

        // THIS IS PROTOTYPE CODE AND NOT INDENDED TO BE FINAL. JUST HERE TO FEED THE DISCUSSION

        // Get all variables and methods
        const variableList = this.TreeRootNode.descendantsOfType("indentofier")
                .filter(node=>node.parent.type == "variable_declarator" || node.parent.type == "formal_parameter");

        const shortVariableList = this.TreeRootNode.descendantsOfType("indentofier")
            .filter(node=>node.parent.type == "variable_declarator" || node.parent.type == "formal_parameter");

        const methodList = this.TreeRootNode.descendantsOfType("indentofier")
            .filter(node=>node.parent.type == "variable_declarator" || node.parent.type == "formal_parameter");

        // const shortMethodList = this.TreeRootNode.descendantsOfType("indentofier")
        //     .filter(node=>node.parent.type == "variable_declarator" || node.parent.type == "formal_parameter");

        const debugStatentList = this.TreeRootNode.descendantsOfType("identifier")
            .filter(node=>node.text == "debug");

        const result : Map<string,any> = new Map<string,any>();

        result.set("GoodVars", variableList.length);
        result.set("BadVars",shortVariableList.length);
        return result;
    }

    /**
     * begins the scan workflow.  (change to scan unless render = end)
     * 
     */
    scan(scanRules: Array<ScanRule>): ScanManager{
        if(this.TotalViolations == null){
            this.TotalViolations = new Array<Violation>();
        }
        for(const rule of scanRules){
            const config : configuration = rule.RuleConfiguration;
            // Glob, run against everything. Good example would be
            console.log(`CONFIG=${configurationFileName}`);
            if(config.targetNodeTypeNames.includes("*")){
                //rule.inspect(this.TreeRootNode);
            }
            else{

                // const targetDescendants: Array<SyntaxNode> = this.TreeRootNode.descendantsOfType(config.targetNodeTypeNames);
                rule.inspect(this.TreeRootNode.descendantsOfType(config.targetNodeTypeNames));    
                rule.Violations.forEach(thisViolation => {
                    this.TotalViolations.push(thisViolation);
                })
                this.TotalViolations.concat(rule.Violations);
            }
        }
        return(this);
    }

    render(){

    }


}

export class ScanResult{
    SourceFile : string;
    Violations: Array<Violation>;
    StartsAt: SourceLocation;
    End: SourceLocation;
    SourceText: string;
    SourcePath:  string;

    constructor(){
        
    }

}

export class SourceLocation{

    StartLocation: Point;
    EndLocation: Point;
    
    constructor(node: SyntaxNode){
        this.StartLocation = node.startPosition;
        this.EndLocation = node.endPosition;
    }
}