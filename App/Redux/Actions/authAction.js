import { LOGIN_USER, SET_LOCATION, PROFILES } from '../type';

export const loginUser = (userdata) => {
  console.log("userdata---->", userdata);
  return async (dispatch) => {
    if (userdata && userdata._id) {
      dispatch({
        type: LOGIN_USER,
        payload: userdata,
      });
    }
  };
};

export const userProfiles = (user) => {
  console.log("userdata111---->", user);
  return async (dispatch) => {
    dispatch({
      type: PROFILES,
      payload: user,
    });
  };
};


export const logoutUser = () => {

  return async (dispatch) => {
    dispatch({
      type: LOGIN_USER,
      payload: null,
    });
  };
};

export const setLocation = (location) => {
  return async (dispatch) => {
    dispatch({
      type: SET_LOCATION,
      payload: location,
    });
  };
};

export const setUserProfiles = (userProfile) => {
  return async (dispatch) => {
    dispatch({
      type: PROFILES,
      payload: userProfile,
    });
  };
};
