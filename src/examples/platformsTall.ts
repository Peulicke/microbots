import { Vec3 } from "../core";
import { createExample } from "./utils";

const r = 6;
const h = 5;

const pillar = (pos: Vec3.Vec3, height: number): Vec3.Vec3[] =>
    [...Array(height)].map((_, i) => Vec3.add(pos, [0, i, 0]));

const p = (pos: Vec3.Vec3): Vec3.Vec3[] => {
    const coords: Vec3.Vec3[] = [
        [0, 0.5, 1],
        [0, 0.5, 0],
        [0, 0.5, -1],
        [1, 0.5, 1],
        [1, 0.5, 0],
        [1, 0.5, -1],
        [-1, 0.5, 1],
        [-1, 0.5, 0],
        [-1, 0.5, -1]
    ];
    return coords.map(v => Vec3.add(v, pos));
};

const c = (pos: Vec3.Vec3): Vec3.Vec3[] => {
    const coords: Vec3.Vec3[] = [
        [1, 0.5, 1],
        [1, 0.5, -1],
        [-1, 0.5, 1],
        [-1, 0.5, -1]
    ];
    return coords.map(v => Vec3.add(v, pos));
};

const platform = (pos: Vec3.Vec3): Vec3.Vec3[] => [
    ...c(pos),
    ...c(Vec3.add(pos, [0, 1, 0])),
    ...c(Vec3.add(pos, [0, 2, 0])),
    ...c(Vec3.add(pos, [0, 3, 0])),
    ...c(Vec3.add(pos, [0, 4, 0])),
    ...p(Vec3.add(pos, [0, 5, 0]))
];

const f: Vec3.Vec3[] = [...platform([-r, 0, 0]), ...platform([r, 0, 0])];

const s: Vec3.Vec3[] = pillar([-r, 6.5, 0], h);
const e: Vec3.Vec3[] = pillar([r, 6.5, 0], h);

export default createExample("Tall platforms", f, s, e);
