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
): Vec3.Vec3 =>
    minAcc(
        { pos: p1, time: t - 2 * dt },
        { pos: p2, time: t - dt },
        { pos: p4, time: t + dt },
        { pos: p5, time: t + 2 * dt },
        t
    );
