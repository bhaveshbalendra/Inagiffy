/**
 * API routes for learning map endpoints
 */
import { Router } from "express";
import { generateMap, getMapById } from "../controllers/mapController";

const router = Router();

/**
 * POST /api/map/generate
 * Generate a new learning map
 */
router.post("/generate", generateMap);

/**
 * GET /api/map/:id
 * Get a saved learning map by ID
 */
router.get("/:id", getMapById);

export default router;
