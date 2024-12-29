import NameLengthRule from "../implementation/NameLengthRule";

export const RULE_REGISTRY = {
    "rules":[{
        "name":"Variable name length",
        "reportedAs":"variable",
        "message":"Variables must be at least three characters long",
        "description":"Concise and clear",
        "instance":new NameLengthRule(),
        "rootNode":"variable_declarator",
        "describingNode":"identifier",
        "arguments":{"minimumLength":3}
    },{
        "name":"Argument name length",
        "reportedAs":"method",
        "message":"Argument names must be at least three characters long",
        "description":"Concise and clear",
        "instance":new NameLengthRule(),
        "rootNode":"formal_parameter",
        "describingNode":"identifier",
        "arguments":{"minimumLength":3}
    }]
}