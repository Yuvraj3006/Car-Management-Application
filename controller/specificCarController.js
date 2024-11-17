    const db = require("../model/database")
    const {uploadOnCloudinary,cloudinary} = require("./cloudUpload")



    async function handleSpecifiPage(req, res) {
        try {
            const regisNum = req.query.carnumber;
            const values = [regisNum];
    
            // Fetch car details 
            const query1 = `SELECT * FROM cardetails WHERE useremail = ($1) AND carnumber = ($2)`;
            const detailsResult = await db.query(query1, [req.user,regisNum ]);
    
            // Fetch car images
            const query2 = `SELECT carimages FROM car_images WHERE carnumber = ($1)`;
            const imageResults = await db.query(query2, values);
    
            if (detailsResult.rows.length > 0) {
                const car = detailsResult.rows[0];
                
                // Ensure `images` is structured correctly as an object with a `carimages` array
                let images = { carimages: [] };
                if (imageResults.rows.length > 0) {
                    let rawImages = imageResults.rows[0].carimages;
    
                    // Handle JSON string or array from the database
                    if (typeof rawImages === 'string') {
                        try {
                            rawImages = JSON.parse(rawImages);
                        } catch (e) {
                            rawImages = [];
                        }
                    }
    
                    // Assign to `carimages`
                    images.carimages = Array.isArray(rawImages) ? rawImages : [];
                }
                //console.log(car);                // Render the view with car details and images
                res.render('carDetails', { car, images });
            } else {
                res.status(400).send("Car not found");
            }
        } catch (error) {
            console.log(`Error occurred: ${error}`);
            res.status(500).send("Internal server error");
        }
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
            const tagsArray = tags.split(',').map(tag => tag.trim());

            // Update details and images in the database
            const updateCarDetailsQuery = `
                UPDATE cardetails
                SET car_name = $1, car_description = $2, car_tags = $3
                WHERE carNumber = $4;
            `;
            await db.query(updateCarDetailsQuery, [
                title || result.rows[0].car_name,
                description || result.rows[0].car_description,
               tagsArray || result.rows[0].car_tags,
                carnumber,
            ]);

            // Update car images
            const updateCarImagesQuery = `
                UPDATE car_images
                SET carimages = $1
                WHERE carNumber = $2;
            `;
            await db.query(updateCarImagesQuery, [updatedImages, carnumber]);
            //console.log(updatedImages);
           return res.redirect('/');
        } catch (error) {
            console.error(`${error} : Error occurred while updating car details`);
            res.status(500).send({ error: "Internal Server Error" });
        }
    }

    async function handleDeleteCar(req, res) {
       // console.log("hwllo from delete");
        const carnumber = req.query.carnumber;  // Accessing carnumber from the query parameter
       // console.log(carnumber);  // Ensure the carnumber is logged correctly

        if (!carnumber) {
            return res.status(400).send({ error: "Car number is required" });
        }

        try {
            const deleteQuery = `DELETE FROM cardetails WHERE carnumber = $1`;
            const deleteValue = [carnumber];  // Passing carnumber as parameter
            await db.query(deleteQuery, deleteValue);
            return res.render("home");    
            //res.status(200).send({ message: "Car Deleted Successfully" });
        } catch (error) {
            console.error("Error deleting car:", error);
            res.status(500).send({ error: "Internal Server Error" });
        }
    }

    module.exports = {handleSpecifiPage,
        handleUpdateDetails,
        handleDeleteCar,
    };