import { pipe } from "ts-pipe-compose";
import { matrix, subtract, dot } from "mathjs";
import { newBot, setPos, setFixed } from "./Bot";
import {
    newWorld,
    setBots,
    initEdges,
    stiffnessPair,
    stiffnessPairDerivative,
    stiffnessMatrix,
    stiffnessMatrixDerivativeBot,
    compliance,
    complianceDerivativeBot,
    complianceDerivativeEdge,
    removeFixedFromVector,
    removeFixedFromMatrix,
    distancePenalty,
    distancePenaltyDerivative,
    distancePenaltyPair,
    distancePenaltyPairDerivative,
    distancePenaltyTotal,
    distancePenaltyTotalDerivativeBot,
    distancePenaltyTotalDerivativeEdge,
    objective,
    objectiveDerivativeBot
} from "./World";

it("creates a new world", () => {
    expect(newWorld()).toStrictEqual({ bots: [], edges: matrix([]) });
});

it("sets bots", () => {
    const world = newWorld();
    const bots = [newBot()];
    expect(setBots(bots)(world)).toStrictEqual({ bots: bots, edges: matrix([]) });
});

it("inits edges", () => {
    const bot = newBot();
    const bots = [bot, bot, bot];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(world).toStrictEqual({
        bots: bots,
        edges: matrix([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ])
    });
});

it("removes fixed from vector", () => {
    const bot = newBot();
    const bots = [bot, setFixed(true)(bot), bot];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const vector = matrix([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(removeFixedFromVector(world)(vector)).toStrictEqual(matrix([1, 2, 3, 7, 8, 9]));
});

it("removes fixed from matrix", () => {
    const bot = newBot();
    const bots = [bot, setFixed(true)(bot), bot];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const mat = matrix([
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [2, 2, 3, 4, 5, 6, 7, 8, 9],
        [3, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 2, 3, 4, 5, 6, 7, 8, 9],
        [5, 2, 3, 4, 5, 6, 7, 8, 9],
        [6, 2, 3, 4, 5, 6, 7, 8, 9],
        [7, 2, 3, 4, 5, 6, 7, 8, 9],
        [8, 2, 3, 4, 5, 6, 7, 8, 9],
        [9, 2, 3, 4, 5, 6, 7, 8, 9]
    ]);
    expect(removeFixedFromMatrix(world)(mat)).toStrictEqual(
        matrix([
            [1, 2, 3, 7, 8, 9],
            [2, 2, 3, 7, 8, 9],
            [3, 2, 3, 7, 8, 9],
            [7, 2, 3, 7, 8, 9],
            [8, 2, 3, 7, 8, 9],
            [9, 2, 3, 7, 8, 9]
        ])
    );
});

it("computes stiffness pair", () => {
    const bot = newBot();
    const bots = [bot, setPos(matrix([0, 1, 0]))(bot), setPos(matrix([1, 0, 0]))(bot)];
    const expected = matrix([
        [0, 0, 0],
        [0, -1, 0],
        [0, 0, 0]
    ]);
    const d = matrix(subtract(stiffnessPair(bots[0], bots[1], 1), expected).toArray().flat());
    expect(dot(d, d)).toBeCloseTo(0);
});

it("computes stiffness pair derivative", () => {
    const bot1 = newBot();
    const bot2 = setPos(matrix([0, 1, 0]))(newBot());
    const expected = matrix([
        [0, -1, 0],
        [-1, 0, 0],
        [0, 0, 0]
    ]);
    const d = matrix(subtract(stiffnessPairDerivative(bot2)(0)(bot1, bot2, 1), expected).toArray().flat());
    expect(dot(d, d)).toBeCloseTo(0);
});

it("computes stiffness matrix", () => {
    const bot = newBot();
    const bots = [bot, setPos(matrix([0, 1, 0]))(bot), setPos(matrix([1, 0, 0]))(bot)];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const expected = matrix([
        [1, 0, 0, 0, 0, 0, -1, 0, 0],
        [0, 1, 0, 0, -1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0.5, -0.5, 0, -0.5, 0.5, 0],
        [0, -1, 0, -0.5, 1.5, 0, 0.5, -0.5, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [-1, 0, 0, -0.5, 0.5, 0, 1.5, -0.5, 0],
        [0, 0, 0, 0.5, -0.5, 0, -0.5, 0.5, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    const d = matrix(subtract(stiffnessMatrix(world), expected).toArray().flat());
    expect(dot(d, d)).toBeCloseTo(0);
});

it("computes stiffness matrix derivative", () => {
    const bot = newBot();
    const bot2 = setPos(matrix([0, 1, 0]))(bot);
    const bots = [bot, bot2, setPos(matrix([1, 0, 0]))(bot)];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const expected = matrix([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, -0.5, 0, 0, 0.5, 0, 0],
        [0, 0, 0, 0, 0.5, 0, 0, -0.5, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0.5, 0, 0, -0.5, 0, 0],
        [0, 0, 0, 0, -0.5, 0, 0, 0.5, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]);
    const d = matrix(subtract(stiffnessMatrixDerivativeBot(bot2)(1)(world), expected).toArray().flat());
    expect(dot(d, d)).toBeCloseTo(0);
});

it("computes compliance", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(matrix([1, 0, 0]))(newBot()));
    const bot3 = setFixed(true)(setPos(matrix([0, 0, 1]))(newBot()));
    const bot4 = setPos(matrix([0, 1, 0]))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(compliance(world)).toBeCloseTo(1);
});

it("computes compliance derivative bot", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(matrix([1, 0, 0]))(newBot()));
    const bot3 = setFixed(true)(setPos(matrix([0, 0, 1]))(newBot()));
    const bot4 = setPos(matrix([0, 1, 0]))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(complianceDerivativeBot(bot4)(0)(world)).toBeCloseTo(-2);
});

it("computes compliance derivative edge", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(matrix([1, 0, 0]))(newBot()));
    const bot3 = setFixed(true)(setPos(matrix([0, 0, 1]))(newBot()));
    const bot4 = setPos(matrix([0, 1, 0]))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(complianceDerivativeEdge(0, 3)(world)).toBeCloseTo(-1);
});

