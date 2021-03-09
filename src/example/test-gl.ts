import Vector2 from "@equinor/videx-vector2";
import {WindowWrapper} from "../WindowWrapper";
import {perFrame} from "../WindowUtils";
import Button from "../renderer/component/Button";

export function test(win: WindowWrapper) {
    const button = new Button(win.ctx);
    const button2 = new Button(win.ctx);

    button.position = new Vector2(0, 70);

    win.on("resize", button.handleResize.bind(button));
    win.on("resize", button2.handleResize.bind(button2));
    button.handleResize(win.size);
    button2.handleResize(win.size);

    perFrame(win, (_, t) => {
        win.ctx.clearColor(1, 1, 1, 1);
        win.ctx.clear(win.ctx.COLOR_BUFFER_BIT);
        button.draw();
        button2.draw();
    });
}
