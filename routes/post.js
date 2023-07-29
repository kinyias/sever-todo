const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Post = require('../models/Post');
//@Route GET api/posts
//@desc read post
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate('user', [
      'username',
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//@Route POST api/posts
//@desc create post
router.post('/', verifyToken, async (req, res) => {
  const { content, status } = req.body;
  //Validation
  if (!content)
    return res
      .status(400)
      .json({ success: false, message: 'Content is required' });
  try {
    const newPost = new Post({
      content,
      status: status || false,
      user: req.userId,
    });

    await newPost.save();

    res.json({ success: true, message: 'Post successful', post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//@Route PUT api/posts/:id
//@desc edit post
router.put('/:id', verifyToken, async (req, res) => {
  const { content, status } = req.body;

  //Validation
  if (!content)
    return res
      .status(400)
      .json({ success: false, message: 'Content is required' });
  try {
    let updatedPost = {
      content,
      status: status || false,
    };
    const updatePostCondition = {
      _id: req.params.id,
      user: req.userId,
    };
    updatedPost = await Post.findOneAndUpdate(
      updatePostCondition,
      updatedPost,
      { new: true }
    );
    //User not permission or post not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: 'Post not found or user not permisson',
      });
    res.json({ success: true, post: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//@Route DELETE api/posts/deleteposts
//@desc delete posts
router.delete('/deleteposts/:ids', verifyToken, async (req, res) => {
  try {
    let newArr = [];
    const array = req.params.ids.split(',');
    array.forEach((e) => {
      if (!newArr.includes(e)) {
        newArr.push(e);
      }
    });
    const postDeleteConditions = { _id: { $in: newArr }, user: req.userId };
    const deletedPost = await Post.deleteMany(postDeleteConditions);
    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

//@Route DELETE api/posts/:id
//@desc delete post
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const postDeleteConditions = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteConditions);
    //User not permission or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: 'Post not found or user not permisson',
      });
    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
