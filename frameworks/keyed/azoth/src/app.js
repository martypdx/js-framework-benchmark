import { _ } from 'azoth';
import header from './header';
import table from './table';

export default (store) => _`
    <div class="container">
        ${header(store)}#
        <div>
            ${table(store)}#
        </div>
    </div>
`;