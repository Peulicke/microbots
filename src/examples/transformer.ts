import { Vec3, Bot, World } from "../core";

const s: Vec3.Vec3[] = [
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

const e: Vec3.Vec3[] = [
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

const start: World.World = {
    bots: s.map(
        (pos): Bot.Bot =>
            Bot.newBot({
                pos: pos
            })
    ),
    time: 0
};

const end: World.World = {
    bots: e.map(
        (pos): Bot.Bot =>
            Bot.newBot({
                pos: pos
            })
    ),
    time: 0
};

const example: { title: string; start: World.World; end: World.World } = {
    title: "Transformer",
    start: start,
    end: end
};

export default example;
