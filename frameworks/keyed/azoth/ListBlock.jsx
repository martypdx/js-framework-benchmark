import { Controller } from 'azoth/maya';

export class ListBlock {
    selectedId = '';
    unselect = null;

    constructor({ container, map, select, key = 'id' }) {
        this.container = container;
        this.key = key;
        this.controller = Controller.for(map);
        this.select = select;
    }

    addMany(data) {
        const { controller, container, key } = this;
        for(let i = 0; i < data.length; i++) {
            const row = data[i];
            const node = controller.render(row);
            node.dataset.azKey = row[key];
            container.appendChild(node);
        }
    }

    closestId(target) {
        return this.getId(target.closest(`[data-az-key]`));
    }

    getById(id) {
        return this.container.querySelector(`[data-az-key="${id}"]`);
    }

    getId(node) {
        return node.dataset.azKey;
    }

    selectById(id) {
        const { unselect, select } = this;

        const selection = this.getById(id);
        if(!selection) throw new TypeError(`Id "${id}" does not exist in the list`);
        this.selectedId = `${id}`;

        if(unselect) unselect();

        if(!select) throw new TypeError('"selectById" called but no "select" function was provided.');
        this.unselect = select(selection);
    }

    updateById(id, data) {
        const node = this.getById(id);
        this.controller.update(node, data);
    }

    removeById(id) {
        if(this.selectedId == id) this.selectedId = '';
        this.getById(id).remove();
    }

    removeAll() {
        this.container.innerHTML = '';
        this.selectedId = '';
    }

    render() {
        return this.container;
    }

    swapById(a, b) {
        const { container } = this;
        const aNode = this.getById(a);
        const bNode = this.getById(b);
        const beforeB = bNode.previousElementSibling;
        aNode.replaceWith(bNode);
        beforeB ? beforeB.after(aNode) : container.prepend(aNode);
    }
}
