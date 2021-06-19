import * as Mat3 from "./Mat3";
import * as Vec3 from "./Vec3";

export const outerProduct = (a: Vec3.Vec3, b: Vec3.Vec3): Mat3.Mat3 =>
    Mat3.newMat3(
        Vec3.newVec3(a[0] * b[0], a[0] * b[1], a[0] * b[2]),
        Vec3.newVec3(a[1] * b[0], a[1] * b[1], a[1] * b[2]),
        Vec3.newVec3(a[2] * b[0], a[2] * b[1], a[2] * b[2])
    );

export const minAcc = (v1: Vec3.Vec3, v2: Vec3.Vec3, v4: Vec3.Vec3, v5: Vec3.Vec3): Vec3.Vec3 => {
    const q1 = Vec3.multiplyScalar(v1, -1 / 6);
    const q2 = Vec3.multiplyScalar(v2, 4 / 6);
    const q4 = Vec3.multiplyScalar(v4, 4 / 6);
    const q5 = Vec3.multiplyScalar(v5, -1 / 6);
    const p3 = Vec3.add(Vec3.add(Vec3.add(q1, q2), q4), q5);
    return p3;
};
