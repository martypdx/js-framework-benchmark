import { _ } from 'azoth';

export default (dispatch) => _`
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>azoth 0.0.13</h1>
            </div>
            <div class="col-md-6">
                <div class="row">
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="run" onclick=${() => dispatch({ action: "run" })}>Create 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="runlots" onclick=${() => dispatch({ action: "runLots" })}>Create 10,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="add" onclick=${() => dispatch({ action: "add" })}>Append 1,000 rows</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="update" onclick=${() => dispatch({ action: "partialUpdate" })}>Update every 10th row</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="clear" onclick=${() => dispatch({ action: "clear" })}>Clear</button>
                    </div>
                    <div class="col-sm-6 smallpad">
                        <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick=${() => dispatch({ action: "swapRows" })}>Swap Rows</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;