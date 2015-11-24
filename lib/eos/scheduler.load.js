/**
 * returns a function that creates a Scheduler and load the defined actions, then starts!
 */
var Scheduler     = require('./scheduler');

/**
 *
 * @param {Array<String>} actions
 * @returns {function}
 */
module.exports = function (actions) {

    return function (api){
        var s = new Scheduler({api : api, frameRate : 60});

        if(actions){
            actions.forEach(function (action) {
                s.add(action);
            })
        }
        s.start();
        return s;
    }

};
