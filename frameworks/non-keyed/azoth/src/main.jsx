import { Controller } from 'azoth/maya';

let rowId = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function random(max) {
    return Math.round(Math.random() * 1000) % max;
}

class Item {
    id = rowId++;
    label = `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`
}

function buildData(count = 1000) {
    const data = new Array(count);
    for(let i = 0; i < count; i++) {
        data[i] = new Item();
    }
    return data;
}

class ListBlock {
    constructor({ container, map }) {
        this.container = container;
        this.map = Controller.for(map);
    }

    addMany(data) {
        const { map, container } = this;
        for(let i = 0; i < data.length; i++) {
            container.append(map.render(data[i]))
        }
    }

    updateByIndex(index, data) {
        this.map.update(this.container.children[index], data);
    }

    removeAll() {
        this.container.innerHTML = '';
    }

    render() {
        return this.container;
    }

    swapByIndex(a, b) {
        const { container } = this;
        const { children } = container;
        const aNode = children[a];
        const bNode = children[b];
        const beforeB = bNode.previousElementSibling;
        aNode.replaceWith(bNode);
        beforeB ? beforeB.after(aNode) : container.prepend(aNode);
    }
}

function App() {

    const listBlock = new ListBlock({
        container: <tbody id="tbody" onclick={({ target }) => {
            if(target.matches('.remove')) {

            }
        }} />,
        map: Row
    })

    let cache = [];
    const controller = {
        run(count = 1000) {
            this.clear();
            listBlock.addMany(cache = buildData());
        },
        runlots() {
            this.run(10000);
        },
        add() {
            const data = buildData();
            cache = cache.concat(data);
            listBlock.addMany(data);
        },
        update() {
            for(let i = 0; i < cache.length; i += 10) {
                const data = cache[i]
                data.label += ' !!!';
                listBlock.updateByIndex(i, data);
            }
        },
        clear() {
            cache = [];
            listBlock.removeAll();
        },
        swaprows() {
            if(cache.length < 999) return;
            const a = cache[999];
            const b = cache[1];
            cache[1] = a;
            cache[999] = b;
            listBlock.swapByIndex(1, 998);
        },
    }


    return <div id='main'>
        <div class="container">
            <Controls action={id => controller[id]()} />

            <table class="table table-hover table-striped test-data">
                {listBlock}
            </table>

            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>
    </div>;
}

function Row({ id, label }) {
    return <tr>
        <td class='col-md-1'>{id}</td>
        <td class='col-md-4'>
            <a class='lbl'>{label}</a>
        </td>
        <td class='col-md-1'>
            <a class='remove'>
                <span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span>
            </a>
        </td>
        <td class='col-md-6'></td>";
    </tr>
}

function Controls({ action }) {
    return <div class="jumbotron" onclick={({ target }) => {
        if(target.tagName.toUpperCase() !== 'BUTTON') return;
        action(target.id);
    }}>
        <div class="row">
            <div class="col-md-6">
                <h1>Azoth Non-Keyed</h1>
            </div>

            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='run'>Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='runlots'>Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='add'>Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='update'>Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='clear'>Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type='button' class='btn btn-primary btn-block' id='swaprows'>Swap Rows</button>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

document.body.append(<App />);
