import auroraForecastRouter from "./auroraForecast-router.js";
import longitudeLatitudeRouter from "./longitudeLatitude-router.js";
//import registrationRouter from './registration-router.js';



import authRouter from './auth-router.js';


const initializeRouter = (app) => {
    app.use("/auroraforecast",auroraForecastRouter);
    //app.use('/courseEnrollment',courseEnrollmentRouter);
    app.use("/longitudeLatitude",longitudeLatitudeRouter);
    app.use('/auth', authRouter);                               // User signup and login
}


export default initializeRouter;
