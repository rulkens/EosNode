/**
 * Created by rulkens on 30/04/15.
 */

module.exports = {
    msSinceMidnight   : msSinceMidnight,
    secSinceMidnight  : secSinceMidnight,
    hms_sinceMidnight : hms_sinceMidnight
};

function msSinceMidnight () {
    var now  = new Date(),
        then = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0, 0, 0),
        diff = now.getTime() - then.getTime(); // difference in milliseconds
    return diff;
}

function secSinceMidnight () {
    return Math.floor(msSinceMidnight() / 1000);
}
function hms_sinceMidnight (smooth) {
    var now = new Date(),
        ms  = msSinceMidnight();
    percent = ms / 86400000.0;
    if (smooth) {
        return [
            percent,
            (percent * 24) % 1,
            (percent * 24 * 60) % 1];
    } else {
        return [
            now.getHours() / 24.0,
            now.getMinutes() / 60.0,
            now.getSeconds() / 60.0];
    }
}