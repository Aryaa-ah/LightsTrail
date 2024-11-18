import express from "express";
import * as longitudeLatitudeContoller from "./../controllers/longitudeLatitude-contoller.js";

const longitudeLatitudeRouter = express.Router();

longitudeLatitudeRouter.route('/:city').get(longitudeLatitudeContoller.get);

export default longitudeLatitudeRouter;