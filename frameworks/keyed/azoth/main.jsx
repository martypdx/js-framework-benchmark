import { buildData } from './buildData.js';
import { ListBlock } from './ListBlock.jsx';
function App() {

    const listBlock = new ListBlock({
        container: <tbody id="tbody" onclick={e => {
            const { target } = e;
            const id = listBlock.closestId(target);
            if(target.matches('.remove')) {
                controller.remove(id);
            }
            else if(target.matches('.lbl')) {
                controller.select(id);
            }
        }} />,

        select: node => {
            node.classList.add('danger');
            return () => node.classList.remove('danger');
        },

        // onclick: {
        //     '.lbl': id => controller.select(id),
        //     '.remove': id => controller.remove(id),
        // },

        map: ({ id, label }) => {
            return <tr data-label={label}>
                <td class='col-md-1'>{id}</td>
                <td class='col-md-4'>
                    <a class='lbl'>{label}</a>
                </td>
                <td class='col-md-1'>
                    <a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a>
                </td>
                <td class='col-md-6'></td>";
            </tr>;
        },
    })

    const controller = {
        run(count) {
            this.clear();
            this.add(count);
        },
        runlots() {
            this.run(10000);
        },
        add(count = 1000) {
            listBlock.addMany(buildData(count));
        },
        update() {
            // simulate "update" of every tenth row
            const { children } = listBlock.container;
            for(let i = 0; i < children.length; i += 10) {
                const row = children[i];
                // const { azKey: id, label } = row.dataset;
                const { id, dataset } = row;
                const { label } = dataset;
                // dispatch update
                listBlock.updateById(id, { id, label: label + ' !!!' });
            }
        },
        remove(id) {
            listBlock.removeById(id);
        },
        select(id) {
            listBlock.selectById(id);
        },
        clear() {
            listBlock.removeAll();
        },
        swaprows() {
            // simulate "swap rows"
            const { childNodes } = listBlock.container;
            const idA = listBlock.getId(childNodes[1]);
            const idB = listBlock.getId(childNodes[998]);
            // dispatch swap
            listBlock.swapById(idA, idB);
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


function Controls({ action }) {
    return <div class="jumbotron" onclick={({ target }) => {
        if(target.tagName.toUpperCase() !== 'BUTTON') return;
        action(target.id);
    }}>
        <div class="row">
            <div class="col-md-6">
                <h1>Azoth Keyed!!!</h1>
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
