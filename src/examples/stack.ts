import { Vec3 } from "../core";
import { createExample } from "./utils";

const s = [...[...Array(5)].map((_, i): Vec3.Vec3 => [i, 0.5, 0])];

const e = [...[...Array(5)].map((_, i): Vec3.Vec3 => [0, 0.5 + i, 0])];

export default createExample("Stack", [], s, e);
