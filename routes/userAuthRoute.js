const express = require("express");
const { handleUserLogin, handleUserRegistration } = require("../controller/userController");

const router = express.Router();

router.get('/' , (req,res) => {
    res.render("login")
})

router.post("/login",handleUserLogin);

router.post("/register",handleUserRegistration);

module.exports = router;