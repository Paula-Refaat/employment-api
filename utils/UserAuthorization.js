const jwt = require("jsonwebtoken");
const util = require("util");

const db = require("../Database/DatabseConn");
const ApiError = require("./ApiError");
// const User = require("../models/userModel");
let query = util.promisify(db.query).bind(db);

class UserAuthorization {
  //  1) check if token exists, if exists get it
  getToken(authorizationHeader) {
    let token;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
      token = authorizationHeader.split(" ")[1];
    }
    if (!token) {
      throw new ApiError(
        "you are not login, Please login to get access this route",
        401
      );
    }
    return token;
  }

  //  2) Verify token (no changes happend, expired token)
  tokenVerifcation(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  }

  //  3) check if user exists
  async checkCurrentUserExist(decoded) {
    const currentUser = await query("select * from users where id = ?", [
      decoded.userId,
    ]);
   
    if (!currentUser) {
      throw new ApiError(
        "The user that belong to this token does no longer exist",
        401
      );
    }
    return currentUser;
  }

  checkCurrentUserIsActive(currentUser) {
    if (currentUser[0].status != "Active") {
      throw new ApiError(
        "The user that belong to this token not active, Admin Blocked Your Account !",
        401
      );
    }
    return true;
  }

  //  4) check if user chnage his password after token created
  // checkUserChangeHisPasswordAfterTokenCreated(currentUser, decoded) {
  //   if (currentUser.passwordChangedAt) {
  //     const passwordChangedTimeStamp = parseInt(
  //       currentUser.passwordChangedAt.getTime() / 1000,
  //       10
  //     );
  //     // password changes after token created, Error
  //     if (passwordChangedTimeStamp > decoded.iat) {
  //       throw new ApiError(
  //         "User recently changed his password , please login again ..",
  //         401
  //       );
  //     }
  //   }

  //   return true;
  // }
}
module.exports = UserAuthorization;