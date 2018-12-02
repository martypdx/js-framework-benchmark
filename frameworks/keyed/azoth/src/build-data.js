import Subject from './subject';

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let id = 1;

export default function buildData(count = 1000) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(new Subject({ 
            id: id++, 
            label: `${random(adjectives)} ${random(colours)} ${random(nouns)}` 
        }));
    }
    return data;
}

function random(collection) {
    const max = collection.length;
    const index = Math.round(Math.random() * 1000) % max;
    return collection[index];
}
