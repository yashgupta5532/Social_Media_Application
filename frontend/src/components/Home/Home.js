import React, { useEffect } from "react";
import "./Home.css";
import User from "../User/User";
import Post from "../Post/Post";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getFollowingPosts } from "../Actions/userAction";
import Loader from "../Loader/Loader";
import { Typography } from "@mui/material";
import { useAlert } from "react-alert";

const Home = () => {
  const dispatch = useDispatch();
  const alert=useAlert();
  const {error:likeError,message} =useSelector((state)=>state.like)

  //taking from redux store 
  const { loading, posts, error } = useSelector(
    (state) => state.postOfFollowing
  );

  const {users,loading:usersLoading} =useSelector((state)=>state.allUsers)
  useEffect(() => { //Action methods
    dispatch(getFollowingPosts());
    dispatch(getAllUsers())
  }, [dispatch]);

  //useEffect for alert 
  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch({type:"clearErrors"})
    }
    if(likeError){
      alert.error(likeError);
      dispatch({type:"clearErrors"})
    }
    if(message) {
      alert.success(message)
      dispatch({type:"clearMessage"})
    }
  }, [alert ,error,message,likeError,dispatch])

  return loading ===true || usersLoading ===true? (
    <Loader />
  ) : (
    <div className="home">
      <div className="homeleft">
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
              isDelete={false}
              isAccount ={false}
            />
          ))
        ) : (
          <Typography variant="h5">No Posts yet</Typography>
        )}
      </div>
      <div className="homeright">
      {
        users && users.length>0?(users.map((user)=>(
        <User
          key={user._id}
          userId={user._id}
          name={user.name}
          avatar={user.avatar.url}
        />
        ))):(<Typography>No users Yet</Typography>)
      }
        </div>
    </div>
  );
};

export default Home;
