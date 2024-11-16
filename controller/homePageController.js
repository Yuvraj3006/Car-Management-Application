const db = require("../model/database")

async function handleHomePage(req,res) {
    try{
        let query1 = ` SELECT c.car_name, c.car_tags, c.car_type, ci.carimages
                        FROM cardetails c JOIN car_images ci ON c.carNumber = ci.CarNumber AND c.useremail = $1`;
        
        console.log(req.user);
        const result = await db.query(query1,[req.user]);
            const carsWithImages = result.rows.map(row => ({
                registrationnumber: row.carNumber,
                imageurl: row.image_urls,
                cartype: row.car_type,
                carname: row.car_name,
                cartags : row.car_tags
                
            }));
            //console.log(carsWithImages);
            res.json({
                carsWithImages
             });
        
    }catch(error){
        console.log(`${error} : Error occured while loading images`);
    }  
}

module.exports = handleHomePage;