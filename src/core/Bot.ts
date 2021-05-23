import * as BoundingBox from "./BoundingBox";
import * as Vec3 from "./Vec3";

import { minAcc } from "./utils";

export type Bot = {
    pos: Vec3.Vec3;
    fixed: boolean;
};

export const clone = (bot: Bot): Bot => ({ pos: Vec3.clone(bot.pos), fixed: bot.fixed });

export const interpolate = (
    t: number,
    dt: number,
    p1: Vec3.Vec3,
    p2: Vec3.Vec3,
    p4: Vec3.Vec3,
    p5: Vec3.Vec3
): Vec3.Vec3 =>
    minAcc(
        { pos: p1, time: t - 2 * dt },
        { pos: p2, time: t - dt },
        { pos: p4, time: t + dt },
        { pos: p5, time: t + 2 * dt },
        t
    );

export const boundingBox = (bot: Bot): BoundingBox.BoundingBox => {
    const r: Vec3.Vec3 = [0.5, 0.5, 0.5];
    return {
        min: Vec3.sub(bot.pos, r),
        max: Vec3.add(bot.pos, r)
    };
};
