require('dotenv').config()
const jwt = require("jsonwebtoken")

async function authenticateUser(req,res,next) {
    const token = req.header('Authorization')?.split(" ")[1];
    
    if(!token) return res.status(401).send("Access Denied");

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_USER);
        req.user = decoded;
        next();
    } catch (error) {
           console.log(`The error ocured is : ${error}`) 
    }
}

module.exports = authenticateUser;