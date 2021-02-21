const clone = (a: number[]): number[] => a.map(v => v);

const dot = (a: number[], b: number[]): number => {
    let result = 0;
    for (let i = 0; i < a.length; ++i) {
        result += a[i] * b[i];
    }
    return result;
};

const addVecMultNum = (a: number[], b: number[], c: number): number[] => a.map((v, i) => v + b[i] * c);

const matMultVec = (A: number[][], b: number[]): number[] => A.map(row => dot(row, b));

export const ldiv = (A: number[][], b: number[]): number[] => {
    let x = b.map(() => 0);
    let r = addVecMultNum(b, matMultVec(A, x), -1);
    let p = clone(r);
    let rsold = dot(r, r);
    for (let i = 0; i < 10; ++i) {
        const Ap = matMultVec(A, p);
        const alpha = rsold / dot(p, Ap);
        x = addVecMultNum(x, p, alpha);
        r = addVecMultNum(r, Ap, -alpha);
        const rsnew = dot(r, r);
        p = addVecMultNum(r, p, rsnew / rsold);
        rsold = rsnew;
    }
    return x;
};
