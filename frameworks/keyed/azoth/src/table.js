import { _, $, Overlay, Spliceable } from 'azoth';
import measurer from './measurer';
import Subject from './subject';

const connect = table => store => {

    const selected = new Subject(-1);
    const select = function(value) {
        measurer.start('select');
        selected.next(value === selected.value ? -1 : value);
        measurer.stop();
    };

    return table(store, selected, select)
};

const table = (store, selected=$, select) =>  _`
    <table class="table table-hover table-striped test-data">
        <tbody>
            <#:${Spliceable(store)} map=${(row=$) => _`
                <tr class=*${selected === row.id ? 'danger' : ''}>
                    <td class="col-md-1">*${row.id}</td>
                    <td class="col-md-4">
                        <a onclick=*${() => select(row.id)}>*${row.label}</a>
                    </td>
                    <td class="col-md-1">
                        <a onclick=*${() => store.remove(row.id)}">
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </a>
                    </td>
                    <td class="col-md-6"></td>
                </tr>
            `}/>
        </tbody>
    </table>
`;

export default connect(table);
