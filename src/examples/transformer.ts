import { Vec3, Bot, World } from "../core";

const start: Vec3.Vec3[] = [
    [0, 0.5, 1],
    [0, 0.5, -1],

    [0, 1.5, 1],
    [0, 1.5, 0],
    [0, 1.5, -1],

    [1, 1.5, 1],
    [1, 1.5, 0],
    [1, 1.5, -1],

    [2, 1.5, 1],
    [2, 1.5, 0],
    [2, 1.5, -1],

    [3, 1.5, 1],
    [3, 1.5, 0],
    [3, 1.5, -1],

    [3, 0.5, 1],
    [3, 0.5, -1]
];
const end: Vec3.Vec3[] = [
    [0, 0.5, 1],
    [0, 0.5, -1],

    [0, 1.5, 0.8],
    [0, 3.5, 0],
    [0, 1.5, -0.8],

    [0, 2.5, 0.6],
    [0, 4.5, 0],
    [0, 2.5, -0.6],

    [0, 5.5, 1],
    [0, 5.5, 0],
    [0, 5.5, -1],

    [0, 4.7, 1.6],
    [0, 6.5, 0],
    [0, 4.7, -1.6],

    [0, 3.7, 2],
    [0, 3.7, -2]
];

const world: World.World = {
    bots: start.map(
        (pos, i): Bot.Bot =>
            Bot.newBot({
                pos: pos,
                target: end[i],
                weight: 1
            })
    ),
    time: 0
};

const example: { title: string; world: World.World } = {
    title: "Transformer",
    world: world
};

export default example;
