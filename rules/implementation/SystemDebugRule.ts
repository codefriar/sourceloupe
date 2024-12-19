import ScanRule from "../../core/ScanRule.ts";
import Node, { SyntaxNode } from "tree-sitter";

export default class SystemDebugRule extends ScanRule{
    inspect(whatToScan: Array<SyntaxNode>,...args: any[]) : void{
        whatToScan.forEach(node=> {
            console.log(`GRAMMAR TYPE = ${node.grammarType}`);
            console.log(`PARENT GRAMMAR TYPE = ${node.parent.grammarType}`);
            console.log('--------------------');
        });
        
    }
}