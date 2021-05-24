import { Vec3 } from "../core";
import { createExample } from "./utils";

const s: Vec3.Vec3[] = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 2, 0],
    [0, 0, 1],
    [0, 1, 1],
    [0, 2, 1],
    [-1, 0, 0],
    [-1, 1, 0],
    [-1, 2, 0],
    [-1, 0, 1],
    [-1, 1, 1],
    [-1, 2, 1]
];

const e: Vec3.Vec3[] = [
    [0, 0, 0],
    [1, 0, 0],
    [2, 0, 0],
    [0, 0, 1],
    [1, 0, 1],
    [2, 0, 1],
    [0, 1, 0],
    [1, 1, 0],
    [2, 1, 0],
    [0, 1, 1],
    [1, 1, 1],
    [2, 1, 1]
];

export default createExample(
    "Rolling cube",
    [],
    s.map(v => Vec3.add(v, [0, 0.5, 0])),
    e.map(v => Vec3.add(v, [0, 0.5, 0]))
);
