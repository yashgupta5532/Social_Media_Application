import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import './ResetPassword.css'
import { resetPassword } from "../Actions/userAction";
import {Link,useParams} from 'react-router-dom'

const ResetPassword = () => {

    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const params =useParams()
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
      dispatch(resetPassword(password,params.token));
    };
  return (
    <div className="resetPassword">
    <form onSubmit={handleForm} className="resetPasswordForm">
      <Typography variant="h5" style={{ padding: "2vmax" }}>
        Reset Password
      </Typography>
      <input
        type="password"
        required
        value={password}
        placeholder="New-password"
        className="resetPasswordInputs"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Link to='/'>
        <Typography>Login</Typography>
      </Link>
      <Typography>OR</Typography>
      <Link to='/password/forgot'>
        <Typography>Request another token</Typography>
      </Link>
      <Button type="submit" disabled={loading}>
        Reset Password
      </Button>
    </form>
  </div>
  )
}

export default ResetPassword