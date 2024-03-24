/* compose, composeElement, create, createElement */
const IGNORE = Symbol.for('azoth.compose.IGNORE');

class Sync {
    static wrap(initial, input) {
        return new this(initial, input);
    }
    constructor(initial, input) {
        this.initial = initial;
        this.input = input;
    }
}

function compose(anchor, input, keepLast, props, slottable) {
    if(keepLast !== true) keepLast = false;
    const type = typeof input;

    switch(true) {
        case input === IGNORE:
            break;
        case input === undefined:
        case input === null:
        case input === true:
        case input === false:
        case input === '':
            if(!keepLast) clear(anchor);
            break;
        case type === 'number':
        case type === 'bigint':
            input = `${input}`;
        // eslint-disable-next-line no-fallthrough
        case type === 'string':
            replace(anchor, input, keepLast);
            break;
        case input instanceof Node:
            if(props) Object.assign(input, props);
            if(slottable) input.slottable = slottable;
            replace(anchor, input, keepLast);
            break;
        case input instanceof Sync:
            compose(anchor, input.initial, keepLast);
            compose(anchor, input.input, keepLast, props, slottable);
            break;
        case type === 'function': {
            // will throw if function is class,
            // unlike create or compose element
            let out = slottable
                ? input(props, slottable)
                : props ? input(props) : input();
            compose(anchor, out, keepLast);
            break;
        }
        case type !== 'object': {
            // ES2023: Symbol should be only type  
            throwTypeError(input, type);
            break;
        }
        case input instanceof Promise:
            input.then(value => compose(anchor, value, keepLast, props, slottable));
            break;
        case Array.isArray(input):
            composeArray(anchor, input, keepLast);
            break;
        // w/o the !! this causes intermittent failures :p maybe vitest/node thing?
        case !!input[Symbol.asyncIterator]:
            composeAsyncIterator(anchor, input, keepLast, props, slottable);
            break;
        case input instanceof ReadableStream:
            // no props and slottable propagation on streams
            composeStream(anchor, input, true);
            break;
        case isRenderObject(input): {
            let out = slottable
                ? input.render(props, slottable)
                : props ? input.render(props) : input.render();
            compose(anchor, out, keepLast);
            break;
        }
        // TODO:
        case !!input.subscribe:
        case !!input.on:
        default: {
            throwTypeErrorForObject(input);
        }
    }
}

const isRenderObject = obj => obj && typeof obj === 'object' && obj.render && typeof obj.render === 'function';

function createElement(Constructor, props, slottable, topLevel = false) {
    const result = create(Constructor, props, slottable);
    if(!topLevel) return result;

    // result is returned to caller, not composed by Azoth,
    // force to be of type Node or null:
    // strings and numbers into text nodes
    // non-values to null
    const type = typeof result;
    switch(true) {
        case type === 'string':
        case type === 'number':
            return document.createTextNode(result);
        case result === undefined:
        case result === null:
        case result === true:
        case result === false:
        case result === IGNORE:
            return null;
        default:
            return result;
    }
}

function create(input, props, slottable, anchor) {
    const type = typeof input;
    switch(true) {
        case input instanceof Node:
            if(props) Object.assign(input, props);
        // eslint-disable-next-line no-fallthrough
        case type === 'string':
        case type === 'number':
        case input === undefined:
        case input === null:
        case input === true:
        case input === false:
        case input === '':
        case input === IGNORE:
            return anchor ? void compose(anchor, input) : input;
        case !!(input.prototype?.constructor): {
            // eslint-disable-next-line new-cap
            return create(new input(props, slottable), null, null, anchor);
        }
        case type === 'function':
            return create(input(props, slottable), null, null, anchor);
        case type !== 'object': {
            throwTypeError(input, type);
            break;
        }
        case isRenderObject(input):
            return create(input.render(props, slottable), null, null, anchor);
        default: {
            // these inputs require a comment anchor to which they can render
            if(!anchor) anchor = document.createComment('0');

            if(input[Symbol.asyncIterator]) {
                composeAsyncIterator(anchor, input, false, props, slottable);
            }
            else if(input instanceof Promise) {
                input.then(value => {
                    create(value, props, slottable, anchor);
                });
            }
            else if(Array.isArray(input)) {
                composeArray(anchor, input, false);
            }
            else if(input instanceof Sync) {
                // REASSIGN anchor! sync input will compose _before_
                // anchor is appended to DOM, need container until then
                const commentAnchor = anchor;
                anchor = document.createDocumentFragment();
                anchor.append(commentAnchor);

                create(input.initial, props, slottable, commentAnchor);
                create(input.input, props, slottable, commentAnchor);
            }
            else {
                throwTypeErrorForObject(input);
            }

            return anchor;
        }
    }
}

