import React from "react";
import "./CommentCard.css";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentOnPost } from "../Actions/postAction";
import { getFollowingPosts, getMyPosts } from "../Actions/userAction";

const CommentCard = ({
  userId,
  name,
  avatar,
  comment,
  commentId,
  postId,
  isAccount,
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  //handle delete comment
  const deleteCommentHandle = async () => {
    await dispatch(deleteCommentOnPost(postId, commentId));
    if (isAccount) {
      dispatch(getMyPosts());
    } else {
      dispatch(getFollowingPosts()); //i have  to change it later bcz it reloads the page
    }
  };
  return (
    <div className="commentUser">
      <Link to={`/${userId}`}>
        <img src={avatar} alt={name} />
        <Typography className="name" style={{ maxWidth: "6vmax" }}>
          {name}
        </Typography>
        <Typography className="comment" style={{ fontWeight: "100" }}>
          {comment}
        </Typography>
        {isAccount ? (
          <Button>
            <Delete />
          </Button>
        ) : userId === user._id ? (
          <Button onClick={deleteCommentHandle}>
            <Delete />
          </Button>
        ) : null}
      </Link>
    </div>
  );
};

export default CommentCard;
