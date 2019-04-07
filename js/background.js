var currentRatio = 1;

chrome.runtime.onMessage.addListener(onMessage);

function zoom(direction, stepSize, minDelay) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.getZoom(tabs[0].id, function (zoomFactor) {
            const ratio = nextRatio(zoomFactor, direction, stepSize);
            if (ratio == currentRatio)
                return;

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { zoomtab(tabs[0].id, ratio, minDelay); });
        });
    });
}

function zoomtab(tab, ratio, minDelay) {
    if (currentRatio == ratio || !allowNext(minDelay))
        return;

    chrome.tabs.setZoom(tab, ratio);
    currentRatio = ratio;
}

function onMessage(message, _callback) {
    zoom(message.direction, message.stepSize, message.minDelay);
}
