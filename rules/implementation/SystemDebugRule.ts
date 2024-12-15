import ScanRule from "../../core/ScanRule.ts";
import Node, { SyntaxNode } from "tree-sitter";

export default class SystemDebugRule extends ScanRule{
    inspect(whatToScan: Array<SyntaxNode>,...args: any[]) : void{
        whatToScan.forEach(node=> {
            console.log(`PARENT = ${node.parent.type}`);
            console.log(`NODE = ${node}`);
            console.log(node.text);
            console.log(`FIRST CHILD = ${node.childCount}`);
        })
    }
}