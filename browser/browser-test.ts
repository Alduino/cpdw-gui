import "regenerator-runtime/runtime";
import Vector2 from "@equinor/videx-vector2";
// @ts-ignore
import {Spector} from "spectorjs";
import {BrowserWindow} from "../src/browser/BrowserWindow";
import "./window.scss";
import {test} from "../src/example/test-gl";

interface Hot { hot: any; }
function moduleIsHot(module: any): module is Hot {
    return !!module.hot;
}

(async () => {

    const win = new BrowserWindow(document.body);

    win.open();
    win.title = `My new window (random:${Date.now() % 1000})`;
    win.size = new Vector2(800, 600);
    win.pos = new Vector2(640, 10);

    if (moduleIsHot(module)) {
        module.hot.accept();

        module.hot.dispose(() => {
            console.log("gonna be disposed! closing win");
            win.close();
        });
    }

    document.getElementById("enable-spector").onclick = ev => {
        (ev.currentTarget as HTMLButtonElement).disabled = true;
        const spector = new Spector();
        spector.displayUI();
    };

    test(win);
})()
