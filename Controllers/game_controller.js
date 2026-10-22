const express = require('express');
var router = express.Router()
const { getAllGames,AddGame,getGame,deleteGame } = require("../Models/game_model.js");

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

router.get("/view/:name", async function(req, res)
{
    const game = await getGame(req.params.name);

    if (!game) {
        return res.redirect("/games");
    }

    req.TPL.game = game;
    res.render("game_view", req.TPL);
});

router.delete("/delete/:name", async function(req, res)
{
    const game = await getGame(req.params.name);

    if (!game) {
        return res.redirect("/games");
    }

     await deleteGame(req.params.name);

  const games = await getAllGames();

  req.TPL.games = games;
  res.render("games", req.TPL);
});



module.exports = router;