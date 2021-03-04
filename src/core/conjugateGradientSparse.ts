export type SparseSymmetric = [number, number][][];

const clone = (a: number[], result: number[]): void => {
    for (let i = 0; i < a.length; ++i) result[i] = a[i];
};

const dot = (a: number[], b: number[]): number => {
    let result = 0;
    for (let i = 0; i < a.length; ++i) {
        result += a[i] * b[i];
    }
    return result;
};

const addVecMultNum = (a: number[], b: number[], c: number): void => {
    for (let i = 0; i < a.length; ++i) a[i] += b[i] * c;
};

const matMultVec = (A: SparseSymmetric, b: number[], result: number[]): void => {
    for (let i = 0; i < result.length; ++i) result[i] = 0;
    for (let i = 0; i < A.length; ++i) {
        for (let c = 0; c < A[i].length; ++c) {
            const j = A[i][c][0];
            const v = A[i][c][1];
            result[i] += v * b[j];
            if (i === j) continue;
            result[j] += v * b[i];
        }
    }
};

const cg = (A: SparseSymmetric, b: number[]): number[] => {
    const x = b.map(() => 0);
    const r = Array(b.length);
    clone(b, r);
    const Ap = b.map(() => 0);
    matMultVec(A, x, Ap);
    addVecMultNum(r, Ap, -1);
    const p = Array(r.length);
    const pOld = Array(p.length);
    clone(r, p);
    let rsold = dot(r, r);
    for (let i = 0; i < 20; ++i) {
        matMultVec(A, p, Ap);
        const alpha = rsold / dot(p, Ap);
        addVecMultNum(x, p, alpha);
        addVecMultNum(r, Ap, -alpha);
        const rsnew = dot(r, r);
        clone(p, pOld);
        clone(r, p);
        addVecMultNum(p, pOld, rsnew / rsold);
        rsold = rsnew;
    }
    return x;
};

const preconditioner = (A: SparseSymmetric, b: number[]): number[] => {
    const sum = [...Array(b.length / 3)].map(() => 0);
    for (let i = 0; i < A.length; ++i) {
        for (let c = 0; c < A[i].length; ++c) {
            const [j, v] = A[i][c];
            if (Math.floor(i / 3) !== Math.floor(j / 3)) continue;
            sum[Math.floor(i / 3)] += v;
            if (i === j) continue;
            sum[Math.floor(j / 3)] += v;
        }
    }
    sum.forEach((v, i) => (sum[i] = Math.sqrt(Math.sqrt(3 / v))));
    return sum;
};

const conditionMatrix = (sum: number[], A: SparseSymmetric): void => {
    for (let i = 0; i < A.length; ++i) {
        for (let c = 0; c < A[i].length; ++c) {
            const j = A[i][c][0];
            A[i][c][1] *= sum[Math.floor(i / 3)];
            A[i][c][1] *= sum[Math.floor(j / 3)];
        }
    }
};

const conditionVector = (sum: number[], b: number[]): void => {
    for (let i = 0; i < b.length; ++i) {
        b[i] *= sum[Math.floor(i / 3)];
    }
};

export const ldiv = (A: SparseSymmetric, b: number[]): number[] => {
    const bCopy = Array(b.length);
    clone(b, bCopy);
    const sum = preconditioner(A, bCopy);
    conditionMatrix(sum, A);
    conditionVector(sum, bCopy);
    const x = cg(A, bCopy);
    conditionVector(sum, x);
    return x;
};
