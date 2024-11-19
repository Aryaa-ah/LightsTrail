import express from "express";
import * as longitudeLatitudeController from "./../controllers/longitudeLatitude-contoller.js";

const longitudeLatitudeRouter = express.Router();

longitudeLatitudeRouter.route('/:city').get(longitudeLatitudeController.get);

export default longitudeLatitudeRouter;
