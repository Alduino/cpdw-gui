import Vector2 from "@equinor/videx-vector2";
import {WindowWrapper} from "../WindowWrapper";
import {perFrame} from "../WindowUtils";
import Rectangle from "../renderer/component/Rectangle";
import Text from "../renderer/component/Text";

export function test(win: WindowWrapper) {
    const button = new Rectangle(win.ctx);
    const button2 = new Rectangle(win.ctx);
    const text = new Text(win.ctx);
    text.colour = [0, 0, 0, 1];
    text.scale = new Vector2(24);
    text.text = "Submit";

    button.position = new Vector2(0, 0);
    button2.position = new Vector2(0, 70);
    text.position = new Vector2(5, 5);

    button2.borderSize = new Vector2(12);

    win.on("resize", button.handleResize.bind(button));
    win.on("resize", button2.handleResize.bind(button2));
    win.on("resize", text.handleResize.bind(text));
    button.handleResize(win.size);
    button2.handleResize(win.size);
    text.handleResize(win.size);

    perFrame(win, (_, t) => {
        win.ctx.clearColor(1, 1, 1, 1);
        win.ctx.clear(win.ctx.COLOR_BUFFER_BIT);
        button.draw();
        button2.draw();
        text.draw();
    });
}
