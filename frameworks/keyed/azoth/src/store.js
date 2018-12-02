import buildData from './build-data';
import measurer from './measurer';

const store = {
    data: null,
    subscriber: null,

    subscribe(subscriber) {
        this.subscriber = subscriber;
    },

    doRun(name, count) {
        const { data, subscriber } = this;
        const items = buildData(count);
        const deleteCount = data ? data.length : 0;
        this.data = items;

        subscriber({
            index: 0,
            items,
            deleteCount
        });
    },

    run() {
        this.doRun('run')
    },

    runLots() {
        this.doRun('runLots', 10000);
    },

    add() {
        const { data, subscriber } = this;
        const items = buildData();
        const index = data ? data.length : 0;

        this.data = data ? data.concat(items) : items;

        subscriber({
            index,
            items
        });
    },

    clear() {
        const { data, subscriber } = this;
        if (!data || data.length === 0) return;

        subscriber({
            index: 0,
            deleteCount: data.length
        });

        this.data = null;
    },

    update() {
        const { data } = this;
        if (!data || data.length === 0) return;

        for (let i = 0; i < data.length; i += 10) {
            const subject = data[i];
            const value = subject.value;
            subject.next({ id: value.id, label: value.label + '!!!' });
        }
    },

    remove(id) {
        const { data, subscriber } = this;
        if (!data || data.length === 0) return;
        
        const index = data.findIndex(d => d.value.id==id);
        if(index === -1) return;

        this.data.splice(index, 1);
        subscriber({ index, deleteCount: 1 });
    },

    swap() {
        const { data } = this;
        if (!data || data.length < 999) return;
        
        const first = data[1];
        const temp = first.value;
        const last = data[998];

        first.next(last.value);
        last.next(temp);
    }
};

['run', 'runLots', 'add', 'clear', 'update', 'remove', 'swap']
    .forEach(method => {
        const own = store[method].bind(store);
        store[method] = function(arg) {
            measurer.start(method);
            own(arg);
            measurer.stop();
        }
    })

export default store;