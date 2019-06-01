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
var items = document.querySelectorAll('.btnClick');
console.log('items', items.length);

//  wire up buttons
var watchInput = false;
items.forEach(function (item) {
    item.addEventListener('click', function () {
        if (watchInput) {
            flashItem(item);
            var clickedItem = parseInt(item.id.split('-')[1], 10);
            console.log(clickedItem);
            var expectedItem = selectedLevel[selectedIdx];
            // check input
            if (clickedItem === expectedItem) {
                console.log('CORRECT');
            } else {
                console.log('INCORRECT pressed ' + clickedItem + ' expected ' + expectedItem);
                document.getElementById('incorrect').style.display = 'block';
            }
            selectedIdx++;
            if (selectedIdx === selectedLevel.length) {
                watchInput = false;
                setLevel(levelIdx + 1);
                document.getElementById('correct').style.display = 'block';
            }
        }
    });
});

document.getElementById('startGame').addEventListener('click', function () {
    console.log('click start');
    start();
});

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

function start() {
    cancelNextItem();
    selectedIdx = -1;
    setVisibility('correct', false);
    nextItem();
}

function setVisibility(id, visible) {
    console.log(id);
}

function addClass(elem, cls) {
    if (typeof elem === 'string') {
        //console.log('addClass elem === string', elem);
        elem = document.getElementById(elem);
    }
    var i;
    var found = false;
    //console.log('addClass elem', elem);
    var classes = elem.className.split(' ');
    //console.log(classes);
    for (i = 0; i < classes.length; i++) {
        if (classes[i] === cls) {
            found = true;
        }
    }
    if (!found) {
        elem.className += ' ' + cls;
        //console.log(elem.className);
    }
}

function removeClass(elem, remove) {
    if (typeof elem === 'string') {
        elem = document.getElementById(elem);
    }
    var newClassName = '';
    var i;
    var classes = elem.className.split(' ');
    for (i = 0; i < classes.length; i++) {
        if (classes[i] !== remove) {
            newClassName += classes[i] + ' ';
        }
    }
    elem.className = newClassName;
}

// button functions
function cancelNextItem() {
    if (tmr) {
        window.cancelTimeout(tmr);
    }
}

function clearItems() {
    items.forEach(function (item) {
        removeClass(item, 'flash');
    });
}

function setItem(selectedIdx) {
    addClass(items[selectedIdx], 'flash');
}

function nextItem() {
    tmr = null;
    var currentIdx = -1;
    selectedIdx++;
    if (selectedIdx < selectedLevel.length) {
        // not finished pattern yet
        currentIdx = selectedLevel[selectedIdx];
    }
    // clear current
    if (selectedIdx > 0) {
        clearItems();
    }
    // set next

    if (selectedIdx > 0 && currentIdx > -1) {
        // was previous and next
        // allow a pause before next flash
        window.setTimeout(function () {
            postNext(currentIdx);
        }, 150);
    } else {
        // no previous flash so just set next
        postNext(currentIdx);
    }
}

function postNext(currentIdx) {
    if (currentIdx > -1) {
        setItem(currentIdx);
        tmr = window.setTimeout(nextItem, 800);
    } else {
        startWatching();
    }
}

function startWatching() {
    selectedIdx = 0;
    watchInput = true;
}