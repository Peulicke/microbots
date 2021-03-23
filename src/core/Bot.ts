import * as Vec3 from "./Vec3";
import { Spacetime, minAcc } from "./utils";

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

const findTarget = (bot: Bot, t: number, limit: Spacetime): Spacetime => {
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
    return minAcc(
        { pos: p1, time: t - 2 * dt },
        { pos: p2, time: t - dt },
        { pos: p4, time: t + dt },
        { pos: p5, time: t + 2 * dt },
        t
    );
};
