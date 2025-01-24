import Parser, { Tree, SyntaxNode } from "tree-sitter";
import * as TreeSitter from "tree-sitter";
import { RULE_REGISTRY } from "../rules/RuleRegistry";

export default class ScanManager{

    SourcePath: string;
    SourceCode: string;
    RuleRegistry: any;
    GrammarParser: Parser;
    GrammarLanguage: any;

    private _nodeTree: any;

    constructor(parser: Parser, language: any,sourcePath: string, sourceCode: string, registry: any){
        this.SourcePath = sourcePath;
        this.SourceCode = sourceCode;
        this.RuleRegistry = registry;
        this._nodeTree = parser.parse(this.SourceCode);
    }

    dump(parser: Parser, language: any, queryString: string){
        // Use dump as a mechanism to allow for ad-hoc ts queries?
        const tree = parser.parse(this.SourceCode);
        if( queryString === ""){
            queryString = `(class_declaration @decl)`;
        }
        console.log(queryString);
        const query : TreeSitter.Query = new TreeSitter.Query(language,queryString);
        const matches: TreeSitter.QueryMatch[] = query.matches(tree.rootNode)
        for(let match of matches){
            for(let capture of match.captures){
                const sourceFragment = this.SourceCode.substring(capture.node.startIndex,capture.node.endIndex);
                console.log(sourceFragment);
            }
        }
    }
    
    scan(parser: Parser, language: any){
        const fileMeasure : FileMeasurements = new FileMeasurements(this.SourcePath);
        this.measure(parser,language);
        const tree = parser.parse(this.SourceCode);
        if(RULE_REGISTRY === null || RULE_REGISTRY.rules === null){
            // Throw custom exception            
        }
        for( let rule in RULE_REGISTRY.rules){

        }
    }

    measure(parser: Parser, language: any){
        const fileMeasure : FileMeasurements = new FileMeasurements(this.SourcePath);
        if(RULE_REGISTRY === null || RULE_REGISTRY.rules === null){
            throw new Error("Rule registry invalid.");
        }
        for(let rule of RULE_REGISTRY.rules){
            const measurement = {}
            measurement[rule.name] = {};
            for(let ruleQuery of rule.queries){
                if(!ruleQuery.context.includes("measure")){
                    continue;
                }
                measurement[rule.name][ruleQuery.name] = 0;
                const query : TreeSitter.Query = new TreeSitter.Query(language,ruleQuery.query);
                const matches: TreeSitter.QueryMatch[] = query.matches(tree.rootNode);
                if(ruleQuery.function != null){
                    for(let match of matches){
                        for(let capture of match.captures){
                            let queryFunction = ruleQuery.function
                            if(queryFunction(capture.node) == false){
                                measurement[rule.name][ruleQuery.name]++;
                            }
                        }
                    }
                }
                else{
                    for( let match of matches){
                        for(let capture of match.captures){
                            if(ruleQuery.type === "regex"){
                                const regExSearch = new RegExp(ruleQuery.pattern);
                                const foundArray = regExSearch.exec(capture.node.text);
                                if(foundArray !== null){
                                    measurement[rule.name][ruleQuery.name]+=foundArray.length;
                                }                                
                            }
                            else{
                                measurement[rule.name][ruleQuery.name]++;
                            }
                        }

                    }
                }
            }
            fileMeasure.Measurements.push(measurement);
        }
        this.MeasureResult = JSON.stringify(fileMeasure);
    }
}

class FileMeasurements{
    FilePath: string;
    Measurements: Array<any>;

    constructor(filePath: string){
        this.FilePath = filePath;
        this.Measurements = [];

    }
}
