import {WindowWrapper} from "./WindowWrapper";

function hrTimeToMs(hrtime: [number, number] = process.hrtime()) {
    return hrtime[0] * 1000 + hrtime[1] / 1000000;
}

export function perFrame(win: WindowWrapper, fn: (delta: number, time: number) => void) {
    const msFunction = typeof performance === "undefined" ? hrTimeToMs : performance.now.bind(performance);

    let lastT = msFunction(), enabled = true;
    win.requestAnimationFrame(function cb() {
        const t = msFunction();
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
