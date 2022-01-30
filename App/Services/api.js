import NetInfo from "@react-native-community/netinfo";
import {GOOGLE_KEY} from '../Utils/constants'
import axios from 'axios'
import Toast from 'react-native-root-toast';

export const FetchNearbyPlaces = (location, type, radius) => {
  return new Promise((resolve, reject) => {
    NetInfo.fetch().then(state => {
      if(state.isConnected) {
        axios({
          method: 'get',
          url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${type}&key=${GOOGLE_KEY}`,
          headers: {
           'Content-Type': 'application/json',
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          console.log(error);
          Toast.show('Something went wrong. Please try again !')
          reject(error)
        });
      } else {
        reject('No connection')
        Toast.show('Please check your internet connection !', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM
        })
      }
    });
  })
}