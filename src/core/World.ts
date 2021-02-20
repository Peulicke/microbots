import * as Vec3 from "./Vec3";
import * as Mat3 from "./Mat3";
import { dot, outerProduct, numberArrayFromVec3Array, numberArrayFromMat3Array } from "./utils";
import { ldiv } from "./matrix";
import * as Bot from "./Bot";

export type World = { bots: Bot.Bot[] };

export const newWorld = (): World => ({ bots: [] });

export const setBots = (bots: Bot.Bot[]) => (world: World): World => {
    world.bots = bots;
    return world;
};

const power = 4;
const friction = 0.1;

export const edgeStrength = (d: number): number => 2 / (1 + Math.exp(power * (d - 1)));

export const stiffness = (d: Vec3.Vec3): Mat3.Mat3 =>
    Mat3.multiplyScalar(outerProduct(d, d), edgeStrength(Vec3.length(d)) / Vec3.dot(d, d));

export const stiffnessDerivative = (dim: number) => (d: Vec3.Vec3): Mat3.Mat3 => {
    const epsilon = 0.00001;
    const val = d[dim];
    const dPlus = Vec3.clone(d);
    dPlus[dim] = val + epsilon;
    const dMinus = Vec3.clone(d);
    dMinus[dim] = val - epsilon;
    const plus = stiffness(dPlus);
    const minus = stiffness(dMinus);
    return Mat3.multiplyScalar(Mat3.sub(plus, minus), 1 / (2 * epsilon));
};

export const stiffnessPair = (a: Bot.Bot, b: Bot.Bot): Mat3.Mat3 => {
    const d = Vec3.sub(b.pos, a.pos);
    return stiffness(d);
};

export const stiffnessPairDerivative = (bot: Bot.Bot) => (dim: number) => (a: Bot.Bot, b: Bot.Bot): Mat3.Mat3 => {
    if (a !== bot && b !== bot)
        return Mat3.newMat3(Vec3.newVec3(0, 0, 0), Vec3.newVec3(0, 0, 0), Vec3.newVec3(0, 0, 0));
    const derivative = stiffnessDerivative(dim)(Vec3.sub(b.pos, a.pos));
    if (a === bot) return derivative;
    return Mat3.multiplyScalar(derivative, -1);
};

export const removeFixedFromVector = (world: World) => (vector: Vec3.Vec3[]): Vec3.Vec3[] =>
    vector.map((v, i) => (world.bots[i].fixed ? Vec3.newVec3(0, 0, 0) : v));

export const removeFixedFromMatrix = (world: World) => (mat: Mat3.Mat3[][]): Mat3.Mat3[][] =>
    mat.map((vector, i) =>
        vector.map((v, j) =>
            world.bots[i].fixed || world.bots[j].fixed
                ? Mat3.newMat3(Vec3.newVec3(0, 0, 0), Vec3.newVec3(0, 0, 0), Vec3.newVec3(0, 0, 0))
                : v
        )
    );

export const stiffnessMatrix = (world: World): Mat3.Mat3[][] => {
    const result = world.bots.map(() =>
        world.bots.map(() => Mat3.newMat3(Vec3.newVec3(0, 0, 0), Vec3.newVec3(0, 0, 0), Vec3.newVec3(0, 0, 0)))
    );
    for (let i = 0; i < world.bots.length; ++i) {
        const sx = Mat3.multiplyScalar(stiffness(Vec3.newVec3(world.bots[i].pos[1] + 0.5, 0, 0)), friction);
        const sy = stiffness(Vec3.newVec3(0, world.bots[i].pos[1] + 0.5, 0));
        const sz = Mat3.multiplyScalar(stiffness(Vec3.newVec3(0, 0, world.bots[i].pos[1] + 0.5)), friction);
        result[i][i] = Mat3.add(result[i][i], sx);
        result[i][i] = Mat3.add(result[i][i], sy);
        result[i][i] = Mat3.add(result[i][i], sz);
    }
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const s = stiffnessPair(world.bots[i], world.bots[j]);
            result[i][i] = Mat3.add(result[i][i], s);
            result[i][j] = Mat3.sub(result[i][j], s);
        }
    }
    return removeFixedFromMatrix(world)(result);
};

export const acceleration = (before: World, after: World, dt: number) => (world: World): Vec3.Vec3[] =>
    world.bots.map((bot, i) => {
        const v1 = Vec3.divideScalar(Vec3.sub(world.bots[i].pos, before.bots[i].pos), dt);
        const v2 = Vec3.divideScalar(Vec3.sub(after.bots[i].pos, world.bots[i].pos), dt);
        return Vec3.divideScalar(Vec3.sub(v2, v1), dt);
    });

export const forceMatrix = (before: World, after: World, dt: number) => (world: World): Vec3.Vec3[] => {
    const acc = acceleration(before, after, dt)(world);
    return removeFixedFromVector(world)(
        world.bots.map((bot, i) => Vec3.multiplyScalar(Vec3.sub(Vec3.newVec3(0, -1, 0), acc[i]), bot.weight))
    );
};

