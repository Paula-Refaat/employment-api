const router = require("express").Router();
const db = require("../Database/DatabseConn");
// `SELECT * FROM job ${search}`




//Select All From Jobs For Admin 
router.get("/api/get-jobs", (req, res) => {
    let search = "";
    if(req.query.search){
        search = `WHERE Position LIKE '%${req.query.search}%'`
    }
    const sqlGet = `SELECT * FROM job ${search}`;
    db.query(sqlGet, (error, result)=>{
        res.send(result);
    });
});


//Select All From Jobs
router.get("/api/get-jobs/qs", (req, res) => {
    const sqlGet = "SELECT job.ID, qualification.description AS Qualifications FROM `job`join job_qualification on job.ID=job_qualification.job_ID JOIN qualification on qualification.id=job_qualification.qualification_ID";
    db.query(sqlGet, (error, result)=>{
        res.send(result);
    });
});


//Save New Job
router.post("/api/post-job",(req,res) => {
    console.log(req.body);
    const{Position,Description,Offer,MaxCandidateNumber} = req.body;
    const sqlInsert = "INSERT INTO job (Position, Description, Offer,MaxCandidateNumber) VALUES (?, ?, ?, ?)";
    db.query(sqlInsert, [Position, Description, Offer, MaxCandidateNumber], (error, result)=>{
        if(error){
            console.log(error);
        }
        else{

           const ist="INSERT INTO job_qualification( job_ID, qualification_ID) VALUES (?,?)";
           if(Array.isArray(req.body.selected)){
            req.body.selected.forEach(
                (index)=>{ db.query(ist,[result.insertId,index],(res,err)=>{
                    if(err){
                        console.log(err);
                    }
                    console.log("Done");
                   })}
               )
           }
           else{
            [req.body.selected].forEach(
                (index)=>{ db.query(ist,[result.insertId,index],(res,err)=>{
                    if(err){
                        console.log(err);
                    }

                   })}
               )
           }
        res.send("Job Created Successfully");
        }
    });
});


// Delete Job
router.delete("/api/remove-job/:ID",(req,res) => {
    const{ ID } = req.params;
    const sqlRemove = "DELETE FROM `job` WHERE ID=? ";
    db.query(sqlRemove, [ ID ], (error, result)=>{
        if(error){
            console.log(error);
        }
        else{
        res.send("Job Deleted Successfully");

        }
    });
});


//Select Spacific Job
router.get("/api/get-job/:ID", (req, res) => {
    const{ ID } = req.params;
    const sqlGet = "SELECT * FROM job WHERE ID=?";
    db.query(sqlGet, ID , (error, result)=>{
        res.send(result);
    });
});

//Save Search Key
/* router.post("/search", (req, res) => {
    const{user_ID,key_word} = req.body;
    const sqlInsert = "INSERT INTO `user_search` (`user_ID`,`key_word`) VALUES (?,?)";
   db.query(sqlInsert, [user_ID,key_word] , (error, result)=>{
       res.send(result);
   });
});
 */

// Update Job
router.put("/api/update-job/:ID", (req, res) => {
    const{ ID } = req.params;
    const{Position, Description, Offer, MaxCandidateNumber} = req.body;
    const sqlUpdata = "UPDATE job SET Position=? , Description=? , Offer=?, MaxCandidateNumber=? WHERE ID=? ";
    db.query(sqlUpdata, [Position, Description, Offer, MaxCandidateNumber, ID] , (error, result)=>{
        if(error){
            res.send("Don't Update");
        }
        else{
    const querydeleted="DELETE FROM job_qualification WHERE job_ID=?";
    db.query(querydeleted,ID,()=>{
        const ist="INSERT INTO job_qualification( job_ID, qualification_ID) VALUES (?,?)";
            if(Array.isArray(req.body.selected)){
                req.body.selected.forEach(
                    (index)=>{ db.query(ist,[ID,index],(res,err)=>{
                        if(err){
                            console.log(err);
                        }
                       })}
                   )
               }
               else{
                [req.body.selected].forEach(
                    (index)=>{ db.query(ist,[ID,index],(res,err)=>{
                        if(err){
                            console.log(err);
                        }
                       })}
                   )
               }
    });
         res.send("Job Updated Successfully");
    }
    });
});

///////////////////////////////////////////////////////////////
//User Save Search in Database
router.post("/search", (req, res) => {
    const{user_ID,key_word} = req.body;
    const sqlget="SELECT * FROM `job` WHERE Position=?";
    db.query(sqlget,[key_word],(error,result) => {       
        if(result[0] != undefined){
            const sqlInsert = "INSERT INTO `user_search` (`user_ID`,`key_word`) VALUES (?,?)";
            db.query(sqlInsert, [user_ID,key_word] , (err, resu)=>{
                if(resu){
                    res.send("Word Saved Successfully");
                }
 
            });
            // res.send("Word Successfully");
        }
        else{
            res.send("No Jobs Found Related To Your Search");
        }
    });
});

// User Get all Key-Words
router.get("/search-history/:user_ID", (req, res) => {
    const{ user_ID } = req.params;
    const sqlGet = "SELECT * FROM `user_search` WHERE user_ID=?";
    db.query(sqlGet, user_ID , (error, result)=>{
        res.send(result);
    });
});

// User Delete One Search
router.delete("/delete-one-search/:id",(req,res) => {
    const{ id } = req.params;
    const sqlRemove = "DELETE FROM `user_search` WHERE id=? ";
    db.query(sqlRemove, [ id ], (error, result)=>{
        if(error){
            console.log(error);
        }
        else{
        res.send("Search Deleted Successfully");
        }
    });
});

// User Clear All Search
router.delete("/clearAll/:user_ID",(req,res) => {
    const{ user_ID } = req.params;
    const sqlRemove = "DELETE FROM `user_search` WHERE user_ID=? ";
    db.query(sqlRemove, [ user_ID ], (error, result)=>{
        if(error){
            console.log(error);
        }
        else{
        res.send("Search Cleared Successfully");
        }
    });
});


//Select All From Jobs For User 
router.get("/api/get-available-jobs", (req, res) => {
    let search = "";
    if(req.query.search){
        search = `Position LIKE '%${req.query.search}%' AND ` 
    }
    const sqlGet = `SELECT * FROM job WHERE (${search} ID NOT IN(SELECT job.ID FROM job_requests JOIN job ON job.ID=job_requests.job_ID WHERE (status = 'Accepted') GROUP BY job_requests.job_ID HAVING COUNT(status) = job.MaxCandidateNumber))`;
    db.query(sqlGet, (error, result)=>{
        res.send(result);
    });
});

module.exports = router;