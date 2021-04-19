import * as Vec3 from "./Vec3";
import { minAcc } from "./utils";

export type Bot = {
    pos: Vec3.Vec3;
};

export const interpolate = (
    bot: Bot,
    t: number,
    dt: number,
    p1: Vec3.Vec3,
    p2: Vec3.Vec3,
    p4: Vec3.Vec3,
    p5: Vec3.Vec3
): Vec3.Vec3 => {
    const prev = { pos: p1, time: t - 2 * dt };
    const next = { pos: p5, time: t + 2 * dt };
    if (next.time - prev.time < 1e-10) return next.pos;
    p1 = prev.pos;
    p5 = next.pos;
    if (prev.time > t - dt) p2 = prev.pos;
    if (next.time < t + dt) p4 = next.pos;
    return minAcc(
        { pos: p1, time: t - 2 * dt },
        { pos: p2, time: t - dt },
        { pos: p4, time: t + dt },
        { pos: p5, time: t + 2 * dt },
        t
    );
};
