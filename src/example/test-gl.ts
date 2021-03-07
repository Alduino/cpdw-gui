import {Spector} from "spectorjs";
import Vector2 from "@equinor/videx-vector2";
import {WindowWrapper} from "../WindowWrapper";
import DrawerBase from "../renderer/DrawerBase";
import createShader from "../renderer/Shader";
import {perFrame} from "../WindowUtils";
import Button from "../renderer/component/Button";

/*class Polygon extends DrawerBase {
    private static vertexShader = createShader`
        ${["attr", "vec2", DrawerBase.coordsAttr]}
        ${["uniform", "float", "scale", "lowp"]}

        out vec4 color;

        void main() {
            color = vec4(${DrawerBase.coordsAttr} / 2. + .5, 0., 1.);
            gl_Position = vec4(${DrawerBase.coordsAttr} * scale, 0., 1.);
        }
    `;

    private static fragmentShader = createShader`
        void main() {
            gl_FragColor = color;
        }
    `;

    constructor(ctx: WebGLRenderingContext, private edges: number) {
        super(ctx, Polygon.vertexShader, Polygon.fragmentShader);
        this.updateMesh();
    }

    calculateMesh(): Mesh {
        return new Mesh(MeshType.triangleFan, [
            new Vector2(0),
            ...Array.from({length: this.edges}, (_, i) => {
                const angle = (i / this.edges) * Math.PI * 2;
                return new Vector2(Math.cos(angle), Math.sin(angle));
            })
        ], [...Array.from({length: this.edges + 1}, (_, i) => i), 1]);
    }

    set scale(value: number) {
        this.setUniform("scale", value);
    }

    get sides() {
        return this.edges;
    }

    set sides(val) {
        if (this.edges === val) return;
        this.edges = val;
        this.updateMesh();
    }
}*/

export function test(win: WindowWrapper) {
    const button = new Button(win.ctx);

    perFrame(win, (_, t) => {
        button.draw();
    });

    if (process.env.BROWSER) (new Spector()).displayUI();
}
