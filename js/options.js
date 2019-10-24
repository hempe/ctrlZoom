(function () {

    const ctrlZoom = new CtrlZoom();
    let values = ctrlZoom.defaults;
    let binded = false;

    window.addEventListener('load', () => readOptions());

    function readOptions() {
        chrome.storage.sync.get(
            ctrlZoom.keys,
            (items) => {
                ctrlZoom.keys.forEach(key => setValue(key, ctrlZoom.getValue(items, key, values[key])));
                if (binded)
                    return;
                binded = true;
                ctrlZoom.keys.forEach(key => bindValue(key));
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
        let e = document.getElementById("ifNot-useBrowserZoom");
        e.style.display = values.useBrowserZoom
            ? "none"
            : "block";
    }

    function bindValue(id) {
        const e = document.getElementById(id);
        e.type == 'checkbox'
            ? e.onchange = (ev) => updateValue(id, ev.target.checked)
            : e.onchange = (ev) => updateValue(id, ev.target.value);
    }

    function setValue(id, value) {
        values[id] = value;
        const e = document.getElementById(id);
        e.type == 'checkbox'
            ? e.checked = values[id]
            : e.value = values[id];
    }
})();