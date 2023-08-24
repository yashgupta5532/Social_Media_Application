import axios from "axios";

export const likePost = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "likeRequest",
    });
    const { data } = await axios.post(`/api/v1/post/${id}`);
    dispatch({
      type: "likeSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "likeFail",
      payload: error.response.data.message,
    });
  }
};

export const addCommentOnPost = (id, comment) => async (dispatch) => {
  try {
    dispatch({
      type: "addCommentRequest",
    });
    const { data } = await axios.put(
      `/api/v1/post/comment/${id}`,
      { comment },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: "addCommentSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "addCommentFail",
      payload: error.response.data.message,
    });
  }
};

export const deleteCommentOnPost = (id, commentId) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteCommentRequest",
    });
    const { data } = await axios.delete(`/api/v1/post/comment/${id}`, {
      data: {commentId},
    });
    dispatch({
      type: "deleteCommentSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteCommentFail",
      payload: error.response.data.message,
    });
  }
};

export const createNewPost = (captions, image) => async (dispatch) => {
  try {
    dispatch({
      type: "newPostRequest",  //we have to same parameter name as in backend function have
    });
    const { data } = await axios.post(
      "/api/v1/post/upload",
      {
        captions,
        image,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: "newPostSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "newPostFail",
      payload: error.response.data.message,
    });
  }
};

export const updateCaption =(captions,id) =>async(dispatch) =>{
    try {
      dispatch({
        type:"updateCaptionRequest"
      })
    
      const {data} =await axios.put(`/api/v1/post/${id}`,{captions},
      {
        headers:{
          "Content-Type":"application/json"
        }
      });
    
      dispatch({
        type:"updateCaptionSuccess",
        payload:data.message
      })
    } catch (error) {
      dispatch({
        type:"updateCaptionFail",
        payload:error.response.data.message
      })
    }
}

export const deletePost =(id) =>async(dispatch) => {
   try {
    dispatch({
      type:"deletePostRequest"
    })
    const {data} =await axios.delete(`/api/v1/post/${id}`)
    dispatch({
      type:"deletePostSuceess",
      payload:data.message
    })
   } catch (error) {
    dispatch({
      type:"deletePostFail",
      payload:error.response.data.message
    })
   }

}