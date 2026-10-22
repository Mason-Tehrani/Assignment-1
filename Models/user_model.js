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

// Return all of the users
async function getAllUsers()
{
  const results = db.all("SELECT * FROM Users");
  return results;
}

// Create a new user given a username and password
async function createUser(user)
{
  await db.run("INSERT INTO Users VALUES (?,?)",
               [user.username, user.password, user.userName]);
}


async function validateLogin(username, password)
{
  
  const match = await db.get('SELECT username, password FROM Users WHERE username = ?', username);
  if (match != null && match.password === password) {
    return true;
  } else {
    return false;
  }
}