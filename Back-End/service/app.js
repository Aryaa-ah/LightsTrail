import mongoose from "mongoose";
import initializeRouter from "./routers/index.js";
import cors from "cors";
import express from "express";

const initialize = (app) => {
   
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded());
    // mongoose.connect(process.env.MONGO_CONNECTION);
    // app.use(express.json()); 
    // app.use(express.urlencoded({ extended: true })); 

    mongoose
        .connect(process.env.MONGO_CONNECTION)
        .then(() => console.log('Connected to MongoDB'))
        .catch((error) => {
            console.error('MongoDB connection error:', error);
            process.exit(1); 
        });

    initializeRouter(app);
};


export default initialize;

