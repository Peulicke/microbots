import { Vec3 } from "../core";
import { createExample } from "./utils";

const r = 10;
const h1 = 7;
const h2 = 12;
const k = 6;

const pillar = (pos: Vec3.Vec3, height: number): Vec3.Vec3[] =>
    [...Array(height)].map((_, i) => Vec3.add(pos, [0, i, 0]));

const bar = (pos: Vec3.Vec3, width: number): Vec3.Vec3[] => [...Array(width)].map((_, i) => Vec3.add(pos, [i, 0, 0]));

const barZ = (pos: Vec3.Vec3, width: number): Vec3.Vec3[] => [...Array(width)].map((_, i) => Vec3.add(pos, [0, 0, i]));

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

const platform = (pos: Vec3.Vec3, w: number, h: number): Vec3.Vec3[] => [
    ...pillar(Vec3.add(pos, [-w, 0, 0]), h),
    ...pillar(Vec3.add(pos, [w, 0, 0]), h),
    ...bar(Vec3.add(pos, [-w + 1, h - 1, 0]), 2 * w - 1)
];

const platformZ = (pos: Vec3.Vec3, w: number, h: number): Vec3.Vec3[] => [
    ...pillar(Vec3.add(pos, [0, 0, -w]), h),
    ...pillar(Vec3.add(pos, [0, 0, w]), h),
    ...barZ(Vec3.add(pos, [0, h - 1, -w + 1]), w - 1),
    ...barZ(Vec3.add(pos, [0, h - 1, 1]), w - 1)
];

const f: Vec3.Vec3[] = [
    ...platform([-r, 0.5, 0], 1, h1),
    ...platform([r, 0.5, 0], 1, h1),
    ...platform([0, h1 + 0.5, 0], r + 1, h2 - h1),
    ...platformZ([0, 0.5, 0], 2, h2)
];

const s: Vec3.Vec3[] = pillar([-r, h1 + 0.5, 0], h2 - h1 - 2);
const e: Vec3.Vec3[] = pillar([r, h1 + 0.5, 0], h2 - h1 - 2);

export default createExample("Brachiation", f, s, e);
