(async function () {

    const { CtrlZoom } = await import(chrome.runtime.getURL('js/ctrlZoom.js'));
    const { Popup } = await import(chrome.runtime.getURL('js/popup.js'));

    const zoom = new CtrlZoom();
    const popUp = new Popup(zoom);
    const values = zoom.defaults;
    const onZoom = {
        '%': (m) => setZoom(zoom.nextRatio(getZoom(), m.direction, m.stepSize)),
        '|': (m) => setZoom(m.ratio),
        "+": (_) => setZoom(zoom.nextIncrease(getZoom())),
        "-": (_) => setZoom(zoom.nextDecrease(getZoom())),
    };

    const handleZoom = (m) => onZoom[m.type](m);

    setConfiguration();
    chrome.storage.onChanged.addListener(setConfiguration);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", keyPressed);

    function onWheel(e) {
        zoom.handle(e, !(values.disable || !e.ctrlKey), () => {
            if (Math.abs(e.wheelDelta) <= values.minimumScroll)
                return;
            sendZoom({
                direction: (e.wheelDelta > 0 ? 1 : -1) * (values.directionReversed ? -1 : 1),
                stepSize: values.stepSize,
                type: "%"
            });
        })
    }

    function setConfiguration() {
        chrome.storage.sync.get(zoom.keys, (items) => {
            zoom.keys.forEach(key => values[key] = zoom.getValue(items, key, values[key]));
            if (!values.useBrowserZoom)
                document.body.style.zoom = getStoredZoom();
        });
    }

    function sendZoom(message) {
        values.useBrowserZoom
            ? chrome.runtime.sendMessage({ msgKind: zoom.msgKind, ...message })
            : handleZoom(message);
    }

    function keyPressed(e) {
        zoom.handle(e, e.ctrlKey && e.code == "Digit0", () => reset());
        if (values.interceptPlusMinus) {
            zoom.handle(e, e.ctrlKey && e.key == "+", () => sendZoom({ type: '+' }));
            zoom.handle(e, e.ctrlKey && e.key == "-", () => sendZoom({ type: '-' }));
        }
    }

    function getStoredZoom() {
        if (!values.rememberZoom)
            return getZoom();
        try {
            const stored = parseFloat(localStorage.getItem(`${zoom.getId()}:ext:zoom`));
            return isNaN(stored) ? getZoom() : stored;
        } catch {
            return getZoom();
        }
    }

    function getZoom() {
        try {
            const val = parseFloat(document.body.style.zoom);
            return (isNaN(val) || val == 0) ? 1 : val;
        } catch {
            return 1;
        }
    }


    function setZoom(ratio) {
        setTimeout(() => {
            if (zoom.allowNext(values.minDelay)) {
                if (!values.useBrowserZoom && values.showPopup)
                    popUp.showPopup(ratio, (r) => getZoom(r), (r) => setZoom(r), () => reset(), values.showPopupTime);

                document.body.style.zoom = ratio;
                if (!values.rememberZoom)
                    return localStorage.removeItem(`${zoom.getId()}:ext:zoom`);

                (ratio == 1)
                    ? localStorage.removeItem(`${zoom.getId()}:ext:zoom`)
                    : localStorage.setItem(`${zoom.getId()}:ext:zoom`, ratio);
            }
        }, 0);
    }

    function reset() {
        const message = { type: '|', ratio: 1, msgKind: zoom.msgKind };
        chrome.runtime.sendMessage(message);
        handleZoom(message);
    }
})();