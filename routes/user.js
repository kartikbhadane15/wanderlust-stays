const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
// const userController = require("../controllers/users.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
     try {
        let { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // passport-local-mongoose method to register user
        console.log(registeredUser);
        req.login(registeredUser, (err) => { // passport method to log in user after registration
            if (err) {return next(err);
               }
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
        });
      
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})); 

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {  
    failureFlash: true,
    failureRedirect: "/login",
}), async (req, res) => { 
    req.flash("success", "Welcome back to WanderLust!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
});

module.exports = router;
