const util = require("util");
const asyncHandler = require("express-async-handler");

const db = require("../Database/DatabseConn");
const ApiError = require("../utils/ApiError");

let query = util.promisify(db.query).bind(db);

exports.createQualification = asyncHandler(async (req, res, next) => {
  const result = await query("insert into qualification set ? ", req.body);
  const qualification = { ...req.body, id: result.insertId };
  res
    .status(201)
    .json({ message: "Qualification created succsfully", data: qualification });
});

exports.getAllQualifications = asyncHandler(async (req, res, next) => {
  const qualifications = await query("SELECT * FROM qualification");
  if (!qualifications) {
    next(new ApiError("There are no qualifications in our DB", 404));
  }
  res.status(200).json(qualifications);
});

exports.getOneQualification = asyncHandler(async (req, res, next) => {
  const qualification = await query(
    "SELECT * FROM qualification WHERE id=?",
    req.params.id
  );
  if (qualification[0] === undefined) {
    return next(
      new ApiError(
        `There is no qualification for this id: ${req.params.id} `,
        404
      )
    );
  }
  res.status(200).json(qualification[0]);
});

exports.updateQualification = asyncHandler(async (req, res, next) => {
  const qualification = await query(
    "select * FROM `qualification` WHERE id=? ",
    [req.params.id]
  );
  if (qualification.length <= 0) {
    next(
      new ApiError(
        `there is no qualification for this id: ${req.params.id}`,
        404
      )
    );
  }
  await query("UPDATE qualification SET ? WHERE id=?", [
    req.body,
    req.params.id,
  ]);
  res.status(200).json({
    message: "Qualification updated succssfully",
    Qualification: req.body,
  });
});

exports.deleteQualification = asyncHandler(async (req, res, next) => {
  const qualification = await query(
    "select * FROM `qualification` WHERE id=? ",
    [req.params.id]
  );
  if (qualification.length <= 0) {
    next(
      new ApiError(
        `there is no qualification for this id: ${req.params.id}`,
        404
      )
    );
  }

  await query("DELETE FROM `qualification` WHERE id=? ", [req.params.id]);
  res.status(204).send();
});
