import {Transformable} from "./transform";
import Drawer from "../Drawer";
import {Sizable} from "./sizable";

export interface TransformableDrawer extends Transformable, Sizable, Drawer {}
