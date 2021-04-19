import * as Vec3 from "./Vec3";
import * as Bot from "./Bot";
import * as World from "./World";

const avgWeight = (a: Bot.Bot, b: Bot.Bot, w: number): Bot.Bot => {
    const pos = Vec3.add(Vec3.multiplyScalar(a.pos, 1 - w), Vec3.multiplyScalar(b.pos, w));
    return { ...a, pos: pos };
};

const averageWeight = (start: World.World, end: World.World, w: number): World.World => {
    const result = World.newWorld();
    result.bots = start.bots.map((b, i) => avgWeight(b, end.bots[i], w));
    return result;
};

const average = (start: World.World, end: World.World): World.World => averageWeight(start, end, 0.5);

const gradient = (
    animation: World.World[],
    dt: number,
    g: number,
    m: number,
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
        displacements[i] = World.displacement(before, after, dt, g, m, animation[i], connections[i], neighbors[i]);
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

const optimize = (animation: World.World[], dt: number, g: number, m: number): void => {
    const n = 200;
    const maxIter = Math.floor(n / animation.length);
    if (maxIter === 0) return;
    const acc = 0.2 / animation.length;
    const vel = animation.map(world => world.bots.map(() => Vec3.newVec3(0, 0, 0)));
    const connections = animation.map(world => World.connections(world));
    const neighbors = animation.map((world, i) => world.bots.map((_, j) => World.neighbors(world, connections[i], j)));
    for (let iter = 0; iter < maxIter; ++iter) {
        let grad = gradient(animation, dt, g, m, connections, neighbors);
        grad = grad.map(world => world.map(v => Vec3.multiplyScalar(v, -acc / (1e-4 + Vec3.length(v)))));
        animation.map((world, i) => {
            if (i <= 1 || i >= animation.length - 2) return;
            world.bots.map((bot, j) => {
                vel[i][j] = Vec3.add(vel[i][j], grad[i][j]);
                vel[i][j] = Vec3.multiplyScalar(vel[i][j], 0.9);
                bot.pos = Vec3.add(bot.pos, vel[i][j]);
            });
        });
    }
};

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
            dist(world.bots[i], world.bots[j]) > world.bots[i].pos[1] + 0.5 &&
            dist(world.bots[i], world.bots[j]) > world.bots[j].pos[1] + 0.5
        )
            return false;
        if (
            dist(world.bots[i], world.bots[j]) > dist(world.bots[i], world.bots[k]) &&
            dist(world.bots[i], world.bots[j]) > dist(world.bots[k], world.bots[j])
        )
            return false;
        if (
            dist(world.bots[i], world.bots[j]) > dist(world.bots[j], world.bots[k]) &&
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
    const frac = 0.2;
    for (let iter = 0; iter < 10; ++iter) {
        world.bots.forEach((a, i) => {
            if (
                world.bots.some((b, j) => {
                    if (i === j) return false;
                    const d = Vec3.sub(a.pos, b.pos);
                    const hD = Vec3.newVec3(d[0], 0, d[2]);
                    const hDistSqr = Vec3.dot(hD, hD);
                    const vDist = d[1];
                    if (a.pos[1] + 0.5 > b.pos[1] + 0.5 && 10 * vDist > hDistSqr) return true;
                    return false;
                })
            )
                return;
            a.pos[1] += frac * (0.5 - a.pos[1]);
        });
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
    for (let iter = 0; iter < 40; ++iter) {
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

const maxAcc = (prev: World.World, now: World.World, next: World.World, dt: number): number => {
    let result = 0;
    for (let i = 0; i < now.bots.length; ++i) {
        const v1 = Vec3.multiplyScalar(Vec3.sub(now.bots[i].pos, prev.bots[i].pos), 1 / dt);
        const v2 = Vec3.multiplyScalar(Vec3.sub(next.bots[i].pos, now.bots[i].pos), 1 / dt);
        const a = Vec3.multiplyScalar(Vec3.sub(v2, v1), 1 / dt);
        result = Math.max(result, Vec3.length(a));
    }
    return result;
};

export const createAnimation = (
    beforeBefore: World.World,
    before: World.World,
    after: World.World,
    afterAfter: World.World
): World.World[] => {
    let result = [beforeBefore, before, after, afterAfter];
    const dt = 1;
    const g = 1;
    const m = 1;
    const maxAccLimit = 0.2;
    for (let iter = 0; iter < 10; ++iter) {
        const tooFast = result.map((world, i) => {
            if (i <= 1 || i >= result.length - 1) return false;
            return maxAcc(result[i - 1], world, result[i + 1], dt) > maxAccLimit;
        });
        if (!tooFast.some(x => x)) break;
        const resultPrev = [...result];
        result = [result[0]];
        tooFast.forEach((tf, i) => {
            if (i === 0) return;
            if (tf) result.push(average(result[result.length - 1], resultPrev[i]));
            result.push(resultPrev[i]);
        });
        console.log(iter, result.length);
        for (let i = 2; i < result.length - 2; ++i) contract(result[i]);
        optimize(result, dt, g, m);
        minimizeAcceleration(result, dt);
        result.map(world => resolveOverlap(world));
    }
    console.log("done");
    return result.slice(1, result.length - 1);
};
