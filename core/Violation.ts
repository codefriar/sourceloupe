import ScanRule from "./ScanRule.ts";
import Point from "npm:tree-sitter";

export default class Violation{
    Message: string;
    Description: string;
    ScanRuleUsed: ScanRule;
    BeginningAtPosition: Point;
    EndingAtPosition: Point;
    SourceFragment: string;
    Priority: number;

    constructor(){
        this.Message = "";
        this.Description = "";
        this.SourceFragment = "";
        this.Priority = 0;
    }

    protected getFragmentFromSource(fullSource: string){
        // Too bad I can't get cute with vector/matrix math
        let startindex = this.BeginningAtPosition.row * this.BeginningAtPosition.column;
        let endIndex = this.EndingAtPosition.row * this.EndingAtPosition.column;

        this.SourceFragment = fullSource.substring(startindex,endIndex);

    }
}