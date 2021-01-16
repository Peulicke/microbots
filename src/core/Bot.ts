import update from "immutability-helper";
import { matrix, Matrix } from "mathjs";

export type Bot = {
    readonly pos: Matrix;
    readonly weight: number;
    readonly fixed: boolean;
};

export const newBot = (): Bot => ({
    pos: matrix([0, 0, 0]),
    weight: 1,
    fixed: false
});

export const setPos = (pos: Matrix) => (bot: Bot): Bot => update(bot, { pos: { $set: pos } });

export const setWeight = (weight: number) => (bot: Bot): Bot => update(bot, { weight: { $set: weight } });

export const setFixed = (fixed: boolean) => (bot: Bot): Bot => update(bot, { fixed: { $set: fixed } });
