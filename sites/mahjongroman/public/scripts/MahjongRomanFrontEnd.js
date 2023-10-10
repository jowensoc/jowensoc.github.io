import * as services from './MahjongRomanNumbersService.js';

let mahjongService = services.default.mahjongRomanNumbersService();

let tiles;
let gameBoard;
let gameActiveCSS = "game-active-tile";
let gameInActiveCSS = "game-inactive-tile";
let gameSelectedTitleCSS = "game-tile-selected";
let matchingTiles = [];
let matchedCounter = 0;
let totalPairs = 0;

function initGame(gameMode) {
    gameBoard = document.getElementById("mahjong-game-board");
    matchedCounter = 0;
    totalPairs = 0;
    clearBoard();
    createBoard(createGameSettings(gameMode));
}

function createGameSettings(gameMode) {
    let startRange = 0;
    let endRange = 0;
    let requireTiles = 0;

    switch (gameMode) {
        case "easy":
            startRange = 1;
            endRange = 10;
            requireTiles = 10;
            break;
        case "normal":
            startRange = 1;
            endRange = 25;
            requireTiles = 30;
            break;
        case "hard":
            startRange = 100;
            endRange = 200;
            requireTiles = 35;
            break;
        case "impossible":
            startRange = 100;
            endRange = 2000;
            requireTiles = 30;
            break;
        case "custom":
            startRange = parseTextBox("min-range", 1);
            endRange = parseTextBox("max-range", 10);
            requireTiles = parseTextBox("no-of-tiles", 20);
            break;
        default:
            startRange = 1;
            endRange = 10;
            requireTiles = 10;
            break;
    }

    return {"startRange": startRange,
        "endRange": endRange,
        "requiredTiles": requireTiles
    };
}

function clearBoard() {
    gameBoard.innerHTML = '';
}

function parseTextBox(txtBox, defaultVal) {
    let txtBoxVal = defaultVal;

    if (document.getElementById(txtBox).value.trim().length > 0) {
        txtBoxVal = document.getElementById(txtBox).value;
    }

    let intVal = parseInt(txtBoxVal);

    if (intVal === NaN) {
        intVal = defaultVal;
    }

    return intVal;
}

function setupMenu() {
    document.getElementById("mahjong-easy-game").addEventListener("click", () => {
        initGame("easy");
    });

    document.getElementById("mahjong-normal-game").addEventListener("click", () => {
        initGame("normal");
    });

    document.getElementById("mahjong-hard-game").addEventListener("click", () => {
        initGame("hard");
    });

    document.getElementById("mahjong-impossible-game").addEventListener("click", () => {
        initGame("impossible");
    });

    document.getElementById("mahjong-custom-game").addEventListener("click", () => {
        initGame("custom");
    });
}

function createBoard(gameSettings) {
    resetGameStatus();
    tiles = mahjongService.createTiles(gameSettings);
    totalPairs = tiles.length / 2;

    for(let idx=0; idx < tiles.length; idx++) {
        let divObj = createGameTile(tiles[idx]);
        gameBoard.appendChild(divObj);
    }
}

function createGameTile(tileData) {
    let divText = document.createElement("p");
    divText.innerHTML = tileData.number

    let divElement = document.createElement("div");

    divElement.appendChild(divText);
    divElement.classList.add("game-tile");
    divElement.classList.add(gameActiveCSS);
    divElement.setAttribute("data-number", tileData.number);
    divElement.setAttribute("data-type", tileData.type);
    divElement.addEventListener("click", tileClickEvent);

    return divElement;
}

function tileClickEvent() {
    // DON'T ADD SAME TILE. AVOID DUPLICATES
    if (matchingTiles.indexOf(this) > -1) {
        return;
    }

    if (matchingTiles.length < 2) {
        matchingTiles.push(this);
        this.classList.add(gameSelectedTitleCSS);
    }

    if (matchingTiles.length === 2) {
        let matched = matchTiles();

        if (matched) {
            matchedCounter += 1;
            disabledMatchedTiles();
        } else {
            setTimeout(clearMatchingTiles, 2000);
        }

    }

    if (matchedCounter === totalPairs) {
        gameStatusSuccess();
    }
}

function gameStatusSuccess() {
    let gameStatusElement =  document.getElementById("game-status");
    gameStatusElement.classList.add("game-status-success");
    gameStatusElement.innerHTML = "<p>Game Over!</p>";
}

function resetGameStatus() {
    let gameStatusElement =  document.getElementById("game-status");
    gameStatusElement.setAttribute("class", "");
    gameStatusElement.innerHTML = "";
}

function matchTiles() {

    let tile1 = {
        "number": matchingTiles[0].getAttribute("data-number"),
        "type": matchingTiles[0].getAttribute("data-type")
    }
    let tile2 = {
        "number": matchingTiles[1].getAttribute("data-number"),
        "type": matchingTiles[1].getAttribute("data-type")
    }

    return mahjongService.matchTiles(tile1, tile2);
}

function clearMatchingTiles() {

    for(let idx=0; idx < matchingTiles.length; idx++) {
        matchingTiles[idx].classList.remove(gameSelectedTitleCSS);
    }
    matchingTiles = [];
}

function disabledMatchedTiles() {
    for(let idx=0; idx < matchingTiles.length; idx++) {
        matchingTiles[idx].classList.remove(gameActiveCSS);
        matchingTiles[idx].classList.remove(gameSelectedTitleCSS);

        matchingTiles[idx].classList.add(gameInActiveCSS);
        matchingTiles[idx].removeEventListener("click", tileClickEvent);
    }
    matchingTiles = [];
}

document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    initGame("easy");
})