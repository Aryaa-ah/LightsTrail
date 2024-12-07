import auroraForecastRouter from "./auroraForecast-router.js";
import longitudeLatitudeRouter from "./longitudeLatitude-router.js";
//import registrationRouter from './registration-router.js';
import authRouter from "./auth-router.js";
import galleryRouter from "./galleryRouter.js";
import { setError } from "../controllers/response-handler.js";
// import auroraPredictionRouter from "./auroraPredictionRouter.js";

import alertRouter from './alertRouter.js';

const initializeRouter = (app) => {
  // app.use("/api/predictions", auroraPredictionRouter); // Mount under /api/predictions
  app.use("/auroraforecast", auroraForecastRouter);
  app.use("/longitudeLatitude", longitudeLatitudeRouter);
  app.use("/api/gallery", galleryRouter);
  app.use("/auth", authRouter);
 
 
  app.use('/api/alerts', alertRouter);

  app.use((req, res) => {
    console.log("Route not found:", req.path);
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });
};
export default initializeRouter;
