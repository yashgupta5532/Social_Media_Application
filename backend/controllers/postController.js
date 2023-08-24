const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const cloudinary =require('cloudinary')

exports.createPost = async (req, res) => {
  try {
    const myCloud =await cloudinary.v2.uploader.upload(req.body.image,{
      folder:"posts",
    })
    const newPostData = {
      captions: req.body.captions,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: req.user._id,
    };
    const user = await userModel.findById(req.user._id);
    const newPost = await postModel.create(newPostData);
    user.posts.unshift(newPost._id);
    await user.save();
    res.status(201).json({
      success: true,
      message: "Post created ",
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//like and unlike
exports.likeAndUnlikePost = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    }

    if (post.likes.includes(req.user._id)) {
      let index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "post disliked",
      });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "post liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete post
exports.deletePost = async (req, res) => {
  //find post from postModel
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "UnAuthorized access",
      });
    }
    // await post.remove();  not working why i dont know
    await cloudinary.v2.uploader.destroy(post.image.public_id)
    await post.deleteOne();
    const user = await userModel.findById(req.user._id);
    let index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);
    await user.save();
    res.status(200).json({
      success: false,
      message: "post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get posts of following
exports.getFollowingPost = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const posts = await postModel.find({
      owner: {
        $in: user.following,
      },
    }).populate("owner likes comments.user");
    res.status(200).json({
      success: true,
      posts:posts.reverse(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update post captions
exports.updatePostCaptions = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "unAuthorized Access",
      });
    }
    let captions = req.body.captions;
    console.log(captions)
    // if (!captions || captions.length < 2) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Captions must be at least 3 characters long.",
    //   });
    // }
    post.captions = captions;
    await post.save();
    res.status(200).json({
      success: true,
      message: "post captions updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//add comments
exports.commentPost = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post doesnot exist",
      });
    }
    let commentIndex = -1;
    //finding if post is already commented and get index of comment in comments
    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index;
      }
    });
    if (commentIndex !== -1) {
      //update the comments
      post.comments[commentIndex].comment = req.body.comment;
      await post.save();
      return res.status(200).json({
        success: true,
        message: "comment updated successfully",
      });
    } else {
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });
      await post.save();
      return res.status(200).json({
        success: true,
        message: "comment added successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete comments
exports.deleteComment = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //if post owner wants to delete any comment
    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId == undefined) {
        return res.status(400).json({
          success: false,
          message: "commentId is required",
        });
      }
      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      res.status(200).json({
        success: true,
        message: "selected comment has been deleted",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (req.user._id.toString() === item.user.toString()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
      res.status(200).json({
        success: true,
        message: "your comment has been deleted",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
