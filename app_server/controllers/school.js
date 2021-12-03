const pool = require("../models/pool");


const putSchoolPic = async (req, res) => {
    let name = req.body.name;
    let url = req.body.url;
    let school_id = req.body.school_id;
    let type = req.body.type;

    console.log(req.body);

    let text , value;
    try{
        text = `select * from schools where school_id = $1 and type=$2`;
        value = [school_id, type];
        let result = await pool.query(text, value);
        result = result.rows;

        if(result.length > 0){
            text = `update schools set name=$1, url = $2 where school_id=$3 and type = $4`;
            value = [name, url, school_id, type];
        }else {
            text = `insert into schools (name, url, type) values 
                ($1, $2, $3)
            `;
            value = [name, url, type];
        }

        let finalRes = await pool.query(text, value);

        finalRes = finalRes.rows;
        console.log("final", finalRes);
        return res.status(200).json("ok")
    } catch (err){
        console.log("An err", err);
        return res.status(200).json("Error occured");
    }
}

module.exports = {
    putSchoolPic
}