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
