import Parser, { Tree, SyntaxNode } from "tree-sitter";
import ViolationAlert from "./ViolationAlert";

export default class ScanManager{

    SourcePath: string;
    SourceCode: string;
    RuleRegistry: any;
    Alerts: Array<ViolationAlert>;

    constructor(sourcePath: string, sourceCode: string, registry: any){
        this.SourcePath = sourcePath;
        this.SourceCode = sourceCode;
        this.RuleRegistry = registry;
        this.Alerts = [];
    }

    dump(){}
    
    scan(parser: Parser, language: any){
        parser.setLanguage(language);
        const sourceTree: Tree = parser.parse(this.SourceCode)
        
        for(let ruleConfig of this.RuleRegistry.rules){
            const describingNodes = sourceTree.rootNode.descendantsOfType(ruleConfig.describingNode);
            let nodesToScan: Array<SyntaxNode> = []
            for(let node of describingNodes){
                if(node.parent.grammarType == r.rootNode){
                    nodesToScan.push(node);
                }
            }
        
            if(nodesToScan.length > 0){
                for(let violation of ruleConfig.instance.inspect(nodesToScan,ruleConfig.arguments)){
                    const alertItem: ViolationAlert = new ViolationAlert(violation,ruleConfig);
                    alertItem.StartsAt = violation.TargetNode.startIndex;
                    alertItem.EndsAt = violation.TargetNode.endIndex;
                    this.Alerts.push(alertItem);

                }
            }
            for(let alertItem of this.Alerts){
                const startAt = alertItem.ViolationInstance.TargetNode.startIndex;
                const endAt = alertItem.ViolationInstance.TargetNode.endIndex;
                console.log(this.SourceCode.substring(startAt,endAt));
            }
        }
    }
    measure(){}
}