import "regenerator-runtime/runtime"
import Vector2 from "@equinor/videx-vector2";
import {BrowserWindow} from "../src/browser/BrowserWindow";
import "./window.scss";

interface Hot { hot: any; }
function moduleIsHot(module: any): module is Hot {
    return !!module.hot;
}

(async () => {
    const win = new BrowserWindow(document.body);
    win.open();
    win.title = `My new window (${Date.now() % 1000})`;
    win.size = new Vector2(800, 600);
    win.pos = new Vector2(0, 0);

    if (moduleIsHot(module)) {
        module.hot.accept();

        module.hot.dispose(() => {
            console.log("gonna be disposed! closing win");
            win.close();
        });
    }
})()
