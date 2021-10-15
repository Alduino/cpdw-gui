import {WindowWrapper} from "../WindowWrapper";
import {AbsoluteLayout, FlexLayout, Rectangle, render} from "../layout";
import React, {FC} from "react";
import {WebGLImpl} from "../graphics";
import {perFrame} from "../WindowUtils";
import {Text} from "../layout/components/Text";

const App: FC = () => {
    return (
        <AbsoluteLayout absolutePosition={[0, 0]}>
            <FlexLayout direction="horiz" padding={5} gap={5}>
                <Rectangle size="100px" />
                <AbsoluteLayout flexFr={1}>
                    <Rectangle size="50%" />
                    <Text value="Hello!" />
                </AbsoluteLayout>
                <Rectangle size={200} />
            </FlexLayout>
        </AbsoluteLayout>
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
