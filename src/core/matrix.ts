import * as cg from "./conjugateGradientSparse";

export const ldiv = (A: number[][], b: number[]): number[] => {
    A = A.map(row => row.map(v => v));
    b = b.map(v => v);
    for (let i = 0; i < A.length; i += 3) {
        let sum = 0;
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < 3; ++k) {
                sum += A[i + j][i + k] ** 2;
            }
        }
        sum = Math.sqrt(3 / sum);
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < A.length; ++k) {
                A[i + j][k] *= sum;
            }
            b[i + j] *= sum;
        }
    }
    return cg.ldiv(A, b);
};
