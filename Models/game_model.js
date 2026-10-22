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
async function AddGame(Game)
{ 

    const games = getAllGames();

      const gameExists = games.some(
        game => game.name.toLowerCase() === Game.name.toLowerCase()
    );

    if (gameExists) {
        throw new Error("A game with this name already exists.");
    }


  await db.run("INSERT INTO Games VALUES (?,?,?)",
               [Game.name, Game.Category, Game.amount_available, Game.price]);
}

// Return individual game
async function getGame(rowid)
{
  const results = db.all("SELECT * FROM Games WHERE GameId = ?", [rowid]);
  return results;
}

// Return individual game
async function deleteGame(rowid)
{
  const results = db.all("DELETE FROM Games WHERE GameId = ?", [rowid]);
  return results;
}


module.exports = {getAllArticles
                 ,createArticle};
