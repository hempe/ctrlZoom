(function () {

    const zoom = new CtrlZoom();
    let values = zoom.defaults;
    let binded = false;

    window.addEventListener('load', () => readOptions());
    function readOptions() {
        chrome.storage.sync.get(
            zoom.keys,
            (items) => {
                zoom.keys.forEach(key => setValue(key, zoom.getValue(items, key, values[key])));
                if (binded)
                    return;
                binded = true;
                zoom.keys.forEach(key => bindValue(key));
                update();
            });
    }

    function updateValue(property, value) {
        const setting = {};
        setting[property] = value + '';
        values[property] = value;
        update();
        chrome.storage.sync.set(setting, () => readOptions());
    }

    function update() {
        zoom.element("ifNot-useBrowserZoom", e => e.style.display = values.useBrowserZoom ? "none" : "block");
        zoom.element("if-showPopup", e => e.style.display = values.showPopup ? "block" : "none");
        zoom.element("ifNot-disabled", e => e.style.display = values.disable ? "none" : "block");
    }

    function bindValue(id) {
        zoom.element(id, e => e.type == 'checkbox'
            ? e.onchange = (ev) => updateValue(id, ev.target.checked)
            : e.onchange = (ev) => updateValue(id, ev.target.value));
    }

    function setValue(id, value) {
        values[id] = value;
        zoom.element(id, e => e.type == 'checkbox'
            ? e.checked = values[id]
            : e.value = values[id]);
    }
})();