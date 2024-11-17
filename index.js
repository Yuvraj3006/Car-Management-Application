const express = require("express")
require('dotenv').config()
const path = require('path');
const cookieParser = require('cookie-parser');
app = express();
const methodOverride = require('method-override');

// Enable method override



app.set('view engine',"ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set('views',path.resolve("./public/views"));
app.use(express.static('public'));
app.use(methodOverride('_method'));

//routes
const userAuthRoute = require("./routes/userAuthRoute")
const addCarRoute = require("./routes/addCarRoute")
const homePageRoute = require("./routes/homePageRoute")
const specificPageRoute = require("./routes/specificPageRoute")



app.use("/user",userAuthRoute);
app.use("/addCar",addCarRoute)
app.use("/",homePageRoute);
app.use("/specificCar",specificPageRoute)


app.listen( 8000 || process.env.PORT,() => {
    console.log(`Server running on port ${8000}`)
})