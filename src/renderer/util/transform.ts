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
        vec2 targetPos = p * ${UNIFORM_SCALE} + ${UNIFORM_OFFSET};
        vec2 mapped = targetPos / ${UNIFORM_VIEWPORT_SIZE} - vec2(1, -1);
        return mapped;
    }
`;
