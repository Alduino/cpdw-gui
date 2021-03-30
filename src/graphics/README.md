# GPDW Graphics

> A graphics library abstraction layer

This is one of the layers between the raw metal and the final output. As it has a backend-independent API, it will
help with the eventual migration of this library to WebGPU, when the standard is finalised.

There is currently one implementation of this library, which is WebGL (in the `webgl` directory).
