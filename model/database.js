const pg = require("pg")
require('dotenv').config()

const db = new pg.Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl:{
        rejectUnauthorized:false
     }
});

db.connect();

module.exports = db;