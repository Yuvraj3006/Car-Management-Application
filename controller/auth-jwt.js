require('dotenv').config()
const jwt  = require("jsonwebtoken")

const generateUserToken = ({userID,userEmail ,password}) => {
    return json.sign({userID,userEmail,password},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'6h'});
}

module.exports = generateUserToken;