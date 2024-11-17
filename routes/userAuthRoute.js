const express = require("express");
const { handleUserLogin, handleUserRegistration } = require("../controller/userController");

const router = express.Router();

router.get('/login' , (req,res) => {
    res.render("login")
})

router.get("/signup",(req,res) => {
    res.render("signup");
})

router.post("/login",handleUserLogin);

router.post("/signup",handleUserRegistration);

module.exports = router;