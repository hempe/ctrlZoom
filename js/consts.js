class Messages {
    static zoom_in = 'contentzoomin';
    static zoom_out = 'contentzoomout';
}

class ConfigKey {
    static stepSize = 'stepSize';
    static minimumScroll = 'minimumScroll';
    static directionReversed = 'directionReversed';
    static disable = 'disable';

    static getBool(items, key) {
        try {
            return !!JSON.parse(items[key]+"");
        }
        catch {
            return false;
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
    stepSize = 10;
    minimumScroll  = 20;
}