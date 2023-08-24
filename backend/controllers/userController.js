// const userModel = require("../models/userModel");
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "user Already exist",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: true,
        message: "password should be at least 6 characters",
      });
    }
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    user = await userModel.create({
      name,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    });
    const options = {
      expires: new Date(Date.now() + parseInt(process.env.JWT_TOKEN_EXPIRES)),
      httpOnly: true,
    };
    const token = await user.generateToken();
    res.status(201).cookie("token", token, options).json({
      success: true,
      message: "user registered in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel
      .findOne({ email })
      .select("+password")
      .populate("posts followers following");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user does not exist",
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const options = {
      expires: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    const token = await user.generateToken();
    res.status(200).cookie("token", token, options).json({
      success: true,
      message: "user logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//follow user
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await userModel.findById(req.params.id);
    const loggedInUser = await userModel.findById(req.user._id);

    if (!userToFollow) {
      console.log(userToFollow, req.params.id);
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    } //if already following then unfollow
    if (loggedInUser.following.includes(userToFollow._id)) {
      let indexOfFollowing = loggedInUser.following.indexOf(userToFollow._id);
      loggedInUser.following.splice(indexOfFollowing, 1);

      let indexOfFollowers = userToFollow.followers.indexOf(loggedInUser._id);
      userToFollow.followers.splice(indexOfFollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();
      res.status(200).json({
        success: true,
        message: `You started Unfollowing ${userToFollow.name}`,
      });
    } else {
      userToFollow.followers.push(loggedInUser._id);
      loggedInUser.following.push(userToFollow._id);

      await loggedInUser.save();
      await userToFollow.save();
      res.status(200).json({
        success: true,
        message: `You started following ${userToFollow.name}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update password
exports.updatePassword = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("+password"); //data and hash arguments error handlling i select(+password ) is not provided
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "oldPassword and newPassword is required",
      });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Incorrect oldPassword ",
      });
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, avatar } = req.body;
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id); //delete avatar prev
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      user.avatar.public_id = myCloud.public_id;
      user.avatar.url = myCloud.secure_url;
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "user profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = user._id;

    // Removing Avatar from cloudinary
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    // await user.remove();
    await user.deleteOne();

    // Logout user after deleting profile

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    // Delete all posts of the user
    for (let i = 0; i < posts.length; i++) {
      const post = await postModel.findById(posts[i]);
      await cloudinary.v2.uploader.destroy(post.image.public_id);
      // await post.remove();
      await post.deleteOne();
    }

    // Removing User from Followers Following
    for (let i = 0; i < followers.length; i++) {
      const follower = await userModel.findById(followers[i]);

      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }

    // Removing User from Following's Followers
    for (let i = 0; i < following.length; i++) {
      const follows = await userModel.findById(following[i]);

      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);
      await follows.save();
    }

    // removing all comments of the user from all posts
    const allPosts = await postModel.find();

    for (let i = 0; i < allPosts.length; i++) {
      const post = await postModel.findById(allPosts[i]._id);

      for (let j = 0; j < post.comments.length; j++) {
        if (post.comments[j].user === userId) {
          post.comments.splice(j, 1);
        }
      }
      await post.save();
    }
    // removing all likes of the user from all posts

    for (let i = 0; i < allPosts.length; i++) {
      const post = await postModel.findById(allPosts[i]._id);

      for (let j = 0; j < post.likes.length; j++) {
        if (post.likes[j] === userId) {
          post.likes.splice(j, 1);
        }
      }
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//my profile posts
exports.myProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("posts followers following");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getuser details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .populate("posts followers following");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      success: true,
      message:"fetched user profile",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAll users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({name:{$regex:req.query.name,$options:"i"},});
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    console.log(user,"user in trouble")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const resetToken = user.getResetPasswordToken();
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
    const message = `Reset password on clicking the url below \n\n ${resetUrl} \n\n\t  if you have not requested this,then please ignore it `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Recovery password",
        message,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
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

//reset password
exports.resetPassword = async (req, res) => {
  try {
    let resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "invalid token or has been expired",
      });
    }
    user.password = req.body.password;
    resetPasswordToken = undefined;
    resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({
      success: false,
      message: "password has been reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//logged in user posts
exports.getMyPosts = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const posts = [];
    for (let i = 0; i < user.posts.length; i++) {
      const post = await postModel
        .findById(user.posts[i])
        .populate("likes comments.user owner");
      posts.push(post);
    }
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//other users posts
exports.getUsersPosts = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    const posts = [];
    for (let i = 0; i < user.posts.length; i++) {
      const post = await postModel
        .findById(user.posts[i])
        .populate("likes comments.user owner");
      posts.push(post);
    }
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};