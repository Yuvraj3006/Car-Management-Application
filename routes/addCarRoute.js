const express = require("express");
const handleAddCar = require("../controller/addCarController");
const upload = require("../middleware/multer");
const router = express.Router();

router.post("/",upload.array('carImages',10),handleAddCar);

module.exports = router;