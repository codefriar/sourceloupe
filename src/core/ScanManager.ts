import Parser, { Tree, SyntaxNode } from "tree-sitter";
import * as TreeSitter from "tree-sitter";
import Violation from "./Violation";
import Rule from "../types/Rule";

export default class ScanManager{


    private _nodeTree: any;
    private _parser: Parser;
    private _language: any;
    private _rules: Array<Rule>;
    private _sourcePath: string;
    private _sourceCode: string;
    private _violations: Map<string,Array<Violation>>;


    constructor(parser: Parser, language: any,sourcePath: string, sourceCode: string, rules: Array<Rule>){
        this._sourcePath = sourcePath;
        this._sourceCode = sourceCode;
        this._rules = rules;
        this._language = language;
        this._parser = parser;
        this._nodeTree = parser.parse(this._sourceCode);
    }

    /**
     * Dump is here as a way to quickly test out new rules without having to create them. It's basically
     * a mini playground.
     * @param queryString A tree sitter query. Can be as simple or as complex as you want.
     */
    dump(queryString: string){
        // Use dump as a mechanism to allow for ad-hoc ts queries?
        const result: Array<DumpResult> = [];
        if( queryString === ""){
            queryString = `(class_declaration @decl)`;
        }
        const query : TreeSitter.Query = new TreeSitter.Query(this._language,queryString);
        const matches: TreeSitter.QueryMatch[] = query.matches(this._nodeTree.rootNode)
        for(let match of matches){
            for(let capture of match.captures){
                const dumpResult: DumpResult = new DumpResult(capture.node,this._sourceCode);
                result.push(dumpResult);
            }
        }
        console.log(JSON.stringify(result));
    }
    
    /**
     * Scan is the scanner scannerific scantaculous main method for inspecting code for violations of given rules.
     * Rules are provided to the ScanManager from elsewhere.
     * @returns A map of cateogries->list of violations
     */
    scan():  Map<string,Array<Violation>>{
        return this._scan("scan");
    }

    /**
     * Common scan method used by both scan and measure. Both were consolidated here as both essentially
     * did the same thing, just reported the results differently. Realizing that how the report is formatted
     * should be the purview of something other than the scanner, I moved that stuff out.
     * @param context What operational contecxt we are using. Scan or measure are currently supported.
     * @returns `Map<string,Array<Violation>>` A map of category->array of violations. Allows for some
     * custom organization
     */
    private _scan(context: string):  Map<string,Array<Violation>>{
        const tree = this._nodeTree;
        if(this._rules === null || this._rules.length === 0){
        }
        const resultMap: Map<string,Array<Violation>> = new Map<string,Array<Violation>>();
        for(let rule of this._rules){
            if(!resultMap.has(rule.category)){
                resultMap.set(rule.category,[]);
            }
            
            // First the tree sitter query. :everage the built-in regex
            if(!rule.context.includes(context)){
                continue;
            }
            let queryText = rule.query;
            if(rule.regex != null){
                // Note that tree-sitter is persnickity about regular expressions.
                // It's not that great about giving you feedback if the regex is gibbed.
                // Including this here fragment because I know it works...it's just for reference
                // (#match? @exp "^[a-zA-Z]{0,3}$")

                const regExInsert = rule.regex == null ? "" : `(#match? @exp "${rule.regex}")`;
                queryText += regExInsert;
            }
            try{
                const query : TreeSitter.Query = new TreeSitter.Query(this._language,queryText);
                const matches: TreeSitter.QueryMatch[] = query.matches(this._nodeTree.rootNode);
                matches.forEach(match=>{
                    match.captures.forEach(capture=>{
                        let violationFlagged: boolean = true;
                        // Now on to functions
                        if(rule.scanFunction != null){
                            const queryFunction = rule.scanFunction;
                            violationFlagged = queryFunction(capture.node);
                        }
                        if(violationFlagged){
                            const newViolation: Violation = new Violation(capture.node,rule,this._sourcePath);
                            resultMap[rule.category].push(newViolation);
                        }
                    });
                });

            }
            catch(treeSitterError: any){
                console.error(`A tree-sitter query error occurred: ${treeSitterError}`);
            }

        }
        return resultMap;
    }

    measure(parser: Parser, language: any):  Map<string,Array<Violation>> {
        return this._scan("measure");
    }
}


/**
 * Simple object for containing information returned from a dump operation. Dump accepts
 * a  tree sitter query and spits back the requested source fragment to the console.
 */
export class DumpResult{
    SourceFragment: string;
    StartIndex: number;
    EndIndex: number;

    constructor(node: SyntaxNode, source: string){
        this.SourceFragment = source.substring(node.startIndex,node.endIndex);
        this.StartIndex = node.startIndex;
        this.EndIndex = node.endIndex;
    }
}

const RULE_REGISTRY = 
{
    "rules":
    [
        {
            "name":"Variables",
            "queries":[{
                    "name":"Total",
                    "context":"measure",
                    "message":"This is the total number of variable declarations, not counting method arguments.",
                    "query":'(variable_declarator (identifier) @exp)',
                },
                {
                    "name":"Length < 3",
                    "context":"scan,measure",
                    "message":"Variables should be descriptive, clear, and concise with names over three characters long.",
                    "query":'(variable_declarator (identifier) @exp)',
                    "function":function(node){return node.text.length > 3;}
                },
                {
                    "name":"Trivial RegEx",
                    "context":"scan,measure",
                    "message":"A trivial RegEx (for testing) has produced some matches.",
                    "query":'(variable_declarator (identifier) @exp)',
                    "pattern":"foo_[a-zA-Z0-9]*",
                }

            ]
        }
    ]
}

