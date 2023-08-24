const express = require("express");
const {
  registerUser,
  loginUser,
  followUser,
  logoutUser,
  updatePassword,
  updateProfile,
  deleteUserProfile,
  myProfile,
  getUserDetails,
  getAllUsers,
  forgotPassword,
  resetPassword,
  getMyPosts,
  getUsersPosts
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

//follow user
router.route("/follow/:id").get(isAuthenticatedUser, followUser);


//update password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

//update my profile like name and email
router.route("/update/profile").put(isAuthenticatedUser, updateProfile);

//delete my profile
router.route("/delete/me").delete(isAuthenticatedUser, deleteUserProfile);

//get all users details
router.route('/allUsers').get(isAuthenticatedUser,getAllUsers)

//get logged in me details
router.route('/me').get(isAuthenticatedUser,myProfile)

//get all me posts
router.route('/myposts').get(isAuthenticatedUser,getMyPosts)

//get users posts
router.route('/userposts/:id').get(isAuthenticatedUser,getUsersPosts)

//get single user details
router.route('/:id').get(isAuthenticatedUser,getUserDetails)

//forgot password
router.route('/password/forgot').post(isAuthenticatedUser,forgotPassword)

//reset password
router.route('/password/reset/:token').put(isAuthenticatedUser,resetPassword)



module.exports = router;
