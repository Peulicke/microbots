import * as Vec3 from "./Vec3";
import { Spacetime, minAcc } from "./utils";

type Target = Vec3.Vec3 | undefined;

export type Bot = {
    pos: Vec3.Vec3;
    vel: Vec3.Vec3;
    target: Target;
    weight: number;
};

export const newBot = (config: { pos?: Vec3.Vec3; vel?: Vec3.Vec3; target?: Target; weight?: number }): Bot => ({
    pos: config.pos || Vec3.newVec3(0, 0, 0),
    vel: config.vel || Vec3.newVec3(0, 0, 0),
    target: config.target,
    weight: config.weight || 1
});

const findTarget = (bot: Bot, t: number, limit: Spacetime): Spacetime => {
    const dir = limit.time > t ? 1 : -1;
    const dt = 0.01;
    let target, time;
    for (time = t; (limit.time - time) * dir <= 0; time += dt * dir) {
        target = bot.target;
        if (target !== undefined) return { pos: target, time: time };
    }
    return limit;
};

export const average = (a: Bot, b: Bot, t1: number, t2: number): Bot => {
    const t = (t1 + t2) / 2;
    const prev = findTarget(a, t, { pos: a.pos, time: t1 });
    const next = findTarget(a, t, { pos: b.pos, time: t2 });
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
    const prev = findTarget(bot, t, { pos: p1, time: t - 2 * dt });
    const next = findTarget(bot, t, { pos: p5, time: t + 2 * dt });
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
