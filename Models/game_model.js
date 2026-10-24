var sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

async function startup() {
    db = await sqlite.open({
        filename: 'database.db',
        driver: sqlite3.Database
    });
}

startup();

// Return all Games
async function getAllGames() {
    const results = db.all("SELECT * FROM Games");
    return results;
}

// Create a new Game
async function AddGame(Game) {

    if (!Game.Name || Game.Name.trim() === "") {
        throw new Error("Invalid name, empty name is not allowed");
    }

    const gameExists = await getGame(Game.Name);

    if (gameExists && gameExists != null) {
        throw new Error("A game with this name already exists.");
    }

    await db.run(
        "INSERT INTO Games (name, Category, Amount_Available, Price) VALUES (?, ?, ?, ?)",
        [Game.Name, Game.Category, Game.Amount_Available, Game.Price]
    );
}

//get individual game
async function getGame(name) {
    const results = await db.get(
        "SELECT * FROM Games WHERE Name = ?",
        [name]
    );

    console.log("\n\n\n ----- " + results)
       if ( results == undefined) {
        return "No games found with this name.";
    }

    return results;

}

//get all games with the same category
async function getGameByCategory(category) {
    const results = await db.all(
        "SELECT * FROM Games WHERE Category = ?",
        [category]
    );

    if ( results == undefined) {
        return "No games found in this category.";
    }

    return results;
}

//check if a game is in stock
async function checkGameStock(name) {
    const result = await getGame(name);

    console.log(result)

    if (result && result != null ) {
        return result;
    }  else {
        return "this game is not sold at rolling dice games";
    }




}

// delete individual game
async function deleteGame(name)
{
  const results = db.all("DELETE FROM Games WHERE Name = ?", [name]);
  return results;
}

//update a games catergory, ammount or price
async function updateGame(game) {
    const results = await db.run(
        "UPDATE Games SET Category = ?, Price = ?, Amount_Available = ? WHERE name = ?",
        [game.Category, game.Price, game.Amount_Available, game.Name]
    );

    return results;
}

module.exports = {getAllGames, AddGame, getGame, deleteGame, updateGame, checkGameStock, getGameByCategory};
