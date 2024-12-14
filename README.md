# sourceloupe


This is a fairly trivial static analysis tool that is built with TypeScript and ts-node (as opposed to OOB Node.js) This started about eight months ago as a Node JavaScript pet project, then went through a few identities (Rust and Go for starters) and two parsing tools (ANTLR4 and tree-sitter.)

This particular set of cobbled together functionality is what remained when the dust settled. *Many stacks enter, only one [stack] remains* as my old Auntie Entity used to say. Sort of. Not really.

![image](https://github.com/user-attachments/assets/1fcd77a0-9803-49e8-9f9c-947dd53a64ef)

<sub>Sorry, the position of private dancer is taken. Move along.</sub>

## Deno? Denope.
"The World Runs On Node" is still the case. I liked Deno, but I think if I don't relish the thought of this thing dying in the graveyard of forgotten repositories I gotta get with the program.

~~## Deno? Deyes!~~
~~Anyways, a collegue of mine mentioned Deno in passing. I hadn't heard of it to be honest. I've had my head buried in the back end for quite a while now, and that particular dungeon didn't have JavaScript or TypeScript on the dance card. I checked it out...popped the hood, kicked the tires, checked the indicators, and by my estimation it seems to have done a pretty good job of creating a powerful alternative to Node. Node's not that bad...but with age comes expectations of backward compatibility and LTS releases (multiple, in-flight LTS releases.) Deno has some elbow room, enough to make some bold choices. OOB TypeScript without a transpiler in the middle. That's enough to get me out of bed most days.~~

## Static Analysis, Parser-Generators, and Me
I've been in the field of software development for about 30 years with my hands on various stacks, and I've always had this weird fascination with parsers and making the machine understand the various arcane dialects we expect it to speak. Wheter that be building string-template like tools for projects I was working on, trying to subvert JSON in my own time, or working with PMD (most recently) it's been a funny little constant.

Which brings me to why this, why Deno, why another repo that will join the ranks of my forgotten Git offspring. It's fun for me, to put it mildly. It's also a way for me to express something that I feel is important, and that is the argument for simplicity. As with most of us who work in agile, the project methodologies we use require us to had more gears than a Mack truck. In these parsers, and in some of the frameworks that sit on top of them, there aren't a lot of solutions that are basically written like that safety card in an airliner. I figured if I could make the engine itself readable and create a configuration approach that had no ambiguouty and was all about common understanding, it would be of use to the development community. For right now that community is Salesforce. Tomorrow, who knows?

## Who is this For?

Right now, anyone. It's free as in beer. No odious licening or ego stroking necessary. I would only ask that attribution be required and held as sacred. If I miss an attribution tell me PLEASE.

So with that it's off to the races. If someone happens to see this, I'm going to post more content when I can. 

Please ask questions because the only one of us that knows it all isn't you or I, it's the community.

## What's on the Near Horizon

This is a work-in-progress that is subject to drastic change. The following is meant as a list of things that are in flux:
1. Rule definitions started as pure TypeScript, but other approaches are being considered. See the ./rules directory for more information. This is also a question of code vs. configuration (and can code BE configuration.) Considered and tested options are:
    - Pure TS rules. The author needs to know a little about tree-sitter and how the parser represents the source.
    - TS with heavy JSON configuration. This is the current implementation. Refer to the following:
        - ./rules/configuration/NameLengthRule.json:    JSON configration that lays out metadata about a rule that is significant (how the nodes arew organized, the details of the violation messages, etc.)
        - ./rules/implementation/NameLengthRule.ts:     The implemmentation for the rule looks at the configuration and uses values therein to identify what nodes it should be looking at and how they would trigger a violation.'
2. Rendering results. How should the framework spit out the results of a scan if asked? PDF? Smoke signal?
3. Approaches to LWCs (or more generally, appraches to multifile analysis)
4. Dependency comprehension and analysis is considered but not implemented. This would be a useful feature.
5. Currently, the source being tested should be considered a best-case-scenario
@implementation The way tree-sitter looks at leaves is largely generic and abstracted in contrast to the way .g4 grammars see things
ANTLR4, although it uses an AST, sees things as strongly-differentiated elements. Tree-sitter sees many things as identifiers.

Identifiers that have a parent of variable_declarators or formal_parameters are variables
Identifiers that have a method_declaration as the parent are methods
Binary expressions are true/false tests such as a < 100
if_statement is self-explanatory
parenthesized_expression is the magic that happens after a statement
block is the code after an expression that is usally boxed in by braces

NOTE: If something isn't playing nicely or a strange node appears, it is more than likely that the given relationship it has within its immediate branch isn't understood.




Documentation in the following order (or not):
Summary of the various classes and what they do
* Configuration file formal
* CLI operation
* More stuff