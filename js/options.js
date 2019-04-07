window.addEventListener('load', function () {
    readOptions();
});

var minimumScroll = Defaults.minimumScroll;
var stepSize = Defaults.stepSize;
var useBrowserZoom = Defaults.useBrowserZoom;
var minDelay = Defaults.minDelay;
var directionReversed = false;
var rememberZoom = Defaults.rememberZoom;
var disable = false;
var binded = false;

function readOptions() {

    chrome.storage.sync.get(
            [
                ConfigKey.minimumScroll, 
                ConfigKey.stepSize, 
                ConfigKey.directionReversed,
                ConfigKey.disable,
                ConfigKey.useBrowserZoom,
                ConfigKey.minDelay,
                ConfigKey.rememberZoom,
            ],
            (items) => {
        minimumScroll = ConfigKey.getPositiveInt(items, ConfigKey.minimumScroll, Defaults.minimumScroll);
        stepSize = ConfigKey.getPositiveInt(items, ConfigKey.stepSize, Defaults.stepSize);

        directionReversed = ConfigKey.getBool(items, ConfigKey.directionReversed, directionReversed);
        disable = ConfigKey.getBool(items, ConfigKey.disable, disable);
        useBrowserZoom = ConfigKey.getBool(items, ConfigKey.useBrowserZoom, useBrowserZoom);
        minDelay = ConfigKey.getPositiveInt(items, ConfigKey.minDelay, Defaults.minDelay);
        rememberZoom = ConfigKey.getBool(items, ConfigKey.rememberZoom, Defaults.rememberZoom);
        setUi();
        bindUi();
    });
}

function setValue(property, value) {
    const setting = {};
    setting[property] = value + "";
    chrome.storage.sync.set(setting, () => {
        readOptions();
    });
}

function bindUi() {
    if (binded)
        return;

    binded = true;
    document.getElementById("stepSize").onchange = (ev) => setValue(ConfigKey.stepSize, ev.target.value);
    document.getElementById("minimumScroll").onchange = (ev) => setValue(ConfigKey.minimumScroll, ev.target.value);
    document.getElementById("minDelay").onchange = (ev) => setValue(ConfigKey.minDelay, ev.target.value);
    
    document.getElementById("directionReversed").onchange = (ev) => setValue(ConfigKey.directionReversed, ev.target.checked);
    document.getElementById("disable").onchange = (ev) => setValue(ConfigKey.disable, ev.target.checked);
    document.getElementById("useBrowserZoom").onchange = (ev) => setValue(ConfigKey.useBrowserZoom, ev.target.checked);
    document.getElementById("rememberZoom").onchange = (ev) => setValue(ConfigKey.rememberZoom, ev.target.checked);
}

function setUi() {
    document.getElementById("stepSize").value = stepSize;
    document.getElementById("minimumScroll").value = minimumScroll;
    document.getElementById("minDelay").value = minDelay;

    document.getElementById("directionReversed").checked = directionReversed;
    document.getElementById("disable").checked = disable;
    document.getElementById("useBrowserZoom").checked = useBrowserZoom;
    document.getElementById("rememberZoom").checked = rememberZoom;
}