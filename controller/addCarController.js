const db = require("../model/database");
const uploadImages = require("../utils/imageUpload");
const cloudin = require("../controller/cloudUpload");


async function handleAddCar(req, res) {
    const { carNumber, carName, carType, carCompany, carDescription, carFuel, carTags } = req.body;
    console.log(req.body);

    try {
        // Check for missing fields
        if (!carName || !carCompany || !carDescription || !carType || !carTags || !carNumber || !carFuel) {
            return res.status(400).send({ error: "All fields must be entered" });
        }

        // Check if car already exists
        const result = await db.query(
            `SELECT carNumber FROM carDetails WHERE carNumber = $1`,
            [carNumber]
        );
        if (result.rowCount !== 0) {
            return res.status(400).send({ message: "Car already exists" });
        }

        

        if(!req.files){
            return res.status(400).send({message : "Please add images to the car"});
        }

        const imageUrls = [];
        for (const file of req.files) {
            const filepath = file.path;
            const result = await cloudin(filepath);
            const imageUrl = result;
            imageUrls.push(imageUrl);   
        }
        

        // Insert new car details
        const insertDetailsQuery = `
            INSERT INTO carDetails (carNumber, car_name, car_type, car_company, car_description, car_fuel, car_tags,useremail)
            VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
        `;
        const insertDetails = [carNumber, carName, carType, carCompany, carDescription, carFuel, carTags,req.user.useremail];
        await db.query(insertDetailsQuery, insertDetails);

        const insertImagesQuery = `INSERT INTO car_images (carNumber,carImages) VALUES ($1,$2)`;
        const insertImagesDetails = [carNumber,imageUrls];
        await db.query(insertImagesQuery,insertImagesDetails);

        // Success response
        res.status(201).send({ message: "Car added successfully" });
    } catch (error) {
        console.error(`Error while adding car: ${error.message}`);
        res.status(500).send({ error: "An error occurred while adding the car." });
    }
}

module.exports = handleAddCar;
