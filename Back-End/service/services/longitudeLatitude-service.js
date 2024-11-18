import longitudeLatitudeModel from "./../models/longitudeLatitude.js";
import axios from 'axios';

export const fetch = async (cityName) => {
    const { city } = cityName;

    // Validate input
    if (!city) {
        throw new Error("Enter City Name");
    }

    try {
        // API call with await
        const apiUrl = `https://geocode.xyz/${city}?json=1`;
        const response = await axios.get(apiUrl);

        //console.log(response);
        //Create longitudeLatitudeModel object
        const longiLatitude = new longitudeLatitudeModel({
            longitude: response.data.longt,
            latitude: response.data.latt
        });
        const longitudeLatitudeObject = longiLatitude.toObject();
        delete longitudeLatitudeObject._id;
        return longitudeLatitudeObject; 
    } catch (error) {
        
        throw error; 
    }

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);// showError
      } else {
      //   document.getElementById('location').innerText = "Geolocation is not supported by this browser.";
      console.log("GeoLocation is not supported by the user");
      }
    }
    
    function showPosition(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      // document.getElementById('location').innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;
      console.log(latitude+" "+longitude);
    }
    
      function showError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            document.getElementById('location').innerText = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            document.getElementById('location').innerText = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            document.getElementById('location').innerText = "The request to get user location timed out.";
            break;
          case error.UNKNOWN_ERROR:
            document.getElementById('location').innerText = "An unknown error occurred.";
            break;
        }
      }
    
};
