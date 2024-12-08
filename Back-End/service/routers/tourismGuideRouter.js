import express from "express";
import { sendBookingEmail } from "./../controllers/tourismGuideController.js";

const tourismRouter = express.Router();

// POST route to send email
tourismRouter.post("/send", sendBookingEmail);

export default tourismRouter;
