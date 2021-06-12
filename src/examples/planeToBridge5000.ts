import { Vec3 } from "../core";
import { createExample } from "./utils";

const pryramid = (n: number, pos: Vec3.Vec3): Vec3.Vec3[] => {
    if (n === 0) return [Vec3.clone(pos)];
    --n;
    const a = 3 ** n;
    const d1 = Vec3.multiplyScalar([1, 0, 0], a);
    const d2 = Vec3.multiplyScalar([1 / 2, 0, Math.sqrt(3) / 2], a);
    const d3 = Vec3.multiplyScalar([1 / 2, Math.sqrt(2 / 3), 1 / (2 * Math.sqrt(3))], a);
    const c = Vec3.multiplyScalar(Vec3.add(d1, d2), 2 / 3);
    const p = Vec3.sub(pos, c);
    return [
        ...pryramid(n, p),
        ...pryramid(n, Vec3.add(p, d1)),
        ...pryramid(n, Vec3.add(p, d2)),
        ...pryramid(n, Vec3.add(p, d3)),
        ...pryramid(n, Vec3.add(p, Vec3.add(d1, d1))),
        ...pryramid(n, Vec3.add(p, Vec3.add(d1, d2))),
        ...pryramid(n, Vec3.add(p, Vec3.add(d2, d2))),
        ...pryramid(n, Vec3.add(p, Vec3.add(d1, d3))),
        ...pryramid(n, Vec3.add(p, Vec3.add(d2, d3))),
        ...pryramid(n, Vec3.add(p, Vec3.add(d3, d3)))
    ];
};

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
    const h1 = 12;
    const h2 = 27;
    const r = 42;
    const w = 12;
    const xw = 3;
    const zw = 2;
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

const s = box([0, 0.5, 0], [50, 2, 50]);

const e = bridge();

export default createExample(
    "Plane to bridge",
    [],
    s.sort((a, b) => a[0] - b[0]),
    e.sort((a, b) => a[0] - b[0])
);
