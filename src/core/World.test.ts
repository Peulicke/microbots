import { pipe } from "ts-pipe-compose";
import { Vector3, Matrix3 } from "three";
import {
    subMatrix3,
    numberArrayFromVector3Array,
    numberArrayToVector3Array,
    numberArrayFromMatrix3Array,
    numberArrayToMatrix3Array
} from "./utils";
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
    expect(newWorld()).toStrictEqual({ bots: [], edges: [] });
});

it("sets bots", () => {
    const world = newWorld();
    const bots = [newBot()];
    expect(setBots(bots)(world)).toStrictEqual({ bots: bots, edges: [] });
});

it("inits edges", () => {
    const bots = [newBot(), newBot(), newBot()];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(world).toStrictEqual({
        bots: bots,
        edges: [
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 0]
        ]
    });
});

it("removes fixed from vector", () => {
    const bots = [newBot(), setFixed(true)(newBot()), newBot()];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const vector = [new Vector3(1, 2, 3), new Vector3(4, 5, 6), new Vector3(7, 8, 9)];
    expect(removeFixedFromVector(world)(vector)).toStrictEqual([new Vector3(1, 2, 3), new Vector3(7, 8, 9)]);
});

it("removes fixed from matrix", () => {
    const bots = [newBot(), setFixed(true)(newBot()), newBot()];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const m00 = new Matrix3().set(1, 2, 3, 2, 2, 3, 3, 2, 3);
    const m01 = new Matrix3().set(4, 5, 6, 4, 5, 6, 4, 5, 6);
    const m02 = new Matrix3().set(5, 6, 7, 5, 3, 2, 4, 3, 4);
    const m10 = new Matrix3().set(5, 4, 2, 3, 4, 3, 3, 1, 2);
    const m11 = new Matrix3().set(1, 2, 4, 4, 3, 3, 3, 3, 3);
    const m12 = new Matrix3().set(6, 5, 4, 3, 3, 3, 3, 2, 2);
    const m20 = new Matrix3().set(9, 8, 8, 7, 7, 7, 8, 8, 8);
    const m21 = new Matrix3().set(6, 5, 1, 2, 2, 3, 3, 3, 3);
    const m22 = new Matrix3().set(0, 9, 9, 0, 0, 1, 1, 1, 1);
    const mat = [
        [m00, m01, m02],
        [m10, m11, m12],
        [m20, m21, m22]
    ];
    expect(removeFixedFromMatrix(world)(mat)).toStrictEqual([
        [m00, m02],
        [m20, m22]
    ]);
});

it("computes stiffness pair", () => {
    const bots = [newBot(), setPos(new Vector3(0, 1, 0))(newBot()), setPos(new Vector3(1, 0, 0))(newBot())];
    const expected = new Matrix3().set(...[...[0, 0, 0], ...[0, -1, 0], ...[0, 0, 0]]);
    const d = subMatrix3(stiffnessPair(bots[0], bots[1], 1), expected);
    d.elements.map(element => expect(element).toBeCloseTo(0));
});

it("computes stiffness pair derivative", () => {
    const bot1 = newBot();
    const bot2 = setPos(new Vector3(0, 1, 0))(newBot());
    const expected = new Matrix3().set(...[...[0, -1, 0], ...[-1, 0, 0], ...[0, 0, 0]]);
    const d = subMatrix3(stiffnessPairDerivative(bot2)(0)(bot1, bot2, 1), expected);
    d.elements.map(element => expect(element).toBeCloseTo(0));
});

it("computes stiffness matrix", () => {
    const bots = [newBot(), setPos(new Vector3(0, 1, 0))(newBot()), setPos(new Vector3(1, 0, 0))(newBot())];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const m00 = new Matrix3().set(1, 0, 0, 0, 1, 0, 0, 0, 0);
    const m01 = new Matrix3().set(0, 0, 0, 0, -1, 0, 0, 0, 0);
    const m02 = new Matrix3().set(-1, 0, 0, 0, 0, 0, 0, 0, 0);
    const m10 = new Matrix3().set(0, 0, 0, 0, -1, 0, 0, 0, 0);
    const m11 = new Matrix3().set(0.5, -0.5, 0, -0.5, 1.5, 0, 0, 0, 0);
    const m12 = new Matrix3().set(-0.5, 0.5, 0, 0.5, -0.5, 0, 0, 0, 0);
    const m20 = new Matrix3().set(-1, 0, 0, 0, 0, 0, 0, 0, 0);
    const m21 = new Matrix3().set(-0.5, 0.5, 0, 0.5, -0.5, 0, 0, 0, 0);
    const m22 = new Matrix3().set(1.5, -0.5, 0, -0.5, 0.5, 0, 0, 0, 0);
    const expected = [
        [m00, m01, m02],
        [m10, m11, m12],
        [m20, m21, m22]
    ];
    stiffnessMatrix(world).map((row, i) =>
        row.map((m, j) => subMatrix3(m, expected[i][j]).elements.map(element => expect(element).toBeCloseTo(0)))
    );
});

