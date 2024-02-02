const router = require("express").Router();
const db = require ("../Database/DatabseConn");



// Select All Requests
router.get("/api/get-requests", (req, res) => {
    const sqlGet =" SELECT job_requests.ID, `job_ID`, `user_ID`, job_requests.status,`requested_Date`,users.name,job.Position FROM `job_requests`join users on job_requests.user_ID=users.id join job on job_requests.job_ID=job.ID WHERE job_requests.status='Pending' ";
    db.query(sqlGet, (error, result)=>{
        res.send(result);
    });
}); 


// Select History Requests Of Spacific Applicant
router.get("/api/get-applicant-requests/:user_ID", (req, res) => {
    const{ user_ID } = req.params;
    const sqlGet = " SELECT job_requests.ID, `job_ID`, `user_ID`, job_requests.status,`requested_Date`,users.name,job.Position FROM `job_requests`join users on job_requests.user_ID=users.id join job on job_requests.job_ID=job.ID WHERE user_ID=?";
    db.query(sqlGet, user_ID , (error, result)=>{
        res.send(result);
    });
});

// Select History Requests
router.get("/api/get-history-requests", (req, res) => {
    const sqlGet = " SELECT job_requests.ID, `job_ID`, `user_ID`, job_requests.status,`requested_Date`,users.name,job.Position FROM `job_requests`join users on job_requests.user_ID=users.id join job on job_requests.job_ID=job.ID WHERE job_requests.status='Accepted' or job_requests.status = 'Rejected'";
    db.query(sqlGet, (error, result)=>{
        res.send(result);
    });
}); 

// Accept a Request
router.put("/api/accept-request/:ID", (req, res) => {
     const{ ID } = req.params;
    const sqlUpdata = "UPDATE `job_requests` SET `status`='Accepted' WHERE ID=?";
    db.query(sqlUpdata, [ID] , (error, result)=>{
        if(result){
            res.send("Request Accept Successfully");
        }
        else{
            res.send(error);
        }
        
    });
});

// Reject a Request
router.put("/api/reject-request/:ID", (req, res) => {
    const{ ID } = req.params;
   const sqlUpdata = "UPDATE `job_requests` SET `status`='Rejected' WHERE ID=?";
   db.query(sqlUpdata, [ID] , (error, result)=>{
    if(result){
        res.send("Request Rejected Successfully");
    }
    else{
        res.send(error);
    }
});
});

// delete Request
router.delete("/api/remove-request/:ID",(req,res) => {
    const{ ID } = req.params;
    const sqlRemove = "DELETE FROM `job_requests` WHERE ID=? ";
    db.query(sqlRemove, [ ID ], (error, result)=>{
        if(result){
            res.send("Request Removed Successfully");
        }
        else{
            res.send(error);
        }
    });
});


///////////////////////////////////////////////////////////////////
// User AddRequest ==> very important
router.post("/api/add-request", (req, res) => {
    const{job_ID, user_ID} = req.body;
    const sqlInsert = "INSERT INTO `job_requests` (`job_ID`, `user_ID`) VALUES (?, ?)";
   db.query(sqlInsert, [job_ID, user_ID] , (error, result)=>{
    //    res.send("Job Send Sccussfully");
    if(error){
        console.log(error);
    }
       else{
       const ist="INSERT INTO `user_job`( `job_ID`, `user_ID`) VALUES (?,?)";
       db.query(ist,[job_ID, user_ID], (error,result)=>{
        if(result){
            res.send("Request Added Successfully");
        }
        else{
            res.send(error);
        }
       })
    }
   });
});
////////////////////////////////////////////////////////////

module.exports = router;