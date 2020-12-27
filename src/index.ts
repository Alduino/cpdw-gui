import createWindow from "./createWindow";

(async () => {
    const window = await createWindow();
    window.title = "Test window";

    const animFrame = window.requestAnimationFrame(function frame() {
        if (!window.closing) window.requestAnimationFrame(frame);
        else console.log("closing");

        const ctx = window.ctx;
    });
})();
