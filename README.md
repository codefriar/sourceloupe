```
 __  __      __  __  ___ 
/__`/  \|  ||__)/  `|__  
.__/\__/\__/|  \\__,|___ 
     __      __  ___     
|   /  \|  ||__)|__      
|___\__/\__/|   |___     
                         
```
# sourceloupe

A straightforward TypeScript framework for leveraging tree-sitter and tree-sitter-sfapex as a static analysis tool.

This is a work in progress. As such, the API will change as will the purpose of the modules herein.


## Rules

The rules are written in TypeScript/JavaScript and inherit from the ScanRule abstract class. 

The work of the scan (where violations are flagged) happens in the inspect(...) method. 

In order to author a new rule, follow these steps:

* Create a class that inherits from ScanRule.
* Use the annotations (more on that below) to describe metadata about this rule.
* In the inspect(...) method, investigate the SyntaxNode that is passed to the method and flag any violations as you see fit.

The API behind SyntaxNode is not well documented, so there will be a short glossary added to this README in the coming weeks. Alternatively, modern IDEs do a pretty good job of giving syntax-completion feedback so experiment (that's how I figured it out so far.)

The following is an example of a static analysis rule that one might write to check the length of variable names: 

```TypeScript
import { SyntaxNode } from 'tree-sitter';
import { ScanRule, ruleName, message, description, priority, enabled, nodeTypeNames } from "../ScanRule.js";

@message("Simulated test coverage detected")
@description("Test coverage must not be simulated or otherwise subverted in order pass Salesforce's quality gates.")
@priority(1)
@enabled(true)
@nodeTypeNames(["class_body"])
@ruleName("NoSimulatedCoverage")
export default class PreventSimulatedTestCoverageRule extends ScanRule {
    private static incrementCount: Map<string,number>;

    constructor() {
        PreventSimulatedTestCoverageRule.incrementCount = new Map<string, number>();
        super();
    }

    inspect(node: SyntaxNode) {
    //    if (node.type == '++') {
    //        if (!PreventSimulatedTestCoverageRule.incrementCount.get(node.parent.parent.text)) {
    //            PreventSimulatedTestCoverageRule.incrementCount.set(node.parent.parent.text, 0);
    //        }
    //        let runningTotal: number = PreventSimulatedTestCoverageRule.incrementCount.get(node.parent.parent.text);
    //        runningTotal++;
    //        PreventSimulatedTestCoverageRule.incrementCount.set(node.parent.parent.text, runningTotal);
    //        if (runningTotal > 5) {
    //            this.addViolation(node, this, new Array<string>());
    //        }
    //    }
    }
}
```



<strike>
## Current Usage

This project uses the `commander` NPM package to manage CLI options and subcommands. The following is a list of current commands. All of them exist, although some may be stubs while development continues.

`bun app.ts scan --source [source_code_path]`

> This command is meant for pure static analysis. It checks the supplied source against a set of rules (currently configured in JSON, authored in TypeScript.)

`bun app.ts dump --source [source_code_path]`

> Dump the whole tree to STDIO. This is more for debugging, but can aid in getting an overview of a body of source code.

`bun app.ts metrics --source [source_code_path]`

> Parse the given source and structure it in a way that makes it easy to extract metrics for later analysis. For example, if you wanted to get all elements within your source code, filter out just the variables, and see what percentage of those identifiers violated the rules defined, this would be your go-to command.
</strike>