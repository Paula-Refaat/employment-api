const util = require("util");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const db = require("../Database/DatabseConn");
const createToken = require("../utils/createToken");
const UserAuthorization = require("../utils/UserAuthorization");
const ApiError = require("../utils/ApiError");

let query = util.promisify(db.query).bind(db);

// @desc    User Register
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  const userData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: await bcrypt.hash(req.body.password, 10),
  };
  //   const query = util.promisify(db.query).bind(db);
  const result = await query("insert into users set ? ", [userData]);
  const user = { ...userData, id: result.insertId };
  // 2- Creat token
  const token = createToken(user.id);
  res.status(201).json({ data: user, token });
});

// @desc    User Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  //  const query = util.promisify(db.query).bind(db);
  const user = await query("select * from users where email = ?", [
    req.body.email,
  ]);
  if (!user || !(await bcrypt.compare(req.body.password, user[0].password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  delete user[0].password;

  // 2- Creat token
  const token = createToken(user[0].id);
  res.status(200).json({ data: user[0], token });
});

// @desc  make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  const userAuthorization = new UserAuthorization();

  const token = userAuthorization.getToken(req.headers.authorization);
  const decoded = userAuthorization.tokenVerifcation(token);
  const currentUser = await userAuthorization.checkCurrentUserExist(decoded);
  userAuthorization.checkCurrentUserIsActive(currentUser);
  //   userAuthorization.checkUserChangeHisPasswordAfterTokenCreated(
  //     currentUser,
  //     decoded
  //   );
  req.user = currentUser[0];

  next();
});

//@desc  Authorization (User Permissions)
exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.type)) {
      return next(
        new ApiError("you are not allowed to access this router", 403)
      );
    }
    next();
  });
