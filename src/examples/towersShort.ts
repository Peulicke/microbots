import { Vec3 } from "../core";
import { createExample } from "./utils";

const r = 5;
const h = 5;

const tower = (pos: Vec3.Vec3): Vec3.Vec3[] => [...Array(h)].map((_, i) => Vec3.add(pos, [0, i, 0]));

const s: Vec3.Vec3[] = [...tower([r, 0.5, 0]), ...tower([-r, 0.5, 0]), [r, h + 0.5, 0]];

const e: Vec3.Vec3[] = [...tower([r, 0.5, 0]), ...tower([-r, 0.5, 0]), [-r, h + 0.5, 0]];

export default createExample("Short towers", [], s, e);
