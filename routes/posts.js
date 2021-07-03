const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create post
router.post("/", async (req, res) => {
  try {
    // create new post
    const newPost = await new Post(req.body);
    //   save new post
    const savedPost = await newPost.save();
    // send newly created post
    res.status(200).json(savedPost);
  } catch (ex) {
    //   catch exception incase of any
    return res.status(500).json(ex);
  }
});
// update a post
router.put("/:id", async (req, res) => {
  try {
    // get post
    const post = await Post.findById(req.params.id);

    if (req.params.id !== req.body.userId)
      return res.status(403).json("you can only delete your posts");
    if (!post) return res.status(404).json("post not found");

    // update post
    await post.updateOne({ $set: req.body });
    // success
    res.status(200).json("updated post succesfuly");
  } catch (ex) {
    res.status(500).json(ex);
  }
});
// delete post
router.delete("/:id", async (req, res) => {
  try {
    // find post
    const post = await Post.findByIdAndDelete(req.params.id);

    // check for  post not found error
    if (!post) return res.status(404).json("post not found");
    // check for invalid id
    if (req.body.userId !== req.params.id)
      return res.status(401).json("you can only delete your posts");

    // success post deleted
    res.status(200).json("post deleted successfully");
  } catch (ex) {
    res.status(500).json(ex.message);
  }
});
// like a post
router.put("/:id/like", async (req, res) => {
  try {
    // find post
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json("post could not be found");

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      // success post liked
      res.status(200).json("post liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      // success post unliked
      res.status(200).json("post disliked");
    }
  } catch (ex) {
    res.status(500).json(ex.message);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    // find post
    const post = await Post.findById(req.params.id);

    // check for  post not found error
    if (!post) return res.status(404).json("post not found");
    // check for invalid id
    if (req.body.userId !== req.params.id)
      return res.status(401).json("you can only have access to your own posts");

    // sget post success
    res.status(200).json(post);
  } catch (ex) {
    res.status(500).json(ex.message);
  }
});
// get timeline posts
router.get("/timeline/all", async (req, res) => {
  try {
    // get current user id
    const currentUser = await User.findById(req.body.userId);

    // get current user's posts
    const userPosts = await Post.find({ userId: currentUser._id });
    // get friends posts  and posts of all their followers
    const friendPosts = await Promise.all(
      // map current user's frinds to their Ids.
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    if (!userPosts) return res.status(404).json("no posts");
    // full all friends psost  and concatenate them
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (ex) {
    // catch exception
    res.status(500).json(ex.message);
  }
});
module.exports = router;
