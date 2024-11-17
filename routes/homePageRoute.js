const express = require("express");
const handleHomePage = require("../controller/homePageController");
const authenticateUser = require("../middleware/userAuthencation");
const { handleUserLogout } = require("../controller/userController");

const router = express.Router();

router.get("/",authenticateUser,handleHomePage);

router.get("/logout",handleUserLogout);

module.exports = router;