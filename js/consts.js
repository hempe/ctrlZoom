class Messages {
    static zoom_in = 'contentzoomin';
    static zoom_out = 'contentzoomout';
    static zoom = 'contentzoom';
}
const configKey = [
    'stepSize',
    'minimumScroll',
    'directionReversed',
    'disable',
    'useBrowserZoom',
    'rememberZoom',
    'minDelay',
    'interceptPlusMinus',
]

const defaults = {
    'stepSize': 10,
    'minimumScroll': 20,
    'directionReversed': 'false',
    'disable': 'false',
    'useBrowserZoom': 'true',
    'rememberZoom': 'false',
    'minDelay': 100,
    'interceptPlusMinus': 'false',
}

const zoomStepsIn =  [
    500,
    400,
    300,
    250,
    200,
    175,
    150,
    125,
    110,
    100,
    90,
    80,
    75,
    67,
    50,
    33,
    25
];
const zoomStepsOut = zoomStepsIn.map(x => x).reverse();
const sigma = 0.01;

class ConfigKey {
    static getValue(items, key, defaultValue) {
        if(items[key] == undefined)
            return defaultValue;
        
        try {
            if(typeof defaultValue == 'boolean' || defaultValue === 'true' || defaultValue === 'false')
                return this.getBool(items, key, defaultValue);

            const int = parseInt(items[key]+"");
            if(!isNaN(defaultValue))
                return isNaN(int) ? defaultValue : int > 0 ? int : defaultValue;

            return ConfigKey.getBool(items, key, defaultValue);
        }
        catch {
            return ConfigKey.getBool(items, key, defaultValue);
        }
    }
    
    static getBool(items, key, defaultValue) {
        try {
            return items[key] == "true";
        }
        catch {
            return defaultValue == "true";
        }
    }
}

const minRatio = 0.25;
const maxRatio = 5;
var blocked = false;

function nextRatio(ratio, direction, stepSize) {
    ratio = Math.round(ratio * 100);
    var next = (ratio - (direction * stepSize)) / 100;
    var ratio = next > maxRatio ? maxRatio : next < minRatio ? minRatio : next;
    return isNaN(ratio) ? 1 : ratio;
}

function nextIncrease(currentRatio){
    const current = currentRatio * 100;
    const next = nextValue(zoomStepsIn, x => x > (current + sigma))
    console.info("nextIncrease", current, next, zoomStepsIn);
    return next;
}

function nextDecrease(currentRatio) {
    const current = currentRatio * 100;
    const next = nextValue(zoomStepsOut, x => x < (current - sigma));
    console.info("nextDecrease", current, next, zoomStepsOut)
    return next;
}

function nextValue(steps, callbackFn) {
    const filterd = steps.filter(callbackFn);
    if(filterd.length > 0) {
        return filterd[filterd.length-1]/100.0;
    } else {
        return steps[0]/100.0;
    }
}

function allowNext(delay) {
    if(!delay)
        delay = defaults.minDelay;
    if (blocked)
        return false;
    blocked = true;
    setTimeout(() => {
        blocked = false;
    }, delay);
    return blocked;
}