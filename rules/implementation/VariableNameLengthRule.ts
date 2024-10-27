import ScanRule from "../../core/ScanRule.ts";
import Node from "npm:tree-sitter";

export default class VariableNameLengthRule extends ScanRule{
    inspect(whatToScan: Array<Node>,...args: any[]){
        // TODO: Varargs for inspect to support k/v pairs of configurable properties.
        // Approach will be as agnostic as possible to these
        let violatingNodes: Array<Node> = whatToScan
            .filter(scannedNode => 
                scannedNode.text != null && 
                scannedNode.text.length <= 3 
            );
            
        violatingNodes.forEach(node=>{
            this.addViolation(node);
        });
    }
}