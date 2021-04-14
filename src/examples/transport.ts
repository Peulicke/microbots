import { Vec3, Bot, World } from "../core";

const pillar = (pos: Vec3.Vec3) => {
    const list: Vec3.Vec3[] = [
        [0, 0, 0],
        [1, 0, 0],
        [-1, 0, 0],
        [0, 0, 1],
        [0, 0, -1],
        [0, 1, 0],
        [0, 2, 0],
        [0, 3, 0]
    ];
    return list.map((p: Vec3.Vec3) => Vec3.add(p, pos));
};

const space = 3;

const start: Vec3.Vec3[] = [
    ...pillar([space * 2, 0.5, -space * 2]),
    ...pillar([space, 0.5, -space]),
    ...pillar([0, 0.5, 0]),
    ...pillar([-space, 0.5, space]),
    ...pillar([-space * 2, 0.5, space * 2]),
    [-space * 2, 4.5, space * 2]
];

const end: Vec3.Vec3[] = [
    ...pillar([space * 2, 0.5, -space * 2]),
    ...pillar([space, 0.5, -space]),
    ...pillar([0, 0.5, 0]),
    ...pillar([-space, 0.5, space]),
    ...pillar([-space * 2, 0.5, space * 2]),
    [space * 2, 4.5, -space * 2]
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
    title: "Transport",
    world: world
};

export default example;
