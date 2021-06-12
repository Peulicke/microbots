import { Vec3 } from "../core";
import { createExample } from "./utils";

const pryramid = (m: number, pos: Vec3.Vec3): Vec3.Vec3[] => {
    if (m === 0) return [Vec3.clone(pos)];
    const n = m - 1;
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

const s = pryramid(3, [0, 0.5, 0]);

const e = box([0, 0.5, 0], [50, 1, 20]);

export default createExample(
    "Pyramid to plane",
    [],
    s.sort((a, b) => a[0] - b[0]),
    e.sort((a, b) => a[0] - b[0])
);
