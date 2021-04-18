import { Vec3, Bot, World } from "../core";

const s: Vec3.Vec3[] = [
    [1, 0.5, 0],
    [0, 0.5, 0],
    [-1, 0.5, 0],
    [0, 1.5, 0],
    [0, 2.5, 0],
    [0, 3.5, 0],
    [1, 3.5, 0],
    [2, 3.5, 0],
    [3, 3.5, 0],
    [3, 0.5, 0]
];
const e: Vec3.Vec3[] = [
    [1, 0.5, 0],
    [0, 0.5, 0],
    [-1, 0.5, 0],
    [0, 1.5, 0],
    [0, 2.5, 0],
    [0, 3.5, 0],
    [1, 3.5, 0],
    [2, 3.5, 0],
    [3, 3.5, 0],
    [3, 2.5, 0]
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
    title: "Crane",
    start: start,
    end: end
};

export default example;
