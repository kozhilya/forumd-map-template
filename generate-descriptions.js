const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const svg = fs.readFileSync('public/map.svg');
const dom = new JSDOM(svg);
const document = dom.window.document;

const elements = document.querySelectorAll('[data-id]');
const ids = [];

for (const iterator of elements) {
    ids.push(iterator.getAttribute('data-id'));
}

ids.sort();
console.log(ids);

// let result = '<meta charset="utf-8">\n';
let result = '';

for (const id of ids) {
    result += `<div class="element-content" id="${id}">
    <h2>${id}</h2>
    <div class="description">
        <p>Описание элемента ${id}</p>
    </div>
</div>\n`;
}

// console.log(result);

fs.writeFileSync('public/descriptions.html', result);