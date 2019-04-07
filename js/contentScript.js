var minimumScroll = 20;
var directionReversed = false;

window.addEventListener("wheel", ctrlZoom, {passive: false});

chrome.storage.sync.get(['minimumScroll','directionReversed'], (x) => {
    const value = parseInt(x['minimumScroll']);
    if(value > 1)
        minimumScroll = value;
    directionReversed = !!x['directionReversed'];
});

function ctrlZoom(e) {
    if(!e.ctrlKey)
        return;
    if(Math.abs(e.wheelDelta) > minimumScroll) {
        if (e.wheelDelta > 0) {
            chrome.runtime.sendMessage({ name: directionReversed ? "contentzoomin": "contentzoomout" });
        } else {
            chrome.runtime.sendMessage({ name: directionReversed ? "contentzoomout" : "contentzoomin" });
        }
    }
    e.preventDefault();
}