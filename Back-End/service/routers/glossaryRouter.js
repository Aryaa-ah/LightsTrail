import express from "express";
const router = express.Router();
import { getGlossary } from "./../controllers/glossaryController.js";

router.get("/", getGlossary);

export default router;
