import { _ } from 'azoth';

export default (store) => _`
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>azoth 0.1.0</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="run" onclick=${() => store.run()}>Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="runlots" onclick=${() => store.runLots()}>Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="add" onclick=${() => store.add()}>Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="update" onclick=${() => store.update()}>Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="clear" onclick=${() => store.clear()}>Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick=${() => store.swap()}>Swap Rows</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;