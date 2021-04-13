import {TransformableDrawer} from "../util/TransformableDrawer";
import Vector2 from "@equinor/videx-vector2";
import {Transform} from "../util/transform";

/**
 * A no-op drawer that acts as an event emitter only, to detect transformation changes
 */
export default class Fragment implements TransformableDrawer {
    draw(): void {
        // noop
    }

    readonly transform: Transform = {
        offset: Vector2.zero,
        scale: Vector2.zero,
        viewportSize: Vector2.zero
    };

    size = Vector2.zero;
}
