
document.body.append(<App />);

function App() {

    const dispatch = console.log;

    return <div id='main'>
        <div class="container">
            <Controls action={dispatch} />
            <Table />
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>
    </div>;
}


function Table() {
    return <table class="table table-hover table-striped test-data">
        <tbody id="tbody">

        </tbody>
    </table>
}

function Controls({ action }) {
    return <div class="jumbotron">
        <div class="row">
            <div class="col-md-6">
                <h1>Azoth Non-Keyed</h1>
            </div>

            <div class="col-md-6" onclick={({ target }) => {
                if(target.tagName.toUpperCase() !== 'BUTTON') return;
                action(target.id);
            }}>
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