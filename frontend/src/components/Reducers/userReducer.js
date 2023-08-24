import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticatedUser: false,
};

export const userReducer = createReducer(initialState, {
  loginRequest: (state) => {
    state.loading = true;
  },
  loginSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.isAuthenticatedUser = true;
  },
  loginFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticatedUser = false;
  },

  registerRequest: (state) => {
    state.loading = true;
  },

  registerSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.isAuthenticatedUser = true;
  },
  registerFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticatedUser = false;
  },

  loadUserRequest: (state) => {
    state.loading = true;
  },
  loadUserSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.isAuthenticatedUser = true;
  },
  loadUserFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticatedUser = false;
  },
  logoutUserRequest: (state) => {
    state.loading = true;
  },
  logoutUserSuccess: (state) => {
    state.loading = false;
    state.user = null;
    state.isAuthenticatedUser = false;
  },
  logoutUserFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticatedUser = true;
  },
  clearErrors: (state) => {
    state.error = null;
  },
  clearMessages: (state) => {
    state.message = null;
  },
});

export const postOfFollowingReducer = createReducer(initialState, {
  postOfFollowingRequest: (state, action) => {
    state.loading = true;
  },
  postOfFollowingSuccess: (state, action) => {
    state.loading = false;
    state.posts = action.payload;
  },
  postOfFollowingFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
  clearMessages: (state) => {
    state.message = null;
  },
});

export const allUsersReducer = createReducer(initialState, {
  allUsersRequest: (state, action) => {
    state.loading = true;
  },
  allUsersSuccess: (state, action) => {
    state.loading = false;
    state.users = action.payload;
  },
  allUsersFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});

export const getUserDetailsReducer = createReducer(initialState, {
  userProfileRequest: (state) => {
    state.loading = true;
  },
  userProfileSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
  },
  userProfileFail: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});
