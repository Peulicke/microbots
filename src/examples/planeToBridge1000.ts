import { Vec3 } from "../core";
import { createExample } from "./utils";

const box = (pos: Vec3.Vec3, size: Vec3.Vec3): Vec3.Vec3[] =>
    [...Array(size[0])]
        .map((_, i) =>
            [...Array(size[1])].map((_, j) =>
                [...Array(size[2])].map((_, k) => Vec3.add(pos, [i - (size[0] - 1) / 2, j, k - (size[2] - 1) / 2]))
            )
        )
        .flat()
        .flat();

const parabola = (from: Vec3.Vec3, to: Vec3.Vec3): Vec3.Vec3[] => {
    const d = Vec3.sub(to, from);
    if (Vec3.length(d) < 1) return [to];
    const dh: Vec3.Vec3 = [d[0], 0, d[2]];
    const diff = Vec3.normalize(Vec3.add(Vec3.normalize(dh), [0, 2 * (d[1] / Vec3.length(dh)), 0]));
    return [to, ...parabola(from, Vec3.sub(to, diff))];
};

const bridge = (): Vec3.Vec3[] => {
    const h1 = 6;
    const h2 = 13;
    const r = 12;
    const w = 7;
    const xw = 2;
    const zw = 1;
    return [
        ...box([-2 * r - xw * (3 / 2), 0.5, 0], [xw, h1, w]),
        ...box([-r - xw / 2, 0.5, 0], [xw, h1, w]),
        ...box([-r - xw / 2, 0.5 + h1 + 1, (w - zw) / 2], [xw, h2 - 1, zw]),
        ...box([-r - xw / 2, 0.5 + h1 + 1, -(w - zw) / 2], [xw, h2 - 1, zw]),
        ...box([-r - xw / 2, 0.5 + h1 + h2, 0], [xw, 1, w]),
        ...box([2 * r + xw * (3 / 2), 0.5, 0], [xw, h1, w]),
        ...box([r + xw / 2, 0.5, 0], [xw, h1, w]),
        ...box([r + xw / 2, 0.5 + h1 + 1, (w - zw) / 2], [xw, h2 - 1, zw]),
        ...box([r + xw / 2, 0.5 + h1 + 1, -(w - zw) / 2], [xw, h2 - 1, zw]),
        ...box([r + xw / 2, 0.5 + h1 + h2, 0], [xw, 1, w]),
        ...box([0, 0.5 + h1, 0], [4 * (r + xw), 1, w]),
        ...parabola([0, 0.5 + h1 + 1, (w - 1) / 2], [r - 0.5, h1 + h2 + 0.5, (w - 1) / 2]),
        ...parabola([0, 0.5 + h1 + 1, (w - 1) / 2], [-r + 0.5, h1 + h2 + 0.5, (w - 1) / 2]),
        ...parabola(
            [-2 * r - xw * (3 / 2) - 1, 0.5 + h1 + 1, (w - 1) / 2],
            [-r - xw - 0.5, h1 + h2 + 0.5, (w - 1) / 2]
        ),
        ...parabola([2 * r + xw * (3 / 2) + 1, 0.5 + h1 + 1, (w - 1) / 2], [r + xw + 0.5, h1 + h2 + 0.5, (w - 1) / 2]),
        ...parabola([0, 0.5 + h1 + 1, -(w - 1) / 2], [r - 0.5, h1 + h2 + 0.5, -(w - 1) / 2]),
        ...parabola([0, 0.5 + h1 + 1, -(w - 1) / 2], [-r + 0.5, h1 + h2 + 0.5, -(w - 1) / 2]),
        ...parabola(
            [-2 * r - xw * (3 / 2) - 1, 0.5 + h1 + 1, -(w - 1) / 2],
            [-r - xw - 0.5, h1 + h2 + 0.5, -(w - 1) / 2]
        ),
        ...parabola([2 * r + xw * (3 / 2) + 1, 0.5 + h1 + 1, -(w - 1) / 2], [r + xw + 0.5, h1 + h2 + 0.5, -(w - 1) / 2])
    ];
};

const s = box([0, 0.5, 0], [50, 1, 20]);

const e = bridge();

export default createExample(
    "Plane to bridge",
    [],
    s.sort((a, b) => a[0] - b[0]),
    e.sort((a, b) => a[0] - b[0])
);
