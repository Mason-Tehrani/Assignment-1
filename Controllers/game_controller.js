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
    const existingGame = await getGame(req.params.name);

    if (!existingGame) {
        return res.redirect("/games");
    } 

    req.TPL.game = existingGame;
    res.render("game_view", req.TPL);
});

router.get("/create", async function(req, res)
{
  req.TPL.game = null;
  res.render("game_view", req.TPL);
});


router.post("/create", async function(req, res) {
    try {
        const game = req.body;

        await AddGame(game);

        return res.redirect("/games");

    } catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    }
});

router.post("/delete/:name", async function(req, res)
{
    const existingGame = await getGame(req.params.name);

    if (!existingGame) {
        return res.redirect("/games");
    } else {
      
     await deleteGame(req.params.name);

      return res.redirect("/games");
    }

});



module.exports = router;