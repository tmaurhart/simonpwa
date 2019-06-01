// setup levels
var levels = [
    [0, 1, 3, 2],
    [0, 0, 1, 3, 1],
    [0, 1, 3, 2, 3, 1, 3],
    [1, 3, 3, 1, 4, 2],
    [0, 3, 0, 1, 2, 1, 0]
];
var levelIdx = 0;
var selectedLevel = [];

setLevel(0);

// setup buttons
var selectedIdx = -1;
var tmr = null;
var items = document.querySelectorAll('section button');
console.log('items', items.length);

function flashItem(item) {
    addClass(item, 'flash');
    setTimeout(function () {
        removeClass(item, 'flash');
    }, 150);
}

function setLevel(level) {
    levelIdx = level;
    selectedLevel = levels[levelIdx];
    document.getElementById('level').innerHTML = levelIdx;
}

document.querySelector('section button').addEventListener('click', () => {
    console.log('test');
});