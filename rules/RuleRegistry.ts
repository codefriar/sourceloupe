export const RULE_REGISTRY = {
    "rules":
    [
        {
            "name":"Variables",
            "queries":[{
                    "name":"Total",
                    "query":'(variable_declarator (identifier) @exp)',
                    "function":null
                },
                {
                    "name":"Length < 3",
                    "query":'(variable_declarator (identifier) @exp)',
                    "function":function(node){return node.text.length > 3;}
                }

            ]
        }
    ]
}

