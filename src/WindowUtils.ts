import {WindowWrapper} from "./WindowWrapper";

export function perFrame(win: WindowWrapper, fn: (delta: number, time: number) => void) {
    let lastT = performance.now(), enabled = true;
    win.requestAnimationFrame(function cb() {
        const t = performance.now();
        lastT = t;

        if (enabled && !win.closing) win.requestAnimationFrame(cb);

        try {
            fn(t - lastT, t);
        } catch (e) {
            console.error(e);
            enabled = false;
        }
    });
}
