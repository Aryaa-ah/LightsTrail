import auroraForecastRouter from "./auroraForecast-router.js";
import longitudeLatitudeRouter from "./longitudeLatitude-router.js";

const initializeRouter = (app) => {
    app.use("/auroraforecast",auroraForecastRouter);
    //app.use('/courseEnrollment',courseEnrollmentRouter);
    app.use("/longitudeLatitude",longitudeLatitudeRouter);
}

export default initializeRouter;