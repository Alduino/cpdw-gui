import Vector2 from "@equinor/videx-vector2";
import {WindowWrapper} from "../WindowWrapper";
import {perFrame} from "../WindowUtils";
import Rectangle from "../renderer/component/Rectangle";
import Text from "../renderer/component/Text";
import {WebGLImpl} from "../graphics";

export function test(win: WindowWrapper) {
    requestAnimationFrame(() => {
        const ctx = new WebGLImpl(win.ctx);

        const button = new Rectangle(ctx);
        const label = new Text(ctx);

        button.with(b => {
            b.size = new Vector2(73, 21);
            b.transform.offset = new Vector2(10);
            b.fill = [.9, .9, .9];
            b.borderColour = [.7, .7, .7];
        });

        label.with(l => {
            l.transform.scale = new Vector2(9);
            l.transform.offset = new Vector2(24, 13);
            l.colour = [0, 0, 0, 1];
            l.text = "button6";
        })

        win.on("resize", s => button.transform.viewportSize = s);
        win.on("resize", s => label.transform.viewportSize = s);
        button.transform.viewportSize = win.size;
        label.transform.viewportSize = win.size;

        perFrame(win, (_, t) => {
        //requestAnimationFrame(() => {
            win.ctx.clearColor(.95, .95, .95, 1);
            win.ctx.clear(win.ctx.COLOR_BUFFER_BIT);
            button.draw();
            label.draw();
        });
    });
}
