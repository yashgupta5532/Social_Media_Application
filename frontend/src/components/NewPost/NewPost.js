import React, { useEffect, useState } from "react";
import "./NewPost.css";
import { Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost } from "../Actions/postAction";
import { useAlert } from "react-alert";
import { loadUser } from "../Actions/userAction";

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const { loading, error, message } = useSelector((state) => state.like);
  const dispatch = useDispatch();
  const alert = useAlert();

  //handle image change function
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);
    Reader.onload = () => {
      if (Reader.readyState === 2) {   //0->initial state 1 ->process state 2 -> ready state
        setImage(Reader.result);
      }
    };
  };

  //handle submit form
  const handleForm = async(e) => {
    e.preventDefault();
    await dispatch(createNewPost(caption, image));
    dispatch(loadUser())
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      console.log(error)
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, alert, error, message]);

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={handleForm}>
        <Typography variant="h3">New Post</Typography>
        {image && <img src={image} alt="post" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Captions...."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;
