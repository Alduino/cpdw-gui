import {Transform} from "../../renderer/util/transform";

export type TransformWithoutViewport = Omit<Transform, "viewportSize">;
