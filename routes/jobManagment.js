const router = require("express").Router();
const db = require("../Database/DatabseConn");
const {
  updateJob,
  getOneJob,
  deleteJob,
  getAllJob,
  createJob,
} = require("../services/jobServices");
// `SELECT * FROM job ${search}`

//Select All From Jobs For Admin
router.get("/api/get-jobs", (req, res) => {
  let search = "";
  if (req.query.search) {
    search = `WHERE Position LIKE '%${req.query.search}%'`;
  }
  const sqlGet = `SELECT * FROM job ${search}`;
  db.query(sqlGet, (error, result) => {
    res.send(result);
  });
});

//Save New Job
router.post("/api/post-job", createJob);

//Select All From Jobs
router.get("/api/get-jobs/qs", getAllJob);

//Select Spacific Job
router.get("/api/get-job/:ID", getOneJob);

// Update Job
router.put("/api/update-job/:ID", updateJob);

// Delete Job
router.delete("/api/remove-job/:ID", deleteJob);

///////////////////////////////////////////////////////////////////////////////////////
//User Save Search in Database
router.post("/search", (req, res) => {
  const { user_ID, key_word } = req.body;
  const sqlget = "SELECT * FROM `job` WHERE Position=?";
  db.query(sqlget, [key_word], (error, result) => {
    if (result[0] != undefined) {
      const sqlInsert =
        "INSERT INTO `user_search` (`user_ID`,`key_word`) VALUES (?,?)";
      db.query(sqlInsert, [user_ID, key_word], (err, resu) => {
        if (resu) {
          res.send("Word Saved Successfully");
        }
      });
      // res.send("Word Successfully");
    } else {
      res.send("No Jobs Found Related To Your Search");
    }
  });
});

// User Get all Key-Words
router.get("/search-history/:user_ID", (req, res) => {
  const { user_ID } = req.params;
  const sqlGet = "SELECT * FROM `user_search` WHERE user_ID=?";
  db.query(sqlGet, user_ID, (error, result) => {
    res.send(result);
  });
});

// User Delete One Search
router.delete("/delete-one-search/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM `user_search` WHERE id=? ";
  db.query(sqlRemove, [id], (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send("Search Deleted Successfully");
    }
  });
});

// User Clear All Search
router.delete("/clearAll/:user_ID", (req, res) => {
  const { user_ID } = req.params;
  const sqlRemove = "DELETE FROM `user_search` WHERE user_ID=? ";
  db.query(sqlRemove, [user_ID], (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send("Search Cleared Successfully");
    }
  });
});

//Select All From Jobs For User
router.get("/api/get-available-jobs", (req, res) => {
  let search = "";
  if (req.query.search) {
    search = `Position LIKE '%${req.query.search}%' AND `;
  }
  const sqlGet = `SELECT * FROM job WHERE (${search} ID NOT IN(SELECT job.ID FROM job_requests JOIN job ON job.ID=job_requests.job_ID WHERE (status = 'Accepted') GROUP BY job_requests.job_ID HAVING COUNT(status) = job.MaxCandidateNumber))`;
  db.query(sqlGet, (error, result) => {
    res.send(result);
  });
});

module.exports = router;
