import React, { useEffect, useState } from "react";
import "./Post.css";
import { Avatar, Button, Typography, Dialog } from "@mui/material";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentOnPost,
  deletePost,
  likePost,
  updateCaption,
} from "../Actions/postAction";
import { getFollowingPosts, getMyPosts, loadUser } from "../Actions/userAction";
import User from "../User/User";
import CommentCard from "../CommentCard/CommentCard";

const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesUser, setLikesUser] = useState(false);

  //for comments
  const [commentValue, setCommentValue] = useState("");
  const [commentToggle, setCommentToggle] = useState(false);

  //for update caption
  const [captionValue, setCaptionValue] = useState(caption);
  const [captionToggle, setCaptionToggle] = useState(false);

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //handle like  function
  const handleLike = async () => {
    setLiked(!liked);
    await dispatch(likePost(postId));
    if (isAccount) {
      console.log("bring to my post");
      // dispatch(getMyPosts());
    } else {
      dispatch(getFollowingPosts()); //i have  to change it later bcz it reloads the page
    }
  };

  //handle addComment form
  const addCommentHandler = async (e) => {
    e.preventDefault();
    await dispatch(addCommentOnPost(postId, commentValue));
    if (isAccount) {
      console.log("bring to my post");
      dispatch(getMyPosts());
    } else {
      dispatch(getFollowingPosts()); //i have  to change it later bcz it reloads the page
    }
  };

  //handle update caption
  const updateCaptionHandleForm = (e) => {
    e.preventDefault();
    console.log(postId);
    dispatch(updateCaption(captionValue, postId));
    dispatch(getMyPosts());
  };

  //delete post
  const deletePostHandle = async () => {
    await dispatch(deletePost(postId));
    dispatch(loadUser());
  };

  useEffect(() => {
    likes.forEach((item) => {
      if (item._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);

  return (
    <div className="post">
      <div className="postHeader">
        <Button onClick={() => setCaptionToggle(!captionToggle)}>
          <MoreVert />
        </Button>
      </div>
      <img src={postImage} alt="post" />
      <div className="postDetails">
        <Avatar
          src={ownerImage}
          alt="user"
          sx={{ height: "3vmax", width: "3vmax" }}
        />

        <Link to={`/${ownerId}`}>
          <Typography fontWeight={700}>{ownerName}</Typography>
        </Link>

        <Typography
          fontWeight={100}
          color="rgba(0,0,0,0.582)"
          style={{ alignSelf: "center" }}
        >
          {caption}
        </Typography>
      </div>
      <button
        style={{
          border: "none",
          backgroundColor: "white",
          cursor: "pointer",
          margin: "1vmax, 2vmax",
        }}
        onClick={() => setLikesUser(!likesUser)}
        disabled={likes.length <= 0}
      >
        <Typography>{`${likes.length} Likes`}</Typography>
      </button>
      <div className="postFooter">
        <Button onClick={handleLike}>
          {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
        </Button>

        <Button>
          <ChatBubbleOutline onClick={() => setCommentToggle(!commentToggle)} />
        </Button>

        <Button onClick={deletePostHandle}>
          {isDelete ? <DeleteOutline /> : null}
        </Button>
      </div>

      {/* for likes */}
      <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
        <div className="DialogBox">
          <Typography variant="h4">Liked By </Typography>
          {likes &&
            likes.map((like) => (
              <User
                key={like._id}
                userId={like._id}
                name={like.name}
                avatar={like.avatar.url}
              />
            ))}
        </div>
      </Dialog>

      {/* for update caption */}
      <Dialog
        open={captionToggle}
        onClose={() => setCaptionToggle(!captionToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Update caption</Typography>
          <form className="commentForm" onSubmit={updateCaptionHandleForm}>
            <input
              type="text"
              value={captionValue}
              onChange={(e) => setCaptionValue(e.target.value)}
              placeholder="Caption Here...."
              required
            />
            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>
        </div>
      </Dialog>

      {/* for comments */}
      <Dialog
        open={commentToggle}
        onClose={() => setCommentToggle(!commentToggle)}
      >
        <div className="DialogBox">
          <Typography variant="h4">Comments </Typography>

          {/* comment form */}
          <form className="commentForm" onSubmit={addCommentHandler}>
            <input
              type="text"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              placeholder="comment here ...."
              required
            />
            <Button type="submit" variant="contained">
              Add
            </Button>
          </form>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard
                key={comment._id}
                userId={comment.user._id}
                name={comment.user.name}
                avatar={comment.user.avatar.url}
                comment={comment.comment}
                commentId={comment._id}
                postId={postId}
                isAccount={isAccount}
              />
            ))
          ) : (
            <Typography>No comments yet</Typography>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default Post;
