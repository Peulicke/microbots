import * as Mat3 from "./Mat3";
import * as Vec3 from "./Vec3";

type Spacetime = {
    pos: Vec3.Vec3;
    time: number;
};

export const outerProduct = (a: Vec3.Vec3, b: Vec3.Vec3): Mat3.Mat3 =>
    Mat3.newMat3(
        Vec3.newVec3(a[0] * b[0], a[0] * b[1], a[0] * b[2]),
        Vec3.newVec3(a[1] * b[0], a[1] * b[1], a[1] * b[2]),
        Vec3.newVec3(a[2] * b[0], a[2] * b[1], a[2] * b[2])
    );

export const minAcc = (v1: Spacetime, v2: Spacetime, v4: Spacetime, v5: Spacetime, t3: number): Vec3.Vec3 => {
    const epsilon = 1e-10;
    const t12 = v2.time - v1.time;
    const t13 = t3 - v1.time;
    const t23 = t3 - v2.time;
    const t24 = v4.time - v2.time;
    const t34 = v4.time - t3;
    const t35 = v5.time - t3;
    const t45 = v5.time - v4.time;
    const t1213 = t12 * t13 + epsilon;
    const t1323 = t13 * t23 + epsilon;
    const t2324 = t23 * t24 + epsilon;
    const t2434 = t24 * t34 + epsilon;
    const t3435 = t34 * t35 + epsilon;
    const t3545 = t35 * t45 + epsilon;
    const c = 1 / (t2434 * t2324);
    const a = c + 1 / t1323 ** 2 + 1 / t2324 ** 2;
    const b = c + 1 / t2434 ** 2 + 1 / t3435 ** 2;
    const w1 = -1 / (t1213 * t1323 * (a + b));
    const w2 = (a + 1 / (t1213 * t1323)) / (a + b);
    const w4 = (b + 1 / (t3435 * t3545)) / (a + b);
    const w5 = -1 / (t3435 * t3545 * (a + b));
    const q1 = Vec3.multiplyScalar(v1.pos, w1);
    const q2 = Vec3.multiplyScalar(v2.pos, w2);
    const q4 = Vec3.multiplyScalar(v4.pos, w4);
    const q5 = Vec3.multiplyScalar(v5.pos, w5);
    const p3 = Vec3.add(Vec3.add(Vec3.add(q1, q2), q4), q5);
    return p3;
};
