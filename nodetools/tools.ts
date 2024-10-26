import Parser from "npm:tree-sitter";
import TsSfApex from "npm:tree-sitter-sfapex";
import Language from "npm:tree-sitter";
import {SyntaxNode,Tree} from "npm:tree-sitter";

export class ScanManager{

    RootNode: SyntaxNode;

    constructor(tree:Tree){
        this.RootNode = tree.rootNode;
    }

    private loadRules(){

    }
}

class ScanRule{

    TargetNodeType: string;
    TreeRootNode: SyntaxNode;
    NewNodeList: Array<SyntaxNode>;

    constructor(targetType: string,treeRootNode: SyntaxNode){
        this.TargetNodeType = targetType;
        this.TreeRootNode = treeRootNode;
        this.NewNodeList = new Array<SyntaxNode>();
    }

    filterByNodeType(nodeTypeName: string){
        this.TargetNodeType = nodeTypeName;
        this.NewNodeList =  this.TreeRootNode.descendantsOfType(nodeTypeName);
    }

    filterByParent(parentTypeName){
        this.NewNodeList = this.NewNodeList.filter( node => node.parent().type == parentTypeName);
    }

    filterByFirstChild(childTypeName: string){
        this.NewNodeList = this.NewNodeList.filter( node: Node => node == parentTypeName);
    }

}