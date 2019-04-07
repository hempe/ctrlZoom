
var stepSize = 10;
const minRatio = 0.25;
const maxRatio = 5;
var currentRatio = 0;
var blocked = false;

chrome.storage.sync.get(['stepSize'], (x) => {
    const value = parseInt(x['stepSize']);
    if(value > 1)
        stepSize = value;
});

function nextRatio(ratio, direction) {
    ratio = Math.round((ratio) * 100);
    var next = (parseInt(ratio) - (direction * stepSize)) / 100;
    var ratio = next > maxRatio ? maxRatio : next < minRatio ? minRatio : next;
    return ratio;
}

function allowNext() {
    if(blocked)
        return false;
    blocked = true;
    setTimeout(() => {
        blocked = false;
    }, 100);
    return blocked;
}

function zoom(direction) {
    chrome.tabs.query({ active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.getZoom(tabs[0].id,function(zoomFactor){
            const ratio = nextRatio(zoomFactor, direction);
            if(ratio == currentRatio)
                return;

            chrome.tabs.query({ active: true, currentWindow: true}, function(tabs) {zoomtab(tabs[0].id, ratio);});
        });
    });
}

function zoomtab(tab, ratio) {
    if(currentRatio == ratio || !allowNext())
        return;

    chrome.tabs.setZoom(tab, ratio);
    currentRatio = ratio;
}

chrome.runtime.onMessage.addListener(function(message, _callback) {
    if(message.name == "contentzoomout") {
        zoom(+1);
    } else if (message.name == "contentzoomin" ){
        zoom(-1);
    } else {
        console.warn("Unkown message", message);
    }
});