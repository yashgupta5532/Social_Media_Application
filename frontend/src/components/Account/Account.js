import React, { useEffect, useState } from "react";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteMyProfile, getMyPosts, logoutUser } from "../Actions/userAction";
import Post from "../Post/Post";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import User from "../User/User";
import { useAlert } from "react-alert";

const Account = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { loading, error, posts } = useSelector((state) => state.myPosts);
  const {
    error: likeError,
    message,
    loading: deleteLoading,
  } = useSelector((state) => state.like);
  useEffect(() => {
    dispatch(getMyPosts());
  }, [dispatch]);

  const logoutHandle = () => {
    dispatch(logoutUser());
    alert.success("Logged out Successfully");
  };

  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);

  const handleDeleteProfile = async () => {
    await dispatch(deleteMyProfile());
    dispatch(logoutUser());
  };
  //   //useEffect for alert
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (likeError) {
      alert.error(likeError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, error, message, likeError, dispatch]);

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length > 0 ? (
          posts.map((posts) => (
            <Post
              key={posts._id}
              postId={posts._id}
              caption={posts.captions}
              postImage={posts.image.url}
              likes={posts.likes}
              comments={posts.comments}
              ownerImage={posts.owner.avatar}
              ownerName={posts.owner.name}
              ownerId={posts.owner._id}
              isDelete={true}
              isAccount={true}
            />
          ))
        ) : (
          <Typography variant="h5">you have not made any Posts yet</Typography>
        )}
      </div>
      <div className="accountright">
        <Avatar
          src={user.avatar.url}
          sx={{ height: "8vmax", width: "8vmax" }}
        />
        <Typography variant="h5">{user.name}</Typography>
        <div>
          <button onClick={() => setFollowersToggle(!followersToggle)}>
            <Typography>Followers</Typography>
          </button>
          <Typography>{user.followers.length}</Typography>
        </div>
        <div>
          <button onClick={() => setFollowingToggle(!followingToggle)}>
            <Typography>Following</Typography>
          </button>
          <Typography>{user.following.length}</Typography>
        </div>
        <div>
          <button>
            <Typography>Posts</Typography>
          </button>
          <Typography>{user.posts.length}</Typography>
        </div>
        <Button variant="contained" onClick={logoutHandle}>
          Logout
        </Button>
        <Link to="/update/profile">Edit Profile</Link>
        <Link to="/password/update">Change Password</Link>
        <Button
          variant="text"
          sx={{ color: "red", margin: "2vmax" }}
          onClick={handleDeleteProfile}
          disabled={deleteLoading}
        >
          Delete Profile
        </Button>

        <Dialog
          open={followersToggle}
          onClose={() => setFollowersToggle(!followersToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Followers</Typography>
            {user && user.followers.length > 0 ? (
              user.followers.map((follower) => (
                <User
                  key={follower._id}
                  userId={follower._id}
                  name={follower.name}
                  avatar={follower.avatar.url}
                />
              ))
            ) : (
              <Typography>You have not followers yet</Typography>
            )}
          </div>
        </Dialog>

        <Dialog
          open={followingToggle}
          onClose={() => setFollowingToggle(!followingToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Following</Typography>
            {user && user.following.length > 0 ? (
              user.following.map((follow) => (
                <User
                  key={follow._id}
                  userId={follow._id}
                  name={follow.name}
                  avatar={follow.avatar.url}
                />
              ))
            ) : (
              <Typography>You are not following anyone yet</Typography>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Account;
