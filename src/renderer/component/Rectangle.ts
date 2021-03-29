import Vector2 from "@equinor/videx-vector2";
import DrawerBase from "../DrawerBase";
import createShader from "../Shader";
import ColouredIndexedMeshBuilder, {Colour} from "../meshBuilders/ColouredIndexedMeshBuilder";
import {Transformable, TransformMixin, transformShader} from "../util/transform";

export default class Rectangle extends DrawerBase implements Transformable {
    // language=GLSL
    private static vertexShader = createShader`
        precision mediump float;

        ${["include", transformShader]}

        ${["var", ColouredIndexedMeshBuilder.ATTR_COORD]};
        ${["var", ColouredIndexedMeshBuilder.ATTR_COLOUR]};

        varying vec4 displayColour;

        void main() {
            displayColour = ${ColouredIndexedMeshBuilder.ATTR_COLOUR};
            gl_Position = vec4(
                transform(${ColouredIndexedMeshBuilder.ATTR_COORD}),
                0., 1.
            );
        }
    `;

    // language=GLSL
    private static fragmentShader = createShader`
        precision mediump float;

        varying vec4 displayColour;

        void main() {
            gl_FragColor = displayColour;
        }
    `;

    private static meshBuilder = new ColouredIndexedMeshBuilder<Rectangle>(p => {
        const borderColour: Colour = [...p.borderColour, 1];
        const innerColour: Colour = [...p.fill, 1];

        const left = 0;
        const right = p.size.x;
        const top = 0;
        const bottom = p.size.y;

        return ({
            vertices: [
                // main rectangle points
                [new Vector2(left, top), borderColour],
                [new Vector2(right, top), borderColour],
                [new Vector2(right, bottom), borderColour],
                [new Vector2(left, bottom), borderColour],

                // border rectangle points
                [new Vector2(right, top + p._borderSize.y), borderColour],
                [new Vector2(right, bottom - p._borderSize.y), borderColour],
                [new Vector2(left, bottom - p._borderSize.y), borderColour],
                [new Vector2(left, top + p._borderSize.y), borderColour],

                // inner rectangle (with border colour)
                [new Vector2(left + p._borderSize.x, top + p._borderSize.y), borderColour],
                [new Vector2(right - p._borderSize.x, top + p._borderSize.y), borderColour],
                [new Vector2(right - p._borderSize.x, bottom - p._borderSize.y), borderColour],
                [new Vector2(left + p._borderSize.x, bottom - p._borderSize.y), borderColour],

                // inner rectangle (with inner colour)
                [new Vector2(left + p._borderSize.x, top + p._borderSize.y), innerColour],
                [new Vector2(right - p._borderSize.x, top + p._borderSize.y), innerColour],
                [new Vector2(right - p._borderSize.x, bottom - p._borderSize.y), innerColour],
                [new Vector2(left + p._borderSize.x, bottom - p._borderSize.y), innerColour]
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
                12, 13, 15,
                13, 14, 15
            ]
        });
    });

    private _fill: [number, number, number] = [255, 255, 255];
    private _borderColour: [number, number, number] = [0, 0, 0];
    private _borderSize = new Vector2(1);
    private _size = new Vector2(50, 50);

    public readonly transform: TransformMixin;

    constructor(ctx: WebGLRenderingContext) {
        super(ctx, Rectangle.meshBuilder);
        this.init(Rectangle.vertexShader, Rectangle.fragmentShader);

        this.transform = new TransformMixin(this);
    }

    get fill() {
        return this._fill;
    }

    // @mesh-update
    set fill(v) {
        this._fill = v;
        this.updateMesh();
    }

    get borderColour() {
        return this._borderColour;
    }

    // @mesh-update
    set borderColour(v) {
        this._borderColour = v;
        this.updateMesh();
    }

    get borderSize() {
        return this._borderSize;
    }

    // @mesh-update
    set borderSize(v) {
        this._borderSize = v;
        this.updateMesh();
    }

    get size() {
        return this._size;
    }

    // @mesh-update
    set size(v) {
        this._size = v;
        this.updateMesh();
    }
}
