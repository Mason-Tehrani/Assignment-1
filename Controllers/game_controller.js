const express = require('express');
var router = express.Router()
const { getAllGames } = require("../Models/game_model.js");

// Display the home page
router.get("/", async function(req, res)
{
  const games = await getAllGames();

  req.TPL.games = games;
  res.render("games", req.TPL);
});

router.get("/games", async function(req, res)
{

  const games = await getAllGames();

  req.TPL.games = games;
  res.render("games", req.TPL);

});

router.get("/game/:id", async function(req, res)
{

  const games = await getAllGames();

  req.TPL.games = games;
  res.render("games", req.TPL);

});

module.exports = router;