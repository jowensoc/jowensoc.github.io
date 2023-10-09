import romanNumberService from './RomanNumberService.js'

var mahjongRomanNumbersService = (function MahjongRomanNumbersService() {

    var gameListOfRomanNumbers = [];

    function createTiles(gameSettings) {
        gameListOfRomanNumbers = romanNumberService.romanNumberService().generateRomanNumbers(gameSettings.requiredTiles, gameSettings.startRange, gameSettings.endRange);

        var gameTiles = generateGameTiles();

        return gameTiles;
    }

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function generateGameTiles() {
        var gameTiles = [];

        for (let i = 0; i < gameListOfRomanNumbers.length; i++) {
            gameTiles.push({
                "number": gameListOfRomanNumbers[i].number.toString(),
                "type": "integer"
            });

            gameTiles.push({
                "number": gameListOfRomanNumbers[i].romanletter,
                "type": "romanletter"
            });
        }

        return shuffle(gameTiles);
    }

    function filterGameListOfRomanNumbers(gameTile) {
        let filterTile = null;

        if (gameTile.type === "integer") {
            filterTile =  gameListOfRomanNumbers.filter(item => item.numberString === gameTile.number)[0]
        } else if (gameTile.type === "romanletter")  {
            filterTile =  gameListOfRomanNumbers.filter(item => item.romanletter === gameTile.number)[0]
        } else  {
            filterTile =  gameListOfRomanNumbers.filter(item => item.numberString === gameTile.number)[0]
        }

        return filterTile;
    }

    function matchTiles(tile1, tile2) {
        // REJECT IF IT'S SAME GAME TILE
        if ((tile1.number === tile2.number) && (tile1.type === tile2.type)) {
            return false;
        }

        var filteredTile1 = filterGameListOfRomanNumbers(tile1);
        var filteredTile2 = filterGameListOfRomanNumbers(tile2);

        if (filteredTile1 === undefined || filteredTile2 === undefined) {
            return false;
        }

        return ((filteredTile1.numberString === filteredTile2.numberString) && (filteredTile1.romanletter === filteredTile2.romanletter));
    }

    function revealListOfRomanNumbers() {
        return gameListOfRomanNumbers;
    }

    return {
        createTiles: createTiles,
        matchTiles: matchTiles,
        revealListOfRomanNumbers: revealListOfRomanNumbers,
    }

});

export default { mahjongRomanNumbersService }