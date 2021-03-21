import { Vec3, Bot, World } from "../core";

const n = 10;

const arc = [Vec3.newVec3(0, 0, 0)];

for (let i = 0; i < n; ++i) {
    const angle = (Math.PI / 2) * (i / n);
    arc.push(Vec3.newVec3(arc[i][0] + Math.cos(angle), arc[i][1] - Math.sin(angle), 0));
}

for (let i = 1; i < n + 1; ++i) {
    arc.push(Vec3.newVec3(-arc[i][0], arc[i][1], 0));
}

const m = Math.min(...arc.map(p => p[1]));

arc.forEach((_, i) => (arc[i][1] = arc[i][1] - m + 0.5));

const start = [
    ...[...Array(n + 1)].map((_, i) => Vec3.newVec3(i, 0.5, 0)),
    ...[...Array(n)].map((_, i) => Vec3.newVec3(-i - 1, 0.5, 0))
];

const world: World.World = {
    bots: start.map(
        (pos, i): Bot.Bot =>
            Bot.newBot({
                pos: pos,
                target: t => {
                    if (t > 0.9999) return arc[i];
                },
                weight: 0.01
            })
    )
};

const example: { title: string; world: World.World } = {
    title: "Arc",
    world: world
};

export default example;
