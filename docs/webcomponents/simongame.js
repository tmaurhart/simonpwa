export class SimonGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // initialize vars
        this.seq = [Math.floor(Math.random() * 4)]; //initializes first sequence with random button
        this.seqList = [this.seq]; //playlist consisting of seq-Arrays
        this.levelIdx = 0; //level-Counter
        this.selectedIdx = -1;
        this.selectedLevel = []; //array from seqList at given level
        this.tmr = null; //time between flashing
        
        this.sounds = [new Audio('audio/simonSound1.mp3'), new Audio('audio/simonSound2.mp3'), new Audio('audio/simonSound3.mp3'), new Audio('audio/simonSound4.mp3')];

    	/*this.d = new Date();
    	this.n = this.shadowRoot.getFullYear();
    	this.shadowRoot.getElementById('footerYear').innerHTML = this.n;*/
    }

    connectedCallback() {
        this.render();
        this.setLevel(0);

        // initialize buttons
        this.items = this.shadowRoot.querySelectorAll('.btnClick'); //get all 4 buttons in items-array

        // add Eventlistener to buttons
        this.items.forEach((item) => {
            item.addEventListener('click', () => {
                if (this.watchInput) {
                    this.flashItem(item);
                    var clickedItem = parseInt(item.id.split('-')[1], 10);
                    console.log(clickedItem);

                    var expectedItem = this.selectedLevel[this.selectedIdx];

                    // check input
                    if (clickedItem === expectedItem) {
                        console.log('CORRECT');
                        this.sounds[clickedItem].play();
                    } else {
                        console.log('INCORRECT pressed ' + clickedItem + ' expected ' + expectedItem);
                        this.shadowRoot.getElementById('incorrect').style.display = 'block';
                   		this.setVisibility('incorrect', true);
                   		this.removeClass('startGame', 'readonly');                   		
                    }
                    this.selectedIdx++;
                    if (this.selectedIdx === this.selectedLevel.length) {
                        this.watchInput = false;
                        this.setLevel(this.levelIdx + 1); //for counter display
                        this.shadowRoot.getElementById('correct').style.display = 'block';
                    	this.setVisibility('correct', true);
						window.setTimeout(() => {
                			this.start();
            			}, 3000);
                    }
                }
            });
        });

        this.shadowRoot.getElementById('startGame').addEventListener('click', () => {
            console.log('click start');
            this.start();
        });

        this.shadowRoot.getElementById('resetGame').addEventListener('click', () => {
            console.log('reset clicked');
            this.reset();
        });

    }

    flashItem(item) {
        this.addClass(item, 'flash');
        setTimeout(() => {
            this.removeClass(item, 'flash');
        }, 150);
    }

    // //LEVEL - which is shown/counter
    setLevel(level) {
        console.log(level);
        var arr = []; //inbetween storage
        if (level == 0) {
        }
        else {
            arr = this.seqList[level - 1];
            arr.push(Math.floor(Math.random() * 4));
            this.seqList.push(arr); //ad new level-playlist to seqList
        }

        this.levelIdx = level;
        this.selectedLevel = this.seqList[this.levelIdx];
        this.shadowRoot.querySelector('#level').innerHTML = this.levelIdx;
        this.shadowRoot.querySelector('#levelIfo').innerHTML = this.levelIdx;
    }

    start() {
        this.cancelNextItem();
        this.selectedIdx = -1;
        this.setVisibility('correct', false);
        this.setVisibility('incorrect', false);
        this.addClass('startGame', 'readonly');
        this.removeClass('resetGame', 'readonly');
        this.nextItem();
    }
    
    reset() {
        this.seq = [Math.floor(Math.random() * 4)];
        this.seqList = [this.seq];
        this.levelIdx = 0;
        this.selectedLevel = [];
        this.setLevel(0);
        this.removeClass('startGame', 'readonly');
        this.addClass('resetGame', 'readonly');
    }

    setVisibility(id, visible) {
        this.shadowRoot.querySelector(`#${id}`).style.display = visible ? 'block' : 'none';
        //console.log(id);
    }

    addClass(elem, cls) {
        if (typeof elem === 'string') {
            //console.log('addClass elem === string', elem);
            elem = this.shadowRoot.getElementById(elem);
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

    removeClass(elem, remove) {
        if (typeof elem === 'string') {
            elem = this.shadowRoot.getElementById(elem);
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

    // // button functions
    cancelNextItem() {
        if (this.tmr) {
            clearTimeout(this.tmr);
        }
    }

    clearItems() {
        this.items.forEach((item) => {
            this.removeClass(item, 'flash');
        });
    }

    setItem(selectedIdx) {
        this.addClass(this.items[selectedIdx], 'flash');
    }

    nextItem() {
        let currentIdx = -1;
        this.selectedIdx++;
        if (this.selectedIdx < this.selectedLevel.length) {
            // not finished pattern yet
            currentIdx = this.selectedLevel[this.selectedIdx];
        }
        // clear current
        if (this.selectedIdx > 0) {
            this.clearItems();
        }
        // set next

        if (this.selectedIdx > 0 && currentIdx > -1) {
            // was previous and next
            // allow a pause before next flash
            window.setTimeout(() => {
                this.postNext(currentIdx);
            }, 250);
        } else {
            // no previous flash so just set next
            this.postNext(currentIdx);
        }
    }

    // //whilst playing one button after another
    postNext(currentIdx) {
        if (currentIdx > -1) {
            this.setItem(currentIdx);
            // this.nextItem();
            // this.tmr = setTimeout(() => { this.nextItem(); }, 800);
            this.tmr = setTimeout((function() {
                this.nextItem();
            }).bind(this), 800);
        } else {
            this.startWatching();
        }
    }

    startWatching() {
        this.selectedIdx = 0;
        this.watchInput = true;
    }

    render() {
        this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="webcomponents/simongame.css">
			<header>
				<h1>Simons Says</h1>
			</header>
			<main id="simon-game">
		
				<section id="gameBoard">
					<div class="gameLevel"><span id="level"></span></div>
					<div class="alert" id="correct">Perfect, next round!</div>
					<div class="alert" id="incorrect">Congratulations you did <span id="levelIfo"></span> turns!</div>
					<button id="button-0" class="btnClick btnYellow"></button>
					<button id="button-1" class="btnClick btnRed"></button>
					<button id="button-2" class="btnClick btnBlue"></button>
					<button id="button-3" class="btnClick btnGreen"></button>
				</section>

				<section>
					<button id="startGame">Start Game</button>
					<button id="resetGame" class="readonly">Reset</button>

					<div id="introduction">
						Click the "Start Game" button then watch the pattern of the flashing panels.<br>
						Press the panels in the same order you saw them flash.
					</div>
				</section>

			</main>
			<footer>&copy; <span id="footerYear"></span> by Thomas Maurhart</footer>
		`;
    }
}

//   customElements.define('simongame', SimonGame);
