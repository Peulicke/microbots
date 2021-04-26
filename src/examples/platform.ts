import { Vec3 } from "../core";
import { createExample } from "./utils";

const h = 4;

const pillar = (pos: Vec3.Vec3, height: number): Vec3.Vec3[] =>
    [...Array(height)].map((_, i) => Vec3.add(pos, [0, i + 0.5, 0]));

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

const c = (pos: Vec3.Vec3, height: number): Vec3.Vec3[] => [
    ...pillar(Vec3.add(pos, [1, 0, 1]), height),
    ...pillar(Vec3.add(pos, [1, 0, -1]), height),
    ...pillar(Vec3.add(pos, [-1, 0, -1]), height),
    ...pillar(Vec3.add(pos, [-1, 0, 1]), height)
];

const platform = (pos: Vec3.Vec3): Vec3.Vec3[] => [...c(pos, h), ...p(Vec3.add(pos, [0, h, 0]))];

const f: Vec3.Vec3[] = [...platform([0, 0, 0])];

const s: Vec3.Vec3[] = pillar([0, 0, 0], h);
const e: Vec3.Vec3[] = pillar([0, h + 1, 0], h);

export default createExample("Platform", f, s, e);
