import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followAndUnfollowUser, getUserDetails, getUserPosts } from "../Actions/userAction";
import Post from "../Post/Post";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";
import User from "../User/User";
import { useAlert } from "react-alert";

const UserProfile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert();
  const { user, loading: userLoading ,error:userError } = useSelector(
    (state) => state.userProfile
  );
  const { user: me } = useSelector((state) => state.user);
  const { loading, error, posts } = useSelector((state) => state.userPosts);
  const {
    error: followError,
    message,
    loading: followLoading,
  } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(getUserDetails(params.id));
    dispatch(getUserPosts(params.id));
   
   
  }, [dispatch, params.id,]);

  useEffect(()=>{
    if (me._id === params.id) {
        setMyProfile(true);
      }
    if(user){
        user.followers.forEach((item)=>{
            if(item._id ===me._id){
                setFollowing(true)
            }
            else{
                setFollowing(false)
            }
        })
      }
  },[user,me._id,params.id])

  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);

  const followHandle =async () => {
    setFollowing(!following);
    await dispatch(followAndUnfollowUser(user._id))
    dispatch(getUserDetails(params.id));
  };

  //   //useEffect for alert
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (followError) {
      alert.error(followError);
      dispatch({ type: "clearErrors" });
    }
    if (userError) {
      alert.error(userError);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, error, message,userError, followError, dispatch]);

  return loading === true || userLoading === true ? (
    <Loader />
  ) : (
    <div className="account">
      <div className="accountleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
              isDelete={true}
              isAccount={true}
            />
          ))
        ) : (
          <Typography variant="h5">user have not made any Posts yet</Typography>
        )}
      </div>
      <div className="accountright">
        {user && (
          <>
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
            {myProfile ? null : (
              <Button variant="contained" style={{background:following?"green":"red"}} onClick={followHandle} disabled={followLoading}>
                {following ? "Follow" : "Unfollow"}
              </Button>
            )}
          </>
        )}

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

export default UserProfile;
