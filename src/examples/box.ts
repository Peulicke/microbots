import { Vec3 } from "../core";
import { createExample } from "./utils";

const s: Vec3.Vec3[] = [
    [-1.5, 0.5, -1.5],
    [-0.5, 0.5, -1.5],
    [0.5, 0.5, -1.5],
    [1.5, 0.5, -1.5],
    [-1.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [1.5, 0.5, -0.5],
    [-1.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [1.5, 0.5, 0.5],
    [-1.5, 0.5, 1.5],
    [-0.5, 0.5, 1.5],
    [0.5, 0.5, 1.5],
    [1.5, 0.5, 1.5]
];

const e: Vec3.Vec3[] = [
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, 1.5, -0.5],
    [0.5, 1.5, -0.5],
    [0.5, 1.5, 0.5],
    [-0.5, 1.5, 0.5],
    [-0.5, 2.5, -0.5],
    [0.5, 2.5, -0.5],
    [0.5, 2.5, 0.5],
    [-0.5, 2.5, 0.5],
    [-0.5, 3.5, -0.5],
    [0.5, 3.5, -0.5],
    [0.5, 3.5, 0.5],
    [-0.5, 3.5, 0.5]
];

export default createExample("Box", [], s, e);
