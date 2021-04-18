import { Vec3 } from "../core";
import { coordsToWorld } from "./utils";

const r = 6;
const h = 3;
const w = 2;

const floor = () =>
    [...Array(2 * r + 1)]
        .map((_, i) => [...Array(2 * r + 1)].map((_, j): [number, number, number] => [i - r, 0.5, j - r]))
        .flat()
        .filter(p => Math.abs(p[0] + p[2]) < w);

const s: Vec3.Vec3[] = [
    ...floor(),
    ...[...Array(h)].map((_, i): [number, number, number] => [-r, i + 1.5, r]),
    ...[...Array(h)].map((_, i): [number, number, number] => [r, i + 1.5, -r]),
    [-r, h + 1.5, r]
];

const e: Vec3.Vec3[] = [
    ...floor(),
    ...[...Array(h)].map((_, i): [number, number, number] => [-r, i + 1.5, r]),
    ...[...Array(h)].map((_, i): [number, number, number] => [r, i + 1.5, -r]),
    [r, h + 1.5, -r]
];

export default {
    title: "Floor transport",
    start: coordsToWorld(s),
    end: coordsToWorld(e)
};
