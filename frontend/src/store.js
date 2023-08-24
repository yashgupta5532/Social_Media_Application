import { configureStore } from "@reduxjs/toolkit";
import {allUsersReducer, getUserDetailsReducer, postOfFollowingReducer, userReducer} from './components/Reducers/userReducer'
import { likeReducer, myPostsReducer, userPostsReducer } from "./components/Reducers/postReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    postOfFollowing:postOfFollowingReducer,
    allUsers:allUsersReducer,
    like:likeReducer,
    myPosts:myPostsReducer,
    userProfile:getUserDetailsReducer,
    userPosts:userPostsReducer,
  },
});

export default store;
