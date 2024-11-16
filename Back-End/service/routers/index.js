import auroraForecastRouter from "./auroraForecast-router.js";


const initializeRouter = (app) => {
    app.use("/auroraforecast",auroraForecastRouter);
    //app.use('/courseEnrollment',courseEnrollmentRouter);
}

export default initializeRouter;