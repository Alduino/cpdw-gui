declare module "glfw-raub" {
    import {EventEmitter} from "events";

    export enum InputState {
        Released,
        Pressed,
        Repeated
    }

    export enum MouseButton {
        B1,
        B2,
        B3,
        B4,
        B5,
        B6,
        B7,
        B8,

        Last = 7,
        Left = 0,
        Right = 1,
        Middle = 2
    }

    export enum Key {
        Unknown = -1,
        Space = 32,
        Apostrophe = 39,
        Comma = 44,
        Minus = 45,
        Period = 46,
        Slash = 47,
        N0 = 48,
        N1 = 49,
        N2 = 50,
        N3 = 51,
        N4 = 52,
        N5 = 53,
        N6 = 54,
        N7 = 55,
        N8 = 56,
        N9 = 57,
        Semicolon = 59,
        Equals = 61,
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
        LeftBracket = 91,
        Backslash = 92,
        RightBracket = 93,
        GraveAccent = 96,
        World1 = 161,
        World2 = 162,
        Escape = 256,
        Enter = 257,
        Tab = 258,
        Backspace = 259,
        Insert = 260,
        Delete = 261,
        Right = 262,
        Left = 263,
        Down = 264,
        Up = 265,
        PageUp = 266,
        PageDown = 267,
        Home = 268,
        End = 269,
        CapsLock = 280,
        ScrollLock = 281,
        NumLock = 282,
        PrintScreen = 283,
        Pause = 284,
        F1 = 290,
        F2 = 291,
        F3 = 292,
        F4 = 293,
        F5 = 294,
        F6 = 295,
        F7 = 296,
        F8 = 297,
        F9 = 298,
        F10 = 299,
        F11 = 300,
        F12 = 301,
        F13 = 302,
        F14 = 303,
        F15 = 304,
        F16 = 305,
        F17 = 306,
        F18 = 307,
        F19 = 308,
        F20 = 309,
        F21 = 310,
        F22 = 311,
        F23 = 312,
        F24 = 313,
        F25 = 314,
        NumPad0 = 320,
        NumPad1 = 321,
        NumPad2 = 322,
        NumPad3 = 323,
        NumPad4 = 324,
        NumPad5 = 325,
        NumPad6 = 326,
        NumPad7 = 327,
        NumPad8 = 328,
        NumPad9 = 329,
        NumPadDecimal = 330,
        NumPadDivide = 331,
        NumPadMultiply = 332,
        NumPadSubtract = 333,
        NumPadAdd = 334,
        NumPadEnter = 335,
        NumPadEqual = 336,
        LeftShift = 340,
        LeftControl = 341,
        LeftAlt = 342,
        LeftSuper = 343,
        RightShift = 344,
        RightControl = 345,
        RightAlt = 346,
        RightSuper = 347,
        Menu = 348,
        Last = 348
    }

    export interface Image {
        width: number;
        height: number;

        /**
         * Image data in RGBA
         */
        data: Buffer;

        noflip?: boolean;
    }

    export interface Monitor {
        /**
         * Is this screen primary
         */
        is_primary: number;

        /**
         * Screen name
         */
        name: string;

        /**
         * Global x position of the screen
         */
        pos_x: number;

        /**
         * Global y position of the screen
         */
        pos_y: number;

        /**
         * Screen width in mm
         */
        width_mm: number;

        /**
         * Screen height in mm
         */
        height_mm: number;

        /**
         * Screen width
         */
        width: number;

        /**
         * Screen height
         */
        height: number;

        /**
         * Refresh rate
         */
        rate: number;

        modes: {
            /**
             * Screen width
             */
            width: number;

            /**
             * Screen height
             */
            height: number;

            /**
             * Refresh rate
             */
            rate: number;
        }[];
    }

    export interface Rect extends DOMRect {}

    export enum WindowMode {
        Windowed = "windowed",
        Borderless = "borderless",
        FullScreen = "fullscreen"
    }

    interface WindowConstructorOpts {
        /**
         * Major OpenGL version
         * @default 2
         */
        major?: number;

        /**
         * Minor OpenGL version
         * @default 1
         */
        minor?: number;

        /**
         * Window title
         * @default $PWD
         */
        title?: string;

        /**
         * Initial window width
         * @default 800
         */
        width?: number;

        /**
         * Initial window height
         * @default 600
         */
        height?: number;

        /**
         * Initial display ID
         */
        display?: number;

        /**
         * Enable vsync
         * @default false
         */
        vsync?: boolean;

        /**
         * Fullscreen window. Takes precedence over `mode`
         * @default false
         */
        fullscreen?: boolean;

        /**
         * @default WindowMode.Windowed
         */
        mode?: WindowMode;

        /**
         * Should fullscreen windows iconify automatically on focus loss
         * @default true
         */
        autoIconify?: boolean;

        /**
         * Multisampling level
         * @default 2
         */
        msaa?: number;

        /**
         * Window icon
         */
        icon?: Image;

        /**
         * If window has borders (use `false` for borderless fullscreen)
         * @default true
         */
        decorated?: boolean;
    }

    export class Window extends EventEmitter {
        constructor(opts?: WindowConstructorOpts);

        /**
         * Ratio between physical and logical pixels
         */
        readonly ratio: number;

        /**
         * @alias ratio
         * @see ratio
         */
        readonly devicePixelRatio?: number;

        /**
         * Window pointer
         */
        readonly handle: number;

        /**
         * Borderless emulates fullscreen with a frameless screen-sized window.
         * When changed, a new window is created and the old one is hidden.
         */
        mode: WindowMode;

        /**
         * Width in logical pixels
         */
        width: number;

        /**
         * Height in logical pixels
         */
        height: number;

        /**
         * @alias width
         * @see width
         */
        w: number;

        /**
         * @alias height
         * @see height
         */
        h: number;

        /**
         * Array of logical width and height
         * @see width
         * @see height
         */
        wh: [number, number];

        /**
         * Object of logical width and height
         * @see width
         * @see height
         */
        pxSize: {width: number, height: number};

        /**
         * @alias width
         * @see width
         */
        innerWidth: number;

        /**
         * @alias height
         * @see height
         */
        innerHeight: number;

        /**
         * @alias width
         * @see width
         */
        clientWidth: number;

        /**
         * @alias height
         * @see height
         */
        clientHeight: number;

        /**
         * Object of physical width and height
         */
        size: {width: number, height: number};

        /**
         * Always 0
         */
        readonly scrollX: number;

        /**
         * Always 0
         */
        readonly scrollY: number;

        /**
         * Window title
         */
        title: string;

        /**
         * Number of msaa samples
         */
        readonly msaa: number;

        /**
         * OpenGL vendor info
         */
        readonly version: string;

        /**
         * If the window is going to be closed
         */
        shouldClose: boolean;

        /**
         * Window HWND pointer
         */
        readonly platformWindow: number;

        /**
         * OpenGL context handle
         */
        readonly platformContext: number;

        /**
         * Object containing window position coordinates
         */
        pos: {x: number, y: number};

        /**
         * X coordinate of window on the screen
         */
        x: number;

        /**
         * Y coordinate of window on the screen
         */
        y: number;

        /**
         * The size of the allocated framebuffer, same as pxSize
         */
        framebufferSize: {width: number, height: number};

        /**
         * The current OpenGL context
         */
        currentContext: number;

        /**
         * Object of the cursor coordinates
         */
        cursorPos: {x: number, y: number};

        /**
         * Get the monitor that has the most overlap with this window
         */
        getCurrentMonitor(): Monitor;

        /**
         * Gets a browserlike rect of this window
         */
        getBoundingClientRect(): Rect;

        /**
         * Get the key's state
         */
        getKey(key: number): InputState;

        /**
         * Get the mouse button state
         */
        getMouseButton(button: number): InputState;

        // todo make enum
        /**
         * Get a window attribute
         */
        getWindowAttrib(attrib: number): number;

        /**
         * Set input mode
         */
        setInputMode(mode: number, value: number): void;

        /**
         * Swaps the front and back buffers of the window
         */
        swapBuffers(): void;

        /**
         * Make this window's GL context the current one
         */
        makeCurrent(): void;

        /**
         * Destroy the window
         */
        destroy(): void;

        /**
         * Minimise the window
         */
        iconify(): void;

        /**
         * Restore the window if it was previously minimised or maximised
         */
        restore(): void;

        /**
         * Hide the window
         */
        hide(): void;

        /**
         * Show the window if it was hidden
         */
        show(): void;

        requestAnimationFrame(cb: () => void): number;
        cancelAnimationFrame(id: number): void;
    }
}
