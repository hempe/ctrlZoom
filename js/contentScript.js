var values = defaults;


setConfiguration();
chrome.storage.onChanged.addListener(setConfiguration);

window.addEventListener("wheel", ctrlZoom, { passive: false });
window.addEventListener("keydown", keyPressed);

function ctrlZoom(e) {
    if (values.disable || !e.ctrlKey)
        return;

    e.preventDefault();

    if (Math.abs(e.wheelDelta) <= values.minimumScroll)
        return;

    sendZoom({
        direction: getDirection(e.wheelDelta > 0),
        stepSize: values.stepSize,
        minDelay: values.minDelay,
        type: "%"
    });
}

function getDirection(zoomIn) {
    return (zoomIn ? 1 : -1) * (values.directionReversed ? -1 : 1);
}

function setConfiguration() {
    chrome.storage.sync.get(
        configKey,
        (items) => {
        for(var key of configKey) {
            values[key] = ConfigKey.getValue(items, key, defaults[key]);
        }

        if (!values.useBrowserZoom) {
            document.body.style.zoom = getStoredZoom();
        }

    });
}

function sendZoom(message) {
    values.useBrowserZoom
        ? chrome.runtime.sendMessage(message)
        : zoom(message);
}

function zoom(message) {
    if(message.type == '%'){
        setTimeout(() => {
            if (allowNext(message.minDelay)) {
                const zoomFactor = getZoom();
                const ratio = nextRatio(zoomFactor, message.direction, message.stepSize);
                setZoom(ratio);
            }
        }, 0);
    }

    if(message.type == '|') {
        setZoom(message.ratio);
    }

    if(message.type == "+"){
        setZoom(nextIncrease(getZoom()));
    }

    if(message.type == "-"){
        setZoom(nextDecrease(getZoom()));
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
        var stored = parseFloat(localStorage.getItem(`${hashCode(window.location.hostname)}:ext:zoom`));
        if (isNaN(stored)) {
            return getZoom();
        }
        return stored;
    } catch {
        return getZoom();
    }
}

function getZoom() {
    try {
        var val = parseFloat(document.body.style.zoom);
        if (isNaN(val) || val == 0)
            return 1;
        return val;
    } catch{
        return 1;
    }
}

function setZoom(ratio) {
    addPopup(ratio);
    document.body.style.zoom = ratio;
    if (!values.rememberZoom) {
        localStorage.removeItem(`${hashCode(window.location.hostname)}:ext:zoom`);
        return;
    }

    if(ratio == 1) {
        localStorage.removeItem(`${hashCode(window.location.hostname)}:ext:zoom`);
    } else {
        localStorage.setItem(`${hashCode(window.location.hostname)}:ext:zoom`, ratio);
    }
}
function reset() {
    const message = { type: '|', ratio: 1};
    chrome.runtime.sendMessage(message);
    zoom(message);
}

var popupTimeout;
function addPopup(ratio){
    if(values.useBrowserZoom)
        return;
        
    const id = hashCode(window.location.hostname);
    let div = document.getElementById(id);
    const exits = !!div;
    if(!exits) {
        div = document.createElement("div");
    }

    div.style.fontSize = `${12/ratio}px`;
    div.style.borderColor = "#c1c1c1";
    div.style.borderWidth = `${0.5/ratio}px`;
    div.style.borderStyle = "solid";
    div.style.borderRadius = `${2/ratio}px`;
    div.style.background = "#f7f7f7";
    div.style.padding = `${10/ratio}px`;
    div.style.boxShadow = `0px ${2/ratio}px ${3/ratio}px -${2/ratio}px rgba(0,0,0,0.5)`
    div.style.color = "#636363";
    div.style.position = "fixed";
    div.style.top = `${10/ratio}px`;;
    div.style.right = `${10/ratio}px`;;
    div.style.zIndex = 100000;
    div.style.display = "flex";
    div.style.userSelect = "none";

    div.innerHTML = `
    <div style="margin-top:${2/ratio}px; width:${35/ratio}px;text-align:right;">${Math.round(ratio * 100)}%</div>
    <div style="display:flex; cursor:pointer;">
        <div id="${id}_plus" style="font-size:120%; padding:0 ${5/ratio}px 0 ${10/ratio}px; font-weight:bold;">+</div>
        <div id="${id}_minus" style="font-size:120%; padding:0 ${10/ratio}px 0 ${5/ratio}px; font-weight:bold;">−</div>
        <div id="${id}_reset" style="border: solid ${0.5/ratio}px #c1c1c1;border-radius:${2/ratio}px;padding:${2/ratio}px ${10/ratio}px;">Rest</div>
    </div>`;
    div.id = id

    if(!exits) {
        document.body.appendChild(div);
    }

    document.getElementById(`${id}_plus`).onclick = () => setZoom(nextIncrease(getZoom()));
    document.getElementById(`${id}_minus`).onclick = () => setZoom(nextDecrease(getZoom()));
    document.getElementById(`${id}_reset`).onclick = () => reset();

    clearTimeout(popupTimeout);
    popupTimeout = setTimeout(()=>{
        var element = document.getElementById(id);
        element.parentNode.removeChild(element);
    }, 2000);
}

function hashCode(source) {
    var hash = 0, i, chr;
    if (source.length === 0) return hash;
    for (i = 0; i < source.length; i++) {
        chr = source.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};