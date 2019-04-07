window.addEventListener('load', function() {
    readOptions();
});

var minimumScroll = 20;
var stepSize = 10;
var binded = false;
function readOptions() {

    chrome.storage.sync.get(['minimumScroll', 'stepSize'], (items) => {
        if (!!items['minimumScroll'])
            minimumScroll = items['minimumScroll'];

        if (!!items['stepSize'])
            stepSize = items['stepSize'];

        directionReversed = !!items['directionReversed'];

        setUi();
        bindUi();
        console.warn("Setting values");
    });
}

function setValue(property, value) {
    console.warn("save value");
    const setting = {};
    setting[property] = value;
    chrome.storage.sync.set(setting, () => {
        readOptions();
    });
}

function bindUi() {
    if(binded)
        return;

    binded = true;
    document.getElementById("stepSize").onchange = (ev)=> setValue("stepSize", ev.target.value);
    document.getElementById("minimumScroll").onchange = (ev)=> setValue("minimumScroll", ev.target.value);
    document.getElementById("directionReversed").onchange = (ev)=> setValue("directionReversed", ev.target.value);
}

function setUi() {
    document.getElementById("stepSize").value = stepSize;
    document.getElementById("minimumScroll").value = minimumScroll;
    document.getElementById("directionReversed").value = directionReversed;
}