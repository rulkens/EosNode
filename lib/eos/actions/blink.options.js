/**
 * description of the blink action
 */

module.exports = {
    "id"         : "blink",
    "name"       : "Blink (simple)",
    "parameters" : {
        "interval"    : {
            "type"  : "integer",
            "min"   : 200,
            "max"   : 10000,
            "value" : 2000
        }
    }
};