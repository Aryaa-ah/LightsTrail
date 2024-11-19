import express from "express";
import * as longitudeLatitudeController from "./../controllers/longitudeLatitude-contoller.js";

const longitudeLatitudeRouter = express.Router();


longitudeLatitudeRouter.route('/').get((req, res) => {
    res.status(400).json({
        success: false,
        error: {
            message: "Please enter a city name",
            code: 400,
        },
    });
});


longitudeLatitudeRouter.route('/:city').get(longitudeLatitudeController.get);

export default longitudeLatitudeRouter;
