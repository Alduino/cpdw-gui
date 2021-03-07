import {Spector} from "spectorjs";
import Vector2 from "@equinor/videx-vector2";
import {WindowWrapper} from "../WindowWrapper";
import DrawerBase from "../renderer/DrawerBase";
import Mesh, {MeshType} from "../renderer/Mesh";
import createShader from "../renderer/Shader";
import {perFrame} from "../WindowUtils";

class Polygon extends DrawerBase {
    private static vertexShader = createShader`
        ${["attr", "vec2", DrawerBase.coordsAttr]}
        ${["uniform", "float", "scale", "lowp"]}
        
        void main() {
            gl_Position = vec4(${DrawerBase.coordsAttr} * scale, 0., 1.);
        }
    `;

    private static fragmentShader = createShader`    
        void main() {
            gl_FragColor = vec4(.0, .5, 1., 1.);
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
}

export function test(win: WindowWrapper) {
    const testDrawer = new Polygon(win.ctx, 16);
    perFrame(win, (_, t) => {
        testDrawer.sides = Math.floor((Math.sin(t / 1000) / 2 + .5) * 29 + 3);

        testDrawer.scale = .7;
        testDrawer.draw();
    });

    if (process.env.BROWSER) (new Spector()).displayUI();
}
