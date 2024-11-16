const jwt = require("jsonwebtoken")
require("dotenv").config()

async function generateUserToken({username,useremail}) {
    return jwt.sign({username,useremail},process.env.ACCESS_TOKEN_SECRET,{expiresIn : "6h"});
}

module.exports = generateUserToken;