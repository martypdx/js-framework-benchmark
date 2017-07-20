import { _, $ } from 'azoth';

export default ({ data, selected }=$, dispatch) => _`
    <table class="table table-hover table-striped test-data">
        <tbody>
            *${data.map(({ id, label }) => _`
                <tr class=*${selected === id ? 'danger' : ''}>
                    <td class="col-md-1">${id}</td>
                    <td class="col-md-4">
                        <a onclick=${() => dispatch({ action: 'select', id })}>${label}</a>
                    </td>
                    <td class="col-md-1">
                        <a on:click="remove(num)">
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </a>
                    </td>
                    <td class="col-md-6"></td>
                </tr>
            `)}#
        </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
`;