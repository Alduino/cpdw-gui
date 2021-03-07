import {WindowWrapper} from "./WindowWrapper";

function hrTimeToMs(hrtime: [number, number] = process.hrtime()) {
    return hrtime[0] * 1000 + hrtime[1] / 1000000;
}

function nextFrame(cb: Function) {
    return new Promise<void>(yay => {
        requestAnimationFrame(() => {
            cb();
            yay();
        });
    });
}

export async function perFrame(win: WindowWrapper, fn: (delta: number, time: number) => void) {
    const msFunction = typeof performance === "undefined" ? hrTimeToMs : performance.now.bind(performance);

    let lastT = msFunction(), enabled = true;

    while (enabled && !win.closing) {
        await nextFrame(() => {
            const t = msFunction();
            lastT = t;

            try {
                fn(t - lastT, t);
            } catch (e) {
                console.error(e);
                enabled = false;
            }
        });
    }
}
