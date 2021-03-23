import { Vec3, Bot, World } from "../core";

const start: Vec3.Vec3[] = [
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
const end: Vec3.Vec3[] = [
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

const world: World.World = {
    bots: start.map(
        (pos, i): Bot.Bot =>
            Bot.newBot({
                pos: pos,
                target: t => {
                    if (t > 0.9999) return end[i];
                },
                weight: 1
            })
    )
};

const example: { title: string; world: World.World } = {
    title: "Cube",
    world: world
};

export default example;
