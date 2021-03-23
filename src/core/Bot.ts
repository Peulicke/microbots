import * as Vec3 from "./Vec3";
import { minAcc } from "./utils";

type Target = (t: number) => Vec3.Vec3 | undefined;

export type Bot = {
    pos: Vec3.Vec3;
    target: Target;
    weight: number;
};

export const newBot = (config: { pos?: Vec3.Vec3; target?: Target; weight?: number }): Bot => ({
    pos: config.pos || Vec3.newVec3(0, 0, 0),
    target: config.target || (() => undefined),
    weight: config.weight || 1
});

type SpacetimePoint = {
    pos: Vec3.Vec3;
    time: number;
};

const findTarget = (bot: Bot, t: number, limit: SpacetimePoint): SpacetimePoint => {
    const dir = limit.time > t ? 1 : -1;
    const dt = 0.01;
    let target, time;
    for (time = t; (limit.time - time) * dir <= 0; time += dt * dir) {
        target = bot.target(time);
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
    return minAcc(t - 2 * dt, t - dt, t + dt, t + 2 * dt, p1, p2, p4, p5, t);
};
