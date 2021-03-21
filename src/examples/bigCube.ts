import { Vec3, Bot, World } from "../core";

const start = [...Array(8)].map((_, i) => [...Array(8)].map((_, j) => Vec3.newVec3(i - 3.5, 0.5, j - 3.5))).flat();
const end = [...Array(4)]
    .map((_, i) => [...Array(4)].map((_, j) => [...Array(4)].map((_, k) => Vec3.newVec3(i - 1.5, k + 0.5, j - 1.5))))
    .flat()
    .flat();

const world: World.World = {
    bots: start.map(
        (pos, i): Bot.Bot =>
            Bot.newBot({
                pos: pos,
                target: t => {
                    if (t > 0.9999) return end[i];
                },
                weight: 0.01
            })
    )
};

const example: { title: string; world: World.World } = {
    title: "Big cube",
    world: world
};

export default example;
