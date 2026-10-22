const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.db");

db.serialize(function () {

    // Create an initial table of users
    db.run("DROP TABLE IF EXISTS Users");
    db.run("CREATE TABLE Users (username TEXT, password TEXT)");
    db.run("INSERT INTO Users VALUES (?,?)", ['employee1', 'employee1']);
    db.run("INSERT INTO Users VALUES (?,?)", ['employee2', 'employee2']);

    // create an initial table of Games
    db.run("DROP TABLE IF EXISTS Games");
    db.run("CREATE TABLE Games (Name TEXT, Category TEXT, Amount_Available INTEGER, Price)");
    db.run("INSERT INTO Games VALUES(?,?,?,?)",['Catan', 'Dice', 2, 29.99])
    db.run("INSERT INTO Games VALUES(?,?,?,?)",['Chess', 'Strategy', 4, 39.99])
    db.run("INSERT INTO Games VALUES(?,?,?,?)",['Risk', 'Strategy', 6, 49.99])
    db.run("INSERT INTO Games VALUES(?,?,?,?)",['Yahtzee', 'Dice', 8, 59.99])



});
