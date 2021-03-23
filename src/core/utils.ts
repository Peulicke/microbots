import * as Vec3 from "./Vec3";
import * as Mat3 from "./Mat3";

const throwError = () => {
    throw new Error("Vectors need to be the same length");
};

export const dot = (a: number[], b: number[]): number => {
    if (a.length !== b.length) throwError();
    let result = 0;
    for (let i = 0; i < a.length; ++i) result += a[i] * b[i];
    return result;
};

export const outerProduct = (a: Vec3.Vec3, b: Vec3.Vec3): Mat3.Mat3 =>
    Mat3.newMat3(
        Vec3.newVec3(a[0] * b[0], a[0] * b[1], a[0] * b[2]),
        Vec3.newVec3(a[1] * b[0], a[1] * b[1], a[1] * b[2]),
        Vec3.newVec3(a[2] * b[0], a[2] * b[1], a[2] * b[2])
    );

export const zeros = (height: number, width: number): number[][] =>
    [...Array(height)].map(() => [...Array(width)].map(() => 0));

export const minAcc = (
    t1: number,
    t2: number,
    t4: number,
    t5: number,
    p1: Vec3.Vec3,
    p2: Vec3.Vec3,
    p4: Vec3.Vec3,
    p5: Vec3.Vec3,
    t3: number
): Vec3.Vec3 => {
    const t12 = t2 - t1;
    const t13 = t3 - t1;
    const t23 = t3 - t2;
    const t24 = t4 - t2;
    const t34 = t4 - t3;
    const t35 = t5 - t3;
    const t45 = t5 - t4;
    const t1213 = t12 * t13;
    const t1323 = t13 * t23;
    const t2324 = t23 * t24;
    const t2434 = t24 * t34;
    const t3435 = t34 * t35;
    const t3545 = t35 * t45;
    const c = 1 / (t2434 * t2324);
    const a = c + 1 / t1323 ** 2 + 1 / t2324 ** 2;
    const b = c + 1 / t2434 ** 2 + 1 / t3435 ** 2;
    const w1 = -1 / (t1213 * t1323 * (a + b));
    const w2 = (a + 1 / (t1213 * t1323)) / (a + b);
    const w4 = (b + 1 / (t3435 * t3545)) / (a + b);
    const w5 = -1 / (t3435 * t3545 * (a + b));
    const q1 = Vec3.multiplyScalar(p1, w1);
    const q2 = Vec3.multiplyScalar(p2, w2);
    const q4 = Vec3.multiplyScalar(p4, w4);
    const q5 = Vec3.multiplyScalar(p5, w5);
    const p3 = Vec3.add(Vec3.add(Vec3.add(q1, q2), q4), q5);
    return p3;
};
