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

Currently, the rules are getting a bit of an overhaul. A better understanding of the tree-sitter query dialect helps. The current direction leverages those queries with optional anonymous functions that can operate at the node level. This provides some flexibility for more complicated/involved use cases.

The direction is also moving towards a "rule registry." This registry is a seperate file with a dictionary containing all the rules and how they operate. Currently there are two registries: one for scan rules and one for measurements. This will change after nailing down a proper report format.

## Current Usage
```
Usage: SourceLoupe [options] [command]

Static analysis with TypeScript and tree-sitter

Options:
  -V, --version         output the version number
  -r,--recurse          Recursively walk path.
  -h, --help            display help for command

Commands:
  scan <sourcePath>     Scan Apex files in the given source path (recursively.) Apply all rules in order to flag
                        violations.
  dump <sourcePath>     Dump the raw syntax tree. Primarily for debugging.
  measure <sourcePath>  Get raw data about source code for analysis.
  help [command]        display help for command
```
 