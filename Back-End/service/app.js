import mongoose from "mongoose";
import initializeRouter from "./routers/index.js";
import cors from "cors";
import express from "express";


const initialize = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded());
   // mongoose.connect(process.env.MONGO_CONNECTION);
    initializeRouter(app);
    


}
export default initialize;