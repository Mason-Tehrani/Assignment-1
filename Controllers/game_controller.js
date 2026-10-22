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

router.get("/create", async function(req, res)
{
  req.TPL.game = null;
  res.render("game_view", req.TPL);
});

router.post("/delete/:name", async function(req, res)
{
    const game = await getGame(req.params.name);

    if (!game) {
        return res.redirect("/games");
    } else {
      
     await deleteGame(req.params.name);

      return res.redirect("/games");
    }

});



module.exports = router;