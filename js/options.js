window.addEventListener('load', function() {
    readOptions();
});

var minimumScroll = Defaults.minimumScroll;
var stepSize = Defaults.stepSize;
var binded = false;

function readOptions() {

    chrome.storage.sync.get([ConfigKey.minimumScroll, ConfigKey.stepSize, ConfigKey.directionReversed, ConfigKey.disable], (items) => {
        minimumScroll = ConfigKey.getPositiveInt(items, ConfigKey.minimumScroll, Defaults.minimumScroll);
        stepSize = ConfigKey.getPositiveInt(items, ConfigKey.stepSize, Defaults.stepSize);

        directionReversed = ConfigKey.getBool(items, ConfigKey.directionReversed);
        disable = ConfigKey.getBool(items, ConfigKey.disable);
        
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
    if(binded)
        return;

    binded = true;
    document.getElementById("stepSize").onchange = (ev)=> setValue(ConfigKey.stepSize, ev.target.value);
    document.getElementById("minimumScroll").onchange = (ev)=> setValue(ConfigKey.minimumScroll, ev.target.value);
    document.getElementById("directionReversed").onchange = (ev)=> setValue(ConfigKey.directionReversed, ev.target.checked);
    document.getElementById("disable").onchange = (ev)=> setValue(ConfigKey.disable, ev.target.checked);
}

function setUi() {
    document.getElementById("stepSize").value = stepSize;
    document.getElementById("minimumScroll").value = minimumScroll;
    document.getElementById("directionReversed").checked = directionReversed;
    document.getElementById("disable").checked = disable;
}