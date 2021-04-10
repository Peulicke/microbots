import * as Vec3 from "./Vec3";
import * as Bot from "./Bot";
import * as World from "./World";
import { estimateTime } from "./Dynamic";

const average = (start: World.World, end: World.World, t1: number, t2: number): World.World => {
    const result = World.newWorld();
    result.bots = start.bots.map((b, i) => Bot.average(b, end.bots[i], t1, t2));
    result.time = (start.time + end.time) / 2;
    return result;
};

const gradient = (
    animation: World.World[],
    dt: number,
    connections: number[][][],
    neighbors: number[][][]
): Vec3.Vec3[][] => {
    const result = [...Array(animation.length)].map(() =>
        [...Array(animation[0].bots.length)].map(() => Vec3.newVec3(0, 0, 0))
    );
    const displacements = animation.map(() => [...Array(3 * animation[0].bots.length)].map(() => 0));
    for (let i = 0; i < animation.length; ++i) {
        const before = animation[Math.max(i - 1, 0)];
        const after = animation[Math.min(i + 1, animation.length - 1)];
        displacements[i] = World.displacement(before, after, dt, animation[i], connections[i], neighbors[i]);
    }
    for (let i = 1; i < animation.length; ++i) {
        const beforeBefore = animation[Math.max(i - 2, 0)];
        const before = animation[i - 1];
        const after = animation[Math.min(i + 1, animation.length - 1)];
        const afterAfter = animation[Math.min(i + 2, animation.length - 1)];
        result[i] = World.gradient(
            displacements[i - 1],
            displacements[i],
            displacements[Math.min(i + 1, animation.length - 1)],
            beforeBefore,
            before,
            after,
            afterAfter,
            dt,
            animation[i],
            neighbors[i],
            i / (animation.length - 1)
        );
    }
    return result;
};

const optimize = (animation: World.World[], dt: number): void => {
    const n = 200;
    const maxIter = Math.floor(n / animation.length);
    if (maxIter === 0) return;
    const acc = 1 / animation.length;
    const vel = animation.map(world => world.bots.map(() => Vec3.newVec3(0, 0, 0)));
    const connections = animation.map(world => World.connections(world));
    const neighbors = animation.map((world, i) => world.bots.map((_, j) => World.neighbors(world, connections[i], j)));
    for (let iter = 0; iter < maxIter; ++iter) {
        World.setOffset(1 + 40 / ((1 + iter / maxIter) * animation.length));
        let g = gradient(animation, dt, connections, neighbors);
        g = g.map(world => world.map(v => Vec3.multiplyScalar(v, -acc / (1e-4 + Vec3.length(v)))));
        animation.map((world, i) => {
            if (i <= 1 || i >= animation.length - 2) return;
            world.bots.map((bot, j) => {
                const target = bot.target(i / (animation.length - 1));
                if (target !== undefined) {
                    bot.pos = Vec3.clone(target);
                    return;
                }
                vel[i][j] = Vec3.add(vel[i][j], g[i][j]);
                vel[i][j] = Vec3.multiplyScalar(vel[i][j], 0.9);
                bot.pos = Vec3.add(bot.pos, vel[i][j]);
            });
        });
    }
};

const subdivide = (animation: World.World[]): World.World[] => {
    const result = [...Array(animation.length * 2 - 3)];
    result[0] = animation[0];
    result[result.length - 1] = animation[animation.length - 1];
    for (let i = 0; i < animation.length - 2; ++i) result[1 + 2 * i] = animation[1 + i];
    for (let i = 2; i < result.length - 2; i += 2)
        result[i] = average(result[i - 1], result[i + 1], (i - 2) / (result.length - 3), i / (result.length - 3));
    return result;
};

const contract = (animation: World.World[], dt: number): void => {
    const n = 1000;
    const maxIter = Math.floor(n / animation.length);
    if (maxIter === 0) return;
    const connections = animation.map(world => World.connections(world));
    for (let iter = 0; iter < maxIter; ++iter) {
        for (let time = 2; time < animation.length - 2; ++time) {
            const beforeBefore = animation[time - 2];
            const before = animation[time - 1];
            const world = animation[time];
            const after = animation[time + 1];
            const afterAfter = animation[time + 2];
            const originalPos = world.bots.map((bot, i) =>
                Bot.interpolate(
                    bot,
                    (time - 1) / (animation.length - 3),
                    dt,
                    beforeBefore.bots[i].pos,
                    before.bots[i].pos,
                    after.bots[i].pos,
                    afterAfter.bots[i].pos
                )
            );
            world.bots.map((a, i) => {
                a.pos[1] += (0.1 * (0.5 - a.pos[1])) / connections[time][i].length;
                connections[time][i].map(j => {
                    if (i >= j) return;
                    const b = world.bots[j];
                    const d = Vec3.sub(b.pos, a.pos);
                    const l = Vec3.length(d);
                    const l1 = l - 1;
                    const dn = Vec3.multiplyScalar(
                        d,
                        ((l1 > 0 ? 0.3 / (connections[time][i].length + connections[time][j].length) : 1) * l1) / l
                    );
                    const m = a.weight + b.weight;
                    Vec3.addEq(a.pos, Vec3.multiplyScalar(dn, b.weight / m));
                    Vec3.subEq(b.pos, Vec3.multiplyScalar(dn, a.weight / m));
                });
            });
            world.bots.map((bot, i) => {
                const target = bot.target((time - 1) / (animation.length - 3));
                if (target !== undefined) {
                    bot.pos = Vec3.clone(target);
                    return;
                }
                const w = Math.pow(0, bot.weight / dt);
                bot.pos = Vec3.multiplyScalar(bot.pos, w);
                Vec3.addEq(bot.pos, Vec3.multiplyScalar(originalPos[i], 1 - w));
            });
        }
    }
};

export const createAnimation = (
    beforeBefore: World.World,
    before: World.World,
    after: World.World,
    afterAfter: World.World,
    resolution: number
): World.World[] => {
    let result = [beforeBefore, before, after, afterAfter];
    let dt = estimateTime(beforeBefore, before, after, afterAfter);
    dt = 30;
    const change = after.time - dt - before.time;
    before.time += change;
    beforeBefore.time += change;
    const m = resolution * dt;
    const n = Math.log2(m);
    for (let i = 0; i < n; ++i) {
        console.log(`${i} subdivisions`);
        dt /= 2;
        result = subdivide(result);
        contract(result, dt);
        optimize(result, dt);
    }
    console.log("done");
    return result.slice(1, result.length - 1);
};
