import * as Vec3 from "./Vec3";
import * as Mat3 from "./Mat3";
import { outerProduct } from "./utils";
import { SparseMat, ldiv } from "./conjugateGradientSparse";
import * as Bot from "./Bot";

export type World = { bots: Bot.Bot[] };

export const newWorld = (): World => ({ bots: [] });

export const setBots = (bots: Bot.Bot[]) => (world: World): World => {
    world.bots = bots;
    return world;
};

const offset = 1.5;
let slack = 2;
export const setSlack = (s: number): void => {
    slack = s;
};
const friction = 0.1;

export const edgeStrength = (d: number): number => {
    if (d < offset - slack / 2) return 1;
    if (d > offset + slack / 2) return 0;
    return (2 * (d + slack - offset) * (offset + slack / 2 - d) ** 2) / slack ** 3;
};

export const edgeStrengthGround = (d: number): number => edgeStrength(d) + 1e-4;

export const stiffness = (d: Vec3.Vec3): Mat3.Mat3 => {
    const l = Vec3.length(d);
    d = Vec3.multiplyScalar(d, Math.sqrt(edgeStrength(l)) / l);
    return outerProduct(d, d);
};

export const stiffnessGround = (d: Vec3.Vec3): Mat3.Mat3 =>
    Mat3.multiplyScalar(outerProduct(d, d), edgeStrengthGround(Vec3.length(d)) / Vec3.dot(d, d));

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

export const stiffnessPairDerivative = (a: Bot.Bot, dim: number, b: Bot.Bot): Mat3.Mat3 =>
    stiffnessDerivative(dim)(Vec3.sub(a.pos, b.pos));

export const stiffnessMatrix = (world: World): SparseMat => {
    const result: SparseMat = [];
    for (let i = 0; i < world.bots.length; ++i) {
        const sx = stiffnessGround(Vec3.newVec3(world.bots[i].pos[1] + 0.5, 0, 0));
        const sy = stiffnessGround(Vec3.newVec3(0, world.bots[i].pos[1] + 0.5, 0));
        const sz = stiffnessGround(Vec3.newVec3(0, 0, world.bots[i].pos[1] + 0.5));
        for (let k = 0; k < 3; ++k) {
            for (let l = 0; l < 3; ++l) {
                result.push([3 * i + k, 3 * i + l, (sx[k][l] + sz[k][l]) * friction + sy[k][l]]);
            }
        }
    }
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = i + 1; j < world.bots.length; ++j) {
            if (Vec3.length(Vec3.sub(world.bots[i].pos, world.bots[j].pos)) > offset + slack / 2) continue;
            const s = stiffnessPair(world.bots[i], world.bots[j]);
            for (let k = 0; k < 3; ++k) {
                for (let l = 0; l < 3; ++l) {
                    result[9 * i + 3 * k + l][2] += s[k][l];
                    result[9 * j + 3 * k + l][2] += s[k][l];
                    result.push([3 * i + k, 3 * j + l, -s[k][l]]);
                    result.push([3 * j + k, 3 * i + l, -s[k][l]]);
                }
            }
        }
    }
    return result;
};

export const forceMatrix = (before: World, after: World, dt: number) => (world: World): number[] => {
    const result = [...Array(world.bots.length * 3)].map(() => 0);
    world.bots.forEach((bot, i) => {
        for (let j = 0; j < 3; ++j) {
            const v1 = (world.bots[i].pos[j] - before.bots[i].pos[j]) / dt;
            const v2 = (after.bots[i].pos[j] - world.bots[i].pos[j]) / dt;
            const acc = (v2 - v1) / dt;
            result[3 * i + j] = ((j === 1 ? -1 : 0) - acc) * bot.weight;
        }
    });
    return result;
};

export const displacement = (before: World, after: World, dt: number) => (world: World): number[] => {
    const f = forceMatrix(before, after, dt)(world);
    const k = stiffnessMatrix(world);
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
    const udku = [...Array(world.bots.length)].map(() => [0, 1, 2].map(() => 0));
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
            const vi = Vec3.newVec3(u[3 * i], u[3 * i + 1], u[3 * i + 2]);
            const d = Vec3.dot(vi, Mat3.apply(Mat3.add(Mat3.add(sx, sy), sz), vi));
            udku[i][dim] += d;
            for (let j = i + 1; j < world.bots.length; ++j) {
                if (Vec3.length(Vec3.sub(world.bots[j].pos, world.bots[i].pos)) > offset + slack / 2) continue;
                const s = stiffnessPairDerivative(world.bots[i], dim, world.bots[j]);
                const vj = Vec3.newVec3(u[3 * j], u[3 * j + 1], u[3 * j + 2]);
                const diff =
                    Vec3.dot(Vec3.sub(vi, vj), Mat3.apply(s, vi)) - Vec3.dot(Vec3.sub(vi, vj), Mat3.apply(s, vj));
                udku[i][dim] += diff;
                udku[j][dim] -= diff;
            }
        }
    }
    const result = [...Array(world.bots.length)].map(() => Vec3.newVec3(0, 0, 0));
    for (let i = 0; i < world.bots.length; ++i) {
        for (let dim = 0; dim < 3; ++dim) {
            result[i][dim] =
                -udku[i][dim] + 2 * ((-uBefore[3 * i + dim] + 2 * u[3 * i + dim] - uAfter[3 * i + dim]) / dt ** 2);
        }
    }
    const overlapPenalty = 1000;
    for (let i = 0; i < world.bots.length; ++i) {
        if (world.bots[i].pos[1] > 0.5) continue;
        const l = world.bots[i].pos[1] + 0.5;
        result[i][1] += 2 * overlapPenalty * (2 * (l - 2));
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
