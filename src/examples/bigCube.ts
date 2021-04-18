import { Vec3, Bot, World } from "../core";

const s = [...Array(8)].map((_, i) => [...Array(8)].map((_, j) => Vec3.newVec3(i - 3.5, 0.5, j - 3.5))).flat();
const e = [...Array(4)]
    .map((_, i) => [...Array(4)].map((_, j) => [...Array(4)].map((_, k) => Vec3.newVec3(i - 1.5, k + 0.5, j - 1.5))))
    .flat()
    .flat();

const start: World.World = {
    bots: s.map(
        (pos): Bot.Bot =>
            Bot.newBot({
                pos: pos,
                weight: 1
            })
    ),
    time: 0
};

const end: World.World = {
    bots: e.map(
        (pos): Bot.Bot =>
            Bot.newBot({
                pos: pos,
                weight: 1
            })
    ),
    time: 0
};

const example: { title: string; start: World.World; end: World.World } = {
    title: "Big cube",
    start: start,
    end: end
};

export default example;
