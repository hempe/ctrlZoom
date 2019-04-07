class Messages {
    static zoom_in = 'contentzoomin';
    static zoom_out = 'contentzoomout';
    static zoom = 'contentzoom';
}

class ConfigKey {
    static stepSize = 'stepSize';
    static minimumScroll = 'minimumScroll';
    static directionReversed = 'directionReversed';
    static disable = 'disable';
    static useBrowserZoom = 'useBrowserZoom';
    static rememberZoom = 'rememberZoom';
    static minDelay = 'minDelay';

    static getBool(items, key, defaultValue) {
        try {
            return !!JSON.parse(items[key]+"");
        }
        catch {
            return defaultValue;
        }
    }

    static getPositiveInt(items, key, defaultValue) {
        try {
            const int = parseInt(items[key]+"");
            return isNaN(int) ? defaultValue : int > 0 ? int : defaultValue;
        }
        catch {
            return defaultValue;
        }
    }

}

class Defaults {
    static stepSize = 10;
    static minimumScroll  = 20;
    static useBrowserZoom = true;
    static minDelay = 100;
    static rememberZoom = false;
}

const minRatio = 0.25;
const maxRatio = 5;
var blocked = false;

function nextRatio(ratio, direction, stepSize) {
    ratio = Math.round(ratio * 100);
    var next = (ratio - (direction * stepSize)) / 100;
    var ratio = next > maxRatio ? maxRatio : next < minRatio ? minRatio : next;
    return ratio;
}

function allowNext(delay) {
    if(!delay)
        delay = Defaults.minDelay;
    if (blocked)
        return false;
    blocked = true;
    setTimeout(() => {
        blocked = false;
    }, delay);
    return blocked;
}