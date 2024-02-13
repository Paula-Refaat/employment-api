const util = require("util");
const asyncHandler = require("express-async-handler");

const db = require("../Database/DatabseConn");
const ApiError = require("../utils/ApiError");

let query = util.promisify(db.query).bind(db); // trasform db to promisifiy to be async/await

// create Job
exports.createJob = asyncHandler(async (req, res, next) => {
  const { qualifications, ...jobData } = req.body;

  // Start a transaction
  await query("START TRANSACTION");

  try {
    // Insert job data
    const jobResult = await query("INSERT INTO job SET ?", [jobData]);

    // Insert qualifications
    if (Array.isArray(qualifications)) {
      for (const qualification of qualifications) {
        await query(
          "INSERT INTO job_qualification (job_ID, qualification_ID) VALUES (?, ?)",
          [jobResult.insertId, qualification]
        );
      }
    }

    // Commit the transaction if everything is successful
    await query("COMMIT");

    res
      .status(200)
      .json({ message: "Job Created Successfully", data: req.body });
  } catch (error) {
    // Rollback the transaction in case of an error
    await query("ROLLBACK");

    // Handle the error
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Select All from jobs
exports.getAllJob = asyncHandler(async (req, res, next) => {
  const jobsQuery = `SELECT * FROM job`;

  const jobs = await query(jobsQuery);

  if (!jobs || jobs.length === 0) {
    return next(new ApiError("There are no jobs in our DB", 404));
  }

  res.status(200).json(jobs);
});

// Select one job
exports.getOneJob = asyncHandler(async (req, res, next) => {
  const jobId = req.params.ID;

  const jobsQuery = `
    SELECT
      job.ID,
      job.Position,
      job.Description,
      job.Offer,
      job.MaxCandidateNumber,
      GROUP_CONCAT(qualification.description) AS Qualifications
      FROM job
    LEFT JOIN job_qualification ON job.ID = job_qualification.job_ID
    LEFT JOIN qualification ON qualification.id = job_qualification.qualification_ID
    WHERE job.ID=?
    GROUP BY job.ID
  `;

  try {
    const jobWithQualifications = await query(jobsQuery, [jobId]);

    if (!jobWithQualifications[0]) {
      return next(new ApiError(`No job found for id: ${jobId}`, 404));
    }

    const formattedJob = {
      ID: jobWithQualifications[0].ID,
      Position: jobWithQualifications[0].Position,
      Description: jobWithQualifications[0].Description,
      Offer: jobWithQualifications[0].Offer,
      MaxCandidateNumber: jobWithQualifications[0].MaxCandidateNumber,
      Qualifications: jobWithQualifications[0].Qualifications
        ? jobWithQualifications[0].Qualifications.split(",")
        : [],
    };

    res.status(200).json(formattedJob);
  } catch (error) {
    next(error);
  }
});

// update job
exports.updateJob = asyncHandler(async (req, res, next) => {
  const jobId = req.params.ID;
  const { qualifications, ...jobData } = req.body;

  // Start a transaction
  await query("START TRANSACTION");

  try {
    // Check if the job exists
    const job = await query("SELECT * FROM `job` WHERE ID=?", [jobId]);

    if (job.length <= 0) {
      // Rollback the transaction and return an error
      await query("ROLLBACK");
      return next(new ApiError(`There is no job for this id: ${jobId}`, 404));
    }

    // Update the job
    await query("UPDATE job SET ? WHERE ID=?", [jobData, jobId]);

    // Delete existing qualifications
    await query("DELETE FROM job_qualification WHERE job_ID=?", [jobId]);

    // Insert new qualifications
    if (Array.isArray(qualifications)) {
      for (const qualification of qualifications) {
        await query(
          "INSERT INTO job_qualification (job_ID, qualification_ID) VALUES (?, ?)",
          [jobId, qualification]
        );
      }
    }

    // Commit the transaction
    await query("COMMIT");

    res
      .status(200)
      .json({ message: "Job Updated Successfully", data: req.body });
  } catch (error) {
    // Rollback the transaction in case of an error
    await query("ROLLBACK");
    next(error);
  }
});

// Delete job
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const jobId = req.params.ID;

  // Start a transaction
  await query("START TRANSACTION");

  try {
    // Retrieve job to check if it exists
    const job = await query("SELECT * FROM `job` WHERE id=?", [jobId]);

    if (job.length <= 0) {
      // Rollback the transaction and send error response if job doesn't exist
      await query("ROLLBACK");
      return next(new ApiError(`No job found for id: ${jobId}`, 404));
    }

    // Delete job
    await query("DELETE FROM `job` WHERE ID=?", [jobId]);

    // Commit the transaction if everything is successful
    await query("COMMIT");

    res.status(204).send();
  } catch (error) {
    // Rollback the transaction in case of an error
    await query("ROLLBACK");

    // Handle the error
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
