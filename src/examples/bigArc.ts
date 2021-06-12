import { Vec3 } from "../core";
import { createExample } from "./utils";

const n = 40;

const arc = [Vec3.newVec3(0, 0, 0)];

for (let i = 0; i < n; ++i) {
    const angle = (Math.PI / 2) * (i / n);
    arc.push(Vec3.newVec3(arc[i][0] + Math.cos(angle), arc[i][1] - Math.sin(angle), 0));
}

for (let i = 1; i < n + 1; ++i) {
    arc.push(Vec3.newVec3(-arc[i][0], arc[i][1], 0));
}

const m = Math.min(...arc.map(p => p[1]));

arc.forEach((_, i) => (arc[i][1] = arc[i][1] - m + 0.5));

const s = [
    ...[...Array(n + 1)].map((_, i) => Vec3.newVec3(Math.ceil(i / 2) + 4, 0.5, (i % 2) - 0.5)),
    ...[...Array(n)].map((_, i) => Vec3.newVec3(-Math.floor(i / 2) - 1 - 4, 0.5, (i % 2) - 0.5))
];

export default createExample("Big arc", [], s, arc);
