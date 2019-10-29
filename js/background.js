(function () {

    const zoom = new CtrlZoom();
    const _tabs = chrome.tabs;
    const onZoom =
    {
        '%': (tabId, m) => setZoom(tabId, (zoomFactor, _) => zoom.nextRatio(zoomFactor, m.direction, m.stepSize)),
        '|': (tabId, m) => setZoom(tabId, (_, settings) => m.ratio * settings.defaultZoomFactor),
        '+': (tabId, m) => setZoom(tabId, (zoomFactor, _) => zoom.nextIncrease(zoomFactor)),
        '-': (tabId, m) => setZoom(tabId, (zoomFactor, _) => zoom.nextDecrease(zoomFactor))
    };

    let currentRatio = 1;
    chrome.runtime.onMessage.addListener(onMessage);
    function onMessage(message, sender, _) {
        if (message.msgKind != zoom.msgKind)
            return;

        onZoom[message.type](sender.tab.id, message);
    }

    function setZoom(tabId, callback) {
        _tabs.getZoomSettings(tabId, (settings) => {
            _tabs.getZoom(tabId, (zoomFactor) => {
                const ratio = callback(zoomFactor, settings);
                if (ratio == currentRatio)
                    return;
                _tabs.setZoom(tabId, ratio);
                currentRatio = ratio;
            });
        });
    }
})();
