import React, { useEffect, useState } from "react";
import "./updateProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {Avatar, Button, Typography} from '@mui/material'
import { loadUser, updateProfile } from "../Actions/userAction";


const UpdateProfile = () => {
  const { loading, error, user } = useSelector((state) => state.user);
  const {loading:updateLoading,error:updateError,message} =useSelector(state=>state.like)
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState("");
  const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);

  const dispatch = useDispatch();
  const alert = useAlert();

  //handle registration form
  const handleUpdateProfileForm = async(e) => {
    e.preventDefault();
    await dispatch(updateProfile(name,email,avatar))
    dispatch(loadUser())
  };
  useEffect(()=>{
    if(error){
        alert.error(error)
        dispatch({type:"clearErrors"})
    }
    if(updateError){
        alert.error(updateError)
        dispatch({type:"clearErrors"})
    }
    if(message){
        alert.success(message)
        dispatch({type:"clearMessages"})
    }
  },[dispatch,error,alert,updateError,message])
  //handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatarPrev(Reader.result)
        setAvatar(Reader.result);
      }
    };
  };

  return (
    <div className="updateProfile">
      <form className="updateProfileForm" onSubmit={handleUpdateProfileForm}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Update Profile...
        </Typography>
        <Avatar
          src={user.avatar.url}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />
        <input
          type="file"
          accept="image/*"
          required
          onChange={handleAvatarChange}
        />
        <input
          type="text"
          value={name}
          className="updateProfileInputs"
          placeholder="Enter your name "
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          value={email}
          className="updateProfileInputs"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button disabled={updateLoading} type="submit" > 
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
