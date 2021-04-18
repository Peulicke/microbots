import { Vec3, Bot, World } from "../core";

const s: Vec3.Vec3[] = [
    [-1.5, 0.5, -1.5],
    [-0.5, 0.5, -1.5],
    [0.5, 0.5, -1.5],
    [1.5, 0.5, -1.5],
    [-1.5, 0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [1.5, 0.5, -0.5],
    [-1.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [1.5, 0.5, 0.5],
    [-1.5, 0.5, 1.5],
    [-0.5, 0.5, 1.5],
    [0.5, 0.5, 1.5],
    [1.5, 0.5, 1.5]
];

const e: Vec3.Vec3[] = [
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0.5, 0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [-0.5, 1.5, -0.5],
    [0.5, 1.5, -0.5],
    [0.5, 1.5, 0.5],
    [-0.5, 1.5, 0.5],
    [-0.5, 2.5, -0.5],
    [0.5, 2.5, -0.5],
    [0.5, 2.5, 0.5],
    [-0.5, 2.5, 0.5],
    [-0.5, 3.5, -0.5],
    [0.5, 3.5, -0.5],
    [0.5, 3.5, 0.5],
    [-0.5, 3.5, 0.5]
];

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
    title: "Cube",
    start: start,
    end: end
};

export default example;
