
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
function random(max) {
    return Math.round(Math.random() * 1000) % max;
}

class Item {
    static rowId = 1
    id = `id-${Item.rowId++}`;
    label = `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`;
}

export function buildData(count = 1000) {
    // eslint-disable-next-line unicorn/no-new-array
    const data = new Array(count);
    for(let i = 0; i < count; i++) {
        data[i] = new Item();
    }
    return data;
}
