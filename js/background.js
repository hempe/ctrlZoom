var currentRatio = 1;

chrome.runtime.onMessage.addListener(onMessage);

function zoomtab(tab, ratio, minDelay) {
    if (currentRatio == ratio || (minDelay && !allowNext(minDelay)))
        return;

    chrome.tabs.setZoom(tab, ratio);
    currentRatio = ratio;
}

function setZoom(callback){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.getZoomSettings(tabs[0].id, (settings) => {
            chrome.tabs.getZoom(tabs[0].id, (zoomFactor) => {
                debugger;
                const ratio = callback(zoomFactor, settings);
                if (ratio == currentRatio)
                    return;
                zoomtab(tabs[0].id, ratio);
            });
        });
    });
}


function onMessage(message, _callback) {
    if (message.type == '%') {
        setZoom((zoomFactor) => nextRatio(zoomFactor, message.direction, message.stepSize));
    }

    if (message.type == '|') {
        setZoom((_,settings) => message.ratio * settings.defaultZoomFactor);
    }

    if(message.type == "+") {
        setZoom((zoomFactor) => nextIncrease(zoomFactor));
    }

    if(message.type == "-") {
        setZoom((zoomFactor) => nextDecrease(zoomFactor));
    }
}

