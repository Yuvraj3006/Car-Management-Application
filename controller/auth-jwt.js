const jwt = require("jsonwebtoken")
require("dotenv").config()

function generateUserToken({username,useremail}) {
    const token =  jwt.sign({username,useremail},process.env.ACCESS_TOKEN_SECRET,{expiresIn : "6h"});
    //console.log(token);
    return token;
}

module.exports = generateUserToken;