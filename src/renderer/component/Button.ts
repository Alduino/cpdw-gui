import Vector2 from "@equinor/videx-vector2";
import DrawerBase from "../DrawerBase";
import createShader from "../Shader";
import ColouredIndexedMeshBuilder, {ColouredIndexedMeshAttrs} from "../meshBuilders/ColouredIndexedMeshBuilder";

export default class Button extends DrawerBase<Button, ColouredIndexedMeshAttrs> {
    // language=GLSL
    private static vertexShader = createShader`
        ${["attr", "vec2", ColouredIndexedMeshBuilder.ATTR_COORDS]};

        void main() {
            gl_Position = vec4(${ColouredIndexedMeshBuilder.ATTR_COORDS}, 0., 1.);
        }
    `;

    // language=GLSL
    private static fragmentShader = createShader`
        void main() {
            gl_FragColor = vec4(1., .5, 0., 1.);
        }
    `;

    private static meshBuilder = new ColouredIndexedMeshBuilder<Button>(p => ({
        vertices: [
            // main rectangle points
            [new Vector2(-1, -1), [255, 255, 255, 1]],
            [new Vector2(1, -1), [255, 255, 0, 1]],
            [new Vector2(1, 1), [255, 0, 255, 1]],
            [new Vector2(-1, 1), [0, 255, 255, 1]],

            // border rectangle points
            [new Vector2(1, -1 + p._borderSize.y), [255, 0, 0, 1]],
            [new Vector2(1, 1 - p._borderSize.y), [0, 255, 0, 1]],
            [new Vector2(-1, 1 - p._borderSize.y), [0, 0, 255, 1]],
            [new Vector2(-1, -1 + p._borderSize.y), [0, 0, 0, 1]],

            // inner rectangle
            [new Vector2(-1 + p._borderSize.x, -1 + p._borderSize.y), [255, 255, 127, 1]],
            [new Vector2(1 - p._borderSize.x, -1 + p._borderSize.y), [255, 127, 255, 1]],
            [new Vector2(1 - p._borderSize.x, 1 - p._borderSize.y), [255, 127, 127, 1]],
            [new Vector2(-1 + p._borderSize.x, 1 - p._borderSize.y), [127, 255, 255, 1]]
        ],
        indices: [
            // border
            0, 1, 7,
            1, 4, 7,
            4, 10, 9,
            4, 5, 10,
            5, 2, 3,
            5, 3, 6,
            8, 11, 6,
            7, 8, 6,

            // inner rectangle
            8, 9, 11,
            9, 10, 11
        ]
    }));

    private _borderSize = new Vector2(.1);

    constructor(ctx: WebGLRenderingContext) {
        super(ctx, Button.meshBuilder);
        this.init(Button.vertexShader, Button.fragmentShader);
    }
}
