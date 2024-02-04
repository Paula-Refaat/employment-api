const router = require("express").Router();

const {
  createQualification,
  getAllQualifications,
  getOneQualification,
  updateQualification,
  deleteQualification,
} = require("../services/qualificationServices");
const {
  createQualificationValidator,
  getOneQualificationValidator,
  updateQualificationValidator,
  deleteQualificationValidator,
} = require("../utils/validators/qualificationValidator");

// Save New Qualification
router.post(
  "/api/post-qualifications",
  authServices.allowTo(1),
  updateApplicantValidator,
  createQualificationValidator,
  createQualification
);

//Select All From Qulaifications
router.get(
  "/api/get-qualifications",
  authServices.allowTo(1),
  updateApplicantValidator,
  getAllQualifications
);

// Select Spacific Qualification
router.get(
  "/api/get-qualification/:id",
  authServices.allowTo(1),
  updateApplicantValidator,
  getOneQualificationValidator,
  getOneQualification
);

// Update Qualification
router.put(
  "/api/update-qualification/:id",
  authServices.allowTo(1),
  updateApplicantValidator,
  updateQualificationValidator,
  updateQualification
);

// Delete Qualification
router.delete(
  "/api/remove-qualification/:id",
  authServices.allowTo(1),
  updateApplicantValidator,
  deleteQualificationValidator,
  deleteQualification
);

module.exports = router;
