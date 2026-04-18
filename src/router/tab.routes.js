import { Router } from "express";
import { getMyTabs, getAllTabs, updateTab } from "../api/tab/index.js";
import { protect, authorize } from "../middlewares/index.js";
import { ROLES } from "../constants/index.js";

const router = Router();

// GET /api/v1/tabs/me — any authenticated user: get their own accessible tabs
// Used for refreshing tab state (e.g. after admin changes access)
router.get("/me", protect, getMyTabs);

// GET /api/v1/tabs — admin only: view all tabs with optional filters
router.get("/",  protect, authorize(ROLES.ADMIN), getAllTabs);

// PUT /api/v1/tabs/:id — admin only: update tab metadata / roles / isActive
router.put("/:id", protect, authorize(ROLES.ADMIN), updateTab);

export default router;
