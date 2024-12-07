// service/routers/auroraPredictionRouter.js
import express from "express";
import * as auroraPredictionController from "../controllers/auroraPredictionController.js";
import { authenticateToken } from "../middleware/auth.js";
import axios from "axios";

const router = express.Router();

// GET aurora predictions
router.get(
  "/best-locations",
  authenticateToken,
  auroraPredictionController.getPredictions
);

router.get("/historical/:location", authenticateToken, (req, res) => {
  res.status(501).json({
    success: false,
    message: "Historical data feature not yet implemented",
  });
});

export default router;