/* replace and clear */

function replace(anchor, input, keepLast) {
    if(!keepLast) clear(anchor);
    anchor.before(input);
    anchor.data = ++anchor.data;
}

function clear(anchor) {
    let node = anchor;
    let count = +anchor.data;

    // TODO: validate count received

    while(count--) {
        const { previousSibling } = node;
        if(!previousSibling) break;

        if(previousSibling.nodeType === Node.COMMENT_NODE) {
            // TODO: how to guard for azoth comments only?
            clear(previousSibling);
        }

        previousSibling.remove();
    }

    anchor.data = 0;
}

/* complex types */

function composeArray(anchor, array, keepLast) {
    if(!keepLast) clear(anchor);
    // TODO: optimize arrays here if Node[]
    for(let i = 0; i < array.length; i++) {
        compose(anchor, array[i], true);
    }
}

async function composeStream(anchor, stream, keepLast) {
    stream.pipeTo(new WritableStream({
        write(chunk) {
            compose(anchor, chunk, keepLast);
        }
    }));
}

async function composeAsyncIterator(anchor, iterator, keepLast, props, slottable) {
    // TODO: use iterator and intercept system messages
    for await(const value of iterator) {
        compose(anchor, value, keepLast, props, slottable);
    }
}

/* thrown errors */

function throwTypeError(input, type, footer = '') {
    // Passing Symbol to `{...}` throws!
    if(type === 'symbol') input = 'Symbol';
    throw new TypeError(`\
Invalid compose {...} input type "${type}", value ${input}.\
${footer}`
    );
}

function throwTypeErrorForObject(obj) {
    let message = '';
    try {
        const json = JSON.stringify(obj, null, 2);
        message = `\n\nReceived as:\n\n${json}\n\n`;
    }
    catch(ex) {
        /* no-op */
    }
    throwTypeError(obj, 'object', message);
}

const QUERY_SELECTOR = '[data-bind]';
const DOMRenderer = {
    name: 'DOMRenderer',

    createTemplate(id, content, isFragment) {
        const node = DOMRenderer.template(id, content);
        if(!node) return null;
        const render = DOMRenderer.renderer(node, isFragment);
        return render;
    },

    template(id, content) {
        if(content) return DOMRenderer.create(content);
        if(content === '') return null;
        return DOMRenderer.getById(id);
    },

    create(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    },
    getById(id) {
        const template = document.getElementById(id);
        if(!template) {
            throw new Error(`No template with id "${id}"`);
        }
        return template.content;
    },

    renderer(fragment, isFragment) {
        if(!isFragment) fragment = fragment.firstElementChild;
        // TODO: malformed fragment check...necessary?

        return function render() {
            const clone = fragment.cloneNode(true);
            const targets = clone.querySelectorAll(QUERY_SELECTOR);
            return [clone, targets];
        };
    },
    bound(dom) {
        return dom.querySelectorAll(QUERY_SELECTOR);
    }
};

const templates = new Map(); // cache
let renderEngine = DOMRenderer; // DOM or HTML engine


function get(id, isFragment = false, content) {
    if(templates.has(id)) return templates.get(id);
    const template = renderEngine.createTemplate(id, content, isFragment);
    templates.set(id, template);
    return template;
}

const bindings = new Map(); // cache

// stack
const injectable = [];
function inject(node, callback) {
    injectable.push(node);
    callback();
    const popped = injectable.pop();
    if(popped !== node) {
        // TODO: display html like object for compose
        throw new Error('Injectable stack error');
    }
}

