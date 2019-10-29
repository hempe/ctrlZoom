class Popup {
    constructor(ctrlZoom) {
        this.zoom = ctrlZoom;
        this._popupTimeout = 0;
    }

    showPopup(ratio, getZoomFn, setZoomFn, resetFn, timeout) {
        if (!timeout)
            return;

        const id = this.zoom.getId();
        let div = document.getElementById(id);
        const exits = !!div;
        if (!exits) {
            div = document.createElement("div");
            div.style.position = "fixed";
            div.style.top = 0;
            div.style.right = 0;
            div.style.zIndex = 1000000;
            div.style.userSelect = "none";
            div.style.fontFamily = "Roboto, sans-serif";
        }

        div.style.display = "flex";
        div.innerHTML = `
<div style="background:#f7f7f7;display:flex;user-select:none;color:#636363;
    font-size:${12 / ratio}px; 
    border:solid ${0.5 / ratio}px #c1c1c1; 
    border-radius:${2 / ratio}px; 
    padding:${10 / ratio}px;
    top:${10 / ratio}px;
    right:${10 / ratio}px;
    position: relative;
    box-shadow:0px ${2 / ratio}px ${3 / ratio}px -${2 / ratio}px rgba(0,0,0,0.5)">
    <div style="margin-top:${2 / ratio}px; width:${35 / ratio}px;text-align:right;">${Math.round(ratio * 100)} %</div>
    <div style="display:flex; cursor:pointer;">
        <div id="${id}_plus" style="font-size:120%; padding:0 ${5 / ratio}px 0 ${10 / ratio}px; font-weight:bold;">+</div>
        <div id="${id}_minus" style="font-size:120%; padding:0 ${10 / ratio}px 0 ${5 / ratio}px; font-weight:bold;">−</div>
        <div id="${id}_reset" style="border: solid ${0.5 / ratio}px #c1c1c1;border-radius:${2 / ratio}px;padding:${2 / ratio}px ${10 / ratio}px;">Rest</div>
    </div>
</div>`;

        div.id = id

        if (!exits) {
            document.body.appendChild(div);
        }
        this.zoom.element(`${id}_plus`, e => e.onclick = () => setZoomFn(this.zoom.nextIncrease(getZoomFn())));
        this.zoom.element(`${id}_minus`, e => e.onclick = () => setZoomFn(this.zoom.nextDecrease(getZoomFn())));
        this.zoom.element(`${id}_reset`, e => e.onclick = () => resetFn());

        clearTimeout(this._popupTimeout);
        this._popupTimeout = setTimeout(() => this.zoom.element(id, e => e.style.display = "none"), timeout);
    }
}