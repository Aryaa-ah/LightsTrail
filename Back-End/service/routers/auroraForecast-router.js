import express from "express";
import * as auroraForecastController from "./../controllers/auroraForecast-controller.js";

const router = express.Router();

router.route('/').get(auroraForecastController.get);

export default router;