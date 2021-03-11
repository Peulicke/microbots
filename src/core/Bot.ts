import * as Vec3 from "./Vec3";

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

export const average = (a: Bot, b: Bot): Bot =>
    newBot({ ...a, pos: Vec3.multiplyScalar(Vec3.add(a.pos, b.pos), 1 / 2) });
