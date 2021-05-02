type Element<Type> = Type;

type Compare<Type> = (a: Element<Type>, b: Element<Type>) => number;

class PriorityQueue<Type> {
    comparator: Compare<Type>;
    elements: Element<Type>[];
    constructor(comparator: Compare<Type>) {
        this.comparator = comparator;
        this.elements = [];
    }

    peek(): Element<Type> | undefined {
        return this.elements[0];
    }

    pop(): Element<Type> | undefined {
        const first = this.peek();
        if (first === undefined) return undefined;
        const last = this.elements.pop();
        if (last === undefined) return undefined;
        const size = this.size();

        if (size === 0) return first;

        this.elements[0] = last;
        let current = 0;

        while (current < size) {
            let largest = current;
            const left = 2 * current + 1;
            const right = 2 * current + 2;

            if (left < size && this.compare(left, largest) >= 0) {
                largest = left;
            }

            if (right < size && this.compare(right, largest) >= 0) {
                largest = right;
            }

            if (largest === current) break;

            this.swap(largest, current);
            current = largest;
        }

        return first;
    }

    push(element: Element<Type>): void {
        const size = this.elements.push(element);
        let current = size - 1;

        while (current > 0) {
            const parent = Math.floor((current - 1) / 2);

            if (this.compare(current, parent) <= 0) break;

            this.swap(parent, current);
            current = parent;
        }
    }

    size(): number {
        return this.elements.length;
    }

    compare(a: number, b: number): number {
        return this.comparator(this.elements[a], this.elements[b]);
    }

    swap(a: number, b: number): void {
        const aux = this.elements[a];
        this.elements[a] = this.elements[b];
        this.elements[b] = aux;
    }
}

export default PriorityQueue;
