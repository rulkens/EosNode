/**
 * description of the binary clock action
 */

module.exports = {
    "id"         : "blink.color",
    "name"       : "Blink (Color)",
    "parameters" : {
        "interval"    : {
            "type"  : "integer",
            "min"   : 200,
            "max"   : 10000,
            "value" : 2000
        },
        "color"       : {
            "type"  : "color",
            "value" : 0xFF0000
        },
        "cycleColors" : {
            "type"      : "array",
            "maxLength" : 3,
            "item"      : {
                "type" : "color"
            },
            "values"    : [0xFF, 0xFF00, 0xFF0000]
        },
        "mode"        : {
            "type"  : "enum",
            "items" : [
                {
                    "id"   : "cycle",
                    "name" : "Cycle"
                },
                {
                    "id"   : "color",
                    "name" : "Color"
                }
            ]
        }
    }
};