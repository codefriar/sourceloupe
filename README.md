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