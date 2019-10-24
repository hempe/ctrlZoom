(function () {

    const ctrlZoom = new CtrlZoom();
    const _tabs = chrome.tabs;
    let currentRatio = 1;

    chrome.runtime.onMessage.addListener(onMessage);

    function onMessage(message, _callback) {
        switch (message.type) {
            case '%':
                setZoom((zoomFactor) => ctrlZoom.nextRatio(zoomFactor, message.direction, message.stepSize));
                break;
            case '|':
                setZoom((_, settings) => message.ratio * settings.defaultZoomFactor);
                break;
            case '+':
                setZoom((zoomFactor) => ctrlZoom.nextIncrease(zoomFactor));
                break;
            case '-':
                setZoom((zoomFactor) => ctrlZoom.nextDecrease(zoomFactor));
                break;
        }
    }

    function zoomtab(tab, ratio, minDelay) {
        if (currentRatio == ratio || (minDelay && !ctrlZoom.allowNext(minDelay)))
            return;
        _tabs.setZoom(tab, ratio);
        currentRatio = ratio;
    }

    function setZoom(callback) {
        _tabs.query({ active: true, currentWindow: true }, (tabs) => {
            _tabs.getZoomSettings(tabs[0].id, (settings) => {
                _tabs.getZoom(tabs[0].id, (zoomFactor) => {
                    const ratio = callback(zoomFactor, settings);
                    if (ratio == currentRatio)
                        return;
                    zoomtab(tabs[0].id, ratio);
                });
            });
        });
    }
})();
