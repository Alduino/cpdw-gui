import DrawerBase from "../DrawerBase";
import createShader from "../Shader";
import {uVec4} from "../variables/uniform/Vec4UniformVariable";
import {transformShader} from "../util/transform";
import {tex2d} from "../variables/texture/ImageTexture2dVariable";
import Vector2 from "@equinor/videx-vector2";
import {Vec4} from "../util/Vec4";
import fontImage from "./fonts/EkMukta-Regular.b64";
import fontInfoFile from "./fonts/EkMukta-Regular.json";
import Font from "./fonts/font";
import UvIndexedMeshBuilder from "../meshBuilders/UvIndexedMeshBuilder";
import {DrawType, GLContext} from "../../graphics";

const fontInfo = fontInfoFile as Font;

export default class Text extends DrawerBase {
    private static UNIFORM_COLOUR = uVec4("colour");
    private static TEX2D_MAP = tex2d("map");

    // some parts are taken from the three-bmfont-text library

    // language=GLSL
    private static vertexShader = createShader`
        precision mediump float;
        
        ${["include", transformShader]}
        
        ${["var", UvIndexedMeshBuilder.ATTR_COORD]};
        ${["var", UvIndexedMeshBuilder.ATTR_UV]};
        
        varying vec2 uv;
        
        void main() {
            uv = ${UvIndexedMeshBuilder.ATTR_UV};
            
            gl_Position = vec4(
                transform(${UvIndexedMeshBuilder.ATTR_COORD}),
                0., 1.
            );
        }
    `;

    // language=GLSL
    private static fragmentShader = createShader`
        ${["extension", "OES_standard_derivatives"]}
        
        precision mediump float;
        
        ${["var", Text.UNIFORM_COLOUR]};
        ${["var", Text.TEX2D_MAP]};
        
        varying vec2 uv;
        
        float median(float r, float g, float b) {
            return max(min(r, g), min(max(r, g), b));
        }
        
        void main() {
            vec4 src = 1. - texture2D(${Text.TEX2D_MAP}, uv);
            float dist = median(src.r, src.g, src.b) - .5;
            float alpha = clamp(dist / fwidth(dist) + .5, 0., 1.);
            gl_FragColor = ${Text.UNIFORM_COLOUR} * alpha;
        }
    `;

    private static buildCharacterMesh(character: string, posOffset: Vector2, indexOffset: number) {
        if (!fontInfo.info.charset.includes(character)) throw new Error(`Invalid character \`${character}\``);

        const charInfo = fontInfo.chars.find(el => el.id === character.charCodeAt(0));

        const {scaleW: texWidth, scaleH: texHeight} = fontInfo.common;

        const u0 = charInfo.x / texWidth;
        const v1 = charInfo.y / texHeight;
        const u1 = (charInfo.x + charInfo.width) / texWidth;
        const v0 = (charInfo.y + charInfo.height) / texHeight;

        // bottom left
        const bl = posOffset.add(charInfo.xoffset, charInfo.yoffset);

        // quad size
        const qs = new Vector2(charInfo.width, charInfo.height);

        return {
            vertices: [
                [new Vector2(bl.x, bl.y), new Vector2(u0, v1)],
                [new Vector2(bl.x, bl.y + qs.y), new Vector2(u0, v0)],
                [new Vector2(bl.x + qs.x, bl.y + qs.y), new Vector2(u1, v0)],
                [new Vector2(bl.x + qs.x, bl.y), new Vector2(u1, v1)]
            ] as [Vector2, Vector2][],
            indices: [
                0, 2, 1,
                0, 3, 2
            ].map(v => v + indexOffset),
            extent: bl.add(qs.x, charInfo.height - charInfo.yoffset)
        }
    };

    private static meshBuilder = new UvIndexedMeshBuilder<Text>(obj => {
        const sourceText = obj.text;
        const sourceChars = sourceText.split("");

        let nextX = 0, maxHeight = 0;
        const sourceMeshes = sourceChars.map((char, i) => {
            const posOffset = new Vector2(nextX, 0);
            const indexOffset = i * 4;
            const mesh = Text.buildCharacterMesh(char, posOffset, indexOffset);
            nextX = mesh.extent.x;
            maxHeight = Math.max(maxHeight, mesh.extent.y);
            return mesh;
        });

        sourceMeshes.map(mesh => {
            mesh.vertices.map(([vertex]) => {
                vertex.x /= maxHeight;
                vertex.y = vertex.y / maxHeight + 1;
            });
        });

        return {
            type: DrawType.triangles,
            vertices: sourceMeshes.map(mesh => mesh.vertices).flat(),
            indices: sourceMeshes.map(mesh => mesh.indices).flat()
        };
    });

    constructor(ctx: GLContext) {
        super(Text.meshBuilder);
        this.init(ctx, Text.vertexShader, Text.fragmentShader);
        this.getVariable(Text.TEX2D_MAP).set(fontImage);
    }

    set colour(v: Vec4) { this.getVariable(Text.UNIFORM_COLOUR).set(v); }

    private textValue = "Hello, world!";

    get text() { return this.textValue; }

    // @mesh-update
    set text(value) {
        this.textValue = value;
        this.updateMesh();
    }
}
