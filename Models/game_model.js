var sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

async function startup()
{
  db = await sqlite.open({
    filename: 'database.db',
    driver: sqlite3.Database
  });
}

startup();

// Return all Games
async function getAllGames()
{
  const results = db.all("SELECT * FROM Games");
  return results;
}

// Create a new Game
async function AddGame(Game) {

    if (!Game.Name || Game.Name.trim() === "") {
        throw new Error("Invalid name, empty name is not allowed");
    }

    const gameExists = await getGame(Game.Name);

    if (gameExists) {
        throw new Error("A game with this name already exists.");
    }

    await db.run(
        "INSERT INTO Games (name, Category, Amount_Available, Price) VALUES (?, ?, ?, ?)",
        [Game.Name, Game.Category, Game.Amount_Available, Game.Price]
    );
}

//get individual game
async function getGame(name)
{
    const result = await db.get(
        "SELECT * FROM Games WHERE Name = ?",
        [name]
    );

    return result;
}
// delete individual game
async function deleteGame(name)
{
  const results = db.all("DELETE FROM Games WHERE Name = ?", [name]);
  return results;
}
async function updateGame(game) {
    const results = await db.run(
        "UPDATE Games SET Category = ?, Price = ?, Amount_Available = ? WHERE name = ?",
        [game.Category, game.Price, game.Amount_Available, game.Name]
    );

    return results;
}

module.exports = {getAllGames, AddGame, getGame, deleteGame, updateGame};
