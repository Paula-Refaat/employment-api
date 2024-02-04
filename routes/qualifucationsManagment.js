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

const authServices = require("../services/authServices");

// Save New Qualification
router.post(
  "/api/post-qualifications",
  authServices.protect,
  authServices.allowTo(1),
  createQualificationValidator,
  createQualification
);

//Select All From Qulaifications
router.get(
  "/api/get-qualifications",
  authServices.protect,
  authServices.allowTo(1),
  getAllQualifications
);

// Select Spacific Qualification
router.get(
  "/api/get-qualification/:id",
  authServices.protect,
  authServices.allowTo(1),
  getOneQualificationValidator,
  getOneQualification
);

// Update Qualification
router.put(
  "/api/update-qualification/:id",
  authServices.protect,
  authServices.allowTo(1),
  updateQualificationValidator,
  updateQualification
);

// Delete Qualification
router.delete(
  "/api/remove-qualification/:id",
  authServices.protect,
  authServices.allowTo(1),
  deleteQualificationValidator,
  deleteQualification
);

module.exports = router;
