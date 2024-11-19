import * as auroraForecast from "./../services/auroraForecast-service.js";
import { setSuccess, setError } from "./response-handler.js";

export const get = async (request, response) => {
   // console.log(request);
   try{
    
    const { longitude, latitude } = request.query;
    
    if (!latitude || !longitude) {
        return setError({ message: 'Latitude and Longitude are required' }, response);
     }
    const forecastReturned = await auroraForecast.call({ longitude, latitude });
    
   
    // response.json(student);
    setSuccess(forecastReturned,response)
   }
   catch(error){
    setError(error, response, 500);
   }
   
}