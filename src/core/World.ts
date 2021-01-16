import update from "immutability-helper";
import { Bot } from "./Bot";

export type World = { bots: Bot[] };

export const newWorld = (): World => ({ bots: [] });

export const setBots = (bots: Bot[]) => (world: World): World => update(world, { bots: { $set: bots } });

export const optimize = (world: World): World => {
    return world;
};
