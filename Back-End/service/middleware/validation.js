// service/middleware/validation.js
import { body, param, query } from "express-validator";

export const validateCreatePhoto = [
  body("userName").notEmpty().trim().isLength({ min: 2, max: 50 }),
  body("location").notEmpty().trim(),
];

export const validateUpdatePhoto = [
  param("photoId").isMongoId(),
  body("location").optional().trim(),
];
