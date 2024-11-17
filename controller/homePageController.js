const db = require("../model/database");

async function handleHomePage(req, res) {
    try {
        // Ensure req.user is populated
        const useremail = req.user;
       // console.log(useremail);
        if (!useremail) {
            return res.status(401).send({ error: "Unauthorized access. User not authenticated." });
        }

        // Get the search query from request (if any)
        const searchKeyword = req.query.search || ''; // Default to an empty string if no search query is provided

        // Query to fetch cars and their images
        let query = `
            SELECT c.carNumber, c.car_name, c.car_tags, c.car_type, ci.carimages
            FROM cardetails c
            JOIN car_images ci ON c.carNumber = ci.carNumber
            WHERE c.useremail = $1
        `;
        
        // If a search keyword is provided, modify the query to filter based on the keyword
        if (searchKeyword) {
            query += `
                AND (
                    c.car_name ILIKE $2 OR
                    c.car_tags ILIKE $2 OR
                    c.car_type ILIKE $2
                )
            `;
        }

        // Execute the query
        const result = await db.query(query, searchKeyword ? [useremail, `%${searchKeyword}%`] : [useremail]);

        // If no cars are found
        /*if (result.rowCount === 0) {
            return res.status(404).send({ message: "No cars found." });
        }*/
        //console.log(result.rows[0]);
        // Map the query result to the desired format
        const carsWithImages = result.rows.map(row => ({
            carnumber: row.carnumber,
            imageurl: row.carimages, // Ensure this matches the database column
            cartype: row.car_type,
            carname: row.car_name,
            cartags: row.car_tags,
        }));

        // Send the response
        res.render('home', { carsWithImages });   
    } catch (error) {
        console.error(`${error} : Error occurred while loading cars or images`);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = handleHomePage;