it("computes distance penalty", () => {
    expect(distancePenalty(matrix([1, 0, 0]))).toBeCloseTo(0);
});

it("computes distance penalty derivative", () => {
    expect(distancePenaltyDerivative(0)(matrix([1, 0, 0]))).toBeCloseTo(0);
    expect(distancePenaltyDerivative(0)(matrix([2, 0, 0]))).toBeCloseTo(24);
});

it("computes distance penalty pair", () => {
    const bot1 = newBot();
    const bot2 = setPos(matrix([1, 0, 0]))(newBot());
    const bot3 = setPos(matrix([2, 0, 0]))(newBot());
    expect(distancePenaltyPair(bot1, bot2, 1)).toBeCloseTo(0);
    expect(distancePenaltyPair(bot2, bot3, 1)).toBeCloseTo(0);
    expect(distancePenaltyPair(bot1, bot3, 1)).toBeCloseTo(9);
    expect(distancePenaltyPair(bot1, bot3, 2)).toBeCloseTo(18);
});

it("computes distance penalty pair derivative", () => {
    const bot1 = newBot();
    const bot2 = setPos(matrix([1, 0, 0]))(newBot());
    const bot3 = setPos(matrix([2, 0, 0]))(newBot());
    expect(distancePenaltyPairDerivative(0)(bot1, bot2, 1)).toBeCloseTo(0);
    expect(distancePenaltyPairDerivative(0)(bot2, bot3, 1)).toBeCloseTo(0);
    expect(distancePenaltyPairDerivative(0)(bot1, bot3, 1)).toBeCloseTo(24);
    expect(distancePenaltyPairDerivative(0)(bot1, bot3, 2)).toBeCloseTo(48);
});

it("computes distance penalty total", () => {
    const bot1 = newBot();
    const bot2 = setPos(matrix([1, 0, 0]))(newBot());
    const bot3 = setPos(matrix([0, 1, 0]))(newBot());
    const bots = [bot1, bot2, bot3];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(distancePenaltyTotal(world)).toBeCloseTo(1);
});

it("computes distance penalty total derivative", () => {
    const bot1 = newBot();
    const bot2 = setPos(matrix([1, 0, 0]))(newBot());
    const bot3 = setPos(matrix([0, 1, 0]))(newBot());
    const bots = [bot1, bot2, bot3];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(distancePenaltyTotalDerivativeBot(bot2)(0)(world)).toBeCloseTo(4);
});

it("computes distance penalty total derivative edge", () => {
    const bot1 = newBot();
    const bot2 = setPos(matrix([1, 0, 0]))(newBot());
    const bot3 = setPos(matrix([0, 1, 0]))(newBot());
    const bots = [bot1, bot2, bot3];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(distancePenaltyTotalDerivativeEdge(0, 1)(world)).toBeCloseTo(0);
    expect(distancePenaltyTotalDerivativeEdge(1, 2)(world)).toBeCloseTo(1);
});

it("computes objective", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(matrix([1, 0, 0]))(newBot()));
    const bot3 = setFixed(true)(setPos(matrix([0, 0, 1]))(newBot()));
    const bot4 = setPos(matrix([0, 1, 0]))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(objective(world)).toBeCloseTo(4);
});

it("computes objective derivative", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(matrix([1, 0, 0]))(newBot()));
    const bot3 = setFixed(true)(setPos(matrix([0, 0, 1]))(newBot()));
    const bot4 = setPos(matrix([0, 1, 0]))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(objectiveDerivativeBot(bot4)(0)(world)).toBeCloseTo(-6);
});
