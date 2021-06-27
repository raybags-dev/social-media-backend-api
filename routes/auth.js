const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// regester new user

router.post("/register", async (req, res) => {
  try {
    //   generate  salt with bcrypt for hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // new user request body
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // find if user already exist
    const existing_user_email = await User.findOne({ email: req.body.email });
    const existing_user_name = await User.findOne({
      username: req.body.username,
    });

    if (existing_user_email || existing_user_name)
      return res.status(401).json("user already exists");

    // sve user and return response.
    const user = await newUser.save();

    res.status(200).json(user);
  } catch (e) {
    console.log(`error occured: ${e.message}`);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    //   find user by email
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("user not found");

    // checking valid password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("password incorrect");

    const { username } = user;
    // all credetials valid
    res.status(200).json("login for " + username + " successful");
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