export const displacement = (before: World, after: World, dt: number) => (world: World): number[] => {
    const f = numberArrayFromVec3Array(forceMatrix(before, after, dt)(world));
    const k = numberArrayFromMat3Array(stiffnessMatrix(world));
    return ldiv(k, f);
};

export const resolveCollisionStep = (world: World): World => {
    for (let i = 0; i < world.bots.length; ++i) {
        if (world.bots[i].fixed) continue;
        world.bots[i].pos[1] = Math.max(world.bots[i].pos[1], 0.5);
    }
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = i + 1; j < world.bots.length; ++j) {
            if (world.bots[i].fixed && world.bots[j].fixed) continue;
            const oneFixed = world.bots[i].fixed || world.bots[j].fixed;
            const d = Vec3.sub(world.bots[j].pos, world.bots[i].pos);
            const dist = Vec3.length(d);
            if (dist > 1) continue;
            const n = Vec3.multiplyScalar(d, (1 - dist) / (oneFixed ? 1 : 2) / dist);
            if (!world.bots[i].fixed) world.bots[i].pos = Vec3.sub(world.bots[i].pos, n);
            if (!world.bots[j].fixed) world.bots[j].pos = Vec3.add(world.bots[j].pos, n);
        }
    }
    return world;
};

export const resolveCollision = (world: World): World => {
    let result = world;
    for (let i = 0; i < 10; ++i) result = resolveCollisionStep(result);
    return result;
};

export const gradient = (uBefore: number[], u: number[], uAfter: number[]) => (
    beforeBefore: World,
    before: World,
    after: World,
    afterAfter: World,
    dt: number
) => (world: World): Vec3.Vec3[] => {
    const result = [...Array(world.bots.length)].map(() => Vec3.newVec3(0, 0, 0));
    const res = [...Array(world.bots.length)].map(() =>
        [0, 1, 2].map(() => [...Array(world.bots.length)].map(() => Vec3.newVec3(0, 0, 0)))
    );
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            const sx = Mat3.multiplyScalar(
                stiffnessDerivative(dim)(Vec3.newVec3(world.bots[i].pos[1] + 0.5, 0, 0)),
                friction
            );
            const sy = stiffnessDerivative(dim)(Vec3.newVec3(0, world.bots[i].pos[1] + 0.5, 0));
            const sz = Mat3.multiplyScalar(
                stiffnessDerivative(dim)(Vec3.newVec3(0, 0, world.bots[i].pos[1] + 0.5)),
                friction
            );
            const v = Vec3.newVec3(u[3 * i], u[3 * i + 1], u[3 * i + 2]);
            res[i][dim][i] = Vec3.add(res[i][dim][i], Mat3.apply(Mat3.add(Mat3.add(sx, sy), sz), v));
            for (let j = 0; j < world.bots.length; ++j) {
                if (i >= j) continue;
                const s = stiffnessPairDerivative(world.bots[i])(dim)(world.bots[i], world.bots[j]);
                const ss = Mat3.apply(s, Vec3.sub(Vec3.newVec3(u[3 * j], u[3 * j + 1], u[3 * j + 2]), v));
                res[i][dim][i] = Vec3.add(res[i][dim][i], ss);
                res[i][dim][j] = Vec3.sub(res[i][dim][j], ss);
                res[j][dim][j] = Vec3.add(res[j][dim][j], ss);
                res[j][dim][i] = Vec3.sub(res[j][dim][i], ss);
            }
        }
    }
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            const dku = numberArrayFromVec3Array(removeFixedFromVector(world)(res[i][dim]));
            result[i][dim] =
                -dot(u, dku) + 2 * ((-uBefore[3 * i + dim] + 2 * u[3 * i + dim] - uAfter[3 * i + dim]) / dt ** 2);
        }
    }
    const overlapPenalty = 1000;
    for (let i = 0; i < world.bots.length; ++i) {
        if (world.bots[i].pos[1] > 0.5) continue;
        const l = world.bots[i].pos[1] + 0.5;
        result[i][1] += 2 * overlapPenalty * ((2 * (l - 2)) / l);
    }
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = i + 1; j < world.bots.length; ++j) {
            let d = Vec3.sub(world.bots[j].pos, world.bots[i].pos);
            const l = Vec3.length(d);
            if (l > 1) continue;
            d = Vec3.multiplyScalar(d, overlapPenalty * ((2 * (l - 2)) / l));
            result[i] = Vec3.sub(result[i], d);
            result[j] = Vec3.add(result[j], d);
        }
    }
    for (let i = 0; i < world.bots.length; ++i) {
        const p1 = Vec3.multiplyScalar(beforeBefore.bots[i].pos, 2);
        const p2 = Vec3.multiplyScalar(before.bots[i].pos, -8);
        const p3 = Vec3.multiplyScalar(world.bots[i].pos, 12);
        const p4 = Vec3.multiplyScalar(after.bots[i].pos, -8);
        const p5 = Vec3.multiplyScalar(afterAfter.bots[i].pos, 2);
        const numerator = Vec3.add(Vec3.add(Vec3.add(Vec3.add(p1, p2), p3), p4), p5);
        result[i] = Vec3.add(result[i], Vec3.multiplyScalar(numerator, 100000 / dt ** 4));
    }
    return result;
};
