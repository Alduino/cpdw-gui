import Program from "./Program";

export default interface GraphicsContext {
    createProgram(name: string): Program;
}
