import * as Vec3 from "./Vec3";
import * as Bot from "./Bot";
import * as World from "./World";

const getSqrAccHalf = (pos: Vec3.Vec3, vel: Vec3.Vec3, t: number): number => {
    const acc = Vec3.multiplyScalar(Vec3.sub(pos, Vec3.multiplyScalar(vel, t)), 2 / t ** 2);
    return Vec3.dot(acc, acc);
};

const getSqrAcc = (a: Bot.Bot, b: Bot.Bot, c: Bot.Bot, d: Bot.Bot, dt1: number, dt2: number, t: number): number => {
    const epsilon = 1e-10;
    const p = Vec3.multiplyScalar(Vec3.add(b.pos, c.pos), 0.5);
    const v1 = Vec3.multiplyScalar(Vec3.sub(b.pos, a.pos), 1 / (dt1 + epsilon));
    const v2 = Vec3.multiplyScalar(Vec3.sub(d.pos, c.pos), 1 / (dt2 + epsilon));
    const v = Vec3.multiplyScalar(Vec3.add(v1, v2), 0.5);
    return getSqrAccHalf(Vec3.sub(c.pos, p), Vec3.sub(v2, v), t / 2);
};

const getMeanAcc = (
    beforeWorldStart: World.World,
    worldStart: World.World,
    worldEnd: World.World,
    afterWorldEnd: World.World,
    t: number
): number => {
    let sum = 0;
    for (let i = 0; i < worldStart.bots.length; ++i) {
        sum += getSqrAcc(
            beforeWorldStart.bots[i],
            worldStart.bots[i],
            worldEnd.bots[i],
            afterWorldEnd.bots[i],
            worldStart.time - beforeWorldStart.time,
            afterWorldEnd.time - worldEnd.time,
            t
        );
    }
    return Math.sqrt(sum / worldStart.bots.length);
};

export const estimateTime = (
    beforeWorldStart: World.World,
    worldStart: World.World,
    worldEnd: World.World,
    afterWorldEnd: World.World
): number => {
    const meanAcc = 0.2;
    let lower = 0.01;
    let upper = 1000;
    for (let i = 0; i < 20; ++i) {
        const center = (lower + upper) / 2;
        const ma = getMeanAcc(beforeWorldStart, worldStart, worldEnd, afterWorldEnd, center);
        if (ma > meanAcc) lower = center;
        else upper = center;
    }
    return (lower + upper) / 2;
};
