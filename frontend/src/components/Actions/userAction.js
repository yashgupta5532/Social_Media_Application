import axios from "axios";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: "loginRequest",
    });
    const { data } = await axios.post(
      "/api/v1/user/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: "loginSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "loginFail",
      payload: error.response.data.message,
    });
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "logoutUserRequest",
    });
    await axios.get("/api/v1/user/logout");
    dispatch({
      type: "logoutUserSuccess",
    });
  } catch (error) {
    dispatch({
      type: "logoutUserFail",
      payload: error.response.data.message,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "loadUserRequest",
    });
    const { data } = await axios.get("/api/v1/user/me");
    dispatch({
      type: "loadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "loadUserFail",
      payload: error.response.data.message,
    });
  }
};

export const getFollowingPosts = () => async (dispatch) => {
  try {
    dispatch({
      type: "postOfFollowingRequest",
    });
    const { data } = await axios.get("/api/v1/post/posts");
    dispatch({
      type: "postOfFollowingSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "postOfFollowingFail",
      payload: error.response.data.message,
    });
  }
};

export const getAllUsers =
  (name = "") =>
  async (dispatch) => {
    try {
      dispatch({
        type: "allUsersRequest",
      });
      const { data } = await axios.get(`/api/v1/user/allUsers?name=${name}`);
      dispatch({
        type: "allUsersSuccess",
        payload: data.users,
      });
    } catch (error) {
      dispatch({
        type: "allUsersFail",
        payload: error.response.data.message,
      });
    }
  };

export const getMyPosts = () => async (dispatch) => {
  try {
    dispatch({
      type: "myPostsRequest",
    });

    const { data } = await axios.get("/api/v1/user/myposts");
    dispatch({
      type: "myPostsSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "myPostsFail",
      payload: error.response.data.message,
    });
  }
};

export const registerUser =
  (name, email, password, avatar) => async (dispatch) => {
    try {
      dispatch({
        type: "registerRequest",
      });
      const { data } = await axios.post(
        "/api/v1/user/register",
        { name, email, password, avatar },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({
        type: "registerSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "registerFail",
        payload: error.response.data.message,
      });
    }
  };

export const updateProfile = (name, email, avatar) => async (dispatch) => {
  try {
    dispatch({
      type: "updateProfileRequest",
    });
    const { data } = await axios.put(
      "/api/v1/user/update/profile",
      {
        name,
        email,
        avatar,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: "updateProfileSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "updateProfileFail",
      payload: error.response.data.message,
    });
  }
};

export const updatePassword =
  (oldPassword, newPassword) => async (dispatch) => {
    try {
      dispatch({
        type: "updatePasswordRequest",
      });
      const { data } = await axios.put(
        "/api/v1/user/password/update",
        { oldPassword, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({
        type: "updatePasswordSuccess",
        payload: data.message,
      });
    } catch (error) {
      dispatch({
        type: "updatePasswordFail",
        payload: error.response.data.message,
      });
    }
  };

export const deleteMyProfile = () => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProfileRequest",
    });
    const { data } = await axios.delete("/api/v1/user/delete/me");
    dispatch({
      type: "deleteProfileSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProfileFail",
      payload: error.response.data.message,
    });
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({
      type: "forgotPasswordRequest",
    });
    const { data } = await axios.post(
      "/api/v1/user/password/forgot",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: "forgotPasswordSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "forgotPasswordFail",
      payload: error.response.data.message,
    });
  }
};

export const resetPassword = (password, token) => async (dispatch) => {
  try {
    dispatch({
      type: "resetPasswordRequest",
    });
    const { data } = await axios.put(
      `/api/v1/user/password/reset/${token}`,
      { password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: "resetPasswordSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "resetPasswordFail",
      payload: error.response.data.message,
    });
  }
};

export const getUserPosts = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "userPostsRequest",
    });

    const { data } = await axios.get(`/api/v1/user/userposts/${id}`);
    dispatch({
      type: "userPostsSuccess",
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: "userPostsFail",
      payload: error.response.data.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "userProfileRequest",
    });

    const { data } = await axios.get(`/api/v1/user/${id}`);
    dispatch({
      type: "userProfileSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "userProfileFail",
      payload: error.response.data.message,
    });
  }
};

export const followAndUnfollowUser = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "followUserRequest",
    });
    const { data } = await axios.get(`/api/v1/user/follow/${id}`);
    dispatch({
      type: "followUserSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "followUserFail",
      payload: error.response.data.message,
    });
  }
};
