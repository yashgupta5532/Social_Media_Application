import { Typography,Button } from "@mui/material";
import React, { useState } from "react";
import "./Search.css";
import { useDispatch, useSelector } from "react-redux";
import User from "../User/User";
import { getAllUsers } from "../Actions/userAction";

const Search = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.allUsers);
  const handleForm = (e) => {
    e.preventDefault();
    dispatch(getAllUsers(name));
  };
  return (
    <div className="search">
      <form onSubmit={handleForm} className="searchForm">
        <Typography variant="h5" style={{ padding: "2vmax" }}>
          {" "}
          Search{" "}
        </Typography>
        <input
          type="text"
          required
          value={name}
          placeholder="userName"
          className="searchInputs"
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          Search
        </Button>
        <div className="searchResults">
          {users &&
            users.map((user) => (
              <User
                key={user._id}
                userId={user._id}
                name={user.name}
                avatar={user.avatar.url}
              />
            ))}
        </div>
      </form>
    </div>
  );
};

export default Search;
