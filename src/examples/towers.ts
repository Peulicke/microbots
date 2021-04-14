import { Vec3, Bot, World } from "../core";

const start: Vec3.Vec3[] = [
    [2, 0.5, 0],
    [2, 1.5, 0],
    [2, 2.5, 0],
    [2, 3.5, 0],
    [2, 4.5, 0],
    [-2, 0.5, 0],
    [-2, 1.5, 0],
    [-2, 2.5, 0],
    [-2, 3.5, 0],
    [-2, 4.5, 0],
    [2, 5.5, 0]
];
const end: Vec3.Vec3[] = [
    [2, 0.5, 0],
    [2, 1.5, 0],
    [2, 2.5, 0],
    [2, 3.5, 0],
    [2, 4.5, 0],
    [-2, 0.5, 0],
    [-2, 1.5, 0],
    [-2, 2.5, 0],
    [-2, 3.5, 0],
    [-2, 4.5, 0],
    [-2, 5.5, 0]
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
    title: "Towers",
    world: world
};

export default example;
