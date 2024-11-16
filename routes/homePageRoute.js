const express = require("express");
const handleHomePage = require("../controller/homePageController");
const authenticateUser = require("../middleware/userAuthencation");

const router = express.Router();

router.get("/",authenticateUser,handleHomePage);

module.exports = handleHomePage;