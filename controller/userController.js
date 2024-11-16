const db = require("../model/database")
const bcrypt = require("bcrypt")
const generateUserToken = require("./auth-jwt")


async function handleUserLogin(req, res) {
    const {useremail,userpassword} = req.body;
    try {
            if(!useremail || !userpassword){
                return res.status(400).send({message : "Enter all the fields correctly"});
            }

            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            const isValidEmail = emailRegex.test(useremail);
            if (!isValidEmail) {
                return res.status(400).send({ error: "Enter a valid email address" });
            }

            const result = await db.query(`SELECT * FROM users WHERE useremail = $1`,[useremail]);

            if(result.rowCount === 0){
                return res.status(400).send({ message : "The user does not exist"});
            }

            const user = result.rows[0];
            
            const verify = await bcrypt.compare(userpassword,user.userpassword);
            if(!verify){
                return res.status(400).send({ message : "Incorrect pasword. Please try again."})
            }
            console.log(user.useremail);
            return res.json(generateUserToken({username : user.username,useremail : user.useremail}));
            

    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({message : "Internal Server Error"});
    }
}

async function handleUserRegistration(req,res) {
    const {useremail,username, userpassword} = req.body;
    try {
        if(!username || !useremail || !userpassword ){
            return res.status(400).send({message : "Enter all the fields"});
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const isValidEmail = emailRegex.test(useremail);
        if (!isValidEmail) {
            return res.status(400).send({ error: "Enter a valid email address" });
        }

        const passwordRegex = /^(?=(.*[A-Za-z]){6,})(?=(.*\d){4,})(?=(.*[\W_]){1,}).{11,}$/;
        const validPassword = passwordRegex.test(userpassword);
        if (!validPassword) {
            return res.status(400).send({ error: "The user password must contain at least 6 alphabets, 4 digits, and 1 special character." });
        }


        const doesUserExist = await db.query(`SELECT * FROM users WHERE useremail = $1`,[useremail]);
        if(doesUserExist.rowCount !== 0){
            return res.status(400).send({ message : "The user already exists"});
        }

        const hashedPassword = await bcrypt.hash(userpassword,10);

        const userCreationQuery = `INSERT INTO users (username, useremail, userpassword) VALUES ($1,$2,$3)`;
        const userCreationDetails = [username,useremail,hashedPassword];
        await db.query(userCreationQuery,userCreationDetails);
        return res.json(generateUserToken({username : username,useremail : useremail}));

    } catch (error) {
        console.log(`error : ${error}`);
        return res.status(500).send({ message : "Internal Server Error"});
    }
    
}


module.exports = {
    handleUserLogin,handleUserRegistration
}