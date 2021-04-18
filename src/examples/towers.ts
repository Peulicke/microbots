import { Vec3 } from "../core";
import { coordsToWorld } from "./utils";

const s: Vec3.Vec3[] = [
    [2, 0.5, 0],
    [2, 1.5, 0],
    [2, 2.5, 0],
    [2, 3.5, 0],
    [2, 4.5, 0],
    [-2, 0.5, 0],
    [-2, 1.5, 0],
    [-2, 2.5, 0],
    [-2, 3.5, 0],
    [-2, 4.5, 0],
    [2, 5.5, 0]
];
const e: Vec3.Vec3[] = [
    [2, 0.5, 0],
    [2, 1.5, 0],
    [2, 2.5, 0],
    [2, 3.5, 0],
    [2, 4.5, 0],
    [-2, 0.5, 0],
    [-2, 1.5, 0],
    [-2, 2.5, 0],
    [-2, 3.5, 0],
    [-2, 4.5, 0],
    [-2, 5.5, 0]
];

export default {
    title: "Towers",
    start: coordsToWorld(s),
    end: coordsToWorld(e)
};
