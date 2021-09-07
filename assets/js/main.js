//****************************************************************************
const heroes = [
    'aquaman',
    'batman',
    'captain-america',
    'fantastic-four',
    'flash',
    'green-arrow',
    'green-lantern',
    // 'hulk',
    'ironman',
    'spiderman',
    'superman',
    'the-avengers',
    'thor'
];

let c = 0;
const cardStatus = [
    hidden = c++,
    visible = c++,
    found = c++
];

let maxCards = 24;

let pairsClicked = 0;
let pairsFound = 0;
let resetGame = () => {

    pairsClicked = 0;
    pairsFound = 0;
}


//****************************************************************************
// all cards with their properties 
let cards = [];


//****************************************************************************
// Use an array for the clicked card. If the length of the array is 2 raise a
// check for pairs
let cardsClicked = [];


//****************************************************************************
const gameBoard = document.getElementById('gameBoard');


//****************************************************************************
let elapsedTime = -1;
// let idTimer = null;


//****************************************************************************
class Card {

    //------------------------------------------------------------------------
    constructor(heroIndex) {
        this.heroIndex = heroIndex;
        this.image = `assets/img/${heroes[heroIndex]}.jpg`;
        this.imageBack = '#888';
        this.status = hidden;
    }

    //------------------------------------------------------------------------
    buildCard = (position) => {

        let cardHtml = document.createElement('div');

        cardHtml.id = `card${position}`;

        cardHtml.className = "gameBoardCard";
        cardHtml.className = "gameBoardCard turn-card-forwards invisible";

        // cardHtml.style.background = `url('${this.image}') center/cover no-repeat`;
        cardHtml.style.background = '#888';

        cardHtml.setAttribute("data-card-position", position);

        cardHtml.addEventListener('mouseenter', () => cardHtml.style.cursor = 'pointer');
        cardHtml.addEventListener('click', (e) => cardClicked(e));

        return cardHtml;
    }
}


//****************************************************************************
function cardClicked(e) {

    if (elapsedTime < 0) {
        let idTimer = setInterval(() => {

            if (pairsFound == (maxCards / 2)) {
                clearInterval(idTimer);
            }
            elapsedTime++;
            document.getElementById('elapsedTime').textContent = new Date(0, 0, 0, 0, 0, elapsedTime).toLocaleTimeString("de");
        }, 1000);
    }

    // there are still 2 cards turned
    if (cardsClicked.length == 2) return;

    // get the index of the card clicked
    let index = Number(e.target.getAttribute("data-card-position"));
    console.log('Clicked card index:', index);

    // check if the index is invalid (is NOT(!) greater or equal 0)
    if (!(index >= 0)) {
        console.log("invalid index:", index)
        return;
    }

    // assign a variable for easy use (instead of writing indices)
    let card = cards[index];
    console.log(card.heroIndex);
    console.log(card.image);

    // if card is already found ignore the click
    if (card.status == found) {
        return;
    }

    // if a hidden(!) card is clicked add the card index. 
    if (card.status == hidden) {
        cardsClicked.push(index);
        showCard(index);
    }

    // if length of the array is 2 check the open cards
    if (cardsClicked.length == 2) {
        console.log('checkCardsClicked()');
        checkCardsClicked();
    }
}

//****************************************************************************
// if a card is clicked add the card index. If length of the array is 2, check
// if the cards are equal. if the cards are equal, leave them open, otherwise
// turn the cards back.
function checkCardsClicked() {

    // increment and show the number of pairs clicked;
    document.getElementById('pairsClicked').textContent = ++pairsClicked;

    const idx1 = cardsClicked[0];
    const idx2 = cardsClicked[1];

    // check if opened cards are not equal
    if (cards[idx1].heroIndex != cards[idx2].heroIndex) {
        setTimeout(() => {
            hideCard(cardsClicked[0]);
            hideCard(cardsClicked[1]);
            cardsClicked = [];
        }, 1000);
        return;
    }

    // yes, the clicked cards are equal, so mark them found! 
    cardsClicked[0].status = found;
    cardsClicked[1].status = found;

    // increment and show the number of pairs found
    document.getElementById('pairsFound').textContent = ++pairsFound;
    cardsClicked = [];

    // TODO: check if all pairs have been found...
    if (pairsFound == (maxCards / 2)) {

    }
}

