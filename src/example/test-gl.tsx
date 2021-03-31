import {WindowWrapper} from "../WindowWrapper";
import {Rectangle, render, Text} from "../layout";
import React, {FC} from "react";
import {WebGLImpl} from "../graphics";
import Color from "color";
import {perFrame} from "../WindowUtils";

const App: FC = () => (
    <Rectangle position={[100, 100]} scale={[5, 5]} size={[282, 73]} fill={Color("midnightblue")}>
        <Text fill={Color("orange")} fontSize={60} position={[-100, 0]}>Much beautiful</Text>
    </Rectangle>
);

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
