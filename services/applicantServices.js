const util = require("util");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const db = require("../Database/DatabseConn");
const ApiError = require("../utils/ApiError");

let query = util.promisify(db.query).bind(db);

exports.createApplicant = asyncHandler(async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 10);
  req.body.password = password;
  const result = await query("insert into users set ? ", req.body);
  delete req.body.password;
  const user = { ...req.body, id: result.insertId };
  res.status(201).json({ data: user });
});

exports.getAllApplicants = asyncHandler(async (req, res, next) => {
  const users = await query("SELECT * FROM users  WHERE type=0 ORDER BY name");
  if (!users) {
    next(new ApiError("There are no users in our DB", 404));
  }
  users.forEach((user) => {
    delete user.password;
  });
  res.status(200).json(users);
});

exports.getOneApplicant = asyncHandler(async (req, res, next) => {
  const user = await query("SELECT * FROM users WHERE id=?", req.params.id);
  if (user[0] === undefined) {
    return next(
      new ApiError(`There is no user for this id: ${req.params.id} `, 404)
    );
  }
  delete user[0].password;
  res.status(200).json(user[0]);
});

exports.updateApplicant = asyncHandler(async (req, res, next) => {
  const user = await query("select * FROM `users` WHERE id=? ", [
    req.params.id,
  ]);
  if (user.length <= 0) {
    next(
      new ApiError(`there is no Applicant for this id: ${req.params.id}`, 404)
    );
  }
  if (req.body.password) {
    delete req.body.password;
  }
  await query("UPDATE users SET ? WHERE id=?", [req.body, req.params.id]);
  res
    .status(200)
    .json({ message: "Applicant updated succssfully", user: req.body });
});

exports.deleteApplicant = asyncHandler(async (req, res, next) => {
  const user = await query("select * FROM `users` WHERE id=? ", [
    req.params.id,
  ]);
  if (user.length <= 0) {
    next(new ApiError(`there is no user for this id: ${req.params.id}`, 404));
  }

  await query("DELETE FROM `users` WHERE id=? ", [req.params.id]);
  res.status(204).send();
});
