# ctrlZoom
Chrome extension to add back "Ctrl + touch pad scroll" to zoom in and out.

## Configuration
### Scroll threshold _(default 20px)_
The default threshold used to determin if a wheel event should invoke a zoom. Or in other words how sensitiv the zoom behavior is.

> This value worked for me, depending on your touchpad or preference you might need to increase/decrease this value.

### Step size _(default 10%)_
This value specifies how much to change the current zoom level. It's an absolute percentage.
If your current zoom level is 50% and you zoom in 1 _step_ the new zoom level will be 60% _(if step size is 10%)_

### Minimum delay between zooms _(default 100ms)_
This value defines the minimum delay between zoom events.
During this delay new wheel events will be ignored.

> This value worked for me, depending on your touchpad or preference you might need to increase/decrease this value.

### Direction reversed _(default false)_
This will simply change the wheel direction for zooming.

### Use browser zoom _(default true)_
Normaly this extension uses the chrome tab zoom _(browser zoom)_.

If you use chromes _zoom_, it remembers the zoom level on a per host name basis: `chrome://settings/content/zoomLevels?search=zoom`

If you disable this, the extesion will use `document.body.style.zoom` instead, which chrome does not track.

It will also intercept "CTRL+0" (but not prevent the default behavior) an reset _its_ zoom level to _100%_

### Remember non browser zoom _(default false)_
If you disable _Use browser zoom_ the _zoom level_ is not stored anywhere by default.
If you enable this setting, the _document.body.style.zoom_ is stored with a hashed key in localStorage and will be reapplied after a page reload.

### Disabled _(default false)_
If you need to temporarily disable the _zoom_ behavior, you can simply check _Disabled_.
If set, the extension will no longer perform any _zoom_