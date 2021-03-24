export interface Char {
    id: number;
    width: number;
    height: number;
    xoffset: number;
    yoffset: number;
    xadvance: number;
    chnl: number;
    x: number;
    y: number;
    page: number;
}

export interface FontInfo {
    face: string;
    size: number;
    bold: number;
    italic: number;
    charset: string[];
    unicode: number;
    stretchH: number;
    smooth: number;
    aa: number;
    padding: [number, number, number, number];
    spacing: [number, number];
}

export interface FontCommon {
    lineHeight: number;
    base: number;
    scaleW: number;
    scaleH: number;
    pages: number;
    packed: number;
    alphaChnl: number;
    redChnl: number;
    greenChnl: number;
    blueChnl: number;
}

export default interface Font {
    pages: string[];
    chars: Char[];
    info: FontInfo;
    common: FontCommon;
    kernings: unknown[];
}
