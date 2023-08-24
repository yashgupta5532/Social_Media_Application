import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../Actions/userAction";
import { useAlert } from "react-alert";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, message } = useSelector((state) => state.like);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [error, alert, message, dispatch]);

  const handleForm = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="updatePassword">
      <form onSubmit={handleForm} className="updatePasswordForm">
        <Typography variant="h5" style={{ padding: "2vmax" }}>
          Forgot password
        </Typography>
        <input
          type="email"
          required
          value={email}
          placeholder="Email"
          className="updatePasswordInputs"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          Send Token
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
