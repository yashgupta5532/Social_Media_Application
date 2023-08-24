import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./components/Actions/userAction";
import Home from "./components/Home/Home";
import Account from "./components/Account/Account";
import NewPost from "./components/NewPost/NewPost";
import Register from "./components/Register/Register";
import UpdateProfile from "./components/updateProfile/UpdateProfile";
import UpdatePassword from "./components/updatePassword/UpdatePassword";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import UserProfile from "./components/userProfile/UserProfile";
import Search from "./components/Search/Search";
import NotFound from "./components/NotFound/NotFound";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const { isAuthenticatedUser } = useSelector((state) => state.user);
  return (
    <Router>
      {isAuthenticatedUser && <Header />}
      <Routes>
        <Route path="/" element={isAuthenticatedUser ? <Home /> : <Login />} />
        <Route path="/account" element={isAuthenticatedUser ? <Account /> : <Login />} />
        <Route path="/newpost" element={isAuthenticatedUser?<NewPost/>:<Login/>}/>
        <Route path="/register" element={isAuthenticatedUser?<Account/>:<Register/>}/>
        <Route path="/update/profile" element={isAuthenticatedUser?<UpdateProfile/>:<Register/>}/>
        <Route path="/password/update" element={isAuthenticatedUser?<UpdatePassword/>:<Register/>}/>
        <Route path="/password/forgot" element={isAuthenticatedUser?<UpdatePassword/>:<ForgotPassword/>}/>
        <Route path="/password/reset/:token" element={isAuthenticatedUser?<UpdatePassword/>:<ResetPassword/>}/>
        <Route path="/:id" element={isAuthenticatedUser?<UserProfile/>:<Login/>}/>
        <Route path="/search" element={isAuthenticatedUser?<Search/>:<Login/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  );
}

export default App;
