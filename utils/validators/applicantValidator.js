const { check } = require("express-validator");
const util = require("util");
const validatorMiddleware = require("../../MiddleWare/validatorMiddleware");
const db = require("../../Database/DatabseConn");
const ApiError = require("../ApiError");

exports.createApplicantValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Please enter a valid name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name should be between 3-20 characters"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .toLowerCase()
    .custom(async (val) => {
      const query = util.promisify(db.query).bind(db);
      const result = await query("SELECT * FROM users WHERE email = ?", [val]);
      if (result.length > 0) {
        throw new Error("E-mail already exists");
      }
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters"),

  check("phone")
    .optional()
    .isLength({ min: 8, max: 12 })
    .withMessage("Phone should be between 8-12 numbers"),
  check("status")
    .optional()
    .isString()
    .withMessage("Please enter a valid status"),
  check("type")
    .optional()
    .isNumeric()
    .withMessage(
      "Please enter a valid type is 0 for applicant and 1 for admin"
    ),
  validatorMiddleware,
];

exports.getOneApplicantValidator = [
  check("id").isNumeric().withMessage("Please enter a valid id"),
  validatorMiddleware,
];

exports.updateApplicantValidator = [
  check("id").isNumeric().withMessage("Please enter a valid id"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Please enter a valid name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name should be between 3-20 characters"),

  check("email")
    .optional()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .toLowerCase()
    .custom(async (val, { req }) => {
      const query = util.promisify(db.query).bind(db);
      const result = await query("SELECT * FROM users WHERE email = ?", [val]);
      if (result.length > 0) {
        if (result[0].id.toString() === req.params.id.toString()) {
          return true;
        } else {
          throw new ApiError("E-mail already exists", 400);
        }
      }
    }),

  check("phone")
    .optional()
    .optional()
    .isLength({ min: 8, max: 12 })
    .withMessage("Phone should be between 8-12 numbers"),
  check("status")
    .optional()
    .optional()
    .isString()
    .withMessage("Please enter a valid status"),
  check("type")
    .optional()
    .optional()
    .isNumeric()
    .withMessage(
      "Please enter a valid type is 0 for applicant and 1 for admin"
    ),
  validatorMiddleware,
];

exports.deleteApplicantValidator = [
  check("id").isNumeric().withMessage("Please enter a valid id"),
  validatorMiddleware,
];
