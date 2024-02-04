const { check } = require("express-validator");
const validatorMiddleware = require("../../MiddleWare/validatorMiddleware");

exports.createQualificationValidator = [
  check("description")
    .notEmpty()
    .withMessage("description is required")
    .isString()
    .withMessage("Please enter a valid description")
    .isLength({ min: 3, max: 100 })
    .withMessage("Description should be between 3-100 characters"),
  validatorMiddleware,
];

exports.getOneQualificationValidator = [
  check("id").isNumeric().withMessage("Please enter a valid id"),
  validatorMiddleware,
];

exports.updateQualificationValidator = [
  check("id").isNumeric().withMessage("Please enter a valid id"),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("description is required")
    .isString()
    .withMessage("Please enter a valid description")
    .isLength({ min: 3, max: 100 })
    .withMessage("Description should be between 3-100 characters"),

  validatorMiddleware,
];

exports.deleteQualificationValidator = [
  check("id").isNumeric().withMessage("Please enter a valid id"),
  validatorMiddleware,
];
