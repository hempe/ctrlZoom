window.addEventListener('load', function () {
    readOptions();
});

var values = defaults;
var binded = false;

function readOptions() {
    chrome.storage.sync.get(
            configKey,
            (items) => {
        for(var key of configKey) {
            values[key] = ConfigKey.getValue(items, key, defaults[key]);;
            setValue(key);
        }
        bindUi();
    });
}

function updateValue(property, value) {
    const setting = {};
    setting[property] = value + "";
    chrome.storage.sync.set(setting, () => {
        readOptions();
    });
}

function bindValue(id) {
    const ele = document.getElementById(id);
    if (ele.type == "checkbox") {
        ele.onchange = (ev) => updateValue(id, ev.target.checked);
    } else {
        ele.onchange = (ev) => updateValue(id, ev.target.value);
    }
}

function setValue(id) {
    const ele = document.getElementById(id);
    if (ele.type == "checkbox") {
        ele.checked = values[id];
    } else {
        ele.value = values[id];
    }
}

function bindUi() {
    if (binded)
        return;

    binded = true;
    for(var key of configKey) {
        bindValue(key);
    }
}