
let measure = null;

export default {
    start(name) {
        measure = { name, start: performance.now() };
    },
    stop() {
        if(!measure) return;
        const last = Object.assign({}, measure);
        measure = null;

        window.setTimeout(function () {
            const stop = performance.now();
            console.log(`${last.name} took ${stop - last.start}`);
        }, 0);
    }
};