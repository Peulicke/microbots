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
    const array = list.map((_, i) => list.map((_, j) => (i === j ? 0 : 1)));
    return update(world, {
        edges: { $set: matrix(array) }
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

export const stiffnessMatrixDerivativeBot = (bot: Bot) => (dim: number) => (world: World): Matrix =>
    assembleMatrix(world, stiffnessPairDerivative(bot)(dim));

export const stiffnessMatrixDerivativeEdge = (i: number, j: number) => (world: World): Matrix => {
    const list = [...Array(world.bots.length)].map(() => 0);
    const edges = list.map(() => list);
    edges[i][j] = edges[j][i] = 1;
    const w = update(world, {
        edges: { $set: matrix(edges) }
    });
    return stiffnessMatrix(w);
};

export const forceMatrix = (world: World): Matrix =>
    removeFixedFromVector(world)(matrix(world.bots.map(bot => [0, -bot.weight, 0]).flat()));

export const compliance = (world: World): number => {
    const f = forceMatrix(world);
    const k = stiffnessMatrix(world);
    const ft = transpose(f);
    const kInv = inv(k);
    return (multiply(multiply(ft, kInv), f) as unknown) as number;
};

const mult = (b: Matrix) => (a: Matrix) => multiply(a, b);

export const complianceDerivative = (func: (world: World) => Matrix) => (world: World): number => {
    const f = forceMatrix(world);
    const dk = func(world);
    const k = stiffnessMatrix(world);
    const ft = transpose(f);
    const kInv = inv(k);
    return -((pipe(ft, mult(kInv), mult(dk), mult(kInv), mult(f)) as unknown) as number);
};

export const complianceDerivativeBot = (bot: Bot) => (dim: number) => (world: World): number =>
    complianceDerivative(stiffnessMatrixDerivativeBot(bot)(dim))(world);

export const complianceDerivativeEdge = (i: number, j: number) => (world: World): number =>
    complianceDerivative(stiffnessMatrixDerivativeEdge(i, j))(world);

export const distancePenalty = (d: Matrix): number => (dot(d, d) - 1) ** 2;

export const distancePenaltyDerivative = (dim: number) => (d: Matrix): number => 4 * (dot(d, d) - 1) * d.get([dim]);

export const distancePenaltyPair = (a: Bot, b: Bot, edge: number): number =>
    multiply(distancePenalty(subtract(b.pos, a.pos) as Matrix), edge);

export const distancePenaltyPairDerivative = (dim: number) => (a: Bot, b: Bot, edge: number): number =>
    multiply(distancePenaltyDerivative(dim)(subtract(b.pos, a.pos) as Matrix), edge);

export const distancePenaltyTotal = (world: World): number => {
    let sum = 0;
    (world.edges.toArray() as number[][]).forEach((row, i) => {
        row.forEach((edge, j) => {
            if (i >= j) return;
            sum += distancePenaltyPair(world.bots[i], world.bots[j], edge);
        });
    });
    return sum;
};

export const distancePenaltyTotalDerivativeBot = (bot: Bot) => (dim: number) => (world: World): number => {
    let sum = 0;
    (world.edges.toArray() as number[][]).forEach((row, i) => {
        row.forEach((edge, j) => {
            if (world.bots[j] !== bot) return;
            sum += distancePenaltyPairDerivative(dim)(world.bots[i], world.bots[j], edge);
        });
    });
    return sum;
};

export const distancePenaltyTotalDerivativeEdge = (i: number, j: number) => (world: World): number =>
    distancePenaltyPair(world.bots[i], world.bots[j], 1);

export const objective = (world: World): number => compliance(world) + distancePenaltyTotal(world);

export const objectiveDerivativeBot = (bot: Bot) => (dim: number) => (world: World): number =>
    complianceDerivativeBot(bot)(dim)(world) + distancePenaltyTotalDerivativeBot(bot)(dim)(world);

export const objectiveDerivativeEdge = (i: number, j: number) => (world: World): number =>
    complianceDerivativeEdge(i, j)(world) + distancePenaltyTotalDerivativeEdge(i, j)(world);

export const optimizeStepBots = (stepSize: number) => (world: World): World => {
    const newBots = world.bots.map(bot => {
        if (bot.fixed) return bot;
        const d = [0, 1, 2].map(dim => objectiveDerivativeBot(bot)(dim)(world));
        return setPos(subtract(bot.pos, multiply(matrix(d), stepSize)) as Matrix)(bot);
    });
    return setBots(newBots)(world);
};

export const optimizeStepEdges = (stepSize: number) => (world: World): World => {
    const newEdges = world.edges.toArray() as number[][];
    for (let i = 0; i < world.bots.length; ++i) {
        for (let j = 0; j < world.bots.length; ++j) {
            if (i === j) continue;
            const d = objectiveDerivativeEdge(i, j)(world);
            newEdges[i][j] = world.edges.get([i, j]) - d * stepSize;
            newEdges[i][j] = Math.max(newEdges[i][j], 0);
            newEdges[i][j] = Math.min(newEdges[i][j], 1);
        }
    }
    return update(world, {
        edges: { $set: matrix(newEdges) }
    });
};

export const optimize = (world: World): World => {
    let result = world;
    for (let i = 0; i < 100; ++i) {
        result = optimizeStepBots(0.01)(result);
        result = optimizeStepEdges(0.01)(result);
        console.log(result.bots[3].pos.toArray());
        console.log(result.edges.toArray());
    }
    return result;
};
