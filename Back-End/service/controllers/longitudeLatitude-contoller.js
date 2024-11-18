import * as longitudeLatitude from "./../services/longitudeLatitude-service.js";
import { setSuccess, setError } from "./response-handler.js";

export const get = async (request, response) => {
    console.log(request.params);
   //request
   try{
    
    const { city } = request.params;
    
    if (!city) {
        return setError({ message: 'City Name is required' }, response);
     }
    const longitudeLatitudeReturned = await longitudeLatitude.fetch({ city });
    
   
    // response.json(student);
    setSuccess(longitudeLatitudeReturned,response)
   }
   catch(error){
    setError(error, response);
   }
   
}