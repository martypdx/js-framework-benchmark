export default class Subject {
    constructor(value) {
        this.value = value;
        this.hasValue = value !== undefined;
        this.subscribers = new Set();
    }

    subscribe(subscriber) {
        const { hasValue, subscribers, value } = this;
        
        subscribers.add(subscriber);
        if(hasValue) subscriber(value);

        return {
            unsubscribe() {
                subscribers.delete(subscriber);
            }
        };
    }

    next(value) {
        this.hasValue = true;
        this.value = value;
        this.subscribers.forEach(s => s(this.value));
    }
}