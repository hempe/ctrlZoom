class CtrlZoom {
    constructor() {
        this.defaults = {
            stepSize: 10,
            minimumScroll: 20,
            directionReversed: 'false',
            disable: 'false',
            useBrowserZoom: 'true',
            rememberZoom: 'false',
            minDelay: 100,
            interceptPlusMinus: 'false',
            showPopup: 'true',
            showPopupTime: 2000,
        };
        this.msgKind = "ctrl-zoom-message";
        this.keys = Object.keys(this.defaults);
        this.zoomStepsIn = [500, 400, 300, 250, 200, 175, 150, 125, 110, 100, 90, 80, 75, 67, 50, 33, 25];
        this.zoomStepsOut = this.zoomStepsIn.map(x => x).reverse();
        this._sigma = 0.01;
        this._minRatio = 0.25;
        this._maxRatio = 5;
        this._blocked = false;
    }

    _getBool(items, key, defaultValue) {
        try {
            return items[key] == 'true';
        } catch {
            return defaultValue == 'true';
        }
    }

    _nextValue(steps, callbackFn) {
        const filterd = steps.filter(callbackFn);
        return filterd.length > 0
            ? filterd[filterd.length - 1] / 100.0
            : steps[0] / 100.0;
    }

    getValue(items, key) {
        const defaultValue = this.defaults[key];
        if (items[key] == undefined)
            return defaultValue;

        try {
            if (typeof defaultValue == 'boolean' || defaultValue === 'true' || defaultValue === 'false')
                return this._getBool(items, key, defaultValue);

            const int = parseInt(items[key] + '');
            return !isNaN(defaultValue)
                ? isNaN(int) ? defaultValue : int > 0 ? int : defaultValue
                : this._getBool(items, key, defaultValue);
        } catch {
            return this._getBool(items, key, defaultValue);
        }
    }

    nextRatio(ratio, direction, stepSize) {
        ratio = Math.round(ratio * 100);
        const next = (ratio - (direction * stepSize)) / 100;
        ratio = next > this._maxRatio ? this._maxRatio : next < this._minRatio ? this._minRatio : next;
        return isNaN(ratio) ? 1 : ratio;
    }

    nextIncrease(currentRatio) {
        const current = currentRatio * 100;
        return this._nextValue(this.zoomStepsIn, x => x > (current + this._sigma))
    }

    nextDecrease(currentRatio) {
        const current = currentRatio * 100;
        return this._nextValue(this.zoomStepsOut, x => x < (current - this._sigma));
    }

    allowNext(delay) {
        if (!delay)
            delay = this.defaults.minDelay;
        if (this._blocked)
            return false;
        this._blocked = true;
        setTimeout(() => {
            this._blocked = false;
        }, delay);
        return this._blocked;
    }
    getId() {
        return this.hashCode(window.location.hostname);
    }

    element(id, callback) {
        const e = document.getElementById(id);
        if (!e)
            return;
        callback(e);
    }

    handle(event, condition, callback) {
        if (condition) {
            callback();
            event.preventDefault();
        }
    }

    hashCode(source) {
        let hash = 0, i, chr;
        if (source.length === 0) return hash;
        for (i = 0; i < source.length; i++) {
            chr = source.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    };
}