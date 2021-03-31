## Layout

A React-based, but still relatively low level, layer on top of the renderer.

Most of the non-rendering stuff is implemented here, in the internal component library.

## Low-level components
These directly map to the renderer's components, with some niceties in the props, i.e. colours are from the
`color` library, and vectors can be specified as arrays, and sane default values.

All components have optional `position` and `scale` props, which directly map to their counterparts for the
`Transform` mixin in the renderer.

- `Rectangle`:
  - `size: vec2` The width and height
  - `fill: color`: The fill colour
  - `borderSize?: vec2`: The width of the vertical and horizontal borders. Defaults to `0` (no border)
  - `borderColour?: color`: The colour that the borders will be filled with. Defaults to black
  - `children?: node[]`: Supports children with relative positioning

- `Text`:
  - `fill: color`: The colour of the text
  - `fontSize?: number`: The size of the font. Defaults to 16
  - `children: string`: The text to be displayed
