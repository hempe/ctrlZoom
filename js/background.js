const minRatio = 0.25;
const maxRatio = 5;

var stepSize = Defaults.stepSize;

var currentRatio = 0;
var blocked = false;

setConfiguration();
chrome.storage.onChanged.addListener(setConfiguration);

function setConfiguration() {
    chrome.storage.sync.get([ConfigKey.stepSize], (items) => {
        stepSize = ConfigKey.getPositiveInt(items, Configuration.stepSize, stepSize);
    });
}

function nextRatio(ratio, direction) {
    ratio = Math.round(ratio * 100);
    var next = (ratio - (direction * stepSize)) / 100;
    var ratio = next > maxRatio ? maxRatio : next < minRatio ? minRatio : next;
    return ratio;
}

function allowNext() {
    if (blocked)
        return false;
    blocked = true;
    setTimeout(() => {
        blocked = false;
    }, 100);
    return blocked;
}

function zoom(direction) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.getZoom(tabs[0].id, function (zoomFactor) {
            const ratio = nextRatio(zoomFactor, direction);
            if (ratio == currentRatio)
                return;

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { zoomtab(tabs[0].id, ratio); });
        });
    });
}

function zoomtab(tab, ratio) {
    if (currentRatio == ratio || !allowNext())
        return;

    chrome.tabs.setZoom(tab, ratio);
    currentRatio = ratio;
}

chrome.runtime.onMessage.addListener(function (message, _callback) {
    if (message.name == Messages.zoom_out) {
        zoom(+1);
    } else if (message.name == Messages.zoom_in) {
        zoom(-1);
    } else {
        console.warn("Unkown message", message);
    }
});