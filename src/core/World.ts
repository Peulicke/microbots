import update from "immutability-helper";
import { pipe } from "ts-pipe-compose";
import {
    matrix,
    Matrix,
    transpose,
    subtract,
    dot,
    multiply,
    divide,
    subset,
    index,
    zeros,
    range,
    add,
    inv
} from "mathjs";
import { Bot, setPos } from "./Bot";

export type World = { readonly bots: Bot[]; readonly edges: Matrix };

export const newWorld = (): World => ({ bots: [], edges: matrix([]) });

export const setBots = (bots: Bot[]) => (world: World): World => update(world, { bots: { $set: bots } });

export const initEdges = (world: World): World => {
    const list = [...Array(world.bots.length)].map(() => 1);
    return update(world, {
        edges: { $set: matrix(list.map(() => list)) }
    });
};

export const outerProduct = (a: Matrix, b: Matrix): Matrix =>
    multiply(transpose(matrix([a.toArray() as number[]])), matrix([b.toArray() as number[]]));

export const stiffness = (d: Matrix): Matrix => divide(outerProduct(d, d), -dot(d, d)) as Matrix;

export const stiffnessDerivative = (dim: number) => (d: Matrix): Matrix => {
    const dir = [0, 0, 0];
    dir[dim] = 1;
    const e = transpose(matrix([dir]));
    const de = multiply(e, matrix([d.toArray() as number[]]));
    const k = stiffness(d);
    return divide(add(add(de, transpose(de)), multiply(k, 2 * d.get([dim]))), -dot(d, d)) as Matrix;
};

export const stiffnessPair = (a: Bot, b: Bot, edge: number): Matrix =>
    multiply(stiffness(subtract(b.pos, a.pos) as Matrix), edge);

export const stiffnessPairDerivative = (bot: Bot) => (dim: number) => (a: Bot, b: Bot, edge: number): Matrix => {
    if (a !== bot && b !== bot)
        return matrix([
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]);
    const derivative = multiply(stiffnessDerivative(dim)(subtract(b.pos, a.pos) as Matrix), edge);
    if (a === bot) return multiply(derivative, -1);
    return derivative;
};

export const removeFixedFromVector = (world: World) => (vector: Matrix): Matrix =>
    matrix((vector.toArray() as number[]).filter((_, i) => !world.bots[Math.floor(i / 3)].fixed));

export const removeFixedFromMatrix = (world: World) => (mat: Matrix): Matrix =>
    matrix(
        (mat.toArray() as number[][])
            .filter((_, i) => !world.bots[Math.floor(i / 3)].fixed)
            .map(vector => removeFixedFromVector(world)(matrix(vector)).toArray() as number[])
    );

export const assembleMatrix = (world: World, fun: (a: Bot, b: Bot, edge: number) => Matrix): Matrix => {
    const size = 3 * world.edges.size()[0];
    let result = matrix(zeros(size, size));
    (world.edges.toArray() as number[][]).forEach((row, i) => {
        row.forEach((edge, j) => {
            if (i === j) return;
            const s = fun(world.bots[i], world.bots[j], edge);
            const ri = range(3 * i, 3 * i + 3);
            const rj = range(3 * j, 3 * j + 3);
            const ii = index(ri, ri);
            const ij = index(ri, rj);
            result = subset(result, ii, subtract(subset(result, ii), s));
            result = subset(result, ij, add(subset(result, ij), s));
        });
    });
    return removeFixedFromMatrix(world)(result);
};

export const stiffnessMatrix = (world: World): Matrix => assembleMatrix(world, stiffnessPair);

export const stiffnessMatrixDerivative = (bot: Bot) => (dim: number) => (world: World): Matrix =>
    assembleMatrix(world, stiffnessPairDerivative(bot)(dim));

export const forceMatrix = (world: World): Matrix =>
    removeFixedFromVector(world)(matrix(world.bots.map(bot => [0, -bot.weight, 0]).flat()));

export const compliance = (world: World): Matrix => {
    const f = forceMatrix(world);
    const k = stiffnessMatrix(world);
    const ft = transpose(f);
    const kInv = inv(k);
    return multiply(multiply(ft, kInv), f);
};

const mult = (b: Matrix) => (a: Matrix) => multiply(a, b);

export const complianceDerivative = (bot: Bot) => (dim: number) => (world: World): number => {
    const f = forceMatrix(world);
    const dk = stiffnessMatrixDerivative(bot)(dim)(world);
    const k = stiffnessMatrix(world);
    const ft = transpose(f);
    const kInv = inv(k);
    return -((pipe(ft, mult(kInv), mult(dk), mult(kInv), mult(f)) as unknown) as number);
};

export const optimizeStep = (stepSize: number) => (world: World): World => {
    const newBots = world.bots.map(bot => {
        if (bot.fixed) return bot;
        const d = [0, 1, 2].map(dim => complianceDerivative(bot)(dim)(world));
        return setPos(subtract(bot.pos, multiply(matrix(d), stepSize)) as Matrix)(bot);
    });
    return setBots(newBots)(world);
};

export const optimize = (world: World): World => {
    let result = world;
    for (let i = 0; i < 100; ++i) {
        result = optimizeStep(0.1)(result);
        console.log(result.bots[3].pos.toArray());
    }
    return result;
};
