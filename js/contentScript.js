var minimumScroll = Defaults.minimumScroll;
var directionReversed = false;
var disable = false;

setConfiguration();
chrome.storage.onChanged.addListener(setConfiguration);
window.addEventListener("wheel", ctrlZoom, { passive: false });

function ctrlZoom(e) {
    if (disable || !e.ctrlKey)
        return;
    e.preventDefault();

    if (Math.abs(e.wheelDelta) <= minimumScroll)
        return;

    if (e.wheelDelta > 0) {
        chrome.runtime.sendMessage({ name: directionReversed ? Messages.zoom_in : Messages.zoom_out });
    } else {
        chrome.runtime.sendMessage({ name: directionReversed ? Messages.zoom_out : Messages.zoom_in });
    }

}

function setConfiguration() {
    chrome.storage.sync.get([ConfigKey.minimumScroll, ConfigKey.directionReversed, ConfigKey.disable], (items) => {
        minimumScroll = ConfigKey.getPositiveInt(items, ConfigKey.minimumScroll, minimumScroll);
        directionReversed = ConfigKey.getBool(items, ConfigKey.directionReversed);
        disable = ConfigKey.getBool(items, ConfigKey.disable);
    });
}