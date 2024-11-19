import express from "express";
import * as longitudeLatitudeController from "./../controllers/longitudeLatitude-contoller.js";

const longitudeLatitudeRouter = express.Router();

// Route to handle requests without a city parameter
longitudeLatitudeRouter.get("/", (req, res) => {
    res.status(400).json({
        success: false,
        error: "City Name is required. Please provide a city",
    });
});

// Route to fetch longitude and latitude for a given city
longitudeLatitudeRouter.get("/:city", longitudeLatitudeController.get);

export default longitudeLatitudeRouter;
