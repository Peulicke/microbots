import * as BoundingBox from "./BoundingBox";
import * as Vec3 from "./Vec3";

export type Bot = {
    pos: Vec3.Vec3;
    fixed: boolean;
};

export const clone = (bot: Bot): Bot => ({ pos: Vec3.clone(bot.pos), fixed: bot.fixed });

export const boundingBox = (bot: Bot): BoundingBox.BoundingBox => {
    const r: Vec3.Vec3 = [0.5, 0.5, 0.5];
    return {
        min: Vec3.sub(bot.pos, r),
        max: Vec3.add(bot.pos, r)
    };
};
