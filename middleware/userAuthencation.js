require('dotenv').config();
const jwt = require("jsonwebtoken");

async function authenticateUser(req, res, next) {
    const token = req.cookies.auth_token;
    //console.log("Token received:", token);

    if (!token) {
        return res.render('login');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        //console.log("Decoded payload:", decoded);
          req.user = decoded.useremail; // Attach decoded payload to req.user
        next();
    } catch (error) {
        //console.log(`Error during token verification: ${error.message}`);
        return res.status(403).send({ message: "Invalid or Expired Token" });
    }
}

module.exports = authenticateUser;
