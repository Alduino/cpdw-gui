import createWindow from "./createWindow";
import {test} from "./test-gl";

// This file is run when the app is run natively.

(async () => {
    const window = await createWindow();
    window.title = "Test window";

    test(window);
})();
