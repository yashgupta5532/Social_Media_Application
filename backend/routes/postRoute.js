const express=require('express');
const { createPost, likeAndUnlikePost, deletePost, getFollowingPost, updatePostCaptions, commentPost, deleteComment } = require('../controllers/postController');
const { isAuthenticatedUser } = require('../middlewares/auth');

const router=express.Router();
//POST create post
router.route('/upload').post(isAuthenticatedUser, createPost)

//POST like and dislike post
router.route('/:id').post(isAuthenticatedUser,likeAndUnlikePost).delete(isAuthenticatedUser,deletePost).put(isAuthenticatedUser,updatePostCaptions)

//get post of following
router.route('/posts').get(isAuthenticatedUser,getFollowingPost)

//post a comment  //delete a comment
router.route('/comment/:id').put(isAuthenticatedUser,commentPost).delete(isAuthenticatedUser,deleteComment)

module.exports=router