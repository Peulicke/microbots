import * as Vec3 from "./Vec3";
import { minAcc } from "./utils";

export type Bot = {
    pos: Vec3.Vec3;
};

export const newBot = (config: { pos?: Vec3.Vec3 }): Bot => ({
    pos: config.pos || Vec3.newVec3(0, 0, 0)
});

export const average = (a: Bot, b: Bot, t1: number, t2: number): Bot => {
    const t = (t1 + t2) / 2;
    const prev = { pos: a.pos, time: t1 };
    const next = { pos: b.pos, time: t2 };
    if (next.time - prev.time < 1e-10) return newBot({ ...a, pos: next.pos });
    const w1 = (next.time - t) / (next.time - prev.time);
    const w2 = (t - prev.time) / (next.time - prev.time);
    const pos = Vec3.add(Vec3.multiplyScalar(prev.pos, w1), Vec3.multiplyScalar(next.pos, w2));
    return { ...a, pos: pos };
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
