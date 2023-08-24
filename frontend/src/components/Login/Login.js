import React, { useEffect, useState } from "react";
import "./login.css";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Actions/userAction";
import { useAlert } from "react-alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const { message } = useSelector((state) => state.like);
  const alert = useAlert();
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({
        type: "clearErrors",
      });
    }
    if (message) {
      alert.success(message);
      dispatch({
        type: "clearMessages",
      });
    }
  }, [error, alert, message]);

  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
  };
  return (
    <div className="login">
      <form className="loginForm" onSubmit={loginHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          social App
        </Typography>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link to="/password/forgot">
          <Typography>Forgot password</Typography>
        </Link>
        <Link to="/register">
          <Typography>New User</Typography>
        </Link>
        <Button type="submit" disabled={loading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
