const express = require("express");
const {handleSpecifiPage,handleUpdateDetails,handleDeleteCar} = require("../controller/specificCarController");
const authenticateUser = require("../middleware/userAuthencation");
const upload = require("../middleware/multer");


const router = express.Router();

router.get("/",authenticateUser,handleSpecifiPage);

router.put("/",authenticateUser,upload.array('carimages',10),handleUpdateDetails);

router.delete("/",authenticateUser,handleDeleteCar);

module.exports = router;