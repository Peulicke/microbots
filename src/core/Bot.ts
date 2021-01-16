import update from "immutability-helper";
import { Vector3 } from "three";

export type Bot = {
    readonly pos: Vector3;
    readonly weight: number;
    readonly fixed: boolean;
};

export const newBot = (): Bot => ({
    pos: new Vector3(0, 0, 0),
    weight: 1,
    fixed: false
});

export const setPos = (pos: Vector3) => (bot: Bot): Bot => update(bot, { pos: { $set: pos } });

export const setWeight = (weight: number) => (bot: Bot): Bot => update(bot, { weight: { $set: weight } });

export const setFixed = (fixed: boolean) => (bot: Bot): Bot => update(bot, { fixed: { $set: fixed } });
