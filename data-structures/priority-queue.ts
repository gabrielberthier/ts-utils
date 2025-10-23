export type Comparator<T> = (a: T, b: T) => number;

type Entry<T> = {
    value: T;
    id: number; // monotonic sequence to ensure stability when comparator returns 0
};

export class PriorityQueue<T> {
    private heap: Entry<T>[] = [];
    private comparator: Comparator<T>;
    private seq: number = 0; // sequence id for stability

    constructor(comparator?: Comparator<T>, initial?: Iterable<T>) {
        this.comparator = comparator ?? defaultComparator as Comparator<T>;
        if (initial) {
            for (const v of initial) this.enqueue(v);
        }
    }

    size(): number {
        return this.heap.length;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    peek(): T | null {
        return this.heap[0]?.value ?? null;
    }

    enqueue(value: T): void {
        const entry: Entry<T> = { value, id: this.seq++ };
        this.heap.push(entry);
        this.siftUp(this.heap.length - 1);
    }

    dequeue(): T | null {
        if (this.isEmpty()) {
            return null;
        }

        const top = this.heap[0];
        const last = this.heap.pop()!;

        if (!this.isEmpty()) {
            this.heap[0] = last;
            this.siftDown(0);
        }

        return top.value;
    }

    clear(): void {
        this.heap.length = 0;
        this.seq = 0;
    }

    // Returns a shallow-copied array of values in heap order (not sorted).
    toArray(): T[] {
        return this.heap.map((e) => e.value);
    }

    // Returns a new array of values sorted according to the queue's comparator.
    // The queue is not mutated.
    toSortedArray(): T[] {
        const copy = new PriorityQueue<T>(this.comparator);
        // clone entries while preserving sequence order relative to this queue
        for (const e of this.heap) copy.heap.push({ value: e.value, id: e.id });
        // fix size and seq on copy
        copy.seq = this.seq;
        // transform heap into a proper heap
        for (let i = Math.floor(copy.heap.length / 2) - 1; i >= 0; i--) {
            copy.siftDown.call(copy, i);
        }
        const out: T[] = [];
        while (!copy.isEmpty()) out.push(copy.dequeue()!);
        return out;
    }

    // Replace comparator and re-heapify
    setComparator(comparator: Comparator<T>): void {
        this.comparator = comparator;
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.siftDown(i);
        }
    }

    private getParent(idx: number) {
        return Math.floor((idx - 1) / 2);
    }

    private getRight(idx: number) {
        return 2 * idx + 2;
    }

    private getLeft(idx: number) {
        return 2 * idx + 1;
    }

    // Internal helpers
    private compareEntries(a: Entry<T>, b: Entry<T>): number {
        const c = this.comparator(a.value, b.value);
        return c !== 0 ? c : a.id - b.id;
    }

    private siftUp(idx: number): void {
        let i = idx;
        while (i > 0) {
            const p = this.getParent(i);
            if (this.compareEntries(this.heap[i], this.heap[p]) >= 0) {
                break;
            }
            this.swap(i, p);
            i = p;
        }
    }

    private siftDown(idx: number): void {
        const n = this.heap.length;
        let i = idx;
        while (true) {
            const left = this.getLeft(i);
            const right = this.getRight(i);
            let smallest = i;
            if (
                left < n &&
                this.compareEntries(this.heap[left], this.heap[smallest]) < 0
            ) {
                smallest = left;
            }
            if (
                right < n &&
                this.compareEntries(this.heap[right], this.heap[smallest]) < 0
            ) {
                smallest = right;
            }
            if (smallest === i) {
                break;
            }
            this.swap(i, smallest);
            i = smallest;
        }
    }

    private swap(a: number, b: number): void {
        const tmp = this.heap[a];
        this.heap[a] = this.heap[b];
        this.heap[b] = tmp;
    }

    // static helper to create from array
    static from<T>(
        iterable: Iterable<T>,
        comparator?: Comparator<T>,
    ): PriorityQueue<T> {
        return new PriorityQueue<T>(comparator, iterable);
    }
}

// Default comparator supports numbers and strings. Throws for other types
function defaultComparator(a: unknown, b: unknown): number {
    if (typeof a === "number" && typeof b === "number") return a - b;
    if (typeof a === "string" && typeof b === "string") {
        return a.localeCompare(b);
    }
    throw new Error(
        "No comparator provided for element type; provide a Comparator<T>",
    );
}

type Item = {
    priority: number;
    name: string;
};

function main() {
    const pq = new PriorityQueue<Item>((one, other) => {
        return one.priority - other.priority;
    });
    pq.enqueue({ name: "Joe", priority: 1 });
    pq.enqueue({ name: "Anne", priority: 1 });
    pq.enqueue({ name: "Lucius", priority: 1 });
    pq.enqueue({ name: "June", priority: 0 });
    pq.enqueue({ name: "Mina", priority: 1 });
    pq.enqueue({ name: "Lucene", priority: 1 });
    pq.enqueue({ name: "Carmen", priority: 2 });
    pq.enqueue({ name: "Mike", priority: 0 });
    pq.enqueue({ name: "Lisana", priority: 3 });
    pq.enqueue({ name: "Henry", priority: 1 });
    pq.enqueue({ name: "Luna", priority: 2 });
    pq.enqueue({ name: "James", priority: 0 });
    console.log("Printed with For Loop");

    for (
        let i: Item | null = pq.dequeue();
        i;
        i = pq.dequeue()
    ) {
        console.log(i);
    }

    console.log("Printed with While Loop");
    // With `while`
    pq.enqueue({ name: "Joe", priority: 1 });
    pq.enqueue({ name: "Anne", priority: 1 });
    pq.enqueue({ name: "Lucius", priority: 1 });
    pq.enqueue({ name: "June", priority: 0 });
    pq.enqueue({ name: "Mina", priority: 1 });
    pq.enqueue({ name: "Lucene", priority: 1 });
    pq.enqueue({ name: "Carmen", priority: 2 });
    pq.enqueue({ name: "Mike", priority: 0 });
    pq.enqueue({ name: "Lisana", priority: 3 });
    pq.enqueue({ name: "Henry", priority: 1 });
    pq.enqueue({ name: "Luna", priority: 2 });
    pq.enqueue({ name: "James", priority: 0 });

    let x = null;
    while ((x = pq.dequeue())) {
        console.log(x);
    }

    console.log("Print peek and expect a null");

    console.log(pq.peek());
}

main();
