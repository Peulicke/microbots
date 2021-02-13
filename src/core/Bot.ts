import { Vec3, newVec3, add, divideScalar } from "./Vec3";

export type Bot = {
    pos: Vec3;
    weight: number;
    fixed: boolean;
};

export const newBot = (): Bot => ({
    pos: newVec3(0, 0, 0),
    weight: 1,
    fixed: false
});

export const setPos = (pos: Vec3) => (bot: Bot): Bot => {
    bot.pos = pos;
    return bot;
};

export const setWeight = (weight: number) => (bot: Bot): Bot => {
    bot.weight = weight;
    return bot;
};

export const setFixed = (fixed: boolean) => (bot: Bot): Bot => {
    bot.fixed = fixed;
    return bot;
};

export const average = (a: Bot, b: Bot): Bot => {
    const result = newBot();
    result.pos = divideScalar(add(a.pos, b.pos), 2);
    result.weight = (a.weight + b.weight) / 2;
    result.fixed = a.fixed || b.fixed;
    return result;
};
