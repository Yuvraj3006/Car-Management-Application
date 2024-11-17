const express = require("express");
const {handleSpecifiPage,handleUpdateDetails,handleDeleteCar} = require("../controller/specificCarController");
const authenticateUser = require("../middleware/userAuthencation");
const upload = require("../middleware/multer");
const methodOverride = require('method-override');

const router = express.Router();
router.use(methodOverride('_method'));
router.get("/",authenticateUser,handleSpecifiPage);

router.post("/updateDetails",authenticateUser, upload.array('carimages',10),handleUpdateDetails);

router.delete("/deleteCar",authenticateUser,handleDeleteCar);

module.exports = router;