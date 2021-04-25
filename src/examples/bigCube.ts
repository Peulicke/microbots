import { Vec3 } from "../core";
import { createExample } from "./utils";

const s = [...Array(8)].map((_, i) => [...Array(8)].map((_, j) => Vec3.newVec3(i - 3.5, 0.5, j - 3.5))).flat();
const e = [...Array(4)]
    .map((_, i) => [...Array(4)].map((_, j) => [...Array(4)].map((_, k) => Vec3.newVec3(i - 1.5, k + 0.5, j - 1.5))))
    .flat()
    .flat();

export default createExample("Big cube", [], s, e);
