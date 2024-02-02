const router = require("express").Router();
const db = require("../Database/DatabseConn");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const util = require("util");


   router.post(
    "/api/post-applicant",
    body("email").isEmail().withMessage("please enter a valid email!"),
    body("name").isString().withMessage("please enter a valid name")
      .isLength({ min: 3, max: 20 })
      .withMessage("name should be between (3-20) character"),
      body("password").isLength({ min: 8, max: 12 })
      .withMessage("password should be between (8-12) character"),
      body("phone").isLength({ min: 8, max: 12 })
      .withMessage("Phone should be between (8-12) number"),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const query = util.promisify(db.query).bind(db); // transform query mysql --> promise to use [await/async]
        const checkEmailExists = await query(
          "select * from users where email = ?",
          [req.body.email]
        );
        if (checkEmailExists.length > 0) {
          res.status(400).json({
            errors: [
              {
                msg: "email already exists !",
              },
            ],
          });
        }
       else{
        // 3- PREPARE OBJECT USER TO -> SAVE
        const userData = {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          status:req.body.status,
          password: await bcrypt.hash(req.body.password, 10),
          token: crypto.randomBytes(16).toString("hex"), // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
        };
    
        // 4- INSERT USER OBJECT INTO DB
        await query("insert into users set ? ", userData);
        delete userData.password;
        res.status(200).json(userData);
      }
      } catch (err) {
        // res.status(500).json({ err: err });
      }
    }
    
  );


//Select All Applicant
router.get("/api/get-applicant", (req, res) => {
    const sqlGet = "SELECT * FROM users  WHERE type=0 ORDER BY name";
    db.query(sqlGet, (error, result)=>{
        res.send(result);
    });
}); 

// Select one Applicant
router.get("/api/get-applicant/:id", (req, res) => {
    const{ id } = req.params; 
    const sqlGet = "SELECT * FROM users WHERE id=?";
    db.query(sqlGet, id , (error, result)=>{
        res.send(result);
    });
});


// Update Applicant
router.put("/api/update-applicant/:id",
body("email").isEmail().withMessage("please enter a valid email!"),
body("name").isString().withMessage("please enter a valid name")
  .isLength({ min: 3, max: 10 })
  .withMessage("name should be between (3-10) character"),
  body("status").isLength({ min: 5, max: 9 })
  .withMessage("done"),
  body("phone").isLength({ min: 8, max: 12 })
  .withMessage("Phone should be between (8-12) number"),
 (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const{ id } = req.params;
    const{name, email, phone, status} = req.body;
    const sqlUpdata = "UPDATE users SET name=? , email=? , phone=?, status=? WHERE id=? ";
    db.query(sqlUpdata, [name, email, phone, status, id] , (error, result)=>{
        res.send("Applicant Updated Success");
    });
  } catch (err) {
    // res.status(500).json({ err: err });
  }
    
});

// Delete applicant
router.delete("/api/remove-applicant/:id",(req,res) => {
    const{ id } = req.params;
    const sqlRemove = "DELETE FROM `users` WHERE id=? ";
    db.query(sqlRemove, [ id ], (error, result)=>{
        if(error){
            console.log(error);
        }
        res.send("Applicant Deleted Success");
    });
});

module.exports = router;