const templateRenderer = getBound => (...args) => {
    const [root, bind] = getBound();
    if(bind) bind(...args);
    return root;
};

function renderer(id, targets, makeBind, isFragment, content) {
    const create = get(id, isFragment, content);

    function getBound() {
        let bind = null;
        let boundEls = null;
        let node = injectable.at(-1); // peek!

        // TODO: test injectable is right template id type

        if(node) {
            const hasBind = bindings.has(node);
            bind = bindings.get(node);
            if(hasBind) return [node, bind];
        }

        if(!create) return [null, null];

        // Honestly not sure this really needed, 
        // use case would be list component optimize by
        // not keeping bind functions?
        // overhead is small as it is simple function
        if(node) boundEls = renderEngine.bound(node);
        else {
            // (destructuring re-assignment)
            ([node, boundEls] = create());
        }

        const nodes = targets ? targets(node, boundEls) : null;
        bind = makeBind ? makeBind(nodes) : null;

        bindings.set(node, bind);
        return [node, bind];
    }

    return templateRenderer(getBound);
}

class Controller {
    static for(renderFn) {
        return new this(renderFn);
    }
    constructor(renderFn) {
        this.renderFn = renderFn;
    }
    render(props) {
        return this.renderFn(props);
    }
    update(node, props) {
        inject(node, () => this.renderFn(props));
    }
}

const gd41d8cd98f = (r) => [r];

const bc0bb219642 = (ts) => {
  const t0 = ts[0];
  return (v0) => {
    t0.onclick = v0;
  };    
};

const gec0b271815 = (r,t) => [t[0].childNodes[1],t[1].childNodes[1]];

const bc0cb5f0fcf = (ts) => {
  const t0 = ts[0], t1 = ts[1];
  return (v0, v1) => {
    compose(t0, v0);
    compose(t1, v1);
  };    
};

const gbdde750a60 = (r,t) => [t[0].childNodes[0],t[1].childNodes[0]];

const t77d7df0e88 = renderer("77d7df0e88", gd41d8cd98f, bc0bb219642, false);
const ta8ff882fd3 = renderer("a8ff882fd3", gec0b271815, bc0cb5f0fcf, false);
const t6399d3534c = renderer("6399d3534c", gbdde750a60, bc0cb5f0fcf, false);
const ta24f5f685c = renderer("a24f5f685c", gd41d8cd98f, bc0bb219642, false);

let rowId = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
function random(max) {
  return Math.round(Math.random() * 1e3) % max;
}
class Item {
  id = rowId++;
  label = `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`;
}
function buildData(count = 1e3) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
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
    for (let i = 0; i < data.length; i++) {
      container.append(map.render(data[i]));
    }
  }
  updateByIndex(index, data) {
    this.map.update(this.container.children[index], data);
  }
  removeAll() {
    this.container.innerHTML = "";
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
    container: t77d7df0e88(({ target }) => {
      if (target.matches(".remove")) ;
    }),
    map: Row
  });
  let cache = [];
  const controller = {
    run(count = 1e3) {
      this.clear();
      listBlock.addMany(cache = buildData());
    },
    runlots() {
      this.run(1e4);
    },
    add() {
      const data = buildData();
      cache = cache.concat(data);
      listBlock.addMany(data);
    },
    update() {
      for (let i = 0; i < cache.length; i += 10) {
        const data = cache[i];
        data.label += " !!!";
        listBlock.updateByIndex(i, data);
      }
    },
    clear() {
      cache = [];
      listBlock.removeAll();
    },
    swaprows() {
      if (cache.length < 999)
        return;
      const a = cache[999];
      const b = cache[1];
      cache[1] = a;
      cache[999] = b;
      listBlock.swapByIndex(1, 998);
    }
  };
  return ta8ff882fd3(createElement(Controls, { action: (id) => controller[id]() }), listBlock);
}
function Row({ id, label }) {
  return t6399d3534c(id, label);
}
function Controls({ action }) {
  return ta24f5f685c(({ target }) => {
    if (target.tagName.toUpperCase() !== "BUTTON")
      return;
    action(target.id);
  });
}
document.body.append(createElement(App, true));
