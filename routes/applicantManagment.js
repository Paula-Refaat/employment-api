const router = require("express").Router();
const {
  createApplicantValidator,
  updateApplicantValidator,
  deleteApplicantValidator,
  getOneApplicantValidator,
} = require("../utils/validators/applicantValidator");
const {
  createApplicant,
  getAllApplicants,
  getOneApplicant,
  updateApplicant,
  deleteApplicant,
} = require("../services/applicantServices");

const authServices = require("../services/authServices");

// Get All Applicant
router.post(
  "/api/post-applicant",
  authServices.protect,
  authServices.allowTo(1),
  createApplicantValidator,
  createApplicant
);

// Select All Applicant
router.get(
  "/api/get-applicant",
  authServices.protect,
  authServices.allowTo(1),
  getAllApplicants
);

// Select one Applicants
router.get(
  "/api/get-applicant/:id",
  authServices.protect,
  authServices.allowTo(1),
  getOneApplicantValidator,
  getOneApplicant
);
// Update Applicant
router.put(
  "/api/update-applicant/:id",
  authServices.protect,
  authServices.allowTo(1),
  updateApplicantValidator,
  updateApplicant
);

// Delete applicant
router.delete(
  "/api/remove-applicant/:id",
  authServices.protect,
  authServices.allowTo(1),
  deleteApplicantValidator,
  deleteApplicant
);

module.exports = router;
