const router = require("express").Router();
const db = require ("../Database/DatabseConn");


// Save New Qualification
router.post("/api/post-qualifications",(req,res) => {
    const{description} = req.body;
    const sqlInsert = "INSERT INTO `qualification` (`description`) VALUES (?)";
    db.query(sqlInsert, [description], (error, result)=>{
        if(error){
            console.log(error);
        }
        else{
            res.send("Qualification Added Succesfully")
        }
    });
});

//Select All From Qulaifications
router.get("/api/get-qualifications", (req, res) => {
    const sqlGet = "SELECT * FROM qualification";
    db.query(sqlGet, (error, result)=>{
        res.send(result);
    });
}); 

// Select Spacific Qualification
router.get("/api/get-qualification/:id", (req, res) => {
    const{ id } = req.params;
    const sqlGet = "SELECT * FROM qualification WHERE id=?";
    db.query(sqlGet, id , (error, result)=>{
        res.send(result);
    });
});

// Update Qualification
router.put("/api/update-qualification/:id", (req, res) => {
    const{ id } = req.params;
    const{description} = req.body;
    const sqlUpdata = "UPDATE qualification SET description=? WHERE id=? ";
    db.query(sqlUpdata, [description, id] , (error, result)=>{
        res.send("Qualification Updated Succesfully");
    });
});

// Delete Qualification
router.delete("/api/remove-qualification/:id",(req,res) => {
    const{ id } = req.params;
    const sqlRemove = "DELETE FROM `qualification` WHERE id=? ";
    db.query(sqlRemove, [ id ], (error, result)=>{
        if(error){
            console.log(error);
        }
        else{
        res.send("Qualification Deleted Succesfully");

        }
    });
});


module.exports = router;