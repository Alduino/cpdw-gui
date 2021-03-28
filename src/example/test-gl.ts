import Vector2 from "@equinor/videx-vector2";
import {WindowWrapper} from "../WindowWrapper";
import {perFrame} from "../WindowUtils";
import Rectangle from "../renderer/component/Rectangle";
import Text from "../renderer/component/Text";

export function test(win: WindowWrapper) {
    const button = new Rectangle(win.ctx);
    const label = new Text(win.ctx);

    button.size = new Vector2(73, 21);
    button.position = new Vector2(10);
    button.fill = [.9, .9, .9];
    button.borderColour = [.7, .7, .7];

    label.scale = new Vector2(9);
    label.position = new Vector2(10).add(14, 3);
    label.colour = [0, 0, 0, 1];
    label.text = "button6";

    win.on("resize", button.handleResize.bind(button));
    win.on("resize", label.handleResize.bind(label));
    button.handleResize(win.size);
    label.handleResize(win.size);

    perFrame(win, (_, t) => {
        win.ctx.clearColor(.95, .95, .95, 1);
        win.ctx.clear(win.ctx.COLOR_BUFFER_BIT);
        button.draw();
        label.draw();
    });
}