//****************************************************************************
function hideCard(index) {

    if (cards[index].status != hidden) {

        cards[index].status = hidden;

        // show the card
        const card = document.getElementById(`card${index}`)

        card.classList.remove(`reveal-card${index}`);
        card.classList.add('hide-card');
        setTimeout(() => {
            card.style.background = '#888';
        }, 500);
    }
}

//****************************************************************************
function showCard(index) {

    if (cards[index].status == hidden) {

        cards[index].status = visible;

        // hide the card
        const card = document.getElementById(`card${index}`)
        card.classList.remove('hide-card');
        card.classList.add(`reveal-card${index}`);
        setTimeout(() => {
            card.style.background = `url('${cards[index].image}') center/cover no-repeat`;
        }, 400);
    }
}

//****************************************************************************
// build a new board

// first build an array of all available heroes
// add ech hero twice, we need pairs!
let heroesAvailable = [];
for (let i = 0; i < heroes.length; i++) {
    heroesAvailable.push(i);
    heroesAvailable.push(i);
}

// clear all cards
cards = [];
gameBoard.innerHTML = "";


// create a new board with shuffled cards
for (let i = 0; i < maxCards; i++) {

    // get a random hero index and create a card for our Hero
    const heroIndex = getRandom(0, heroesAvailable.length - 1);
    const hero = heroesAvailable[heroIndex];
    heroesAvailable.splice(heroIndex, 1);

    // create a card
    const card = new Card(hero);

    // set a position property to identify the card on click
    card.position = i;

    // add the card to card array
    cards.push(card);

    // cretae the the html of the card and add it to the game board
    gameBoard.appendChild(card.buildCard(i));
    setTimeout(() => {
        for (let card of document.getElementsByClassName('gameBoardCard')) {
            card.classList.remove('invisible')
        }
    }, 1000);
}


//****************************************************************************
// helper functions
function getRandom(minValue, maxValue) {

    return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
}




//****************************************************************************
// Dynamic CSS functions
let dynamicCssSheetName = 'dynamicCssSheet';


createDynamicCssSheet();
addAnimations();

function test() {
    let idx = 1;
    document.getElementById(`card${idx}`).classList.add(`reveal-card${idx}`);
}

//----------------------------------------------------------------------------
function createDynamicCssSheet() {
    let dynamicCssSheet = document.createElement('style');
    dynamicCssSheet.id = dynamicCssSheetName;
    dynamicCssSheet.title = dynamicCssSheetName;
    document.head.appendChild(dynamicCssSheet);
}

//----------------------------------------------------------------------------
function getDynamicCssSheet(unique_title) {
    for (var i = 0; i < document.styleSheets.length; i++) {
        var sheet = document.styleSheets[i];
        console.log(sheet);
        if (sheet.title == unique_title) {
            return sheet;
        }
    }
}

//----------------------------------------------------------------------------
function addAnimations() {
    let dynamicCssSheet = getDynamicCssSheet(dynamicCssSheetName)

    for (let i = 0; i < cards.length; i++) {

        const card = cards[i];

        dynamicCssSheet.insertRule(`
        .reveal-card${i} {
            animation: reveal-card${i} 0.5s backwards linear;
        }`, dynamicCssSheet.cssRules.length);

        dynamicCssSheet.insertRule(`
        @keyframes reveal-card${i} {
            0% {
                transform: perspective(400px) rotateY(180deg);
            }
            100% {
                background: url('${card.image}') center/cover no-repeat;
                transform: perspective(400px) rotateY(0deg);
            }
        }`, dynamicCssSheet.cssRules.length);
    }
}

