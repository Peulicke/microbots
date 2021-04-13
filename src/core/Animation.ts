import * as Vec3 from "./Vec3";
import * as Bot from "./Bot";
import * as World from "./World";

const avgWeight = (a: Bot.Bot, b: Bot.Bot, w: number): Bot.Bot => {
    const pos = Vec3.add(Vec3.multiplyScalar(a.pos, 1 - w), Vec3.multiplyScalar(b.pos, w));
    return { ...a, pos: pos };
};

const averageWeight = (start: World.World, end: World.World, t1: number, t2: number, w: number): World.World => {
    const result = World.newWorld();
    result.bots = start.bots.map((b, i) => avgWeight(b, end.bots[i], w));
    result.time = (start.time + end.time) / 2;
    return result;
};

const average = (start: World.World, end: World.World, t1: number, t2: number): World.World =>
    averageWeight(start, end, t1, t2, 0.5);

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
    const acc = 0.2 / animation.length;
    const vel = animation.map(world => world.bots.map(() => Vec3.newVec3(0, 0, 0)));
    const connections = animation.map(world => World.connections(world));
    const neighbors = animation.map((world, i) => world.bots.map((_, j) => World.neighbors(world, connections[i], j)));
    for (let iter = 0; iter < maxIter; ++iter) {
        World.setOffset(1.5);
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

const subdivideNoBounds = (animation: World.World[]): World.World[] => {
    const result = [...Array(animation.length * 2 - 1)];
    for (let i = 0; i < animation.length; ++i) result[2 * i] = animation[i];
    for (let i = 1; i < result.length - 1; i += 2)
        result[i] = average(result[i - 1], result[i + 1], (i - 1) / (result.length - 1), (i + 1) / (result.length - 1));
    return result;
};

const subdivide = (animation: World.World[]): World.World[] => [
    animation[0],
    ...subdivideNoBounds(animation.slice(1, animation.length - 1)),
    animation[animation.length - 1]
];

const rescaleNoBounds = (animation: World.World[], n: number): World.World[] => {
    const result = [...Array(n)];
    const ratio = (animation.length - 1) / (result.length - 1);
    for (let i = 0; i < result.length; ++i) {
        const j = i * ratio;
        const j1 = Math.min(Math.floor(j), animation.length - 2);
        const j2 = j1 + 1;
        const w = j - j1;
        result[i] = averageWeight(
            animation[j1],
            animation[j2],
            j1 / (animation.length - 1),
            j2 / (animation.length - 1),
            w
        );
    }
    return result;
};

const rescale = (animation: World.World[], n: number): World.World[] => [
    animation[0],
    ...rescaleNoBounds(animation.slice(1, animation.length - 1), n - 2),
    animation[animation.length - 1]
];

const dist = (a: Bot.Bot, b: Bot.Bot): number => Vec3.length(Vec3.sub(b.pos, a.pos));

const isValidConnection = (
    world: World.World,
    connections: number[][],
    neighbors: number[][],
    i: number,
    j: number
): boolean => {
    for (let k = 0; k < world.bots.length; ++k) {
        if (k === i) continue;
        if (k === j) continue;
        if (
            dist(world.bots[i], world.bots[k]) < 5 &&
            dist(world.bots[i], world.bots[j]) > dist(world.bots[k], world.bots[j])
        )
            return false;
        if (
            dist(world.bots[j], world.bots[k]) < 5 &&
            dist(world.bots[i], world.bots[j]) > dist(world.bots[i], world.bots[k])
        )
            return false;
    }
    return true;
};

const resolveOverlap = (world: World.World): void => {
    const connections = World.connections(world);
    for (let iter = 0; iter < 10; ++iter) {
        world.bots.forEach(bot => {
            bot.pos[1] = Math.max(bot.pos[1], 0.5);
        });
        connections.forEach((list, i) => {
            list.forEach(j => {
                if (i >= j) return;
                const d = Vec3.sub(world.bots[j].pos, world.bots[i].pos);
                const dLength = Vec3.length(d);
                if (dLength > 1) return;
                const n = Vec3.multiplyScalar(d, (1 - dLength) / dLength / 2);
                Vec3.subEq(world.bots[i].pos, n);
                Vec3.addEq(world.bots[j].pos, n);
            });
        });
    }
};

const contract = (world: World.World): void => {
    const frac = 0.1;
    for (let iter = 0; iter < 5; ++iter) {
        const connections = World.connections(world);
        const neighbors = world.bots.map((_, i) => World.neighbors(world, connections, i));
        const validConnections: [number, number][] = [];
        connections.forEach((list, i) => {
            list.forEach(j => {
                if (i >= j) return;
                if (!isValidConnection(world, connections, neighbors, i, j)) return;
                validConnections.push([i, j]);
            });
        });
        validConnections.forEach(([i, j]) => {
            const d = Vec3.sub(world.bots[j].pos, world.bots[i].pos);
            const dLength = Vec3.length(d);
            if (dLength < 1) return;
            const n = Vec3.multiplyScalar(d, frac * ((1 - dLength) / dLength / 2));
            Vec3.subEq(world.bots[i].pos, n);
            Vec3.addEq(world.bots[j].pos, n);
        });
    }
};

const minimizeAcceleration = (animation: World.World[], dt: number): void => {
    const frac = 0.5;
    for (let iter = 0; iter < 10; ++iter) {
        for (let i = 2; i < animation.length - 2; ++i) {
            animation[i].bots.forEach((bot, j) => {
                const p = Bot.interpolate(
                    bot,
                    (i - 1) / (animation.length - 3),
                    dt,
                    animation[i - 2].bots[j].pos,
                    animation[i - 1].bots[j].pos,
                    animation[i + 1].bots[j].pos,
                    animation[i + 2].bots[j].pos
                );
                bot.pos = Vec3.add(Vec3.multiplyScalar(bot.pos, frac), Vec3.multiplyScalar(p, 1 - frac));
            });
        }
    }
};

const avgAcc = (prev: World.World, now: World.World, next: World.World, dt: number): number => {
    let sum = 0;
    for (let i = 0; i < now.bots.length; ++i) {
        const v1 = Vec3.multiplyScalar(Vec3.sub(now.bots[i].pos, prev.bots[i].pos), 1 / dt);
        const v2 = Vec3.multiplyScalar(Vec3.sub(next.bots[i].pos, now.bots[i].pos), 1 / dt);
        const a = Vec3.multiplyScalar(Vec3.sub(v2, v1), 1 / dt);
        sum += Vec3.dot(a, a);
    }
    return Math.sqrt(sum / now.bots.length);
};

const maxAvgAcc = (animation: World.World[], dt: number): number =>
    Math.max(
        ...animation.slice(1, animation.length - 1).map((world, i) => avgAcc(animation[i], world, animation[i + 2], dt))
    );

export const createAnimation = (
    beforeBefore: World.World,
    before: World.World,
    after: World.World,
    afterAfter: World.World
): World.World[] => {
    let result = [beforeBefore, before, after, afterAfter];
    const dt = 1;
    const maxAvgAccLimit = 0.1;
    let lower = result.length;
    let upper = result.length;
    for (let iter = 0; iter < 8 && maxAvgAcc(result, dt) > maxAvgAccLimit; ++iter) {
        lower = result.length;
        console.log(iter);
        result = subdivide(result);
        for (let i = 2; i < result.length - 2; ++i) contract(result[i]);
        optimize(result, dt);
        minimizeAcceleration(result, dt);
        result.map(world => resolveOverlap(world));
        upper = result.length;
    }
    while (upper - lower >= 2) {
        const middle = Math.round((lower + upper) / 2);
        const res = rescale(result, middle);
        if (maxAvgAcc(res, dt) > maxAvgAccLimit) lower = middle;
        else upper = middle;
    }
    result = rescale(result, upper);
    console.log("done");
    return result.slice(1, result.length - 1);
};
