import { Vec3 } from "../core";
import { createExample } from "./utils";

const f: Vec3.Vec3[] = [
    [0, 0.5, 1],
    [0, 0.5, 0],
    [0, 0.5, -1],
    [0, 1.5, 1],
    [0, 1.5, 0],
    [0, 1.5, -1],
    [0, 2.5, 1],
    [0, 2.5, 0],
    [0, 2.5, -1]
];

const s: Vec3.Vec3[] = [[2, 0.5, 0]];

const e: Vec3.Vec3[] = [[-2, 0.5, 0]];

export default createExample("Wall", f, s, e);
