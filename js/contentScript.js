(function () {

    const ctrlZoom = new CtrlZoom();
    const popUp = new Popup(ctrlZoom);
    const values = ctrlZoom.defaults;

    setConfiguration();
    chrome.storage.onChanged.addListener(setConfiguration);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", keyPressed);

    function getId() {
        return hashCode(window.location.hostname);
    }

    function onWheel(e) {
        if (values.disable || !e.ctrlKey)
            return;

        e.preventDefault();

        if (Math.abs(e.wheelDelta) <= values.minimumScroll)
            return;

        sendZoom({
            direction: (e.wheelDelta > 0 ? 1 : -1) * (values.directionReversed ? -1 : 1),
            stepSize: values.stepSize,
            type: "%"
        });
    }

    function setConfiguration() {
        chrome.storage.sync.get(
            ctrlZoom.keys,
            (items) => {
                ctrlZoom.keys.forEach(key => values[key] = ctrlZoom.getValue(items, key, values[key]));
                if (!values.useBrowserZoom)
                    document.body.style.zoom = getStoredZoom();
            }
        );
    }

    function sendZoom(message) {
        values.useBrowserZoom
            ? chrome.runtime.sendMessage(message)
            : zoom(message);
    }

    function zoom(message) {
        switch (message.type) {
            case '%':
                setZoom(ctrlZoom.nextRatio(getZoom(), message.direction, message.stepSize));
                break;
            case '|':
                setZoom(message.ratio);
                break;
            case "+":
                setZoom(ctrlZoom.nextIncrease(getZoom()));
                break;
            case "-":
                setZoom(ctrlZoom.nextDecrease(getZoom()));
                break;
        }
    }

    function keyPressed(event) {
        if (event.ctrlKey && event.code == "Digit0") {
            reset();
            event.preventDefault();
        }

        if (values.interceptPlusMinus) {
            if (event.ctrlKey && event.key == "+") {
                sendZoom({ type: '+' });
                event.preventDefault();
            }
            if (event.ctrlKey && event.key == "-") {
                sendZoom({ type: '-' });
                event.preventDefault();
            }
        }
    }

    function getStoredZoom() {
        if (!values.rememberZoom)
            return getZoom();
        try {
            var stored = parseFloat(localStorage.getItem(`${getId()}:ext:zoom`));
            return isNaN(stored)
                ? getZoom()
                : stored;
        } catch {
            return getZoom();
        }
    }

    function getZoom() {
        try {
            var val = parseFloat(document.body.style.zoom);
            return (isNaN(val) || val == 0) ? 1 : val;
        } catch {
            return 1;
        }
    }

    function setZoom(ratio) {
        setTimeout(() => {
            if (ctrlZoom.allowNext(values.minDelay)) {
                addPopup(ratio);
                document.body.style.zoom = ratio;
                if (!values.rememberZoom)
                    return localStorage.removeItem(`${getId()}:ext:zoom`);

                (ratio == 1)
                    ? localStorage.removeItem(`${getId()}:ext:zoom`)
                    : localStorage.setItem(`${getId()}:ext:zoom`, ratio);
            }
        }, 0);
    }

    function reset() {
        const message = { type: '|', ratio: 1 };
        chrome.runtime.sendMessage(message);
        zoom(message);
    }

    function addPopup(ratio) {
        if (values.useBrowserZoom || !values.showPopup)
            return;
        popUp.showPopup(ratio, getId(), getZoom, setZoom, reset);
    }

    function hashCode(source) {
        let hash = 0, i, chr;
        if (source.length === 0) return hash;
        for (i = 0; i < source.length; i++) {
            chr = source.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    };
})();