const fs = require('fs');

const elements = `element-1
element-2
element-3`.replace(/\r/g, '');

let result = '';

for (const id of elements.split('\n')) {
    result += `<div class="element-content" id="${id}">
    <h2>${id}</h2>
    <div class="description">
        <p>Описание элемента ${id}</p>
    </div>
</div>\n`;
}

// console.log(result);

fs.writeFileSync('public/descriptions.html', result);