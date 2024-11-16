const express = require("express")
require('dotenv').config()
const path = require('path')
app = express();

app.set('view engine',"ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views',path.resolve("./views"));

//routes
const userAuthRoute = require("./routes/userAuthRoute")
const addCarRoute = require("./routes/addCarRoute")
const homePageRoute = require("./routes/homePageRoute")

app.use("/user",userAuthRoute);
app.use("/addCar",addCarRoute)
app.use("/",homePageRoute);

app.listen( 8000 || process.env.PORT,() => {
    console.log(`Server running on port ${8000}`)
})