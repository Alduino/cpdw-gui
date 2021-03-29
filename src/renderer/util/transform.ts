import createShader from "../Shader";
import {uVec2} from "../variables/uniform/Vec2UniformVariable";
import Vector2 from "@equinor/videx-vector2";
import DrawerBase from "../DrawerBase";

export const UNIFORM_VIEWPORT_SIZE = uVec2("transformViewportSize");

export const UNIFORM_OFFSET = uVec2("transformOffset");
export const UNIFORM_SCALE = uVec2("transformScale");

/**
 * Adds a `vec2 transform(vec2)` method that applies the transformations.
 * @export vec2 transform(vec2 p)
 */
// language=GLSL
export const transformShader = createShader`
    ${["var", UNIFORM_OFFSET]};
    ${["var", UNIFORM_SCALE]};
    ${["var", UNIFORM_VIEWPORT_SIZE]};

    vec2 transform(vec2 p) {
        vec2 targetPos = p * ${UNIFORM_SCALE} + ${UNIFORM_OFFSET};
        vec2 mapped = targetPos * vec2(2, -2) / ${UNIFORM_VIEWPORT_SIZE} - vec2(1, -1);
        return mapped;
    }
`;

export interface Transformable {
    readonly transform: TransformMixin;
}

export class TransformMixin {
    private _offset: Vector2;
    private _scale: Vector2;
    private _viewportSize: Vector2;

    /**
     * Creates a new TransformMixin for a drawer. Must be called after `.init()`.
     * Drawer should include `transformShader` for this to have any effect.
     */
    constructor(private drawer: DrawerBase) {
        this.offset = Vector2.zero;
        this.scale = Vector2.one;
        this.viewportSize = Vector2.one;
    }

    get offset() { return this._offset; }

    set offset(v) {
        this._offset = v;
        this.drawer.getVariable(UNIFORM_OFFSET).set(v);
    }

    get scale() { return this._scale; }

    set scale(v) {
        this._scale = v;
        this.drawer.getVariable(UNIFORM_SCALE).set(v);
    }

    get viewportSize() { return this._viewportSize; }

    set viewportSize(v) {
        this._viewportSize = v;
        this.drawer.getVariable(UNIFORM_VIEWPORT_SIZE).set(v);
    }
}
