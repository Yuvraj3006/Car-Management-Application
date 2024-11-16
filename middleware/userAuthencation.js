require('dotenv').config();
const jwt = require("jsonwebtoken");

async function authenticateUser(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.log("Authorization header is missing");
        return res.status(401).send({ message: "Access Denied: No Token Provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token);

    if (!token) {
        return res.status(401).send({ message: "Access Denied: No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded payload:", decoded);

        req.user = decoded; // Attach decoded payload to req.user
        next();
    } catch (error) {
        console.log(`Error during token verification: ${error.message}`);
        return res.status(403).send({ message: "Invalid or Expired Token" });
    }
}

module.exports = authenticateUser;
