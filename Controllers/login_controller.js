const express = require('express');
var router = express.Router()

const { validateLogin } = require("../Models/user_model.js");

// Displays the login page
router.get("/", async function(req, res)
{
  // if we had an error during form submit, display it, clear it from session
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("login", req.TPL);
});

// Attempts to login a user
// - The action for the form submit on the login page.
router.post("/attemptlogin", async function(req, res)
{

  const password = req.body.password;
  const username = req.body.username;

  // is the username and password OK?
  if (await validateLogin(username, password))
  {
    // set a session key username to login the user
    req.session.username = req.body.username;

    // re-direct the logged-in user to the members page
    res.redirect("/admin");
  }
  else
  {
    // if we have an error, reload the login page with an error
    req.session.login_error = "Invalid username and/or password!";
    res.redirect("/login");
  }

});

// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get("/logout", async function(req, res)
{
  delete(req.session.username);
  res.redirect("/home");
});

module.exports = router;