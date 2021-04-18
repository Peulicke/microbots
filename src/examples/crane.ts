import { Vec3 } from "../core";
import { coordsToWorld } from "./utils";

const s: Vec3.Vec3[] = [
    [1, 0.5, 0],
    [0, 0.5, 0],
    [-1, 0.5, 0],
    [0, 1.5, 0],
    [0, 2.5, 0],
    [0, 3.5, 0],
    [1, 3.5, 0],
    [2, 3.5, 0],
    [3, 3.5, 0],
    [3, 0.5, 0]
];
const e: Vec3.Vec3[] = [
    [1, 0.5, 0],
    [0, 0.5, 0],
    [-1, 0.5, 0],
    [0, 1.5, 0],
    [0, 2.5, 0],
    [0, 3.5, 0],
    [1, 3.5, 0],
    [2, 3.5, 0],
    [3, 3.5, 0],
    [3, 2.5, 0]
];

export default {
    title: "Crane",
    start: coordsToWorld(s),
    end: coordsToWorld(e)
};
