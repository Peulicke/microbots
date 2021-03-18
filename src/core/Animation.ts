import * as Vec3 from "./Vec3";
import * as Bot from "./Bot";
import * as World from "./World";

const average = (start: World.World, end: World.World): World.World => {
    const result = World.newWorld();
    result.bots = start.bots.map((b, i) => Bot.average(b, end.bots[i]));
    return result;
};

const gradient = (animation: World.World[], dt: number, connections: number[][][]): Vec3.Vec3[][] => {
    const result = [...Array(animation.length)].map(() =>
        [...Array(animation[0].bots.length)].map(() => Vec3.newVec3(0, 0, 0))
    );
    const displacements = [...Array(animation.length)].map(() => [...Array(3 * animation[0].bots.length)].map(() => 0));
    for (let i = 0; i < animation.length; ++i) {
        const before = animation[Math.max(i - 1, 0)];
        const after = animation[Math.min(i + 1, animation.length - 1)];
        displacements[i] = World.displacement(before, after, dt, animation[i], connections[i]);
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
            connections[i]
        );
    }
    return result;
};

const optimize = (animation: World.World[], dt: number): void => {
    const n = 1000;
    const acc = 0.02;
    const vel = animation.map(world => world.bots.map(() => Vec3.newVec3(0, 0, 0)));
    let connections = animation.map(world => World.connections(world));
    for (let iter = 0; iter < n / animation.length; ++iter) {
        if (iter > 0 && iter % 10 === 0) connections = animation.map(world => World.connections(world));
        const y = (iter * animation.length) / n;
        const x = (1 + y) * animation.length;
        World.setOffset(1 + 20 / x);
        let g = gradient(animation, dt, connections);
        g = g.map(world => world.map(v => Vec3.multiplyScalar(v, -acc / (1e-4 + Vec3.length(v)))));
        animation.map((world, i) =>
            world.bots.map((bot, j) => {
                const target = bot.target(i / (animation.length - 1));
                if (target !== undefined) {
                    bot.pos = target;
                    return;
                }
                vel[i][j] = Vec3.add(vel[i][j], g[i][j]);
                vel[i][j] = Vec3.multiplyScalar(vel[i][j], 0.9);
                bot.pos = Vec3.add(bot.pos, vel[i][j]);
            })
        );
    }
};

const subdivide = (animation: World.World[]): World.World[] => {
    const result = [...Array(animation.length * 2 - 1)];
    for (let i = 0; i < animation.length; ++i) result[2 * i] = animation[i];
    for (let i = 1; i < result.length - 1; i += 2) result[i] = average(result[i - 1], result[i + 1]);
    return result;
};

export const createAnimation = (before: World.World, after: World.World, n: number): World.World[] => {
    let result = [before, after];
    let dt = 100;
    for (let i = 0; i < n; ++i) {
        dt /= 2;
        result = subdivide(result);
        optimize(result, dt);
    }
    return result;
};
