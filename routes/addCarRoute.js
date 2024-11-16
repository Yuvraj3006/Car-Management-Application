const express = require("express");
const handleAddCar = require("../controller/addCarController");
const upload = require("../middleware/multer");
const authenticateUser = require("../middleware/userAuthencation");
const router = express.Router();


//call route /login -> middleware -> controller(handles data)
router.post("/",authenticateUser,upload.array('carImages',10), handleAddCar);

//localhost:8000/addCar
module.exports = router;


/*
    m :- models - database
    v :- views - frontend
    r :- routes - api routes
    c :- controllers - - api functioning
*/