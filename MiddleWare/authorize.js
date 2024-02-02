const db = require("../Database/DatabseConn");
const util = require("util"); // helper

const authorized = async (req, res, next) => {
  const query = util.promisify(db.query).bind(db);
  const { token } = req.headers;
  const user = await query("select * from users where token = ?", [token]);
  if (user[0]) {
    res.locals.user = user[0];
    next();
  } else {
    res.status(403).json({
      msg: "you are not authorized to access this route !",
    });
  }
};

module.exports = authorized;