it("computes stiffness matrix derivative", () => {
    const bot = setPos(new Vector3(0, 1, 0))(newBot());
    const bots = [newBot(), bot, setPos(new Vector3(1, 0, 0))(newBot())];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    const m00 = new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const m01 = new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const m02 = new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const m10 = new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const m11 = new Matrix3().set(-0.5, 0, 0, 0, 0.5, 0, 0, 0, 0);
    const m12 = new Matrix3().set(0.5, 0, 0, 0, -0.5, 0, 0, 0, 0);
    const m20 = new Matrix3().set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const m21 = new Matrix3().set(0.5, 0, 0, 0, -0.5, 0, 0, 0, 0);
    const m22 = new Matrix3().set(-0.5, 0, 0, 0, 0.5, 0, 0, 0, 0);
    const expected = [
        [m00, m01, m02],
        [m10, m11, m12],
        [m20, m21, m22]
    ];
    stiffnessMatrixDerivativeBot(bot)(1)(world).map((row, i) =>
        row.map((m, j) => subMatrix3(m, expected[i][j]).elements.map(element => expect(element).toBeCloseTo(0)))
    );
});

it("converts from Vector3 array", () => {
    expect(numberArrayFromVector3Array([new Vector3(1, 2, 3), new Vector3(4, 5, 6)])).toStrictEqual([1, 2, 3, 4, 5, 6]);
});

it("converts to Vector3 array", () => {
    expect(numberArrayToVector3Array([1, 2, 3, 4, 5, 6])).toStrictEqual([new Vector3(1, 2, 3), new Vector3(4, 5, 6)]);
});

it("converts from Matrix3 array", () => {
    expect(
        numberArrayFromMatrix3Array([
            [new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9), new Matrix3().set(11, 12, 13, 14, 15, 16, 17, 18, 19)],
            [
                new Matrix3().set(21, 22, 23, 24, 25, 26, 27, 28, 29),
                new Matrix3().set(31, 32, 33, 34, 35, 36, 37, 38, 39)
            ]
        ])
    ).toStrictEqual([
        [1, 2, 3, 11, 12, 13],
        [4, 5, 6, 14, 15, 16],
        [7, 8, 9, 17, 18, 19],
        [21, 22, 23, 31, 32, 33],
        [24, 25, 26, 34, 35, 36],
        [27, 28, 29, 37, 38, 39]
    ]);
});

it("converts to Matrix3 array", () => {
    expect(
        numberArrayToMatrix3Array([
            [1, 2, 3, 11, 12, 13],
            [4, 5, 6, 14, 15, 16],
            [7, 8, 9, 17, 18, 19],
            [21, 22, 23, 31, 32, 33],
            [24, 25, 26, 34, 35, 36],
            [27, 28, 29, 37, 38, 39]
        ])
    ).toStrictEqual([
        [new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9), new Matrix3().set(11, 12, 13, 14, 15, 16, 17, 18, 19)],
        [new Matrix3().set(21, 22, 23, 24, 25, 26, 27, 28, 29), new Matrix3().set(31, 32, 33, 34, 35, 36, 37, 38, 39)]
    ]);
});

it("computes compliance", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(new Vector3(1, 0, 0))(newBot()));
    const bot3 = setFixed(true)(setPos(new Vector3(0, 0, 1))(newBot()));
    const bot4 = setPos(new Vector3(0, 1, 0))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(compliance(world)).toBeCloseTo(1);
});

it("computes compliance derivative bot", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(new Vector3(1, 0, 0))(newBot()));
    const bot3 = setFixed(true)(setPos(new Vector3(0, 0, 1))(newBot()));
    const bot4 = setPos(new Vector3(0, 1, 0))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(complianceDerivativeBot(bot4)(0)(world)).toBeCloseTo(-2);
});

