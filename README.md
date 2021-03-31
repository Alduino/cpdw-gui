# CPDW GUI

An experiment by me.

## Overview
In the future, this is planned to be a GUI library to make Windows-style GUIs, both in the browser
and natively, without Electron.

Currently, it is in very early stages, and I'm still experimenting with how it is going to be set out.
The example in `src/example/test-gl.tsx` is a good indication of what works, as I'm using it as testing
grounds.

## Example
The example can be run in the browser or as a native window.

A browser build is available at https://cpdw-bt.alduino.dev, and you can run it locally with
`npm run start:browser` or `npm run build:browser`.

You can run the native version with `npm run start:desktop`.
For development, you can `npm run dev` (which will re-open the window on changes).

## What works

**Windows**: The library can open a window natively and render to it, and can create a pseudo-window
in the browser that operates similarly to a native one (you probably won't use this, it's more because
it looks cool and I went a bit overboard).

**WebGL**: A basic structure for WebGL has been created that massively simplifies its usage:
- `Shader`: Creates a shader from its source text. Uses template strings to handle preprocessing like
    creating attributes and uniforms, and including other shader files.
- `Program`: Wraps two shaders to create a WebGL program, and handles all the setting up. Only used
    internally by `DrawerBase`.
- `Mesh`: Stores information about a mesh, and is used by `DrawerBase` to convert it to a format WebGL
    can handle.
- `DrawerBase`: Handles most of the WebGL setup. An abstract class for anything that uses WebGL rendering to
    implement.

**React Components**: React-based layer on top of the flat renderer

You can see an example of a `Drawer` in the example script. It currently renders an n-sided polygon.
