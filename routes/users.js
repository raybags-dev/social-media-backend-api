const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(req.body.password, salt);
      } catch (ex) {
        return res.status(500).json(ex);
      }
    }

    try {
      // find by id and set body to request body
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      // check i fuser is in database
      if (!user) return res.status(404).json("user not found");
      // get name from user
      const { username } = user;
      // set response code
      return res.status(200).json(username + " account updated successfully");
      //   catch error
    } catch (ex) {
      return res.status(500).json(ex);
    }
  } else {
    return res.status(403).json("you can only update your account");
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // find by id and set body to request body
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(401).json("account not found");
      }
      // set response code
      return res.status(200).json("account successfully deleted");

      //   catch error
    } catch (ex) {
      console.log(ex.message);
      return res.status(500).json(ex);
    }
  } else {
    return res.status(403).json("you can delete only your account ");
  }
});
// get user
router.get("/:id", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id)
      return res.status(400).json("bad password");

    const user = await User.findOne({ _id: req.body.userId });
    if (!user) return res.status(404).json("user not found");

    const { password, updatedAt, ...others } = user._doc;

    return res.status(200).send(others);
  } catch (ex) {
    return res.status(404).json(ex.message);
  }
});
// follow user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currectUser = await User.findById(req.body.userId);

      const { username } = user;

      if (!user.followers.includes(req.body.userId)) {
        // update followers
        await user.updateOne({ $push: { followers: req.body.userId } });
        // update followings
        await currectUser.updateOne({ $push: { followings: req.body.userId } });

        // final results
        res.status(200).json(`success you are  following ${username} `);
      } else {
        return res.status(403).json(`you are already following '${username}'`);
      }
    } catch (ex) {
      return res.status(500).json(ex);
    }
  } else {
    res.status(403).send("you can't follow yourself");
  }
});
// unfollow user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      // get user and current user
      const user = await User.findById(req.params.id);
      const currectUser = await User.findById(req.body.userId);
      // check if there is a user to follow
      if (!user) return res.status(404).json("user not found");

      // get user name for user to be unfollowed
      const { username } = user;

      if (user.followers.includes(req.body.userId)) {
        // update followers
        await user.updateOne({ $pull: { followers: req.body.userId } });
        if (!user) return res.status(404).json("user not found");

        // update followings
        await currectUser.updateOne({ $pull: { followings: req.params.id } });

        // final results
        res.status(200).json(`unfollowed ${username} `);
      } else {
        return res.status(403).json(`you've already unfollowed '${username}'`);
      }
    } catch (ex) {
      return res.status(500).json(ex);
    }
  } else {
    res.status(403).send("you can't unfollow yourself");
  }
});

module.exports = router;
