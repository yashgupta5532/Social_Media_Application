import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import './UpdatePassword.css'
import { updatePassword } from '../Actions/userAction';
import { useAlert } from 'react-alert';

const UpdatePassword = () => {
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const dispatch =useDispatch()
    const alert=useAlert();
    const {loading,error,message } =useSelector(state=>state.like)

    useEffect(()=>{
        if(error){
            alert.error(error)
            dispatch({type:"clearErrors"})
        }
        if(message){
            alert.success(message);
            dispatch({type:"clearMessage"})
        }
    },[error,alert,message])
    const handleForm =(e)=>{
       e.preventDefault();
       dispatch(updatePassword(oldPassword,newPassword))
    }

  return (
    <div className='updatePassword'>
        <form onSubmit={handleForm} className="updatePasswordForm">
            <Typography variant='h5' style={{padding:"2vmax"}}>Update password</Typography>
            <input type="text" required value={oldPassword} placeholder='oldPassword' className='updatePasswordInputs' onChange={(e)=>setOldPassword(e.target.value)}/>
            <input type="text" required value={newPassword} placeholder='newPassword' className='updatePasswordInputs' onChange={(e)=>setNewPassword(e.target.value)}/>
            <Button type='submit' disabled={loading}>
                change
            </Button>
        </form>
    </div>
  )
}

export default UpdatePassword