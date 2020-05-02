import axios from "axios";
import blake from "blakejs";

import { returnErrors, createMessage } from "./messages";
import { tokenConfig } from "./user";
import {
  POSTS_LOADING,
  POSTS_LOADED,
  POSTS_FAIL,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAIL,
  DELETE_POST_FAIL,
  COMMENTS_LOADING,
  COMMENTS_LOADED,
  COMMENTS_FAIL,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAIL,
  LIKES_LOADING,
  LIKES_LOADED,
  LIKES_FAIL,
  LIKE_SUCCESS,
  LIKE_FAIL,
  UNLIKE_FAIL
} from "./types";

//CREATE A POST
export const createPost = post => (dispatch, getState) => {
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .post("/app/posts/", post, config)
    .then(res => {
      dispatch(createMessage({ successMessage: "Post successfully created" }));
      dispatch({
        type: CREATE_POST_SUCCESS
      });
      dispatch(getMyPosts());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: CREATE_POST_FAIL
      });
    });
};

//GET MY POSTS
export const getMyPosts = () => (dispatch, getState) => {
  dispatch({ type: POSTS_LOADING });
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .get("/app/posts/", config)
    .then(async res => {
      const result = res.data.reduce((map, obj) => {
        map[obj.postId] = obj;
        return map;
      }, {});
      const transactions = await getTransactionsOfMyPosts(result, getState);
      if (transactions) {
        const invalid_posts = [];
        for (const postKey in result) {
          const tx = transactions.find(t => t.post_id === Number(postKey));
          if (tx) {
            //    calculate hash from data of post
            const hash = blake.blake2sHex(tx.iroha_description);
            //    compare
            if (hash !== tx.description) {
              invalid_posts.push(postKey);
            }
          } else {
            console.log("Error: cannot find transaction of this post");
          }
        }
        console.log("invalid posts ", invalid_posts);
        if (invalid_posts.length > 0) {
          dispatch(returnErrors("You have Invalid Posts", 409));
          dispatch({
            type: POSTS_FAIL
          });
        }

        dispatch({
          type: POSTS_LOADED,
          payload: result
        });
      } else {
        console.log("Did not get transactions");
        // dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: POSTS_FAIL
        });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: POSTS_FAIL
      });
    });
};

export const getUsernamesOfMyPosts = myPosts => {
  let usernames = [];
  for (const postKey in myPosts) {
    if (!usernames.includes(myPosts[postKey].person.username)) {
      usernames.push(myPosts[postKey].person.username);
    }
    if (
      myPosts[postKey].circle_of_trust &&
      !usernames.includes(myPosts[postKey].circle_of_trust.username)
    ) {
      usernames.push(myPosts[postKey].circle_of_trust.username);
    }
    if (
      myPosts[postKey].care_team &&
      !usernames.includes(myPosts[postKey].care_team.username)
    ) {
      usernames.push(myPosts[postKey].care_team.username);
    }
  }
  return usernames;
};

const getTransactionsOfMyPosts = (myPosts, getState) => {
  const usernames = getUsernamesOfMyPosts(myPosts);
  const transactions = [];
  return axios
    .all(
      usernames.map(acc =>
        axios.post(
          `/iroha/get_acc_tx/`,
          { account_id: acc },
          tokenConfig(getState)
        )
      )
    )
    .then(res => {
      // get Transactions successfully
      const dataArray = res.map(r => r.data);
      dataArray.forEach(data => {
        transactions.push(...data);
      });
      return transactions;
    })
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      console.log("Cannot get Transactions of Posts");
      return null;
    });
};

// DELETE A POST
export const deletePost = postId => (dispatch, getState) => {
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .delete(`/app/posts/${postId}/`, config)
    .then(res => {
      dispatch(
        createMessage({
          successMessage: "Post successfully deleted"
        })
      );
      dispatch(getMyPosts());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: DELETE_POST_FAIL
      });
    });
};

// EDIT THE POST
export const editPost = (postId, newPost) => (dispatch, getState) => {
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .put(`/app/posts/${postId}/`, newPost, config)
    .then(res => {
      dispatch(
        createMessage({
          successMessage: "Post successfully edited"
        })
      );
      dispatch(getMyPosts());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// CREATE A COMMENT
export const createComment = (comment, postId) => (dispatch, getState) => {
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .post(`/app/posts/${postId}/comments/`, comment, config)
    .then(res => {
      // dispatch(
      //   createMessage({ successMessage: "Comment successfully created" })
      // );
      dispatch({
        type: CREATE_COMMENT_SUCCESS
      });
      dispatch(getComments(postId));
    })
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      console.log("Cannot create comment");
      dispatch({
        type: CREATE_COMMENT_FAIL
      });
    });
};

// GET COMMENTS OF A POST
export const getComments = postId => (dispatch, getState) => {
  dispatch({ type: COMMENTS_LOADING });
  axios
    .get(`/app/posts/${postId}/comments/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: COMMENTS_LOADED,
        payload: {
          postId,
          comments: res.data
        }
      });
    })
    .catch(err => {
      console.log("Cannot get comments");
      // dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: COMMENTS_FAIL
      });
    });
};

// EDIT MY COMMENT
export const editComment = (postId, commentId, newComment) => (
  dispatch,
  getState
) => {
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .put(`/app/posts/${postId}/comments/${commentId}/`, newComment, config)
    .then(res => {
      // dispatch(
      //   createMessage({
      //     successMessage: "Comment successfully edited"
      //   })
      // );
      dispatch(getComments(postId));
    })
    .catch(err => {
      console.log("Cannot edit comment");
      // dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// DELETE A COMMENT
export const deleteComment = (postId, commentId) => (dispatch, getState) => {
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .delete(`/app/posts/${postId}/comments/${commentId}/`, config)
    .then(res => {
      // dispatch(
      //   createMessage({
      //     successMessage: "Comment successfully deleted"
      //   })
      // );
      dispatch(getComments(postId));
    })
    .catch(err => {
      console.log("Cannot delete comment");
      // dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: DELETE_POST_FAIL
      });
    });
};

// GET LIKES OF A POST
export const getLikes = postId => (dispatch, getState) => {
  dispatch({ type: LIKES_LOADING });
  axios
    .get(`/app/post/${postId}/likes/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LIKES_LOADED,
        payload: {
          postId,
          likes: res.data
        }
      });
    })
    .catch(err => {
      console.log("Cannot get likes");
      // dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LIKES_FAIL
      });
    });
};

// LIKE A POST
export const likePost = postId => (dispatch, getState) => {
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);

  axios
    .post(`/app/post/${postId}/likes/`, {}, config)
    .then(res => {
      // dispatch(createMessage({ successMessage: "Like successfully created" }));
      dispatch({
        type: LIKE_SUCCESS
      });
      dispatch(getLikes(postId));
    })
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      console.log("Cannot like");
      dispatch({
        type: LIKE_FAIL
      });
    });
};

// UNLIKE A POST
export const unlikePost = postId => (dispatch, getState) => {
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .delete(`/app/post/${postId}/user/remove/like/`, config)
    .then(res => {
      // dispatch(createMessage({ successMessage: "Like successfully deleted" }));
      dispatch(getLikes(postId));
    })
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      console.log("Cannot unlike");
      dispatch({
        type: UNLIKE_FAIL
      });
    });
};
