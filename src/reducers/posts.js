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
} from "../actions/types.js";

const initialState = {
  isLoading: false,
  isLoadingComments: false,
  isLoadingLikes: false,
  myPosts: {},
  myComments: {},
  myLikes: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case POSTS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case POSTS_LOADED:
      return {
        ...state,
        isLoading: false,
        myPosts: action.payload
      };
    case POSTS_FAIL:
      return {
        ...state,
        isLoading: false,
        myPosts: {}
      };
    case COMMENTS_LOADING:
      return {
        ...state,
        isLoadingComments: true
      };
    case COMMENTS_LOADED:
      const myComments = { ...state.myComments };
      myComments[action.payload.postId] = action.payload.comments;
      return {
        ...state,
        isLoadingComments: false,
        myComments
      };
    case COMMENTS_FAIL:
      return {
        ...state,
        isLoadingComments: false
      };
    case LIKES_LOADING:
      return {
        ...state,
        isLoadingLikes: true
      };
    case LIKES_LOADED:
      const myLikes = { ...state.myLikes };
      myLikes[action.payload.postId] = action.payload.likes;
      return {
        ...state,
        isLoadingLikes: false,
        myLikes
      };
    case LIKES_FAIL:
      return {
        ...state,
        isLoadingLikes: false
      };
    case UNLIKE_FAIL:
    case LIKE_SUCCESS:
    case LIKE_FAIL:
    case CREATE_POST_SUCCESS:
    case CREATE_POST_FAIL:
    case DELETE_POST_FAIL:
    case CREATE_COMMENT_SUCCESS:
    case CREATE_COMMENT_FAIL:
    default:
      return state;
  }
}
