import { Router } from "express";
import { getAllUsers } from "../api/user/index.js";
import { protect, authorize } from "../middlewares/index.js";
import { ROLES } from "../constants/index.js";

const router = Router();

// GET /api/v1/users — super_admin / admin: paginated user list
router.get("/", protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), getAllUsers);

export default router;
