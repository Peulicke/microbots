import { Vec3, Bot, World } from "../core";

const start: Vec3.Vec3[] = [
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
const end: Vec3.Vec3[] = [
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
    title: "Crane",
    world: world
};

export default example;
