export class RequestCounter {
    private static counter = { count: 0 };

    public static increment() {
        ++RequestCounter.counter.count;
    }

    public static decrement() {
        --RequestCounter.counter.count;
    }

    public static getCounter() {
        return RequestCounter.counter;
    }
}