it("computes compliance derivative edge", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(new Vector3(1, 0, 0))(newBot()));
    const bot3 = setFixed(true)(setPos(new Vector3(0, 0, 1))(newBot()));
    const bot4 = setPos(new Vector3(0, 1, 0))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(complianceDerivativeEdge(0, 3)(world)).toBeCloseTo(-1);
});

it("computes distance penalty", () => {
    expect(distancePenalty(new Vector3(1, 0, 0))).toBeCloseTo(0);
});

it("computes distance penalty derivative", () => {
    expect(distancePenaltyDerivative(0)(new Vector3(1, 0, 0))).toBeCloseTo(0);
    expect(distancePenaltyDerivative(0)(new Vector3(2, 0, 0))).toBeCloseTo(24);
});

it("computes distance penalty pair", () => {
    const bot1 = newBot();
    const bot2 = setPos(new Vector3(1, 0, 0))(newBot());
    const bot3 = setPos(new Vector3(2, 0, 0))(newBot());
    expect(distancePenaltyPair(bot1, bot2, 1)).toBeCloseTo(0);
    expect(distancePenaltyPair(bot2, bot3, 1)).toBeCloseTo(0);
    expect(distancePenaltyPair(bot1, bot3, 1)).toBeCloseTo(9);
    expect(distancePenaltyPair(bot1, bot3, 2)).toBeCloseTo(18);
});

it("computes distance penalty pair derivative", () => {
    const bot1 = newBot();
    const bot2 = setPos(new Vector3(1, 0, 0))(newBot());
    const bot3 = setPos(new Vector3(2, 0, 0))(newBot());
    expect(distancePenaltyPairDerivative(0)(bot1, bot2, 1)).toBeCloseTo(0);
    expect(distancePenaltyPairDerivative(0)(bot2, bot3, 1)).toBeCloseTo(0);
    expect(distancePenaltyPairDerivative(0)(bot1, bot3, 1)).toBeCloseTo(24);
    expect(distancePenaltyPairDerivative(0)(bot1, bot3, 2)).toBeCloseTo(48);
});

it("computes distance penalty total", () => {
    const bot1 = newBot();
    const bot2 = setPos(new Vector3(1, 0, 0))(newBot());
    const bot3 = setPos(new Vector3(0, 1, 0))(newBot());
    const bots = [bot1, bot2, bot3];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(distancePenaltyTotal(world)).toBeCloseTo(1);
});

it("computes distance penalty total derivative", () => {
    const bot1 = newBot();
    const bot2 = setPos(new Vector3(1, 0, 0))(newBot());
    const bot3 = setPos(new Vector3(0, 1, 0))(newBot());
    const bots = [bot1, bot2, bot3];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(distancePenaltyTotalDerivativeBot(bot2)(0)(world)).toBeCloseTo(4);
});

it("computes distance penalty total derivative edge", () => {
    const bot1 = newBot();
    const bot2 = setPos(new Vector3(1, 0, 0))(newBot());
    const bot3 = setPos(new Vector3(0, 1, 0))(newBot());
    const bots = [bot1, bot2, bot3];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(distancePenaltyTotalDerivativeEdge(0, 1)(world)).toBeCloseTo(0);
    expect(distancePenaltyTotalDerivativeEdge(1, 2)(world)).toBeCloseTo(1);
});

it("computes objective", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(new Vector3(1, 0, 0))(newBot()));
    const bot3 = setFixed(true)(setPos(new Vector3(0, 0, 1))(newBot()));
    const bot4 = setPos(new Vector3(0, 1, 0))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(objective(world)).toBeCloseTo(4);
});

it("computes objective derivative", () => {
    const bot1 = setFixed(true)(newBot());
    const bot2 = setFixed(true)(setPos(new Vector3(1, 0, 0))(newBot()));
    const bot3 = setFixed(true)(setPos(new Vector3(0, 0, 1))(newBot()));
    const bot4 = setPos(new Vector3(0, 1, 0))(newBot());
    const bots = [bot1, bot2, bot3, bot4];
    const world = pipe(newWorld(), setBots(bots), initEdges);
    expect(objectiveDerivativeBot(0.5)(bot4)(0)(world)).toBeCloseTo(-3);
});
