const db = require("../model/database")
const {uploadOnCloudinary,cloudinary} = require("./cloudUpload")

function isPresent(existingImages,removedImages){

}

async function handleSpecifiPage(req,res) {
    try{
        const regisNum = req.query.carNumber;
        console.log(regisNum)
        const values = [regisNum];
        const query1 = `select * from cardetails where useremail = ($1)`
        const detailsResult = await db.query(query1,[req.user.useremail]);

        const query2 = `select carimages from car_images where carnumber = ($1)`
        const imageResults = await db.query(query2,values);

        if(detailsResult.rows.length >0 ){
            const car = detailsResult.rows[0];
            const images = imageResults.rows[0];
            res.json({car,images});
        }else{
            res.status(400).send("Car not found");
        }
    }
    catch(error){
        console.log(`Error occured : ${error}`);
    }
    //res.send("Specific Car Details Page");
}

async function handleUpdateDetails(req,res) {

    const { carnumber } = req.query;
    const { title, description, tags, removedImages } = req.body; // New details and images to remove
    
    try{
    const fetchQuery = `
            SELECT c.car_name, c.car_tags, c.car_description, ci.carimages
            FROM cardetails c
            JOIN car_images ci ON c.carNumber = ci.CarNumber
            WHERE c.carNumber = $1;
        `;
        const result = await db.query(fetchQuery, [carnumber]);

        if (result.rowCount === 0) {
            return res.status(404).send({ error: "Car not found" });
        }

        const existingCar = result.rows[0];
        let existingImages = existingCar.carimages; // Current image URLs


        console.log("Existing Images:", existingImages);
        console.log("Removed Images:", removedImages);

        if (removedImages && removedImages.length > 0) {
            for (const imageUrl of removedImages) {
                console.log("Processing image:", imageUrl);
                if (existingImages.includes(imageUrl)) {
                    console.log("Deleting image:", imageUrl);
                    existingImages = existingImages.filter((img) => img !== imageUrl);
                    const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract Cloudinary public ID
                    await cloudinary.uploader.destroy(publicId); // Remove the image from Cloudinary

                    // Remove from existingImages only the ones in removedImages
                   
                }
            }
        }

        

        console.log("Updated Existing Images:", existingImages);

        

        // Upload new images to Cloudinary
        let updatedImages = []
        const newImageUrls = []
        if(req.files){
            for (const file of req.files) {
                const filepath = file.path;
                const result = await uploadOnCloudinary(filepath);
                const imageUrl = result;
                newImageUrls.push(imageUrl);   
            }
            
           
        }
        // Combine remaining and new images
        updatedImages = [...existingImages, ...newImageUrls];

        // Update details and images in the database
        const updateCarDetailsQuery = `
            UPDATE cardetails
            SET car_name = $1, car_description = $2, car_tags = $3
            WHERE carNumber = $4;
        `;
        await db.query(updateCarDetailsQuery, [
            title || result.rows[0].car_name,
            description || result.rows[0].car_description,
            tags ? JSON.parse(tags) : result.rows[0].car_tags,
            carnumber,
        ]);

        // Update car images
        const updateCarImagesQuery = `
            UPDATE car_images
            SET carimages = $1
            WHERE carNumber = $2;
        `;
        await db.query(updateCarImagesQuery, [updatedImages, carnumber]);
        console.log(updatedImages);
        res.status(200).send({
            message: "Car details and images updated successfully",
            carDetails: {
                title: title || existingCar.car_name,
                description: description || existingCar.car_description,
                tags: tags ? JSON.parse(tags) : existingCar.car_tags,
                images: updatedImages,
            },
        });
    } catch (error) {
        console.error(`${error} : Error occurred while updating car details`);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

async function handleDeleteCar(req, res) {
    const carnumber = req.query.carnumber;  // Accessing carnumber from the query parameter
    console.log(carnumber);  // Ensure the carnumber is logged correctly

    if (!carnumber) {
        return res.status(400).send({ error: "Car number is required" });
    }

    try {
        const deleteQuery = `DELETE FROM cardetails WHERE carnumber = $1`;
        const deleteValue = [carnumber];  // Passing carnumber as parameter
        await db.query(deleteQuery, deleteValue);

        res.status(200).send({ message: "Car Deleted Successfully" });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = {handleSpecifiPage,
    handleUpdateDetails,
    handleDeleteCar,
};