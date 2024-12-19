import Parser, { Point, type SyntaxNode, type Tree } from "tree-sitter";
import ScanRule, { configuration } from "./ScanRule.ts";
import ScanRuleInspection from "./ScanRuleInspection.ts"
import Violation from "./Violation.ts"
import NodeRecognizer from "../nodetools/tools.ts";

export default class ScanManager{
    ScanTargetSource: string;
    ScanTargetSourceFile: string;
    TotalViolations: Array<Violation>;
    ParserInstance: Parser;
    TreeRootNode: SyntaxNode;
    ScanRules: Array<ScanRule>;
    IncludeAnonymousNodes: boolean;
    NodeTypeToInstanceMap: Map<string,SyntaxNode[]>;

    private _allNodes: SyntaxNode[];

    protected ScanRuleList: Array<ScanRule>;

    constructor(sourceCode:string, sourceFileName: string, parser: Parser){
        this.ScanTargetSource = sourceCode;
        this.ScanTargetSourceFile = sourceFileName;
        this.ParserInstance = parser;
        const rawTree: Tree = parser.parse(sourceCode);
        this.TreeRootNode = rawTree.rootNode;
        this.ScanRuleList = new Array<ScanRule>();
    }

    dump(node: SyntaxNode, indent = 0) {
        console.log(
            " ".repeat(indent),
            (node.isNamed ? "(" : "") + node.type + (node.isNamed ? ")" : "")
        );
        this._allNodes.push(node);

        for (let childItem of this.IncludeAnonymousNodes ? node.children : node.namedChildren) {
            this.dump(childItem, indent + 2);
        }
    }

    private getAllNodes(startingFromNode: SyntaxNode, forNodeTypes: string[] = []){
        this._allNodes.push(startingFromNode);
        for (let childItem of this.IncludeAnonymousNodes ? startingFromNode.children : startingFromNode.namedChildren) {
            this.getAllNodes(childItem);
        }
    }

    metrics(): Map<string,SyntaxNode[]>{


        this.getAllNodes(this.TreeRootNode);

        this._allNodes.forEach(nodeItem=>{
            const nodeRecog : NodeRecognizer = new NodeRecognizer(nodeItem);
            if(nodeRecog.isVariable()){

            }
            else if(nodeRecog.isMethod()){

            }

            if(this.NodeTypeToInstanceMap.has(nodeItem.grammarType)){
                this.NodeTypeToInstanceMap.get(nodeItem.grammarType).push(nodeItem);
            }
            else{
                let tempArray : SyntaxNode[] = [];
                tempArray.push(nodeItem);
                this.NodeTypeToInstanceMap.set(nodeItem.grammarType,tempArray);
                
            }


        });

        return this.NodeTypeToInstanceMap;
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
            //console.log(`CONFIG=${configurationFileName}`);
            if(config.targetNodeTypeNames.includes("*")){
                rule.inspect(this.TreeRootNode.children);
            }
            else{

                // const targetDescendants: Array<SyntaxNode> = this.TreeRootNode.descendantsOfType(config.targetNodeTypeNames);
                var nodeTypeList : string[] = [];
                
                rule.inspect(this.TreeRootNode.descendantsOfType(config.targetNodeTypeNames));    
                rule.Violations.forEach(thisViolation => {
                    this.TotalViolations.push(thisViolation);
                })
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