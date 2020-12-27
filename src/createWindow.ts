import {WindowWrapper} from "./WindowWrapper";

async function createWindow(): Promise<WindowWrapper> {
    if (process.env.BROWSER) {
        const {BrowserWindow} = await import("./browser/BrowserWindow");
        const win = new BrowserWindow(document.body);
        win.open();
        return win;
    } else {
        const {NodeWindowWrapper} = await import("./node/NodeWindowWrapper");
        const {Window: NodeWindow} = await import("glfw-raub");
        return new NodeWindowWrapper(new NodeWindow());
    }
}

export default createWindow;
