import { Avatar, Button, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Register.css";
import { registerUser } from "../Actions/userAction";
import { useAlert } from "react-alert";

const Register = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error} = useSelector((state) => state.user);

  //handle registration form
  const handleRegisterForm = (e) => {
    e.preventDefault();
    dispatch(registerUser(name, email, password, avatar));
  };

  //handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatar(Reader.result);
      }
    };
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({
        type: "clearErrors",
      });
    }
  }, [dispatch, alert, error]);

  return (
    <div className="register">
      <form className="registerForm" onSubmit={handleRegisterForm}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Register here...
        </Typography>
        <Avatar
          src={avatar}
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
          className="registerInputs"
          placeholder="Enter your name "
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          value={email}
          className="registerInputs"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          className="registerInputs"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Link to="/">Already signed up ? Login now</Link>
        <Button disabled={loading} type="submit">
          Sign up
        </Button>
      </form>
    </div>
  );
};

export default Register;
