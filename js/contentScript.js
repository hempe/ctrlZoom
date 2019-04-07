var minimumScroll = Defaults.minimumScroll;
var directionReversed = false;
var disable = false;
var stepSize = Defaults.stepSize;
var useBrowserZoom = Defaults.useBrowserZoom;
var minDelay = Defaults.minDelay;
var rememberZoom = Defaults.rememberZoom;

setConfiguration();
chrome.storage.onChanged.addListener(setConfiguration);

window.addEventListener("wheel", ctrlZoom, { passive: false });
window.addEventListener("keydown", keyPressed);

function ctrlZoom(e) {
    if (disable || !e.ctrlKey)
        return;
    e.preventDefault();
    if (Math.abs(e.wheelDelta) <= minimumScroll)
        return;

    const message = {
        direction: getDirection(e.wheelDelta > 0),
        stepSize: stepSize,
        minDelay: minDelay
    };

    if (e.wheelDelta > 0) {
        useBrowserZoom
            ? chrome.runtime.sendMessage(message)
            : zoom(message)
    } else {
        useBrowserZoom
            ? chrome.runtime.sendMessage(message)
            : zoom(message);
    }
}

function getDirection(zoomIn) {
    return (zoomIn ? 1 : -1) * (directionReversed ? -1 : 1);
}

function setConfiguration() {
    chrome.storage.sync.get(
        [
            ConfigKey.minimumScroll,
            ConfigKey.stepSize,
            ConfigKey.directionReversed,
            ConfigKey.disable,
            ConfigKey.useBrowserZoom,
            ConfigKey.minDelay,
            ConfigKey.rememberZoom,
        ], (items) => {
            minimumScroll = ConfigKey.getPositiveInt(items, ConfigKey.minimumScroll, minimumScroll);
            stepSize = ConfigKey.getPositiveInt(items, ConfigKey.stepSize, stepSize);
            directionReversed = ConfigKey.getBool(items, ConfigKey.directionReversed, directionReversed);
            disable = ConfigKey.getBool(items, ConfigKey.disable, disable);
            useBrowserZoom = ConfigKey.getBool(items, ConfigKey.useBrowserZoom, useBrowserZoom);
            minDelay = ConfigKey.getPositiveInt(items, ConfigKey.minDelay, Defaults.minDelay);
            rememberZoom = ConfigKey.getBool(items, ConfigKey.rememberZoom, Defaults.rememberZoom);
            if (!useBrowserZoom) {
                document.body.style.zoom = getStoredZoom();
            }
        });
}

function zoom(message) {
    setTimeout(() => {
        if (allowNext(message.minDelay)) {
            const zoomFactor = getZoom();
            const ratio = nextRatio(zoomFactor, message.direction, message.stepSize);
            setZoom(ratio);
        }
    }, 0);
}

function keyPressed(event) {
    if (event.ctrlKey && event.code == "Digit0" && !useBrowserZoom) {
        setZoom(1);
        localStorage.removeItem(`${window.location.hostname}:ext:zoom`);
    }
}

function getStoredZoom() {
    if(!rememberZoom)
        return getZoom();

    try {
        var stored = parseFloat(localStorage.getItem(`${window.location.hostname}:ext:zoom`));
        if (isNaN(stored) || stored > 1)
            return getZoom();
        return stored;
    } catch {
        return getZoom();
    }
}

function getZoom() {
    try {
        var val = parseFloat(document.body.style.zoom);
        if (isNaN(val) || val == 0)
            return 1;
        return val;
    } catch{
        return 1;
    }
}

function setZoom(ratio) {
    document.body.style.zoom = ratio;

    if(!rememberZoom) {
        localStorage.removeItem(`${window.location.hostname}:ext:zoom`);
        return;
    }

    localStorage.setItem(`${window.location.hostname}:ext:zoom`, ratio)
}
