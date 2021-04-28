type Compare = (a: any, b: any) => number;

type Element = any;

class PriorityQueue {
    comparator: Compare;
    elements: Element;
    constructor(comparator: Compare) {
        this.comparator = comparator;
        this.elements = [];
    }

    peek(): Element {
        return this.elements[0];
    }

    pop(): Element {
        const first = this.peek();
        const last = this.elements.pop();
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

    push(element: Element): void {
        const size = this.elements.push(element);
        let current = size - 1;

        while (current > 0) {
            const parent = Math.floor((current - 1) / 2);

            if (this.compare(current, parent) <= 0) break;

            this.swap(parent, current);
            current = parent;
        }

        return size;
    }

    size(): number {
        return this.elements.length;
    }

    compare(a: Element, b: Element): number {
        return this.comparator(this.elements[a], this.elements[b]);
    }

    swap(a: Element, b: Element): void {
        const aux = this.elements[a];
        this.elements[a] = this.elements[b];
        this.elements[b] = aux;
    }
}

export default PriorityQueue;
