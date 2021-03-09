import createShader from "../Shader";
import {uVec2} from "../variables/uniform/Vec2UniformVariable";

export const UNIFORM_VIEWPORT_SIZE = uVec2("transformViewportSize");

export const UNIFORM_OFFSET = uVec2("transformOffset");
export const UNIFORM_SCALE = uVec2("transformScale");

/**
 * Adds a `vec2 transform(vec2)` method that applies the transformations.
 */
// language=GLSL
export const transformShader = createShader`
    ${["var", UNIFORM_OFFSET]};
    ${["var", UNIFORM_SCALE]};
    ${["var", UNIFORM_VIEWPORT_SIZE]};

    vec2 transform(vec2 p) {
        return ((p * ${["ref", UNIFORM_SCALE]}) + ${["ref", UNIFORM_OFFSET]}) / ${["ref", UNIFORM_VIEWPORT_SIZE]};
    }
`;
