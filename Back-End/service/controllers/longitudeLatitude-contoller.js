import * as longitudeLatitude from "./../services/longitudeLatitude-service.js";
import { setSuccess, setError } from "./response-handler.js";

export const get = async (request, response) => {
   try{
    
    const { city } = request.params;
    
    if (!city) {
        return setError({ message: 'City Name is required' }, response);
     }
    const longitudeLatitudeReturned = await longitudeLatitude.fetch({ city });

    if(Object.keys(longitudeLatitudeReturned).length !== 0){
        setSuccess(longitudeLatitudeReturned,response);
    }
    else{
        setError({ message: 'City Name not found' },response);
    }
        
   }
   catch(error){
    setError(error, response);
   }
   
}