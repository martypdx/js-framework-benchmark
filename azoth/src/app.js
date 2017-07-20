import DataStore from './DataStore';
import { _ } from 'azoth';
import menu from './menu';
import table from './table';

const store = new DataStore();

var startTime;
var lastMeasure;
var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function() {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            console.log(last+" took "+(stop-startTime));
        }, 0);
    }
}

const getSubject = (val) => {
    const subscriptions = new Set();
    return {
        subscribe(fn) { 
            subscriptions.add(fn);
            if(val !== undefined) fn(val);
            return { unsubscribe() { subscriptions.delete(fn); }}
        },
        next(value) { 
            val = value;
            subscriptions.forEach(fn => fn(value));
        },
        child(prop) {
            const subject = getSubject(val ? val[prop] : undefined)
            this.subscribe(val => subject.next(val ? val[prop] : undefined))
            return subject;
        }
    }
}

const subject = getSubject();
let methods = null;

const dispatch = action => {
    methods[action.action](action);
}

export default () => _`
    ${menu(dispatch)}#
    <div>
        ${table(subject, dispatch)}#
    </div>
`;

methods = {
    add () {
        startMeasure("add");
        store.add();
        this.set({ store });
        stopMeasure();
    },

    clear () {
        startMeasure("clear");
        store.clear();
        this.set({ store });
        stopMeasure();
    },

    partialUpdate () {
        startMeasure("update");
        store.update();
        this.set({ store });
        stopMeasure();
    },

    remove( num ) {
        startMeasure("delete");
        store.data.splice( num, 1 );
        this.set({ store });
        stopMeasure();
    },

    run () {
        startMeasure("run");
        store.run();
        subject.next(store);
        stopMeasure();
    },

    runLots () {
        startMeasure("runLots");
        store.runLots();
        subject.next(store);
        stopMeasure();
    },

    select ({ id }) {
        startMeasure("select");
        store.select(id);
        subject.next(store);
        stopMeasure();
    },

    swapRows () {
        startMeasure("swapRows");
        store.swapRows();
        this.set({ store });
        stopMeasure();
    }
};