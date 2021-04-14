import {WindowWrapper} from "../WindowWrapper";
import {FlexLayout, Rectangle, render} from "../layout";
import React, {FC} from "react";
import {WebGLImpl} from "../graphics";
import {perFrame} from "../WindowUtils";

const App: FC = () => {
    return (
        <FlexLayout direction="horiz" padding={5} gap={5}>
            <Rectangle />
            <Rectangle />
            <Rectangle flexFr={2} />
            <Rectangle flexFr={1} />
        </FlexLayout>
    );
};

export function testFn(win: WindowWrapper) {
    const draw = render(<App />, {
        gl: new WebGLImpl(win.ctx),
        listenForResize(cb) {
            win.on("resize", cb);
            cb(win.size);
        }
    }, () => console.log("Done!"));

    perFrame(win, (_, t) => {/*
    requestAnimationFrame(() => {/**/
        win.ctx.clearColor(.95, .95, .95, 1);
        win.ctx.clear(win.ctx.COLOR_BUFFER_BIT);
        draw();
    });
}

export function test(win: WindowWrapper) {
    //setTimeout(() => {
        requestAnimationFrame(() => {
            testFn(win)
        });
    //}, 5000);
}

// export function oldTest(win: WindowWrapper) {
//     setTimeout(() => {
//         requestAnimationFrame(() => {
//             const app = new App(win, build => (
//                 build(Flex, {}, build => [
//                     build(Rectangle, {
//                         fill: [0, .75, 1],
//                         borderColour: [1, .5, 0],
//                         borderSize: new Vector2(64)
//                     }),
//                     build(Rectangle, {
//                         fill: [0, .75, 1],
//                         borderColour: [1, .5, 0],
//                         borderSize: new Vector2(64)
//                     })
//                 ])
//             ));
//
//             //perFrame(win, (_, t) => {/*
//             requestAnimationFrame(() => {/**/
//                 win.ctx.clearColor(.95, .95, .95, 1);
//                 win.ctx.clear(win.ctx.COLOR_BUFFER_BIT);
//                 app.draw();
//             });
//         });
//     }, 0);/*
//     }, 5000);/**/
// }
