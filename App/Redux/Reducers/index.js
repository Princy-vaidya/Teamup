import { combineReducers } from 'redux' 
import authReducer from './authReducer'
import locationReducer from './locationReducer'
import profileReducer from "./userProfile"

export default combineReducers({
    userdata: authReducer,
    location: locationReducer,
    profiledata: profileReducer
})